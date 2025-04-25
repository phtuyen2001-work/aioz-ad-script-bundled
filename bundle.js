/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/lib/adapters/adapters.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/adapters/adapters.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _http_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./http.js */ "./node_modules/axios/lib/helpers/null.js");
/* harmony import */ var _xhr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xhr.js */ "./node_modules/axios/lib/adapters/xhr.js");
/* harmony import */ var _fetch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fetch.js */ "./node_modules/axios/lib/adapters/fetch.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");






const knownAdapters = {
  http: _http_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  xhr: _xhr_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  fetch: _fetch_js__WEBPACK_IMPORTED_MODULE_2__["default"]
}

_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isFunction(adapter) || adapter === null || adapter === false;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  getAdapter: (adapters) => {
    adapters = _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__["default"](`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__["default"](
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
});


/***/ }),

/***/ "./node_modules/axios/lib/adapters/fetch.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/adapters/fetch.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _helpers_composeSignals_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/composeSignals.js */ "./node_modules/axios/lib/helpers/composeSignals.js");
/* harmony import */ var _helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/trackStream.js */ "./node_modules/axios/lib/helpers/trackStream.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers/progressEventReducer.js */ "./node_modules/axios/lib/helpers/progressEventReducer.js");
/* harmony import */ var _helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/resolveConfig.js */ "./node_modules/axios/lib/helpers/resolveConfig.js");
/* harmony import */ var _core_settle_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/settle.js */ "./node_modules/axios/lib/core/settle.js");










const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

// used only inside the fetch adapter
const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
);

const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false
  }
}

const supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;

  const hasContentType = new Request(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].origin, {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
});

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const supportsResponseStream = isReadableStreamSupported &&
  test(() => _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isReadableStream(new Response('').body));


const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};

isFetchSupported && (((res) => {
  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
    !resolvers[type] && (resolvers[type] = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isFunction(res[type]) ? (res) => res[type]() :
      (_, config) => {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"](`Response type '${type}' is not supported`, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].ERR_NOT_SUPPORT, config);
      })
  });
})(new Response));

const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isBlob(body)) {
    return body.size;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isSpecCompliantForm(body)) {
    const _request = new Request(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].origin, {
      method: 'POST',
      body,
    });
    return (await _request.arrayBuffer()).byteLength;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArrayBufferView(body) || _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArrayBuffer(body)) {
    return body.byteLength;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isURLSearchParams(body)) {
    body = body + '';
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(body)) {
    return (await encodeText(body)).byteLength;
  }
}

const resolveBodyLength = async (headers, body) => {
  const length = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].toFiniteNumber(headers.getContentLength());

  return length == null ? getBodyLength(body) : length;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = (0,_helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"])(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let composedSignal = (0,_helpers_composeSignals_js__WEBPACK_IMPORTED_MODULE_4__["default"])([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

  let request;

  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
  });

  let requestContentLength;

  try {
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader)
      }

      if (_request.body) {
        const [onProgress, flush] = (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventDecorator)(
          requestContentLength,
          (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventReducer)((0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.asyncDecorator)(onUploadProgress))
        );

        data = (0,_helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_6__.trackStream)(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }

    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(withCredentials)) {
      withCredentials = withCredentials ? 'include' : 'omit';
    }

    // Cloudflare Workers throws when credentials are defined
    // see https://github.com/cloudflare/workerd/issues/902
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : undefined
    });

    let response = await fetch(request);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].toFiniteNumber(response.headers.get('content-length'));

      const [onProgress, flush] = onDownloadProgress && (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventDecorator)(
        responseContentLength,
        (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventReducer)((0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.asyncDecorator)(onDownloadProgress), true)
      ) || [];

      response = new Response(
        (0,_helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_6__.trackStream)(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && unsubscribe && unsubscribe();

    return await new Promise((resolve, reject) => {
      (0,_core_settle_js__WEBPACK_IMPORTED_MODULE_7__["default"])(resolve, reject, {
        data: responseData,
        headers: _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_8__["default"].from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      })
    })
  } catch (err) {
    unsubscribe && unsubscribe();

    if (err && err.name === 'TypeError' && /fetch/i.test(err.message)) {
      throw Object.assign(
        new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"]('Network Error', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].from(err, err && err.code, config, request);
  }
}));




/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_settle_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../core/settle.js */ "./node_modules/axios/lib/core/settle.js");
/* harmony import */ var _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../defaults/transitional.js */ "./node_modules/axios/lib/defaults/transitional.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../helpers/parseProtocol.js */ "./node_modules/axios/lib/helpers/parseProtocol.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/progressEventReducer.js */ "./node_modules/axios/lib/helpers/progressEventReducer.js");
/* harmony import */ var _helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/resolveConfig.js */ "./node_modules/axios/lib/helpers/resolveConfig.js");











const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = (0,_helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"])(config);
    let requestData = _config.data;
    const requestHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(_config.headers).normalize();
    let {responseType, onUploadProgress, onDownloadProgress} = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;

    function done() {
      flushUpload && flushUpload(); // flush events
      flushDownload && flushDownload(); // flush events

      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      (0,_core_settle_js__WEBPACK_IMPORTED_MODULE_2__["default"])(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Request aborted', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Network Error', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_4__["default"];
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"](
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ETIMEDOUT : _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      _utils_js__WEBPACK_IMPORTED_MODULE_5__["default"].forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"].isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (onDownloadProgress) {
      ([downloadThrottled, flushDownload] = (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__.progressEventReducer)(onDownloadProgress, true));
      request.addEventListener('progress', downloadThrottled);
    }

    // Not all browsers support upload events
    if (onUploadProgress && request.upload) {
      ([uploadThrottled, flushUpload] = (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__.progressEventReducer)(onUploadProgress));

      request.upload.addEventListener('progress', uploadThrottled);

      request.upload.addEventListener('loadend', flushUpload);
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_7__["default"](null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = (0,_helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_8__["default"])(_config.url);

    if (protocol && _platform_index_js__WEBPACK_IMPORTED_MODULE_9__["default"].protocols.indexOf(protocol) === -1) {
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Unsupported protocol ' + protocol + ':', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
});


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers/bind.js */ "./node_modules/axios/lib/helpers/bind.js");
/* harmony import */ var _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/Axios.js */ "./node_modules/axios/lib/core/Axios.js");
/* harmony import */ var _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./helpers/formDataToJSON.js */ "./node_modules/axios/lib/helpers/formDataToJSON.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./cancel/CancelToken.js */ "./node_modules/axios/lib/cancel/CancelToken.js");
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./cancel/isCancel.js */ "./node_modules/axios/lib/cancel/isCancel.js");
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./env/data.js */ "./node_modules/axios/lib/env/data.js");
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./helpers/toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./helpers/spread.js */ "./node_modules/axios/lib/helpers/spread.js");
/* harmony import */ var _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./helpers/isAxiosError.js */ "./node_modules/axios/lib/helpers/isAxiosError.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./adapters/adapters.js */ "./node_modules/axios/lib/adapters/adapters.js");
/* harmony import */ var _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./helpers/HttpStatusCode.js */ "./node_modules/axios/lib/helpers/HttpStatusCode.js");




















/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"](defaultConfig);
  const instance = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.request, context);

  // Copy axios.prototype to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype, context, {allOwnKeys: true});

  // Copy context to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance((0,_core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"])(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(_defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"]);

// Expose Axios class to allow class inheritance
axios.Axios = _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"];

// Expose Cancel & CancelToken
axios.CanceledError = _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__["default"];
axios.CancelToken = _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__["default"];
axios.isCancel = _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__["default"];
axios.VERSION = _env_data_js__WEBPACK_IMPORTED_MODULE_8__.VERSION;
axios.toFormData = _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__["default"];

// Expose AxiosError class
axios.AxiosError = _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__["default"];

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__["default"];

// Expose isAxiosError
axios.isAxiosError = _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__["default"];

// Expose mergeConfig
axios.mergeConfig = _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"];

axios.AxiosHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__["default"];

axios.formToJSON = thing => (0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__["default"])(_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_15__["default"].getAdapter;

axios.HttpStatusCode = _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_16__["default"];

axios.default = axios;

// this module should only have a default export
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (axios);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");




/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  toAbortSignal() {
    const controller = new AbortController();

    const abort = (err) => {
      controller.abort(err);
    };

    this.subscribe(abort);

    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal;
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CancelToken);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CanceledError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CanceledError.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");





/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].call(this, message == null ? 'canceled' : message, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].inherits(CanceledError, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"], {
  __CANCEL__: true
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CanceledError);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isCancel)
/* harmony export */ });


function isCancel(value) {
  return !!(value && value.__CANCEL__);
}


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../helpers/buildURL.js */ "./node_modules/axios/lib/helpers/buildURL.js");
/* harmony import */ var _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InterceptorManager.js */ "./node_modules/axios/lib/core/InterceptorManager.js");
/* harmony import */ var _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dispatchRequest.js */ "./node_modules/axios/lib/core/dispatchRequest.js");
/* harmony import */ var _mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./buildFullPath.js */ "./node_modules/axios/lib/core/buildFullPath.js");
/* harmony import */ var _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/validator.js */ "./node_modules/axios/lib/helpers/validator.js");
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");











const validators = _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"](),
      response: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"]()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};

        Error.captureStackTrace ? Error.captureStackTrace(dummy) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        }
      } else {
        _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.allowAbsoluteUrls
    if (config.allowAbsoluteUrls !== undefined) {
      // do nothing
    } else if (this.defaults.allowAbsoluteUrls !== undefined) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }

    _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(config, {
      baseUrl: validators.spelling('baseURL'),
      withXsrfToken: validators.spelling('withXSRFToken')
    }, true);

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].merge(
      headers.common,
      headers[config.method]
    );

    headers && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__["default"].concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [_dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);
    const fullPath = (0,_buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__["default"])(config.baseURL, config.url, config.allowAbsoluteUrls);
    return (0,_helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__["default"])(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Axios);


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosError.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/core/AxiosError.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});

const prototype = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);

  _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosError);


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosHeaders.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/AxiosHeaders.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/parseHeaders.js */ "./node_modules/axios/lib/helpers/parseHeaders.js");





const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(value)) return;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite)
    } else if(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders((0,_helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"])(header), valueOrRewrite);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isHeaders(header)) {
      for (const [key, value] of header.entries()) {
        setHeader(value, key, rewrite);
      }
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].freezeMethods(AxiosHeaders);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosHeaders);


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InterceptorManager);


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildFullPath)
/* harmony export */ });
/* harmony import */ var _helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/isAbsoluteURL.js */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
/* harmony import */ var _helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/combineURLs.js */ "./node_modules/axios/lib/helpers/combineURLs.js");





/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !(0,_helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__["default"])(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return (0,_helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__["default"])(baseURL, requestedURL);
  }
  return requestedURL;
}


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dispatchRequest)
/* harmony export */ });
/* harmony import */ var _transformData_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transformData.js */ "./node_modules/axios/lib/core/transformData.js");
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../cancel/isCancel.js */ "./node_modules/axios/lib/cancel/isCancel.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../adapters/adapters.js */ "./node_modules/axios/lib/adapters/adapters.js");









/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(config.headers);

  // Transform request data
  config.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__["default"].getAdapter(config.adapter || _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"].adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
      config,
      config.transformResponse,
      response
    );

    response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!(0,_cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__["default"])(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeConfig)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");





const headersToObject = (thing) => thing instanceof _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, prop, caseless) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(target) && _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge.call({caseless}, target, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge({}, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, prop , caseless) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(a, b, prop , caseless);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a, prop , caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b , prop) => mergeDeepProperties(headersToObject(a), headersToObject(b),prop, true)
  };

  _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ settle)
/* harmony export */ });
/* harmony import */ var _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");




/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"](
      'Request failed with status code ' + response.status,
      [_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_REQUEST, _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ transformData)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");






/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__["default"];
  const context = response || config;
  const headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(context.headers);
  let data = context.data;

  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}


/***/ }),

/***/ "./node_modules/axios/lib/defaults/index.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/defaults/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _transitional_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transitional.js */ "./node_modules/axios/lib/defaults/transitional.js");
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/toURLEncodedForm.js */ "./node_modules/axios/lib/helpers/toURLEncodedForm.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers/formDataToJSON.js */ "./node_modules/axios/lib/helpers/formDataToJSON.js");










/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: _transitional_js__WEBPACK_IMPORTED_MODULE_1__["default"],

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(data);

    if (isObjectPayload && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify((0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__["default"])(data)) : data;
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isStream(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFile(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isReadableStream(data)
    ) {
      return data;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBufferView(data)) {
      return data.buffer;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return (0,_helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__["default"])(data, this.formSerializer).toString();
      }

      if ((isFileList = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return (0,_helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isResponse(data) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isReadableStream(data)) {
      return data;
    }

    if (data && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].from(e, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.FormData,
    Blob: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaults);


/***/ }),

/***/ "./node_modules/axios/lib/defaults/transitional.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/defaults/transitional.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
});


/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/env/data.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VERSION: () => (/* binding */ VERSION)
/* harmony export */ });
const VERSION = "1.8.4";

/***/ }),

/***/ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js":
/*!****************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/AxiosURLSearchParams.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");




/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosURLSearchParams);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/HttpStatusCode.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/HttpStatusCode.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HttpStatusCode);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ bind)
/* harmony export */ });


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildURL)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/AxiosURLSearchParams.js */ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js");





/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?(object|Function)} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(options)) {
    options = {
      serialize: options
    };
  } 

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(params) ?
      params.toString() :
      new _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__["default"](params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ combineURLs)
/* harmony export */ });


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/composeSignals.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/composeSignals.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




const composeSignals = (signals, timeout) => {
  const {length} = (signals = signals ? signals.filter(Boolean) : []);

  if (timeout || length) {
    let controller = new AbortController();

    let aborted;

    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? err : new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_1__["default"](err instanceof Error ? err.message : err));
      }
    }

    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"](`timeout ${timeout} of ms exceeded`, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ETIMEDOUT))
    }, timeout)

    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach(signal => {
          signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
        });
        signals = null;
      }
    }

    signals.forEach((signal) => signal.addEventListener('abort', onabort));

    const {signal} = controller;

    signal.unsubscribe = () => _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].asap(unsubscribe);

    return signal;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (composeSignals);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(path) && cookie.push('path=' + path);

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  });



/***/ }),

/***/ "./node_modules/axios/lib/helpers/formDataToJSON.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/formDataToJSON.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target) ? target.length : name;

    if (isLast) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(formData) && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(formData.entries)) {
    const obj = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formDataToJSON);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isAbsoluteURL)
/* harmony export */ });


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isAxiosError)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(payload) && (payload.isAxiosError === true);
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
  url = new URL(url, _platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].origin);

  return (
    origin.protocol === url.protocol &&
    origin.host === url.host &&
    (isMSIE || origin.port === url.port)
  );
})(
  new URL(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].origin),
  _platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].navigator && /(msie|trident)/i.test(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].navigator.userAgent)
) : () => true);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/null.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/null.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// eslint-disable-next-line strict
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (null);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
});


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseProtocol.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseProtocol.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ parseProtocol)
/* harmony export */ });


function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/progressEventReducer.js":
/*!****************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/progressEventReducer.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   asyncDecorator: () => (/* binding */ asyncDecorator),
/* harmony export */   progressEventDecorator: () => (/* binding */ progressEventDecorator),
/* harmony export */   progressEventReducer: () => (/* binding */ progressEventReducer)
/* harmony export */ });
/* harmony import */ var _speedometer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedometer.js */ "./node_modules/axios/lib/helpers/speedometer.js");
/* harmony import */ var _throttle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./throttle.js */ "./node_modules/axios/lib/helpers/throttle.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = (0,_speedometer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(50, 250);

  return (0,_throttle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? 'download' : 'upload']: true
    };

    listener(data);
  }, freq);
}

const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;

  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
}

const asyncDecorator = (fn) => (...args) => _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].asap(() => fn(...args));


/***/ }),

/***/ "./node_modules/axios/lib/helpers/resolveConfig.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/resolveConfig.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isURLSameOrigin.js */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
/* harmony import */ var _cookies_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./cookies.js */ "./node_modules/axios/lib/helpers/cookies.js");
/* harmony import */ var _core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/buildFullPath.js */ "./node_modules/axios/lib/core/buildFullPath.js");
/* harmony import */ var _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _buildURL_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./buildURL.js */ "./node_modules/axios/lib/helpers/buildURL.js");









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((config) => {
  const newConfig = (0,_core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, config);

  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

  newConfig.headers = headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(headers);

  newConfig.url = (0,_buildURL_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_3__["default"])(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  let contentType;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"].isFormData(data)) {
    if (_platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserEnv || _platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // Let the browser set it
    } else if ((contentType = headers.getContentType()) !== false) {
      // fix semicolon duplication issue for ReactNative FormData implementation
      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (_platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserEnv) {
    withXSRFToken && _utils_js__WEBPACK_IMPORTED_MODULE_4__["default"].isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && (0,_isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_6__["default"])(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && _cookies_js__WEBPACK_IMPORTED_MODULE_7__["default"].read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
});



/***/ }),

/***/ "./node_modules/axios/lib/helpers/speedometer.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/speedometer.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (speedometer);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ spread)
/* harmony export */ });


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/throttle.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/throttle.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;

  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn.apply(null, args);
  }

  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if ( passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs)
        }, threshold - passed);
      }
    }
  }

  const flush = () => lastArgs && invoke(lastArgs);

  return [throttled, flush];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (throttle);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toFormData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/toFormData.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _platform_node_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform/node/classes/FormData.js */ "./node_modules/axios/lib/helpers/null.js");




// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored


/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(thing) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(arr) && !arr.some(isVisitable);
}

const predicates = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"], {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (_platform_node_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"] || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isSpecCompliantForm(formData);

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(value)) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"]('Blob is not supported. Use a Buffer instead.');
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) && isFlatArray(value)) ||
        ((_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]')) && (arr = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(value, function each(el, key) {
      const result = !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && visitor.call(
        formData, el, _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toFormData);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toURLEncodedForm.js":
/*!************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/toURLEncodedForm.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toURLEncodedForm)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");






function toURLEncodedForm(data, options) {
  return (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(data, new _platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (_platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNode && _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/trackStream.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/trackStream.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   readBytes: () => (/* binding */ readBytes),
/* harmony export */   streamChunk: () => (/* binding */ streamChunk),
/* harmony export */   trackStream: () => (/* binding */ trackStream)
/* harmony export */ });

const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
}

const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
}

const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }

  const reader = stream.getReader();
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
}

const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream, chunkSize);

  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  }

  return new ReadableStream({
    async pull(controller) {
      try {
        const {done, value} = await iterator.next();

        if (done) {
         _onFinish();
          controller.close();
          return;
        }

        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env/data.js */ "./node_modules/axios/lib/env/data.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");





const validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + _env_data_js__WEBPACK_IMPORTED_MODULE_0__.VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"](
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

validators.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    // eslint-disable-next-line no-console
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  }
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('options must be an object', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('option ' + opt + ' must be ' + result, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('Unknown option ' + opt, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION);
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  assertOptions,
  validators
});


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/Blob.js":
/*!*****************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/Blob.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof Blob !== 'undefined' ? Blob : null);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/FormData.js":
/*!*********************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/FormData.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof FormData !== 'undefined' ? FormData : null);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js":
/*!****************************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../helpers/AxiosURLSearchParams.js */ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof URLSearchParams !== 'undefined' ? URLSearchParams : _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes/URLSearchParams.js */ "./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js");
/* harmony import */ var _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classes/FormData.js */ "./node_modules/axios/lib/platform/browser/classes/FormData.js");
/* harmony import */ var _classes_Blob_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./classes/Blob.js */ "./node_modules/axios/lib/platform/browser/classes/Blob.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isBrowser: true,
  classes: {
    URLSearchParams: _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"],
    FormData: _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    Blob: _classes_Blob_js__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
});


/***/ }),

/***/ "./node_modules/axios/lib/platform/common/utils.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/platform/common/utils.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasBrowserEnv: () => (/* binding */ hasBrowserEnv),
/* harmony export */   hasStandardBrowserEnv: () => (/* binding */ hasStandardBrowserEnv),
/* harmony export */   hasStandardBrowserWebWorkerEnv: () => (/* binding */ hasStandardBrowserWebWorkerEnv),
/* harmony export */   navigator: () => (/* binding */ _navigator),
/* harmony export */   origin: () => (/* binding */ origin)
/* harmony export */ });
const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

const _navigator = typeof navigator === 'object' && navigator || undefined;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = hasBrowserEnv &&
  (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';




/***/ }),

/***/ "./node_modules/axios/lib/platform/index.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/platform/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node/index.js */ "./node_modules/axios/lib/platform/browser/index.js");
/* harmony import */ var _common_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common/utils.js */ "./node_modules/axios/lib/platform/common/utils.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ..._common_utils_js__WEBPACK_IMPORTED_MODULE_0__,
  ..._node_index_js__WEBPACK_IMPORTED_MODULE_1__["default"]
});


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/bind.js */ "./node_modules/axios/lib/helpers/bind.js");




// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
}

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
}

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__["default"])(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
}

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
}

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
}

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  }

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
}

const noop = () => {}

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
}

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  }

  return visit(obj, 0);
}

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }

  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({source, data}) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);

    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    }
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === 'function',
  isFunction(_global.postMessage)
);

const asap = typeof queueMicrotask !== 'undefined' ?
  queueMicrotask.bind(_global) : ( typeof process !== 'undefined' && process.nextTick || _setImmediate);

// *********************

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap
});


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles.css":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles.css ***!
  \**************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.ad-reset {
  all: unset;
}
.ad-default-button {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: inherit;
  border: 1px solid rgb(221, 221, 221);
  border-radius: 4px;
  width: fit-content;
  height: auto;
  font-size: 14px;
  line-height: normal;
  cursor: pointer;
}
.ad-default-anchor {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: flex;
  width: fit-content;
  height: fit-content;
  box-sizing: inherit;
}

ins.aioz-ads {
  all: unset;
  box-sizing: border-box;

  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
}
.ad-container {
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 10px 0px;
}
.ad-row-container {
  width: auto;
  height: 240px;
}
.ad-col-container {
  width: 100%;
  max-width: 100%;
  height: auto;
}
.ad-outer-wrapper {
  position: relative;
  display: flex;
  box-sizing: inherit;
  max-width: 100%;
  max-height: 100%;
}
.ad-indicator-span {
  position: absolute;
  top: 3px;
  left: 3px;
  pointer-events: none;
  border-radius: 6px;
  padding: 0px 6px;
  background-color: rgb(123, 221, 157);
  font-size: 12px;
  font-weight: bold;
  line-height: 1.5;
  color: rgb(255, 255, 255);
}
.ad-image-wrapper {
  display: flex;
  width: auto;
  height: auto;
  box-sizing: inherit;
}
.ad-image-element {
  width: auto;
  height: auto;
  object-fit: cover;
  object-position: center;
  overflow: hidden;
}

.ad-icon-sm-wrapper > svg {
  color: inherit !important;
  width: 20px;
  height: 20px;
}
.ad-icon-lg-wrapper > svg {
  color: inherit !important;
  width: 40px;
  height: 40px;
}

.aioz-ads-overlay {
  display: contents;
  font-family: 'Roboto', sans-serif;
}
.ad-fullscreen-blur-overlay {
  z-index: 9000;
  position: fixed;
  inset: 0;
  width: auto;
  height: auto;
  background: rgb(234, 233, 238);
  opacity: 0.8;
}
.ad-dialog-container-overlay {
  z-index: 9001;
  box-sizing: border-box;
  position: fixed;
  display: block;
  inset: 0;
  margin: auto;
  background: rgb(128, 128, 128);
}
.ad-dialog-bg-overlay {
  z-index: -1;
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}
`, "",{"version":3,"sources":["webpack://./src/styles.css"],"names":[],"mappings":"AACA;EACE,UAAU;AACZ;AACA;EACE,aAAa;EACb,mBAAmB;EACnB,uBAAuB;EACvB,mBAAmB;EACnB,oCAAoC;EACpC,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,eAAe;EACf,mBAAmB;EACnB,eAAe;AACjB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,cAAc;EACd,aAAa;EACb,kBAAkB;EAClB,mBAAmB;EACnB,mBAAmB;AACrB;;AAEA;EACE,UAAU;EACV,sBAAsB;;EAEtB,WAAW;EACX,YAAY;EACZ,aAAa;EACb,uBAAuB;EACvB,cAAc;EACd,iCAAiC;AACnC;AACA;EACE,sBAAsB;EACtB,aAAa;EACb,oBAAoB;EACpB,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,WAAW;EACX,aAAa;AACf;AACA;EACE,WAAW;EACX,eAAe;EACf,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,aAAa;EACb,mBAAmB;EACnB,eAAe;EACf,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,oBAAoB;EACpB,kBAAkB;EAClB,gBAAgB;EAChB,oCAAoC;EACpC,eAAe;EACf,iBAAiB;EACjB,gBAAgB;EAChB,yBAAyB;AAC3B;AACA;EACE,aAAa;EACb,WAAW;EACX,YAAY;EACZ,mBAAmB;AACrB;AACA;EACE,WAAW;EACX,YAAY;EACZ,iBAAiB;EACjB,uBAAuB;EACvB,gBAAgB;AAClB;;AAEA;EACE,yBAAyB;EACzB,WAAW;EACX,YAAY;AACd;AACA;EACE,yBAAyB;EACzB,WAAW;EACX,YAAY;AACd;;AAEA;EACE,iBAAiB;EACjB,iCAAiC;AACnC;AACA;EACE,aAAa;EACb,eAAe;EACf,QAAQ;EACR,WAAW;EACX,YAAY;EACZ,8BAA8B;EAC9B,YAAY;AACd;AACA;EACE,aAAa;EACb,sBAAsB;EACtB,eAAe;EACf,cAAc;EACd,QAAQ;EACR,YAAY;EACZ,8BAA8B;AAChC;AACA;EACE,WAAW;EACX,kBAAkB;EAClB,QAAQ;EACR,cAAc;EACd,WAAW;EACX,YAAY;AACd","sourcesContent":["@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');\n.ad-reset {\n  all: unset;\n}\n.ad-default-button {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: inherit;\n  border: 1px solid rgb(221, 221, 221);\n  border-radius: 4px;\n  width: fit-content;\n  height: auto;\n  font-size: 14px;\n  line-height: normal;\n  cursor: pointer;\n}\n.ad-default-anchor {\n  cursor: pointer;\n  text-decoration: none;\n  color: inherit;\n  display: flex;\n  width: fit-content;\n  height: fit-content;\n  box-sizing: inherit;\n}\n\nins.aioz-ads {\n  all: unset;\n  box-sizing: border-box;\n\n  width: 100%;\n  height: auto;\n  display: flex;\n  justify-content: center;\n  margin: 0 auto;\n  font-family: 'Roboto', sans-serif;\n}\n.ad-container {\n  box-sizing: border-box;\n  display: flex;\n  align-items: stretch;\n  justify-content: center;\n  padding: 10px 0px;\n}\n.ad-row-container {\n  width: auto;\n  height: 240px;\n}\n.ad-col-container {\n  width: 100%;\n  max-width: 100%;\n  height: auto;\n}\n.ad-outer-wrapper {\n  position: relative;\n  display: flex;\n  box-sizing: inherit;\n  max-width: 100%;\n  max-height: 100%;\n}\n.ad-indicator-span {\n  position: absolute;\n  top: 3px;\n  left: 3px;\n  pointer-events: none;\n  border-radius: 6px;\n  padding: 0px 6px;\n  background-color: rgb(123, 221, 157);\n  font-size: 12px;\n  font-weight: bold;\n  line-height: 1.5;\n  color: rgb(255, 255, 255);\n}\n.ad-image-wrapper {\n  display: flex;\n  width: auto;\n  height: auto;\n  box-sizing: inherit;\n}\n.ad-image-element {\n  width: auto;\n  height: auto;\n  object-fit: cover;\n  object-position: center;\n  overflow: hidden;\n}\n\n.ad-icon-sm-wrapper > svg {\n  color: inherit !important;\n  width: 20px;\n  height: 20px;\n}\n.ad-icon-lg-wrapper > svg {\n  color: inherit !important;\n  width: 40px;\n  height: 40px;\n}\n\n.aioz-ads-overlay {\n  display: contents;\n  font-family: 'Roboto', sans-serif;\n}\n.ad-fullscreen-blur-overlay {\n  z-index: 9000;\n  position: fixed;\n  inset: 0;\n  width: auto;\n  height: auto;\n  background: rgb(234, 233, 238);\n  opacity: 0.8;\n}\n.ad-dialog-container-overlay {\n  z-index: 9001;\n  box-sizing: border-box;\n  position: fixed;\n  display: block;\n  inset: 0;\n  margin: auto;\n  background: rgb(128, 128, 128);\n}\n.ad-dialog-bg-overlay {\n  z-index: -1;\n  position: absolute;\n  inset: 0;\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/lodash/_Symbol.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_Symbol.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ "./node_modules/lodash/_baseGetTag.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseGetTag.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "./node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "./node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ "./node_modules/lodash/_baseTrim.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseTrim.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var trimmedEndIndex = __webpack_require__(/*! ./_trimmedEndIndex */ "./node_modules/lodash/_trimmedEndIndex.js");

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

module.exports = baseTrim;


/***/ }),

/***/ "./node_modules/lodash/_freeGlobal.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_freeGlobal.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ "./node_modules/lodash/_getRawTag.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getRawTag.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ "./node_modules/lodash/_objectToString.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_objectToString.js ***!
  \************************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ "./node_modules/lodash/_root.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_root.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ "./node_modules/lodash/_trimmedEndIndex.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_trimmedEndIndex.js ***!
  \*************************************************/
/***/ ((module) => {

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

module.exports = trimmedEndIndex;


/***/ }),

/***/ "./node_modules/lodash/debounce.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/debounce.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    now = __webpack_require__(/*! ./now */ "./node_modules/lodash/now.js"),
    toNumber = __webpack_require__(/*! ./toNumber */ "./node_modules/lodash/toNumber.js");

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;


/***/ }),

/***/ "./node_modules/lodash/isObject.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isObject.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ "./node_modules/lodash/isObjectLike.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isObjectLike.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ "./node_modules/lodash/isSymbol.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isSymbol.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ "./node_modules/lodash/now.js":
/*!************************************!*\
  !*** ./node_modules/lodash/now.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


/***/ }),

/***/ "./node_modules/lodash/throttle.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/throttle.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var debounce = __webpack_require__(/*! ./debounce */ "./node_modules/lodash/debounce.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

module.exports = throttle;


/***/ }),

/***/ "./node_modules/lodash/toNumber.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/toNumber.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTrim = __webpack_require__(/*! ./_baseTrim */ "./node_modules/lodash/_baseTrim.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    isSymbol = __webpack_require__(/*! ./isSymbol */ "./node_modules/lodash/isSymbol.js");

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/singletonStyleDomAPI.js":
/*!************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/singletonStyleDomAPI.js ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join("\n");
  };
}();

/* istanbul ignore next  */
function apply(styleElement, index, remove, obj) {
  var css;
  if (remove) {
    css = "";
  } else {
    css = "";
    if (obj.supports) {
      css += "@supports (".concat(obj.supports, ") {");
    }
    if (obj.media) {
      css += "@media ".concat(obj.media, " {");
    }
    var needLayer = typeof obj.layer !== "undefined";
    if (needLayer) {
      css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
    }
    css += obj.css;
    if (needLayer) {
      css += "}";
    }
    if (obj.media) {
      css += "}";
    }
    if (obj.supports) {
      css += "}";
    }
  }

  // For old IE
  /* istanbul ignore if  */
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = styleElement.childNodes;
    if (childNodes[index]) {
      styleElement.removeChild(childNodes[index]);
    }
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index]);
    } else {
      styleElement.appendChild(cssNode);
    }
  }
}
var singletonData = {
  singleton: null,
  singletonCounter: 0
};

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") return {
    update: function update() {},
    remove: function remove() {}
  };

  // eslint-disable-next-line no-undef,no-use-before-define
  var styleIndex = singletonData.singletonCounter++;
  var styleElement =
  // eslint-disable-next-line no-undef,no-use-before-define
  singletonData.singleton || (
  // eslint-disable-next-line no-undef,no-use-before-define
  singletonData.singleton = options.insertStyleElement(options));
  return {
    update: function update(obj) {
      apply(styleElement, styleIndex, false, obj);
    },
    remove: function remove(obj) {
      apply(styleElement, styleIndex, true, obj);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/ua-parser-js/src/main/ua-parser.mjs":
/*!**********************************************************!*\
  !*** ./node_modules/ua-parser-js/src/main/ua-parser.mjs ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UAParser: () => (/* binding */ UAParser)
/* harmony export */ });
// Generated ESM version of ua-parser-js
// DO NOT EDIT THIS FILE!
// Source: /src/main/ua-parser.js

/////////////////////////////////////////////////////////////////////////////////
/* UAParser.js v2.0.3
   Copyright © 2012-2025 Faisal Salman <f@faisalman.com>
   AGPLv3 License *//*
   Detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data.
   Supports browser & node.js environment. 
   Demo   : https://uaparser.dev
   Source : https://github.com/faisalman/ua-parser-js */
/////////////////////////////////////////////////////////////////////////////////

/* jshint esversion: 6 */ 
/* globals window */


    
    //////////////
    // Constants
    /////////////

    var LIBVERSION  = '2.0.3',
        UA_MAX_LENGTH = 500,
        USER_AGENT  = 'user-agent',
        EMPTY       = '',
        UNKNOWN     = '?',

        // typeof
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',

        // properties
        UA_BROWSER  = 'browser',
        UA_CPU      = 'cpu',
        UA_DEVICE   = 'device',
        UA_ENGINE   = 'engine',
        UA_OS       = 'os',
        UA_RESULT   = 'result',
        
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        MAJOR       = 'major',
        MODEL       = 'model',

        // device types
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        XR          = 'xr',
        EMBEDDED    = 'embedded',

        // browser types
        INAPP       = 'inapp',

        // client hints
        BRANDS      = 'brands',
        FORMFACTORS = 'formFactors',
        FULLVERLIST = 'fullVersionList',
        PLATFORM    = 'platform',
        PLATFORMVER = 'platformVersion',
        BITNESS     = 'bitness',
        CH_HEADER   = 'sec-ch-ua',
        CH_HEADER_FULL_VER_LIST = CH_HEADER + '-full-version-list',
        CH_HEADER_ARCH      = CH_HEADER + '-arch',
        CH_HEADER_BITNESS   = CH_HEADER + '-' + BITNESS,
        CH_HEADER_FORM_FACTORS = CH_HEADER + '-form-factors',
        CH_HEADER_MOBILE    = CH_HEADER + '-' + MOBILE,
        CH_HEADER_MODEL     = CH_HEADER + '-' + MODEL,
        CH_HEADER_PLATFORM  = CH_HEADER + '-' + PLATFORM,
        CH_HEADER_PLATFORM_VER = CH_HEADER_PLATFORM + '-version',
        CH_ALL_VALUES       = [BRANDS, FULLVERLIST, MOBILE, MODEL, PLATFORM, PLATFORMVER, ARCHITECTURE, FORMFACTORS, BITNESS],

        // device vendors
        AMAZON      = 'Amazon',
        APPLE       = 'Apple',
        ASUS        = 'ASUS',
        BLACKBERRY  = 'BlackBerry',
        GOOGLE      = 'Google',
        HUAWEI      = 'Huawei',
        LENOVO      = 'Lenovo',
        HONOR       = 'Honor',
        LG          = 'LG',
        MICROSOFT   = 'Microsoft',
        MOTOROLA    = 'Motorola',
        NVIDIA      = 'Nvidia',
        ONEPLUS     = 'OnePlus',
        OPPO        = 'OPPO',
        SAMSUNG     = 'Samsung',
        SHARP       = 'Sharp',
        SONY        = 'Sony',
        XIAOMI      = 'Xiaomi',
        ZEBRA       = 'Zebra',

        // browsers
        CHROME      = 'Chrome',
        CHROMIUM    = 'Chromium',
        CHROMECAST  = 'Chromecast',
        EDGE        = 'Edge',
        FIREFOX     = 'Firefox',
        OPERA       = 'Opera',
        FACEBOOK    = 'Facebook',
        SOGOU       = 'Sogou',

        PREFIX_MOBILE  = 'Mobile ',
        SUFFIX_BROWSER = ' Browser',

        // os
        WINDOWS     = 'Windows';
   
    var isWindow            = typeof window !== UNDEF_TYPE,
        NAVIGATOR           = (isWindow && window.navigator) ? 
                                window.navigator : 
                                undefined,
        NAVIGATOR_UADATA    = (NAVIGATOR && NAVIGATOR.userAgentData) ? 
                                NAVIGATOR.userAgentData : 
                                undefined;

    ///////////
    // Helper
    //////////

    var extend = function (defaultRgx, extensions) {
            var mergedRgx = {};
            var extraRgx = extensions;
            if (!isExtensions(extensions)) {
                extraRgx = {};
                for (var i in extensions) {
                    for (var j in extensions[i]) {
                        extraRgx[j] = extensions[i][j].concat(extraRgx[j] ? extraRgx[j] : []);
                    }
                }
            }
            for (var k in defaultRgx) {
                mergedRgx[k] = extraRgx[k] && extraRgx[k].length % 2 === 0 ? extraRgx[k].concat(defaultRgx[k]) : defaultRgx[k];
            }
            return mergedRgx;
        },
        enumerize = function (arr) {
            var enums = {};
            for (var i=0; i<arr.length; i++) {
                enums[arr[i].toUpperCase()] = arr[i];
            }
            return enums;
        },
        has = function (str1, str2) {
            if (typeof str1 === OBJ_TYPE && str1.length > 0) {
                for (var i in str1) {
                    if (lowerize(str1[i]) == lowerize(str2)) return true;
                }
                return false;
            }
            return isString(str1) ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false;
        },
        isExtensions = function (obj, deep) {
            for (var prop in obj) {
                return /^(browser|cpu|device|engine|os)$/.test(prop) || (deep ? isExtensions(obj[prop]) : false);
            }
        },
        isString = function (val) {
            return typeof val === STR_TYPE;
        },
        itemListToArray = function (header) {
            if (!header) return undefined;
            var arr = [];
            var tokens = strip(/\\?\"/g, header).split(',');
            for (var i = 0; i < tokens.length; i++) {
                if (tokens[i].indexOf(';') > -1) {
                    var token = trim(tokens[i]).split(';v=');
                    arr[i] = { brand : token[0], version : token[1] };
                } else {
                    arr[i] = trim(tokens[i]);
                }
            }
            return arr;
        },
        lowerize = function (str) {
            return isString(str) ? str.toLowerCase() : str;
        },
        majorize = function (version) {
            return isString(version) ? strip(/[^\d\.]/g, version).split('.')[0] : undefined;
        },
        setProps = function (arr) {
            for (var i in arr) {
                var propName = arr[i];
                if (typeof propName == OBJ_TYPE && propName.length == 2) {
                    this[propName[0]] = propName[1];
                } else {
                    this[propName] = undefined;
                }
            }
            return this;
        },
        strip = function (pattern, str) {
            return isString(str) ? str.replace(pattern, EMPTY) : str;
        },
        stripQuotes = function (str) {
            return strip(/\\?\"/g, str); 
        },
        trim = function (str, len) {
            if (isString(str)) {
                str = strip(/^\s\s*/, str);
                return typeof len === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
            }
    };

    ///////////////
    // Map helper
    //////////////

    var rgxMapper = function (ua, arrays) {

            if(!ua || !arrays) return;

            var i = 0, j, k, p, q, matches, match;

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],       // even sequence (0,2,4,..)
                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    if (!regex[j]) { break; }
                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length === 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length === 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length === 4) {
                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                this[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
        },

        strMapper = function (str, map) {

            for (var i in map) {
                // check if current value is array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return map.hasOwnProperty('*') ? map['*'] : str;
    };

    ///////////////
    // String map
    //////////////

    var windowsVersionMap = {
            'ME'        : '4.90',
            'NT 3.11'   : 'NT3.51',
            'NT 4.0'    : 'NT4.0',
            '2000'      : 'NT 5.0',
            'XP'        : ['NT 5.1', 'NT 5.2'],
            'Vista'     : 'NT 6.0',
            '7'         : 'NT 6.1',
            '8'         : 'NT 6.2',
            '8.1'       : 'NT 6.3',
            '10'        : ['NT 6.4', 'NT 10.0'],
            'RT'        : 'ARM'
        },
        
        formFactorsMap = {
            'embedded'  : 'Automotive',
            'mobile'    : 'Mobile',
            'tablet'    : ['Tablet', 'EInk'],
            'smarttv'   : 'TV',
            'wearable'  : 'Watch',
            'xr'        : ['VR', 'XR'],
            '?'         : ['Desktop', 'Unknown'],
            '*'         : undefined
    };

    //////////////
    // Regex map
    /////////////

    var defaultRegexes = {

        browser : [[

            // Most common regardless engine
            /\b(?:crmo|crios)\/([\w\.]+)/i                                      // Chrome for Android/iOS
            ], [VERSION, [NAME, PREFIX_MOBILE + 'Chrome']], [
            /edg(?:e|ios|a)?\/([\w\.]+)/i                                       // Microsoft Edge
            ], [VERSION, [NAME, 'Edge']], [

            // Presto based
            /(opera mini)\/([-\w\.]+)/i,                                        // Opera Mini
            /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,                 // Opera Mobi/Tablet
            /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i                           // Opera
            ], [NAME, VERSION], [
            /opios[\/ ]+([\w\.]+)/i                                             // Opera mini on iphone >= 8.0
            ], [VERSION, [NAME, OPERA+' Mini']], [
            /\bop(?:rg)?x\/([\w\.]+)/i                                          // Opera GX
            ], [VERSION, [NAME, OPERA+' GX']], [
            /\bopr\/([\w\.]+)/i                                                 // Opera Webkit
            ], [VERSION, [NAME, OPERA]], [

            // Mixed
            /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i            // Baidu
            ], [VERSION, [NAME, 'Baidu']], [
            /\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i                       // Maxthon
            ], [VERSION, [NAME, 'Maxthon']], [
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i,      
                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer/Sleipnir
            // Trident based
            /(avant|iemobile|slim(?:browser|boat|jet))[\/ ]?([\d\.]*)/i,        // Avant/IEMobile/SlimBrowser/SlimBoat/Slimjet
            /(?:ms|\()(ie) ([\w\.]+)/i,                                         // Internet Explorer

            // Blink/Webkit/KHTML based                                         // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon/LG Browser/Otter/qutebrowser/Dooble
            /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio|(?=comodo_)?dragon|otter|dooble|(?:lg |qute)browser)\/([-\w\.]+)/i,
                                                                                // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ//Vivaldi/DuckDuckGo/Klar/Helio/Dragon
            /(heytap|ovi|115|surf)browser\/([\d\.]+)/i,                         // HeyTap/Ovi/115/Surf
            /(ecosia|weibo)(?:__| \w+@)([\d\.]+)/i                              // Ecosia/Weibo
            ], [NAME, VERSION], [
            /quark(?:pc)?\/([-\w\.]+)/i                                         // Quark
            ], [VERSION, [NAME, 'Quark']], [
            /\bddg\/([\w\.]+)/i                                                 // DuckDuckGo
            ], [VERSION, [NAME, 'DuckDuckGo']], [
            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i                 // UCBrowser
            ], [VERSION, [NAME, 'UCBrowser']], [
            /microm.+\bqbcore\/([\w\.]+)/i,                                     // WeChat Desktop for Windows Built-in Browser
            /\bqbcore\/([\w\.]+).+microm/i,
            /micromessenger\/([\w\.]+)/i                                        // WeChat
            ], [VERSION, [NAME, 'WeChat']], [
            /konqueror\/([\w\.]+)/i                                             // Konqueror
            ], [VERSION, [NAME, 'Konqueror']], [
            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i                       // IE11
            ], [VERSION, [NAME, 'IE']], [
            /ya(?:search)?browser\/([\w\.]+)/i                                  // Yandex
            ], [VERSION, [NAME, 'Yandex']], [
            /slbrowser\/([\w\.]+)/i                                             // Smart Lenovo Browser
            ], [VERSION, [NAME, 'Smart ' + LENOVO + SUFFIX_BROWSER]], [
            /(avast|avg)\/([\w\.]+)/i                                           // Avast/AVG Secure Browser
            ], [[NAME, /(.+)/, '$1 Secure' + SUFFIX_BROWSER], VERSION], [
            /\bfocus\/([\w\.]+)/i                                               // Firefox Focus
            ], [VERSION, [NAME, FIREFOX+' Focus']], [
            /\bopt\/([\w\.]+)/i                                                 // Opera Touch
            ], [VERSION, [NAME, OPERA+' Touch']], [
            /coc_coc\w+\/([\w\.]+)/i                                            // Coc Coc Browser
            ], [VERSION, [NAME, 'Coc Coc']], [
            /dolfin\/([\w\.]+)/i                                                // Dolphin
            ], [VERSION, [NAME, 'Dolphin']], [
            /coast\/([\w\.]+)/i                                                 // Opera Coast
            ], [VERSION, [NAME, OPERA+' Coast']], [
            /miuibrowser\/([\w\.]+)/i                                           // MIUI Browser
            ], [VERSION, [NAME, 'MIUI' + SUFFIX_BROWSER]], [
            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, PREFIX_MOBILE + FIREFOX]], [
            /\bqihoobrowser\/?([\w\.]*)/i                                       // 360
            ], [VERSION, [NAME, '360']], [
            /\b(qq)\/([\w\.]+)/i                                                // QQ
            ], [[NAME, /(.+)/, '$1Browser'], VERSION], [
            /(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i
            ], [[NAME, /(.+)/, '$1' + SUFFIX_BROWSER], VERSION], [              // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
            /samsungbrowser\/([\w\.]+)/i                                        // Samsung Internet
            ], [VERSION, [NAME, SAMSUNG + ' Internet']], [
            /metasr[\/ ]?([\d\.]+)/i                                            // Sogou Explorer
            ], [VERSION, [NAME, SOGOU + ' Explorer']], [
            /(sogou)mo\w+\/([\d\.]+)/i                                          // Sogou Mobile
            ], [[NAME, SOGOU + ' Mobile'], VERSION], [
            /(electron)\/([\w\.]+) safari/i,                                    // Electron-based App
            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,                   // Tesla
            /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i   // QQ/2345
            ], [NAME, VERSION], [
            /(lbbrowser|rekonq)/i                                               // LieBao Browser/Rekonq
            ], [NAME], [
            /ome\/([\w\.]+) \w* ?(iron) saf/i,                                  // Iron
            /ome\/([\w\.]+).+qihu (360)[es]e/i                                  // 360
            ], [VERSION, NAME], [

            // WebView
            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i       // Facebook App for iOS & Android
            ], [[NAME, FACEBOOK], VERSION, [TYPE, INAPP]], [
            /(Klarna)\/([\w\.]+)/i,                                             // Klarna Shopping Browser for iOS & Android
            /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,                             // Kakao App
            /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,                                  // Naver InApp
            /(daum)apps[\/ ]([\w\.]+)/i,                                        // Daum App
            /safari (line)\/([\w\.]+)/i,                                        // Line App for iOS
            /\b(line)\/([\w\.]+)\/iab/i,                                        // Line App for Android
            /(alipay)client\/([\w\.]+)/i,                                       // Alipay
            /(twitter)(?:and| f.+e\/([\w\.]+))/i,                               // Twitter
            /(instagram|snapchat)[\/ ]([-\w\.]+)/i                              // Instagram/Snapchat
            ], [NAME, VERSION, [TYPE, INAPP]], [
            /\bgsa\/([\w\.]+) .*safari\//i                                      // Google Search Appliance on iOS
            ], [VERSION, [NAME, 'GSA'], [TYPE, INAPP]], [
            /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i                        // TikTok
            ], [VERSION, [NAME, 'TikTok'], [TYPE, INAPP]], [
            /\[(linkedin)app\]/i                                                // LinkedIn App for iOS & Android
            ], [NAME, [TYPE, INAPP]], [

            /(chromium)[\/ ]([-\w\.]+)/i                                        // Chromium
            ], [NAME, VERSION], [

            /headlesschrome(?:\/([\w\.]+)| )/i                                  // Chrome Headless
            ], [VERSION, [NAME, CHROME+' Headless']], [

            / wv\).+(chrome)\/([\w\.]+)/i                                       // Chrome WebView
            ], [[NAME, CHROME+' WebView'], VERSION], [

            /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i           // Android Browser
            ], [VERSION, [NAME, 'Android' + SUFFIX_BROWSER]], [

            /chrome\/([\w\.]+) mobile/i                                         // Chrome Mobile
            ], [VERSION, [NAME, PREFIX_MOBILE + 'Chrome']], [

            /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i       // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [NAME, VERSION], [

            /version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i                 // Safari Mobile
            ], [VERSION, [NAME, PREFIX_MOBILE + 'Safari']], [
            /iphone .*mobile(?:\/\w+ | ?)safari/i
            ], [[NAME, PREFIX_MOBILE + 'Safari']], [
            /version\/([\w\.\,]+) .*(safari)/i                                  // Safari
            ], [VERSION, NAME], [
            /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i                      // Safari < 3.0
            ], [NAME, [VERSION, '1']], [

            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(?:mobile|tablet);.*(firefox)\/([\w\.-]+)/i                        // Firefox Mobile
            ], [[NAME, PREFIX_MOBILE + FIREFOX], VERSION], [
            /(navigator|netscape\d?)\/([-\w\.]+)/i                              // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /(wolvic|librewolf)\/([\w\.]+)/i                                    // Wolvic/LibreWolf
            ], [NAME, VERSION], [
            /mobile vr; rv:([\w\.]+)\).+firefox/i                               // Firefox Reality
            ], [VERSION, [NAME, FIREFOX+' Reality']], [
            /ekiohf.+(flow)\/([\w\.]+)/i,                                       // Flow
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(firefox)\/([\w\.]+)/i,                                            // Other Firefox-based
            /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,                         // Mozilla

            // Other
            /(amaya|dillo|doris|icab|ladybird|lynx|mosaic|netsurf|obigo|polaris|w3m|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Obigo/Mosaic/Go/ICE/UP.Browser/Ladybird
            /\b(links) \(([\w\.]+)/i                                            // Links
            ], [NAME, [VERSION, /_/g, '.']], [
            
            /(cobalt)\/([\w\.]+)/i                                              // Cobalt
            ], [NAME, [VERSION, /[^\d\.]+./, EMPTY]]
        ],

        cpu : [[

            /\b((amd|x|x86[-_]?|wow|win)64)\b/i                                 // AMD64 (x64)
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i,                                                     // IA32 (quicktime)
            /\b((i[346]|x)86)(pc)?\b/i                                          // IA32 (x86)
            ], [[ARCHITECTURE, 'ia32']], [

            /\b(aarch64|arm(v?[89]e?l?|_?64))\b/i                               // ARM64
            ], [[ARCHITECTURE, 'arm64']], [

            /\b(arm(v[67])?ht?n?[fl]p?)\b/i                                     // ARMHF
            ], [[ARCHITECTURE, 'armhf']], [

            // PocketPC mistakenly identified as PowerPC
            /( (ce|mobile); ppc;|\/[\w\.]+arm\b)/i
            ], [[ARCHITECTURE, 'arm']], [

            /((ppc|powerpc)(64)?)( mac|;|\))/i                                  // PowerPC
            ], [[ARCHITECTURE, /ower/, EMPTY, lowerize]], [

            / sun4\w[;\)]/i                                                     // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, lowerize]]
        ],

        device : [[

            //////////////////////////
            // MOBILES & TABLETS
            /////////////////////////

            // Samsung
            /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]], [
            /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
            /samsung[- ]((?!sm-[lr])[-\w]+)/i,
            /sec-(sgh\w+)/i
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]], [

            // Apple
            /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i                          // iPod/iPhone
            ], [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]], [
            /\((ipad);[-\w\),; ]+apple/i,                                       // iPad
            /applecoremedia\/[\w\.]+ \((ipad)/i,
            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
            ], [MODEL, [VENDOR, APPLE], [TYPE, TABLET]], [
            /(macintosh);/i
            ], [MODEL, [VENDOR, APPLE]], [

            // Sharp
            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
            ], [MODEL, [VENDOR, SHARP], [TYPE, MOBILE]], [

            // Honor
            /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
            ], [MODEL, [VENDOR, HONOR], [TYPE, TABLET]], [
            /honor([-\w ]+)[;\)]/i
            ], [MODEL, [VENDOR, HONOR], [TYPE, MOBILE]], [

            // Huawei
            /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]], [
            /(?:huawei)([-\w ]+)[;\)]/i,
            /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]], [

            // Xiaomi
            /oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,
            /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i                                // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, TABLET]], [

            /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,                  // Xiaomi POCO
            /\b; (\w+) build\/hm\1/i,                                           // Xiaomi Hongmi 'numeric' models
            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,                             // Xiaomi Hongmi
            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,                   // Xiaomi Redmi
            /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,        // Xiaomi Redmi 'numeric' models
            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite|pro)?)(?: bui|\))/i, // Xiaomi Mi
            / ([\w ]+) miui\/v?\d/i
            ], [[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, MOBILE]], [

            // OPPO
            /; (\w+) bui.+ oppo/i,
            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
            ], [MODEL, [VENDOR, OPPO], [TYPE, MOBILE]], [
            /\b(opd2(\d{3}a?))(?: bui|\))/i
            ], [MODEL, [VENDOR, strMapper, { 'OnePlus' : ['304', '403', '203'], '*' : OPPO }], [TYPE, TABLET]], [

            // BLU Vivo Series
            /(vivo (5r?|6|8l?|go|one|s|x[il]?[2-4]?)[\w\+ ]*)(?: bui|\))/i
            ], [MODEL, [VENDOR, 'BLU'], [TYPE, MOBILE]], [            
            // Vivo
            /; vivo (\w+)(?: bui|\))/i,
            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
            ], [MODEL, [VENDOR, 'Vivo'], [TYPE, MOBILE]], [

            // Realme
            /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
            ], [MODEL, [VENDOR, 'Realme'], [TYPE, MOBILE]], [

            // Motorola
            /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
            /\bmot(?:orola)?[- ](\w*)/i,
            /((?:moto(?! 360)[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]], [
            /\b(mz60\d|xoom[2 ]{0,2}) build\//i
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]], [

            // LG
            /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
            ], [MODEL, [VENDOR, LG], [TYPE, TABLET]], [
            /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
            /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch))(\w+)/i,
            /\blg-?([\d\w]+) bui/i
            ], [MODEL, [VENDOR, LG], [TYPE, MOBILE]], [

            // Lenovo
            /(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i,
            /lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i
            ], [MODEL, [VENDOR, LENOVO], [TYPE, TABLET]], [

            // Nokia
            /(nokia) (t[12][01])/i
            ], [VENDOR, MODEL, [TYPE, TABLET]], [
            /(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i,
            /nokia[-_ ]?(([-\w\. ]*))/i
            ], [[MODEL, /_/g, ' '], [TYPE, MOBILE], [VENDOR, 'Nokia']], [

            // Google
            /(pixel (c|tablet))\b/i                                             // Google Pixel C/Tablet
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]], [
            /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i                         // Google Pixel
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]], [

            // Sony
            /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
            ], [MODEL, [VENDOR, SONY], [TYPE, MOBILE]], [
            /sony tablet [ps]/i,
            /\b(?:sony)?sgp\w+(?: bui|\))/i
            ], [[MODEL, 'Xperia Tablet'], [VENDOR, SONY], [TYPE, TABLET]], [

            // OnePlus
            / (kb2005|in20[12]5|be20[12][59])\b/i,
            /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
            ], [MODEL, [VENDOR, ONEPLUS], [TYPE, MOBILE]], [

            // Amazon
            /(alexa)webm/i,
            /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,                           // Kindle Fire without Silk / Echo Show
            /(kf[a-z]+)( bui|\)).+silk\//i                                      // Kindle Fire HD
            ], [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]], [
            /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i                     // Fire Phone
            ], [[MODEL, /(.+)/g, 'Fire Phone $1'], [VENDOR, AMAZON], [TYPE, MOBILE]], [

            // BlackBerry
            /(playbook);[-\w\),; ]+(rim)/i                                      // BlackBerry PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [
            /\b((?:bb[a-f]|st[hv])100-\d)/i,
            /\(bb10; (\w+)/i                                                    // BlackBerry 10
            ], [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]], [

            // Asus
            /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
            ], [MODEL, [VENDOR, ASUS], [TYPE, TABLET]], [
            / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
            ], [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]], [

            // HTC
            /(nexus 9)/i                                                        // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [
            /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,                         // HTC

            // ZTE
            /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
            /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i         // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            // TCL
            /tcl (xess p17aa)/i,
            /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])(_\w(\w|\w\w))?(\)| bui)/i
            ], [MODEL, [VENDOR, 'TCL'], [TYPE, TABLET]], [
            /droid [\w\.]+; (418(?:7d|8v)|5087z|5102l|61(?:02[dh]|25[adfh]|27[ai]|56[dh]|59k|65[ah])|a509dl|t(?:43(?:0w|1[adepqu])|50(?:6d|7[adju])|6(?:09dl|10k|12b|71[efho]|76[hjk])|7(?:66[ahju]|67[hw]|7[045][bh]|71[hk]|73o|76[ho]|79w|81[hks]?|82h|90[bhsy]|99b)|810[hs]))(_\w(\w|\w\w))?(\)| bui)/i
            ], [MODEL, [VENDOR, 'TCL'], [TYPE, MOBILE]], [

            // itel
            /(itel) ((\w+))/i
            ], [[VENDOR, lowerize], MODEL, [TYPE, strMapper, { 'tablet' : ['p10001l', 'w7001'], '*' : 'mobile' }]], [

            // Acer
            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            // Meizu
            /droid.+; (m[1-5] note) bui/i,
            /\bmz-([-\w]{2,})/i
            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, MOBILE]], [
                
            // Ulefone
            /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
            ], [MODEL, [VENDOR, 'Ulefone'], [TYPE, MOBILE]], [

            // Energizer
            /; (energy ?\w+)(?: bui|\))/i,
            /; energizer ([\w ]+)(?: bui|\))/i
            ], [MODEL, [VENDOR, 'Energizer'], [TYPE, MOBILE]], [

            // Cat
            /; cat (b35);/i,
            /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i
            ], [MODEL, [VENDOR, 'Cat'], [TYPE, MOBILE]], [

            // Smartfren
            /((?:new )?andromax[\w- ]+)(?: bui|\))/i
            ], [MODEL, [VENDOR, 'Smartfren'], [TYPE, MOBILE]], [

            // Nothing
            /droid.+; (a(?:015|06[35]|142p?))/i
            ], [MODEL, [VENDOR, 'Nothing'], [TYPE, MOBILE]], [

            // Archos
            /; (x67 5g|tikeasy \w+|ac[1789]\d\w+)( b|\))/i,
            /archos ?(5|gamepad2?|([\w ]*[t1789]|hello) ?\d+[\w ]*)( b|\))/i
            ], [MODEL, [VENDOR, 'Archos'], [TYPE, TABLET]], [
            /archos ([\w ]+)( b|\))/i,
            /; (ac[3-6]\d\w{2,8})( b|\))/i 
            ], [MODEL, [VENDOR, 'Archos'], [TYPE, MOBILE]], [

            // MIXED
            /(imo) (tab \w+)/i,                                                 // IMO
            /(infinix) (x1101b?)/i                                              // Infinix XPad
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus(?! zenw)|dell|jolla|meizu|motorola|polytron|infinix|tecno|micromax|advan)[-_ ]?([-\w]*)/i,
                                                                                // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron/Infinix/Tecno/Micromax/Advan
            /; (blu|hmd|imo|tcl)[_ ]([\w\+ ]+?)(?: bui|\)|; r)/i,               // BLU/HMD/IMO/TCL
            /(hp) ([\w ]+\w)/i,                                                 // HP iPAQ
            /(microsoft); (lumia[\w ]+)/i,                                      // Microsoft Lumia
            /(lenovo)[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i,                          // Lenovo
            /(oppo) ?([\w ]+) bui/i                                             // OPPO
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /(kobo)\s(ereader|touch)/i,                                         // Kobo
            /(hp).+(touchpad(?!.+tablet)|tablet)/i,                             // HP TouchPad
            /(kindle)\/([\w\.]+)/i                                              // Kindle
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(surface duo)/i                                                    // Surface Duo
            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]], [
            /droid [\d\.]+; (fp\du?)(?: b|\))/i                                 // Fairphone
            ], [MODEL, [VENDOR, 'Fairphone'], [TYPE, MOBILE]], [
            /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i              // Nvidia Tablets
            ], [MODEL, [VENDOR, NVIDIA], [TYPE, TABLET]], [
            /(sprint) (\w+)/i                                                   // Sprint Phones
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, MICROSOFT], [TYPE, MOBILE]], [
            /droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i               // Zebra
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]], [
            /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]], [

            ///////////////////
            // SMARTTVS
            ///////////////////

            /smart-tv.+(samsung)/i                                              // Samsung
            ], [VENDOR, [TYPE, SMARTTV]], [
            /hbbtv.+maple;(\d+)/i
            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, SAMSUNG], [TYPE, SMARTTV]], [
            /tcast.+(lg)e?. ([-\w]+)/i                                          // LG SmartTV
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
            ], [[VENDOR, LG], [TYPE, SMARTTV]], [
            /(apple) ?tv/i                                                      // Apple TV
            ], [VENDOR, [MODEL, APPLE+' TV'], [TYPE, SMARTTV]], [
            /crkey.*devicetype\/chromecast/i                                    // Google Chromecast Third Generation
            ], [[MODEL, CHROMECAST+' Third Generation'], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [
            /crkey.*devicetype\/([^/]*)/i                                       // Google Chromecast with specific device type
            ], [[MODEL, /^/, 'Chromecast '], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [
            /fuchsia.*crkey/i                                                   // Google Chromecast Nest Hub
            ], [[MODEL, CHROMECAST+' Nest Hub'], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [
            /crkey/i                                                            // Google Chromecast, Linux-based or unknown
            ], [[MODEL, CHROMECAST], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [
            /(portaltv)/i                                                       // Facebook Portal TV
            ], [MODEL, [VENDOR, FACEBOOK], [TYPE, SMARTTV]], [
            /droid.+aft(\w+)( bui|\))/i                                         // Fire TV
            ], [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]], [
            /(shield \w+ tv)/i                                                  // Nvidia Shield TV
            ], [MODEL, [VENDOR, NVIDIA], [TYPE, SMARTTV]], [
            /\(dtv[\);].+(aquos)/i,
            /(aquos-tv[\w ]+)\)/i                                               // Sharp
            ], [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]],[
            /(bravia[\w ]+)( bui|\))/i                                          // Sony
            ], [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]], [
            /(mi(tv|box)-?\w+) bui/i                                            // Xiaomi
            ], [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]], [
            /Hbbtv.*(technisat) (.*);/i                                         // TechniSAT
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,                          // Roku
            /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i         // HbbTV devices
            ], [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]], [
                                                                                // SmartTV from Unidentified Vendors
            /droid.+; ([\w- ]+) (?:android tv|smart[- ]?tv)/i
            ], [MODEL, [TYPE, SMARTTV]], [
            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i
            ], [[TYPE, SMARTTV]], [

            ///////////////////
            // CONSOLES
            ///////////////////

            /(ouya)/i,                                                          // Ouya
            /(nintendo) (\w+)/i                                                 // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [
            /droid.+; (shield)( bui|\))/i                                       // Nvidia Portable
            ], [MODEL, [VENDOR, NVIDIA], [TYPE, CONSOLE]], [
            /(playstation \w+)/i                                                // Playstation
            ], [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]], [
            /\b(xbox(?: one)?(?!; xbox))[\); ]/i                                // Microsoft Xbox
            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]], [

            ///////////////////
            // WEARABLES
            ///////////////////

            /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i                       // Samsung Galaxy Watch
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, WEARABLE]], [
            /((pebble))app/i,                                                   // Pebble
            /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i        // Asus ZenWatch / LG Watch / Pixel Watch
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [
            /(ow(?:19|20)?we?[1-3]{1,3})/i                                      // Oppo Watch
            ], [MODEL, [VENDOR, OPPO], [TYPE, WEARABLE]], [
            /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i                              // Apple Watch
            ], [MODEL, [VENDOR, APPLE], [TYPE, WEARABLE]], [
            /(opwwe\d{3})/i                                                     // OnePlus Watch
            ], [MODEL, [VENDOR, ONEPLUS], [TYPE, WEARABLE]], [
            /(moto 360)/i                                                       // Motorola 360
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, WEARABLE]], [
            /(smartwatch 3)/i                                                   // Sony SmartWatch
            ], [MODEL, [VENDOR, SONY], [TYPE, WEARABLE]], [
            /(g watch r)/i                                                      // LG G Watch R
            ], [MODEL, [VENDOR, LG], [TYPE, WEARABLE]], [
            /droid.+; (wt63?0{2,3})\)/i
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]], [

            ///////////////////
            // XR
            ///////////////////

            /droid.+; (glass) \d/i                                              // Google Glass
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, XR]], [
            /(pico) (4|neo3(?: link|pro)?)/i                                    // Pico
            ], [VENDOR, MODEL, [TYPE, XR]], [
            /(quest( \d| pro)?s?).+vr/i                                         // Meta Quest
            ], [MODEL, [VENDOR, FACEBOOK], [TYPE, XR]], [

            ///////////////////
            // EMBEDDED
            ///////////////////

            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i                              // Tesla
            ], [VENDOR, [TYPE, EMBEDDED]], [
            /(aeobc)\b/i                                                        // Echo Dot
            ], [MODEL, [VENDOR, AMAZON], [TYPE, EMBEDDED]], [
            /(homepod).+mac os/i                                                // Apple HomePod
            ], [MODEL, [VENDOR, APPLE], [TYPE, EMBEDDED]], [
            /windows iot/i
            ], [[TYPE, EMBEDDED]], [

            ////////////////////
            // MIXED (GENERIC)
            ///////////////////

            /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+?(mobile|vr|\d) safari/i
            ], [MODEL, [TYPE, strMapper, { 'mobile' : 'Mobile', 'xr' : 'VR', '*' : TABLET }]], [
            /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i                      // Unidentifiable Tablet
            ], [[TYPE, TABLET]], [
            /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i    // Unidentifiable Mobile
            ], [[TYPE, MOBILE]], [
            /droid .+?; ([\w\. -]+)( bui|\))/i                                  // Generic Android Device
            ], [MODEL, [VENDOR, 'Generic']]
        ],

        engine : [[

            /windows.+ edge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, EDGE+'HTML']], [

            /(arkweb)\/([\w\.]+)/i                                              // ArkWeb
            ], [NAME, VERSION], [

            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i                         // Blink
            ], [VERSION, [NAME, 'Blink']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna|servo)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna/Servo
            /ekioh(flow)\/([\w\.]+)/i,                                          // Flow
            /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,                           // KHTML/Tasman/Links
            /(icab)[\/ ]([23]\.[\d\.]+)/i,                                      // iCab

            /\b(libweb)/i                                                       // LibWeb
            ], [NAME, VERSION], [
            /ladybird\//i
            ], [[NAME, 'LibWeb']], [

            /rv\:([\w\.]{1,9})\b.+(gecko)/i                                     // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows
            /microsoft (windows) (vista|xp)/i                                   // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows (?:phone(?: os)?|mobile|iot))[\/ ]?([\d\.\w ]*)/i         // Windows Phone
            ], [NAME, [VERSION, strMapper, windowsVersionMap]], [
            /windows nt 6\.2; (arm)/i,                                          // Windows RT
            /windows[\/ ]([ntce\d\. ]+\w)(?!.+xbox)/i,
            /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i
            ], [[VERSION, strMapper, windowsVersionMap], [NAME, WINDOWS]], [

            // iOS/macOS
            /[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,             // iOS
            /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
            /cfnetwork\/.+darwin/i
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [
            /(mac os x) ?([\w\. ]*)/i,
            /(macintosh|mac_powerpc\b)(?!.+haiku)/i                             // Mac OS
            ], [[NAME, 'macOS'], [VERSION, /_/g, '.']], [

            // Google Chromecast
            /android ([\d\.]+).*crkey/i                                         // Google Chromecast, Android-based
            ], [VERSION, [NAME, CHROMECAST + ' Android']], [
            /fuchsia.*crkey\/([\d\.]+)/i                                        // Google Chromecast, Fuchsia-based
            ], [VERSION, [NAME, CHROMECAST + ' Fuchsia']], [
            /crkey\/([\d\.]+).*devicetype\/smartspeaker/i                       // Google Chromecast, Linux-based Smart Speaker
            ], [VERSION, [NAME, CHROMECAST + ' SmartSpeaker']], [
            /linux.*crkey\/([\d\.]+)/i                                          // Google Chromecast, Legacy Linux-based
            ], [VERSION, [NAME, CHROMECAST + ' Linux']], [
            /crkey\/([\d\.]+)/i                                                 // Google Chromecast, unknown
            ], [VERSION, [NAME, CHROMECAST]], [

            // Mobile OSes
            /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i                    // Android-x86/HarmonyOS
            ], [VERSION, NAME], [                                               
            /(ubuntu) ([\w\.]+) like android/i                                  // Ubuntu Touch
            ], [[NAME, /(.+)/, '$1 Touch'], VERSION], [
                                                                                // Android/Blackberry/WebOS/QNX/Bada/RIM/KaiOS/Maemo/MeeGo/S40/Sailfish OS/OpenHarmony/Tizen
            /(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen|webos)\w*[-\/\.; ]?([\d\.]*)/i
            ], [NAME, VERSION], [
            /\(bb(10);/i                                                        // BlackBerry 10
            ], [VERSION, [NAME, BLACKBERRY]], [
            /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i       // Symbian
            ], [VERSION, [NAME, 'Symbian']], [
            /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i // Firefox OS
            ], [VERSION, [NAME, FIREFOX+' OS']], [
            /web0s;.+rt(tv)/i,
            /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i                              // WebOS
            ], [VERSION, [NAME, 'webOS']], [
            /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i                              // watchOS
            ], [VERSION, [NAME, 'watchOS']], [

            // Google ChromeOS
            /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i                                  // Chromium OS
            ], [[NAME, "Chrome OS"], VERSION],[

            // Smart TVs
            /panasonic;(viera)/i,                                               // Panasonic Viera
            /(netrange)mmh/i,                                                   // Netrange
            /(nettv)\/(\d+\.[\w\.]+)/i,                                         // NetTV

            // Console
            /(nintendo|playstation) (\w+)/i,                                    // Nintendo/Playstation
            /(xbox); +xbox ([^\);]+)/i,                                         // Microsoft Xbox (360, One, X, S, Series X, Series S)
            /(pico) .+os([\w\.]+)/i,                                            // Pico

            // Other
            /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,                            // Joli/Palm
            /(mint)[\/\(\) ]?(\w*)/i,                                           // Mint
            /(mageia|vectorlinux)[; ]/i,                                        // Mageia/VectorLinux
            /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
                                                                                // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
            /(hurd|linux)(?: arm\w*| x86\w*| ?)([\w\.]*)/i,                     // Hurd/Linux
            /(gnu) ?([\w\.]*)/i,                                                // GNU
            /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
            /(haiku) (\w+)/i                                                    // Haiku
            ], [NAME, VERSION], [
            /(sunos) ?([\w\.\d]*)/i                                             // Solaris
            ], [[NAME, 'Solaris'], VERSION], [
            /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,                              // Solaris
            /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,                                  // AIX
            /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX/SerenityOS
            /(unix) ?([\w\.]*)/i                                                // UNIX
            ], [NAME, VERSION]
        ]
    };

    /////////////////
    // Factories
    ////////////////

    var defaultProps = (function () {
            var props = { init : {}, isIgnore : {}, isIgnoreRgx : {}, toString : {}};
            setProps.call(props.init, [
                [UA_BROWSER, [NAME, VERSION, MAJOR, TYPE]],
                [UA_CPU, [ARCHITECTURE]],
                [UA_DEVICE, [TYPE, MODEL, VENDOR]],
                [UA_ENGINE, [NAME, VERSION]],
                [UA_OS, [NAME, VERSION]]
            ]);
            setProps.call(props.isIgnore, [
                [UA_BROWSER, [VERSION, MAJOR]],
                [UA_ENGINE, [VERSION]],
                [UA_OS, [VERSION]]
            ]);
            setProps.call(props.isIgnoreRgx, [
                [UA_BROWSER, / ?browser$/i],
                [UA_OS, / ?os$/i]
            ]);
            setProps.call(props.toString, [
                [UA_BROWSER, [NAME, VERSION]],
                [UA_CPU, [ARCHITECTURE]],
                [UA_DEVICE, [VENDOR, MODEL]],
                [UA_ENGINE, [NAME, VERSION]],
                [UA_OS, [NAME, VERSION]]
            ]);
            return props;
    })();

    var createIData = function (item, itemType) {

        var init_props = defaultProps.init[itemType],
            is_ignoreProps = defaultProps.isIgnore[itemType] || 0,
            is_ignoreRgx = defaultProps.isIgnoreRgx[itemType] || 0,
            toString_props = defaultProps.toString[itemType] || 0;

        function IData () {
            setProps.call(this, init_props);
        }

        IData.prototype.getItem = function () {
            return item;
        };

        IData.prototype.withClientHints = function () {

            // nodejs / non-client-hints browsers
            if (!NAVIGATOR_UADATA) {
                return item
                        .parseCH()
                        .get();
            }

            // browsers based on chromium 85+
            return NAVIGATOR_UADATA
                    .getHighEntropyValues(CH_ALL_VALUES)
                    .then(function (res) {
                        return item
                                .setCH(new UACHData(res, false))
                                .parseCH()
                                .get();
            });
        };

        IData.prototype.withFeatureCheck = function () {
            return item.detectFeature().get();
        };

        if (itemType != UA_RESULT) {
            IData.prototype.is = function (strToCheck) {
                var is = false;
                for (var i in this) {
                    if (this.hasOwnProperty(i) && !has(is_ignoreProps, i) && lowerize(is_ignoreRgx ? strip(is_ignoreRgx, this[i]) : this[i]) == lowerize(is_ignoreRgx ? strip(is_ignoreRgx, strToCheck) : strToCheck)) {
                        is = true;
                        if (strToCheck != UNDEF_TYPE) break;
                    } else if (strToCheck == UNDEF_TYPE && is) {
                        is = !is;
                        break;
                    }
                }
                return is;
            };
            IData.prototype.toString = function () {
                var str = EMPTY;
                for (var i in toString_props) {
                    if (typeof(this[toString_props[i]]) !== UNDEF_TYPE) {
                        str += (str ? ' ' : EMPTY) + this[toString_props[i]];
                    }
                }
                return str || UNDEF_TYPE;
            };
        }

        if (!NAVIGATOR_UADATA) {
            IData.prototype.then = function (cb) { 
                var that = this;
                var IDataResolve = function () {
                    for (var prop in that) {
                        if (that.hasOwnProperty(prop)) {
                            this[prop] = that[prop];
                        }
                    }
                };
                IDataResolve.prototype = {
                    is : IData.prototype.is,
                    toString : IData.prototype.toString
                };
                var resolveData = new IDataResolve();
                cb(resolveData);
                return resolveData;
            };
        }

        return new IData();
    };

    /////////////////
    // Constructor
    ////////////////

    function UACHData (uach, isHttpUACH) {
        uach = uach || {};
        setProps.call(this, CH_ALL_VALUES);
        if (isHttpUACH) {
            setProps.call(this, [
                [BRANDS, itemListToArray(uach[CH_HEADER])],
                [FULLVERLIST, itemListToArray(uach[CH_HEADER_FULL_VER_LIST])],
                [MOBILE, /\?1/.test(uach[CH_HEADER_MOBILE])],
                [MODEL, stripQuotes(uach[CH_HEADER_MODEL])],
                [PLATFORM, stripQuotes(uach[CH_HEADER_PLATFORM])],
                [PLATFORMVER, stripQuotes(uach[CH_HEADER_PLATFORM_VER])],
                [ARCHITECTURE, stripQuotes(uach[CH_HEADER_ARCH])],
                [FORMFACTORS, itemListToArray(uach[CH_HEADER_FORM_FACTORS])],
                [BITNESS, stripQuotes(uach[CH_HEADER_BITNESS])]
            ]);
        } else {
            for (var prop in uach) {
                if(this.hasOwnProperty(prop) && typeof uach[prop] !== UNDEF_TYPE) this[prop] = uach[prop];
            }
        }
    }

    function UAItem (itemType, ua, rgxMap, uaCH) {

        this.get = function (prop) {
            if (!prop) return this.data;
            return this.data.hasOwnProperty(prop) ? this.data[prop] : undefined;
        };

        this.set = function (prop, val) {
            this.data[prop] = val;
            return this;
        };

        this.setCH = function (ch) {
            this.uaCH = ch;
            return this;
        };

        this.detectFeature = function () {
            if (NAVIGATOR && NAVIGATOR.userAgent == this.ua) {
                switch (this.itemType) {
                    case UA_BROWSER:
                        // Brave-specific detection
                        if (NAVIGATOR.brave && typeof NAVIGATOR.brave.isBrave == FUNC_TYPE) {
                            this.set(NAME, 'Brave');
                        }
                        break;
                    case UA_DEVICE:
                        // Chrome-specific detection: check for 'mobile' value of navigator.userAgentData
                        if (!this.get(TYPE) && NAVIGATOR_UADATA && NAVIGATOR_UADATA[MOBILE]) {
                            this.set(TYPE, MOBILE);
                        }
                        // iPadOS-specific detection: identified as Mac, but has some iOS-only properties
                        if (this.get(MODEL) == 'Macintosh' && NAVIGATOR && typeof NAVIGATOR.standalone !== UNDEF_TYPE && NAVIGATOR.maxTouchPoints && NAVIGATOR.maxTouchPoints > 2) {
                            this.set(MODEL, 'iPad')
                                .set(TYPE, TABLET);
                        }
                        break;
                    case UA_OS:
                        // Chrome-specific detection: check for 'platform' value of navigator.userAgentData
                        if (!this.get(NAME) && NAVIGATOR_UADATA && NAVIGATOR_UADATA[PLATFORM]) {
                            this.set(NAME, NAVIGATOR_UADATA[PLATFORM]);
                        }
                        break;
                    case UA_RESULT:
                        var data = this.data;
                        var detect = function (itemType) {
                            return data[itemType]
                                    .getItem()
                                    .detectFeature()
                                    .get();
                        };
                        this.set(UA_BROWSER, detect(UA_BROWSER))
                            .set(UA_CPU, detect(UA_CPU))
                            .set(UA_DEVICE, detect(UA_DEVICE))
                            .set(UA_ENGINE, detect(UA_ENGINE))
                            .set(UA_OS, detect(UA_OS));
                }
            }
            return this;
        };

        this.parseUA = function () {
            if (this.itemType != UA_RESULT) {
                rgxMapper.call(this.data, this.ua, this.rgxMap);
            }
            if (this.itemType == UA_BROWSER) {
                this.set(MAJOR, majorize(this.get(VERSION)));
            }
            return this;
        };

        this.parseCH = function () {
            var uaCH = this.uaCH,
                rgxMap = this.rgxMap;
    
            switch (this.itemType) {
                case UA_BROWSER:
                case UA_ENGINE:
                    var brands = uaCH[FULLVERLIST] || uaCH[BRANDS], prevName;
                    if (brands) {
                        for (var i in brands) {
                            var brandName = brands[i].brand || brands[i],
                                brandVersion = brands[i].version;
                            if (this.itemType == UA_BROWSER && !/not.a.brand/i.test(brandName) && (!prevName || (/chrom/i.test(prevName) && brandName != CHROMIUM))) {
                                brandName = strMapper(brandName, {
                                    'Chrome' : 'Google Chrome',
                                    'Edge' : 'Microsoft Edge',
                                    'Chrome WebView' : 'Android WebView',
                                    'Chrome Headless' : 'HeadlessChrome',
                                    'Huawei Browser' : 'HuaweiBrowser',
                                    'MIUI Browser' : 'Miui Browser',
                                    'Opera Mobi' : 'OperaMobile',
                                    'Yandex' : 'YaBrowser'
                                });
                                this.set(NAME, brandName)
                                    .set(VERSION, brandVersion)
                                    .set(MAJOR, majorize(brandVersion));
                                prevName = brandName;
                            }
                            if (this.itemType == UA_ENGINE && brandName == CHROMIUM) {
                                this.set(VERSION, brandVersion);
                            }
                        }
                    }
                    break;
                case UA_CPU:
                    var archName = uaCH[ARCHITECTURE];
                    if (archName) {
                        if (archName && uaCH[BITNESS] == '64') archName += '64';
                        rgxMapper.call(this.data, archName + ';', rgxMap);
                    }
                    break;
                case UA_DEVICE:
                    if (uaCH[MOBILE]) {
                        this.set(TYPE, MOBILE);
                    }
                    if (uaCH[MODEL]) {
                        this.set(MODEL, uaCH[MODEL]);
                        if (!this.get(TYPE) || !this.get(VENDOR)) {
                            var reParse = {};
                            rgxMapper.call(reParse, 'droid 9; ' + uaCH[MODEL] + ')', rgxMap);
                            if (!this.get(TYPE) && !!reParse.type) {
                                this.set(TYPE, reParse.type);
                            }
                            if (!this.get(VENDOR) && !!reParse.vendor) {
                                this.set(VENDOR, reParse.vendor);
                            }
                        }
                    }
                    if (uaCH[FORMFACTORS]) {
                        var ff;
                        if (typeof uaCH[FORMFACTORS] !== 'string') {
                            var idx = 0;
                            while (!ff && idx < uaCH[FORMFACTORS].length) {
                                ff = strMapper(uaCH[FORMFACTORS][idx++], formFactorsMap);
                            }
                        } else {
                            ff = strMapper(uaCH[FORMFACTORS], formFactorsMap);
                        }
                        this.set(TYPE, ff);
                    }
                    break;
                case UA_OS:
                    var osName = uaCH[PLATFORM];
                    if(osName) {
                        var osVersion = uaCH[PLATFORMVER];
                        if (osName == WINDOWS) osVersion = (parseInt(majorize(osVersion), 10) >= 13 ? '11' : '10');
                        this.set(NAME, osName)
                            .set(VERSION, osVersion);
                    }
                    // Xbox-Specific Detection
                    if (this.get(NAME) == WINDOWS && uaCH[MODEL] == 'Xbox') {
                        this.set(NAME, 'Xbox')
                            .set(VERSION, undefined);
                    }           
                    break;
                case UA_RESULT:
                    var data = this.data;
                    var parse = function (itemType) {
                        return data[itemType]
                                .getItem()
                                .setCH(uaCH)
                                .parseCH()
                                .get();
                    };
                    this.set(UA_BROWSER, parse(UA_BROWSER))
                        .set(UA_CPU, parse(UA_CPU))
                        .set(UA_DEVICE, parse(UA_DEVICE))
                        .set(UA_ENGINE, parse(UA_ENGINE))
                        .set(UA_OS, parse(UA_OS));
            }
            return this;
        };

        setProps.call(this, [
            ['itemType', itemType],
            ['ua', ua],
            ['uaCH', uaCH],
            ['rgxMap', rgxMap],
            ['data', createIData(this, itemType)]
        ]);

        return this;
    }

    function UAParser (ua, extensions, headers) {

        if (typeof ua === OBJ_TYPE) {
            if (isExtensions(ua, true)) {
                if (typeof extensions === OBJ_TYPE) {
                    headers = extensions;               // case UAParser(extensions, headers)           
                }
                extensions = ua;                        // case UAParser(extensions)
            } else {
                headers = ua;                           // case UAParser(headers)
                extensions = undefined;
            }
            ua = undefined;
        } else if (typeof ua === STR_TYPE && !isExtensions(extensions, true)) {
            headers = extensions;                       // case UAParser(ua, headers)
            extensions = undefined;
        }

        // Convert Headers object into a plain object
        if (headers && typeof headers.append === FUNC_TYPE) {
            var kv = {};
            headers.forEach(function (v, k) { kv[k] = v; });
            headers = kv;
        }
        
        if (!(this instanceof UAParser)) {
            return new UAParser(ua, extensions, headers).getResult();
        }

        var userAgent = typeof ua === STR_TYPE ? ua :                                       // Passed user-agent string
                                (headers && headers[USER_AGENT] ? headers[USER_AGENT] :     // User-Agent from passed headers
                                ((NAVIGATOR && NAVIGATOR.userAgent) ? NAVIGATOR.userAgent : // navigator.userAgent
                                    EMPTY)),                                                // empty string

            httpUACH = new UACHData(headers, true),
            regexMap = extensions ? 
                        extend(defaultRegexes, extensions) : 
                        defaultRegexes,

            createItemFunc = function (itemType) {
                if (itemType == UA_RESULT) {
                    return function () {
                        return new UAItem(itemType, userAgent, regexMap, httpUACH)
                                    .set('ua', userAgent)
                                    .set(UA_BROWSER, this.getBrowser())
                                    .set(UA_CPU, this.getCPU())
                                    .set(UA_DEVICE, this.getDevice())
                                    .set(UA_ENGINE, this.getEngine())
                                    .set(UA_OS, this.getOS())
                                    .get();
                    };
                } else {
                    return function () {
                        return new UAItem(itemType, userAgent, regexMap[itemType], httpUACH)
                                    .parseUA()
                                    .get();
                    };
                }
            };
            
        // public methods
        setProps.call(this, [
            ['getBrowser', createItemFunc(UA_BROWSER)],
            ['getCPU', createItemFunc(UA_CPU)],
            ['getDevice', createItemFunc(UA_DEVICE)],
            ['getEngine', createItemFunc(UA_ENGINE)],
            ['getOS', createItemFunc(UA_OS)],
            ['getResult', createItemFunc(UA_RESULT)],
            ['getUA', function () { return userAgent; }],
            ['setUA', function (ua) {
                if (isString(ua))
                    userAgent = ua.length > UA_MAX_LENGTH ? trim(ua, UA_MAX_LENGTH) : ua;
                return this;
            }]
        ])
        .setUA(userAgent);

        return this;
    }

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER =  enumerize([NAME, VERSION, MAJOR, TYPE]);
    UAParser.CPU = enumerize([ARCHITECTURE]);
    UAParser.DEVICE = enumerize([MODEL, VENDOR, TYPE, CONSOLE, MOBILE, SMARTTV, TABLET, WEARABLE, EMBEDDED]);
    UAParser.ENGINE = UAParser.OS = enumerize([NAME, VERSION]);

    

/***/ }),

/***/ "./src/assets/icons/chevron-right.svg":
/*!********************************************!*\
  !*** ./src/assets/icons/chevron-right.svg ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg width=\"25\" height=\"25\" viewBox=\"0 0 25 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M9.93427 6.93353C10.2467 6.62111 10.7532 6.62111 11.0656 6.93353L16.0656 11.9335C16.3781 12.246 16.3781 12.7525 16.0656 13.0649L11.0656 18.0649C10.7532 18.3773 10.2467 18.3773 9.93427 18.0649C9.62185 17.7525 9.62185 17.246 9.93427 16.9335L14.3686 12.4992L9.93427 8.0649C9.62185 7.75248 9.62185 7.24595 9.93427 6.93353Z\" fill=\"currentColor\"/>\n</svg>\n";

/***/ }),

/***/ "./src/assets/icons/index.ts":
/*!***********************************!*\
  !*** ./src/assets/icons/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _x_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./x.svg */ "./src/assets/icons/x.svg");
/* harmony import */ var _chevron_right_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chevron-right.svg */ "./src/assets/icons/chevron-right.svg");


const ICONS = {
    Remove: _x_svg__WEBPACK_IMPORTED_MODULE_0__,
    ChevronRight: _chevron_right_svg__WEBPACK_IMPORTED_MODULE_1__,
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ICONS);


/***/ }),

/***/ "./src/assets/icons/x.svg":
/*!********************************!*\
  !*** ./src/assets/icons/x.svg ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg width=\"25\" height=\"25\" viewBox=\"0 0 25 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M5.93427 5.93353C6.24669 5.62111 6.75322 5.62111 7.06564 5.93353L12.5 11.3678L17.9343 5.93354C18.2467 5.62112 18.7532 5.62112 19.0656 5.93354C19.3781 6.24596 19.3781 6.75249 19.0656 7.06491L13.6313 12.4992L19.0656 17.9335C19.3781 18.2459 19.3781 18.7525 19.0656 19.0649C18.7532 19.3773 18.2467 19.3773 17.9343 19.0649L12.5 13.6306L7.06564 19.0649C6.75322 19.3773 6.24669 19.3773 5.93427 19.0649C5.62185 18.7525 5.62185 18.246 5.93427 17.9335L11.3686 12.4992L5.93427 7.0649C5.62185 6.75248 5.62185 6.24595 5.93427 5.93353Z\" fill=\"currentColor\"/>\n</svg>\n";

/***/ }),

/***/ "./src/components/ad-unit.ts":
/*!***********************************!*\
  !*** ./src/components/ad-unit.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdUnit: () => (/* binding */ AdUnit)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants/index.ts");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/components/dom.ts");
/* harmony import */ var _event_subscriber__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event-subscriber */ "./src/components/event-subscriber.ts");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/services */ "./src/services/index.ts");
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash/throttle */ "./node_modules/lodash/throttle.js");
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_throttle__WEBPACK_IMPORTED_MODULE_4__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





class AdUnit {
    constructor(el, type) {
        var _a;
        this.attachEvent = (eventType, callback) => {
            if (!this.events)
                return;
            this.events.subscribe(eventType, callback);
        };
        this.setupEvents = () => {
            if (!this.node)
                return;
            const adContainer = this.node.querySelector(this.type === 'overlay'
                ? `& > .${_constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.DIALOG_CONTAINER}`
                : `& > .${_constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.CONTAINER}`);
            if (!adContainer)
                return;
            this.events = new _event_subscriber__WEBPACK_IMPORTED_MODULE_2__.EventSubscriber(adContainer);
            const THROTTLE_WAIT_TIME = 200;
            const actionThrottled = lodash_throttle__WEBPACK_IMPORTED_MODULE_4___default()((body) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const res = yield this.service.interactAd(body);
                    if (res.data.status === 'fail') {
                        throw Error(res.data.message);
                    }
                    return res.data.data;
                }
                catch (error) {
                    console.error('ERROR', error);
                    return null;
                }
            }), THROTTLE_WAIT_TIME);
            const observerCallback = (payload) => {
                var _a;
                const payloadTrg = payload[0];
                const targetName = this.node.getAttribute(_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_MANUAL_AD_SLOT) ||
                    this.node.getAttribute(_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_AUTO_AD_POS) ||
                    this.node.getAttribute(_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_OVERLAY_AD_POS);
                if (!this.data || (this.hasCheckImpression && this.hasCheckViewed)) {
                    (_a = this.events) === null || _a === void 0 ? void 0 : _a.stopObserver();
                    return;
                }
                if (!this.hasCheckImpression) {
                    console.log(targetName, 'has impression');
                    actionThrottled({
                        action_type: 'impression',
                        ad_panel_id: this.data.id,
                    }).then((res) => {
                        if (res) {
                            this.hasCheckImpression = true;
                        }
                    });
                }
                if (!this.hasCheckViewed &&
                    payloadTrg.isIntersecting &&
                    payloadTrg.intersectionRatio >= 0.75) {
                    console.log(targetName, 'has view');
                    actionThrottled({
                        action_type: 'view',
                        ad_panel_id: this.data.id,
                    }).then((res) => {
                        if (res) {
                            this.hasCheckViewed = true;
                        }
                    });
                }
            };
            this.events.startObserver(observerCallback);
            this.attachEvent('click', () => {
                if (!this.data)
                    return;
                actionThrottled({
                    action_type: 'click',
                    ad_panel_id: this.data.id,
                });
            });
        };
        this.attachAd = (value, type) => {
            if (!this.node)
                return;
            let container = this.node.querySelector(`& > .${_constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.CONTAINER}`);
            if (!container) {
                const inpagePos = this.node.getAttribute(_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_AUTO_AD_POS);
                if (inpagePos && inpagePos.includes('sidebar')) {
                    container = this.dom.ins.createAdContainer({
                        width: '100%',
                        maxWidth: '100%',
                        height: 'auto',
                    });
                }
                else {
                    container = this.dom.ins.createAdContainer({
                        width: 'auto',
                        height: '240px',
                    });
                }
            }
            let outerWrapper = container.querySelector(`& > .${_constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.OUTER_WRAPPER}`);
            if (!outerWrapper) {
                outerWrapper = this.dom.ins.createOuterAdWrapper();
                container.appendChild(outerWrapper);
            }
            const adChild = outerWrapper.querySelector(`& > :not(.${_constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.INDICATOR_SPAN})`);
            if (adChild)
                adChild.remove();
            if (type === 'image') {
                const ad = this.dom.ins.createImageAd(value);
                outerWrapper.appendChild(ad);
            }
            else if (type === 'video') {
            }
            this.data = value;
            this.id = value.id;
            this.node.append(container);
            this.node.setAttribute(_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_AD_PANEL_ID, value.id);
        };
        this.attachOverlayAd = (value, type) => {
            if (!this.node)
                return;
            const closeHandler = () => {
                const container = this.node;
                if (container) {
                    container.style.display = 'none';
                    container.hidden = true;
                }
            };
            const adDialog = this.dom.overlay.createOverlayDialogContainer('no-logo', value, closeHandler);
            this.data = value;
            this.id = value.id;
            this.node.append(adDialog);
            this.node.setAttribute(_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_AD_PANEL_ID, value.id);
        };
        this.id = '';
        this.type = type;
        if (type === 'manual') {
            this.unitMetadata = {
                idSlot: (_a = el.getAttribute(_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_MANUAL_AD_SLOT)) !== null && _a !== void 0 ? _a : '',
            };
        }
        else if (type === 'auto') {
            this.unitMetadata = {
                format: el.getAttribute(_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_AD_FORMAT) || '',
                position: el.getAttribute(_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_AUTO_AD_POS) || '',
            };
        }
        else {
            this.unitMetadata = {
                format: el.getAttribute(_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_AD_FORMAT) || '',
                position: el.getAttribute(_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_OVERLAY_AD_POS) || '',
            };
        }
        this.data = null;
        this.isVerified = false;
        this.node = el;
        this.dom = new _dom__WEBPACK_IMPORTED_MODULE_1__.DOM();
        this.service = new _services__WEBPACK_IMPORTED_MODULE_3__.ScriptService();
        this.events = null;
        this.hasCheckImpression = false;
        this.hasCheckViewed = false;
    }
}


/***/ }),

/***/ "./src/components/ads-manager.ts":
/*!***************************************!*\
  !*** ./src/components/ads-manager.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdsManager: () => (/* binding */ AdsManager)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils/index.ts");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/components/dom.ts");
/* harmony import */ var _ad_unit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ad-unit */ "./src/components/ad-unit.ts");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services */ "./src/services/index.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/constants */ "./src/constants/index.ts");
/* harmony import */ var _types_enum__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/types/enum */ "./src/types/enum.ts");
/* harmony import */ var _tracker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tracker */ "./src/components/tracker.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







class AdsManager {
    constructor(_config) {
        this.idFetchInterval = null;
        this.autoAds = [];
        this.overlayAds = [];
        this.manualAds = [];
        this.isMobile = false;
        this.config = {
            visibleHeaderTop: false,
            visibleHeaderBottom: true,
            visibleFooterTop: true,
            visibleFooterBottom: false,
            visibleContentTop: true,
            visibleContentMiddle: true,
            visibleContentBottom: true,
            visibleSidebarLeftTop: true,
            visibleSidebarLeftBottom: true,
            visibleSidebarRightTop: true,
            visibleSidebarRightBottom: true,
            anchorTop: true,
            anchorBottom: true,
            sideRailLeft: true,
            sideRailRight: true,
            dialogCenter: true,
            notificationCorner: true,
            fetchInterval: _constants__WEBPACK_IMPORTED_MODULE_4__.DEFAULT_FETCH_ADS_INTERVAL,
            maxAds: 10,
        };
        this.refreshAdsByInterval = () => {
            if (!(this.config.fetchInterval > 0))
                return;
            this.idFetchInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                const autoIns = this.autoAds.map((unit) => unit.node);
                const manualIns = this.manualAds.map((unit) => unit.node);
                const data = yield this.fetchAds({
                    auto: autoIns,
                    manual: manualIns,
                });
                if (data) {
                    if (data.slot_info_panels.length > 0) {
                        this.autoAds.forEach((unit, index) => {
                            const adData = data.slot_info_panels[index];
                            unit.attachAd(adData, 'image');
                        });
                    }
                    if (data.ad_unit_panels.length > 0) {
                        this.manualAds.forEach((unit, index) => {
                            const adData = data.ad_unit_panels[index];
                            unit.attachAd(adData, 'image');
                        });
                    }
                }
            }), this.config.fetchInterval);
        };
        this.fetchAds = (_data) => __awaiter(this, void 0, void 0, function* () {
            const { auto, manual } = _data;
            try {
                const body = {};
                const platform_slot_info = auto === null || auto === void 0 ? void 0 : auto.map((a) => {
                    const { width, height } = a.getBoundingClientRect();
                    const inpagePos = a.getAttribute(_constants__WEBPACK_IMPORTED_MODULE_4__.ATTRIBUTE_AUTO_AD_POS);
                    if (inpagePos && inpagePos.includes('sidebar')) {
                        const size = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getDefinedAdSize)(width, width * _types_enum__WEBPACK_IMPORTED_MODULE_5__.AdRatio.ROW_RECT);
                        return {
                            width: Math.round(size.width),
                            height: Math.round(size.height),
                        };
                    }
                    else {
                        const size = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getDefinedAdSize)(width, height);
                        return {
                            width: Math.round(size.width),
                            height: Math.round(size.height),
                        };
                    }
                });
                const ad_unit_ids = manual === null || manual === void 0 ? void 0 : manual.map((m) => {
                    return m.getAttribute(_constants__WEBPACK_IMPORTED_MODULE_4__.ATTRIBUTE_MANUAL_AD_SLOT);
                });
                if (platform_slot_info)
                    body.platform_slot_info = platform_slot_info;
                if (ad_unit_ids)
                    body.ad_unit_ids = ad_unit_ids;
                const response = yield this.service.getAds(body);
                if (response.data.status === 'fail') {
                    throw Error(response.data.message);
                }
                return response.data.data;
            }
            catch (error) {
                console.error('Error', error);
                return null;
            }
        });
        this.populateAds = () => __awaiter(this, void 0, void 0, function* () {
            const manualIns = Array.from(document.querySelectorAll((0,_utils__WEBPACK_IMPORTED_MODULE_0__.getManualInsQuery)()));
            const autoIns = Array.from(document.querySelectorAll((0,_utils__WEBPACK_IMPORTED_MODULE_0__.getAutoInsQuery)()));
            const data = yield this.fetchAds({
                auto: autoIns,
                manual: manualIns,
            });
            if (data) {
                this.tracker.visitId = data.visit_id;
                if (data.slot_info_panels.length > 0) {
                    autoIns.forEach((ins, index) => {
                        const adUnit = new _ad_unit__WEBPACK_IMPORTED_MODULE_2__.AdUnit(ins, 'auto');
                        const adData = data.slot_info_panels[index];
                        adUnit.attachAd(adData, 'image');
                        adUnit.setupEvents();
                        this.autoAds.push(adUnit);
                    });
                }
                if (data.ad_unit_panels.length > 0) {
                    manualIns.forEach((ins, index) => {
                        const adUnit = new _ad_unit__WEBPACK_IMPORTED_MODULE_2__.AdUnit(ins, 'manual');
                        const adData = data.ad_unit_panels[index];
                        adUnit.attachAd(adData, 'image');
                        adUnit.setupEvents();
                        this.manualAds.push(adUnit);
                    });
                }
            }
        });
        this.start = (configs = {
            mode: ['manual', 'auto'],
            isMobile: false,
        }) => {
            const { mode, isMobile } = configs;
            this.isMobile = isMobile;
            this.dom.setInitialManualIns();
            if (mode.includes('auto')) {
                this.insertOverlayAds();
                this.traversePage();
                this.insertInsToBody();
            }
            this.populateAds();
            this.refreshAdsByInterval();
        };
        if (!AdsManager.instance) {
            console.log('new instance AdsManager!!!');
            if (_config) {
                this.config = _config;
            }
            AdsManager.instance = this;
            this.dom = new _dom__WEBPACK_IMPORTED_MODULE_1__.DOM();
            this.tracker = new _tracker__WEBPACK_IMPORTED_MODULE_6__.Tracker();
            this.service = new _services__WEBPACK_IMPORTED_MODULE_3__.ScriptService();
        }
        return AdsManager.instance;
    }
    get hasMaxAds() {
        return this.dom.insEls.length >= this.config.maxAds;
    }
    traversePage() {
        const appBody = this.dom.findInnerAppContainer();
        console.log('appBody', appBody);
        this.dom.appBodyEl = appBody;
        const header = this.dom.header.findHeader(appBody);
        console.log('header', header);
        this.dom.headerEl = header;
        const footer = this.dom.footer.findFooter(appBody);
        console.log('footer', footer);
        this.dom.footerEl = footer;
        const mainContainer = this.dom.content.findMainContainerElement(appBody);
        this.dom.mainEl = mainContainer;
        console.log('mainContainer', mainContainer);
        const { content: contentContainer, sidebarLeft: sidebarLeftContainer, sidebarRight: sidebarRightContainer, } = this.dom.content.findContentContainer(mainContainer, null, null);
        this.dom.contentEl = contentContainer;
        console.log('contentContainer', contentContainer);
        const { sidebarLeft: newSidebarLeftContainer, sidebarRight: newSidebarRightContainer, } = this.dom.sidebar.findSidebarContainer(mainContainer);
        const sidebarLeft = sidebarLeftContainer || newSidebarLeftContainer;
        console.log('sidebarLeft', sidebarLeftContainer, newSidebarLeftContainer);
        if (sidebarLeft) {
            this.dom.sidebarLeftEl = this.dom.sidebar.findSidebarWrapper(sidebarLeft);
        }
        const sidebarRight = sidebarRightContainer || newSidebarRightContainer;
        console.log('sidebarRight', sidebarRightContainer, newSidebarRightContainer);
        if (sidebarRight) {
            this.dom.sidebarRightEl =
                this.dom.sidebar.findSidebarWrapper(sidebarRight);
        }
    }
    insertInsToBody() {
        if (!this.hasMaxAds && this.config.visibleHeaderBottom) {
            this.dom.insertToHeader(`header-bottom`);
        }
        if (!this.hasMaxAds && this.config.visibleFooterTop) {
            this.dom.insertToFooter(`footer-top`);
        }
        if (!this.hasMaxAds && this.config.visibleContentMiddle) {
            this.dom.insertToContent(`content-middle`);
        }
        if (!this.hasMaxAds && this.config.visibleSidebarLeftTop) {
            this.dom.insertToSidebarLeft(`sidebarleft-top`);
        }
        if (!this.hasMaxAds && this.config.visibleSidebarLeftBottom) {
            this.dom.insertToSidebarLeft(`sidebarleft-bottom`);
        }
        if (!this.hasMaxAds && this.config.visibleSidebarRightTop) {
            this.dom.insertToSidebarRight(`sidebarright-top`);
        }
        if (!this.hasMaxAds && this.config.visibleSidebarRightBottom) {
            this.dom.insertToSidebarRight(`sidebarright-bottom`);
        }
    }
    insertOverlayAds() {
        if (this.config.dialogCenter && this.isMobile) {
            const body = document.body;
            this.fetchAds({
                auto: [body],
            }).then((value) => {
                if (!value || value.slot_info_panels.length === 0)
                    return;
                const overlay = this.dom.insertOverlayContainerAd(body);
                const adUnit = new _ad_unit__WEBPACK_IMPORTED_MODULE_2__.AdUnit(overlay, 'overlay');
                const adData = value.slot_info_panels[0];
                adUnit.attachOverlayAd(adData, 'image');
                adUnit.setupEvents();
                this.overlayAds.push(adUnit);
            });
        }
    }
}


/***/ }),

/***/ "./src/components/content.ts":
/*!***********************************!*\
  !*** ./src/components/content.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Content: () => (/* binding */ Content)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils/index.ts");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/components/dom.ts");


class Content {
    constructor() {
        this.dom = new _dom__WEBPACK_IMPORTED_MODULE_1__.DOM();
    }
    findMainContainerElement(appBody) {
        const directChildren = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getFilteredChildren)(appBody);
        let mainContainer = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getLargestElement)(directChildren);
        if (!mainContainer)
            return appBody;
        while (mainContainer.childElementCount == 1 &&
            mainContainer.firstElementChild instanceof HTMLElement) {
            mainContainer = mainContainer.firstElementChild;
        }
        return mainContainer;
    }
    findContentContainer(_content, _sidebarLeft, _sidebarRight) {
        if (!this.dom.mainEl) {
            return {
                content: _content,
                sidebarLeft: null,
                sidebarRight: null,
            };
        }
        let contentContainer = _content;
        let sidebarLeft = _sidebarLeft;
        let sidebarRight = _sidebarRight;
        const { bottom: aBottom } = this.dom.appBodyEl.getBoundingClientRect();
        const { width: mWidth, height: mHeight, left: mLeft, right: mRight, } = this.dom.mainEl.getBoundingClientRect();
        for (const child of _content.children) {
            const { width, height, bottom, left, right } = child.getBoundingClientRect();
            const childStyle = window.getComputedStyle(child);
            if (childStyle.position == 'fixed' ||
                childStyle.position == 'absolute' ||
                child.localName == 'table' ||
                width <= 1 ||
                height <= 1 ||
                (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isHiddenElement)(child))
                continue;
            if (width < mWidth * 0.35 &&
                width >= 90 &&
                height >= 300) {
                if (Math.abs(left - mLeft) <= 75) {
                    sidebarLeft = child;
                }
                else if (Math.abs(right - mRight) <= 75) {
                    sidebarRight = child;
                }
            }
            else if (height <= mHeight * 0.35 && Math.abs(bottom - aBottom) <= 50) {
                continue;
            }
            else {
                if (width >= mWidth * 0.45 && height >= mHeight * 0.75) {
                    const subLoopResult = this.findContentContainer(child, sidebarLeft, sidebarRight);
                    contentContainer = subLoopResult.content;
                    sidebarLeft = subLoopResult.sidebarLeft;
                    sidebarRight = subLoopResult.sidebarRight;
                }
            }
        }
        return {
            content: contentContainer,
            sidebarLeft: sidebarLeft,
            sidebarRight: sidebarRight,
        };
    }
    findCenterElementInContent(parent) {
        if (!this.dom.mainEl || !this.dom.contentEl)
            return null;
        const contentPos = this.dom.contentEl.getBoundingClientRect();
        let centered = null;
        let shortestDistance = null;
        for (const child of parent.children) {
            const cPos = child.getBoundingClientRect();
            if (cPos.width == 0 || cPos.height == 0 || (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isHiddenElement)(child))
                continue;
            const distanceToMain = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getDistanceToCenter)(child, this.dom.mainEl);
            if (!shortestDistance ||
                Math.abs(shortestDistance) > Math.abs(distanceToMain)) {
                shortestDistance = distanceToMain;
                centered = child;
            }
            if (cPos.width >= contentPos.width * 0.85 &&
                cPos.height >= contentPos.height * 0.5) {
                const style = window.getComputedStyle(child);
                if (style.display == 'grid' ||
                    style.display == 'flex' ||
                    child.localName == 'table') {
                    continue;
                }
                else {
                    return this.findCenterElementInContent(child);
                }
            }
        }
        if (!centered || !shortestDistance)
            return null;
        return {
            el: centered,
            pos: shortestDistance > 0 ? 'below' : 'above',
        };
    }
}


/***/ }),

/***/ "./src/components/detector.ts":
/*!************************************!*\
  !*** ./src/components/detector.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Detector: () => (/* binding */ Detector)
/* harmony export */ });
/* harmony import */ var ua_parser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ua-parser-js */ "./node_modules/ua-parser-js/src/main/ua-parser.mjs");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class Detector {
    constructor() {
        this.parser = new ua_parser_js__WEBPACK_IMPORTED_MODULE_0__.UAParser(window.navigator.userAgent);
        const { browser, cpu, device, engine, os } = this.parser.getResult();
        this.browser = browser;
        this.os = os;
        this.device = device;
        this.engine = engine;
        this.cpu = cpu;
    }
    getResultAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.parser.getResult().withFeatureCheck();
            console.log(result);
            this.setResult(result);
            return result;
        });
    }
    setResult(result) {
        const { browser, cpu, device, engine, os } = result;
        this.browser = browser;
        this.os = os;
        this.device = device;
        this.engine = engine;
        this.cpu = cpu;
    }
    isMobile() {
        return this.device.type !== undefined && this.device.type === 'mobile';
    }
}


/***/ }),

/***/ "./src/components/dom.ts":
/*!*******************************!*\
  !*** ./src/components/dom.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DOM: () => (/* binding */ DOM)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/utils */ "./src/utils/index.ts");
/* harmony import */ var _content__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./content */ "./src/components/content.ts");
/* harmony import */ var _sidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sidebar */ "./src/components/sidebar.ts");
/* harmony import */ var _header__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./header */ "./src/components/header.ts");
/* harmony import */ var _footer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./footer */ "./src/components/footer.ts");
/* harmony import */ var _ins__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ins */ "./src/components/ins.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/constants */ "./src/constants/index.ts");
/* harmony import */ var _ads_manager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ads-manager */ "./src/components/ads-manager.ts");
/* harmony import */ var _overlay__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./overlay */ "./src/components/overlay.ts");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/services */ "./src/services/index.ts");










class DOM {
    constructor() {
        this.appBodyEl = null;
        this.mainEl = null;
        this.insEls = [];
        this.overlayEls = [];
        this.headerEl = null;
        this.footerEl = null;
        this.contentEl = null;
        this.sidebarLeftEl = null;
        this.sidebarRightEl = null;
        this.attachIns = (targetEl, insertType, position, options) => {
            const ins = this.ins.createIns(Object.assign({}, options));
            ins.setAttribute(_constants__WEBPACK_IMPORTED_MODULE_6__.ATTRIBUTE_AD_FORMAT, 'in-page');
            ins.setAttribute(_constants__WEBPACK_IMPORTED_MODULE_6__.ATTRIBUTE_AUTO_AD_POS, position);
            targetEl.insertAdjacentElement(insertType, ins);
            if (this.checkIfInsIsTooClose(ins)) {
                this.removeFromInsEls(ins);
                return null;
            }
            else {
                this.pushToInsEls(ins);
                return ins;
            }
        };
        if (!DOM.instance) {
            DOM.instance = this;
            this.content = new _content__WEBPACK_IMPORTED_MODULE_1__.Content();
            this.sidebar = new _sidebar__WEBPACK_IMPORTED_MODULE_2__.Sidebar();
            this.header = new _header__WEBPACK_IMPORTED_MODULE_3__.Header();
            this.footer = new _footer__WEBPACK_IMPORTED_MODULE_4__.Footer();
            this.overlay = new _overlay__WEBPACK_IMPORTED_MODULE_8__.Overlay();
            this.ins = new _ins__WEBPACK_IMPORTED_MODULE_5__.AdIns();
            this.adsManager = new _ads_manager__WEBPACK_IMPORTED_MODULE_7__.AdsManager();
            this.service = new _services__WEBPACK_IMPORTED_MODULE_9__.ScriptService();
        }
        return DOM.instance;
    }
    createAnchorAd(href = '#', css) {
        const anchor = document.createElement('a');
        anchor.classList.add(_constants__WEBPACK_IMPORTED_MODULE_6__.AD_CLASSES.RESET_STYLE, _constants__WEBPACK_IMPORTED_MODULE_6__.AD_CLASSES.ANCHOR_ELEMENT);
        anchor.href = href;
        anchor.rel = 'nofollow noopener';
        anchor.target = '_blank';
        if (css) {
            for (const key in css) {
                anchor.style[key] = css[key];
            }
        }
        return anchor;
    }
    setInitialManualIns() {
        const manualEls = document.querySelectorAll((0,_utils__WEBPACK_IMPORTED_MODULE_0__.getManualInsQuery)());
        if (manualEls.length == 0) {
            this.insEls = [];
        }
        else {
            this.insEls = [...Array.from(manualEls)];
        }
    }
    pushToInsEls(el) {
        if (!this.adsManager.hasMaxAds) {
            if (el instanceof Array) {
                this.insEls.push(...el);
            }
            else {
                this.insEls.push(el);
            }
        }
    }
    removeFromInsEls(el) {
        this.insEls.filter((e) => e !== el);
        el.remove();
    }
    checkIfInsIsTooClose(_ins) {
        for (const ins of this.insEls) {
            if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isTooClose)(ins, _ins))
                return true;
        }
        return false;
    }
    findInnerAppContainer() {
        const MAX_RETRY = 10;
        let retry = 0;
        const body = document.body;
        const { width: bWidth, height: bHeight } = body.getBoundingClientRect();
        let aWidth = bWidth;
        let aHeight = bHeight;
        let appBody = body;
        if (bWidth == 0 || bHeight == 0) {
            aWidth = window.innerWidth * 0.9;
            aHeight = window.innerHeight * 0.9;
        }
        outer: while (true) {
            retry++;
            inner1: for (const child of appBody.children) {
                const { width, height } = child.getBoundingClientRect();
                if (width >= aWidth &&
                    height >= aHeight &&
                    !(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isHiddenElement)(child) &&
                    child.childElementCount >= 1) {
                    appBody = child;
                    break inner1;
                }
            }
            let isAppBody = false;
            let componentCount = 0;
            inner2: for (const child of appBody.children) {
                if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isHiddenElement)(child))
                    continue inner2;
                const { width, height } = child.getBoundingClientRect();
                if (width > 1 && height > 1) {
                    componentCount++;
                }
                if (componentCount >= 2) {
                    isAppBody = true;
                    break inner2;
                }
            }
            if (isAppBody)
                break outer;
            if (retry == MAX_RETRY) {
                debugger;
                break outer;
            }
        }
        return appBody;
    }
    insertToHeader(position) {
        if (!this.headerEl)
            return;
        const headerCtn = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getElementWrapper)(this.headerEl);
        const headerCtnStyle = window.getComputedStyle(headerCtn);
        if (position === 'header-bottom') {
            if (headerCtnStyle.position !== 'fixed' &&
                headerCtnStyle.position !== 'sticky' &&
                headerCtnStyle.position !== 'absolute') {
                if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isSuitableLayout)(headerCtn.parentElement)) {
                    return this.attachIns(headerCtn, 'afterend', position);
                }
            }
            if (this.mainEl) {
                if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isSuitableLayout)(this.mainEl)) {
                    return this.attachIns(this.mainEl, 'afterbegin', position, {
                        marginTop: headerCtnStyle.position == 'sticky' ? '0' : headerCtnStyle.height,
                    });
                }
                else {
                    return this.attachIns(this.mainEl, 'beforebegin', position);
                }
            }
        }
    }
    insertToFooter(position) {
        if (!this.footerEl)
            return;
        const footerCtn = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getElementWrapper)(this.footerEl);
        if (position === 'footer-top') {
            return this.attachIns(footerCtn, 'beforebegin', position);
        }
    }
    insertToContent(position) {
        if (!this.contentEl)
            return;
        if (position === 'content-middle') {
            const middleContent = this.content.findCenterElementInContent(this.contentEl);
            console.log('middleContent', middleContent);
            if (middleContent) {
                const { el, pos } = middleContent;
                let targetEl = el;
                let insertPos = 'beforebegin';
                if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isSuitableLayout)(targetEl)) {
                    insertPos = pos === 'above' ? 'beforeend' : 'afterbegin';
                }
                else {
                    targetEl = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getElementWrapper)(targetEl);
                    if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isSuitableLayout)(targetEl)) {
                        insertPos = pos === 'above' ? 'beforeend' : 'afterbegin';
                    }
                    else {
                        insertPos = pos === 'above' ? 'afterend' : 'beforebegin';
                    }
                }
                return this.attachIns(targetEl, insertPos, position);
            }
        }
    }
    insertToSidebarLeft(position) {
        if (!this.sidebarLeftEl)
            return;
        if (position === 'sidebarleft-top') {
            return this.attachIns(this.sidebarLeftEl, 'afterbegin', position);
        }
        else if (position === 'sidebarleft-bottom') {
            return this.attachIns(this.sidebarLeftEl, 'beforeend', position);
        }
    }
    insertToSidebarRight(position) {
        if (!this.sidebarRightEl)
            return;
        if (position === 'sidebarright-top') {
            return this.attachIns(this.sidebarRightEl, 'afterbegin', position);
        }
        else if (position === 'sidebarright-bottom') {
            return this.attachIns(this.sidebarRightEl, 'beforeend', position);
        }
    }
    pushToOverlayEls(el) {
        if (el instanceof Array) {
            this.overlayEls.push(...el);
        }
        else {
            this.overlayEls.push(el);
        }
    }
    removeFromOverlayEls(container) {
        this.overlayEls.filter((e) => e !== container);
        container.remove();
    }
    insertOverlayContainerAd(appBody) {
        const overlay = this.overlay.createOverlayContainer();
        this.pushToOverlayEls(overlay);
        appBody.appendChild(overlay);
        return overlay;
    }
}


/***/ }),

/***/ "./src/components/event-subscriber.ts":
/*!********************************************!*\
  !*** ./src/components/event-subscriber.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventSubscriber: () => (/* binding */ EventSubscriber)
/* harmony export */ });
class EventSubscriber {
    constructor(element) {
        this.active = true;
        if (!(element instanceof HTMLElement)) {
            throw new Error('Element must be an instance of HTMLElement');
        }
        this.element = element;
        this.events = new Map();
    }
    subscribe(eventType, callback) {
        if (this.events.has(eventType)) {
            this.unsubscribe(eventType);
        }
        const _callback = (e) => {
            if (this.active) {
                callback(e);
            }
        };
        this.events.set(eventType, _callback);
        this.element.addEventListener(eventType, _callback);
    }
    unsubscribe(eventType) {
        if (this.events.has(eventType)) {
            const callback = this.events.get(eventType);
            if (callback) {
                this.element.removeEventListener(eventType, callback);
            }
        }
    }
    startObserver(callback, options = {
        threshold: [0, 1],
    }) {
        if (this.observer) {
            this.stopObserver();
        }
        const _callback = (e, observer) => {
            if (this.active) {
                callback(e, observer);
            }
        };
        this.observer = new IntersectionObserver(_callback, options);
        this.observer.observe(this.element);
    }
    stopObserver() {
        if (!this.observer)
            return;
        this.observer.unobserve(this.element);
    }
    removeFromAllEvents() {
        this.events.forEach((callback, eventType) => {
            this.element.removeEventListener(eventType, callback);
        });
        this.events.clear();
        this.stopObserver();
    }
    get isActive() {
        return this.active;
    }
    disableEvents() {
        this.active = false;
    }
    enableEvents() {
        this.active = true;
    }
}


/***/ }),

/***/ "./src/components/footer.ts":
/*!**********************************!*\
  !*** ./src/components/footer.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Footer: () => (/* binding */ Footer)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/utils */ "./src/utils/index.ts");

class Footer {
    constructor() {
        this.selectors = [
            ':scope footer',
            `:scope [id*='footer']`,
            `:scope [class*='footer']`,
            `:scope [role*='footer']`,
        ];
        this.findFooter = (appBody) => {
            const { width: aWidth } = appBody.getBoundingClientRect();
            const footerSelector = this.selectors.join(',');
            const arrFooters = appBody.querySelectorAll(footerSelector);
            if (arrFooters.length == 0)
                return null;
            let footer = arrFooters[0];
            let lowestBottom = footer.getBoundingClientRect().bottom;
            Array.from(arrFooters).forEach((f) => {
                const { width, height, left, right, bottom } = f.getBoundingClientRect();
                if (width + left + right >= aWidth * 0.9 &&
                    height > 1 &&
                    !footer.contains(f) &&
                    !(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isHiddenElement)(f)) {
                    if (bottom >= lowestBottom) {
                        footer = f;
                        lowestBottom = bottom;
                    }
                }
            });
            return footer;
        };
    }
}


/***/ }),

/***/ "./src/components/header.ts":
/*!**********************************!*\
  !*** ./src/components/header.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Header: () => (/* binding */ Header)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/utils */ "./src/utils/index.ts");

class Header {
    constructor() {
        this.selectors = [
            ':scope header',
            `:scope [id*='header']`,
            `:scope [class*='header']`,
            `:scope [role*='header']`,
        ];
    }
    isHeaderFixedSticky(el) {
        const style = window.getComputedStyle(el);
        return style.position === 'fixed' || style.position === 'sticky';
    }
    findHeader(appBody) {
        const headerSelector = this.selectors.join(',');
        const arrHeaders = appBody.querySelectorAll(headerSelector);
        if (arrHeaders.length == 0)
            return null;
        const { width: aWidth } = appBody.getBoundingClientRect();
        let header = arrHeaders[0];
        let highestTop = header.getBoundingClientRect().top;
        if (this.isHeaderFixedSticky(header)) {
            highestTop -= window.scrollY;
        }
        Array.from(arrHeaders).forEach((h) => {
            const { width, height, left, right, top } = h.getBoundingClientRect();
            if (width + left + right >= aWidth * 0.9 &&
                height > 1 &&
                !header.contains(h) &&
                !(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isHiddenElement)(h)) {
                let hTop = top;
                if (this.isHeaderFixedSticky(h))
                    hTop -= window.scrollY;
                if (hTop <= highestTop) {
                    header = h;
                    highestTop = hTop;
                }
            }
        });
        return header;
    }
}


/***/ }),

/***/ "./src/components/ins.ts":
/*!*******************************!*\
  !*** ./src/components/ins.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdIns: () => (/* binding */ AdIns)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/constants */ "./src/constants/index.ts");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/components/dom.ts");


class AdIns {
    constructor() {
        this.dom = new _dom__WEBPACK_IMPORTED_MODULE_1__.DOM();
    }
    createIns(options) {
        const ins = document.createElement('ins');
        ins.className = _constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.AIOZ_AD_INS;
        if (options) {
            for (const key in options) {
                ins.style[key] = options[key];
            }
        }
        return ins;
    }
    createAdContainer(options) {
        const container = document.createElement('div');
        container.classList.add(_constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.CONTAINER);
        if (options) {
            for (const key in options) {
                container.style[key] = options[key];
            }
        }
        return container;
    }
    createAdSpan() {
        const span = document.createElement('span');
        span.className = _constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.INDICATOR_SPAN;
        span.style.fontSize = '12px';
        span.style.fontWeight = 'bold';
        span.style.lineHeight = '1.5';
        span.style.color = 'rgba(255,255,255,1)';
        span.innerText = 'Ad';
        return span;
    }
    createOuterAdWrapper() {
        const wrapper = document.createElement('div');
        wrapper.className = _constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.OUTER_WRAPPER;
        const adSpan = this.createAdSpan();
        wrapper.appendChild(adSpan);
        return wrapper;
    }
    createImageAd(value) {
        const wrapper = this.dom.createAnchorAd();
        wrapper.classList.add(_constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.AD_IMG_WRAPPER);
        const img = document.createElement('img');
        img.className = _constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.AD_IMG_ELEMENT;
        img.src = value.image_file;
        wrapper.appendChild(img);
        return wrapper;
    }
}


/***/ }),

/***/ "./src/components/main.ts":
/*!********************************!*\
  !*** ./src/components/main.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdScript: () => (/* binding */ AdScript)
/* harmony export */ });
/* harmony import */ var _ads_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ads-manager */ "./src/components/ads-manager.ts");
/* harmony import */ var _detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./detector */ "./src/components/detector.ts");
/* harmony import */ var _tracker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tracker */ "./src/components/tracker.ts");
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles.css */ "./src/styles.css");




class AdScript {
    constructor(_managerConfig) {
        this.detector = new _detector__WEBPACK_IMPORTED_MODULE_1__.Detector();
        this.tracker = new _tracker__WEBPACK_IMPORTED_MODULE_2__.Tracker();
        this.manager = new _ads_manager__WEBPACK_IMPORTED_MODULE_0__.AdsManager(_managerConfig);
    }
    start(options = ['manual', 'auto']) {
        this.tracker.listenMouseMovement();
        this.detector.getResultAsync().then((result) => {
            const startConfig = {
                mode: options,
                isMobile: this.detector.isMobile(),
            };
            this.manager.start(startConfig);
        });
    }
}


/***/ }),

/***/ "./src/components/overlay.ts":
/*!***********************************!*\
  !*** ./src/components/overlay.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Overlay: () => (/* binding */ Overlay)
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/components/dom.ts");
/* harmony import */ var _assets_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/icons */ "./src/assets/icons/index.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/constants */ "./src/constants/index.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/utils */ "./src/utils/index.ts");




class Overlay {
    constructor() {
        this.dom = new _dom__WEBPACK_IMPORTED_MODULE_0__.DOM();
    }
    createRemoveOverlayButton(options) {
        const button = document.createElement('button');
        button.classList.add(_constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.RESET_STYLE, _constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.ICON_SM_WRAPPER);
        button.style.boxSizing = 'inherit';
        button.style.display = 'block';
        button.style.width = '28px';
        button.style.height = '28px';
        button.style.padding = '4px';
        button.style.color = 'rgb(0,0,0)';
        button.style.borderRadius = '100%';
        button.style.background = 'rgba(255,255,255,0.8)';
        button.style.cursor = 'pointer';
        if (options) {
            for (const key in options) {
                button.style[key] = options[key];
            }
        }
        button.innerHTML = _assets_icons__WEBPACK_IMPORTED_MODULE_1__["default"].Remove;
        return button;
    }
    createFullscreenBlurOverlay() {
        const blurDiv = document.createElement('div');
        blurDiv.classList.add(_constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.RESET_STYLE, _constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.FULLSCREEN_BLUR_OVERLAY);
        return blurDiv;
    }
    createOverlayContainer() {
        const container = document.createElement('div');
        container.classList.add(_constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.AIOZ_AD_OVERLAY);
        container.setAttribute(_constants__WEBPACK_IMPORTED_MODULE_2__.ATTRIBUTE_AD_FORMAT, 'overlay');
        container.setAttribute(_constants__WEBPACK_IMPORTED_MODULE_2__.ATTRIBUTE_OVERLAY_AD_POS, 'center');
        const blurOverlay = this.createFullscreenBlurOverlay();
        container.appendChild(blurOverlay);
        return container;
    }
    createOverlayDialogContainer(type, adData, closeHandler) {
        const dialog = document.createElement('ins');
        dialog.classList.add(_constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.RESET_STYLE, _constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.DIALOG_CONTAINER);
        dialog.style.width = `${window.innerWidth * 0.95}px`;
        dialog.style.height = `${window.innerHeight * 0.95}px`;
        dialog.style.maxHeight = '600px';
        const bgDiv = document.createElement('div');
        bgDiv.classList.add(_constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.DIALOG_BG);
        bgDiv.style.backgroundImage = `url(${adData.image_file})`;
        bgDiv.style.backgroundPosition = 'center';
        bgDiv.style.backgroundSize = 'cover';
        let content;
        if (type === 'no-logo') {
            content = this.createDialog(adData, closeHandler);
        }
        else {
            content = this.createDialogWithLogo(adData, closeHandler);
            bgDiv.style.filter = 'opacity(0.3)';
            dialog.style.padding = '10px';
        }
        dialog.append(bgDiv, content);
        return dialog;
    }
    createDialog(adData, closeHandler) {
        const div = document.createElement('div');
        div.style.boxSizing = 'inherit';
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.justifyContent = 'end';
        const removeBtn = this.createRemoveOverlayButton({
            position: 'absolute',
            top: '5px',
            right: '5px',
        });
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeHandler();
        });
        const contentWrapper = document.createElement('div');
        contentWrapper.style.display = 'flex';
        contentWrapper.style.flexDirection = 'column';
        contentWrapper.style.alignItems = 'stretch';
        contentWrapper.style.gap = '10px';
        contentWrapper.style.lineHeight = '1.5';
        contentWrapper.style.color = 'rgb(255,255,255)';
        contentWrapper.style.padding = '0 18px 18px';
        {
            const title = document.createElement('h1');
            title.classList.add(_constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.RESET_STYLE);
            title.style.fontSize = '18px';
            title.style.fontWeight = '700';
            title.innerText = adData.headline || adData.headline;
            const description = document.createElement('p');
            description.classList.add(_constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.RESET_STYLE);
            description.style.fontSize = '14px';
            description.style.fontWeight = '500';
            description.innerHTML = adData.description;
            contentWrapper.append(title, description);
        }
        const learnMoreAnchor = this.dom.createAnchorAd('#');
        learnMoreAnchor.style.display = 'block';
        learnMoreAnchor.style.width = '100%';
        {
            const innerLearnMoreWrapper = document.createElement('div');
            innerLearnMoreWrapper.style.background = 'rgb(123,221,157)';
            innerLearnMoreWrapper.style.display = 'flex';
            innerLearnMoreWrapper.style.flexDirection = 'row';
            innerLearnMoreWrapper.style.alignItems = 'center';
            innerLearnMoreWrapper.style.paddingLeft = '18px';
            innerLearnMoreWrapper.style.paddingRight = '8px';
            innerLearnMoreWrapper.style.minHeight = '44px';
            innerLearnMoreWrapper.style.color = 'rgb(0,0,0)';
            innerLearnMoreWrapper.style.lineHeight = '1.3';
            const learnMoreText = document.createElement('span');
            learnMoreText.style.fontSize = '16px';
            learnMoreText.style.fontWeight = '500';
            learnMoreText.style.flex = '1';
            learnMoreText.innerText = 'Learn more';
            const learnMoreIcon = document.createElement('span');
            learnMoreIcon.classList.add(_constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.ICON_LG_WRAPPER);
            learnMoreIcon.style.display = 'inline-block';
            learnMoreIcon.style.width = '40px';
            learnMoreIcon.style.height = '40px';
            learnMoreIcon.innerHTML = _assets_icons__WEBPACK_IMPORTED_MODULE_1__["default"].ChevronRight;
            innerLearnMoreWrapper.append(learnMoreText, learnMoreIcon);
            learnMoreAnchor.append(innerLearnMoreWrapper);
        }
        div.append(removeBtn, contentWrapper, learnMoreAnchor);
        return div;
    }
    createDialogWithLogo(adData, closeHandler) {
        const div = document.createElement('div');
        div.style.boxSizing = 'inherit';
        div.style.background = 'rgb(255,255,255)';
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.borderRadius = '8px';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.justifyContent = 'space-between';
        div.style.overflow = 'hidden';
        const thumbnailAnchor = this.dom.createAnchorAd('#');
        thumbnailAnchor.classList.add(_constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.AD_IMG_WRAPPER);
        thumbnailAnchor.style.width = '100%';
        thumbnailAnchor.style.height = '55%';
        thumbnailAnchor.style.justifyContent = 'center';
        {
            const thumbnailImg = document.createElement('img');
            thumbnailImg.classList.add(_constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.AD_IMG_ELEMENT);
            thumbnailImg.style.width = '100%';
            thumbnailImg.src = adData.image_file;
            thumbnailAnchor.appendChild(thumbnailImg);
        }
        const contentDiv = document.createElement('div');
        contentDiv.style.display = 'flex';
        contentDiv.style.flexDirection = 'column';
        contentDiv.style.justifyContent = 'space-between';
        contentDiv.style.alignItems = 'center';
        contentDiv.style.gap = '6px';
        contentDiv.style.lineHeight = '1.3';
        contentDiv.style.margin = '20px 10px';
        {
            const contentLogoCtn = document.createElement('div');
            contentLogoCtn.classList.add(_constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.AD_IMG_WRAPPER);
            contentLogoCtn.style.width = '64px';
            contentLogoCtn.style.height = '64px';
            const contentLogoImg = document.createElement('img');
            contentLogoImg.classList.add(_constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.AD_IMG_ELEMENT);
            contentLogoImg.src = adData.logo_file;
            contentLogoCtn.appendChild(contentLogoImg);
            const title = document.createElement('h1');
            title.classList.add(_constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.RESET_STYLE);
            title.style.fontSize = '28px';
            title.style.fontWeight = '700';
            title.style.color = 'rgb(84,84,84)';
            title.style.textAlign = 'center';
            title.innerText = adData.headline;
            const description = document.createElement('p');
            description.classList.add(_constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.RESET_STYLE);
            description.style.fontSize = '18px';
            description.style.fontWeight = '400';
            description.style.color = 'rgb(130,130,130)';
            description.style.textAlign = 'center';
            description.innerHTML = adData.description;
            contentDiv.append(contentLogoCtn, title, description);
        }
        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.alignItems = 'center';
        btnContainer.style.justifyContent = 'space-evenly';
        btnContainer.style.margin = '0 10px';
        {
            const closeBtn = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.createButtonElement)();
            closeBtn.innerText = 'Close';
            closeBtn.addEventListener('click', closeHandler);
            const learnBtn = document.createElement('div');
            learnBtn.classList.add(_constants__WEBPACK_IMPORTED_MODULE_2__.AD_CLASSES.BUTTON_ELEMENT);
            learnBtn.style.minWidth = '100px';
            learnBtn.style.height = '36px';
            learnBtn.style.background = 'rgb(123,221,157)';
            learnBtn.innerText = 'Learn more';
            const learnAnchor = this.dom.createAnchorAd('#');
            learnAnchor.appendChild(learnBtn);
            btnContainer.append(closeBtn, learnAnchor);
        }
        const filler = document.createElement('div');
        filler.style.flex = '1';
        div.append(thumbnailAnchor, contentDiv, btnContainer, filler);
        return div;
    }
}


/***/ }),

/***/ "./src/components/sidebar.ts":
/*!***********************************!*\
  !*** ./src/components/sidebar.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Sidebar: () => (/* binding */ Sidebar)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils/index.ts");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/components/dom.ts");


class Sidebar {
    constructor() {
        this.dom = new _dom__WEBPACK_IMPORTED_MODULE_1__.DOM();
    }
    findSidebarContainer(mainContainer) {
        let sidebarLeft = null;
        let sidebarRight = null;
        let container = mainContainer;
        while (true) {
            const parentContainer = container.parentElement;
            if (!parentContainer)
                break;
            const childEls = Array.from(parentContainer.children).filter((e) => e.clientWidth > 1 &&
                e.clientHeight > 1 &&
                !(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isHiddenElement)(e) &&
                e !== container);
            if (childEls.length == 0)
                break;
            const { width: pWidth, left: pLeft, right: pRight, } = parentContainer.getBoundingClientRect();
            for (const el of childEls) {
                const { width, height, left, right } = el.getBoundingClientRect();
                if (width < pWidth * 0.35 &&
                    height >= 300) {
                    if (Math.abs(left - pLeft) <= 75)
                        sidebarLeft = el;
                    else if (Math.abs(right - pRight) <= 75)
                        sidebarRight = el;
                }
            }
            container = parentContainer;
            if (container === this.dom.appBodyEl ||
                (sidebarLeft !== null && sidebarRight !== null)) {
                break;
            }
        }
        return {
            sidebarLeft,
            sidebarRight,
        };
    }
    findSidebarWrapper(sidebarContainer) {
        const childEls = Array.from(sidebarContainer.children).filter((e) => !(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isHiddenElement)(e));
        if (childEls.length == 1) {
            return childEls[0];
        }
        const { width: cWidth, height: cHeight } = sidebarContainer.getBoundingClientRect();
        let result = sidebarContainer;
        for (const el of childEls) {
            const { width, height } = el.getBoundingClientRect();
            if (width >= cWidth * 0.85 && height >= cHeight * 0.85) {
                result = el;
            }
        }
        return result;
    }
}


/***/ }),

/***/ "./src/components/tracker.ts":
/*!***********************************!*\
  !*** ./src/components/tracker.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tracker: () => (/* binding */ Tracker)
/* harmony export */ });
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/services */ "./src/services/index.ts");
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/throttle */ "./node_modules/lodash/throttle.js");
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_throttle__WEBPACK_IMPORTED_MODULE_1__);


class Tracker {
    constructor() {
        if (!Tracker.instance) {
            console.log('new instance Tracker');
            Tracker.instance = this;
            this._visitId = null;
            this.service = new _services__WEBPACK_IMPORTED_MODULE_0__.ScriptService();
            this.mouseMovements = [];
            this.lastMouseMovement = null;
            this.subDistence = Math.floor(window.innerWidth * 0.005);
            this.intervalCheckMouseMovements = null;
            this.eventHandlers = new Map();
        }
        return Tracker.instance;
    }
    set visitId(visitId) {
        this._visitId = visitId;
    }
    get visitId() {
        return this._visitId;
    }
    addToMouseMovements(data) {
        if (this.mouseMovements.length == 0) {
            this.mouseMovements.push([data]);
        }
        else {
            const lastArray = this.mouseMovements[this.mouseMovements.length - 1];
            if (lastArray.length < 100) {
                lastArray.push(data);
            }
            else {
                this.mouseMovements.push([data]);
            }
        }
    }
    listenMouseMovement() {
        const mouseMoveHandler = (event) => {
            const { pageX, pageY } = event;
            const timestamp = Date.now();
            if (this.mouseMovements.length == 0) {
                const movement = {
                    x: pageX,
                    y: pageY,
                    speed: 0,
                    event_type: 'move',
                    timestamp: timestamp,
                };
                this.addToMouseMovements(movement);
                this.lastMouseMovement = movement;
            }
            else {
                const lastMovement = this.lastMouseMovement;
                if (!lastMovement)
                    return;
                const delta = Math.sqrt(Math.pow((pageX - lastMovement.x), 2) + Math.pow((pageY - lastMovement.y), 2));
                if (delta > this.subDistence) {
                    const velocity = Math.floor(delta / (timestamp - lastMovement.timestamp));
                    const movement = {
                        x: pageX,
                        y: pageY,
                        speed: velocity,
                        event_type: 'move',
                        timestamp: timestamp,
                    };
                    this.lastMouseMovement = movement;
                    this.addToMouseMovements(movement);
                }
            }
        };
        const scrollHandler = lodash_throttle__WEBPACK_IMPORTED_MODULE_1___default()(() => {
            if (!this.lastMouseMovement)
                return;
            const movement = {
                x: this.lastMouseMovement.x,
                y: this.lastMouseMovement.y,
                speed: 0,
                event_type: 'scroll',
                timestamp: Date.now(),
            };
            this.addToMouseMovements(movement);
        }, 50);
        this.eventHandlers.set('mousemove', mouseMoveHandler);
        this.eventHandlers.set('scroll', scrollHandler);
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('scroll', scrollHandler);
        this.startMouseMovementsIntervally();
    }
    removeMouseMovementEvents() {
        if (this.intervalCheckMouseMovements) {
            clearInterval(this.intervalCheckMouseMovements);
            this.intervalCheckMouseMovements = null;
        }
        this.eventHandlers.forEach((handler, eventType) => {
            document.removeEventListener(eventType, handler);
        });
        this.eventHandlers.clear();
    }
    startMouseMovementsIntervally() {
        this.intervalCheckMouseMovements = setInterval(() => {
            if (!this.visitId || this.mouseMovements.length == 0)
                return;
            const firstArr = this.mouseMovements[0];
            if (firstArr.length > 0) {
                this.service
                    .sendMouseMovements(this.visitId, {
                    mouseMovements: firstArr,
                })
                    .catch((error) => {
                    console.error('Error sending mouse movements:', error);
                });
                this.mouseMovements.shift();
            }
        }, 5000);
    }
}


/***/ }),

/***/ "./src/configs/environments.ts":
/*!*************************************!*\
  !*** ./src/configs/environments.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BASE_DEV_URL: () => (/* binding */ BASE_DEV_URL),
/* harmony export */   BASE_URL: () => (/* binding */ BASE_URL)
/* harmony export */ });
const BASE_URL = 'https://api-ads.attoaioz.cyou/api/v1';
const BASE_DEV_URL = 'http://157.230.195.37:8084/api/v1';


/***/ }),

/***/ "./src/configs/index.ts":
/*!******************************!*\
  !*** ./src/configs/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BASE_DEV_URL: () => (/* reexport safe */ _environments__WEBPACK_IMPORTED_MODULE_0__.BASE_DEV_URL),
/* harmony export */   BASE_URL: () => (/* reexport safe */ _environments__WEBPACK_IMPORTED_MODULE_0__.BASE_URL)
/* harmony export */ });
/* harmony import */ var _environments__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./environments */ "./src/configs/environments.ts");



/***/ }),

/***/ "./src/constants/index.ts":
/*!********************************!*\
  !*** ./src/constants/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AD_CLASSES: () => (/* binding */ AD_CLASSES),
/* harmony export */   ATTRIBUTE_AD_FORMAT: () => (/* binding */ ATTRIBUTE_AD_FORMAT),
/* harmony export */   ATTRIBUTE_AD_PANEL_ID: () => (/* binding */ ATTRIBUTE_AD_PANEL_ID),
/* harmony export */   ATTRIBUTE_AUTO_AD_POS: () => (/* binding */ ATTRIBUTE_AUTO_AD_POS),
/* harmony export */   ATTRIBUTE_MANUAL_AD_CLIENT: () => (/* binding */ ATTRIBUTE_MANUAL_AD_CLIENT),
/* harmony export */   ATTRIBUTE_MANUAL_AD_SLOT: () => (/* binding */ ATTRIBUTE_MANUAL_AD_SLOT),
/* harmony export */   ATTRIBUTE_OVERLAY_AD_POS: () => (/* binding */ ATTRIBUTE_OVERLAY_AD_POS),
/* harmony export */   DEFAULT_FETCH_ADS_INTERVAL: () => (/* binding */ DEFAULT_FETCH_ADS_INTERVAL),
/* harmony export */   IGNORED_ELEMENTS: () => (/* binding */ IGNORED_ELEMENTS)
/* harmony export */ });
const ATTRIBUTE_MANUAL_AD_CLIENT = 'data-ad-client';
const ATTRIBUTE_MANUAL_AD_SLOT = 'data-ad-slot-id';
const ATTRIBUTE_AD_FORMAT = 'data-ad-format';
const ATTRIBUTE_AUTO_AD_POS = 'data-ad-in-page-pos';
const ATTRIBUTE_OVERLAY_AD_POS = 'data-ad-overlay-pos';
const ATTRIBUTE_AD_PANEL_ID = 'data-ad-panel-id';
const DEFAULT_FETCH_ADS_INTERVAL = 30 * 1000;
const IGNORED_ELEMENTS = ['script', 'link', 'noscript', 'iframe'];
const AD_CLASSES = {
    RESET_STYLE: 'ad-reset',
    ICON_SM_WRAPPER: 'ad-icon-sm-wrapper',
    ICON_LG_WRAPPER: 'ad-icon-lg-wrapper',
    BUTTON_ELEMENT: 'ad-default-button',
    ANCHOR_ELEMENT: 'ad-default-anchor',
    AIOZ_AD_INS: 'aioz-ads',
    CONTAINER: 'ad-container',
    ROW_CONTAINER: 'ad-row-container',
    COL_CONTAINER: 'ad-col-container',
    OUTER_WRAPPER: 'ad-outer-wrapper',
    INDICATOR_SPAN: 'ad-indicator-span',
    AD_IMG_WRAPPER: 'ad-image-wrapper',
    AD_IMG_ELEMENT: 'ad-image-element',
    AIOZ_AD_OVERLAY: 'aioz-ads-overlay',
    FULLSCREEN_BLUR_OVERLAY: 'ad-fullscreen-blur-overlay',
    DIALOG_CONTAINER: 'ad-dialog-container-overlay',
    DIALOG_BG: 'ad-dialog-bg-overlay',
};


/***/ }),

/***/ "./src/services/adServices.ts":
/*!************************************!*\
  !*** ./src/services/adServices.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScriptService: () => (/* binding */ ScriptService)
/* harmony export */ });
/* harmony import */ var _configs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/configs */ "./src/configs/index.ts");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/lib/axios.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class ScriptService {
    constructor() {
        this.url = _configs__WEBPACK_IMPORTED_MODULE_0__.BASE_URL;
    }
    getAds(body_1) {
        return __awaiter(this, arguments, void 0, function* (body, config = {}) {
            const url = this.url + '/auctions';
            return axios__WEBPACK_IMPORTED_MODULE_1__["default"]
                .post(url, body, config)
                .catch((error) => {
                if (axios__WEBPACK_IMPORTED_MODULE_1__["default"].isAxiosError(error)) {
                    let message = 'Error when requesting';
                    if (error.response) {
                        message = error.response.data.message;
                    }
                    throw Error(message);
                }
                else {
                    throw Error(error.message);
                }
            });
        });
    }
    interactAd(body_1) {
        return __awaiter(this, arguments, void 0, function* (body, config = {}) {
            const url = this.url + '/actions';
            return axios__WEBPACK_IMPORTED_MODULE_1__["default"]
                .post(url, body, config)
                .catch((error) => {
                if (axios__WEBPACK_IMPORTED_MODULE_1__["default"].isAxiosError(error)) {
                    let message = 'Error when requesting';
                    if (error.response) {
                        message = error.response.data.message;
                    }
                    throw Error(message);
                }
                else {
                    throw Error(error.message);
                }
            });
        });
    }
    sendMouseMovements(visitId_1, body_1) {
        return __awaiter(this, arguments, void 0, function* (visitId, body, config = {}) {
            const url = this.url + '/visits/' + visitId + '/mouse-movements';
            return axios__WEBPACK_IMPORTED_MODULE_1__["default"]
                .put(url, body, config)
                .catch((error) => {
                if (axios__WEBPACK_IMPORTED_MODULE_1__["default"].isAxiosError(error)) {
                    let message = 'Error when requesting';
                    if (error.response) {
                        message = error.response.data.message;
                    }
                    throw Error(message);
                }
                else {
                    throw Error(error.message);
                }
            });
        });
    }
    updateAdSession(panelId_1, body_1) {
        return __awaiter(this, arguments, void 0, function* (panelId, body, config = {}) {
            const url = this.url + '/ad-panels/' + panelId + '/session-duration';
            return axios__WEBPACK_IMPORTED_MODULE_1__["default"]
                .put(url, body, config)
                .catch((error) => {
                if (axios__WEBPACK_IMPORTED_MODULE_1__["default"].isAxiosError(error)) {
                    let message = 'Error when requesting';
                    if (error.response) {
                        message = error.response.data.message;
                    }
                    throw Error(message);
                }
                else {
                    throw Error(error.message);
                }
            });
        });
    }
}


/***/ }),

/***/ "./src/services/index.ts":
/*!*******************************!*\
  !*** ./src/services/index.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScriptService: () => (/* reexport safe */ _adServices__WEBPACK_IMPORTED_MODULE_0__.ScriptService)
/* harmony export */ });
/* harmony import */ var _adServices__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./adServices */ "./src/services/adServices.ts");



/***/ }),

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_singletonStyleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/singletonStyleDomAPI.js */ "./node_modules/style-loader/dist/runtime/singletonStyleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_singletonStyleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_singletonStyleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./styles.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles.css");

      
      
      
      
      
      
      
      
      

var options = {};

;
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_singletonStyleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_5__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_5__["default"] && _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_5__["default"].locals ? _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_5__["default"].locals : undefined);


/***/ }),

/***/ "./src/types/enum.ts":
/*!***************************!*\
  !*** ./src/types/enum.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdRatio: () => (/* binding */ AdRatio)
/* harmony export */ });
var AdRatio;
(function (AdRatio) {
    AdRatio[AdRatio["LANDSCAPE"] = 1.91] = "LANDSCAPE";
    AdRatio[AdRatio["REVERSE_LANDSCAPE"] = 0.5235] = "REVERSE_LANDSCAPE";
    AdRatio[AdRatio["SQR"] = 1] = "SQR";
    AdRatio[AdRatio["COL_RECT"] = 0.5625] = "COL_RECT";
    AdRatio[AdRatio["ROW_RECT"] = 1.7778] = "ROW_RECT";
    AdRatio[AdRatio["MIN_SIZE_SQR"] = 300] = "MIN_SIZE_SQR";
    AdRatio[AdRatio["MIN_SIZE_RECT"] = 600] = "MIN_SIZE_RECT";
})(AdRatio || (AdRatio = {}));


/***/ }),

/***/ "./src/utils/index.ts":
/*!****************************!*\
  !*** ./src/utils/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createButtonElement: () => (/* binding */ createButtonElement),
/* harmony export */   filterElementChildrenWithTagName: () => (/* binding */ filterElementChildrenWithTagName),
/* harmony export */   filterElementsNotHaveContent: () => (/* binding */ filterElementsNotHaveContent),
/* harmony export */   findElementWithKey: () => (/* binding */ findElementWithKey),
/* harmony export */   getAdsInsQuery: () => (/* binding */ getAdsInsQuery),
/* harmony export */   getAutoInsQuery: () => (/* binding */ getAutoInsQuery),
/* harmony export */   getContentDensity: () => (/* binding */ getContentDensity),
/* harmony export */   getDefinedAdSize: () => (/* binding */ getDefinedAdSize),
/* harmony export */   getDensestElement: () => (/* binding */ getDensestElement),
/* harmony export */   getDistanceToCenter: () => (/* binding */ getDistanceToCenter),
/* harmony export */   getElementWrapper: () => (/* binding */ getElementWrapper),
/* harmony export */   getFilteredChildren: () => (/* binding */ getFilteredChildren),
/* harmony export */   getLargestElement: () => (/* binding */ getLargestElement),
/* harmony export */   getMainContainerElement: () => (/* binding */ getMainContainerElement),
/* harmony export */   getManualInsQuery: () => (/* binding */ getManualInsQuery),
/* harmony export */   getOverlayInsQuery: () => (/* binding */ getOverlayInsQuery),
/* harmony export */   heightElement: () => (/* binding */ heightElement),
/* harmony export */   isHiddenElement: () => (/* binding */ isHiddenElement),
/* harmony export */   isSuitableLayout: () => (/* binding */ isSuitableLayout),
/* harmony export */   isTooClose: () => (/* binding */ isTooClose),
/* harmony export */   parseElementMinWidth: () => (/* binding */ parseElementMinWidth),
/* harmony export */   parseWidthElement: () => (/* binding */ parseWidthElement)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/constants */ "./src/constants/index.ts");
/* harmony import */ var _types_enum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/types/enum */ "./src/types/enum.ts");


const findElementWithKey = (el, key) => el.tagName.toLowerCase().includes(key) ||
    el.classList.toString().includes(key) ||
    el.id.includes(key);
const filterElementChildrenWithTagName = (element, tag) => Array.from(element.children).filter((i) => i.tagName.toLowerCase() === tag);
const parseWidthElement = (element) => Math.ceil(Number(getComputedStyle(element).width.replace('px', '')));
const heightElement = (element) => Math.ceil(Number(getComputedStyle(element).height.replace('px', '')));
const getMainContainerElement = (header) => {
    let wrapper = document.querySelectorAll('main')[0];
    if (!wrapper) {
        wrapper = document.querySelectorAll('body')[0];
    }
    if (header) {
        wrapper = header.parentElement;
        while (wrapper.children.length === 1) {
            wrapper = wrapper.parentElement;
        }
    }
    return wrapper;
};
const parseElementMinWidth = (elements, width) => {
    return elements.filter((element) => element.getBoundingClientRect().width > width);
};
const getAdsInsQuery = () => `:scope ins[class="${_constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.AIOZ_AD_INS}"]`;
const getManualInsQuery = () => `:scope ins[class="${_constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.AIOZ_AD_INS}"][${_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_MANUAL_AD_SLOT}]`;
const getAutoInsQuery = () => `:scope ins[class="${_constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.AIOZ_AD_INS}"][${_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_AD_FORMAT}="in-page"][${_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_AUTO_AD_POS}]`;
const getOverlayInsQuery = () => `:scope ins[class="${_constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.AIOZ_AD_INS}"][${_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_AD_FORMAT}="overlay"][${_constants__WEBPACK_IMPORTED_MODULE_0__.ATTRIBUTE_OVERLAY_AD_POS}]`;
const filterElementsNotHaveContent = (element) => {
    return Array.from(element.children).filter((i) => !_constants__WEBPACK_IMPORTED_MODULE_0__.IGNORED_ELEMENTS.includes(i.tagName.toLowerCase()));
};
const isHiddenElement = (element) => {
    const elVisibility = element.checkVisibility({
        contentVisibilityAuto: true,
        checkOpacity: true,
        checkVisibilityCSS: true,
    });
    return (element.hidden ||
        element.ariaHidden ||
        !elVisibility ||
        _constants__WEBPACK_IMPORTED_MODULE_0__.IGNORED_ELEMENTS.includes(element.tagName.toLowerCase()));
};
const getLargestElement = (elements) => {
    if (elements.length == 0)
        return null;
    let result = elements[0];
    let curLargest = 0;
    elements.forEach((e) => {
        const { width, height } = e.getBoundingClientRect();
        const area = width * height;
        if (area > curLargest) {
            curLargest = area;
            result = e;
        }
    });
    return result;
};
const getDensestElement = (elements) => {
    return elements.reduce((result, element) => {
        if (!result)
            return element;
        if (element.textContent.length > result.textContent.length) {
            return element;
        }
        return result;
    }, null);
};
const getFilteredChildren = (element) => {
    return Array.from(element.children).filter((el) => {
        const { width, height } = el.getBoundingClientRect();
        return !isHiddenElement(el) && width > 1 && height > 1;
    });
};
const getDistanceToCenter = (element, container) => {
    const ctnPos = container.getBoundingClientRect();
    const elePos = element.getBoundingClientRect();
    const thrhMid = ctnPos.top + ctnPos.height * 0.5;
    const avgRTC = (elePos.top + elePos.bottom) / 2;
    return avgRTC - thrhMid;
};
const isTooClose = (a, b, maxView = window.innerHeight * 0.7) => {
    const aPos = a.getBoundingClientRect();
    const bPos = b.getBoundingClientRect();
    return aPos.top < bPos.top
        ? Math.abs(aPos.bottom - bPos.top) < maxView
        : Math.abs(bPos.bottom - aPos.top) < maxView;
};
const getContentDensity = (element) => {
    const { width, height } = element.getBoundingClientRect();
    const area = width * height;
    const contentLength = (element.textContent || '').length;
    return contentLength / area;
};
const getDefinedAdSize = (width, height) => {
    let rWidth = width;
    let rHeight = height || 1;
    const iRatio = width / height;
    if (iRatio > _types_enum__WEBPACK_IMPORTED_MODULE_1__.AdRatio.LANDSCAPE - 0.71) {
        let edge = width;
        if (edge < _types_enum__WEBPACK_IMPORTED_MODULE_1__.AdRatio.MIN_SIZE_RECT)
            edge = 600;
        rWidth = edge;
        rHeight = edge * _types_enum__WEBPACK_IMPORTED_MODULE_1__.AdRatio.REVERSE_LANDSCAPE;
    }
    else if (iRatio < _types_enum__WEBPACK_IMPORTED_MODULE_1__.AdRatio.COL_RECT + 0.2375) {
        let edge = width;
        if (edge < _types_enum__WEBPACK_IMPORTED_MODULE_1__.AdRatio.MIN_SIZE_RECT)
            edge = _types_enum__WEBPACK_IMPORTED_MODULE_1__.AdRatio.MIN_SIZE_RECT;
        rWidth = edge;
        rHeight = edge * _types_enum__WEBPACK_IMPORTED_MODULE_1__.AdRatio.ROW_RECT;
    }
    else {
        let smallerEdge = width <= height ? width : height;
        if (smallerEdge < _types_enum__WEBPACK_IMPORTED_MODULE_1__.AdRatio.MIN_SIZE_SQR)
            smallerEdge = _types_enum__WEBPACK_IMPORTED_MODULE_1__.AdRatio.MIN_SIZE_SQR;
        rWidth = smallerEdge;
        rHeight = smallerEdge;
    }
    return {
        width: Math.round(rWidth),
        height: Math.round(rHeight),
    };
};
const getElementWrapper = (element) => {
    const parent = element.parentElement;
    if (!parent)
        return element;
    if (parent.childElementCount == 1 && parent.firstElementChild === element) {
        return getElementWrapper(parent);
    }
    for (const el of parent.children) {
        if (el.clientWidth > 1 && el.clientHeight > 1 && !isHiddenElement(el)) {
            return element;
        }
    }
    return getElementWrapper(parent);
};
const isSuitableLayout = (element) => {
    const style = window.getComputedStyle(element);
    return !(element.tagName === 'TABLE' ||
        style.display == 'table' ||
        style.display == 'grid' ||
        (style.display == 'flex' &&
            (style.flexDirection === 'row' || style.flexDirection === 'row-reverse')));
};
const createButtonElement = (options) => {
    const button = document.createElement('button');
    button.classList.add(_constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.RESET_STYLE, _constants__WEBPACK_IMPORTED_MODULE_0__.AD_CLASSES.BUTTON_ELEMENT);
    button.style.minWidth = '100px';
    button.style.height = '36px';
    if (options) {
        for (const key in options) {
            button.style[key] = options[key];
        }
    }
    return button;
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/main */ "./src/components/main.ts");

const script = new _components_main__WEBPACK_IMPORTED_MODULE_0__.AdScript();
script.start();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSwrQ0FBK0MsaUJBQWlCO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDOUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdB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Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLDBCQUEwQixjQUFjO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsbUJBQW1CO0FBQy9DLHdDQUF3QztBQUN4Qyx3REFBd0Q7QUFDeEQsK0JBQStCO0FBQy9C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c0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0FBQyxRQUFRLEdBQUcsT0FBTztJQUMvQixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNO0lBQzVCLElBQUksT0FBTyxFQUFFLENBQUM7UUFDWixLQUFLLE1BQU0sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQzFCLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBRTtRQUNuQyxDQUFDO0lBQ0gsQ0FBQztJQUNELE9BQU8sTUFBTTtBQUNmLENBQUM7Ozs7Ozs7VUNoUUQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7QUNBNEM7QUFFNUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxzREFBUSxFQUFFO0FBQzdCLE1BQU0sQ0FBQyxLQUFLLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL2FkYXB0ZXJzLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMvZmV0Y2guanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxlZEVycm9yLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvcy5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3NFcnJvci5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3NIZWFkZXJzLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvbWVyZ2VDb25maWcuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzL2luZGV4LmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvZGVmYXVsdHMvdHJhbnNpdGlvbmFsLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvZW52L2RhdGEuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL0F4aW9zVVJMU2VhcmNoUGFyYW1zLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9IdHRwU3RhdHVzQ29kZS5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYmluZC5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb21wb3NlU2lnbmFscy5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvZm9ybURhdGFUb0pTT04uanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQXhpb3NFcnJvci5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9udWxsLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlUHJvdG9jb2wuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3Byb2dyZXNzRXZlbnRSZWR1Y2VyLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9yZXNvbHZlQ29uZmlnLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9zcGVlZG9tZXRlci5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy90aHJvdHRsZS5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdG9Gb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdG9VUkxFbmNvZGVkRm9ybS5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdHJhY2tTdHJlYW0uanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3ZhbGlkYXRvci5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3BsYXRmb3JtL2Jyb3dzZXIvY2xhc3Nlcy9CbG9iLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvcGxhdGZvcm0vYnJvd3Nlci9jbGFzc2VzL0Zvcm1EYXRhLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvcGxhdGZvcm0vYnJvd3Nlci9jbGFzc2VzL1VSTFNlYXJjaFBhcmFtcy5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3BsYXRmb3JtL2Jyb3dzZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9wbGF0Zm9ybS9jb21tb24vdXRpbHMuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9wbGF0Zm9ybS9pbmRleC5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL3NyYy9zdHlsZXMuY3NzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fU3ltYm9sLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRyaW0uanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvbG9kYXNoL190cmltbWVkRW5kSW5kZXguanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9kZWJvdW5jZS5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTeW1ib2wuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9ub3cuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC90aHJvdHRsZS5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2luZ2xldG9uU3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vbm9kZV9tb2R1bGVzL3VhLXBhcnNlci1qcy9zcmMvbWFpbi91YS1wYXJzZXIubWpzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL3NyYy9hc3NldHMvaWNvbnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vc3JjL2NvbXBvbmVudHMvYWQtdW5pdC50cyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9zcmMvY29tcG9uZW50cy9hZHMtbWFuYWdlci50cyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9zcmMvY29tcG9uZW50cy9jb250ZW50LnRzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL3NyYy9jb21wb25lbnRzL2RldGVjdG9yLnRzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL3NyYy9jb21wb25lbnRzL2RvbS50cyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9zcmMvY29tcG9uZW50cy9ldmVudC1zdWJzY3JpYmVyLnRzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL3NyYy9jb21wb25lbnRzL2Zvb3Rlci50cyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9zcmMvY29tcG9uZW50cy9oZWFkZXIudHMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vc3JjL2NvbXBvbmVudHMvaW5zLnRzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL3NyYy9jb21wb25lbnRzL21haW4udHMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vc3JjL2NvbXBvbmVudHMvb3ZlcmxheS50cyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvLi9zcmMvY29tcG9uZW50cy9zaWRlYmFyLnRzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL3NyYy9jb21wb25lbnRzL3RyYWNrZXIudHMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vc3JjL2NvbmZpZ3MvZW52aXJvbm1lbnRzLnRzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL3NyYy9jb25maWdzL2luZGV4LnRzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL3NyYy9jb25zdGFudHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vc3JjL3NlcnZpY2VzL2FkU2VydmljZXMudHMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vc3JjL3NlcnZpY2VzL2luZGV4LnRzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL3NyYy9zdHlsZXMuY3NzPzgwMzUiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vc3JjL3R5cGVzL2VudW0udHMiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzLy4vc3JjL3V0aWxzL2luZGV4LnRzIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYWlvei1hZC1zY3JpcHRzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9haW96LWFkLXNjcmlwdHMvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL2Fpb3otYWQtc2NyaXB0cy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IGh0dHBBZGFwdGVyIGZyb20gJy4vaHR0cC5qcyc7XG5pbXBvcnQgeGhyQWRhcHRlciBmcm9tICcuL3hoci5qcyc7XG5pbXBvcnQgZmV0Y2hBZGFwdGVyIGZyb20gJy4vZmV0Y2guanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSBcIi4uL2NvcmUvQXhpb3NFcnJvci5qc1wiO1xuXG5jb25zdCBrbm93bkFkYXB0ZXJzID0ge1xuICBodHRwOiBodHRwQWRhcHRlcixcbiAgeGhyOiB4aHJBZGFwdGVyLFxuICBmZXRjaDogZmV0Y2hBZGFwdGVyXG59XG5cbnV0aWxzLmZvckVhY2goa25vd25BZGFwdGVycywgKGZuLCB2YWx1ZSkgPT4ge1xuICBpZiAoZm4pIHtcbiAgICB0cnkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCAnbmFtZScsIHt2YWx1ZX0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lbXB0eVxuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sICdhZGFwdGVyTmFtZScsIHt2YWx1ZX0pO1xuICB9XG59KTtcblxuY29uc3QgcmVuZGVyUmVhc29uID0gKHJlYXNvbikgPT4gYC0gJHtyZWFzb259YDtcblxuY29uc3QgaXNSZXNvbHZlZEhhbmRsZSA9IChhZGFwdGVyKSA9PiB1dGlscy5pc0Z1bmN0aW9uKGFkYXB0ZXIpIHx8IGFkYXB0ZXIgPT09IG51bGwgfHwgYWRhcHRlciA9PT0gZmFsc2U7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZ2V0QWRhcHRlcjogKGFkYXB0ZXJzKSA9PiB7XG4gICAgYWRhcHRlcnMgPSB1dGlscy5pc0FycmF5KGFkYXB0ZXJzKSA/IGFkYXB0ZXJzIDogW2FkYXB0ZXJzXTtcblxuICAgIGNvbnN0IHtsZW5ndGh9ID0gYWRhcHRlcnM7XG4gICAgbGV0IG5hbWVPckFkYXB0ZXI7XG4gICAgbGV0IGFkYXB0ZXI7XG5cbiAgICBjb25zdCByZWplY3RlZFJlYXNvbnMgPSB7fTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIG5hbWVPckFkYXB0ZXIgPSBhZGFwdGVyc1tpXTtcbiAgICAgIGxldCBpZDtcblxuICAgICAgYWRhcHRlciA9IG5hbWVPckFkYXB0ZXI7XG5cbiAgICAgIGlmICghaXNSZXNvbHZlZEhhbmRsZShuYW1lT3JBZGFwdGVyKSkge1xuICAgICAgICBhZGFwdGVyID0ga25vd25BZGFwdGVyc1soaWQgPSBTdHJpbmcobmFtZU9yQWRhcHRlcikpLnRvTG93ZXJDYXNlKCldO1xuXG4gICAgICAgIGlmIChhZGFwdGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcihgVW5rbm93biBhZGFwdGVyICcke2lkfSdgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoYWRhcHRlcikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmVqZWN0ZWRSZWFzb25zW2lkIHx8ICcjJyArIGldID0gYWRhcHRlcjtcbiAgICB9XG5cbiAgICBpZiAoIWFkYXB0ZXIpIHtcblxuICAgICAgY29uc3QgcmVhc29ucyA9IE9iamVjdC5lbnRyaWVzKHJlamVjdGVkUmVhc29ucylcbiAgICAgICAgLm1hcCgoW2lkLCBzdGF0ZV0pID0+IGBhZGFwdGVyICR7aWR9IGAgK1xuICAgICAgICAgIChzdGF0ZSA9PT0gZmFsc2UgPyAnaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgZW52aXJvbm1lbnQnIDogJ2lzIG5vdCBhdmFpbGFibGUgaW4gdGhlIGJ1aWxkJylcbiAgICAgICAgKTtcblxuICAgICAgbGV0IHMgPSBsZW5ndGggP1xuICAgICAgICAocmVhc29ucy5sZW5ndGggPiAxID8gJ3NpbmNlIDpcXG4nICsgcmVhc29ucy5tYXAocmVuZGVyUmVhc29uKS5qb2luKCdcXG4nKSA6ICcgJyArIHJlbmRlclJlYXNvbihyZWFzb25zWzBdKSkgOlxuICAgICAgICAnYXMgbm8gYWRhcHRlciBzcGVjaWZpZWQnO1xuXG4gICAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcihcbiAgICAgICAgYFRoZXJlIGlzIG5vIHN1aXRhYmxlIGFkYXB0ZXIgdG8gZGlzcGF0Y2ggdGhlIHJlcXVlc3QgYCArIHMsXG4gICAgICAgICdFUlJfTk9UX1NVUFBPUlQnXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBhZGFwdGVyO1xuICB9LFxuICBhZGFwdGVyczoga25vd25BZGFwdGVyc1xufVxuIiwiaW1wb3J0IHBsYXRmb3JtIGZyb20gXCIuLi9wbGF0Zm9ybS9pbmRleC5qc1wiO1xuaW1wb3J0IHV0aWxzIGZyb20gXCIuLi91dGlscy5qc1wiO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSBcIi4uL2NvcmUvQXhpb3NFcnJvci5qc1wiO1xuaW1wb3J0IGNvbXBvc2VTaWduYWxzIGZyb20gXCIuLi9oZWxwZXJzL2NvbXBvc2VTaWduYWxzLmpzXCI7XG5pbXBvcnQge3RyYWNrU3RyZWFtfSBmcm9tIFwiLi4vaGVscGVycy90cmFja1N0cmVhbS5qc1wiO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tIFwiLi4vY29yZS9BeGlvc0hlYWRlcnMuanNcIjtcbmltcG9ydCB7cHJvZ3Jlc3NFdmVudFJlZHVjZXIsIHByb2dyZXNzRXZlbnREZWNvcmF0b3IsIGFzeW5jRGVjb3JhdG9yfSBmcm9tIFwiLi4vaGVscGVycy9wcm9ncmVzc0V2ZW50UmVkdWNlci5qc1wiO1xuaW1wb3J0IHJlc29sdmVDb25maWcgZnJvbSBcIi4uL2hlbHBlcnMvcmVzb2x2ZUNvbmZpZy5qc1wiO1xuaW1wb3J0IHNldHRsZSBmcm9tIFwiLi4vY29yZS9zZXR0bGUuanNcIjtcblxuY29uc3QgaXNGZXRjaFN1cHBvcnRlZCA9IHR5cGVvZiBmZXRjaCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgUmVxdWVzdCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgUmVzcG9uc2UgPT09ICdmdW5jdGlvbic7XG5jb25zdCBpc1JlYWRhYmxlU3RyZWFtU3VwcG9ydGVkID0gaXNGZXRjaFN1cHBvcnRlZCAmJiB0eXBlb2YgUmVhZGFibGVTdHJlYW0gPT09ICdmdW5jdGlvbic7XG5cbi8vIHVzZWQgb25seSBpbnNpZGUgdGhlIGZldGNoIGFkYXB0ZXJcbmNvbnN0IGVuY29kZVRleHQgPSBpc0ZldGNoU3VwcG9ydGVkICYmICh0eXBlb2YgVGV4dEVuY29kZXIgPT09ICdmdW5jdGlvbicgP1xuICAgICgoZW5jb2RlcikgPT4gKHN0cikgPT4gZW5jb2Rlci5lbmNvZGUoc3RyKSkobmV3IFRleHRFbmNvZGVyKCkpIDpcbiAgICBhc3luYyAoc3RyKSA9PiBuZXcgVWludDhBcnJheShhd2FpdCBuZXcgUmVzcG9uc2Uoc3RyKS5hcnJheUJ1ZmZlcigpKVxuKTtcblxuY29uc3QgdGVzdCA9IChmbiwgLi4uYXJncykgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiAhIWZuKC4uLmFyZ3MpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuY29uc3Qgc3VwcG9ydHNSZXF1ZXN0U3RyZWFtID0gaXNSZWFkYWJsZVN0cmVhbVN1cHBvcnRlZCAmJiB0ZXN0KCgpID0+IHtcbiAgbGV0IGR1cGxleEFjY2Vzc2VkID0gZmFsc2U7XG5cbiAgY29uc3QgaGFzQ29udGVudFR5cGUgPSBuZXcgUmVxdWVzdChwbGF0Zm9ybS5vcmlnaW4sIHtcbiAgICBib2R5OiBuZXcgUmVhZGFibGVTdHJlYW0oKSxcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICBnZXQgZHVwbGV4KCkge1xuICAgICAgZHVwbGV4QWNjZXNzZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuICdoYWxmJztcbiAgICB9LFxuICB9KS5oZWFkZXJzLmhhcygnQ29udGVudC1UeXBlJyk7XG5cbiAgcmV0dXJuIGR1cGxleEFjY2Vzc2VkICYmICFoYXNDb250ZW50VHlwZTtcbn0pO1xuXG5jb25zdCBERUZBVUxUX0NIVU5LX1NJWkUgPSA2NCAqIDEwMjQ7XG5cbmNvbnN0IHN1cHBvcnRzUmVzcG9uc2VTdHJlYW0gPSBpc1JlYWRhYmxlU3RyZWFtU3VwcG9ydGVkICYmXG4gIHRlc3QoKCkgPT4gdXRpbHMuaXNSZWFkYWJsZVN0cmVhbShuZXcgUmVzcG9uc2UoJycpLmJvZHkpKTtcblxuXG5jb25zdCByZXNvbHZlcnMgPSB7XG4gIHN0cmVhbTogc3VwcG9ydHNSZXNwb25zZVN0cmVhbSAmJiAoKHJlcykgPT4gcmVzLmJvZHkpXG59O1xuXG5pc0ZldGNoU3VwcG9ydGVkICYmICgoKHJlcykgPT4ge1xuICBbJ3RleHQnLCAnYXJyYXlCdWZmZXInLCAnYmxvYicsICdmb3JtRGF0YScsICdzdHJlYW0nXS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICFyZXNvbHZlcnNbdHlwZV0gJiYgKHJlc29sdmVyc1t0eXBlXSA9IHV0aWxzLmlzRnVuY3Rpb24ocmVzW3R5cGVdKSA/IChyZXMpID0+IHJlc1t0eXBlXSgpIDpcbiAgICAgIChfLCBjb25maWcpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoYFJlc3BvbnNlIHR5cGUgJyR7dHlwZX0nIGlzIG5vdCBzdXBwb3J0ZWRgLCBBeGlvc0Vycm9yLkVSUl9OT1RfU1VQUE9SVCwgY29uZmlnKTtcbiAgICAgIH0pXG4gIH0pO1xufSkobmV3IFJlc3BvbnNlKSk7XG5cbmNvbnN0IGdldEJvZHlMZW5ndGggPSBhc3luYyAoYm9keSkgPT4ge1xuICBpZiAoYm9keSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZih1dGlscy5pc0Jsb2IoYm9keSkpIHtcbiAgICByZXR1cm4gYm9keS5zaXplO1xuICB9XG5cbiAgaWYodXRpbHMuaXNTcGVjQ29tcGxpYW50Rm9ybShib2R5KSkge1xuICAgIGNvbnN0IF9yZXF1ZXN0ID0gbmV3IFJlcXVlc3QocGxhdGZvcm0ub3JpZ2luLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHksXG4gICAgfSk7XG4gICAgcmV0dXJuIChhd2FpdCBfcmVxdWVzdC5hcnJheUJ1ZmZlcigpKS5ieXRlTGVuZ3RoO1xuICB9XG5cbiAgaWYodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkgfHwgdXRpbHMuaXNBcnJheUJ1ZmZlcihib2R5KSkge1xuICAgIHJldHVybiBib2R5LmJ5dGVMZW5ndGg7XG4gIH1cblxuICBpZih1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhib2R5KSkge1xuICAgIGJvZHkgPSBib2R5ICsgJyc7XG4gIH1cblxuICBpZih1dGlscy5pc1N0cmluZyhib2R5KSkge1xuICAgIHJldHVybiAoYXdhaXQgZW5jb2RlVGV4dChib2R5KSkuYnl0ZUxlbmd0aDtcbiAgfVxufVxuXG5jb25zdCByZXNvbHZlQm9keUxlbmd0aCA9IGFzeW5jIChoZWFkZXJzLCBib2R5KSA9PiB7XG4gIGNvbnN0IGxlbmd0aCA9IHV0aWxzLnRvRmluaXRlTnVtYmVyKGhlYWRlcnMuZ2V0Q29udGVudExlbmd0aCgpKTtcblxuICByZXR1cm4gbGVuZ3RoID09IG51bGwgPyBnZXRCb2R5TGVuZ3RoKGJvZHkpIDogbGVuZ3RoO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0ZldGNoU3VwcG9ydGVkICYmIChhc3luYyAoY29uZmlnKSA9PiB7XG4gIGxldCB7XG4gICAgdXJsLFxuICAgIG1ldGhvZCxcbiAgICBkYXRhLFxuICAgIHNpZ25hbCxcbiAgICBjYW5jZWxUb2tlbixcbiAgICB0aW1lb3V0LFxuICAgIG9uRG93bmxvYWRQcm9ncmVzcyxcbiAgICBvblVwbG9hZFByb2dyZXNzLFxuICAgIHJlc3BvbnNlVHlwZSxcbiAgICBoZWFkZXJzLFxuICAgIHdpdGhDcmVkZW50aWFscyA9ICdzYW1lLW9yaWdpbicsXG4gICAgZmV0Y2hPcHRpb25zXG4gIH0gPSByZXNvbHZlQ29uZmlnKGNvbmZpZyk7XG5cbiAgcmVzcG9uc2VUeXBlID0gcmVzcG9uc2VUeXBlID8gKHJlc3BvbnNlVHlwZSArICcnKS50b0xvd2VyQ2FzZSgpIDogJ3RleHQnO1xuXG4gIGxldCBjb21wb3NlZFNpZ25hbCA9IGNvbXBvc2VTaWduYWxzKFtzaWduYWwsIGNhbmNlbFRva2VuICYmIGNhbmNlbFRva2VuLnRvQWJvcnRTaWduYWwoKV0sIHRpbWVvdXQpO1xuXG4gIGxldCByZXF1ZXN0O1xuXG4gIGNvbnN0IHVuc3Vic2NyaWJlID0gY29tcG9zZWRTaWduYWwgJiYgY29tcG9zZWRTaWduYWwudW5zdWJzY3JpYmUgJiYgKCgpID0+IHtcbiAgICAgIGNvbXBvc2VkU2lnbmFsLnVuc3Vic2NyaWJlKCk7XG4gIH0pO1xuXG4gIGxldCByZXF1ZXN0Q29udGVudExlbmd0aDtcblxuICB0cnkge1xuICAgIGlmIChcbiAgICAgIG9uVXBsb2FkUHJvZ3Jlc3MgJiYgc3VwcG9ydHNSZXF1ZXN0U3RyZWFtICYmIG1ldGhvZCAhPT0gJ2dldCcgJiYgbWV0aG9kICE9PSAnaGVhZCcgJiZcbiAgICAgIChyZXF1ZXN0Q29udGVudExlbmd0aCA9IGF3YWl0IHJlc29sdmVCb2R5TGVuZ3RoKGhlYWRlcnMsIGRhdGEpKSAhPT0gMFxuICAgICkge1xuICAgICAgbGV0IF9yZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBkYXRhLFxuICAgICAgICBkdXBsZXg6IFwiaGFsZlwiXG4gICAgICB9KTtcblxuICAgICAgbGV0IGNvbnRlbnRUeXBlSGVhZGVyO1xuXG4gICAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSAmJiAoY29udGVudFR5cGVIZWFkZXIgPSBfcmVxdWVzdC5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpKSB7XG4gICAgICAgIGhlYWRlcnMuc2V0Q29udGVudFR5cGUoY29udGVudFR5cGVIZWFkZXIpXG4gICAgICB9XG5cbiAgICAgIGlmIChfcmVxdWVzdC5ib2R5KSB7XG4gICAgICAgIGNvbnN0IFtvblByb2dyZXNzLCBmbHVzaF0gPSBwcm9ncmVzc0V2ZW50RGVjb3JhdG9yKFxuICAgICAgICAgIHJlcXVlc3RDb250ZW50TGVuZ3RoLFxuICAgICAgICAgIHByb2dyZXNzRXZlbnRSZWR1Y2VyKGFzeW5jRGVjb3JhdG9yKG9uVXBsb2FkUHJvZ3Jlc3MpKVxuICAgICAgICApO1xuXG4gICAgICAgIGRhdGEgPSB0cmFja1N0cmVhbShfcmVxdWVzdC5ib2R5LCBERUZBVUxUX0NIVU5LX1NJWkUsIG9uUHJvZ3Jlc3MsIGZsdXNoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXV0aWxzLmlzU3RyaW5nKHdpdGhDcmVkZW50aWFscykpIHtcbiAgICAgIHdpdGhDcmVkZW50aWFscyA9IHdpdGhDcmVkZW50aWFscyA/ICdpbmNsdWRlJyA6ICdvbWl0JztcbiAgICB9XG5cbiAgICAvLyBDbG91ZGZsYXJlIFdvcmtlcnMgdGhyb3dzIHdoZW4gY3JlZGVudGlhbHMgYXJlIGRlZmluZWRcbiAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2Nsb3VkZmxhcmUvd29ya2VyZC9pc3N1ZXMvOTAyXG4gICAgY29uc3QgaXNDcmVkZW50aWFsc1N1cHBvcnRlZCA9IFwiY3JlZGVudGlhbHNcIiBpbiBSZXF1ZXN0LnByb3RvdHlwZTtcbiAgICByZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLCB7XG4gICAgICAuLi5mZXRjaE9wdGlvbnMsXG4gICAgICBzaWduYWw6IGNvbXBvc2VkU2lnbmFsLFxuICAgICAgbWV0aG9kOiBtZXRob2QudG9VcHBlckNhc2UoKSxcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnMubm9ybWFsaXplKCkudG9KU09OKCksXG4gICAgICBib2R5OiBkYXRhLFxuICAgICAgZHVwbGV4OiBcImhhbGZcIixcbiAgICAgIGNyZWRlbnRpYWxzOiBpc0NyZWRlbnRpYWxzU3VwcG9ydGVkID8gd2l0aENyZWRlbnRpYWxzIDogdW5kZWZpbmVkXG4gICAgfSk7XG5cbiAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcblxuICAgIGNvbnN0IGlzU3RyZWFtUmVzcG9uc2UgPSBzdXBwb3J0c1Jlc3BvbnNlU3RyZWFtICYmIChyZXNwb25zZVR5cGUgPT09ICdzdHJlYW0nIHx8IHJlc3BvbnNlVHlwZSA9PT0gJ3Jlc3BvbnNlJyk7XG5cbiAgICBpZiAoc3VwcG9ydHNSZXNwb25zZVN0cmVhbSAmJiAob25Eb3dubG9hZFByb2dyZXNzIHx8IChpc1N0cmVhbVJlc3BvbnNlICYmIHVuc3Vic2NyaWJlKSkpIHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcblxuICAgICAgWydzdGF0dXMnLCAnc3RhdHVzVGV4dCcsICdoZWFkZXJzJ10uZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgb3B0aW9uc1twcm9wXSA9IHJlc3BvbnNlW3Byb3BdO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlQ29udGVudExlbmd0aCA9IHV0aWxzLnRvRmluaXRlTnVtYmVyKHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdjb250ZW50LWxlbmd0aCcpKTtcblxuICAgICAgY29uc3QgW29uUHJvZ3Jlc3MsIGZsdXNoXSA9IG9uRG93bmxvYWRQcm9ncmVzcyAmJiBwcm9ncmVzc0V2ZW50RGVjb3JhdG9yKFxuICAgICAgICByZXNwb25zZUNvbnRlbnRMZW5ndGgsXG4gICAgICAgIHByb2dyZXNzRXZlbnRSZWR1Y2VyKGFzeW5jRGVjb3JhdG9yKG9uRG93bmxvYWRQcm9ncmVzcyksIHRydWUpXG4gICAgICApIHx8IFtdO1xuXG4gICAgICByZXNwb25zZSA9IG5ldyBSZXNwb25zZShcbiAgICAgICAgdHJhY2tTdHJlYW0ocmVzcG9uc2UuYm9keSwgREVGQVVMVF9DSFVOS19TSVpFLCBvblByb2dyZXNzLCAoKSA9PiB7XG4gICAgICAgICAgZmx1c2ggJiYgZmx1c2goKTtcbiAgICAgICAgICB1bnN1YnNjcmliZSAmJiB1bnN1YnNjcmliZSgpO1xuICAgICAgICB9KSxcbiAgICAgICAgb3B0aW9uc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXNwb25zZVR5cGUgPSByZXNwb25zZVR5cGUgfHwgJ3RleHQnO1xuXG4gICAgbGV0IHJlc3BvbnNlRGF0YSA9IGF3YWl0IHJlc29sdmVyc1t1dGlscy5maW5kS2V5KHJlc29sdmVycywgcmVzcG9uc2VUeXBlKSB8fCAndGV4dCddKHJlc3BvbnNlLCBjb25maWcpO1xuXG4gICAgIWlzU3RyZWFtUmVzcG9uc2UgJiYgdW5zdWJzY3JpYmUgJiYgdW5zdWJzY3JpYmUoKTtcblxuICAgIHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB7XG4gICAgICAgIGRhdGE6IHJlc3BvbnNlRGF0YSxcbiAgICAgICAgaGVhZGVyczogQXhpb3NIZWFkZXJzLmZyb20ocmVzcG9uc2UuaGVhZGVycyksXG4gICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICBjb25maWcsXG4gICAgICAgIHJlcXVlc3RcbiAgICAgIH0pXG4gICAgfSlcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgdW5zdWJzY3JpYmUgJiYgdW5zdWJzY3JpYmUoKTtcblxuICAgIGlmIChlcnIgJiYgZXJyLm5hbWUgPT09ICdUeXBlRXJyb3InICYmIC9mZXRjaC9pLnRlc3QoZXJyLm1lc3NhZ2UpKSB7XG4gICAgICB0aHJvdyBPYmplY3QuYXNzaWduKFxuICAgICAgICBuZXcgQXhpb3NFcnJvcignTmV0d29yayBFcnJvcicsIEF4aW9zRXJyb3IuRVJSX05FVFdPUkssIGNvbmZpZywgcmVxdWVzdCksXG4gICAgICAgIHtcbiAgICAgICAgICBjYXVzZTogZXJyLmNhdXNlIHx8IGVyclxuICAgICAgICB9XG4gICAgICApXG4gICAgfVxuXG4gICAgdGhyb3cgQXhpb3NFcnJvci5mcm9tKGVyciwgZXJyICYmIGVyci5jb2RlLCBjb25maWcsIHJlcXVlc3QpO1xuICB9XG59KTtcblxuXG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5pbXBvcnQgc2V0dGxlIGZyb20gJy4vLi4vY29yZS9zZXR0bGUuanMnO1xuaW1wb3J0IHRyYW5zaXRpb25hbERlZmF1bHRzIGZyb20gJy4uL2RlZmF1bHRzL3RyYW5zaXRpb25hbC5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuaW1wb3J0IENhbmNlbGVkRXJyb3IgZnJvbSAnLi4vY2FuY2VsL0NhbmNlbGVkRXJyb3IuanMnO1xuaW1wb3J0IHBhcnNlUHJvdG9jb2wgZnJvbSAnLi4vaGVscGVycy9wYXJzZVByb3RvY29sLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gJy4uL2NvcmUvQXhpb3NIZWFkZXJzLmpzJztcbmltcG9ydCB7cHJvZ3Jlc3NFdmVudFJlZHVjZXJ9IGZyb20gJy4uL2hlbHBlcnMvcHJvZ3Jlc3NFdmVudFJlZHVjZXIuanMnO1xuaW1wb3J0IHJlc29sdmVDb25maWcgZnJvbSBcIi4uL2hlbHBlcnMvcmVzb2x2ZUNvbmZpZy5qc1wiO1xuXG5jb25zdCBpc1hIUkFkYXB0ZXJTdXBwb3J0ZWQgPSB0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnO1xuXG5leHBvcnQgZGVmYXVsdCBpc1hIUkFkYXB0ZXJTdXBwb3J0ZWQgJiYgZnVuY3Rpb24gKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIGNvbnN0IF9jb25maWcgPSByZXNvbHZlQ29uZmlnKGNvbmZpZyk7XG4gICAgbGV0IHJlcXVlc3REYXRhID0gX2NvbmZpZy5kYXRhO1xuICAgIGNvbnN0IHJlcXVlc3RIZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oX2NvbmZpZy5oZWFkZXJzKS5ub3JtYWxpemUoKTtcbiAgICBsZXQge3Jlc3BvbnNlVHlwZSwgb25VcGxvYWRQcm9ncmVzcywgb25Eb3dubG9hZFByb2dyZXNzfSA9IF9jb25maWc7XG4gICAgbGV0IG9uQ2FuY2VsZWQ7XG4gICAgbGV0IHVwbG9hZFRocm90dGxlZCwgZG93bmxvYWRUaHJvdHRsZWQ7XG4gICAgbGV0IGZsdXNoVXBsb2FkLCBmbHVzaERvd25sb2FkO1xuXG4gICAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAgIGZsdXNoVXBsb2FkICYmIGZsdXNoVXBsb2FkKCk7IC8vIGZsdXNoIGV2ZW50c1xuICAgICAgZmx1c2hEb3dubG9hZCAmJiBmbHVzaERvd25sb2FkKCk7IC8vIGZsdXNoIGV2ZW50c1xuXG4gICAgICBfY29uZmlnLmNhbmNlbFRva2VuICYmIF9jb25maWcuY2FuY2VsVG9rZW4udW5zdWJzY3JpYmUob25DYW5jZWxlZCk7XG5cbiAgICAgIF9jb25maWcuc2lnbmFsICYmIF9jb25maWcuc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25DYW5jZWxlZCk7XG4gICAgfVxuXG4gICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIHJlcXVlc3Qub3BlbihfY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBfY29uZmlnLnVybCwgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuICAgIHJlcXVlc3QudGltZW91dCA9IF9jb25maWcudGltZW91dDtcblxuICAgIGZ1bmN0aW9uIG9ubG9hZGVuZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgY29uc3QgcmVzcG9uc2VIZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oXG4gICAgICAgICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgJiYgcmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9ICFyZXNwb25zZVR5cGUgfHwgcmVzcG9uc2VUeXBlID09PSAndGV4dCcgfHwgcmVzcG9uc2VUeXBlID09PSAnanNvbicgP1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICBjb25zdCByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUoZnVuY3Rpb24gX3Jlc29sdmUodmFsdWUpIHtcbiAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIF9yZWplY3QoZXJyKSB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICgnb25sb2FkZW5kJyBpbiByZXF1ZXN0KSB7XG4gICAgICAvLyBVc2Ugb25sb2FkZW5kIGlmIGF2YWlsYWJsZVxuICAgICAgcmVxdWVzdC5vbmxvYWRlbmQgPSBvbmxvYWRlbmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGUgdG8gZW11bGF0ZSBvbmxvYWRlbmRcbiAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0IHx8IHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyByZWFkeXN0YXRlIGhhbmRsZXIgaXMgY2FsbGluZyBiZWZvcmUgb25lcnJvciBvciBvbnRpbWVvdXQgaGFuZGxlcnMsXG4gICAgICAgIC8vIHNvIHdlIHNob3VsZCBjYWxsIG9ubG9hZGVuZCBvbiB0aGUgbmV4dCAndGljaydcbiAgICAgICAgc2V0VGltZW91dChvbmxvYWRlbmQpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgYnJvd3NlciByZXF1ZXN0IGNhbmNlbGxhdGlvbiAoYXMgb3Bwb3NlZCB0byBhIG1hbnVhbCBjYW5jZWxsYXRpb24pXG4gICAgcmVxdWVzdC5vbmFib3J0ID0gZnVuY3Rpb24gaGFuZGxlQWJvcnQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIEF4aW9zRXJyb3IuRUNPTk5BQk9SVEVELCBjb25maWcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBBeGlvc0Vycm9yLkVSUl9ORVRXT1JLLCBjb25maWcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSB0aW1lb3V0XG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgbGV0IHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBfY29uZmlnLnRpbWVvdXQgPyAndGltZW91dCBvZiAnICsgX2NvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJyA6ICd0aW1lb3V0IGV4Y2VlZGVkJztcbiAgICAgIGNvbnN0IHRyYW5zaXRpb25hbCA9IF9jb25maWcudHJhbnNpdGlvbmFsIHx8IHRyYW5zaXRpb25hbERlZmF1bHRzO1xuICAgICAgaWYgKF9jb25maWcudGltZW91dEVycm9yTWVzc2FnZSkge1xuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlID0gX2NvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlO1xuICAgICAgfVxuICAgICAgcmVqZWN0KG5ldyBBeGlvc0Vycm9yKFxuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlLFxuICAgICAgICB0cmFuc2l0aW9uYWwuY2xhcmlmeVRpbWVvdXRFcnJvciA/IEF4aW9zRXJyb3IuRVRJTUVET1VUIDogQXhpb3NFcnJvci5FQ09OTkFCT1JURUQsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgIHJlcXVlc3REYXRhID09PSB1bmRlZmluZWQgJiYgcmVxdWVzdEhlYWRlcnMuc2V0Q29udGVudFR5cGUobnVsbCk7XG5cbiAgICAvLyBBZGQgaGVhZGVycyB0byB0aGUgcmVxdWVzdFxuICAgIGlmICgnc2V0UmVxdWVzdEhlYWRlcicgaW4gcmVxdWVzdCkge1xuICAgICAgdXRpbHMuZm9yRWFjaChyZXF1ZXN0SGVhZGVycy50b0pTT04oKSwgZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih2YWwsIGtleSkge1xuICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoX2NvbmZpZy53aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9ICEhX2NvbmZpZy53aXRoQ3JlZGVudGlhbHM7XG4gICAgfVxuXG4gICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChyZXNwb25zZVR5cGUgJiYgcmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcbiAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gX2NvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmIChvbkRvd25sb2FkUHJvZ3Jlc3MpIHtcbiAgICAgIChbZG93bmxvYWRUaHJvdHRsZWQsIGZsdXNoRG93bmxvYWRdID0gcHJvZ3Jlc3NFdmVudFJlZHVjZXIob25Eb3dubG9hZFByb2dyZXNzLCB0cnVlKSk7XG4gICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgZG93bmxvYWRUaHJvdHRsZWQpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKG9uVXBsb2FkUHJvZ3Jlc3MgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIChbdXBsb2FkVGhyb3R0bGVkLCBmbHVzaFVwbG9hZF0gPSBwcm9ncmVzc0V2ZW50UmVkdWNlcihvblVwbG9hZFByb2dyZXNzKSk7XG5cbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgdXBsb2FkVGhyb3R0bGVkKTtcblxuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVuZCcsIGZsdXNoVXBsb2FkKTtcbiAgICB9XG5cbiAgICBpZiAoX2NvbmZpZy5jYW5jZWxUb2tlbiB8fCBfY29uZmlnLnNpZ25hbCkge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICAgIG9uQ2FuY2VsZWQgPSBjYW5jZWwgPT4ge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVqZWN0KCFjYW5jZWwgfHwgY2FuY2VsLnR5cGUgPyBuZXcgQ2FuY2VsZWRFcnJvcihudWxsLCBjb25maWcsIHJlcXVlc3QpIDogY2FuY2VsKTtcbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH07XG5cbiAgICAgIF9jb25maWcuY2FuY2VsVG9rZW4gJiYgX2NvbmZpZy5jYW5jZWxUb2tlbi5zdWJzY3JpYmUob25DYW5jZWxlZCk7XG4gICAgICBpZiAoX2NvbmZpZy5zaWduYWwpIHtcbiAgICAgICAgX2NvbmZpZy5zaWduYWwuYWJvcnRlZCA/IG9uQ2FuY2VsZWQoKSA6IF9jb25maWcuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25DYW5jZWxlZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcHJvdG9jb2wgPSBwYXJzZVByb3RvY29sKF9jb25maWcudXJsKTtcblxuICAgIGlmIChwcm90b2NvbCAmJiBwbGF0Zm9ybS5wcm90b2NvbHMuaW5kZXhPZihwcm90b2NvbCkgPT09IC0xKSB7XG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ1Vuc3VwcG9ydGVkIHByb3RvY29sICcgKyBwcm90b2NvbCArICc6JywgQXhpb3NFcnJvci5FUlJfQkFEX1JFUVVFU1QsIGNvbmZpZykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSB8fCBudWxsKTtcbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCBiaW5kIGZyb20gJy4vaGVscGVycy9iaW5kLmpzJztcbmltcG9ydCBBeGlvcyBmcm9tICcuL2NvcmUvQXhpb3MuanMnO1xuaW1wb3J0IG1lcmdlQ29uZmlnIGZyb20gJy4vY29yZS9tZXJnZUNvbmZpZy5qcyc7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9kZWZhdWx0cy9pbmRleC5qcyc7XG5pbXBvcnQgZm9ybURhdGFUb0pTT04gZnJvbSAnLi9oZWxwZXJzL2Zvcm1EYXRhVG9KU09OLmpzJztcbmltcG9ydCBDYW5jZWxlZEVycm9yIGZyb20gJy4vY2FuY2VsL0NhbmNlbGVkRXJyb3IuanMnO1xuaW1wb3J0IENhbmNlbFRva2VuIGZyb20gJy4vY2FuY2VsL0NhbmNlbFRva2VuLmpzJztcbmltcG9ydCBpc0NhbmNlbCBmcm9tICcuL2NhbmNlbC9pc0NhbmNlbC5qcyc7XG5pbXBvcnQge1ZFUlNJT059IGZyb20gJy4vZW52L2RhdGEuanMnO1xuaW1wb3J0IHRvRm9ybURhdGEgZnJvbSAnLi9oZWxwZXJzL3RvRm9ybURhdGEuanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuaW1wb3J0IHNwcmVhZCBmcm9tICcuL2hlbHBlcnMvc3ByZWFkLmpzJztcbmltcG9ydCBpc0F4aW9zRXJyb3IgZnJvbSAnLi9oZWxwZXJzL2lzQXhpb3NFcnJvci5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gXCIuL2NvcmUvQXhpb3NIZWFkZXJzLmpzXCI7XG5pbXBvcnQgYWRhcHRlcnMgZnJvbSAnLi9hZGFwdGVycy9hZGFwdGVycy5qcyc7XG5pbXBvcnQgSHR0cFN0YXR1c0NvZGUgZnJvbSAnLi9oZWxwZXJzL0h0dHBTdGF0dXNDb2RlLmpzJztcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICpcbiAqIEByZXR1cm5zIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICBjb25zdCBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICBjb25zdCBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0LCB7YWxsT3duS2V5czogdHJ1ZX0pO1xuXG4gIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQsIG51bGwsIHthbGxPd25LZXlzOiB0cnVlfSk7XG5cbiAgLy8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuICBpbnN0YW5jZS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgICByZXR1cm4gY3JlYXRlSW5zdGFuY2UobWVyZ2VDb25maWcoZGVmYXVsdENvbmZpZywgaW5zdGFuY2VDb25maWcpKTtcbiAgfTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxuY29uc3QgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG5cbi8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuYXhpb3MuQXhpb3MgPSBBeGlvcztcblxuLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5heGlvcy5DYW5jZWxlZEVycm9yID0gQ2FuY2VsZWRFcnJvcjtcbmF4aW9zLkNhbmNlbFRva2VuID0gQ2FuY2VsVG9rZW47XG5heGlvcy5pc0NhbmNlbCA9IGlzQ2FuY2VsO1xuYXhpb3MuVkVSU0lPTiA9IFZFUlNJT047XG5heGlvcy50b0Zvcm1EYXRhID0gdG9Gb3JtRGF0YTtcblxuLy8gRXhwb3NlIEF4aW9zRXJyb3IgY2xhc3NcbmF4aW9zLkF4aW9zRXJyb3IgPSBBeGlvc0Vycm9yO1xuXG4vLyBhbGlhcyBmb3IgQ2FuY2VsZWRFcnJvciBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuYXhpb3MuQ2FuY2VsID0gYXhpb3MuQ2FuY2VsZWRFcnJvcjtcblxuLy8gRXhwb3NlIGFsbC9zcHJlYWRcbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcblxuYXhpb3Muc3ByZWFkID0gc3ByZWFkO1xuXG4vLyBFeHBvc2UgaXNBeGlvc0Vycm9yXG5heGlvcy5pc0F4aW9zRXJyb3IgPSBpc0F4aW9zRXJyb3I7XG5cbi8vIEV4cG9zZSBtZXJnZUNvbmZpZ1xuYXhpb3MubWVyZ2VDb25maWcgPSBtZXJnZUNvbmZpZztcblxuYXhpb3MuQXhpb3NIZWFkZXJzID0gQXhpb3NIZWFkZXJzO1xuXG5heGlvcy5mb3JtVG9KU09OID0gdGhpbmcgPT4gZm9ybURhdGFUb0pTT04odXRpbHMuaXNIVE1MRm9ybSh0aGluZykgPyBuZXcgRm9ybURhdGEodGhpbmcpIDogdGhpbmcpO1xuXG5heGlvcy5nZXRBZGFwdGVyID0gYWRhcHRlcnMuZ2V0QWRhcHRlcjtcblxuYXhpb3MuSHR0cFN0YXR1c0NvZGUgPSBIdHRwU3RhdHVzQ29kZTtcblxuYXhpb3MuZGVmYXVsdCA9IGF4aW9zO1xuXG4vLyB0aGlzIG1vZHVsZSBzaG91bGQgb25seSBoYXZlIGEgZGVmYXVsdCBleHBvcnRcbmV4cG9ydCBkZWZhdWx0IGF4aW9zXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBDYW5jZWxlZEVycm9yIGZyb20gJy4vQ2FuY2VsZWRFcnJvci5qcyc7XG5cbi8qKlxuICogQSBgQ2FuY2VsVG9rZW5gIGlzIGFuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcXVlc3QgY2FuY2VsbGF0aW9uIG9mIGFuIG9wZXJhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKlxuICogQHJldHVybnMge0NhbmNlbFRva2VufVxuICovXG5jbGFzcyBDYW5jZWxUb2tlbiB7XG4gIGNvbnN0cnVjdG9yKGV4ZWN1dG9yKSB7XG4gICAgaWYgKHR5cGVvZiBleGVjdXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICAgIH1cblxuICAgIGxldCByZXNvbHZlUHJvbWlzZTtcblxuICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b2tlbiA9IHRoaXM7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgIHRoaXMucHJvbWlzZS50aGVuKGNhbmNlbCA9PiB7XG4gICAgICBpZiAoIXRva2VuLl9saXN0ZW5lcnMpIHJldHVybjtcblxuICAgICAgbGV0IGkgPSB0b2tlbi5fbGlzdGVuZXJzLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKGktLSA+IDApIHtcbiAgICAgICAgdG9rZW4uX2xpc3RlbmVyc1tpXShjYW5jZWwpO1xuICAgICAgfVxuICAgICAgdG9rZW4uX2xpc3RlbmVycyA9IG51bGw7XG4gICAgfSk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgIHRoaXMucHJvbWlzZS50aGVuID0gb25mdWxmaWxsZWQgPT4ge1xuICAgICAgbGV0IF9yZXNvbHZlO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgdG9rZW4uc3Vic2NyaWJlKHJlc29sdmUpO1xuICAgICAgICBfcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB9KS50aGVuKG9uZnVsZmlsbGVkKTtcblxuICAgICAgcHJvbWlzZS5jYW5jZWwgPSBmdW5jdGlvbiByZWplY3QoKSB7XG4gICAgICAgIHRva2VuLnVuc3Vic2NyaWJlKF9yZXNvbHZlKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH07XG5cbiAgICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSwgY29uZmlnLCByZXF1ZXN0KSB7XG4gICAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWxlZEVycm9yKG1lc3NhZ2UsIGNvbmZpZywgcmVxdWVzdCk7XG4gICAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRocm93cyBhIGBDYW5jZWxlZEVycm9yYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICAgKi9cbiAgdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICAgIHRocm93IHRoaXMucmVhc29uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmUgdG8gdGhlIGNhbmNlbCBzaWduYWxcbiAgICovXG5cbiAgc3Vic2NyaWJlKGxpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgICBsaXN0ZW5lcih0aGlzLnJlYXNvbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2xpc3RlbmVycykge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMgPSBbbGlzdGVuZXJdO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVbnN1YnNjcmliZSBmcm9tIHRoZSBjYW5jZWwgc2lnbmFsXG4gICAqL1xuXG4gIHVuc3Vic2NyaWJlKGxpc3RlbmVyKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG5cbiAgdG9BYm9ydFNpZ25hbCgpIHtcbiAgICBjb25zdCBjb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXG4gICAgY29uc3QgYWJvcnQgPSAoZXJyKSA9PiB7XG4gICAgICBjb250cm9sbGVyLmFib3J0KGVycik7XG4gICAgfTtcblxuICAgIHRoaXMuc3Vic2NyaWJlKGFib3J0KTtcblxuICAgIGNvbnRyb2xsZXIuc2lnbmFsLnVuc3Vic2NyaWJlID0gKCkgPT4gdGhpcy51bnN1YnNjcmliZShhYm9ydCk7XG5cbiAgICByZXR1cm4gY29udHJvbGxlci5zaWduYWw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICAgKiBjYW5jZWxzIHRoZSBgQ2FuY2VsVG9rZW5gLlxuICAgKi9cbiAgc3RhdGljIHNvdXJjZSgpIHtcbiAgICBsZXQgY2FuY2VsO1xuICAgIGNvbnN0IHRva2VuID0gbmV3IENhbmNlbFRva2VuKGZ1bmN0aW9uIGV4ZWN1dG9yKGMpIHtcbiAgICAgIGNhbmNlbCA9IGM7XG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRva2VuLFxuICAgICAgY2FuY2VsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYW5jZWxUb2tlbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi4vY29yZS9BeGlvc0Vycm9yLmpzJztcbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5cbi8qKlxuICogQSBgQ2FuY2VsZWRFcnJvcmAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge09iamVjdD19IHJlcXVlc3QgVGhlIHJlcXVlc3QuXG4gKlxuICogQHJldHVybnMge0NhbmNlbGVkRXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuICovXG5mdW5jdGlvbiBDYW5jZWxlZEVycm9yKG1lc3NhZ2UsIGNvbmZpZywgcmVxdWVzdCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXEtbnVsbCxlcWVxZXFcbiAgQXhpb3NFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgPT0gbnVsbCA/ICdjYW5jZWxlZCcgOiBtZXNzYWdlLCBBeGlvc0Vycm9yLkVSUl9DQU5DRUxFRCwgY29uZmlnLCByZXF1ZXN0KTtcbiAgdGhpcy5uYW1lID0gJ0NhbmNlbGVkRXJyb3InO1xufVxuXG51dGlscy5pbmhlcml0cyhDYW5jZWxlZEVycm9yLCBBeGlvc0Vycm9yLCB7XG4gIF9fQ0FOQ0VMX186IHRydWVcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBDYW5jZWxlZEVycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcbmltcG9ydCBidWlsZFVSTCBmcm9tICcuLi9oZWxwZXJzL2J1aWxkVVJMLmpzJztcbmltcG9ydCBJbnRlcmNlcHRvck1hbmFnZXIgZnJvbSAnLi9JbnRlcmNlcHRvck1hbmFnZXIuanMnO1xuaW1wb3J0IGRpc3BhdGNoUmVxdWVzdCBmcm9tICcuL2Rpc3BhdGNoUmVxdWVzdC5qcyc7XG5pbXBvcnQgbWVyZ2VDb25maWcgZnJvbSAnLi9tZXJnZUNvbmZpZy5qcyc7XG5pbXBvcnQgYnVpbGRGdWxsUGF0aCBmcm9tICcuL2J1aWxkRnVsbFBhdGguanMnO1xuaW1wb3J0IHZhbGlkYXRvciBmcm9tICcuLi9oZWxwZXJzL3ZhbGlkYXRvci5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gJy4vQXhpb3NIZWFkZXJzLmpzJztcblxuY29uc3QgdmFsaWRhdG9ycyA9IHZhbGlkYXRvci52YWxpZGF0b3JzO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICpcbiAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICovXG5jbGFzcyBBeGlvcyB7XG4gIGNvbnN0cnVjdG9yKGluc3RhbmNlQ29uZmlnKSB7XG4gICAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICAgIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgICAgcmVxdWVzdDogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpLFxuICAgICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gY29uZmlnT3JVcmwgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICAgKiBAcGFyYW0gez9PYmplY3R9IGNvbmZpZ1xuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gICAqL1xuICBhc3luYyByZXF1ZXN0KGNvbmZpZ09yVXJsLCBjb25maWcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3JlcXVlc3QoY29uZmlnT3JVcmwsIGNvbmZpZyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoZXJyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgbGV0IGR1bW15ID0ge307XG5cbiAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UgPyBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZShkdW1teSkgOiAoZHVtbXkgPSBuZXcgRXJyb3IoKSk7XG5cbiAgICAgICAgLy8gc2xpY2Ugb2ZmIHRoZSBFcnJvcjogLi4uIGxpbmVcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBkdW1teS5zdGFjayA/IGR1bW15LnN0YWNrLnJlcGxhY2UoL14uK1xcbi8sICcnKSA6ICcnO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmICghZXJyLnN0YWNrKSB7XG4gICAgICAgICAgICBlcnIuc3RhY2sgPSBzdGFjaztcbiAgICAgICAgICAgIC8vIG1hdGNoIHdpdGhvdXQgdGhlIDIgdG9wIHN0YWNrIGxpbmVzXG4gICAgICAgICAgfSBlbHNlIGlmIChzdGFjayAmJiAhU3RyaW5nKGVyci5zdGFjaykuZW5kc1dpdGgoc3RhY2sucmVwbGFjZSgvXi4rXFxuLitcXG4vLCAnJykpKSB7XG4gICAgICAgICAgICBlcnIuc3RhY2sgKz0gJ1xcbicgKyBzdGFja1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIGlnbm9yZSB0aGUgY2FzZSB3aGVyZSBcInN0YWNrXCIgaXMgYW4gdW4td3JpdGFibGUgcHJvcGVydHlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9XG5cbiAgX3JlcXVlc3QoY29uZmlnT3JVcmwsIGNvbmZpZykge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcbiAgICBpZiAodHlwZW9mIGNvbmZpZ09yVXJsID09PSAnc3RyaW5nJykge1xuICAgICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgICAgY29uZmlnLnVybCA9IGNvbmZpZ09yVXJsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25maWcgPSBjb25maWdPclVybCB8fCB7fTtcbiAgICB9XG5cbiAgICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuXG4gICAgY29uc3Qge3RyYW5zaXRpb25hbCwgcGFyYW1zU2VyaWFsaXplciwgaGVhZGVyc30gPSBjb25maWc7XG5cbiAgICBpZiAodHJhbnNpdGlvbmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbGlkYXRvci5hc3NlcnRPcHRpb25zKHRyYW5zaXRpb25hbCwge1xuICAgICAgICBzaWxlbnRKU09OUGFyc2luZzogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKSxcbiAgICAgICAgZm9yY2VkSlNPTlBhcnNpbmc6IHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsKHZhbGlkYXRvcnMuYm9vbGVhbiksXG4gICAgICAgIGNsYXJpZnlUaW1lb3V0RXJyb3I6IHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsKHZhbGlkYXRvcnMuYm9vbGVhbilcbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9XG5cbiAgICBpZiAocGFyYW1zU2VyaWFsaXplciAhPSBudWxsKSB7XG4gICAgICBpZiAodXRpbHMuaXNGdW5jdGlvbihwYXJhbXNTZXJpYWxpemVyKSkge1xuICAgICAgICBjb25maWcucGFyYW1zU2VyaWFsaXplciA9IHtcbiAgICAgICAgICBzZXJpYWxpemU6IHBhcmFtc1NlcmlhbGl6ZXJcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsaWRhdG9yLmFzc2VydE9wdGlvbnMocGFyYW1zU2VyaWFsaXplciwge1xuICAgICAgICAgIGVuY29kZTogdmFsaWRhdG9ycy5mdW5jdGlvbixcbiAgICAgICAgICBzZXJpYWxpemU6IHZhbGlkYXRvcnMuZnVuY3Rpb25cbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2V0IGNvbmZpZy5hbGxvd0Fic29sdXRlVXJsc1xuICAgIGlmIChjb25maWcuYWxsb3dBYnNvbHV0ZVVybHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZG8gbm90aGluZ1xuICAgIH0gZWxzZSBpZiAodGhpcy5kZWZhdWx0cy5hbGxvd0Fic29sdXRlVXJscyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25maWcuYWxsb3dBYnNvbHV0ZVVybHMgPSB0aGlzLmRlZmF1bHRzLmFsbG93QWJzb2x1dGVVcmxzO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25maWcuYWxsb3dBYnNvbHV0ZVVybHMgPSB0cnVlO1xuICAgIH1cblxuICAgIHZhbGlkYXRvci5hc3NlcnRPcHRpb25zKGNvbmZpZywge1xuICAgICAgYmFzZVVybDogdmFsaWRhdG9ycy5zcGVsbGluZygnYmFzZVVSTCcpLFxuICAgICAgd2l0aFhzcmZUb2tlbjogdmFsaWRhdG9ycy5zcGVsbGluZygnd2l0aFhTUkZUb2tlbicpXG4gICAgfSwgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgY29uZmlnLm1ldGhvZFxuICAgIGNvbmZpZy5tZXRob2QgPSAoY29uZmlnLm1ldGhvZCB8fCB0aGlzLmRlZmF1bHRzLm1ldGhvZCB8fCAnZ2V0JykudG9Mb3dlckNhc2UoKTtcblxuICAgIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICAgIGxldCBjb250ZXh0SGVhZGVycyA9IGhlYWRlcnMgJiYgdXRpbHMubWVyZ2UoXG4gICAgICBoZWFkZXJzLmNvbW1vbixcbiAgICAgIGhlYWRlcnNbY29uZmlnLm1ldGhvZF1cbiAgICApO1xuXG4gICAgaGVhZGVycyAmJiB1dGlscy5mb3JFYWNoKFxuICAgICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgICAobWV0aG9kKSA9PiB7XG4gICAgICAgIGRlbGV0ZSBoZWFkZXJzW21ldGhvZF07XG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbmZpZy5oZWFkZXJzID0gQXhpb3NIZWFkZXJzLmNvbmNhdChjb250ZXh0SGVhZGVycywgaGVhZGVycyk7XG5cbiAgICAvLyBmaWx0ZXIgb3V0IHNraXBwZWQgaW50ZXJjZXB0b3JzXG4gICAgY29uc3QgcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4gPSBbXTtcbiAgICBsZXQgc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzID0gdHJ1ZTtcbiAgICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICAgIGlmICh0eXBlb2YgaW50ZXJjZXB0b3IucnVuV2hlbiA9PT0gJ2Z1bmN0aW9uJyAmJiBpbnRlcmNlcHRvci5ydW5XaGVuKGNvbmZpZykgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzID0gc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzICYmIGludGVyY2VwdG9yLnN5bmNocm9ub3VzO1xuXG4gICAgICByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluID0gW107XG4gICAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICAgIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICAgIH0pO1xuXG4gICAgbGV0IHByb21pc2U7XG4gICAgbGV0IGkgPSAwO1xuICAgIGxldCBsZW47XG5cbiAgICBpZiAoIXN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycykge1xuICAgICAgY29uc3QgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LmJpbmQodGhpcyksIHVuZGVmaW5lZF07XG4gICAgICBjaGFpbi51bnNoaWZ0LmFwcGx5KGNoYWluLCByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbik7XG4gICAgICBjaGFpbi5wdXNoLmFwcGx5KGNoYWluLCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4pO1xuICAgICAgbGVuID0gY2hhaW4ubGVuZ3RoO1xuXG4gICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cbiAgICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW5baSsrXSwgY2hhaW5baSsrXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGxlbiA9IHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLmxlbmd0aDtcblxuICAgIGxldCBuZXdDb25maWcgPSBjb25maWc7XG5cbiAgICBpID0gMDtcblxuICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICBjb25zdCBvbkZ1bGZpbGxlZCA9IHJlcXVlc3RJbnRlcmNlcHRvckNoYWluW2krK107XG4gICAgICBjb25zdCBvblJlamVjdGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW5baSsrXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ld0NvbmZpZyA9IG9uRnVsZmlsbGVkKG5ld0NvbmZpZyk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBvblJlamVjdGVkLmNhbGwodGhpcywgZXJyb3IpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcHJvbWlzZSA9IGRpc3BhdGNoUmVxdWVzdC5jYWxsKHRoaXMsIG5ld0NvbmZpZyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgfVxuXG4gICAgaSA9IDA7XG4gICAgbGVuID0gcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLmxlbmd0aDtcblxuICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbltpKytdLCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW5baSsrXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBnZXRVcmkoY29uZmlnKSB7XG4gICAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGJ1aWxkRnVsbFBhdGgoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwsIGNvbmZpZy5hbGxvd0Fic29sdXRlVXJscyk7XG4gICAgcmV0dXJuIGJ1aWxkVVJMKGZ1bGxQYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcik7XG4gIH1cbn1cblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2QsXG4gICAgICB1cmwsXG4gICAgICBkYXRhOiAoY29uZmlnIHx8IHt9KS5kYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVIVFRQTWV0aG9kKGlzRm9ybSkge1xuICAgIHJldHVybiBmdW5jdGlvbiBodHRwTWV0aG9kKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgICBtZXRob2QsXG4gICAgICAgIGhlYWRlcnM6IGlzRm9ybSA/IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ211bHRpcGFydC9mb3JtLWRhdGEnXG4gICAgICAgIH0gOiB7fSxcbiAgICAgICAgdXJsLFxuICAgICAgICBkYXRhXG4gICAgICB9KSk7XG4gICAgfTtcbiAgfVxuXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZ2VuZXJhdGVIVFRQTWV0aG9kKCk7XG5cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZCArICdGb3JtJ10gPSBnZW5lcmF0ZUhUVFBNZXRob2QodHJ1ZSk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5cbi8qKlxuICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnXSBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuICovXG5mdW5jdGlvbiBBeGlvc0Vycm9yKG1lc3NhZ2UsIGNvZGUsIGNvbmZpZywgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgRXJyb3IuY2FsbCh0aGlzKTtcblxuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjaztcbiAgfVxuXG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIHRoaXMubmFtZSA9ICdBeGlvc0Vycm9yJztcbiAgY29kZSAmJiAodGhpcy5jb2RlID0gY29kZSk7XG4gIGNvbmZpZyAmJiAodGhpcy5jb25maWcgPSBjb25maWcpO1xuICByZXF1ZXN0ICYmICh0aGlzLnJlcXVlc3QgPSByZXF1ZXN0KTtcbiAgaWYgKHJlc3BvbnNlKSB7XG4gICAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgIHRoaXMuc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzID8gcmVzcG9uc2Uuc3RhdHVzIDogbnVsbDtcbiAgfVxufVxuXG51dGlscy5pbmhlcml0cyhBeGlvc0Vycm9yLCBFcnJvciwge1xuICB0b0pTT046IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIC8vIE1pY3Jvc29mdFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBudW1iZXI6IHRoaXMubnVtYmVyLFxuICAgICAgLy8gTW96aWxsYVxuICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW5OdW1iZXI6IHRoaXMuY29sdW1uTnVtYmVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAvLyBBeGlvc1xuICAgICAgY29uZmlnOiB1dGlscy50b0pTT05PYmplY3QodGhpcy5jb25maWcpLFxuICAgICAgY29kZTogdGhpcy5jb2RlLFxuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1c1xuICAgIH07XG4gIH1cbn0pO1xuXG5jb25zdCBwcm90b3R5cGUgPSBBeGlvc0Vycm9yLnByb3RvdHlwZTtcbmNvbnN0IGRlc2NyaXB0b3JzID0ge307XG5cbltcbiAgJ0VSUl9CQURfT1BUSU9OX1ZBTFVFJyxcbiAgJ0VSUl9CQURfT1BUSU9OJyxcbiAgJ0VDT05OQUJPUlRFRCcsXG4gICdFVElNRURPVVQnLFxuICAnRVJSX05FVFdPUksnLFxuICAnRVJSX0ZSX1RPT19NQU5ZX1JFRElSRUNUUycsXG4gICdFUlJfREVQUkVDQVRFRCcsXG4gICdFUlJfQkFEX1JFU1BPTlNFJyxcbiAgJ0VSUl9CQURfUkVRVUVTVCcsXG4gICdFUlJfQ0FOQ0VMRUQnLFxuICAnRVJSX05PVF9TVVBQT1JUJyxcbiAgJ0VSUl9JTlZBTElEX1VSTCdcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5dLmZvckVhY2goY29kZSA9PiB7XG4gIGRlc2NyaXB0b3JzW2NvZGVdID0ge3ZhbHVlOiBjb2RlfTtcbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhBeGlvc0Vycm9yLCBkZXNjcmlwdG9ycyk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG90eXBlLCAnaXNBeGlvc0Vycm9yJywge3ZhbHVlOiB0cnVlfSk7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5BeGlvc0Vycm9yLmZyb20gPSAoZXJyb3IsIGNvZGUsIGNvbmZpZywgcmVxdWVzdCwgcmVzcG9uc2UsIGN1c3RvbVByb3BzKSA9PiB7XG4gIGNvbnN0IGF4aW9zRXJyb3IgPSBPYmplY3QuY3JlYXRlKHByb3RvdHlwZSk7XG5cbiAgdXRpbHMudG9GbGF0T2JqZWN0KGVycm9yLCBheGlvc0Vycm9yLCBmdW5jdGlvbiBmaWx0ZXIob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAhPT0gRXJyb3IucHJvdG90eXBlO1xuICB9LCBwcm9wID0+IHtcbiAgICByZXR1cm4gcHJvcCAhPT0gJ2lzQXhpb3NFcnJvcic7XG4gIH0pO1xuXG4gIEF4aW9zRXJyb3IuY2FsbChheGlvc0Vycm9yLCBlcnJvci5tZXNzYWdlLCBjb2RlLCBjb25maWcsIHJlcXVlc3QsIHJlc3BvbnNlKTtcblxuICBheGlvc0Vycm9yLmNhdXNlID0gZXJyb3I7XG5cbiAgYXhpb3NFcnJvci5uYW1lID0gZXJyb3IubmFtZTtcblxuICBjdXN0b21Qcm9wcyAmJiBPYmplY3QuYXNzaWduKGF4aW9zRXJyb3IsIGN1c3RvbVByb3BzKTtcblxuICByZXR1cm4gYXhpb3NFcnJvcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEF4aW9zRXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgcGFyc2VIZWFkZXJzIGZyb20gJy4uL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzJztcblxuY29uc3QgJGludGVybmFscyA9IFN5bWJvbCgnaW50ZXJuYWxzJyk7XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlcihoZWFkZXIpIHtcbiAgcmV0dXJuIGhlYWRlciAmJiBTdHJpbmcoaGVhZGVyKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSBmYWxzZSB8fCB2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIHV0aWxzLmlzQXJyYXkodmFsdWUpID8gdmFsdWUubWFwKG5vcm1hbGl6ZVZhbHVlKSA6IFN0cmluZyh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVG9rZW5zKHN0cikge1xuICBjb25zdCB0b2tlbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBjb25zdCB0b2tlbnNSRSA9IC8oW15cXHMsOz1dKylcXHMqKD86PVxccyooW14sO10rKSk/L2c7XG4gIGxldCBtYXRjaDtcblxuICB3aGlsZSAoKG1hdGNoID0gdG9rZW5zUkUuZXhlYyhzdHIpKSkge1xuICAgIHRva2Vuc1ttYXRjaFsxXV0gPSBtYXRjaFsyXTtcbiAgfVxuXG4gIHJldHVybiB0b2tlbnM7XG59XG5cbmNvbnN0IGlzVmFsaWRIZWFkZXJOYW1lID0gKHN0cikgPT4gL15bLV9hLXpBLVowLTleYHx+LCEjJCUmJyorLl0rJC8udGVzdChzdHIudHJpbSgpKTtcblxuZnVuY3Rpb24gbWF0Y2hIZWFkZXJWYWx1ZShjb250ZXh0LCB2YWx1ZSwgaGVhZGVyLCBmaWx0ZXIsIGlzSGVhZGVyTmFtZUZpbHRlcikge1xuICBpZiAodXRpbHMuaXNGdW5jdGlvbihmaWx0ZXIpKSB7XG4gICAgcmV0dXJuIGZpbHRlci5jYWxsKHRoaXMsIHZhbHVlLCBoZWFkZXIpO1xuICB9XG5cbiAgaWYgKGlzSGVhZGVyTmFtZUZpbHRlcikge1xuICAgIHZhbHVlID0gaGVhZGVyO1xuICB9XG5cbiAgaWYgKCF1dGlscy5pc1N0cmluZyh2YWx1ZSkpIHJldHVybjtcblxuICBpZiAodXRpbHMuaXNTdHJpbmcoZmlsdGVyKSkge1xuICAgIHJldHVybiB2YWx1ZS5pbmRleE9mKGZpbHRlcikgIT09IC0xO1xuICB9XG5cbiAgaWYgKHV0aWxzLmlzUmVnRXhwKGZpbHRlcikpIHtcbiAgICByZXR1cm4gZmlsdGVyLnRlc3QodmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEhlYWRlcihoZWFkZXIpIHtcbiAgcmV0dXJuIGhlYWRlci50cmltKClcbiAgICAudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8oW2EtelxcZF0pKFxcdyopL2csICh3LCBjaGFyLCBzdHIpID0+IHtcbiAgICAgIHJldHVybiBjaGFyLnRvVXBwZXJDYXNlKCkgKyBzdHI7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQWNjZXNzb3JzKG9iaiwgaGVhZGVyKSB7XG4gIGNvbnN0IGFjY2Vzc29yTmFtZSA9IHV0aWxzLnRvQ2FtZWxDYXNlKCcgJyArIGhlYWRlcik7XG5cbiAgWydnZXQnLCAnc2V0JywgJ2hhcyddLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbWV0aG9kTmFtZSArIGFjY2Vzc29yTmFtZSwge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGFyZzEsIGFyZzIsIGFyZzMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbbWV0aG9kTmFtZV0uY2FsbCh0aGlzLCBoZWFkZXIsIGFyZzEsIGFyZzIsIGFyZzMpO1xuICAgICAgfSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9KTtcbn1cblxuY2xhc3MgQXhpb3NIZWFkZXJzIHtcbiAgY29uc3RydWN0b3IoaGVhZGVycykge1xuICAgIGhlYWRlcnMgJiYgdGhpcy5zZXQoaGVhZGVycyk7XG4gIH1cblxuICBzZXQoaGVhZGVyLCB2YWx1ZU9yUmV3cml0ZSwgcmV3cml0ZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gc2V0SGVhZGVyKF92YWx1ZSwgX2hlYWRlciwgX3Jld3JpdGUpIHtcbiAgICAgIGNvbnN0IGxIZWFkZXIgPSBub3JtYWxpemVIZWFkZXIoX2hlYWRlcik7XG5cbiAgICAgIGlmICghbEhlYWRlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2hlYWRlciBuYW1lIG11c3QgYmUgYSBub24tZW1wdHkgc3RyaW5nJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGtleSA9IHV0aWxzLmZpbmRLZXkoc2VsZiwgbEhlYWRlcik7XG5cbiAgICAgIGlmKCFrZXkgfHwgc2VsZltrZXldID09PSB1bmRlZmluZWQgfHwgX3Jld3JpdGUgPT09IHRydWUgfHwgKF9yZXdyaXRlID09PSB1bmRlZmluZWQgJiYgc2VsZltrZXldICE9PSBmYWxzZSkpIHtcbiAgICAgICAgc2VsZltrZXkgfHwgX2hlYWRlcl0gPSBub3JtYWxpemVWYWx1ZShfdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHNldEhlYWRlcnMgPSAoaGVhZGVycywgX3Jld3JpdGUpID0+XG4gICAgICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIChfdmFsdWUsIF9oZWFkZXIpID0+IHNldEhlYWRlcihfdmFsdWUsIF9oZWFkZXIsIF9yZXdyaXRlKSk7XG5cbiAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdChoZWFkZXIpIHx8IGhlYWRlciBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IpIHtcbiAgICAgIHNldEhlYWRlcnMoaGVhZGVyLCB2YWx1ZU9yUmV3cml0ZSlcbiAgICB9IGVsc2UgaWYodXRpbHMuaXNTdHJpbmcoaGVhZGVyKSAmJiAoaGVhZGVyID0gaGVhZGVyLnRyaW0oKSkgJiYgIWlzVmFsaWRIZWFkZXJOYW1lKGhlYWRlcikpIHtcbiAgICAgIHNldEhlYWRlcnMocGFyc2VIZWFkZXJzKGhlYWRlciksIHZhbHVlT3JSZXdyaXRlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzSGVhZGVycyhoZWFkZXIpKSB7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBoZWFkZXIuZW50cmllcygpKSB7XG4gICAgICAgIHNldEhlYWRlcih2YWx1ZSwga2V5LCByZXdyaXRlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZGVyICE9IG51bGwgJiYgc2V0SGVhZGVyKHZhbHVlT3JSZXdyaXRlLCBoZWFkZXIsIHJld3JpdGUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0KGhlYWRlciwgcGFyc2VyKSB7XG4gICAgaGVhZGVyID0gbm9ybWFsaXplSGVhZGVyKGhlYWRlcik7XG5cbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBjb25zdCBrZXkgPSB1dGlscy5maW5kS2V5KHRoaXMsIGhlYWRlcik7XG5cbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzW2tleV07XG5cbiAgICAgICAgaWYgKCFwYXJzZXIpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyc2VyID09PSB0cnVlKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5zKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKHBhcnNlcikpIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VyLmNhbGwodGhpcywgdmFsdWUsIGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNSZWdFeHAocGFyc2VyKSkge1xuICAgICAgICAgIHJldHVybiBwYXJzZXIuZXhlYyh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwYXJzZXIgbXVzdCBiZSBib29sZWFufHJlZ2V4cHxmdW5jdGlvbicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhcyhoZWFkZXIsIG1hdGNoZXIpIHtcbiAgICBoZWFkZXIgPSBub3JtYWxpemVIZWFkZXIoaGVhZGVyKTtcblxuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIGNvbnN0IGtleSA9IHV0aWxzLmZpbmRLZXkodGhpcywgaGVhZGVyKTtcblxuICAgICAgcmV0dXJuICEhKGtleSAmJiB0aGlzW2tleV0gIT09IHVuZGVmaW5lZCAmJiAoIW1hdGNoZXIgfHwgbWF0Y2hIZWFkZXJWYWx1ZSh0aGlzLCB0aGlzW2tleV0sIGtleSwgbWF0Y2hlcikpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBkZWxldGUoaGVhZGVyLCBtYXRjaGVyKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgbGV0IGRlbGV0ZWQgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIGRlbGV0ZUhlYWRlcihfaGVhZGVyKSB7XG4gICAgICBfaGVhZGVyID0gbm9ybWFsaXplSGVhZGVyKF9oZWFkZXIpO1xuXG4gICAgICBpZiAoX2hlYWRlcikge1xuICAgICAgICBjb25zdCBrZXkgPSB1dGlscy5maW5kS2V5KHNlbGYsIF9oZWFkZXIpO1xuXG4gICAgICAgIGlmIChrZXkgJiYgKCFtYXRjaGVyIHx8IG1hdGNoSGVhZGVyVmFsdWUoc2VsZiwgc2VsZltrZXldLCBrZXksIG1hdGNoZXIpKSkge1xuICAgICAgICAgIGRlbGV0ZSBzZWxmW2tleV07XG5cbiAgICAgICAgICBkZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh1dGlscy5pc0FycmF5KGhlYWRlcikpIHtcbiAgICAgIGhlYWRlci5mb3JFYWNoKGRlbGV0ZUhlYWRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZUhlYWRlcihoZWFkZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBkZWxldGVkO1xuICB9XG5cbiAgY2xlYXIobWF0Y2hlcikge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzKTtcbiAgICBsZXQgaSA9IGtleXMubGVuZ3RoO1xuICAgIGxldCBkZWxldGVkID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYoIW1hdGNoZXIgfHwgbWF0Y2hIZWFkZXJWYWx1ZSh0aGlzLCB0aGlzW2tleV0sIGtleSwgbWF0Y2hlciwgdHJ1ZSkpIHtcbiAgICAgICAgZGVsZXRlIHRoaXNba2V5XTtcbiAgICAgICAgZGVsZXRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlbGV0ZWQ7XG4gIH1cblxuICBub3JtYWxpemUoZm9ybWF0KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgaGVhZGVycyA9IHt9O1xuXG4gICAgdXRpbHMuZm9yRWFjaCh0aGlzLCAodmFsdWUsIGhlYWRlcikgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gdXRpbHMuZmluZEtleShoZWFkZXJzLCBoZWFkZXIpO1xuXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHNlbGZba2V5XSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcbiAgICAgICAgZGVsZXRlIHNlbGZbaGVhZGVyXTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBub3JtYWxpemVkID0gZm9ybWF0ID8gZm9ybWF0SGVhZGVyKGhlYWRlcikgOiBTdHJpbmcoaGVhZGVyKS50cmltKCk7XG5cbiAgICAgIGlmIChub3JtYWxpemVkICE9PSBoZWFkZXIpIHtcbiAgICAgICAgZGVsZXRlIHNlbGZbaGVhZGVyXTtcbiAgICAgIH1cblxuICAgICAgc2VsZltub3JtYWxpemVkXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcblxuICAgICAgaGVhZGVyc1tub3JtYWxpemVkXSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNvbmNhdCguLi50YXJnZXRzKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuY29uY2F0KHRoaXMsIC4uLnRhcmdldHMpO1xuICB9XG5cbiAgdG9KU09OKGFzU3RyaW5ncykge1xuICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICB1dGlscy5mb3JFYWNoKHRoaXMsICh2YWx1ZSwgaGVhZGVyKSA9PiB7XG4gICAgICB2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9PSBmYWxzZSAmJiAob2JqW2hlYWRlcl0gPSBhc1N0cmluZ3MgJiYgdXRpbHMuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZS5qb2luKCcsICcpIDogdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyh0aGlzLnRvSlNPTigpKVtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy50b0pTT04oKSkubWFwKChbaGVhZGVyLCB2YWx1ZV0pID0+IGhlYWRlciArICc6ICcgKyB2YWx1ZSkuam9pbignXFxuJyk7XG4gIH1cblxuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG4gICAgcmV0dXJuICdBeGlvc0hlYWRlcnMnO1xuICB9XG5cbiAgc3RhdGljIGZyb20odGhpbmcpIHtcbiAgICByZXR1cm4gdGhpbmcgaW5zdGFuY2VvZiB0aGlzID8gdGhpbmcgOiBuZXcgdGhpcyh0aGluZyk7XG4gIH1cblxuICBzdGF0aWMgY29uY2F0KGZpcnN0LCAuLi50YXJnZXRzKSB7XG4gICAgY29uc3QgY29tcHV0ZWQgPSBuZXcgdGhpcyhmaXJzdCk7XG5cbiAgICB0YXJnZXRzLmZvckVhY2goKHRhcmdldCkgPT4gY29tcHV0ZWQuc2V0KHRhcmdldCkpO1xuXG4gICAgcmV0dXJuIGNvbXB1dGVkO1xuICB9XG5cbiAgc3RhdGljIGFjY2Vzc29yKGhlYWRlcikge1xuICAgIGNvbnN0IGludGVybmFscyA9IHRoaXNbJGludGVybmFsc10gPSAodGhpc1skaW50ZXJuYWxzXSA9IHtcbiAgICAgIGFjY2Vzc29yczoge31cbiAgICB9KTtcblxuICAgIGNvbnN0IGFjY2Vzc29ycyA9IGludGVybmFscy5hY2Nlc3NvcnM7XG4gICAgY29uc3QgcHJvdG90eXBlID0gdGhpcy5wcm90b3R5cGU7XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVBY2Nlc3NvcihfaGVhZGVyKSB7XG4gICAgICBjb25zdCBsSGVhZGVyID0gbm9ybWFsaXplSGVhZGVyKF9oZWFkZXIpO1xuXG4gICAgICBpZiAoIWFjY2Vzc29yc1tsSGVhZGVyXSkge1xuICAgICAgICBidWlsZEFjY2Vzc29ycyhwcm90b3R5cGUsIF9oZWFkZXIpO1xuICAgICAgICBhY2Nlc3NvcnNbbEhlYWRlcl0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHV0aWxzLmlzQXJyYXkoaGVhZGVyKSA/IGhlYWRlci5mb3JFYWNoKGRlZmluZUFjY2Vzc29yKSA6IGRlZmluZUFjY2Vzc29yKGhlYWRlcik7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG5BeGlvc0hlYWRlcnMuYWNjZXNzb3IoWydDb250ZW50LVR5cGUnLCAnQ29udGVudC1MZW5ndGgnLCAnQWNjZXB0JywgJ0FjY2VwdC1FbmNvZGluZycsICdVc2VyLUFnZW50JywgJ0F1dGhvcml6YXRpb24nXSk7XG5cbi8vIHJlc2VydmVkIG5hbWVzIGhvdGZpeFxudXRpbHMucmVkdWNlRGVzY3JpcHRvcnMoQXhpb3NIZWFkZXJzLnByb3RvdHlwZSwgKHt2YWx1ZX0sIGtleSkgPT4ge1xuICBsZXQgbWFwcGVkID0ga2V5WzBdLnRvVXBwZXJDYXNlKCkgKyBrZXkuc2xpY2UoMSk7IC8vIG1hcCBgc2V0YCA9PiBgU2V0YFxuICByZXR1cm4ge1xuICAgIGdldDogKCkgPT4gdmFsdWUsXG4gICAgc2V0KGhlYWRlclZhbHVlKSB7XG4gICAgICB0aGlzW21hcHBlZF0gPSBoZWFkZXJWYWx1ZTtcbiAgICB9XG4gIH1cbn0pO1xuXG51dGlscy5mcmVlemVNZXRob2RzKEF4aW9zSGVhZGVycyk7XG5cbmV4cG9ydCBkZWZhdWx0IEF4aW9zSGVhZGVycztcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuXG5jbGFzcyBJbnRlcmNlcHRvck1hbmFnZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmhhbmRsZXJzID0gW107XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG4gICAqXG4gICAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcbiAgICovXG4gIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkLCBvcHRpb25zKSB7XG4gICAgdGhpcy5oYW5kbGVycy5wdXNoKHtcbiAgICAgIGZ1bGZpbGxlZCxcbiAgICAgIHJlamVjdGVkLFxuICAgICAgc3luY2hyb25vdXM6IG9wdGlvbnMgPyBvcHRpb25zLnN5bmNocm9ub3VzIDogZmFsc2UsXG4gICAgICBydW5XaGVuOiBvcHRpb25zID8gb3B0aW9ucy5ydW5XaGVuIDogbnVsbFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcbiAgICpcbiAgICogQHJldHVybnMge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgaW50ZXJjZXB0b3Igd2FzIHJlbW92ZWQsIGBmYWxzZWAgb3RoZXJ3aXNlXG4gICAqL1xuICBlamVjdChpZCkge1xuICAgIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuICAgICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBhbGwgaW50ZXJjZXB0b3JzIGZyb20gdGhlIHN0YWNrXG4gICAqXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgaWYgKHRoaXMuaGFuZGxlcnMpIHtcbiAgICAgIHRoaXMuaGFuZGxlcnMgPSBbXTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcbiAgICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG4gICAqXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgZm9yRWFjaChmbikge1xuICAgIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuICAgICAgaWYgKGggIT09IG51bGwpIHtcbiAgICAgICAgZm4oaCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW50ZXJjZXB0b3JNYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgaXNBYnNvbHV0ZVVSTCBmcm9tICcuLi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMnO1xuaW1wb3J0IGNvbWJpbmVVUkxzIGZyb20gJy4uL2hlbHBlcnMvY29tYmluZVVSTHMuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgYmFzZVVSTCB3aXRoIHRoZSByZXF1ZXN0ZWRVUkwsXG4gKiBvbmx5IHdoZW4gdGhlIHJlcXVlc3RlZFVSTCBpcyBub3QgYWxyZWFkeSBhbiBhYnNvbHV0ZSBVUkwuXG4gKiBJZiB0aGUgcmVxdWVzdFVSTCBpcyBhYnNvbHV0ZSwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSByZXF1ZXN0ZWRVUkwgdW50b3VjaGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RlZFVSTCBBYnNvbHV0ZSBvciByZWxhdGl2ZSBVUkwgdG8gY29tYmluZVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBmdWxsIHBhdGhcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRGdWxsUGF0aChiYXNlVVJMLCByZXF1ZXN0ZWRVUkwsIGFsbG93QWJzb2x1dGVVcmxzKSB7XG4gIGxldCBpc1JlbGF0aXZlVXJsID0gIWlzQWJzb2x1dGVVUkwocmVxdWVzdGVkVVJMKTtcbiAgaWYgKGJhc2VVUkwgJiYgKGlzUmVsYXRpdmVVcmwgfHwgYWxsb3dBYnNvbHV0ZVVybHMgPT0gZmFsc2UpKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCk7XG4gIH1cbiAgcmV0dXJuIHJlcXVlc3RlZFVSTDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHRyYW5zZm9ybURhdGEgZnJvbSAnLi90cmFuc2Zvcm1EYXRhLmpzJztcbmltcG9ydCBpc0NhbmNlbCBmcm9tICcuLi9jYW5jZWwvaXNDYW5jZWwuanMnO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4uL2RlZmF1bHRzL2luZGV4LmpzJztcbmltcG9ydCBDYW5jZWxlZEVycm9yIGZyb20gJy4uL2NhbmNlbC9DYW5jZWxlZEVycm9yLmpzJztcbmltcG9ydCBBeGlvc0hlYWRlcnMgZnJvbSAnLi4vY29yZS9BeGlvc0hlYWRlcnMuanMnO1xuaW1wb3J0IGFkYXB0ZXJzIGZyb20gXCIuLi9hZGFwdGVycy9hZGFwdGVycy5qc1wiO1xuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxlZEVycm9yYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG4gIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuICB9XG5cbiAgaWYgKGNvbmZpZy5zaWduYWwgJiYgY29uZmlnLnNpZ25hbC5hYm9ydGVkKSB7XG4gICAgdGhyb3cgbmV3IENhbmNlbGVkRXJyb3IobnVsbCwgY29uZmlnKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcbiAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gIGNvbmZpZy5oZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oY29uZmlnLmhlYWRlcnMpO1xuXG4gIC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcbiAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgY29uZmlnLFxuICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG4gICk7XG5cbiAgaWYgKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXS5pbmRleE9mKGNvbmZpZy5tZXRob2QpICE9PSAtMSkge1xuICAgIGNvbmZpZy5oZWFkZXJzLnNldENvbnRlbnRUeXBlKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLCBmYWxzZSk7XG4gIH1cblxuICBjb25zdCBhZGFwdGVyID0gYWRhcHRlcnMuZ2V0QWRhcHRlcihjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyKTtcblxuICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICAgIGNvbmZpZyxcbiAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZSxcbiAgICAgIHJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJlc3BvbnNlLmhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShyZXNwb25zZS5oZWFkZXJzKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgICAgICAgY29uZmlnLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZSxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2VcbiAgICAgICAgKTtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShyZWFzb24ucmVzcG9uc2UuaGVhZGVycyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tIFwiLi9BeGlvc0hlYWRlcnMuanNcIjtcblxuY29uc3QgaGVhZGVyc1RvT2JqZWN0ID0gKHRoaW5nKSA9PiB0aGluZyBpbnN0YW5jZW9mIEF4aW9zSGVhZGVycyA/IHsgLi4udGhpbmcgfSA6IHRoaW5nO1xuXG4vKipcbiAqIENvbmZpZy1zcGVjaWZpYyBtZXJnZS1mdW5jdGlvbiB3aGljaCBjcmVhdGVzIGEgbmV3IGNvbmZpZy1vYmplY3RcbiAqIGJ5IG1lcmdpbmcgdHdvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyB0b2dldGhlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzJcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBOZXcgb2JqZWN0IHJlc3VsdGluZyBmcm9tIG1lcmdpbmcgY29uZmlnMiB0byBjb25maWcxXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1lcmdlQ29uZmlnKGNvbmZpZzEsIGNvbmZpZzIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGNvbmZpZzIgPSBjb25maWcyIHx8IHt9O1xuICBjb25zdCBjb25maWcgPSB7fTtcblxuICBmdW5jdGlvbiBnZXRNZXJnZWRWYWx1ZSh0YXJnZXQsIHNvdXJjZSwgcHJvcCwgY2FzZWxlc3MpIHtcbiAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdCh0YXJnZXQpICYmIHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlLmNhbGwoe2Nhc2VsZXNzfSwgdGFyZ2V0LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2Uoe30sIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBzb3VyY2Uuc2xpY2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBmdW5jdGlvbiBtZXJnZURlZXBQcm9wZXJ0aWVzKGEsIGIsIHByb3AgLCBjYXNlbGVzcykge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoYikpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZShhLCBiLCBwcm9wICwgY2FzZWxlc3MpO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGEpKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBhLCBwcm9wICwgY2FzZWxlc3MpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBmdW5jdGlvbiB2YWx1ZUZyb21Db25maWcyKGEsIGIpIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGIpKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBiKTtcbiAgICB9XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgZnVuY3Rpb24gZGVmYXVsdFRvQ29uZmlnMihhLCBiKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChiKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgYik7XG4gICAgfSBlbHNlIGlmICghdXRpbHMuaXNVbmRlZmluZWQoYSkpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBmdW5jdGlvbiBtZXJnZURpcmVjdEtleXMoYSwgYiwgcHJvcCkge1xuICAgIGlmIChwcm9wIGluIGNvbmZpZzIpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZShhLCBiKTtcbiAgICB9IGVsc2UgaWYgKHByb3AgaW4gY29uZmlnMSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgYSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgbWVyZ2VNYXAgPSB7XG4gICAgdXJsOiB2YWx1ZUZyb21Db25maWcyLFxuICAgIG1ldGhvZDogdmFsdWVGcm9tQ29uZmlnMixcbiAgICBkYXRhOiB2YWx1ZUZyb21Db25maWcyLFxuICAgIGJhc2VVUkw6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgdHJhbnNmb3JtUmVxdWVzdDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB0cmFuc2Zvcm1SZXNwb25zZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBwYXJhbXNTZXJpYWxpemVyOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHRpbWVvdXQ6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgdGltZW91dE1lc3NhZ2U6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgd2l0aENyZWRlbnRpYWxzOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHdpdGhYU1JGVG9rZW46IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgYWRhcHRlcjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICByZXNwb25zZVR5cGU6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgeHNyZkNvb2tpZU5hbWU6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgeHNyZkhlYWRlck5hbWU6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgb25VcGxvYWRQcm9ncmVzczogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBvbkRvd25sb2FkUHJvZ3Jlc3M6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgZGVjb21wcmVzczogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBtYXhDb250ZW50TGVuZ3RoOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIG1heEJvZHlMZW5ndGg6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgYmVmb3JlUmVkaXJlY3Q6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgdHJhbnNwb3J0OiBkZWZhdWx0VG9Db25maWcyLFxuICAgIGh0dHBBZ2VudDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBodHRwc0FnZW50OiBkZWZhdWx0VG9Db25maWcyLFxuICAgIGNhbmNlbFRva2VuOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHNvY2tldFBhdGg6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgcmVzcG9uc2VFbmNvZGluZzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB2YWxpZGF0ZVN0YXR1czogbWVyZ2VEaXJlY3RLZXlzLFxuICAgIGhlYWRlcnM6IChhLCBiICwgcHJvcCkgPT4gbWVyZ2VEZWVwUHJvcGVydGllcyhoZWFkZXJzVG9PYmplY3QoYSksIGhlYWRlcnNUb09iamVjdChiKSxwcm9wLCB0cnVlKVxuICB9O1xuXG4gIHV0aWxzLmZvckVhY2goT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgY29uZmlnMSwgY29uZmlnMikpLCBmdW5jdGlvbiBjb21wdXRlQ29uZmlnVmFsdWUocHJvcCkge1xuICAgIGNvbnN0IG1lcmdlID0gbWVyZ2VNYXBbcHJvcF0gfHwgbWVyZ2VEZWVwUHJvcGVydGllcztcbiAgICBjb25zdCBjb25maWdWYWx1ZSA9IG1lcmdlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0sIHByb3ApO1xuICAgICh1dGlscy5pc1VuZGVmaW5lZChjb25maWdWYWx1ZSkgJiYgbWVyZ2UgIT09IG1lcmdlRGlyZWN0S2V5cykgfHwgKGNvbmZpZ1twcm9wXSA9IGNvbmZpZ1ZhbHVlKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbmZpZztcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi9BeGlvc0Vycm9yLmpzJztcblxuLyoqXG4gKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cbiAqXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBUaGUgcmVzcG9uc2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG4gIGNvbnN0IHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICBbQXhpb3NFcnJvci5FUlJfQkFEX1JFUVVFU1QsIEF4aW9zRXJyb3IuRVJSX0JBRF9SRVNQT05TRV1bTWF0aC5mbG9vcihyZXNwb25zZS5zdGF0dXMgLyAxMDApIC0gNF0sXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi4vZGVmYXVsdHMvaW5kZXguanMnO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tICcuLi9jb3JlL0F4aW9zSGVhZGVycy5qcyc7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEBwYXJhbSB7P09iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlIG9iamVjdFxuICpcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShmbnMsIHJlc3BvbnNlKSB7XG4gIGNvbnN0IGNvbmZpZyA9IHRoaXMgfHwgZGVmYXVsdHM7XG4gIGNvbnN0IGNvbnRleHQgPSByZXNwb25zZSB8fCBjb25maWc7XG4gIGNvbnN0IGhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShjb250ZXh0LmhlYWRlcnMpO1xuICBsZXQgZGF0YSA9IGNvbnRleHQuZGF0YTtcblxuICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgZGF0YSA9IGZuLmNhbGwoY29uZmlnLCBkYXRhLCBoZWFkZXJzLm5vcm1hbGl6ZSgpLCByZXNwb25zZSA/IHJlc3BvbnNlLnN0YXR1cyA6IHVuZGVmaW5lZCk7XG4gIH0pO1xuXG4gIGhlYWRlcnMubm9ybWFsaXplKCk7XG5cbiAgcmV0dXJuIGRhdGE7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuaW1wb3J0IHRyYW5zaXRpb25hbERlZmF1bHRzIGZyb20gJy4vdHJhbnNpdGlvbmFsLmpzJztcbmltcG9ydCB0b0Zvcm1EYXRhIGZyb20gJy4uL2hlbHBlcnMvdG9Gb3JtRGF0YS5qcyc7XG5pbXBvcnQgdG9VUkxFbmNvZGVkRm9ybSBmcm9tICcuLi9oZWxwZXJzL3RvVVJMRW5jb2RlZEZvcm0uanMnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJy4uL3BsYXRmb3JtL2luZGV4LmpzJztcbmltcG9ydCBmb3JtRGF0YVRvSlNPTiBmcm9tICcuLi9oZWxwZXJzL2Zvcm1EYXRhVG9KU09OLmpzJztcblxuLyoqXG4gKiBJdCB0YWtlcyBhIHN0cmluZywgdHJpZXMgdG8gcGFyc2UgaXQsIGFuZCBpZiBpdCBmYWlscywgaXQgcmV0dXJucyB0aGUgc3RyaW5naWZpZWQgdmVyc2lvblxuICogb2YgdGhlIGlucHV0XG4gKlxuICogQHBhcmFtIHthbnl9IHJhd1ZhbHVlIC0gVGhlIHZhbHVlIHRvIGJlIHN0cmluZ2lmaWVkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcGFyc2VyIC0gQSBmdW5jdGlvbiB0aGF0IHBhcnNlcyBhIHN0cmluZyBpbnRvIGEgSmF2YVNjcmlwdCBvYmplY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlbmNvZGVyIC0gQSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgdmFsdWUgYW5kIHJldHVybnMgYSBzdHJpbmcuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gQSBzdHJpbmdpZmllZCB2ZXJzaW9uIG9mIHRoZSByYXdWYWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RyaW5naWZ5U2FmZWx5KHJhd1ZhbHVlLCBwYXJzZXIsIGVuY29kZXIpIHtcbiAgaWYgKHV0aWxzLmlzU3RyaW5nKHJhd1ZhbHVlKSkge1xuICAgIHRyeSB7XG4gICAgICAocGFyc2VyIHx8IEpTT04ucGFyc2UpKHJhd1ZhbHVlKTtcbiAgICAgIHJldHVybiB1dGlscy50cmltKHJhd1ZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5uYW1lICE9PSAnU3ludGF4RXJyb3InKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChlbmNvZGVyIHx8IEpTT04uc3RyaW5naWZ5KShyYXdWYWx1ZSk7XG59XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuXG4gIHRyYW5zaXRpb25hbDogdHJhbnNpdGlvbmFsRGVmYXVsdHMsXG5cbiAgYWRhcHRlcjogWyd4aHInLCAnaHR0cCcsICdmZXRjaCddLFxuXG4gIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcbiAgICBjb25zdCBjb250ZW50VHlwZSA9IGhlYWRlcnMuZ2V0Q29udGVudFR5cGUoKSB8fCAnJztcbiAgICBjb25zdCBoYXNKU09OQ29udGVudFR5cGUgPSBjb250ZW50VHlwZS5pbmRleE9mKCdhcHBsaWNhdGlvbi9qc29uJykgPiAtMTtcbiAgICBjb25zdCBpc09iamVjdFBheWxvYWQgPSB1dGlscy5pc09iamVjdChkYXRhKTtcblxuICAgIGlmIChpc09iamVjdFBheWxvYWQgJiYgdXRpbHMuaXNIVE1MRm9ybShkYXRhKSkge1xuICAgICAgZGF0YSA9IG5ldyBGb3JtRGF0YShkYXRhKTtcbiAgICB9XG5cbiAgICBjb25zdCBpc0Zvcm1EYXRhID0gdXRpbHMuaXNGb3JtRGF0YShkYXRhKTtcblxuICAgIGlmIChpc0Zvcm1EYXRhKSB7XG4gICAgICByZXR1cm4gaGFzSlNPTkNvbnRlbnRUeXBlID8gSlNPTi5zdHJpbmdpZnkoZm9ybURhdGFUb0pTT04oZGF0YSkpIDogZGF0YTtcbiAgICB9XG5cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQmxvYihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNSZWFkYWJsZVN0cmVhbShkYXRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIGhlYWRlcnMuc2V0Q29udGVudFR5cGUoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04JywgZmFsc2UpO1xuICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBsZXQgaXNGaWxlTGlzdDtcblxuICAgIGlmIChpc09iamVjdFBheWxvYWQpIHtcbiAgICAgIGlmIChjb250ZW50VHlwZS5pbmRleE9mKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiB0b1VSTEVuY29kZWRGb3JtKGRhdGEsIHRoaXMuZm9ybVNlcmlhbGl6ZXIpLnRvU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICgoaXNGaWxlTGlzdCA9IHV0aWxzLmlzRmlsZUxpc3QoZGF0YSkpIHx8IGNvbnRlbnRUeXBlLmluZGV4T2YoJ211bHRpcGFydC9mb3JtLWRhdGEnKSA+IC0xKSB7XG4gICAgICAgIGNvbnN0IF9Gb3JtRGF0YSA9IHRoaXMuZW52ICYmIHRoaXMuZW52LkZvcm1EYXRhO1xuXG4gICAgICAgIHJldHVybiB0b0Zvcm1EYXRhKFxuICAgICAgICAgIGlzRmlsZUxpc3QgPyB7J2ZpbGVzW10nOiBkYXRhfSA6IGRhdGEsXG4gICAgICAgICAgX0Zvcm1EYXRhICYmIG5ldyBfRm9ybURhdGEoKSxcbiAgICAgICAgICB0aGlzLmZvcm1TZXJpYWxpemVyXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzT2JqZWN0UGF5bG9hZCB8fCBoYXNKU09OQ29udGVudFR5cGUgKSB7XG4gICAgICBoZWFkZXJzLnNldENvbnRlbnRUeXBlKCdhcHBsaWNhdGlvbi9qc29uJywgZmFsc2UpO1xuICAgICAgcmV0dXJuIHN0cmluZ2lmeVNhZmVseShkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG4gICAgY29uc3QgdHJhbnNpdGlvbmFsID0gdGhpcy50cmFuc2l0aW9uYWwgfHwgZGVmYXVsdHMudHJhbnNpdGlvbmFsO1xuICAgIGNvbnN0IGZvcmNlZEpTT05QYXJzaW5nID0gdHJhbnNpdGlvbmFsICYmIHRyYW5zaXRpb25hbC5mb3JjZWRKU09OUGFyc2luZztcbiAgICBjb25zdCBKU09OUmVxdWVzdGVkID0gdGhpcy5yZXNwb25zZVR5cGUgPT09ICdqc29uJztcblxuICAgIGlmICh1dGlscy5pc1Jlc3BvbnNlKGRhdGEpIHx8IHV0aWxzLmlzUmVhZGFibGVTdHJlYW0oZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIGlmIChkYXRhICYmIHV0aWxzLmlzU3RyaW5nKGRhdGEpICYmICgoZm9yY2VkSlNPTlBhcnNpbmcgJiYgIXRoaXMucmVzcG9uc2VUeXBlKSB8fCBKU09OUmVxdWVzdGVkKSkge1xuICAgICAgY29uc3Qgc2lsZW50SlNPTlBhcnNpbmcgPSB0cmFuc2l0aW9uYWwgJiYgdHJhbnNpdGlvbmFsLnNpbGVudEpTT05QYXJzaW5nO1xuICAgICAgY29uc3Qgc3RyaWN0SlNPTlBhcnNpbmcgPSAhc2lsZW50SlNPTlBhcnNpbmcgJiYgSlNPTlJlcXVlc3RlZDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChzdHJpY3RKU09OUGFyc2luZykge1xuICAgICAgICAgIGlmIChlLm5hbWUgPT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgICAgICAgIHRocm93IEF4aW9zRXJyb3IuZnJvbShlLCBBeGlvc0Vycm9yLkVSUl9CQURfUkVTUE9OU0UsIHRoaXMsIG51bGwsIHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuICBtYXhCb2R5TGVuZ3RoOiAtMSxcblxuICBlbnY6IHtcbiAgICBGb3JtRGF0YTogcGxhdGZvcm0uY2xhc3Nlcy5Gb3JtRGF0YSxcbiAgICBCbG9iOiBwbGF0Zm9ybS5jbGFzc2VzLkJsb2JcbiAgfSxcblxuICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICB9LFxuXG4gIGhlYWRlcnM6IHtcbiAgICBjb21tb246IHtcbiAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJyxcbiAgICAgICdDb250ZW50LVR5cGUnOiB1bmRlZmluZWRcbiAgICB9XG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgKG1ldGhvZCkgPT4ge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBzaWxlbnRKU09OUGFyc2luZzogdHJ1ZSxcbiAgZm9yY2VkSlNPTlBhcnNpbmc6IHRydWUsXG4gIGNsYXJpZnlUaW1lb3V0RXJyb3I6IGZhbHNlXG59O1xuIiwiZXhwb3J0IGNvbnN0IFZFUlNJT04gPSBcIjEuOC40XCI7IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdG9Gb3JtRGF0YSBmcm9tICcuL3RvRm9ybURhdGEuanMnO1xuXG4vKipcbiAqIEl0IGVuY29kZXMgYSBzdHJpbmcgYnkgcmVwbGFjaW5nIGFsbCBjaGFyYWN0ZXJzIHRoYXQgYXJlIG5vdCBpbiB0aGUgdW5yZXNlcnZlZCBzZXQgd2l0aFxuICogdGhlaXIgcGVyY2VudC1lbmNvZGVkIGVxdWl2YWxlbnRzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gZW5jb2RlLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBlbmNvZGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gZW5jb2RlKHN0cikge1xuICBjb25zdCBjaGFyTWFwID0ge1xuICAgICchJzogJyUyMScsXG4gICAgXCInXCI6ICclMjcnLFxuICAgICcoJzogJyUyOCcsXG4gICAgJyknOiAnJTI5JyxcbiAgICAnfic6ICclN0UnLFxuICAgICclMjAnOiAnKycsXG4gICAgJyUwMCc6ICdcXHgwMCdcbiAgfTtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoL1shJygpfl18JTIwfCUwMC9nLCBmdW5jdGlvbiByZXBsYWNlcihtYXRjaCkge1xuICAgIHJldHVybiBjaGFyTWFwW21hdGNoXTtcbiAgfSk7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBwYXJhbXMgb2JqZWN0IGFuZCBjb252ZXJ0cyBpdCB0byBhIEZvcm1EYXRhIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0PHN0cmluZywgYW55Pn0gcGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgdG8gYmUgY29udmVydGVkIHRvIGEgRm9ybURhdGEgb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3Q8c3RyaW5nLCBhbnk+fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgb2JqZWN0IHBhc3NlZCB0byB0aGUgQXhpb3MgY29uc3RydWN0b3IuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIEF4aW9zVVJMU2VhcmNoUGFyYW1zKHBhcmFtcywgb3B0aW9ucykge1xuICB0aGlzLl9wYWlycyA9IFtdO1xuXG4gIHBhcmFtcyAmJiB0b0Zvcm1EYXRhKHBhcmFtcywgdGhpcywgb3B0aW9ucyk7XG59XG5cbmNvbnN0IHByb3RvdHlwZSA9IEF4aW9zVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZTtcblxucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIGFwcGVuZChuYW1lLCB2YWx1ZSkge1xuICB0aGlzLl9wYWlycy5wdXNoKFtuYW1lLCB2YWx1ZV0pO1xufTtcblxucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoZW5jb2Rlcikge1xuICBjb25zdCBfZW5jb2RlID0gZW5jb2RlciA/IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGVuY29kZXIuY2FsbCh0aGlzLCB2YWx1ZSwgZW5jb2RlKTtcbiAgfSA6IGVuY29kZTtcblxuICByZXR1cm4gdGhpcy5fcGFpcnMubWFwKGZ1bmN0aW9uIGVhY2gocGFpcikge1xuICAgIHJldHVybiBfZW5jb2RlKHBhaXJbMF0pICsgJz0nICsgX2VuY29kZShwYWlyWzFdKTtcbiAgfSwgJycpLmpvaW4oJyYnKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEF4aW9zVVJMU2VhcmNoUGFyYW1zO1xuIiwiY29uc3QgSHR0cFN0YXR1c0NvZGUgPSB7XG4gIENvbnRpbnVlOiAxMDAsXG4gIFN3aXRjaGluZ1Byb3RvY29sczogMTAxLFxuICBQcm9jZXNzaW5nOiAxMDIsXG4gIEVhcmx5SGludHM6IDEwMyxcbiAgT2s6IDIwMCxcbiAgQ3JlYXRlZDogMjAxLFxuICBBY2NlcHRlZDogMjAyLFxuICBOb25BdXRob3JpdGF0aXZlSW5mb3JtYXRpb246IDIwMyxcbiAgTm9Db250ZW50OiAyMDQsXG4gIFJlc2V0Q29udGVudDogMjA1LFxuICBQYXJ0aWFsQ29udGVudDogMjA2LFxuICBNdWx0aVN0YXR1czogMjA3LFxuICBBbHJlYWR5UmVwb3J0ZWQ6IDIwOCxcbiAgSW1Vc2VkOiAyMjYsXG4gIE11bHRpcGxlQ2hvaWNlczogMzAwLFxuICBNb3ZlZFBlcm1hbmVudGx5OiAzMDEsXG4gIEZvdW5kOiAzMDIsXG4gIFNlZU90aGVyOiAzMDMsXG4gIE5vdE1vZGlmaWVkOiAzMDQsXG4gIFVzZVByb3h5OiAzMDUsXG4gIFVudXNlZDogMzA2LFxuICBUZW1wb3JhcnlSZWRpcmVjdDogMzA3LFxuICBQZXJtYW5lbnRSZWRpcmVjdDogMzA4LFxuICBCYWRSZXF1ZXN0OiA0MDAsXG4gIFVuYXV0aG9yaXplZDogNDAxLFxuICBQYXltZW50UmVxdWlyZWQ6IDQwMixcbiAgRm9yYmlkZGVuOiA0MDMsXG4gIE5vdEZvdW5kOiA0MDQsXG4gIE1ldGhvZE5vdEFsbG93ZWQ6IDQwNSxcbiAgTm90QWNjZXB0YWJsZTogNDA2LFxuICBQcm94eUF1dGhlbnRpY2F0aW9uUmVxdWlyZWQ6IDQwNyxcbiAgUmVxdWVzdFRpbWVvdXQ6IDQwOCxcbiAgQ29uZmxpY3Q6IDQwOSxcbiAgR29uZTogNDEwLFxuICBMZW5ndGhSZXF1aXJlZDogNDExLFxuICBQcmVjb25kaXRpb25GYWlsZWQ6IDQxMixcbiAgUGF5bG9hZFRvb0xhcmdlOiA0MTMsXG4gIFVyaVRvb0xvbmc6IDQxNCxcbiAgVW5zdXBwb3J0ZWRNZWRpYVR5cGU6IDQxNSxcbiAgUmFuZ2VOb3RTYXRpc2ZpYWJsZTogNDE2LFxuICBFeHBlY3RhdGlvbkZhaWxlZDogNDE3LFxuICBJbUFUZWFwb3Q6IDQxOCxcbiAgTWlzZGlyZWN0ZWRSZXF1ZXN0OiA0MjEsXG4gIFVucHJvY2Vzc2FibGVFbnRpdHk6IDQyMixcbiAgTG9ja2VkOiA0MjMsXG4gIEZhaWxlZERlcGVuZGVuY3k6IDQyNCxcbiAgVG9vRWFybHk6IDQyNSxcbiAgVXBncmFkZVJlcXVpcmVkOiA0MjYsXG4gIFByZWNvbmRpdGlvblJlcXVpcmVkOiA0MjgsXG4gIFRvb01hbnlSZXF1ZXN0czogNDI5LFxuICBSZXF1ZXN0SGVhZGVyRmllbGRzVG9vTGFyZ2U6IDQzMSxcbiAgVW5hdmFpbGFibGVGb3JMZWdhbFJlYXNvbnM6IDQ1MSxcbiAgSW50ZXJuYWxTZXJ2ZXJFcnJvcjogNTAwLFxuICBOb3RJbXBsZW1lbnRlZDogNTAxLFxuICBCYWRHYXRld2F5OiA1MDIsXG4gIFNlcnZpY2VVbmF2YWlsYWJsZTogNTAzLFxuICBHYXRld2F5VGltZW91dDogNTA0LFxuICBIdHRwVmVyc2lvbk5vdFN1cHBvcnRlZDogNTA1LFxuICBWYXJpYW50QWxzb05lZ290aWF0ZXM6IDUwNixcbiAgSW5zdWZmaWNpZW50U3RvcmFnZTogNTA3LFxuICBMb29wRGV0ZWN0ZWQ6IDUwOCxcbiAgTm90RXh0ZW5kZWQ6IDUxMCxcbiAgTmV0d29ya0F1dGhlbnRpY2F0aW9uUmVxdWlyZWQ6IDUxMSxcbn07XG5cbk9iamVjdC5lbnRyaWVzKEh0dHBTdGF0dXNDb2RlKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgSHR0cFN0YXR1c0NvZGVbdmFsdWVdID0ga2V5O1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEh0dHBTdGF0dXNDb2RlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHMpO1xuICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IEF4aW9zVVJMU2VhcmNoUGFyYW1zIGZyb20gJy4uL2hlbHBlcnMvQXhpb3NVUkxTZWFyY2hQYXJhbXMuanMnO1xuXG4vKipcbiAqIEl0IHJlcGxhY2VzIGFsbCBpbnN0YW5jZXMgb2YgdGhlIGNoYXJhY3RlcnMgYDpgLCBgJGAsIGAsYCwgYCtgLCBgW2AsIGFuZCBgXWAgd2l0aCB0aGVpclxuICogVVJJIGVuY29kZWQgY291bnRlcnBhcnRzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbCBUaGUgdmFsdWUgdG8gYmUgZW5jb2RlZC5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZW5jb2RlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cbiAgICByZXBsYWNlKC8lMjAvZywgJysnKS5cbiAgICByZXBsYWNlKC8lNUIvZ2ksICdbJykuXG4gICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuICogQHBhcmFtIHtvYmplY3R9IFtwYXJhbXNdIFRoZSBwYXJhbXMgdG8gYmUgYXBwZW5kZWRcbiAqIEBwYXJhbSB7PyhvYmplY3R8RnVuY3Rpb24pfSBvcHRpb25zXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIG9wdGlvbnMpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICBcbiAgY29uc3QgX2VuY29kZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5lbmNvZGUgfHwgZW5jb2RlO1xuXG4gIGlmICh1dGlscy5pc0Z1bmN0aW9uKG9wdGlvbnMpKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIHNlcmlhbGl6ZTogb3B0aW9uc1xuICAgIH07XG4gIH0gXG5cbiAgY29uc3Qgc2VyaWFsaXplRm4gPSBvcHRpb25zICYmIG9wdGlvbnMuc2VyaWFsaXplO1xuXG4gIGxldCBzZXJpYWxpemVkUGFyYW1zO1xuXG4gIGlmIChzZXJpYWxpemVGbikge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBzZXJpYWxpemVGbihwYXJhbXMsIG9wdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSB1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpID9cbiAgICAgIHBhcmFtcy50b1N0cmluZygpIDpcbiAgICAgIG5ldyBBeGlvc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMsIG9wdGlvbnMpLnRvU3RyaW5nKF9lbmNvZGUpO1xuICB9XG5cbiAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICBjb25zdCBoYXNobWFya0luZGV4ID0gdXJsLmluZGV4T2YoXCIjXCIpO1xuXG4gICAgaWYgKGhhc2htYXJrSW5kZXggIT09IC0xKSB7XG4gICAgICB1cmwgPSB1cmwuc2xpY2UoMCwgaGFzaG1hcmtJbmRleCk7XG4gICAgfVxuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBzcGVjaWZpZWQgVVJMc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVVJMIFRoZSByZWxhdGl2ZSBVUkxcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG4gIHJldHVybiByZWxhdGl2ZVVSTFxuICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8/XFwvJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG4gICAgOiBiYXNlVVJMO1xufVxuIiwiaW1wb3J0IENhbmNlbGVkRXJyb3IgZnJvbSBcIi4uL2NhbmNlbC9DYW5jZWxlZEVycm9yLmpzXCI7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tIFwiLi4vY29yZS9BeGlvc0Vycm9yLmpzXCI7XG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuXG5jb25zdCBjb21wb3NlU2lnbmFscyA9IChzaWduYWxzLCB0aW1lb3V0KSA9PiB7XG4gIGNvbnN0IHtsZW5ndGh9ID0gKHNpZ25hbHMgPSBzaWduYWxzID8gc2lnbmFscy5maWx0ZXIoQm9vbGVhbikgOiBbXSk7XG5cbiAgaWYgKHRpbWVvdXQgfHwgbGVuZ3RoKSB7XG4gICAgbGV0IGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cbiAgICBsZXQgYWJvcnRlZDtcblxuICAgIGNvbnN0IG9uYWJvcnQgPSBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICBpZiAoIWFib3J0ZWQpIHtcbiAgICAgICAgYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgIGNvbnN0IGVyciA9IHJlYXNvbiBpbnN0YW5jZW9mIEVycm9yID8gcmVhc29uIDogdGhpcy5yZWFzb247XG4gICAgICAgIGNvbnRyb2xsZXIuYWJvcnQoZXJyIGluc3RhbmNlb2YgQXhpb3NFcnJvciA/IGVyciA6IG5ldyBDYW5jZWxlZEVycm9yKGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBlcnIpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdGltZXIgPSB0aW1lb3V0ICYmIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgb25hYm9ydChuZXcgQXhpb3NFcnJvcihgdGltZW91dCAke3RpbWVvdXR9IG9mIG1zIGV4Y2VlZGVkYCwgQXhpb3NFcnJvci5FVElNRURPVVQpKVxuICAgIH0sIHRpbWVvdXQpXG5cbiAgICBjb25zdCB1bnN1YnNjcmliZSA9ICgpID0+IHtcbiAgICAgIGlmIChzaWduYWxzKSB7XG4gICAgICAgIHRpbWVyICYmIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICAgICAgc2lnbmFscy5mb3JFYWNoKHNpZ25hbCA9PiB7XG4gICAgICAgICAgc2lnbmFsLnVuc3Vic2NyaWJlID8gc2lnbmFsLnVuc3Vic2NyaWJlKG9uYWJvcnQpIDogc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25hYm9ydCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzaWduYWxzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaWduYWxzLmZvckVhY2goKHNpZ25hbCkgPT4gc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25hYm9ydCkpO1xuXG4gICAgY29uc3Qge3NpZ25hbH0gPSBjb250cm9sbGVyO1xuXG4gICAgc2lnbmFsLnVuc3Vic2NyaWJlID0gKCkgPT4gdXRpbHMuYXNhcCh1bnN1YnNjcmliZSk7XG5cbiAgICByZXR1cm4gc2lnbmFsO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbXBvc2VTaWduYWxzO1xuIiwiaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJy4uL3BsYXRmb3JtL2luZGV4LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgcGxhdGZvcm0uaGFzU3RhbmRhcmRCcm93c2VyRW52ID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAge1xuICAgIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgY29uc3QgY29va2llID0gW25hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpXTtcblxuICAgICAgdXRpbHMuaXNOdW1iZXIoZXhwaXJlcykgJiYgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuXG4gICAgICB1dGlscy5pc1N0cmluZyhwYXRoKSAmJiBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG5cbiAgICAgIHV0aWxzLmlzU3RyaW5nKGRvbWFpbikgJiYgY29va2llLnB1c2goJ2RvbWFpbj0nICsgZG9tYWluKTtcblxuICAgICAgc2VjdXJlID09PSB0cnVlICYmIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcblxuICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgfSxcblxuICAgIHJlYWQobmFtZSkge1xuICAgICAgY29uc3QgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlKG5hbWUpIHtcbiAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gICAgfVxuICB9XG5cbiAgOlxuXG4gIC8vIE5vbi1zdGFuZGFyZCBicm93c2VyIGVudiAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAge1xuICAgIHdyaXRlKCkge30sXG4gICAgcmVhZCgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgcmVtb3ZlKCkge31cbiAgfTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuXG4vKipcbiAqIEl0IHRha2VzIGEgc3RyaW5nIGxpa2UgYGZvb1t4XVt5XVt6XWAgYW5kIHJldHVybnMgYW4gYXJyYXkgbGlrZSBgWydmb28nLCAneCcsICd5JywgJ3onXVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBzdHJpbmdzLlxuICovXG5mdW5jdGlvbiBwYXJzZVByb3BQYXRoKG5hbWUpIHtcbiAgLy8gZm9vW3hdW3ldW3pdXG4gIC8vIGZvby54LnkuelxuICAvLyBmb28teC15LXpcbiAgLy8gZm9vIHggeSB6XG4gIHJldHVybiB1dGlscy5tYXRjaEFsbCgvXFx3K3xcXFsoXFx3KildL2csIG5hbWUpLm1hcChtYXRjaCA9PiB7XG4gICAgcmV0dXJuIG1hdGNoWzBdID09PSAnW10nID8gJycgOiBtYXRjaFsxXSB8fCBtYXRjaFswXTtcbiAgfSk7XG59XG5cbi8qKlxuICogQ29udmVydCBhbiBhcnJheSB0byBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtBcnJheTxhbnk+fSBhcnIgLSBUaGUgYXJyYXkgdG8gY29udmVydCB0byBhbiBvYmplY3QuXG4gKlxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggdGhlIHNhbWUga2V5cyBhbmQgdmFsdWVzIGFzIHRoZSBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlUb09iamVjdChhcnIpIHtcbiAgY29uc3Qgb2JqID0ge307XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhhcnIpO1xuICBsZXQgaTtcbiAgY29uc3QgbGVuID0ga2V5cy5sZW5ndGg7XG4gIGxldCBrZXk7XG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIGtleSA9IGtleXNbaV07XG4gICAgb2JqW2tleV0gPSBhcnJba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIEl0IHRha2VzIGEgRm9ybURhdGEgb2JqZWN0IGFuZCByZXR1cm5zIGEgSmF2YVNjcmlwdCBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZm9ybURhdGEgVGhlIEZvcm1EYXRhIG9iamVjdCB0byBjb252ZXJ0IHRvIEpTT04uXG4gKlxuICogQHJldHVybnMge09iamVjdDxzdHJpbmcsIGFueT4gfCBudWxsfSBUaGUgY29udmVydGVkIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gZm9ybURhdGFUb0pTT04oZm9ybURhdGEpIHtcbiAgZnVuY3Rpb24gYnVpbGRQYXRoKHBhdGgsIHZhbHVlLCB0YXJnZXQsIGluZGV4KSB7XG4gICAgbGV0IG5hbWUgPSBwYXRoW2luZGV4KytdO1xuXG4gICAgaWYgKG5hbWUgPT09ICdfX3Byb3RvX18nKSByZXR1cm4gdHJ1ZTtcblxuICAgIGNvbnN0IGlzTnVtZXJpY0tleSA9IE51bWJlci5pc0Zpbml0ZSgrbmFtZSk7XG4gICAgY29uc3QgaXNMYXN0ID0gaW5kZXggPj0gcGF0aC5sZW5ndGg7XG4gICAgbmFtZSA9ICFuYW1lICYmIHV0aWxzLmlzQXJyYXkodGFyZ2V0KSA/IHRhcmdldC5sZW5ndGggOiBuYW1lO1xuXG4gICAgaWYgKGlzTGFzdCkge1xuICAgICAgaWYgKHV0aWxzLmhhc093blByb3AodGFyZ2V0LCBuYW1lKSkge1xuICAgICAgICB0YXJnZXRbbmFtZV0gPSBbdGFyZ2V0W25hbWVdLCB2YWx1ZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICFpc051bWVyaWNLZXk7XG4gICAgfVxuXG4gICAgaWYgKCF0YXJnZXRbbmFtZV0gfHwgIXV0aWxzLmlzT2JqZWN0KHRhcmdldFtuYW1lXSkpIHtcbiAgICAgIHRhcmdldFtuYW1lXSA9IFtdO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGJ1aWxkUGF0aChwYXRoLCB2YWx1ZSwgdGFyZ2V0W25hbWVdLCBpbmRleCk7XG5cbiAgICBpZiAocmVzdWx0ICYmIHV0aWxzLmlzQXJyYXkodGFyZ2V0W25hbWVdKSkge1xuICAgICAgdGFyZ2V0W25hbWVdID0gYXJyYXlUb09iamVjdCh0YXJnZXRbbmFtZV0pO1xuICAgIH1cblxuICAgIHJldHVybiAhaXNOdW1lcmljS2V5O1xuICB9XG5cbiAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZm9ybURhdGEpICYmIHV0aWxzLmlzRnVuY3Rpb24oZm9ybURhdGEuZW50cmllcykpIHtcbiAgICBjb25zdCBvYmogPSB7fTtcblxuICAgIHV0aWxzLmZvckVhY2hFbnRyeShmb3JtRGF0YSwgKG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICBidWlsZFBhdGgocGFyc2VQcm9wUGF0aChuYW1lKSwgdmFsdWUsIG9iaiwgMCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZvcm1EYXRhVG9KU09OO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZCtcXC0uXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zXG4gKlxuICogQHBhcmFtIHsqfSBwYXlsb2FkIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNBeGlvc0Vycm9yKHBheWxvYWQpIHtcbiAgcmV0dXJuIHV0aWxzLmlzT2JqZWN0KHBheWxvYWQpICYmIChwYXlsb2FkLmlzQXhpb3NFcnJvciA9PT0gdHJ1ZSk7XG59XG4iLCJpbXBvcnQgcGxhdGZvcm0gZnJvbSAnLi4vcGxhdGZvcm0vaW5kZXguanMnO1xuXG5leHBvcnQgZGVmYXVsdCBwbGF0Zm9ybS5oYXNTdGFuZGFyZEJyb3dzZXJFbnYgPyAoKG9yaWdpbiwgaXNNU0lFKSA9PiAodXJsKSA9PiB7XG4gIHVybCA9IG5ldyBVUkwodXJsLCBwbGF0Zm9ybS5vcmlnaW4pO1xuXG4gIHJldHVybiAoXG4gICAgb3JpZ2luLnByb3RvY29sID09PSB1cmwucHJvdG9jb2wgJiZcbiAgICBvcmlnaW4uaG9zdCA9PT0gdXJsLmhvc3QgJiZcbiAgICAoaXNNU0lFIHx8IG9yaWdpbi5wb3J0ID09PSB1cmwucG9ydClcbiAgKTtcbn0pKFxuICBuZXcgVVJMKHBsYXRmb3JtLm9yaWdpbiksXG4gIHBsYXRmb3JtLm5hdmlnYXRvciAmJiAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KHBsYXRmb3JtLm5hdmlnYXRvci51c2VyQWdlbnQpXG4pIDogKCkgPT4gdHJ1ZTtcbiIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBzdHJpY3RcbmV4cG9ydCBkZWZhdWx0IG51bGw7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcblxuLy8gUmF3QXhpb3NIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xuY29uc3QgaWdub3JlRHVwbGljYXRlT2YgPSB1dGlscy50b09iamVjdFNldChbXG4gICdhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsXG4gICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcbiAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuICAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J1xuXSk7XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSByYXdIZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBIZWFkZXJzIHBhcnNlZCBpbnRvIGFuIG9iamVjdFxuICovXG5leHBvcnQgZGVmYXVsdCByYXdIZWFkZXJzID0+IHtcbiAgY29uc3QgcGFyc2VkID0ge307XG4gIGxldCBrZXk7XG4gIGxldCB2YWw7XG4gIGxldCBpO1xuXG4gIHJhd0hlYWRlcnMgJiYgcmF3SGVhZGVycy5zcGxpdCgnXFxuJykuZm9yRWFjaChmdW5jdGlvbiBwYXJzZXIobGluZSkge1xuICAgIGkgPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBrZXkgPSBsaW5lLnN1YnN0cmluZygwLCBpKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSBsaW5lLnN1YnN0cmluZyhpICsgMSkudHJpbSgpO1xuXG4gICAgaWYgKCFrZXkgfHwgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mW2tleV0pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG4gICAgICBpZiAocGFyc2VkW2tleV0pIHtcbiAgICAgICAgcGFyc2VkW2tleV0ucHVzaCh2YWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSBbdmFsXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcGFyc2VkW2tleV0gPSBwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldICsgJywgJyArIHZhbCA6IHZhbDtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwYXJzZWQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZVByb3RvY29sKHVybCkge1xuICBjb25zdCBtYXRjaCA9IC9eKFstK1xcd117MSwyNX0pKDo/XFwvXFwvfDopLy5leGVjKHVybCk7XG4gIHJldHVybiBtYXRjaCAmJiBtYXRjaFsxXSB8fCAnJztcbn1cbiIsImltcG9ydCBzcGVlZG9tZXRlciBmcm9tIFwiLi9zcGVlZG9tZXRlci5qc1wiO1xuaW1wb3J0IHRocm90dGxlIGZyb20gXCIuL3Rocm90dGxlLmpzXCI7XG5pbXBvcnQgdXRpbHMgZnJvbSBcIi4uL3V0aWxzLmpzXCI7XG5cbmV4cG9ydCBjb25zdCBwcm9ncmVzc0V2ZW50UmVkdWNlciA9IChsaXN0ZW5lciwgaXNEb3dubG9hZFN0cmVhbSwgZnJlcSA9IDMpID0+IHtcbiAgbGV0IGJ5dGVzTm90aWZpZWQgPSAwO1xuICBjb25zdCBfc3BlZWRvbWV0ZXIgPSBzcGVlZG9tZXRlcig1MCwgMjUwKTtcblxuICByZXR1cm4gdGhyb3R0bGUoZSA9PiB7XG4gICAgY29uc3QgbG9hZGVkID0gZS5sb2FkZWQ7XG4gICAgY29uc3QgdG90YWwgPSBlLmxlbmd0aENvbXB1dGFibGUgPyBlLnRvdGFsIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHByb2dyZXNzQnl0ZXMgPSBsb2FkZWQgLSBieXRlc05vdGlmaWVkO1xuICAgIGNvbnN0IHJhdGUgPSBfc3BlZWRvbWV0ZXIocHJvZ3Jlc3NCeXRlcyk7XG4gICAgY29uc3QgaW5SYW5nZSA9IGxvYWRlZCA8PSB0b3RhbDtcblxuICAgIGJ5dGVzTm90aWZpZWQgPSBsb2FkZWQ7XG5cbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgbG9hZGVkLFxuICAgICAgdG90YWwsXG4gICAgICBwcm9ncmVzczogdG90YWwgPyAobG9hZGVkIC8gdG90YWwpIDogdW5kZWZpbmVkLFxuICAgICAgYnl0ZXM6IHByb2dyZXNzQnl0ZXMsXG4gICAgICByYXRlOiByYXRlID8gcmF0ZSA6IHVuZGVmaW5lZCxcbiAgICAgIGVzdGltYXRlZDogcmF0ZSAmJiB0b3RhbCAmJiBpblJhbmdlID8gKHRvdGFsIC0gbG9hZGVkKSAvIHJhdGUgOiB1bmRlZmluZWQsXG4gICAgICBldmVudDogZSxcbiAgICAgIGxlbmd0aENvbXB1dGFibGU6IHRvdGFsICE9IG51bGwsXG4gICAgICBbaXNEb3dubG9hZFN0cmVhbSA/ICdkb3dubG9hZCcgOiAndXBsb2FkJ106IHRydWVcbiAgICB9O1xuXG4gICAgbGlzdGVuZXIoZGF0YSk7XG4gIH0sIGZyZXEpO1xufVxuXG5leHBvcnQgY29uc3QgcHJvZ3Jlc3NFdmVudERlY29yYXRvciA9ICh0b3RhbCwgdGhyb3R0bGVkKSA9PiB7XG4gIGNvbnN0IGxlbmd0aENvbXB1dGFibGUgPSB0b3RhbCAhPSBudWxsO1xuXG4gIHJldHVybiBbKGxvYWRlZCkgPT4gdGhyb3R0bGVkWzBdKHtcbiAgICBsZW5ndGhDb21wdXRhYmxlLFxuICAgIHRvdGFsLFxuICAgIGxvYWRlZFxuICB9KSwgdGhyb3R0bGVkWzFdXTtcbn1cblxuZXhwb3J0IGNvbnN0IGFzeW5jRGVjb3JhdG9yID0gKGZuKSA9PiAoLi4uYXJncykgPT4gdXRpbHMuYXNhcCgoKSA9PiBmbiguLi5hcmdzKSk7XG4iLCJpbXBvcnQgcGxhdGZvcm0gZnJvbSBcIi4uL3BsYXRmb3JtL2luZGV4LmpzXCI7XG5pbXBvcnQgdXRpbHMgZnJvbSBcIi4uL3V0aWxzLmpzXCI7XG5pbXBvcnQgaXNVUkxTYW1lT3JpZ2luIGZyb20gXCIuL2lzVVJMU2FtZU9yaWdpbi5qc1wiO1xuaW1wb3J0IGNvb2tpZXMgZnJvbSBcIi4vY29va2llcy5qc1wiO1xuaW1wb3J0IGJ1aWxkRnVsbFBhdGggZnJvbSBcIi4uL2NvcmUvYnVpbGRGdWxsUGF0aC5qc1wiO1xuaW1wb3J0IG1lcmdlQ29uZmlnIGZyb20gXCIuLi9jb3JlL21lcmdlQ29uZmlnLmpzXCI7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gXCIuLi9jb3JlL0F4aW9zSGVhZGVycy5qc1wiO1xuaW1wb3J0IGJ1aWxkVVJMIGZyb20gXCIuL2J1aWxkVVJMLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IChjb25maWcpID0+IHtcbiAgY29uc3QgbmV3Q29uZmlnID0gbWVyZ2VDb25maWcoe30sIGNvbmZpZyk7XG5cbiAgbGV0IHtkYXRhLCB3aXRoWFNSRlRva2VuLCB4c3JmSGVhZGVyTmFtZSwgeHNyZkNvb2tpZU5hbWUsIGhlYWRlcnMsIGF1dGh9ID0gbmV3Q29uZmlnO1xuXG4gIG5ld0NvbmZpZy5oZWFkZXJzID0gaGVhZGVycyA9IEF4aW9zSGVhZGVycy5mcm9tKGhlYWRlcnMpO1xuXG4gIG5ld0NvbmZpZy51cmwgPSBidWlsZFVSTChidWlsZEZ1bGxQYXRoKG5ld0NvbmZpZy5iYXNlVVJMLCBuZXdDb25maWcudXJsLCBuZXdDb25maWcuYWxsb3dBYnNvbHV0ZVVybHMpLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcik7XG5cbiAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICBpZiAoYXV0aCkge1xuICAgIGhlYWRlcnMuc2V0KCdBdXRob3JpemF0aW9uJywgJ0Jhc2ljICcgK1xuICAgICAgYnRvYSgoYXV0aC51c2VybmFtZSB8fCAnJykgKyAnOicgKyAoYXV0aC5wYXNzd29yZCA/IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChhdXRoLnBhc3N3b3JkKSkgOiAnJykpXG4gICAgKTtcbiAgfVxuXG4gIGxldCBjb250ZW50VHlwZTtcblxuICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSkge1xuICAgIGlmIChwbGF0Zm9ybS5oYXNTdGFuZGFyZEJyb3dzZXJFbnYgfHwgcGxhdGZvcm0uaGFzU3RhbmRhcmRCcm93c2VyV2ViV29ya2VyRW52KSB7XG4gICAgICBoZWFkZXJzLnNldENvbnRlbnRUeXBlKHVuZGVmaW5lZCk7IC8vIExldCB0aGUgYnJvd3NlciBzZXQgaXRcbiAgICB9IGVsc2UgaWYgKChjb250ZW50VHlwZSA9IGhlYWRlcnMuZ2V0Q29udGVudFR5cGUoKSkgIT09IGZhbHNlKSB7XG4gICAgICAvLyBmaXggc2VtaWNvbG9uIGR1cGxpY2F0aW9uIGlzc3VlIGZvciBSZWFjdE5hdGl2ZSBGb3JtRGF0YSBpbXBsZW1lbnRhdGlvblxuICAgICAgY29uc3QgW3R5cGUsIC4uLnRva2Vuc10gPSBjb250ZW50VHlwZSA/IGNvbnRlbnRUeXBlLnNwbGl0KCc7JykubWFwKHRva2VuID0+IHRva2VuLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pIDogW107XG4gICAgICBoZWFkZXJzLnNldENvbnRlbnRUeXBlKFt0eXBlIHx8ICdtdWx0aXBhcnQvZm9ybS1kYXRhJywgLi4udG9rZW5zXS5qb2luKCc7ICcpKTtcbiAgICB9XG4gIH1cblxuICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG5cbiAgaWYgKHBsYXRmb3JtLmhhc1N0YW5kYXJkQnJvd3NlckVudikge1xuICAgIHdpdGhYU1JGVG9rZW4gJiYgdXRpbHMuaXNGdW5jdGlvbih3aXRoWFNSRlRva2VuKSAmJiAod2l0aFhTUkZUb2tlbiA9IHdpdGhYU1JGVG9rZW4obmV3Q29uZmlnKSk7XG5cbiAgICBpZiAod2l0aFhTUkZUb2tlbiB8fCAod2l0aFhTUkZUb2tlbiAhPT0gZmFsc2UgJiYgaXNVUkxTYW1lT3JpZ2luKG5ld0NvbmZpZy51cmwpKSkge1xuICAgICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgICBjb25zdCB4c3JmVmFsdWUgPSB4c3JmSGVhZGVyTmFtZSAmJiB4c3JmQ29va2llTmFtZSAmJiBjb29raWVzLnJlYWQoeHNyZkNvb2tpZU5hbWUpO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIGhlYWRlcnMuc2V0KHhzcmZIZWFkZXJOYW1lLCB4c3JmVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXdDb25maWc7XG59XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDYWxjdWxhdGUgZGF0YSBtYXhSYXRlXG4gKiBAcGFyYW0ge051bWJlcn0gW3NhbXBsZXNDb3VudD0gMTBdXG4gKiBAcGFyYW0ge051bWJlcn0gW21pbj0gMTAwMF1cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gc3BlZWRvbWV0ZXIoc2FtcGxlc0NvdW50LCBtaW4pIHtcbiAgc2FtcGxlc0NvdW50ID0gc2FtcGxlc0NvdW50IHx8IDEwO1xuICBjb25zdCBieXRlcyA9IG5ldyBBcnJheShzYW1wbGVzQ291bnQpO1xuICBjb25zdCB0aW1lc3RhbXBzID0gbmV3IEFycmF5KHNhbXBsZXNDb3VudCk7XG4gIGxldCBoZWFkID0gMDtcbiAgbGV0IHRhaWwgPSAwO1xuICBsZXQgZmlyc3RTYW1wbGVUUztcblxuICBtaW4gPSBtaW4gIT09IHVuZGVmaW5lZCA/IG1pbiA6IDEwMDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHB1c2goY2h1bmtMZW5ndGgpIHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXG4gICAgY29uc3Qgc3RhcnRlZEF0ID0gdGltZXN0YW1wc1t0YWlsXTtcblxuICAgIGlmICghZmlyc3RTYW1wbGVUUykge1xuICAgICAgZmlyc3RTYW1wbGVUUyA9IG5vdztcbiAgICB9XG5cbiAgICBieXRlc1toZWFkXSA9IGNodW5rTGVuZ3RoO1xuICAgIHRpbWVzdGFtcHNbaGVhZF0gPSBub3c7XG5cbiAgICBsZXQgaSA9IHRhaWw7XG4gICAgbGV0IGJ5dGVzQ291bnQgPSAwO1xuXG4gICAgd2hpbGUgKGkgIT09IGhlYWQpIHtcbiAgICAgIGJ5dGVzQ291bnQgKz0gYnl0ZXNbaSsrXTtcbiAgICAgIGkgPSBpICUgc2FtcGxlc0NvdW50O1xuICAgIH1cblxuICAgIGhlYWQgPSAoaGVhZCArIDEpICUgc2FtcGxlc0NvdW50O1xuXG4gICAgaWYgKGhlYWQgPT09IHRhaWwpIHtcbiAgICAgIHRhaWwgPSAodGFpbCArIDEpICUgc2FtcGxlc0NvdW50O1xuICAgIH1cblxuICAgIGlmIChub3cgLSBmaXJzdFNhbXBsZVRTIDwgbWluKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGFzc2VkID0gc3RhcnRlZEF0ICYmIG5vdyAtIHN0YXJ0ZWRBdDtcblxuICAgIHJldHVybiBwYXNzZWQgPyBNYXRoLnJvdW5kKGJ5dGVzQ291bnQgKiAxMDAwIC8gcGFzc2VkKSA6IHVuZGVmaW5lZDtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3BlZWRvbWV0ZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICpcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuICB9O1xufVxuIiwiLyoqXG4gKiBUaHJvdHRsZSBkZWNvcmF0b3JcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge051bWJlcn0gZnJlcVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmZ1bmN0aW9uIHRocm90dGxlKGZuLCBmcmVxKSB7XG4gIGxldCB0aW1lc3RhbXAgPSAwO1xuICBsZXQgdGhyZXNob2xkID0gMTAwMCAvIGZyZXE7XG4gIGxldCBsYXN0QXJncztcbiAgbGV0IHRpbWVyO1xuXG4gIGNvbnN0IGludm9rZSA9IChhcmdzLCBub3cgPSBEYXRlLm5vdygpKSA9PiB7XG4gICAgdGltZXN0YW1wID0gbm93O1xuICAgIGxhc3RBcmdzID0gbnVsbDtcbiAgICBpZiAodGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICB0aW1lciA9IG51bGw7XG4gICAgfVxuICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICB9XG5cbiAgY29uc3QgdGhyb3R0bGVkID0gKC4uLmFyZ3MpID0+IHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IHBhc3NlZCA9IG5vdyAtIHRpbWVzdGFtcDtcbiAgICBpZiAoIHBhc3NlZCA+PSB0aHJlc2hvbGQpIHtcbiAgICAgIGludm9rZShhcmdzLCBub3cpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXN0QXJncyA9IGFyZ3M7XG4gICAgICBpZiAoIXRpbWVyKSB7XG4gICAgICAgIHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgICAgIGludm9rZShsYXN0QXJncylcbiAgICAgICAgfSwgdGhyZXNob2xkIC0gcGFzc2VkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBmbHVzaCA9ICgpID0+IGxhc3RBcmdzICYmIGludm9rZShsYXN0QXJncyk7XG5cbiAgcmV0dXJuIFt0aHJvdHRsZWQsIGZsdXNoXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdGhyb3R0bGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuLy8gdGVtcG9yYXJ5IGhvdGZpeCB0byBhdm9pZCBjaXJjdWxhciByZWZlcmVuY2VzIHVudGlsIEF4aW9zVVJMU2VhcmNoUGFyYW1zIGlzIHJlZmFjdG9yZWRcbmltcG9ydCBQbGF0Zm9ybUZvcm1EYXRhIGZyb20gJy4uL3BsYXRmb3JtL25vZGUvY2xhc3Nlcy9Gb3JtRGF0YS5qcyc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiB0aGUgZ2l2ZW4gdGhpbmcgaXMgYSBhcnJheSBvciBqcyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRoaW5nIC0gVGhlIG9iamVjdCBvciBhcnJheSB0byBiZSB2aXNpdGVkLlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc1Zpc2l0YWJsZSh0aGluZykge1xuICByZXR1cm4gdXRpbHMuaXNQbGFpbk9iamVjdCh0aGluZykgfHwgdXRpbHMuaXNBcnJheSh0aGluZyk7XG59XG5cbi8qKlxuICogSXQgcmVtb3ZlcyB0aGUgYnJhY2tldHMgZnJvbSB0aGUgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBrZXkgb2YgdGhlIHBhcmFtZXRlci5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUga2V5IHdpdGhvdXQgdGhlIGJyYWNrZXRzLlxuICovXG5mdW5jdGlvbiByZW1vdmVCcmFja2V0cyhrZXkpIHtcbiAgcmV0dXJuIHV0aWxzLmVuZHNXaXRoKGtleSwgJ1tdJykgPyBrZXkuc2xpY2UoMCwgLTIpIDoga2V5O1xufVxuXG4vKipcbiAqIEl0IHRha2VzIGEgcGF0aCwgYSBrZXksIGFuZCBhIGJvb2xlYW4sIGFuZCByZXR1cm5zIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgY3VycmVudCBrZXkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSBvZiB0aGUgY3VycmVudCBvYmplY3QgYmVpbmcgaXRlcmF0ZWQgb3Zlci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBkb3RzIC0gSWYgdHJ1ZSwgdGhlIGtleSB3aWxsIGJlIHJlbmRlcmVkIHdpdGggZG90cyBpbnN0ZWFkIG9mIGJyYWNrZXRzLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBwYXRoIHRvIHRoZSBjdXJyZW50IGtleS5cbiAqL1xuZnVuY3Rpb24gcmVuZGVyS2V5KHBhdGgsIGtleSwgZG90cykge1xuICBpZiAoIXBhdGgpIHJldHVybiBrZXk7XG4gIHJldHVybiBwYXRoLmNvbmNhdChrZXkpLm1hcChmdW5jdGlvbiBlYWNoKHRva2VuLCBpKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgdG9rZW4gPSByZW1vdmVCcmFja2V0cyh0b2tlbik7XG4gICAgcmV0dXJuICFkb3RzICYmIGkgPyAnWycgKyB0b2tlbiArICddJyA6IHRva2VuO1xuICB9KS5qb2luKGRvdHMgPyAnLicgOiAnJyk7XG59XG5cbi8qKlxuICogSWYgdGhlIGFycmF5IGlzIGFuIGFycmF5IGFuZCBub25lIG9mIGl0cyBlbGVtZW50cyBhcmUgdmlzaXRhYmxlLCB0aGVuIGl0J3MgYSBmbGF0IGFycmF5LlxuICpcbiAqIEBwYXJhbSB7QXJyYXk8YW55Pn0gYXJyIC0gVGhlIGFycmF5IHRvIGNoZWNrXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRmxhdEFycmF5KGFycikge1xuICByZXR1cm4gdXRpbHMuaXNBcnJheShhcnIpICYmICFhcnIuc29tZShpc1Zpc2l0YWJsZSk7XG59XG5cbmNvbnN0IHByZWRpY2F0ZXMgPSB1dGlscy50b0ZsYXRPYmplY3QodXRpbHMsIHt9LCBudWxsLCBmdW5jdGlvbiBmaWx0ZXIocHJvcCkge1xuICByZXR1cm4gL15pc1tBLVpdLy50ZXN0KHByb3ApO1xufSk7XG5cbi8qKlxuICogQ29udmVydCBhIGRhdGEgb2JqZWN0IHRvIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHs/T2JqZWN0fSBbZm9ybURhdGFdXG4gKiBAcGFyYW0gez9PYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMudmlzaXRvcl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMubWV0YVRva2VucyA9IHRydWVdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmRvdHMgPSBmYWxzZV1cbiAqIEBwYXJhbSB7P0Jvb2xlYW59IFtvcHRpb25zLmluZGV4ZXMgPSBmYWxzZV1cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICoqL1xuXG4vKipcbiAqIEl0IGNvbnZlcnRzIGFuIG9iamVjdCBpbnRvIGEgRm9ybURhdGEgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3Q8YW55LCBhbnk+fSBvYmogLSBUaGUgb2JqZWN0IHRvIGNvbnZlcnQgdG8gZm9ybSBkYXRhLlxuICogQHBhcmFtIHtzdHJpbmd9IGZvcm1EYXRhIC0gVGhlIEZvcm1EYXRhIG9iamVjdCB0byBhcHBlbmQgdG8uXG4gKiBAcGFyYW0ge09iamVjdDxzdHJpbmcsIGFueT59IG9wdGlvbnNcbiAqXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiB0b0Zvcm1EYXRhKG9iaiwgZm9ybURhdGEsIG9wdGlvbnMpIHtcbiAgaWYgKCF1dGlscy5pc09iamVjdChvYmopKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGFyZ2V0IG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgZm9ybURhdGEgPSBmb3JtRGF0YSB8fCBuZXcgKFBsYXRmb3JtRm9ybURhdGEgfHwgRm9ybURhdGEpKCk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIG9wdGlvbnMgPSB1dGlscy50b0ZsYXRPYmplY3Qob3B0aW9ucywge1xuICAgIG1ldGFUb2tlbnM6IHRydWUsXG4gICAgZG90czogZmFsc2UsXG4gICAgaW5kZXhlczogZmFsc2VcbiAgfSwgZmFsc2UsIGZ1bmN0aW9uIGRlZmluZWQob3B0aW9uLCBzb3VyY2UpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXEtbnVsbCxlcWVxZXFcbiAgICByZXR1cm4gIXV0aWxzLmlzVW5kZWZpbmVkKHNvdXJjZVtvcHRpb25dKTtcbiAgfSk7XG5cbiAgY29uc3QgbWV0YVRva2VucyA9IG9wdGlvbnMubWV0YVRva2VucztcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVzZS1iZWZvcmUtZGVmaW5lXG4gIGNvbnN0IHZpc2l0b3IgPSBvcHRpb25zLnZpc2l0b3IgfHwgZGVmYXVsdFZpc2l0b3I7XG4gIGNvbnN0IGRvdHMgPSBvcHRpb25zLmRvdHM7XG4gIGNvbnN0IGluZGV4ZXMgPSBvcHRpb25zLmluZGV4ZXM7XG4gIGNvbnN0IF9CbG9iID0gb3B0aW9ucy5CbG9iIHx8IHR5cGVvZiBCbG9iICE9PSAndW5kZWZpbmVkJyAmJiBCbG9iO1xuICBjb25zdCB1c2VCbG9iID0gX0Jsb2IgJiYgdXRpbHMuaXNTcGVjQ29tcGxpYW50Rm9ybShmb3JtRGF0YSk7XG5cbiAgaWYgKCF1dGlscy5pc0Z1bmN0aW9uKHZpc2l0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmlzaXRvciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnZlcnRWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuICcnO1xuXG4gICAgaWYgKHV0aWxzLmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZS50b0lTT1N0cmluZygpO1xuICAgIH1cblxuICAgIGlmICghdXNlQmxvYiAmJiB1dGlscy5pc0Jsb2IodmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcignQmxvYiBpcyBub3Qgc3VwcG9ydGVkLiBVc2UgYSBCdWZmZXIgaW5zdGVhZC4nKTtcbiAgICB9XG5cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlcih2YWx1ZSkgfHwgdXRpbHMuaXNUeXBlZEFycmF5KHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHVzZUJsb2IgJiYgdHlwZW9mIEJsb2IgPT09ICdmdW5jdGlvbicgPyBuZXcgQmxvYihbdmFsdWVdKSA6IEJ1ZmZlci5mcm9tKHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogRGVmYXVsdCB2aXNpdG9yLlxuICAgKlxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0ga2V5XG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nfE51bWJlcj59IHBhdGhcbiAgICogQHRoaXMge0Zvcm1EYXRhfVxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgdG8gdmlzaXQgdGhlIGVhY2ggcHJvcCBvZiB0aGUgdmFsdWUgcmVjdXJzaXZlbHlcbiAgICovXG4gIGZ1bmN0aW9uIGRlZmF1bHRWaXNpdG9yKHZhbHVlLCBrZXksIHBhdGgpIHtcbiAgICBsZXQgYXJyID0gdmFsdWU7XG5cbiAgICBpZiAodmFsdWUgJiYgIXBhdGggJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHV0aWxzLmVuZHNXaXRoKGtleSwgJ3t9JykpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgIGtleSA9IG1ldGFUb2tlbnMgPyBrZXkgOiBrZXkuc2xpY2UoMCwgLTIpO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAodXRpbHMuaXNBcnJheSh2YWx1ZSkgJiYgaXNGbGF0QXJyYXkodmFsdWUpKSB8fFxuICAgICAgICAoKHV0aWxzLmlzRmlsZUxpc3QodmFsdWUpIHx8IHV0aWxzLmVuZHNXaXRoKGtleSwgJ1tdJykpICYmIChhcnIgPSB1dGlscy50b0FycmF5KHZhbHVlKSlcbiAgICAgICAgKSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAga2V5ID0gcmVtb3ZlQnJhY2tldHMoa2V5KTtcblxuICAgICAgICBhcnIuZm9yRWFjaChmdW5jdGlvbiBlYWNoKGVsLCBpbmRleCkge1xuICAgICAgICAgICEodXRpbHMuaXNVbmRlZmluZWQoZWwpIHx8IGVsID09PSBudWxsKSAmJiBmb3JtRGF0YS5hcHBlbmQoXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmVzdGVkLXRlcm5hcnlcbiAgICAgICAgICAgIGluZGV4ZXMgPT09IHRydWUgPyByZW5kZXJLZXkoW2tleV0sIGluZGV4LCBkb3RzKSA6IChpbmRleGVzID09PSBudWxsID8ga2V5IDoga2V5ICsgJ1tdJyksXG4gICAgICAgICAgICBjb252ZXJ0VmFsdWUoZWwpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNWaXNpdGFibGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3JtRGF0YS5hcHBlbmQocmVuZGVyS2V5KHBhdGgsIGtleSwgZG90cyksIGNvbnZlcnRWYWx1ZSh2YWx1ZSkpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3Qgc3RhY2sgPSBbXTtcblxuICBjb25zdCBleHBvc2VkSGVscGVycyA9IE9iamVjdC5hc3NpZ24ocHJlZGljYXRlcywge1xuICAgIGRlZmF1bHRWaXNpdG9yLFxuICAgIGNvbnZlcnRWYWx1ZSxcbiAgICBpc1Zpc2l0YWJsZVxuICB9KTtcblxuICBmdW5jdGlvbiBidWlsZCh2YWx1ZSwgcGF0aCkge1xuICAgIGlmICh1dGlscy5pc1VuZGVmaW5lZCh2YWx1ZSkpIHJldHVybjtcblxuICAgIGlmIChzdGFjay5pbmRleE9mKHZhbHVlKSAhPT0gLTEpIHtcbiAgICAgIHRocm93IEVycm9yKCdDaXJjdWxhciByZWZlcmVuY2UgZGV0ZWN0ZWQgaW4gJyArIHBhdGguam9pbignLicpKTtcbiAgICB9XG5cbiAgICBzdGFjay5wdXNoKHZhbHVlKTtcblxuICAgIHV0aWxzLmZvckVhY2godmFsdWUsIGZ1bmN0aW9uIGVhY2goZWwsIGtleSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gISh1dGlscy5pc1VuZGVmaW5lZChlbCkgfHwgZWwgPT09IG51bGwpICYmIHZpc2l0b3IuY2FsbChcbiAgICAgICAgZm9ybURhdGEsIGVsLCB1dGlscy5pc1N0cmluZyhrZXkpID8ga2V5LnRyaW0oKSA6IGtleSwgcGF0aCwgZXhwb3NlZEhlbHBlcnNcbiAgICAgICk7XG5cbiAgICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgYnVpbGQoZWwsIHBhdGggPyBwYXRoLmNvbmNhdChrZXkpIDogW2tleV0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc3RhY2sucG9wKCk7XG4gIH1cblxuICBpZiAoIXV0aWxzLmlzT2JqZWN0KG9iaikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdkYXRhIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gIH1cblxuICBidWlsZChvYmopO1xuXG4gIHJldHVybiBmb3JtRGF0YTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdG9Gb3JtRGF0YTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzLmpzJztcbmltcG9ydCB0b0Zvcm1EYXRhIGZyb20gJy4vdG9Gb3JtRGF0YS5qcyc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAnLi4vcGxhdGZvcm0vaW5kZXguanMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0b1VSTEVuY29kZWRGb3JtKGRhdGEsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHRvRm9ybURhdGEoZGF0YSwgbmV3IHBsYXRmb3JtLmNsYXNzZXMuVVJMU2VhcmNoUGFyYW1zKCksIE9iamVjdC5hc3NpZ24oe1xuICAgIHZpc2l0b3I6IGZ1bmN0aW9uKHZhbHVlLCBrZXksIHBhdGgsIGhlbHBlcnMpIHtcbiAgICAgIGlmIChwbGF0Zm9ybS5pc05vZGUgJiYgdXRpbHMuaXNCdWZmZXIodmFsdWUpKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKGtleSwgdmFsdWUudG9TdHJpbmcoJ2Jhc2U2NCcpKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaGVscGVycy5kZWZhdWx0VmlzaXRvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfSwgb3B0aW9ucykpO1xufVxuIiwiXG5leHBvcnQgY29uc3Qgc3RyZWFtQ2h1bmsgPSBmdW5jdGlvbiogKGNodW5rLCBjaHVua1NpemUpIHtcbiAgbGV0IGxlbiA9IGNodW5rLmJ5dGVMZW5ndGg7XG5cbiAgaWYgKCFjaHVua1NpemUgfHwgbGVuIDwgY2h1bmtTaXplKSB7XG4gICAgeWllbGQgY2h1bms7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHBvcyA9IDA7XG4gIGxldCBlbmQ7XG5cbiAgd2hpbGUgKHBvcyA8IGxlbikge1xuICAgIGVuZCA9IHBvcyArIGNodW5rU2l6ZTtcbiAgICB5aWVsZCBjaHVuay5zbGljZShwb3MsIGVuZCk7XG4gICAgcG9zID0gZW5kO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCByZWFkQnl0ZXMgPSBhc3luYyBmdW5jdGlvbiogKGl0ZXJhYmxlLCBjaHVua1NpemUpIHtcbiAgZm9yIGF3YWl0IChjb25zdCBjaHVuayBvZiByZWFkU3RyZWFtKGl0ZXJhYmxlKSkge1xuICAgIHlpZWxkKiBzdHJlYW1DaHVuayhjaHVuaywgY2h1bmtTaXplKTtcbiAgfVxufVxuXG5jb25zdCByZWFkU3RyZWFtID0gYXN5bmMgZnVuY3Rpb24qIChzdHJlYW0pIHtcbiAgaWYgKHN0cmVhbVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0pIHtcbiAgICB5aWVsZCogc3RyZWFtO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHJlYWRlciA9IHN0cmVhbS5nZXRSZWFkZXIoKTtcbiAgdHJ5IHtcbiAgICBmb3IgKDs7KSB7XG4gICAgICBjb25zdCB7ZG9uZSwgdmFsdWV9ID0gYXdhaXQgcmVhZGVyLnJlYWQoKTtcbiAgICAgIGlmIChkb25lKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgeWllbGQgdmFsdWU7XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IHJlYWRlci5jYW5jZWwoKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdHJhY2tTdHJlYW0gPSAoc3RyZWFtLCBjaHVua1NpemUsIG9uUHJvZ3Jlc3MsIG9uRmluaXNoKSA9PiB7XG4gIGNvbnN0IGl0ZXJhdG9yID0gcmVhZEJ5dGVzKHN0cmVhbSwgY2h1bmtTaXplKTtcblxuICBsZXQgYnl0ZXMgPSAwO1xuICBsZXQgZG9uZTtcbiAgbGV0IF9vbkZpbmlzaCA9IChlKSA9PiB7XG4gICAgaWYgKCFkb25lKSB7XG4gICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIG9uRmluaXNoICYmIG9uRmluaXNoKGUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgUmVhZGFibGVTdHJlYW0oe1xuICAgIGFzeW5jIHB1bGwoY29udHJvbGxlcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qge2RvbmUsIHZhbHVlfSA9IGF3YWl0IGl0ZXJhdG9yLm5leHQoKTtcblxuICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgX29uRmluaXNoKCk7XG4gICAgICAgICAgY29udHJvbGxlci5jbG9zZSgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBsZW4gPSB2YWx1ZS5ieXRlTGVuZ3RoO1xuICAgICAgICBpZiAob25Qcm9ncmVzcykge1xuICAgICAgICAgIGxldCBsb2FkZWRCeXRlcyA9IGJ5dGVzICs9IGxlbjtcbiAgICAgICAgICBvblByb2dyZXNzKGxvYWRlZEJ5dGVzKTtcbiAgICAgICAgfVxuICAgICAgICBjb250cm9sbGVyLmVucXVldWUobmV3IFVpbnQ4QXJyYXkodmFsdWUpKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfb25GaW5pc2goZXJyKTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2FuY2VsKHJlYXNvbikge1xuICAgICAgX29uRmluaXNoKHJlYXNvbik7XG4gICAgICByZXR1cm4gaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgfVxuICB9LCB7XG4gICAgaGlnaFdhdGVyTWFyazogMlxuICB9KVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1ZFUlNJT059IGZyb20gJy4uL2Vudi9kYXRhLmpzJztcbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gJy4uL2NvcmUvQXhpb3NFcnJvci5qcyc7XG5cbmNvbnN0IHZhbGlkYXRvcnMgPSB7fTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcblsnb2JqZWN0JywgJ2Jvb2xlYW4nLCAnbnVtYmVyJywgJ2Z1bmN0aW9uJywgJ3N0cmluZycsICdzeW1ib2wnXS5mb3JFYWNoKCh0eXBlLCBpKSA9PiB7XG4gIHZhbGlkYXRvcnNbdHlwZV0gPSBmdW5jdGlvbiB2YWxpZGF0b3IodGhpbmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaW5nID09PSB0eXBlIHx8ICdhJyArIChpIDwgMSA/ICduICcgOiAnICcpICsgdHlwZTtcbiAgfTtcbn0pO1xuXG5jb25zdCBkZXByZWNhdGVkV2FybmluZ3MgPSB7fTtcblxuLyoqXG4gKiBUcmFuc2l0aW9uYWwgb3B0aW9uIHZhbGlkYXRvclxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb258Ym9vbGVhbj99IHZhbGlkYXRvciAtIHNldCB0byBmYWxzZSBpZiB0aGUgdHJhbnNpdGlvbmFsIG9wdGlvbiBoYXMgYmVlbiByZW1vdmVkXG4gKiBAcGFyYW0ge3N0cmluZz99IHZlcnNpb24gLSBkZXByZWNhdGVkIHZlcnNpb24gLyByZW1vdmVkIHNpbmNlIHZlcnNpb25cbiAqIEBwYXJhbSB7c3RyaW5nP30gbWVzc2FnZSAtIHNvbWUgbWVzc2FnZSB3aXRoIGFkZGl0aW9uYWwgaW5mb1xuICpcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn1cbiAqL1xudmFsaWRhdG9ycy50cmFuc2l0aW9uYWwgPSBmdW5jdGlvbiB0cmFuc2l0aW9uYWwodmFsaWRhdG9yLCB2ZXJzaW9uLCBtZXNzYWdlKSB7XG4gIGZ1bmN0aW9uIGZvcm1hdE1lc3NhZ2Uob3B0LCBkZXNjKSB7XG4gICAgcmV0dXJuICdbQXhpb3MgdicgKyBWRVJTSU9OICsgJ10gVHJhbnNpdGlvbmFsIG9wdGlvbiBcXCcnICsgb3B0ICsgJ1xcJycgKyBkZXNjICsgKG1lc3NhZ2UgPyAnLiAnICsgbWVzc2FnZSA6ICcnKTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gIHJldHVybiAodmFsdWUsIG9wdCwgb3B0cykgPT4ge1xuICAgIGlmICh2YWxpZGF0b3IgPT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcihcbiAgICAgICAgZm9ybWF0TWVzc2FnZShvcHQsICcgaGFzIGJlZW4gcmVtb3ZlZCcgKyAodmVyc2lvbiA/ICcgaW4gJyArIHZlcnNpb24gOiAnJykpLFxuICAgICAgICBBeGlvc0Vycm9yLkVSUl9ERVBSRUNBVEVEXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh2ZXJzaW9uICYmICFkZXByZWNhdGVkV2FybmluZ3Nbb3B0XSkge1xuICAgICAgZGVwcmVjYXRlZFdhcm5pbmdzW29wdF0gPSB0cnVlO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgZm9ybWF0TWVzc2FnZShcbiAgICAgICAgICBvcHQsXG4gICAgICAgICAgJyBoYXMgYmVlbiBkZXByZWNhdGVkIHNpbmNlIHYnICsgdmVyc2lvbiArICcgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmVhciBmdXR1cmUnXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbGlkYXRvciA/IHZhbGlkYXRvcih2YWx1ZSwgb3B0LCBvcHRzKSA6IHRydWU7XG4gIH07XG59O1xuXG52YWxpZGF0b3JzLnNwZWxsaW5nID0gZnVuY3Rpb24gc3BlbGxpbmcoY29ycmVjdFNwZWxsaW5nKSB7XG4gIHJldHVybiAodmFsdWUsIG9wdCkgPT4ge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS53YXJuKGAke29wdH0gaXMgbGlrZWx5IGEgbWlzc3BlbGxpbmcgb2YgJHtjb3JyZWN0U3BlbGxpbmd9YCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbi8qKlxuICogQXNzZXJ0IG9iamVjdCdzIHByb3BlcnRpZXMgdHlwZVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge29iamVjdH0gc2NoZW1hXG4gKiBAcGFyYW0ge2Jvb2xlYW4/fSBhbGxvd1Vua25vd25cbiAqXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5cbmZ1bmN0aW9uIGFzc2VydE9wdGlvbnMob3B0aW9ucywgc2NoZW1hLCBhbGxvd1Vua25vd24pIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdvcHRpb25zIG11c3QgYmUgYW4gb2JqZWN0JywgQXhpb3NFcnJvci5FUlJfQkFEX09QVElPTl9WQUxVRSk7XG4gIH1cbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICBsZXQgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIGNvbnN0IG9wdCA9IGtleXNbaV07XG4gICAgY29uc3QgdmFsaWRhdG9yID0gc2NoZW1hW29wdF07XG4gICAgaWYgKHZhbGlkYXRvcikge1xuICAgICAgY29uc3QgdmFsdWUgPSBvcHRpb25zW29wdF07XG4gICAgICBjb25zdCByZXN1bHQgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbGlkYXRvcih2YWx1ZSwgb3B0LCBvcHRpb25zKTtcbiAgICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoJ29wdGlvbiAnICsgb3B0ICsgJyBtdXN0IGJlICcgKyByZXN1bHQsIEF4aW9zRXJyb3IuRVJSX0JBRF9PUFRJT05fVkFMVUUpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChhbGxvd1Vua25vd24gIT09IHRydWUpIHtcbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdVbmtub3duIG9wdGlvbiAnICsgb3B0LCBBeGlvc0Vycm9yLkVSUl9CQURfT1BUSU9OKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBhc3NlcnRPcHRpb25zLFxuICB2YWxpZGF0b3JzXG59O1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydCBkZWZhdWx0IHR5cGVvZiBCbG9iICE9PSAndW5kZWZpbmVkJyA/IEJsb2IgOiBudWxsXG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcgPyBGb3JtRGF0YSA6IG51bGw7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBeGlvc1VSTFNlYXJjaFBhcmFtcyBmcm9tICcuLi8uLi8uLi9oZWxwZXJzL0F4aW9zVVJMU2VhcmNoUGFyYW1zLmpzJztcbmV4cG9ydCBkZWZhdWx0IHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnID8gVVJMU2VhcmNoUGFyYW1zIDogQXhpb3NVUkxTZWFyY2hQYXJhbXM7XG4iLCJpbXBvcnQgVVJMU2VhcmNoUGFyYW1zIGZyb20gJy4vY2xhc3Nlcy9VUkxTZWFyY2hQYXJhbXMuanMnXG5pbXBvcnQgRm9ybURhdGEgZnJvbSAnLi9jbGFzc2VzL0Zvcm1EYXRhLmpzJ1xuaW1wb3J0IEJsb2IgZnJvbSAnLi9jbGFzc2VzL0Jsb2IuanMnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaXNCcm93c2VyOiB0cnVlLFxuICBjbGFzc2VzOiB7XG4gICAgVVJMU2VhcmNoUGFyYW1zLFxuICAgIEZvcm1EYXRhLFxuICAgIEJsb2JcbiAgfSxcbiAgcHJvdG9jb2xzOiBbJ2h0dHAnLCAnaHR0cHMnLCAnZmlsZScsICdibG9iJywgJ3VybCcsICdkYXRhJ11cbn07XG4iLCJjb25zdCBoYXNCcm93c2VyRW52ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJztcblxuY29uc3QgX25hdmlnYXRvciA9IHR5cGVvZiBuYXZpZ2F0b3IgPT09ICdvYmplY3QnICYmIG5hdmlnYXRvciB8fCB1bmRlZmluZWQ7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuICogbmF0aXZlc2NyaXB0XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ05hdGl2ZVNjcmlwdCcgb3IgJ05TJ1xuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5jb25zdCBoYXNTdGFuZGFyZEJyb3dzZXJFbnYgPSBoYXNCcm93c2VyRW52ICYmXG4gICghX25hdmlnYXRvciB8fCBbJ1JlYWN0TmF0aXZlJywgJ05hdGl2ZVNjcmlwdCcsICdOUyddLmluZGV4T2YoX25hdmlnYXRvci5wcm9kdWN0KSA8IDApO1xuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciB3ZWJXb3JrZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBBbHRob3VnaCB0aGUgYGlzU3RhbmRhcmRCcm93c2VyRW52YCBtZXRob2QgaW5kaWNhdGVzIHRoYXRcbiAqIGBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlcmAsIHRoZSBXZWJXb3JrZXIgd2lsbCBzdGlsbCBiZVxuICogZmlsdGVyZWQgb3V0IGR1ZSB0byBpdHMganVkZ21lbnQgc3RhbmRhcmRcbiAqIGB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnYC5cbiAqIFRoaXMgbGVhZHMgdG8gYSBwcm9ibGVtIHdoZW4gYXhpb3MgcG9zdCBgRm9ybURhdGFgIGluIHdlYldvcmtlclxuICovXG5jb25zdCBoYXNTdGFuZGFyZEJyb3dzZXJXZWJXb3JrZXJFbnYgPSAoKCkgPT4ge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiBXb3JrZXJHbG9iYWxTY29wZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgICBzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGUgJiZcbiAgICB0eXBlb2Ygc2VsZi5pbXBvcnRTY3JpcHRzID09PSAnZnVuY3Rpb24nXG4gICk7XG59KSgpO1xuXG5jb25zdCBvcmlnaW4gPSBoYXNCcm93c2VyRW52ICYmIHdpbmRvdy5sb2NhdGlvbi5ocmVmIHx8ICdodHRwOi8vbG9jYWxob3N0JztcblxuZXhwb3J0IHtcbiAgaGFzQnJvd3NlckVudixcbiAgaGFzU3RhbmRhcmRCcm93c2VyV2ViV29ya2VyRW52LFxuICBoYXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gIF9uYXZpZ2F0b3IgYXMgbmF2aWdhdG9yLFxuICBvcmlnaW5cbn1cbiIsImltcG9ydCBwbGF0Zm9ybSBmcm9tICcuL25vZGUvaW5kZXguanMnO1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi9jb21tb24vdXRpbHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC4uLnV0aWxzLFxuICAuLi5wbGF0Zm9ybVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgYmluZCBmcm9tICcuL2hlbHBlcnMvYmluZC5qcyc7XG5cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cbmNvbnN0IHt0b1N0cmluZ30gPSBPYmplY3QucHJvdG90eXBlO1xuY29uc3Qge2dldFByb3RvdHlwZU9mfSA9IE9iamVjdDtcblxuY29uc3Qga2luZE9mID0gKGNhY2hlID0+IHRoaW5nID0+IHtcbiAgICBjb25zdCBzdHIgPSB0b1N0cmluZy5jYWxsKHRoaW5nKTtcbiAgICByZXR1cm4gY2FjaGVbc3RyXSB8fCAoY2FjaGVbc3RyXSA9IHN0ci5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKSk7XG59KShPYmplY3QuY3JlYXRlKG51bGwpKTtcblxuY29uc3Qga2luZE9mVGVzdCA9ICh0eXBlKSA9PiB7XG4gIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiAodGhpbmcpID0+IGtpbmRPZih0aGluZykgPT09IHR5cGVcbn1cblxuY29uc3QgdHlwZU9mVGVzdCA9IHR5cGUgPT4gdGhpbmcgPT4gdHlwZW9mIHRoaW5nID09PSB0eXBlO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3Qge2lzQXJyYXl9ID0gQXJyYXk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNVbmRlZmluZWQgPSB0eXBlT2ZUZXN0KCd1bmRlZmluZWQnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0J1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsKSAmJiB2YWwuY29uc3RydWN0b3IgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbC5jb25zdHJ1Y3RvcilcbiAgICAmJiBpc0Z1bmN0aW9uKHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcikgJiYgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyKHZhbCk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNBcnJheUJ1ZmZlciA9IGtpbmRPZlRlc3QoJ0FycmF5QnVmZmVyJyk7XG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICBsZXQgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmIChpc0FycmF5QnVmZmVyKHZhbC5idWZmZXIpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzU3RyaW5nID0gdHlwZU9mVGVzdCgnc3RyaW5nJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNGdW5jdGlvbiA9IHR5cGVPZlRlc3QoJ2Z1bmN0aW9uJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNOdW1iZXIgPSB0eXBlT2ZUZXN0KCdudW1iZXInKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0geyp9IHRoaW5nIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNPYmplY3QgPSAodGhpbmcpID0+IHRoaW5nICE9PSBudWxsICYmIHR5cGVvZiB0aGluZyA9PT0gJ29iamVjdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCb29sZWFuXG4gKlxuICogQHBhcmFtIHsqfSB0aGluZyBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCb29sZWFuLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNCb29sZWFuID0gdGhpbmcgPT4gdGhpbmcgPT09IHRydWUgfHwgdGhpbmcgPT09IGZhbHNlO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzUGxhaW5PYmplY3QgPSAodmFsKSA9PiB7XG4gIGlmIChraW5kT2YodmFsKSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBwcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZih2YWwpO1xuICByZXR1cm4gKHByb3RvdHlwZSA9PT0gbnVsbCB8fCBwcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGUgfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSkgPT09IG51bGwpICYmICEoU3ltYm9sLnRvU3RyaW5nVGFnIGluIHZhbCkgJiYgIShTeW1ib2wuaXRlcmF0b3IgaW4gdmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRGF0ZSA9IGtpbmRPZlRlc3QoJ0RhdGUnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRmlsZSA9IGtpbmRPZlRlc3QoJ0ZpbGUnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQmxvYiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzQmxvYiA9IGtpbmRPZlRlc3QoJ0Jsb2InKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVMaXN0XG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0ZpbGVMaXN0ID0ga2luZE9mVGVzdCgnRmlsZUxpc3QnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc1N0cmVhbSA9ICh2YWwpID0+IGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7Kn0gdGhpbmcgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRm9ybURhdGEgPSAodGhpbmcpID0+IHtcbiAgbGV0IGtpbmQ7XG4gIHJldHVybiB0aGluZyAmJiAoXG4gICAgKHR5cGVvZiBGb3JtRGF0YSA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGluZyBpbnN0YW5jZW9mIEZvcm1EYXRhKSB8fCAoXG4gICAgICBpc0Z1bmN0aW9uKHRoaW5nLmFwcGVuZCkgJiYgKFxuICAgICAgICAoa2luZCA9IGtpbmRPZih0aGluZykpID09PSAnZm9ybWRhdGEnIHx8XG4gICAgICAgIC8vIGRldGVjdCBmb3JtLWRhdGEgaW5zdGFuY2VcbiAgICAgICAgKGtpbmQgPT09ICdvYmplY3QnICYmIGlzRnVuY3Rpb24odGhpbmcudG9TdHJpbmcpICYmIHRoaW5nLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IEZvcm1EYXRhXScpXG4gICAgICApXG4gICAgKVxuICApXG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc1VSTFNlYXJjaFBhcmFtcyA9IGtpbmRPZlRlc3QoJ1VSTFNlYXJjaFBhcmFtcycpO1xuXG5jb25zdCBbaXNSZWFkYWJsZVN0cmVhbSwgaXNSZXF1ZXN0LCBpc1Jlc3BvbnNlLCBpc0hlYWRlcnNdID0gWydSZWFkYWJsZVN0cmVhbScsICdSZXF1ZXN0JywgJ1Jlc3BvbnNlJywgJ0hlYWRlcnMnXS5tYXAoa2luZE9mVGVzdCk7XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgU3RyaW5nIGZyZWVkIG9mIGV4Y2VzcyB3aGl0ZXNwYWNlXG4gKi9cbmNvbnN0IHRyaW0gPSAoc3RyKSA9PiBzdHIudHJpbSA/XG4gIHN0ci50cmltKCkgOiBzdHIucmVwbGFjZSgvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csICcnKTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0IGludm9raW5nIGEgZnVuY3Rpb24gZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2FsbE93bktleXMgPSBmYWxzZV1cbiAqIEByZXR1cm5zIHthbnl9XG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbiwge2FsbE93bktleXMgPSBmYWxzZX0gPSB7fSkge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBpO1xuICBsZXQgbDtcblxuICAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgb2JqID0gW29ial07XG4gIH1cblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuICAgIGZvciAoaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgY29uc3Qga2V5cyA9IGFsbE93bktleXMgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopIDogT2JqZWN0LmtleXMob2JqKTtcbiAgICBjb25zdCBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICBsZXQga2V5O1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kS2V5KG9iaiwga2V5KSB7XG4gIGtleSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgbGV0IGkgPSBrZXlzLmxlbmd0aDtcbiAgbGV0IF9rZXk7XG4gIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgX2tleSA9IGtleXNbaV07XG4gICAgaWYgKGtleSA9PT0gX2tleS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICByZXR1cm4gX2tleTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmNvbnN0IF9nbG9iYWwgPSAoKCkgPT4ge1xuICAvKmVzbGludCBuby11bmRlZjowKi9cbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZ2xvYmFsVGhpcztcbiAgcmV0dXJuIHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IGdsb2JhbClcbn0pKCk7XG5cbmNvbnN0IGlzQ29udGV4dERlZmluZWQgPSAoY29udGV4dCkgPT4gIWlzVW5kZWZpbmVkKGNvbnRleHQpICYmIGNvbnRleHQgIT09IF9nbG9iYWw7XG5cbi8qKlxuICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cbiAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgY29uc3Qge2Nhc2VsZXNzfSA9IGlzQ29udGV4dERlZmluZWQodGhpcykgJiYgdGhpcyB8fCB7fTtcbiAgY29uc3QgcmVzdWx0ID0ge307XG4gIGNvbnN0IGFzc2lnblZhbHVlID0gKHZhbCwga2V5KSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0S2V5ID0gY2FzZWxlc3MgJiYgZmluZEtleShyZXN1bHQsIGtleSkgfHwga2V5O1xuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdFt0YXJnZXRLZXldKSAmJiBpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFt0YXJnZXRLZXldID0gbWVyZ2UocmVzdWx0W3RhcmdldEtleV0sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFt0YXJnZXRLZXldID0gbWVyZ2Uoe30sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgIHJlc3VsdFt0YXJnZXRLZXldID0gdmFsLnNsaWNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFt0YXJnZXRLZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGFyZ3VtZW50c1tpXSAmJiBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFthbGxPd25LZXlzXVxuICogQHJldHVybnMge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5jb25zdCBleHRlbmQgPSAoYSwgYiwgdGhpc0FyZywge2FsbE93bktleXN9PSB7fSkgPT4ge1xuICBmb3JFYWNoKGIsICh2YWwsIGtleSkgPT4ge1xuICAgIGlmICh0aGlzQXJnICYmIGlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9LCB7YWxsT3duS2V5c30pO1xuICByZXR1cm4gYTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYnl0ZSBvcmRlciBtYXJrZXIuIFRoaXMgY2F0Y2hlcyBFRiBCQiBCRiAodGhlIFVURi04IEJPTSlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCB3aXRoIEJPTVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGNvbnRlbnQgdmFsdWUgd2l0aG91dCBCT01cbiAqL1xuY29uc3Qgc3RyaXBCT00gPSAoY29udGVudCkgPT4ge1xuICBpZiAoY29udGVudC5jaGFyQ29kZUF0KDApID09PSAweEZFRkYpIHtcbiAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgxKTtcbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge29iamVjdH0gW3Byb3BzXVxuICogQHBhcmFtIHtvYmplY3R9IFtkZXNjcmlwdG9yc11cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuY29uc3QgaW5oZXJpdHMgPSAoY29uc3RydWN0b3IsIHN1cGVyQ29uc3RydWN0b3IsIHByb3BzLCBkZXNjcmlwdG9ycykgPT4ge1xuICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ29uc3RydWN0b3IucHJvdG90eXBlLCBkZXNjcmlwdG9ycyk7XG4gIGNvbnN0cnVjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0b3IsICdzdXBlcicsIHtcbiAgICB2YWx1ZTogc3VwZXJDb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgfSk7XG4gIHByb3BzICYmIE9iamVjdC5hc3NpZ24oY29uc3RydWN0b3IucHJvdG90eXBlLCBwcm9wcyk7XG59XG5cbi8qKlxuICogUmVzb2x2ZSBvYmplY3Qgd2l0aCBkZWVwIHByb3RvdHlwZSBjaGFpbiB0byBhIGZsYXQgb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlT2JqIHNvdXJjZSBvYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBbZGVzdE9ial1cbiAqIEBwYXJhbSB7RnVuY3Rpb258Qm9vbGVhbn0gW2ZpbHRlcl1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcm9wRmlsdGVyXVxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cbmNvbnN0IHRvRmxhdE9iamVjdCA9IChzb3VyY2VPYmosIGRlc3RPYmosIGZpbHRlciwgcHJvcEZpbHRlcikgPT4ge1xuICBsZXQgcHJvcHM7XG4gIGxldCBpO1xuICBsZXQgcHJvcDtcbiAgY29uc3QgbWVyZ2VkID0ge307XG5cbiAgZGVzdE9iaiA9IGRlc3RPYmogfHwge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lcS1udWxsLGVxZXFlcVxuICBpZiAoc291cmNlT2JqID09IG51bGwpIHJldHVybiBkZXN0T2JqO1xuXG4gIGRvIHtcbiAgICBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZU9iaik7XG4gICAgaSA9IHByb3BzLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tID4gMCkge1xuICAgICAgcHJvcCA9IHByb3BzW2ldO1xuICAgICAgaWYgKCghcHJvcEZpbHRlciB8fCBwcm9wRmlsdGVyKHByb3AsIHNvdXJjZU9iaiwgZGVzdE9iaikpICYmICFtZXJnZWRbcHJvcF0pIHtcbiAgICAgICAgZGVzdE9ialtwcm9wXSA9IHNvdXJjZU9ialtwcm9wXTtcbiAgICAgICAgbWVyZ2VkW3Byb3BdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgc291cmNlT2JqID0gZmlsdGVyICE9PSBmYWxzZSAmJiBnZXRQcm90b3R5cGVPZihzb3VyY2VPYmopO1xuICB9IHdoaWxlIChzb3VyY2VPYmogJiYgKCFmaWx0ZXIgfHwgZmlsdGVyKHNvdXJjZU9iaiwgZGVzdE9iaikpICYmIHNvdXJjZU9iaiAhPT0gT2JqZWN0LnByb3RvdHlwZSk7XG5cbiAgcmV0dXJuIGRlc3RPYmo7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgc3RyaW5nIGVuZHMgd2l0aCB0aGUgY2hhcmFjdGVycyBvZiBhIHNwZWNpZmllZCBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VhcmNoU3RyaW5nXG4gKiBAcGFyYW0ge051bWJlcn0gW3Bvc2l0aW9uPSAwXVxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5jb25zdCBlbmRzV2l0aCA9IChzdHIsIHNlYXJjaFN0cmluZywgcG9zaXRpb24pID0+IHtcbiAgc3RyID0gU3RyaW5nKHN0cik7XG4gIGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkIHx8IHBvc2l0aW9uID4gc3RyLmxlbmd0aCkge1xuICAgIHBvc2l0aW9uID0gc3RyLmxlbmd0aDtcbiAgfVxuICBwb3NpdGlvbiAtPSBzZWFyY2hTdHJpbmcubGVuZ3RoO1xuICBjb25zdCBsYXN0SW5kZXggPSBzdHIuaW5kZXhPZihzZWFyY2hTdHJpbmcsIHBvc2l0aW9uKTtcbiAgcmV0dXJuIGxhc3RJbmRleCAhPT0gLTEgJiYgbGFzdEluZGV4ID09PSBwb3NpdGlvbjtcbn1cblxuXG4vKipcbiAqIFJldHVybnMgbmV3IGFycmF5IGZyb20gYXJyYXkgbGlrZSBvYmplY3Qgb3IgbnVsbCBpZiBmYWlsZWRcbiAqXG4gKiBAcGFyYW0geyp9IFt0aGluZ11cbiAqXG4gKiBAcmV0dXJucyB7P0FycmF5fVxuICovXG5jb25zdCB0b0FycmF5ID0gKHRoaW5nKSA9PiB7XG4gIGlmICghdGhpbmcpIHJldHVybiBudWxsO1xuICBpZiAoaXNBcnJheSh0aGluZykpIHJldHVybiB0aGluZztcbiAgbGV0IGkgPSB0aGluZy5sZW5ndGg7XG4gIGlmICghaXNOdW1iZXIoaSkpIHJldHVybiBudWxsO1xuICBjb25zdCBhcnIgPSBuZXcgQXJyYXkoaSk7XG4gIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgYXJyW2ldID0gdGhpbmdbaV07XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuLyoqXG4gKiBDaGVja2luZyBpZiB0aGUgVWludDhBcnJheSBleGlzdHMgYW5kIGlmIGl0IGRvZXMsIGl0IHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNoZWNrcyBpZiB0aGVcbiAqIHRoaW5nIHBhc3NlZCBpbiBpcyBhbiBpbnN0YW5jZSBvZiBVaW50OEFycmF5XG4gKlxuICogQHBhcmFtIHtUeXBlZEFycmF5fVxuICpcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbmNvbnN0IGlzVHlwZWRBcnJheSA9IChUeXBlZEFycmF5ID0+IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgcmV0dXJuIHRoaW5nID0+IHtcbiAgICByZXR1cm4gVHlwZWRBcnJheSAmJiB0aGluZyBpbnN0YW5jZW9mIFR5cGVkQXJyYXk7XG4gIH07XG59KSh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2V0UHJvdG90eXBlT2YoVWludDhBcnJheSkpO1xuXG4vKipcbiAqIEZvciBlYWNoIGVudHJ5IGluIHRoZSBvYmplY3QsIGNhbGwgdGhlIGZ1bmN0aW9uIHdpdGggdGhlIGtleSBhbmQgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtPYmplY3Q8YW55LCBhbnk+fSBvYmogLSBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIC0gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZW50cnkuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmNvbnN0IGZvckVhY2hFbnRyeSA9IChvYmosIGZuKSA9PiB7XG4gIGNvbnN0IGdlbmVyYXRvciA9IG9iaiAmJiBvYmpbU3ltYm9sLml0ZXJhdG9yXTtcblxuICBjb25zdCBpdGVyYXRvciA9IGdlbmVyYXRvci5jYWxsKG9iaik7XG5cbiAgbGV0IHJlc3VsdDtcblxuICB3aGlsZSAoKHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKSkgJiYgIXJlc3VsdC5kb25lKSB7XG4gICAgY29uc3QgcGFpciA9IHJlc3VsdC52YWx1ZTtcbiAgICBmbi5jYWxsKG9iaiwgcGFpclswXSwgcGFpclsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBJdCB0YWtlcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBhbmQgYSBzdHJpbmcsIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB0aGUgbWF0Y2hlc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdFeHAgLSBUaGUgcmVndWxhciBleHByZXNzaW9uIHRvIG1hdGNoIGFnYWluc3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBzZWFyY2guXG4gKlxuICogQHJldHVybnMge0FycmF5PGJvb2xlYW4+fVxuICovXG5jb25zdCBtYXRjaEFsbCA9IChyZWdFeHAsIHN0cikgPT4ge1xuICBsZXQgbWF0Y2hlcztcbiAgY29uc3QgYXJyID0gW107XG5cbiAgd2hpbGUgKChtYXRjaGVzID0gcmVnRXhwLmV4ZWMoc3RyKSkgIT09IG51bGwpIHtcbiAgICBhcnIucHVzaChtYXRjaGVzKTtcbiAgfVxuXG4gIHJldHVybiBhcnI7XG59XG5cbi8qIENoZWNraW5nIGlmIHRoZSBraW5kT2ZUZXN0IGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSB3aGVuIHBhc3NlZCBhbiBIVE1MRm9ybUVsZW1lbnQuICovXG5jb25zdCBpc0hUTUxGb3JtID0ga2luZE9mVGVzdCgnSFRNTEZvcm1FbGVtZW50Jyk7XG5cbmNvbnN0IHRvQ2FtZWxDYXNlID0gc3RyID0+IHtcbiAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1stX1xcc10oW2EtelxcZF0pKFxcdyopL2csXG4gICAgZnVuY3Rpb24gcmVwbGFjZXIobSwgcDEsIHAyKSB7XG4gICAgICByZXR1cm4gcDEudG9VcHBlckNhc2UoKSArIHAyO1xuICAgIH1cbiAgKTtcbn07XG5cbi8qIENyZWF0aW5nIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGNoZWNrIGlmIGFuIG9iamVjdCBoYXMgYSBwcm9wZXJ0eS4gKi9cbmNvbnN0IGhhc093blByb3BlcnR5ID0gKCh7aGFzT3duUHJvcGVydHl9KSA9PiAob2JqLCBwcm9wKSA9PiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpKE9iamVjdC5wcm90b3R5cGUpO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBSZWdFeHAgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNSZWdFeHAgPSBraW5kT2ZUZXN0KCdSZWdFeHAnKTtcblxuY29uc3QgcmVkdWNlRGVzY3JpcHRvcnMgPSAob2JqLCByZWR1Y2VyKSA9PiB7XG4gIGNvbnN0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMob2JqKTtcbiAgY29uc3QgcmVkdWNlZERlc2NyaXB0b3JzID0ge307XG5cbiAgZm9yRWFjaChkZXNjcmlwdG9ycywgKGRlc2NyaXB0b3IsIG5hbWUpID0+IHtcbiAgICBsZXQgcmV0O1xuICAgIGlmICgocmV0ID0gcmVkdWNlcihkZXNjcmlwdG9yLCBuYW1lLCBvYmopKSAhPT0gZmFsc2UpIHtcbiAgICAgIHJlZHVjZWREZXNjcmlwdG9yc1tuYW1lXSA9IHJldCB8fCBkZXNjcmlwdG9yO1xuICAgIH1cbiAgfSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMob2JqLCByZWR1Y2VkRGVzY3JpcHRvcnMpO1xufVxuXG4vKipcbiAqIE1ha2VzIGFsbCBtZXRob2RzIHJlYWQtb25seVxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICovXG5cbmNvbnN0IGZyZWV6ZU1ldGhvZHMgPSAob2JqKSA9PiB7XG4gIHJlZHVjZURlc2NyaXB0b3JzKG9iaiwgKGRlc2NyaXB0b3IsIG5hbWUpID0+IHtcbiAgICAvLyBza2lwIHJlc3RyaWN0ZWQgcHJvcHMgaW4gc3RyaWN0IG1vZGVcbiAgICBpZiAoaXNGdW5jdGlvbihvYmopICYmIFsnYXJndW1lbnRzJywgJ2NhbGxlcicsICdjYWxsZWUnXS5pbmRleE9mKG5hbWUpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gb2JqW25hbWVdO1xuXG4gICAgaWYgKCFpc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuO1xuXG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZmFsc2U7XG5cbiAgICBpZiAoJ3dyaXRhYmxlJyBpbiBkZXNjcmlwdG9yKSB7XG4gICAgICBkZXNjcmlwdG9yLndyaXRhYmxlID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFkZXNjcmlwdG9yLnNldCkge1xuICAgICAgZGVzY3JpcHRvci5zZXQgPSAoKSA9PiB7XG4gICAgICAgIHRocm93IEVycm9yKCdDYW4gbm90IHJld3JpdGUgcmVhZC1vbmx5IG1ldGhvZCBcXCcnICsgbmFtZSArICdcXCcnKTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgdG9PYmplY3RTZXQgPSAoYXJyYXlPclN0cmluZywgZGVsaW1pdGVyKSA9PiB7XG4gIGNvbnN0IG9iaiA9IHt9O1xuXG4gIGNvbnN0IGRlZmluZSA9IChhcnIpID0+IHtcbiAgICBhcnIuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICBvYmpbdmFsdWVdID0gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGlzQXJyYXkoYXJyYXlPclN0cmluZykgPyBkZWZpbmUoYXJyYXlPclN0cmluZykgOiBkZWZpbmUoU3RyaW5nKGFycmF5T3JTdHJpbmcpLnNwbGl0KGRlbGltaXRlcikpO1xuXG4gIHJldHVybiBvYmo7XG59XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fVxuXG5jb25zdCB0b0Zpbml0ZU51bWJlciA9ICh2YWx1ZSwgZGVmYXVsdFZhbHVlKSA9PiB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIE51bWJlci5pc0Zpbml0ZSh2YWx1ZSA9ICt2YWx1ZSkgPyB2YWx1ZSA6IGRlZmF1bHRWYWx1ZTtcbn1cblxuLyoqXG4gKiBJZiB0aGUgdGhpbmcgaXMgYSBGb3JtRGF0YSBvYmplY3QsIHJldHVybiB0cnVlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxuICpcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGhpbmcgLSBUaGUgdGhpbmcgdG8gY2hlY2suXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzU3BlY0NvbXBsaWFudEZvcm0odGhpbmcpIHtcbiAgcmV0dXJuICEhKHRoaW5nICYmIGlzRnVuY3Rpb24odGhpbmcuYXBwZW5kKSAmJiB0aGluZ1tTeW1ib2wudG9TdHJpbmdUYWddID09PSAnRm9ybURhdGEnICYmIHRoaW5nW1N5bWJvbC5pdGVyYXRvcl0pO1xufVxuXG5jb25zdCB0b0pTT05PYmplY3QgPSAob2JqKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IEFycmF5KDEwKTtcblxuICBjb25zdCB2aXNpdCA9IChzb3VyY2UsIGkpID0+IHtcblxuICAgIGlmIChpc09iamVjdChzb3VyY2UpKSB7XG4gICAgICBpZiAoc3RhY2suaW5kZXhPZihzb3VyY2UpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZighKCd0b0pTT04nIGluIHNvdXJjZSkpIHtcbiAgICAgICAgc3RhY2tbaV0gPSBzb3VyY2U7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGlzQXJyYXkoc291cmNlKSA/IFtdIDoge307XG5cbiAgICAgICAgZm9yRWFjaChzb3VyY2UsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgY29uc3QgcmVkdWNlZFZhbHVlID0gdmlzaXQodmFsdWUsIGkgKyAxKTtcbiAgICAgICAgICAhaXNVbmRlZmluZWQocmVkdWNlZFZhbHVlKSAmJiAodGFyZ2V0W2tleV0gPSByZWR1Y2VkVmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdGFja1tpXSA9IHVuZGVmaW5lZDtcblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICByZXR1cm4gdmlzaXQob2JqLCAwKTtcbn1cblxuY29uc3QgaXNBc3luY0ZuID0ga2luZE9mVGVzdCgnQXN5bmNGdW5jdGlvbicpO1xuXG5jb25zdCBpc1RoZW5hYmxlID0gKHRoaW5nKSA9PlxuICB0aGluZyAmJiAoaXNPYmplY3QodGhpbmcpIHx8IGlzRnVuY3Rpb24odGhpbmcpKSAmJiBpc0Z1bmN0aW9uKHRoaW5nLnRoZW4pICYmIGlzRnVuY3Rpb24odGhpbmcuY2F0Y2gpO1xuXG4vLyBvcmlnaW5hbCBjb2RlXG4vLyBodHRwczovL2dpdGh1Yi5jb20vRGlnaXRhbEJyYWluSlMvQXhpb3NQcm9taXNlL2Jsb2IvMTZkZWFiMTM3MTBlYzA5Nzc5OTIyMTMxZjNmYTU5NTQzMjBmODNhYi9saWIvdXRpbHMuanMjTDExLUwzNFxuXG5jb25zdCBfc2V0SW1tZWRpYXRlID0gKChzZXRJbW1lZGlhdGVTdXBwb3J0ZWQsIHBvc3RNZXNzYWdlU3VwcG9ydGVkKSA9PiB7XG4gIGlmIChzZXRJbW1lZGlhdGVTdXBwb3J0ZWQpIHtcbiAgICByZXR1cm4gc2V0SW1tZWRpYXRlO1xuICB9XG5cbiAgcmV0dXJuIHBvc3RNZXNzYWdlU3VwcG9ydGVkID8gKCh0b2tlbiwgY2FsbGJhY2tzKSA9PiB7XG4gICAgX2dsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoe3NvdXJjZSwgZGF0YX0pID0+IHtcbiAgICAgIGlmIChzb3VyY2UgPT09IF9nbG9iYWwgJiYgZGF0YSA9PT0gdG9rZW4pIHtcbiAgICAgICAgY2FsbGJhY2tzLmxlbmd0aCAmJiBjYWxsYmFja3Muc2hpZnQoKSgpO1xuICAgICAgfVxuICAgIH0sIGZhbHNlKTtcblxuICAgIHJldHVybiAoY2IpID0+IHtcbiAgICAgIGNhbGxiYWNrcy5wdXNoKGNiKTtcbiAgICAgIF9nbG9iYWwucG9zdE1lc3NhZ2UodG9rZW4sIFwiKlwiKTtcbiAgICB9XG4gIH0pKGBheGlvc0Ake01hdGgucmFuZG9tKCl9YCwgW10pIDogKGNiKSA9PiBzZXRUaW1lb3V0KGNiKTtcbn0pKFxuICB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nLFxuICBpc0Z1bmN0aW9uKF9nbG9iYWwucG9zdE1lc3NhZ2UpXG4pO1xuXG5jb25zdCBhc2FwID0gdHlwZW9mIHF1ZXVlTWljcm90YXNrICE9PSAndW5kZWZpbmVkJyA/XG4gIHF1ZXVlTWljcm90YXNrLmJpbmQoX2dsb2JhbCkgOiAoIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLm5leHRUaWNrIHx8IF9zZXRJbW1lZGlhdGUpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKipcblxuZXhwb3J0IGRlZmF1bHQge1xuICBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcixcbiAgaXNGb3JtRGF0YSxcbiAgaXNBcnJheUJ1ZmZlclZpZXcsXG4gIGlzU3RyaW5nLFxuICBpc051bWJlcixcbiAgaXNCb29sZWFuLFxuICBpc09iamVjdCxcbiAgaXNQbGFpbk9iamVjdCxcbiAgaXNSZWFkYWJsZVN0cmVhbSxcbiAgaXNSZXF1ZXN0LFxuICBpc1Jlc3BvbnNlLFxuICBpc0hlYWRlcnMsXG4gIGlzVW5kZWZpbmVkLFxuICBpc0RhdGUsXG4gIGlzRmlsZSxcbiAgaXNCbG9iLFxuICBpc1JlZ0V4cCxcbiAgaXNGdW5jdGlvbixcbiAgaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zLFxuICBpc1R5cGVkQXJyYXksXG4gIGlzRmlsZUxpc3QsXG4gIGZvckVhY2gsXG4gIG1lcmdlLFxuICBleHRlbmQsXG4gIHRyaW0sXG4gIHN0cmlwQk9NLFxuICBpbmhlcml0cyxcbiAgdG9GbGF0T2JqZWN0LFxuICBraW5kT2YsXG4gIGtpbmRPZlRlc3QsXG4gIGVuZHNXaXRoLFxuICB0b0FycmF5LFxuICBmb3JFYWNoRW50cnksXG4gIG1hdGNoQWxsLFxuICBpc0hUTUxGb3JtLFxuICBoYXNPd25Qcm9wZXJ0eSxcbiAgaGFzT3duUHJvcDogaGFzT3duUHJvcGVydHksIC8vIGFuIGFsaWFzIHRvIGF2b2lkIEVTTGludCBuby1wcm90b3R5cGUtYnVpbHRpbnMgZGV0ZWN0aW9uXG4gIHJlZHVjZURlc2NyaXB0b3JzLFxuICBmcmVlemVNZXRob2RzLFxuICB0b09iamVjdFNldCxcbiAgdG9DYW1lbENhc2UsXG4gIG5vb3AsXG4gIHRvRmluaXRlTnVtYmVyLFxuICBmaW5kS2V5LFxuICBnbG9iYWw6IF9nbG9iYWwsXG4gIGlzQ29udGV4dERlZmluZWQsXG4gIGlzU3BlY0NvbXBsaWFudEZvcm0sXG4gIHRvSlNPTk9iamVjdCxcbiAgaXNBc3luY0ZuLFxuICBpc1RoZW5hYmxlLFxuICBzZXRJbW1lZGlhdGU6IF9zZXRJbW1lZGlhdGUsXG4gIGFzYXBcbn07XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCJAaW1wb3J0IHVybChodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PVJvYm90bzppdGFsLHdnaHRAMCwxMDAuLjkwMDsxLDEwMC4uOTAwJmRpc3BsYXk9c3dhcCk7XCJdKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgLmFkLXJlc2V0IHtcbiAgYWxsOiB1bnNldDtcbn1cbi5hZC1kZWZhdWx0LWJ1dHRvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBib3gtc2l6aW5nOiBpbmhlcml0O1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2IoMjIxLCAyMjEsIDIyMSk7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xuICBoZWlnaHQ6IGF1dG87XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuLmFkLWRlZmF1bHQtYW5jaG9yIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGNvbG9yOiBpbmhlcml0O1xuICBkaXNwbGF5OiBmbGV4O1xuICB3aWR0aDogZml0LWNvbnRlbnQ7XG4gIGhlaWdodDogZml0LWNvbnRlbnQ7XG4gIGJveC1zaXppbmc6IGluaGVyaXQ7XG59XG5cbmlucy5haW96LWFkcyB7XG4gIGFsbDogdW5zZXQ7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogYXV0bztcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG1hcmdpbjogMCBhdXRvO1xuICBmb250LWZhbWlseTogJ1JvYm90bycsIHNhbnMtc2VyaWY7XG59XG4uYWQtY29udGFpbmVyIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwYWRkaW5nOiAxMHB4IDBweDtcbn1cbi5hZC1yb3ctY29udGFpbmVyIHtcbiAgd2lkdGg6IGF1dG87XG4gIGhlaWdodDogMjQwcHg7XG59XG4uYWQtY29sLWNvbnRhaW5lciB7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogYXV0bztcbn1cbi5hZC1vdXRlci13cmFwcGVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBib3gtc2l6aW5nOiBpbmhlcml0O1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIG1heC1oZWlnaHQ6IDEwMCU7XG59XG4uYWQtaW5kaWNhdG9yLXNwYW4ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogM3B4O1xuICBsZWZ0OiAzcHg7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIHBhZGRpbmc6IDBweCA2cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxMjMsIDIyMSwgMTU3KTtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgbGluZS1oZWlnaHQ6IDEuNTtcbiAgY29sb3I6IHJnYigyNTUsIDI1NSwgMjU1KTtcbn1cbi5hZC1pbWFnZS13cmFwcGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgd2lkdGg6IGF1dG87XG4gIGhlaWdodDogYXV0bztcbiAgYm94LXNpemluZzogaW5oZXJpdDtcbn1cbi5hZC1pbWFnZS1lbGVtZW50IHtcbiAgd2lkdGg6IGF1dG87XG4gIGhlaWdodDogYXV0bztcbiAgb2JqZWN0LWZpdDogY292ZXI7XG4gIG9iamVjdC1wb3NpdGlvbjogY2VudGVyO1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG4uYWQtaWNvbi1zbS13cmFwcGVyID4gc3ZnIHtcbiAgY29sb3I6IGluaGVyaXQgIWltcG9ydGFudDtcbiAgd2lkdGg6IDIwcHg7XG4gIGhlaWdodDogMjBweDtcbn1cbi5hZC1pY29uLWxnLXdyYXBwZXIgPiBzdmcge1xuICBjb2xvcjogaW5oZXJpdCAhaW1wb3J0YW50O1xuICB3aWR0aDogNDBweDtcbiAgaGVpZ2h0OiA0MHB4O1xufVxuXG4uYWlvei1hZHMtb3ZlcmxheSB7XG4gIGRpc3BsYXk6IGNvbnRlbnRzO1xuICBmb250LWZhbWlseTogJ1JvYm90bycsIHNhbnMtc2VyaWY7XG59XG4uYWQtZnVsbHNjcmVlbi1ibHVyLW92ZXJsYXkge1xuICB6LWluZGV4OiA5MDAwO1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIGluc2V0OiAwO1xuICB3aWR0aDogYXV0bztcbiAgaGVpZ2h0OiBhdXRvO1xuICBiYWNrZ3JvdW5kOiByZ2IoMjM0LCAyMzMsIDIzOCk7XG4gIG9wYWNpdHk6IDAuODtcbn1cbi5hZC1kaWFsb2ctY29udGFpbmVyLW92ZXJsYXkge1xuICB6LWluZGV4OiA5MDAxO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBpbnNldDogMDtcbiAgbWFyZ2luOiBhdXRvO1xuICBiYWNrZ3JvdW5kOiByZ2IoMTI4LCAxMjgsIDEyOCk7XG59XG4uYWQtZGlhbG9nLWJnLW92ZXJsYXkge1xuICB6LWluZGV4OiAtMTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBpbnNldDogMDtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUNBO0VBQ0UsVUFBVTtBQUNaO0FBQ0E7RUFDRSxhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLHVCQUF1QjtFQUN2QixtQkFBbUI7RUFDbkIsb0NBQW9DO0VBQ3BDLGtCQUFrQjtFQUNsQixrQkFBa0I7RUFDbEIsWUFBWTtFQUNaLGVBQWU7RUFDZixtQkFBbUI7RUFDbkIsZUFBZTtBQUNqQjtBQUNBO0VBQ0UsZUFBZTtFQUNmLHFCQUFxQjtFQUNyQixjQUFjO0VBQ2QsYUFBYTtFQUNiLGtCQUFrQjtFQUNsQixtQkFBbUI7RUFDbkIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsVUFBVTtFQUNWLHNCQUFzQjs7RUFFdEIsV0FBVztFQUNYLFlBQVk7RUFDWixhQUFhO0VBQ2IsdUJBQXVCO0VBQ3ZCLGNBQWM7RUFDZCxpQ0FBaUM7QUFDbkM7QUFDQTtFQUNFLHNCQUFzQjtFQUN0QixhQUFhO0VBQ2Isb0JBQW9CO0VBQ3BCLHVCQUF1QjtFQUN2QixpQkFBaUI7QUFDbkI7QUFDQTtFQUNFLFdBQVc7RUFDWCxhQUFhO0FBQ2Y7QUFDQTtFQUNFLFdBQVc7RUFDWCxlQUFlO0VBQ2YsWUFBWTtBQUNkO0FBQ0E7RUFDRSxrQkFBa0I7RUFDbEIsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixlQUFlO0VBQ2YsZ0JBQWdCO0FBQ2xCO0FBQ0E7RUFDRSxrQkFBa0I7RUFDbEIsUUFBUTtFQUNSLFNBQVM7RUFDVCxvQkFBb0I7RUFDcEIsa0JBQWtCO0VBQ2xCLGdCQUFnQjtFQUNoQixvQ0FBb0M7RUFDcEMsZUFBZTtFQUNmLGlCQUFpQjtFQUNqQixnQkFBZ0I7RUFDaEIseUJBQXlCO0FBQzNCO0FBQ0E7RUFDRSxhQUFhO0VBQ2IsV0FBVztFQUNYLFlBQVk7RUFDWixtQkFBbUI7QUFDckI7QUFDQTtFQUNFLFdBQVc7RUFDWCxZQUFZO0VBQ1osaUJBQWlCO0VBQ2pCLHVCQUF1QjtFQUN2QixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsV0FBVztFQUNYLFlBQVk7QUFDZDtBQUNBO0VBQ0UseUJBQXlCO0VBQ3pCLFdBQVc7RUFDWCxZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsaUNBQWlDO0FBQ25DO0FBQ0E7RUFDRSxhQUFhO0VBQ2IsZUFBZTtFQUNmLFFBQVE7RUFDUixXQUFXO0VBQ1gsWUFBWTtFQUNaLDhCQUE4QjtFQUM5QixZQUFZO0FBQ2Q7QUFDQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsZUFBZTtFQUNmLGNBQWM7RUFDZCxRQUFRO0VBQ1IsWUFBWTtFQUNaLDhCQUE4QjtBQUNoQztBQUNBO0VBQ0UsV0FBVztFQUNYLGtCQUFrQjtFQUNsQixRQUFRO0VBQ1IsY0FBYztFQUNkLFdBQVc7RUFDWCxZQUFZO0FBQ2RcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGltcG9ydCB1cmwoJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9Um9ib3RvOml0YWwsd2dodEAwLDEwMC4uOTAwOzEsMTAwLi45MDAmZGlzcGxheT1zd2FwJyk7XFxuLmFkLXJlc2V0IHtcXG4gIGFsbDogdW5zZXQ7XFxufVxcbi5hZC1kZWZhdWx0LWJ1dHRvbiB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYm94LXNpemluZzogaW5oZXJpdDtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYigyMjEsIDIyMSwgMjIxKTtcXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcXG4gIHdpZHRoOiBmaXQtY29udGVudDtcXG4gIGhlaWdodDogYXV0bztcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIGxpbmUtaGVpZ2h0OiBub3JtYWw7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbi5hZC1kZWZhdWx0LWFuY2hvciB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICBjb2xvcjogaW5oZXJpdDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICB3aWR0aDogZml0LWNvbnRlbnQ7XFxuICBoZWlnaHQ6IGZpdC1jb250ZW50O1xcbiAgYm94LXNpemluZzogaW5oZXJpdDtcXG59XFxuXFxuaW5zLmFpb3otYWRzIHtcXG4gIGFsbDogdW5zZXQ7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcblxcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IGF1dG87XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBtYXJnaW46IDAgYXV0bztcXG4gIGZvbnQtZmFtaWx5OiAnUm9ib3RvJywgc2Fucy1zZXJpZjtcXG59XFxuLmFkLWNvbnRhaW5lciB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBwYWRkaW5nOiAxMHB4IDBweDtcXG59XFxuLmFkLXJvdy1jb250YWluZXIge1xcbiAgd2lkdGg6IGF1dG87XFxuICBoZWlnaHQ6IDI0MHB4O1xcbn1cXG4uYWQtY29sLWNvbnRhaW5lciB7XFxuICB3aWR0aDogMTAwJTtcXG4gIG1heC13aWR0aDogMTAwJTtcXG4gIGhlaWdodDogYXV0bztcXG59XFxuLmFkLW91dGVyLXdyYXBwZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGJveC1zaXppbmc6IGluaGVyaXQ7XFxuICBtYXgtd2lkdGg6IDEwMCU7XFxuICBtYXgtaGVpZ2h0OiAxMDAlO1xcbn1cXG4uYWQtaW5kaWNhdG9yLXNwYW4ge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAzcHg7XFxuICBsZWZ0OiAzcHg7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG4gIGJvcmRlci1yYWRpdXM6IDZweDtcXG4gIHBhZGRpbmc6IDBweCA2cHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTIzLCAyMjEsIDE1Nyk7XFxuICBmb250LXNpemU6IDEycHg7XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIGxpbmUtaGVpZ2h0OiAxLjU7XFxuICBjb2xvcjogcmdiKDI1NSwgMjU1LCAyNTUpO1xcbn1cXG4uYWQtaW1hZ2Utd3JhcHBlciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgd2lkdGg6IGF1dG87XFxuICBoZWlnaHQ6IGF1dG87XFxuICBib3gtc2l6aW5nOiBpbmhlcml0O1xcbn1cXG4uYWQtaW1hZ2UtZWxlbWVudCB7XFxuICB3aWR0aDogYXV0bztcXG4gIGhlaWdodDogYXV0bztcXG4gIG9iamVjdC1maXQ6IGNvdmVyO1xcbiAgb2JqZWN0LXBvc2l0aW9uOiBjZW50ZXI7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG4uYWQtaWNvbi1zbS13cmFwcGVyID4gc3ZnIHtcXG4gIGNvbG9yOiBpbmhlcml0ICFpbXBvcnRhbnQ7XFxuICB3aWR0aDogMjBweDtcXG4gIGhlaWdodDogMjBweDtcXG59XFxuLmFkLWljb24tbGctd3JhcHBlciA+IHN2ZyB7XFxuICBjb2xvcjogaW5oZXJpdCAhaW1wb3J0YW50O1xcbiAgd2lkdGg6IDQwcHg7XFxuICBoZWlnaHQ6IDQwcHg7XFxufVxcblxcbi5haW96LWFkcy1vdmVybGF5IHtcXG4gIGRpc3BsYXk6IGNvbnRlbnRzO1xcbiAgZm9udC1mYW1pbHk6ICdSb2JvdG8nLCBzYW5zLXNlcmlmO1xcbn1cXG4uYWQtZnVsbHNjcmVlbi1ibHVyLW92ZXJsYXkge1xcbiAgei1pbmRleDogOTAwMDtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIGluc2V0OiAwO1xcbiAgd2lkdGg6IGF1dG87XFxuICBoZWlnaHQ6IGF1dG87XFxuICBiYWNrZ3JvdW5kOiByZ2IoMjM0LCAyMzMsIDIzOCk7XFxuICBvcGFjaXR5OiAwLjg7XFxufVxcbi5hZC1kaWFsb2ctY29udGFpbmVyLW92ZXJsYXkge1xcbiAgei1pbmRleDogOTAwMTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIGluc2V0OiAwO1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgYmFja2dyb3VuZDogcmdiKDEyOCwgMTI4LCAxMjgpO1xcbn1cXG4uYWQtZGlhbG9nLWJnLW92ZXJsYXkge1xcbiAgei1pbmRleDogLTE7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBpbnNldDogMDtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCJ2YXIgdHJpbW1lZEVuZEluZGV4ID0gcmVxdWlyZSgnLi9fdHJpbW1lZEVuZEluZGV4Jyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW1TdGFydCA9IC9eXFxzKy87XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udHJpbWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byB0cmltLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdHJpbW1lZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUcmltKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nXG4gICAgPyBzdHJpbmcuc2xpY2UoMCwgdHJpbW1lZEVuZEluZGV4KHN0cmluZykgKyAxKS5yZXBsYWNlKHJlVHJpbVN0YXJ0LCAnJylcbiAgICA6IHN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVHJpbTtcbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnJlZUdsb2JhbDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFJhd1RhZztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdFRvU3RyaW5nO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuIiwiLyoqIFVzZWQgdG8gbWF0Y2ggYSBzaW5nbGUgd2hpdGVzcGFjZSBjaGFyYWN0ZXIuICovXG52YXIgcmVXaGl0ZXNwYWNlID0gL1xccy87XG5cbi8qKlxuICogVXNlZCBieSBgXy50cmltYCBhbmQgYF8udHJpbUVuZGAgdG8gZ2V0IHRoZSBpbmRleCBvZiB0aGUgbGFzdCBub24td2hpdGVzcGFjZVxuICogY2hhcmFjdGVyIG9mIGBzdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBsYXN0IG5vbi13aGl0ZXNwYWNlIGNoYXJhY3Rlci5cbiAqL1xuZnVuY3Rpb24gdHJpbW1lZEVuZEluZGV4KHN0cmluZykge1xuICB2YXIgaW5kZXggPSBzdHJpbmcubGVuZ3RoO1xuXG4gIHdoaWxlIChpbmRleC0tICYmIHJlV2hpdGVzcGFjZS50ZXN0KHN0cmluZy5jaGFyQXQoaW5kZXgpKSkge31cbiAgcmV0dXJuIGluZGV4O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRyaW1tZWRFbmRJbmRleDtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBub3cgPSByZXF1aXJlKCcuL25vdycpLFxuICAgIHRvTnVtYmVyID0gcmVxdWlyZSgnLi90b051bWJlcicpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgdGltZVdhaXRpbmcgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nXG4gICAgICA/IG5hdGl2ZU1pbih0aW1lV2FpdGluZywgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpXG4gICAgICA6IHRpbWVXYWl0aW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAgICAgcmV0dXJuIGludm9rZUZ1bmMobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBkZWJvdW5jZWQuY2FuY2VsID0gY2FuY2VsO1xuICBkZWJvdW5jZWQuZmx1c2ggPSBmbHVzaDtcbiAgcmV0dXJuIGRlYm91bmNlZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbm93O1xuIiwidmFyIGRlYm91bmNlID0gcmVxdWlyZSgnLi9kZWJvdW5jZScpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSB0aHJvdHRsZWQgZnVuY3Rpb24gdGhhdCBvbmx5IGludm9rZXMgYGZ1bmNgIGF0IG1vc3Qgb25jZSBwZXJcbiAqIGV2ZXJ5IGB3YWl0YCBtaWxsaXNlY29uZHMuIFRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgXG4gKiBtZXRob2QgdG8gY2FuY2VsIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvXG4gKiBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS4gUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2BcbiAqIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGBcbiAqIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZCB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGVcbiAqIHRocm90dGxlZCBmdW5jdGlvbi4gU3Vic2VxdWVudCBjYWxscyB0byB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHJldHVybiB0aGVcbiAqIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIHRocm90dGxlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy50aHJvdHRsZWAgYW5kIGBfLmRlYm91bmNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRocm90dGxlIGludm9jYXRpb25zIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHRocm90dGxlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgZXhjZXNzaXZlbHkgdXBkYXRpbmcgdGhlIHBvc2l0aW9uIHdoaWxlIHNjcm9sbGluZy5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdzY3JvbGwnLCBfLnRocm90dGxlKHVwZGF0ZVBvc2l0aW9uLCAxMDApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHJlbmV3VG9rZW5gIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBidXQgbm90IG1vcmUgdGhhbiBvbmNlIGV2ZXJ5IDUgbWludXRlcy5cbiAqIHZhciB0aHJvdHRsZWQgPSBfLnRocm90dGxlKHJlbmV3VG9rZW4sIDMwMDAwMCwgeyAndHJhaWxpbmcnOiBmYWxzZSB9KTtcbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCB0aHJvdHRsZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgdGhyb3R0bGVkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCB0aHJvdHRsZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGVhZGluZyA9IHRydWUsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICdsZWFkaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLmxlYWRpbmcgOiBsZWFkaW5nO1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cbiAgcmV0dXJuIGRlYm91bmNlKGZ1bmMsIHdhaXQsIHtcbiAgICAnbGVhZGluZyc6IGxlYWRpbmcsXG4gICAgJ21heFdhaXQnOiB3YWl0LFxuICAgICd0cmFpbGluZyc6IHRyYWlsaW5nXG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRocm90dGxlO1xuIiwidmFyIGJhc2VUcmltID0gcmVxdWlyZSgnLi9fYmFzZVRyaW0nKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IGJhc2VUcmltKHZhbHVlKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9OdW1iZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xudmFyIHJlcGxhY2VUZXh0ID0gZnVuY3Rpb24gcmVwbGFjZVRleHQoKSB7XG4gIHZhciB0ZXh0U3RvcmUgPSBbXTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHJlcGxhY2UoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG4gICAgdGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuICAgIHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oXCJcXG5cIik7XG4gIH07XG59KCk7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcbiAgdmFyIGNzcztcbiAgaWYgKHJlbW92ZSkge1xuICAgIGNzcyA9IFwiXCI7XG4gIH0gZWxzZSB7XG4gICAgY3NzID0gXCJcIjtcbiAgICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICAgIH1cbiAgICBpZiAob2JqLm1lZGlhKSB7XG4gICAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgICB9XG4gICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICAgIH1cbiAgICBjc3MgKz0gb2JqLmNzcztcbiAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICBjc3MgKz0gXCJ9XCI7XG4gICAgfVxuICAgIGlmIChvYmoubWVkaWEpIHtcbiAgICAgIGNzcyArPSBcIn1cIjtcbiAgICB9XG4gICAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgICAgY3NzICs9IFwifVwiO1xuICAgIH1cbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuICAgIHZhciBjaGlsZE5vZGVzID0gc3R5bGVFbGVtZW50LmNoaWxkTm9kZXM7XG4gICAgaWYgKGNoaWxkTm9kZXNbaW5kZXhdKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuICAgIH1cbiAgICBpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG4gICAgfVxuICB9XG59XG52YXIgc2luZ2xldG9uRGF0YSA9IHtcbiAgc2luZ2xldG9uOiBudWxsLFxuICBzaW5nbGV0b25Db3VudGVyOiAwXG59O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gIH07XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmLG5vLXVzZS1iZWZvcmUtZGVmaW5lXG4gIHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uRGF0YS5zaW5nbGV0b25Db3VudGVyKys7XG4gIHZhciBzdHlsZUVsZW1lbnQgPVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWYsbm8tdXNlLWJlZm9yZS1kZWZpbmVcbiAgc2luZ2xldG9uRGF0YS5zaW5nbGV0b24gfHwgKFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWYsbm8tdXNlLWJlZm9yZS1kZWZpbmVcbiAgc2luZ2xldG9uRGF0YS5zaW5nbGV0b24gPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIGZhbHNlLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIHRydWUsIG9iaik7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiLy8gR2VuZXJhdGVkIEVTTSB2ZXJzaW9uIG9mIHVhLXBhcnNlci1qc1xuLy8gRE8gTk9UIEVESVQgVEhJUyBGSUxFIVxuLy8gU291cmNlOiAvc3JjL21haW4vdWEtcGFyc2VyLmpzXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLyogVUFQYXJzZXIuanMgdjIuMC4zXG4gICBDb3B5cmlnaHQgwqkgMjAxMi0yMDI1IEZhaXNhbCBTYWxtYW4gPGZAZmFpc2FsbWFuLmNvbT5cbiAgIEFHUEx2MyBMaWNlbnNlICovLypcbiAgIERldGVjdCBCcm93c2VyLCBFbmdpbmUsIE9TLCBDUFUsIGFuZCBEZXZpY2UgdHlwZS9tb2RlbCBmcm9tIFVzZXItQWdlbnQgZGF0YS5cbiAgIFN1cHBvcnRzIGJyb3dzZXIgJiBub2RlLmpzIGVudmlyb25tZW50LiBcbiAgIERlbW8gICA6IGh0dHBzOi8vdWFwYXJzZXIuZGV2XG4gICBTb3VyY2UgOiBodHRwczovL2dpdGh1Yi5jb20vZmFpc2FsbWFuL3VhLXBhcnNlci1qcyAqL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi8gXG4vKiBnbG9iYWxzIHdpbmRvdyAqL1xuXG5cbiAgICBcbiAgICAvLy8vLy8vLy8vLy8vL1xuICAgIC8vIENvbnN0YW50c1xuICAgIC8vLy8vLy8vLy8vLy9cblxuICAgIHZhciBMSUJWRVJTSU9OICA9ICcyLjAuMycsXG4gICAgICAgIFVBX01BWF9MRU5HVEggPSA1MDAsXG4gICAgICAgIFVTRVJfQUdFTlQgID0gJ3VzZXItYWdlbnQnLFxuICAgICAgICBFTVBUWSAgICAgICA9ICcnLFxuICAgICAgICBVTktOT1dOICAgICA9ICc/JyxcblxuICAgICAgICAvLyB0eXBlb2ZcbiAgICAgICAgRlVOQ19UWVBFICAgPSAnZnVuY3Rpb24nLFxuICAgICAgICBVTkRFRl9UWVBFICA9ICd1bmRlZmluZWQnLFxuICAgICAgICBPQkpfVFlQRSAgICA9ICdvYmplY3QnLFxuICAgICAgICBTVFJfVFlQRSAgICA9ICdzdHJpbmcnLFxuXG4gICAgICAgIC8vIHByb3BlcnRpZXNcbiAgICAgICAgVUFfQlJPV1NFUiAgPSAnYnJvd3NlcicsXG4gICAgICAgIFVBX0NQVSAgICAgID0gJ2NwdScsXG4gICAgICAgIFVBX0RFVklDRSAgID0gJ2RldmljZScsXG4gICAgICAgIFVBX0VOR0lORSAgID0gJ2VuZ2luZScsXG4gICAgICAgIFVBX09TICAgICAgID0gJ29zJyxcbiAgICAgICAgVUFfUkVTVUxUICAgPSAncmVzdWx0JyxcbiAgICAgICAgXG4gICAgICAgIE5BTUUgICAgICAgID0gJ25hbWUnLFxuICAgICAgICBUWVBFICAgICAgICA9ICd0eXBlJyxcbiAgICAgICAgVkVORE9SICAgICAgPSAndmVuZG9yJyxcbiAgICAgICAgVkVSU0lPTiAgICAgPSAndmVyc2lvbicsXG4gICAgICAgIEFSQ0hJVEVDVFVSRT0gJ2FyY2hpdGVjdHVyZScsXG4gICAgICAgIE1BSk9SICAgICAgID0gJ21ham9yJyxcbiAgICAgICAgTU9ERUwgICAgICAgPSAnbW9kZWwnLFxuXG4gICAgICAgIC8vIGRldmljZSB0eXBlc1xuICAgICAgICBDT05TT0xFICAgICA9ICdjb25zb2xlJyxcbiAgICAgICAgTU9CSUxFICAgICAgPSAnbW9iaWxlJyxcbiAgICAgICAgVEFCTEVUICAgICAgPSAndGFibGV0JyxcbiAgICAgICAgU01BUlRUViAgICAgPSAnc21hcnR0dicsXG4gICAgICAgIFdFQVJBQkxFICAgID0gJ3dlYXJhYmxlJyxcbiAgICAgICAgWFIgICAgICAgICAgPSAneHInLFxuICAgICAgICBFTUJFRERFRCAgICA9ICdlbWJlZGRlZCcsXG5cbiAgICAgICAgLy8gYnJvd3NlciB0eXBlc1xuICAgICAgICBJTkFQUCAgICAgICA9ICdpbmFwcCcsXG5cbiAgICAgICAgLy8gY2xpZW50IGhpbnRzXG4gICAgICAgIEJSQU5EUyAgICAgID0gJ2JyYW5kcycsXG4gICAgICAgIEZPUk1GQUNUT1JTID0gJ2Zvcm1GYWN0b3JzJyxcbiAgICAgICAgRlVMTFZFUkxJU1QgPSAnZnVsbFZlcnNpb25MaXN0JyxcbiAgICAgICAgUExBVEZPUk0gICAgPSAncGxhdGZvcm0nLFxuICAgICAgICBQTEFURk9STVZFUiA9ICdwbGF0Zm9ybVZlcnNpb24nLFxuICAgICAgICBCSVRORVNTICAgICA9ICdiaXRuZXNzJyxcbiAgICAgICAgQ0hfSEVBREVSICAgPSAnc2VjLWNoLXVhJyxcbiAgICAgICAgQ0hfSEVBREVSX0ZVTExfVkVSX0xJU1QgPSBDSF9IRUFERVIgKyAnLWZ1bGwtdmVyc2lvbi1saXN0JyxcbiAgICAgICAgQ0hfSEVBREVSX0FSQ0ggICAgICA9IENIX0hFQURFUiArICctYXJjaCcsXG4gICAgICAgIENIX0hFQURFUl9CSVRORVNTICAgPSBDSF9IRUFERVIgKyAnLScgKyBCSVRORVNTLFxuICAgICAgICBDSF9IRUFERVJfRk9STV9GQUNUT1JTID0gQ0hfSEVBREVSICsgJy1mb3JtLWZhY3RvcnMnLFxuICAgICAgICBDSF9IRUFERVJfTU9CSUxFICAgID0gQ0hfSEVBREVSICsgJy0nICsgTU9CSUxFLFxuICAgICAgICBDSF9IRUFERVJfTU9ERUwgICAgID0gQ0hfSEVBREVSICsgJy0nICsgTU9ERUwsXG4gICAgICAgIENIX0hFQURFUl9QTEFURk9STSAgPSBDSF9IRUFERVIgKyAnLScgKyBQTEFURk9STSxcbiAgICAgICAgQ0hfSEVBREVSX1BMQVRGT1JNX1ZFUiA9IENIX0hFQURFUl9QTEFURk9STSArICctdmVyc2lvbicsXG4gICAgICAgIENIX0FMTF9WQUxVRVMgICAgICAgPSBbQlJBTkRTLCBGVUxMVkVSTElTVCwgTU9CSUxFLCBNT0RFTCwgUExBVEZPUk0sIFBMQVRGT1JNVkVSLCBBUkNISVRFQ1RVUkUsIEZPUk1GQUNUT1JTLCBCSVRORVNTXSxcblxuICAgICAgICAvLyBkZXZpY2UgdmVuZG9yc1xuICAgICAgICBBTUFaT04gICAgICA9ICdBbWF6b24nLFxuICAgICAgICBBUFBMRSAgICAgICA9ICdBcHBsZScsXG4gICAgICAgIEFTVVMgICAgICAgID0gJ0FTVVMnLFxuICAgICAgICBCTEFDS0JFUlJZICA9ICdCbGFja0JlcnJ5JyxcbiAgICAgICAgR09PR0xFICAgICAgPSAnR29vZ2xlJyxcbiAgICAgICAgSFVBV0VJICAgICAgPSAnSHVhd2VpJyxcbiAgICAgICAgTEVOT1ZPICAgICAgPSAnTGVub3ZvJyxcbiAgICAgICAgSE9OT1IgICAgICAgPSAnSG9ub3InLFxuICAgICAgICBMRyAgICAgICAgICA9ICdMRycsXG4gICAgICAgIE1JQ1JPU09GVCAgID0gJ01pY3Jvc29mdCcsXG4gICAgICAgIE1PVE9ST0xBICAgID0gJ01vdG9yb2xhJyxcbiAgICAgICAgTlZJRElBICAgICAgPSAnTnZpZGlhJyxcbiAgICAgICAgT05FUExVUyAgICAgPSAnT25lUGx1cycsXG4gICAgICAgIE9QUE8gICAgICAgID0gJ09QUE8nLFxuICAgICAgICBTQU1TVU5HICAgICA9ICdTYW1zdW5nJyxcbiAgICAgICAgU0hBUlAgICAgICAgPSAnU2hhcnAnLFxuICAgICAgICBTT05ZICAgICAgICA9ICdTb255JyxcbiAgICAgICAgWElBT01JICAgICAgPSAnWGlhb21pJyxcbiAgICAgICAgWkVCUkEgICAgICAgPSAnWmVicmEnLFxuXG4gICAgICAgIC8vIGJyb3dzZXJzXG4gICAgICAgIENIUk9NRSAgICAgID0gJ0Nocm9tZScsXG4gICAgICAgIENIUk9NSVVNICAgID0gJ0Nocm9taXVtJyxcbiAgICAgICAgQ0hST01FQ0FTVCAgPSAnQ2hyb21lY2FzdCcsXG4gICAgICAgIEVER0UgICAgICAgID0gJ0VkZ2UnLFxuICAgICAgICBGSVJFRk9YICAgICA9ICdGaXJlZm94JyxcbiAgICAgICAgT1BFUkEgICAgICAgPSAnT3BlcmEnLFxuICAgICAgICBGQUNFQk9PSyAgICA9ICdGYWNlYm9vaycsXG4gICAgICAgIFNPR09VICAgICAgID0gJ1NvZ291JyxcblxuICAgICAgICBQUkVGSVhfTU9CSUxFICA9ICdNb2JpbGUgJyxcbiAgICAgICAgU1VGRklYX0JST1dTRVIgPSAnIEJyb3dzZXInLFxuXG4gICAgICAgIC8vIG9zXG4gICAgICAgIFdJTkRPV1MgICAgID0gJ1dpbmRvd3MnO1xuICAgXG4gICAgdmFyIGlzV2luZG93ICAgICAgICAgICAgPSB0eXBlb2Ygd2luZG93ICE9PSBVTkRFRl9UWVBFLFxuICAgICAgICBOQVZJR0FUT1IgICAgICAgICAgID0gKGlzV2luZG93ICYmIHdpbmRvdy5uYXZpZ2F0b3IpID8gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5uYXZpZ2F0b3IgOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICBOQVZJR0FUT1JfVUFEQVRBICAgID0gKE5BVklHQVRPUiAmJiBOQVZJR0FUT1IudXNlckFnZW50RGF0YSkgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTkFWSUdBVE9SLnVzZXJBZ2VudERhdGEgOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgLy8vLy8vLy8vLy9cbiAgICAvLyBIZWxwZXJcbiAgICAvLy8vLy8vLy8vXG5cbiAgICB2YXIgZXh0ZW5kID0gZnVuY3Rpb24gKGRlZmF1bHRSZ3gsIGV4dGVuc2lvbnMpIHtcbiAgICAgICAgICAgIHZhciBtZXJnZWRSZ3ggPSB7fTtcbiAgICAgICAgICAgIHZhciBleHRyYVJneCA9IGV4dGVuc2lvbnM7XG4gICAgICAgICAgICBpZiAoIWlzRXh0ZW5zaW9ucyhleHRlbnNpb25zKSkge1xuICAgICAgICAgICAgICAgIGV4dHJhUmd4ID0ge307XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBleHRlbnNpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gZXh0ZW5zaW9uc1tpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFSZ3hbal0gPSBleHRlbnNpb25zW2ldW2pdLmNvbmNhdChleHRyYVJneFtqXSA/IGV4dHJhUmd4W2pdIDogW10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgayBpbiBkZWZhdWx0Umd4KSB7XG4gICAgICAgICAgICAgICAgbWVyZ2VkUmd4W2tdID0gZXh0cmFSZ3hba10gJiYgZXh0cmFSZ3hba10ubGVuZ3RoICUgMiA9PT0gMCA/IGV4dHJhUmd4W2tdLmNvbmNhdChkZWZhdWx0Umd4W2tdKSA6IGRlZmF1bHRSZ3hba107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2VkUmd4O1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJpemUgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgICAgICB2YXIgZW51bXMgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBlbnVtc1thcnJbaV0udG9VcHBlckNhc2UoKV0gPSBhcnJbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZW51bXM7XG4gICAgICAgIH0sXG4gICAgICAgIGhhcyA9IGZ1bmN0aW9uIChzdHIxLCBzdHIyKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHN0cjEgPT09IE9CSl9UWVBFICYmIHN0cjEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gc3RyMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobG93ZXJpemUoc3RyMVtpXSkgPT0gbG93ZXJpemUoc3RyMikpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaXNTdHJpbmcoc3RyMSkgPyBsb3dlcml6ZShzdHIyKS5pbmRleE9mKGxvd2VyaXplKHN0cjEpKSAhPT0gLTEgOiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgaXNFeHRlbnNpb25zID0gZnVuY3Rpb24gKG9iaiwgZGVlcCkge1xuICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gL14oYnJvd3NlcnxjcHV8ZGV2aWNlfGVuZ2luZXxvcykkLy50ZXN0KHByb3ApIHx8IChkZWVwID8gaXNFeHRlbnNpb25zKG9ialtwcm9wXSkgOiBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGlzU3RyaW5nID0gZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09IFNUUl9UWVBFO1xuICAgICAgICB9LFxuICAgICAgICBpdGVtTGlzdFRvQXJyYXkgPSBmdW5jdGlvbiAoaGVhZGVyKSB7XG4gICAgICAgICAgICBpZiAoIWhlYWRlcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHZhciBhcnIgPSBbXTtcbiAgICAgICAgICAgIHZhciB0b2tlbnMgPSBzdHJpcCgvXFxcXD9cXFwiL2csIGhlYWRlcikuc3BsaXQoJywnKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRva2Vuc1tpXS5pbmRleE9mKCc7JykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSB0cmltKHRva2Vuc1tpXSkuc3BsaXQoJzt2PScpO1xuICAgICAgICAgICAgICAgICAgICBhcnJbaV0gPSB7IGJyYW5kIDogdG9rZW5bMF0sIHZlcnNpb24gOiB0b2tlblsxXSB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFycltpXSA9IHRyaW0odG9rZW5zW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXJyO1xuICAgICAgICB9LFxuICAgICAgICBsb3dlcml6ZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBpc1N0cmluZyhzdHIpID8gc3RyLnRvTG93ZXJDYXNlKCkgOiBzdHI7XG4gICAgICAgIH0sXG4gICAgICAgIG1ham9yaXplID0gZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBpc1N0cmluZyh2ZXJzaW9uKSA/IHN0cmlwKC9bXlxcZFxcLl0vZywgdmVyc2lvbikuc3BsaXQoJy4nKVswXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0UHJvcHMgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGFycikge1xuICAgICAgICAgICAgICAgIHZhciBwcm9wTmFtZSA9IGFycltpXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3BOYW1lID09IE9CSl9UWVBFICYmIHByb3BOYW1lLmxlbmd0aCA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcE5hbWVbMF1dID0gcHJvcE5hbWVbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1twcm9wTmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIHN0cmlwID0gZnVuY3Rpb24gKHBhdHRlcm4sIHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIGlzU3RyaW5nKHN0cikgPyBzdHIucmVwbGFjZShwYXR0ZXJuLCBFTVBUWSkgOiBzdHI7XG4gICAgICAgIH0sXG4gICAgICAgIHN0cmlwUXVvdGVzID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmlwKC9cXFxcP1xcXCIvZywgc3RyKTsgXG4gICAgICAgIH0sXG4gICAgICAgIHRyaW0gPSBmdW5jdGlvbiAoc3RyLCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChpc1N0cmluZyhzdHIpKSB7XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyaXAoL15cXHNcXHMqLywgc3RyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIGxlbiA9PT0gVU5ERUZfVFlQRSA/IHN0ciA6IHN0ci5zdWJzdHJpbmcoMCwgVUFfTUFYX0xFTkdUSCk7XG4gICAgICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIE1hcCBoZWxwZXJcbiAgICAvLy8vLy8vLy8vLy8vL1xuXG4gICAgdmFyIHJneE1hcHBlciA9IGZ1bmN0aW9uICh1YSwgYXJyYXlzKSB7XG5cbiAgICAgICAgICAgIGlmKCF1YSB8fCAhYXJyYXlzKSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciBpID0gMCwgaiwgaywgcCwgcSwgbWF0Y2hlcywgbWF0Y2g7XG5cbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgcmVnZXhlcyBtYXBzXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGFycmF5cy5sZW5ndGggJiYgIW1hdGNoZXMpIHtcblxuICAgICAgICAgICAgICAgIHZhciByZWdleCA9IGFycmF5c1tpXSwgICAgICAgLy8gZXZlbiBzZXF1ZW5jZSAoMCwyLDQsLi4pXG4gICAgICAgICAgICAgICAgICAgIHByb3BzID0gYXJyYXlzW2kgKyAxXTsgICAvLyBvZGQgc2VxdWVuY2UgKDEsMyw1LC4uKVxuICAgICAgICAgICAgICAgIGogPSBrID0gMDtcblxuICAgICAgICAgICAgICAgIC8vIHRyeSBtYXRjaGluZyB1YXN0cmluZyB3aXRoIHJlZ2V4ZXNcbiAgICAgICAgICAgICAgICB3aGlsZSAoaiA8IHJlZ2V4Lmxlbmd0aCAmJiAhbWF0Y2hlcykge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVnZXhbal0pIHsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHJlZ2V4W2orK10uZXhlYyh1YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhbWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChwID0gMDsgcCA8IHByb3BzLmxlbmd0aDsgcCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSBtYXRjaGVzWysra107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcSA9IHByb3BzW3BdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGdpdmVuIHByb3BlcnR5IGlzIGFjdHVhbGx5IGFycmF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBxID09PSBPQkpfVFlQRSAmJiBxLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHEubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHFbMV0gPT0gRlVOQ19UWVBFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXNzaWduIG1vZGlmaWVkIG1hdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txWzBdXSA9IHFbMV0uY2FsbCh0aGlzLCBtYXRjaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFzc2lnbiBnaXZlbiB2YWx1ZSwgaWdub3JlIHJlZ2V4IG1hdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txWzBdXSA9IHFbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocS5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgZnVuY3Rpb24gb3IgcmVnZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcVsxXSA9PT0gRlVOQ19UWVBFICYmICEocVsxXS5leGVjICYmIHFbMV0udGVzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIGZ1bmN0aW9uICh1c3VhbGx5IHN0cmluZyBtYXBwZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txWzBdXSA9IG1hdGNoID8gcVsxXS5jYWxsKHRoaXMsIG1hdGNoLCBxWzJdKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2FuaXRpemUgbWF0Y2ggdXNpbmcgZ2l2ZW4gcmVnZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gbWF0Y2ggPyBtYXRjaC5yZXBsYWNlKHFbMV0sIHFbMl0pIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHEubGVuZ3RoID09PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txWzBdXSA9IG1hdGNoID8gcVszXS5jYWxsKHRoaXMsIG1hdGNoLnJlcGxhY2UocVsxXSwgcVsyXSkpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txXSA9IG1hdGNoID8gbWF0Y2ggOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzdHJNYXBwZXIgPSBmdW5jdGlvbiAoc3RyLCBtYXApIHtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBtYXApIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBjdXJyZW50IHZhbHVlIGlzIGFycmF5XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtYXBbaV0gPT09IE9CSl9UWVBFICYmIG1hcFtpXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbWFwW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzKG1hcFtpXVtqXSwgc3RyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoaSA9PT0gVU5LTk9XTikgPyB1bmRlZmluZWQgOiBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChoYXMobWFwW2ldLCBzdHIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoaSA9PT0gVU5LTk9XTikgPyB1bmRlZmluZWQgOiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtYXAuaGFzT3duUHJvcGVydHkoJyonKSA/IG1hcFsnKiddIDogc3RyO1xuICAgIH07XG5cbiAgICAvLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBTdHJpbmcgbWFwXG4gICAgLy8vLy8vLy8vLy8vLy9cblxuICAgIHZhciB3aW5kb3dzVmVyc2lvbk1hcCA9IHtcbiAgICAgICAgICAgICdNRScgICAgICAgIDogJzQuOTAnLFxuICAgICAgICAgICAgJ05UIDMuMTEnICAgOiAnTlQzLjUxJyxcbiAgICAgICAgICAgICdOVCA0LjAnICAgIDogJ05UNC4wJyxcbiAgICAgICAgICAgICcyMDAwJyAgICAgIDogJ05UIDUuMCcsXG4gICAgICAgICAgICAnWFAnICAgICAgICA6IFsnTlQgNS4xJywgJ05UIDUuMiddLFxuICAgICAgICAgICAgJ1Zpc3RhJyAgICAgOiAnTlQgNi4wJyxcbiAgICAgICAgICAgICc3JyAgICAgICAgIDogJ05UIDYuMScsXG4gICAgICAgICAgICAnOCcgICAgICAgICA6ICdOVCA2LjInLFxuICAgICAgICAgICAgJzguMScgICAgICAgOiAnTlQgNi4zJyxcbiAgICAgICAgICAgICcxMCcgICAgICAgIDogWydOVCA2LjQnLCAnTlQgMTAuMCddLFxuICAgICAgICAgICAgJ1JUJyAgICAgICAgOiAnQVJNJ1xuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgZm9ybUZhY3RvcnNNYXAgPSB7XG4gICAgICAgICAgICAnZW1iZWRkZWQnICA6ICdBdXRvbW90aXZlJyxcbiAgICAgICAgICAgICdtb2JpbGUnICAgIDogJ01vYmlsZScsXG4gICAgICAgICAgICAndGFibGV0JyAgICA6IFsnVGFibGV0JywgJ0VJbmsnXSxcbiAgICAgICAgICAgICdzbWFydHR2JyAgIDogJ1RWJyxcbiAgICAgICAgICAgICd3ZWFyYWJsZScgIDogJ1dhdGNoJyxcbiAgICAgICAgICAgICd4cicgICAgICAgIDogWydWUicsICdYUiddLFxuICAgICAgICAgICAgJz8nICAgICAgICAgOiBbJ0Rlc2t0b3AnLCAnVW5rbm93biddLFxuICAgICAgICAgICAgJyonICAgICAgICAgOiB1bmRlZmluZWRcbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBSZWdleCBtYXBcbiAgICAvLy8vLy8vLy8vLy8vXG5cbiAgICB2YXIgZGVmYXVsdFJlZ2V4ZXMgPSB7XG5cbiAgICAgICAgYnJvd3NlciA6IFtbXG5cbiAgICAgICAgICAgIC8vIE1vc3QgY29tbW9uIHJlZ2FyZGxlc3MgZW5naW5lXG4gICAgICAgICAgICAvXFxiKD86Y3Jtb3xjcmlvcylcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWUgZm9yIEFuZHJvaWQvaU9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIFBSRUZJWF9NT0JJTEUgKyAnQ2hyb21lJ11dLCBbXG4gICAgICAgICAgICAvZWRnKD86ZXxpb3N8YSk/XFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBFZGdlXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdFZGdlJ11dLCBbXG5cbiAgICAgICAgICAgIC8vIFByZXN0byBiYXNlZFxuICAgICAgICAgICAgLyhvcGVyYSBtaW5pKVxcLyhbLVxcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBNaW5pXG4gICAgICAgICAgICAvKG9wZXJhIFttb2JpbGV0YWJdezMsNn0pXFxiLit2ZXJzaW9uXFwvKFstXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAvLyBPcGVyYSBNb2JpL1RhYmxldFxuICAgICAgICAgICAgLyhvcGVyYSkoPzouK3ZlcnNpb25cXC98W1xcLyBdKykoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmFcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL29waW9zW1xcLyBdKyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBtaW5pIG9uIGlwaG9uZSA+PSA4LjBcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgT1BFUkErJyBNaW5pJ11dLCBbXG4gICAgICAgICAgICAvXFxib3AoPzpyZyk/eFxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBHWFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBPUEVSQSsnIEdYJ11dLCBbXG4gICAgICAgICAgICAvXFxib3ByXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBXZWJraXRcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgT1BFUkFdXSwgW1xuXG4gICAgICAgICAgICAvLyBNaXhlZFxuICAgICAgICAgICAgL1xcYmJbYWldKmQoPzp1aGR8W3ViXSpbYWVrb3Byc3d4XXs1LDZ9KVtcXC8gXT8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgLy8gQmFpZHVcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0JhaWR1J11dLCBbXG4gICAgICAgICAgICAvXFxiKD86bXhicm93c2VyfG14aW9zfG15aWUyKVxcLz8oWy1cXHdcXC5dKilcXGIvaSAgICAgICAgICAgICAgICAgICAgICAgLy8gTWF4dGhvblxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnTWF4dGhvbiddXSwgW1xuICAgICAgICAgICAgLyhraW5kbGUpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGVcbiAgICAgICAgICAgIC8obHVuYXNjYXBlfG1heHRob258bmV0ZnJvbnR8amFzbWluZXxibGF6ZXJ8c2xlaXBuaXIpW1xcLyBdPyhbXFx3XFwuXSopL2ksICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEx1bmFzY2FwZS9NYXh0aG9uL05ldGZyb250L0phc21pbmUvQmxhemVyL1NsZWlwbmlyXG4gICAgICAgICAgICAvLyBUcmlkZW50IGJhc2VkXG4gICAgICAgICAgICAvKGF2YW50fGllbW9iaWxlfHNsaW0oPzpicm93c2VyfGJvYXR8amV0KSlbXFwvIF0/KFtcXGRcXC5dKikvaSwgICAgICAgIC8vIEF2YW50L0lFTW9iaWxlL1NsaW1Ccm93c2VyL1NsaW1Cb2F0L1NsaW1qZXRcbiAgICAgICAgICAgIC8oPzptc3xcXCgpKGllKSAoW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW50ZXJuZXQgRXhwbG9yZXJcblxuICAgICAgICAgICAgLy8gQmxpbmsvV2Via2l0L0tIVE1MIGJhc2VkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGbG9jay9Sb2NrTWVsdC9NaWRvcmkvRXBpcGhhbnkvU2lsay9Ta3lmaXJlL0JvbHQvSXJvbi9JcmlkaXVtL1BoYW50b21KUy9Cb3dzZXIvUXVwWmlsbGEvRmFsa29uL0xHIEJyb3dzZXIvT3R0ZXIvcXV0ZWJyb3dzZXIvRG9vYmxlXG4gICAgICAgICAgICAvKGZsb2NrfHJvY2ttZWx0fG1pZG9yaXxlcGlwaGFueXxzaWxrfHNreWZpcmV8b3ZpYnJvd3Nlcnxib2x0fGlyb258dml2YWxkaXxpcmlkaXVtfHBoYW50b21qc3xib3dzZXJ8cXVwemlsbGF8ZmFsa29ufHJla29ucXxwdWZmaW58YnJhdmV8d2hhbGUoPyEuK25hdmVyKXxxcWJyb3dzZXJsaXRlfGR1Y2tkdWNrZ298a2xhcnxoZWxpb3woPz1jb21vZG9fKT9kcmFnb258b3R0ZXJ8ZG9vYmxlfCg/OmxnIHxxdXRlKWJyb3dzZXIpXFwvKFstXFx3XFwuXSspL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJla29ucS9QdWZmaW4vQnJhdmUvV2hhbGUvUVFCcm93c2VyTGl0ZS9RUS8vVml2YWxkaS9EdWNrRHVja0dvL0tsYXIvSGVsaW8vRHJhZ29uXG4gICAgICAgICAgICAvKGhleXRhcHxvdml8MTE1fHN1cmYpYnJvd3NlclxcLyhbXFxkXFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhleVRhcC9PdmkvMTE1L1N1cmZcbiAgICAgICAgICAgIC8oZWNvc2lhfHdlaWJvKSg/Ol9ffCBcXHcrQCkoW1xcZFxcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWNvc2lhL1dlaWJvXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC9xdWFyayg/OnBjKT9cXC8oWy1cXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUXVhcmtcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1F1YXJrJ11dLCBbXG4gICAgICAgICAgICAvXFxiZGRnXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEdWNrRHVja0dvXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdEdWNrRHVja0dvJ11dLCBbXG4gICAgICAgICAgICAvKD86XFxidWM/ID9icm93c2VyfCg/Omp1Yy4rKXVjd2ViKVtcXC8gXT8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAvLyBVQ0Jyb3dzZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1VDQnJvd3NlciddXSwgW1xuICAgICAgICAgICAgL21pY3JvbS4rXFxicWJjb3JlXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2VDaGF0IERlc2t0b3AgZm9yIFdpbmRvd3MgQnVpbHQtaW4gQnJvd3NlclxuICAgICAgICAgICAgL1xcYnFiY29yZVxcLyhbXFx3XFwuXSspLittaWNyb20vaSxcbiAgICAgICAgICAgIC9taWNyb21lc3NlbmdlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2VDaGF0XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdXZUNoYXQnXV0sIFtcbiAgICAgICAgICAgIC9rb25xdWVyb3JcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS29ucXVlcm9yXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdLb25xdWVyb3InXV0sIFtcbiAgICAgICAgICAgIC90cmlkZW50Litydls6IF0oW1xcd1xcLl17MSw5fSlcXGIuK2xpa2UgZ2Vja28vaSAgICAgICAgICAgICAgICAgICAgICAgLy8gSUUxMVxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnSUUnXV0sIFtcbiAgICAgICAgICAgIC95YSg/OnNlYXJjaCk/YnJvd3NlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWWFuZGV4XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdZYW5kZXgnXV0sIFtcbiAgICAgICAgICAgIC9zbGJyb3dzZXJcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU21hcnQgTGVub3ZvIEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1NtYXJ0ICcgKyBMRU5PVk8gKyBTVUZGSVhfQlJPV1NFUl1dLCBbXG4gICAgICAgICAgICAvKGF2YXN0fGF2ZylcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEF2YXN0L0FWRyBTZWN1cmUgQnJvd3NlclxuICAgICAgICAgICAgXSwgW1tOQU1FLCAvKC4rKS8sICckMSBTZWN1cmUnICsgU1VGRklYX0JST1dTRVJdLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL1xcYmZvY3VzXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveCBGb2N1c1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBGSVJFRk9YKycgRm9jdXMnXV0sIFtcbiAgICAgICAgICAgIC9cXGJvcHRcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIFRvdWNoXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIE9QRVJBKycgVG91Y2gnXV0sIFtcbiAgICAgICAgICAgIC9jb2NfY29jXFx3K1xcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvYyBDb2MgQnJvd3NlclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnQ29jIENvYyddXSwgW1xuICAgICAgICAgICAgL2RvbGZpblxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb2xwaGluXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdEb2xwaGluJ11dLCBbXG4gICAgICAgICAgICAvY29hc3RcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIENvYXN0XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIE9QRVJBKycgQ29hc3QnXV0sIFtcbiAgICAgICAgICAgIC9taXVpYnJvd3NlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTUlVSSBCcm93c2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdNSVVJJyArIFNVRkZJWF9CUk9XU0VSXV0sIFtcbiAgICAgICAgICAgIC9meGlvc1xcLyhbXFx3XFwuLV0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveCBmb3IgaU9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIFBSRUZJWF9NT0JJTEUgKyBGSVJFRk9YXV0sIFtcbiAgICAgICAgICAgIC9cXGJxaWhvb2Jyb3dzZXJcXC8/KFtcXHdcXC5dKikvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDM2MFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnMzYwJ11dLCBbXG4gICAgICAgICAgICAvXFxiKHFxKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBRUVxuICAgICAgICAgICAgXSwgW1tOQU1FLCAvKC4rKS8sICckMUJyb3dzZXInXSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8ob2N1bHVzfHNhaWxmaXNofGh1YXdlaXx2aXZvfHBpY28pYnJvd3NlclxcLyhbXFx3XFwuXSspL2lcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgLyguKykvLCAnJDEnICsgU1VGRklYX0JST1dTRVJdLCBWRVJTSU9OXSwgWyAgICAgICAgICAgICAgLy8gT2N1bHVzL1NhaWxmaXNoL0h1YXdlaUJyb3dzZXIvVml2b0Jyb3dzZXIvUGljb0Jyb3dzZXJcbiAgICAgICAgICAgIC9zYW1zdW5nYnJvd3NlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2Ftc3VuZyBJbnRlcm5ldFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBTQU1TVU5HICsgJyBJbnRlcm5ldCddXSwgW1xuICAgICAgICAgICAgL21ldGFzcltcXC8gXT8oW1xcZFxcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb2dvdSBFeHBsb3JlclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBTT0dPVSArICcgRXhwbG9yZXInXV0sIFtcbiAgICAgICAgICAgIC8oc29nb3UpbW9cXHcrXFwvKFtcXGRcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvZ291IE1vYmlsZVxuICAgICAgICAgICAgXSwgW1tOQU1FLCBTT0dPVSArICcgTW9iaWxlJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKGVsZWN0cm9uKVxcLyhbXFx3XFwuXSspIHNhZmFyaS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVsZWN0cm9uLWJhc2VkIEFwcFxuICAgICAgICAgICAgLyh0ZXNsYSkoPzogcXRjYXJicm93c2VyfFxcLygyMFxcZFxcZFxcLlstXFx3XFwuXSspKS9pLCAgICAgICAgICAgICAgICAgICAvLyBUZXNsYVxuICAgICAgICAgICAgL20/KHFxYnJvd3NlcnwyMzQ1KD89YnJvd3NlcnxjaHJvbWV8ZXhwbG9yZXIpKVxcdypbXFwvIF0/dj8oW1xcd1xcLl0rKS9pICAgLy8gUVEvMjM0NVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKGxiYnJvd3NlcnxyZWtvbnEpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExpZUJhbyBCcm93c2VyL1Jla29ucVxuICAgICAgICAgICAgXSwgW05BTUVdLCBbXG4gICAgICAgICAgICAvb21lXFwvKFtcXHdcXC5dKykgXFx3KiA/KGlyb24pIHNhZi9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJcm9uXG4gICAgICAgICAgICAvb21lXFwvKFtcXHdcXC5dKykuK3FpaHUgKDM2MClbZXNdZS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDM2MFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIE5BTUVdLCBbXG5cbiAgICAgICAgICAgIC8vIFdlYlZpZXdcbiAgICAgICAgICAgIC8oKD86ZmJhblxcL2ZiaW9zfGZiX2lhYlxcL2ZiNGEpKD8hLitmYmF2KXw7ZmJhdlxcLyhbXFx3XFwuXSspOykvaSAgICAgICAvLyBGYWNlYm9vayBBcHAgZm9yIGlPUyAmIEFuZHJvaWRcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgRkFDRUJPT0tdLCBWRVJTSU9OLCBbVFlQRSwgSU5BUFBdXSwgW1xuICAgICAgICAgICAgLyhLbGFybmEpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLbGFybmEgU2hvcHBpbmcgQnJvd3NlciBmb3IgaU9TICYgQW5kcm9pZFxuICAgICAgICAgICAgLyhrYWthbyg/OnRhbGt8c3RvcnkpKVtcXC8gXShbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLYWthbyBBcHBcbiAgICAgICAgICAgIC8obmF2ZXIpXFwoLio/KFxcZCtcXC5bXFx3XFwuXSspLipcXCkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmF2ZXIgSW5BcHBcbiAgICAgICAgICAgIC8oZGF1bSlhcHBzW1xcLyBdKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGF1bSBBcHBcbiAgICAgICAgICAgIC9zYWZhcmkgKGxpbmUpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGluZSBBcHAgZm9yIGlPU1xuICAgICAgICAgICAgL1xcYihsaW5lKVxcLyhbXFx3XFwuXSspXFwvaWFiL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExpbmUgQXBwIGZvciBBbmRyb2lkXG4gICAgICAgICAgICAvKGFsaXBheSljbGllbnRcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFsaXBheVxuICAgICAgICAgICAgLyh0d2l0dGVyKSg/OmFuZHwgZi4rZVxcLyhbXFx3XFwuXSspKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUd2l0dGVyXG4gICAgICAgICAgICAvKGluc3RhZ3JhbXxzbmFwY2hhdClbXFwvIF0oWy1cXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEluc3RhZ3JhbS9TbmFwY2hhdFxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT04sIFtUWVBFLCBJTkFQUF1dLCBbXG4gICAgICAgICAgICAvXFxiZ3NhXFwvKFtcXHdcXC5dKykgLipzYWZhcmlcXC8vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIFNlYXJjaCBBcHBsaWFuY2Ugb24gaU9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdHU0EnXSwgW1RZUEUsIElOQVBQXV0sIFtcbiAgICAgICAgICAgIC9tdXNpY2FsX2x5KD86LithcHBfP3ZlcnNpb25cXC98XykoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGlrVG9rXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdUaWtUb2snXSwgW1RZUEUsIElOQVBQXV0sIFtcbiAgICAgICAgICAgIC9cXFsobGlua2VkaW4pYXBwXFxdL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW5rZWRJbiBBcHAgZm9yIGlPUyAmIEFuZHJvaWRcbiAgICAgICAgICAgIF0sIFtOQU1FLCBbVFlQRSwgSU5BUFBdXSwgW1xuXG4gICAgICAgICAgICAvKGNocm9taXVtKVtcXC8gXShbLVxcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENocm9taXVtXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL2hlYWRsZXNzY2hyb21lKD86XFwvKFtcXHdcXC5dKyl8ICkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWUgSGVhZGxlc3NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgQ0hST01FKycgSGVhZGxlc3MnXV0sIFtcblxuICAgICAgICAgICAgLyB3dlxcKS4rKGNocm9tZSlcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lIFdlYlZpZXdcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgQ0hST01FKycgV2ViVmlldyddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvZHJvaWQuKyB2ZXJzaW9uXFwvKFtcXHdcXC5dKylcXGIuKyg/Om1vYmlsZSBzYWZhcml8c2FmYXJpKS9pICAgICAgICAgICAvLyBBbmRyb2lkIEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0FuZHJvaWQnICsgU1VGRklYX0JST1dTRVJdXSwgW1xuXG4gICAgICAgICAgICAvY2hyb21lXFwvKFtcXHdcXC5dKykgbW9iaWxlL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENocm9tZSBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgUFJFRklYX01PQklMRSArICdDaHJvbWUnXV0sIFtcblxuICAgICAgICAgICAgLyhjaHJvbWV8b21uaXdlYnxhcm9yYXxbdGl6ZW5va2FdezV9ID9icm93c2VyKVxcL3Y/KFtcXHdcXC5dKykvaSAgICAgICAvLyBDaHJvbWUvT21uaVdlYi9Bcm9yYS9UaXplbi9Ob2tpYVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC92ZXJzaW9uXFwvKFtcXHdcXC5cXCxdKykgLiptb2JpbGUoPzpcXC9cXHcrIHwgPylzYWZhcmkvaSAgICAgICAgICAgICAgICAgLy8gU2FmYXJpIE1vYmlsZVxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBQUkVGSVhfTU9CSUxFICsgJ1NhZmFyaSddXSwgW1xuICAgICAgICAgICAgL2lwaG9uZSAuKm1vYmlsZSg/OlxcL1xcdysgfCA/KXNhZmFyaS9pXG4gICAgICAgICAgICBdLCBbW05BTUUsIFBSRUZJWF9NT0JJTEUgKyAnU2FmYXJpJ11dLCBbXG4gICAgICAgICAgICAvdmVyc2lvblxcLyhbXFx3XFwuXFwsXSspIC4qKHNhZmFyaSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmlcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBOQU1FXSwgW1xuICAgICAgICAgICAgL3dlYmtpdC4rPyhtb2JpbGUgP3NhZmFyaXxzYWZhcmkpKFxcL1tcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgPCAzLjBcbiAgICAgICAgICAgIF0sIFtOQU1FLCBbVkVSU0lPTiwgJzEnXV0sIFtcblxuICAgICAgICAgICAgLyh3ZWJraXR8a2h0bWwpXFwvKFtcXHdcXC5dKykvaVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8vIEdlY2tvIGJhc2VkXG4gICAgICAgICAgICAvKD86bW9iaWxlfHRhYmxldCk7LiooZmlyZWZveClcXC8oW1xcd1xcLi1dKykvaSAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3ggTW9iaWxlXG4gICAgICAgICAgICBdLCBbW05BTUUsIFBSRUZJWF9NT0JJTEUgKyBGSVJFRk9YXSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8obmF2aWdhdG9yfG5ldHNjYXBlXFxkPylcXC8oWy1cXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5ldHNjYXBlXG4gICAgICAgICAgICBdLCBbW05BTUUsICdOZXRzY2FwZSddLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLyh3b2x2aWN8bGlicmV3b2xmKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXb2x2aWMvTGlicmVXb2xmXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC9tb2JpbGUgdnI7IHJ2OihbXFx3XFwuXSspXFwpLitmaXJlZm94L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveCBSZWFsaXR5XG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIEZJUkVGT1grJyBSZWFsaXR5J11dLCBbXG4gICAgICAgICAgICAvZWtpb2hmLisoZmxvdylcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZsb3dcbiAgICAgICAgICAgIC8oc3dpZnRmb3gpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3dpZnRmb3hcbiAgICAgICAgICAgIC8oaWNlZHJhZ29ufGljZXdlYXNlbHxjYW1pbm98Y2hpbWVyYXxmZW5uZWN8bWFlbW8gYnJvd3NlcnxtaW5pbW98Y29ua2Vyb3IpW1xcLyBdPyhbXFx3XFwuXFwrXSspL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEljZURyYWdvbi9JY2V3ZWFzZWwvQ2FtaW5vL0NoaW1lcmEvRmVubmVjL01hZW1vL01pbmltby9Db25rZXJvclxuICAgICAgICAgICAgLyhzZWFtb25rZXl8ay1tZWxlb258aWNlY2F0fGljZWFwZXxmaXJlYmlyZHxwaG9lbml4fHBhbGVtb29ufGJhc2lsaXNrfHdhdGVyZm94KVxcLyhbLVxcd1xcLl0rKSQvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveC9TZWFNb25rZXkvSy1NZWxlb24vSWNlQ2F0L0ljZUFwZS9GaXJlYmlyZC9QaG9lbml4XG4gICAgICAgICAgICAvKGZpcmVmb3gpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE90aGVyIEZpcmVmb3gtYmFzZWRcbiAgICAgICAgICAgIC8obW96aWxsYSlcXC8oW1xcd1xcLl0rKSAuK3J2XFw6LitnZWNrb1xcL1xcZCsvaSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTW96aWxsYVxuXG4gICAgICAgICAgICAvLyBPdGhlclxuICAgICAgICAgICAgLyhhbWF5YXxkaWxsb3xkb3Jpc3xpY2FifGxhZHliaXJkfGx5bnh8bW9zYWljfG5ldHN1cmZ8b2JpZ298cG9sYXJpc3x3M218KD86Z298aWNlfHVwKVtcXC4gXT9icm93c2VyKVstXFwvIF0/dj8oW1xcd1xcLl0rKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQb2xhcmlzL0x5bngvRGlsbG8vaUNhYi9Eb3Jpcy9BbWF5YS93M20vTmV0U3VyZi9PYmlnby9Nb3NhaWMvR28vSUNFL1VQLkJyb3dzZXIvTGFkeWJpcmRcbiAgICAgICAgICAgIC9cXGIobGlua3MpIFxcKChbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExpbmtzXG4gICAgICAgICAgICBdLCBbTkFNRSwgW1ZFUlNJT04sIC9fL2csICcuJ11dLCBbXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8oY29iYWx0KVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29iYWx0XG4gICAgICAgICAgICBdLCBbTkFNRSwgW1ZFUlNJT04sIC9bXlxcZFxcLl0rLi8sIEVNUFRZXV1cbiAgICAgICAgXSxcblxuICAgICAgICBjcHUgOiBbW1xuXG4gICAgICAgICAgICAvXFxiKChhbWR8eHx4ODZbLV9dP3x3b3d8d2luKTY0KVxcYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQU1ENjQgKHg2NClcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCAnYW1kNjQnXV0sIFtcblxuICAgICAgICAgICAgLyhpYTMyKD89OykpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJQTMyIChxdWlja3RpbWUpXG4gICAgICAgICAgICAvXFxiKChpWzM0Nl18eCk4NikocGMpP1xcYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUEzMiAoeDg2KVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdpYTMyJ11dLCBbXG5cbiAgICAgICAgICAgIC9cXGIoYWFyY2g2NHxhcm0odj9bODldZT9sP3xfPzY0KSlcXGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUk02NFxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdhcm02NCddXSwgW1xuXG4gICAgICAgICAgICAvXFxiKGFybSh2WzY3XSk/aHQ/bj9bZmxdcD8pXFxiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJNSEZcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCAnYXJtaGYnXV0sIFtcblxuICAgICAgICAgICAgLy8gUG9ja2V0UEMgbWlzdGFrZW5seSBpZGVudGlmaWVkIGFzIFBvd2VyUENcbiAgICAgICAgICAgIC8oIChjZXxtb2JpbGUpOyBwcGM7fFxcL1tcXHdcXC5dK2FybVxcYikvaVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdhcm0nXV0sIFtcblxuICAgICAgICAgICAgLygocHBjfHBvd2VycGMpKDY0KT8pKCBtYWN8O3xcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUG93ZXJQQ1xuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsIC9vd2VyLywgRU1QVFksIGxvd2VyaXplXV0sIFtcblxuICAgICAgICAgICAgLyBzdW40XFx3WztcXCldL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNQQVJDXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ3NwYXJjJ11dLCBbXG5cbiAgICAgICAgICAgIC9cXGIoYXZyMzJ8aWE2NCg/PTspfDY4ayg/PVxcKSl8XFxiYXJtKD89dihbMS03XXxbNS03XTEpbD98O3xlYWJpKXwoaXJpeHxtaXBzfHNwYXJjKSg2NCk/XFxifHBhLXJpc2MpL2lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUE2NCwgNjhLLCBBUk0vNjQsIEFWUi8zMiwgSVJJWC82NCwgTUlQUy82NCwgU1BBUkMvNjQsIFBBLVJJU0NcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCBsb3dlcml6ZV1dXG4gICAgICAgIF0sXG5cbiAgICAgICAgZGV2aWNlIDogW1tcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIE1PQklMRVMgJiBUQUJMRVRTXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8vIFNhbXN1bmdcbiAgICAgICAgICAgIC9cXGIoc2NoLWlbODldMFxcZHxzaHctbTM4MHN8c20tW3B0eF1cXHd7Miw0fXxndC1bcG5dXFxkezIsNH18c2doLXQ4WzU2XTl8bmV4dXMgMTApL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU0FNU1VOR10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL1xcYigoPzpzW2NncF1ofGd0fHNtKS0oPyFbbHJdKVxcdyt8c2NbZy1dP1tcXGRdK2E/fGdhbGF4eSBuZXh1cykvaSxcbiAgICAgICAgICAgIC9zYW1zdW5nWy0gXSgoPyFzbS1bbHJdKVstXFx3XSspL2ksXG4gICAgICAgICAgICAvc2VjLShzZ2hcXHcrKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNBTVNVTkddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gQXBwbGVcbiAgICAgICAgICAgIC8oPzpcXC98XFwoKShpcCg/OmhvbmV8b2QpW1xcdywgXSopKD86XFwvfDspL2kgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlQb2QvaVBob25lXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFQUExFXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFwoKGlwYWQpO1stXFx3XFwpLDsgXSthcHBsZS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlQYWRcbiAgICAgICAgICAgIC9hcHBsZWNvcmVtZWRpYVxcL1tcXHdcXC5dKyBcXCgoaXBhZCkvaSxcbiAgICAgICAgICAgIC9cXGIoaXBhZClcXGRcXGQ/LFxcZFxcZD9bO1xcXV0uK2lvcy9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFQUExFXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKG1hY2ludG9zaCk7L2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVBQTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBTaGFycFxuICAgICAgICAgICAgL1xcYihzaC0/W2FsdHZ6XT9cXGRcXGRbYS1la21dPykvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTSEFSUF0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBIb25vclxuICAgICAgICAgICAgL1xcYigoPzpicnR8ZWxufGhleTI/fGdkaXxqZG4pLWE/W2xud10wOXwoPzphZ1tybV0zP3xqZG4yfGtvYjIpLWE/W2x3XTBbMDldaG4pKD86IGJ1aXxcXCl8OykvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBIT05PUl0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL2hvbm9yKFstXFx3IF0rKVs7XFwpXS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEhPTk9SXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEh1YXdlaVxuICAgICAgICAgICAgL1xcYigoPzphZ1tyc11bMjM1Nl0/az98YmFoWzIzNF0/fGJnWzJvXXxidFtrdl18Y21yfGNwbnxkYltyeV0yP3xqZG4yfGdvdHxrb2IyP2s/fG1vbnxwY2V8c2NtfHNodD98W3R3XWdyfHZyZCktW2FkXT9bbHddWzAxMjVdWzA5XWI/fDYwNWh3fGJnMi11MDN8KD86Z2VtfGZkcnxtMnxwbGV8dDEpLVs3YV0wWzEtNF1bbHVdfHQxLWEyWzEzXVtsd118bWVkaWFwYWRbXFx3XFwuIF0qKD89IGJ1aXxcXCkpKVxcYig/IS4rZFxcL3MpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgSFVBV0VJXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKD86aHVhd2VpKShbLVxcdyBdKylbO1xcKV0vaSxcbiAgICAgICAgICAgIC9cXGIobmV4dXMgNnB8XFx3ezIsNH1lPy1bYXR1XT9bbG5dW1xcZHhdWzAxMjM1OWNdW2Fkbl0/KVxcYig/IS4rZFxcL3MpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgSFVBV0VJXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIFhpYW9taVxuICAgICAgICAgICAgL29pZFteXFwpXSs7ICgyW1xcZGJjXXs0fSgxODJ8MjgzfHJwXFx3ezJ9KVtjZ2xdfG0yMTA1azgxYT9jKSg/OiBidWl8XFwpKS9pLFxuICAgICAgICAgICAgL1xcYigoPzpyZWQpP21pWy1fIF0/cGFkW1xcdy0gXSopKD86IGJ1aXxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pIFBhZCB0YWJsZXRzXG4gICAgICAgICAgICBdLFtbTU9ERUwsIC9fL2csICcgJ10sIFtWRU5ET1IsIFhJQU9NSV0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvXFxiKHBvY29bXFx3IF0rfG0yXFxkezN9alxcZFxcZFthLXpdezJ9KSg/OiBidWl8XFwpKS9pLCAgICAgICAgICAgICAgICAgIC8vIFhpYW9taSBQT0NPXG4gICAgICAgICAgICAvXFxiOyAoXFx3KykgYnVpbGRcXC9obVxcMS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBYaWFvbWkgSG9uZ21pICdudW1lcmljJyBtb2RlbHNcbiAgICAgICAgICAgIC9cXGIoaG1bLV8gXT9ub3RlP1tfIF0/KD86XFxkXFx3KT8pIGJ1aS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWGlhb21pIEhvbmdtaVxuICAgICAgICAgICAgL1xcYihyZWRtaVtcXC1fIF0/KD86bm90ZXxrKT9bXFx3XyBdKykoPzogYnVpfFxcKSkvaSwgICAgICAgICAgICAgICAgICAgLy8gWGlhb21pIFJlZG1pXG4gICAgICAgICAgICAvb2lkW15cXCldKzsgKG0/WzEyXVswLTM4OV1bMDFdXFx3ezMsNn1bYy15XSkoIGJ1aXw7IHd2fFxcKSkvaSwgICAgICAgIC8vIFhpYW9taSBSZWRtaSAnbnVtZXJpYycgbW9kZWxzXG4gICAgICAgICAgICAvXFxiKG1pWy1fIF0/KD86YVxcZHxvbmV8b25lW18gXXBsdXN8bm90ZSBsdGV8bWF4fGNjKT9bXyBdPyg/OlxcZD9cXHc/KVtfIF0/KD86cGx1c3xzZXxsaXRlfHBybyk/KSg/OiBidWl8XFwpKS9pLCAvLyBYaWFvbWkgTWlcbiAgICAgICAgICAgIC8gKFtcXHcgXSspIG1pdWlcXC92P1xcZC9pXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvXy9nLCAnICddLCBbVkVORE9SLCBYSUFPTUldLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gT1BQT1xuICAgICAgICAgICAgLzsgKFxcdyspIGJ1aS4rIG9wcG8vaSxcbiAgICAgICAgICAgIC9cXGIoY3BoWzEyXVxcZHszfXxwKD86YWZ8Y1thbF18ZFxcd3xlW2FyXSlbbXRdXFxkMHx4OTAwN3xhMTAxb3ApXFxiL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgT1BQT10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcYihvcGQyKFxcZHszfWE/KSkoPzogYnVpfFxcKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBzdHJNYXBwZXIsIHsgJ09uZVBsdXMnIDogWyczMDQnLCAnNDAzJywgJzIwMyddLCAnKicgOiBPUFBPIH1dLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy8gQkxVIFZpdm8gU2VyaWVzXG4gICAgICAgICAgICAvKHZpdm8gKDVyP3w2fDhsP3xnb3xvbmV8c3x4W2lsXT9bMi00XT8pW1xcd1xcKyBdKikoPzogYnVpfFxcKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnQkxVJ10sIFtUWVBFLCBNT0JJTEVdXSwgWyAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gVml2b1xuICAgICAgICAgICAgLzsgdml2byAoXFx3KykoPzogYnVpfFxcKSkvaSxcbiAgICAgICAgICAgIC9cXGIodlsxMl1cXGR7M31cXHc/W2F0XSkoPzogYnVpfDspL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1Zpdm8nXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIFJlYWxtZVxuICAgICAgICAgICAgL1xcYihybXhbMS0zXVxcZHszfSkoPzogYnVpfDt8XFwpKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdSZWFsbWUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1vdG9yb2xhXG4gICAgICAgICAgICAvXFxiKG1pbGVzdG9uZXxkcm9pZCg/OlsyLTR4XXwgKD86YmlvbmljfHgyfHByb3xyYXpyKSk/Oj8oIDRnKT8pXFxiW1xcdyBdK2J1aWxkXFwvL2ksXG4gICAgICAgICAgICAvXFxibW90KD86b3JvbGEpP1stIF0oXFx3KikvaSxcbiAgICAgICAgICAgIC8oKD86bW90byg/ISAzNjApW1xcd1xcKFxcKSBdK3x4dFxcZHszLDR9fG5leHVzIDYpKD89IGJ1aXxcXCkpKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIE1PVE9ST0xBXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFxiKG16NjBcXGR8eG9vbVsyIF17MCwyfSkgYnVpbGRcXC8vaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBNT1RPUk9MQV0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvLyBMR1xuICAgICAgICAgICAgLygoPz1sZyk/W3ZsXWtcXC0/XFxkezN9KSBidWl8IDNcXC5bLVxcdzsgXXsxMH1sZz8tKFswNmN2OV17Myw0fSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBMR10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhsbSg/Oi0/ZjEwMFtudl0/fC1bXFx3XFwuXSspKD89IGJ1aXxcXCkpfG5leHVzIFs0NV0pL2ksXG4gICAgICAgICAgICAvXFxibGdbLWU7XFwvIF0rKD8hLiooPzpicm93c2VyfG5ldGNhc3R8YW5kcm9pZCB0dnx3YXRjaCkpKFxcdyspL2ksXG4gICAgICAgICAgICAvXFxibGctPyhbXFxkXFx3XSspIGJ1aS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIExHXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIExlbm92b1xuICAgICAgICAgICAgLyhpZGVhdGFiWy1cXHcgXSt8NjAybHZ8ZC00MmF8YTEwMWx2fGEyMTA5YXxhMzUwMC1odnxzWzU2XTAwMHxwYi02NTA1W215XXx0Yi0/eD9cXGR7Myw0fSg/OmZbY3VdfHh1fFthdl0pfHl0XFxkPy1banhdP1xcZCtbbGZteF0pKCBidWl8O3xcXCl8XFwvKS9pLFxuICAgICAgICAgICAgL2xlbm92byA/KGJbNjhdMFswOF0wLT9baGZdP3x0YWIoPzpbXFx3LSBdKz8pfHRiW1xcdy1dezYsN30pKCBidWl8O3xcXCl8XFwvKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIExFTk9WT10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvLyBOb2tpYVxuICAgICAgICAgICAgLyhub2tpYSkgKHRbMTJdWzAxXSkvaVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyg/Om1hZW1vfG5va2lhKS4qKG45MDB8bHVtaWEgXFxkK3xybS1cXGQrKS9pLFxuICAgICAgICAgICAgL25va2lhWy1fIF0/KChbLVxcd1xcLiBdKikpL2lcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIC9fL2csICcgJ10sIFtUWVBFLCBNT0JJTEVdLCBbVkVORE9SLCAnTm9raWEnXV0sIFtcblxuICAgICAgICAgICAgLy8gR29vZ2xlXG4gICAgICAgICAgICAvKHBpeGVsIChjfHRhYmxldCkpXFxiL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgUGl4ZWwgQy9UYWJsZXRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgR09PR0xFXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvZHJvaWQuKzsgKHBpeGVsW1xcZGF4bCBdezAsNn0pKD86IGJ1aXxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIFBpeGVsXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEdPT0dMRV0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBTb255XG4gICAgICAgICAgICAvZHJvaWQuKzsgKGE/XFxkWzAtMl17Mn1zb3xbYy1nXVxcZHs0fXxzb1stZ2xdXFx3K3x4cS1hXFx3WzQtN11bMTJdKSg/PSBidWl8XFwpLitjaHJvbWVcXC8oPyFbMS02XXswLDF9XFxkXFwuKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTT05ZXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvc29ueSB0YWJsZXQgW3BzXS9pLFxuICAgICAgICAgICAgL1xcYig/OnNvbnkpP3NncFxcdysoPzogYnVpfFxcKSkvaVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgJ1hwZXJpYSBUYWJsZXQnXSwgW1ZFTkRPUiwgU09OWV0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvLyBPbmVQbHVzXG4gICAgICAgICAgICAvIChrYjIwMDV8aW4yMFsxMl01fGJlMjBbMTJdWzU5XSlcXGIvaSxcbiAgICAgICAgICAgIC8oPzpvbmUpPyg/OnBsdXMpPyAoYVxcZDBcXGRcXGQpKD86IGJ8XFwpKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIE9ORVBMVVNdLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gQW1hem9uXG4gICAgICAgICAgICAvKGFsZXhhKXdlYm0vaSxcbiAgICAgICAgICAgIC8oa2ZbYS16XXsyfXdpfGFlbyg/IWJjKVxcd1xcdykoIGJ1aXxcXCkpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2luZGxlIEZpcmUgd2l0aG91dCBTaWxrIC8gRWNobyBTaG93XG4gICAgICAgICAgICAvKGtmW2Etel0rKSggYnVpfFxcKSkuK3NpbGtcXC8vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2luZGxlIEZpcmUgSERcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQU1BWk9OXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKCg/OnNkfGtmKVswMzQ5aGlqb3JzdHV3XSspKCBidWl8XFwpKS4rc2lsa1xcLy9pICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZSBQaG9uZVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgLyguKykvZywgJ0ZpcmUgUGhvbmUgJDEnXSwgW1ZFTkRPUiwgQU1BWk9OXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEJsYWNrQmVycnlcbiAgICAgICAgICAgIC8ocGxheWJvb2spO1stXFx3XFwpLDsgXSsocmltKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja0JlcnJ5IFBsYXlCb29rXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFZFTkRPUiwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvXFxiKCg/OmJiW2EtZl18c3RbaHZdKTEwMC1cXGQpL2ksXG4gICAgICAgICAgICAvXFwoYmIxMDsgKFxcdyspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxhY2tCZXJyeSAxMFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBCTEFDS0JFUlJZXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIEFzdXNcbiAgICAgICAgICAgIC8oPzpcXGJ8YXN1c18pKHRyYW5zZm9bcHJpbWUgXXs0LDEwfSBcXHcrfGVlZXBjfHNsaWRlciBcXHcrfG5leHVzIDd8cGFkZm9uZXxwMDBbY2pdKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFTVVNdLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8gKHpbYmVzXTZbMDI3XVswMTJdW2ttXVtsc118emVuZm9uZSBcXGRcXHc/KVxcYi9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFTVVNdLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gSFRDXG4gICAgICAgICAgICAvKG5leHVzIDkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhUQyBOZXh1cyA5XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdIVEMnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKGh0YylbLTtfIF17MSwyfShbXFx3IF0rKD89XFwpfCBidWkpfFxcdyspL2ksICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhUQ1xuXG4gICAgICAgICAgICAvLyBaVEVcbiAgICAgICAgICAgIC8oenRlKVstIF0oW1xcdyBdKz8pKD86IGJ1aXxcXC98XFwpKS9pLFxuICAgICAgICAgICAgLyhhbGNhdGVsfGdlZWtzcGhvbmV8bmV4aWFufHBhbmFzb25pYyg/ISg/Ojt8XFwuKSl8c29ueSg/IS1icmEpKVstXyBdPyhbLVxcd10qKS9pICAgICAgICAgLy8gQWxjYXRlbC9HZWVrc1Bob25lL05leGlhbi9QYW5hc29uaWMvU29ueVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgW01PREVMLCAvXy9nLCAnICddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gVENMXG4gICAgICAgICAgICAvdGNsICh4ZXNzIHAxN2FhKS9pLFxuICAgICAgICAgICAgL2Ryb2lkIFtcXHdcXC5dKzsgKCg/OjhbMTRdOVsxNl18OSg/OjAoPzo0OHw2MHw4WzAxXSl8MSg/OjNbMjddfDY2KXwyKD86Nls2OV18OVs1Nl0pfDQ2NikpW2dxc3d4XSkoX1xcdyhcXHd8XFx3XFx3KSk/KFxcKXwgYnVpKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdUQ0wnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvZHJvaWQgW1xcd1xcLl0rOyAoNDE4KD86N2R8OHYpfDUwODd6fDUxMDJsfDYxKD86MDJbZGhdfDI1W2FkZmhdfDI3W2FpXXw1NltkaF18NTlrfDY1W2FoXSl8YTUwOWRsfHQoPzo0Myg/OjB3fDFbYWRlcHF1XSl8NTAoPzo2ZHw3W2FkanVdKXw2KD86MDlkbHwxMGt8MTJifDcxW2VmaG9dfDc2W2hqa10pfDcoPzo2NlthaGp1XXw2N1tod118N1swNDVdW2JoXXw3MVtoa118NzNvfDc2W2hvXXw3OXd8ODFbaGtzXT98ODJofDkwW2Joc3ldfDk5Yil8ODEwW2hzXSkpKF9cXHcoXFx3fFxcd1xcdykpPyhcXCl8IGJ1aSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnVENMJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBpdGVsXG4gICAgICAgICAgICAvKGl0ZWwpICgoXFx3KykpL2lcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCBsb3dlcml6ZV0sIE1PREVMLCBbVFlQRSwgc3RyTWFwcGVyLCB7ICd0YWJsZXQnIDogWydwMTAwMDFsJywgJ3c3MDAxJ10sICcqJyA6ICdtb2JpbGUnIH1dXSwgW1xuXG4gICAgICAgICAgICAvLyBBY2VyXG4gICAgICAgICAgICAvZHJvaWQuKzsgKFthYl1bMS03XS0/WzAxNzhhXVxcZFxcZD8pL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0FjZXInXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1laXp1XG4gICAgICAgICAgICAvZHJvaWQuKzsgKG1bMS01XSBub3RlKSBidWkvaSxcbiAgICAgICAgICAgIC9cXGJtei0oWy1cXHddezIsfSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTWVpenUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBVbGVmb25lXG4gICAgICAgICAgICAvOyAoKD86cG93ZXIgKT9hcm1vcig/OltcXHcgXXswLDh9KSkoPzogYnVpfFxcKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnVWxlZm9uZSddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gRW5lcmdpemVyXG4gICAgICAgICAgICAvOyAoZW5lcmd5ID9cXHcrKSg/OiBidWl8XFwpKS9pLFxuICAgICAgICAgICAgLzsgZW5lcmdpemVyIChbXFx3IF0rKSg/OiBidWl8XFwpKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdFbmVyZ2l6ZXInXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIENhdFxuICAgICAgICAgICAgLzsgY2F0IChiMzUpOy9pLFxuICAgICAgICAgICAgLzsgKGIxNXE/fHMyMiBmbGlwfHM0OGN8czYyIHBybykoPzogYnVpfFxcKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnQ2F0J10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBTbWFydGZyZW5cbiAgICAgICAgICAgIC8oKD86bmV3ICk/YW5kcm9tYXhbXFx3LSBdKykoPzogYnVpfFxcKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnU21hcnRmcmVuJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvLyBOb3RoaW5nXG4gICAgICAgICAgICAvZHJvaWQuKzsgKGEoPzowMTV8MDZbMzVdfDE0MnA/KSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTm90aGluZyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8gQXJjaG9zXG4gICAgICAgICAgICAvOyAoeDY3IDVnfHRpa2Vhc3kgXFx3K3xhY1sxNzg5XVxcZFxcdyspKCBifFxcKSkvaSxcbiAgICAgICAgICAgIC9hcmNob3MgPyg1fGdhbWVwYWQyP3woW1xcdyBdKlt0MTc4OV18aGVsbG8pID9cXGQrW1xcdyBdKikoIGJ8XFwpKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdBcmNob3MnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvYXJjaG9zIChbXFx3IF0rKSggYnxcXCkpL2ksXG4gICAgICAgICAgICAvOyAoYWNbMy02XVxcZFxcd3syLDh9KSggYnxcXCkpL2kgXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdBcmNob3MnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vIE1JWEVEXG4gICAgICAgICAgICAvKGltbykgKHRhYiBcXHcrKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJTU9cbiAgICAgICAgICAgIC8oaW5maW5peCkgKHgxMTAxYj8pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW5maW5peCBYUGFkXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8oYmxhY2tiZXJyeXxiZW5xfHBhbG0oPz1cXC0pfHNvbnllcmljc3NvbnxhY2VyfGFzdXMoPyEgemVudyl8ZGVsbHxqb2xsYXxtZWl6dXxtb3Rvcm9sYXxwb2x5dHJvbnxpbmZpbml4fHRlY25vfG1pY3JvbWF4fGFkdmFuKVstXyBdPyhbLVxcd10qKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja0JlcnJ5L0JlblEvUGFsbS9Tb255LUVyaWNzc29uL0FjZXIvQXN1cy9EZWxsL01laXp1L01vdG9yb2xhL1BvbHl0cm9uL0luZmluaXgvVGVjbm8vTWljcm9tYXgvQWR2YW5cbiAgICAgICAgICAgIC87IChibHV8aG1kfGltb3x0Y2wpW18gXShbXFx3XFwrIF0rPykoPzogYnVpfFxcKXw7IHIpL2ksICAgICAgICAgICAgICAgLy8gQkxVL0hNRC9JTU8vVENMXG4gICAgICAgICAgICAvKGhwKSAoW1xcdyBdK1xcdykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFAgaVBBUVxuICAgICAgICAgICAgLyhtaWNyb3NvZnQpOyAobHVtaWFbXFx3IF0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWljcm9zb2Z0IEx1bWlhXG4gICAgICAgICAgICAvKGxlbm92bylbLV8gXT8oWy1cXHcgXSs/KSg/OiBidWl8XFwpfFxcLykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExlbm92b1xuICAgICAgICAgICAgLyhvcHBvKSA/KFtcXHcgXSspIGJ1aS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT1BQT1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvKGtvYm8pXFxzKGVyZWFkZXJ8dG91Y2gpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLb2JvXG4gICAgICAgICAgICAvKGhwKS4rKHRvdWNocGFkKD8hLit0YWJsZXQpfHRhYmxldCkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhQIFRvdWNoUGFkXG4gICAgICAgICAgICAvKGtpbmRsZSlcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtpbmRsZVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvKHN1cmZhY2UgZHVvKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN1cmZhY2UgRHVvXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIE1JQ1JPU09GVF0sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkIFtcXGRcXC5dKzsgKGZwXFxkdT8pKD86IGJ8XFwpKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmFpcnBob25lXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdGYWlycGhvbmUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvKCg/OnRlZ3Jhbm90ZXxzaGllbGQgdCg/IS4rZCB0dikpW1xcdy0gXSo/KSg/OiBifFxcKSkvaSAgICAgICAgICAgICAgLy8gTnZpZGlhIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTlZJRElBXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKHNwcmludCkgKFxcdyspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTcHJpbnQgUGhvbmVzXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvKGtpblxcLltvbmV0d117M30pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgS2luXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvXFwuL2csICcgJ10sIFtWRU5ET1IsIE1JQ1JPU09GVF0sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7IChbYzZdK3xldDVbMTZdfG1jWzIzOV1bMjNdeD98dmM4WzAzXXg/KVxcKS9pICAgICAgICAgICAgICAgLy8gWmVicmFcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgWkVCUkFdLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rOyAoZWMzMHxwczIwfHRjWzItOF1cXGRba3hdKVxcKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFpFQlJBXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIFNNQVJUVFZTXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC9zbWFydC10di4rKHNhbXN1bmcpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2Ftc3VuZ1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL2hiYnR2LittYXBsZTsoXFxkKykvaVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgL14vLCAnU21hcnRUViddLCBbVkVORE9SLCBTQU1TVU5HXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL3RjYXN0LisobGcpZT8uIChbLVxcd10rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTEcgU21hcnRUVlxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC8obnV4OyBuZXRjYXN0LitzbWFydHR2fGxnIChuZXRjYXN0XFwudHYtMjAxXFxkfGFuZHJvaWQgdHYpKS9pXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgTEddLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvKGFwcGxlKSA/dHYvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFwcGxlIFRWXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbTU9ERUwsIEFQUExFKycgVFYnXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL2Nya2V5LipkZXZpY2V0eXBlXFwvY2hyb21lY2FzdC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3QgVGhpcmQgR2VuZXJhdGlvblxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgQ0hST01FQ0FTVCsnIFRoaXJkIEdlbmVyYXRpb24nXSwgW1ZFTkRPUiwgR09PR0xFXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL2Nya2V5LipkZXZpY2V0eXBlXFwvKFteL10qKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3Qgd2l0aCBzcGVjaWZpYyBkZXZpY2UgdHlwZVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgL14vLCAnQ2hyb21lY2FzdCAnXSwgW1ZFTkRPUiwgR09PR0xFXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL2Z1Y2hzaWEuKmNya2V5L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgQ2hyb21lY2FzdCBOZXN0IEh1YlxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgQ0hST01FQ0FTVCsnIE5lc3QgSHViJ10sIFtWRU5ET1IsIEdPT0dMRV0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9jcmtleS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3QsIExpbnV4LWJhc2VkIG9yIHVua25vd25cbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIENIUk9NRUNBU1RdLCBbVkVORE9SLCBHT09HTEVdLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvKHBvcnRhbHR2KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZhY2Vib29rIFBvcnRhbCBUVlxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBGQUNFQk9PS10sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZC4rYWZ0KFxcdyspKCBidWl8XFwpKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlIFRWXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIEFNQVpPTl0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC8oc2hpZWxkIFxcdysgdHYpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE52aWRpYSBTaGllbGQgVFZcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTlZJRElBXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL1xcKGR0dltcXCk7XS4rKGFxdW9zKS9pLFxuICAgICAgICAgICAgLyhhcXVvcy10dltcXHcgXSspXFwpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNoYXJwXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNIQVJQXSwgW1RZUEUsIFNNQVJUVFZdXSxbXG4gICAgICAgICAgICAvKGJyYXZpYVtcXHcgXSspKCBidWl8XFwpKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29ueVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBTT05ZXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgLyhtaSh0dnxib3gpLT9cXHcrKSBidWkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWGlhb21pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFhJQU9NSV0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC9IYmJ0di4qKHRlY2huaXNhdCkgKC4qKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGVjaG5pU0FUXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL1xcYihyb2t1KVtcXGR4XSpbXFwpXFwvXSgoPzpkdnAtKT9bXFxkXFwuXSopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSb2t1XG4gICAgICAgICAgICAvaGJidHZcXC9cXGQrXFwuXFxkK1xcLlxcZCsgK1xcKFtcXHdcXCsgXSo7ICooW1xcd1xcZF1bXjtdKik7KFteO10qKS9pICAgICAgICAgLy8gSGJiVFYgZGV2aWNlc1xuICAgICAgICAgICAgXSwgW1tWRU5ET1IsIHRyaW1dLCBbTU9ERUwsIHRyaW1dLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNtYXJ0VFYgZnJvbSBVbmlkZW50aWZpZWQgVmVuZG9yc1xuICAgICAgICAgICAgL2Ryb2lkLis7IChbXFx3LSBdKykgKD86YW5kcm9pZCB0dnxzbWFydFstIF0/dHYpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuICAgICAgICAgICAgL1xcYihhbmRyb2lkIHR2fHNtYXJ0Wy0gXT90dnxvcGVyYSB0dnx0djsgcnY6KVxcYi9pXG4gICAgICAgICAgICBdLCBbW1RZUEUsIFNNQVJUVFZdXSwgW1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBDT05TT0xFU1xuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvKG91eWEpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE91eWFcbiAgICAgICAgICAgIC8obmludGVuZG8pIChcXHcrKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5pbnRlbmRvXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIENPTlNPTEVdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7IChzaGllbGQpKCBidWl8XFwpKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTnZpZGlhIFBvcnRhYmxlXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIE5WSURJQV0sIFtUWVBFLCBDT05TT0xFXV0sIFtcbiAgICAgICAgICAgIC8ocGxheXN0YXRpb24gXFx3KykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBsYXlzdGF0aW9uXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNPTlldLCBbVFlQRSwgQ09OU09MRV1dLCBbXG4gICAgICAgICAgICAvXFxiKHhib3goPzogb25lKT8oPyE7IHhib3gpKVtcXCk7IF0vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWljcm9zb2Z0IFhib3hcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTUlDUk9TT0ZUXSwgW1RZUEUsIENPTlNPTEVdXSwgW1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBXRUFSQUJMRVNcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgL1xcYihzbS1bbHJdXFxkXFxkWzAxNTZdW2ZudXddP3M/fGdlYXIgbGl2ZSlcXGIvaSAgICAgICAgICAgICAgICAgICAgICAgLy8gU2Ftc3VuZyBHYWxheHkgV2F0Y2hcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgU0FNU1VOR10sIFtUWVBFLCBXRUFSQUJMRV1dLCBbXG4gICAgICAgICAgICAvKChwZWJibGUpKWFwcC9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBlYmJsZVxuICAgICAgICAgICAgLyhhc3VzfGdvb2dsZXxsZ3xvcHBvKSAoKHBpeGVsIHx6ZW4pP3dhdGNoW1xcdyBdKikoIGJ1aXxcXCkpL2kgICAgICAgIC8vIEFzdXMgWmVuV2F0Y2ggLyBMRyBXYXRjaCAvIFBpeGVsIFdhdGNoXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcbiAgICAgICAgICAgIC8ob3coPzoxOXwyMCk/d2U/WzEtM117MSwzfSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BwbyBXYXRjaFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBPUFBPXSwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcbiAgICAgICAgICAgIC8od2F0Y2gpKD86ID9vc1ssXFwvXXxcXGQsXFxkXFwvKVtcXGRcXC5dKy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXBwbGUgV2F0Y2hcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQVBQTEVdLCBbVFlQRSwgV0VBUkFCTEVdXSwgW1xuICAgICAgICAgICAgLyhvcHd3ZVxcZHszfSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT25lUGx1cyBXYXRjaFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBPTkVQTFVTXSwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcbiAgICAgICAgICAgIC8obW90byAzNjApL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTW90b3JvbGEgMzYwXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIE1PVE9ST0xBXSwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcbiAgICAgICAgICAgIC8oc21hcnR3YXRjaCAzKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29ueSBTbWFydFdhdGNoXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsIFNPTlldLCBbVFlQRSwgV0VBUkFCTEVdXSwgW1xuICAgICAgICAgICAgLyhnIHdhdGNoIHIpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMRyBHIFdhdGNoIFJcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgTEddLCBbVFlQRSwgV0VBUkFCTEVdXSwgW1xuICAgICAgICAgICAgL2Ryb2lkLis7ICh3dDYzPzB7MiwzfSlcXCkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBaRUJSQV0sIFtUWVBFLCBXRUFSQUJMRV1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIFhSXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC9kcm9pZC4rOyAoZ2xhc3MpIFxcZC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBHbGFzc1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBHT09HTEVdLCBbVFlQRSwgWFJdXSwgW1xuICAgICAgICAgICAgLyhwaWNvKSAoNHxuZW8zKD86IGxpbmt8cHJvKT8pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQaWNvXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIFhSXV0sIFtcbiAgICAgICAgICAgIC8ocXVlc3QoIFxcZHwgcHJvKT9zPykuK3ZyL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1ldGEgUXVlc3RcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgRkFDRUJPT0tdLCBbVFlQRSwgWFJdXSwgW1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBFTUJFRERFRFxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvKHRlc2xhKSg/OiBxdGNhcmJyb3dzZXJ8XFwvWy1cXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRlc2xhXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbVFlQRSwgRU1CRURERURdXSwgW1xuICAgICAgICAgICAgLyhhZW9iYylcXGIvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWNobyBEb3RcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgQU1BWk9OXSwgW1RZUEUsIEVNQkVEREVEXV0sIFtcbiAgICAgICAgICAgIC8oaG9tZXBvZCkuK21hYyBvcy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXBwbGUgSG9tZVBvZFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCBBUFBMRV0sIFtUWVBFLCBFTUJFRERFRF1dLCBbXG4gICAgICAgICAgICAvd2luZG93cyBpb3QvaVxuICAgICAgICAgICAgXSwgW1tUWVBFLCBFTUJFRERFRF1dLCBbXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBNSVhFRCAoR0VORVJJQylcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgL2Ryb2lkIC4rPzsgKFteO10rPykoPzogYnVpfDsgd3ZcXCl8XFwpIGFwcGxldykuKz8obW9iaWxlfHZyfFxcZCkgc2FmYXJpL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1RZUEUsIHN0ck1hcHBlciwgeyAnbW9iaWxlJyA6ICdNb2JpbGUnLCAneHInIDogJ1ZSJywgJyonIDogVEFCTEVUIH1dXSwgW1xuICAgICAgICAgICAgL1xcYigodGFibGV0fHRhYilbO1xcL118Zm9jdXNcXC9cXGQoPyEuK21vYmlsZSkpL2kgICAgICAgICAgICAgICAgICAgICAgLy8gVW5pZGVudGlmaWFibGUgVGFibGV0XG4gICAgICAgICAgICBdLCBbW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKHBob25lfG1vYmlsZSg/Ols7XFwvXXwgWyBcXHdcXC9cXC5dKnNhZmFyaSl8cGRhKD89Lit3aW5kb3dzIGNlKSkvaSAgICAvLyBVbmlkZW50aWZpYWJsZSBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9kcm9pZCAuKz87IChbXFx3XFwuIC1dKykoIGJ1aXxcXCkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2VuZXJpYyBBbmRyb2lkIERldmljZVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnR2VuZXJpYyddXVxuICAgICAgICBdLFxuXG4gICAgICAgIGVuZ2luZSA6IFtbXG5cbiAgICAgICAgICAgIC93aW5kb3dzLisgZWRnZVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFZGdlSFRNTFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBFREdFKydIVE1MJ11dLCBbXG5cbiAgICAgICAgICAgIC8oYXJrd2ViKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXJrV2ViXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL3dlYmtpdFxcLzUzN1xcLjM2LitjaHJvbWVcXC8oPyEyNykoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsaW5rXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdCbGluayddXSwgW1xuXG4gICAgICAgICAgICAvKHByZXN0bylcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByZXN0b1xuICAgICAgICAgICAgLyh3ZWJraXR8dHJpZGVudHxuZXRmcm9udHxuZXRzdXJmfGFtYXlhfGx5bnh8dzNtfGdvYW5uYXxzZXJ2bylcXC8oW1xcd1xcLl0rKS9pLCAvLyBXZWJLaXQvVHJpZGVudC9OZXRGcm9udC9OZXRTdXJmL0FtYXlhL0x5bngvdzNtL0dvYW5uYS9TZXJ2b1xuICAgICAgICAgICAgL2VraW9oKGZsb3cpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGbG93XG4gICAgICAgICAgICAvKGtodG1sfHRhc21hbnxsaW5rcylbXFwvIF1cXCg/KFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLSFRNTC9UYXNtYW4vTGlua3NcbiAgICAgICAgICAgIC8oaWNhYilbXFwvIF0oWzIzXVxcLltcXGRcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlDYWJcblxuICAgICAgICAgICAgL1xcYihsaWJ3ZWIpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGliV2ViXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC9sYWR5YmlyZFxcLy9pXG4gICAgICAgICAgICBdLCBbW05BTUUsICdMaWJXZWInXV0sIFtcblxuICAgICAgICAgICAgL3J2XFw6KFtcXHdcXC5dezEsOX0pXFxiLisoZ2Vja28pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2Vja29cbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBOQU1FXVxuICAgICAgICBdLFxuXG4gICAgICAgIG9zIDogW1tcblxuICAgICAgICAgICAgLy8gV2luZG93c1xuICAgICAgICAgICAgL21pY3Jvc29mdCAod2luZG93cykgKHZpc3RhfHhwKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXaW5kb3dzIChpVHVuZXMpXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8od2luZG93cyAoPzpwaG9uZSg/OiBvcyk/fG1vYmlsZXxpb3QpKVtcXC8gXT8oW1xcZFxcLlxcdyBdKikvaSAgICAgICAgIC8vIFdpbmRvd3MgUGhvbmVcbiAgICAgICAgICAgIF0sIFtOQU1FLCBbVkVSU0lPTiwgc3RyTWFwcGVyLCB3aW5kb3dzVmVyc2lvbk1hcF1dLCBbXG4gICAgICAgICAgICAvd2luZG93cyBudCA2XFwuMjsgKGFybSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXaW5kb3dzIFJUXG4gICAgICAgICAgICAvd2luZG93c1tcXC8gXShbbnRjZVxcZFxcLiBdK1xcdykoPyEuK3hib3gpL2ksXG4gICAgICAgICAgICAvKD86d2luKD89M3w5fG4pfHdpbiA5eCApKFtudFxcZFxcLl0rKS9pXG4gICAgICAgICAgICBdLCBbW1ZFUlNJT04sIHN0ck1hcHBlciwgd2luZG93c1ZlcnNpb25NYXBdLCBbTkFNRSwgV0lORE9XU11dLCBbXG5cbiAgICAgICAgICAgIC8vIGlPUy9tYWNPU1xuICAgICAgICAgICAgL1thZGVoaW1ub3BdezQsN31cXGIoPzouKm9zIChbXFx3XSspIGxpa2UgbWFjfDsgb3BlcmEpL2ksICAgICAgICAgICAgIC8vIGlPU1xuICAgICAgICAgICAgLyg/OmlvcztmYnN2XFwvfGlwaG9uZS4raW9zW1xcLyBdKShbXFxkXFwuXSspL2ksXG4gICAgICAgICAgICAvY2ZuZXR3b3JrXFwvLitkYXJ3aW4vaVxuICAgICAgICAgICAgXSwgW1tWRVJTSU9OLCAvXy9nLCAnLiddLCBbTkFNRSwgJ2lPUyddXSwgW1xuICAgICAgICAgICAgLyhtYWMgb3MgeCkgPyhbXFx3XFwuIF0qKS9pLFxuICAgICAgICAgICAgLyhtYWNpbnRvc2h8bWFjX3Bvd2VycGNcXGIpKD8hLitoYWlrdSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFjIE9TXG4gICAgICAgICAgICBdLCBbW05BTUUsICdtYWNPUyddLCBbVkVSU0lPTiwgL18vZywgJy4nXV0sIFtcblxuICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3RcbiAgICAgICAgICAgIC9hbmRyb2lkIChbXFxkXFwuXSspLipjcmtleS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgQ2hyb21lY2FzdCwgQW5kcm9pZC1iYXNlZFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBDSFJPTUVDQVNUICsgJyBBbmRyb2lkJ11dLCBbXG4gICAgICAgICAgICAvZnVjaHNpYS4qY3JrZXlcXC8oW1xcZFxcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBDaHJvbWVjYXN0LCBGdWNoc2lhLWJhc2VkXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIENIUk9NRUNBU1QgKyAnIEZ1Y2hzaWEnXV0sIFtcbiAgICAgICAgICAgIC9jcmtleVxcLyhbXFxkXFwuXSspLipkZXZpY2V0eXBlXFwvc21hcnRzcGVha2VyL2kgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBDaHJvbWVjYXN0LCBMaW51eC1iYXNlZCBTbWFydCBTcGVha2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIENIUk9NRUNBU1QgKyAnIFNtYXJ0U3BlYWtlciddXSwgW1xuICAgICAgICAgICAgL2xpbnV4LipjcmtleVxcLyhbXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgQ2hyb21lY2FzdCwgTGVnYWN5IExpbnV4LWJhc2VkXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIENIUk9NRUNBU1QgKyAnIExpbnV4J11dLCBbXG4gICAgICAgICAgICAvY3JrZXlcXC8oW1xcZFxcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBDaHJvbWVjYXN0LCB1bmtub3duXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsIENIUk9NRUNBU1RdXSwgW1xuXG4gICAgICAgICAgICAvLyBNb2JpbGUgT1Nlc1xuICAgICAgICAgICAgL2Ryb2lkIChbXFx3XFwuXSspXFxiLisoYW5kcm9pZFstIF14ODZ8aGFybW9ueW9zKS9pICAgICAgICAgICAgICAgICAgICAvLyBBbmRyb2lkLXg4Ni9IYXJtb255T1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBOQU1FXSwgWyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAvKHVidW50dSkgKFtcXHdcXC5dKykgbGlrZSBhbmRyb2lkL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVWJ1bnR1IFRvdWNoXG4gICAgICAgICAgICBdLCBbW05BTUUsIC8oLispLywgJyQxIFRvdWNoJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFuZHJvaWQvQmxhY2tiZXJyeS9XZWJPUy9RTlgvQmFkYS9SSU0vS2FpT1MvTWFlbW8vTWVlR28vUzQwL1NhaWxmaXNoIE9TL09wZW5IYXJtb255L1RpemVuXG4gICAgICAgICAgICAvKGFuZHJvaWR8YmFkYXxibGFja2JlcnJ5fGthaW9zfG1hZW1vfG1lZWdvfG9wZW5oYXJtb255fHFueHxyaW0gdGFibGV0IG9zfHNhaWxmaXNofHNlcmllczQwfHN5bWJpYW58dGl6ZW58d2Vib3MpXFx3KlstXFwvXFwuOyBdPyhbXFxkXFwuXSopL2lcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL1xcKGJiKDEwKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxhY2tCZXJyeSAxMFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBCTEFDS0JFUlJZXV0sIFtcbiAgICAgICAgICAgIC8oPzpzeW1iaWFuID9vc3xzeW1ib3N8czYwKD89Oyl8c2VyaWVzID82MClbLVxcLyBdPyhbXFx3XFwuXSopL2kgICAgICAgLy8gU3ltYmlhblxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnU3ltYmlhbiddXSwgW1xuICAgICAgICAgICAgL21vemlsbGFcXC9bXFxkXFwuXSsgXFwoKD86bW9iaWxlfHRhYmxldHx0dnxtb2JpbGU7IFtcXHcgXSspOyBydjouKyBnZWNrb1xcLyhbXFx3XFwuXSspL2kgLy8gRmlyZWZveCBPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCBGSVJFRk9YKycgT1MnXV0sIFtcbiAgICAgICAgICAgIC93ZWIwczsuK3J0KHR2KS9pLFxuICAgICAgICAgICAgL1xcYig/OmhwKT93b3MoPzpicm93c2VyKT9cXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2ViT1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ3dlYk9TJ11dLCBbXG4gICAgICAgICAgICAvd2F0Y2goPzogP29zWyxcXC9dfFxcZCxcXGRcXC8pKFtcXGRcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdhdGNoT1NcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ3dhdGNoT1MnXV0sIFtcblxuICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZU9TXG4gICAgICAgICAgICAvKGNyb3MpIFtcXHddKyg/OlxcKXwgKFtcXHdcXC5dKylcXGIpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21pdW0gT1NcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgXCJDaHJvbWUgT1NcIl0sIFZFUlNJT05dLFtcblxuICAgICAgICAgICAgLy8gU21hcnQgVFZzXG4gICAgICAgICAgICAvcGFuYXNvbmljOyh2aWVyYSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBhbmFzb25pYyBWaWVyYVxuICAgICAgICAgICAgLyhuZXRyYW5nZSltbWgvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXRyYW5nZVxuICAgICAgICAgICAgLyhuZXR0dilcXC8oXFxkK1xcLltcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5ldFRWXG5cbiAgICAgICAgICAgIC8vIENvbnNvbGVcbiAgICAgICAgICAgIC8obmludGVuZG98cGxheXN0YXRpb24pIChcXHcrKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5pbnRlbmRvL1BsYXlzdGF0aW9uXG4gICAgICAgICAgICAvKHhib3gpOyAreGJveCAoW15cXCk7XSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgWGJveCAoMzYwLCBPbmUsIFgsIFMsIFNlcmllcyBYLCBTZXJpZXMgUylcbiAgICAgICAgICAgIC8ocGljbykgLitvcyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQaWNvXG5cbiAgICAgICAgICAgIC8vIE90aGVyXG4gICAgICAgICAgICAvXFxiKGpvbGl8cGFsbSlcXGIgPyg/Om9zKT9cXC8/KFtcXHdcXC5dKikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSm9saS9QYWxtXG4gICAgICAgICAgICAvKG1pbnQpW1xcL1xcKFxcKSBdPyhcXHcqKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaW50XG4gICAgICAgICAgICAvKG1hZ2VpYXx2ZWN0b3JsaW51eClbOyBdL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1hZ2VpYS9WZWN0b3JMaW51eFxuICAgICAgICAgICAgLyhba3hsbl0/dWJ1bnR1fGRlYmlhbnxzdXNlfG9wZW5zdXNlfGdlbnRvb3xhcmNoKD89IGxpbnV4KXxzbGFja3dhcmV8ZmVkb3JhfG1hbmRyaXZhfGNlbnRvc3xwY2xpbnV4b3N8cmVkID9oYXR8emVud2Fsa3xsaW5wdXN8cmFzcGJpYW58cGxhbiA5fG1pbml4fHJpc2Mgb3N8Y29udGlraXxkZWVwaW58bWFuamFyb3xlbGVtZW50YXJ5IG9zfHNhYmF5b258bGluc3BpcmUpKD86IGdudVxcL2xpbnV4KT8oPzogZW50ZXJwcmlzZSk/KD86Wy0gXWxpbnV4KT8oPzotZ251KT9bLVxcLyBdPyg/IWNocm9tfHBhY2thZ2UpKFstXFx3XFwuXSopL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVidW50dS9EZWJpYW4vU1VTRS9HZW50b28vQXJjaC9TbGFja3dhcmUvRmVkb3JhL01hbmRyaXZhL0NlbnRPUy9QQ0xpbnV4T1MvUmVkSGF0L1plbndhbGsvTGlucHVzL1Jhc3BiaWFuL1BsYW45L01pbml4L1JJU0NPUy9Db250aWtpL0RlZXBpbi9NYW5qYXJvL2VsZW1lbnRhcnkvU2FiYXlvbi9MaW5zcGlyZVxuICAgICAgICAgICAgLyhodXJkfGxpbnV4KSg/OiBhcm1cXHcqfCB4ODZcXHcqfCA/KShbXFx3XFwuXSopL2ksICAgICAgICAgICAgICAgICAgICAgLy8gSHVyZC9MaW51eFxuICAgICAgICAgICAgLyhnbnUpID8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdOVVxuICAgICAgICAgICAgL1xcYihbLWZyZW50b3BjZ2hzXXswLDV9YnNkfGRyYWdvbmZseSlbXFwvIF0/KD8hYW1kfFtpeDM0Nl17MSwyfTg2KShbXFx3XFwuXSopL2ksIC8vIEZyZWVCU0QvTmV0QlNEL09wZW5CU0QvUEMtQlNEL0dob3N0QlNEL0RyYWdvbkZseVxuICAgICAgICAgICAgLyhoYWlrdSkgKFxcdyspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGFpa3VcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLyhzdW5vcykgPyhbXFx3XFwuXFxkXSopL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb2xhcmlzXG4gICAgICAgICAgICBdLCBbW05BTUUsICdTb2xhcmlzJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKCg/Om9wZW4pP3NvbGFyaXMpWy1cXC8gXT8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbGFyaXNcbiAgICAgICAgICAgIC8oYWl4KSAoKFxcZCkoPz1cXC58XFwpfCApW1xcd1xcLl0pKi9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBSVhcbiAgICAgICAgICAgIC9cXGIoYmVvc3xvc1xcLzJ8YW1pZ2Fvc3xtb3JwaG9zfG9wZW52bXN8ZnVjaHNpYXxocC11eHxzZXJlbml0eW9zKS9pLCAvLyBCZU9TL09TMi9BbWlnYU9TL01vcnBoT1MvT3BlblZNUy9GdWNoc2lhL0hQLVVYL1NlcmVuaXR5T1NcbiAgICAgICAgICAgIC8odW5peCkgPyhbXFx3XFwuXSopL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVTklYXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl1cbiAgICAgICAgXVxuICAgIH07XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIEZhY3Rvcmllc1xuICAgIC8vLy8vLy8vLy8vLy8vLy9cblxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb3BzID0geyBpbml0IDoge30sIGlzSWdub3JlIDoge30sIGlzSWdub3JlUmd4IDoge30sIHRvU3RyaW5nIDoge319O1xuICAgICAgICAgICAgc2V0UHJvcHMuY2FsbChwcm9wcy5pbml0LCBbXG4gICAgICAgICAgICAgICAgW1VBX0JST1dTRVIsIFtOQU1FLCBWRVJTSU9OLCBNQUpPUiwgVFlQRV1dLFxuICAgICAgICAgICAgICAgIFtVQV9DUFUsIFtBUkNISVRFQ1RVUkVdXSxcbiAgICAgICAgICAgICAgICBbVUFfREVWSUNFLCBbVFlQRSwgTU9ERUwsIFZFTkRPUl1dLFxuICAgICAgICAgICAgICAgIFtVQV9FTkdJTkUsIFtOQU1FLCBWRVJTSU9OXV0sXG4gICAgICAgICAgICAgICAgW1VBX09TLCBbTkFNRSwgVkVSU0lPTl1dXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIHNldFByb3BzLmNhbGwocHJvcHMuaXNJZ25vcmUsIFtcbiAgICAgICAgICAgICAgICBbVUFfQlJPV1NFUiwgW1ZFUlNJT04sIE1BSk9SXV0sXG4gICAgICAgICAgICAgICAgW1VBX0VOR0lORSwgW1ZFUlNJT05dXSxcbiAgICAgICAgICAgICAgICBbVUFfT1MsIFtWRVJTSU9OXV1cbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgc2V0UHJvcHMuY2FsbChwcm9wcy5pc0lnbm9yZVJneCwgW1xuICAgICAgICAgICAgICAgIFtVQV9CUk9XU0VSLCAvID9icm93c2VyJC9pXSxcbiAgICAgICAgICAgICAgICBbVUFfT1MsIC8gP29zJC9pXVxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBzZXRQcm9wcy5jYWxsKHByb3BzLnRvU3RyaW5nLCBbXG4gICAgICAgICAgICAgICAgW1VBX0JST1dTRVIsIFtOQU1FLCBWRVJTSU9OXV0sXG4gICAgICAgICAgICAgICAgW1VBX0NQVSwgW0FSQ0hJVEVDVFVSRV1dLFxuICAgICAgICAgICAgICAgIFtVQV9ERVZJQ0UsIFtWRU5ET1IsIE1PREVMXV0sXG4gICAgICAgICAgICAgICAgW1VBX0VOR0lORSwgW05BTUUsIFZFUlNJT05dXSxcbiAgICAgICAgICAgICAgICBbVUFfT1MsIFtOQU1FLCBWRVJTSU9OXV1cbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb3BzO1xuICAgIH0pKCk7XG5cbiAgICB2YXIgY3JlYXRlSURhdGEgPSBmdW5jdGlvbiAoaXRlbSwgaXRlbVR5cGUpIHtcblxuICAgICAgICB2YXIgaW5pdF9wcm9wcyA9IGRlZmF1bHRQcm9wcy5pbml0W2l0ZW1UeXBlXSxcbiAgICAgICAgICAgIGlzX2lnbm9yZVByb3BzID0gZGVmYXVsdFByb3BzLmlzSWdub3JlW2l0ZW1UeXBlXSB8fCAwLFxuICAgICAgICAgICAgaXNfaWdub3JlUmd4ID0gZGVmYXVsdFByb3BzLmlzSWdub3JlUmd4W2l0ZW1UeXBlXSB8fCAwLFxuICAgICAgICAgICAgdG9TdHJpbmdfcHJvcHMgPSBkZWZhdWx0UHJvcHMudG9TdHJpbmdbaXRlbVR5cGVdIHx8IDA7XG5cbiAgICAgICAgZnVuY3Rpb24gSURhdGEgKCkge1xuICAgICAgICAgICAgc2V0UHJvcHMuY2FsbCh0aGlzLCBpbml0X3Byb3BzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIElEYXRhLnByb3RvdHlwZS5nZXRJdGVtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH07XG5cbiAgICAgICAgSURhdGEucHJvdG90eXBlLndpdGhDbGllbnRIaW50cyA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgLy8gbm9kZWpzIC8gbm9uLWNsaWVudC1oaW50cyBicm93c2Vyc1xuICAgICAgICAgICAgaWYgKCFOQVZJR0FUT1JfVUFEQVRBKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgIC5wYXJzZUNIKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYnJvd3NlcnMgYmFzZWQgb24gY2hyb21pdW0gODUrXG4gICAgICAgICAgICByZXR1cm4gTkFWSUdBVE9SX1VBREFUQVxuICAgICAgICAgICAgICAgICAgICAuZ2V0SGlnaEVudHJvcHlWYWx1ZXMoQ0hfQUxMX1ZBTFVFUylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldENIKG5ldyBVQUNIRGF0YShyZXMsIGZhbHNlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBhcnNlQ0goKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBJRGF0YS5wcm90b3R5cGUud2l0aEZlYXR1cmVDaGVjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLmRldGVjdEZlYXR1cmUoKS5nZXQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoaXRlbVR5cGUgIT0gVUFfUkVTVUxUKSB7XG4gICAgICAgICAgICBJRGF0YS5wcm90b3R5cGUuaXMgPSBmdW5jdGlvbiAoc3RyVG9DaGVjaykge1xuICAgICAgICAgICAgICAgIHZhciBpcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShpKSAmJiAhaGFzKGlzX2lnbm9yZVByb3BzLCBpKSAmJiBsb3dlcml6ZShpc19pZ25vcmVSZ3ggPyBzdHJpcChpc19pZ25vcmVSZ3gsIHRoaXNbaV0pIDogdGhpc1tpXSkgPT0gbG93ZXJpemUoaXNfaWdub3JlUmd4ID8gc3RyaXAoaXNfaWdub3JlUmd4LCBzdHJUb0NoZWNrKSA6IHN0clRvQ2hlY2spKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RyVG9DaGVjayAhPSBVTkRFRl9UWVBFKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdHJUb0NoZWNrID09IFVOREVGX1RZUEUgJiYgaXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzID0gIWlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIElEYXRhLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RyID0gRU1QVFk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0b1N0cmluZ19wcm9wcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHRoaXNbdG9TdHJpbmdfcHJvcHNbaV1dKSAhPT0gVU5ERUZfVFlQRSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IChzdHIgPyAnICcgOiBFTVBUWSkgKyB0aGlzW3RvU3RyaW5nX3Byb3BzW2ldXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyIHx8IFVOREVGX1RZUEU7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFOQVZJR0FUT1JfVUFEQVRBKSB7XG4gICAgICAgICAgICBJRGF0YS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIChjYikgeyBcbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIElEYXRhUmVzb2x2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiB0aGF0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcF0gPSB0aGF0W3Byb3BdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBJRGF0YVJlc29sdmUucHJvdG90eXBlID0ge1xuICAgICAgICAgICAgICAgICAgICBpcyA6IElEYXRhLnByb3RvdHlwZS5pcyxcbiAgICAgICAgICAgICAgICAgICAgdG9TdHJpbmcgOiBJRGF0YS5wcm90b3R5cGUudG9TdHJpbmdcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZhciByZXNvbHZlRGF0YSA9IG5ldyBJRGF0YVJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICBjYihyZXNvbHZlRGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVEYXRhO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgSURhdGEoKTtcbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIC8vLy8vLy8vLy8vLy8vLy9cblxuICAgIGZ1bmN0aW9uIFVBQ0hEYXRhICh1YWNoLCBpc0h0dHBVQUNIKSB7XG4gICAgICAgIHVhY2ggPSB1YWNoIHx8IHt9O1xuICAgICAgICBzZXRQcm9wcy5jYWxsKHRoaXMsIENIX0FMTF9WQUxVRVMpO1xuICAgICAgICBpZiAoaXNIdHRwVUFDSCkge1xuICAgICAgICAgICAgc2V0UHJvcHMuY2FsbCh0aGlzLCBbXG4gICAgICAgICAgICAgICAgW0JSQU5EUywgaXRlbUxpc3RUb0FycmF5KHVhY2hbQ0hfSEVBREVSXSldLFxuICAgICAgICAgICAgICAgIFtGVUxMVkVSTElTVCwgaXRlbUxpc3RUb0FycmF5KHVhY2hbQ0hfSEVBREVSX0ZVTExfVkVSX0xJU1RdKV0sXG4gICAgICAgICAgICAgICAgW01PQklMRSwgL1xcPzEvLnRlc3QodWFjaFtDSF9IRUFERVJfTU9CSUxFXSldLFxuICAgICAgICAgICAgICAgIFtNT0RFTCwgc3RyaXBRdW90ZXModWFjaFtDSF9IRUFERVJfTU9ERUxdKV0sXG4gICAgICAgICAgICAgICAgW1BMQVRGT1JNLCBzdHJpcFF1b3Rlcyh1YWNoW0NIX0hFQURFUl9QTEFURk9STV0pXSxcbiAgICAgICAgICAgICAgICBbUExBVEZPUk1WRVIsIHN0cmlwUXVvdGVzKHVhY2hbQ0hfSEVBREVSX1BMQVRGT1JNX1ZFUl0pXSxcbiAgICAgICAgICAgICAgICBbQVJDSElURUNUVVJFLCBzdHJpcFF1b3Rlcyh1YWNoW0NIX0hFQURFUl9BUkNIXSldLFxuICAgICAgICAgICAgICAgIFtGT1JNRkFDVE9SUywgaXRlbUxpc3RUb0FycmF5KHVhY2hbQ0hfSEVBREVSX0ZPUk1fRkFDVE9SU10pXSxcbiAgICAgICAgICAgICAgICBbQklUTkVTUywgc3RyaXBRdW90ZXModWFjaFtDSF9IRUFERVJfQklUTkVTU10pXVxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIHVhY2gpIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmhhc093blByb3BlcnR5KHByb3ApICYmIHR5cGVvZiB1YWNoW3Byb3BdICE9PSBVTkRFRl9UWVBFKSB0aGlzW3Byb3BdID0gdWFjaFtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIFVBSXRlbSAoaXRlbVR5cGUsIHVhLCByZ3hNYXAsIHVhQ0gpIHtcblxuICAgICAgICB0aGlzLmdldCA9IGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICAgICAgICBpZiAoIXByb3ApIHJldHVybiB0aGlzLmRhdGE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmhhc093blByb3BlcnR5KHByb3ApID8gdGhpcy5kYXRhW3Byb3BdIDogdW5kZWZpbmVkO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2V0ID0gZnVuY3Rpb24gKHByb3AsIHZhbCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhW3Byb3BdID0gdmFsO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zZXRDSCA9IGZ1bmN0aW9uIChjaCkge1xuICAgICAgICAgICAgdGhpcy51YUNIID0gY2g7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRldGVjdEZlYXR1cmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoTkFWSUdBVE9SICYmIE5BVklHQVRPUi51c2VyQWdlbnQgPT0gdGhpcy51YSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5pdGVtVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFVBX0JST1dTRVI6XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBCcmF2ZS1zcGVjaWZpYyBkZXRlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOQVZJR0FUT1IuYnJhdmUgJiYgdHlwZW9mIE5BVklHQVRPUi5icmF2ZS5pc0JyYXZlID09IEZVTkNfVFlQRSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KE5BTUUsICdCcmF2ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgVUFfREVWSUNFOlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lLXNwZWNpZmljIGRldGVjdGlvbjogY2hlY2sgZm9yICdtb2JpbGUnIHZhbHVlIG9mIG5hdmlnYXRvci51c2VyQWdlbnREYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZ2V0KFRZUEUpICYmIE5BVklHQVRPUl9VQURBVEEgJiYgTkFWSUdBVE9SX1VBREFUQVtNT0JJTEVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoVFlQRSwgTU9CSUxFKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlQYWRPUy1zcGVjaWZpYyBkZXRlY3Rpb246IGlkZW50aWZpZWQgYXMgTWFjLCBidXQgaGFzIHNvbWUgaU9TLW9ubHkgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KE1PREVMKSA9PSAnTWFjaW50b3NoJyAmJiBOQVZJR0FUT1IgJiYgdHlwZW9mIE5BVklHQVRPUi5zdGFuZGFsb25lICE9PSBVTkRFRl9UWVBFICYmIE5BVklHQVRPUi5tYXhUb3VjaFBvaW50cyAmJiBOQVZJR0FUT1IubWF4VG91Y2hQb2ludHMgPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoTU9ERUwsICdpUGFkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldChUWVBFLCBUQUJMRVQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgVUFfT1M6XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWUtc3BlY2lmaWMgZGV0ZWN0aW9uOiBjaGVjayBmb3IgJ3BsYXRmb3JtJyB2YWx1ZSBvZiBuYXZpZ2F0b3IudXNlckFnZW50RGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmdldChOQU1FKSAmJiBOQVZJR0FUT1JfVUFEQVRBICYmIE5BVklHQVRPUl9VQURBVEFbUExBVEZPUk1dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoTkFNRSwgTkFWSUdBVE9SX1VBREFUQVtQTEFURk9STV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgVUFfUkVTVUxUOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGV0ZWN0ID0gZnVuY3Rpb24gKGl0ZW1UeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFbaXRlbVR5cGVdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0SXRlbSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGV0ZWN0RmVhdHVyZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoVUFfQlJPV1NFUiwgZGV0ZWN0KFVBX0JST1dTRVIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXQoVUFfQ1BVLCBkZXRlY3QoVUFfQ1BVKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0KFVBX0RFVklDRSwgZGV0ZWN0KFVBX0RFVklDRSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldChVQV9FTkdJTkUsIGRldGVjdChVQV9FTkdJTkUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXQoVUFfT1MsIGRldGVjdChVQV9PUykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucGFyc2VVQSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLml0ZW1UeXBlICE9IFVBX1JFU1VMVCkge1xuICAgICAgICAgICAgICAgIHJneE1hcHBlci5jYWxsKHRoaXMuZGF0YSwgdGhpcy51YSwgdGhpcy5yZ3hNYXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuaXRlbVR5cGUgPT0gVUFfQlJPV1NFUikge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KE1BSk9SLCBtYWpvcml6ZSh0aGlzLmdldChWRVJTSU9OKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5wYXJzZUNIID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHVhQ0ggPSB0aGlzLnVhQ0gsXG4gICAgICAgICAgICAgICAgcmd4TWFwID0gdGhpcy5yZ3hNYXA7XG4gICAgXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuaXRlbVR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFVBX0JST1dTRVI6XG4gICAgICAgICAgICAgICAgY2FzZSBVQV9FTkdJTkU6XG4gICAgICAgICAgICAgICAgICAgIHZhciBicmFuZHMgPSB1YUNIW0ZVTExWRVJMSVNUXSB8fCB1YUNIW0JSQU5EU10sIHByZXZOYW1lO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYnJhbmRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGJyYW5kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBicmFuZE5hbWUgPSBicmFuZHNbaV0uYnJhbmQgfHwgYnJhbmRzW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmFuZFZlcnNpb24gPSBicmFuZHNbaV0udmVyc2lvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pdGVtVHlwZSA9PSBVQV9CUk9XU0VSICYmICEvbm90LmEuYnJhbmQvaS50ZXN0KGJyYW5kTmFtZSkgJiYgKCFwcmV2TmFtZSB8fCAoL2Nocm9tL2kudGVzdChwcmV2TmFtZSkgJiYgYnJhbmROYW1lICE9IENIUk9NSVVNKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJhbmROYW1lID0gc3RyTWFwcGVyKGJyYW5kTmFtZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0Nocm9tZScgOiAnR29vZ2xlIENocm9tZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRWRnZScgOiAnTWljcm9zb2Z0IEVkZ2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0Nocm9tZSBXZWJWaWV3JyA6ICdBbmRyb2lkIFdlYlZpZXcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0Nocm9tZSBIZWFkbGVzcycgOiAnSGVhZGxlc3NDaHJvbWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0h1YXdlaSBCcm93c2VyJyA6ICdIdWF3ZWlCcm93c2VyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdNSVVJIEJyb3dzZXInIDogJ01pdWkgQnJvd3NlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnT3BlcmEgTW9iaScgOiAnT3BlcmFNb2JpbGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1lhbmRleCcgOiAnWWFCcm93c2VyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoTkFNRSwgYnJhbmROYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldChWRVJTSU9OLCBicmFuZFZlcnNpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0KE1BSk9SLCBtYWpvcml6ZShicmFuZFZlcnNpb24pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldk5hbWUgPSBicmFuZE5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLml0ZW1UeXBlID09IFVBX0VOR0lORSAmJiBicmFuZE5hbWUgPT0gQ0hST01JVU0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoVkVSU0lPTiwgYnJhbmRWZXJzaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBVQV9DUFU6XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmNoTmFtZSA9IHVhQ0hbQVJDSElURUNUVVJFXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyY2hOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJjaE5hbWUgJiYgdWFDSFtCSVRORVNTXSA9PSAnNjQnKSBhcmNoTmFtZSArPSAnNjQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmd4TWFwcGVyLmNhbGwodGhpcy5kYXRhLCBhcmNoTmFtZSArICc7Jywgcmd4TWFwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFVBX0RFVklDRTpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVhQ0hbTU9CSUxFXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoVFlQRSwgTU9CSUxFKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodWFDSFtNT0RFTF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KE1PREVMLCB1YUNIW01PREVMXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZ2V0KFRZUEUpIHx8ICF0aGlzLmdldChWRU5ET1IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlUGFyc2UgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZ3hNYXBwZXIuY2FsbChyZVBhcnNlLCAnZHJvaWQgOTsgJyArIHVhQ0hbTU9ERUxdICsgJyknLCByZ3hNYXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5nZXQoVFlQRSkgJiYgISFyZVBhcnNlLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoVFlQRSwgcmVQYXJzZS50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmdldChWRU5ET1IpICYmICEhcmVQYXJzZS52ZW5kb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoVkVORE9SLCByZVBhcnNlLnZlbmRvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh1YUNIW0ZPUk1GQUNUT1JTXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZmO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB1YUNIW0ZPUk1GQUNUT1JTXSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWR4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoIWZmICYmIGlkeCA8IHVhQ0hbRk9STUZBQ1RPUlNdLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZiA9IHN0ck1hcHBlcih1YUNIW0ZPUk1GQUNUT1JTXVtpZHgrK10sIGZvcm1GYWN0b3JzTWFwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZmID0gc3RyTWFwcGVyKHVhQ0hbRk9STUZBQ1RPUlNdLCBmb3JtRmFjdG9yc01hcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldChUWVBFLCBmZik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBVQV9PUzpcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9zTmFtZSA9IHVhQ0hbUExBVEZPUk1dO1xuICAgICAgICAgICAgICAgICAgICBpZihvc05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvc1ZlcnNpb24gPSB1YUNIW1BMQVRGT1JNVkVSXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvc05hbWUgPT0gV0lORE9XUykgb3NWZXJzaW9uID0gKHBhcnNlSW50KG1ham9yaXplKG9zVmVyc2lvbiksIDEwKSA+PSAxMyA/ICcxMScgOiAnMTAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KE5BTUUsIG9zTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0KFZFUlNJT04sIG9zVmVyc2lvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gWGJveC1TcGVjaWZpYyBEZXRlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KE5BTUUpID09IFdJTkRPV1MgJiYgdWFDSFtNT0RFTF0gPT0gJ1hib3gnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldChOQU1FLCAnWGJveCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldChWRVJTSU9OLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBVQV9SRVNVTFQ6XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyc2UgPSBmdW5jdGlvbiAoaXRlbVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhW2l0ZW1UeXBlXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0SXRlbSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRDSCh1YUNIKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucGFyc2VDSCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoVUFfQlJPV1NFUiwgcGFyc2UoVUFfQlJPV1NFUikpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0KFVBX0NQVSwgcGFyc2UoVUFfQ1BVKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXQoVUFfREVWSUNFLCBwYXJzZShVQV9ERVZJQ0UpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldChVQV9FTkdJTkUsIHBhcnNlKFVBX0VOR0lORSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0KFVBX09TLCBwYXJzZShVQV9PUykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2V0UHJvcHMuY2FsbCh0aGlzLCBbXG4gICAgICAgICAgICBbJ2l0ZW1UeXBlJywgaXRlbVR5cGVdLFxuICAgICAgICAgICAgWyd1YScsIHVhXSxcbiAgICAgICAgICAgIFsndWFDSCcsIHVhQ0hdLFxuICAgICAgICAgICAgWydyZ3hNYXAnLCByZ3hNYXBdLFxuICAgICAgICAgICAgWydkYXRhJywgY3JlYXRlSURhdGEodGhpcywgaXRlbVR5cGUpXVxuICAgICAgICBdKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBVQVBhcnNlciAodWEsIGV4dGVuc2lvbnMsIGhlYWRlcnMpIHtcblxuICAgICAgICBpZiAodHlwZW9mIHVhID09PSBPQkpfVFlQRSkge1xuICAgICAgICAgICAgaWYgKGlzRXh0ZW5zaW9ucyh1YSwgdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGV4dGVuc2lvbnMgPT09IE9CSl9UWVBFKSB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnMgPSBleHRlbnNpb25zOyAgICAgICAgICAgICAgIC8vIGNhc2UgVUFQYXJzZXIoZXh0ZW5zaW9ucywgaGVhZGVycykgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBleHRlbnNpb25zID0gdWE7ICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FzZSBVQVBhcnNlcihleHRlbnNpb25zKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzID0gdWE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FzZSBVQVBhcnNlcihoZWFkZXJzKVxuICAgICAgICAgICAgICAgIGV4dGVuc2lvbnMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1YSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdWEgPT09IFNUUl9UWVBFICYmICFpc0V4dGVuc2lvbnMoZXh0ZW5zaW9ucywgdHJ1ZSkpIHtcbiAgICAgICAgICAgIGhlYWRlcnMgPSBleHRlbnNpb25zOyAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FzZSBVQVBhcnNlcih1YSwgaGVhZGVycylcbiAgICAgICAgICAgIGV4dGVuc2lvbnMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb252ZXJ0IEhlYWRlcnMgb2JqZWN0IGludG8gYSBwbGFpbiBvYmplY3RcbiAgICAgICAgaWYgKGhlYWRlcnMgJiYgdHlwZW9mIGhlYWRlcnMuYXBwZW5kID09PSBGVU5DX1RZUEUpIHtcbiAgICAgICAgICAgIHZhciBrdiA9IHt9O1xuICAgICAgICAgICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uICh2LCBrKSB7IGt2W2tdID0gdjsgfSk7XG4gICAgICAgICAgICBoZWFkZXJzID0ga3Y7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBVQVBhcnNlcikpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVUFQYXJzZXIodWEsIGV4dGVuc2lvbnMsIGhlYWRlcnMpLmdldFJlc3VsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHVzZXJBZ2VudCA9IHR5cGVvZiB1YSA9PT0gU1RSX1RZUEUgPyB1YSA6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGFzc2VkIHVzZXItYWdlbnQgc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChoZWFkZXJzICYmIGhlYWRlcnNbVVNFUl9BR0VOVF0gPyBoZWFkZXJzW1VTRVJfQUdFTlRdIDogICAgIC8vIFVzZXItQWdlbnQgZnJvbSBwYXNzZWQgaGVhZGVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKE5BVklHQVRPUiAmJiBOQVZJR0FUT1IudXNlckFnZW50KSA/IE5BVklHQVRPUi51c2VyQWdlbnQgOiAvLyBuYXZpZ2F0b3IudXNlckFnZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFTVBUWSkpLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVtcHR5IHN0cmluZ1xuXG4gICAgICAgICAgICBodHRwVUFDSCA9IG5ldyBVQUNIRGF0YShoZWFkZXJzLCB0cnVlKSxcbiAgICAgICAgICAgIHJlZ2V4TWFwID0gZXh0ZW5zaW9ucyA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5kKGRlZmF1bHRSZWdleGVzLCBleHRlbnNpb25zKSA6IFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFJlZ2V4ZXMsXG5cbiAgICAgICAgICAgIGNyZWF0ZUl0ZW1GdW5jID0gZnVuY3Rpb24gKGl0ZW1UeXBlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1UeXBlID09IFVBX1JFU1VMVCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBVQUl0ZW0oaXRlbVR5cGUsIHVzZXJBZ2VudCwgcmVnZXhNYXAsIGh0dHBVQUNIKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldCgndWEnLCB1c2VyQWdlbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0KFVBX0JST1dTRVIsIHRoaXMuZ2V0QnJvd3NlcigpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldChVQV9DUFUsIHRoaXMuZ2V0Q1BVKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0KFVBX0RFVklDRSwgdGhpcy5nZXREZXZpY2UoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXQoVUFfRU5HSU5FLCB0aGlzLmdldEVuZ2luZSgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldChVQV9PUywgdGhpcy5nZXRPUygpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCgpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFVBSXRlbShpdGVtVHlwZSwgdXNlckFnZW50LCByZWdleE1hcFtpdGVtVHlwZV0sIGh0dHBVQUNIKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBhcnNlVUEoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCgpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICAgICAgc2V0UHJvcHMuY2FsbCh0aGlzLCBbXG4gICAgICAgICAgICBbJ2dldEJyb3dzZXInLCBjcmVhdGVJdGVtRnVuYyhVQV9CUk9XU0VSKV0sXG4gICAgICAgICAgICBbJ2dldENQVScsIGNyZWF0ZUl0ZW1GdW5jKFVBX0NQVSldLFxuICAgICAgICAgICAgWydnZXREZXZpY2UnLCBjcmVhdGVJdGVtRnVuYyhVQV9ERVZJQ0UpXSxcbiAgICAgICAgICAgIFsnZ2V0RW5naW5lJywgY3JlYXRlSXRlbUZ1bmMoVUFfRU5HSU5FKV0sXG4gICAgICAgICAgICBbJ2dldE9TJywgY3JlYXRlSXRlbUZ1bmMoVUFfT1MpXSxcbiAgICAgICAgICAgIFsnZ2V0UmVzdWx0JywgY3JlYXRlSXRlbUZ1bmMoVUFfUkVTVUxUKV0sXG4gICAgICAgICAgICBbJ2dldFVBJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gdXNlckFnZW50OyB9XSxcbiAgICAgICAgICAgIFsnc2V0VUEnLCBmdW5jdGlvbiAodWEpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNTdHJpbmcodWEpKVxuICAgICAgICAgICAgICAgICAgICB1c2VyQWdlbnQgPSB1YS5sZW5ndGggPiBVQV9NQVhfTEVOR1RIID8gdHJpbSh1YSwgVUFfTUFYX0xFTkdUSCkgOiB1YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1dXG4gICAgICAgIF0pXG4gICAgICAgIC5zZXRVQSh1c2VyQWdlbnQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIFVBUGFyc2VyLlZFUlNJT04gPSBMSUJWRVJTSU9OO1xuICAgIFVBUGFyc2VyLkJST1dTRVIgPSAgZW51bWVyaXplKFtOQU1FLCBWRVJTSU9OLCBNQUpPUiwgVFlQRV0pO1xuICAgIFVBUGFyc2VyLkNQVSA9IGVudW1lcml6ZShbQVJDSElURUNUVVJFXSk7XG4gICAgVUFQYXJzZXIuREVWSUNFID0gZW51bWVyaXplKFtNT0RFTCwgVkVORE9SLCBUWVBFLCBDT05TT0xFLCBNT0JJTEUsIFNNQVJUVFYsIFRBQkxFVCwgV0VBUkFCTEUsIEVNQkVEREVEXSk7XG4gICAgVUFQYXJzZXIuRU5HSU5FID0gVUFQYXJzZXIuT1MgPSBlbnVtZXJpemUoW05BTUUsIFZFUlNJT05dKTtcblxuICAgIGV4cG9ydCB7VUFQYXJzZXJ9OyIsImltcG9ydCBSZW1vdmVYIGZyb20gJy4veC5zdmcnXG5pbXBvcnQgQ2hldnJvblJpZ2h0IGZyb20gJy4vY2hldnJvbi1yaWdodC5zdmcnXG5cbmNvbnN0IElDT05TID0ge1xuICBSZW1vdmU6IFJlbW92ZVgsXG4gIENoZXZyb25SaWdodDogQ2hldnJvblJpZ2h0LFxufVxuXG5leHBvcnQgZGVmYXVsdCBJQ09OU1xuIiwiaW1wb3J0IHsgQWRJbmZvIH0gZnJvbSAnQC90eXBlcy9zZXJ2aWNlL2dldC1hZHMnXG5pbXBvcnQge1xuICBBVFRSSUJVVEVfQVVUT19BRF9QT1MsXG4gIEFUVFJJQlVURV9NQU5VQUxfQURfU0xPVCxcbiAgQVRUUklCVVRFX0FEX0ZPUk1BVCxcbiAgQURfQ0xBU1NFUyxcbiAgQVRUUklCVVRFX09WRVJMQVlfQURfUE9TLFxuICBBVFRSSUJVVEVfQURfUEFORUxfSUQsXG59IGZyb20gJy4uL2NvbnN0YW50cydcbmltcG9ydCB7IERPTSB9IGZyb20gJy4vZG9tJ1xuaW1wb3J0IHsgRXZlbnRTdWJzY3JpYmVyIH0gZnJvbSAnLi9ldmVudC1zdWJzY3JpYmVyJ1xuaW1wb3J0IHsgU2NyaXB0U2VydmljZSB9IGZyb20gJ0Avc2VydmljZXMnXG5pbXBvcnQgeyBJbnRlcmFjdEFkQm9keSB9IGZyb20gJ0AvdHlwZXMvc2VydmljZS9pbnRlcmFjdC1hZHMnXG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAnbG9kYXNoL3Rocm90dGxlJ1xuXG5leHBvcnQgY2xhc3MgQWRVbml0IHtcbiAgaWQ6IHN0cmluZ1xuICB0eXBlOiBUSW5zXG4gIHVuaXRNZXRhZGF0YTpcbiAgICB8IHtcbiAgICAgICAgaWRTbG90OiBzdHJpbmdcbiAgICAgICAgLy8gaWRDbGllbnQ6IHN0cmluZ1xuICAgICAgfVxuICAgIHwge1xuICAgICAgICBmb3JtYXQ6IHN0cmluZ1xuICAgICAgICBwb3NpdGlvbjogc3RyaW5nXG4gICAgICB9XG4gIGlzVmVyaWZpZWQ6IGJvb2xlYW5cbiAgZGF0YTogQWRJbmZvIHwgbnVsbFxuICBub2RlOiBIVE1MRWxlbWVudFxuXG4gIGRvbTogRE9NXG4gIHNlcnZpY2U6IFNjcmlwdFNlcnZpY2VcblxuICBldmVudHM6IEV2ZW50U3Vic2NyaWJlciB8IG51bGxcbiAgaGFzQ2hlY2tJbXByZXNzaW9uOiBib29sZWFuXG4gIGhhc0NoZWNrVmlld2VkOiBib29sZWFuXG5cbiAgY29uc3RydWN0b3IoZWw6IEhUTUxFbGVtZW50LCB0eXBlOiBUSW5zKSB7XG4gICAgLy8gVE9ETyA9IG5lZWQgdG8gcmVzb2x2ZSB0aGlzIGlkIHByb3BlcnR5XG4gICAgdGhpcy5pZCA9ICcnXG4gICAgdGhpcy50eXBlID0gdHlwZVxuICAgIGlmICh0eXBlID09PSAnbWFudWFsJykge1xuICAgICAgdGhpcy51bml0TWV0YWRhdGEgPSB7XG4gICAgICAgIGlkU2xvdDogZWwuZ2V0QXR0cmlidXRlKEFUVFJJQlVURV9NQU5VQUxfQURfU0xPVCkgPz8gJycsXG4gICAgICAgIC8vIGlkQ2xpZW50OiBpbnNFbC5nZXRBdHRyaWJ1dGUoQVRUUklCVVRFX01BTlVBTF9BRF9DTElFTlQpID8/ICcnLFxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2F1dG8nKSB7XG4gICAgICB0aGlzLnVuaXRNZXRhZGF0YSA9IHtcbiAgICAgICAgZm9ybWF0OiBlbC5nZXRBdHRyaWJ1dGUoQVRUUklCVVRFX0FEX0ZPUk1BVCkgfHwgJycsXG4gICAgICAgIHBvc2l0aW9uOiBlbC5nZXRBdHRyaWJ1dGUoQVRUUklCVVRFX0FVVE9fQURfUE9TKSB8fCAnJyxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdHlwZSA9PT0gJ292ZXJsYXknXG4gICAgICB0aGlzLnVuaXRNZXRhZGF0YSA9IHtcbiAgICAgICAgZm9ybWF0OiBlbC5nZXRBdHRyaWJ1dGUoQVRUUklCVVRFX0FEX0ZPUk1BVCkgfHwgJycsXG4gICAgICAgIHBvc2l0aW9uOiBlbC5nZXRBdHRyaWJ1dGUoQVRUUklCVVRFX09WRVJMQVlfQURfUE9TKSB8fCAnJyxcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmRhdGEgPSBudWxsXG4gICAgdGhpcy5pc1ZlcmlmaWVkID0gZmFsc2VcbiAgICB0aGlzLm5vZGUgPSBlbFxuXG4gICAgdGhpcy5kb20gPSBuZXcgRE9NKClcbiAgICB0aGlzLnNlcnZpY2UgPSBuZXcgU2NyaXB0U2VydmljZSgpXG5cbiAgICB0aGlzLmV2ZW50cyA9IG51bGxcbiAgICB0aGlzLmhhc0NoZWNrSW1wcmVzc2lvbiA9IGZhbHNlXG4gICAgdGhpcy5oYXNDaGVja1ZpZXdlZCA9IGZhbHNlXG4gIH1cblxuICAvLyBUT0RPOiBjYWxsIGFwaSB0byB2ZXJpZnkgdGhlIGFkIHVuaXRcbiAgLy8gdmVyaWZ5ID0gYXN5bmMgKCkgPT4ge1xuICAvLyAgIC8vIEfhu41pIGzDqm4gc2VydmVyIMSR4buDIGtp4buDbSB0cmEgZOG7ryBsaeG7h3VcbiAgLy8gICB0cnkge1xuICAvLyAgICAgLy8gZm9yIG5vdywgcHJldGVuZCB0aGlzIGlzIGFsd2F5cyB0cnVlXG4gIC8vICAgICB0aGlzLmlzVmVyaWZpZWQgPSB0cnVlXG4gIC8vICAgICByZXR1cm4gdHJ1ZVxuICAvLyAgIH0gY2F0Y2ggKGUpIHtcbiAgLy8gICAgIGNvbnNvbGUuZXJyb3IoYHZlcmlmeSAke2V9YClcbiAgLy8gICAgIHJldHVybiBmYWxzZVxuICAvLyAgIH1cbiAgLy8gfVxuXG4gIGF0dGFjaEV2ZW50ID0gKFxuICAgIGV2ZW50VHlwZToga2V5b2YgSFRNTEVsZW1lbnRFdmVudE1hcCxcbiAgICBjYWxsYmFjazogRXZlbnRMaXN0ZW5lcixcbiAgKSA9PiB7XG4gICAgaWYgKCF0aGlzLmV2ZW50cykgcmV0dXJuXG5cbiAgICB0aGlzLmV2ZW50cy5zdWJzY3JpYmUoZXZlbnRUeXBlLCBjYWxsYmFjaylcbiAgfVxuXG4gIHNldHVwRXZlbnRzID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5ub2RlKSByZXR1cm5cbiAgICBjb25zdCBhZENvbnRhaW5lciA9IHRoaXMubm9kZS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcbiAgICAgIHRoaXMudHlwZSA9PT0gJ292ZXJsYXknXG4gICAgICAgID8gYCYgPiAuJHtBRF9DTEFTU0VTLkRJQUxPR19DT05UQUlORVJ9YFxuICAgICAgICA6IGAmID4gLiR7QURfQ0xBU1NFUy5DT05UQUlORVJ9YCxcbiAgICApXG4gICAgaWYgKCFhZENvbnRhaW5lcikgcmV0dXJuXG4gICAgdGhpcy5ldmVudHMgPSBuZXcgRXZlbnRTdWJzY3JpYmVyKGFkQ29udGFpbmVyKVxuXG4gICAgLy8gVE9ETzogdXNlIGRlYm91bmNlL3Rocm90dGxlIHRvIGFjdCBhcyByYXRlLWxpbWl0IG1lYXN1cmU/XG4gICAgY29uc3QgVEhST1RUTEVfV0FJVF9USU1FID0gMjAwXG4gICAgY29uc3QgYWN0aW9uVGhyb3R0bGVkID0gdGhyb3R0bGUoYXN5bmMgKGJvZHk6IEludGVyYWN0QWRCb2R5KSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLnNlcnZpY2UuaW50ZXJhY3RBZChib2R5KVxuICAgICAgICBpZiAocmVzLmRhdGEuc3RhdHVzID09PSAnZmFpbCcpIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcihyZXMuZGF0YS5tZXNzYWdlKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXMuZGF0YS5kYXRhXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFUlJPUicsIGVycm9yKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgIH0sIFRIUk9UVExFX1dBSVRfVElNRSlcblxuICAgIC8vIHNldHVwIGludGVyc2VjdGlvbiBvYnNlcnZlclxuICAgIGNvbnN0IG9ic2VydmVyQ2FsbGJhY2sgPSAocGF5bG9hZDogSW50ZXJzZWN0aW9uT2JzZXJ2ZXJFbnRyeVtdKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkVHJnID0gcGF5bG9hZFswXVxuXG4gICAgICBjb25zdCB0YXJnZXROYW1lID1cbiAgICAgICAgdGhpcy5ub2RlLmdldEF0dHJpYnV0ZShBVFRSSUJVVEVfTUFOVUFMX0FEX1NMT1QpIHx8XG4gICAgICAgIHRoaXMubm9kZS5nZXRBdHRyaWJ1dGUoQVRUUklCVVRFX0FVVE9fQURfUE9TKSB8fFxuICAgICAgICB0aGlzLm5vZGUuZ2V0QXR0cmlidXRlKEFUVFJJQlVURV9PVkVSTEFZX0FEX1BPUylcblxuICAgICAgaWYgKCF0aGlzLmRhdGEgfHwgKHRoaXMuaGFzQ2hlY2tJbXByZXNzaW9uICYmIHRoaXMuaGFzQ2hlY2tWaWV3ZWQpKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzPy5zdG9wT2JzZXJ2ZXIoKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmhhc0NoZWNrSW1wcmVzc2lvbikge1xuICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXROYW1lLCAnaGFzIGltcHJlc3Npb24nKVxuICAgICAgICBhY3Rpb25UaHJvdHRsZWQoe1xuICAgICAgICAgIGFjdGlvbl90eXBlOiAnaW1wcmVzc2lvbicsXG4gICAgICAgICAgYWRfcGFuZWxfaWQ6IHRoaXMuZGF0YS5pZCxcbiAgICAgICAgfSkudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgdGhpcy5oYXNDaGVja0ltcHJlc3Npb24gPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLmhhc0NoZWNrVmlld2VkICYmXG4gICAgICAgIHBheWxvYWRUcmcuaXNJbnRlcnNlY3RpbmcgJiZcbiAgICAgICAgcGF5bG9hZFRyZy5pbnRlcnNlY3Rpb25SYXRpbyA+PSAwLjc1XG4gICAgICApIHtcbiAgICAgICAgY29uc29sZS5sb2codGFyZ2V0TmFtZSwgJ2hhcyB2aWV3JylcbiAgICAgICAgYWN0aW9uVGhyb3R0bGVkKHtcbiAgICAgICAgICBhY3Rpb25fdHlwZTogJ3ZpZXcnLFxuICAgICAgICAgIGFkX3BhbmVsX2lkOiB0aGlzLmRhdGEuaWQsXG4gICAgICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgIHRoaXMuaGFzQ2hlY2tWaWV3ZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmV2ZW50cy5zdGFydE9ic2VydmVyKG9ic2VydmVyQ2FsbGJhY2spXG5cbiAgICAvLyBhdHRhY2ggb25DbGljayBldmVudFxuICAgIHRoaXMuYXR0YWNoRXZlbnQoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmRhdGEpIHJldHVyblxuXG4gICAgICBhY3Rpb25UaHJvdHRsZWQoe1xuICAgICAgICBhY3Rpb25fdHlwZTogJ2NsaWNrJyxcbiAgICAgICAgYWRfcGFuZWxfaWQ6IHRoaXMuZGF0YS5pZCxcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGF0dGFjaEFkID0gKHZhbHVlOiBBZEluZm8sIHR5cGU6IE1lZGlhVHlwZSkgPT4ge1xuICAgIGlmICghdGhpcy5ub2RlKSByZXR1cm5cblxuICAgIC8vIGNvbnN0cnVjdCB0aGUgY29udGVudCBpbnNpZGVcbiAgICBsZXQgY29udGFpbmVyID0gdGhpcy5ub2RlLnF1ZXJ5U2VsZWN0b3IoYCYgPiAuJHtBRF9DTEFTU0VTLkNPTlRBSU5FUn1gKVxuICAgIGlmICghY29udGFpbmVyKSB7XG4gICAgICBjb25zdCBpbnBhZ2VQb3MgPSB0aGlzLm5vZGUuZ2V0QXR0cmlidXRlKEFUVFJJQlVURV9BVVRPX0FEX1BPUylcbiAgICAgIGlmIChpbnBhZ2VQb3MgJiYgaW5wYWdlUG9zLmluY2x1ZGVzKCdzaWRlYmFyJykpIHtcbiAgICAgICAgY29udGFpbmVyID0gdGhpcy5kb20uaW5zLmNyZWF0ZUFkQ29udGFpbmVyKHtcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIG1heFdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgaGVpZ2h0OiAnYXV0bycsXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250YWluZXIgPSB0aGlzLmRvbS5pbnMuY3JlYXRlQWRDb250YWluZXIoe1xuICAgICAgICAgIHdpZHRoOiAnYXV0bycsXG4gICAgICAgICAgaGVpZ2h0OiAnMjQwcHgnLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBvdXRlcldyYXBwZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgIGAmID4gLiR7QURfQ0xBU1NFUy5PVVRFUl9XUkFQUEVSfWAsXG4gICAgKVxuICAgIGlmICghb3V0ZXJXcmFwcGVyKSB7XG4gICAgICBvdXRlcldyYXBwZXIgPSB0aGlzLmRvbS5pbnMuY3JlYXRlT3V0ZXJBZFdyYXBwZXIoKVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG91dGVyV3JhcHBlcilcbiAgICB9XG4gICAgY29uc3QgYWRDaGlsZCA9IG91dGVyV3JhcHBlci5xdWVyeVNlbGVjdG9yKFxuICAgICAgYCYgPiA6bm90KC4ke0FEX0NMQVNTRVMuSU5ESUNBVE9SX1NQQU59KWAsXG4gICAgKVxuICAgIGlmIChhZENoaWxkKSBhZENoaWxkLnJlbW92ZSgpXG5cbiAgICBpZiAodHlwZSA9PT0gJ2ltYWdlJykge1xuICAgICAgY29uc3QgYWQgPSB0aGlzLmRvbS5pbnMuY3JlYXRlSW1hZ2VBZCh2YWx1ZSlcbiAgICAgIG91dGVyV3JhcHBlci5hcHBlbmRDaGlsZChhZClcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd2aWRlbycpIHtcbiAgICAgIC8vIFRPRE86IHZpZGVvIGFkcyBmb3JtYXRcbiAgICB9XG5cbiAgICAvLyBzZXQgdGhlIGRhdGFcbiAgICB0aGlzLmRhdGEgPSB2YWx1ZVxuICAgIHRoaXMuaWQgPSB2YWx1ZS5pZFxuICAgIHRoaXMubm9kZS5hcHBlbmQoY29udGFpbmVyKVxuICAgIHRoaXMubm9kZS5zZXRBdHRyaWJ1dGUoQVRUUklCVVRFX0FEX1BBTkVMX0lELCB2YWx1ZS5pZClcbiAgfVxuXG4gIGF0dGFjaE92ZXJsYXlBZCA9ICh2YWx1ZTogQWRJbmZvLCB0eXBlOiBNZWRpYVR5cGUpID0+IHtcbiAgICBpZiAoIXRoaXMubm9kZSkgcmV0dXJuXG5cbiAgICAvLyBjb25zdHJ1Y3QgdGhlIGNvbnRlbnQgaW5zaWRlXG4gICAgY29uc3QgY2xvc2VIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5ub2RlXG4gICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgIC8vIHNldCB0aGUgYWQgZGlzcGxheSB0byBub25lIGZvciBub3dcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgY29udGFpbmVyLmhpZGRlbiA9IHRydWVcbiAgICAgICAgLy8gdGhpcy5yZW1vdmVGcm9tT3ZlcmxheUVscyhjb250YWluZXIpXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgYWREaWFsb2cgPSB0aGlzLmRvbS5vdmVybGF5LmNyZWF0ZU92ZXJsYXlEaWFsb2dDb250YWluZXIoXG4gICAgICAnbm8tbG9nbycsXG4gICAgICB2YWx1ZSxcbiAgICAgIGNsb3NlSGFuZGxlcixcbiAgICApXG5cbiAgICAvLyBzZXQgdGhlIGRhdGFcbiAgICB0aGlzLmRhdGEgPSB2YWx1ZVxuICAgIHRoaXMuaWQgPSB2YWx1ZS5pZFxuICAgIHRoaXMubm9kZS5hcHBlbmQoYWREaWFsb2cpXG4gICAgdGhpcy5ub2RlLnNldEF0dHJpYnV0ZShBVFRSSUJVVEVfQURfUEFORUxfSUQsIHZhbHVlLmlkKVxuICB9XG59XG4iLCJpbXBvcnQgeyBnZXRBdXRvSW5zUXVlcnksIGdldERlZmluZWRBZFNpemUsIGdldE1hbnVhbEluc1F1ZXJ5IH0gZnJvbSAnLi4vdXRpbHMnXG5pbXBvcnQgeyBET00gfSBmcm9tICcuL2RvbSdcbmltcG9ydCB7IEFkVW5pdCB9IGZyb20gJy4vYWQtdW5pdCdcbmltcG9ydCB7IFNjcmlwdFNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcydcbmltcG9ydCB7XG4gIEFUVFJJQlVURV9BVVRPX0FEX1BPUyxcbiAgQVRUUklCVVRFX01BTlVBTF9BRF9TTE9ULFxuICBERUZBVUxUX0ZFVENIX0FEU19JTlRFUlZBTCxcbn0gZnJvbSAnQC9jb25zdGFudHMnXG5pbXBvcnQgeyBHZXRBZHNCb2R5IH0gZnJvbSAnQC90eXBlcy9zZXJ2aWNlL2dldC1hZHMnXG5pbXBvcnQgeyBBZFJhdGlvIH0gZnJvbSAnQC90eXBlcy9lbnVtJ1xuaW1wb3J0IHsgVHJhY2tlciB9IGZyb20gJy4vdHJhY2tlcidcblxuZXhwb3J0IGNsYXNzIEFkc01hbmFnZXIge1xuICBzdGF0aWMgaW5zdGFuY2U6IEFkc01hbmFnZXJcbiAgcHJpdmF0ZSBkb20hOiBET01cbiAgcHJpdmF0ZSBzZXJ2aWNlITogU2NyaXB0U2VydmljZVxuICBwcml2YXRlIHRyYWNrZXIhOiBUcmFja2VyXG5cbiAgcHJpdmF0ZSBpZEZldGNoSW50ZXJ2YWw6IFJldHVyblR5cGU8dHlwZW9mIHNldEludGVydmFsPiB8IG51bGwgPSBudWxsXG4gIHByaXZhdGUgYXV0b0FkczogQWRVbml0W10gPSBbXVxuICBwcml2YXRlIG92ZXJsYXlBZHM6IEFkVW5pdFtdID0gW11cbiAgcHJpdmF0ZSBtYW51YWxBZHM6IEFkVW5pdFtdID0gW11cbiAgcHJpdmF0ZSBpc01vYmlsZTogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLy8gPyB3aHkgbm90IHVzZSBkZWZhdWx0IHZhbHVlP1xuICBwcml2YXRlIGNvbmZpZzogSU1hbmFnZXJDb25maWcgPSB7XG4gICAgdmlzaWJsZUhlYWRlclRvcDogZmFsc2UsXG4gICAgdmlzaWJsZUhlYWRlckJvdHRvbTogdHJ1ZSxcblxuICAgIHZpc2libGVGb290ZXJUb3A6IHRydWUsXG4gICAgdmlzaWJsZUZvb3RlckJvdHRvbTogZmFsc2UsXG5cbiAgICB2aXNpYmxlQ29udGVudFRvcDogdHJ1ZSxcbiAgICB2aXNpYmxlQ29udGVudE1pZGRsZTogdHJ1ZSxcbiAgICB2aXNpYmxlQ29udGVudEJvdHRvbTogdHJ1ZSxcblxuICAgIHZpc2libGVTaWRlYmFyTGVmdFRvcDogdHJ1ZSxcbiAgICB2aXNpYmxlU2lkZWJhckxlZnRCb3R0b206IHRydWUsXG5cbiAgICB2aXNpYmxlU2lkZWJhclJpZ2h0VG9wOiB0cnVlLFxuICAgIHZpc2libGVTaWRlYmFyUmlnaHRCb3R0b206IHRydWUsXG5cbiAgICBhbmNob3JUb3A6IHRydWUsXG4gICAgYW5jaG9yQm90dG9tOiB0cnVlLFxuICAgIHNpZGVSYWlsTGVmdDogdHJ1ZSxcbiAgICBzaWRlUmFpbFJpZ2h0OiB0cnVlLFxuICAgIGRpYWxvZ0NlbnRlcjogdHJ1ZSxcbiAgICBub3RpZmljYXRpb25Db3JuZXI6IHRydWUsXG5cbiAgICAvLyBjaGFuZ2UgdGhpcyB3aXRoIERFRkFVTFRfRkVUQ0hfQURTX0lOVEVSVkFMXG4gICAgZmV0Y2hJbnRlcnZhbDogREVGQVVMVF9GRVRDSF9BRFNfSU5URVJWQUwsXG4gICAgbWF4QWRzOiAxMCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKF9jb25maWc/OiBJTWFuYWdlckNvbmZpZykge1xuICAgIGlmICghQWRzTWFuYWdlci5pbnN0YW5jZSkge1xuICAgICAgY29uc29sZS5sb2coJ25ldyBpbnN0YW5jZSBBZHNNYW5hZ2VyISEhJylcbiAgICAgIGlmIChfY29uZmlnKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gX2NvbmZpZ1xuICAgICAgfVxuICAgICAgQWRzTWFuYWdlci5pbnN0YW5jZSA9IHRoaXNcbiAgICAgIHRoaXMuZG9tID0gbmV3IERPTSgpXG4gICAgICB0aGlzLnRyYWNrZXIgPSBuZXcgVHJhY2tlcigpXG4gICAgICB0aGlzLnNlcnZpY2UgPSBuZXcgU2NyaXB0U2VydmljZSgpXG4gICAgfVxuICAgIHJldHVybiBBZHNNYW5hZ2VyLmluc3RhbmNlXG4gIH1cblxuICBnZXQgaGFzTWF4QWRzKCkge1xuICAgIHJldHVybiB0aGlzLmRvbS5pbnNFbHMubGVuZ3RoID49IHRoaXMuY29uZmlnLm1heEFkc1xuICB9XG5cbiAgLy8gVE9ETzogcmVmcmVzaCBhZFxuICBwcml2YXRlIHJlZnJlc2hBZHNCeUludGVydmFsID0gKCkgPT4ge1xuICAgIGlmICghKHRoaXMuY29uZmlnLmZldGNoSW50ZXJ2YWwgPiAwKSkgcmV0dXJuXG5cbiAgICB0aGlzLmlkRmV0Y2hJbnRlcnZhbCA9IHNldEludGVydmFsKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGF1dG9JbnMgPSB0aGlzLmF1dG9BZHMubWFwKCh1bml0KSA9PiB1bml0Lm5vZGUpXG4gICAgICBjb25zdCBtYW51YWxJbnMgPSB0aGlzLm1hbnVhbEFkcy5tYXAoKHVuaXQpID0+IHVuaXQubm9kZSlcblxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuZmV0Y2hBZHMoe1xuICAgICAgICBhdXRvOiBhdXRvSW5zLFxuICAgICAgICBtYW51YWw6IG1hbnVhbElucyxcbiAgICAgIH0pXG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICAvLyBhdXRvIGFkc1xuICAgICAgICBpZiAoZGF0YS5zbG90X2luZm9fcGFuZWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLmF1dG9BZHMuZm9yRWFjaCgodW5pdCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFkRGF0YSA9IGRhdGEuc2xvdF9pbmZvX3BhbmVsc1tpbmRleF1cbiAgICAgICAgICAgIHVuaXQuYXR0YWNoQWQoYWREYXRhLCAnaW1hZ2UnKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgLy8gbWFudWFsIGFkc1xuICAgICAgICBpZiAoZGF0YS5hZF91bml0X3BhbmVscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5tYW51YWxBZHMuZm9yRWFjaCgodW5pdCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFkRGF0YSA9IGRhdGEuYWRfdW5pdF9wYW5lbHNbaW5kZXhdXG4gICAgICAgICAgICB1bml0LmF0dGFjaEFkKGFkRGF0YSwgJ2ltYWdlJylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcy5jb25maWcuZmV0Y2hJbnRlcnZhbClcbiAgfVxuXG4gIC8vIHByaXZhdGUgYWRkQWRVbml0ID0gKHZhbHVlOiBBZFVuaXQsIHR5cGU6IFRJbnMpID0+IHtcbiAgLy8gICBpZiAodHlwZSA9PT0gJ2F1dG8nKSB7XG4gIC8vICAgICB0aGlzLmF1dG9BZHMucHVzaCh7XG4gIC8vICAgICAgIC4uLnZhbHVlLFxuICAvLyAgICAgfSlcbiAgLy8gICB9IGVsc2Uge1xuICAvLyAgICAgdGhpcy5tYW51YWxBZHMucHVzaCh7XG4gIC8vICAgICAgIC4uLnZhbHVlLFxuICAvLyAgICAgfSlcbiAgLy8gICB9XG4gIC8vIH1cblxuICBwcml2YXRlIGZldGNoQWRzID0gYXN5bmMgKF9kYXRhOiB7XG4gICAgYXV0bz86IEhUTUxFbGVtZW50W11cbiAgICBtYW51YWw/OiBIVE1MRWxlbWVudFtdXG4gIH0pID0+IHtcbiAgICBjb25zdCB7IGF1dG8sIG1hbnVhbCB9ID0gX2RhdGFcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keTogR2V0QWRzQm9keSA9IHt9XG4gICAgICBjb25zdCBwbGF0Zm9ybV9zbG90X2luZm8gPSBhdXRvPy5tYXAoKGEpID0+IHtcbiAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgIGNvbnN0IGlucGFnZVBvcyA9IGEuZ2V0QXR0cmlidXRlKEFUVFJJQlVURV9BVVRPX0FEX1BPUylcbiAgICAgICAgaWYgKGlucGFnZVBvcyAmJiBpbnBhZ2VQb3MuaW5jbHVkZXMoJ3NpZGViYXInKSkge1xuICAgICAgICAgIGNvbnN0IHNpemUgPSBnZXREZWZpbmVkQWRTaXplKHdpZHRoLCB3aWR0aCAqIEFkUmF0aW8uUk9XX1JFQ1QpXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdpZHRoOiBNYXRoLnJvdW5kKHNpemUud2lkdGgpLFxuICAgICAgICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKHNpemUuaGVpZ2h0KSxcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3Qgc2l6ZSA9IGdldERlZmluZWRBZFNpemUod2lkdGgsIGhlaWdodClcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGg6IE1hdGgucm91bmQoc2l6ZS53aWR0aCksXG4gICAgICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQoc2l6ZS5oZWlnaHQpLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNvbnN0IGFkX3VuaXRfaWRzID0gbWFudWFsPy5tYXAoKG0pID0+IHtcbiAgICAgICAgcmV0dXJuIG0uZ2V0QXR0cmlidXRlKEFUVFJJQlVURV9NQU5VQUxfQURfU0xPVCkhXG4gICAgICB9KVxuICAgICAgaWYgKHBsYXRmb3JtX3Nsb3RfaW5mbykgYm9keS5wbGF0Zm9ybV9zbG90X2luZm8gPSBwbGF0Zm9ybV9zbG90X2luZm9cbiAgICAgIGlmIChhZF91bml0X2lkcykgYm9keS5hZF91bml0X2lkcyA9IGFkX3VuaXRfaWRzXG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5zZXJ2aWNlLmdldEFkcyhib2R5KVxuICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuc3RhdHVzID09PSAnZmFpbCcpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IocmVzcG9uc2UuZGF0YS5tZXNzYWdlKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEuZGF0YVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvcicsIGVycm9yKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBvcHVsYXRlQWRzID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG1hbnVhbElucyA9IEFycmF5LmZyb20oXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihnZXRNYW51YWxJbnNRdWVyeSgpKSxcbiAgICApXG4gICAgY29uc3QgYXV0b0lucyA9IEFycmF5LmZyb20oXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihnZXRBdXRvSW5zUXVlcnkoKSksXG4gICAgKVxuXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuZmV0Y2hBZHMoe1xuICAgICAgYXV0bzogYXV0b0lucyxcbiAgICAgIG1hbnVhbDogbWFudWFsSW5zLFxuICAgIH0pXG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIC8vIHNldCB2aXNpdF9pZCBmb3IgdHJhY2tlclxuICAgICAgdGhpcy50cmFja2VyLnZpc2l0SWQgPSBkYXRhLnZpc2l0X2lkXG4gICAgICAvLyBjcmVhdGUgYXV0byBhZHNcbiAgICAgIGlmIChkYXRhLnNsb3RfaW5mb19wYW5lbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhdXRvSW5zLmZvckVhY2goKGlucywgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBhZFVuaXQgPSBuZXcgQWRVbml0KGlucywgJ2F1dG8nKVxuICAgICAgICAgIC8vIGF0dGFjaCBkYXRhXG4gICAgICAgICAgY29uc3QgYWREYXRhID0gZGF0YS5zbG90X2luZm9fcGFuZWxzW2luZGV4XVxuICAgICAgICAgIGFkVW5pdC5hdHRhY2hBZChhZERhdGEsICdpbWFnZScpXG4gICAgICAgICAgLy8gc2V0dXAgZXZlbnRzXG4gICAgICAgICAgYWRVbml0LnNldHVwRXZlbnRzKClcbiAgICAgICAgICAvLyBhZGQgYWRVbml0IHRvIGFycmF5IHRvIG1hbmFnZVxuICAgICAgICAgIHRoaXMuYXV0b0Fkcy5wdXNoKGFkVW5pdClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIC8vIGNyZWF0ZSBtYW51YWwgYWRzXG4gICAgICBpZiAoZGF0YS5hZF91bml0X3BhbmVscy5sZW5ndGggPiAwKSB7XG4gICAgICAgIG1hbnVhbElucy5mb3JFYWNoKChpbnMsIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3QgYWRVbml0ID0gbmV3IEFkVW5pdChpbnMsICdtYW51YWwnKVxuICAgICAgICAgIC8vIGF0dGFjaCBkYXRhXG4gICAgICAgICAgY29uc3QgYWREYXRhID0gZGF0YS5hZF91bml0X3BhbmVsc1tpbmRleF1cbiAgICAgICAgICBhZFVuaXQuYXR0YWNoQWQoYWREYXRhLCAnaW1hZ2UnKVxuICAgICAgICAgIC8vIHNldHVwIGV2ZW50c1xuICAgICAgICAgIGFkVW5pdC5zZXR1cEV2ZW50cygpXG4gICAgICAgICAgLy8gYWRkIGFkVW5pdCB0byBhcnJheSB0byBtYW5hZ2VcbiAgICAgICAgICB0aGlzLm1hbnVhbEFkcy5wdXNoKGFkVW5pdClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyYXZlcnNlUGFnZSgpIHtcbiAgICAvLyBUT0RPOiByZW1lbWJlciB0byByZW1vdmUgdGhpc1xuICAgIC8vIGNvbnNvbGUuY2xlYXIoKVxuXG4gICAgLy8gRklSU1QsIE1VU1QgTE9PSyBGT1IgQVBQQk9EWVxuICAgIGNvbnN0IGFwcEJvZHkgPSB0aGlzLmRvbS5maW5kSW5uZXJBcHBDb250YWluZXIoKVxuICAgIGNvbnNvbGUubG9nKCdhcHBCb2R5JywgYXBwQm9keSlcbiAgICB0aGlzLmRvbS5hcHBCb2R5RWwgPSBhcHBCb2R5XG5cbiAgICAvLyBGSU5EIEhFQURFUiBBTkQgRk9PVEVSIFVTSU5HIHF1ZXJ5U2VsZWN0b3JBbGwoKVxuICAgIGNvbnN0IGhlYWRlciA9IHRoaXMuZG9tLmhlYWRlci5maW5kSGVhZGVyKGFwcEJvZHkpXG4gICAgY29uc29sZS5sb2coJ2hlYWRlcicsIGhlYWRlcilcbiAgICB0aGlzLmRvbS5oZWFkZXJFbCA9IGhlYWRlclxuICAgIGNvbnN0IGZvb3RlciA9IHRoaXMuZG9tLmZvb3Rlci5maW5kRm9vdGVyKGFwcEJvZHkpXG4gICAgY29uc29sZS5sb2coJ2Zvb3RlcicsIGZvb3RlcilcbiAgICB0aGlzLmRvbS5mb290ZXJFbCA9IGZvb3RlclxuXG4gICAgLy8gTkVYVCwgREVURVJNSU5FIFRIRSBNQUlOIENPTlRBSU5FUlxuICAgIC8vIFdISUNIIENPTlRBSU5TIEEgQ09OVEVOVCBBTkQgUEVSSEFQIFNJREVCQVJTXG4gICAgY29uc3QgbWFpbkNvbnRhaW5lciA9IHRoaXMuZG9tLmNvbnRlbnQuZmluZE1haW5Db250YWluZXJFbGVtZW50KGFwcEJvZHkpXG4gICAgdGhpcy5kb20ubWFpbkVsID0gbWFpbkNvbnRhaW5lclxuICAgIGNvbnNvbGUubG9nKCdtYWluQ29udGFpbmVyJywgbWFpbkNvbnRhaW5lcilcbiAgICBjb25zdCB7XG4gICAgICBjb250ZW50OiBjb250ZW50Q29udGFpbmVyLFxuICAgICAgc2lkZWJhckxlZnQ6IHNpZGViYXJMZWZ0Q29udGFpbmVyLFxuICAgICAgc2lkZWJhclJpZ2h0OiBzaWRlYmFyUmlnaHRDb250YWluZXIsXG4gICAgfSA9IHRoaXMuZG9tLmNvbnRlbnQuZmluZENvbnRlbnRDb250YWluZXIobWFpbkNvbnRhaW5lciwgbnVsbCwgbnVsbClcbiAgICB0aGlzLmRvbS5jb250ZW50RWwgPSBjb250ZW50Q29udGFpbmVyXG4gICAgY29uc29sZS5sb2coJ2NvbnRlbnRDb250YWluZXInLCBjb250ZW50Q29udGFpbmVyKVxuXG4gICAgY29uc3Qge1xuICAgICAgc2lkZWJhckxlZnQ6IG5ld1NpZGViYXJMZWZ0Q29udGFpbmVyLFxuICAgICAgc2lkZWJhclJpZ2h0OiBuZXdTaWRlYmFyUmlnaHRDb250YWluZXIsXG4gICAgfSA9IHRoaXMuZG9tLnNpZGViYXIuZmluZFNpZGViYXJDb250YWluZXIobWFpbkNvbnRhaW5lcilcbiAgICBjb25zdCBzaWRlYmFyTGVmdCA9IHNpZGViYXJMZWZ0Q29udGFpbmVyIHx8IG5ld1NpZGViYXJMZWZ0Q29udGFpbmVyXG4gICAgY29uc29sZS5sb2coJ3NpZGViYXJMZWZ0Jywgc2lkZWJhckxlZnRDb250YWluZXIsIG5ld1NpZGViYXJMZWZ0Q29udGFpbmVyKVxuICAgIGlmIChzaWRlYmFyTGVmdCkge1xuICAgICAgdGhpcy5kb20uc2lkZWJhckxlZnRFbCA9IHRoaXMuZG9tLnNpZGViYXIuZmluZFNpZGViYXJXcmFwcGVyKHNpZGViYXJMZWZ0KVxuICAgIH1cbiAgICBjb25zdCBzaWRlYmFyUmlnaHQgPSBzaWRlYmFyUmlnaHRDb250YWluZXIgfHwgbmV3U2lkZWJhclJpZ2h0Q29udGFpbmVyXG4gICAgY29uc29sZS5sb2coJ3NpZGViYXJSaWdodCcsIHNpZGViYXJSaWdodENvbnRhaW5lciwgbmV3U2lkZWJhclJpZ2h0Q29udGFpbmVyKVxuICAgIGlmIChzaWRlYmFyUmlnaHQpIHtcbiAgICAgIHRoaXMuZG9tLnNpZGViYXJSaWdodEVsID1cbiAgICAgICAgdGhpcy5kb20uc2lkZWJhci5maW5kU2lkZWJhcldyYXBwZXIoc2lkZWJhclJpZ2h0KVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5zZXJ0SW5zVG9Cb2R5KCkge1xuICAgIGlmICghdGhpcy5oYXNNYXhBZHMgJiYgdGhpcy5jb25maWcudmlzaWJsZUhlYWRlckJvdHRvbSkge1xuICAgICAgdGhpcy5kb20uaW5zZXJ0VG9IZWFkZXIoYGhlYWRlci1ib3R0b21gKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5oYXNNYXhBZHMgJiYgdGhpcy5jb25maWcudmlzaWJsZUZvb3RlclRvcCkge1xuICAgICAgdGhpcy5kb20uaW5zZXJ0VG9Gb290ZXIoYGZvb3Rlci10b3BgKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5oYXNNYXhBZHMgJiYgdGhpcy5jb25maWcudmlzaWJsZUNvbnRlbnRNaWRkbGUpIHtcbiAgICAgIHRoaXMuZG9tLmluc2VydFRvQ29udGVudChgY29udGVudC1taWRkbGVgKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5oYXNNYXhBZHMgJiYgdGhpcy5jb25maWcudmlzaWJsZVNpZGViYXJMZWZ0VG9wKSB7XG4gICAgICB0aGlzLmRvbS5pbnNlcnRUb1NpZGViYXJMZWZ0KGBzaWRlYmFybGVmdC10b3BgKVxuICAgIH1cbiAgICBpZiAoIXRoaXMuaGFzTWF4QWRzICYmIHRoaXMuY29uZmlnLnZpc2libGVTaWRlYmFyTGVmdEJvdHRvbSkge1xuICAgICAgdGhpcy5kb20uaW5zZXJ0VG9TaWRlYmFyTGVmdChgc2lkZWJhcmxlZnQtYm90dG9tYClcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGFzTWF4QWRzICYmIHRoaXMuY29uZmlnLnZpc2libGVTaWRlYmFyUmlnaHRUb3ApIHtcbiAgICAgIHRoaXMuZG9tLmluc2VydFRvU2lkZWJhclJpZ2h0KGBzaWRlYmFycmlnaHQtdG9wYClcbiAgICB9XG4gICAgaWYgKCF0aGlzLmhhc01heEFkcyAmJiB0aGlzLmNvbmZpZy52aXNpYmxlU2lkZWJhclJpZ2h0Qm90dG9tKSB7XG4gICAgICB0aGlzLmRvbS5pbnNlcnRUb1NpZGViYXJSaWdodChgc2lkZWJhcnJpZ2h0LWJvdHRvbWApXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbnNlcnRPdmVybGF5QWRzKCkge1xuICAgIC8vIG9ubHkgZm9yIG1vYmlsZVxuICAgIGlmICh0aGlzLmNvbmZpZy5kaWFsb2dDZW50ZXIgJiYgdGhpcy5pc01vYmlsZSkge1xuICAgICAgLy8gZ2V0IHRoZSBib2R5IGVsZW1lbnQsIG5vdCBhcHBCb2R5XG4gICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keVxuICAgICAgdGhpcy5mZXRjaEFkcyh7XG4gICAgICAgIGF1dG86IFtib2R5XSxcbiAgICAgIH0pLnRoZW4oKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICghdmFsdWUgfHwgdmFsdWUuc2xvdF9pbmZvX3BhbmVscy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gICAgICAgIGNvbnN0IG92ZXJsYXkgPSB0aGlzLmRvbS5pbnNlcnRPdmVybGF5Q29udGFpbmVyQWQoYm9keSlcbiAgICAgICAgY29uc3QgYWRVbml0ID0gbmV3IEFkVW5pdChvdmVybGF5LCAnb3ZlcmxheScpXG4gICAgICAgIC8vIGF0dGFjaCBkYXRhXG4gICAgICAgIGNvbnN0IGFkRGF0YSA9IHZhbHVlLnNsb3RfaW5mb19wYW5lbHNbMF1cbiAgICAgICAgYWRVbml0LmF0dGFjaE92ZXJsYXlBZChhZERhdGEsICdpbWFnZScpXG4gICAgICAgIC8vIHNldHVwIGV2ZW50c1xuICAgICAgICBhZFVuaXQuc2V0dXBFdmVudHMoKVxuICAgICAgICAvLyBhZGQgYWRVbml0IHRvIGFycmF5IHRvIG1hbmFnZVxuICAgICAgICB0aGlzLm92ZXJsYXlBZHMucHVzaChhZFVuaXQpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8vIHRoaXMgZnVuY3Rpb24gc2hvdWxkIG9ubHkgcnVuIG9uY2VcbiAgc3RhcnQgPSAoXG4gICAgY29uZmlnczogeyBtb2RlOiBTY3JpcHRNb2RlW107IGlzTW9iaWxlOiBib29sZWFuIH0gPSB7XG4gICAgICBtb2RlOiBbJ21hbnVhbCcsICdhdXRvJ10sXG4gICAgICBpc01vYmlsZTogZmFsc2UsXG4gICAgfSxcbiAgKSA9PiB7XG4gICAgY29uc3QgeyBtb2RlLCBpc01vYmlsZSB9ID0gY29uZmlnc1xuICAgIHRoaXMuaXNNb2JpbGUgPSBpc01vYmlsZVxuXG4gICAgLy8gc2V0IHZhbHVlIG9mIGN1cnJlbnRJbnMgd2l0aCBhbGwgdGhlIG1hbnVhbCBpbnMgaW4gdGhlIHdlYiBwYWdlXG4gICAgLy8gYWZ0ZXIgdGhpcywgdGhlcmUgc2hvdWxkIGJlIG5vIG1vcmUgdGhpcy5kb20uaW5zRWxzLnB1c2goKSBjYWxsc1xuICAgIHRoaXMuZG9tLnNldEluaXRpYWxNYW51YWxJbnMoKVxuICAgIGlmIChtb2RlLmluY2x1ZGVzKCdhdXRvJykpIHtcbiAgICAgIHRoaXMuaW5zZXJ0T3ZlcmxheUFkcygpXG4gICAgICB0aGlzLnRyYXZlcnNlUGFnZSgpXG4gICAgICB0aGlzLmluc2VydEluc1RvQm9keSgpXG4gICAgfVxuICAgIHRoaXMucG9wdWxhdGVBZHMoKVxuICAgIHRoaXMucmVmcmVzaEFkc0J5SW50ZXJ2YWwoKVxuICB9XG59XG4iLCJpbXBvcnQge1xuICBnZXRMYXJnZXN0RWxlbWVudCxcbiAgaXNIaWRkZW5FbGVtZW50LFxuICBnZXREaXN0YW5jZVRvQ2VudGVyLFxuICBnZXRGaWx0ZXJlZENoaWxkcmVuLFxufSBmcm9tICcuLi91dGlscydcbmltcG9ydCB7IERPTSB9IGZyb20gJy4vZG9tJ1xuXG5leHBvcnQgY2xhc3MgQ29udGVudCB7XG4gIHJlYWRvbmx5IGRvbSA9IG5ldyBET00oKVxuICAvLyBwcml2YXRlIHNpZGViYXIgPSBuZXcgU2lkZWJhcigpXG5cbiAgLy8gcHJpdmF0ZSBjaGVja0NvbnRlbnQgPSAoXG4gIC8vICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gIC8vICAgbWF4Q29udGVudEVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAvLyAgIG1heENvbnRlbnQ6IG51bWJlcixcbiAgLy8gKSA9PiB7XG4gIC8vICAgLy8gxJHhuqd1IHRpw6puIGzhuqV5IHdpZHRoLCBoZWlnaHQgY+G7p2EgcGjhuqduIHThu60gbOG7m24gbmjhuqV0XG4gIC8vICAgY29uc3QgeyB3aWR0aDogbWF4V2lkdGgsIGhlaWdodDogbWF4SGVpZ2h0IH0gPVxuICAvLyAgICAgbWF4Q29udGVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgLy8gICAvLyBM4bqleSByYSB3aWR0aCBj4bunYSBwaOG6p24gdOG7rSDEkWFuZyB4ZW0geMOpdFxuICAvLyAgIGNvbnN0IHsgd2lkdGggfSA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgLy8gICAvLyBs4buNYyByYSBjw6FjIHBo4bqnbiB04butIHLhu5duZ1xuXG4gIC8vICAgLy8gISBXaGF0IGhhcHBlbiBpZiBlbGVtZW50IGhhdmUgMSBvciAyIGNoaWxkcmVuP1xuICAvLyAgIGNvbnN0IGNoaWxkcmVuID0gZmlsdGVyRWxlbWVudHNOb3RIYXZlQ29udGVudChlbGVtZW50KVxuICAvLyAgIC8vIEtp4buDbSB0cmEgeGVtIGPDsyBjaOG7qWEgc2lkZWJhciDhu58gYsOqbiB0cm9uZyBwaOG6p24gdOG7rSBlbGVtZW50IGhheSBraMO0bmdcbiAgLy8gICBjb25zdCBpc0hhdmVTaWRlYmFyID0gdGhpcy5jaGVja1NpZGViYXIoY2hpbGRyZW4sIG1heEhlaWdodCAqIDAuMjUpXG4gIC8vICAgLy8gTeG6t2MgxJHhu4tuaCB0w6xtIHJhIGPDoWMgcGjhuqduIHThu60gcGjhuqNpIGPDsyDDrXQgbmjhuqV0IDMgcGjhuqduIHThu60gIGNvbiDhu58gYsOqbiB0cm9uZ1xuICAvLyAgIGNvbnN0IGlzSGF2ZU1pbkNoaWxkcmVuID0gY2hpbGRyZW4ubGVuZ3RoID49IDNcbiAgLy8gICAvLyBLaeG7g20gdHJhIHRow6ptIHBo4bqnbiB04butIHBoYWkgY8OzIHdpZHRoIGzhu5tuIGjGoW4gcGjDom4gbuG7rWEgY+G7p2Egd2lkdGggZG8gc2lkZWJhciBjw7MgdGjhu4MgY2hp4bq/bSAzMCVcbiAgLy8gICBjb25zdCBpc0hhdmVNaW5XaWR0aCA9IHdpZHRoID49IG1heFdpZHRoICogMC40XG4gIC8vICAgLy8gS2nhu4NtIHRyYSBwaOG6p24gdOG7rSBuw6B5IHBo4bqjaSDEkeG6o20gY8OzIGPDsyB0ZXh0Q29udGVudCBs4bubbiBuaOG6pXRcbiAgLy8gICBjb25zdCBpc0hhdmVNaW5Db250ZW50ID0gZWxlbWVudC50ZXh0Q29udGVudCEubGVuZ3RoID4gbWF4Q29udGVudFxuXG4gIC8vICAgLy8gTuG6v3UgbeG7mXQgdHJvbmcgbmjGsG5nIMSRaeG7gXUga2nhu4duIG7DoHkga2jDtG5nIHRo4buPYSBtw6NuIHRow6wgdGnhur9wIHThu6VjIMSRaSBzw6J1IHbDoG8gYsOqbiB0cm9uZyDEkeG7gyB0w6xtIHJhIHBo4bqnbiB04butIGNow61uaCB4w6FjXG4gIC8vICAgcmV0dXJuIChcbiAgLy8gICAgICFpc0hhdmVTaWRlYmFyICYmIGlzSGF2ZU1pbkNoaWxkcmVuICYmIGlzSGF2ZU1pbldpZHRoICYmIGlzSGF2ZU1pbkNvbnRlbnRcbiAgLy8gICApXG4gIC8vIH1cblxuICAvLyBjaGVja1NpZGViYXIgPSAoZWxlbWVudHM6IEhUTUxFbGVtZW50W10sIHBhcmVudEhlaWdodDogbnVtYmVyKSA9PiB7XG4gIC8vICAgLy8gS2nhu4NtIHRyYSB0cm9uZyBt4bqjbmcgZWxlbWVudHMgY8OzIDIgcGjDom4gdOG7rSBuw6BvIGPDsyBoZWlnaHQgbOG7m24gaMahbiB04buJIGzhu4cgaGVpZ2h0IGPhu6dhIHBo4bqnbiB04butIHBhcmVudFxuICAvLyAgIC8vIETDuW5nIMSR4buDIGtp4buDbSB0cmEgeGVtIHRyb25nIG3huqNuZyBlbGVtZW50cyBuw6B5IGPDsyBjaOG7qWEgY29udGVudCB24bubaSBzaWRlYmFyIGhheSBraMO0bmdcbiAgLy8gICBjb25zdCBpc0hhdmVTaWRlYmFyID0gZWxlbWVudHMucmVkdWNlKFxuICAvLyAgICAgKHJlczogbnVtYmVyLCBjdXJyZW50OiBIVE1MRWxlbWVudCkgPT4ge1xuICAvLyAgICAgICBpZiAoY3VycmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgPj0gcGFyZW50SGVpZ2h0KSB7XG4gIC8vICAgICAgICAgcmV0dXJuIHJlcyArIDFcbiAgLy8gICAgICAgfVxuICAvLyAgICAgICByZXR1cm4gcmVzXG4gIC8vICAgICB9LFxuICAvLyAgICAgMCxcbiAgLy8gICApXG5cbiAgLy8gICByZXR1cm4gaXNIYXZlU2lkZWJhciA+PSAyXG4gIC8vIH1cblxuICAvLyBmaW5kQ29udGVudFdpdGhTaWRlYmFyID0gKHNpZGViYXI6IEhUTUxFbGVtZW50KSA9PiB7XG4gIC8vICAgbGV0IHBhcmVudCA9IHNpZGViYXJcbiAgLy8gICAvLyDEkGkgbmfGsOG7o2MgcmEgdMOsbSBwaOG6p24gdOG7rSByYSBjaOG7qWEgY8OhYyBwaOG6p24gdOG7rSBs4bubblxuICAvLyAgIHdoaWxlICh0cnVlKSB7XG4gIC8vICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudCFcbiAgLy8gICAgIGlmIChwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoID49IDIpIHtcbiAgLy8gICAgICAgYnJlYWtcbiAgLy8gICAgIH1cbiAgLy8gICB9XG4gIC8vICAgLy8gVMOsbSBwaOG6p24gdOG7rSBs4bubbiBuaOG6pXRcbiAgLy8gICBjb25zdCBtYXhMZW5ndGggPSBnZXREZW5zZXN0RWxlbWVudChcbiAgLy8gICAgIEFycmF5LmZyb20ocGFyZW50LmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8SFRNTEVsZW1lbnQ+KSxcbiAgLy8gICApXG4gIC8vICAgaWYgKCFtYXhMZW5ndGgpIHtcbiAgLy8gICAgIHJldHVybiBudWxsXG4gIC8vICAgfVxuICAvLyAgIHJldHVybiBtYXhMZW5ndGhcbiAgLy8gfVxuXG4gIC8vIGZpbmRDb250ZW50V2l0aEhlYWRpbmcgPSAoaGVhZGluZzogSFRNTEVsZW1lbnQsIG1heEVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB7XG4gIC8vICAgbGV0IHBhcmVudCA9IGhlYWRpbmdcbiAgLy8gICAvLyDEkGkgdMOsbSBwaOG6pyB04butIGNoYSBjaOG7qWEgY8OhYyBwaMOibiB04butIGzhu5tuXG4gIC8vICAgd2hpbGUgKHRydWUpIHtcbiAgLy8gICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50IVxuICAvLyAgICAgaWYgKFxuICAvLyAgICAgICBwYXJlbnQudGV4dENvbnRlbnQhLmxlbmd0aCA+PVxuICAvLyAgICAgICAobWF4RWxlbWVudCBhcyBIVE1MRWxlbWVudCkudGV4dENvbnRlbnQhLmxlbmd0aCAqIDAuN1xuICAvLyAgICAgKSB7XG4gIC8vICAgICAgIGJyZWFrXG4gIC8vICAgICB9XG4gIC8vICAgfVxuXG4gIC8vICAgLy8gVMOsbSBwaOG6p24gdOG7rSBs4bubbiBuaOG6pXRcblxuICAvLyAgIGNvbnN0IG1heExlbmd0aCA9IGdldERlbnNlc3RFbGVtZW50KFxuICAvLyAgICAgQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4gYXMgSFRNTENvbGxlY3Rpb25PZjxIVE1MRWxlbWVudD4pLFxuICAvLyAgIClcbiAgLy8gICBpZiAobWF4TGVuZ3RoKSByZXR1cm4gbWF4TGVuZ3RoXG5cbiAgLy8gICByZXR1cm4gcGFyZW50XG4gIC8vIH1cblxuICAvLyAvLyAhIEFkZCBtb3JlIG1ldGhvZCB0byBkZXRlY3QgdGhpcyBpcyBtYWluIGNvbnRlbnQsIGV4OiBjYWxjdWxhdGUgY2hhcmFjdGVyIGRlbnNpdHlcbiAgLy8gZ2V0Q29udGVudCA9IChoZWFkZXI6IEhUTUxFbGVtZW50IHwgbnVsbCk6IEhUTUxFbGVtZW50IHwgbnVsbCA9PiB7XG4gIC8vICAgLy8gVMOsbSByYSBwaOG6p24gdOG7rSBi4buNYyB04bqldCBj4bqjIGPDoWMgcGjDom4gdOG7rVxuICAvLyAgIGNvbnN0IHdyYXBwZXIgPSBnZXRNYWluQ29udGFpbmVyRWxlbWVudChoZWFkZXIpXG4gIC8vICAgLy8gVMOsbSByYSBwaOG6p24gdOG7rSBjw7MgZGnhu4duIHTDrWNoIGzhu5tuIG5o4bqldCBsw6AgY29uIGPhu6dhIHBo4bqnbiB04butIHdyYXBwZXJcbiAgLy8gICBsZXQgbWF4RWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gZ2V0TGFyZ2VzdEVsZW1lbnQod3JhcHBlcilcbiAgLy8gICBpZiAoIW1heEVsZW1lbnQpIHtcbiAgLy8gICAgIHJldHVybiBudWxsXG4gIC8vICAgfVxuICAvLyAgIC8vIEtp4buDbSB0cmEgc2lkZWJhciBwaOG6o2kgbuG6sW0gcGjDrWEgYsOqbiBwaOG6o2lcbiAgLy8gICBjb25zdCB7IGxlZnQsIHJpZ2h0IH0gPSAobWF4RWxlbWVudCBhcyBIVE1MRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgLy8gICBjb25zdCBjZW50ZXJQb3NpdGlvbiA9IChsZWZ0ICsgcmlnaHQpIC8gMlxuICAvLyAgIGNvbnN0IHNpZGViYXIgPSB0aGlzLnNpZGViYXIuY2hlY2tTaWRlYmFyQXZhaWxhYmxlKCdyaWdodCcpXG4gIC8vICAgaWYgKHNpZGViYXIgJiYgc2lkZWJhci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ID4gY2VudGVyUG9zaXRpb24pIHtcbiAgLy8gICAgIHJldHVybiB0aGlzLmZpbmRDb250ZW50V2l0aFNpZGViYXIoc2lkZWJhcilcbiAgLy8gICB9IGVsc2Uge1xuICAvLyAgICAgY29uc3QgaGVhZGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2gxJykgYXMgSFRNTEVsZW1lbnRcblxuICAvLyAgICAgaWYgKGhlYWRpbmcpIHtcbiAgLy8gICAgICAgcmV0dXJuIHRoaXMuZmluZENvbnRlbnRXaXRoSGVhZGluZyhoZWFkaW5nLCBtYXhFbGVtZW50KVxuICAvLyAgICAgfVxuICAvLyAgICAgbGV0IHJlc3VsdCA9IG51bGxcbiAgLy8gICAgIHdoaWxlICh0cnVlKSB7XG4gIC8vICAgICAgIC8vIEzhu41jIHJhIGVsZW1lbnRzXG4gIC8vICAgICAgIGNvbnN0IGVsZW1lbnRzID0gZmlsdGVyRWxlbWVudHNOb3RIYXZlQ29udGVudChtYXhFbGVtZW50KVxuICAvLyAgICAgICBsZXQgbGVuZ3RoRWxlbWVudCA9IDBcbiAgLy8gICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gIC8vICAgICAgICAgLy8gS2nhu4NtIHRyYSBlbGVtZW50IGPDsyBwaMO5IGjhu6NwIMSR4buDIGzDoG0gY29udGVudCBoYXkga2jDtG5nXG4gIC8vICAgICAgICAgaWYgKHRoaXMuY2hlY2tDb250ZW50KGVsZW1lbnQsIG1heEVsZW1lbnQsIGxlbmd0aEVsZW1lbnQpKSB7XG4gIC8vICAgICAgICAgICByZXN1bHQgPSBlbGVtZW50XG4gIC8vICAgICAgICAgICBsZW5ndGhFbGVtZW50ID0gZWxlbWVudC50ZXh0Q29udGVudCEubGVuZ3RoXG4gIC8vICAgICAgICAgfVxuICAvLyAgICAgICB9XG4gIC8vICAgICAgIC8vIE7hur91IGtow7RuZyBjw7MgcGjhuqduIHThu60gbsOgbyBo4bujcCBsw6ogdGnhur9wIHThu6VjIMSRaSB0aeG6v3AgdsOgbyBwaOG6p24gdOG7rSBjb24gY8OzIGRp4buHbiB0w61jaCBs4bubbiBuaOG6pXRcbiAgLy8gICAgICAgY29uc3QgbWF4TGVuZ3RoID0gZ2V0RGVuc2VzdEVsZW1lbnQoZWxlbWVudHMpXG4gIC8vICAgICAgIGlmICghbWF4TGVuZ3RoIHx8IHJlc3VsdCkgYnJlYWtcblxuICAvLyAgICAgICBtYXhFbGVtZW50ID0gbWF4TGVuZ3RoXG4gIC8vICAgICB9XG4gIC8vICAgICByZXR1cm4gcmVzdWx0XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgZmluZE1haW5Db250YWluZXJFbGVtZW50KGFwcEJvZHk6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xuICAgIC8vIHJlY29tbWVuZGF0aW9uOiB1c2Ugc2VsZWN0b3JzP1xuICAgIGNvbnN0IGRpcmVjdENoaWxkcmVuID0gZ2V0RmlsdGVyZWRDaGlsZHJlbihhcHBCb2R5KVxuICAgIGxldCBtYWluQ29udGFpbmVyID0gZ2V0TGFyZ2VzdEVsZW1lbnQoZGlyZWN0Q2hpbGRyZW4pXG4gICAgaWYgKCFtYWluQ29udGFpbmVyKSByZXR1cm4gYXBwQm9keVxuXG4gICAgd2hpbGUgKFxuICAgICAgbWFpbkNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudCA9PSAxICYmXG4gICAgICBtYWluQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkIGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcbiAgICApIHtcbiAgICAgIG1haW5Db250YWluZXIgPSBtYWluQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkXG4gICAgfVxuICAgIHJldHVybiBtYWluQ29udGFpbmVyXG4gIH1cblxuICBmaW5kQ29udGVudENvbnRhaW5lcihcbiAgICBfY29udGVudDogSFRNTEVsZW1lbnQsXG4gICAgX3NpZGViYXJMZWZ0OiBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgX3NpZGViYXJSaWdodDogSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIC8vIF9mb290ZXI6IEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgKSB7XG4gICAgaWYgKCF0aGlzLmRvbS5tYWluRWwpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbnRlbnQ6IF9jb250ZW50LFxuICAgICAgICBzaWRlYmFyTGVmdDogbnVsbCxcbiAgICAgICAgc2lkZWJhclJpZ2h0OiBudWxsLFxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBjb250ZW50Q29udGFpbmVyID0gX2NvbnRlbnRcbiAgICBsZXQgc2lkZWJhckxlZnQgPSBfc2lkZWJhckxlZnRcbiAgICBsZXQgc2lkZWJhclJpZ2h0ID0gX3NpZGViYXJSaWdodFxuICAgIC8vIGxldCBmb290ZXIgPSBfZm9vdGVyXG5cbiAgICBjb25zdCB7IGJvdHRvbTogYUJvdHRvbSB9ID0gdGhpcy5kb20uYXBwQm9keUVsIS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoOiBtV2lkdGgsXG4gICAgICBoZWlnaHQ6IG1IZWlnaHQsXG4gICAgICBsZWZ0OiBtTGVmdCxcbiAgICAgIHJpZ2h0OiBtUmlnaHQsXG4gICAgfSA9IHRoaXMuZG9tLm1haW5FbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBfY29udGVudC5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEhUTUxFbGVtZW50Pikge1xuICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBib3R0b20sIGxlZnQsIHJpZ2h0IH0gPVxuICAgICAgICBjaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgY29uc3QgY2hpbGRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGNoaWxkKVxuICAgICAgaWYgKFxuICAgICAgICBjaGlsZFN0eWxlLnBvc2l0aW9uID09ICdmaXhlZCcgfHxcbiAgICAgICAgY2hpbGRTdHlsZS5wb3NpdGlvbiA9PSAnYWJzb2x1dGUnIHx8XG4gICAgICAgIGNoaWxkLmxvY2FsTmFtZSA9PSAndGFibGUnIHx8XG4gICAgICAgIHdpZHRoIDw9IDEgfHxcbiAgICAgICAgaGVpZ2h0IDw9IDEgfHxcbiAgICAgICAgaXNIaWRkZW5FbGVtZW50KGNoaWxkKVxuICAgICAgKVxuICAgICAgICBjb250aW51ZVxuXG4gICAgICBpZiAoXG4gICAgICAgIHdpZHRoIDwgbVdpZHRoICogMC4zNSAmJlxuICAgICAgICB3aWR0aCA+PSA5MCAmJiAvLyB3aWR0aCBzaG91bGQgYmUgYXQgbGVhc3QgOTBweFxuICAgICAgICBoZWlnaHQgPj0gMzAwIC8vIHRoZSBoZWlnaHQgb2Ygc2lkZWJhciBzaG91bGQgYmUgYXQgbGVhc3QgMzAwcHhcbiAgICAgICkge1xuICAgICAgICBpZiAoTWF0aC5hYnMobGVmdCAtIG1MZWZ0KSA8PSA3NSkge1xuICAgICAgICAgIHNpZGViYXJMZWZ0ID0gY2hpbGRcbiAgICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhyaWdodCAtIG1SaWdodCkgPD0gNzUpIHtcbiAgICAgICAgICBzaWRlYmFyUmlnaHQgPSBjaGlsZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyB0aGlzIGNvdWxkIGJlIHRoZSBmb290ZXIsIHNraXAgdGhpcyBjYXNlIGZvciBub3dcbiAgICAgIGVsc2UgaWYgKGhlaWdodCA8PSBtSGVpZ2h0ICogMC4zNSAmJiBNYXRoLmFicyhib3R0b20gLSBhQm90dG9tKSA8PSA1MCkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgLy8gbG9vayBmb3IgY2hpbGQgdGhhdCBoYXMgc2l6ZSByb3VnaGx5IHRoZSBzYW1lIGhlaWdodCBhcyBtYWluRWxcbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAod2lkdGggPj0gbVdpZHRoICogMC40NSAmJiBoZWlnaHQgPj0gbUhlaWdodCAqIDAuNzUpIHtcbiAgICAgICAgICBjb25zdCBzdWJMb29wUmVzdWx0ID0gdGhpcy5maW5kQ29udGVudENvbnRhaW5lcihcbiAgICAgICAgICAgIGNoaWxkLFxuICAgICAgICAgICAgc2lkZWJhckxlZnQsXG4gICAgICAgICAgICBzaWRlYmFyUmlnaHQsXG4gICAgICAgICAgKVxuICAgICAgICAgIGNvbnRlbnRDb250YWluZXIgPSBzdWJMb29wUmVzdWx0LmNvbnRlbnRcbiAgICAgICAgICBzaWRlYmFyTGVmdCA9IHN1Ykxvb3BSZXN1bHQuc2lkZWJhckxlZnRcbiAgICAgICAgICBzaWRlYmFyUmlnaHQgPSBzdWJMb29wUmVzdWx0LnNpZGViYXJSaWdodFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQ6IGNvbnRlbnRDb250YWluZXIsXG4gICAgICBzaWRlYmFyTGVmdDogc2lkZWJhckxlZnQsXG4gICAgICBzaWRlYmFyUmlnaHQ6IHNpZGViYXJSaWdodCxcbiAgICB9XG4gIH1cblxuICBmaW5kQ2VudGVyRWxlbWVudEluQ29udGVudChwYXJlbnQ6IEhUTUxFbGVtZW50KToge1xuICAgIGVsOiBIVE1MRWxlbWVudFxuICAgIHBvczogJ2Fib3ZlJyB8ICdiZWxvdydcbiAgfSB8IG51bGwge1xuICAgIGlmICghdGhpcy5kb20ubWFpbkVsIHx8ICF0aGlzLmRvbS5jb250ZW50RWwpIHJldHVybiBudWxsXG5cbiAgICAvLyBsb29rIGZvciBjaGlsZCBlbGVtZW50IHRoYXQgaGFzIG1vcmUgdGhhbiAyIGNoaWxkcmVuXG4gICAgLy8gaWYgKHBhcmVudC5jaGlsZEVsZW1lbnRDb3VudCA9PSAxKSB7XG4gICAgLy8gICByZXR1cm4gdGhpcy5maW5kQ2VudGVyRWxlbWVudEluQ29udGVudChcbiAgICAvLyAgICAgcGFyZW50LmZpcnN0RWxlbWVudENoaWxkIGFzIEhUTUxFbGVtZW50LFxuICAgIC8vICAgKVxuICAgIC8vIH1cblxuICAgIC8vIGNvbnN0IG1haW5Qb3MgPSB0aGlzLmRvbS5tYWluRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBjb25zdCBjb250ZW50UG9zID0gdGhpcy5kb20uY29udGVudEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICBsZXQgY2VudGVyZWQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGxcbiAgICBsZXQgc2hvcnRlc3REaXN0YW5jZTogbnVtYmVyIHwgbnVsbCA9IG51bGxcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHBhcmVudC5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEhUTUxFbGVtZW50Pikge1xuICAgICAgY29uc3QgY1BvcyA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAvLyBza2lwIGlmIGVsZW1lbnQgZG9lcyBub3QgaGF2ZSBzaXplXG4gICAgICBpZiAoY1Bvcy53aWR0aCA9PSAwIHx8IGNQb3MuaGVpZ2h0ID09IDAgfHwgaXNIaWRkZW5FbGVtZW50KGNoaWxkKSlcbiAgICAgICAgY29udGludWVcblxuICAgICAgY29uc3QgZGlzdGFuY2VUb01haW4gPSBnZXREaXN0YW5jZVRvQ2VudGVyKGNoaWxkLCB0aGlzLmRvbS5tYWluRWwpXG4gICAgICBpZiAoXG4gICAgICAgICFzaG9ydGVzdERpc3RhbmNlIHx8XG4gICAgICAgIE1hdGguYWJzKHNob3J0ZXN0RGlzdGFuY2UpID4gTWF0aC5hYnMoZGlzdGFuY2VUb01haW4pXG4gICAgICApIHtcbiAgICAgICAgc2hvcnRlc3REaXN0YW5jZSA9IGRpc3RhbmNlVG9NYWluXG4gICAgICAgIGNlbnRlcmVkID0gY2hpbGRcbiAgICAgIH1cblxuICAgICAgLy8gaWYgdGhpcyBjaGlsZCBlbGVtZW50IGlzIHRvbyBiaWdcbiAgICAgIGlmIChcbiAgICAgICAgY1Bvcy53aWR0aCA+PSBjb250ZW50UG9zLndpZHRoICogMC44NSAmJlxuICAgICAgICBjUG9zLmhlaWdodCA+PSBjb250ZW50UG9zLmhlaWdodCAqIDAuNVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoY2hpbGQpXG4gICAgICAgIC8vIGNoZWNrIGlmIHdlIHNob3VsZCBsb29wIGluIHRoaXMgY2hpbGQgZWxlbWVudFxuICAgICAgICBpZiAoXG4gICAgICAgICAgc3R5bGUuZGlzcGxheSA9PSAnZ3JpZCcgfHxcbiAgICAgICAgICBzdHlsZS5kaXNwbGF5ID09ICdmbGV4JyB8fFxuICAgICAgICAgIGNoaWxkLmxvY2FsTmFtZSA9PSAndGFibGUnXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmluZENlbnRlckVsZW1lbnRJbkNvbnRlbnQoY2hpbGQpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gLy8gc2tpcCBpZiBlbGVtZW50IGlzIHRvbyBzbWFsbCBjb21wYXJpbmcgdG8gbWFpblBvc1xuICAgICAgLy8gLy8gVE9ETzogdGhpcyBjb25kaXRpb24gY2FuIGJlIHVzZWQgdG8gZ2V0IHNpZGViYXJcbiAgICAgIC8vIGlmIChjUG9zLndpZHRoIDwgbWFpblBvcy53aWR0aCAqIDAuMzUpIHtcbiAgICAgIC8vICAgaWYgKE1hdGguYWJzKGNQb3MubGVmdCAtIG1haW5Qb3MubGVmdCkgPD0gNzUpIHtcbiAgICAgIC8vICAgICBjb25zb2xlLmxvZygnVGhpcyBjb3VsZCBiZSBzaWRlYmFyIGxlZnQnLCBjaGlsZClcbiAgICAgIC8vICAgfSBlbHNlIGlmIChNYXRoLmFicyhjUG9zLnJpZ2h0IC0gbWFpblBvcy5yaWdodCkgPD0gNzUpIHtcbiAgICAgIC8vICAgICBjb25zb2xlLmxvZygnVGhpcyBjb3VsZCBiZSBzaWRlYmFyIHJpZ2h0JywgY2hpbGQpXG4gICAgICAvLyAgIH1cbiAgICAgIC8vICAgY29udGludWVcbiAgICAgIC8vIH1cbiAgICAgIC8vIC8vIGxvb2sgZm9yIGNoaWxkIHRoYXQgaGFzIHNpemUgcm91Z2hseSB0aGUgc2FtZSBoZWlnaHQgYXMgbWFpblBvc1xuICAgICAgLy8gZWxzZSBpZiAoXG4gICAgICAvLyAgIGNQb3Mud2lkdGggPj0gbWFpblBvcy53aWR0aCAqIDAuNDUgJiZcbiAgICAgIC8vICAgY1Bvcy5oZWlnaHQgPj0gbWFpblBvcy5oZWlnaHQgKiAwLjdcbiAgICAgIC8vICkge1xuICAgICAgLy8gICByZXR1cm4gdGhpcy5maW5kQ2VudGVyRWxlbWVudEluQ29udGVudChjaGlsZClcbiAgICAgIC8vIH1cbiAgICB9XG5cbiAgICBpZiAoIWNlbnRlcmVkIHx8ICFzaG9ydGVzdERpc3RhbmNlKSByZXR1cm4gbnVsbFxuICAgIHJldHVybiB7XG4gICAgICBlbDogY2VudGVyZWQsXG4gICAgICBwb3M6IHNob3J0ZXN0RGlzdGFuY2UgPiAwID8gJ2JlbG93JyA6ICdhYm92ZScsXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge1xuICBJQnJvd3NlcixcbiAgSUNQVSxcbiAgSURldmljZSxcbiAgSUVuZ2luZSxcbiAgSU9TLFxuICBJUmVzdWx0LFxuICBVQVBhcnNlcixcbn0gZnJvbSAndWEtcGFyc2VyLWpzJ1xuXG5leHBvcnQgY2xhc3MgRGV0ZWN0b3Ige1xuICByZWFkb25seSBwYXJzZXI6IFVBUGFyc2VyXG5cbiAgYnJvd3NlcjogSUJyb3dzZXJcbiAgb3M6IElPU1xuICBkZXZpY2U6IElEZXZpY2VcbiAgZW5naW5lOiBJRW5naW5lXG4gIGNwdTogSUNQVVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucGFyc2VyID0gbmV3IFVBUGFyc2VyKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KVxuXG4gICAgLy8gc2V0IHRoZSBzdXJmYWNlIGluZm9ybWF0aW9uIGdpdmVuIGJ5IG5hdmlnYXRvci51c2VyQWdlbnRcbiAgICBjb25zdCB7IGJyb3dzZXIsIGNwdSwgZGV2aWNlLCBlbmdpbmUsIG9zIH0gPSB0aGlzLnBhcnNlci5nZXRSZXN1bHQoKVxuICAgIHRoaXMuYnJvd3NlciA9IGJyb3dzZXJcbiAgICB0aGlzLm9zID0gb3NcbiAgICB0aGlzLmRldmljZSA9IGRldmljZVxuICAgIHRoaXMuZW5naW5lID0gZW5naW5lXG4gICAgdGhpcy5jcHUgPSBjcHVcbiAgfVxuXG4gIC8vIHRvIGdldCBtb3JlIGltcHJvdmUgaW5mb3JtYXRpb24gb24gdGhlIHVzZXIgY2xpZW50XG4gIGFzeW5jIGdldFJlc3VsdEFzeW5jKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucGFyc2VyLmdldFJlc3VsdCgpLndpdGhGZWF0dXJlQ2hlY2soKVxuICAgIGNvbnNvbGUubG9nKHJlc3VsdClcbiAgICB0aGlzLnNldFJlc3VsdChyZXN1bHQpXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgc2V0UmVzdWx0KHJlc3VsdDogSVJlc3VsdCkge1xuICAgIGNvbnN0IHsgYnJvd3NlciwgY3B1LCBkZXZpY2UsIGVuZ2luZSwgb3MgfSA9IHJlc3VsdFxuICAgIHRoaXMuYnJvd3NlciA9IGJyb3dzZXJcbiAgICB0aGlzLm9zID0gb3NcbiAgICB0aGlzLmRldmljZSA9IGRldmljZVxuICAgIHRoaXMuZW5naW5lID0gZW5naW5lXG4gICAgdGhpcy5jcHUgPSBjcHVcbiAgfVxuXG4gIGlzTW9iaWxlKCkge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWlzYWxtYW4vdWEtcGFyc2VyLWpzL2lzc3Vlcy8xODJcbiAgICByZXR1cm4gdGhpcy5kZXZpY2UudHlwZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZGV2aWNlLnR5cGUgPT09ICdtb2JpbGUnXG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIGdldEVsZW1lbnRXcmFwcGVyLFxuICBnZXRNYW51YWxJbnNRdWVyeSxcbiAgaXNIaWRkZW5FbGVtZW50LFxuICBpc1N1aXRhYmxlTGF5b3V0LFxuICBpc1Rvb0Nsb3NlLFxufSBmcm9tICdAL3V0aWxzJ1xuaW1wb3J0IHsgQ29udGVudCB9IGZyb20gJy4vY29udGVudCdcbmltcG9ydCB7IFNpZGViYXIgfSBmcm9tICcuL3NpZGViYXInXG5pbXBvcnQgeyBIZWFkZXIgfSBmcm9tICcuL2hlYWRlcidcbmltcG9ydCB7IEZvb3RlciB9IGZyb20gJy4vZm9vdGVyJ1xuaW1wb3J0IHsgQWRJbnMgfSBmcm9tICcuL2lucydcbmltcG9ydCB7XG4gIEFEX0NMQVNTRVMsXG4gIEFUVFJJQlVURV9BRF9GT1JNQVQsXG4gIEFUVFJJQlVURV9BVVRPX0FEX1BPUyxcbn0gZnJvbSAnQC9jb25zdGFudHMnXG5pbXBvcnQgeyBBZHNNYW5hZ2VyIH0gZnJvbSAnLi9hZHMtbWFuYWdlcidcbmltcG9ydCB7IE92ZXJsYXkgfSBmcm9tICcuL292ZXJsYXknXG5pbXBvcnQgeyBTY3JpcHRTZXJ2aWNlIH0gZnJvbSAnQC9zZXJ2aWNlcydcblxuLy8gU0lOR0xFVE9OXG5leHBvcnQgY2xhc3MgRE9NIHtcbiAgc3RhdGljIGluc3RhbmNlOiBET01cblxuICAvLyByZWFkb25seSBpbnMhOiBJbnNFbGVtZW50VXRpbHNcbiAgcmVhZG9ubHkgY29udGVudCE6IENvbnRlbnRcbiAgcmVhZG9ubHkgc2lkZWJhciE6IFNpZGViYXJcbiAgcmVhZG9ubHkgaGVhZGVyITogSGVhZGVyXG4gIHJlYWRvbmx5IGZvb3RlciE6IEZvb3RlclxuICByZWFkb25seSBvdmVybGF5ITogT3ZlcmxheVxuICByZWFkb25seSBpbnMhOiBBZEluc1xuICByZWFkb25seSBhZHNNYW5hZ2VyITogQWRzTWFuYWdlclxuICByZWFkb25seSBzZXJ2aWNlITogU2NyaXB0U2VydmljZVxuXG4gIGFwcEJvZHlFbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbFxuICBtYWluRWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGwgLy8gbWFpbkNvbnRhaW5lclxuICBpbnNFbHM6IEhUTUxFbGVtZW50W10gPSBbXVxuICBvdmVybGF5RWxzOiBIVE1MRWxlbWVudFtdID0gW11cbiAgaGVhZGVyRWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGxcbiAgZm9vdGVyRWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGxcbiAgY29udGVudEVsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsXG4gIHNpZGViYXJMZWZ0RWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGxcbiAgc2lkZWJhclJpZ2h0RWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGxcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAoIURPTS5pbnN0YW5jZSkge1xuICAgICAgRE9NLmluc3RhbmNlID0gdGhpc1xuICAgICAgLy8gdGhpcy5pbnMgPSBuZXcgSW5zRWxlbWVudFV0aWxzKClcbiAgICAgIHRoaXMuY29udGVudCA9IG5ldyBDb250ZW50KClcbiAgICAgIHRoaXMuc2lkZWJhciA9IG5ldyBTaWRlYmFyKClcbiAgICAgIHRoaXMuaGVhZGVyID0gbmV3IEhlYWRlcigpXG4gICAgICB0aGlzLmZvb3RlciA9IG5ldyBGb290ZXIoKVxuICAgICAgdGhpcy5vdmVybGF5ID0gbmV3IE92ZXJsYXkoKVxuICAgICAgdGhpcy5pbnMgPSBuZXcgQWRJbnMoKVxuICAgICAgdGhpcy5hZHNNYW5hZ2VyID0gbmV3IEFkc01hbmFnZXIoKVxuICAgICAgdGhpcy5zZXJ2aWNlID0gbmV3IFNjcmlwdFNlcnZpY2UoKVxuICAgIH1cbiAgICByZXR1cm4gRE9NLmluc3RhbmNlXG4gIH1cblxuICBjcmVhdGVBbmNob3JBZChocmVmOiBzdHJpbmcgPSAnIycsIGNzcz86IFBhcnRpYWw8Q1NTU3R5bGVEZWNsYXJhdGlvbj4pIHtcbiAgICBjb25zdCBhbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcbiAgICBhbmNob3IuY2xhc3NMaXN0LmFkZChBRF9DTEFTU0VTLlJFU0VUX1NUWUxFLCBBRF9DTEFTU0VTLkFOQ0hPUl9FTEVNRU5UKVxuICAgIGFuY2hvci5ocmVmID0gaHJlZlxuICAgIC8vIFRPRE86IGNoZWNrIGlmIHRoaXMgaXMgbmVlZGVkXG4gICAgLy8gYW5jaG9yLnJlZmVycmVyUG9saWN5ID0gJ29yaWdpbidcbiAgICBhbmNob3IucmVsID0gJ25vZm9sbG93IG5vb3BlbmVyJ1xuICAgIGFuY2hvci50YXJnZXQgPSAnX2JsYW5rJ1xuXG4gICAgaWYgKGNzcykge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gY3NzKSB7XG4gICAgICAgIGFuY2hvci5zdHlsZVtrZXldID0gY3NzW2tleV0hXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhbmNob3JcbiAgfVxuXG4gIHNldEluaXRpYWxNYW51YWxJbnMoKSB7XG4gICAgY29uc3QgbWFudWFsRWxzID1cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KGdldE1hbnVhbEluc1F1ZXJ5KCkpXG4gICAgaWYgKG1hbnVhbEVscy5sZW5ndGggPT0gMCkge1xuICAgICAgdGhpcy5pbnNFbHMgPSBbXVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmluc0VscyA9IFsuLi5BcnJheS5mcm9tKG1hbnVhbEVscyldXG4gICAgfVxuICB9XG5cbiAgcHVzaFRvSW5zRWxzKGVsOiBIVE1MRWxlbWVudCB8IEhUTUxFbGVtZW50W10pIHtcbiAgICBpZiAoIXRoaXMuYWRzTWFuYWdlci5oYXNNYXhBZHMpIHtcbiAgICAgIGlmIChlbCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHRoaXMuaW5zRWxzLnB1c2goLi4uZWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmluc0Vscy5wdXNoKGVsKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUZyb21JbnNFbHMoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5pbnNFbHMuZmlsdGVyKChlKSA9PiBlICE9PSBlbClcbiAgICBlbC5yZW1vdmUoKVxuICB9XG5cbiAgYXR0YWNoSW5zID0gKFxuICAgIHRhcmdldEVsOiBIVE1MRWxlbWVudCxcbiAgICBpbnNlcnRUeXBlOiBJbnNlcnRQb3NpdGlvbixcbiAgICBwb3NpdGlvbjogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+LFxuICApID0+IHtcbiAgICAvLyBjcmVhdGUgaW5zIGVsZW1lbnRcbiAgICBjb25zdCBpbnMgPSB0aGlzLmlucy5jcmVhdGVJbnMoe1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KVxuICAgIC8vIHNldCBhdHRyaWJ1dGVzXG4gICAgaW5zLnNldEF0dHJpYnV0ZShBVFRSSUJVVEVfQURfRk9STUFULCAnaW4tcGFnZScpXG4gICAgaW5zLnNldEF0dHJpYnV0ZShBVFRSSUJVVEVfQVVUT19BRF9QT1MsIHBvc2l0aW9uKVxuICAgIHRhcmdldEVsLmluc2VydEFkamFjZW50RWxlbWVudChpbnNlcnRUeXBlLCBpbnMpXG5cbiAgICBpZiAodGhpcy5jaGVja0lmSW5zSXNUb29DbG9zZShpbnMpKSB7XG4gICAgICB0aGlzLnJlbW92ZUZyb21JbnNFbHMoaW5zKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wdXNoVG9JbnNFbHMoaW5zKVxuICAgICAgcmV0dXJuIGluc1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrSWZJbnNJc1Rvb0Nsb3NlKF9pbnM6IEhUTUxFbGVtZW50KSB7XG4gICAgZm9yIChjb25zdCBpbnMgb2YgdGhpcy5pbnNFbHMpIHtcbiAgICAgIGlmIChpc1Rvb0Nsb3NlKGlucywgX2lucykpIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZmluZElubmVyQXBwQ29udGFpbmVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICAvLyBzdG9wIHRoaXMgZnJvbSBiZWluZyBzdHVja2VkIGluIGxvb3BcbiAgICBjb25zdCBNQVhfUkVUUlkgPSAxMFxuICAgIGxldCByZXRyeSA9IDBcbiAgICAvLyBhc3N1bWUgdGhhdCBib2R5IHRhZyBpcyBhbHdheXMgcHJlc2VudCBpbiB3ZWIgcGFnZVxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5XG4gICAgY29uc3QgeyB3aWR0aDogYldpZHRoLCBoZWlnaHQ6IGJIZWlnaHQgfSA9IGJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIGxldCBhV2lkdGggPSBiV2lkdGhcbiAgICBsZXQgYUhlaWdodCA9IGJIZWlnaHRcbiAgICBsZXQgYXBwQm9keTogSFRNTEVsZW1lbnQgPSBib2R5XG4gICAgaWYgKGJXaWR0aCA9PSAwIHx8IGJIZWlnaHQgPT0gMCkge1xuICAgICAgYVdpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiAwLjlcbiAgICAgIGFIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjlcbiAgICB9XG5cbiAgICBvdXRlcjogd2hpbGUgKHRydWUpIHtcbiAgICAgIHJldHJ5KytcbiAgICAgIGlubmVyMTogZm9yIChjb25zdCBjaGlsZCBvZiBhcHBCb2R5LmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8SFRNTEVsZW1lbnQ+KSB7XG4gICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gY2hpbGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgICAvLyBhY2NlcHQgd2l0aCA1JSBkaWZmZXJlbmNlc1xuICAgICAgICAvLyBjb25zdCB3aWR0aERpZmYgPSBNYXRoLmFicyh3aWR0aCAtIGJXaWR0aCkgPD0gYldpZHRoICogMC4wNVxuICAgICAgICAvLyBjb25zdCBoZWlnaHREaWZmID0gTWF0aC5hYnMoaGVpZ2h0IC0gYkhlaWdodCkgPD0gYkhlaWdodCAqIDAuMDVcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHdpZHRoID49IGFXaWR0aCAmJlxuICAgICAgICAgIGhlaWdodCA+PSBhSGVpZ2h0ICYmXG4gICAgICAgICAgIWlzSGlkZGVuRWxlbWVudChjaGlsZCkgJiZcbiAgICAgICAgICBjaGlsZC5jaGlsZEVsZW1lbnRDb3VudCA+PSAxXG4gICAgICAgICkge1xuICAgICAgICAgIGFwcEJvZHkgPSBjaGlsZFxuICAgICAgICAgIGJyZWFrIGlubmVyMVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBpc0FwcEJvZHkgPSBmYWxzZVxuICAgICAgbGV0IGNvbXBvbmVudENvdW50ID0gMFxuICAgICAgaW5uZXIyOiBmb3IgKGNvbnN0IGNoaWxkIG9mIGFwcEJvZHkuY2hpbGRyZW4gYXMgSFRNTENvbGxlY3Rpb25PZjxIVE1MRWxlbWVudD4pIHtcbiAgICAgICAgLy8gc2tpcCBpZiBjaGlsZCBpcyBjb25zaWRlcmVkIHRvIGJlIGhpZGRlblxuICAgICAgICBpZiAoaXNIaWRkZW5FbGVtZW50KGNoaWxkKSkgY29udGludWUgaW5uZXIyXG5cbiAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBjaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICBpZiAod2lkdGggPiAxICYmIGhlaWdodCA+IDEpIHtcbiAgICAgICAgICBjb21wb25lbnRDb3VudCsrXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXBvbmVudENvdW50ID49IDIpIHtcbiAgICAgICAgICBpc0FwcEJvZHkgPSB0cnVlXG4gICAgICAgICAgYnJlYWsgaW5uZXIyXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGlzQXBwQm9keSkgYnJlYWsgb3V0ZXJcbiAgICAgIGlmIChyZXRyeSA9PSBNQVhfUkVUUlkpIHtcbiAgICAgICAgZGVidWdnZXJcbiAgICAgICAgYnJlYWsgb3V0ZXJcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXBwQm9keVxuICB9XG5cbiAgaW5zZXJ0VG9IZWFkZXIoXG4gICAgcG9zaXRpb246IGAke0V4dHJhY3Q8QXV0b0FkRWxlbWVudCwgJ2hlYWRlcic+fS0ke0V4Y2x1ZGU8QXV0b0FkUG9zaXRpb24sICdtaWRkbGUnPn1gLFxuICApIHtcbiAgICBpZiAoIXRoaXMuaGVhZGVyRWwpIHJldHVyblxuXG4gICAgY29uc3QgaGVhZGVyQ3RuID0gZ2V0RWxlbWVudFdyYXBwZXIodGhpcy5oZWFkZXJFbClcbiAgICBjb25zdCBoZWFkZXJDdG5TdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGhlYWRlckN0bilcblxuICAgIGlmIChwb3NpdGlvbiA9PT0gJ2hlYWRlci1ib3R0b20nKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGhlYWRlckN0blN0eWxlLnBvc2l0aW9uICE9PSAnZml4ZWQnICYmXG4gICAgICAgIGhlYWRlckN0blN0eWxlLnBvc2l0aW9uICE9PSAnc3RpY2t5JyAmJlxuICAgICAgICBoZWFkZXJDdG5TdHlsZS5wb3NpdGlvbiAhPT0gJ2Fic29sdXRlJ1xuICAgICAgKSB7XG4gICAgICAgIGlmIChpc1N1aXRhYmxlTGF5b3V0KGhlYWRlckN0bi5wYXJlbnRFbGVtZW50ISkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5hdHRhY2hJbnMoaGVhZGVyQ3RuLCAnYWZ0ZXJlbmQnLCBwb3NpdGlvbilcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5tYWluRWwpIHtcbiAgICAgICAgaWYgKGlzU3VpdGFibGVMYXlvdXQodGhpcy5tYWluRWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYXR0YWNoSW5zKHRoaXMubWFpbkVsLCAnYWZ0ZXJiZWdpbicsIHBvc2l0aW9uLCB7XG4gICAgICAgICAgICBtYXJnaW5Ub3A6XG4gICAgICAgICAgICAgIGhlYWRlckN0blN0eWxlLnBvc2l0aW9uID09ICdzdGlja3knID8gJzAnIDogaGVhZGVyQ3RuU3R5bGUuaGVpZ2h0LFxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYXR0YWNoSW5zKHRoaXMubWFpbkVsLCAnYmVmb3JlYmVnaW4nLCBwb3NpdGlvbilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGluc2VydFRvRm9vdGVyKFxuICAgIHBvc2l0aW9uOiBgJHtFeHRyYWN0PEF1dG9BZEVsZW1lbnQsICdmb290ZXInPn0tJHtFeGNsdWRlPEF1dG9BZFBvc2l0aW9uLCAnbWlkZGxlJz59YCxcbiAgKSB7XG4gICAgaWYgKCF0aGlzLmZvb3RlckVsKSByZXR1cm5cblxuICAgIGNvbnN0IGZvb3RlckN0biA9IGdldEVsZW1lbnRXcmFwcGVyKHRoaXMuZm9vdGVyRWwpXG4gICAgaWYgKHBvc2l0aW9uID09PSAnZm9vdGVyLXRvcCcpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dGFjaElucyhmb290ZXJDdG4sICdiZWZvcmViZWdpbicsIHBvc2l0aW9uKVxuICAgIH1cbiAgfVxuXG4gIGluc2VydFRvQ29udGVudChcbiAgICBwb3NpdGlvbjogYCR7RXh0cmFjdDxBdXRvQWRFbGVtZW50LCAnY29udGVudCc+fS0ke0F1dG9BZFBvc2l0aW9ufWAsXG4gICkge1xuICAgIGlmICghdGhpcy5jb250ZW50RWwpIHJldHVyblxuXG4gICAgaWYgKHBvc2l0aW9uID09PSAnY29udGVudC1taWRkbGUnKSB7XG4gICAgICBjb25zdCBtaWRkbGVDb250ZW50ID0gdGhpcy5jb250ZW50LmZpbmRDZW50ZXJFbGVtZW50SW5Db250ZW50KFxuICAgICAgICB0aGlzLmNvbnRlbnRFbCxcbiAgICAgIClcbiAgICAgIGNvbnNvbGUubG9nKCdtaWRkbGVDb250ZW50JywgbWlkZGxlQ29udGVudClcbiAgICAgIGlmIChtaWRkbGVDb250ZW50KSB7XG4gICAgICAgIGNvbnN0IHsgZWwsIHBvcyB9ID0gbWlkZGxlQ29udGVudFxuXG4gICAgICAgIGxldCB0YXJnZXRFbCA9IGVsXG4gICAgICAgIGxldCBpbnNlcnRQb3M6IEluc2VydFBvc2l0aW9uID0gJ2JlZm9yZWJlZ2luJ1xuICAgICAgICBpZiAoaXNTdWl0YWJsZUxheW91dCh0YXJnZXRFbCkpIHtcbiAgICAgICAgICBpbnNlcnRQb3MgPSBwb3MgPT09ICdhYm92ZScgPyAnYmVmb3JlZW5kJyA6ICdhZnRlcmJlZ2luJ1xuICAgICAgICB9XG4gICAgICAgIC8vIGdldCB0aGUgd3JhcHBlciBvZiB0aGUgZWxlbWVudFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0YXJnZXRFbCA9IGdldEVsZW1lbnRXcmFwcGVyKHRhcmdldEVsKVxuICAgICAgICAgIGlmIChpc1N1aXRhYmxlTGF5b3V0KHRhcmdldEVsKSkge1xuICAgICAgICAgICAgaW5zZXJ0UG9zID0gcG9zID09PSAnYWJvdmUnID8gJ2JlZm9yZWVuZCcgOiAnYWZ0ZXJiZWdpbidcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5zZXJ0UG9zID0gcG9zID09PSAnYWJvdmUnID8gJ2FmdGVyZW5kJyA6ICdiZWZvcmViZWdpbidcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0YWNoSW5zKHRhcmdldEVsLCBpbnNlcnRQb3MsIHBvc2l0aW9uKVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBUT0RPXG4gIH1cblxuICBpbnNlcnRUb1NpZGViYXJMZWZ0KFxuICAgIHBvc2l0aW9uOiBgJHtFeHRyYWN0PEF1dG9BZEVsZW1lbnQsICdzaWRlYmFybGVmdCc+fS0ke0V4Y2x1ZGU8QXV0b0FkUG9zaXRpb24sICdtaWRkbGUnPn1gLFxuICApIHtcbiAgICBpZiAoIXRoaXMuc2lkZWJhckxlZnRFbCkgcmV0dXJuXG5cbiAgICBpZiAocG9zaXRpb24gPT09ICdzaWRlYmFybGVmdC10b3AnKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRhY2hJbnModGhpcy5zaWRlYmFyTGVmdEVsLCAnYWZ0ZXJiZWdpbicsIHBvc2l0aW9uKVxuICAgIH0gZWxzZSBpZiAocG9zaXRpb24gPT09ICdzaWRlYmFybGVmdC1ib3R0b20nKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRhY2hJbnModGhpcy5zaWRlYmFyTGVmdEVsLCAnYmVmb3JlZW5kJywgcG9zaXRpb24pXG4gICAgfVxuICB9XG5cbiAgaW5zZXJ0VG9TaWRlYmFyUmlnaHQoXG4gICAgcG9zaXRpb246IGAke0V4dHJhY3Q8QXV0b0FkRWxlbWVudCwgJ3NpZGViYXJyaWdodCc+fS0ke0V4Y2x1ZGU8QXV0b0FkUG9zaXRpb24sICdtaWRkbGUnPn1gLFxuICApIHtcbiAgICBpZiAoIXRoaXMuc2lkZWJhclJpZ2h0RWwpIHJldHVyblxuXG4gICAgaWYgKHBvc2l0aW9uID09PSAnc2lkZWJhcnJpZ2h0LXRvcCcpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dGFjaElucyh0aGlzLnNpZGViYXJSaWdodEVsLCAnYWZ0ZXJiZWdpbicsIHBvc2l0aW9uKVxuICAgIH0gZWxzZSBpZiAocG9zaXRpb24gPT09ICdzaWRlYmFycmlnaHQtYm90dG9tJykge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0YWNoSW5zKHRoaXMuc2lkZWJhclJpZ2h0RWwsICdiZWZvcmVlbmQnLCBwb3NpdGlvbilcbiAgICB9XG4gIH1cblxuICAvLyBPVkVSTEFZIEFEU1xuICBwdXNoVG9PdmVybGF5RWxzKGVsOiBIVE1MRWxlbWVudCB8IEhUTUxFbGVtZW50W10pIHtcbiAgICBpZiAoZWwgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgdGhpcy5vdmVybGF5RWxzLnB1c2goLi4uZWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3ZlcmxheUVscy5wdXNoKGVsKVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUZyb21PdmVybGF5RWxzKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLm92ZXJsYXlFbHMuZmlsdGVyKChlKSA9PiBlICE9PSBjb250YWluZXIpXG4gICAgY29udGFpbmVyLnJlbW92ZSgpXG4gIH1cblxuICBpbnNlcnRPdmVybGF5Q29udGFpbmVyQWQoYXBwQm9keTogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBvdmVybGF5ID0gdGhpcy5vdmVybGF5LmNyZWF0ZU92ZXJsYXlDb250YWluZXIoKVxuICAgIHRoaXMucHVzaFRvT3ZlcmxheUVscyhvdmVybGF5KVxuICAgIGFwcEJvZHkuYXBwZW5kQ2hpbGQob3ZlcmxheSlcbiAgICByZXR1cm4gb3ZlcmxheVxuICB9XG59XG4iLCIvLyAhIFdoYXQgY2FzZXMgd2lsbCBiZSBvY2N1cj9cbi8vIDEuIFNvbWUgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyIGZvciBzb21lIGVsZW1lbnRcbi8vIDIuIFNvbWUgZXZlbnQgbXVzdCBiZSBhZGRlZCBmb3IgYWxsIGVsZW1lbnRzXG4vLyBQbGVhc2UgZmluZCBhbGwgY2FzZXMgYW5kIGhhbmRsZSBpdFxuLy8gUmVmYWN0b3IgdG8gaGFuZGxlIGFuZCBtYWludGFpbmFibGUgY29kZVxuZXhwb3J0IGNsYXNzIEV2ZW50U3Vic2NyaWJlciB7XG4gIC8vIFJlZiB0byB0aGUgZWxlbWVudFxuICByZWFkb25seSBlbGVtZW50OiBIVE1MRWxlbWVudFxuICAvLyBTdG9yZSBhbGwgdGhlIGNhbGxiYWNrcyByZWZlcnJlZCB3aXRoIHRoZSBldmVudCBuYW1lXG4gIHJlYWRvbmx5IGV2ZW50czogTWFwPHN0cmluZywgRXZlbnRMaXN0ZW5lcj5cbiAgcHJpdmF0ZSBvYnNlcnZlcjogSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgfCB1bmRlZmluZWRcbiAgcHJpdmF0ZSBhY3RpdmU6IGJvb2xlYW4gPSB0cnVlXG5cbiAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAvLyBLaeG7g20gdHJhIHhlbSBjw7MgcGjhuqNpIGzDoCBIVE1MRWxlbWVudCBoYXkga2jDtG5nXG4gICAgaWYgKCEoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgSFRNTEVsZW1lbnQnKVxuICAgIH1cbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgdGhpcy5ldmVudHMgPSBuZXcgTWFwKClcbiAgICAvLyB0aGlzLm9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKClcbiAgfVxuXG4gIHN1YnNjcmliZShldmVudFR5cGU6IGtleW9mIEhUTUxFbGVtZW50RXZlbnRNYXAsIGNhbGxiYWNrOiBFdmVudExpc3RlbmVyKSB7XG4gICAgLy8gdW5zdWJzY3JpYmUgdGhlIGNhbGxiYWNrIG9mIHRoZSBldmVudCBiZWZvcmUgYXR0YWNoIG5ldyBjYWxsYmFja1xuICAgIGlmICh0aGlzLmV2ZW50cy5oYXMoZXZlbnRUeXBlKSkge1xuICAgICAgdGhpcy51bnN1YnNjcmliZShldmVudFR5cGUpXG4gICAgfVxuXG4gICAgY29uc3QgX2NhbGxiYWNrID0gKGU6IEV2ZW50KSA9PiB7XG4gICAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgICAgY2FsbGJhY2soZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmV2ZW50cy5zZXQoZXZlbnRUeXBlLCBfY2FsbGJhY2spXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBfY2FsbGJhY2spXG4gIH1cblxuICB1bnN1YnNjcmliZShldmVudFR5cGU6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmV2ZW50cy5oYXMoZXZlbnRUeXBlKSkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmV2ZW50cy5nZXQoZXZlbnRUeXBlKVxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgY2FsbGJhY2spXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhcnRPYnNlcnZlcihcbiAgICBjYWxsYmFjazogSW50ZXJzZWN0aW9uT2JzZXJ2ZXJDYWxsYmFjayxcbiAgICBvcHRpb25zOiBJbnRlcnNlY3Rpb25PYnNlcnZlckluaXQgPSB7XG4gICAgICB0aHJlc2hvbGQ6IFswLCAxXSxcbiAgICB9LFxuICApIHtcbiAgICBpZiAodGhpcy5vYnNlcnZlcikge1xuICAgICAgdGhpcy5zdG9wT2JzZXJ2ZXIoKVxuICAgIH1cblxuICAgIGNvbnN0IF9jYWxsYmFjayA9IChcbiAgICAgIGU6IEludGVyc2VjdGlvbk9ic2VydmVyRW50cnlbXSxcbiAgICAgIG9ic2VydmVyOiBJbnRlcnNlY3Rpb25PYnNlcnZlcixcbiAgICApID0+IHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgICBjYWxsYmFjayhlLCBvYnNlcnZlcilcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKF9jYWxsYmFjaywgb3B0aW9ucylcbiAgICB0aGlzLm9ic2VydmVyLm9ic2VydmUodGhpcy5lbGVtZW50KVxuICB9XG5cbiAgLy8gLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyBpbiB2aWV3cG9ydFxuICAvLyBpc0luVmlld3BvcnQoKTogYm9vbGVhbiB7XG4gIC8vICAgY29uc3QgcmVjdCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAvLyAgIHJldHVybiAoXG4gIC8vICAgICByZWN0LnRvcCA+PSAwICYmXG4gIC8vICAgICByZWN0LmxlZnQgPj0gMCAmJlxuICAvLyAgICAgcmVjdC5ib3R0b20gPD1cbiAgLy8gICAgICAgKHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSAmJlxuICAvLyAgICAgcmVjdC5yaWdodCA8PSAod2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKVxuICAvLyAgIClcbiAgLy8gfVxuXG4gIHN0b3BPYnNlcnZlcigpIHtcbiAgICBpZiAoIXRoaXMub2JzZXJ2ZXIpIHJldHVyblxuICAgIHRoaXMub2JzZXJ2ZXIudW5vYnNlcnZlKHRoaXMuZWxlbWVudClcbiAgfVxuXG4gIHJlbW92ZUZyb21BbGxFdmVudHMoKSB7XG4gICAgdGhpcy5ldmVudHMuZm9yRWFjaCgoY2FsbGJhY2ssIGV2ZW50VHlwZSkgPT4ge1xuICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBjYWxsYmFjaylcbiAgICAgIC8vIGNhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgLy8gICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGNhbGxiYWNrKVxuICAgICAgLy8gfSlcbiAgICB9KVxuICAgIHRoaXMuZXZlbnRzLmNsZWFyKClcbiAgICB0aGlzLnN0b3BPYnNlcnZlcigpXG4gIH1cblxuICBnZXQgaXNBY3RpdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlXG4gIH1cblxuICBkaXNhYmxlRXZlbnRzKCkge1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgfVxuXG4gIGVuYWJsZUV2ZW50cygpIHtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgfVxufVxuIiwiaW1wb3J0IHsgaXNIaWRkZW5FbGVtZW50IH0gZnJvbSAnQC91dGlscydcblxuZXhwb3J0IGNsYXNzIEZvb3RlciB7XG4gIHJlYWRvbmx5IHNlbGVjdG9ycyA9IFtcbiAgICAnOnNjb3BlIGZvb3RlcicsXG4gICAgYDpzY29wZSBbaWQqPSdmb290ZXInXWAsXG4gICAgYDpzY29wZSBbY2xhc3MqPSdmb290ZXInXWAsXG4gICAgYDpzY29wZSBbcm9sZSo9J2Zvb3RlciddYCxcbiAgXVxuXG4gIGZpbmRGb290ZXIgPSAoYXBwQm9keTogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHsgd2lkdGg6IGFXaWR0aCB9ID0gYXBwQm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGNvbnN0IGZvb3RlclNlbGVjdG9yID0gdGhpcy5zZWxlY3RvcnMuam9pbignLCcpXG5cbiAgICBjb25zdCBhcnJGb290ZXJzID0gYXBwQm9keS5xdWVyeVNlbGVjdG9yQWxsKGZvb3RlclNlbGVjdG9yKVxuICAgIGlmIChhcnJGb290ZXJzLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbFxuXG4gICAgbGV0IGZvb3RlciA9IGFyckZvb3RlcnNbMF1cbiAgICBsZXQgbG93ZXN0Qm90dG9tID0gZm9vdGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbVxuICAgIEFycmF5LmZyb20oYXJyRm9vdGVycyBhcyBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PikuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBsZWZ0LCByaWdodCwgYm90dG9tIH0gPSBmLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIGlmIChcbiAgICAgICAgd2lkdGggKyBsZWZ0ICsgcmlnaHQgPj0gYVdpZHRoICogMC45ICYmXG4gICAgICAgIGhlaWdodCA+IDEgJiZcbiAgICAgICAgIWZvb3Rlci5jb250YWlucyhmKSAmJiAvLyBjaGlsZCBzaG91bGQgbm90IGJlIGRlc2NlbmRhbnQgb2YgdGhlIGN1cnJlbnRcbiAgICAgICAgIWlzSGlkZGVuRWxlbWVudChmKVxuICAgICAgKSB7XG4gICAgICAgIGlmIChib3R0b20gPj0gbG93ZXN0Qm90dG9tKSB7XG4gICAgICAgICAgZm9vdGVyID0gZlxuICAgICAgICAgIGxvd2VzdEJvdHRvbSA9IGJvdHRvbVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gZm9vdGVyIGFzIEhUTUxFbGVtZW50IHwgbnVsbFxuICB9XG59XG4iLCJpbXBvcnQgeyBpc0hpZGRlbkVsZW1lbnQgfSBmcm9tICdAL3V0aWxzJ1xuXG5leHBvcnQgY2xhc3MgSGVhZGVyIHtcbiAgcmVhZG9ubHkgc2VsZWN0b3JzID0gW1xuICAgICc6c2NvcGUgaGVhZGVyJyxcbiAgICBgOnNjb3BlIFtpZCo9J2hlYWRlciddYCxcbiAgICBgOnNjb3BlIFtjbGFzcyo9J2hlYWRlciddYCxcbiAgICBgOnNjb3BlIFtyb2xlKj0naGVhZGVyJ11gLFxuICBdXG5cbiAgcHJpdmF0ZSBpc0hlYWRlckZpeGVkU3RpY2t5KGVsOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpXG4gICAgcmV0dXJuIHN0eWxlLnBvc2l0aW9uID09PSAnZml4ZWQnIHx8IHN0eWxlLnBvc2l0aW9uID09PSAnc3RpY2t5J1xuICB9XG5cbiAgLy8gVMOsbSBlbGVtZW50IHRoZW8ga2V5IG5oxrAgaGVhZGVyIHbDoCBmb290ZXJcbiAgLy8gISBQbGVhc2UgY2hlY2sgKDwqIGtleSAqPiksIGhvdyB0byBoYW5kbGUgY2FzZSBjb21wb25lbnRzIGhhdmUgXCJoZWFkZXItYmxhLWJsYT9cbiAgLy8gQW5kIHN0cmljdCBoZWFkZXIgbXVzdCBiZSBhYm92ZSBjb250ZW50bSwgb3IgLi4uXG4gIGZpbmRIZWFkZXIoYXBwQm9keTogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICAgIGNvbnN0IGhlYWRlclNlbGVjdG9yID0gdGhpcy5zZWxlY3RvcnMuam9pbignLCcpXG4gICAgY29uc3QgYXJySGVhZGVycyA9IGFwcEJvZHkucXVlcnlTZWxlY3RvckFsbChoZWFkZXJTZWxlY3RvcilcbiAgICBpZiAoYXJySGVhZGVycy5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGxcblxuICAgIGNvbnN0IHsgd2lkdGg6IGFXaWR0aCB9ID0gYXBwQm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGxldCBoZWFkZXIgPSBhcnJIZWFkZXJzWzBdIGFzIEhUTUxFbGVtZW50XG4gICAgbGV0IGhpZ2hlc3RUb3AgPSBoZWFkZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXG4gICAgaWYgKHRoaXMuaXNIZWFkZXJGaXhlZFN0aWNreShoZWFkZXIpKSB7XG4gICAgICBoaWdoZXN0VG9wIC09IHdpbmRvdy5zY3JvbGxZXG4gICAgfVxuXG4gICAgQXJyYXkuZnJvbShhcnJIZWFkZXJzIGFzIE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+KS5mb3JFYWNoKChoKSA9PiB7XG4gICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIGxlZnQsIHJpZ2h0LCB0b3AgfSA9IGguZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgaWYgKFxuICAgICAgICB3aWR0aCArIGxlZnQgKyByaWdodCA+PSBhV2lkdGggKiAwLjkgJiZcbiAgICAgICAgaGVpZ2h0ID4gMSAmJlxuICAgICAgICAhaGVhZGVyLmNvbnRhaW5zKGgpICYmIC8vIGNoaWxkIHNob3VsZCBub3QgYmUgZGVzY2VuZGFudCBvZiB0aGUgY3VycmVudFxuICAgICAgICAhaXNIaWRkZW5FbGVtZW50KGgpXG4gICAgICApIHtcbiAgICAgICAgbGV0IGhUb3AgPSB0b3BcbiAgICAgICAgaWYgKHRoaXMuaXNIZWFkZXJGaXhlZFN0aWNreShoKSkgaFRvcCAtPSB3aW5kb3cuc2Nyb2xsWVxuXG4gICAgICAgIGlmIChoVG9wIDw9IGhpZ2hlc3RUb3ApIHtcbiAgICAgICAgICBoZWFkZXIgPSBoXG4gICAgICAgICAgaGlnaGVzdFRvcCA9IGhUb3BcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGhlYWRlciBhcyBIVE1MRWxlbWVudCB8IG51bGxcbiAgfVxufVxuIiwiaW1wb3J0IHsgQURfQ0xBU1NFUyB9IGZyb20gJ0AvY29uc3RhbnRzJ1xuaW1wb3J0IHsgRE9NIH0gZnJvbSAnLi9kb20nXG5pbXBvcnQgeyBBZEluZm8gfSBmcm9tICdAL3R5cGVzL3NlcnZpY2UvZ2V0LWFkcydcblxuZXhwb3J0IGNsYXNzIEFkSW5zIHtcbiAgcmVhZG9ubHkgZG9tID0gbmV3IERPTSgpXG5cbiAgY3JlYXRlSW5zKG9wdGlvbnM/OiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+KSB7XG4gICAgY29uc3QgaW5zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5zJylcbiAgICBpbnMuY2xhc3NOYW1lID0gQURfQ0xBU1NFUy5BSU9aX0FEX0lOU1xuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgaW5zLnN0eWxlW2tleV0gPSBvcHRpb25zW2tleV0hXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbnNcbiAgfVxuXG4gIGNyZWF0ZUFkQ29udGFpbmVyKG9wdGlvbnM/OiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+KSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChBRF9DTEFTU0VTLkNPTlRBSU5FUilcblxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIGNvbnRhaW5lci5zdHlsZVtrZXldID0gb3B0aW9uc1trZXldIVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29udGFpbmVyXG4gIH1cblxuICBjcmVhdGVBZFNwYW4oKSB7XG4gICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHNwYW4uY2xhc3NOYW1lID0gQURfQ0xBU1NFUy5JTkRJQ0FUT1JfU1BBTlxuXG4gICAgLy8gc3Bhbi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcbiAgICAvLyBzcGFuLnN0eWxlLnRvcCA9ICczcHgnXG4gICAgLy8gc3Bhbi5zdHlsZS5sZWZ0ID0gJzNweCdcbiAgICAvLyBzcGFuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSdcbiAgICAvLyBzcGFuLnN0eWxlLmJvcmRlclJhZGl1cyA9ICc2cHgnXG4gICAgLy8gc3Bhbi5zdHlsZS5wYWRkaW5nID0gJzAgNnB4J1xuICAgIC8vIHNwYW4uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMTIzLDIyMSwxNTcsMSknXG5cbiAgICBzcGFuLnN0eWxlLmZvbnRTaXplID0gJzEycHgnXG4gICAgc3Bhbi5zdHlsZS5mb250V2VpZ2h0ID0gJ2JvbGQnXG4gICAgc3Bhbi5zdHlsZS5saW5lSGVpZ2h0ID0gJzEuNSdcbiAgICBzcGFuLnN0eWxlLmNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMSknXG4gICAgc3Bhbi5pbm5lclRleHQgPSAnQWQnXG5cbiAgICByZXR1cm4gc3BhblxuICB9XG5cbiAgY3JlYXRlT3V0ZXJBZFdyYXBwZXIoKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgd3JhcHBlci5jbGFzc05hbWUgPSBBRF9DTEFTU0VTLk9VVEVSX1dSQVBQRVJcblxuICAgIC8vIHdyYXBwZXIuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgLy8gd3JhcHBlci5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnXG4gICAgLy8gd3JhcHBlci5zdHlsZS5ib3hTaXppbmcgPSAnaW5oZXJpdCdcbiAgICAvLyB3cmFwcGVyLnN0eWxlLm1heFdpZHRoID0gJzEwMCUnXG4gICAgLy8gd3JhcHBlci5zdHlsZS5tYXhIZWlnaHQgPSAnMTAwJSdcblxuICAgIGNvbnN0IGFkU3BhbiA9IHRoaXMuY3JlYXRlQWRTcGFuKClcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGFkU3BhbilcbiAgICByZXR1cm4gd3JhcHBlclxuICB9XG5cbiAgY3JlYXRlSW1hZ2VBZCh2YWx1ZTogQWRJbmZvKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IHRoaXMuZG9tLmNyZWF0ZUFuY2hvckFkKClcbiAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoQURfQ0xBU1NFUy5BRF9JTUdfV1JBUFBFUilcblxuICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG4gICAgaW1nLmNsYXNzTmFtZSA9IEFEX0NMQVNTRVMuQURfSU1HX0VMRU1FTlRcbiAgICAvLyBpbWcuc3R5bGUud2lkdGggPSAnYXV0bydcbiAgICAvLyBpbWcuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nXG4gICAgLy8gaW1nLnN0eWxlLm9iamVjdEZpdCA9ICdjb3ZlcidcbiAgICBpbWcuc3JjID0gdmFsdWUuaW1hZ2VfZmlsZVxuXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChpbWcpXG4gICAgcmV0dXJuIHdyYXBwZXJcbiAgfVxufVxuIiwiaW1wb3J0IHsgQWRzTWFuYWdlciB9IGZyb20gJy4vYWRzLW1hbmFnZXInXG5pbXBvcnQgeyBEZXRlY3RvciB9IGZyb20gJy4vZGV0ZWN0b3InXG5pbXBvcnQgeyBUcmFja2VyIH0gZnJvbSAnLi90cmFja2VyJ1xuaW1wb3J0ICcuLi9zdHlsZXMuY3NzJ1xuXG5leHBvcnQgY2xhc3MgQWRTY3JpcHQge1xuICAvLyB0aGlzIGFscmVheSBoYXMgZGVmYXVsdCBjb25maWcgd2hlbiBpbml0c1xuICBwcml2YXRlIG1hbmFnZXI6IEFkc01hbmFnZXJcbiAgcHJpdmF0ZSBkZXRlY3RvcjogRGV0ZWN0b3JcbiAgcHJpdmF0ZSB0cmFja2VyOiBUcmFja2VyXG4gIC8vIHByaXZhdGUgYm90RGV0ZWN0b3I6IERldGVjdEJvdCA9IG5ldyBEZXRlY3RCb3QoKVxuXG4gIGNvbnN0cnVjdG9yKF9tYW5hZ2VyQ29uZmlnPzogSU1hbmFnZXJDb25maWcpIHtcbiAgICB0aGlzLmRldGVjdG9yID0gbmV3IERldGVjdG9yKClcbiAgICB0aGlzLnRyYWNrZXIgPSBuZXcgVHJhY2tlcigpXG4gICAgdGhpcy5tYW5hZ2VyID0gbmV3IEFkc01hbmFnZXIoX21hbmFnZXJDb25maWcpXG4gIH1cblxuICBzdGFydChvcHRpb25zOiBTY3JpcHRNb2RlW10gPSBbJ21hbnVhbCcsICdhdXRvJ10pIHtcbiAgICAvLyB0aGlzLmJvdERldGVjdG9yLnN0YXJ0RGV0ZWN0Qm90KClcbiAgICB0aGlzLnRyYWNrZXIubGlzdGVuTW91c2VNb3ZlbWVudCgpXG4gICAgdGhpcy5kZXRlY3Rvci5nZXRSZXN1bHRBc3luYygpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgY29uc3Qgc3RhcnRDb25maWcgPSB7XG4gICAgICAgIG1vZGU6IG9wdGlvbnMsXG4gICAgICAgIGlzTW9iaWxlOiB0aGlzLmRldGVjdG9yLmlzTW9iaWxlKCksXG4gICAgICB9XG4gICAgICB0aGlzLm1hbmFnZXIuc3RhcnQoc3RhcnRDb25maWcpXG4gICAgfSlcbiAgfVxufVxuIiwiaW1wb3J0IHsgRE9NIH0gZnJvbSAnLi9kb20nXG5pbXBvcnQgSUNPTlMgZnJvbSAnLi4vYXNzZXRzL2ljb25zJ1xuaW1wb3J0IHtcbiAgQURfQ0xBU1NFUyxcbiAgQVRUUklCVVRFX0FEX0ZPUk1BVCxcbiAgQVRUUklCVVRFX09WRVJMQVlfQURfUE9TLFxufSBmcm9tICdAL2NvbnN0YW50cydcbmltcG9ydCB7IGNyZWF0ZUJ1dHRvbkVsZW1lbnQgfSBmcm9tICdAL3V0aWxzJ1xuaW1wb3J0IHsgQWRJbmZvIH0gZnJvbSAnQC90eXBlcy9zZXJ2aWNlL2dldC1hZHMnXG5cbmV4cG9ydCBjbGFzcyBPdmVybGF5IHtcbiAgcmVhZG9ubHkgZG9tOiBET01cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5kb20gPSBuZXcgRE9NKClcbiAgfVxuXG4gIGNyZWF0ZVJlbW92ZU92ZXJsYXlCdXR0b24ob3B0aW9ucz86IFBhcnRpYWw8Q1NTU3R5bGVEZWNsYXJhdGlvbj4pIHtcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKEFEX0NMQVNTRVMuUkVTRVRfU1RZTEUsIEFEX0NMQVNTRVMuSUNPTl9TTV9XUkFQUEVSKVxuXG4gICAgLy8gcmVzZXQgc3R5bGVcbiAgICAvLyBidXR0b24uY2xhc3NMaXN0LmFkZChBRF9DTEFTU0VTLlJFU0VUX1NUWUxFKVxuICAgIGJ1dHRvbi5zdHlsZS5ib3hTaXppbmcgPSAnaW5oZXJpdCdcbiAgICBidXR0b24uc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICBidXR0b24uc3R5bGUud2lkdGggPSAnMjhweCdcbiAgICBidXR0b24uc3R5bGUuaGVpZ2h0ID0gJzI4cHgnXG4gICAgYnV0dG9uLnN0eWxlLnBhZGRpbmcgPSAnNHB4J1xuICAgIGJ1dHRvbi5zdHlsZS5jb2xvciA9ICdyZ2IoMCwwLDApJ1xuICAgIGJ1dHRvbi5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnMTAwJSdcbiAgICBidXR0b24uc3R5bGUuYmFja2dyb3VuZCA9ICdyZ2JhKDI1NSwyNTUsMjU1LDAuOCknXG4gICAgYnV0dG9uLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJ1xuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIGJ1dHRvbi5zdHlsZVtrZXldID0gb3B0aW9uc1trZXldIVxuICAgICAgfVxuICAgIH1cblxuICAgIGJ1dHRvbi5pbm5lckhUTUwgPSBJQ09OUy5SZW1vdmVcbiAgICByZXR1cm4gYnV0dG9uXG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUZ1bGxzY3JlZW5CbHVyT3ZlcmxheSgpIHtcbiAgICBjb25zdCBibHVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBibHVyRGl2LmNsYXNzTGlzdC5hZGQoXG4gICAgICBBRF9DTEFTU0VTLlJFU0VUX1NUWUxFLFxuICAgICAgQURfQ0xBU1NFUy5GVUxMU0NSRUVOX0JMVVJfT1ZFUkxBWSxcbiAgICApXG5cbiAgICAvLyBibHVyRGl2LnN0eWxlLnpJbmRleCA9ICc5MDAwJ1xuICAgIC8vIGJsdXJEaXYuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnXG4gICAgLy8gYmx1ckRpdi5zdHlsZS5pbnNldCA9ICcwJ1xuICAgIC8vIGJsdXJEaXYuc3R5bGUud2lkdGggPSAnYXV0bydcbiAgICAvLyBibHVyRGl2LnN0eWxlLmhlaWdodCA9ICdhdXRvJ1xuICAgIC8vIGJsdXJEaXYuc3R5bGUuYmFja2dyb3VuZCA9ICdyZ2IoMjM0LDIzMywyMzgpJ1xuICAgIC8vIGJsdXJEaXYuc3R5bGUub3BhY2l0eSA9ICcwLjcnXG5cbiAgICByZXR1cm4gYmx1ckRpdlxuICB9XG5cbiAgY3JlYXRlT3ZlcmxheUNvbnRhaW5lcigpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKEFEX0NMQVNTRVMuQUlPWl9BRF9PVkVSTEFZKVxuICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoQVRUUklCVVRFX0FEX0ZPUk1BVCwgJ292ZXJsYXknKVxuICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoQVRUUklCVVRFX09WRVJMQVlfQURfUE9TLCAnY2VudGVyJylcblxuICAgIGNvbnN0IGJsdXJPdmVybGF5ID0gdGhpcy5jcmVhdGVGdWxsc2NyZWVuQmx1ck92ZXJsYXkoKVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChibHVyT3ZlcmxheSlcbiAgICByZXR1cm4gY29udGFpbmVyXG4gIH1cblxuICBjcmVhdGVPdmVybGF5RGlhbG9nQ29udGFpbmVyKFxuICAgIHR5cGU6ICduby1sb2dvJyB8ICdsb2dvJyxcbiAgICBhZERhdGE6IEFkSW5mbyxcbiAgICBjbG9zZUhhbmRsZXI6ICgpID0+IHZvaWQsXG4gICkge1xuICAgIGNvbnN0IGRpYWxvZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucycpXG4gICAgZGlhbG9nLmNsYXNzTGlzdC5hZGQoQURfQ0xBU1NFUy5SRVNFVF9TVFlMRSwgQURfQ0xBU1NFUy5ESUFMT0dfQ09OVEFJTkVSKVxuXG4gICAgLy8gZGlhbG9nLnN0eWxlLmJhY2tncm91bmQgPSAncmVkJ1xuICAgIC8vIGRpYWxvZy5zdHlsZS56SW5kZXggPSAnOTAwMSdcbiAgICAvLyBkaWFsb2cuc3R5bGUuYm94U2l6aW5nID0gJ2JvcmRlci1ib3gnXG4gICAgLy8gZGlhbG9nLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJ1xuICAgIC8vIGRpYWxvZy5zdHlsZS5pbnNldCA9ICcwJ1xuICAgIC8vIGRpYWxvZy5zdHlsZS5tYXJnaW4gPSAnYXV0bydcbiAgICBkaWFsb2cuc3R5bGUud2lkdGggPSBgJHt3aW5kb3cuaW5uZXJXaWR0aCAqIDAuOTV9cHhgXG4gICAgZGlhbG9nLnN0eWxlLmhlaWdodCA9IGAke3dpbmRvdy5pbm5lckhlaWdodCAqIDAuOTV9cHhgXG4gICAgZGlhbG9nLnN0eWxlLm1heEhlaWdodCA9ICc2MDBweCdcblxuICAgIGNvbnN0IGJnRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBiZ0Rpdi5jbGFzc0xpc3QuYWRkKEFEX0NMQVNTRVMuRElBTE9HX0JHKVxuICAgIGJnRGl2LnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHthZERhdGEuaW1hZ2VfZmlsZX0pYFxuICAgIGJnRGl2LnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9ICdjZW50ZXInXG4gICAgYmdEaXYuc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnY292ZXInXG5cbiAgICBsZXQgY29udGVudDogSFRNTEVsZW1lbnRcbiAgICBpZiAodHlwZSA9PT0gJ25vLWxvZ28nKSB7XG4gICAgICBjb250ZW50ID0gdGhpcy5jcmVhdGVEaWFsb2coYWREYXRhLCBjbG9zZUhhbmRsZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRlbnQgPSB0aGlzLmNyZWF0ZURpYWxvZ1dpdGhMb2dvKGFkRGF0YSwgY2xvc2VIYW5kbGVyKVxuICAgICAgYmdEaXYuc3R5bGUuZmlsdGVyID0gJ29wYWNpdHkoMC4zKSdcbiAgICAgIGRpYWxvZy5zdHlsZS5wYWRkaW5nID0gJzEwcHgnXG4gICAgfVxuICAgIGRpYWxvZy5hcHBlbmQoYmdEaXYsIGNvbnRlbnQpXG4gICAgcmV0dXJuIGRpYWxvZ1xuICB9XG5cbiAgLy8gZmlyc3Qgc3R5bGUsIHdpdGhvdXQgbG9nb1xuICBwcml2YXRlIGNyZWF0ZURpYWxvZyhhZERhdGE6IEFkSW5mbywgY2xvc2VIYW5kbGVyOiAoKSA9PiB2b2lkKSB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICAgIGRpdi5zdHlsZS5ib3hTaXppbmcgPSAnaW5oZXJpdCdcbiAgICBkaXYuc3R5bGUud2lkdGggPSAnMTAwJSdcbiAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnXG4gICAgZGl2LnN0eWxlLmRpc3BsYXkgPSAnZmxleCdcbiAgICBkaXYuc3R5bGUuZmxleERpcmVjdGlvbiA9ICdjb2x1bW4nXG4gICAgZGl2LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ2VuZCdcblxuICAgIGNvbnN0IHJlbW92ZUJ0biA9IHRoaXMuY3JlYXRlUmVtb3ZlT3ZlcmxheUJ1dHRvbih7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHRvcDogJzVweCcsXG4gICAgICByaWdodDogJzVweCcsXG4gICAgfSlcbiAgICByZW1vdmVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBjbG9zZUhhbmRsZXIoKVxuICAgIH0pXG5cbiAgICBjb25zdCBjb250ZW50V3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29udGVudFdyYXBwZXIuc3R5bGUuZGlzcGxheSA9ICdmbGV4J1xuICAgIGNvbnRlbnRXcmFwcGVyLnN0eWxlLmZsZXhEaXJlY3Rpb24gPSAnY29sdW1uJ1xuICAgIGNvbnRlbnRXcmFwcGVyLnN0eWxlLmFsaWduSXRlbXMgPSAnc3RyZXRjaCdcbiAgICBjb250ZW50V3JhcHBlci5zdHlsZS5nYXAgPSAnMTBweCdcbiAgICBjb250ZW50V3JhcHBlci5zdHlsZS5saW5lSGVpZ2h0ID0gJzEuNSdcbiAgICBjb250ZW50V3JhcHBlci5zdHlsZS5jb2xvciA9ICdyZ2IoMjU1LDI1NSwyNTUpJ1xuICAgIGNvbnRlbnRXcmFwcGVyLnN0eWxlLnBhZGRpbmcgPSAnMCAxOHB4IDE4cHgnXG4gICAge1xuICAgICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpXG4gICAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKEFEX0NMQVNTRVMuUkVTRVRfU1RZTEUpXG4gICAgICB0aXRsZS5zdHlsZS5mb250U2l6ZSA9ICcxOHB4J1xuICAgICAgdGl0bGUuc3R5bGUuZm9udFdlaWdodCA9ICc3MDAnXG4gICAgICB0aXRsZS5pbm5lclRleHQgPSBhZERhdGEuaGVhZGxpbmUgfHwgYWREYXRhLmhlYWRsaW5lXG5cbiAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgICBkZXNjcmlwdGlvbi5jbGFzc0xpc3QuYWRkKEFEX0NMQVNTRVMuUkVTRVRfU1RZTEUpXG4gICAgICBkZXNjcmlwdGlvbi5zdHlsZS5mb250U2l6ZSA9ICcxNHB4J1xuICAgICAgZGVzY3JpcHRpb24uc3R5bGUuZm9udFdlaWdodCA9ICc1MDAnXG4gICAgICBkZXNjcmlwdGlvbi5pbm5lckhUTUwgPSBhZERhdGEuZGVzY3JpcHRpb25cblxuICAgICAgY29udGVudFdyYXBwZXIuYXBwZW5kKHRpdGxlLCBkZXNjcmlwdGlvbilcbiAgICB9XG5cbiAgICBjb25zdCBsZWFybk1vcmVBbmNob3IgPSB0aGlzLmRvbS5jcmVhdGVBbmNob3JBZCgnIycpXG4gICAgbGVhcm5Nb3JlQW5jaG9yLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgbGVhcm5Nb3JlQW5jaG9yLnN0eWxlLndpZHRoID0gJzEwMCUnXG4gICAge1xuICAgICAgY29uc3QgaW5uZXJMZWFybk1vcmVXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGlubmVyTGVhcm5Nb3JlV3JhcHBlci5zdHlsZS5iYWNrZ3JvdW5kID0gJ3JnYigxMjMsMjIxLDE1NyknXG4gICAgICBpbm5lckxlYXJuTW9yZVdyYXBwZXIuc3R5bGUuZGlzcGxheSA9ICdmbGV4J1xuICAgICAgaW5uZXJMZWFybk1vcmVXcmFwcGVyLnN0eWxlLmZsZXhEaXJlY3Rpb24gPSAncm93J1xuICAgICAgaW5uZXJMZWFybk1vcmVXcmFwcGVyLnN0eWxlLmFsaWduSXRlbXMgPSAnY2VudGVyJ1xuICAgICAgaW5uZXJMZWFybk1vcmVXcmFwcGVyLnN0eWxlLnBhZGRpbmdMZWZ0ID0gJzE4cHgnXG4gICAgICBpbm5lckxlYXJuTW9yZVdyYXBwZXIuc3R5bGUucGFkZGluZ1JpZ2h0ID0gJzhweCdcbiAgICAgIGlubmVyTGVhcm5Nb3JlV3JhcHBlci5zdHlsZS5taW5IZWlnaHQgPSAnNDRweCdcbiAgICAgIGlubmVyTGVhcm5Nb3JlV3JhcHBlci5zdHlsZS5jb2xvciA9ICdyZ2IoMCwwLDApJ1xuICAgICAgaW5uZXJMZWFybk1vcmVXcmFwcGVyLnN0eWxlLmxpbmVIZWlnaHQgPSAnMS4zJ1xuXG4gICAgICBjb25zdCBsZWFybk1vcmVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICBsZWFybk1vcmVUZXh0LnN0eWxlLmZvbnRTaXplID0gJzE2cHgnXG4gICAgICBsZWFybk1vcmVUZXh0LnN0eWxlLmZvbnRXZWlnaHQgPSAnNTAwJ1xuICAgICAgbGVhcm5Nb3JlVGV4dC5zdHlsZS5mbGV4ID0gJzEnXG4gICAgICBsZWFybk1vcmVUZXh0LmlubmVyVGV4dCA9ICdMZWFybiBtb3JlJ1xuXG4gICAgICBjb25zdCBsZWFybk1vcmVJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICBsZWFybk1vcmVJY29uLmNsYXNzTGlzdC5hZGQoQURfQ0xBU1NFUy5JQ09OX0xHX1dSQVBQRVIpXG4gICAgICBsZWFybk1vcmVJY29uLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xuICAgICAgbGVhcm5Nb3JlSWNvbi5zdHlsZS53aWR0aCA9ICc0MHB4J1xuICAgICAgbGVhcm5Nb3JlSWNvbi5zdHlsZS5oZWlnaHQgPSAnNDBweCdcbiAgICAgIGxlYXJuTW9yZUljb24uaW5uZXJIVE1MID0gSUNPTlMuQ2hldnJvblJpZ2h0XG5cbiAgICAgIGlubmVyTGVhcm5Nb3JlV3JhcHBlci5hcHBlbmQobGVhcm5Nb3JlVGV4dCwgbGVhcm5Nb3JlSWNvbilcbiAgICAgIGxlYXJuTW9yZUFuY2hvci5hcHBlbmQoaW5uZXJMZWFybk1vcmVXcmFwcGVyKVxuICAgIH1cblxuICAgIGRpdi5hcHBlbmQocmVtb3ZlQnRuLCBjb250ZW50V3JhcHBlciwgbGVhcm5Nb3JlQW5jaG9yKVxuICAgIHJldHVybiBkaXZcbiAgfVxuXG4gIC8vIHNlY29uZCBzdHlsZSwgd2l0aCBsb2dvXG4gIHByaXZhdGUgY3JlYXRlRGlhbG9nV2l0aExvZ28oYWREYXRhOiBBZEluZm8sIGNsb3NlSGFuZGxlcjogKCkgPT4gdm9pZCkge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgICBkaXYuc3R5bGUuYm94U2l6aW5nID0gJ2luaGVyaXQnXG4gICAgZGl2LnN0eWxlLmJhY2tncm91bmQgPSAncmdiKDI1NSwyNTUsMjU1KSdcbiAgICBkaXYuc3R5bGUud2lkdGggPSAnMTAwJSdcbiAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnXG4gICAgZGl2LnN0eWxlLmJvcmRlclJhZGl1cyA9ICc4cHgnXG4gICAgZGl2LnN0eWxlLmRpc3BsYXkgPSAnZmxleCdcbiAgICBkaXYuc3R5bGUuZmxleERpcmVjdGlvbiA9ICdjb2x1bW4nXG4gICAgZGl2LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ3NwYWNlLWJldHdlZW4nXG4gICAgZGl2LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcblxuICAgIGNvbnN0IHRodW1ibmFpbEFuY2hvciA9IHRoaXMuZG9tLmNyZWF0ZUFuY2hvckFkKCcjJylcbiAgICB0aHVtYm5haWxBbmNob3IuY2xhc3NMaXN0LmFkZChBRF9DTEFTU0VTLkFEX0lNR19XUkFQUEVSKVxuICAgIHRodW1ibmFpbEFuY2hvci5zdHlsZS53aWR0aCA9ICcxMDAlJ1xuICAgIHRodW1ibmFpbEFuY2hvci5zdHlsZS5oZWlnaHQgPSAnNTUlJ1xuICAgIHRodW1ibmFpbEFuY2hvci5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdjZW50ZXInXG4gICAge1xuICAgICAgY29uc3QgdGh1bWJuYWlsSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJylcbiAgICAgIHRodW1ibmFpbEltZy5jbGFzc0xpc3QuYWRkKEFEX0NMQVNTRVMuQURfSU1HX0VMRU1FTlQpXG4gICAgICB0aHVtYm5haWxJbWcuc3R5bGUud2lkdGggPSAnMTAwJSdcbiAgICAgIHRodW1ibmFpbEltZy5zcmMgPSBhZERhdGEuaW1hZ2VfZmlsZVxuICAgICAgdGh1bWJuYWlsQW5jaG9yLmFwcGVuZENoaWxkKHRodW1ibmFpbEltZylcbiAgICB9XG5cbiAgICBjb25zdCBjb250ZW50RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb250ZW50RGl2LnN0eWxlLmRpc3BsYXkgPSAnZmxleCdcbiAgICBjb250ZW50RGl2LnN0eWxlLmZsZXhEaXJlY3Rpb24gPSAnY29sdW1uJ1xuICAgIGNvbnRlbnREaXYuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnc3BhY2UtYmV0d2VlbidcbiAgICBjb250ZW50RGl2LnN0eWxlLmFsaWduSXRlbXMgPSAnY2VudGVyJ1xuICAgIGNvbnRlbnREaXYuc3R5bGUuZ2FwID0gJzZweCdcbiAgICBjb250ZW50RGl2LnN0eWxlLmxpbmVIZWlnaHQgPSAnMS4zJ1xuICAgIGNvbnRlbnREaXYuc3R5bGUubWFyZ2luID0gJzIwcHggMTBweCdcbiAgICB7XG4gICAgICBjb25zdCBjb250ZW50TG9nb0N0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBjb250ZW50TG9nb0N0bi5jbGFzc0xpc3QuYWRkKEFEX0NMQVNTRVMuQURfSU1HX1dSQVBQRVIpXG4gICAgICBjb250ZW50TG9nb0N0bi5zdHlsZS53aWR0aCA9ICc2NHB4J1xuICAgICAgY29udGVudExvZ29DdG4uc3R5bGUuaGVpZ2h0ID0gJzY0cHgnXG5cbiAgICAgIGNvbnN0IGNvbnRlbnRMb2dvSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJylcbiAgICAgIGNvbnRlbnRMb2dvSW1nLmNsYXNzTGlzdC5hZGQoQURfQ0xBU1NFUy5BRF9JTUdfRUxFTUVOVClcbiAgICAgIGNvbnRlbnRMb2dvSW1nLnNyYyA9IGFkRGF0YS5sb2dvX2ZpbGVcbiAgICAgIGNvbnRlbnRMb2dvQ3RuLmFwcGVuZENoaWxkKGNvbnRlbnRMb2dvSW1nKVxuXG4gICAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJylcbiAgICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoQURfQ0xBU1NFUy5SRVNFVF9TVFlMRSlcbiAgICAgIHRpdGxlLnN0eWxlLmZvbnRTaXplID0gJzI4cHgnXG4gICAgICB0aXRsZS5zdHlsZS5mb250V2VpZ2h0ID0gJzcwMCdcbiAgICAgIHRpdGxlLnN0eWxlLmNvbG9yID0gJ3JnYig4NCw4NCw4NCknXG4gICAgICB0aXRsZS5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJ1xuICAgICAgdGl0bGUuaW5uZXJUZXh0ID0gYWREYXRhLmhlYWRsaW5lXG5cbiAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgICBkZXNjcmlwdGlvbi5jbGFzc0xpc3QuYWRkKEFEX0NMQVNTRVMuUkVTRVRfU1RZTEUpXG4gICAgICBkZXNjcmlwdGlvbi5zdHlsZS5mb250U2l6ZSA9ICcxOHB4J1xuICAgICAgZGVzY3JpcHRpb24uc3R5bGUuZm9udFdlaWdodCA9ICc0MDAnXG4gICAgICBkZXNjcmlwdGlvbi5zdHlsZS5jb2xvciA9ICdyZ2IoMTMwLDEzMCwxMzApJ1xuICAgICAgZGVzY3JpcHRpb24uc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcidcbiAgICAgIGRlc2NyaXB0aW9uLmlubmVySFRNTCA9IGFkRGF0YS5kZXNjcmlwdGlvblxuXG4gICAgICBjb250ZW50RGl2LmFwcGVuZChjb250ZW50TG9nb0N0biwgdGl0bGUsIGRlc2NyaXB0aW9uKVxuICAgIH1cblxuICAgIGNvbnN0IGJ0bkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgYnRuQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnZmxleCdcbiAgICBidG5Db250YWluZXIuc3R5bGUuYWxpZ25JdGVtcyA9ICdjZW50ZXInXG4gICAgYnRuQ29udGFpbmVyLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ3NwYWNlLWV2ZW5seSdcbiAgICBidG5Db250YWluZXIuc3R5bGUubWFyZ2luID0gJzAgMTBweCdcbiAgICB7XG4gICAgICBjb25zdCBjbG9zZUJ0biA9IGNyZWF0ZUJ1dHRvbkVsZW1lbnQoKVxuICAgICAgY2xvc2VCdG4uaW5uZXJUZXh0ID0gJ0Nsb3NlJ1xuICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUhhbmRsZXIpXG5cbiAgICAgIGNvbnN0IGxlYXJuQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGxlYXJuQnRuLmNsYXNzTGlzdC5hZGQoQURfQ0xBU1NFUy5CVVRUT05fRUxFTUVOVClcbiAgICAgIGxlYXJuQnRuLnN0eWxlLm1pbldpZHRoID0gJzEwMHB4J1xuICAgICAgbGVhcm5CdG4uc3R5bGUuaGVpZ2h0ID0gJzM2cHgnXG4gICAgICBsZWFybkJ0bi5zdHlsZS5iYWNrZ3JvdW5kID0gJ3JnYigxMjMsMjIxLDE1NyknXG4gICAgICBsZWFybkJ0bi5pbm5lclRleHQgPSAnTGVhcm4gbW9yZSdcblxuICAgICAgY29uc3QgbGVhcm5BbmNob3IgPSB0aGlzLmRvbS5jcmVhdGVBbmNob3JBZCgnIycpXG4gICAgICBsZWFybkFuY2hvci5hcHBlbmRDaGlsZChsZWFybkJ0bilcbiAgICAgIGJ0bkNvbnRhaW5lci5hcHBlbmQoY2xvc2VCdG4sIGxlYXJuQW5jaG9yKVxuICAgIH1cblxuICAgIGNvbnN0IGZpbGxlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZmlsbGVyLnN0eWxlLmZsZXggPSAnMSdcbiAgICBkaXYuYXBwZW5kKHRodW1ibmFpbEFuY2hvciwgY29udGVudERpdiwgYnRuQ29udGFpbmVyLCBmaWxsZXIpXG4gICAgcmV0dXJuIGRpdlxuICB9XG59XG4iLCJpbXBvcnQgeyBpc0hpZGRlbkVsZW1lbnQgfSBmcm9tICcuLi91dGlscydcbmltcG9ydCB7IERPTSB9IGZyb20gJy4vZG9tJ1xuXG5leHBvcnQgY2xhc3MgU2lkZWJhciB7XG4gIHJlYWRvbmx5IGRvbSA9IG5ldyBET00oKVxuXG4gIGZpbmRTaWRlYmFyQ29udGFpbmVyKG1haW5Db250YWluZXI6IEhUTUxFbGVtZW50KSB7XG4gICAgbGV0IHNpZGViYXJMZWZ0ID0gbnVsbFxuICAgIGxldCBzaWRlYmFyUmlnaHQgPSBudWxsXG4gICAgbGV0IGNvbnRhaW5lciA9IG1haW5Db250YWluZXJcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgY29uc3QgcGFyZW50Q29udGFpbmVyID0gY29udGFpbmVyLnBhcmVudEVsZW1lbnRcbiAgICAgIGlmICghcGFyZW50Q29udGFpbmVyKSBicmVha1xuXG4gICAgICBjb25zdCBjaGlsZEVscyA9IEFycmF5LmZyb20oXG4gICAgICAgIHBhcmVudENvbnRhaW5lci5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEhUTUxFbGVtZW50PixcbiAgICAgICkuZmlsdGVyKFxuICAgICAgICAoZSkgPT5cbiAgICAgICAgICBlLmNsaWVudFdpZHRoID4gMSAmJlxuICAgICAgICAgIGUuY2xpZW50SGVpZ2h0ID4gMSAmJlxuICAgICAgICAgICFpc0hpZGRlbkVsZW1lbnQoZSkgJiZcbiAgICAgICAgICBlICE9PSBjb250YWluZXIsXG4gICAgICApXG4gICAgICBpZiAoY2hpbGRFbHMubGVuZ3RoID09IDApIGJyZWFrXG5cbiAgICAgIGNvbnN0IHtcbiAgICAgICAgd2lkdGg6IHBXaWR0aCxcbiAgICAgICAgbGVmdDogcExlZnQsXG4gICAgICAgIHJpZ2h0OiBwUmlnaHQsXG4gICAgICB9ID0gcGFyZW50Q29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBmb3IgKGNvbnN0IGVsIG9mIGNoaWxkRWxzKSB7XG4gICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgbGVmdCwgcmlnaHQgfSA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgIGlmIChcbiAgICAgICAgICB3aWR0aCA8IHBXaWR0aCAqIDAuMzUgJiZcbiAgICAgICAgICBoZWlnaHQgPj0gMzAwIC8vIGhlaWdodCBzaG91bGQgYmUgYXRsZWFzdCAzMDBweFxuICAgICAgICApIHtcbiAgICAgICAgICAvLyB0aGlzIGNvdWxkIGJlIHRoZSBsZWZ0IHNpZGViYXJcbiAgICAgICAgICBpZiAoTWF0aC5hYnMobGVmdCAtIHBMZWZ0KSA8PSA3NSkgc2lkZWJhckxlZnQgPSBlbFxuICAgICAgICAgIGVsc2UgaWYgKE1hdGguYWJzKHJpZ2h0IC0gcFJpZ2h0KSA8PSA3NSkgc2lkZWJhclJpZ2h0ID0gZWxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb250YWluZXIgPSBwYXJlbnRDb250YWluZXJcbiAgICAgIGlmIChcbiAgICAgICAgY29udGFpbmVyID09PSB0aGlzLmRvbS5hcHBCb2R5RWwgfHxcbiAgICAgICAgKHNpZGViYXJMZWZ0ICE9PSBudWxsICYmIHNpZGViYXJSaWdodCAhPT0gbnVsbClcbiAgICAgICkge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzaWRlYmFyTGVmdCxcbiAgICAgIHNpZGViYXJSaWdodCxcbiAgICB9XG4gIH1cblxuICBmaW5kU2lkZWJhcldyYXBwZXIoc2lkZWJhckNvbnRhaW5lcjogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgY2hpbGRFbHMgPSBBcnJheS5mcm9tKFxuICAgICAgc2lkZWJhckNvbnRhaW5lci5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEhUTUxFbGVtZW50PixcbiAgICApLmZpbHRlcigoZSkgPT4gIWlzSGlkZGVuRWxlbWVudChlKSlcblxuICAgIGlmIChjaGlsZEVscy5sZW5ndGggPT0gMSkge1xuICAgICAgcmV0dXJuIGNoaWxkRWxzWzBdXG4gICAgfVxuXG4gICAgY29uc3QgeyB3aWR0aDogY1dpZHRoLCBoZWlnaHQ6IGNIZWlnaHQgfSA9XG4gICAgICBzaWRlYmFyQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgbGV0IHJlc3VsdDogSFRNTEVsZW1lbnQgPSBzaWRlYmFyQ29udGFpbmVyXG4gICAgZm9yIChjb25zdCBlbCBvZiBjaGlsZEVscykge1xuICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgaWYgKHdpZHRoID49IGNXaWR0aCAqIDAuODUgJiYgaGVpZ2h0ID49IGNIZWlnaHQgKiAwLjg1KSB7XG4gICAgICAgIHJlc3VsdCA9IGVsXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8vIHJlYWRvbmx5IGNoZWNrU2lkZWJhckF2YWlsYWJsZSA9ICh0eXBlOiAncmlnaHQnIHwgJ2xlZnQnKSA9PiB7XG4gIC8vICAgY29uc3Qgd2lkdGhNYXhDb250ZW50ID1cbiAgLy8gICAgIGdldE1haW5Db250YWluZXJFbGVtZW50KG51bGwpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXG4gIC8vICAgLy8gVOG6oW8gcmEgaWQgdMOsbSBraeG6v20gduG7m2kgc2lkZWJhciB0aGVvIGlkIGhv4bq3YyBsw6AgY2xhc3NcbiAgLy8gICBjb25zdCB2ZXJpZnlUeXBlQnlJZCA9IGBbaWQqPVwic2lkZWJhclwiXTpub3QoW2lkKj1cIiR7dHlwZSA9PT0gJ3JpZ2h0JyA/ICdsZWZ0JyA6ICdyaWdodCd9XCJdKWBcbiAgLy8gICBjb25zdCB2ZXJpZnlUeXBlQnlDbGFzcyA9IGBbY2xhc3MqPVwic2lkZWJhclwiXTpub3QoW2lkKj1cIiR7dHlwZSA9PT0gJ3JpZ2h0JyA/ICdsZWZ0JyA6ICdyaWdodCd9XCJdKWBcbiAgLy8gICBjb25zdCBzaWRlYmFyQnlJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHZlcmlmeVR5cGVCeUlkKVxuICAvLyAgIC8vIMSQ4bqjbSBi4bqjbyBzaWRlYmFyIGPDsyB3aWR0aCBwaOG6o2kgbmjhu48gaMahbiBwaMOibiBu4butYSBwaOG6p24gdOG7rSBtYXhDb250ZW50XG4gIC8vICAgaWYgKFxuICAvLyAgICAgc2lkZWJhckJ5SWQgJiZcbiAgLy8gICAgIHNpZGViYXJCeUlkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIDwgd2lkdGhNYXhDb250ZW50ICogMC40XG4gIC8vICAgKVxuICAvLyAgICAgcmV0dXJuIHNpZGViYXJCeUlkXG4gIC8vICAgY29uc3Qgc2lkZWJhckJ5Q2xhc3MgPVxuICAvLyAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4odmVyaWZ5VHlwZUJ5Q2xhc3MpXG4gIC8vICAgaWYgKFxuICAvLyAgICAgc2lkZWJhckJ5Q2xhc3MgJiZcbiAgLy8gICAgIHNpZGViYXJCeUNsYXNzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIDwgd2lkdGhNYXhDb250ZW50ICogMC40XG4gIC8vICAgKVxuICAvLyAgICAgcmV0dXJuIHNpZGViYXJCeUNsYXNzXG4gIC8vICAgY29uc3Qgc2lkZWJhckJ5VGFnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ2FzaWRlJylcbiAgLy8gICBpZiAoXG4gIC8vICAgICBzaWRlYmFyQnlUYWcgJiZcbiAgLy8gICAgIHNpZGViYXJCeVRhZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCA8IHdpZHRoTWF4Q29udGVudCAqIDAuNFxuICAvLyAgIClcbiAgLy8gICAgIHJldHVybiBzaWRlYmFyQnlUYWdcbiAgLy8gICByZXR1cm4gbnVsbFxuICAvLyB9XG4gIC8vIHByaXZhdGUgZmluZENoaWxkT2ZTaWRlYmFyID0gKGVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCB8IHVuZGVmaW5lZCkgPT4ge1xuICAvLyAgIGlmICghZWxlbWVudCkgcmV0dXJuIG51bGxcbiAgLy8gICBsZXQgc2lkZWJhciA9IGVsZW1lbnRcbiAgLy8gICBjb25zdCBhcnJQYXJzZSA9IHBhcnNlRWxlbWVudE1pbldpZHRoKFxuICAvLyAgICAgQXJyYXkuZnJvbShcbiAgLy8gICAgICAgc2lkZWJhcj8uY2hpbGRyZW4gYXMgSFRNTENvbGxlY3Rpb25PZjxIVE1MRWxlbWVudD4sXG4gIC8vICAgICApIGFzIEhUTUxFbGVtZW50W10sXG4gIC8vICAgICA1MCxcbiAgLy8gICApXG4gIC8vICAgLy8gVMOsbSBwaOG6p24gdOG7rSBi4buNYyBk4buvIGxp4buHdSBiw6puIHRyb25nIHNpZGViYXIgKGRvIG7hur91IGzhuqV5IHBo4bqnbiB04butIGNoYSB0aMOsIHPhur0gZ+G6t3AgbOG7l2kga2hpIHBo4bqnbiB04butIGNvbiBzdGlja3kpXG4gIC8vICAgLy8gTuG6v3UgcGjhuqduIHThu60gY+G7p2EgY2jhu4kgY8OzIG3hu5l0IHRow6wgdGnhur9wIHThu6VjIMSRaSBzw6J1IHbDoG8gaG/hurdjIGzhuqV5IHBo4bqnbiB04butIGPDsyBjbGFzcyBsw6Agc3RpY2t5XG4gIC8vICAgaWYgKFxuICAvLyAgICAgc2lkZWJhciAmJlxuICAvLyAgICAgKGFyclBhcnNlLmxlbmd0aCA9PT0gMSB8fFxuICAvLyAgICAgICBBcnJheS5mcm9tKGFyclBhcnNlKS5maW5kKChpKSA9PlxuICAvLyAgICAgICAgIGkuY2xhc3NMaXN0LnRvU3RyaW5nKCkuaW5jbHVkZXMoJ3N0aWNreScpLFxuICAvLyAgICAgICApKVxuICAvLyAgICkge1xuICAvLyAgICAgd2hpbGUgKHRydWUpIHtcbiAgLy8gICAgICAgLy8gTOG7jWMgcmEgY8OhYyBwaOG6p24gdOG7rSBjw7Mgd2lkdGggcXXDoSBuaOG7j1xuICAvLyAgICAgICBjb25zdCBpdGVtc1BhcnNlID0gcGFyc2VFbGVtZW50TWluV2lkdGgoXG4gIC8vICAgICAgICAgQXJyYXkuZnJvbShcbiAgLy8gICAgICAgICAgIHNpZGViYXI/LmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8SFRNTEVsZW1lbnQ+LFxuICAvLyAgICAgICAgICkgYXMgSFRNTEVsZW1lbnRbXSxcbiAgLy8gICAgICAgICA1MCxcbiAgLy8gICAgICAgKVxuICAvLyAgICAgICAvLyBLaeG7g20gdHJhIHBo4bqnbiB04butIGNvbiBjw7MgY2jhu6lhIHBo4bqnbiB04butIGPDsyBjbGFzcyBsw6Agc3RpY2t5IGhheSBraMO0bmdcbiAgLy8gICAgICAgY29uc3QgaXNIYXZlRWxlbWVudFN0aWNreTogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQgPSBpdGVtc1BhcnNlLmZpbmQoXG4gIC8vICAgICAgICAgKGkpID0+IGkuY2xhc3NMaXN0LnRvU3RyaW5nKCkuaW5jbHVkZXMoJ3N0aWNreScpLFxuICAvLyAgICAgICApXG4gIC8vICAgICAgIGNvbnN0IGlzSGF2ZU9ubHlDaGlsZCA9IGl0ZW1zUGFyc2UubGVuZ3RoID09PSAxXG4gIC8vICAgICAgIC8vIE7hur91IGNo4buJIGPDsyBt4buZdCBjb24gaG/hurdjIHN0aWNreSB0aMOsIHRp4bq/cCB04bulYyB2w6BvIHRyb25nXG4gIC8vICAgICAgIGlmIChpc0hhdmVPbmx5Q2hpbGQpIHtcbiAgLy8gICAgICAgICBzaWRlYmFyID0gaXRlbXNQYXJzZVswXSBhcyBIVE1MRWxlbWVudFxuICAvLyAgICAgICB9IGVsc2UgaWYgKGlzSGF2ZUVsZW1lbnRTdGlja3kpIHtcbiAgLy8gICAgICAgICBzaWRlYmFyID0gaXNIYXZlRWxlbWVudFN0aWNreVxuICAvLyAgICAgICB9XG4gIC8vICAgICAgIC8vIE7hur91IGtow7RuZyBjw7JuIHBo4bqnbiB04butIG7DoG8gdGjDrCB0aG/DoXQgcmFcbiAgLy8gICAgICAgaWYgKCFpc0hhdmVPbmx5Q2hpbGQgJiYgIWlzSGF2ZUVsZW1lbnRTdGlja3kpIGJyZWFrXG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiBzaWRlYmFyXG4gIC8vIH1cbiAgLy8gcHJpdmF0ZSBjaGVja1NpZGViYXJXaXRoRWxlbWVudCA9IChcbiAgLy8gICBzaWRlYmFyOiBIVE1MRWxlbWVudCxcbiAgLy8gICBjb250ZW50OiBIVE1MRWxlbWVudCxcbiAgLy8gICB0eXBlOiAnbGVmdCcgfCAncmlnaHQnLFxuICAvLyApOiBib29sZWFuID0+IHtcbiAgLy8gICAvLyBM4bqleSByYSB24buLIHRyw60gdHLDoWkgcGjhuqNpIGPhu6dhIHBo4bqnbiB04butIGPDsyB0aOG7gyBsw6Agc2lkZWJhclxuICAvLyAgIGNvbnN0IHtcbiAgLy8gICAgIGxlZnQ6IGxlZnRTaWRlYmFyLFxuICAvLyAgICAgcmlnaHQ6IHJpZ2h0U2lkZWJhcixcbiAgLy8gICAgIHdpZHRoOiB3aWR0aFNpZGViYXIsXG4gIC8vICAgfSA9IHNpZGViYXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgLy8gICAvLyBM4bqleSByYSB24buLIHRyw60gdHLDoWkgcGjhuqNpIGPhu6dhIHBo4bqnbiBj4bunYSBjb250ZW50XG4gIC8vICAgY29uc3QgeyBsZWZ0OiBsZWZ0Q29udGVudCwgcmlnaHQ6IHJpZ2h0Q29udGVudCB9ID1cbiAgLy8gICAgIGNvbnRlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgLy8gICAvLyBsb+G6oWkgcmEgcGjhuqcgbiB04butIHNvIHPDoW5oIGzDoCBwaOG6p24gdOG7rSBjb250ZW50XG4gIC8vICAgaWYgKGxlZnRTaWRlYmFyID09PSBsZWZ0Q29udGVudCAmJiByaWdodFNpZGViYXIgPT09IHJpZ2h0Q29udGVudClcbiAgLy8gICAgIHJldHVybiBmYWxzZVxuICAvLyAgIC8vIFBo4bqjaSDEkeG6o20gYuG6o28gd2lkdGggdGjhuqVwIG5o4bqldCBj4bunYSBzaWRlYmFyXG4gIC8vICAgY29uc3QgaXNIYXZlTWluV2lkdGggPSB3aWR0aFNpZGViYXIgPiA1MFxuICAvLyAgIGlmICghaXNIYXZlTWluV2lkdGgpIHJldHVybiBmYWxzZVxuICAvLyAgIC8vIE7hur91IHjDqXQgcGjhuqcgbiB04butIHNpZGViYXIgYsOqbiB0csOhaSB0aMOsIHjDqXQgbcOpcCBiw6puIHBo4bqjaSBj4bunYSBzaWRlYmFyIHbDoCBtw6lwIGLDqm4gdHLDoWkgY+G7p2EgY29udGVudFxuICAvLyAgIGlmICh0eXBlID09PSAnbGVmdCcpIHtcbiAgLy8gICAgIHJldHVybiBNYXRoLmNlaWwocmlnaHRTaWRlYmFyKSA8PSBNYXRoLmNlaWwobGVmdENvbnRlbnQpXG4gIC8vICAgfVxuICAvLyAgIC8vIE5nxrDhu6NjIGzhuqFpIHBo4bqnbiB04butIHNpZGViYXIgYsOqbiBwaOG6o2kgdGjDrCB4w6l0IG3DqXAgYsOqbiB0csOhaSBj4bunYSBzaWRlYmFyIHbDoCBtw6lwIGLDqm4gcGjhuqNpIGPhu6dhIGNvbnRlbnRcbiAgLy8gICByZXR1cm4gTWF0aC5jZWlsKGxlZnRTaWRlYmFyKSA+PSBNYXRoLmNlaWwocmlnaHRDb250ZW50KVxuICAvLyB9XG4gIC8vIHJlYWRvbmx5IGdldFNpZGViYXIgPSAoXG4gIC8vICAgY29udGVudDogSFRNTEVsZW1lbnQgfCBudWxsLFxuICAvLyAgIHR5cGU6ICdsZWZ0JyB8ICdyaWdodCcsXG4gIC8vICk6IEhUTUxFbGVtZW50IHwgbnVsbCA9PiB7XG4gIC8vICAgaWYgKHR5cGUgPT09ICdsZWZ0Jykge1xuICAvLyAgICAgbGV0IHNpZGViYXIgPSB0aGlzLmNoZWNrU2lkZWJhckF2YWlsYWJsZSh0eXBlKVxuICAvLyAgICAgLy8gVMOsbSBwaOG6p24gdOG7rSBjb24gdGjhu7FjIHPhu7FcbiAgLy8gICAgIHNpZGViYXIgPSB0aGlzLmZpbmRDaGlsZE9mU2lkZWJhcihzaWRlYmFyKVxuICAvLyAgICAgaWYgKFxuICAvLyAgICAgICBzaWRlYmFyICYmXG4gIC8vICAgICAgIE1hdGguY2VpbChzaWRlYmFyPy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5yaWdodCkgPD1cbiAgLy8gICAgICAgICBNYXRoLmNlaWwoY29udGVudCEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCkgJiZcbiAgLy8gICAgICAgc2lkZWJhclxuICAvLyAgICAgKSB7XG4gIC8vICAgICAgIHJldHVybiBzaWRlYmFyXG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyAgIC8vIERvIGzDoCB0w6xtIHNpZGViYXIgdHLDoWkgxJHhuqd1IHRpw6puIG7Dqm4gdHJvbmcgbMO6YyB0w6xtIHRoZW8gY8OhY2ggY8ahIGLhuqNuIGPDsyB0aOG7gyB0csO5bmdcbiAgLy8gICBpZiAoIWNvbnRlbnQpIHJldHVybiBudWxsXG4gIC8vICAgLy8gVMOsbSBzaWRlYmFyIGThu7FhIHRoZW8gY29udGVudFxuICAvLyAgIGxldCByaWdodFNpZGViYXI6IEhUTUxFbGVtZW50IHwgbnVsbCB8IHVuZGVmaW5lZCA9IEFycmF5LmZyb20oXG4gIC8vICAgICBjb250ZW50LnBhcmVudEVsZW1lbnQhLmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8SFRNTEVsZW1lbnQ+LFxuICAvLyAgICkuZmluZCgoc2lkZWJhcikgPT4gdGhpcy5jaGVja1NpZGViYXJXaXRoRWxlbWVudChzaWRlYmFyLCBjb250ZW50LCB0eXBlKSlcbiAgLy8gICByaWdodFNpZGViYXIgPSB0aGlzLmZpbmRDaGlsZE9mU2lkZWJhcihyaWdodFNpZGViYXIpXG4gIC8vICAgcmV0dXJuIHJpZ2h0U2lkZWJhclxuICAvLyB9XG59XG4iLCJpbXBvcnQgeyBTY3JpcHRTZXJ2aWNlIH0gZnJvbSAnQC9zZXJ2aWNlcydcbmltcG9ydCB0aHJvdHRsZSBmcm9tICdsb2Rhc2gvdGhyb3R0bGUnXG5cbmV4cG9ydCBjbGFzcyBUcmFja2VyIHtcbiAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IFRyYWNrZXJcblxuICBwcml2YXRlIF92aXNpdElkITogc3RyaW5nIHwgbnVsbFxuXG4gIHJlYWRvbmx5IHNlcnZpY2UhOiBTY3JpcHRTZXJ2aWNlXG4gIHN1YkRpc3RlbmNlITogbnVtYmVyXG4gIG1vdXNlTW92ZW1lbnRzITogTW91c2VNb3ZlbWVudEluZm9bXVtdXG4gIGxhc3RNb3VzZU1vdmVtZW50ITogTW91c2VNb3ZlbWVudEluZm8gfCBudWxsXG4gIGludGVydmFsQ2hlY2tNb3VzZU1vdmVtZW50cyE6IFJldHVyblR5cGU8dHlwZW9mIHNldEludGVydmFsPiB8IG51bGxcbiAgZXZlbnRIYW5kbGVycyE6IE1hcDxzdHJpbmcsIChldmVudDogRXZlbnQpID0+IHZvaWQ+XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKCFUcmFja2VyLmluc3RhbmNlKSB7XG4gICAgICBjb25zb2xlLmxvZygnbmV3IGluc3RhbmNlIFRyYWNrZXInKVxuICAgICAgVHJhY2tlci5pbnN0YW5jZSA9IHRoaXNcblxuICAgICAgdGhpcy5fdmlzaXRJZCA9IG51bGxcblxuICAgICAgdGhpcy5zZXJ2aWNlID0gbmV3IFNjcmlwdFNlcnZpY2UoKVxuICAgICAgdGhpcy5tb3VzZU1vdmVtZW50cyA9IFtdXG4gICAgICB0aGlzLmxhc3RNb3VzZU1vdmVtZW50ID0gbnVsbFxuICAgICAgdGhpcy5zdWJEaXN0ZW5jZSA9IE1hdGguZmxvb3Iod2luZG93LmlubmVyV2lkdGggKiAwLjAwNSlcbiAgICAgIHRoaXMuaW50ZXJ2YWxDaGVja01vdXNlTW92ZW1lbnRzID0gbnVsbFxuICAgICAgdGhpcy5ldmVudEhhbmRsZXJzID0gbmV3IE1hcCgpXG4gICAgfVxuICAgIHJldHVybiBUcmFja2VyLmluc3RhbmNlXG4gIH1cblxuICBzZXQgdmlzaXRJZCh2aXNpdElkOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92aXNpdElkID0gdmlzaXRJZFxuICB9XG5cbiAgZ2V0IHZpc2l0SWQoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3Zpc2l0SWRcbiAgfVxuXG4gIGFkZFRvTW91c2VNb3ZlbWVudHMoZGF0YTogTW91c2VNb3ZlbWVudEluZm8pIHtcbiAgICBpZiAodGhpcy5tb3VzZU1vdmVtZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgdGhpcy5tb3VzZU1vdmVtZW50cy5wdXNoKFtkYXRhXSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbGFzdEFycmF5ID0gdGhpcy5tb3VzZU1vdmVtZW50c1t0aGlzLm1vdXNlTW92ZW1lbnRzLmxlbmd0aCAtIDFdXG4gICAgICBpZiAobGFzdEFycmF5Lmxlbmd0aCA8IDEwMCkge1xuICAgICAgICBsYXN0QXJyYXkucHVzaChkYXRhKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb3VzZU1vdmVtZW50cy5wdXNoKFtkYXRhXSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsaXN0ZW5Nb3VzZU1vdmVtZW50KCkge1xuICAgIGNvbnN0IG1vdXNlTW92ZUhhbmRsZXIgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHsgcGFnZVgsIHBhZ2VZIH0gPSBldmVudFxuICAgICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKVxuXG4gICAgICBpZiAodGhpcy5tb3VzZU1vdmVtZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICBjb25zdCBtb3ZlbWVudDogTW91c2VNb3ZlbWVudEluZm8gPSB7XG4gICAgICAgICAgeDogcGFnZVgsXG4gICAgICAgICAgeTogcGFnZVksXG4gICAgICAgICAgc3BlZWQ6IDAsXG4gICAgICAgICAgZXZlbnRfdHlwZTogJ21vdmUnLFxuICAgICAgICAgIHRpbWVzdGFtcDogdGltZXN0YW1wLFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkVG9Nb3VzZU1vdmVtZW50cyhtb3ZlbWVudClcbiAgICAgICAgdGhpcy5sYXN0TW91c2VNb3ZlbWVudCA9IG1vdmVtZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBsYXN0TW92ZW1lbnQgPSB0aGlzLmxhc3RNb3VzZU1vdmVtZW50XG4gICAgICAgIGlmICghbGFzdE1vdmVtZW50KSByZXR1cm5cblxuICAgICAgICBjb25zdCBkZWx0YSA9IE1hdGguc3FydChcbiAgICAgICAgICAocGFnZVggLSBsYXN0TW92ZW1lbnQueCkgKiogMiArIChwYWdlWSAtIGxhc3RNb3ZlbWVudC55KSAqKiAyLFxuICAgICAgICApXG4gICAgICAgIGlmIChkZWx0YSA+IHRoaXMuc3ViRGlzdGVuY2UpIHtcbiAgICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICBkZWx0YSAvICh0aW1lc3RhbXAgLSBsYXN0TW92ZW1lbnQudGltZXN0YW1wKSxcbiAgICAgICAgICApXG4gICAgICAgICAgY29uc3QgbW92ZW1lbnQ6IE1vdXNlTW92ZW1lbnRJbmZvID0ge1xuICAgICAgICAgICAgeDogcGFnZVgsXG4gICAgICAgICAgICB5OiBwYWdlWSxcbiAgICAgICAgICAgIHNwZWVkOiB2ZWxvY2l0eSxcbiAgICAgICAgICAgIGV2ZW50X3R5cGU6ICdtb3ZlJyxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogdGltZXN0YW1wLFxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmxhc3RNb3VzZU1vdmVtZW50ID0gbW92ZW1lbnRcbiAgICAgICAgICB0aGlzLmFkZFRvTW91c2VNb3ZlbWVudHMobW92ZW1lbnQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0aHJvdHRsZSBmb3IgNTBtc1xuICAgIGNvbnN0IHNjcm9sbEhhbmRsZXIgPSB0aHJvdHRsZSgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMubGFzdE1vdXNlTW92ZW1lbnQpIHJldHVyblxuXG4gICAgICAvLyBUT0RPOiBORUVEIFRPIFJFVklFVyBUSElTXG4gICAgICBjb25zdCBtb3ZlbWVudDogTW91c2VNb3ZlbWVudEluZm8gPSB7XG4gICAgICAgIHg6IHRoaXMubGFzdE1vdXNlTW92ZW1lbnQueCxcbiAgICAgICAgeTogdGhpcy5sYXN0TW91c2VNb3ZlbWVudC55LFxuICAgICAgICBzcGVlZDogMCxcbiAgICAgICAgZXZlbnRfdHlwZTogJ3Njcm9sbCcsXG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgIH1cbiAgICAgIHRoaXMuYWRkVG9Nb3VzZU1vdmVtZW50cyhtb3ZlbWVudClcbiAgICB9LCA1MClcblxuICAgIHRoaXMuZXZlbnRIYW5kbGVycy5zZXQoJ21vdXNlbW92ZScsIG1vdXNlTW92ZUhhbmRsZXIpXG4gICAgdGhpcy5ldmVudEhhbmRsZXJzLnNldCgnc2Nyb2xsJywgc2Nyb2xsSGFuZGxlcilcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlTW92ZUhhbmRsZXIpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc2Nyb2xsSGFuZGxlcilcbiAgICB0aGlzLnN0YXJ0TW91c2VNb3ZlbWVudHNJbnRlcnZhbGx5KClcbiAgfVxuXG4gIHJlbW92ZU1vdXNlTW92ZW1lbnRFdmVudHMoKSB7XG4gICAgaWYgKHRoaXMuaW50ZXJ2YWxDaGVja01vdXNlTW92ZW1lbnRzKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWxDaGVja01vdXNlTW92ZW1lbnRzKVxuICAgICAgdGhpcy5pbnRlcnZhbENoZWNrTW91c2VNb3ZlbWVudHMgPSBudWxsXG4gICAgfVxuXG4gICAgdGhpcy5ldmVudEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIsIGV2ZW50VHlwZSkgPT4ge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGhhbmRsZXIpXG4gICAgfSlcbiAgICB0aGlzLmV2ZW50SGFuZGxlcnMuY2xlYXIoKVxuICB9XG5cbiAgc3RhcnRNb3VzZU1vdmVtZW50c0ludGVydmFsbHkoKSB7XG4gICAgdGhpcy5pbnRlcnZhbENoZWNrTW91c2VNb3ZlbWVudHMgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMudmlzaXRJZCB8fCB0aGlzLm1vdXNlTW92ZW1lbnRzLmxlbmd0aCA9PSAwKSByZXR1cm5cblxuICAgICAgY29uc3QgZmlyc3RBcnIgPSB0aGlzLm1vdXNlTW92ZW1lbnRzWzBdXG4gICAgICBpZiAoZmlyc3RBcnIubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLnNlcnZpY2VcbiAgICAgICAgICAuc2VuZE1vdXNlTW92ZW1lbnRzKHRoaXMudmlzaXRJZCwge1xuICAgICAgICAgICAgbW91c2VNb3ZlbWVudHM6IGZpcnN0QXJyLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igc2VuZGluZyBtb3VzZSBtb3ZlbWVudHM6JywgZXJyb3IpXG4gICAgICAgICAgfSlcbiAgICAgICAgdGhpcy5tb3VzZU1vdmVtZW50cy5zaGlmdCgpXG4gICAgICB9XG4gICAgfSwgNTAwMClcbiAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IEJBU0VfVVJMID0gJ2h0dHBzOi8vYXBpLWFkcy5hdHRvYWlvei5jeW91L2FwaS92MSdcbmV4cG9ydCBjb25zdCBCQVNFX0RFVl9VUkwgPSAnaHR0cDovLzE1Ny4yMzAuMTk1LjM3OjgwODQvYXBpL3YxJ1xuIiwiZXhwb3J0ICogZnJvbSAnLi9lbnZpcm9ubWVudHMnXG4iLCIvLyBleHBvcnQgY29uc3QgQVRUUklCVVRFX01BTlVBTF9BRF9GT1JNQVQgPSAnZGF0YS1hZC1mb3JtYXQnXG4vLyBleHBvcnQgY29uc3QgQVRUUklCVVRFX0NMQVNTTkFNRV9BRCA9ICdhaW96QWRzJ1xuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9NQU5VQUxfQURfQ0xJRU5UID0gJ2RhdGEtYWQtY2xpZW50J1xuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9NQU5VQUxfQURfU0xPVCA9ICdkYXRhLWFkLXNsb3QtaWQnXG5cbmV4cG9ydCBjb25zdCBBVFRSSUJVVEVfQURfRk9STUFUID0gJ2RhdGEtYWQtZm9ybWF0JyAvLyBpbi1wYWdlIHwgb3ZlcmxheVxuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9BVVRPX0FEX1BPUyA9ICdkYXRhLWFkLWluLXBhZ2UtcG9zJ1xuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9PVkVSTEFZX0FEX1BPUyA9ICdkYXRhLWFkLW92ZXJsYXktcG9zJ1xuXG5leHBvcnQgY29uc3QgQVRUUklCVVRFX0FEX1BBTkVMX0lEID0gJ2RhdGEtYWQtcGFuZWwtaWQnXG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0ZFVENIX0FEU19JTlRFUlZBTCA9IDMwICogMTAwMFxuXG5leHBvcnQgY29uc3QgSUdOT1JFRF9FTEVNRU5UUyA9IFsnc2NyaXB0JywgJ2xpbmsnLCAnbm9zY3JpcHQnLCAnaWZyYW1lJ11cblxuZXhwb3J0IGNvbnN0IEFEX0NMQVNTRVMgPSB7XG4gIFJFU0VUX1NUWUxFOiAnYWQtcmVzZXQnLFxuICBJQ09OX1NNX1dSQVBQRVI6ICdhZC1pY29uLXNtLXdyYXBwZXInLFxuICBJQ09OX0xHX1dSQVBQRVI6ICdhZC1pY29uLWxnLXdyYXBwZXInLFxuICBCVVRUT05fRUxFTUVOVDogJ2FkLWRlZmF1bHQtYnV0dG9uJyxcbiAgQU5DSE9SX0VMRU1FTlQ6ICdhZC1kZWZhdWx0LWFuY2hvcicsXG5cbiAgQUlPWl9BRF9JTlM6ICdhaW96LWFkcycsXG4gIENPTlRBSU5FUjogJ2FkLWNvbnRhaW5lcicsXG4gIFJPV19DT05UQUlORVI6ICdhZC1yb3ctY29udGFpbmVyJyxcbiAgQ09MX0NPTlRBSU5FUjogJ2FkLWNvbC1jb250YWluZXInLFxuICBPVVRFUl9XUkFQUEVSOiAnYWQtb3V0ZXItd3JhcHBlcicsXG4gIElORElDQVRPUl9TUEFOOiAnYWQtaW5kaWNhdG9yLXNwYW4nLFxuICBBRF9JTUdfV1JBUFBFUjogJ2FkLWltYWdlLXdyYXBwZXInLFxuICBBRF9JTUdfRUxFTUVOVDogJ2FkLWltYWdlLWVsZW1lbnQnLFxuXG4gIEFJT1pfQURfT1ZFUkxBWTogJ2Fpb3otYWRzLW92ZXJsYXknLFxuICAvLyBPVkVSTEFZX0ZJWEVEX0NPTlRBSU5FUjogJ2FkLW92ZXJsYXktY29udGFpbmVyJyxcbiAgRlVMTFNDUkVFTl9CTFVSX09WRVJMQVk6ICdhZC1mdWxsc2NyZWVuLWJsdXItb3ZlcmxheScsXG4gIERJQUxPR19DT05UQUlORVI6ICdhZC1kaWFsb2ctY29udGFpbmVyLW92ZXJsYXknLFxuICBESUFMT0dfQkc6ICdhZC1kaWFsb2ctYmctb3ZlcmxheScsXG59XG4iLCJpbXBvcnQgeyBCQVNFX1VSTCB9IGZyb20gJ0AvY29uZmlncydcbmltcG9ydCB7IEdldEFkc0JvZHksIEdldEFkc0RhdGEgfSBmcm9tICdAL3R5cGVzL3NlcnZpY2UvZ2V0LWFkcydcbmltcG9ydCB7IEludGVyYWN0QWREYXRhLCBJbnRlcmFjdEFkQm9keSB9IGZyb20gJ0AvdHlwZXMvc2VydmljZS9pbnRlcmFjdC1hZHMnXG5pbXBvcnQge1xuICBTZW5kTW92ZW1lbnRzQm9keSxcbiAgU2VuZE1vdmVtZW50c0RhdGEsXG59IGZyb20gJ0AvdHlwZXMvc2VydmljZS9zZW5kLW1vdmVtZW50cydcbmltcG9ydCB7XG4gIFVwZGF0ZUFkU2Vzc2lvbkJvZHksXG4gIFVwZGF0ZUFkU2Vzc2lvbkRhdGEsXG59IGZyb20gJ0AvdHlwZXMvc2VydmljZS91cGRhdGUtYWQtc2Vzc2lvbidcbmltcG9ydCBheGlvcywgeyBBeGlvc0Vycm9yLCBBeGlvc1JlcXVlc3RDb25maWcgfSBmcm9tICdheGlvcydcblxuZXhwb3J0IGNsYXNzIFNjcmlwdFNlcnZpY2Uge1xuICBwcml2YXRlIHJlYWRvbmx5IHVybDogc3RyaW5nID0gQkFTRV9VUkxcblxuICBhc3luYyBnZXRBZHMoYm9keTogR2V0QWRzQm9keSwgY29uZmlnOiBBeGlvc1JlcXVlc3RDb25maWcgPSB7fSkge1xuICAgIGNvbnN0IHVybCA9IHRoaXMudXJsICsgJy9hdWN0aW9ucydcbiAgICByZXR1cm4gYXhpb3NcbiAgICAgIC5wb3N0PFJlc3BvbnNlRGF0YTxHZXRBZHNEYXRhPj4odXJsLCBib2R5LCBjb25maWcpXG4gICAgICAuY2F0Y2goKGVycm9yOiBFcnJvciB8IEF4aW9zRXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGF4aW9zLmlzQXhpb3NFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICBsZXQgbWVzc2FnZSA9ICdFcnJvciB3aGVuIHJlcXVlc3RpbmcnXG4gICAgICAgICAgLy8gQWNjZXNzIHRvIGNvbmZpZywgcmVxdWVzdCwgYW5kIHJlc3BvbnNlXG4gICAgICAgICAgaWYgKGVycm9yLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IucmVzcG9uc2UuZGF0YS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IEVycm9yKG1lc3NhZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSnVzdCBhIHN0b2NrIGVycm9yXG4gICAgICAgICAgdGhyb3cgRXJyb3IoZXJyb3IubWVzc2FnZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgfVxuXG4gIGFzeW5jIGludGVyYWN0QWQoYm9keTogSW50ZXJhY3RBZEJvZHksIGNvbmZpZzogQXhpb3NSZXF1ZXN0Q29uZmlnID0ge30pIHtcbiAgICBjb25zdCB1cmwgPSB0aGlzLnVybCArICcvYWN0aW9ucydcbiAgICByZXR1cm4gYXhpb3NcbiAgICAgIC5wb3N0PFJlc3BvbnNlRGF0YTxJbnRlcmFjdEFkRGF0YT4+KHVybCwgYm9keSwgY29uZmlnKVxuICAgICAgLmNhdGNoKChlcnJvcjogRXJyb3IgfCBBeGlvc0Vycm9yKSA9PiB7XG4gICAgICAgIGlmIChheGlvcy5pc0F4aW9zRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgbGV0IG1lc3NhZ2UgPSAnRXJyb3Igd2hlbiByZXF1ZXN0aW5nJ1xuICAgICAgICAgIC8vIEFjY2VzcyB0byBjb25maWcsIHJlcXVlc3QsIGFuZCByZXNwb25zZVxuICAgICAgICAgIGlmIChlcnJvci5yZXNwb25zZSkge1xuICAgICAgICAgICAgbWVzc2FnZSA9IGVycm9yLnJlc3BvbnNlLmRhdGEubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBFcnJvcihtZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEp1c3QgYSBzdG9jayBlcnJvclxuICAgICAgICAgIHRocm93IEVycm9yKGVycm9yLm1lc3NhZ2UpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gIH1cblxuICBhc3luYyBzZW5kTW91c2VNb3ZlbWVudHMoXG4gICAgdmlzaXRJZDogc3RyaW5nLFxuICAgIGJvZHk6IFNlbmRNb3ZlbWVudHNCb2R5LFxuICAgIGNvbmZpZzogQXhpb3NSZXF1ZXN0Q29uZmlnID0ge30sXG4gICkge1xuICAgIGNvbnN0IHVybCA9IHRoaXMudXJsICsgJy92aXNpdHMvJyArIHZpc2l0SWQgKyAnL21vdXNlLW1vdmVtZW50cydcbiAgICByZXR1cm4gYXhpb3NcbiAgICAgIC5wdXQ8UmVzcG9uc2VEYXRhPFNlbmRNb3ZlbWVudHNEYXRhPj4odXJsLCBib2R5LCBjb25maWcpXG4gICAgICAuY2F0Y2goKGVycm9yOiBFcnJvciB8IEF4aW9zRXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGF4aW9zLmlzQXhpb3NFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICBsZXQgbWVzc2FnZSA9ICdFcnJvciB3aGVuIHJlcXVlc3RpbmcnXG4gICAgICAgICAgLy8gQWNjZXNzIHRvIGNvbmZpZywgcmVxdWVzdCwgYW5kIHJlc3BvbnNlXG4gICAgICAgICAgaWYgKGVycm9yLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IucmVzcG9uc2UuZGF0YS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IEVycm9yKG1lc3NhZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSnVzdCBhIHN0b2NrIGVycm9yXG4gICAgICAgICAgdGhyb3cgRXJyb3IoZXJyb3IubWVzc2FnZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUFkU2Vzc2lvbihcbiAgICBwYW5lbElkOiBzdHJpbmcsXG4gICAgYm9keTogVXBkYXRlQWRTZXNzaW9uQm9keSxcbiAgICBjb25maWc6IEF4aW9zUmVxdWVzdENvbmZpZyA9IHt9LFxuICApIHtcbiAgICBjb25zdCB1cmwgPSB0aGlzLnVybCArICcvYWQtcGFuZWxzLycgKyBwYW5lbElkICsgJy9zZXNzaW9uLWR1cmF0aW9uJ1xuICAgIHJldHVybiBheGlvc1xuICAgICAgLnB1dDxSZXNwb25zZURhdGE8VXBkYXRlQWRTZXNzaW9uRGF0YT4+KHVybCwgYm9keSwgY29uZmlnKVxuICAgICAgLmNhdGNoKChlcnJvcjogRXJyb3IgfCBBeGlvc0Vycm9yKSA9PiB7XG4gICAgICAgIGlmIChheGlvcy5pc0F4aW9zRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgbGV0IG1lc3NhZ2UgPSAnRXJyb3Igd2hlbiByZXF1ZXN0aW5nJ1xuICAgICAgICAgIC8vIEFjY2VzcyB0byBjb25maWcsIHJlcXVlc3QsIGFuZCByZXNwb25zZVxuICAgICAgICAgIGlmIChlcnJvci5yZXNwb25zZSkge1xuICAgICAgICAgICAgbWVzc2FnZSA9IGVycm9yLnJlc3BvbnNlLmRhdGEubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBFcnJvcihtZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEp1c3QgYSBzdG9jayBlcnJvclxuICAgICAgICAgIHRocm93IEVycm9yKGVycm9yLm1lc3NhZ2UpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gIH1cbn1cbiIsImV4cG9ydCAqIGZyb20gJy4vYWRTZXJ2aWNlcydcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NpbmdsZXRvblN0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgXG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlcy5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5vcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsImV4cG9ydCBlbnVtIEFkUmF0aW8ge1xuICBMQU5EU0NBUEUgPSAxLjkxLFxuICBSRVZFUlNFX0xBTkRTQ0FQRSA9IDAuNTIzNSwgLy8gMToxLjkxXG4gIFNRUiA9IDEsXG4gIENPTF9SRUNUID0gMC41NjI1LCAvLyA5OjE2XG4gIFJPV19SRUNUID0gMS43Nzc4LCAvLyAxNjo5XG4gIE1JTl9TSVpFX1NRUiA9IDMwMCxcbiAgTUlOX1NJWkVfUkVDVCA9IDYwMCxcbn1cbiIsImltcG9ydCB7XG4gIEFEX0NMQVNTRVMsXG4gIEFUVFJJQlVURV9BRF9GT1JNQVQsXG4gIEFUVFJJQlVURV9BVVRPX0FEX1BPUyxcbiAgQVRUUklCVVRFX01BTlVBTF9BRF9TTE9ULFxuICBBVFRSSUJVVEVfT1ZFUkxBWV9BRF9QT1MsXG4gIElHTk9SRURfRUxFTUVOVFMsXG59IGZyb20gJ0AvY29uc3RhbnRzJ1xuaW1wb3J0IHsgQWRSYXRpbyB9IGZyb20gJ0AvdHlwZXMvZW51bSdcblxuZXhwb3J0IGNvbnN0IGZpbmRFbGVtZW50V2l0aEtleSA9IChlbDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nKSA9PlxuICBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5KSB8fFxuICBlbC5jbGFzc0xpc3QudG9TdHJpbmcoKS5pbmNsdWRlcyhrZXkpIHx8XG4gIGVsLmlkLmluY2x1ZGVzKGtleSlcblxuZXhwb3J0IGNvbnN0IGZpbHRlckVsZW1lbnRDaGlsZHJlbldpdGhUYWdOYW1lID0gKFxuICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgdGFnOiBzdHJpbmcsXG4pID0+XG4gIEFycmF5LmZyb20oZWxlbWVudC5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEhUTUxFbGVtZW50PikuZmlsdGVyKFxuICAgIChpKSA9PiBpLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gdGFnLFxuICApXG5cbmV4cG9ydCBjb25zdCBwYXJzZVdpZHRoRWxlbWVudCA9IChlbGVtZW50OiBIVE1MRWxlbWVudCkgPT5cbiAgTWF0aC5jZWlsKE51bWJlcihnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLndpZHRoLnJlcGxhY2UoJ3B4JywgJycpKSlcblxuZXhwb3J0IGNvbnN0IGhlaWdodEVsZW1lbnQgPSAoZWxlbWVudDogSFRNTEVsZW1lbnQpID0+XG4gIE1hdGguY2VpbChOdW1iZXIoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5oZWlnaHQucmVwbGFjZSgncHgnLCAnJykpKVxuXG5leHBvcnQgY29uc3QgZ2V0TWFpbkNvbnRhaW5lckVsZW1lbnQgPSAoaGVhZGVyOiBIVE1MRWxlbWVudCB8IG51bGwpID0+IHtcbiAgLy8gVMOsbSByYSBwaOG6p24gdOG7rSBtYWluIGPhu6dhIGRvY3VtZW50XG4gIGxldCB3cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJ21haW4nKVswXSBhcyBIVE1MRWxlbWVudFxuXG4gIC8vIE7hur91IGtow7RuZyBjw7MgdGjDrCBjw7MgdGjhu4MgbOG6p3kgcGjhuqduIHThu60gYm9keVxuICBpZiAoIXdyYXBwZXIpIHtcbiAgICB3cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJ2JvZHknKVswXSBhcyBIVE1MRWxlbWVudFxuICB9XG5cbiAgLy8gTuG6v3UgcGjhuqduIHThu60gaGVhZGVyIMSRw6MgxJHGsOG7o2MgeMOhYyDEkWluaCB0aMOsIGPDsyB0aOG7gyBs4bqleSBwaOG6p24gdOG7rSBjaGEgY+G7p2EgaGVhZGVyXG4gIGlmIChoZWFkZXIpIHtcbiAgICB3cmFwcGVyID0gaGVhZGVyLnBhcmVudEVsZW1lbnQhXG4gICAgd2hpbGUgKHdyYXBwZXIuY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgICB3cmFwcGVyID0gd3JhcHBlci5wYXJlbnRFbGVtZW50IVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB3cmFwcGVyXG59XG5cbmV4cG9ydCBjb25zdCBwYXJzZUVsZW1lbnRNaW5XaWR0aCA9IChcbiAgZWxlbWVudHM6IEhUTUxFbGVtZW50W10sXG4gIHdpZHRoOiBudW1iZXIsXG4pID0+IHtcbiAgcmV0dXJuIGVsZW1lbnRzLmZpbHRlcihcbiAgICAoZWxlbWVudCkgPT4gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCA+IHdpZHRoLFxuICApXG59XG5cbi8vIGV4cG9ydCBjb25zdCBwYXJzZUVsZW1lbnRUb0FkVW5pdCA9IChlbGVtZW50OiBIVE1MRWxlbWVudCk6IEFkVW5pdCA9PiAoe1xuLy8gICAvLyBUT0RPOiBuZWVkIHRvIHJlc29sdmUgdGhpcyBpZCBwcm9wZXJ0eVxuLy8gICBpZDogRGF0ZS5ub3coKS50b1N0cmluZygpLFxuLy8gICBpZENsaWVudDogZWxlbWVudC5nZXRBdHRyaWJ1dGUoQVRUUklCVVRFX01BTlVBTF9BRF9DTElFTlQpID8/ICcnLFxuLy8gICBpZFNsb3Q6IGVsZW1lbnQuZ2V0QXR0cmlidXRlKEFUVFJJQlVURV9NQU5VQUxfQURfU0xPVCkgPz8gJycsXG4vLyAgIGlkVHlwZUF1dG86IGVsZW1lbnQuZ2V0QXR0cmlidXRlKEFUVFJJQlVURV9BVVRPTUFUSU9OX0FEUykgPz8gJycsXG4vLyAgIGlzVmVyaWZ5OiBmYWxzZSxcbi8vICAgZm9ybWF0OiBlbGVtZW50LmdldEF0dHJpYnV0ZShBVFRSSUJVVEVfTUFOVUFMX0FEX0ZPUk1BVCkgPz8gJycsXG4vLyAgIGxheW91dDogZWxlbWVudC5nZXRBdHRyaWJ1dGUoQVRUUklCVVRFX01BTlVBTF9BRF9LRVkpID8/ICcnLFxuLy8gICBjbGFzczogZWxlbWVudC5jbGFzc05hbWUsXG4vLyAgIGRhdGE6ICcnLFxuLy8gICBub2RlOiBlbGVtZW50LFxuLy8gICBzaG93OiBmYWxzZSxcbi8vICAgdHlwZTogJ21hbnVhbCcsXG4vLyB9KVxuXG4vLyAhIENvbmRpdGlvbnMgaGVyZSBpcyBub3QgZ29vZCB3aXRoIGFsbCBjYXNlc1xuLy8gQmVjYXVzZSBpZiBpbiBib2R5IGhhdmUgbWFueSA8ZGl2PiBhbmQgPGRpdj4gY29udGFpbiBtYWluIGNvbnRlbnQgaXMgaW4gdGhlIG1pZGRsZSBvZiB0aGUgcGFnZVxuLy8gU2FtZSBhcyBjb25kaXRpb24gY2hlY2sgaGVhZGVyLCBjb250ZW50LCBmb290ZXJcblxuZXhwb3J0IGNvbnN0IGdldEFkc0luc1F1ZXJ5ID0gKCkgPT5cbiAgYDpzY29wZSBpbnNbY2xhc3M9XCIke0FEX0NMQVNTRVMuQUlPWl9BRF9JTlN9XCJdYFxuZXhwb3J0IGNvbnN0IGdldE1hbnVhbEluc1F1ZXJ5ID0gKCkgPT5cbiAgYDpzY29wZSBpbnNbY2xhc3M9XCIke0FEX0NMQVNTRVMuQUlPWl9BRF9JTlN9XCJdWyR7QVRUUklCVVRFX01BTlVBTF9BRF9TTE9UfV1gXG5leHBvcnQgY29uc3QgZ2V0QXV0b0luc1F1ZXJ5ID0gKCkgPT5cbiAgYDpzY29wZSBpbnNbY2xhc3M9XCIke0FEX0NMQVNTRVMuQUlPWl9BRF9JTlN9XCJdWyR7QVRUUklCVVRFX0FEX0ZPUk1BVH09XCJpbi1wYWdlXCJdWyR7QVRUUklCVVRFX0FVVE9fQURfUE9TfV1gXG5leHBvcnQgY29uc3QgZ2V0T3ZlcmxheUluc1F1ZXJ5ID0gKCkgPT5cbiAgYDpzY29wZSBpbnNbY2xhc3M9XCIke0FEX0NMQVNTRVMuQUlPWl9BRF9JTlN9XCJdWyR7QVRUUklCVVRFX0FEX0ZPUk1BVH09XCJvdmVybGF5XCJdWyR7QVRUUklCVVRFX09WRVJMQVlfQURfUE9TfV1gXG5cbmV4cG9ydCBjb25zdCBmaWx0ZXJFbGVtZW50c05vdEhhdmVDb250ZW50ID0gKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB7XG4gIC8vIEzhu41jIHJhIGPDoWMgcGjhuqduIHThu60gxJHGsOG7o2MgY2hvIGzDoCBraMO0bmcgY8OzIGNvbnRlbnQgaG/hurdjIGPDoWMgY29udGVudCBraMO0bmcgaGnhu4NuIHRo4buLXG4gIHJldHVybiBBcnJheS5mcm9tKGVsZW1lbnQuY2hpbGRyZW4gYXMgSFRNTENvbGxlY3Rpb25PZjxIVE1MRWxlbWVudD4pLmZpbHRlcihcbiAgICAoaSkgPT4gIUlHTk9SRURfRUxFTUVOVFMuaW5jbHVkZXMoaS50YWdOYW1lLnRvTG93ZXJDYXNlKCkpLFxuICApXG59XG5cbi8vIFVzZWQgdG8gY2hlY2sgaWYgYW4gZWxlbWVudCBpcyBjb25zaWRlcmVkIHRvIGJlIGhpZGRlblxuZXhwb3J0IGNvbnN0IGlzSGlkZGVuRWxlbWVudCA9IChlbGVtZW50OiBIVE1MRWxlbWVudCkgPT4ge1xuICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9jaGVja1Zpc2liaWxpdHlcbiAgY29uc3QgZWxWaXNpYmlsaXR5ID0gZWxlbWVudC5jaGVja1Zpc2liaWxpdHkoe1xuICAgIGNvbnRlbnRWaXNpYmlsaXR5QXV0bzogdHJ1ZSxcbiAgICBjaGVja09wYWNpdHk6IHRydWUsXG4gICAgY2hlY2tWaXNpYmlsaXR5Q1NTOiB0cnVlLFxuICB9KVxuICByZXR1cm4gKFxuICAgIGVsZW1lbnQuaGlkZGVuIHx8XG4gICAgZWxlbWVudC5hcmlhSGlkZGVuIHx8XG4gICAgIWVsVmlzaWJpbGl0eSB8fFxuICAgIElHTk9SRURfRUxFTUVOVFMuaW5jbHVkZXMoZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpXG4gIClcbn1cblxuLy8gVG8gZ2V0IHRoZSBsYXJnZXN0IGVsZW1lbnQgaW4gYW4gYXJyYXlcbi8vIEJ5IGNvbXBhcmluZyB0aGVpciBhcmVhICh3aWR0aCAqIGhlaWdodClcbmV4cG9ydCBjb25zdCBnZXRMYXJnZXN0RWxlbWVudCA9IChcbiAgZWxlbWVudHM6IEhUTUxFbGVtZW50W10sXG4pOiBIVE1MRWxlbWVudCB8IG51bGwgPT4ge1xuICBpZiAoZWxlbWVudHMubGVuZ3RoID09IDApIHJldHVybiBudWxsXG5cbiAgbGV0IHJlc3VsdCA9IGVsZW1lbnRzWzBdXG4gIGxldCBjdXJMYXJnZXN0ID0gMFxuICBlbGVtZW50cy5mb3JFYWNoKChlKSA9PiB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgY29uc3QgYXJlYSA9IHdpZHRoICogaGVpZ2h0XG4gICAgaWYgKGFyZWEgPiBjdXJMYXJnZXN0KSB7XG4gICAgICBjdXJMYXJnZXN0ID0gYXJlYVxuICAgICAgcmVzdWx0ID0gZVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIHJlc3VsdFxufVxuXG4vLyBTaW1wbHkgZ2V0IHRoZSBlbGVtZW50IHdpdGggbW9zdCB0ZXh0IGNvbnRlbnRcbmV4cG9ydCBjb25zdCBnZXREZW5zZXN0RWxlbWVudCA9IChlbGVtZW50czogSFRNTEVsZW1lbnRbXSkgPT4ge1xuICByZXR1cm4gZWxlbWVudHMucmVkdWNlKChyZXN1bHQ6IEhUTUxFbGVtZW50IHwgbnVsbCwgZWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICBpZiAoIXJlc3VsdCkgcmV0dXJuIGVsZW1lbnRcblxuICAgIGlmIChlbGVtZW50LnRleHRDb250ZW50IS5sZW5ndGggPiByZXN1bHQudGV4dENvbnRlbnQhLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH0sIG51bGwpXG59XG5cbi8vIFVzZWQgdG8gZ2V0IHRoZSBkaXJlY3QgY2hpbGQgdGhhdCB0cnVseSBoYXZlIHRoZSBjb250ZW50XG5leHBvcnQgY29uc3QgZ2V0RmlsdGVyZWRDaGlsZHJlbiA9IChlbGVtZW50OiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50W10gPT4ge1xuICByZXR1cm4gQXJyYXkuZnJvbShlbGVtZW50LmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8SFRNTEVsZW1lbnQ+KS5maWx0ZXIoXG4gICAgKGVsKSA9PiB7XG4gICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICByZXR1cm4gIWlzSGlkZGVuRWxlbWVudChlbCkgJiYgd2lkdGggPiAxICYmIGhlaWdodCA+IDFcbiAgICB9LFxuICApXG59XG5cbmV4cG9ydCBjb25zdCBnZXREaXN0YW5jZVRvQ2VudGVyID0gKFxuICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgY29udGFpbmVyOiBIVE1MRWxlbWVudCxcbikgPT4ge1xuICBjb25zdCBjdG5Qb3MgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgY29uc3QgZWxlUG9zID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gIC8vIFJUQyAtIFJlbGF0aXZlIFRvIENvbnRhaW5lclxuICBjb25zdCB0aHJoTWlkID0gY3RuUG9zLnRvcCArIGN0blBvcy5oZWlnaHQgKiAwLjVcbiAgY29uc3QgYXZnUlRDID0gKGVsZVBvcy50b3AgKyBlbGVQb3MuYm90dG9tKSAvIDJcbiAgcmV0dXJuIGF2Z1JUQyAtIHRocmhNaWRcbn1cblxuZXhwb3J0IGNvbnN0IGlzVG9vQ2xvc2UgPSAoXG4gIGE6IEhUTUxFbGVtZW50LFxuICBiOiBIVE1MRWxlbWVudCxcbiAgbWF4VmlldyA9IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuNyxcbikgPT4ge1xuICBjb25zdCBhUG9zID0gYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICBjb25zdCBiUG9zID0gYi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICByZXR1cm4gYVBvcy50b3AgPCBiUG9zLnRvcFxuICAgID8gTWF0aC5hYnMoYVBvcy5ib3R0b20gLSBiUG9zLnRvcCkgPCBtYXhWaWV3XG4gICAgOiBNYXRoLmFicyhiUG9zLmJvdHRvbSAtIGFQb3MudG9wKSA8IG1heFZpZXdcbn1cblxuZXhwb3J0IGNvbnN0IGdldENvbnRlbnREZW5zaXR5ID0gKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB7XG4gIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICBjb25zdCBhcmVhID0gd2lkdGggKiBoZWlnaHRcbiAgY29uc3QgY29udGVudExlbmd0aCA9IChlbGVtZW50LnRleHRDb250ZW50IHx8ICcnKS5sZW5ndGhcbiAgcmV0dXJuIGNvbnRlbnRMZW5ndGggLyBhcmVhXG59XG5cbmV4cG9ydCBjb25zdCBnZXREZWZpbmVkQWRTaXplID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSA9PiB7XG4gIGxldCByV2lkdGggPSB3aWR0aFxuICBsZXQgckhlaWdodCA9IGhlaWdodCB8fCAxIC8vIG1lYW5pbmcgckhlaWdodCBjYW4gbm90IGJlIDBcbiAgY29uc3QgaVJhdGlvID0gd2lkdGggLyBoZWlnaHRcbiAgLy8gaVJhdGlvID4gMS4yXG4gIGlmIChpUmF0aW8gPiBBZFJhdGlvLkxBTkRTQ0FQRSAtIDAuNzEpIHtcbiAgICBsZXQgZWRnZSA9IHdpZHRoXG4gICAgaWYgKGVkZ2UgPCBBZFJhdGlvLk1JTl9TSVpFX1JFQ1QpIGVkZ2UgPSA2MDBcbiAgICByV2lkdGggPSBlZGdlXG4gICAgckhlaWdodCA9IGVkZ2UgKiBBZFJhdGlvLlJFVkVSU0VfTEFORFNDQVBFXG4gIH1cbiAgLy8gaVJhdGlvIDwgMC44XG4gIGVsc2UgaWYgKGlSYXRpbyA8IEFkUmF0aW8uQ09MX1JFQ1QgKyAwLjIzNzUpIHtcbiAgICBsZXQgZWRnZSA9IHdpZHRoXG4gICAgaWYgKGVkZ2UgPCBBZFJhdGlvLk1JTl9TSVpFX1JFQ1QpIGVkZ2UgPSBBZFJhdGlvLk1JTl9TSVpFX1JFQ1RcbiAgICByV2lkdGggPSBlZGdlXG4gICAgckhlaWdodCA9IGVkZ2UgKiBBZFJhdGlvLlJPV19SRUNUXG4gIH1cbiAgLy8gaW4gYmV0d2VlbiAwLjggfiAxLjJcbiAgZWxzZSB7XG4gICAgbGV0IHNtYWxsZXJFZGdlID0gd2lkdGggPD0gaGVpZ2h0ID8gd2lkdGggOiBoZWlnaHRcbiAgICBpZiAoc21hbGxlckVkZ2UgPCBBZFJhdGlvLk1JTl9TSVpFX1NRUikgc21hbGxlckVkZ2UgPSBBZFJhdGlvLk1JTl9TSVpFX1NRUlxuICAgIHJXaWR0aCA9IHNtYWxsZXJFZGdlXG4gICAgckhlaWdodCA9IHNtYWxsZXJFZGdlXG4gIH1cbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogTWF0aC5yb3VuZChyV2lkdGgpLFxuICAgIGhlaWdodDogTWF0aC5yb3VuZChySGVpZ2h0KSxcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZ2V0RWxlbWVudFdyYXBwZXIgPSAoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCA9PiB7XG4gIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudFxuICBpZiAoIXBhcmVudCkgcmV0dXJuIGVsZW1lbnRcblxuICBpZiAocGFyZW50LmNoaWxkRWxlbWVudENvdW50ID09IDEgJiYgcGFyZW50LmZpcnN0RWxlbWVudENoaWxkID09PSBlbGVtZW50KSB7XG4gICAgcmV0dXJuIGdldEVsZW1lbnRXcmFwcGVyKHBhcmVudClcbiAgfVxuXG4gIGZvciAoY29uc3QgZWwgb2YgcGFyZW50LmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8SFRNTEVsZW1lbnQ+KSB7XG4gICAgaWYgKGVsLmNsaWVudFdpZHRoID4gMSAmJiBlbC5jbGllbnRIZWlnaHQgPiAxICYmICFpc0hpZGRlbkVsZW1lbnQoZWwpKSB7XG4gICAgICByZXR1cm4gZWxlbWVudFxuICAgIH1cbiAgfVxuICByZXR1cm4gZ2V0RWxlbWVudFdyYXBwZXIocGFyZW50KVxufVxuXG4vLyBjaGVjayBpZiB0aGUgZWxlbWVudCBoYXMgZGlzcGxheSBvZiAnZ3JpZCcgb3IgJ2ZsZXgnIHdpdGggcm93IGZvcm1hdGlvblxuZXhwb3J0IGNvbnN0IGlzU3VpdGFibGVMYXlvdXQgPSAoZWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHtcbiAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KVxuICByZXR1cm4gIShcbiAgICBlbGVtZW50LnRhZ05hbWUgPT09ICdUQUJMRScgfHxcbiAgICBzdHlsZS5kaXNwbGF5ID09ICd0YWJsZScgfHxcbiAgICBzdHlsZS5kaXNwbGF5ID09ICdncmlkJyB8fFxuICAgIChzdHlsZS5kaXNwbGF5ID09ICdmbGV4JyAmJlxuICAgICAgKHN0eWxlLmZsZXhEaXJlY3Rpb24gPT09ICdyb3cnIHx8IHN0eWxlLmZsZXhEaXJlY3Rpb24gPT09ICdyb3ctcmV2ZXJzZScpKVxuICApXG59XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVCdXR0b25FbGVtZW50ID0gKG9wdGlvbnM/OiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+KSA9PiB7XG4gIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG4gIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKEFEX0NMQVNTRVMuUkVTRVRfU1RZTEUsIEFEX0NMQVNTRVMuQlVUVE9OX0VMRU1FTlQpXG5cbiAgYnV0dG9uLnN0eWxlLm1pbldpZHRoID0gJzEwMHB4J1xuICBidXR0b24uc3R5bGUuaGVpZ2h0ID0gJzM2cHgnXG4gIGlmIChvcHRpb25zKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgYnV0dG9uLnN0eWxlW2tleV0gPSBvcHRpb25zW2tleV0hXG4gICAgfVxuICB9XG4gIHJldHVybiBidXR0b25cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IHsgQWRTY3JpcHQgfSBmcm9tICcuL2NvbXBvbmVudHMvbWFpbidcblxuY29uc3Qgc2NyaXB0ID0gbmV3IEFkU2NyaXB0KClcbnNjcmlwdC5zdGFydCgpXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=