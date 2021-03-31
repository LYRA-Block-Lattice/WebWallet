"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcWebsocket = exports.WebsocketReadyStates = void 0;
const getParameterNames = require("get-parameter-names");
const deferred_promise_1 = require("./deferred-promise");
const jsonrpc_model_1 = require("./jsonrpc.model");
var WebsocketReadyStates;
(function (WebsocketReadyStates) {
    WebsocketReadyStates[WebsocketReadyStates["CONNECTING"] = 0] = "CONNECTING";
    WebsocketReadyStates[WebsocketReadyStates["OPEN"] = 1] = "OPEN";
    WebsocketReadyStates[WebsocketReadyStates["CLOSING"] = 2] = "CLOSING";
    WebsocketReadyStates[WebsocketReadyStates["CLOSED"] = 3] = "CLOSED";
})(WebsocketReadyStates = exports.WebsocketReadyStates || (exports.WebsocketReadyStates = {}));
class JsonRpcWebsocket {
    constructor(url, requestTimeoutMs, onError) {
        this.url = url;
        this.requestTimeoutMs = requestTimeoutMs;
        this.onError = onError;
        this.jsonRpcVersion = '2.0';
        this.requestId = 0;
        this.pendingRequests = {};
        this.rpcMethods = {};
    }
    get state() {
        return this.websocket ? this.websocket.readyState : WebsocketReadyStates.CLOSED;
    }
    async open() {
        if (this.websocket) {
            await this.close();
        }
        return this.createWebsocket();
    }
    close() {
        if (this.websocket === undefined) {
            return Promise.resolve(new CloseEvent('No websocket was opened', { wasClean: false, code: 1005 }));
        }
        this.websocket.close(1000); // 1000 = normal closure
        this.websocket = undefined;
        return this.closeDeferredPromise.asPromise();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(methodName, callback) {
        this.rpcMethods[methodName.toLowerCase()] = callback; // case-insensitive!
    }
    off(methodName) {
        delete this.rpcMethods[methodName.toLowerCase()]; // case-insensitive!
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    call(method, params) {
        if (!this.websocket || this.state !== WebsocketReadyStates.OPEN) {
            return Promise.reject({ code: jsonrpc_model_1.JsonRpcErrorCodes.INTERNAL_ERROR, message: 'The websocket is not opened' });
        }
        const request = {
            id: this.getRequestId(),
            jsonrpc: this.jsonRpcVersion,
            method,
            params,
        };
        try {
            //console.log("Sending request", request);
            this.websocket.send(JSON.stringify(request));
        }
        catch (e) {
            // istanbul ignore next
            return Promise.reject({ code: jsonrpc_model_1.JsonRpcErrorCodes.INTERNAL_ERROR, message: `Internal error. ${e}` });
        }
        return this.createPendingRequest(request);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    notify(method, params) {
        if (!this.websocket || this.state !== WebsocketReadyStates.OPEN) {
            throw new Error('The websocket is not opened');
        }
        const request = {
            jsonrpc: this.jsonRpcVersion,
            method,
            params,
        };
        try {
            this.websocket.send(JSON.stringify(request));
        }
        catch (e) {
            // istanbul ignore next
            throw Error(e);
        }
    }
    createWebsocket() {
        // See https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent for close event codes
        // this.websocket = new WebSocket(this.url, ['jsonrpc-2.0']);
        this.websocket = new WebSocket(this.url);
        const openDeferredPromise = new deferred_promise_1.DeferredPromise();
        this.closeDeferredPromise = new deferred_promise_1.DeferredPromise();
        this.websocket.onopen = (event) => {
            openDeferredPromise.resolve(event);
        };
        this.websocket.onerror = (err) => {
            openDeferredPromise.reject(err);
        };
        this.websocket.onclose = (event) => {
            this.websocket = undefined;
            if (event.code !== 1000) {
                // 1000 = normal closure
                const error = {
                    code: event.code,
                    data: event,
                    message: event.reason,
                };
                this.callOnError(error);
            }
            this.closeDeferredPromise.resolve(event);
        };
        this.websocket.onmessage = (message) => this.handleMessage(message.data);
        return openDeferredPromise.asPromise();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    respondOk(id, result) {
        this.respond(id, result);
    }
    respondError(id, error) {
        this.respond(id, undefined, error);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    respond(id, result, error) {
        // istanbul ignore if
        if (!this.websocket || this.state !== WebsocketReadyStates.OPEN) {
            throw new Error('The websocket is not opened');
        }
        // istanbul ignore if
        if (!!result && !!error) {
            throw new Error('Invalid response. Either result or error must be set, but not both');
        }
        const response = {
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
    }
    handleMessage(msg) {
        let data = null;
        try {
            data = JSON.parse(msg);
        }
        catch (e) /* istanbul ignore next */ {
            this.handleError(jsonrpc_model_1.JsonRpcErrorCodes.PARSE_ERROR, `Invalid JSON was received. ${e}`);
            return;
        }
        const isResponse = !!data && this.hasProperty(data, 'id') && (this.hasProperty(data, 'result') || this.hasProperty(data, 'error'));
        const isRequest = !!data && this.hasProperty(data, 'method');
        const requestId = isRequest && data.id ? data.id : undefined;
        if (!data.jsonrpc || data.jsonrpc !== this.jsonRpcVersion) {
            this.handleError(jsonrpc_model_1.JsonRpcErrorCodes.INVALID_REQUEST, `Invalid JSON RPC protocol version. Expecting ${this.jsonRpcVersion}, but got ${data.jsonrpc}`, requestId);
            return;
        }
        if (isResponse) {
            this.handleResponse(data);
        }
        else if (isRequest) {
            this.handleRequest(data);
        }
        else {
            this.handleError(jsonrpc_model_1.JsonRpcErrorCodes.INVALID_REQUEST, `Received unknown data: ${JSON.stringify(data)}`, requestId);
        }
    }
    handleRequest(request) {
        const method = this.rpcMethods[request.method.toLowerCase()]; // case-insensitive!
        if (!method) {
            this.handleError(jsonrpc_model_1.JsonRpcErrorCodes.METHOD_NOT_FOUND, `Method '${request.method}' was not found`, request.id);
            return;
        }
        let requestParams = [];
        try {
            requestParams = this.getRequestParams(method, request);
        }
        catch (error) {
            this.handleError(jsonrpc_model_1.JsonRpcErrorCodes.INVALID_PARAMS, error.message, request.id);
            return;
        }
        const result = method(...requestParams);
        if (request.id) {
            this.respondOk(request.id, result);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRequestParams(method, request) {
        let requestParams = [];
        if (request.params) {
            if (request.params instanceof Array) {
                if (method.length !== request.params.length) {
                    throw new Error(`Invalid parameters. Method '${request.method}' expects ${method.length} parameters, but got ${request.params.length}`);
                }
                requestParams = request.params;
            }
            else if (request.params instanceof Object) {
                const parameterNames = getParameterNames(method);
                if (method.length !== Object.keys(request.params).length) {
                    throw new Error(`Invalid parameters. Method '${request.method}' expects parameters [${parameterNames}], but got [${Object.keys(request.params)}]`);
                }
                parameterNames.forEach(paramName => {
                    const paramValue = request.params[paramName];
                    if (paramValue === undefined) {
                        throw new Error(`Invalid parameters. Method '${request.method}' expects parameters [${parameterNames}], but got [${Object.keys(request.params)}]`);
                    }
                    requestParams.push(paramValue);
                });
            }
            else {
                throw new Error(`Invalid parameters. Expected array or object, but got ${typeof request.params}`);
            }
        }
        return requestParams;
    }
    handleResponse(response) {
        const activeRequest = this.pendingRequests[response.id];
        if (activeRequest === undefined) {
            this.callOnError({
                code: jsonrpc_model_1.JsonRpcErrorCodes.INTERNAL_ERROR,
                message: `Received a response with id ${response.id}, which does not match any requests made by this client`,
            });
            return;
        }
        window.self.clearTimeout(activeRequest.timeout);
        if (this.hasProperty(response, 'result') && this.hasProperty(response, 'error')) {
            const errorResponse = {
                error: {
                    code: jsonrpc_model_1.JsonRpcErrorCodes.INVALID_RESPONSE,
                    message: `Invalid response. Either result or error must be set, but not both. ${JSON.stringify(response)}`,
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
    }
    handleError(code, message, requestId) {
        const error = { code, message };
        this.callOnError(error);
        if (requestId) {
            this.respondError(requestId, error);
        }
    }
    createPendingRequest(request) {
        const response = new deferred_promise_1.DeferredPromise();
        this.pendingRequests[request.id] = {
            request,
            response,
            timeout: this.setupRequestTimeout(request.id),
        };
        return response.asPromise();
    }
    setupRequestTimeout(requestId) {
        return window.self.setTimeout(() => {
            const activeRequest = this.pendingRequests[requestId];
            // istanbul ignore if
            if (activeRequest === undefined) {
                return;
            }
            const response = {
                error: {
                    code: jsonrpc_model_1.JsonRpcErrorCodes.REQUEST_TIMEOUT,
                    message: `Request ${activeRequest.request.id} exceeded the maximum time of ${this.requestTimeoutMs}ms and was aborted`,
                },
                id: activeRequest.request.id,
                jsonrpc: this.jsonRpcVersion,
            };
            delete this.pendingRequests[requestId];
            activeRequest.response.reject(response);
        }, this.requestTimeoutMs);
    }
    callOnError(error) {
        if (this.onError !== undefined) {
            this.onError(error);
        }
    }
    getRequestId() {
        return ++this.requestId;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hasProperty(object, propertyName) {
        return !!Object.prototype.hasOwnProperty.call(object, propertyName);
    }
}
exports.JsonRpcWebsocket = JsonRpcWebsocket;
