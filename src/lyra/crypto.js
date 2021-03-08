import KJUR from 'jsrsasign';
import bs58 from 'bs58';

import CryptoJs from 'crypto-js';

class LyraCrypto {
    static fromHexString(hexString) {
        return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    }

    static toHexString(bytes) {
        return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    }      

    static concatTypedArrays(a, b) { // a, b TypedArray of same type
        var c = new (a.constructor)(a.length + b.length);
        c.set(a, 0);
        c.set(b, a.length);
        return c;
    }

    static sliceTypedArrays(a, offset, len) { // a, TypedArray, from offset with len
        return a.slice(offset, offset + len);
    }

    static sha256(hexString) {
        // SJCL(Stanford JavaScript Crypto Library) provider sample
        var md = new KJUR.crypto.MessageDigest({ alg: "sha256", prov: "sjcl" }); // sjcl supports sha256 only
        return md.digestHex(hexString);
    }

    static checksum(data) {
        var hash1 = this.sha256(this.toHexString(data));
        var hash2 = this.sha256(hash1);
        var buff = hash2.substring(0, 8);
        return buff;
    }

    static lyraEncPvt(hex) {
        return this.lyraEnc(hex);
    }

    static lyraEncPub(hex) {
        var result = this.lyraEnc(hex.substring(2));
        var tag = "L";
        return tag.concat(result);
    }

    static lyraEnc(hex) {
        var buff = this.fromHexString(hex);
        var crc = this.checksum(buff);
        var crcBuff = this.fromHexString(crc);
        var buff2 = this.concatTypedArrays(buff, crcBuff);
        return bs58.encode(Buffer.from(buff2));
    }

    static lyraDec(pvtKey) {
        var dec = bs58.decode(pvtKey);
        //var buff = this.toUTF8Array(dec);
        var buff = dec;
        var data = this.sliceTypedArrays(buff, 0, buff.byteLength - 4);
        var checkbytes = this.sliceTypedArrays(buff, buff.byteLength - 4, 4);
        var check = this.toHexString(checkbytes);

        var check2 = this.checksum(data);
        if (0 === check.localeCompare(check2))
            return this.toHexString(data);
        else
            return undefined;
    }

    static encrypt(s, password) {
        return CryptoJs.AES.encrypt(s, password).toString();
    }

    static decrypt(s, password) {
        var bytes = CryptoJs.AES.decrypt(s, password);
        return bytes.toString(CryptoJs.enc.Utf8);
    }

    static lyraGenWallet() {
        var ec = new KJUR.crypto.ECDSA({ "curve": "secp256r1" });
        var keypair = ec.generateKeyPairHex();
        return keypair.ecprvhex;
    }

    static lyraSign(msg, prvkey) {
        var sig = new KJUR.crypto.Signature({ "alg": "SHA256withECDSA" });
        sig.init({ d: prvkey, curve: "secp256r1" });
        var buff = this.toHexString(this.toUTF8Array(msg));
        sig.updateHex(buff);
        var sigValueHex = sig.sign();
        return sigValueHex;
    }

    static lyraVerify(msg, pubkey, sigval) {
        var sig = new KJUR.crypto.Signature({ "alg": "SHA256withECDSA", "prov": "cryptojs/jsrsa" });
        sig.init({ xy: pubkey, curve: "secp256r1" });
        var buff = this.toHexString(this.toUTF8Array(msg));
        sig.updateHex(buff);
        return sig.verify(sigval);
    }

    static prvToPub(prvkey) {
        var sig = new KJUR.crypto.Signature({ "alg": "SHA256withECDSA" });
        sig.init({ d: prvkey, curve: "secp256r1" });
        var biPrv = new KJUR.BigInteger(prvkey, 16);
        var pvv = sig.prvKey;
        var g = pvv.ecparams['G'];
        var epPub = g.multiply(biPrv);
        var biX = epPub.getX().toBigInteger();
        var biY = epPub.getY().toBigInteger();

        var charlen = pvv.ecparams['keylen'] / 4;
        var hX = ("0000000000" + biX.toString(16)).slice(- charlen);
        var hY = ("0000000000" + biY.toString(16)).slice(- charlen);
        var hPub = "04" + hX + hY;
        return hPub;
    }

    static toUTF8Array(str) {
        var utf8 = [];
        for (var i = 0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
                    0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                    | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >> 18),
                    0x80 | ((charcode >> 12) & 0x3f),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }
}

export default LyraCrypto;