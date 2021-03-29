"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcWebsocket = exports.WebsocketReadyStates = void 0;
var getParameterNames = require("get-parameter-names");
var deferred_promise_1 = require("./deferred-promise");
var jsonrpc_model_1 = require("./jsonrpc.model");
var WebsocketReadyStates;
(function (WebsocketReadyStates) {
    WebsocketReadyStates[WebsocketReadyStates["CONNECTING"] = 0] = "CONNECTING";
    WebsocketReadyStates[WebsocketReadyStates["OPEN"] = 1] = "OPEN";
    WebsocketReadyStates[WebsocketReadyStates["CLOSING"] = 2] = "CLOSING";
    WebsocketReadyStates[WebsocketReadyStates["CLOSED"] = 3] = "CLOSED";
})(WebsocketReadyStates = exports.WebsocketReadyStates || (exports.WebsocketReadyStates = {}));
var JsonRpcWebsocket = /** @class */ (function () {
    function JsonRpcWebsocket(url, requestTimeoutMs, onError) {
        this.url = url;
        this.requestTimeoutMs = requestTimeoutMs;
        this.onError = onError;
        this.jsonRpcVersion = '2.0';
        this.requestId = 0;
        this.pendingRequests = {};
        this.rpcMethods = {};
    }
    Object.defineProperty(JsonRpcWebsocket.prototype, "state", {
        get: function () {
            return this.websocket ? this.websocket.readyState : WebsocketReadyStates.CLOSED;
        },
        enumerable: false,
        configurable: true
    });
    JsonRpcWebsocket.prototype.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.websocket) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.close()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.createWebsocket()];
                }
            });
        });
    };
    JsonRpcWebsocket.prototype.close = function () {
        if (this.websocket === undefined) {
            return Promise.resolve(new CloseEvent('No websocket was opened', { wasClean: false, code: 1005 }));
        }
        this.websocket.close(1000); // 1000 = normal closure
        this.websocket = undefined;
        return this.closeDeferredPromise.asPromise();
    };
    
    JsonRpcWebsocket.prototype.on = function (methodName, callback) {
        this.rpcMethods[methodName.toLowerCase()] = callback; // case-insensitive!
    };
    JsonRpcWebsocket.prototype.off = function (methodName) {
        delete this.rpcMethods[methodName.toLowerCase()]; // case-insensitive!
    };
    
    JsonRpcWebsocket.prototype.call = function (method, params) {
        if (!this.websocket || this.state !== WebsocketReadyStates.OPEN) {
            return Promise.reject({ code: jsonrpc_model_1.JsonRpcErrorCodes.INTERNAL_ERROR, message: 'The websocket is not opened' });
        }
        var request = {
            id: this.getRequestId(),
            jsonrpc: this.jsonRpcVersion,
            method: method,
            params: params,
        };
        try {
            this.websocket.send(JSON.stringify(request));
        }
        catch (e) {
            // istanbul ignore next
            return Promise.reject({ code: jsonrpc_model_1.JsonRpcErrorCodes.INTERNAL_ERROR, message: "Internal error. " + e });
        }
        return this.createPendingRequest(request);
    };
    
    JsonRpcWebsocket.prototype.notify = function (method, params) {
        if (!this.websocket || this.state !== WebsocketReadyStates.OPEN) {
            throw new Error('The websocket is not opened');
        }
        var request = {
            jsonrpc: this.jsonRpcVersion,
            method: method,
            params: params,
        };
        try {
            this.websocket.send(JSON.stringify(request));
        }
        catch (e) {
            // istanbul ignore next
            throw Error(e);
        }
    };
    JsonRpcWebsocket.prototype.createWebsocket = function () {
        // See https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent for close event codes
        var _this = this;
        // this.websocket = new WebSocket(this.url, ['jsonrpc-2.0']);
        this.websocket = new WebSocket(this.url);
        var openDeferredPromise = new deferred_promise_1.DeferredPromise();
        this.closeDeferredPromise = new deferred_promise_1.DeferredPromise();
        this.websocket.onopen = function (event) {
            openDeferredPromise.resolve(event);
        };
        this.websocket.onerror = function (err) {
            openDeferredPromise.reject(err);
        };
        this.websocket.onclose = function (event) {
            _this.websocket = undefined;
            if (event.code !== 1000) {
                // 1000 = normal closure
                var error = {
                    code: event.code,
                    data: event,
                    message: event.reason,
                };
                _this.callOnError(error);
            }
            _this.closeDeferredPromise.resolve(event);
        };
        this.websocket.onmessage = function (message) { return _this.handleMessage(message.data); };
        return openDeferredPromise.asPromise();
    };
    
    JsonRpcWebsocket.prototype.respondOk = function (id, result) {
        this.respond(id, result);
    };
    JsonRpcWebsocket.prototype.respondError = function (id, error) {
        this.respond(id, undefined, error);
    };
    
    JsonRpcWebsocket.prototype.respond = function (id, result, error) {
        // istanbul ignore if
        if (!this.websocket || this.state !== WebsocketReadyStates.OPEN) {
            throw new Error('The websocket is not opened');
        }
        // istanbul ignore if
        if (!!result && !!error) {
            throw new Error('Invalid response. Either result or error must be set, but not both');
        }
        var response = {
            jsonrpc: this.jsonRpcVersion,
            error: error,
            id: id,
            result: result
        };
        try {
            this.websocket.send(JSON.stringify(response));
        }
        catch (e) {
            // istanbul ignore next
            throw Error(e);
        }
    };
    JsonRpcWebsocket.prototype.handleMessage = function (msg) {
        var data = null;
        try {
            data = JSON.parse(msg);
        }
        catch (e) /* istanbul ignore next */ {
            this.handleError(jsonrpc_model_1.JsonRpcErrorCodes.PARSE_ERROR, "Invalid JSON was received. " + e);
            return;
        }
        var isResponse = !!data && this.hasProperty(data, 'id') && (this.hasProperty(data, 'result') || this.hasProperty(data, 'error'));
        var isRequest = !!data && this.hasProperty(data, 'method');
        var requestId = isRequest && data.id ? data.id : undefined;
        if (!data.jsonrpc || data.jsonrpc !== this.jsonRpcVersion) {
            this.handleError(jsonrpc_model_1.JsonRpcErrorCodes.INVALID_REQUEST, "Invalid JSON RPC protocol version. Expecting " + this.jsonRpcVersion + ", but got " + data.jsonrpc, requestId);
            return;
        }
        if (isResponse) {
            this.handleResponse(data);
        }
        else if (isRequest) {
            this.handleRequest(data);
        }
        else {
            this.handleError(jsonrpc_model_1.JsonRpcErrorCodes.INVALID_REQUEST, "Received unknown data: " + JSON.stringify(data), requestId);
        }
    };
    JsonRpcWebsocket.prototype.handleRequest = function (request) {
        var method = this.rpcMethods[request.method.toLowerCase()]; // case-insensitive!
        if (!method) {
            this.handleError(jsonrpc_model_1.JsonRpcErrorCodes.METHOD_NOT_FOUND, "Method '" + request.method + "' was not found", request.id);
            return;
        }
        var requestParams = [];
        try {
            requestParams = this.getRequestParams(method, request);
        }
        catch (error) {
            this.handleError(jsonrpc_model_1.JsonRpcErrorCodes.INVALID_PARAMS, error.message, request.id);
            return;
        }
        var result = method.apply(void 0, requestParams);
        if (request.id) {
            this.respondOk(request.id, result);
        }
    };
    
    JsonRpcWebsocket.prototype.getRequestParams = function (method, request) {
        var requestParams = [];
        if (request.params) {
            if (request.params instanceof Array) {
                if (method.length !== request.params.length) {
                    throw new Error("Invalid parameters. Method '" + request.method + "' expects " + method.length + " parameters, but got " + request.params.length);
                }
                requestParams = request.params;
            }
            else if (request.params instanceof Object) {
                var parameterNames_1 = getParameterNames(method);
                if (method.length !== Object.keys(request.params).length) {
                    throw new Error("Invalid parameters. Method '" + request.method + "' expects parameters [" + parameterNames_1 + "], but got [" + Object.keys(request.params) + "]");
                }
                parameterNames_1.forEach(function (paramName) {
                    var paramValue = request.params[paramName];
                    if (paramValue === undefined) {
                        throw new Error("Invalid parameters. Method '" + request.method + "' expects parameters [" + parameterNames_1 + "], but got [" + Object.keys(request.params) + "]");
                    }
                    requestParams.push(paramValue);
                });
            }
            else {
                throw new Error("Invalid parameters. Expected array or object, but got " + typeof request.params);
            }
        }
        return requestParams;
    };
    JsonRpcWebsocket.prototype.handleResponse = function (response) {
        var activeRequest = this.pendingRequests[response.id];
        if (activeRequest === undefined) {
            this.callOnError({
                code: jsonrpc_model_1.JsonRpcErrorCodes.INTERNAL_ERROR,
                message: "Received a response with id " + response.id + ", which does not match any requests made by this client",
            });
            return;
        }
        window.self.clearTimeout(activeRequest.timeout);
        if (this.hasProperty(response, 'result') && this.hasProperty(response, 'error')) {
            var errorResponse = {
                error: {
                    code: jsonrpc_model_1.JsonRpcErrorCodes.INVALID_RESPONSE,
                    message: "Invalid response. Either result or error must be set, but not both. " + JSON.stringify(response),
                },
                id: activeRequest.request.id,
                jsonrpc: this.jsonRpcVersion,
            };
            activeRequest.response.reject(errorResponse);
            return;
        }
        if (this.hasProperty(response, 'error')) {
            activeRequest.response.reject(response);
        }
        else {
            activeRequest.response.resolve(response);
        }
    };
    JsonRpcWebsocket.prototype.handleError = function (code, message, requestId) {
        var error = { code: code, message: message };
        this.callOnError(error);
        if (requestId) {
            this.respondError(requestId, error);
        }
    };
    JsonRpcWebsocket.prototype.createPendingRequest = function (request) {
        var response = new deferred_promise_1.DeferredPromise();
        this.pendingRequests[request.id] = {
            request: request,
            response: response,
            timeout: this.setupRequestTimeout(request.id),
        };
        return response.asPromise();
    };
    JsonRpcWebsocket.prototype.setupRequestTimeout = function (requestId) {
        var _this = this;
        return window.self.setTimeout(function () {
            var activeRequest = _this.pendingRequests[requestId];
            // istanbul ignore if
            if (activeRequest === undefined) {
                return;
            }
            var response = {
                error: {
                    code: jsonrpc_model_1.JsonRpcErrorCodes.REQUEST_TIMEOUT,
                    message: "Request " + activeRequest.request.id + " exceeded the maximum time of " + _this.requestTimeoutMs + "ms and was aborted",
                },
                id: activeRequest.request.id,
                jsonrpc: _this.jsonRpcVersion,
            };
            delete _this.pendingRequests[requestId];
            activeRequest.response.reject(response);
        }, this.requestTimeoutMs);
    };
    JsonRpcWebsocket.prototype.callOnError = function (error) {
        if (this.onError !== undefined) {
            this.onError(error);
        }
    };
    JsonRpcWebsocket.prototype.getRequestId = function () {
        return ++this.requestId;
    };
    
    JsonRpcWebsocket.prototype.hasProperty = function (object, propertyName) {
        return !!Object.prototype.hasOwnProperty.call(object, propertyName);
    };
    return JsonRpcWebsocket;
}());
exports.JsonRpcWebsocket = JsonRpcWebsocket;
