"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCacheManager = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const createCacheManager = (cache, debug, readOnly) => {
  return {
    createKey: operation => ({
      query: operation.query,
      variables: operation.variables
    }),
    performTransaction: writeFn => {
      if (cache.performTransaction) {
        return cache.performTransaction(writeFn);
      } else {
        return writeFn(cache);
      }
    },
    read: query => {
      try {
        return cache.readQuery(query);
      } catch (error) {
        if (debug) {
          window.console.log({
            message: 'Error --- Unable to read from cache',
            cacheKey: query,
            error
          });
        }
      }
    },
    write: (query, data) => {
      if (readOnly) {
        if (debug) {
          window.console.log({
            message: 'ReadOnly --- this link will NOT write to the cache but it would have attempted to',
            cacheKey: query,
            data
          });
        }
        return;
      }
      try {
        cache.writeQuery(_objectSpread(_objectSpread({}, query), {}, {
          data
        }));
        if (debug) {
          window.console.log({
            message: 'Success --- Updated the cache upon a mutation',
            cacheKey: query,
            data
          });
        }
      } catch (error) {
        if (debug) {
          window.console.log({
            message: 'Error --- Unable to write to the cache',
            cacheKey: query,
            data,
            error
          });
        }
      }
    }
  };
};
exports.createCacheManager = createCacheManager;