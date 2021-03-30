/* tslint:disable:max-classes-per-file */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcRequest = exports.JsonRpcResponse = exports.JsonRpcError = exports.JsonRpcErrorCodes = void 0;
// See https://www.jsonrpc.org/specification for the protocol details
var JsonRpcErrorCodes;
(function (JsonRpcErrorCodes) {
    JsonRpcErrorCodes[JsonRpcErrorCodes["PARSE_ERROR"] = -32700] = "PARSE_ERROR";
    JsonRpcErrorCodes[JsonRpcErrorCodes["INVALID_REQUEST"] = -32600] = "INVALID_REQUEST";
    JsonRpcErrorCodes[JsonRpcErrorCodes["METHOD_NOT_FOUND"] = -32601] = "METHOD_NOT_FOUND";
    JsonRpcErrorCodes[JsonRpcErrorCodes["INVALID_PARAMS"] = -32602] = "INVALID_PARAMS";
    JsonRpcErrorCodes[JsonRpcErrorCodes["INTERNAL_ERROR"] = -32603] = "INTERNAL_ERROR";
    // App specific
    JsonRpcErrorCodes[JsonRpcErrorCodes["INVALID_RESPONSE"] = -32001] = "INVALID_RESPONSE";
    JsonRpcErrorCodes[JsonRpcErrorCodes["REQUEST_TIMEOUT"] = -32002] = "REQUEST_TIMEOUT";
})(JsonRpcErrorCodes = exports.JsonRpcErrorCodes || (exports.JsonRpcErrorCodes = {}));
var JsonRpcError = /** @class */ (function () {
    function JsonRpcError() {
    }
    return JsonRpcError;
}());
exports.JsonRpcError = JsonRpcError;
var JsonRpcResponse = /** @class */ (function () {
    function JsonRpcResponse() {
    }
    return JsonRpcResponse;
}());
exports.JsonRpcResponse = JsonRpcResponse;
var JsonRpcRequest = /** @class */ (function () {
    function JsonRpcRequest() {
    }
    return JsonRpcRequest;
}());
exports.JsonRpcRequest = JsonRpcRequest;
