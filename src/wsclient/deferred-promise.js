"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeferredPromise = void 0;
var DeferredPromise = /** @class */ (function () {
    function DeferredPromise() {
        var _this = this;
        this.promise = new Promise(function (resolve, reject) {
            _this.deferResolve = resolve;
            _this.deferReject = reject;
        });
    }
    DeferredPromise.prototype.asPromise = function () {
        return this.promise;
    };
    DeferredPromise.prototype.resolve = function (result) {
        this.deferResolve(result);
    };
    DeferredPromise.prototype.reject = function (error) {
        this.deferReject(error);
    };
    return DeferredPromise;
}());
exports.DeferredPromise = DeferredPromise;
