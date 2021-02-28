(function() {
    var ALPHABET, ALPHABET_MAP, Base58, i;
  
    Base58 = (typeof module !== "undefined" && module !== null ? module.exports : void 0) || (window.Base58 = {});
  
    ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  
    ALPHABET_MAP = {};
  
    i = 0;
  
    while (i < ALPHABET.length) {
      ALPHABET_MAP[ALPHABET.charAt(i)] = i;
      i++;
    }
  
    Base58.encode = function(buffer) {
      var carry, digits, j;
      if (buffer.length === 0) {
        return "";
      }
      i = void 0;
      j = void 0;
      digits = [0];
      i = 0;
      while (i < buffer.length) {
        j = 0;
        while (j < digits.length) {
          digits[j] <<= 8;
          j++;
        }
        digits[0] += buffer[i];
        carry = 0;
        j = 0;
        while (j < digits.length) {
          digits[j] += carry;
          carry = (digits[j] / 58) | 0;
          digits[j] %= 58;
          ++j;
        }
        while (carry) {
          digits.push(carry % 58);
          carry = (carry / 58) | 0;
        }
        i++;
      }
      i = 0;
      while (buffer[i] === 0 && i < buffer.length - 1) {
        digits.push(0);
        i++;
      }
      return digits.reverse().map(function(digit) {
        return ALPHABET[digit];
      }).join("");
    };
  
    Base58.decode = function(string) {
      var bytes, c, carry, j;
      if (string.length === 0) {
        return new (typeof Uint8Array !== "undefined" && Uint8Array !== null ? Uint8Array : Buffer)(0);
      }
      i = void 0;
      j = void 0;
      bytes = [0];
      i = 0;
      while (i < string.length) {
        c = string[i];
        if (!(c in ALPHABET_MAP)) {
          throw "Base58.decode received unacceptable input. Character '" + c + "' is not in the Base58 alphabet.";
        }
        j = 0;
        while (j < bytes.length) {
          bytes[j] *= 58;
          j++;
        }
        bytes[0] += ALPHABET_MAP[c];
        carry = 0;
        j = 0;
        while (j < bytes.length) {
          bytes[j] += carry;
          carry = bytes[j] >> 8;
          bytes[j] &= 0xff;
          ++j;
        }
        while (carry) {
          bytes.push(carry & 0xff);
          carry >>= 8;
        }
        i++;
      }
      i = 0;
      while (string[i] === "1" && i < string.length - 1) {
        bytes.push(0);
        i++;
      }
      return new (typeof Uint8Array !== "undefined" && Uint8Array !== null ? Uint8Array : Buffer)(bytes.reverse());
    };
  
  }).call(this);


const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');


function concatTypedArrays(a, b) { // a, b TypedArray of same type
    var c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
}

function sliceTypedArrays(a, offset, len) { // a, TypedArray, from offset with len
    return a.slice(offset, offset + len);
}

function checksum(data) {
    var hash1 = sha256(data);
    var hash2 = sha256(fromHexString(hash1));
    var buff = hash2.substring(0, 8);
    return buff;
}

function lyraEncPvt(hex) {
    return lyraEnc(hex);
}

function lyraEncPub(hex) {
    var result = lyraEnc(hex.substring(2));
    var tag = "L";
    return tag.concat(result);
}

function lyraEnc(hex) {
    var buff = fromHexString(hex);
    var crc = checksum(buff);
    var crcBuff = fromHexString(crc);
    var buff2 = concatTypedArrays(buff, crcBuff);
    return Base58.encode(buff2);
}

function lyraDec(pvtKey) {
    var buff = Base58.decode(pvtKey);
    var data = sliceTypedArrays(buff, 0, buff.byteLength - 4);
    var checkbytes = sliceTypedArrays(buff, buff.byteLength - 4, 4);
    var check = toHexString(checkbytes);

    var check2 = checksum(data);
    if(0 == check.localeCompare(check2))
        return toHexString(data);
    else
        return undefined;
}

function lyraGenWallet() {
    var ec = new KJUR.crypto.ECDSA({"curve": "secp256r1"});
    var keypair = ec.generateKeyPairHex();  
    return keypair.ecprvhex;
}

function lyraSign(msg, prvkey) {
    var sig = new KJUR.crypto.Signature({"alg": "SHA256withECDSA"});
    sig.init({d: prvkey, curve: "secp256r1"});
    var buff = toHexString(toUTF8Array(msg));    
    sig.updateHex(buff);
    var sigValueHex = sig.sign();    
    return sigValueHex;
}

function lyraVerify(msg, pubkey, sigval) {
    var sig = new KJUR.crypto.Signature({"alg": "SHA256withECDSA", "prov": "cryptojs/jsrsa"});
    sig.init({xy: pubkey, curve: "secp256r1"});
    var buff = toHexString(toUTF8Array(msg));
    sig.updateHex(buff);
    return sig.verify(sigval);
}

function prvToPub(prvkey) {
  var sig = new KJUR.crypto.Signature({"alg": "SHA256withECDSA"});
  sig.init({d: prvkey, curve: "secp256r1"});
  var biPrv = new BigInteger(prvkey, 16);
  var pvv = sig.prvKey;
  var g = pvv.ecparams['G'];
  var epPub = g.multiply(biPrv);
  var biX = epPub.getX().toBigInteger();
  var biY = epPub.getY().toBigInteger();
  
  var charlen = pvv.ecparams['keylen'] / 4;
  var hPrv = ("0000000000" + biPrv.toString(16)).slice(- charlen);
  var hX   = ("0000000000" + biX.toString(16)).slice(- charlen);
  var hY   = ("0000000000" + biY.toString(16)).slice(- charlen);
  var hPub = "04" + hX + hY;
  return hPub;
}

function toUTF8Array(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18), 
                      0x80 | ((charcode>>12) & 0x3f), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}