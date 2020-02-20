/**
 * Copyright (c) 2018 by Index Exchange. All rights reserved.
 *
 * The information contained within this document is confidential, subject to
 * copyrighted and/or comprises trade secrets proprietary to Index Exchange.
 * No part of this document may be used, reproduced or distributed in any form
 * or by any means, in whole or in part, without the prior written permission
 * of Index Exchange.
 *
 * INDEX EXCHANGE, the INDEX EXCHANGE logos, and other Index Exchange product
 * names, identifiers and taglines referenced herein are trademarks of Index
 * Exchange, which may be registered in certain jurisdictions. No rights in
 * and to such marks and/or use thereof are granted to the recipient of this
 * document save for as earlier provided in writing by Index Exchange. All
 * other product names, company names, marks, logos, and symbols displayed
 * herein are the property of their respective owners.
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };
},{}],3:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require(2).nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require(3).setImmediate,require(3).clearImmediate)
},{}],4:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Classify = require(13);
var Layer = require(6);
var SpaceCamp = require(61);
var Utilities = require(33);
var Whoopsie = require(34);

var GptLayerModules = [
    require(43),
    require(37),
    require(40),
    require(39),
    require(42),
    require(38),
    require(41)
];


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A layer that loads in modules to define its behavior.
 *
 * @class
 */
function GptLayer(configs) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    var __baseClass;

    var __state;

    var __directInterface;

    var __desktopGlobalTimeout;

    var __mobileGlobalTimeout;

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {

        __baseClass = Layer();

        __desktopGlobalTimeout = configs.desktopGlobalTimeout;
        __mobileGlobalTimeout = configs.mobileGlobalTimeout;

        if (SpaceCamp.DeviceTypeChecker.getDeviceType() === 'mobile') {
            SpaceCamp.globalTimeout = __mobileGlobalTimeout;
        } else {
            SpaceCamp.globalTimeout = __desktopGlobalTimeout;
        }

        __state = {
            slotDemandHistory: {},
            desktopGlobalTimeout: __desktopGlobalTimeout,
            mobileGlobalTimeout: __mobileGlobalTimeout
        };

        __directInterface = {};

        for (var i = 0; i < GptLayerModules.length; i++) {
            __directInterface = Utilities.mergeObjects(__directInterface, GptLayerModules[i](configs, __state, __baseClass._executeNext));
        }

        __baseClass._setDirectInterface('GptLayer', __directInterface);
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return Classify.derive(__baseClass, {
        /* Class Information
         * ---------------------------------- */


        /* Data
         * ---------------------------------- */

    });
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = GptLayer;
},{}],5:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Classify = require(13);
var Layer = require(6);
var Prms = require(20);
var SpaceCamp = require(61);
var Utilities = require(33);
var IdentityPartnerFactory = require(45);

var IdentityPartnerConstructors = {
    AdserverOrgIp: require(44)
};


var EventsService;
var TimerService;

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Manages identity partners
 *
 * @class
 */
function IdentityLayer(configs) {
    var __baseClass;

    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /**
     * Stores each partner's configuration, state, and instance.
     *
     * Example:
     *
     * __partners = {
     *     EXMP: {
     *         enabled: <boolean>,
     *         enableSetTargeting: <boolean>,
     *         configs: {
     *             <EXMP specific configs>
     *         },
     *         instance: <instance>
     *     }
     * }
     *
     * @private {object}
     */
    var __identityPartners;

    /**
     * Overall status of the Identity process. Allowed values are members of the
     * __EnumStatuses enumeration.
     *
     * If status is NOT_STARTED, the identity partners have not yet started retrieving
     * data from partner endpoints.
     * If status is IN_PROGRESS, the identity layer is waiting for results from one
     * or more identity partners.
     * If status is COMPLETE, the identity layer is no longer waiting and will
     * return identity results immediately when getResult is called. This does not
     * guarantee that all individual partners are complete.
     *
     * @private {enum}
     */
    var __status;

    /**
     * Status of each enabled identity partner, keyed by partner ID. Allowed values
     * are members of the __EnumStatuses enumeration.
     *
     * If status is NOT_STARTED, the partner has not started retrieving identity
     * data.
     * If status is IN_PROGRESS, the partner has called its endpoint and not yet
     * received a response. A partner may still be IN_PROGRESS after the layer's
     * status has changed to COMPLETE.
     * If status is COMPLETE, the partner has fully retrieved its identity data and
     * will return identity results immediately when getResult is called.
     *
     * @private {object}
     */
    var __partnerStatuses;

    /**
     * Enum of values to describe identity process status.
     *
     * @private {Object}
     */
    var __EnumStatuses = {
        NOT_STARTED: 0,
        IN_PROGRESS: 1,
        COMPLETE: 2
    };

    /**
     * Stores the value of the identity timeout in ms.
     * This represents the maximum amount of time that retrieving identity information
     * is allowed to delay any subsequent process.
     *
     * @private {number}
     */
    var __identityTimeout;

    /**
     * ID of the timer created with the timer service for identity timeout
     */
    var __identityTimerId;


    /**
     * Deferred promise for the identity information retrieval process. Created when
     * the retrieval process for identity starts. Resolved when either all identity
     * partners return data or the timeout has elapsed, whichever comes first.
     *
     * @private {defer}
     */
    var __retrievalDefer;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Helpers
     * ---------------------------------- */

    /**
     * Wraps a partner's retrieve function in an outer promise to allow for:
     *     a. Catching asynchronous errors.
     *     a. Isolation of partners (i.e. if one throws an error the rest can
     *        continue without issue).
     *
     * @private
     *
     * @param  {string}   partnerId     The ID of the partner to retrieve demand
     *                                  from.
     * @param  {object}   partner       The reference to the partner object, which contains
     *                                  its configuration, state, and instance.
     * @return {promise}                A promise that resolves when the partner finishes,
     *                                  whether success or failure.
     */
    function __partnerCaller(partnerId, partner) {
        __partnerStatuses[partnerId] = __EnumStatuses.IN_PROGRESS;

        return new Prms(function (resolve) {
            partner.instance
                .retrieve()
                .then(function () {
                    __partnerStatuses[partnerId] = __EnumStatuses.COMPLETE;
                    resolve();
                })
                .catch(function (ex) {
                    __partnerStatuses[partnerId] = __EnumStatuses.COMPLETE;
                    resolve();
                });
        });
    }

    /**
     * Calls each partner for identity data in random order.
     *
     * @private
     *
     * @return {defer}           A deferred promise that will be resolved when all
     *                           partner promises have either completed or errored.
     */
    function invokeAllPartners() {
        var partnerPromises = [];
        var invocationDefer = Prms.defer();

        var allPartnerIds = Object.keys(__identityPartners);

        while (allPartnerIds.length) {
            var partnerId = Utilities.randomSplice(allPartnerIds);
            var partner = __identityPartners[partnerId];

            if (partner.enabled) {
                try {
                    partnerPromises.push(__partnerCaller(partnerId, partner));
                } catch (ex) {
                }
            }
        }

        Prms.all(partnerPromises).then(function () {
            invocationDefer.resolve();
        });

        return invocationDefer;
    }

    /**
     * Sends the identity timeout headerstats event for all partners which are
     * still in progress
     *
     * @private
     */
    function __sendStatsTimeouts() {
        for (var partnerId in __partnerStatuses) {
            if (!__partnerStatuses.hasOwnProperty(partnerId)) {
                continue;
            }

            if (__partnerStatuses[partnerId] !== __EnumStatuses.COMPLETE) {
                EventsService.emit('hs_identity_timeout', {
                    statsId: __identityPartners[partnerId].instance.getStatsId()
                });
            }
        }
    }

    /**
     * Loop through all enabled partners and synchronously retrieve whatever data
     * they currently have ready.
     *
     * @return {object} All currently available identity data keyed by the identity
     *                  partner module ID.
     */
    function __getAllPartnerResults() {
        var identityData = {};


        for (var partnerId in __identityPartners) {
            if (!__identityPartners.hasOwnProperty(partnerId)) {
                continue;
            }

            var partner = __identityPartners[partnerId];

            if (partner.enabled) {
                var partnerIdentityData = partner.instance.getResults();

                if (partnerIdentityData) {
                    identityData[partnerId] = {
                        data: partnerIdentityData
                    };
                }
            }
        }

        return identityData;
    }

    /* Main
     * ---------------------------------- */

    /**
     * Starts the process of retrieving identity data from all identity partners.
     *
     * @return nothing
     */
    function retrieve() {
        // Should only retrieve identity data once, at wrapper initialization
        if (__status !== __EnumStatuses.NOT_STARTED) {
            return;
        }

        __retrievalDefer = invokeAllPartners();

        __status = __EnumStatuses.IN_PROGRESS;

        /* However the retrieval defer is resolved, that means we're ready to return
         * any results we may have. */
        __retrievalDefer.promise.then(function () {
            __sendStatsTimeouts();
            __status = __EnumStatuses.COMPLETE;
        });

        /* Special case: If the timeout is zero, don't actually set a timer. Just continue
         * immediately so we don't release the js execution queue. */
        if (__identityTimeout === 0) {
            __retrievalDefer.resolve();
        } else if (!__identityTimerId) {
            /* If the timeout isn't zero, and we haven't created a timer yet, register
             * one with a callback to resolve the defer but don't start it yet. */
            __identityTimerId = TimerService.createTimer(__identityTimeout, false, function () {
                __retrievalDefer.resolve();
            });
        }
    }

    /**
     * Returns a promise for identity information.
     * Resolves with an object containing identity data, empty if none is available.
     *
     * @return {[type]} [description]
     */
    function getResult() {
        // If we haven't started retrieving, there's nothing to return.
        if (__status === __EnumStatuses.NOT_STARTED) {
            return Prms.resolve(null);
        }

        // If we haven't finished, and there's a timer, start it now.
        if (__status !== __EnumStatuses.COMPLETE && __identityTimerId) {
            TimerService.startTimer(__identityTimerId);
        }

        return __retrievalDefer.promise.then(function () {
            return __getAllPartnerResults();
        });
    }

    function __executor(sessionId, inParcels) {
        return getResult().then(function (identityResults) {
            if (identityResults && !Utilities.isEmpty(identityResults)) {
                for (var i = 0; i < inParcels.length; i++) {
                    inParcels[i].identityData = identityResults;
                }
            }

            return __baseClass._executeNext(sessionId, inParcels);
        });
    }

    /**
     * Loop through all enabled partners and synchronously retrieve whatever data
     * they currently have ready.
     *
     * @return {object} All currently available identity data keyed by the identity
     *                  partner module ID.
     */


    function getIdentityResults() {
        var identityData = {};

        for (var partnerId in __identityPartners) {
            if (!__identityPartners.hasOwnProperty(partnerId)) {
                continue;
            }

            var partner = __identityPartners[partnerId];

            if (partner.enabled) {
                var partnerIdentityData = partner.instance.getResults();
                if (__partnerStatuses[partnerId] === __EnumStatuses.COMPLETE) {
                    if (partnerIdentityData) {
                        identityData[partnerId] = {
                            data: partnerIdentityData
                        };
                    } else {
                        identityData[partnerId] = {
                            data: {}
                        };
                    }
                    identityData[partnerId].responsePending = false;
                } else {
                    identityData[partnerId] = {
                        data: {},
                        responsePending: true
                    };
                }
            }
        }

        return identityData;
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        EventsService = SpaceCamp.services.EventsService;
        TimerService = SpaceCamp.services.TimerService;

        __baseClass = Layer();


        __status = __EnumStatuses.NOT_STARTED;
        __partnerStatuses = {};
        __identityPartners = configs.partners;
        __identityTimeout = configs.timeout;

        EventsService.emit('hs_define_identity_timeout', {
            timeout: __identityTimeout
        });

        /* Enumerate all the partnerIds and then try to instantiate them in a random
         * to maintain fairness of loading order. */
        var allPartnerIds = Object.keys(__identityPartners);

        for (var i = allPartnerIds.length - 1; i >= 0; i--) {
            var partnerId = Utilities.randomSplice(allPartnerIds);
            var partner = __identityPartners[partnerId];

            if (partner.enabled) {
                try {
                    var partnerModule = IdentityPartnerConstructors[partnerId];
                    if (Utilities.isObject(partnerModule)) {

                        partner.instance = IdentityPartnerFactory(partnerModule, partner.configs);
                    } else {
                        partner.instance = partnerModule(partner.configs);
                    }

                    /* A partner may refuse to load for various reasons that don't merit throwing
                       an exception. In this case it will return null and we will consider it
                       to be disabled. */
                    if (!partner.instance) {
                        partner.enabled = false;

                        continue;
                    }
                    __partnerStatuses[partnerId] = __EnumStatuses.NOT_STARTED;
                } catch (ex) {

                    partner.enabled = false;
                }
            }
        }

        __baseClass._setDirectInterface('IdentityLayer', {
            retrieve: retrieve,
            getResult: getResult,
            getIdentityResults: getIdentityResults,
            invokeAllPartners: invokeAllPartners
        });

        __baseClass._setExecutor(__executor);
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return Classify.derive(__baseClass, {
        /* Class Information
         * ---------------------------------- */


        /* Data
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        retrieve: retrieve,
        getResult: getResult,

    });
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = IdentityLayer;
},{}],6:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Prms = require(20);
var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * The base class for all layers. `Layer` defines the interface for a layer, and
 * provides common validation on said interface.
 *
 * @constructor
 */
function Layer() {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /**
     * The direct interface of the layer. Used to expose functionality outside of
     * outside of the layer stack.
     *
     * @private {object}
     */
    var __directInterface;

    /**
     * Reference to the current layer's execute function. Set to
     * `layerLoopBack(...)` by default.
     *
     * @private {function}
     */
    var __executor;

    /**
     * Reference to the next layer's execute function. Set to `layerLoopBack(...)`
     * by default.
     *
     * @private {function}
     */
    var __next;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /**
     * Returns the the array of parcels sent in. This function acts as a loopback
     * to terminate the layer stack.
     *
     * @private
     *
     * @param  {string}   sessionId The ID of the session. Specified only to conform
     *                              to `Layer.execute(...)`'s expected interface.
     * @param  {object[]} inParcels An array of parcels.
     *
     * @return {Promise}            Returns a resolved promise whose value is the
     *                              array of parcels sent in.
     */
    function __layerLoopBack(sessionId, inParcels) {
        return Prms.resolve(inParcels);
    }

    /* Getters and Setters
     * ---------------------------------- */

    /**
     * Sets the direct interface for this layer.
     *
     * @protected
     *
     * @param {string} namespace       The namespace for this interface.
     * @param {object} directInterface The interface being exposed.
     */
    function _setDirectInterface(namespace, directInterface) {
        __directInterface = {};
        __directInterface[namespace] = directInterface;
    }

    /**
     * Sets the executor for this layer. The executor is the function that
     * implements a layer's functionality.
     *
     * @protected
     *
     * @param {function} executor The function that executes this layer.
     */
    function _setExecutor(executor) {
        __executor = executor;
    }

    /**
     * Returns this layer's direct interface.
     *
     * @public
     *
     * @return {object} Returns either the object representing the direct interface,
     *                  or null if it does not exist.
     */
    function getDirectInterface() {
        return __directInterface;
    }

    /**
     * Sets the executor for the next layer. The executor is the function that
     * implements a layer's functionality.
     *
     * @public
     *
     * @param {function} next The function that executes the next layer.
     */
    function setNext(next) {

        __next = next;
    }

    /* Main
     * ---------------------------------- */

    /**
     * Executes the next layer and provides basic validation on the return.
     *
     * @protected
     *
     * @param  {string}   sessionId The ID of the session.
     *
     * @param  {object[]} outParcels An array of parcels.
     *
     * @return {Promise}             Returns a promise for parcels.
     */
    function _executeNext(sessionId, outParcels) {
        return __next(sessionId, outParcels); // eslint-disable-line
    }

    /**
     * Executes this layer and provides basic validation on the input.
     *
     * @public
     *
     * @param  {string}   sessionId The ID of the session.
     *
     * @param  {object[]} inParcels An array of parcels.
     *
     * @return {Promise}            Returns a promise for parcels.
     */
    function execute(sessionId, inParcels) {

        return Prms.resolve().then(function () {
            return __executor(sessionId, inParcels);
        });
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        __directInterface = null;
        __executor = __layerLoopBack;
        __next = __layerLoopBack;
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */


        _setDirectInterface: _setDirectInterface,
        _setExecutor: _setExecutor,

        _executeNext: _executeNext,

        setNext: setNext,
        getDirectInterface: getDirectInterface,

        execute: execute
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Layer;
},{}],7:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Classify = require(13);
var Layer = require(6);
var Constants = require(16);
var Utilities = require(33);
var Whoopsie = require(34);
var SpaceCamp = require(61);

var EventsService;


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Analyzes sets of demand parcels to find the parcel with the highest price at two levels of
 * granularity: 1. highest bid for an ht-slot across partners; 2. highest bid for ht-slot for
 * each individual partner (optional).
 *
 * Mediation layer requires a `configs` object with a mediationLevel property:
 *
 * {
 *     "mediationLevel": <level>
 * }
 *
 * where <level> is one of:
 *
 * + "NONE" - no filtering on parcels, determines highest bid for statistics only.
 * + "HT_SLOT" - perform auction, and filter out all but highest bid for each ht-slot.
 * + "PARTNER" - filter out all but highest bid by each partner for each ht-slot.
 *
 * @constructor
 * @implements {Layer}
 */
function MediationLayer(configs) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /**
     * Reference to the `Layer` base class.
     *
     * @private {Layer}
     */
    var __baseClass;

    /**
     * Mediation level
     */
    var __mediationLevel;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Main
     * ---------------------------------- */

    /**
     * Selects the parcel with the highest price among all the received parcels. If
     * two or more parcels have the same price, one is randomly selected.
     *
     * @private
     *
     * @param  {string}   sessionId The ID of the session.
     * @param  {object[]} inParcels An array of parcels.
     *
     * @return {Promise}            A promise for parcels.
     */
    function __executor(sessionId, inParcels) {
        return __baseClass._executeNext(sessionId, inParcels).then(function (receivedParcels) {

            var htSlotNameToHighestParcel = {
                slot: {},
                partner: {}
            };
            var returnParcels = [];
            var originalParcels = receivedParcels.slice();

            while (receivedParcels.length) {
                var currentParcel = Utilities.randomSplice(receivedParcels);

                if (!currentParcel.htSlot) {
                    continue;
                }

                var currentHtSlotName = currentParcel.htSlot.getName();

                if (currentParcel.pass) {
                    continue;
                }

                if (!currentParcel.hasOwnProperty('price') || !Utilities.isNumber(currentParcel.price)) {
                    if (__mediationLevel === Constants.MediationLevels.PARTNER) {
                        returnParcels.push(currentParcel);
                    }
                } else {
                    /* Valid price in parcel. Save the highest price for this ht-slot. */
                    if (!htSlotNameToHighestParcel.slot.hasOwnProperty(currentHtSlotName)) {
                        htSlotNameToHighestParcel.slot[currentHtSlotName] = currentParcel;
                    } else {
                        if (htSlotNameToHighestParcel.slot[currentHtSlotName].price < currentParcel.price) {
                            htSlotNameToHighestParcel.slot[currentHtSlotName] = currentParcel;
                        }
                    }

                    if (__mediationLevel === Constants.MediationLevels.PARTNER) {
                        /* Save the highest price for this ht-slot for each partner separately. */
                        htSlotNameToHighestParcel.partner[currentHtSlotName] = htSlotNameToHighestParcel.partner[currentHtSlotName] || {};
                        if (!htSlotNameToHighestParcel.partner[currentHtSlotName].hasOwnProperty(currentParcel.partnerId)) {
                            htSlotNameToHighestParcel.partner[currentHtSlotName][currentParcel.partnerId] = currentParcel;
                        } else if (htSlotNameToHighestParcel.partner[currentHtSlotName][currentParcel.partnerId].price < currentParcel.price) {
                            htSlotNameToHighestParcel.partner[currentHtSlotName][currentParcel.partnerId] = currentParcel;
                        }
                    }
                }
            }

            /* Highest bids for slot and partner determined. Now, to figure out what to return. */
            for (var htSlotName in htSlotNameToHighestParcel.slot) {
                if (!htSlotNameToHighestParcel.slot.hasOwnProperty(htSlotName)) {
                    continue;
                }

                /* Always emit Header Stats event to record highest bid for this ht-slot. */
                var highestParcel = htSlotNameToHighestParcel.slot[htSlotName];


                EventsService.emit('hs_slot_highest_bid', {
                    sessionId: sessionId,
                    statsId: highestParcel.partnerStatsId,
                    htSlotId: highestParcel.htSlot.getId(),
                    requestId: highestParcel.requestId,
                    xSlotNames: [highestParcel.xSlotName]
                });

                /* `htSlotNameToHighestParcel.slot` and `htSlotNameToHighestParcel.partner` should have the same ht-slots. */
                if (__mediationLevel === Constants.MediationLevels.HT_SLOT) {
                    returnParcels.push(highestParcel);
                } else if (__mediationLevel === Constants.MediationLevels.PARTNER) {

                    /* Return all parcels from all partners for this ht-slot. */
                    for (var partnerId in htSlotNameToHighestParcel.partner[htSlotName]) {
                        if (!htSlotNameToHighestParcel.partner[htSlotName].hasOwnProperty(partnerId)) {
                            continue;
                        }


                        returnParcels.push(htSlotNameToHighestParcel.partner[htSlotName][partnerId]);
                    }
                }
            }

            if (__mediationLevel === Constants.MediationLevels.NONE) {
                return originalParcels;
            } else {
                return returnParcels;
            }
        });
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        EventsService = SpaceCamp.services.EventsService;
        __baseClass = Layer();
        __baseClass._setExecutor(__executor);
        __mediationLevel = Constants.MediationLevels[configs.mediationLevel];
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return Classify.derive(__baseClass, {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

    });
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = MediationLayer;
},{}],8:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Classify = require(13);
var Layer = require(6);
var Constants = require(16);
var Prms = require(20);
var SpaceCamp = require(61);
var Utilities = require(33);
var Whoopsie = require(34);

var PartnerConstructors = {

DynamicPartnerLoader: require(46),

};



var TimerService;

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Manages partner initialization, partner state, and retrieving demand.
 *
 * @constructor
 */
function PartnersLayer(configs) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /**
     * Reference to the `Layer` base class.
     *
     * @private {Layer}
     */
    var __baseClass;


    /**
     * Stores each partner's configuration, state, and instance.
     *
     * Example:
     *
     * __partners = {
     *     EXMP: {
     *         enabled: <boolean>,
     *         configs: {
     *             <EXMP specific configs>
     *         },
     *         instance: <instance>
     *     }
     * }
     *
     * @private {object}
     */
    var __partners;

    /**
     * Static map of property names used in the first party data object to partnerIds
     * @private {Object}
     */
    var __firstPartyDataPartnerIds = {
        rubicon: ['RubiconHtb', 'RubiconExtHtb']
    };

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /**
     * Returns a shuffled list of partner IDs
     *
     * @public
     *
     * @return {array} shuffled partnerIDs array
     */
    function getShuffledPartnerIDs(partners) {
        var order = [];

        for (var partner in partners) {
            if (!partners.hasOwnProperty(partner)) {
                continue;
            }

            var priority = partners[partner].priority;
            if (!Utilities.isInteger(priority)) {
                priority = Constants.DEFAULT_PARTNER_PRIORITY;
            }

            order[priority] = order[priority] || [];
            order[priority].push(partner);
        }

        var flat = [];
        order.forEach(function (toShufle) {
            Utilities.shuffle(toShufle);
            toShufle.forEach(function (partner) {
                flat.push(partner);
            });
        });

        return flat;
    }

    /**
     * Wraps a partner's retrieve function in a deferred to allow for:
     *     a. Catching asynchronous errors.
     *     a. Isolation of partners (i.e. if one throws an error the rest can
     *        continue without issue).
     *
     * @private
     *
     * @param  {string}   partnerId     The ID of the partner to retrieve demand
     *                                  from.
     * @param  {object}   partnerModule The reference to the partner instance.
     * @param  {string}   sessionId     The ID of the session.
     * @param  {Parcel[]} parcels       The array of parcels that will be
     *                                  forwarded to the partner module.
     * @return {Defer[]}                An array of defers.
     */
    function __partnerCaller(sessionId, partnerId, partnerInstance, inParcels, isPrefetch) {
        if (isPrefetch && partnerInstance.getPrefetchDisabled()) {
            return [];
        }

        var outParcels = inParcels.slice();

        var partnerDefers = [];


        var partnerPromises = partnerInstance.retrieve(sessionId, outParcels);

        var wrappedPartnerDefers = partnerPromises.map(function (partnerPromise) {
            var defer = Prms.defer();

            partnerPromise.then(function (receivedParcels) {
                defer.resolve(receivedParcels);
            }).catch(function (ex) {

                defer.resolve([]);
            });

            return defer;
        });


        Utilities.appendToArray(partnerDefers, wrappedPartnerDefers);

        return partnerDefers;
    }

    /**
     * Calls each partner for demand.
     *
     * @private
     *
     * @param  {string} sessionId The ID of the session.
     * @param  {array}  inParcels Parcels describing the demand request.
     * @return {object}           An object containing all the defers returned from
     *                            calling the partners, and for convenience, the
     *                            promises associated with those defers.
     */
    function __invokeAllPartners(sessionId, inParcels, isPrefetch) {
        var returnObj = {
            defers: [],
            promises: []
        };


        var allPartnerIds = getShuffledPartnerIDs(__partners);


        for (var p = 0; p < allPartnerIds.length; p++) {
            var partnerId = allPartnerIds[p];


            var partner = __partners[partnerId];

            if (partner.enabled) {
                try {
                    var partnerDefers = __partnerCaller(sessionId, partnerId, partner.instance, inParcels, isPrefetch);
                    for (var i = 0; i < partnerDefers.length; i++) {
                        returnObj.defers.push(partnerDefers[i]);
                        returnObj.promises.push(partnerDefers[i].promise);
                    }
                } catch (ex) {
                }
            }
        }

        return returnObj;
    }

    /* Main
     * ---------------------------------- */

    /**
     * Enables the specified partner module. If the partner module is being enabled
     * for the first time, it is instantiated first.
     *
     * @public
     *
     * @param {string} partnerId The ID of the partner being enabled.
     */

    /**
     * Disables the specified partner module.
     *
     * @public
     *
     * @param {string} partnerId The ID of the partner being disabled.
     */

    /**
     * Sets page-level first party data for all applicable partners.
     *
     * @param {object} data [description]
     */
    function setFirstPartyData(data) {

        for (var fpdPartnerId in data) {
            if (!data.hasOwnProperty(fpdPartnerId)) {
                continue;
            }

            if (!__firstPartyDataPartnerIds.hasOwnProperty(fpdPartnerId)) {

                continue;
            }

            var partnerIds = __firstPartyDataPartnerIds[fpdPartnerId];

            for (var i = 0; i < partnerIds.length; i++) {
                var partnerId = partnerIds[i];
                if (!__partners.hasOwnProperty(partnerId)) {
                    continue;
                }

                __partners[partnerId].instance.setFirstPartyData(data[fpdPartnerId]);
            }
        }
    }

    /**
     * Invokes all ready and enabled partner to retrieve demand. When either the
     * global timeout hits, or all demand requests are satisfied,
     *
     * @private
     *
     * @param  {string}   sessionId The ID of the session
     * @param  {Parcel[]} parcels   An array of parcels.
     * @return {Promise}            A promise for parcels.
     */
    function __executor(sessionId, inParcels) {
        /* Randomly select a partner each time and invoke it to retrieve demand. Save the
         * dPromises returned by each partner and wait on all of them to resolve. */
        var returnObj = __invokeAllPartners(sessionId, inParcels);

        TimerService.addTimerCallback(sessionId, function () {
            for (var i = 0; i < returnObj.defers.length; i++) {
                returnObj.defers[i].resolve([]);
            }
        });

        /* Wait on all the promises returned by partners to resolve. Once they have, take
         * all the returned parcels and merge them into one large array and return that.
         * If no partners were invoked then this promise will resolve right away. */
        return Prms.all(returnObj.promises).then(function (parcelsArrays) {
            TimerService.clearTimer(sessionId);

            /* If no partners existed parcelsArray will be undefined. Using apply here
             * because parcelsArray is an array of arrays, and I want to merge the
             * inside arrays. */
            return parcelsArrays ? Utilities.mergeArrays.apply(null, parcelsArrays) : [];
        });
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        TimerService = SpaceCamp.services.TimerService;

        __baseClass = Layer();


        __partners = configs.partners;

        /* Enumerate all the partnerIds and then try to instantiate them in a random
         * to maintain fairness of loading order. */
        var partnersDirectInterface = {};

        var allPartnerIds = getShuffledPartnerIDs(__partners);

        for (var i = 0; i < allPartnerIds.length; i++) {
            var partnerId = allPartnerIds[i];



            var partner = __partners[partnerId];

            if (partner.enabled) {
                partner.configs.bidTransformerTypes = {};
                try {
                    if (configs.hasOwnProperty('bidTransformerTypes')) {
                        partner.configs.bidTransformerTypes
                            = Utilities.deepCopy(configs.bidTransformerTypes);
                    }

                    partner.instance = PartnerConstructors[partnerId](partner.configs, partnerId);

                    /* A partner may refuse to load for various reasons that don't merit throwing
                       an exception. In this case it will return null and we will consider it
                       to be disabled. */
                    if (!partner.instance) {
                        partner.enabled = false;

                        continue;
                    }

                    if (partner.instance.getDirectInterface()) {
                        partnersDirectInterface = Utilities.mergeObjects(partnersDirectInterface, partner.instance.getDirectInterface());
                    }
                } catch (ex) {

                    partner.enabled = false;
                }
            }
        }

        var directInterface = {
            Partners: partnersDirectInterface,
            setFirstPartyData: setFirstPartyData
        };


        __baseClass._setDirectInterface('PartnersLayer', directInterface);

        __baseClass._setExecutor(__executor);
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return Classify.derive(__baseClass, {
        /* Class Information
         * ---------------------------------- */


        /* Data
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */


    });
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = PartnersLayer;
},{}],9:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Classify = require(13);
var HeaderTagSlot = require(24);
var Layer = require(6);
var Prms = require(20);
var SpaceCamp = require(61);
var Utilities = require(33);
var Whoopsie = require(34);
var Mvt = require(26);
var HeaderStatsService = require(54);
var Size = require(31);
var Browser = require(11);

var EventsService;
var TimerService;


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * This is the GPT Layer for post-bid implementations. It is derived from the
 * Layer class. Use this as the upper layer for implementations when the
 * publisher will be calling GPT before our auction, leaving our wrapper to
 * run within an ad slot that has already won on Google's side.
 *
 * @class
 */
function VideoInterfaceLayer(configs) {
    var __baseClass = Layer();

    /* =====================================
     * Data
     * ---------------------------------- */

    /* =====================================
     * Private
     * ---------------------------------- */

    var __desktopVideoGlobalTimeout;
    var __mobileVideoGlobalTimeout;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Helpers
     * ---------------------------------- */

    /* Main
     * ---------------------------------- */

    /**
     *
     * Constructs the Master Video Tag (MVT)
     * @return {[type]} returns the mvt
     */
    function buildGamMvt(htSlotsParams, demandObjs) {
        if (!Utilities.isObject(htSlotsParams)) {
            throw new Error('htSlotsParams must be an object');
        }

        if (!Utilities.isObject(demandObjs)) {
            throw new Error('demandObjs must be an object');
        }

        var mvts = {};
        var specialCaseKeys = ['iu', 'description_url', 'cust_params', 'sz'];

        for (var htSlotName in htSlotsParams) {
            if (!htSlotsParams.hasOwnProperty(htSlotName)) {
                continue;
            }

            var htSlotParams = htSlotsParams[htSlotName];

            if (!Utilities.isObject(htSlotParams)) {
                throw new Error('htSlotsParams.' + htSlotName + ' must be an object');
            }

            if (!htSlotParams.hasOwnProperty('iu') || !Utilities.isString(htSlotParams.iu) || Utilities.isEmpty(htSlotParams.iu)) {
                throw new Error('htSlotsParams.' + htSlotName + '.iu must exist and must be a non empty string');
            }

            if (!htSlotParams.hasOwnProperty('description_url') || !Utilities.isString(htSlotParams.description_url) || Utilities.isEmpty(htSlotParams.description_url)) {
                throw new Error('htSlotsParams.' + htSlotName + '.description_url must exist and must be a non empty string');
            }

            if (htSlotParams.hasOwnProperty('sz') && !Size.isSize(htSlotParams.sz) && !Size.isSizes(htSlotParams.sz)) {
                throw new Error('htSlotsParams.' + htSlotName + '.sz must be in the format [width, height] or [[width, height], [width, height], ...]');
            }

            if (htSlotParams.hasOwnProperty('cust_params')) {
                if (!Utilities.isObject(htSlotParams.cust_params)) {
                    throw new Error('htSlotsParams.' + htSlotName + '.cust_params must be an object');
                }

                var custParams = htSlotParams.cust_params;

                for (var custParamsKey in custParams) {
                    if (!custParams.hasOwnProperty(custParamsKey)) {
                        continue;
                    }

                    if (!Utilities.isArray(custParams[custParamsKey], 'string')) {
                        throw new Error('htSlotsParams.' + htSlotName + '.cust_params.' + custParamsKey + ' must be an array of string');
                    }
                }
            }

            /* Validate all other fields in slotParams */
            for (var slotParamskey in htSlotParams) {
                if (!htSlotParams.hasOwnProperty(slotParamskey)) {
                    continue;
                }

                if (specialCaseKeys.indexOf(slotParamskey) !== -1) {
                    continue;
                }

                if (!Utilities.isString(htSlotParams[slotParamskey]) && !Utilities.isNumber(htSlotParams[slotParamskey])) {
                    throw new Error('htSlotsParams.' + htSlotName + '.' + slotParamskey + ' must be a string or number');
                }

                if (Utilities.isString(htSlotParams[slotParamskey]) && Utilities.isEmpty(htSlotParams[slotParamskey])) {
                    throw new Error('htSlotsParams.' + htSlotName + '.' + slotParamskey + ' must be a non empty string or number');
                }
            }

            /* Mediate demands and build mvt */
            var mvtDemandObjs = [];

            if (demandObjs.hasOwnProperty(htSlotName)) {
                var slotDemandObjs = demandObjs[htSlotName];

                if (!Utilities.isArray(slotDemandObjs, 'object')) {
                    throw new Error('demandObjs.' + htSlotName + ' must be an array of objects');
                }

                /* Make sure that size exists and targeting is an object if it exists */
                for (var j = 0; j < slotDemandObjs.length; j++) {
                    if (!slotDemandObjs[j].hasOwnProperty('size') || !Size.isSize(slotDemandObjs[j].size)) {
                        throw new Error('demandObjs.' + htSlotName + '[' + j + '].size must exist and must be an array of 2 numbers');
                    }

                    if (slotDemandObjs[j].hasOwnProperty('targeting') && !Utilities.isObject(slotDemandObjs[j].targeting)) {
                        throw new Error('demandObjs.' + htSlotName + '[' + j + '].targeting must be an object');
                    }
                }

                /* Mediate valid demand objects */
                try {
                    mvtDemandObjs = Mvt.mediateVideoBids(slotDemandObjs);
                } catch (ex) {
                    /* Just need to skip this htSlot because any error from calling Mvt.mediateVideoBids should be on our side */
                }
            } else {
                /* Check if the htSlotName matches an existing htSlot, if yes, add size info */
                var htSlotsMap = SpaceCamp.htSlotsMap;

                if (!htSlotsMap.hasOwnProperty(htSlotName) || htSlotsMap[htSlotName].getType() !== HeaderTagSlot.SlotTypes.INSTREAM_VIDEO) {
                    throw new Error('htSlotName ' + htSlotName + ' does not exist');
                }

                mvtDemandObjs = [
                    {
                        size: htSlotsMap[htSlotName].getSizes(Browser.getViewportWidth(), Browser.getViewportHeight())[0]
                    }
                ];
            }

            try {
                mvts[htSlotName] = Mvt.buildDfpMvt(htSlotParams, mvtDemandObjs);
            } catch (ex) {
                /* Just need to skip this htSlot because any error from calling Mvt.buildDfpMvt should be on our side */
            }
        }

        return mvts;
    }

    /**
     * Validates input required by the retrieveVideoDemand function
     * @param {*} htSlotVideoDemandObjs
     * @param {*} callback
     * @param {*} options
     */
    function retrieveVideoDemandValidation(htSlotVideoDemandObjs, callback, options) {
        if (!Utilities.isFunction(callback)) {
            throw new Error('callback must be a function');
        }

        if (!Utilities.isArray(htSlotVideoDemandObjs, 'object')) {
            callback({}, new Error('htSlotVideoDemandObjs must be an array of objects'));

            return false;
        }

        for (var i = 0; i < htSlotVideoDemandObjs.length; i++) {
            var htSlot = htSlotVideoDemandObjs[i];

            if (!htSlot.hasOwnProperty('htSlotName')) {
                callback({}, new Error('htSlotVideoDemandObjs[' + i + ']: members must contain the htSlotName property'));

                return false;
            }

            if (!Utilities.isString(htSlot.htSlotName)) {
                callback({}, new Error('htSlotVideoDemandObjs[' + i + ']: htSlotName must be a string'));

                return false;
            }
        }

        if (Utilities.getType(options) !== 'undefined') {
            if (!Utilities.isObject(options)) {
                callback({}, new Error('options must be an object'));

                return false;
            }

            if (options.hasOwnProperty('timeout') && (!Utilities.isInteger(options.timeout) || options.timeout < 0)) {
                callback({}, new Error('options.timeout must be an integer greater than 0'));

                return false;
            }
        }

        return true;
    }

    /**
     * Retrieves demand for video header tag slots.
     * @param  {array} htSlotVideoDemandObjs    An array of objects specifying demand that is
     *                                          requested.
     * @return {Promise}                        A promise that resolves with the demand that
     *                                          was retrieved from the video partners.
     */
    function retrieveVideoDemand(htSlotVideoDemandObjs, options) {

        var outParcels = [];

        for (var i = 0; i < htSlotVideoDemandObjs.length; i++) {
            var slotFound = false;
            for (var j = 0; j < SpaceCamp.htSlots.length; j++) {
                /* Skip non-video slots. */
                if (SpaceCamp.htSlots[j].getType() !== HeaderTagSlot.SlotTypes.INSTREAM_VIDEO) {
                    continue;
                }

                if (htSlotVideoDemandObjs[i].htSlotName === SpaceCamp.htSlots[j].getName()) {
                    slotFound = true;
                    var newParcel = {
                        htSlot: SpaceCamp.htSlots[j],
                        ref: ''
                    };
                    outParcels.push(newParcel);
                }
            }

            if (!slotFound) {
                EventsService.emit('error', 'unrecognized header tag slot name ' + htSlotVideoDemandObjs[i].htSlotName + ' in call to retrieveVideoDemand');
            }
        }

        if (outParcels.length === 0) {
            EventsService.emit('warning', 'no valid header tag slots found in call to retrieveVideoDemand');

            return {
                sessionId: '',
                promise: Prms.resolve({})
            };
        }

        var calculatedTimeout = __desktopVideoGlobalTimeout;

        if (Utilities.getType(options) === 'undefined' || !options.hasOwnProperty('timeout')) {
            if (SpaceCamp.DeviceTypeChecker.getDeviceType() === 'mobile') {
                calculatedTimeout = __mobileVideoGlobalTimeout;
            }

        } else {
            calculatedTimeout = options.timeout;
        }


        SpaceCamp.globalTimeout = calculatedTimeout;

        var sessionId = TimerService.createTimer(calculatedTimeout, true);
        EventsService.emit('hs_session_start', {
            sessionId: sessionId,
            timeout: calculatedTimeout,
            sessionType: HeaderStatsService.SessionTypes.VIDEO
        });

        TimerService.addTimerCallback(sessionId, function () {
            EventsService.emit('global_timeout_reached', {
                sessionId: sessionId
            });
        });

        var retPromise = __baseClass._executeNext(sessionId, outParcels).then(function (receivedParcels) {

            EventsService.emit('hs_session_end', {
                sessionId: sessionId
            });

            var returnDemand = {};

            for (var k = 0; k < receivedParcels.length; k++) {
                /* If the parcel recorded a pass, skip it */
                if (receivedParcels[k].pass) {
                    continue;
                }

                /* If no targeting was set in the parcel (can happen without passing if the
                 * request to the partner errored out), skip it */
                if (!Utilities.isObject(receivedParcels[k].targeting) || Utilities.isEmpty(receivedParcels[k].targeting)) {
                    continue;
                }

                /* Video only supports slot-level targeting, so if we receive anything else,
                 * ignore it. */
                if (!receivedParcels[k].targetingType === 'slot') {
                    continue;
                }

                var demandObj = {
                    targeting: receivedParcels[k].targeting,
                    price: receivedParcels[k].price ? receivedParcels[k].price : 0,
                    size: receivedParcels[k].size ? receivedParcels[k].size : [],
                    partnerId: receivedParcels[k].partnerId ? receivedParcels[k].partnerId : '',
                    adm: receivedParcels[k].adm ? receivedParcels[k].adm : ''
                };

                /* Add the dealId property if dealId exists in the parcel. */
                if (receivedParcels[k].hasOwnProperty('dealId')) {
                    demandObj.dealId = receivedParcels[k].dealId;
                }

                var htSlotName = receivedParcels[k].htSlot.getName();
                if (!returnDemand.hasOwnProperty(htSlotName)) {
                    returnDemand[htSlotName] = [];
                }

                returnDemand[htSlotName].push(demandObj);
            }

            return returnDemand;
        });

        return {
            promise: retPromise,
            sessionId: sessionId
        };
    }

    function __executor(sessionId, inParcels) {
        return __baseClass._executeNext(sessionId, inParcels);
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        EventsService = SpaceCamp.services.EventsService;
        TimerService = SpaceCamp.services.TimerService;


        __desktopVideoGlobalTimeout = configs.desktopVideoGlobalTimeout;
        __mobileVideoGlobalTimeout = configs.mobileVideoGlobalTimeout;
        __baseClass._setExecutor(__executor);

        __baseClass._setDirectInterface('VideoInterfaceLayer', {
            buildGamMvt: buildGamMvt,
            retrieveVideoDemand: retrieveVideoDemand,
            retrieveVideoDemandValidation: retrieveVideoDemandValidation
        });
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    var derivedClass = {
        /* Class Information
         * ---------------------------------- */


        /* Date
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = VideoInterfaceLayer;
},{}],10:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Utilities = require(33);
var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function BidTransformer(configs) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    var __defaultSettings = {
        floor: 0,
        buckets: [
            {
                max: Infinity,
                step: 1
            }
        ]
    };

    /**
     * The number of digits required to shift the decimal point of input values
     * in order to get cents.
     *
     * @type {integer}
     */
    var __inputShift;

    /**
     * The number of digits required to shift the decimal point of internal cents
     * values in order to get the output unit.
     *
     * @type {integer}
     */
    var __outputShift;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Helpers
     * ---------------------------------- */

    function __round(price) {
        if (configs.roundingType === BidTransformer.RoundingTypes.FLOOR) {
            return Math.floor(price);
        }

        return price;
    }

    /* Main
     * ---------------------------------- */

    function apply(rawBid) {

        var decimalShift = 0;
        var shiftMultiplier = 1;
        var transformed = rawBid.toString();
        var decimalPos = transformed.indexOf('.');

        /* Remove the decimal point and keep track of how much this multiplied the number */
        if (decimalPos > -1) {
            decimalShift = transformed.length - decimalPos - 1;
            transformed = transformed.slice(0, decimalPos) + transformed.slice(decimalPos + 1);
        }

        /* If the shift we just did is sufficient to include the inputCentsMultiplier,
           don't multiply anymore and just keep track of how much extra the multiplication
           may have been.
           If it wasn't, add some zeros to finish the conversion to cents. */
        if (decimalShift >= __inputShift) {
            decimalShift -= __inputShift;
        } else {
            var numZeros = __inputShift - decimalShift;
            decimalShift = 0;
            transformed = Utilities.padEnd(transformed, transformed.length + numZeros, '0');
        }

        /* Restrict the final number to 9 digits so it will be guaranteed to fit into a 32-bit
           integer.
           ASSUMPTION: A number with this many digits will have most of them as part of the
           fractional part (i.e. valid bids are not one hundred million dollars or larger)
           and thus the subtraction here will not make decimalShift negative */
        if (transformed.length > 9) {
            decimalShift -= (transformed.length - 9);
            transformed = transformed.slice(0, 9);
        }

        shiftMultiplier = Math.pow(10, decimalShift);

        transformed = Number(transformed);

        // Assert: transformed is now a whole number. It is in units of 1/shiftMultiplier cents.

        var len = configs.buckets.length;

        if (transformed < (configs.floor * shiftMultiplier)) {
            transformed = 0;
        } else if (transformed >= (configs.buckets[len - 1].max * shiftMultiplier)) {
            transformed = (configs.buckets[len - 1].max * shiftMultiplier);
        } else {
            var min = configs.floor;

            var bucket;

            for (var i = 0; i < len; i++) {
                bucket = configs.buckets[i];

                if (transformed <= (bucket.max * shiftMultiplier)) {
                    break;
                }

                min = bucket.max;
            }

            if (configs.roundingType !== BidTransformer.RoundingTypes.NONE) {
                transformed = transformed - (min * shiftMultiplier);
                transformed = transformed / (bucket.step * shiftMultiplier);
                transformed = __round(transformed);
                transformed = transformed * (bucket.step * shiftMultiplier);
                transformed = transformed + (min * shiftMultiplier);
            }
        }

        transformed = transformed.toString();

        decimalShift += __outputShift;

        var newDecimalPos = transformed.length - decimalShift;

        if (newDecimalPos < 1) {
            transformed = Utilities.padStart(transformed, transformed.length + (1 - newDecimalPos), '0');
            newDecimalPos = 1;
        }

        var retVal = transformed.slice(0, newDecimalPos);

        if (configs.outputPrecision !== 0) {
            retVal = retVal + '.' + transformed.slice(newDecimalPos);

            if (configs.outputPrecision > 0) {
                if (decimalShift < configs.outputPrecision) {
                    retVal = Utilities.padEnd(retVal, newDecimalPos + configs.outputPrecision + 1, '0');
                } else {
                    retVal = retVal.slice(0, newDecimalPos + configs.outputPrecision + 1);
                }
            }
        }

        return retVal;
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {

        __inputShift = Math.round(Math.log(configs.bidUnitInCents) * Math.LOG10E);
        __outputShift = Math.round(Math.log(configs.outputCentsDivisor) * Math.LOG10E);

        configs.roundingType = BidTransformer.RoundingTypes[configs.roundingType];

        var fields = ['floor', 'buckets'];

        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];

            if (!configs.hasOwnProperty(field)) {
                configs[field] = __defaultSettings[field];

            }
        }
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        /* This has to be a string because IE8 does not allow keywords to be used as
         * properties. */
        'apply': apply // eslint-disable-line quote-props
    };
}

////////////////////////////////////////////////////////////////////////////////
// Enumerations ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

BidTransformer.RoundingTypes = {
    NONE: 0,
    FLOOR: 1
};

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = BidTransformer;
},{}],11:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A static library of browser related functions.
 *
 * @static
 */
function Browser() {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Public
     * ---------------------------------- */

    /**
     * Reference to the topmost accessible window context from where this library is
     * loaded.
     *
     * @type {object}
     */
    var topWindow;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Main
     * ---------------------------------- */

    /**
     * Gets the protocol used to access the page. If protocol is neither HTTP nor
     * HTTPS (i.e. when being accessed from the file structure), then the protocol
     * will default to the `http` value.
     *
     * @memberof Browser
     * @static
     * @public
     *
     * @param  {string} [httpValue=http:]     The value to return if the protocol is
     *                                        HTTP.
     * @param  {string} [httpsValue = https:] The value to return if the protocol is
     *                                        HTTPS.
     * @return {string}                       The value corresponding to the
     *                                        protocol.
     */
    function getProtocol(httpValue, httpsValue) {

        httpValue = httpValue || 'http:';
        httpsValue = httpsValue || 'https:';

        return document.location.protocol === 'https:' ? httpsValue : httpValue;
    }

    /**
     * Gets the width of the browser depending on window.document.compatMode
     * @memberof Browser
     * @static
     * @public
     *
     */
    function getViewportWidth() {
        // eslint-disable-next-line yoda
        var elementRef = 'CSS1Compat' === topWindow.document.compatMode ? topWindow.document.documentElement : topWindow.document.body;

        return elementRef.clientWidth;
    }

    /**
     * Gets the width of the browser depending on window.document.compatMode
     * @memberof Browser
     * @static
     * @public
     *
     */
    function getViewportHeight() {
        // eslint-disable-next-line yoda
        var elementRef = 'CSS1Compat' === topWindow.document.compatMode ? topWindow.document.documentElement : topWindow.document.body;

        return elementRef.clientHeight;
    }

    function getScreenWidth() {
        return topWindow.screen.width;
    }

    function getScreenHeight() {
        return topWindow.screen.height;
    }

    function getReferrer() {
        return document.referrer;
    }

    function getHostname() {
        return topWindow.location.hostname;
    }

    function getUserAgent() {
        return navigator.userAgent;
    }

    function getLanguage() {
        return navigator.language || navigator.browserLanguage || navigator.userLanguage || navigator.systemLanguage;
    }

    function getPathname() {
        return topWindow.location.pathname;
    }

    /**
     * Checks to see if the code is being run in the top frame or iframe.
     * @return {Boolean} Returns 0 if in an iframe, 1 otherwise.
     */
    function isTopFrame() {
        try {
            return window.top === window.self;
        } catch (ex) {
            /* If it breaks (IE) we want to indicate it's an iframe just in case */
            return false;
        }
    }

    function getPageUrl() {
        return isTopFrame() ? location.href : document.referrer || location.href;
    }

    /**
     * Checks if local storage is supported.
     *
     * @memberof Browser
     * @static
     * @public
     *
     * @return {boolean} True if local storage is supported, false otherwise.
     */
    function isLocalStorageSupported() {
        /* Need to try before determining whether this is supported because many
         * browsers will throw errors if you try to check for the existence of
         * `localStorage` in `window`. */
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');

            return true;
        } catch (ex) {
            return false;
        }
    }

    /**
     * Traverses up the context tree and calls the `perContextFn` at each level providing
     * it the context. At the top-level context, the `topContextFn` is called with the
     * context. Not tested with the object tag.
     *
     * @param  {function} [perContextFn] The function to run at each context level.
     * @param  {function} [topContextFn] The function to run at the top context level.
     * @param  {integer} [startLevel]    The level to start traversing at. 0 is scope.
     * @param  {integer} [maxLevel]      Abort after checking this level up from current.
     * @return {*}                       Returns null if the functions never return
     *                                   anything truthy, otherwise it will return
     *                                   what the function returns.
     */
    function traverseContextTree(perContextFn, topContextFn, startLevel, maxLevel) {

        try {
            var context = window;
            var level = 0;

            var value;
            while (true) { // eslint-disable-line no-constant-condition
                if (startLevel && (level < startLevel)) {
                    continue;
                }

                if (maxLevel && (level > maxLevel)) {
                    break;
                }

                /* If the function is defined then run it on every new context. */
                if (perContextFn) {
                    value = perContextFn(context);

                    if (value) {
                        return value;
                    }
                }

                /* In WHATWG accessing frameElement in cross-origin will return null, but in
                 * W3C it throws a SecurityError, so we need to catch just in case. */
                var frameElement;
                try {
                    frameElement = context.frameElement;
                } catch (ex) {
                    frameElement = null;
                }

                /* This will be true when the topmost accessible context is reached. */
                if (frameElement === null) {
                    /* If the function is defined then run it only on the topmost context. */
                    if (topContextFn) {
                        value = topContextFn(context);

                        if (value) {
                            return value;
                        }
                    }

                    break;
                }

                /* Move the context up one. */
                context = context.parent;
                level++;
            }
        } catch (ex) {
        }

        /* If either an error is thrown or any of the functions never return anything
         * but null. */
        return null;
    }

    /**
     * Returns the entity with `entityName` in the nearest `window` scope.
     *
     * @param  {string} entityName The name of the entity you are looking for.
     * @return {*}                 If the entity is found, then the entity, otherwise,
     *                             returns null.
     */
    function getNearestEntity(entityName) {

        return traverseContextTree(function (context) {
            if (context.hasOwnProperty(entityName)) {
                return context[entityName];
            }

            return null;
        });
    }

    /**
     * Generate a hidden iframe and then append it to the body.
     * @param  {Object} srcUrl Optional src for the pixel
     * @param  {Object} scope Optional window scope for iframe
     * @return {Object} returns the pixel iframe
     */
    function createHiddenIFrame(srcUrl, scope) {

        var w = scope || topWindow;
        var iframe = w.document.createElement('iframe');
        if (srcUrl) {
            iframe.src = srcUrl;
        }

        iframe.width = 0;
        iframe.height = 0;
        iframe.scrolling = 'no';
        iframe.marginWidth = 0;
        iframe.marginHeight = 0;
        iframe.frameBorder = 0;

        /* Need to use `setAttribute` because this property isn't accessible using the dot
         * operator in IE. */
        iframe.setAttribute('style', 'border: 0px; vertical-align: bottom; visibility: hidden; display: none;');

        w.document.body.appendChild(iframe);

        return iframe;
    }

    /**
     * Read cookie giten name and return its value.
     *
     * @param {string} name
     * @returns {string} cookie's value
     */
    function readCookie(name) {
        var nameEquals = name + '=';
        var cookies = topWindow.document.cookie.split(';');

        for (var cookieName in cookies) {
            if (!cookies.hasOwnProperty(cookieName)) {
                continue;
            }

            var cookie = cookies[cookieName];

            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }

            if (cookie.indexOf(nameEquals) === 0) {
                return cookie.substring(nameEquals.length, cookie.length);
            }
        }

        return null;
    }

    /**
     * Returns if flash is supported in the browser.
     *
     * @returns {boolean} flash supported
     */
    function isFlashSupported() {
        var hasFlash = false;
        try {
            // Check for Flash support in IE
            if (new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash')) {
                hasFlash = true;
            }
        } catch (ex) {
            // Check for Flash support in other browsers
            if (navigator.mimeTypes
                && navigator.mimeTypes['application/x-shockwave-flash'] !== undefined
                && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
                hasFlash = true;
            }
        }

        return hasFlash;
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        topWindow = traverseContextTree(null, function (context) {
            return context;
        });
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* PubKitShrinkExports<Browser> */
        /* Class Information
         * ---------------------------------- */


        /* Data
         * ---------------------------------- */

        topWindow: topWindow,

        /* Functions
         * ---------------------------------- */

        getProtocol: getProtocol,
        isLocalStorageSupported: isLocalStorageSupported,
        getViewportWidth: getViewportWidth,
        getViewportHeight: getViewportHeight,
        isTopFrame: isTopFrame,
        getScreenWidth: getScreenWidth,
        getScreenHeight: getScreenHeight,
        getReferrer: getReferrer,
        getPageUrl: getPageUrl,
        getHostname: getHostname,
        getUserAgent: getUserAgent,
        getLanguage: getLanguage,
        getPathname: getPathname,
        getNearestEntity: getNearestEntity,
        traverseContextTree: traverseContextTree,
        createHiddenIFrame: createHiddenIFrame,
        readCookie: readCookie,
        isFlashSupported: isFlashSupported
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Browser();
},{}],12:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Browser = require(11);
var Utilities = require(33);
var System = require(32);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * The caching library provides a storage-agnostic interface for persisting data
 * in the browser, with built-in expiry.
 *
 * @class
 */
function Cache() {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    var __keyPrefix = 'IXWRAPPER';

    // No storing anything for longer than one week.
    var __maxTTL = 604800000;

    var __localStorageAvailable;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Main
     * ---------------------------------- */

    function deleteData(key) {

        if (!__localStorageAvailable) {

            return false;
        }

        try {
            localStorage.removeItem(__keyPrefix + key);
        } catch (ex) {

            return false;
        }

        return true;
    }

    function getEntry(key) {

        if (!__localStorageAvailable) {

            return null;
        }

        var entry;

        try {
            entry = JSON.parse(localStorage.getItem(__keyPrefix + key));
        } catch (ex) {

            return null;
        }

        if (entry === null) {
            return null;
        }

        if (!entry.e || entry.e < System.now()) {

            deleteData(key);

            return null;
        }

        if (!Utilities.isObject(entry.d)) {
            return null;
        }

        return {
            data: entry.d,
            created: entry.t,
            expires: entry.e
        };
    }

    function getData(key) {
        var entry = getEntry(key);

        return entry && entry.data;
    }

    function setData(key, data, ttl) {

        if (!__localStorageAvailable) {

            return false;
        }

        if (ttl > __maxTTL) {
            ttl = __maxTTL;
        }

        var now = System.now();

        /* Using single letter keys in the storage object to minimize footprint, as the storage space is shared amongst
         * all scripts on the page. These keys are also encapsulated within the caching library (it's an implementation
         * detail of the library) so it shouldn't cause confusion to anyone else */
        var entry = {
            t: now,
            d: data,
            e: now + ttl
        };

        try {
            localStorage.setItem(__keyPrefix + key, JSON.stringify(entry));
        } catch (ex) {

            return false;
        }

        return true;
    }

    /* Unit Test
     * ---------------------------------- */

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        /* Check availability of localStorage */
        __localStorageAvailable = Browser.isLocalStorageSupported();
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */



        /* Functions
         * ---------------------------------- */
        deleteData: deleteData,
        getEntry: getEntry,
        getData: getData,
        setData: setData
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Cache();
},{}],13:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A static library of functions to help emulate class-like functionality.
 *
 * @namespace Classify
 */
function Classify() {
    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /**
     * Removes the protected members from a class instance. Protected members are
     * identified by their names which are prefixed with a single underscore.
     *
     * @private
     *
     * @param  {object} theClass An instance of a class.
     */
    function __removeProtectedMembers(theClass) {

        for (var member in theClass) {
            if (!theClass.hasOwnProperty(member)) {
                continue;
            }

            if (member[0] === '_' && member.slice(0, 2) !== '__') {
                delete theClass[member];
            }
        }

        return theClass;
    }

    /* Main
     * ---------------------------------- */

    /**
     * Takes two classes and consolidated them into one and removed the protected
     * members.
     *
     * @param  {object} base    The case class that is being derived from.
     * @param  {object} derived The class that is deriving from the base class.
     * @return {object}         The derived class with all the protected members
     *                          removed.
     */
    function derive(base, derived) {

        var theClass = {};

        var member;

        for (member in base) {
            if (!base.hasOwnProperty(member)) {
                continue;
            }

            theClass[member] = base[member];
        }

        for (member in derived) {
            if (!derived.hasOwnProperty(member)) {
                continue;
            }

            theClass[member] = derived[member];
        }

        return __removeProtectedMembers(theClass);
    }

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* PubKitShrinkExports<Classify> */
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */


        derive: derive
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Classify();
},{}],14:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Utilities = require(33);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Queue up commands that
 *
 * @constructor
 */
function CommandQueue(queue) {
    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Main
     * ---------------------------------- */

    function push(fn) {
        if (!Utilities.isFunction(fn)) {

            return;
        }

        try {
            fn();
        } catch (ex) {
        }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        if (!Utilities.isArray(queue)) {

            return;
        }

        for (var i = 0; i < queue.length; i++) {
            try {
                queue[i]();
            } catch (ex) {
            }
        }
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        push: push
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = CommandQueue;
},{}],15:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/* NOTE: Dependencies here must be minimized so that these functions can be used
 * outside the product (ie. in the build script) as well. Any requires must
 * include paths. Do not include anything that must be metascript-processed or
 * browserified in the dependency tree.
 *
 * This file should never be included in a production build.
 */
var Constants = require(16);
var Inspector = require(21);

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Object containing validation logic for configs for various modules. Can be
 * required by those modules to validate the config passed to them on
 * instantiation. Also required by index.js to validate the config file during
 * the build process. Each function takes a config object as a parameter and
 * returns null if the config is valid or a string describing the error if it
 * is invalid.
 *
 * @type {Object}
 */
var ConfigValidators = {
    PostGptLayer: function (configs) {
        var results = Inspector.validate({
            type: 'object',
            strict: true,
            properties: {
                lineItemDisablerTargeting: {
                    type: 'object',
                    properties: {
                        key: {
                            type: 'string',
                            minLength: 1
                        },
                        value: {
                            type: 'array',
                            minLength: 1,
                            items: {
                                type: 'string'
                            }
                        }
                    }
                },
                desktopGlobalTimeout: {
                    type: 'integer',
                    gte: 0
                },
                mobileGlobalTimeout: {
                    type: 'integer',
                    gte: 0
                },
                slotMapping: {
                    type: 'object'
                }
            }
        }, configs);

        if (!results.valid) {
            return results.format();
        }

        return null;
    },
    GptLayer: function (configs) {
        var results = Inspector.validate({
            type: 'object',
            properties: {
                desktopGlobalTimeout: {
                    type: 'integer',
                    gte: 0
                },
                mobileGlobalTimeout: {
                    type: 'integer',
                    gte: 0
                },
                enableSingleRequest: {
                    type: 'boolean',
                    optional: true
                },
                disableInitialLoad: {
                    type: 'boolean',
                    optional: true
                },
                slotMapping: {
                    optional: true,
                    type: 'object',
                    properties: {
                        selectors: {
                            type: 'array',
                            items: {
                                type: ['array', 'string'],
                                minLength: 1,
                                items: {
                                    type: 'string',
                                    minLength: 1
                                }
                            }
                        },
                        filters: {
                            type: 'array',
                            items: {
                                type: 'string',
                                minLength: 1
                            }
                        }
                    }
                }
            }
        }, configs);

        if (!results.valid) {
            return results.format();
        }

        return null;
    },
    IdentityLayer: function (configs, validPartnerNames) {
        var results = Inspector.validate({
            type: 'object',
            strict: true,
            properties: {
                timeout: {
                    type: 'integer',
                    gte: 0,
                    optional: true
                },
                partners: {
                    type: 'object',
                    properties: {
                        '*': {
                            type: 'object',
                            properties: {
                                configs: {
                                    type: 'object'
                                },
                                enabled: {
                                    type: 'boolean'
                                },
                                enableSetTargeting: {
                                    type: 'boolean',
                                    optional: true
                                }
                            }
                        }
                    }
                }
            }
        }, configs);

        if (!results.valid) {
            return results.format();
        }

        for (var cPartnerId in configs.partners) {
            if (!configs.partners.hasOwnProperty(cPartnerId)) {
                continue;
            }

            if (validPartnerNames.indexOf(cPartnerId) === -1) {
                return 'Identity partner ID "' + cPartnerId + '" is unrecognized';
            }
        }

        return null;
    },
    PartnersLayer: function (configs, validPartnerNames) {
        var results = Inspector.validate({
            type: 'object',
            strict: true,
            properties: {
                prefetchOnLoad: {
                    optional: true,
                    type: 'object',
                    strict: true,
                    properties: {
                        enabled: {
                            type: 'boolean'
                        },
                        configs: {
                            optional: true,
                            type: 'object',
                            strict: true,
                            properties: {
                                dynamic: {
                                    optional: true,
                                    type: 'object',
                                    strict: true,
                                    properties: {
                                        var: {
                                            optional: true,
                                            type: 'string',
                                            minLength: 1
                                        },
                                        slotMapping: {
                                            type: 'object',
                                            strict: true,
                                            properties: {
                                                style: {
                                                    type: 'string',
                                                    eq: ['ALL', 'SINGLE']
                                                },
                                                selectors: {
                                                    type: 'array',
                                                    minLength: 1,
                                                    items: {
                                                        type: ['array', 'string'],
                                                        minLength: 1,
                                                        items: {
                                                            type: 'string',
                                                            minLength: 1
                                                        }
                                                    }
                                                },
                                                filters: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        minLength: 1
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                pageType: {
                                    optional: true,
                                    type: 'object',
                                    strict: true,
                                    properties: {
                                        var: {
                                            optional: true,
                                            type: 'string',
                                            minLength: 1
                                        },
                                        mapping: {
                                            type: 'object',
                                            strict: true,
                                            properties: {
                                                '*': {
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                        minLength: 1
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                fixed: {
                                    optional: true,
                                    type: 'object',
                                    strict: true,
                                    properties: {
                                        htSlotNames: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                minLength: 1
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                bidTransformerTypes: {
                    type: 'object',
                    optional: true,
                    properties: {
                        '*': {
                            type: 'object',
                            exec: function (schema, config) {
                                if (!config) {
                                    return;
                                }

                                var result = ConfigValidators.bidTransformerConfig(config);
                                if (result !== null) {
                                    this.report(result);
                                }
                            }
                        }
                    }
                },
                partners: {
                    type: 'object',
                    properties: {
                        '*': {
                            type: 'object',
                            properties: {
                                configs: {
                                    type: 'object'
                                },
                                enabled: {
                                    type: 'boolean'
                                }
                            }
                        }
                    }
                }
            }
        }, configs);

        if (!results.valid) {
            return results.format();
        }

        for (var cPartnerId in configs.partners) {
            if (!configs.partners.hasOwnProperty(cPartnerId)) {
                continue;
            }

            if (validPartnerNames.indexOf(cPartnerId) === -1) {
                return 'Partner ID "' + cPartnerId + '" is unrecognized';
            }
        }

        return null;
    },
    DirectBiddingLayer: function (configs) {
        var results = Inspector.validate({
            type: 'object',
            strict: true,
            properties: {
                desktopGlobalTimeout: {
                    type: 'integer',
                    gte: 0
                },
                mobileGlobalTimeout: {
                    type: 'integer',
                    gte: 0
                }
            }
        }, configs);

        if (!results.valid) {
            return results.format();
        }

        return null;
    },
    VideoInterfaceLayer: function (configs) {
        var results = Inspector.validate({
            type: 'object',
            strict: true,
            properties: {
                desktopVideoGlobalTimeout: {
                    type: 'integer',
                    gte: 0
                },
                mobileVideoGlobalTimeout: {
                    type: 'integer',
                    gte: 0
                }
            }
        }, configs);

        if (!results.valid) {
            return results.format();
        }

        return null;
    },
    MediationLayer: function (configs) {
        var results = Inspector.validate({
            type: 'object',
            strict: true,
            properties: {
                mediationLevel: {
                    type: 'string',
                    eq: ['NONE', 'HT_SLOT', 'PARTNER']
                }
            }
        }, configs);

        if (!results.valid) {
            return results.format();
        }

        return null;
    },
    PreGptLayer: function () {
        return null;
    },
    StorageLayer: function () {
        return null;
    },
    ModuleLoader: function (configs, serviceNames, layerNames) {
        var result = Inspector.validate({
            type: 'object',
            properties: {
                htSlots: {
                    type: 'object',
                    optional: true
                },
                Services: {
                    type: 'object',
                    properties: {
                        '*': {
                            type: 'object'
                        }
                    }
                },
                Layers: {
                    type: 'array',
                    minLength: 1,
                    items: {
                        type: 'object',
                        properties: {
                            layerId: {
                                type: 'string',
                                minLength: 1
                            },
                            configs: {
                                type: 'object'
                            }
                        }
                    }
                }
            }
        }, configs);

        if (!result.valid) {
            return result.format();
        }

        for (var service in configs.Services) {
            if (serviceNames.indexOf(service) === -1) {
                return 'members of `configs.Services` must be one of the predefined values in `ServiceConstructors`';
            }
        }

        for (var j = 0; j < configs.Layers.length; j++) {
            if (layerNames.indexOf(configs.Layers[j].layerId) === -1) {
                return '`configs.Layers[' + j + '].layerId` must be one of the predefined values in `LayerConstructors`';
            }
        }

        return null;
    },
    HeaderTagSlot: function (configs, id) {
        var results = Inspector.validate({
            type: 'object',
            strict: true,
            properties: {
                id: {
                    type: 'string'
                },
                divId: {
                    optional: true,
                    type: 'string'
                },
                adUnitPath: {
                    optional: true,
                    type: 'string'
                },
                sizeMapping: {
                    optional: true,
                    type: 'object',
                    properties: {
                        '*': {
                            type: 'array',
                            minLength: 1,
                            items: {
                                type: 'array',
                                exactLength: 2,
                                items: {
                                    type: 'integer',
                                    gte: 0
                                }
                            }
                        }
                    }
                },
                targeting: {
                    optional: true,
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            '*': {
                                type: 'array',
                                minLength: 1,
                                items: {
                                    type: 'string',
                                    minLength: 1
                                }
                            }
                        }
                    }
                },
                deviceType: {
                    optional: true,
                    type: 'string',
                    minLength: 1
                },
                position: {
                    type: 'string',
                    eq: ['atf', 'btf'],
                    optional: true
                },
                type: {
                    type: 'string',
                    eq: ['INSTREAM_VIDEO', 'BANNER']
                }
            }
        }, configs);

        if (!results.valid) {
            return 'Invalid config: ' + results.format();
        }

        results = Inspector.validate({
            type: 'string',
            minLength: 1
        }, id);

        if (!results.valid) {
            return 'Invalid ID: ' + results.format();
        }

        if (!configs.hasOwnProperty('sizeMapping')) {
            return '`config` must have property "sizeMapping"';
        }

        var indexRegex = /^(\d+)x(\d+)$/;
        var keysCount = 0;

        for (var index in configs.sizeMapping) {
            if (!configs.sizeMapping.hasOwnProperty(index)) {
                continue;
            }

            if (indexRegex.test(index) === false) {
                return 'Keys of `config.sizeMapping` must be of form `widthxheight`';
            }

            keysCount++;
        }

        if (keysCount === 0) {
            return '`config.sizeMapping` must not be empty';
        }

        return null;
    },
    PartnerProfile: function (profile, requiredResources, fns) {
        var results = Inspector.validate({
            type: 'object',
            strict: true,
            properties: {
                profile: {
                    type: 'object',
                    strict: true,
                    properties: {
                        partnerId: {
                            type: 'string',
                            minLength: 1
                        },
                        namespace: {
                            type: 'string',
                            minLength: 1
                        },
                        statsId: {
                            type: 'string',
                            minLength: 1
                        },
                        version: {
                            type: 'string',
                            minLength: 1,
                            optional: true
                        },
                        targetingType: {
                            type: 'string',
                            eq: ['page', 'slot']
                        },
                        bidUnitInCents: {
                            type: 'number',
                            gt: 0,
                            optional: true,
                            exec: function (schema, post) {
                                if ((post > 1 && post % 10 !== 0) || (post < 1 && !(/^0\.0*1$/).test(post.toString()))) {
                                    this.report('must be a power of 10');
                                }
                            }
                        },
                        enabledAnalytics: {
                            type: 'object',
                            properties: {
                                '*': {
                                    type: 'boolean'
                                }
                            }
                        },
                        features: {
                            type: 'object',
                            properties: {
                                '*': {
                                    type: 'object',
                                    strict: true,
                                    properties: {
                                        enabled: {
                                            type: 'boolean'
                                        },
                                        value: {
                                            type: 'any'
                                        }
                                    }
                                },
                                prefetchDisabled: {
                                    optional: true,
                                    type: 'object',
                                    strict: true,
                                    properties: {
                                        enabled: {
                                            type: 'boolean'
                                        }
                                    }
                                }
                            }
                        },
                        targetingKeys: {
                            type: 'object',
                            strict: true,
                            properties: {
                                id: {
                                    optional: true,
                                    type: 'string',
                                    minLength: 1
                                },
                                om: {
                                    optional: true,
                                    type: 'string',
                                    minLength: 1
                                },
                                pm: {
                                    optional: true,
                                    type: 'string',
                                    minLength: 1
                                },
                                pmid: {
                                    optional: true,
                                    type: 'string',
                                    minLength: 1
                                },
                                bidderKey: {
                                    optional: true,
                                    type: 'string',
                                    minLength: 1
                                },
                                ybot_ad: { // eslint-disable-line camelcase
                                    optional: true,
                                    type: 'string',
                                    minLength: 1
                                },
                                ybot_size: { // eslint-disable-line camelcase
                                    optional: true,
                                    type: 'string',
                                    minLength: 1
                                },
                                ybot_cpm: { // eslint-disable-line camelcase
                                    optional: true,
                                    type: 'string',
                                    minLength: 1
                                },
                                ybot_slot: { // eslint-disable-line camelcase
                                    optional: true,
                                    type: 'string',
                                    minLength: 1
                                },
                                retargeter: {
                                    optional: true,
                                    type: 'string',
                                    minLength: 1
                                }
                            }
                        },
                        lineItemType: {
                            type: 'integer',
                            exec: function (schema, post) {
                                var validType = false;

                                for (var type in Constants.LineItemTypes) {
                                    if (!Constants.LineItemTypes.hasOwnProperty(type)) {
                                        continue;
                                    }

                                    if (Constants.LineItemTypes[type] === post) {
                                        validType = true;

                                        break;
                                    }
                                }

                                if (!validType) {
                                    this.report('must be one of the predefined values in `Constants.LineItemTypes`');
                                }
                            }
                        },
                        callbackType: {
                            type: 'integer'
                        },
                        architecture: {
                            type: 'integer'
                        },
                        parseAfterTimeout: {
                            type: 'boolean',
                            optional: true
                        },
                        requestType: {
                            type: 'integer'
                        }
                    }
                },
                requiredResources: {
                    type: ['array', 'null'],
                    items: {
                        type: 'string',
                        minLength: 1
                    }
                },
                fns: {
                    type: 'object',
                    exec: function (schema, post) {
                        for (var fnName in post) {
                            if (!post.hasOwnProperty(fnName)) {
                                continue;
                            }

                            if (typeof post[fnName] !== 'function') {
                                this.report(fnName + ' must be a function, is ' + typeof post[fnName]);
                            }
                        }

                        if (post.hasOwnProperty('retriever')) {
                            if (post.hasOwnProperty('parseResponse') || post.hasOwnProperty('generateRequestObj') || post.hasOwnProperty('adResponseCallback')) {
                                this.report('must either have retriever or the other three.');
                            }
                        } else {
                            if (!post.hasOwnProperty('parseResponse') && !post.hasOwnProperty('generateRequestObj')) {
                                this.report('must either have retriever or the other three.');
                            }
                        }
                    }
                }
            }
        }, {
            profile: profile,
            requiredResources: requiredResources,
            fns: fns
        });

        if (!results.valid) {
            return results.format();
        }

        return null;
    },
    IdentityPartnerProfile: function (profile) {
        var results = Inspector.validate({
            type: 'object',
            strict: true,
            properties: {
                partnerId: {
                    type: 'string',
                    minLength: 1
                },
                statsId: {
                    type: 'string',
                    minLength: 1
                },
                version: {
                    type: 'string',
                    pattern: /^\d+\.\d+\.\d+$/
                },
                source: {
                    type: 'string',
                    minLength: 1
                },
                cacheExpiry: {
                    type: 'object',
                    strict: true,
                    properties: {
                        match: {
                            type: 'integer',
                            gt: 0
                        },
                        pass: {
                            type: 'integer',
                            gt: 0
                        },
                        error: {
                            type: 'integer',
                            gt: 0
                        }
                    }
                },
                targetingKeys: {
                    type: 'object',
                    strict: true,
                    properties: {
                        exchangeBidding: {
                            type: 'string',
                            minLength: 1
                        }
                    }
                },
                consent: {
                    type: 'object',
                    optional: true,
                    strict: true,
                    properties: {
                        gdpr: {
                            type: 'string',
                            minLength: 1,
                            optional: true
                        }
                    },
                    exec: function (scheme, post) {
                        if (post && !Object.keys(post)) {
                            this.report('must declare at least one consent type');
                        }
                    }
                },
                sonar: {
                    type: 'object',
                    strict: true,
                    optional: true,
                    properties: {
                        enabled: {
                            type: 'boolean'
                        },
                        entrypoints: {
                            type: 'array',
                            optional: true,
                            minLength: 1,
                            items: {
                                type: 'object',
                                strict: true,
                                properties: {
                                    key: {
                                        type: 'string',
                                        minLength: 1,
                                        optional: true
                                    },
                                    filter: {
                                        type: 'object',
                                        strict: true,
                                        properties: {
                                            attr: {
                                                type: 'integer',
                                                gt: 0,
                                                optional: true
                                            },
                                            algo: {
                                                type: 'integer',
                                                gt: 0,
                                                optional: true
                                            },
                                            impl: {
                                                type: 'integer',
                                                gt: 0,
                                                optional: true
                                            },
                                            prov: {
                                                type: 'string',
                                                minLength: 1,
                                                optional: true
                                            },
                                            name: {
                                                type: 'string',
                                                minLength: 1,
                                                optional: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }, profile);

        if (!results.valid) {
            return results.format();
        }

        return null;
    },
    IdentityPartnerModule: function (instance) {
        var results = Inspector.validate({
            type: 'object',
            strict: true,
            properties: {
                type: {
                    type: 'string',
                    eq: 'identity'
                },
                api: {
                    type: 'string',
                    minLength: 1
                },
                main: {
                    exec: function (scheme, post) {
                        if (typeof post !== 'function') {
                            this.report('must be a function');
                        }
                    }
                },
                profile: {
                    type: 'object',
                    exec: function (scheme, post) {
                        var err = ConfigValidators.IdentityPartnerProfile(post);
                        if (err) {
                            this.report(err);
                        }
                    }
                }
            }
        }, instance);

        if (!results.valid) {
            return results.format();
        }

        return null;
    },
    partnerBaseConfig: function (configs) {
        var result = Inspector.validate({
            type: 'object',
            properties: {
                timeout: {
                    optional: true,
                    type: 'integer',
                    gte: 0
                },
                xSlots: {
                    type: 'object',
                    properties: {
                        '*': {
                            type: 'object'
                        }
                    }
                },
                mapping: {
                    type: 'object',
                    properties: {
                        '*': {
                            type: 'array',
                            items: {
                                type: 'string',
                                minLength: 1,
                                exec: function (schema, post) {
                                    if (this.origin.xSlots && !this.origin.xSlots.hasOwnProperty(post)) {
                                        this.report('`configs.mapping` must map htSlotsNames to partner slots defined in `configs.xSlots`');
                                    }
                                }
                            }
                        }
                    }
                },
                targetingKeyOverride: {
                    optional: true,
                    type: 'object',
                    properties: {
                        '*': {
                            type: 'string',
                            minLength: 1
                        }
                    }
                },
                lineItemType: {
                    type: 'string',
                    optional: true,
                    exec: function (schema, post) {
                        if (post && !Constants.LineItemTypes.hasOwnProperty(post)) {
                            this.report(post + ' must be one of the predefined values in `Constants.LineItemTypes`');
                        }
                    }
                },
                bidTransformer: {
                    type: 'object',
                    optional: true,
                    exec: function (schema, post) {
                        if (!post) {
                            return;
                        }

                        var transformerResults = ConfigValidators.bidTransformerConfig(post);
                        if (transformerResults !== null) {
                            this.report(transformerResults);
                        }
                    }
                }
            }
        }, configs);

        if (!result.valid) {
            return result.format();
        }

        return null;
    },
    rtiPartnerBaseConfig: function () {
        return null;
    },
    bidTransformerConfig: function (configs) {
        var result = Inspector.validate({
            type: 'object',
            optional: true,
            strict: true,
            properties: {
                bidUnitInCents: {
                    type: 'number',
                    gt: 0,
                    optional: true,
                    exec: function (schema, post) {
                        if ((post > 1 && post % 10 !== 0) || (post < 1 && !(/^0\.0*1$/).test(post.toString()))) {
                            this.report('must be a power of 10');
                        }
                    }
                },
                outputCentsDivisor: {
                    type: 'number',
                    gt: 0,
                    optional: true,
                    exec: function (schema, post) {
                        if ((post > 1 && post % 10 !== 0) || (post < 1 && !(/^0\.0*1$/).test(post.toString()))) {
                            this.report('must be a power of 10');
                        }
                    }
                },
                outputPrecision: {
                    type: 'integer',
                    gte: -1,
                    optional: true
                },
                roundingType: {
                    type: 'string',
                    eq: ['NONE', 'FLOOR'],
                    optional: true
                },
                floor: {
                    type: 'integer',
                    gte: 0,
                    optional: true
                },
                buckets: {
                    type: 'array',
                    minLenth: 1,
                    items: {
                        type: 'object',
                        properties: {
                            max: {
                                type: ['integer', 'string'],
                                gt: 0,
                                exec: function (schema, post) {
                                    if (typeof post === 'string' && post !== 'infinity') {
                                        this.report('The only acceptable string for bucket max is "infinity". Please check your config.');
                                    }
                                }
                            },
                            step: {
                                type: 'integer',
                                gt: 0
                            }
                        }
                    },
                    optional: true
                }
            },
            exec: function (schema, post) {
                if (!post) {
                    return;
                }

                /* Both floor and buckets must be set together if they are set. */
                if ((post.hasOwnProperty('floor') && !post.hasOwnProperty('buckets'))
                    || (!post.hasOwnProperty('floor') && post.hasOwnProperty('buckets'))) {
                    this.report('`configs.floor` and `configs.buckets` must be configured together');

                    return;
                }

                if (post.hasOwnProperty('floor') && post.hasOwnProperty('buckets')) {
                    var min = post.floor;

                    for (var i = 0; i < post.buckets.length; i++) {
                        var max = post.buckets[i].max;
                        var step = post.buckets[i].step;

                        if (max === 'infinity') {
                            max = Infinity;
                        }

                        /* Buckets must be in ascending order. */
                        if (max <= min) {
                            this.report('`configs.buckets[' + i + '].max` is not in ascending order');

                            return;
                        }

                        /* Steps must divide their range evenly. */
                        if (max !== Infinity) {
                            if ((max - min) % step !== 0) {
                                this.report('`configs.buckets[' + i + '].step` must evenly divide its range');

                                return;
                            }
                        }

                        min = max;
                    }
                }
            }
        }, configs);

        if (!result.valid) {
            return result.format();
        }

        return null;
    },
    EventsService: function () {
        return null;
    },
    KeyValueService: function () {
        return null;
    },
    GptService: function () {
        return null;
    },
    PublisherSonarService: function () {
        return null;
    },
    HeaderStatsService: function (config) {
        var result = Inspector.validate({
            type: 'object',
            properties: {
                siteId: {
                    type: 'string',
                    minLength: 1
                },
                configId: {
                    type: 'string',
                    minLength: 1
                },
                options: {
                    type: 'object',
                    properties: {
                        auctionCycle: {
                            type: 'boolean'
                        }
                    }
                }
            }
        }, config);

        if (!result.valid) {
            return result.format();
        }

        return null;
    },
    RenderService: function (config) {
        var result = Inspector.validate({
            type: 'object',
            properties: {
                sizeRetargeting: {
                    optional: true,
                    type: 'object',
                    properties: {
                        '*': {
                            type: 'array',
                            exactLength: 2,
                            items: {
                                type: 'integer'
                            }
                        }
                    }
                }
            }
        }, config);

        if (!result.valid) {
            return result.format();
        }

        if (config.sizeRetargeting) {
            for (var sizeKey in config.sizeRetargeting) {
                if (!config.sizeRetargeting.hasOwnProperty(sizeKey)) {
                    continue;
                }

                if (!(/^[0-9]+x[0-9]+$/).test(sizeKey)) {
                    return 'Invalid sizeRetargeting key `' + sizeKey + '`, must be format `widthxheight`';
                }
            }
        }

        return null;
    },
    TimerService: function () {
        return null;
    },
    ComplianceService: function (configs) {
        var result = Inspector.validate({
            type: 'object',
            strict: true,
            properties: {
                gdprAppliesDefault: {
                    type: 'boolean'
                },
                timeout: {
                    type: 'integer',
                    gte: 0
                },
                customFn: {
                    type: 'string',
                    optional: true
                }
            }
        }, configs);

        if (!result.valid) {
            return result.format();
        }

        return null;
    },
    AdaptiveTimeoutService: function (configs) {
        var result = Inspector.validate({
            type: 'object'
        }, configs);

        if (!result.valid) {
            return result.format();
        }

        return null;
    },
    HtSlotMapper: function (config, validMappingTypes) {
        var result = Inspector.validate({
            type: 'object',
            properties: {
                selectors: {
                    type: 'array',
                    minLength: 1,
                    items: {
                        type: ['array', 'string'],
                        minLength: 1,
                        items: {
                            type: 'string',
                            minLength: 1
                        }
                    }
                },
                filters: {
                    type: 'array',
                    items: {
                        type: 'string',
                        minLength: 1
                    }
                }
            }
        }, config);
        if (!result.valid) {
            return result.format();
        }

        for (var i = 0; i < config.selectors.length; i++) {
            var selectorSet = config.selectors[i];

            if (typeof selectorSet === 'string') {
                if (validMappingTypes.indexOf(selectorSet) === -1) {
                    return 'Unrecognized selector `' + selectorSet + '`';
                }
            } else {
                for (var j = 0; j < selectorSet.length; j++) {
                    var selector = selectorSet[j];

                    if (validMappingTypes.indexOf(selector) === -1) {
                        return 'Unrecognized selector `' + selector + '`';
                    }
                }
            }
        }

        for (var k = 0; k < config.filters.length; k++) {
            var filter = config.filters[k];

            if (validMappingTypes.indexOf(filter) === -1) {
                return 'Unrecognized filter `' + filter + '`';
            }
        }

        return null;
    },
    DeviceTypeChecker: function (configs) {
        var result = Inspector.validate({
            type: 'object',
            strict: true,
            properties: {
                method: {
                    type: 'string',
                    eq: Object.keys(Constants.DeviceTypeMethods)
                },
                configs: {
                    optional: true,
                    type: 'object'
                }
            }
        }, configs);

        if (!result.valid) {
            return result.format();
        }

        if (configs.method === 'REFERENCE') {
            result = Inspector.validate({
                type: 'object',
                strict: true,
                properties: {
                    reference: {
                        type: 'string',
                        minLength: 1
                    }
                }
            }, configs.configs);
        }

        if (configs.method === 'SIZE_MAPPING') {
            result = Inspector.validate({
                type: 'object',
                strict: true,
                properties: {
                    sizeMapping: {
                        type: 'object',
                        properties: {
                            '*': {
                                type: 'string',
                                minLength: 1
                            }
                        }
                    }
                }
            }, configs.configs);

            if (configs.configs.hasOwnProperty('sizeMapping')) {
                var indexRegex = /^(\d+)x(\d+)$/;
                var keysCount = 0;

                for (var index in configs.configs.sizeMapping) {
                    if (!configs.configs.sizeMapping.hasOwnProperty(index)) {
                        continue;
                    }

                    if (indexRegex.test(index) === false) {
                        return 'Keys of `configs.sizeMapping` must be of form `widthxheight`';
                    }

                    keysCount++;
                }

                if (keysCount === 0) {
                    return '`configs.sizeMapping` must not be empty';
                }
            }
        }

        if (!result.valid) {
            return result.format();
        }

        return null;
    }
};

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = ConfigValidators;
},{}],16:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Constants = {
    DEFAULT_UID_LENGTH: 8,
    MIN_BANNER_DIMENSION: 1,
    MIN_BID_FLOOR: 0,
    MIN_SITE_ID: 0,
    DEFAULT_UID_CHARSET: 'ALPHANUM',
    SESSION_ID_LENGTH: 8,
    PUBKIT_AD_ID_LENGTH: 16,
    RENDER_SERVICE_EXPIRY_SWEEP_TIMER: 30000,
    DEFAULT_PARTNER_PRIORITY: 1,
    LineItemTypes: {
        ID_AND_SIZE: 1,
        ID_AND_PRICE: 2,
        CUSTOM: 3
    },
    DeviceTypeMethods: {
        USER_AGENT: 1,
        REFERENCE: 2,
        SIZE_MAPPING: 3
    },
    RequestArchitectures: {
        MRA: 1,
        SRA: 2
    },
    InitialLoadStates: {
        DISABLED: 1,
        ENABLED: 2
    },
    MediationLevels: {
        NONE: 1,
        HT_SLOT: 2,
        PARTNER: 3
    }
};

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Constants;
},{}],17:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Constants = require(16);
var Utilities = require(33);
var Whoopsie = require(34);
var Device = require(19);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * The deviceType checker provides the ability to determine the current device type,
 * based on configuration information passed in at wrapper instantiation. The
 * determination of device type occurs on each call, since it can change without
 * a page reload.
 *
 * @class
 */
function DeviceTypeChecker(configs) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    var __activeMethod;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    function __getDeviceTypeByUserAgent() {
        if (Device.mobile()) {
            return DeviceTypeChecker.DeviceTypes.MOBILE;
        } else if (Device.tablet()) {
            return DeviceTypeChecker.DeviceTypes.DESKTOP;
        } else {
            return DeviceTypeChecker.DeviceTypes.DESKTOP;
        }
    }

    function __getDeviceTypeByReference() {
        var deviceTypeRef;

        try {
            deviceTypeRef = eval(configs.configs.reference);
        } catch (ex) {
            throw Whoopsie('INTERNAL_ERROR', 'DeviceTypeChecker: could not eval() `reference`.');
        }

        if (Utilities.isFunction(deviceTypeRef)) {
            try {
                return deviceTypeRef();
            } catch (ex) {
                throw Whoopsie('INTERNAL_ERROR', 'DeviceTypeChecker: could not execute `reference` function.');
            }
        } else if (Utilities.isString(deviceTypeRef)) {
            return deviceTypeRef;
        } else {
            throw Whoopsie('INVALID_TYPE', 'DeviceTypeChecker: `reference` must refer to a function or a string');
        }
    }

    /* Main
     * ---------------------------------- */

    function getDeviceType() {
        switch (__activeMethod) {
            case Constants.DeviceTypeMethods.USER_AGENT:
                return __getDeviceTypeByUserAgent();
            case Constants.DeviceTypeMethods.REFERENCE:
                return __getDeviceTypeByReference();
            default:
                return __getDeviceTypeByUserAgent();
        }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {

        __activeMethod = Constants.DeviceTypeMethods[configs.method] || Constants.DeviceTypeMethods.USER_AGENT;
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        getDeviceType: getDeviceType
    };
}

////////////////////////////////////////////////////////////////////////////////
// Static Functions ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

DeviceTypeChecker.isValidDeviceType = function (str) {
    for (var deviceType in DeviceTypeChecker.DeviceTypes) {
        if (!DeviceTypeChecker.DeviceTypes.hasOwnProperty(deviceType)) {
            continue;
        }

        /* Until tablet is supported as a valid device type, skip over it. */
        if (deviceType === 'TABLET') {
            continue;
        }

        if (str === DeviceTypeChecker.DeviceTypes[deviceType]) {
            return true;
        }
    }

    return false;
};

////////////////////////////////////////////////////////////////////////////////
// Enumerations ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

DeviceTypeChecker.DeviceTypes = {
    DESKTOP: 'desktop',
    MOBILE: 'mobile',
    TABLET: 'tablet'
};

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = DeviceTypeChecker;
},{}],18:[function(require,module,exports){
(function (process,global,setImmediate){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
        (factory((global.async = global.async || {})));
}(this, (function (exports) {
    'use strict';

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
        return value;
    }

    /**
     * A faster alternative to `Function#apply`, this function invokes `func`
     * with the `this` binding of `thisArg` and the arguments of `args`.
     *
     * @private
     * @param {Function} func The function to invoke.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} args The arguments to invoke `func` with.
     * @returns {*} Returns the result of `func`.
     */
    function apply(func, thisArg, args) {
        switch (args.length) {
            case 0:
                return func.call(thisArg);
            case 1:
                return func.call(thisArg, args[0]);
            case 2:
                return func.call(thisArg, args[0], args[1]);
            case 3:
                return func.call(thisArg, args[0], args[1], args[2]);
        }
        return func.apply(thisArg, args);
    }

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeMax = Math.max;

    /**
     * A specialized version of `baseRest` which transforms the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @param {Function} transform The rest array transform.
     * @returns {Function} Returns the new function.
     */
    function overRest(func, start, transform) {
        start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
        return function () {
            var args = arguments,
                index = -1,
                length = nativeMax(args.length - start, 0),
                array = Array(length);

            while (++index < length) {
                array[index] = args[start + index];
            }
            index = -1;
            var otherArgs = Array(start + 1);
            while (++index < start) {
                otherArgs[index] = args[index];
            }
            otherArgs[start] = transform(array);
            return apply(func, this, otherArgs);
        };
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new constant function.
     * @example
     *
     * var objects = _.times(2, _.constant({ 'a': 1 }));
     *
     * console.log(objects);
     * // => [{ 'a': 1 }, { 'a': 1 }]
     *
     * console.log(objects[0] === objects[1]);
     * // => true
     */
    function constant(value) {
        return function () {
            return value;
        };
    }

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

    /** `Object#toString` result references. */
    var funcTag = '[object Function]';
    var genTag = '[object GeneratorFunction]';
    var proxyTag = '[object Proxy]';

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto$1.toString;

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
        // The use of `Object#toString` avoids issues with the `typeof` operator
        // in Safari 9 which returns 'object' for typed array and other constructors.
        var tag = isObject(value) ? objectToString.call(value) : '';
        return tag == funcTag || tag == genTag || tag == proxyTag;
    }

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /** Used to detect overreaching core-js shims. */
    var coreJsData = root['__core-js_shared__'];

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function () {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
        return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
        return !!maskSrcKey && (maskSrcKey in func);
    }

    /** Used for built-in method references. */
    var funcProto$1 = Function.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString$1 = funcProto$1.toString;

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to process.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
        if (func != null) {
            try {
                return funcToString$1.call(func);
            } catch (e) {}
            try {
                return (func + '');
            } catch (e) {}
        }
        return '';
    }

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used for built-in method references. */
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
        funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
        .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
            return false;
        }
        var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
    }

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
        return object == null ? undefined : object[key];
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : undefined;
    }

    var defineProperty = (function () {
        try {
            var func = getNative(Object, 'defineProperty');
            func({}, '', {});
            return func;
        } catch (e) {}
    }());

    /**
     * The base implementation of `setToString` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var baseSetToString = !defineProperty ? identity : function (func, string) {
        return defineProperty(func, 'toString', {
            'configurable': true,
            'enumerable': false,
            'value': constant(string),
            'writable': true
        });
    };

    /** Used to detect hot functions by number of calls within a span of milliseconds. */
    var HOT_COUNT = 500;
    var HOT_SPAN = 16;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeNow = Date.now;

    /**
     * Creates a function that'll short out and invoke `identity` instead
     * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
     * milliseconds.
     *
     * @private
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new shortable function.
     */
    function shortOut(func) {
        var count = 0,
            lastCalled = 0;

        return function () {
            var stamp = nativeNow(),
                remaining = HOT_SPAN - (stamp - lastCalled);

            lastCalled = stamp;
            if (remaining > 0) {
                if (++count >= HOT_COUNT) {
                    return arguments[0];
                }
            } else {
                count = 0;
            }
            return func.apply(undefined, arguments);
        };
    }

    /**
     * Sets the `toString` method of `func` to return `string`.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var setToString = shortOut(baseSetToString);

    /**
     * The base implementation of `_.rest` which doesn't validate or coerce arguments.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     */
    function baseRest$1(func, start) {
        return setToString(overRest(func, start, identity), func + '');
    }

    var initialParams = function (fn) {
        return baseRest$1(function (args /*..., callback*/ ) {
            var callback = args.pop();
            fn.call(this, args, callback);
        });
    };

    function applyEach$1(eachfn) {
        return baseRest$1(function (fns, args) {
            var go = initialParams(function (args, callback) {
                var that = this;
                return eachfn(fns, function (fn, cb) {
                    fn.apply(that, args.concat([cb]));
                }, callback);
            });
            if (args.length) {
                return go.apply(this, args);
            } else {
                return go;
            }
        });
    }

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
        return typeof value == 'number' &&
            value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * This method returns `undefined`.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Util
     * @example
     *
     * _.times(2, _.noop);
     * // => [undefined, undefined]
     */
    function noop() {
        // No operation performed.
    }

    function once(fn) {
        return function () {
            if (fn === null) return;
            var callFn = fn;
            fn = null;
            callFn.apply(this, arguments);
        };
    }

    var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;

    var getIterator = function (coll) {
        return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
    };

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */
    function baseTimes(n, iteratee) {
        var index = -1,
            result = Array(n);

        while (++index < n) {
            result[index] = iteratee(index);
        }
        return result;
    }

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

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]';

    /** Used for built-in method references. */
    var objectProto$4 = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString$1 = objectProto$4.toString;

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
        return isObjectLike(value) && objectToString$1.call(value) == argsTag;
    }

    /** Used for built-in method references. */
    var objectProto$3 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

    /** Built-in value references. */
    var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function () {
        return arguments;
    }()) ? baseIsArguments : function (value) {
        return isObjectLike(value) && hasOwnProperty$2.call(value, 'callee') &&
            !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
        return false;
    }

    /** Detect free variable `exports`. */
    var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? root.Buffer : undefined;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER$1 = 9007199254740991;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
        length = length == null ? MAX_SAFE_INTEGER$1 : length;
        return !!length &&
            (typeof value == 'number' || reIsUint.test(value)) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    /** `Object#toString` result references. */
    var argsTag$1 = '[object Arguments]';
    var arrayTag = '[object Array]';
    var boolTag = '[object Boolean]';
    var dateTag = '[object Date]';
    var errorTag = '[object Error]';
    var funcTag$1 = '[object Function]';
    var mapTag = '[object Map]';
    var numberTag = '[object Number]';
    var objectTag = '[object Object]';
    var regexpTag = '[object RegExp]';
    var setTag = '[object Set]';
    var stringTag = '[object String]';
    var weakMapTag = '[object WeakMap]';

    var arrayBufferTag = '[object ArrayBuffer]';
    var dataViewTag = '[object DataView]';
    var float32Tag = '[object Float32Array]';
    var float64Tag = '[object Float64Array]';
    var int8Tag = '[object Int8Array]';
    var int16Tag = '[object Int16Array]';
    var int32Tag = '[object Int32Array]';
    var uint8Tag = '[object Uint8Array]';
    var uint8ClampedTag = '[object Uint8ClampedArray]';
    var uint16Tag = '[object Uint16Array]';
    var uint32Tag = '[object Uint32Array]';

    /** Used to identify `toStringTag` values of typed arrays. */
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
        typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
        typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
        typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
        typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
        typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
        typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
        typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
        typedArrayTags[mapTag] = typedArrayTags[numberTag] =
        typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
        typedArrayTags[setTag] = typedArrayTags[stringTag] =
        typedArrayTags[weakMapTag] = false;

    /** Used for built-in method references. */
    var objectProto$5 = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString$2 = objectProto$5.toString;

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
        return isObjectLike(value) &&
            isLength(value.length) && !!typedArrayTags[objectToString$2.call(value)];
    }

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */
    function baseUnary(func) {
        return function (value) {
            return func(value);
        };
    }

    /** Detect free variable `exports`. */
    var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports$1 && freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function () {
        try {
            return freeProcess && freeProcess.binding('util');
        } catch (e) {}
    }());

    /* Node.js helper references. */
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    /** Used for built-in method references. */
    var objectProto$2 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
        var isArr = isArray(value),
            isArg = !isArr && isArguments(value),
            isBuff = !isArr && !isArg && isBuffer(value),
            isType = !isArr && !isArg && !isBuff && isTypedArray(value),
            skipIndexes = isArr || isArg || isBuff || isType,
            result = skipIndexes ? baseTimes(value.length, String) : [],
            length = result.length;

        for (var key in value) {
            if ((inherited || hasOwnProperty$1.call(value, key)) &&
                !(skipIndexes && (
                    // Safari 9 has enumerable `arguments.length` in strict mode.
                    key == 'length' ||
                    // Node.js 0.10 has enumerable non-index properties on buffers.
                    (isBuff && (key == 'offset' || key == 'parent')) ||
                    // PhantomJS 2 has enumerable non-index properties on typed arrays.
                    (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
                    // Skip index properties.
                    isIndex(key, length)
                ))) {
                result.push(key);
            }
        }
        return result;
    }

    /** Used for built-in method references. */
    var objectProto$7 = Object.prototype;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
        var Ctor = value && value.constructor,
            proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$7;

        return value === proto;
    }

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
        return function (arg) {
            return func(transform(arg));
        };
    }

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeKeys = overArg(Object.keys, Object);

    /** Used for built-in method references. */
    var objectProto$6 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$3 = objectProto$6.hasOwnProperty;

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
        if (!isPrototype(object)) {
            return nativeKeys(object);
        }
        var result = [];
        for (var key in Object(object)) {
            if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
                result.push(key);
            }
        }
        return result;
    }

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    function createArrayIterator(coll) {
        var i = -1;
        var len = coll.length;
        return function next() {
            return ++i < len ? {
                value: coll[i],
                key: i
            } : null;
        };
    }

    function createES2015Iterator(iterator) {
        var i = -1;
        return function next() {
            var item = iterator.next();
            if (item.done) return null;
            i++;
            return {
                value: item.value,
                key: i
            };
        };
    }

    function createObjectIterator(obj) {
        var okeys = keys(obj);
        var i = -1;
        var len = okeys.length;
        return function next() {
            var key = okeys[++i];
            return i < len ? {
                value: obj[key],
                key: key
            } : null;
        };
    }

    function iterator(coll) {
        if (isArrayLike(coll)) {
            return createArrayIterator(coll);
        }

        var iterator = getIterator(coll);
        return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
    }

    function onlyOnce(fn) {
        return function () {
            if (fn === null) throw new Error("Callback was already called.");
            var callFn = fn;
            fn = null;
            callFn.apply(this, arguments);
        };
    }

    // A temporary value used to identify if the loop should be broken.
    // See #1064, #1293
    var breakLoop = {};

    function _eachOfLimit(limit) {
        return function (obj, iteratee, callback) {
            callback = once(callback || noop);
            if (limit <= 0 || !obj) {
                return callback(null);
            }
            var nextElem = iterator(obj);
            var done = false;
            var running = 0;

            function iterateeCallback(err, value) {
                running -= 1;
                if (err) {
                    done = true;
                    callback(err);
                } else if (value === breakLoop || done && running <= 0) {
                    done = true;
                    return callback(null);
                } else {
                    replenish();
                }
            }

            function replenish() {
                while (running < limit && !done) {
                    var elem = nextElem();
                    if (elem === null) {
                        done = true;
                        if (running <= 0) {
                            callback(null);
                        }
                        return;
                    }
                    running += 1;
                    iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
                }
            }

            replenish();
        };
    }

    /**
     * The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name eachOfLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.eachOf]{@link module:Collections.eachOf}
     * @alias forEachOfLimit
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} iteratee - A function to apply to each
     * item in `coll`. The `key` is the item's key, or index in the case of an
     * array. The iteratee is passed a `callback(err)` which must be called once it
     * has completed. If no error has occurred, the callback should be run without
     * arguments or with an explicit `null` argument. Invoked with
     * (item, key, callback).
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     */
    function eachOfLimit(coll, limit, iteratee, callback) {
        _eachOfLimit(limit)(coll, iteratee, callback);
    }

    function doLimit(fn, limit) {
        return function (iterable, iteratee, callback) {
            return fn(iterable, limit, iteratee, callback);
        };
    }

    // eachOf implementation optimized for array-likes
    function eachOfArrayLike(coll, iteratee, callback) {
        callback = once(callback || noop);
        var index = 0,
            completed = 0,
            length = coll.length;
        if (length === 0) {
            callback(null);
        }

        function iteratorCallback(err) {
            if (err) {
                callback(err);
            } else if (++completed === length) {
                callback(null);
            }
        }

        for (; index < length; index++) {
            iteratee(coll[index], index, onlyOnce(iteratorCallback));
        }
    }

    // a generic version of eachOf which can handle array, object, and iterator cases.
    var eachOfGeneric = doLimit(eachOfLimit, Infinity);

    /**
     * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
     * to the iteratee.
     *
     * @name eachOf
     * @static
     * @memberOf module:Collections
     * @method
     * @alias forEachOf
     * @category Collection
     * @see [async.each]{@link module:Collections.each}
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A function to apply to each
     * item in `coll`. The `key` is the item's key, or index in the case of an
     * array. The iteratee is passed a `callback(err)` which must be called once it
     * has completed. If no error has occurred, the callback should be run without
     * arguments or with an explicit `null` argument. Invoked with
     * (item, key, callback).
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     * @example
     *
     * var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
     * var configs = {};
     *
     * async.forEachOf(obj, function (value, key, callback) {
     *     fs.readFile(__dirname + value, "utf8", function (err, data) {
     *         if (err) return callback(err);
     *         try {
     *             configs[key] = JSON.parse(data);
     *         } catch (e) {
     *             return callback(e);
     *         }
     *         callback();
     *     });
     * }, function (err) {
     *     if (err) console.error(err.message);
     *     // configs is now a map of JSON data
     *     doSomethingWith(configs);
     * });
     */
    var eachOf = function (coll, iteratee, callback) {
        var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
        eachOfImplementation(coll, iteratee, callback);
    };

    function doParallel(fn) {
        return function (obj, iteratee, callback) {
            return fn(eachOf, obj, iteratee, callback);
        };
    }

    function _asyncMap(eachfn, arr, iteratee, callback) {
        callback = once(callback || noop);
        arr = arr || [];
        var results = [];
        var counter = 0;

        eachfn(arr, function (value, _, callback) {
            var index = counter++;
            iteratee(value, function (err, v) {
                results[index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    }

    /**
     * Produces a new collection of values by mapping each value in `coll` through
     * the `iteratee` function. The `iteratee` is called with an item from `coll`
     * and a callback for when it has finished processing. Each of these callback
     * takes 2 arguments: an `error`, and the transformed item from `coll`. If
     * `iteratee` passes an error to its callback, the main `callback` (for the
     * `map` function) is immediately called with the error.
     *
     * Note, that since this function applies the `iteratee` to each item in
     * parallel, there is no guarantee that the `iteratee` functions will complete
     * in order. However, the results array will be in the same order as the
     * original `coll`.
     *
     * If `map` is passed an Object, the results will be an Array.  The results
     * will roughly be in the order of the original Objects' keys (but this can
     * vary across JavaScript engines)
     *
     * @name map
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A function to apply to each item in `coll`.
     * The iteratee is passed a `callback(err, transformed)` which must be called
     * once it has completed with an error (which can be `null`) and a
     * transformed item. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Results is an Array of the
     * transformed items from the `coll`. Invoked with (err, results).
     * @example
     *
     * async.map(['file1','file2','file3'], fs.stat, function(err, results) {
     *     // results is now an array of stats for each file
     * });
     */
    var map = doParallel(_asyncMap);

    /**
     * Applies the provided arguments to each function in the array, calling
     * `callback` after all functions have completed. If you only provide the first
     * argument, `fns`, then it will return a function which lets you pass in the
     * arguments as if it were a single function call. If more arguments are
     * provided, `callback` is required while `args` is still optional.
     *
     * @name applyEach
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array|Iterable|Object} fns - A collection of asynchronous functions
     * to all call with the same arguments
     * @param {...*} [args] - any number of separate arguments to pass to the
     * function.
     * @param {Function} [callback] - the final argument should be the callback,
     * called when all functions have completed processing.
     * @returns {Function} - If only the first argument, `fns`, is provided, it will
     * return a function which lets you pass in the arguments as if it were a single
     * function call. The signature is `(..args, callback)`. If invoked with any
     * arguments, `callback` is required.
     * @example
     *
     * async.applyEach([enableSearch, updateSchema], 'bucket', callback);
     *
     * // partial application example:
     * async.each(
     *     buckets,
     *     async.applyEach([enableSearch, updateSchema]),
     *     callback
     * );
     */
    var applyEach = applyEach$1(map);

    function doParallelLimit(fn) {
        return function (obj, limit, iteratee, callback) {
            return fn(_eachOfLimit(limit), obj, iteratee, callback);
        };
    }

    /**
     * The same as [`map`]{@link module:Collections.map} but runs a maximum of `limit` async operations at a time.
     *
     * @name mapLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.map]{@link module:Collections.map}
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} iteratee - A function to apply to each item in `coll`.
     * The iteratee is passed a `callback(err, transformed)` which must be called
     * once it has completed with an error (which can be `null`) and a transformed
     * item. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Results is an array of the
     * transformed items from the `coll`. Invoked with (err, results).
     */
    var mapLimit = doParallelLimit(_asyncMap);

    /**
     * The same as [`map`]{@link module:Collections.map} but runs only a single async operation at a time.
     *
     * @name mapSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.map]{@link module:Collections.map}
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A function to apply to each item in `coll`.
     * The iteratee is passed a `callback(err, transformed)` which must be called
     * once it has completed with an error (which can be `null`) and a
     * transformed item. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Results is an array of the
     * transformed items from the `coll`. Invoked with (err, results).
     */
    var mapSeries = doLimit(mapLimit, 1);

    /**
     * The same as [`applyEach`]{@link module:ControlFlow.applyEach} but runs only a single async operation at a time.
     *
     * @name applyEachSeries
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.applyEach]{@link module:ControlFlow.applyEach}
     * @category Control Flow
     * @param {Array|Iterable|Object} fns - A collection of asynchronous functions to all
     * call with the same arguments
     * @param {...*} [args] - any number of separate arguments to pass to the
     * function.
     * @param {Function} [callback] - the final argument should be the callback,
     * called when all functions have completed processing.
     * @returns {Function} - If only the first argument is provided, it will return
     * a function which lets you pass in the arguments as if it were a single
     * function call.
     */
    var applyEachSeries = applyEach$1(mapSeries);

    /**
     * Creates a continuation function with some arguments already applied.
     *
     * Useful as a shorthand when combined with other control flow functions. Any
     * arguments passed to the returned function are added to the arguments
     * originally passed to apply.
     *
     * @name apply
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {Function} function - The function you want to eventually apply all
     * arguments to. Invokes with (arguments...).
     * @param {...*} arguments... - Any number of arguments to automatically apply
     * when the continuation is called.
     * @example
     *
     * // using apply
     * async.parallel([
     *     async.apply(fs.writeFile, 'testfile1', 'test1'),
     *     async.apply(fs.writeFile, 'testfile2', 'test2')
     * ]);
     *
     *
     * // the same process without using apply
     * async.parallel([
     *     function(callback) {
     *         fs.writeFile('testfile1', 'test1', callback);
     *     },
     *     function(callback) {
     *         fs.writeFile('testfile2', 'test2', callback);
     *     }
     * ]);
     *
     * // It's possible to pass any number of additional arguments when calling the
     * // continuation:
     *
     * node> var fn = async.apply(sys.puts, 'one');
     * node> fn('two', 'three');
     * one
     * two
     * three
     */
    var apply$2 = baseRest$1(function (fn, args) {
        return baseRest$1(function (callArgs) {
            return fn.apply(null, args.concat(callArgs));
        });
    });

    /**
     * Take a sync function and make it async, passing its return value to a
     * callback. This is useful for plugging sync functions into a waterfall,
     * series, or other async functions. Any arguments passed to the generated
     * function will be passed to the wrapped function (except for the final
     * callback argument). Errors thrown will be passed to the callback.
     *
     * If the function passed to `asyncify` returns a Promise, that promises's
     * resolved/rejected state will be used to call the callback, rather than simply
     * the synchronous return value.
     *
     * This also means you can asyncify ES2016 `async` functions.
     *
     * @name asyncify
     * @static
     * @memberOf module:Utils
     * @method
     * @alias wrapSync
     * @category Util
     * @param {Function} func - The synchronous function to convert to an
     * asynchronous function.
     * @returns {Function} An asynchronous wrapper of the `func`. To be invoked with
     * (callback).
     * @example
     *
     * // passing a regular synchronous function
     * async.waterfall([
     *     async.apply(fs.readFile, filename, "utf8"),
     *     async.asyncify(JSON.parse),
     *     function (data, next) {
     *         // data is the result of parsing the text.
     *         // If there was a parsing error, it would have been caught.
     *     }
     * ], callback);
     *
     * // passing a function returning a promise
     * async.waterfall([
     *     async.apply(fs.readFile, filename, "utf8"),
     *     async.asyncify(function (contents) {
     *         return db.model.create(contents);
     *     }),
     *     function (model, next) {
     *         // `model` is the instantiated model object.
     *         // If there was an error, this function would be skipped.
     *     }
     * ], callback);
     *
     * // es6 example
     * var q = async.queue(async.asyncify(async function(file) {
     *     var intermediateStep = await processFile(file);
     *     return await somePromise(intermediateStep)
     * }));
     *
     * q.push(files);
     */
    function asyncify(func) {
        return initialParams(function (args, callback) {
            var result;
            try {
                result = func.apply(this, args);
            } catch (e) {
                return callback(e);
            }
            // if result is Promise object
            if (isObject(result) && typeof result.then === 'function') {
                result.then(function (value) {
                    callback(null, value);
                }, function (err) {
                    callback(err.message ? err : new Error(err));
                });
            } else {
                callback(null, result);
            }
        });
    }

    /**
     * A specialized version of `_.forEach` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
        var index = -1,
            length = array ? array.length : 0;

        while (++index < length) {
            if (iteratee(array[index], index, array) === false) {
                break;
            }
        }
        return array;
    }

    /**
     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
        return function (object, iteratee, keysFunc) {
            var index = -1,
                iterable = Object(object),
                props = keysFunc(object),
                length = props.length;

            while (length--) {
                var key = props[fromRight ? length : ++index];
                if (iteratee(iterable[key], key, iterable) === false) {
                    break;
                }
            }
            return object;
        };
    }

    /**
     * The base implementation of `baseForOwn` which iterates over `object`
     * properties returned by `keysFunc` and invokes `iteratee` for each property.
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * The base implementation of `_.forOwn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
        return object && baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.findIndex` and `_.findLastIndex` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} predicate The function invoked per iteration.
     * @param {number} fromIndex The index to search from.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
        var length = array.length,
            index = fromIndex + (fromRight ? 1 : -1);

        while ((fromRight ? index-- : ++index < length)) {
            if (predicate(array[index], index, array)) {
                return index;
            }
        }
        return -1;
    }

    /**
     * The base implementation of `_.isNaN` without support for number objects.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     */
    function baseIsNaN(value) {
        return value !== value;
    }

    /**
     * A specialized version of `_.indexOf` which performs strict equality
     * comparisons of values, i.e. `===`.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function strictIndexOf(array, value, fromIndex) {
        var index = fromIndex - 1,
            length = array.length;

        while (++index < length) {
            if (array[index] === value) {
                return index;
            }
        }
        return -1;
    }

    /**
     * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseIndexOf(array, value, fromIndex) {
        return value === value ?
            strictIndexOf(array, value, fromIndex) :
            baseFindIndex(array, baseIsNaN, fromIndex);
    }

    /**
     * Determines the best order for running the functions in `tasks`, based on
     * their requirements. Each function can optionally depend on other functions
     * being completed first, and each function is run as soon as its requirements
     * are satisfied.
     *
     * If any of the functions pass an error to their callback, the `auto` sequence
     * will stop. Further tasks will not execute (so any other functions depending
     * on it will not run), and the main `callback` is immediately called with the
     * error.
     *
     * Functions also receive an object containing the results of functions which
     * have completed so far as the first argument, if they have dependencies. If a
     * task function has no dependencies, it will only be passed a callback.
     *
     * @name auto
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Object} tasks - An object. Each of its properties is either a
     * function or an array of requirements, with the function itself the last item
     * in the array. The object's key of a property serves as the name of the task
     * defined by that property, i.e. can be used when specifying requirements for
     * other tasks. The function receives one or two arguments:
     * * a `results` object, containing the results of the previously executed
     *   functions, only passed if the task has any dependencies,
     * * a `callback(err, result)` function, which must be called when finished,
     *   passing an `error` (which can be `null`) and the result of the function's
     *   execution.
     * @param {number} [concurrency=Infinity] - An optional `integer` for
     * determining the maximum number of tasks that can be run in parallel. By
     * default, as many as possible.
     * @param {Function} [callback] - An optional callback which is called when all
     * the tasks have been completed. It receives the `err` argument if any `tasks`
     * pass an error to their callback. Results are always returned; however, if an
     * error occurs, no further `tasks` will be performed, and the results object
     * will only contain partial results. Invoked with (err, results).
     * @returns undefined
     * @example
     *
     * async.auto({
     *     // this function will just be passed a callback
     *     readData: async.apply(fs.readFile, 'data.txt', 'utf-8'),
     *     showData: ['readData', function(results, cb) {
     *         // results.readData is the file's contents
     *         // ...
     *     }]
     * }, callback);
     *
     * async.auto({
     *     get_data: function(callback) {
     *         console.log('in get_data');
     *         // async code to get some data
     *         callback(null, 'data', 'converted to array');
     *     },
     *     make_folder: function(callback) {
     *         console.log('in make_folder');
     *         // async code to create a directory to store a file in
     *         // this is run at the same time as getting the data
     *         callback(null, 'folder');
     *     },
     *     write_file: ['get_data', 'make_folder', function(results, callback) {
     *         console.log('in write_file', JSON.stringify(results));
     *         // once there is some data and the directory exists,
     *         // write the data to a file in the directory
     *         callback(null, 'filename');
     *     }],
     *     email_link: ['write_file', function(results, callback) {
     *         console.log('in email_link', JSON.stringify(results));
     *         // once the file is written let's email a link to it...
     *         // results.write_file contains the filename returned by write_file.
     *         callback(null, {'file':results.write_file, 'email':'user@example.com'});
     *     }]
     * }, function(err, results) {
     *     console.log('err = ', err);
     *     console.log('results = ', results);
     * });
     */
    var auto = function (tasks, concurrency, callback) {
        if (typeof concurrency === 'function') {
            // concurrency is optional, shift the args.
            callback = concurrency;
            concurrency = null;
        }
        callback = once(callback || noop);
        var keys$$1 = keys(tasks);
        var numTasks = keys$$1.length;
        if (!numTasks) {
            return callback(null);
        }
        if (!concurrency) {
            concurrency = numTasks;
        }

        var results = {};
        var runningTasks = 0;
        var hasError = false;

        var listeners = {};

        var readyTasks = [];

        // for cycle detection:
        var readyToCheck = []; // tasks that have been identified as reachable
        // without the possibility of returning to an ancestor task
        var uncheckedDependencies = {};

        baseForOwn(tasks, function (task, key) {
            if (!isArray(task)) {
                // no dependencies
                enqueueTask(key, [task]);
                readyToCheck.push(key);
                return;
            }

            var dependencies = task.slice(0, task.length - 1);
            var remainingDependencies = dependencies.length;
            if (remainingDependencies === 0) {
                enqueueTask(key, task);
                readyToCheck.push(key);
                return;
            }
            uncheckedDependencies[key] = remainingDependencies;

            arrayEach(dependencies, function (dependencyName) {
                if (!tasks[dependencyName]) {
                    throw new Error('async.auto task `' + key + '` has a non-existent dependency in ' + dependencies.join(', '));
                }
                addListener(dependencyName, function () {
                    remainingDependencies--;
                    if (remainingDependencies === 0) {
                        enqueueTask(key, task);
                    }
                });
            });
        });

        checkForDeadlocks();
        processQueue();

        function enqueueTask(key, task) {
            readyTasks.push(function () {
                runTask(key, task);
            });
        }

        function processQueue() {
            if (readyTasks.length === 0 && runningTasks === 0) {
                return callback(null, results);
            }
            while (readyTasks.length && runningTasks < concurrency) {
                var run = readyTasks.shift();
                run();
            }
        }

        function addListener(taskName, fn) {
            var taskListeners = listeners[taskName];
            if (!taskListeners) {
                taskListeners = listeners[taskName] = [];
            }

            taskListeners.push(fn);
        }

        function taskComplete(taskName) {
            var taskListeners = listeners[taskName] || [];
            arrayEach(taskListeners, function (fn) {
                fn();
            });
            processQueue();
        }

        function runTask(key, task) {
            if (hasError) return;

            var taskCallback = onlyOnce(baseRest$1(function (err, args) {
                runningTasks--;
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    baseForOwn(results, function (val, rkey) {
                        safeResults[rkey] = val;
                    });
                    safeResults[key] = args;
                    hasError = true;
                    listeners = [];

                    callback(err, safeResults);
                } else {
                    results[key] = args;
                    taskComplete(key);
                }
            }));

            runningTasks++;
            var taskFn = task[task.length - 1];
            if (task.length > 1) {
                taskFn(results, taskCallback);
            } else {
                taskFn(taskCallback);
            }
        }

        function checkForDeadlocks() {
            // Kahn's algorithm
            // https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
            // http://connalle.blogspot.com/2013/10/topological-sortingkahn-algorithm.html
            var currentTask;
            var counter = 0;
            while (readyToCheck.length) {
                currentTask = readyToCheck.pop();
                counter++;
                arrayEach(getDependents(currentTask), function (dependent) {
                    if (--uncheckedDependencies[dependent] === 0) {
                        readyToCheck.push(dependent);
                    }
                });
            }

            if (counter !== numTasks) {
                throw new Error('async.auto cannot execute tasks due to a recursive dependency');
            }
        }

        function getDependents(taskName) {
            var result = [];
            baseForOwn(tasks, function (task, key) {
                if (isArray(task) && baseIndexOf(task, taskName, 0) >= 0) {
                    result.push(key);
                }
            });
            return result;
        }
    };

    /**
     * A specialized version of `_.map` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
        var index = -1,
            length = array ? array.length : 0,
            result = Array(length);

        while (++index < length) {
            result[index] = iteratee(array[index], index, array);
        }
        return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
        var index = -1,
            length = source.length;

        array || (array = Array(length));
        while (++index < length) {
            array[index] = source[index];
        }
        return array;
    }

    /** Built-in value references. */
    var Symbol$1 = root.Symbol;

    /** `Object#toString` result references. */
    var symbolTag = '[object Symbol]';

    /** Used for built-in method references. */
    var objectProto$8 = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString$3 = objectProto$8.toString;

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
            (isObjectLike(value) && objectToString$3.call(value) == symbolTag);
    }

    /** Used as references for various `Number` constants. */
    var INFINITY = 1 / 0;

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined;
    var symbolToString = symbolProto ? symbolProto.toString : undefined;

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
        // Exit early for strings to avoid a performance hit in some environments.
        if (typeof value == 'string') {
            return value;
        }
        if (isArray(value)) {
            // Recursively convert values (susceptible to call stack limits).
            return arrayMap(value, baseToString) + '';
        }
        if (isSymbol(value)) {
            return symbolToString ? symbolToString.call(value) : '';
        }
        var result = (value + '');
        return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
        var index = -1,
            length = array.length;

        if (start < 0) {
            start = -start > length ? 0 : (length + start);
        }
        end = end > length ? length : end;
        if (end < 0) {
            end += length;
        }
        length = start > end ? 0 : ((end - start) >>> 0);
        start >>>= 0;

        var result = Array(length);
        while (++index < length) {
            result[index] = array[index + start];
        }
        return result;
    }

    /**
     * Casts `array` to a slice if it's needed.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {number} start The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the cast slice.
     */
    function castSlice(array, start, end) {
        var length = array.length;
        end = end === undefined ? length : end;
        return (!start && end >= length) ? array : baseSlice(array, start, end);
    }

    /**
     * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
     * that is not found in the character symbols.
     *
     * @private
     * @param {Array} strSymbols The string symbols to inspect.
     * @param {Array} chrSymbols The character symbols to find.
     * @returns {number} Returns the index of the last unmatched string symbol.
     */
    function charsEndIndex(strSymbols, chrSymbols) {
        var index = strSymbols.length;

        while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
        return index;
    }

    /**
     * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
     * that is not found in the character symbols.
     *
     * @private
     * @param {Array} strSymbols The string symbols to inspect.
     * @param {Array} chrSymbols The character symbols to find.
     * @returns {number} Returns the index of the first unmatched string symbol.
     */
    function charsStartIndex(strSymbols, chrSymbols) {
        var index = -1,
            length = strSymbols.length;

        while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
        return index;
    }

    /**
     * Converts an ASCII `string` to an array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the converted array.
     */
    function asciiToArray(string) {
        return string.split('');
    }

    /** Used to compose unicode character classes. */
    var rsAstralRange = '\\ud800-\\udfff';
    var rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23';
    var rsComboSymbolsRange = '\\u20d0-\\u20f0';
    var rsVarRange = '\\ufe0e\\ufe0f';

    /** Used to compose unicode capture groups. */
    var rsZWJ = '\\u200d';

    /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
    var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

    /**
     * Checks if `string` contains Unicode symbols.
     *
     * @private
     * @param {string} string The string to inspect.
     * @returns {boolean} Returns `true` if a symbol is found, else `false`.
     */
    function hasUnicode(string) {
        return reHasUnicode.test(string);
    }

    /** Used to compose unicode character classes. */
    var rsAstralRange$1 = '\\ud800-\\udfff';
    var rsComboMarksRange$1 = '\\u0300-\\u036f\\ufe20-\\ufe23';
    var rsComboSymbolsRange$1 = '\\u20d0-\\u20f0';
    var rsVarRange$1 = '\\ufe0e\\ufe0f';

    /** Used to compose unicode capture groups. */
    var rsAstral = '[' + rsAstralRange$1 + ']';
    var rsCombo = '[' + rsComboMarksRange$1 + rsComboSymbolsRange$1 + ']';
    var rsFitz = '\\ud83c[\\udffb-\\udfff]';
    var rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
    var rsNonAstral = '[^' + rsAstralRange$1 + ']';
    var rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
    var rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
    var rsZWJ$1 = '\\u200d';

    /** Used to compose unicode regexes. */
    var reOptMod = rsModifier + '?';
    var rsOptVar = '[' + rsVarRange$1 + ']?';
    var rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*';
    var rsSeq = rsOptVar + reOptMod + rsOptJoin;
    var rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

    /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
    var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

    /**
     * Converts a Unicode `string` to an array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the converted array.
     */
    function unicodeToArray(string) {
        return string.match(reUnicode) || [];
    }

    /**
     * Converts `string` to an array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the converted array.
     */
    function stringToArray(string) {
        return hasUnicode(string) ?
            unicodeToArray(string) :
            asciiToArray(string);
    }

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
        return value == null ? '' : baseToString(value);
    }

    /** Used to match leading and trailing whitespace. */
    var reTrim = /^\s+|\s+$/g;

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined)) {
            return string.replace(reTrim, '');
        }
        if (!string || !(chars = baseToString(chars))) {
            return string;
        }
        var strSymbols = stringToArray(string),
            chrSymbols = stringToArray(chars),
            start = charsStartIndex(strSymbols, chrSymbols),
            end = charsEndIndex(strSymbols, chrSymbols) + 1;

        return castSlice(strSymbols, start, end).join('');
    }

    var FN_ARGS = /^(function)?\s*[^\(]*\(\s*([^\)]*)\)/m;
    var FN_ARG_SPLIT = /,/;
    var FN_ARG = /(=.+)?(\s*)$/;
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

    function parseParams(func) {
        func = func.toString().replace(STRIP_COMMENTS, '');
        func = func.match(FN_ARGS)[2].replace(' ', '');
        func = func ? func.split(FN_ARG_SPLIT) : [];
        func = func.map(function (arg) {
            return trim(arg.replace(FN_ARG, ''));
        });
        return func;
    }

    /**
     * A dependency-injected version of the [async.auto]{@link module:ControlFlow.auto} function. Dependent
     * tasks are specified as parameters to the function, after the usual callback
     * parameter, with the parameter names matching the names of the tasks it
     * depends on. This can provide even more readable task graphs which can be
     * easier to maintain.
     *
     * If a final callback is specified, the task results are similarly injected,
     * specified as named parameters after the initial error parameter.
     *
     * The autoInject function is purely syntactic sugar and its semantics are
     * otherwise equivalent to [async.auto]{@link module:ControlFlow.auto}.
     *
     * @name autoInject
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.auto]{@link module:ControlFlow.auto}
     * @category Control Flow
     * @param {Object} tasks - An object, each of whose properties is a function of
     * the form 'func([dependencies...], callback). The object's key of a property
     * serves as the name of the task defined by that property, i.e. can be used
     * when specifying requirements for other tasks.
     * * The `callback` parameter is a `callback(err, result)` which must be called
     *   when finished, passing an `error` (which can be `null`) and the result of
     *   the function's execution. The remaining parameters name other tasks on
     *   which the task is dependent, and the results from those tasks are the
     *   arguments of those parameters.
     * @param {Function} [callback] - An optional callback which is called when all
     * the tasks have been completed. It receives the `err` argument if any `tasks`
     * pass an error to their callback, and a `results` object with any completed
     * task results, similar to `auto`.
     * @example
     *
     * //  The example from `auto` can be rewritten as follows:
     * async.autoInject({
     *     get_data: function(callback) {
     *         // async code to get some data
     *         callback(null, 'data', 'converted to array');
     *     },
     *     make_folder: function(callback) {
     *         // async code to create a directory to store a file in
     *         // this is run at the same time as getting the data
     *         callback(null, 'folder');
     *     },
     *     write_file: function(get_data, make_folder, callback) {
     *         // once there is some data and the directory exists,
     *         // write the data to a file in the directory
     *         callback(null, 'filename');
     *     },
     *     email_link: function(write_file, callback) {
     *         // once the file is written let's email a link to it...
     *         // write_file contains the filename returned by write_file.
     *         callback(null, {'file':write_file, 'email':'user@example.com'});
     *     }
     * }, function(err, results) {
     *     console.log('err = ', err);
     *     console.log('email_link = ', results.email_link);
     * });
     *
     * // If you are using a JS minifier that mangles parameter names, `autoInject`
     * // will not work with plain functions, since the parameter names will be
     * // collapsed to a single letter identifier.  To work around this, you can
     * // explicitly specify the names of the parameters your task function needs
     * // in an array, similar to Angular.js dependency injection.
     *
     * // This still has an advantage over plain `auto`, since the results a task
     * // depends on are still spread into arguments.
     * async.autoInject({
     *     //...
     *     write_file: ['get_data', 'make_folder', function(get_data, make_folder, callback) {
     *         callback(null, 'filename');
     *     }],
     *     email_link: ['write_file', function(write_file, callback) {
     *         callback(null, {'file':write_file, 'email':'user@example.com'});
     *     }]
     *     //...
     * }, function(err, results) {
     *     console.log('err = ', err);
     *     console.log('email_link = ', results.email_link);
     * });
     */
    function autoInject(tasks, callback) {
        var newTasks = {};

        baseForOwn(tasks, function (taskFn, key) {
            var params;

            if (isArray(taskFn)) {
                params = copyArray(taskFn);
                taskFn = params.pop();

                newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
            } else if (taskFn.length === 1) {
                // no dependencies, use the function as-is
                newTasks[key] = taskFn;
            } else {
                params = parseParams(taskFn);
                if (taskFn.length === 0 && params.length === 0) {
                    throw new Error("autoInject task functions require explicit parameters.");
                }

                params.pop();

                newTasks[key] = params.concat(newTask);
            }

            function newTask(results, taskCb) {
                var newArgs = arrayMap(params, function (name) {
                    return results[name];
                });
                newArgs.push(taskCb);
                taskFn.apply(null, newArgs);
            }
        });

        auto(newTasks, callback);
    }

    var hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
    var hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

    function fallback(fn) {
        setTimeout(fn, 0);
    }

    function wrap(defer) {
        return baseRest$1(function (fn, args) {
            defer(function () {
                fn.apply(null, args);
            });
        });
    }

    var _defer;

    if (hasSetImmediate) {
        _defer = setImmediate;
    } else if (hasNextTick) {
        _defer = process.nextTick;
    } else {
        _defer = fallback;
    }

    var setImmediate$1 = wrap(_defer);

    // Simple doubly linked list (https://en.wikipedia.org/wiki/Doubly_linked_list) implementation
    // used for queues. This implementation assumes that the node provided by the user can be modified
    // to adjust the next and last properties. We implement only the minimal functionality
    // for queue support.
    function DLL() {
        this.head = this.tail = null;
        this.length = 0;
    }

    function setInitial(dll, node) {
        dll.length = 1;
        dll.head = dll.tail = node;
    }

    DLL.prototype.removeLink = function (node) {
        if (node.prev) node.prev.next = node.next;
        else this.head = node.next;
        if (node.next) node.next.prev = node.prev;
        else this.tail = node.prev;

        node.prev = node.next = null;
        this.length -= 1;
        return node;
    };

    DLL.prototype.empty = DLL;

    DLL.prototype.insertAfter = function (node, newNode) {
        newNode.prev = node;
        newNode.next = node.next;
        if (node.next) node.next.prev = newNode;
        else this.tail = newNode;
        node.next = newNode;
        this.length += 1;
    };

    DLL.prototype.insertBefore = function (node, newNode) {
        newNode.prev = node.prev;
        newNode.next = node;
        if (node.prev) node.prev.next = newNode;
        else this.head = newNode;
        node.prev = newNode;
        this.length += 1;
    };

    DLL.prototype.unshift = function (node) {
        if (this.head) this.insertBefore(this.head, node);
        else setInitial(this, node);
    };

    DLL.prototype.push = function (node) {
        if (this.tail) this.insertAfter(this.tail, node);
        else setInitial(this, node);
    };

    DLL.prototype.shift = function () {
        return this.head && this.removeLink(this.head);
    };

    DLL.prototype.pop = function () {
        return this.tail && this.removeLink(this.tail);
    };

    function queue(worker, concurrency, payload) {
        if (concurrency == null) {
            concurrency = 1;
        } else if (concurrency === 0) {
            throw new Error('Concurrency must not be zero');
        }

        function _insert(data, insertAtFront, callback) {
            if (callback != null && typeof callback !== 'function') {
                throw new Error('task callback must be a function');
            }
            q.started = true;
            if (!isArray(data)) {
                data = [data];
            }
            if (data.length === 0 && q.idle()) {
                // call drain immediately if there are no tasks
                return setImmediate$1(function () {
                    q.drain();
                });
            }

            for (var i = 0, l = data.length; i < l; i++) {
                var item = {
                    data: data[i],
                    callback: callback || noop
                };

                if (insertAtFront) {
                    q._tasks.unshift(item);
                } else {
                    q._tasks.push(item);
                }
            }
            setImmediate$1(q.process);
        }

        function _next(tasks) {
            return baseRest$1(function (args) {
                workers -= 1;

                for (var i = 0, l = tasks.length; i < l; i++) {
                    var task = tasks[i];
                    var index = baseIndexOf(workersList, task, 0);
                    if (index >= 0) {
                        workersList.splice(index);
                    }

                    task.callback.apply(task, args);

                    if (args[0] != null) {
                        q.error(args[0], task.data);
                    }
                }

                if (workers <= q.concurrency - q.buffer) {
                    q.unsaturated();
                }

                if (q.idle()) {
                    q.drain();
                }
                q.process();
            });
        }

        var workers = 0;
        var workersList = [];
        var q = {
            _tasks: new DLL(),
            concurrency: concurrency,
            payload: payload,
            saturated: noop,
            unsaturated: noop,
            buffer: concurrency / 4,
            empty: noop,
            drain: noop,
            error: noop,
            started: false,
            paused: false,
            push: function (data, callback) {
                _insert(data, false, callback);
            },
            kill: function () {
                q.drain = noop;
                q._tasks.empty();
            },
            unshift: function (data, callback) {
                _insert(data, true, callback);
            },
            process: function () {
                while (!q.paused && workers < q.concurrency && q._tasks.length) {
                    var tasks = [],
                        data = [];
                    var l = q._tasks.length;
                    if (q.payload) l = Math.min(l, q.payload);
                    for (var i = 0; i < l; i++) {
                        var node = q._tasks.shift();
                        tasks.push(node);
                        data.push(node.data);
                    }

                    if (q._tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    workersList.push(tasks[0]);

                    if (workers === q.concurrency) {
                        q.saturated();
                    }

                    var cb = onlyOnce(_next(tasks));
                    worker(data, cb);
                }
            },
            length: function () {
                return q._tasks.length;
            },
            running: function () {
                return workers;
            },
            workersList: function () {
                return workersList;
            },
            idle: function () {
                return q._tasks.length + workers === 0;
            },
            pause: function () {
                q.paused = true;
            },
            resume: function () {
                if (q.paused === false) {
                    return;
                }
                q.paused = false;
                var resumeCount = Math.min(q.concurrency, q._tasks.length);
                // Need to call q.process once per concurrent
                // worker to preserve full concurrency after pause
                for (var w = 1; w <= resumeCount; w++) {
                    setImmediate$1(q.process);
                }
            }
        };
        return q;
    }

    /**
     * A cargo of tasks for the worker function to complete. Cargo inherits all of
     * the same methods and event callbacks as [`queue`]{@link module:ControlFlow.queue}.
     * @typedef {Object} CargoObject
     * @memberOf module:ControlFlow
     * @property {Function} length - A function returning the number of items
     * waiting to be processed. Invoke like `cargo.length()`.
     * @property {number} payload - An `integer` for determining how many tasks
     * should be process per round. This property can be changed after a `cargo` is
     * created to alter the payload on-the-fly.
     * @property {Function} push - Adds `task` to the `queue`. The callback is
     * called once the `worker` has finished processing the task. Instead of a
     * single task, an array of `tasks` can be submitted. The respective callback is
     * used for every task in the list. Invoke like `cargo.push(task, [callback])`.
     * @property {Function} saturated - A callback that is called when the
     * `queue.length()` hits the concurrency and further tasks will be queued.
     * @property {Function} empty - A callback that is called when the last item
     * from the `queue` is given to a `worker`.
     * @property {Function} drain - A callback that is called when the last item
     * from the `queue` has returned from the `worker`.
     * @property {Function} idle - a function returning false if there are items
     * waiting or being processed, or true if not. Invoke like `cargo.idle()`.
     * @property {Function} pause - a function that pauses the processing of tasks
     * until `resume()` is called. Invoke like `cargo.pause()`.
     * @property {Function} resume - a function that resumes the processing of
     * queued tasks when the queue is paused. Invoke like `cargo.resume()`.
     * @property {Function} kill - a function that removes the `drain` callback and
     * empties remaining tasks from the queue forcing it to go idle. Invoke like `cargo.kill()`.
     */

    /**
     * Creates a `cargo` object with the specified payload. Tasks added to the
     * cargo will be processed altogether (up to the `payload` limit). If the
     * `worker` is in progress, the task is queued until it becomes available. Once
     * the `worker` has completed some tasks, each callback of those tasks is
     * called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
     * for how `cargo` and `queue` work.
     *
     * While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
     * at a time, cargo passes an array of tasks to a single worker, repeating
     * when the worker is finished.
     *
     * @name cargo
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.queue]{@link module:ControlFlow.queue}
     * @category Control Flow
     * @param {Function} worker - An asynchronous function for processing an array
     * of queued tasks, which must call its `callback(err)` argument when finished,
     * with an optional `err` argument. Invoked with `(tasks, callback)`.
     * @param {number} [payload=Infinity] - An optional `integer` for determining
     * how many tasks should be processed per round; if omitted, the default is
     * unlimited.
     * @returns {module:ControlFlow.CargoObject} A cargo object to manage the tasks. Callbacks can
     * attached as certain properties to listen for specific events during the
     * lifecycle of the cargo and inner queue.
     * @example
     *
     * // create a cargo object with payload 2
     * var cargo = async.cargo(function(tasks, callback) {
     *     for (var i=0; i<tasks.length; i++) {
     *         console.log('hello ' + tasks[i].name);
     *     }
     *     callback();
     * }, 2);
     *
     * // add some items
     * cargo.push({name: 'foo'}, function(err) {
     *     console.log('finished processing foo');
     * });
     * cargo.push({name: 'bar'}, function(err) {
     *     console.log('finished processing bar');
     * });
     * cargo.push({name: 'baz'}, function(err) {
     *     console.log('finished processing baz');
     * });
     */
    function cargo(worker, payload) {
        return queue(worker, 1, payload);
    }

    /**
     * The same as [`eachOf`]{@link module:Collections.eachOf} but runs only a single async operation at a time.
     *
     * @name eachOfSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.eachOf]{@link module:Collections.eachOf}
     * @alias forEachOfSeries
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A function to apply to each item in `coll`. The
     * `key` is the item's key, or index in the case of an array. The iteratee is
     * passed a `callback(err)` which must be called once it has completed. If no
     * error has occurred, the callback should be run without arguments or with an
     * explicit `null` argument. Invoked with (item, key, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Invoked with (err).
     */
    var eachOfSeries = doLimit(eachOfLimit, 1);

    /**
     * Reduces `coll` into a single value using an async `iteratee` to return each
     * successive step. `memo` is the initial state of the reduction. This function
     * only operates in series.
     *
     * For performance reasons, it may make sense to split a call to this function
     * into a parallel map, and then use the normal `Array.prototype.reduce` on the
     * results. This function is for situations where each step in the reduction
     * needs to be async; if you can get the data before reducing it, then it's
     * probably a good idea to do so.
     *
     * @name reduce
     * @static
     * @memberOf module:Collections
     * @method
     * @alias inject
     * @alias foldl
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {*} memo - The initial state of the reduction.
     * @param {Function} iteratee - A function applied to each item in the
     * array to produce the next step in the reduction. The `iteratee` is passed a
     * `callback(err, reduction)` which accepts an optional error as its first
     * argument, and the state of the reduction as the second. If an error is
     * passed to the callback, the reduction is stopped and the main `callback` is
     * immediately called with the error. Invoked with (memo, item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result is the reduced value. Invoked with
     * (err, result).
     * @example
     *
     * async.reduce([1,2,3], 0, function(memo, item, callback) {
     *     // pointless async:
     *     process.nextTick(function() {
     *         callback(null, memo + item)
     *     });
     * }, function(err, result) {
     *     // result is now equal to the last value of memo, which is 6
     * });
     */
    function reduce(coll, memo, iteratee, callback) {
        callback = once(callback || noop);
        eachOfSeries(coll, function (x, i, callback) {
            iteratee(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    }

    /**
     * Version of the compose function that is more natural to read. Each function
     * consumes the return value of the previous function. It is the equivalent of
     * [compose]{@link module:ControlFlow.compose} with the arguments reversed.
     *
     * Each function is executed with the `this` binding of the composed function.
     *
     * @name seq
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.compose]{@link module:ControlFlow.compose}
     * @category Control Flow
     * @param {...Function} functions - the asynchronous functions to compose
     * @returns {Function} a function that composes the `functions` in order
     * @example
     *
     * // Requires lodash (or underscore), express3 and dresende's orm2.
     * // Part of an app, that fetches cats of the logged user.
     * // This example uses `seq` function to avoid overnesting and error
     * // handling clutter.
     * app.get('/cats', function(request, response) {
     *     var User = request.models.User;
     *     async.seq(
     *         _.bind(User.get, User),  // 'User.get' has signature (id, callback(err, data))
     *         function(user, fn) {
     *             user.getCats(fn);      // 'getCats' has signature (callback(err, data))
     *         }
     *     )(req.session.user_id, function (err, cats) {
     *         if (err) {
     *             console.error(err);
     *             response.json({ status: 'error', message: err.message });
     *         } else {
     *             response.json({ status: 'ok', message: 'Cats found', data: cats });
     *         }
     *     });
     * });
     */
    var seq$1 = baseRest$1(function seq(functions) {
        return baseRest$1(function (args) {
            var that = this;

            var cb = args[args.length - 1];
            if (typeof cb == 'function') {
                args.pop();
            } else {
                cb = noop;
            }

            reduce(functions, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([baseRest$1(function (err, nextargs) {
                    cb(err, nextargs);
                })]));
            }, function (err, results) {
                cb.apply(that, [err].concat(results));
            });
        });
    });

    /**
     * Creates a function which is a composition of the passed asynchronous
     * functions. Each function consumes the return value of the function that
     * follows. Composing functions `f()`, `g()`, and `h()` would produce the result
     * of `f(g(h()))`, only this version uses callbacks to obtain the return values.
     *
     * Each function is executed with the `this` binding of the composed function.
     *
     * @name compose
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {...Function} functions - the asynchronous functions to compose
     * @returns {Function} an asynchronous function that is the composed
     * asynchronous `functions`
     * @example
     *
     * function add1(n, callback) {
     *     setTimeout(function () {
     *         callback(null, n + 1);
     *     }, 10);
     * }
     *
     * function mul3(n, callback) {
     *     setTimeout(function () {
     *         callback(null, n * 3);
     *     }, 10);
     * }
     *
     * var add1mul3 = async.compose(mul3, add1);
     * add1mul3(4, function (err, result) {
     *     // result now equals 15
     * });
     */
    var compose = baseRest$1(function (args) {
        return seq$1.apply(null, args.reverse());
    });

    function concat$1(eachfn, arr, fn, callback) {
        var result = [];
        eachfn(arr, function (x, index, cb) {
            fn(x, function (err, y) {
                result = result.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, result);
        });
    }

    /**
     * Applies `iteratee` to each item in `coll`, concatenating the results. Returns
     * the concatenated list. The `iteratee`s are called in parallel, and the
     * results are concatenated as they return. There is no guarantee that the
     * results array will be returned in the original order of `coll` passed to the
     * `iteratee` function.
     *
     * @name concat
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A function to apply to each item in `coll`.
     * The iteratee is passed a `callback(err, results)` which must be called once
     * it has completed with an error (which can be `null`) and an array of results.
     * Invoked with (item, callback).
     * @param {Function} [callback(err)] - A callback which is called after all the
     * `iteratee` functions have finished, or an error occurs. Results is an array
     * containing the concatenated results of the `iteratee` function. Invoked with
     * (err, results).
     * @example
     *
     * async.concat(['dir1','dir2','dir3'], fs.readdir, function(err, files) {
     *     // files is now a list of filenames that exist in the 3 directories
     * });
     */
    var concat = doParallel(concat$1);

    function doSeries(fn) {
        return function (obj, iteratee, callback) {
            return fn(eachOfSeries, obj, iteratee, callback);
        };
    }

    /**
     * The same as [`concat`]{@link module:Collections.concat} but runs only a single async operation at a time.
     *
     * @name concatSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.concat]{@link module:Collections.concat}
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A function to apply to each item in `coll`.
     * The iteratee is passed a `callback(err, results)` which must be called once
     * it has completed with an error (which can be `null`) and an array of results.
     * Invoked with (item, callback).
     * @param {Function} [callback(err)] - A callback which is called after all the
     * `iteratee` functions have finished, or an error occurs. Results is an array
     * containing the concatenated results of the `iteratee` function. Invoked with
     * (err, results).
     */
    var concatSeries = doSeries(concat$1);

    /**
     * Returns a function that when called, calls-back with the values provided.
     * Useful as the first function in a [`waterfall`]{@link module:ControlFlow.waterfall}, or for plugging values in to
     * [`auto`]{@link module:ControlFlow.auto}.
     *
     * @name constant
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {...*} arguments... - Any number of arguments to automatically invoke
     * callback with.
     * @returns {Function} Returns a function that when invoked, automatically
     * invokes the callback with the previous given arguments.
     * @example
     *
     * async.waterfall([
     *     async.constant(42),
     *     function (value, next) {
     *         // value === 42
     *     },
     *     //...
     * ], callback);
     *
     * async.waterfall([
     *     async.constant(filename, "utf8"),
     *     fs.readFile,
     *     function (fileData, next) {
     *         //...
     *     }
     *     //...
     * ], callback);
     *
     * async.auto({
     *     hostname: async.constant("https://server.net/"),
     *     port: findFreePort,
     *     launchServer: ["hostname", "port", function (options, cb) {
     *         startServer(options, cb);
     *     }],
     *     //...
     * }, callback);
     */
    var constant$2 = baseRest$1(function (values) {
        var args = [null].concat(values);
        return initialParams(function (ignoredArgs, callback) {
            return callback.apply(this, args);
        });
    });

    function _createTester(eachfn, check, getResult) {
        return function (arr, limit, iteratee, cb) {
            function done() {
                if (cb) {
                    cb(null, getResult(false));
                }
            }

            function wrappedIteratee(x, _, callback) {
                if (!cb) return callback();
                iteratee(x, function (err, v) {
                    // Check cb as another iteratee may have resolved with a
                    // value or error since we started this iteratee
                    if (cb && (err || check(v))) {
                        if (err) cb(err);
                        else cb(err, getResult(true, x));
                        cb = iteratee = false;
                        callback(err, breakLoop);
                    } else {
                        callback();
                    }
                });
            }
            if (arguments.length > 3) {
                cb = cb || noop;
                eachfn(arr, limit, wrappedIteratee, done);
            } else {
                cb = iteratee;
                cb = cb || noop;
                iteratee = limit;
                eachfn(arr, wrappedIteratee, done);
            }
        };
    }

    function _findGetResult(v, x) {
        return x;
    }

    /**
     * Returns the first value in `coll` that passes an async truth test. The
     * `iteratee` is applied in parallel, meaning the first iteratee to return
     * `true` will fire the detect `callback` with that result. That means the
     * result might not be the first item in the original `coll` (in terms of order)
     * that passes the test.

     * If order within the original `coll` is important, then look at
     * [`detectSeries`]{@link module:Collections.detectSeries}.
     *
     * @name detect
     * @static
     * @memberOf module:Collections
     * @method
     * @alias find
     * @category Collections
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
     * The iteratee is passed a `callback(err, truthValue)` which must be called
     * with a boolean argument once it has completed. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the `iteratee` functions have finished.
     * Result will be the first item in the array that passes the truth test
     * (iteratee) or the value `undefined` if none passed. Invoked with
     * (err, result).
     * @example
     *
     * async.detect(['file1','file2','file3'], function(filePath, callback) {
     *     fs.access(filePath, function(err) {
     *         callback(null, !err)
     *     });
     * }, function(err, result) {
     *     // result now equals the first file in the list that exists
     * });
     */
    var detect = _createTester(eachOf, identity, _findGetResult);

    /**
     * The same as [`detect`]{@link module:Collections.detect} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name detectLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.detect]{@link module:Collections.detect}
     * @alias findLimit
     * @category Collections
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
     * The iteratee is passed a `callback(err, truthValue)` which must be called
     * with a boolean argument once it has completed. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the `iteratee` functions have finished.
     * Result will be the first item in the array that passes the truth test
     * (iteratee) or the value `undefined` if none passed. Invoked with
     * (err, result).
     */
    var detectLimit = _createTester(eachOfLimit, identity, _findGetResult);

    /**
     * The same as [`detect`]{@link module:Collections.detect} but runs only a single async operation at a time.
     *
     * @name detectSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.detect]{@link module:Collections.detect}
     * @alias findSeries
     * @category Collections
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
     * The iteratee is passed a `callback(err, truthValue)` which must be called
     * with a boolean argument once it has completed. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the `iteratee` functions have finished.
     * Result will be the first item in the array that passes the truth test
     * (iteratee) or the value `undefined` if none passed. Invoked with
     * (err, result).
     */
    var detectSeries = _createTester(eachOfSeries, identity, _findGetResult);

    function consoleFunc(name) {
        return baseRest$1(function (fn, args) {
            fn.apply(null, args.concat([baseRest$1(function (err, args) {
                if (typeof console === 'object') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    } else if (console[name]) {
                        arrayEach(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            })]));
        });
    }

    /**
     * Logs the result of an `async` function to the `console` using `console.dir`
     * to display the properties of the resulting object. Only works in Node.js or
     * in browsers that support `console.dir` and `console.error` (such as FF and
     * Chrome). If multiple arguments are returned from the async function,
     * `console.dir` is called on each argument in order.
     *
     * @name dir
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {Function} function - The function you want to eventually apply all
     * arguments to.
     * @param {...*} arguments... - Any number of arguments to apply to the function.
     * @example
     *
     * // in a module
     * var hello = function(name, callback) {
     *     setTimeout(function() {
     *         callback(null, {hello: name});
     *     }, 1000);
     * };
     *
     * // in the node repl
     * node> async.dir(hello, 'world');
     * {hello: 'world'}
     */
    var dir = consoleFunc('dir');

    /**
     * The post-check version of [`during`]{@link module:ControlFlow.during}. To reflect the difference in
     * the order of operations, the arguments `test` and `fn` are switched.
     *
     * Also a version of [`doWhilst`]{@link module:ControlFlow.doWhilst} with asynchronous `test` function.
     * @name doDuring
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.during]{@link module:ControlFlow.during}
     * @category Control Flow
     * @param {Function} fn - A function which is called each time `test` passes.
     * The function is passed a `callback(err)`, which must be called once it has
     * completed with an optional `err` argument. Invoked with (callback).
     * @param {Function} test - asynchronous truth test to perform before each
     * execution of `fn`. Invoked with (...args, callback), where `...args` are the
     * non-error args from the previous callback of `fn`.
     * @param {Function} [callback] - A callback which is called after the test
     * function has failed and repeated execution of `fn` has stopped. `callback`
     * will be passed an error if one occured, otherwise `null`.
     */
    function doDuring(fn, test, callback) {
        callback = onlyOnce(callback || noop);

        var next = baseRest$1(function (err, args) {
            if (err) return callback(err);
            args.push(check);
            test.apply(this, args);
        });

        function check(err, truth) {
            if (err) return callback(err);
            if (!truth) return callback(null);
            fn(next);
        }

        check(null, true);
    }

    /**
     * The post-check version of [`whilst`]{@link module:ControlFlow.whilst}. To reflect the difference in
     * the order of operations, the arguments `test` and `iteratee` are switched.
     *
     * `doWhilst` is to `whilst` as `do while` is to `while` in plain JavaScript.
     *
     * @name doWhilst
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.whilst]{@link module:ControlFlow.whilst}
     * @category Control Flow
     * @param {Function} iteratee - A function which is called each time `test`
     * passes. The function is passed a `callback(err)`, which must be called once
     * it has completed with an optional `err` argument. Invoked with (callback).
     * @param {Function} test - synchronous truth test to perform after each
     * execution of `iteratee`. Invoked with the non-error callback results of
     * `iteratee`.
     * @param {Function} [callback] - A callback which is called after the test
     * function has failed and repeated execution of `iteratee` has stopped.
     * `callback` will be passed an error and any arguments passed to the final
     * `iteratee`'s callback. Invoked with (err, [results]);
     */
    function doWhilst(iteratee, test, callback) {
        callback = onlyOnce(callback || noop);
        var next = baseRest$1(function (err, args) {
            if (err) return callback(err);
            if (test.apply(this, args)) return iteratee(next);
            callback.apply(null, [null].concat(args));
        });
        iteratee(next);
    }

    /**
     * Like ['doWhilst']{@link module:ControlFlow.doWhilst}, except the `test` is inverted. Note the
     * argument ordering differs from `until`.
     *
     * @name doUntil
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.doWhilst]{@link module:ControlFlow.doWhilst}
     * @category Control Flow
     * @param {Function} fn - A function which is called each time `test` fails.
     * The function is passed a `callback(err)`, which must be called once it has
     * completed with an optional `err` argument. Invoked with (callback).
     * @param {Function} test - synchronous truth test to perform after each
     * execution of `fn`. Invoked with the non-error callback results of `fn`.
     * @param {Function} [callback] - A callback which is called after the test
     * function has passed and repeated execution of `fn` has stopped. `callback`
     * will be passed an error and any arguments passed to the final `fn`'s
     * callback. Invoked with (err, [results]);
     */
    function doUntil(fn, test, callback) {
        doWhilst(fn, function () {
            return !test.apply(this, arguments);
        }, callback);
    }

    /**
     * Like [`whilst`]{@link module:ControlFlow.whilst}, except the `test` is an asynchronous function that
     * is passed a callback in the form of `function (err, truth)`. If error is
     * passed to `test` or `fn`, the main callback is immediately called with the
     * value of the error.
     *
     * @name during
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.whilst]{@link module:ControlFlow.whilst}
     * @category Control Flow
     * @param {Function} test - asynchronous truth test to perform before each
     * execution of `fn`. Invoked with (callback).
     * @param {Function} fn - A function which is called each time `test` passes.
     * The function is passed a `callback(err)`, which must be called once it has
     * completed with an optional `err` argument. Invoked with (callback).
     * @param {Function} [callback] - A callback which is called after the test
     * function has failed and repeated execution of `fn` has stopped. `callback`
     * will be passed an error, if one occured, otherwise `null`.
     * @example
     *
     * var count = 0;
     *
     * async.during(
     *     function (callback) {
     *         return callback(null, count < 5);
     *     },
     *     function (callback) {
     *         count++;
     *         setTimeout(callback, 1000);
     *     },
     *     function (err) {
     *         // 5 seconds have passed
     *     }
     * );
     */
    function during(test, fn, callback) {
        callback = onlyOnce(callback || noop);

        function next(err) {
            if (err) return callback(err);
            test(check);
        }

        function check(err, truth) {
            if (err) return callback(err);
            if (!truth) return callback(null);
            fn(next);
        }

        test(check);
    }

    function _withoutIndex(iteratee) {
        return function (value, index, callback) {
            return iteratee(value, callback);
        };
    }

    /**
     * Applies the function `iteratee` to each item in `coll`, in parallel.
     * The `iteratee` is called with an item from the list, and a callback for when
     * it has finished. If the `iteratee` passes an error to its `callback`, the
     * main `callback` (for the `each` function) is immediately called with the
     * error.
     *
     * Note, that since this function applies `iteratee` to each item in parallel,
     * there is no guarantee that the iteratee functions will complete in order.
     *
     * @name each
     * @static
     * @memberOf module:Collections
     * @method
     * @alias forEach
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A function to apply to each item
     * in `coll`. The iteratee is passed a `callback(err)` which must be called once
     * it has completed. If no error has occurred, the `callback` should be run
     * without arguments or with an explicit `null` argument. The array index is not
     * passed to the iteratee. Invoked with (item, callback). If you need the index,
     * use `eachOf`.
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     * @example
     *
     * // assuming openFiles is an array of file names and saveFile is a function
     * // to save the modified contents of that file:
     *
     * async.each(openFiles, saveFile, function(err){
     *   // if any of the saves produced an error, err would equal that error
     * });
     *
     * // assuming openFiles is an array of file names
     * async.each(openFiles, function(file, callback) {
     *
     *     // Perform operation on file here.
     *     console.log('Processing file ' + file);
     *
     *     if( file.length > 32 ) {
     *       console.log('This file name is too long');
     *       callback('File name too long');
     *     } else {
     *       // Do work to process file here
     *       console.log('File processed');
     *       callback();
     *     }
     * }, function(err) {
     *     // if any of the file processing produced an error, err would equal that error
     *     if( err ) {
     *       // One of the iterations produced an error.
     *       // All processing will now stop.
     *       console.log('A file failed to process');
     *     } else {
     *       console.log('All files have been processed successfully');
     *     }
     * });
     */
    function eachLimit(coll, iteratee, callback) {
        eachOf(coll, _withoutIndex(iteratee), callback);
    }

    /**
     * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
     *
     * @name eachLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.each]{@link module:Collections.each}
     * @alias forEachLimit
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} iteratee - A function to apply to each item in `coll`. The
     * iteratee is passed a `callback(err)` which must be called once it has
     * completed. If no error has occurred, the `callback` should be run without
     * arguments or with an explicit `null` argument. The array index is not passed
     * to the iteratee. Invoked with (item, callback). If you need the index, use
     * `eachOfLimit`.
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     */
    function eachLimit$1(coll, limit, iteratee, callback) {
        _eachOfLimit(limit)(coll, _withoutIndex(iteratee), callback);
    }

    /**
     * The same as [`each`]{@link module:Collections.each} but runs only a single async operation at a time.
     *
     * @name eachSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.each]{@link module:Collections.each}
     * @alias forEachSeries
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A function to apply to each
     * item in `coll`. The iteratee is passed a `callback(err)` which must be called
     * once it has completed. If no error has occurred, the `callback` should be run
     * without arguments or with an explicit `null` argument. The array index is
     * not passed to the iteratee. Invoked with (item, callback). If you need the
     * index, use `eachOfSeries`.
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     */
    var eachSeries = doLimit(eachLimit$1, 1);

    /**
     * Wrap an async function and ensure it calls its callback on a later tick of
     * the event loop.  If the function already calls its callback on a next tick,
     * no extra deferral is added. This is useful for preventing stack overflows
     * (`RangeError: Maximum call stack size exceeded`) and generally keeping
     * [Zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony)
     * contained.
     *
     * @name ensureAsync
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {Function} fn - an async function, one that expects a node-style
     * callback as its last argument.
     * @returns {Function} Returns a wrapped function with the exact same call
     * signature as the function passed in.
     * @example
     *
     * function sometimesAsync(arg, callback) {
     *     if (cache[arg]) {
     *         return callback(null, cache[arg]); // this would be synchronous!!
     *     } else {
     *         doSomeIO(arg, callback); // this IO would be asynchronous
     *     }
     * }
     *
     * // this has a risk of stack overflows if many results are cached in a row
     * async.mapSeries(args, sometimesAsync, done);
     *
     * // this will defer sometimesAsync's callback if necessary,
     * // preventing stack overflows
     * async.mapSeries(args, async.ensureAsync(sometimesAsync), done);
     */
    function ensureAsync(fn) {
        return initialParams(function (args, callback) {
            var sync = true;
            args.push(function () {
                var innerArgs = arguments;
                if (sync) {
                    setImmediate$1(function () {
                        callback.apply(null, innerArgs);
                    });
                } else {
                    callback.apply(null, innerArgs);
                }
            });
            fn.apply(this, args);
            sync = false;
        });
    }

    function notId(v) {
        return !v;
    }

    /**
     * Returns `true` if every element in `coll` satisfies an async test. If any
     * iteratee call returns `false`, the main `callback` is immediately called.
     *
     * @name every
     * @static
     * @memberOf module:Collections
     * @method
     * @alias all
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A truth test to apply to each item in the
     * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
     * which must be called with a  boolean argument once it has completed. Invoked
     * with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result will be either `true` or `false`
     * depending on the values of the async tests. Invoked with (err, result).
     * @example
     *
     * async.every(['file1','file2','file3'], function(filePath, callback) {
     *     fs.access(filePath, function(err) {
     *         callback(null, !err)
     *     });
     * }, function(err, result) {
     *     // if result is true then every file exists
     * });
     */
    var every = _createTester(eachOf, notId, notId);

    /**
     * The same as [`every`]{@link module:Collections.every} but runs a maximum of `limit` async operations at a time.
     *
     * @name everyLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.every]{@link module:Collections.every}
     * @alias allLimit
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} iteratee - A truth test to apply to each item in the
     * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
     * which must be called with a  boolean argument once it has completed. Invoked
     * with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result will be either `true` or `false`
     * depending on the values of the async tests. Invoked with (err, result).
     */
    var everyLimit = _createTester(eachOfLimit, notId, notId);

    /**
     * The same as [`every`]{@link module:Collections.every} but runs only a single async operation at a time.
     *
     * @name everySeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.every]{@link module:Collections.every}
     * @alias allSeries
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A truth test to apply to each item in the
     * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
     * which must be called with a  boolean argument once it has completed. Invoked
     * with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result will be either `true` or `false`
     * depending on the values of the async tests. Invoked with (err, result).
     */
    var everySeries = doLimit(everyLimit, 1);

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function baseProperty(key) {
        return function (object) {
            return object == null ? undefined : object[key];
        };
    }

    function _filter(eachfn, arr, iteratee, callback) {
        callback = once(callback || noop);
        var results = [];
        eachfn(arr, function (x, index, callback) {
            iteratee(x, function (err, v) {
                if (err) {
                    callback(err);
                } else {
                    if (v) {
                        results.push({
                            index: index,
                            value: x
                        });
                    }
                    callback();
                }
            });
        }, function (err) {
            if (err) {
                callback(err);
            } else {
                callback(null, arrayMap(results.sort(function (a, b) {
                    return a.index - b.index;
                }), baseProperty('value')));
            }
        });
    }

    /**
     * Returns a new array of all the values in `coll` which pass an async truth
     * test. This operation is performed in parallel, but the results array will be
     * in the same order as the original.
     *
     * @name filter
     * @static
     * @memberOf module:Collections
     * @method
     * @alias select
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
     * with a boolean argument once it has completed. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results).
     * @example
     *
     * async.filter(['file1','file2','file3'], function(filePath, callback) {
     *     fs.access(filePath, function(err) {
     *         callback(null, !err)
     *     });
     * }, function(err, results) {
     *     // results now equals an array of the existing files
     * });
     */
    var filter = doParallel(_filter);

    /**
     * The same as [`filter`]{@link module:Collections.filter} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name filterLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.filter]{@link module:Collections.filter}
     * @alias selectLimit
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
     * with a boolean argument once it has completed. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results).
     */
    var filterLimit = doParallelLimit(_filter);

    /**
     * The same as [`filter`]{@link module:Collections.filter} but runs only a single async operation at a time.
     *
     * @name filterSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.filter]{@link module:Collections.filter}
     * @alias selectSeries
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
     * with a boolean argument once it has completed. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results)
     */
    var filterSeries = doLimit(filterLimit, 1);

    /**
     * Calls the asynchronous function `fn` with a callback parameter that allows it
     * to call itself again, in series, indefinitely.

     * If an error is passed to the
     * callback then `errback` is called with the error, and execution stops,
     * otherwise it will never be called.
     *
     * @name forever
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Function} fn - a function to call repeatedly. Invoked with (next).
     * @param {Function} [errback] - when `fn` passes an error to it's callback,
     * this function will be called, and execution stops. Invoked with (err).
     * @example
     *
     * async.forever(
     *     function(next) {
     *         // next is suitable for passing to things that need a callback(err [, whatever]);
     *         // it will result in this function being called again.
     *     },
     *     function(err) {
     *         // if next is called with a value in its first parameter, it will appear
     *         // in here as 'err', and execution will stop.
     *     }
     * );
     */
    function forever(fn, errback) {
        var done = onlyOnce(errback || noop);
        var task = ensureAsync(fn);

        function next(err) {
            if (err) return done(err);
            task(next);
        }
        next();
    }

    /**
     * Logs the result of an `async` function to the `console`. Only works in
     * Node.js or in browsers that support `console.log` and `console.error` (such
     * as FF and Chrome). If multiple arguments are returned from the async
     * function, `console.log` is called on each argument in order.
     *
     * @name log
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {Function} function - The function you want to eventually apply all
     * arguments to.
     * @param {...*} arguments... - Any number of arguments to apply to the function.
     * @example
     *
     * // in a module
     * var hello = function(name, callback) {
     *     setTimeout(function() {
     *         callback(null, 'hello ' + name);
     *     }, 1000);
     * };
     *
     * // in the node repl
     * node> async.log(hello, 'world');
     * 'hello world'
     */
    var log = consoleFunc('log');

    /**
     * The same as [`mapValues`]{@link module:Collections.mapValues} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name mapValuesLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.mapValues]{@link module:Collections.mapValues}
     * @category Collection
     * @param {Object} obj - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} iteratee - A function to apply to each value in `obj`.
     * The iteratee is passed a `callback(err, transformed)` which must be called
     * once it has completed with an error (which can be `null`) and a
     * transformed value. Invoked with (value, key, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. `result` is a new object consisting
     * of each key from `obj`, with each transformed value on the right-hand side.
     * Invoked with (err, result).
     */
    function mapValuesLimit(obj, limit, iteratee, callback) {
        callback = once(callback || noop);
        var newObj = {};
        eachOfLimit(obj, limit, function (val, key, next) {
            iteratee(val, key, function (err, result) {
                if (err) return next(err);
                newObj[key] = result;
                next();
            });
        }, function (err) {
            callback(err, newObj);
        });
    }

    /**
     * A relative of [`map`]{@link module:Collections.map}, designed for use with objects.
     *
     * Produces a new Object by mapping each value of `obj` through the `iteratee`
     * function. The `iteratee` is called each `value` and `key` from `obj` and a
     * callback for when it has finished processing. Each of these callbacks takes
     * two arguments: an `error`, and the transformed item from `obj`. If `iteratee`
     * passes an error to its callback, the main `callback` (for the `mapValues`
     * function) is immediately called with the error.
     *
     * Note, the order of the keys in the result is not guaranteed.  The keys will
     * be roughly in the order they complete, (but this is very engine-specific)
     *
     * @name mapValues
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @param {Object} obj - A collection to iterate over.
     * @param {Function} iteratee - A function to apply to each value and key in
     * `coll`. The iteratee is passed a `callback(err, transformed)` which must be
     * called once it has completed with an error (which can be `null`) and a
     * transformed value. Invoked with (value, key, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. `result` is a new object consisting
     * of each key from `obj`, with each transformed value on the right-hand side.
     * Invoked with (err, result).
     * @example
     *
     * async.mapValues({
     *     f1: 'file1',
     *     f2: 'file2',
     *     f3: 'file3'
     * }, function (file, key, callback) {
     *   fs.stat(file, callback);
     * }, function(err, result) {
     *     // result is now a map of stats for each file, e.g.
     *     // {
     *     //     f1: [stats for file1],
     *     //     f2: [stats for file2],
     *     //     f3: [stats for file3]
     *     // }
     * });
     */

    var mapValues = doLimit(mapValuesLimit, Infinity);

    /**
     * The same as [`mapValues`]{@link module:Collections.mapValues} but runs only a single async operation at a time.
     *
     * @name mapValuesSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.mapValues]{@link module:Collections.mapValues}
     * @category Collection
     * @param {Object} obj - A collection to iterate over.
     * @param {Function} iteratee - A function to apply to each value in `obj`.
     * The iteratee is passed a `callback(err, transformed)` which must be called
     * once it has completed with an error (which can be `null`) and a
     * transformed value. Invoked with (value, key, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. `result` is a new object consisting
     * of each key from `obj`, with each transformed value on the right-hand side.
     * Invoked with (err, result).
     */
    var mapValuesSeries = doLimit(mapValuesLimit, 1);

    function has(obj, key) {
        return key in obj;
    }

    /**
     * Caches the results of an `async` function. When creating a hash to store
     * function results against, the callback is omitted from the hash and an
     * optional hash function can be used.
     *
     * If no hash function is specified, the first argument is used as a hash key,
     * which may work reasonably if it is a string or a data type that converts to a
     * distinct string. Note that objects and arrays will not behave reasonably.
     * Neither will cases where the other arguments are significant. In such cases,
     * specify your own hash function.
     *
     * The cache of results is exposed as the `memo` property of the function
     * returned by `memoize`.
     *
     * @name memoize
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {Function} fn - The function to proxy and cache results from.
     * @param {Function} hasher - An optional function for generating a custom hash
     * for storing results. It has all the arguments applied to it apart from the
     * callback, and must be synchronous.
     * @returns {Function} a memoized version of `fn`
     * @example
     *
     * var slow_fn = function(name, callback) {
     *     // do something
     *     callback(null, result);
     * };
     * var fn = async.memoize(slow_fn);
     *
     * // fn can now be used as if it were slow_fn
     * fn('some name', function() {
     *     // callback
     * });
     */
    function memoize(fn, hasher) {
        var memo = Object.create(null);
        var queues = Object.create(null);
        hasher = hasher || identity;
        var memoized = initialParams(function memoized(args, callback) {
            var key = hasher.apply(null, args);
            if (has(memo, key)) {
                setImmediate$1(function () {
                    callback.apply(null, memo[key]);
                });
            } else if (has(queues, key)) {
                queues[key].push(callback);
            } else {
                queues[key] = [callback];
                fn.apply(null, args.concat([baseRest$1(function (args) {
                    memo[key] = args;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                        q[i].apply(null, args);
                    }
                })]));
            }
        });
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    }

    /**
     * Calls `callback` on a later loop around the event loop. In Node.js this just
     * calls `setImmediate`.  In the browser it will use `setImmediate` if
     * available, otherwise `setTimeout(callback, 0)`, which means other higher
     * priority events may precede the execution of `callback`.
     *
     * This is used internally for browser-compatibility purposes.
     *
     * @name nextTick
     * @static
     * @memberOf module:Utils
     * @method
     * @alias setImmediate
     * @category Util
     * @param {Function} callback - The function to call on a later loop around
     * the event loop. Invoked with (args...).
     * @param {...*} args... - any number of additional arguments to pass to the
     * callback on the next tick.
     * @example
     *
     * var call_order = [];
     * async.nextTick(function() {
     *     call_order.push('two');
     *     // call_order now equals ['one','two']
     * });
     * call_order.push('one');
     *
     * async.setImmediate(function (a, b, c) {
     *     // a, b, and c equal 1, 2, and 3
     * }, 1, 2, 3);
     */
    var _defer$1;

    if (hasNextTick) {
        _defer$1 = process.nextTick;
    } else if (hasSetImmediate) {
        _defer$1 = setImmediate;
    } else {
        _defer$1 = fallback;
    }

    var nextTick = wrap(_defer$1);

    function _parallel(eachfn, tasks, callback) {
        callback = callback || noop;
        var results = isArrayLike(tasks) ? [] : {};

        eachfn(tasks, function (task, key, callback) {
            task(baseRest$1(function (err, args) {
                if (args.length <= 1) {
                    args = args[0];
                }
                results[key] = args;
                callback(err);
            }));
        }, function (err) {
            callback(err, results);
        });
    }

    /**
     * Run the `tasks` collection of functions in parallel, without waiting until
     * the previous function has completed. If any of the functions pass an error to
     * its callback, the main `callback` is immediately called with the value of the
     * error. Once the `tasks` have completed, the results are passed to the final
     * `callback` as an array.
     *
     * **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
     * parallel execution of code.  If your tasks do not use any timers or perform
     * any I/O, they will actually be executed in series.  Any synchronous setup
     * sections for each task will happen one after the other.  JavaScript remains
     * single-threaded.
     *
     * It is also possible to use an object instead of an array. Each property will
     * be run as a function and the results will be passed to the final `callback`
     * as an object instead of an array. This can be a more readable way of handling
     * results from {@link async.parallel}.
     *
     * @name parallel
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array|Iterable|Object} tasks - A collection containing functions to run.
     * Each function is passed a `callback(err, result)` which it must call on
     * completion with an error `err` (which can be `null`) and an optional `result`
     * value.
     * @param {Function} [callback] - An optional callback to run once all the
     * functions have completed successfully. This function gets a results array
     * (or object) containing all the result arguments passed to the task callbacks.
     * Invoked with (err, results).
     * @example
     * async.parallel([
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ],
     * // optional callback
     * function(err, results) {
     *     // the results array will equal ['one','two'] even though
     *     // the second function had a shorter timeout.
     * });
     *
     * // an example using an object instead of an array
     * async.parallel({
     *     one: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 1);
     *         }, 200);
     *     },
     *     two: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 2);
     *         }, 100);
     *     }
     * }, function(err, results) {
     *     // results is now equals to: {one: 1, two: 2}
     * });
     */
    function parallelLimit(tasks, callback) {
        _parallel(eachOf, tasks, callback);
    }

    /**
     * The same as [`parallel`]{@link module:ControlFlow.parallel} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name parallelLimit
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.parallel]{@link module:ControlFlow.parallel}
     * @category Control Flow
     * @param {Array|Collection} tasks - A collection containing functions to run.
     * Each function is passed a `callback(err, result)` which it must call on
     * completion with an error `err` (which can be `null`) and an optional `result`
     * value.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} [callback] - An optional callback to run once all the
     * functions have completed successfully. This function gets a results array
     * (or object) containing all the result arguments passed to the task callbacks.
     * Invoked with (err, results).
     */
    function parallelLimit$1(tasks, limit, callback) {
        _parallel(_eachOfLimit(limit), tasks, callback);
    }

    /**
     * A queue of tasks for the worker function to complete.
     * @typedef {Object} QueueObject
     * @memberOf module:ControlFlow
     * @property {Function} length - a function returning the number of items
     * waiting to be processed. Invoke with `queue.length()`.
     * @property {boolean} started - a boolean indicating whether or not any
     * items have been pushed and processed by the queue.
     * @property {Function} running - a function returning the number of items
     * currently being processed. Invoke with `queue.running()`.
     * @property {Function} workersList - a function returning the array of items
     * currently being processed. Invoke with `queue.workersList()`.
     * @property {Function} idle - a function returning false if there are items
     * waiting or being processed, or true if not. Invoke with `queue.idle()`.
     * @property {number} concurrency - an integer for determining how many `worker`
     * functions should be run in parallel. This property can be changed after a
     * `queue` is created to alter the concurrency on-the-fly.
     * @property {Function} push - add a new task to the `queue`. Calls `callback`
     * once the `worker` has finished processing the task. Instead of a single task,
     * a `tasks` array can be submitted. The respective callback is used for every
     * task in the list. Invoke with `queue.push(task, [callback])`,
     * @property {Function} unshift - add a new task to the front of the `queue`.
     * Invoke with `queue.unshift(task, [callback])`.
     * @property {Function} saturated - a callback that is called when the number of
     * running workers hits the `concurrency` limit, and further tasks will be
     * queued.
     * @property {Function} unsaturated - a callback that is called when the number
     * of running workers is less than the `concurrency` & `buffer` limits, and
     * further tasks will not be queued.
     * @property {number} buffer - A minimum threshold buffer in order to say that
     * the `queue` is `unsaturated`.
     * @property {Function} empty - a callback that is called when the last item
     * from the `queue` is given to a `worker`.
     * @property {Function} drain - a callback that is called when the last item
     * from the `queue` has returned from the `worker`.
     * @property {Function} error - a callback that is called when a task errors.
     * Has the signature `function(error, task)`.
     * @property {boolean} paused - a boolean for determining whether the queue is
     * in a paused state.
     * @property {Function} pause - a function that pauses the processing of tasks
     * until `resume()` is called. Invoke with `queue.pause()`.
     * @property {Function} resume - a function that resumes the processing of
     * queued tasks when the queue is paused. Invoke with `queue.resume()`.
     * @property {Function} kill - a function that removes the `drain` callback and
     * empties remaining tasks from the queue forcing it to go idle. Invoke with `queue.kill()`.
     */

    /**
     * Creates a `queue` object with the specified `concurrency`. Tasks added to the
     * `queue` are processed in parallel (up to the `concurrency` limit). If all
     * `worker`s are in progress, the task is queued until one becomes available.
     * Once a `worker` completes a `task`, that `task`'s callback is called.
     *
     * @name queue
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Function} worker - An asynchronous function for processing a queued
     * task, which must call its `callback(err)` argument when finished, with an
     * optional `error` as an argument.  If you want to handle errors from an
     * individual task, pass a callback to `q.push()`. Invoked with
     * (task, callback).
     * @param {number} [concurrency=1] - An `integer` for determining how many
     * `worker` functions should be run in parallel.  If omitted, the concurrency
     * defaults to `1`.  If the concurrency is `0`, an error is thrown.
     * @returns {module:ControlFlow.QueueObject} A queue object to manage the tasks. Callbacks can
     * attached as certain properties to listen for specific events during the
     * lifecycle of the queue.
     * @example
     *
     * // create a queue object with concurrency 2
     * var q = async.queue(function(task, callback) {
     *     console.log('hello ' + task.name);
     *     callback();
     * }, 2);
     *
     * // assign a callback
     * q.drain = function() {
     *     console.log('all items have been processed');
     * };
     *
     * // add some items to the queue
     * q.push({name: 'foo'}, function(err) {
     *     console.log('finished processing foo');
     * });
     * q.push({name: 'bar'}, function (err) {
     *     console.log('finished processing bar');
     * });
     *
     * // add some items to the queue (batch-wise)
     * q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
     *     console.log('finished processing item');
     * });
     *
     * // add some items to the front of the queue
     * q.unshift({name: 'bar'}, function (err) {
     *     console.log('finished processing bar');
     * });
     */
    var queue$1 = function (worker, concurrency) {
        return queue(function (items, cb) {
            worker(items[0], cb);
        }, concurrency, 1);
    };

    /**
     * The same as [async.queue]{@link module:ControlFlow.queue} only tasks are assigned a priority and
     * completed in ascending priority order.
     *
     * @name priorityQueue
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.queue]{@link module:ControlFlow.queue}
     * @category Control Flow
     * @param {Function} worker - An asynchronous function for processing a queued
     * task, which must call its `callback(err)` argument when finished, with an
     * optional `error` as an argument.  If you want to handle errors from an
     * individual task, pass a callback to `q.push()`. Invoked with
     * (task, callback).
     * @param {number} concurrency - An `integer` for determining how many `worker`
     * functions should be run in parallel.  If omitted, the concurrency defaults to
     * `1`.  If the concurrency is `0`, an error is thrown.
     * @returns {module:ControlFlow.QueueObject} A priorityQueue object to manage the tasks. There are two
     * differences between `queue` and `priorityQueue` objects:
     * * `push(task, priority, [callback])` - `priority` should be a number. If an
     *   array of `tasks` is given, all tasks will be assigned the same priority.
     * * The `unshift` method was removed.
     */
    var priorityQueue = function (worker, concurrency) {
        // Start with a normal queue
        var q = queue$1(worker, concurrency);

        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
            if (callback == null) callback = noop;
            if (typeof callback !== 'function') {
                throw new Error('task callback must be a function');
            }
            q.started = true;
            if (!isArray(data)) {
                data = [data];
            }
            if (data.length === 0) {
                // call drain immediately if there are no tasks
                return setImmediate$1(function () {
                    q.drain();
                });
            }

            priority = priority || 0;
            var nextNode = q._tasks.head;
            while (nextNode && priority >= nextNode.priority) {
                nextNode = nextNode.next;
            }

            for (var i = 0, l = data.length; i < l; i++) {
                var item = {
                    data: data[i],
                    priority: priority,
                    callback: callback
                };

                if (nextNode) {
                    q._tasks.insertBefore(nextNode, item);
                } else {
                    q._tasks.push(item);
                }
            }
            setImmediate$1(q.process);
        };

        // Remove unshift function
        delete q.unshift;

        return q;
    };

    /**
     * Runs the `tasks` array of functions in parallel, without waiting until the
     * previous function has completed. Once any of the `tasks` complete or pass an
     * error to its callback, the main `callback` is immediately called. It's
     * equivalent to `Promise.race()`.
     *
     * @name race
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array} tasks - An array containing functions to run. Each function
     * is passed a `callback(err, result)` which it must call on completion with an
     * error `err` (which can be `null`) and an optional `result` value.
     * @param {Function} callback - A callback to run once any of the functions have
     * completed. This function gets an error or result from the first function that
     * completed. Invoked with (err, result).
     * @returns undefined
     * @example
     *
     * async.race([
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ],
     * // main callback
     * function(err, result) {
     *     // the result will be equal to 'two' as it finishes earlier
     * });
     */
    function race(tasks, callback) {
        callback = once(callback || noop);
        if (!isArray(tasks)) return callback(new TypeError('First argument to race must be an array of functions'));
        if (!tasks.length) return callback();
        for (var i = 0, l = tasks.length; i < l; i++) {
            tasks[i](callback);
        }
    }

    var slice = Array.prototype.slice;

    /**
     * Same as [`reduce`]{@link module:Collections.reduce}, only operates on `array` in reverse order.
     *
     * @name reduceRight
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.reduce]{@link module:Collections.reduce}
     * @alias foldr
     * @category Collection
     * @param {Array} array - A collection to iterate over.
     * @param {*} memo - The initial state of the reduction.
     * @param {Function} iteratee - A function applied to each item in the
     * array to produce the next step in the reduction. The `iteratee` is passed a
     * `callback(err, reduction)` which accepts an optional error as its first
     * argument, and the state of the reduction as the second. If an error is
     * passed to the callback, the reduction is stopped and the main `callback` is
     * immediately called with the error. Invoked with (memo, item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result is the reduced value. Invoked with
     * (err, result).
     */
    function reduceRight(array, memo, iteratee, callback) {
        var reversed = slice.call(array).reverse();
        reduce(reversed, memo, iteratee, callback);
    }

    /**
     * Wraps the function in another function that always returns data even when it
     * errors.
     *
     * The object returned has either the property `error` or `value`.
     *
     * @name reflect
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {Function} fn - The function you want to wrap
     * @returns {Function} - A function that always passes null to it's callback as
     * the error. The second argument to the callback will be an `object` with
     * either an `error` or a `value` property.
     * @example
     *
     * async.parallel([
     *     async.reflect(function(callback) {
     *         // do some stuff ...
     *         callback(null, 'one');
     *     }),
     *     async.reflect(function(callback) {
     *         // do some more stuff but error ...
     *         callback('bad stuff happened');
     *     }),
     *     async.reflect(function(callback) {
     *         // do some more stuff ...
     *         callback(null, 'two');
     *     })
     * ],
     * // optional callback
     * function(err, results) {
     *     // values
     *     // results[0].value = 'one'
     *     // results[1].error = 'bad stuff happened'
     *     // results[2].value = 'two'
     * });
     */
    function reflect(fn) {
        return initialParams(function reflectOn(args, reflectCallback) {
            args.push(baseRest$1(function callback(err, cbArgs) {
                if (err) {
                    reflectCallback(null, {
                        error: err
                    });
                } else {
                    var value = null;
                    if (cbArgs.length === 1) {
                        value = cbArgs[0];
                    } else if (cbArgs.length > 1) {
                        value = cbArgs;
                    }
                    reflectCallback(null, {
                        value: value
                    });
                }
            }));

            return fn.apply(this, args);
        });
    }

    function reject$1(eachfn, arr, iteratee, callback) {
        _filter(eachfn, arr, function (value, cb) {
            iteratee(value, function (err, v) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, !v);
                }
            });
        }, callback);
    }

    /**
     * The opposite of [`filter`]{@link module:Collections.filter}. Removes values that pass an `async` truth test.
     *
     * @name reject
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.filter]{@link module:Collections.filter}
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
     * with a boolean argument once it has completed. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results).
     * @example
     *
     * async.reject(['file1','file2','file3'], function(filePath, callback) {
     *     fs.access(filePath, function(err) {
     *         callback(null, !err)
     *     });
     * }, function(err, results) {
     *     // results now equals an array of missing files
     *     createFiles(results);
     * });
     */
    var reject = doParallel(reject$1);

    /**
     * A helper function that wraps an array or an object of functions with reflect.
     *
     * @name reflectAll
     * @static
     * @memberOf module:Utils
     * @method
     * @see [async.reflect]{@link module:Utils.reflect}
     * @category Util
     * @param {Array} tasks - The array of functions to wrap in `async.reflect`.
     * @returns {Array} Returns an array of functions, each function wrapped in
     * `async.reflect`
     * @example
     *
     * let tasks = [
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         // do some more stuff but error ...
     *         callback(new Error('bad stuff happened'));
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ];
     *
     * async.parallel(async.reflectAll(tasks),
     * // optional callback
     * function(err, results) {
     *     // values
     *     // results[0].value = 'one'
     *     // results[1].error = Error('bad stuff happened')
     *     // results[2].value = 'two'
     * });
     *
     * // an example using an object instead of an array
     * let tasks = {
     *     one: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     two: function(callback) {
     *         callback('two');
     *     },
     *     three: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'three');
     *         }, 100);
     *     }
     * };
     *
     * async.parallel(async.reflectAll(tasks),
     * // optional callback
     * function(err, results) {
     *     // values
     *     // results.one.value = 'one'
     *     // results.two.error = 'two'
     *     // results.three.value = 'three'
     * });
     */
    function reflectAll(tasks) {
        var results;
        if (isArray(tasks)) {
            results = arrayMap(tasks, reflect);
        } else {
            results = {};
            baseForOwn(tasks, function (task, key) {
                results[key] = reflect.call(this, task);
            });
        }
        return results;
    }

    /**
     * The same as [`reject`]{@link module:Collections.reject} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name rejectLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.reject]{@link module:Collections.reject}
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
     * with a boolean argument once it has completed. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results).
     */
    var rejectLimit = doParallelLimit(reject$1);

    /**
     * The same as [`reject`]{@link module:Collections.reject} but runs only a single async operation at a time.
     *
     * @name rejectSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.reject]{@link module:Collections.reject}
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
     * with a boolean argument once it has completed. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results).
     */
    var rejectSeries = doLimit(rejectLimit, 1);

    /**
     * Attempts to get a successful response from `task` no more than `times` times
     * before returning an error. If the task is successful, the `callback` will be
     * passed the result of the successful task. If all attempts fail, the callback
     * will be passed the error and result (if any) of the final attempt.
     *
     * @name retry
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - Can be either an
     * object with `times` and `interval` or a number.
     * * `times` - The number of attempts to make before giving up.  The default
     *   is `5`.
     * * `interval` - The time to wait between retries, in milliseconds.  The
     *   default is `0`. The interval may also be specified as a function of the
     *   retry count (see example).
     * * `errorFilter` - An optional synchronous function that is invoked on
     *   erroneous result. If it returns `true` the retry attempts will continue;
     *   if the function returns `false` the retry flow is aborted with the current
     *   attempt's error and result being returned to the final callback.
     *   Invoked with (err).
     * * If `opts` is a number, the number specifies the number of times to retry,
     *   with the default interval of `0`.
     * @param {Function} task - A function which receives two arguments: (1) a
     * `callback(err, result)` which must be called when finished, passing `err`
     * (which can be `null`) and the `result` of the function's execution, and (2)
     * a `results` object, containing the results of the previously executed
     * functions (if nested inside another control flow). Invoked with
     * (callback, results).
     * @param {Function} [callback] - An optional callback which is called when the
     * task has succeeded, or after the final failed attempt. It receives the `err`
     * and `result` arguments of the last attempt at completing the `task`. Invoked
     * with (err, results).
     * @example
     *
     * // The `retry` function can be used as a stand-alone control flow by passing
     * // a callback, as shown below:
     *
     * // try calling apiMethod 3 times
     * async.retry(3, apiMethod, function(err, result) {
     *     // do something with the result
     * });
     *
     * // try calling apiMethod 3 times, waiting 200 ms between each retry
     * async.retry({times: 3, interval: 200}, apiMethod, function(err, result) {
     *     // do something with the result
     * });
     *
     * // try calling apiMethod 10 times with exponential backoff
     * // (i.e. intervals of 100, 200, 400, 800, 1600, ... milliseconds)
     * async.retry({
     *   times: 10,
     *   interval: function(retryCount) {
     *     return 50 * Math.pow(2, retryCount);
     *   }
     * }, apiMethod, function(err, result) {
     *     // do something with the result
     * });
     *
     * // try calling apiMethod the default 5 times no delay between each retry
     * async.retry(apiMethod, function(err, result) {
     *     // do something with the result
     * });
     *
     * // try calling apiMethod only when error condition satisfies, all other
     * // errors will abort the retry control flow and return to final callback
     * async.retry({
     *   errorFilter: function(err) {
     *     return err.message === 'Temporary error'; // only retry on a specific error
     *   }
     * }, apiMethod, function(err, result) {
     *     // do something with the result
     * });
     *
     * // It can also be embedded within other control flow functions to retry
     * // individual methods that are not as reliable, like this:
     * async.auto({
     *     users: api.getUsers.bind(api),
     *     payments: async.retry(3, api.getPayments.bind(api))
     * }, function(err, results) {
     *     // do something with the results
     * });
     *
     */
    function retry(opts, task, callback) {
        var DEFAULT_TIMES = 5;
        var DEFAULT_INTERVAL = 0;

        var options = {
            times: DEFAULT_TIMES,
            intervalFunc: constant(DEFAULT_INTERVAL)
        };

        function parseTimes(acc, t) {
            if (typeof t === 'object') {
                acc.times = +t.times || DEFAULT_TIMES;

                acc.intervalFunc = typeof t.interval === 'function' ? t.interval : constant(+t.interval || DEFAULT_INTERVAL);

                acc.errorFilter = t.errorFilter;
            } else if (typeof t === 'number' || typeof t === 'string') {
                acc.times = +t || DEFAULT_TIMES;
            } else {
                throw new Error("Invalid arguments for async.retry");
            }
        }

        if (arguments.length < 3 && typeof opts === 'function') {
            callback = task || noop;
            task = opts;
        } else {
            parseTimes(options, opts);
            callback = callback || noop;
        }

        if (typeof task !== 'function') {
            throw new Error("Invalid arguments for async.retry");
        }

        var attempt = 1;

        function retryAttempt() {
            task(function (err) {
                if (err && attempt++ < options.times && (typeof options.errorFilter != 'function' || options.errorFilter(err))) {
                    setTimeout(retryAttempt, options.intervalFunc(attempt));
                } else {
                    callback.apply(null, arguments);
                }
            });
        }

        retryAttempt();
    }

    /**
     * A close relative of [`retry`]{@link module:ControlFlow.retry}.  This method wraps a task and makes it
     * retryable, rather than immediately calling it with retries.
     *
     * @name retryable
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.retry]{@link module:ControlFlow.retry}
     * @category Control Flow
     * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - optional
     * options, exactly the same as from `retry`
     * @param {Function} task - the asynchronous function to wrap
     * @returns {Functions} The wrapped function, which when invoked, will retry on
     * an error, based on the parameters specified in `opts`.
     * @example
     *
     * async.auto({
     *     dep1: async.retryable(3, getFromFlakyService),
     *     process: ["dep1", async.retryable(3, function (results, cb) {
     *         maybeProcessData(results.dep1, cb);
     *     })]
     * }, callback);
     */
    var retryable = function (opts, task) {
        if (!task) {
            task = opts;
            opts = null;
        }
        return initialParams(function (args, callback) {
            function taskFn(cb) {
                task.apply(null, args.concat([cb]));
            }

            if (opts) retry(opts, taskFn, callback);
            else retry(taskFn, callback);
        });
    };

    /**
     * Run the functions in the `tasks` collection in series, each one running once
     * the previous function has completed. If any functions in the series pass an
     * error to its callback, no more functions are run, and `callback` is
     * immediately called with the value of the error. Otherwise, `callback`
     * receives an array of results when `tasks` have completed.
     *
     * It is also possible to use an object instead of an array. Each property will
     * be run as a function, and the results will be passed to the final `callback`
     * as an object instead of an array. This can be a more readable way of handling
     *  results from {@link async.series}.
     *
     * **Note** that while many implementations preserve the order of object
     * properties, the [ECMAScript Language Specification](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6)
     * explicitly states that
     *
     * > The mechanics and order of enumerating the properties is not specified.
     *
     * So if you rely on the order in which your series of functions are executed,
     * and want this to work on all platforms, consider using an array.
     *
     * @name series
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array|Iterable|Object} tasks - A collection containing functions to run, each
     * function is passed a `callback(err, result)` it must call on completion with
     * an error `err` (which can be `null`) and an optional `result` value.
     * @param {Function} [callback] - An optional callback to run once all the
     * functions have completed. This function gets a results array (or object)
     * containing all the result arguments passed to the `task` callbacks. Invoked
     * with (err, result).
     * @example
     * async.series([
     *     function(callback) {
     *         // do some stuff ...
     *         callback(null, 'one');
     *     },
     *     function(callback) {
     *         // do some more stuff ...
     *         callback(null, 'two');
     *     }
     * ],
     * // optional callback
     * function(err, results) {
     *     // results is now equal to ['one', 'two']
     * });
     *
     * async.series({
     *     one: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 1);
     *         }, 200);
     *     },
     *     two: function(callback){
     *         setTimeout(function() {
     *             callback(null, 2);
     *         }, 100);
     *     }
     * }, function(err, results) {
     *     // results is now equal to: {one: 1, two: 2}
     * });
     */
    function series(tasks, callback) {
        _parallel(eachOfSeries, tasks, callback);
    }

    /**
     * Returns `true` if at least one element in the `coll` satisfies an async test.
     * If any iteratee call returns `true`, the main `callback` is immediately
     * called.
     *
     * @name some
     * @static
     * @memberOf module:Collections
     * @method
     * @alias any
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A truth test to apply to each item in the array
     * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
     * be called with a boolean argument once it has completed. Invoked with
     * (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the iteratee functions have finished.
     * Result will be either `true` or `false` depending on the values of the async
     * tests. Invoked with (err, result).
     * @example
     *
     * async.some(['file1','file2','file3'], function(filePath, callback) {
     *     fs.access(filePath, function(err) {
     *         callback(null, !err)
     *     });
     * }, function(err, result) {
     *     // if result is true then at least one of the files exists
     * });
     */
    var some = _createTester(eachOf, Boolean, identity);

    /**
     * The same as [`some`]{@link module:Collections.some} but runs a maximum of `limit` async operations at a time.
     *
     * @name someLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.some]{@link module:Collections.some}
     * @alias anyLimit
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} iteratee - A truth test to apply to each item in the array
     * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
     * be called with a boolean argument once it has completed. Invoked with
     * (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the iteratee functions have finished.
     * Result will be either `true` or `false` depending on the values of the async
     * tests. Invoked with (err, result).
     */
    var someLimit = _createTester(eachOfLimit, Boolean, identity);

    /**
     * The same as [`some`]{@link module:Collections.some} but runs only a single async operation at a time.
     *
     * @name someSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.some]{@link module:Collections.some}
     * @alias anySeries
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A truth test to apply to each item in the array
     * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
     * be called with a boolean argument once it has completed. Invoked with
     * (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the iteratee functions have finished.
     * Result will be either `true` or `false` depending on the values of the async
     * tests. Invoked with (err, result).
     */
    var someSeries = doLimit(someLimit, 1);

    /**
     * Sorts a list by the results of running each `coll` value through an async
     * `iteratee`.
     *
     * @name sortBy
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A function to apply to each item in `coll`.
     * The iteratee is passed a `callback(err, sortValue)` which must be called once
     * it has completed with an error (which can be `null`) and a value to use as
     * the sort criteria. Invoked with (item, callback).
     * @param {Function} callback - A callback which is called after all the
     * `iteratee` functions have finished, or an error occurs. Results is the items
     * from the original `coll` sorted by the values returned by the `iteratee`
     * calls. Invoked with (err, results).
     * @example
     *
     * async.sortBy(['file1','file2','file3'], function(file, callback) {
     *     fs.stat(file, function(err, stats) {
     *         callback(err, stats.mtime);
     *     });
     * }, function(err, results) {
     *     // results is now the original array of files sorted by
     *     // modified date
     * });
     *
     * // By modifying the callback parameter the
     * // sorting order can be influenced:
     *
     * // ascending order
     * async.sortBy([1,9,3,5], function(x, callback) {
     *     callback(null, x);
     * }, function(err,result) {
     *     // result callback
     * });
     *
     * // descending order
     * async.sortBy([1,9,3,5], function(x, callback) {
     *     callback(null, x*-1);    //<- x*-1 instead of x, turns the order around
     * }, function(err,result) {
     *     // result callback
     * });
     */
    function sortBy(coll, iteratee, callback) {
        map(coll, function (x, callback) {
            iteratee(x, function (err, criteria) {
                if (err) return callback(err);
                callback(null, {
                    value: x,
                    criteria: criteria
                });
            });
        }, function (err, results) {
            if (err) return callback(err);
            callback(null, arrayMap(results.sort(comparator), baseProperty('value')));
        });

        function comparator(left, right) {
            var a = left.criteria,
                b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
        }
    }

    /**
     * Sets a time limit on an asynchronous function. If the function does not call
     * its callback within the specified milliseconds, it will be called with a
     * timeout error. The code property for the error object will be `'ETIMEDOUT'`.
     *
     * @name timeout
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {Function} asyncFn - The asynchronous function you want to set the
     * time limit.
     * @param {number} milliseconds - The specified time limit.
     * @param {*} [info] - Any variable you want attached (`string`, `object`, etc)
     * to timeout Error for more information..
     * @returns {Function} Returns a wrapped function that can be used with any of
     * the control flow functions. Invoke this function with the same
     * parameters as you would `asyncFunc`.
     * @example
     *
     * function myFunction(foo, callback) {
     *     doAsyncTask(foo, function(err, data) {
     *         // handle errors
     *         if (err) return callback(err);
     *
     *         // do some stuff ...
     *
     *         // return processed data
     *         return callback(null, data);
     *     });
     * }
     *
     * var wrapped = async.timeout(myFunction, 1000);
     *
     * // call `wrapped` as you would `myFunction`
     * wrapped({ bar: 'bar' }, function(err, data) {
     *     // if `myFunction` takes < 1000 ms to execute, `err`
     *     // and `data` will have their expected values
     *
     *     // else `err` will be an Error with the code 'ETIMEDOUT'
     * });
     */
    function timeout(asyncFn, milliseconds, info) {
        var originalCallback, timer;
        var timedOut = false;

        function injectedCallback() {
            if (!timedOut) {
                originalCallback.apply(null, arguments);
                clearTimeout(timer);
            }
        }

        function timeoutCallback() {
            var name = asyncFn.name || 'anonymous';
            var error = new Error('Callback function "' + name + '" timed out.');
            error.code = 'ETIMEDOUT';
            if (info) {
                error.info = info;
            }
            timedOut = true;
            originalCallback(error);
        }

        return initialParams(function (args, origCallback) {
            originalCallback = origCallback;
            // setup timer and call original function
            timer = setTimeout(timeoutCallback, milliseconds);
            asyncFn.apply(null, args.concat(injectedCallback));
        });
    }

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil;
    var nativeMax$1 = Math.max;

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the range of numbers.
     */
    function baseRange(start, end, step, fromRight) {
        var index = -1,
            length = nativeMax$1(nativeCeil((end - start) / (step || 1)), 0),
            result = Array(length);

        while (length--) {
            result[fromRight ? length : ++index] = start;
            start += step;
        }
        return result;
    }

    /**
     * The same as [times]{@link module:ControlFlow.times} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name timesLimit
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.times]{@link module:ControlFlow.times}
     * @category Control Flow
     * @param {number} count - The number of times to run the function.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} iteratee - The function to call `n` times. Invoked with the
     * iteration index and a callback (n, next).
     * @param {Function} callback - see [async.map]{@link module:Collections.map}.
     */
    function timeLimit(count, limit, iteratee, callback) {
        mapLimit(baseRange(0, count, 1), limit, iteratee, callback);
    }

    /**
     * Calls the `iteratee` function `n` times, and accumulates results in the same
     * manner you would use with [map]{@link module:Collections.map}.
     *
     * @name times
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.map]{@link module:Collections.map}
     * @category Control Flow
     * @param {number} n - The number of times to run the function.
     * @param {Function} iteratee - The function to call `n` times. Invoked with the
     * iteration index and a callback (n, next).
     * @param {Function} callback - see {@link module:Collections.map}.
     * @example
     *
     * // Pretend this is some complicated async factory
     * var createUser = function(id, callback) {
     *     callback(null, {
     *         id: 'user' + id
     *     });
     * };
     *
     * // generate 5 users
     * async.times(5, function(n, next) {
     *     createUser(n, function(err, user) {
     *         next(err, user);
     *     });
     * }, function(err, users) {
     *     // we should now have 5 users
     * });
     */
    var times = doLimit(timeLimit, Infinity);

    /**
     * The same as [times]{@link module:ControlFlow.times} but runs only a single async operation at a time.
     *
     * @name timesSeries
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.times]{@link module:ControlFlow.times}
     * @category Control Flow
     * @param {number} n - The number of times to run the function.
     * @param {Function} iteratee - The function to call `n` times. Invoked with the
     * iteration index and a callback (n, next).
     * @param {Function} callback - see {@link module:Collections.map}.
     */
    var timesSeries = doLimit(timeLimit, 1);

    /**
     * A relative of `reduce`.  Takes an Object or Array, and iterates over each
     * element in series, each step potentially mutating an `accumulator` value.
     * The type of the accumulator defaults to the type of collection passed in.
     *
     * @name transform
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @param {Array|Iterable|Object} coll - A collection to iterate over.
     * @param {*} [accumulator] - The initial state of the transform.  If omitted,
     * it will default to an empty Object or Array, depending on the type of `coll`
     * @param {Function} iteratee - A function applied to each item in the
     * collection that potentially modifies the accumulator. The `iteratee` is
     * passed a `callback(err)` which accepts an optional error as its first
     * argument. If an error is passed to the callback, the transform is stopped
     * and the main `callback` is immediately called with the error.
     * Invoked with (accumulator, item, key, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result is the transformed accumulator.
     * Invoked with (err, result).
     * @example
     *
     * async.transform([1,2,3], function(acc, item, index, callback) {
     *     // pointless async:
     *     process.nextTick(function() {
     *         acc.push(item * 2)
     *         callback(null)
     *     });
     * }, function(err, result) {
     *     // result is now equal to [2, 4, 6]
     * });
     *
     * @example
     *
     * async.transform({a: 1, b: 2, c: 3}, function (obj, val, key, callback) {
     *     setImmediate(function () {
     *         obj[key] = val * 2;
     *         callback();
     *     })
     * }, function (err, result) {
     *     // result is equal to {a: 2, b: 4, c: 6}
     * })
     */
    function transform(coll, accumulator, iteratee, callback) {
        if (arguments.length === 3) {
            callback = iteratee;
            iteratee = accumulator;
            accumulator = isArray(coll) ? [] : {};
        }
        callback = once(callback || noop);

        eachOf(coll, function (v, k, cb) {
            iteratee(accumulator, v, k, cb);
        }, function (err) {
            callback(err, accumulator);
        });
    }

    /**
     * Undoes a [memoize]{@link module:Utils.memoize}d function, reverting it to the original,
     * unmemoized form. Handy for testing.
     *
     * @name unmemoize
     * @static
     * @memberOf module:Utils
     * @method
     * @see [async.memoize]{@link module:Utils.memoize}
     * @category Util
     * @param {Function} fn - the memoized function
     * @returns {Function} a function that calls the original unmemoized function
     */
    function unmemoize(fn) {
        return function () {
            return (fn.unmemoized || fn).apply(null, arguments);
        };
    }

    /**
     * Repeatedly call `iteratee`, while `test` returns `true`. Calls `callback` when
     * stopped, or an error occurs.
     *
     * @name whilst
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Function} test - synchronous truth test to perform before each
     * execution of `iteratee`. Invoked with ().
     * @param {Function} iteratee - A function which is called each time `test` passes.
     * The function is passed a `callback(err)`, which must be called once it has
     * completed with an optional `err` argument. Invoked with (callback).
     * @param {Function} [callback] - A callback which is called after the test
     * function has failed and repeated execution of `iteratee` has stopped. `callback`
     * will be passed an error and any arguments passed to the final `iteratee`'s
     * callback. Invoked with (err, [results]);
     * @returns undefined
     * @example
     *
     * var count = 0;
     * async.whilst(
     *     function() { return count < 5; },
     *     function(callback) {
     *         count++;
     *         setTimeout(function() {
     *             callback(null, count);
     *         }, 1000);
     *     },
     *     function (err, n) {
     *         // 5 seconds have passed, n = 5
     *     }
     * );
     */
    function whilst(test, iteratee, callback) {
        callback = onlyOnce(callback || noop);
        if (!test()) return callback(null);
        var next = baseRest$1(function (err, args) {
            if (err) return callback(err);
            if (test()) return iteratee(next);
            callback.apply(null, [null].concat(args));
        });
        iteratee(next);
    }

    /**
     * Repeatedly call `fn` until `test` returns `true`. Calls `callback` when
     * stopped, or an error occurs. `callback` will be passed an error and any
     * arguments passed to the final `fn`'s callback.
     *
     * The inverse of [whilst]{@link module:ControlFlow.whilst}.
     *
     * @name until
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.whilst]{@link module:ControlFlow.whilst}
     * @category Control Flow
     * @param {Function} test - synchronous truth test to perform before each
     * execution of `fn`. Invoked with ().
     * @param {Function} fn - A function which is called each time `test` fails.
     * The function is passed a `callback(err)`, which must be called once it has
     * completed with an optional `err` argument. Invoked with (callback).
     * @param {Function} [callback] - A callback which is called after the test
     * function has passed and repeated execution of `fn` has stopped. `callback`
     * will be passed an error and any arguments passed to the final `fn`'s
     * callback. Invoked with (err, [results]);
     */
    function until(test, fn, callback) {
        whilst(function () {
            return !test.apply(this, arguments);
        }, fn, callback);
    }

    /**
     * Runs the `tasks` array of functions in series, each passing their results to
     * the next in the array. However, if any of the `tasks` pass an error to their
     * own callback, the next function is not executed, and the main `callback` is
     * immediately called with the error.
     *
     * @name waterfall
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array} tasks - An array of functions to run, each function is passed
     * a `callback(err, result1, result2, ...)` it must call on completion. The
     * first argument is an error (which can be `null`) and any further arguments
     * will be passed as arguments in order to the next task.
     * @param {Function} [callback] - An optional callback to run once all the
     * functions have completed. This will be passed the results of the last task's
     * callback. Invoked with (err, [results]).
     * @returns undefined
     * @example
     *
     * async.waterfall([
     *     function(callback) {
     *         callback(null, 'one', 'two');
     *     },
     *     function(arg1, arg2, callback) {
     *         // arg1 now equals 'one' and arg2 now equals 'two'
     *         callback(null, 'three');
     *     },
     *     function(arg1, callback) {
     *         // arg1 now equals 'three'
     *         callback(null, 'done');
     *     }
     * ], function (err, result) {
     *     // result now equals 'done'
     * });
     *
     * // Or, with named functions:
     * async.waterfall([
     *     myFirstFunction,
     *     mySecondFunction,
     *     myLastFunction,
     * ], function (err, result) {
     *     // result now equals 'done'
     * });
     * function myFirstFunction(callback) {
     *     callback(null, 'one', 'two');
     * }
     * function mySecondFunction(arg1, arg2, callback) {
     *     // arg1 now equals 'one' and arg2 now equals 'two'
     *     callback(null, 'three');
     * }
     * function myLastFunction(arg1, callback) {
     *     // arg1 now equals 'three'
     *     callback(null, 'done');
     * }
     */
    var waterfall = function (tasks, callback) {
        callback = once(callback || noop);
        if (!isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
        if (!tasks.length) return callback();
        var taskIndex = 0;

        function nextTask(args) {
            if (taskIndex === tasks.length) {
                return callback.apply(null, [null].concat(args));
            }

            var taskCallback = onlyOnce(baseRest$1(function (err, args) {
                if (err) {
                    return callback.apply(null, [err].concat(args));
                }
                nextTask(args);
            }));

            args.push(taskCallback);

            var task = tasks[taskIndex++];
            task.apply(null, args);
        }

        nextTask([]);
    };

    /**
     * Async is a utility module which provides straight-forward, powerful functions
     * for working with asynchronous JavaScript. Although originally designed for
     * use with [Node.js](http://nodejs.org) and installable via
     * `npm install --save async`, it can also be used directly in the browser.
     * @module async
     */

    /**
     * A collection of `async` functions for manipulating collections, such as
     * arrays and objects.
     * @module Collections
     */

    /**
     * A collection of `async` functions for controlling the flow through a script.
     * @module ControlFlow
     */

    /**
     * A collection of `async` utility functions.
     * @module Utils
     */
    var index = {
        applyEach: applyEach,
        applyEachSeries: applyEachSeries,
        apply: apply$2,
        asyncify: asyncify,
        auto: auto,
        autoInject: autoInject,
        cargo: cargo,
        compose: compose,
        concat: concat,
        concatSeries: concatSeries,
        constant: constant$2,
        detect: detect,
        detectLimit: detectLimit,
        detectSeries: detectSeries,
        dir: dir,
        doDuring: doDuring,
        doUntil: doUntil,
        doWhilst: doWhilst,
        during: during,
        each: eachLimit,
        eachLimit: eachLimit$1,
        eachOf: eachOf,
        eachOfLimit: eachOfLimit,
        eachOfSeries: eachOfSeries,
        eachSeries: eachSeries,
        ensureAsync: ensureAsync,
        every: every,
        everyLimit: everyLimit,
        everySeries: everySeries,
        filter: filter,
        filterLimit: filterLimit,
        filterSeries: filterSeries,
        forever: forever,
        log: log,
        map: map,
        mapLimit: mapLimit,
        mapSeries: mapSeries,
        mapValues: mapValues,
        mapValuesLimit: mapValuesLimit,
        mapValuesSeries: mapValuesSeries,
        memoize: memoize,
        nextTick: nextTick,
        parallel: parallelLimit,
        parallelLimit: parallelLimit$1,
        priorityQueue: priorityQueue,
        queue: queue$1,
        race: race,
        reduce: reduce,
        reduceRight: reduceRight,
        reflect: reflect,
        reflectAll: reflectAll,
        reject: reject,
        rejectLimit: rejectLimit,
        rejectSeries: rejectSeries,
        retry: retry,
        retryable: retryable,
        seq: seq$1,
        series: series,
        setImmediate: setImmediate$1,
        some: some,
        someLimit: someLimit,
        someSeries: someSeries,
        sortBy: sortBy,
        timeout: timeout,
        times: times,
        timesLimit: timeLimit,
        timesSeries: timesSeries,
        transform: transform,
        unmemoize: unmemoize,
        until: until,
        waterfall: waterfall,
        whilst: whilst,

        // aliases
        all: every,
        any: some,
        forEach: eachLimit,
        forEachSeries: eachSeries,
        forEachLimit: eachLimit$1,
        forEachOf: eachOf,
        forEachOfSeries: eachOfSeries,
        forEachOfLimit: eachOfLimit,
        inject: reduce,
        foldl: reduce,
        foldr: reduceRight,
        select: filter,
        selectLimit: filterLimit,
        selectSeries: filterSeries,
        wrapSync: asyncify
    };

    exports['default'] = index;
    exports.applyEach = applyEach;
    exports.applyEachSeries = applyEachSeries;
    exports.apply = apply$2;
    exports.asyncify = asyncify;
    exports.auto = auto;
    exports.autoInject = autoInject;
    exports.cargo = cargo;
    exports.compose = compose;
    exports.concat = concat;
    exports.concatSeries = concatSeries;
    exports.constant = constant$2;
    exports.detect = detect;
    exports.detectLimit = detectLimit;
    exports.detectSeries = detectSeries;
    exports.dir = dir;
    exports.doDuring = doDuring;
    exports.doUntil = doUntil;
    exports.doWhilst = doWhilst;
    exports.during = during;
    exports.each = eachLimit;
    exports.eachLimit = eachLimit$1;
    exports.eachOf = eachOf;
    exports.eachOfLimit = eachOfLimit;
    exports.eachOfSeries = eachOfSeries;
    exports.eachSeries = eachSeries;
    exports.ensureAsync = ensureAsync;
    exports.every = every;
    exports.everyLimit = everyLimit;
    exports.everySeries = everySeries;
    exports.filter = filter;
    exports.filterLimit = filterLimit;
    exports.filterSeries = filterSeries;
    exports.forever = forever;
    exports.log = log;
    exports.map = map;
    exports.mapLimit = mapLimit;
    exports.mapSeries = mapSeries;
    exports.mapValues = mapValues;
    exports.mapValuesLimit = mapValuesLimit;
    exports.mapValuesSeries = mapValuesSeries;
    exports.memoize = memoize;
    exports.nextTick = nextTick;
    exports.parallel = parallelLimit;
    exports.parallelLimit = parallelLimit$1;
    exports.priorityQueue = priorityQueue;
    exports.queue = queue$1;
    exports.race = race;
    exports.reduce = reduce;
    exports.reduceRight = reduceRight;
    exports.reflect = reflect;
    exports.reflectAll = reflectAll;
    exports.reject = reject;
    exports.rejectLimit = rejectLimit;
    exports.rejectSeries = rejectSeries;
    exports.retry = retry;
    exports.retryable = retryable;
    exports.seq = seq$1;
    exports.series = series;
    exports.setImmediate = setImmediate$1;
    exports.some = some;
    exports.someLimit = someLimit;
    exports.someSeries = someSeries;
    exports.sortBy = sortBy;
    exports.timeout = timeout;
    exports.times = times;
    exports.timesLimit = timeLimit;
    exports.timesSeries = timesSeries;
    exports.transform = transform;
    exports.unmemoize = unmemoize;
    exports.until = until;
    exports.waterfall = waterfall;
    exports.whilst = whilst;
    exports.all = every;
    exports.allLimit = everyLimit;
    exports.allSeries = everySeries;
    exports.any = some;
    exports.anyLimit = someLimit;
    exports.anySeries = someSeries;
    exports.find = detect;
    exports.findLimit = detectLimit;
    exports.findSeries = detectSeries;
    exports.forEach = eachLimit;
    exports.forEachSeries = eachSeries;
    exports.forEachLimit = eachLimit$1;
    exports.forEachOf = eachOf;
    exports.forEachOfSeries = eachOfSeries;
    exports.forEachOfLimit = eachOfLimit;
    exports.inject = reduce;
    exports.foldl = reduce;
    exports.foldr = reduceRight;
    exports.select = filter;
    exports.selectLimit = filterLimit;
    exports.selectSeries = filterSeries;
    exports.wrapSync = asyncify;

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

})));

}).call(this,require(2),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require(3).setImmediate)
},{}],19:[function(require,module,exports){
'use strict';

var device,
    find,
    userAgent;

device = {};

// The client user agent string.
// Lowercase, so we can use the more efficient indexOf(), instead of Regex
userAgent = window.navigator.userAgent.toLowerCase();

// Main functions
// --------------

device.ios = function () {
    return device.iphone() || device.ipod() || device.ipad();
};

device.iphone = function () {
    return !device.windows() && find('iphone');
};

device.ipod = function () {
    return find('ipod');
};

device.ipad = function () {
    return find('ipad');
};

device.android = function () {
    return !device.windows() && find('android');
};

device.androidPhone = function () {
    return device.android() && find('mobile');
};

device.androidTablet = function () {
    return device.android() && !find('mobile');
};

device.blackberry = function () {
    return find('blackberry') || find('bb10') || find('rim');
};

device.blackberryPhone = function () {
    return device.blackberry() && !find('tablet');
};

device.blackberryTablet = function () {
    return device.blackberry() && find('tablet');
};

device.windows = function () {
    return find('windows');
};

device.windowsPhone = function () {
    return device.windows() && find('phone');
};

device.windowsTablet = function () {
    return device.windows() && (find('touch') && !device.windowsPhone());
};

device.fxos = function () {
    return (find('(mobile;') || find('(tablet;')) && find('; rv:');
};

device.fxosPhone = function () {
    return device.fxos() && find('mobile');
};

device.fxosTablet = function () {
    return device.fxos() && find('tablet');
};

device.meego = function () {
    return find('meego');
};

device.mobile = function () {
    return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego();
};

device.tablet = function () {
    return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();
};

device.desktop = function () {
    return !device.tablet() && !device.mobile();
};

// Private Utility Functions
// -------------------------

// Simple UA string search
find = function (needle) {
    return userAgent.indexOf(needle) !== -1;
};

module.exports = device;
},{}],20:[function(require,module,exports){
function noop() {}

function Promise(fn) {
    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
}

function handle(self, deferred) {
    while (self._state === 3) {
        self = self._value;
    }
    if (self._state === 0) {
        self._deferreds.push(deferred);
        return;
    }
    self._handled = true;
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
    }
    var ret;
    try {
        ret = cb(self._value);
    } catch (e) {
        reject(deferred.promise, e);
        return;
    }
    resolve(deferred.promise, ret);
}

function resolve(self, newValue) {
    try {
        // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
        if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
            var then = newValue.then;
            if (newValue instanceof Promise) {
                self._state = 3;
                self._value = newValue;
                finale(self);
                return;
            } else if (typeof then === 'function') {
                doResolve(bind(then, newValue), self);
                return;
            }
        }
        self._state = 1;
        self._value = newValue;
        finale(self);
    } catch (e) {
        reject(self, e);
    }
}

function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
}

function finale(self) {
    for (var i = 0, len = self._deferreds.length; i < len; i++) {
        handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
}

function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
    var done = false;
    try {
        fn(function (value) {
            if (done) return;
            done = true;
            resolve(self, value);
        }, function (reason) {
            if (done) return;
            done = true;
            reject(self, reason);
        });
    } catch (ex) {
        if (done) return;
        done = true;
        reject(self, ex);
    }
}

Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
};

Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new(this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
};

Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
        if (args.length === 0) return resolve([]);
        var remaining = args.length;

        function res(i, val) {
            try {
                if (val && (typeof val === 'object' || typeof val === 'function')) {
                    var then = val.then;
                    if (typeof then === 'function') {
                        then.call(val, function (val) {
                            res(i, val);
                        }, reject);
                        return;
                    }
                }
                args[i] = val;
                if (--remaining === 0) {
                    resolve(args);
                }
            } catch (ex) {
                reject(ex);
            }
        }

        for (var i = 0; i < args.length; i++) {
            res(i, args[i]);
        }
    });
};

Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
        return value;
    }

    return new Promise(function (resolve) {
        resolve(value);
    });
};

Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
        reject(value);
    });
};

Promise.defer = function () {
    var deferred = {};

    deferred.promise = new Promise(function (resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred;
};

module.exports = Promise;
},{}],21:[function(require,module,exports){
(function () {
    var root = {};
    // Dependencies --------------------------------------------------------------
    root.async = (typeof require === 'function') ? require(18) : window.async;
    if (typeof root.async !== 'object') {
        throw new Error('Module async is required (https://github.com/caolan/async)');
    }
    var async = root.async;

    function _extend(origin, add) {
        if (!add || typeof add !== 'object') {
            return origin;
        }
        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
            origin[keys[i]] = add[keys[i]];
        }
        return origin;
    }

    function _merge() {
        var ret = {};
        var args = Array.prototype.slice.call(arguments);
        var keys = null;
        var i = null;

        args.forEach(function (arg) {
            if (arg && arg.constructor === Object) {
                keys = Object.keys(arg);
                i = keys.length;
                while (i--) {
                    ret[keys[i]] = arg[keys[i]];
                }
            }
        });
        return ret;
    }

    // Customisable class (Base class) -------------------------------------------
    // Use with operation "new" to extend Validation and Sanitization themselves,
    // not their prototype. In other words, constructor shall be call to extend
    // those functions, instead of being in their constructor, like this:
    //		_extend(Validation, new Customisable);

    function Customisable() {
        this.custom = {};

        this.extend = function (custom) {
            return _extend(this.custom, custom);
        };

        this.reset = function () {
            this.custom = {};
        };

        this.remove = function (fields) {
            if (!_typeIs.array(fields)) {
                fields = [fields];
            }
            fields.forEach(function (field) {
                delete this.custom[field];
            }, this);
        };
    }

    // Inspection class (Base class) ---------------------------------------------
    // Use to extend Validation and Sanitization prototypes. Inspection
    // constructor shall be called in derived class constructor.

    function Inspection(schema, custom) {
        var _stack = ['@'];

        this._schema = schema;
        this._custom = {};
        if (custom != null) {
            for (var key in custom) {
                if (custom.hasOwnProperty(key)) {
                    this._custom['$' + key] = custom[key];
                }
            }
        }

        this._getDepth = function () {
            return _stack.length;
        };

        this._dumpStack = function () {
            return _stack.map(function (i) {
                    return i.replace(/^\[/g, '\u001b\u001c\u001d\u001e');
                })
                .join('.').replace(/\.\u001b\u001c\u001d\u001e/g, '[');
        };

        this._deeperObject = function (name) {
            _stack.push((/^[a-z$_][a-z0-9$_]*$/i).test(name) ? name : '["' + name + '"]');
            return this;
        };

        this._deeperArray = function (i) {
            _stack.push('[' + i + ']');
            return this;
        };

        this._back = function () {
            _stack.pop();
            return this;
        };
    }
    // Simple types --------------------------------------------------------------
    // If the property is not defined or is not in this list:
    var _typeIs = {
        "function": function (element) {
            return typeof element === 'function';
        },
        "string": function (element) {
            return typeof element === 'string';
        },
        "number": function (element) {
            return typeof element === 'number' && !isNaN(element);
        },
        "integer": function (element) {
            return typeof element === 'number' && element % 1 === 0;
        },
        "NaN": function (element) {
            return typeof element === 'number' && isNaN(element);
        },
        "boolean": function (element) {
            return typeof element === 'boolean';
        },
        "null": function (element) {
            return element === null;
        },
        "date": function (element) {
            return element != null && element instanceof Date;
        },
        "object": function (element) {
            return element != null && element.constructor === Object;
        },
        "array": function (element) {
            return element != null && element.constructor === Array;
        },
        "any": function (element) {
            return true;
        }
    };

    function _simpleType(type, candidate) {
        if (typeof type == 'function') {
            return candidate instanceof type;
        }
        type = type in _typeIs ? type : 'any';
        return _typeIs[type](candidate);
    }

    function _realType(candidate) {
        for (var i in _typeIs) {
            if (_simpleType(i, candidate)) {
                if (i !== 'any') {
                    return i;
                }
                return 'an instance of ' + candidate.constructor.name;
            }
        }
    }

    function getIndexes(a, value) {
        var indexes = [];
        var i = a.indexOf(value);

        while (i !== -1) {
            indexes.push(i);
            i = a.indexOf(value, i + 1);
        }
        return indexes;
    }

    // Available formats ---------------------------------------------------------
    var _formats = {
        'void': /^$/,
        'url': /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)?(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
        'date-time': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z?|(-|\+)\d{2}:\d{2})$/,
        'date': /^\d{4}-\d{2}-\d{2}$/,
        'coolDateTime': /^\d{4}(-|\/)\d{2}(-|\/)\d{2}(T| )\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
        'time': /^\d{2}\:\d{2}\:\d{2}$/,
        'color': /^#([0-9a-f])+$/i,
        'email': /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
        'numeric': /^[0-9]+$/,
        'integer': /^\-?[0-9]+$/,
        'decimal': /^\-?[0-9]*\.?[0-9]+$/,
        'alpha': /^[a-z]+$/i,
        'alphaNumeric': /^[a-z0-9]+$/i,
        'alphaDash': /^[a-z0-9_-]+$/i,
        'javascript': /^[a-z_\$][a-z0-9_\$]*$/i,
        'upperString': /^[A-Z ]*$/,
        'lowerString': /^[a-z ]*$/
    };

    // Validation ------------------------------------------------------------------
    var _validationAttribut = {
        optional: function (schema, candidate) {
            var opt = typeof schema.optional === 'boolean' ? schema.optional : (schema.optional === 'true'); // Default is false

            if (opt === true) {
                return;
            }
            if (typeof candidate === 'undefined') {
                this.report('is missing and not optional', null, 'optional');
            }
        },
        type: function (schema, candidate) {
            // return because optional function already handle this case
            if (typeof candidate === 'undefined' || (typeof schema.type !== 'string' && !(schema.type instanceof Array) && typeof schema.type !== 'function')) {
                return;
            }
            var types = _typeIs.array(schema.type) ? schema.type : [schema.type];
            var typeIsValid = types.some(function (type) {
                return _simpleType(type, candidate);
            });
            if (!typeIsValid) {
                types = types.map(function (t) {
                    return typeof t === 'function' ? 'and instance of ' + t.name : t;
                });
                this.report('must be ' + types.join(' or ') + ', but is ' + _realType(candidate), null, 'type');
            }
        },
        uniqueness: function (schema, candidate) {
            if (typeof schema.uniqueness === 'string') {
                schema.uniqueness = (schema.uniqueness === 'true');
            }
            if (typeof schema.uniqueness !== 'boolean' || schema.uniqueness === false || (!_typeIs.array(candidate) && typeof candidate !== 'string')) {
                return;
            }
            var reported = [];
            for (var i = 0; i < candidate.length; i++) {
                if (reported.indexOf(candidate[i]) >= 0) {
                    continue;
                }
                var indexes = getIndexes(candidate, candidate[i]);
                if (indexes.length > 1) {
                    reported.push(candidate[i]);
                    this.report('has value [' + candidate[i] + '] more than once at indexes [' + indexes.join(', ') + ']', null, 'uniqueness');
                }
            }
        },
        pattern: function (schema, candidate) {
            var self = this;
            var regexs = schema.pattern;
            if (typeof candidate !== 'string') {
                return;
            }
            var matches = false;
            if (!_typeIs.array(regexs)) {
                regexs = [regexs];
            }
            regexs.forEach(function (regex) {
                if (typeof regex === 'string' && regex in _formats) {
                    regex = _formats[regex];
                }
                if (regex instanceof RegExp) {
                    if (regex.test(candidate)) {
                        matches = true;
                    }
                }
            });
            if (!matches) {
                self.report('must match [' + regexs.join(' or ') + '], but is equal to "' + candidate + '"', null, 'pattern');
            }
        },
        validDate: function (schema, candidate) {
            if (String(schema.validDate) === 'true' && candidate instanceof Date && isNaN(candidate.getTime())) {
                this.report('must be a valid date', null, 'validDate');
            }
        },
        minLength: function (schema, candidate) {
            if (typeof candidate !== 'string' && !_typeIs.array(candidate)) {
                return;
            }
            var minLength = Number(schema.minLength);
            if (isNaN(minLength)) {
                return;
            }
            if (candidate.length < minLength) {
                this.report('must be longer than ' + minLength + ' elements, but it has ' + candidate.length, null, 'minLength');
            }
        },
        maxLength: function (schema, candidate) {
            if (typeof candidate !== 'string' && !_typeIs.array(candidate)) {
                return;
            }
            var maxLength = Number(schema.maxLength);
            if (isNaN(maxLength)) {
                return;
            }
            if (candidate.length > maxLength) {
                this.report('must be shorter than ' + maxLength + ' elements, but it has ' + candidate.length, null, 'maxLength');
            }
        },
        exactLength: function (schema, candidate) {
            if (typeof candidate !== 'string' && !_typeIs.array(candidate)) {
                return;
            }
            var exactLength = Number(schema.exactLength);
            if (isNaN(exactLength)) {
                return;
            }
            if (candidate.length !== exactLength) {
                this.report('must have exactly ' + exactLength + ' elements, but it have ' + candidate.length, null, 'exactLength');
            }
        },
        lt: function (schema, candidate) {
            var limit = Number(schema.lt);
            if (typeof candidate !== 'number' || isNaN(limit)) {
                return;
            }
            if (candidate >= limit) {
                this.report('must be less than ' + limit + ', but is equal to "' + candidate + '"', null, 'lt');
            }
        },
        lte: function (schema, candidate) {
            var limit = Number(schema.lte);
            if (typeof candidate !== 'number' || isNaN(limit)) {
                return;
            }
            if (candidate > limit) {
                this.report('must be less than or equal to ' + limit + ', but is equal to "' + candidate + '"', null, 'lte');
            }
        },
        gt: function (schema, candidate) {
            var limit = Number(schema.gt);
            if (typeof candidate !== 'number' || isNaN(limit)) {
                return;
            }
            if (candidate <= limit) {
                this.report('must be greater than ' + limit + ', but is equal to "' + candidate + '"', null, 'gt');
            }
        },
        gte: function (schema, candidate) {
            var limit = Number(schema.gte);
            if (typeof candidate !== 'number' || isNaN(limit)) {
                return;
            }
            if (candidate < limit) {
                this.report('must be greater than or equal to ' + limit + ', but is equal to "' + candidate + '"', null, 'gte');
            }
        },
        eq: function (schema, candidate) {
            if (typeof candidate !== 'number' && typeof candidate !== 'string' && typeof candidate !== 'boolean') {
                return;
            }
            var limit = schema.eq;
            if (typeof limit !== 'number' && typeof limit !== 'string' && typeof limit !== 'boolean' && !_typeIs.array(limit)) {
                return;
            }
            if (_typeIs.array(limit)) {
                for (var i = 0; i < limit.length; i++) {
                    if (candidate === limit[i]) {
                        return;
                    }
                }
                this.report('must be equal to [' + limit.map(function (l) {
                    return '"' + l + '"';
                }).join(' or ') + '], but is equal to "' + candidate + '"', null, 'eq');
            } else {
                if (candidate !== limit) {
                    this.report('must be equal to "' + limit + '", but is equal to "' + candidate + '"', null, 'eq');
                }
            }
        },
        ne: function (schema, candidate) {
            if (typeof candidate !== 'number' && typeof candidate !== 'string') {
                return;
            }
            var limit = schema.ne;
            if (typeof limit !== 'number' && typeof limit !== 'string' && !_typeIs.array(limit)) {
                return;
            }
            if (_typeIs.array(limit)) {
                for (var i = 0; i < limit.length; i++) {
                    if (candidate === limit[i]) {
                        this.report('must not be equal to "' + limit[i] + '"', null, 'ne');
                        return;
                    }
                }
            } else {
                if (candidate === limit) {
                    this.report('must not be equal to "' + limit + '"', null, 'ne');
                }
            }
        },
        someKeys: function (schema, candidat) {
            var _keys = schema.someKeys;
            if (!_typeIs.object(candidat)) {
                return;
            }
            var valid = _keys.some(function (action) {
                return (action in candidat);
            });
            if (!valid) {
                this.report('must have at least key ' + _keys.map(function (i) {
                    return '"' + i + '"';
                }).join(' or '), null, 'someKeys');
            }
        },
        strict: function (schema, candidate) {
            if (typeof schema.strict === 'string') {
                schema.strict = (schema.strict === 'true');
            }
            if (schema.strict !== true || !_typeIs.object(candidate) || !_typeIs.object(schema.properties)) {
                return;
            }
            var self = this;
            if (typeof schema.properties['*'] === 'undefined') {
                var intruder = Object.keys(candidate).filter(function (key) {
                    return (typeof schema.properties[key] === 'undefined');
                });
                if (intruder.length > 0) {
                    var msg = 'should not contains ' + (intruder.length > 1 ? 'properties' : 'property') +
                        ' [' + intruder.map(function (i) {
                            return '"' + i + '"';
                        }).join(', ') + ']';
                    self.report(msg, null, 'strict');
                }
            }
        },
        exec: function (schema, candidate, callback) {
            var self = this;

            if (typeof callback === 'function') {
                return this.asyncExec(schema, candidate, callback);
            }
            (_typeIs.array(schema.exec) ? schema.exec : [schema.exec]).forEach(function (exec) {
                if (typeof exec === 'function') {
                    exec.call(self, schema, candidate);
                }
            });
        },
        properties: function (schema, candidate, callback) {
            if (typeof callback === 'function') {
                return this.asyncProperties(schema, candidate, callback);
            }
            if (!(schema.properties instanceof Object) || !(candidate instanceof Object)) {
                return;
            }
            var properties = schema.properties,
                i;
            if (properties['*'] != null) {
                for (i in candidate) {
                    if (i in properties) {
                        continue;
                    }
                    this._deeperObject(i);
                    this._validate(properties['*'], candidate[i]);
                    this._back();
                }
            }
            for (i in properties) {
                if (i === '*') {
                    continue;
                }
                this._deeperObject(i);
                this._validate(properties[i], candidate[i]);
                this._back();
            }
        },
        items: function (schema, candidate, callback) {
            if (typeof callback === 'function') {
                return this.asyncItems(schema, candidate, callback);
            }
            if (!(schema.items instanceof Object) || !(candidate instanceof Object)) {
                return;
            }
            var items = schema.items;
            var i, l;
            // If provided schema is an array
            // then call validate for each case
            // else it is an Object
            // then call validate for each key
            if (_typeIs.array(items) && _typeIs.array(candidate)) {
                for (i = 0, l = items.length; i < l; i++) {
                    this._deeperArray(i);
                    this._validate(items[i], candidate[i]);
                    this._back();
                }
            } else {
                for (var key in candidate) {
                    if (candidate.hasOwnProperty(key)) {
                        this._deeperArray(key);
                        this._validate(items, candidate[key]);
                        this._back();
                    }

                }
            }
        }
    };

    var _asyncValidationAttribut = {
        asyncExec: function (schema, candidate, callback) {
            var self = this;
            async.eachSeries(_typeIs.array(schema.exec) ? schema.exec : [schema.exec], function (exec, done) {
                if (typeof exec === 'function') {
                    if (exec.length > 2) {
                        return exec.call(self, schema, candidate, done);
                    }
                    exec.call(self, schema, candidate);
                }
                async.nextTick(done);
            }, callback);
        },
        asyncProperties: function (schema, candidate, callback) {
            if (!(schema.properties instanceof Object) || !_typeIs.object(candidate)) {
                return callback();
            }
            var self = this;
            var properties = schema.properties;
            async.series([
                function (next) {
                    if (properties['*'] == null) {
                        return next();
                    }
                    async.eachSeries(Object.keys(candidate), function (i, done) {
                        if (i in properties) {
                            return async.nextTick(done);
                        }
                        self._deeperObject(i);
                        self._asyncValidate(properties['*'], candidate[i], function (err) {
                            self._back();
                            done(err);
                        });
                    }, next);
                },
                function (next) {
                    async.eachSeries(Object.keys(properties), function (i, done) {
                        if (i === '*') {
                            return async.nextTick(done);
                        }
                        self._deeperObject(i);
                        self._asyncValidate(properties[i], candidate[i], function (err) {
                            self._back();
                            done(err);
                        });
                    }, next);
                }
            ], callback);
        },
        asyncItems: function (schema, candidate, callback) {
            if (!(schema.items instanceof Object) || !(candidate instanceof Object)) {
                return callback();
            }
            var self = this;
            var items = schema.items;
            var i, l;

            if (_typeIs.array(items) && _typeIs.array(candidate)) {
                async.timesSeries(items.length, function (i, done) {
                    self._deeperArray(i);
                    self._asyncValidate(items[i], candidate[i], function (err, res) {
                        self._back();
                        done(err, res);
                    });
                    self._back();
                }, callback);
            } else {
                async.eachSeries(Object.keys(candidate), function (key, done) {
                    self._deeperArray(key);
                    self._asyncValidate(items, candidate[key], function (err, res) {
                        self._back();
                        done(err, res);
                    });
                }, callback);
            }
        }
    };

    // Validation Class ----------------------------------------------------------
    // inherits from Inspection class (actually we just call Inspection
    // constructor with the new context, because its prototype is empty
    function Validation(schema, custom) {
        Inspection.prototype.constructor.call(this, schema, _merge(Validation.custom, custom));
        var _error = [];

        this._basicFields = Object.keys(_validationAttribut);
        this._customFields = Object.keys(this._custom);
        this.origin = null;

        this.report = function (message, code, reason) {
            var newErr = {
                code: code || this.userCode || null,
                reason: reason || 'unknown',
                message: this.userError || message || 'is invalid',
                property: this.userAlias ? (this.userAlias + ' (' + this._dumpStack() + ')') : this._dumpStack()
            };
            _error.push(newErr);
            return this;
        };

        this.result = function () {
            return {
                error: _error,
                valid: _error.length === 0,
                format: function () {
                    if (this.valid === true) {
                        return 'Candidate is valid';
                    }
                    return this.error.map(function (i) {
                        return 'Property ' + i.property + ': ' + i.message;
                    }).join('\n');
                }
            };
        };
    }

    _extend(Validation.prototype, _validationAttribut);
    _extend(Validation.prototype, _asyncValidationAttribut);
    _extend(Validation, new Customisable());

    Validation.prototype.validate = function (candidate, callback) {
        this.origin = candidate;
        if (typeof callback === 'function') {
            var self = this;
            return async.nextTick(function () {
                self._asyncValidate(self._schema, candidate, function (err) {
                    self.origin = null;
                    callback(err, self.result());
                });
            });
        }
        return this._validate(this._schema, candidate).result();
    };

    Validation.prototype._validate = function (schema, candidate, callback) {
        this.userCode = schema.code || null;
        this.userError = schema.error || null;
        this.userAlias = schema.alias || null;
        this._basicFields.forEach(function (i) {
            if ((i in schema || i === 'optional') && typeof this[i] === 'function') {
                this[i](schema, candidate);
            }
        }, this);
        this._customFields.forEach(function (i) {
            if (i in schema && typeof this._custom[i] === 'function') {
                this._custom[i].call(this, schema, candidate);
            }
        }, this);
        return this;
    };

    Validation.prototype._asyncValidate = function (schema, candidate, callback) {
        var self = this;
        this.userCode = schema.code || null;
        this.userError = schema.error || null;
        this.userAlias = schema.alias || null;

        async.series([
            function (next) {
                async.eachSeries(Object.keys(_validationAttribut), function (i, done) {
                    async.nextTick(function () {
                        if ((i in schema || i === 'optional') && typeof self[i] === 'function') {
                            if (self[i].length > 2) {
                                return self[i](schema, candidate, done);
                            }
                            self[i](schema, candidate);
                        }
                        done();
                    });
                }, next);
            },
            function (next) {
                async.eachSeries(Object.keys(self._custom), function (i, done) {
                    async.nextTick(function () {
                        if (i in schema && typeof self._custom[i] === 'function') {
                            if (self._custom[i].length > 2) {
                                return self._custom[i].call(self, schema, candidate, done);
                            }
                            self._custom[i].call(self, schema, candidate);
                        }
                        done();
                    });
                }, next);
            }
        ], callback);
    };

    // Sanitization ----------------------------------------------------------------
    // functions called by _sanitization.type method.
    var _forceType = {
        number: function (post, schema) {
            var n;
            if (typeof post === 'number') {
                return post;
            } else if (post === '') {
                if (typeof schema.def !== 'undefined')
                    return schema.def;
                return null;
            } else if (typeof post === 'string') {
                n = parseFloat(post.replace(/,/g, '.').replace(/ /g, ''));
                if (typeof n === 'number') {
                    return n;
                }
            } else if (post instanceof Date) {
                return +post;
            }
            return null;
        },
        integer: function (post, schema) {
            var n;
            if (typeof post === 'number' && post % 1 === 0) {
                return post;
            } else if (post === '') {
                if (typeof schema.def !== 'undefined')
                    return schema.def;
                return null;
            } else if (typeof post === 'string') {
                n = parseInt(post.replace(/ /g, ''), 10);
                if (typeof n === 'number') {
                    return n;
                }
            } else if (typeof post === 'number') {
                return parseInt(post, 10);
            } else if (typeof post === 'boolean') {
                if (post) {
                    return 1;
                }
                return 0;
            } else if (post instanceof Date) {
                return +post;
            }
            return null;
        },
        string: function (post, schema) {
            if (typeof post === 'boolean' || typeof post === 'number' || post instanceof Date) {
                return post.toString();
            } else if (_typeIs.array(post)) {
                // If user authorize array and strings...
                if (schema.items || schema.properties)
                    return post;
                return post.join(String(schema.joinWith || ','));
            } else if (post instanceof Object) {
                // If user authorize objects ans strings...
                if (schema.items || schema.properties)
                    return post;
                return JSON.stringify(post);
            } else if (typeof post === 'string' && post.length) {
                return post;
            }
            return null;
        },
        date: function (post, schema) {
            if (post instanceof Date) {
                return post;
            } else {
                var d = new Date(post);
                if (!isNaN(d.getTime())) { // if valid date
                    return d;
                }
            }
            return null;
        },
        boolean: function (post, schema) {
            if (typeof post === 'undefined') return null;
            if (typeof post === 'string' && post.toLowerCase() === 'false') return false;
            return !!post;
        },
        object: function (post, schema) {
            if (typeof post !== 'string' || _typeIs.object(post)) {
                return post;
            }
            try {
                return JSON.parse(post);
            } catch (e) {
                return null;
            }
        },
        array: function (post, schema) {
            if (_typeIs.array(post))
                return post;
            if (typeof post === 'undefined')
                return null;
            if (typeof post === 'string') {
                if (post.substring(0, 1) === '[' && post.slice(-1) === ']') {
                    try {
                        return JSON.parse(post);
                    } catch (e) {
                        return null;
                    }
                }
                return post.split(String(schema.splitWith || ','));

            }
            if (!_typeIs.array(post))
                return [post];
            return null;
        }
    };

    var _applyRules = {
        upper: function (post) {
            return post.toUpperCase();
        },
        lower: function (post) {
            return post.toLowerCase();
        },
        title: function (post) {
            // Fix by seb (replace \w\S* by \S* => exemple : coucou ça va)
            return post.replace(/\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        },
        capitalize: function (post) {
            return post.charAt(0).toUpperCase() + post.substr(1).toLowerCase();
        },
        ucfirst: function (post) {
            return post.charAt(0).toUpperCase() + post.substr(1);
        },
        trim: function (post) {
            return post.trim();
        }
    };

    // Every function return the future value of each property. Therefore you
    // have to return post even if you do not change its value
    var _sanitizationAttribut = {
        strict: function (schema, post) {
            if (typeof schema.strict === 'string') {
                schema.strict = (schema.strict === 'true');
            }
            if (schema.strict !== true)
                return post;
            if (!_typeIs.object(schema.properties))
                return post;
            if (!_typeIs.object(post))
                return post;
            var that = this;
            Object.keys(post).forEach(function (key) {
                if (!(key in schema.properties)) {
                    delete post[key];
                }
            });
            return post;
        },
        optional: function (schema, post) {
            var opt = typeof schema.optional === 'boolean' ? schema.optional : (schema.optional !== 'false'); // Default: true
            if (opt === true) {
                return post;
            }
            if (typeof post !== 'undefined') {
                return post;
            }
            this.report();
            if (schema.def === Date) {
                return new Date();
            }
            return schema.def;
        },
        type: function (schema, post) {
            // if (_typeIs['object'](post) || _typeIs.array(post)) {
            // 	return post;
            // }
            if (typeof schema.type !== 'string' || typeof _forceType[schema.type] !== 'function') {
                return post;
            }
            var n;
            var opt = typeof schema.optional === 'boolean' ? schema.optional : true;
            if (typeof _forceType[schema.type] === 'function') {
                n = _forceType[schema.type](post, schema);
                if ((n === null && !opt) || (!n && isNaN(n)) || (n === null && schema.type === 'string')) {
                    n = schema.def;
                }
            } else if (!opt) {
                n = schema.def;
            }
            if ((n != null || (typeof schema.def !== 'undefined' && schema.def === n)) && n !== post) {
                this.report();
                return n;
            }
            return post;
        },
        rules: function (schema, post) {
            var rules = schema.rules;
            if (typeof post !== 'string' || (typeof rules !== 'string' && !_typeIs.array(rules))) {
                return post;
            }
            var modified = false;
            (_typeIs.array(rules) ? rules : [rules]).forEach(function (rule) {
                if (typeof _applyRules[rule] === 'function') {
                    post = _applyRules[rule](post);
                    modified = true;
                }
            });
            if (modified) {
                this.report();
            }
            return post;
        },
        min: function (schema, post) {
            var postTest = Number(post);
            if (isNaN(postTest)) {
                return post;
            }
            var min = Number(schema.min);
            if (isNaN(min)) {
                return post;
            }
            if (postTest < min) {
                this.report();
                return min;
            }
            return post;
        },
        max: function (schema, post) {
            var postTest = Number(post);
            if (isNaN(postTest)) {
                return post;
            }
            var max = Number(schema.max);
            if (isNaN(max)) {
                return post;
            }
            if (postTest > max) {
                this.report();
                return max;
            }
            return post;
        },
        minLength: function (schema, post) {
            var limit = Number(schema.minLength);
            if (typeof post !== 'string' || isNaN(limit) || limit < 0) {
                return post;
            }
            var str = '';
            var gap = limit - post.length;
            if (gap > 0) {
                for (var i = 0; i < gap; i++) {
                    str += '-';
                }
                this.report();
                return post + str;
            }
            return post;
        },
        maxLength: function (schema, post) {
            var limit = Number(schema.maxLength);
            if (typeof post !== 'string' || isNaN(limit) || limit < 0) {
                return post;
            }
            if (post.length > limit) {
                this.report();
                return post.slice(0, limit);
            }
            return post;
        },
        properties: function (schema, post, callback) {
            if (typeof callback === 'function') {
                return this.asyncProperties(schema, post, callback);
            }
            if (!post || typeof post !== 'object') {
                return post;
            }
            var properties = schema.properties;
            var tmp;
            var i;
            if (typeof properties['*'] !== 'undefined') {
                for (i in post) {
                    if (i in properties) {
                        continue;
                    }
                    this._deeperObject(i);
                    tmp = this._sanitize(schema.properties['*'], post[i]);
                    if (typeof tmp !== 'undefined') {
                        post[i] = tmp;
                    }
                    this._back();
                }
            }
            for (i in schema.properties) {
                if (i !== '*') {
                    this._deeperObject(i);
                    tmp = this._sanitize(schema.properties[i], post[i]);
                    if (typeof tmp !== 'undefined') {
                        post[i] = tmp;
                    }
                    this._back();
                }
            }
            return post;
        },
        items: function (schema, post, callback) {
            if (typeof callback === 'function') {
                return this.asyncItems(schema, post, callback);
            }
            if (!(schema.items instanceof Object) || !(post instanceof Object)) {
                return post;
            }
            var i;
            if (_typeIs.array(schema.items) && _typeIs.array(post)) {
                var minLength = schema.items.length < post.length ? schema.items.length : post.length;
                for (i = 0; i < minLength; i++) {
                    this._deeperArray(i);
                    post[i] = this._sanitize(schema.items[i], post[i]);
                    this._back();
                }
            } else {
                for (i in post) {
                    if (post.hasOwnProperty(i)) {
                        this._deeperArray(i);
                        post[i] = this._sanitize(schema.items, post[i]);
                        this._back();
                    }
                }
            }
            return post;
        },
        exec: function (schema, post, callback) {
            if (typeof callback === 'function') {
                return this.asyncExec(schema, post, callback);
            }
            var execs = _typeIs.array(schema.exec) ? schema.exec : [schema.exec];

            execs.forEach(function (exec) {
                if (typeof exec === 'function') {
                    post = exec.call(this, schema, post);
                }
            }, this);
            return post;
        }
    };

    var _asyncSanitizationAttribut = {
        asyncExec: function (schema, post, callback) {
            var self = this;
            var execs = _typeIs.array(schema.exec) ? schema.exec : [schema.exec];

            async.eachSeries(execs, function (exec, done) {
                if (typeof exec === 'function') {
                    if (exec.length > 2) {
                        return exec.call(self, schema, post, function (err, res) {
                            if (err) {
                                return done(err);
                            }
                            post = res;
                            done();
                        });
                    }
                    post = exec.call(self, schema, post);
                }
                done();
            }, function (err) {
                callback(err, post);
            });
        },
        asyncProperties: function (schema, post, callback) {
            if (!post || typeof post !== 'object') {
                return callback(null, post);
            }
            var self = this;
            var properties = schema.properties;

            async.series([
                function (next) {
                    if (properties['*'] == null) {
                        return next();
                    }
                    var globing = properties['*'];
                    async.eachSeries(Object.keys(post), function (i, next) {
                        if (i in properties) {
                            return next();
                        }
                        self._deeperObject(i);
                        self._asyncSanitize(globing, post[i], function (err, res) {
                            if (err) { /* Error can safely be ignored here */ }
                            if (typeof res !== 'undefined') {
                                post[i] = res;
                            }
                            self._back();
                            next();
                        });
                    }, next);
                },
                function (next) {
                    async.eachSeries(Object.keys(properties), function (i, next) {
                        if (i === '*') {
                            return next();
                        }
                        self._deeperObject(i);
                        self._asyncSanitize(properties[i], post[i], function (err, res) {
                            if (err) {
                                return next(err);
                            }
                            if (typeof res !== 'undefined') {
                                post[i] = res;
                            }
                            self._back();
                            next();
                        });
                    }, next);
                }
            ], function (err) {
                return callback(err, post);
            });
        },
        asyncItems: function (schema, post, callback) {
            if (!(schema.items instanceof Object) || !(post instanceof Object)) {
                return callback(null, post);
            }
            var self = this;
            var items = schema.items;
            if (_typeIs.array(items) && _typeIs.array(post)) {
                var minLength = items.length < post.length ? items.length : post.length;
                async.timesSeries(minLength, function (i, next) {
                    self._deeperArray(i);
                    self._asyncSanitize(items[i], post[i], function (err, res) {
                        if (err) {
                            return next(err);
                        }
                        post[i] = res;
                        self._back();
                        next();
                    });
                }, function (err) {
                    callback(err, post);
                });
            } else {
                async.eachSeries(Object.keys(post), function (key, next) {
                    self._deeperArray(key);
                    self._asyncSanitize(items, post[key], function (err, res) {
                        if (err) {
                            return next();
                        }
                        post[key] = res;
                        self._back();
                        next();
                    });
                }, function (err) {
                    callback(err, post);
                });
            }
            return post;
        }
    };

    // Sanitization Class --------------------------------------------------------
    // inherits from Inspection class (actually we just call Inspection
    // constructor with the new context, because its prototype is empty
    function Sanitization(schema, custom) {
        Inspection.prototype.constructor.call(this, schema, _merge(Sanitization.custom, custom));
        var _reporting = [];

        this._basicFields = Object.keys(_sanitizationAttribut);
        this._customFields = Object.keys(this._custom);
        this.origin = null;

        this.report = function (message) {
            var newNot = {
                message: message || 'was sanitized',
                property: this.userAlias ? (this.userAlias + ' (' + this._dumpStack() + ')') : this._dumpStack()
            };
            if (!_reporting.some(function (e) {
                    return e.property === newNot.property;
                })) {
                _reporting.push(newNot);
            }
        };

        this.result = function (data) {
            return {
                data: data,
                reporting: _reporting,
                format: function () {
                    return this.reporting.map(function (i) {
                        return 'Property ' + i.property + ' ' + i.message;
                    }).join('\n');
                }
            };
        };
    }

    _extend(Sanitization.prototype, _sanitizationAttribut);
    _extend(Sanitization.prototype, _asyncSanitizationAttribut);
    _extend(Sanitization, new Customisable());

    Sanitization.prototype.sanitize = function (post, callback) {
        this.origin = post;
        if (typeof callback === 'function') {
            var self = this;
            return this._asyncSanitize(this._schema, post, function (err, data) {
                self.origin = null;
                callback(err, self.result(data));
            });
        }
        var data = this._sanitize(this._schema, post);
        this.origin = null;
        return this.result(data);
    };

    Sanitization.prototype._sanitize = function (schema, post) {
        this.userAlias = schema.alias || null;
        this._basicFields.forEach(function (i) {
            if ((i in schema || i === 'optional') && typeof this[i] === 'function') {
                post = this[i](schema, post);
            }
        }, this);
        this._customFields.forEach(function (i) {
            if (i in schema && typeof this._custom[i] === 'function') {
                post = this._custom[i].call(this, schema, post);
            }
        }, this);
        return post;
    };

    Sanitization.prototype._asyncSanitize = function (schema, post, callback) {
        var self = this;
        this.userAlias = schema.alias || null;

        async.waterfall([
            function (next) {
                async.reduce(self._basicFields, post, function (value, i, next) {
                    async.nextTick(function () {
                        if ((i in schema || i === 'optional') && typeof self[i] === 'function') {
                            if (self[i].length > 2) {
                                return self[i](schema, value, next);
                            }
                            value = self[i](schema, value);
                        }
                        next(null, value);
                    });
                }, next);
            },
            function (inter, next) {
                async.reduce(self._customFields, inter, function (value, i, next) {
                    async.nextTick(function () {
                        if (i in schema && typeof self._custom[i] === 'function') {
                            if (self._custom[i].length > 2) {
                                return self._custom[i].call(self, schema, value, next);
                            }
                            value = self._custom[i].call(self, schema, value);
                        }
                        next(null, value);
                    });
                }, next);
            }
        ], callback);
    };

    // ---------------------------------------------------------------------------

    var INT_MIN = -2147483648;
    var INT_MAX = 2147483647;

    var _rand = {
        int: function (min, max) {
            return min + (0 | Math.random() * (max - min + 1));
        },
        float: function (min, max) {
            return (Math.random() * (max - min) + min);
        },
        bool: function () {
            return (Math.random() > 0.5);
        },
        char: function (min, max) {
            return String.fromCharCode(this.int(min, max));
        },
        fromList: function (list) {
            return list[this.int(0, list.length - 1)];
        }
    };

    var _formatSample = {
        'date-time': function () {
            return new Date().toISOString();
        },
        'date': function () {
            return new Date().toISOString().replace(/T.*$/, '');
        },
        'time': function () {
            return new Date().toLocaleTimeString({}, {
                hour12: false
            });
        },
        'color': function (min, max) {
            var s = '#';
            if (min < 1) {
                min = 1;
            }
            for (var i = 0, l = _rand.int(min, max); i < l; i++) {
                s += _rand.fromList('0123456789abcdefABCDEF');
            }
            return s;
        },
        'numeric': function () {
            return '' + _rand.int(0, INT_MAX);
        },
        'integer': function () {
            if (_rand.bool() === true) {
                return '-' + this.numeric();
            }
            return this.numeric();
        },
        'decimal': function () {
            return this.integer() + '.' + this.numeric();
        },
        'alpha': function (min, max) {
            var s = '';
            if (min < 1) {
                min = 1;
            }
            for (var i = 0, l = _rand.int(min, max); i < l; i++) {
                s += _rand.fromList('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            }
            return s;
        },
        'alphaNumeric': function (min, max) {
            var s = '';
            if (min < 1) {
                min = 1;
            }
            for (var i = 0, l = _rand.int(min, max); i < l; i++) {
                s += _rand.fromList('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
            }
            return s;
        },
        'alphaDash': function (min, max) {
            var s = '';
            if (min < 1) {
                min = 1;
            }
            for (var i = 0, l = _rand.int(min, max); i < l; i++) {
                s += _rand.fromList('_-abcdefghijklmnopqrstuvwxyz_-ABCDEFGHIJKLMNOPQRSTUVWXYZ_-0123456789_-');
            }
            return s;
        },
        'javascript': function (min, max) {
            var s = _rand.fromList('_$abcdefghijklmnopqrstuvwxyz_$ABCDEFGHIJKLMNOPQRSTUVWXYZ_$');
            for (var i = 0, l = _rand.int(min, max - 1); i < l; i++) {
                s += _rand.fromList('_$abcdefghijklmnopqrstuvwxyz_$ABCDEFGHIJKLMNOPQRSTUVWXYZ_$0123456789_$');
            }
            return s;
        }
    };

    function _getLimits(schema) {
        var min = INT_MIN;
        var max = INT_MAX;

        if (schema.gte != null) {
            min = schema.gte;
        } else if (schema.gt != null) {
            min = schema.gt + 1;
        }
        if (schema.lte != null) {
            max = schema.lte;
        } else if (schema.lt != null) {
            max = schema.lt - 1;
        }
        return {
            min: min,
            max: max
        };
    }

    var _typeGenerator = {
        string: function (schema) {
            if (schema.eq != null) {
                return schema.eq;
            }
            var s = '';
            var minLength = schema.minLength != null ? schema.minLength : 0;
            var maxLength = schema.maxLength != null ? schema.maxLength : 32;
            if (typeof schema.pattern === 'string' && typeof _formatSample[schema.pattern] === 'function') {
                return _formatSample[schema.pattern](minLength, maxLength);
            }

            var l = schema.exactLength != null ? schema.exactLength : _rand.int(minLength, maxLength);
            for (var i = 0; i < l; i++) {
                s += _rand.char(32, 126);
            }
            return s;
        },
        number: function (schema) {
            if (schema.eq != null) {
                return schema.eq;
            }
            var limit = _getLimits(schema);
            var n = _rand.float(limit.min, limit.max);
            if (schema.ne != null) {
                var ne = _typeIs.array(schema.ne) ? schema.ne : [schema.ne];
                while (ne.indexOf(n) !== -1) {
                    n = _rand.float(limit.min, limit.max);
                }
            }
            return n;
        },
        integer: function (schema) {
            if (schema.eq != null) {
                return schema.eq;
            }
            var limit = _getLimits(schema);
            var n = _rand.int(limit.min, limit.max);
            if (schema.ne != null) {
                var ne = _typeIs.array(schema.ne) ? schema.ne : [schema.ne];
                while (ne.indexOf(n) !== -1) {
                    n = _rand.int(limit.min, limit.max);
                }
            }
            return n;
        },
        boolean: function (schema) {
            if (schema.eq != null) {
                return schema.eq;
            }
            return _rand.bool();
        },
        "null": function (schema) {
            return null;
        },
        date: function (schema) {
            if (schema.eq != null) {
                return schema.eq;
            }
            return new Date();
        },
        object: function (schema) {
            var o = {};
            var prop = schema.properties || {};

            for (var key in prop) {
                if (prop.hasOwnProperty(key)) {
                    if (prop[key].optional === true && _rand.bool() === true) {
                        continue;
                    }
                    if (key !== '*') {
                        o[key] = this.generate(prop[key]);
                    } else {
                        var rk = '__random_key_';
                        var randomKey = rk + 0;
                        var n = _rand.int(1, 9);
                        for (var i = 1; i <= n; i++) {
                            if (!(randomKey in prop)) {
                                o[randomKey] = this.generate(prop[key]);
                            }
                            randomKey = rk + i;
                        }
                    }
                }
            }
            return o;
        },
        array: function (schema) {
            var self = this;
            var items = schema.items || {};
            var minLength = schema.minLength != null ? schema.minLength : 0;
            var maxLength = schema.maxLength != null ? schema.maxLength : 16;
            var type;
            var candidate;
            var size;
            var i;

            if (_typeIs.array(items)) {
                size = items.length;
                if (schema.exactLength != null) {
                    size = schema.exactLength;
                } else if (size < minLength) {
                    size = minLength;
                } else if (size > maxLength) {
                    size = maxLength;
                }
                candidate = new Array(size);
                type = null;
                for (i = 0; i < size; i++) {
                    type = items[i].type || 'any';
                    if (_typeIs.array(type)) {
                        type = type[_rand.int(0, type.length - 1)];
                    }
                    candidate[i] = self[type](items[i]);
                }
            } else {
                size = schema.exactLength != null ? schema.exactLength : _rand.int(minLength, maxLength);
                candidate = new Array(size);
                type = items.type || 'any';
                if (_typeIs.array(type)) {
                    type = type[_rand.int(0, type.length - 1)];
                }
                for (i = 0; i < size; i++) {
                    candidate[i] = self[type](items);
                }
            }
            return candidate;
        },
        any: function (schema) {
            var fields = Object.keys(_typeGenerator);
            var i = fields[_rand.int(0, fields.length - 2)];
            return this[i](schema);
        }
    };

    // CandidateGenerator Class (Singleton) --------------------------------------
    function CandidateGenerator() {
        // Maybe extends Inspection class too ?
    }

    _extend(CandidateGenerator.prototype, _typeGenerator);

    var _instance = null;
    CandidateGenerator.instance = function () {
        if (!(_instance instanceof CandidateGenerator)) {
            _instance = new CandidateGenerator();
        }
        return _instance;
    };

    CandidateGenerator.prototype.generate = function (schema) {
        var type = schema.type || 'any';
        if (_typeIs.array(type)) {
            type = type[_rand.int(0, type.length - 1)];
        }
        return this[type](schema);
    };

    // Exports ---------------------------------------------------------------------
    var SchemaInspector = {};

    // if server-side (node.js) else client-side
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SchemaInspector;
    } else {
        window.SchemaInspector = SchemaInspector;
    }

    SchemaInspector.newSanitization = function (schema, custom) {
        return new Sanitization(schema, custom);
    };

    SchemaInspector.newValidation = function (schema, custom) {
        return new Validation(schema, custom);
    };

    SchemaInspector.Validation = Validation;
    SchemaInspector.Sanitization = Sanitization;

    SchemaInspector.sanitize = function (schema, post, custom, callback) {
        if (arguments.length === 3 && typeof custom === 'function') {
            callback = custom;
            custom = null;
        }
        return new Sanitization(schema, custom).sanitize(post, callback);
    };

    SchemaInspector.validate = function (schema, candidate, custom, callback) {
        if (arguments.length === 3 && typeof custom === 'function') {
            callback = custom;
            custom = null;
        }
        return new Validation(schema, custom).validate(candidate, callback);
    };

    SchemaInspector.generate = function (schema, n) {
        if (typeof n === 'number') {
            var r = new Array(n);
            for (var i = 0; i < n; i++) {
                r[i] = CandidateGenerator.instance().generate(schema);
            }
            return r;
        }
        return CandidateGenerator.instance().generate(schema);
    };
})();
},{}],22:[function(require,module,exports){
'use strict';

function uaMatch(ua) {
    ua = ua.toLowerCase();

    var match = /(edge)\/([\w.]+)/.exec(ua) ||
        /(opr)[\/]([\w.]+)/.exec(ua) ||
        /(chrome)[ \/]([\w.]+)/.exec(ua) ||
        /(iemobile)[\/]([\w.]+)/.exec(ua) ||
        /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        ua.indexOf('trident') >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
        ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

    var browser = {};

    var matched = {
        browser: match[5] || match[3] || match[1] || '',
        version: match[2] || match[4] || '0',
        versionNumber: match[4] || match[2] || '0'
    };

    if (matched.browser) {
        browser[matched.browser] = true;
        browser.version = matched.version;
        browser.versionNumber = parseInt(matched.versionNumber, 10);
    }

    // IE11 has a new token so we will assign it msie to avoid breaking changes
    if (browser.rv || browser.iemobile) {
        var ie = 'msie';

        matched.browser = ie;
        browser[ie] = true;
    }

    // Edge is officially known as Microsoft Edge, so rewrite the key to match
    if (browser.edge) {
        delete browser.edge;
        var msedge = 'msedge';

        matched.browser = msedge;
        browser[msedge] = true;
    }

    // Opera 15+ are identified as opr
    if (browser.opr) {
        var opera = 'opera';

        matched.browser = opera;
        browser[opera] = true;
    }

    // Stock Android browsers are marked as Safari on Android.
    if (browser.safari && browser.android) {
        var android = 'android';

        matched.browser = android;
        browser[android] = true;
    }

    // Kindle browsers are marked as Safari on Kindle
    if (browser.safari && browser.kindle) {
        var kindle = 'kindle';

        matched.browser = kindle;
        browser[kindle] = true;
    }

    // Kindle Silk browsers are marked as Safari on Kindle
    if (browser.safari && browser.silk) {
        var silk = 'silk';

        matched.browser = silk;
        browser[silk] = true;
    }

    // Assign the name
    browser.name = matched.browser;
    return browser;
}

module.exports = uaMatch(window.navigator.userAgent);
},{}],23:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Browser = require(11);
var Network = require(27);
var Utilities = require(33);
var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A static library of functions used to access the GPT library.
 *
 * @static
 */
function GptHelper() {
    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    function run(fn, gpt) {

        gpt = gpt || window.googletag;

        if (!gpt || !gpt.cmd) {

            return;
        }

        gpt.cmd.push(fn);
    }

    function loadGpt(w) {

        w = w || window;

        if (w.googletag) {

            return w.googletag;
        }

        w.googletag = w.googletag || {};
        w.googletag.cmd = w.googletag.cmd || [];

        Network.jsonp({
            async: true,
            url: Browser.getProtocol() + '//www.googletagservices.com/tag/js/gpt.js',
            windowScope: w
        });

        return w.googletag;
    }

    function getGpt(level) {
        var foundGpt = null;

        if (typeof level === 'undefined') {
            foundGpt = Browser.getNearestEntity('googletag');
        } else {
            foundGpt = Browser.traverseContextTree(function (context) {
                if (context.hasOwnProperty('googletag')) {
                    return context.googletag;
                }

                return null;
            }, null, level, level);
        }

        return foundGpt;
    }

    function isGSlot(entity) {
        return Utilities.isObject(entity)
            && Utilities.isFunction(entity.getSlotElementId)
            && Utilities.isFunction(entity.setTargeting)
            && Utilities.isFunction(entity.getTargeting)
            && Utilities.isFunction(entity.clearTargeting);
    }

    function getGSlots() {
        return googletag
            .pubads()
            .getSlots()
            .slice();
    }

    function getGSlotByDivId(divId) {
        var slots = getGSlots();
        for (var i = 0; i < slots.length; i++) {
            if (slots[i].getSlotElementId() === divId) {
                return slots[i];
            }
        }

        return null;
    }

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* PubKitShrinkExports<GptHelper> */
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        run: run,
        loadGpt: loadGpt,
        getGpt: getGpt,
        isGSlot: isGSlot,
        getGSlots: getGSlots,
        getGSlotByDivId: getGSlotByDivId
    };
}

///////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = GptHelper();
},{}],24:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A class for storing Header Tag Slots with their associated config information.
 * Takes a required Header Tag name and a config object containing information
 * which can be used to map to this slot.
 * The config object should contain one or more of the following properties:
 *
 * divId: a string
 * sizeMapping: an object mapping minimum screen sizes to size arrays. Each key
 *              must be a string of the form 'widthxheight' (width and height
 *              being integers) and each corresponding value must be an array
 *              of arrays, each containing two integers [width, height]
 * targeting: an array of objects, each containing a set of key-value pairs
 *
 * @class
 * @param {string} name     The Header Tag Slot name
 * @param {object} config   A config object containing information about the slot
 */
function HeaderTagSlot(name, config) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /**
     * The Header Tag Slot name for this HtSlot
     *
     * @type {string}
     * @private
     */
    var __name;

    /**
     * Internal id of this HT slot, recognized by IX backend.
     *
     * @type {string}
     * @private
     */
    var __id;

    /**
     * The Div ID on the page that this slot can match against
     *
     * @type {string}
     * @private
     */
    var __divId;

    /* The ad unit path Regex on the page that this slot can match against
     *
     * @type {string}
     * @memberof HtSlot
     * @private
     */
    var __adUnitPath;

    /**
     * The ad sizes that can display in this slot for given screen sizes.
     * Structured as a multilevel object. Top-level keys are widths. Each width's
     * value is an object with heights as keys. Values of that object are arrays of
     * arrays, each member being of the form [adWidth, adHeight].
     *
     * E.G.
     * {
     *     '1': {
     *         '1': [ [300, 50], [300, 250] ]
     *     },
     *     '1024': {
     *         '200': [ [300, 250], [728, 90] ],
     *         '768': [ [300, 250], [300, 600], [728, 90] ]
     *     }
     * }
     *
     * @type {object}
     * @private
     */
    var __sizeMapping;

    /**
     * Any other targeting information used to map to this slot. An array of objects
     * each containing key-value pairs which should be used to map to this slot.
     *
     * @type {object[]}
     * @private
     */
    var __targeting;

    /**
     * If a device type filter is being applied, then the device type will be checked
     * against this to decide whether to filter it out or not.
     *
     * @type {string}
     * @private
     */
    var __deviceType;

    /**
     * The page position of the slot (atf or btf).
     *
     * @type {string}
     * @private
     */
    var __position;

    /**
     * Indicates the type of the slot
     *
     * @type {string}
     * @private
     */
    var __type;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /**
     * Provides a comparitor function for an ascending numeric sort.
     *
     * @param  {string} a A string representing a base-10 number.
     * @param  {string} b A string representing a base-10 number.
     * @return {number}   A value that is positive if a>b, negative if b<a, and 0 if a=b
     */
    function __numericSortComparison(a, b) {
        return Number(a) - Number(b);
    }

    /* Getters and Setters
     * ---------------------------------- */

    /**
     * Returns the HtSlot name
     *
     * @return {string} The Header Tag Slot name
     * @public
     * @memberof HtSlot
     */
    function getName() {
        return __name;
    }

    /**
     * Return the HT slot ID
     * @return {string} UI UUID for this HT slot
     */
    function getId() {
        return __id;
    }

    /**
     * Returns the slot's Div ID RegEx
     *
     * @return {RegExp} The Div ID matcher for the slot
     * @public
     * @memberof HtSlot
     */
    function getDivId() {
        return __divId;
    }

    /**
     * Returns the slot's matching div attribute value, i.e. the div that contains
     * this slot should have the attribute htId="(return value of this function)"
     * set.
     *
     * @return {string} The matching div attribute value for this slot
     * @public
     * @memberof HtSlot
     */
    function getAdUnitPath() {
        return __adUnitPath;
    }

    /**
     * Gets an array of sizes that can go in this slot, according to the current
     * size of the browser window and the size mapping.
     *
     * @param {number} clientWidth The width of the client area in pixels
     * @param {number} clientHeight The height of the client area in pixels
     *
     * @return {array[]} Array of sizes, each one is an array [width, height]
     * @public
     * @memberof HtSlot
     */
    function getSizes(clientWidth, clientHeight) {

        var retSizes = [];
        var widthsSorted;
        var heightsSorted;
        var width;
        var height;

        widthsSorted = Object.keys(__sizeMapping).sort(__numericSortComparison);

        /* Goes through keys numerically from largest to smallest, therefore stops
           and returns as soon as we find the first one that will fit in the client
           area */
        for (var i = widthsSorted.length - 1; i >= 0; i--) {
            width = widthsSorted[i];

            if (Number(width) > clientWidth) {
                continue;
            }

            heightsSorted = Object.keys(__sizeMapping[width]).sort(__numericSortComparison);

            for (var j = heightsSorted.length - 1; j >= 0; j--) {
                height = heightsSorted[j];

                if (Number(height) > clientHeight) {
                    continue;
                }

                retSizes = __sizeMapping[width][height];

                break;
            }

            if (retSizes.length > 0) {
                break;
            }
        }

        return retSizes;
    }

    /**
     * Returns an array of targeting objects for mapping to this slot.
     *
     * @return {object[]} Array of objects containing key-value pairs for mapping.
     * @public
     * @memberof HtSlot
     */
    function getTargeting() {
        return __targeting;
    }

    /**
     * Returns the slot's device type string
     *
     * @return {string|null} The specified device for this slot, or null if not set
     * @public
     * @memberof HtSlot
     */
    function getDeviceType() {
        return __deviceType;
    }

    /**
     * Returns the slot's position value (atf/btf) if set
     *
     * @return {string|null} The position value of this slot, or null if not set
     * @public
     * @memberof HtSlot
     */
    function getPosition() {
        return __position;
    }

    /**
     * @return The type of the slot
     * @public
     * @memberof HtSlot
     */
    function getType() {
        return __type;
    }

    /**
     * Sets the type of the slot
     * @param {string} type
     */
    function setType(type) {
        __type = type;
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {

        __name = name;
        __id = config.id;

        /* Default everything to null before setting values that are actually given */
        __divId = null;
        __adUnitPath = null;
        __sizeMapping = null;
        __targeting = null;
        __deviceType = null;
        __position = null;
        __type = null;

        if (config.hasOwnProperty('divId')) {
            __divId = RegExp(config.divId);
        }

        if (config.hasOwnProperty('adUnitPath')) {
            __adUnitPath = RegExp(config.adUnitPath);
        }

        if (config.hasOwnProperty('sizeMapping')) {
            var indexRegex = /^(\d+)x(\d+)$/;
            var regArray;
            var width;
            var height;
            __sizeMapping = {};

            for (var index in config.sizeMapping) {
                if (!config.sizeMapping.hasOwnProperty(index)) {
                    continue;
                }

                regArray = indexRegex.exec(index);

                width = regArray[1];
                height = regArray[2];

                if (!__sizeMapping.hasOwnProperty(width)) {
                    __sizeMapping[width] = {};
                }

                __sizeMapping[width][height] = config.sizeMapping[index];
            }
        }

        if (config.hasOwnProperty('targeting')) {
            __targeting = config.targeting;
        }

        if (config.hasOwnProperty('deviceType')) {
            __deviceType = config.deviceType;
        }

        if (config.hasOwnProperty('position')) {
            __position = config.position;
        }

        if (config.hasOwnProperty('type')) {
            __type = config.type;
        }

        config = undefined;
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        getName: getName,
        getId: getId,
        getDivId: getDivId,
        getAdUnitPath: getAdUnitPath,
        getSizes: getSizes,
        getTargeting: getTargeting,
        getDeviceType: getDeviceType,
        getPosition: getPosition,
        getType: getType,
        setType: setType,

    };
}

////////////////////////////////////////////////////////////////////////////////
// Enumerations ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

HeaderTagSlot.SlotTypes = {
    INSTREAM_VIDEO: 'INSTREAM_VIDEO',
    BANNER: 'BANNER'
};

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = HeaderTagSlot;
},{}],25:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Browser = require(11);
var SpaceCamp = require(61);
var Utilities = require(33);
var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Performs mapping of HtSlots to page slots using selectors and filters chosen
 * in the config.
 *
 * @constructor
 */
function HtSlotMapper(config) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /**
     * Selector functions to be run. Stored as an array of arrays of functions.
     *
     * @private {array[]}
     */
    var __selectors = [];

    /**
     * Filter functions to be run. Stored as an array of functions.
     *
     * @private {function[]}
     */
    var __filters = [];

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /**
     * Determines if the conditions specified by arrA are matched by arrB.
     * All elements of array A which do not start with the '!' character must be
     * present in array B.
     * All elements of array A which *do* start with the '!' must *not* be present
     * in array B (ignoring the '!' itself for the purposes of comparison).
     * Returns true if array B fulfills the conditions or false if not.
     *
     * @param  {string[]} arrA Array of strings describing required elements
     * @param  {string[]} arrB Array of strings to check
     * @return {boolean}       Whetner array B matches the conditions from array 1 or not
     */
    function __doesTargetArrayMatch(arrA, arrB) {

        for (var i = 0; i < arrA.length; i++) {
            var checkStringA;
            var isNotTargeting;

            if (arrA[i].charAt(0) === '!') {
                checkStringA = arrA[i].slice(1);
                isNotTargeting = true;
            } else {
                checkStringA = arrA[i];
                isNotTargeting = false;
            }

            var isPresent = false;

            for (var j = 0; j < arrB.length; j++) {
                if (checkStringA === arrB[j]) {
                    isPresent = true;

                    break;
                }
            }

            /* We either want item to be present with a normal query or absent with
               not-targeting, so if these have the same value the test is failed */
            if (isNotTargeting === isPresent) {
                return false;
            }
        }

        return true;
    }

    /**
     * Determines if the targeting map given in object 2 matches the conditions
     * specified by object 1.
     * All keys of object 1 must be present in object 2.
     * Values of both objects are arrays of strings.
     * The values of object 1 specify conditions that must be fulfilled by the
     * matching conditions of object 2 according to the __doesTargetArrayMatch
     * function: All regular string elements must be present and all negated (with
     * '!') string elements must be absent.
     *
     * @param  {object} obj1 [description]
     * @param  {object} obj2 [description]
     * @return {boolean}      [description]
     */
    function __doesTargetingMapMatch(obj1, obj2) {

        for (var key in obj1) {
            if (!obj1.hasOwnProperty(key)) {
                continue;
            }

            if (!obj2.hasOwnProperty(key)) {
                return false;
            }

            if (!__doesTargetArrayMatch(obj1[key], obj2[key])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Object containining all the individual selector/filter functions.
     * Separated out here so we can refer to them by name in the constructor, and
     * so that their names don't get mangled during minification.
     *
     * @type {Object}
     */
    var __matcherFunctions = {
        /**
         * Checks if the DivId of the given adSlot is matched by the div id regex
         * stored in the given htSlot.
         * Returns 1 if match.
         * Returns 0 if non-match.
         * Returns -1 if the htSlot has no div id regex.
         *
         * @param  {object} adSlot [description]
         * @param  {HeaderTagSlot} htSlot [description]
         * @return {integer}        [description]
         */
        divId: function (adSlot, htSlot) {

            var divIdRegex = htSlot.getDivId();

            if (!divIdRegex) {
                return -1;
            }

            if (divIdRegex.test(adSlot.divId)) {
                return 1;
            }

            return 0;
        },

        /**
         * Checks if one of the targeting objects in the given htSlot matches
         * the targeting of the given adSlot.
         * Returns 1 if match.
         * Returns 0 if non-match.
         * Returns -1 if the htSlot has no div id regex.
         *
         * @param  {object} adSlot [description]
         * @param  {HeaderTagSlot} htSlot [description]
         * @return {integer}        [description]
         */
        targeting: function (adSlot, htSlot) {

            var htSlotTargetingArray = htSlot.getTargeting();
            var adSlotTargeting = adSlot.targeting;

            if (!htSlotTargetingArray) {
                return -1;
            }

            var hasEmptyTargeting = false;

            var targetingMatchScore = 0;
            for (var k = 0; k < htSlotTargetingArray.length; k++) {
                if (!htSlotTargetingArray[k]) {
                    continue;
                }

                if (Utilities.isEmpty(htSlotTargetingArray[k])) {
                    hasEmptyTargeting = true;

                    continue;
                }

                if (!__doesTargetingMapMatch(htSlotTargetingArray[k], adSlotTargeting)) {
                    continue;
                }

                var currentTargetingMatchScore = 0;
                for (var key in htSlotTargetingArray[k]) {
                    if (!htSlotTargetingArray[k].hasOwnProperty(key)) {
                        continue;
                    }

                    currentTargetingMatchScore += htSlotTargetingArray[k][key].length;
                }

                targetingMatchScore = Math.max(targetingMatchScore, currentTargetingMatchScore);
            }

            if (hasEmptyTargeting || targetingMatchScore > 0) {
                /* Empty targeting is a minimal match, return 1 for that. Any actual matching
                   targeting should have a higher score, so add 1. */
                return targetingMatchScore + 1;
            }

            return 0;
        },

        /**
         * Matches based on an array of sizes. Gets sizes from the HtSlot based on the
         * current viewport size. If the AdSlot does not have all the HtSlot's sizes,
         * returns 0. Otherwise returns the percentage of the AdSlot's sizes that are
         * present in the HtSlot as an integer from 1-100.
         *
         * @param  {object} adSlot [description]
         * @param  {HeaderTagSlot} htSlot [description]
         * @return {integer}        [description]
         */
        size: function (adSlot, htSlot) {

            var htSlotSizes = htSlot.getSizes(Browser.getViewportWidth(), Browser.getViewportHeight());

            if (!htSlotSizes) {
                return -1;
            }

            var matches = 0;

            for (var i = 0; i < htSlotSizes.length; i++) {
                var subMatches = 0;

                for (var j = 0; j < adSlot.sizes.length; j++) {
                    if (htSlotSizes[i][0] === adSlot.sizes[j][0] && htSlotSizes[i][1] === adSlot.sizes[j][1]) {
                        subMatches++;

                        break;
                    }
                }

                if (subMatches === 0) {
                    return 0;
                }

                matches += subMatches;
            }

            if (matches === 0) {
                return 0;
            }

            return Math.ceil((matches * 100) / adSlot.sizes.length);
        },

        /**
         * Checks if the device type of the htSlot matches the current page
         * deviceType. The adSlot parameter is not used.
         * Returns 1 if match.
         * Returns 0 if non-match.
         * Returns -1 if the htSlot has no group name.
         *
         * @param  {object} adSlot [description]
         * @param  {HeaderTagSlot} htSlot [description]
         * @return {integer}        [description]
         */
        deviceType: function (adSlot, htSlot) {

            var htSlotDeviceType = htSlot.getDeviceType();

            if (!htSlotDeviceType) {
                return -1;
            }

            if (htSlotDeviceType === SpaceCamp.DeviceTypeChecker.getDeviceType()) {
                return 1;
            }

            return 0;
        },

        /**
         * Checks if the ad unit path of the given adSlot and htSlot match exactly.
         * Returns 1 if match.
         * Returns 0 if non-match.
         * Returns -1 if the htSlot has no ad unit path.
         *
         * @param  {object} adSlot [description]
         * @param  {HeaderTagSlot} htSlot [description]
         * @return {integer}        [description]
         */
        adUnitPath: function (adSlot, htSlot) {

            var adUnitPathRegex = htSlot.getAdUnitPath();

            if (!adUnitPathRegex) {
                return -1;
            }

            if (adUnitPathRegex.test(adSlot.adUnitPath)) {
                return 1;
            }

            return 0;
        }
    };

    /**
     * Runs all configured filters on the given HtSlot and AdSlotInfo. Returns true
     * if all filters either match or are not applicable, returns false if any
     * filter specifically fails to match (filter returned 0).
     *
     * @param  {object} adSlot [description]
     * @param  {HeeaderTagSlot} htSlot [description]
     * @return {boolean}        [description]
     */
    function __doAllFiltersPass(adSlot, htSlot) {

        for (var i = 0; i < __filters.length; i++) {
            if (__filters[i](adSlot, htSlot) === 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * Runs all configured selectors on the given Htslot and AdSlotInfo. If any
     * selector fails to match, returns false. Otherwise returns true.
     *
     * @param  {object} adSlot      [description]
     * @param  {HeaderTagSlot} htSlot      [description]
     * @param  {function[]} selectorSet [description]
     * @return {integer}             [description]
     */
    function __doAllSelectorsMatch(adSlot, htSlot, selectorSet) {

        for (var i = 0; i < selectorSet.length; i++) {
            var score = selectorSet[i](adSlot, htSlot);
            if (score <= 0) {
                return false;
            }
        }

        return true;
    }

    /* Main
     * ---------------------------------- */

    /**
     * Filters the given list of htSlots according to the page/slot information in
     * adSlots with the filters configured at class construction. Returns a new
     * array of HtSlots (copied by reference from the input array).
     *
     * @param  {HeaderTagSlot[]} htSlots Array of HtSlot objects
     * @param  {object[]} adSlots Array of objects containing page/slot info
     * @return {HeaderTagSlot[]}         Filtered array of HtSlot objects.
     */
    function filter(htSlots, adSlots) {

        if (Utilities.isEmpty(__filters)) {
            /* Create a copy of the htSlots array which is safe to modify */
            return htSlots.slice();
        }

        var filteredSlots = [];

        for (var i = 0; i < htSlots.length; i++) {
            for (var j = 0; j < adSlots.length; j++) {
                if (__doAllFiltersPass(adSlots[j], htSlots[i])) {
                    filteredSlots.push(htSlots[i]);

                    break;
                }
            }
        }

        return filteredSlots;
    }

    /**
     * Performs matching of the input htSlots to the page slots described by the
     * given adSlotInfo objects with the selectors configured at class construction.
     * Returns an array of parcels representing slots on the page with their matched
     * HtSlot.
     *
     * @param  {HeaderTagSlot[]} htSlots Array of HtSlot objects
     * @param  {object[]} adSlots Array of objects containing page/slot info
     * @return {Parcel[]}         Array of request parcels
     */
    function select(htSlots, adSlots) {

        if (Utilities.isEmpty(htSlots) || Utilities.isEmpty(adSlots)) {
            return [];
        }

        var selectedParcels = [];
        var htSlotsCopy = htSlots.slice();
        var adSlotsCopy = adSlots.slice();

        for (var k = 0; k < __selectors.length; k++) {
            var selectorSet = __selectors[k];
            var htSlotsMatched = [];

            for (var l = adSlotsCopy.length - 1; l >= 0; l--) {
                var bestMatch = [];
                var bestMatchSlot = -1;

                for (var m = 0; m < htSlotsCopy.length; m++) {
                    if (!__doAllSelectorsMatch(adSlotsCopy[l], htSlotsCopy[m], selectorSet)) {
                        continue;
                    }

                    var curHtSlotScores = [];

                    for (var n = 0; n < selectorSet.length; n++) {
                        var score = selectorSet[n](adSlotsCopy[l], htSlotsCopy[m]);
                        curHtSlotScores.push(score);
                    }

                    for (var o = 0; o < selectorSet.length; o++) {
                        if (!bestMatch[o] || (curHtSlotScores[o] > bestMatch[o])) {
                            bestMatch = curHtSlotScores;
                            bestMatchSlot = m;

                            break;
                        }

                        if (curHtSlotScores[o] < bestMatch[o]) {
                            break;
                        }
                    }
                }

                /* If there's a match, take the best one and remove the adslot from
                 * further consideration */
                if (bestMatchSlot >= 0) {

                    var matchParcel = {};
                    htSlotsMatched[bestMatchSlot] = true;
                    matchParcel.htSlot = htSlotsCopy[bestMatchSlot];
                    if (adSlotsCopy[l].firstPartyData) {
                        matchParcel.firstPartyData = adSlotsCopy[l].firstPartyData;
                    }

                    if (adSlotsCopy[l].reference) {
                        matchParcel.ref = adSlotsCopy[l].reference;
                    }
                    selectedParcels.push(matchParcel);
                    adSlotsCopy.splice(l, 1);
                }
            }

            /* Remove any htslots that matched before running the next selector set */
            for (var p = htSlotsCopy.length - 1; p >= 0; p--) {
                if (htSlotsMatched[p]) {
                    htSlotsCopy.splice(p, 1);
                }
            }
        }

        return selectedParcels;
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    /**
     * Constructs an HtSlotMapper instance.
     * Usses the strings specified in the config to populate the __filters and
     * __selectors arrays with function references.
     *
     * @return {[type]} [description]
     */
    (function __constructor() {

        for (var i = 0; i < config.filters.length; i++) {
            if (!__matcherFunctions.hasOwnProperty(config.filters[i])) {
                throw Whoopsie('INVALID_CONFIG', 'Cannot find function ' + config.filters[i] + ' in HtSlotMapper');
            }

            __filters.push(__matcherFunctions[config.filters[i]]);
        }

        for (var j = 0; j < config.selectors.length; j++) {
            var selectorSetFuncs = [];
            var selectorSet = config.selectors[j];

            if (Utilities.isString(selectorSet)) {

                selectorSetFuncs.push(__matcherFunctions[selectorSet]);
            } else {
                for (var k = 0; k < selectorSet.length; k++) {

                    selectorSetFuncs.push(__matcherFunctions[selectorSet[k]]);
                }
            }
            __selectors.push(selectorSetFuncs);
        }
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Data
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        select: select,
        filter: filter,

    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = HtSlotMapper;
},{}],26:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Browser = require(11);
var Network = require(27);
var Size = require(31);
var System = require(32);
var Utilities = require(33);
var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function MvtBuilder() {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /* Parameters that have a fixed value and cannot be set by the user. */
    var __fixedParams;

    /* Params that require special handling to format them for DFP. */
    var __specialParams;

    /* Set of properties in the targeting object where the actual demand is. */
    var __targetingSubGroups;

    /* The base URLs of video server end-point. */
    var __baseUrls;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    function __extractTargetingKeyValues(demandObj) {
        /* If the demandObj is missing the targeting property, then return an
         * empty object to represent no targeting. */
        if (!demandObj.hasOwnProperty('targeting')) {
            return {};
        }

        /* Look in each sub group of targeting and loop through the key-values
         * and copy them to the new object. */
        var extractedTargetingKeyValues = {};
        __targetingSubGroups.map(function (subGroup) {
            if (!demandObj.targeting.hasOwnProperty(subGroup)) {
                return;
            }

            var targetingKeyValues = demandObj.targeting[subGroup];

            for (var key in targetingKeyValues) {
                if (!targetingKeyValues.hasOwnProperty(key)) {
                    continue;
                }

                extractedTargetingKeyValues[key] = targetingKeyValues[key];
            }
        });

        return extractedTargetingKeyValues;
    }

    function __buildCustParamsString(obj) {
        var paramsString = '';

        /* Convert a array of values into a comma-separated query string */
        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }

            paramsString = paramsString + key + '=' + obj[key].join(',') + '&';
        }

        return paramsString.slice(0, -1);
    }

    function mediateVideoBids(slotDemand) {

        /* Results will be stored here */
        var mediatedDemand = [];

        /* Keep a reference to the highest priced bids so far */
        var highestPricedBids = [];
        slotDemand = Utilities.deepCopy(slotDemand);

        slotDemand.map(function (clonedBid) {
            if (highestPricedBids.length === 0 || highestPricedBids[0].price === clonedBid.price) {
                highestPricedBids.push(clonedBid);
            } else if (highestPricedBids[0].price < clonedBid.price) {
                /* Delete the "targeting.price" of the previously saved deals since they no longer have the highest price */
                for (var j = 0; j < highestPricedBids.length; j++) {
                    if (highestPricedBids[j].hasOwnProperty('dealId')) {
                        delete highestPricedBids[j].targeting.price;
                    }
                }

                /* Clear the list and add the new highest */
                highestPricedBids = [clonedBid];
            }

            /* If this is a deal, we will add it to the results regardless of the price */
            if (clonedBid.hasOwnProperty('dealId')) {
                mediatedDemand.push(clonedBid);

                /* If the deal has a lower price than the highest bids, delete 'targeting.price' */
                if (highestPricedBids.length > 0 && highestPricedBids[0].price > clonedBid.price) {
                    delete clonedBid.targeting.price;
                }
            }
        });

        if (highestPricedBids.length > 0) {
            /* Select the winning bid and remove it from the "highestPricedBids" */
            var winningBid = Utilities.randomSplice(highestPricedBids);

            /* If the winning bid is not a deal, add it to the results */
            if (!winningBid.hasOwnProperty('dealId')) {
                mediatedDemand.push(winningBid);
            }

            /* Loop through the rest of the highest bids, if a deal is found, delete "targeting.price" */
            for (var i = 0; i < highestPricedBids.length; i++) {
                if (highestPricedBids[i].hasOwnProperty('dealId')) {
                    delete highestPricedBids[i].targeting.price;
                }
            }
        }

        return mediatedDemand;
    }

    function buildDfpMvt(htSlotParams, demandArr) {

        /* Extract information from the demandObjs. */
        var targetingKeyValues = {};
        var sizes = [];
        for (var i = 0; i < demandArr.length; i++) {
            var demandObj = demandArr[i];

            /* If current size isn't in the sizes array, add it. */
            var curSize = Size.arrayToString(demandObj.size);
            if (sizes.indexOf(curSize) === -1) {
                sizes.push(curSize);
            }

            targetingKeyValues = Utilities.appendToObject(targetingKeyValues, __extractTargetingKeyValues(demandObj));
        }

        /* Join the individual size strings into the final size string. */
        var sizeString = sizes.join('|');

        /* If a sz has been passed in, override the size string created from the demandObjs. */
        if (htSlotParams.hasOwnProperty('sz')) {
            sizeString = Size.arrayToString(htSlotParams.sz, '|');
        }

        /* If cust_params have been passed on, merge them with the targeting key-values. */
        if (htSlotParams.hasOwnProperty('cust_params')) {
            targetingKeyValues = Utilities.appendToObject(targetingKeyValues, htSlotParams.cust_params);
        }

        /* Start the query object off with all the default values. */
        /* eslint-disable camelcase */
        var queryObj = {
            correlator: System.generateUniqueId(16, 'NUM'),
            iu: htSlotParams.iu,
            description_url: htSlotParams.description_url,
            output: 'vast',
            sz: sizeString,
            url: Browser.getPageUrl(),
            cust_params: __buildCustParamsString(targetingKeyValues)
        };
        /* eslint-enable camelcase */

        /* Loop through all the params and set them on the query object. If the param
         * already exists, the one here will override that. */
        for (var key in htSlotParams) {
            if (!htSlotParams.hasOwnProperty(key)) {
                continue;
            }

            /* Fixed and special params cannot be set by the publisher, so if they try, ignore it. */
            if (__fixedParams.hasOwnProperty(key) || __specialParams.indexOf(key) !== -1) {
                continue;
            }

            queryObj[key] = htSlotParams[key];
        }

        /* Copy in the fixed params. */
        queryObj = Utilities.appendToObject(queryObj, __fixedParams);

        /* Build the final request and return it. */
        return Network.buildUrl(__baseUrls.dfp, null, queryObj);
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        /* eslint-disable camelcase */
        __fixedParams = {
            env: 'vp',
            gdfp_req: 1,
            unviewed_position_start: 1
        };
        /* eslint-enable camelcase */

        __specialParams = ['sz', 'cust_params', 'correlator'];

        __targetingSubGroups = ['price', 'deal'];

        __baseUrls = {
            dfp: 'https://securepubads.g.doubleclick.net/gampad/ads'
        };
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Data
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */


        mediateVideoBids: mediateVideoBids,
        buildDfpMvt: buildDfpMvt
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = MvtBuilder();
},{}],27:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var SpaceCamp = require(61);
var System = require(32);
var Utilities = require(33);
var Whoopsie = require(34);
var UserAgentMatcher = require(22);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * All network call related functionality.
 *
 * @class
 */

/* Send `window`` in as an argument when in TEST mode to allow for injecting the
 * fake XMLHttpRequest class. */
function Network() { // eslint-disable-line no-inline-comments
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    var __xhrSupported;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    function isXhrSupported() {
        return __xhrSupported;
    }

    function objToQueryString(obj) {

        var queryString = '';

        for (var param in obj) {
            if (!obj.hasOwnProperty(param)) {
                continue;
            }

            if (Utilities.isObject(obj[param])) {
                for (var prop in obj[param]) {
                    if (!obj[param].hasOwnProperty(prop)) {
                        continue;
                    }

                    queryString += param + '%5B' + prop + '%5D=' + encodeURIComponent(obj[param][prop]) + '&';
                }
            } else if (Utilities.isArray(obj[param])) {
                for (var i = 0; i < obj[param].length; i++) {
                    queryString += param + '%5B%5D=' + encodeURIComponent(obj[param][i]) + '&';
                }
            } else {
                queryString += param + '=' + encodeURIComponent(obj[param]) + '&';
            }
        }

        return queryString.slice(0, -1);
    }

    function buildUrl(base, path, query) {

        if (base[base.length - 1] !== '/' && path) {
            base += '/';
        }

        path = path || [];

        if (Utilities.isObject(query)) {
            query = objToQueryString(query);
        }
        query = query ? '?' + query : '';

        return base + path.join('/') + query;
    }

    /* Main
     * ---------------------------------- */

    function jsonp(args) {

        /* This will be appended to the front of all Scribe messages in this function
         * to make keeping track of XHR status' easier. */

        /* We declare this up here because we need to declare before use. We set it right
         * before adding the script to the DOM. */
        var startTime = null;

        /* Use the provided scope or default to window. */
        var scope = args.scope || window;

        /* Create a new DOM script tag. */
        var script;

        if (args.useImgTag) {
            script = scope.document.createElement('img');
        } else {
            script = scope.document.createElement('script');
            script.type = 'text/javascript';

            /* Set whether to load this script async or sync. Default is async. */
            var async = true;
            if (args.hasOwnProperty('async')) {
                async = args.async;
            }
            script.async = async;
        }

        /* Set the base URL. */
        var url = args.url;

        /* If data is given it must be serialized and appended to the URL. */
        if (args.data) {
            var qs;

            if (Utilities.isString(args.data)) {
                qs = args.data;
            } else {
                qs = objToQueryString(args.data);
            }

            url = buildUrl(args.url, null, qs);
        }

        /* Reference to the timer so it can be cleared if `onSuccess` runs before
         * timeout. */
        var timer;

        /* Holds the state of whether the timeout has occurred or not. */
        var timedOut = false;

        var onTimeout = function () {
            try {
                if (timedOut) {
                    return;
                }

                timedOut = true;

                if (args.onTimeout) {
                    args.onTimeout();
                }

                /* If it is a real script, and continue after timeout is true, we don't want
                 * to remove it from the DOM so it can actually continue. */
                if (!args.useImgTag && !args.continueAfterTimeout) {
                    script.parentNode.removeChild(script);
                }
            } catch (ex) {
            }
        };

        if (args.globalTimeout) {
            SpaceCamp.services.TimerService.addTimerCallback(args.sessionId, onTimeout);
        }

        /* Timeout is only active when both a timeout and a callback are provided, since
         * unlike XHR the timeout here doesn't actually cancel the call. */
        if (args.timeout) {
            timer = setTimeout(onTimeout, args.timeout);
        }

        /* Run `onSuccess` when the script loads. */
        var onSuccess = function () {
            try {
                if (!timedOut) {
                    clearTimeout(timer);
                } else {
                    if (!args.continueAfterTimeout) {
                        return;
                    }
                }

                if (args.onSuccess) {
                    args.onSuccess(null, System.now(), timedOut);
                }

                timedOut = true;

                if (!args.useImgTag) {
                    script.parentNode.removeChild(script);
                }
            } catch (ex) {
            }
        };

        /* Older IE version don't support onload. We check onload like this because in
         * new browsers it is defaulted to null, whereas on browsers that don't support
         * it it's undefined. */
        if (script.onload === null) {
            script.onload = onSuccess;
        } else {
            script.onreadystatechange = function () {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    /* This needs to be cleared, or we get a memory leak. */
                    script.onreadystatechange = null;
                    onSuccess();
                }
            };
        }

        /* The script.onerror is not supported in older versions of IE, so this will not
         * always work. In those cases errors will be reported as timeouts when those
         * trigger. */
        var onFailure = function () {
            try {
                if (!timedOut) {
                    clearTimeout(timer);
                    timedOut = true;
                } else {
                    if (!args.continueAfterTimeout) {
                        return;
                    }
                }

                if (args.onFailure) {
                    args.onFailure();
                }

                if (!args.useImgTag) {
                    script.parentNode.removeChild(script);
                }
            } catch (ex) {
            }
        };

        script.onerror = onFailure;

        startTime = System.now();

        /* Set the script tag URL. This is down here because in the case of useImgTag,
         * the image starts loading the second src is set. */
        script.src = url;

        if (!args.useImgTag) {
            /* Locate the first script tag on the page. This will always exist, as if it
             * didn't how would we be here now? */
            var node = scope.document.getElementsByTagName('script')[0];

            /* If scope is an iframe */
            if (!node) {
                if (UserAgentMatcher.msie || UserAgentMatcher.msedge || UserAgentMatcher.mozilla) {
                    scope.onload = function () {
                        scope.document.body.appendChild(script);
                    };
                } else {
                    scope.document.body.appendChild(script);
                }
            } else {
                /* Get a starting timestamp and insert the script tag into the DOM. */
                node.parentNode.insertBefore(script, node);
            }
        }

        return startTime;
    }

    function ajax(args) {

        /* If XHR isn't supported, see if switching to JSONP is an option. If it isn't
         * throw an error. */
        if (!isXhrSupported()) {
            if (args.jsonp && args.method === 'GET') {
                return jsonp(args);
            }

            throw Whoopsie('INTERNAL_ERROR', 'XHR is not supported in this browser.');
        }

        /* This will be appended to the front of all Scribe messages in this function
         * to make keeping track of XHR status' easier. */

        /* We declare this up here because we need to declare before use. We set it right
         * before doing `xhr.send()`. */
        var startTime = null;

        /* Use the provided scope or default to window. */
        var scope = args.scope || window;

        /* Create the XHR object. */
        var xhr = new scope.XMLHttpRequest();

        /* Set the base url. */
        var url = args.url;

        /* The data is processed depending on the request method and type of the data.
         * We are mirroring jQuery's behavior for how to serialize the data. If no data
         * is provided, it remains null, and calling `xhr.send(null)` does not cause any
         * issues. */
        var data = null;
        if (args.data) {
            if (args.method === 'GET') {
                var qs;

                if (Utilities.isString(args.data)) {
                    qs = args.data;
                } else {
                    qs = objToQueryString(args.data);
                }

                url = buildUrl(args.url, null, qs);
            } else if (args.method === 'POST') {
                if (Utilities.isString(args.data)) {
                    data = args.data;
                } else {
                    data = JSON.stringify(args.data);
                }
            }
        }

        /* All XHR requests are default async. */
        var async = true;
        if (args.hasOwnProperty('async')) {
            async = args.async;
        }

        /* This needs to be open first before we can set a bunch of it's properties, such
         * as `withCredentials` and `timeout`. */
        xhr.open(args.method, url, async);

        /* This is the default content-type set by jQuery. This, along with "multi-part/form-data"
         * and "text/plain", do not cause a pre-flight call. All other content-types do. */
        var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
        if (args.contentType !== undefined) {
            contentType = args.contentType;
        }

        if (contentType) {
            xhr.setRequestHeader('Content-Type', contentType);
        }

        /* We set any user specified headers here. We always set the "X-Request-With" header
         * as this means that the receiving server must explicitly support CORS. */
        if (args.headers) {
            if (!args.headers.hasOwnProperty('X-Request-With')) {
                xhr.setRequestHeader('X-Request-With', 'XMLHttpRequest');
            }

            for (var field in args.headers) {
                if (!args.headers.hasOwnProperty(field)) {
                    continue;
                }

                xhr.setRequestHeader(field, args.headers[field]);
            }
        }

        /* Set this flag to true to send cookies with the request. */
        if (args.withCredentials) {
            xhr.withCredentials = true;
        }

        var timer;
        var timedOut = false;

        /* Wrap timeout callback in a try catch since this will be run much
         * later in the global scope meaning we won't be able to capture any errors otherwise. */
        var onTimeout = function () {
            try {
                if (timedOut) {
                    return;
                }

                timedOut = true;

                if (args.onTimeout) {
                    args.onTimeout();
                }
            } catch (ex) {
            }
        };

        if (args.globalTimeout) {
            SpaceCamp.services.TimerService.addTimerCallback(args.sessionId, onTimeout);
        }

        if (args.timeout) {
            if (args.continueAfterTimeout) {
                timer = setTimeout(onTimeout, args.timeout);
            } else {
                /* Set the timeout. */
                xhr.timeout = args.timeout;
                xhr.ontimeout = onTimeout;
            }
        }

        /* If a `onSuccess` or `onFailure` function is set, then add a `onreadystatechange`
         * callback. Anything but a status 200 is considered a failure. */
        if (args.onSuccess || args.onFailure) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (!timedOut) {
                        clearTimeout(timer);
                        xhr.ontimeout = null;
                    } else {
                        if (!args.continueAfterTimeout) {
                            return;
                        }
                    }


                    if (xhr.status === 200) {
                        if (args.onSuccess) {
                            try {
                                args.onSuccess(xhr.responseText, System.now(), timedOut);
                            } catch (ex) {
                            }
                        }
                    } else {
                        if (args.onFailure) {
                            try {
                                args.onFailure(xhr.status);
                            } catch (ex) {
                            }
                        }
                    }

                    /* Don't run the onTimeout handler anymore */
                    timedOut = true;
                }
            };
        }

        /* Get a starting timestamp and send the request out. */
        startTime = System.now();
        xhr.send(data);

        return startTime;
    }

    function img(args) {
        args.useImgTag = true;

        return jsonp(args);
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        __xhrSupported = window.XMLHttpRequest && typeof (new XMLHttpRequest()).responseType === 'string';
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* PubKitShrinkExports<Network> */

        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        ajax: ajax,
        jsonp: jsonp,
        img: img,
        buildUrl: buildUrl,
        objToQueryString: objToQueryString,
        isXhrSupported: isXhrSupported
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Network();
},{}],28:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Constants = require(16);
var System = require(32);
var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A static library of OpenRTB related classes and functions.
 *
 * @namespace OpenRtb
 */
function OpenRtb() {
    /**
     * An OpenRTB 2.2 Bid Request object.
     *
     * @memberof OpenRtb
     */
    function BidRequest() {
        /* Graceful fallback in case this class is invoked without `new`. */
        if (!(this instanceof BidRequest)) {
            return new BidRequest();
        }

        /* =====================================
         * Constructors/Data
         * ---------------------------------- */


        this.__bidRequest = {
            id: Number(System.generateUniqueId(8, 'NUM')),
            site: {
                page: ''
            },
            imp: []
        };

        this.__impCount = 0;
    }

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Getters and Setters
     * ---------------------------------- */

    /**
     * Sets the `BidRequest.site.page` property.
     *
     * @param {string} page The URI of the page this impression is for.
     */
    BidRequest.prototype.setPage = function (page) {

        this.__bidRequest.site.page = page;
    };

    /**
     * Sets the `BidRequest.site.ref` property.
     *
     * @param {string} ref Referrer URL that caused navigation to the current page.
     */
    BidRequest.prototype.setRef = function (ref) {

        this.__bidRequest.site.ref = ref;
    };

    /**
     * Returns the `BidRequest.id` property.
     *
     * @return {Number} Returns the
     */
    BidRequest.prototype.getId = function () {
        return this.__bidRequest.id;
    };

    /* Main
     * ---------------------------------- */

    /**
     * Adds an impression to `BidRequest.imp`.
     *
     * @param {object} banner      The impression details.
     * @param {number} banner.h    The height of the banner.
     * @param {number} banner.w    The width of the banner.
     * @param {object} ext         Object that holds extra exchange specific
     *                             information.
     * @param {string} ext.sid     If provided, this impression will be labeled with
     *                             the provided string for reporting purposes.
     * @param {number} ext.siteID  Must be a valid site ID, as specified by Index
     *                             Exchange.
     * @param {[type]} bidFloor    Minimum bid for this impression expressed in CPM.
     * @param {[type]} bidFloorCur Currency to use, in ISO-4217 format.
     */
    BidRequest.prototype.addImp = function (banner, ext, bidFloor, bidFloorCur) {

        var id = String(++this.__impCount);

        this.__bidRequest.imp.push({
            banner: banner,
            ext: ext,
            id: id,
            bidfloor: bidFloor,
            bidfloorcur: bidFloorCur
        });

        return id;
    };

    /**
     * Adds a video impression to `BidRequest.imp`. All properties except placement match the
     * OpenRTB2.2 spec; placement matches 2.5. This was due to timelines / ease of use,
     * but possibly should be reworked along with openrtb2_5.js.
     *
     * @param {object} video                    The impression details.
     * @param {array.string} video.mimes        Content MIME types supported.
     * @param {int} video.minduration           Minimum video ad duration in seconds.
     * @param {int} video.maxduration           Maximum video ad duration in seconds.
     * @param {array.int} video.protocols       Video bid response protocols.
     * @param {int} video.w                     Width of the player in pixels.
     * @param {int} video.h                     Height of the player in pixels.
     * @param {int} video.startdelay            Indicates the start delay in seconds
     *                                          for preroll, midroll, or postroll ad placement.
     * @param {array.int} video.playbackmethod  List of allowed playback methods.
     * @param {array.int} video.api             List of supported API frameworks.
     * @param {int} video.placement             Placement type for the impression. (not in 2.2)
     * @param {object} ext         Object that holds extra exchange specific
     *                             information.
     * @param {string} ext.sid     If provided, this impression will be labeled with
     *                             the provided string for reporting purposes.
     * @param {string} ext.siteID  Must be a valid site ID, as specified by Index
     *                             Exchange.
     * @param {number} bidFloor    Minimum bid for this impression expressed in CPM.
     * @param {string} bidFloorCur Currency to use, in ISO-4217 format.
     */
    BidRequest.prototype.addVideoImp = function (video, ext, bidFloor, bidFloorCur) {

        var id = String(++this.__impCount);

        this.__bidRequest.imp.push({
            video: video,
            ext: ext,
            id: id,
            bidfloor: bidFloor,
            bidfloorcur: bidFloorCur
        });

        return id;
    };

    /**
     * Adds an extended field record to `BidRequest.user.eids`.
     * This method is ported from openRTB 3.0
     *
     * @param {object} data        User extended ID data object.
     */
    BidRequest.prototype.addUserEid = function (data) {

        this.__bidRequest.user = this.__bidRequest.user || {};
        this.__bidRequest.user.eids = this.__bidRequest.user.eids || [];
        this.__bidRequest.user.eids.push(data);
    };

    /**
     * Adds GDPR info to extension fields for User and Regs.
     * See https://iabtechlab.com/wp-content/uploads/2018/02/OpenRTB_Advisory_GDPR_2018-02.pdf
     *
     * @param {integer} gdprApplies      Whether GDPR has been determined to apply
     *                                   to this request. 1 = yes, 0 = no.
     * @param {string} gdprConsentString The daisy bit string encoding all user consent
     *                                   in Base64 encoding.
     */
    BidRequest.prototype.setGdprConsent = function (gdprApplies, gdprConsentString) {

        this.__bidRequest.regs = this.__bidRequest.regs || {};
        this.__bidRequest.regs.ext = this.__bidRequest.regs.ext || {};
        this.__bidRequest.regs.ext.gdpr = gdprApplies ? 1 : 0;

        this.__bidRequest.user = this.__bidRequest.user || {};
        this.__bidRequest.user.ext = this.__bidRequest.user.ext || {};
        this.__bidRequest.user.ext.consent = gdprConsentString || '';
    };

    /**
     * Adds US Privacy info to regs.ext field according to
     * https://iabtechlab.com/wp-content/uploads/2019/11/OpenRTB-Extension-U.S.-Privacy-IAB-Tech-Lab.pdf
     *
     * @param {object} uspConsent     US privacy object containing version and uspString
     */
    BidRequest.prototype.setUspConsent = function (uspConsent) {

        this.__bidRequest.regs = this.__bidRequest.regs || {};
        this.__bidRequest.regs.ext = this.__bidRequest.regs.ext || {};
        // eslint-disable-next-line camelcase
        this.__bidRequest.regs.ext.us_privacy = uspConsent.uspString;
    };

    /**
     * Sets the top level `ext` property.
     *
     * @param {object} ext
     */
    BidRequest.prototype.setExt = function (ext) {

        this.__bidRequest.ext = ext;
    };

    /**
     * Converts the bid request to a JSON string.
     *
     * @return {string} The JSON stringified bid request.
     */
    BidRequest.prototype.stringify = function () {
        return JSON.stringify(this.__bidRequest);
    };

    /**
     * An OpenRtb 2.2 Bid Response object.
     *
     * @memberof OpenRtb
     */
    function BidResponse(bidResponse) {
        /* Graceful fallback in case this class is invoked without `new`. */
        if (!(this instanceof BidResponse)) {
            return new BidResponse(bidResponse);
        }

        /* =====================================
         * Constructors/Data
         * ---------------------------------- */



        try {
            this.__bidResponse = bidResponse;
        } catch (ex) {
            throw Whoopsie('INTERNAL_ERROR', 'cannot parse `bidResponse`');
        }
    }

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /**
     * Parses a raw bid for the relevant information.
     *
     * @private
     *
     * @param  {object} rawBid The bid to be parsed.
     * @param  {array}  bids   The array that all the parsed bids are pushed to.
     */
    BidResponse.prototype.__parseBid = function (rawBid, bids) {
        var bid = {};

        if (rawBid.hasOwnProperty('impid')) {
            bid.impid = rawBid.impid;
        }

        if (rawBid.hasOwnProperty('price')) {
            bid.price = rawBid.price;
        }

        if (rawBid.hasOwnProperty('adm')) {
            bid.adm = rawBid.adm;
        }

        if (rawBid.hasOwnProperty('ext')) {
            bid.ext = rawBid.ext;
        }

        if (rawBid.hasOwnProperty('dealid')) {
            bid.dealid = rawBid.dealid;
        }

        if (rawBid.hasOwnProperty('nurl')) {
            bid.nurl = rawBid.nurl;
        }

        if (rawBid.hasOwnProperty('nbr')) {
            bid.nbr = rawBid.nbr;
        }

        if (rawBid.hasOwnProperty('w')) {
            bid.w = rawBid.w;
        }

        if (rawBid.hasOwnProperty('h')) {
            bid.h = rawBid.h;
        }

        bids.push(bid);
    };

    /**
     * Parses a raw bid for the relevant information.
     *
     * @private
     *
     * @param  {object} rawBid The bid to be parsed.
     * @param  {array}  bids   The array that all the parsed bids are pushed to.
     */
    BidResponse.prototype.__parseVideoBid = function (rawBid, bids) {
        var bid = {};

        if (rawBid.hasOwnProperty('price')) {
            bid.price = rawBid.price;
        }

        if (rawBid.hasOwnProperty('ext')) {
            bid.ext = {};
            if (rawBid.ext.hasOwnProperty('vasturl')) {
                bid.ext.vasturl = rawBid.ext.vasturl;
            }

            if (rawBid.ext.hasOwnProperty('dealid')) {
                bid.ext.dealid = rawBid.ext.dealid;
            }
        }

        if (rawBid.hasOwnProperty('impid')) {
            bid.impid = rawBid.impid;
        }

        bids.push(bid);
    };

    /* Getters and Setters
     * ---------------------------------- */

    /**
     * Gets the value of `BidResponse.id`.
     *
     * @return {string} The bid response id.
     */
    BidResponse.prototype.getId = function () {
        return this.__bidResponse.id;
    };

    /**
     * Gets the value of `BidResponse.cur`. Defaults to 'USD'.
     *
     * @return {string} 3-character country code.
     */
    BidResponse.prototype.getCur = function () {
        return this.__bidResponse.cur || 'USD';
    };

    /**
     * Gets the value of `BidResponse.ext`.
     *
     * @return {object} Object of akamai information
     */
    BidResponse.prototype.getExt = function () {
        return this.__bidResponse.ext;
    };

    /**
     * Gets all the bids.
     *
     * @return {array} An array of all the bids.
     */
    BidResponse.prototype.getBids = function () {
        var bids = [];
        var innerBids;
        var seatbid;

        if (!this.__bidResponse.hasOwnProperty('seatbid')) {
            return bids;
        }

        seatbid = this.__bidResponse.seatbid;
        for (var i = 0; i < seatbid.length; i++) {
            if (!seatbid[i].hasOwnProperty('bid')) {
                continue;
            }

            innerBids = seatbid[i].bid;
            for (var j = 0; j < innerBids.length; j++) {
                this.__parseBid(innerBids[j], bids);
            }
        }

        return bids;
    };

    /**
     * Gets all the video bids.
     *
     * @return {array} An array of all the bids.
     */
    BidResponse.prototype.getVideoBids = function () {
        var bids = [];
        var innerBids;
        var seatbid;

        if (!this.__bidResponse.hasOwnProperty('seatbid')) {
            return bids;
        }

        seatbid = this.__bidResponse.seatbid;
        for (var i = 0; i < seatbid.length; i++) {
            if (!seatbid[i].hasOwnProperty('bid')) {
                continue;
            }

            innerBids = seatbid[i].bid;
            for (var j = 0; j < innerBids.length; j++) {
                this.__parseVideoBid(innerBids[j], bids);
            }
        }

        return bids;
    };

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        BidRequest: BidRequest,
        BidResponse: BidResponse
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = OpenRtb();
},{}],29:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Constants = require(16);
var System = require(32);
var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A static library of OpenRTB related classes and functions for 2.5.
 *
 * @namespace OpenRtb
 */
function OpenRtb() {
    /**
     * An OpenRTB 2.2 Bid Request object.
     *
     * @memberof OpenRtb
     */
    function BidRequest() {
        /* Graceful fallback in case this class is invoked without `new`. */
        if (!(this instanceof BidRequest)) {
            return new BidRequest();
        }

        /* =====================================
         * Constructors/Data
         * ---------------------------------- */


        this.__bidRequest = {
            id: System.generateUniqueId(8, 'NUM'),
            site: {
                page: ''
            },
            imp: []
        };

        this.__impCount = 0;
    }

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Getters and Setters
     * ---------------------------------- */

    /**
     * Sets the `BidRequest.site.page` property.
     *
     * @param {string} page The URI of the page this impression is for.
     */
    BidRequest.prototype.setPage = function (page) {

        this.__bidRequest.site.page = page;
    };

    /**
     * Sets the `BidRequest.site.ref` property.
     *
     * @param {string} ref Referrer URL that caused navigation to the current page.
     */
    BidRequest.prototype.setRef = function (ref) {

        this.__bidRequest.site.ref = ref;
    };

    /**
     * Sets the `BidRequest.site.id` property.
     *
     * @param {string} id Exchange-specific site ID.
     */
    BidRequest.prototype.setSiteId = function (id) {

        this.__bidRequest.site.id = id;
    };

    /**
     * Sets the `BidRequest.site.publisher` property.
     *
     * @param {object} publisher Publisher object as specified by openRTB.
     */
    BidRequest.prototype.setPublisher = function (publisher) {

        this.__bidRequest.site.publisher = publisher;
    };

    /**
     * Sets the `BidRequest.site.ext` property.
     *
     * @param {object} ext Anything goes field for showhorning random things you want into the spec.
     */
    BidRequest.prototype.setSiteExt = function (ext) {

        this.__bidRequest.site.ext = ext;
    };

    /**
     * Sets the `device.deviceType` property.
     *
     * @param {string/number} deviceType Either a valid iAB device type ID or string returned by our device type checker.
     */
    BidRequest.prototype.deviceTypeMapping = {
        desktop: 2,
        mobile: 4,
        tablet: 5
    };
    BidRequest.prototype.setDeviceType = function (deviceType) {

        this.__bidRequest.device = this.__bidRequest.device || {};
        this.__bidRequest.device.devicetype = this.deviceTypeMapping[deviceType] ? this.deviceTypeMapping[deviceType] : deviceType;
    };

    /**
     * Sets the `device.source` property.
     *
     * @param {object} source Bid request upstream configuration object.
     */
    BidRequest.prototype.setSource = function (source) {

        this.__bidRequest.source = source;
    };

    /**
     * Sets the top level `tmax` property.
     *
     * @param {number} tmax Maximum time in milliseconds the exchange allows for bids to be received including Internet latency to avoid timeout.
     */
    BidRequest.prototype.setTmax = function (tmax) {

        this.__bidRequest.tmax = tmax;
    };

    /**
     * Sets the top level `at` property.
     *
     * @param {number} at Auction type, where 1 = first place, 2 = second place, or custom values over 500.
     */
    BidRequest.prototype.setAuctionType = function (at) {

        this.__bidRequest.at = at;
    };

    /**
     * Sets the top level `ext` property.
     *
     * @param {object} ext
     */
    BidRequest.prototype.setExt = function (ext) {

        this.__bidRequest.ext = ext;
    };

    /**
     * Sets the request to test mode.
     */
    BidRequest.prototype.setTest = function () {
        /* 1/0 according to specifications */
        this.__bidRequest.test = 1;
    };

    /**
     * Returns the `BidRequest.id` property.
     *
     * @return {Number} Returns the
     */
    BidRequest.prototype.getId = function () {
        return this.__bidRequest.id;
    };

    /* Main
     * ---------------------------------- */


    /**
     * Adds an impression to `BidRequest.imp`.
     *
     * @param {object} imp              The impression details.
     * @param {object} imp.banner
     * @param {number} imp.banner.w     The width of the banner, or the preferred width.
     * @param {number} imp.banner.h     The height of the banner, or the preferred height.
     * @param {number} imp.banner.pos   Ad position on screen.
     * @param {array}  imp.banner.format        List of sizes of the banner.
     * @param {number} imp.banner.format.w      The width of one size of the banner.
     * @param {number} imp.banner.format.h      The height of one size of the banner.
     * @param {object} imp.banner.format.ext    Extra data attached to one size of the banner.
     * @param {object} imp.ext
     * @param {string} imp.ext.sid      If provided, this impression will be labeled with
     *                                  the provided string for reporting purposes.
     * @param {number} imp.ext.siteID   Must be a valid site ID, as specified by Index
     *                                  Exchange.
     * @param {string} imp.tagid
     * @param {number} imp.bidFloor     Minimum bid for this impression expressed in CPM.
     * @param {string} imp.bidFloorCur  Currency to use, in ISO-4217 format.
     */
    BidRequest.prototype.addImp = function (imp) {

        if (!imp.id) {
            imp.id = String(++this.__impCount);
        }

        this.__bidRequest.imp.push(imp);

        return imp.id;
    };

    /**
     * Set the impression array in `BidRequest.imp` directly.
     *
     * @param {object} imps             Array of impressions, see addImp() for schema definition.
     */
    BidRequest.prototype.setImps = function (imps) {
        this.__bidRequest.imp = imps;
    };

    /**
     * Adds GDPR info to extension fields for User and Regs.
     * See https://iabtechlab.com/wp-content/uploads/2018/02/OpenRTB_Advisory_GDPR_2018-02.pdf
     *
     * @param {integer} gdprApplies      Whether GDPR has been determined to apply
     *                                   to this request. 1 = yes, 0 = no.
     * @param {string} gdprConsentString The daisy bit string encoding all user consent
     *                                   in Base64 encoding.
     */
    BidRequest.prototype.setGdprConsent = function (gdprApplies, gdprConsentString) {

        this.__bidRequest.regs = this.__bidRequest.regs || {};
        this.__bidRequest.regs.ext = this.__bidRequest.regs.ext || {};
        this.__bidRequest.regs.ext.gdpr = gdprApplies ? 1 : 0;

        this.__bidRequest.user = this.__bidRequest.user || {};
        this.__bidRequest.user.ext = this.__bidRequest.user.ext || {};
        this.__bidRequest.user.ext.consent = gdprConsentString || '';
    };

    /**
     * Converts the bid request to a JSON string.
     *
     * @return {string} The JSON stringified bid request.
     */
    BidRequest.prototype.stringify = function () {
        return JSON.stringify(this.__bidRequest);
    };

    /**
     * An OpenRtb 2.2 Bid Response object.
     *
     * @memberof OpenRtb
     */
    function BidResponse(bidResponse) {
        /* Graceful fallback in case this class is invoked without `new`. */
        if (!(this instanceof BidResponse)) {
            return new BidResponse(bidResponse);
        }

        /* =====================================
         * Constructors/Data
         * ---------------------------------- */



        this.__bidResponse = bidResponse;
    }

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /**
     * Parses a raw bid for the relevant information.
     *
     * @private
     *
     * @param  {object} rawBid The bid to be parsed.
     * @param  {array}  bids   The array that all the parsed bids are pushed to.
     */
    BidResponse.prototype.__parseBid = function (rawBid, bids) {
        var bid = {};

        if (rawBid.hasOwnProperty('impid')) {
            bid.impid = rawBid.impid;
        }

        if (rawBid.hasOwnProperty('price')) {
            bid.price = rawBid.price;
        }

        if (rawBid.hasOwnProperty('adm')) {
            bid.adm = rawBid.adm;
        }

        if (rawBid.hasOwnProperty('ext')) {
            bid.ext = rawBid.ext;
        }

        if (rawBid.hasOwnProperty('dealid')) {
            bid.dealid = rawBid.dealid;
        }

        if (rawBid.hasOwnProperty('nurl')) {
            bid.nurl = rawBid.nurl;
        }

        if (rawBid.hasOwnProperty('nbr')) {
            bid.nbr = rawBid.nbr;
        }

        if (rawBid.hasOwnProperty('w')) {
            bid.w = rawBid.w;
        }

        if (rawBid.hasOwnProperty('h')) {
            bid.h = rawBid.h;
        }

        bids.push(bid);
    };

    /* Getters and Setters
     * ---------------------------------- */

    /**
     * Gets the value of `BidResponse.id`.
     *
     * @return {string} The bid response id.
     */
    BidResponse.prototype.getId = function () {
        return this.__bidResponse.id;
    };

    /**
     * Gets the value of `BidResponse.cur`. Defaults to 'USD'.
     *
     * @return {string} 3-character country code.
     */
    BidResponse.prototype.getCur = function () {
        return this.__bidResponse.cur || 'USD';
    };

    /**
     * Gets all the bids.
     *
     * @return {array} An array of all the bids.
     */
    BidResponse.prototype.getBids = function () {
        var bids = [];
        var innerBids;
        var seatbid;

        if (!this.__bidResponse.hasOwnProperty('seatbid')) {
            return bids;
        }

        seatbid = this.__bidResponse.seatbid;
        for (var i = 0; i < seatbid.length; i++) {
            if (!seatbid[i].hasOwnProperty('bid')) {
                continue;
            }

            innerBids = seatbid[i].bid;
            for (var j = 0; j < innerBids.length; j++) {
                this.__parseBid(innerBids[j], bids);
            }
        }

        return bids;
    };

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        BidRequest: BidRequest,
        BidResponse: BidResponse
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = OpenRtb();
},{}],30:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var SpaceCamp = require(61);
var System = require(32);
var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A multi-level centralized logging module that formats logged messages and
 * appends useful information.
 *
 * @class
 */
function Scribe() {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /**
     * The current logging level.
     *
     * @type {LoggingLevels}
     */
    var __level;

    /**
     * The text to append to the front of all messages printed.
     *
     * @type {string}
     */
    var __header;

    /**
     * Implements the same interface as `window.console` but all the
     * functions point to `__nullFUnction`.
     *
     * @type {object}
     */

    /* Public
     * ---------------------------------- */

    /**
     * A reference to the original `console` object so that it can be
     * re-enabled after being disabled.
     *
     * @type {object}
     */

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /* Helpers
     * ---------------------------------- */

    /**
     * Generates a prefix to append to the front of a message. The prefix contains
     * the header (if set) and the function from which the Scribe function was
     * invoked.
     *
     * @private
     *
     * @return {string} The prefix string.
     */
    function __getPrefix() {
        /* Get the current stack and parse it for the third item up in the stack as that
         * will always be in function that invoked the Scribe function */
        var caller = 'unknown';

        /* All characters between an 'at ' and the end of the line. */
        var re = /at\s(.+)/g;
        var stack = Error().stack;
        var match;

        var i = 0;
        while ((match = re.exec(stack)) !== null) { // eslint-disable-line no-cond-assign
            if (i === 2) {
                caller = match[1];

                break;
            }

            i++;
        }

        /* Create the prefix and return it. */
        return (__header ? __header + ' | ' : '') + caller + ':';
    }

    /* Getters and Setters
     * ---------------------------------- */

    /**
     * Sets the logging level.
     *
     * @public
     *
     * @param {string} level One of the predefined logging levels in
     *                       `LoggingLevels`.
     */
    function setLevel(level) {

        __level = Scribe.LoggingLevels[level];
    }

    /**
     * Sets the header used in the log message.
     *
     * @public
     *
     * @param {string} header The text used as a prefix to all future log messages.
     */
    function setHeader(header) {

        __header = header;
    }

    /* Main
     * ---------------------------------- */

    /**
     * Disables any logging to the console from outside. Only works in the DEBUG
     * build.
     *
     * @public
     */

    /**
     * Enables any logging to the console from outside. Only works in the DEBUG
     * build.
     *
     * @public
     */

    /**
     * Appends a prefix and outputs error messages to the console.
     *
     * @public
     *
     * @param  {...*}    Items that should be displayed in the error message.
     */
    function error() {
        if (__level < Scribe.LoggingLevels.ERROR) {
            return;
        }

        /* Convert `arguments` into an array and append the prefix to the front. */
        var args = Array.prototype.slice.call(arguments);
        args.unshift(__getPrefix());

        console.error.apply(console, args);
    }

    /**
     * Appends a prefix and outputs warning messages to the console.
     *
     * @public
     *
     * @param  {...*}    Items that should be displayed in the warning message.
     */
    function warn() {
        if (__level < Scribe.LoggingLevels.WARN) {
            return;
        }

        /* Convert `arguments` into an array and append the prefix to the front. */
        var args = Array.prototype.slice.call(arguments);
        args.unshift(__getPrefix());

        console.warn.apply(console, args);
    }

    /**
     * Appends a prefix and outputs info messages to the console.
     *
     * @public
     *
     * @param  {...*}    Items that should be displayed in the info message.
     */
    function info() {
        if (__level < Scribe.LoggingLevels.INFO) {
            return;
        }

        /* Convert `arguments` into an array and append the prefix to the front. */
        var args = Array.prototype.slice.call(arguments);
        args.unshift(__getPrefix());

        console.info.apply(console, args);
    }

    /**
     * Appends a prefix and outputs tables to the console.
     *
     * @public
     *
     * @param  {...*}    Items that should be displayed in the table format.
     */
    function table() {
        if (__level < Scribe.LoggingLevels.INFO) {
            return;
        }

        console.info.apply(console, [__getPrefix()]);
        console.table.apply(console, arguments);
    }

    /**
     * Appends a prefix and outputs debug messages to the console.
     *
     * @public
     *
     * @param  {...*}    Items that should be displayed in the debug message.
     */
    function debug() {
        if (__level < Scribe.LoggingLevels.DEBUG) {
            return;
        }

        /* Convert `arguments` into an array and append the prefix to the front. */
        var args = Array.prototype.slice.call(arguments);
        args.unshift(__getPrefix());

        console.debug.apply(console, args);
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {

        __level = Scribe.LoggingLevels.DEBUG;
        __header = SpaceCamp.NAMESPACE + '_' + System.generateUniqueId(4);
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */

        __type__: 'Scribe',

        /* Data
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */



        setLevel: setLevel,
        setHeader: setHeader,

        error: error,
        warn: warn,
        info: info,
        table: table,
        debug: debug
    };
}

////////////////////////////////////////////////////////////////////////////////
// Enumerations ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * An enumeration of the different logging levels available.
 *
 * @memberof Scribe
 * @readonly
 * @enum {number}
 */
Scribe.LoggingLevels = {
    /** No messages are printed. */
    SILENT: 0,

    /** Messages up to errors are printed. */
    ERROR: 1,

    /** Messages up to warnings are printed. */
    WARN: 2,

    /** Messages up to info and tables are printed. */
    INFO: 3,

    /** Messages up to debug are printed. */
    DEBUG: 4
};

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Scribe();
},{}],31:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Utilities = require(33);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * [Factory description]
 *
 * @class
 */
function Size() {
    /* =====================================
     * Functions
     * ---------------------------------- */

    /**
     * List of valid special size string constants.
     *
     * @private {Object}
     */
    var __specialSizeStrings = {
        'native': true, // eslint-disable-line quote-props
        fullwidth: true
    };

    /* Utilities
     * ---------------------------------- */

    function isSpecialSize(size) {
        return __specialSizeStrings[size];
    }

    function isSize(size) {
        if (Utilities.isArray(size, 'number') && size.length === 2) {
            return true;
        }

        return false;
    }

    function isSizes(sizes) {
        if (isSize(sizes)) {
            return true;
        }

        if (!Utilities.isArray(sizes, 'array')) {
            return false;
        }

        for (var i = 0; i < sizes.length; i++) {
            if (!isSize(sizes[i])) {
                return false;
            }
        }

        return true;
    }

    function arrayToString(arr, separator, multiplier) {

        separator = separator || ',';
        multiplier = multiplier || 'x';

        var str = '';

        /* Handle whether we got an array of sizes or just one size */
        if (Utilities.isArray(arr, 'array')) {
            for (var i = 0; i < arr.length; i++) {
                str += isSpecialSize(arr[i]) ? arr[i] : arr[i][0] + multiplier + arr[i][1] + separator;
            }
        } else if (isSpecialSize(arr)) {
            str += arr + separator;
        } else {
            str += arr[0] + multiplier + arr[1] + separator;
        }

        return str.slice(0, -1);
    }

    function stringToArray(str, separator, multiplier) {

        separator = separator || ',';
        multiplier = multiplier || 'x';

        var arr = [];

        var sizes = str.split(separator);
        for (var i = 0; i < sizes.length; i++) {
            if (isSpecialSize(sizes[i])) {
                arr.push(sizes[i]);
            } else {
                var size = sizes[i].split(multiplier);
                arr.push([Number(size[0]), Number(size[1])]);
            }
        }

        return arr;
    }

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* PubKitShrinkExports<Size> */
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        arrayToString: arrayToString,
        stringToArray: stringToArray,
        isSpecialSize: isSpecialSize,
        isSize: isSize,
        isSizes: isSizes
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Size();
},{}],32:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Constants = require(16);
var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A module that provides system level utility to the many layers of the wrapper
 *
 * @namespace System
 * @static
 */
function System() {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Main
     * ---------------------------------- */

    var __sharedDateObj;

    var UidCharacterSets = {
        ALPHANUM: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        ALPHA: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        ALPHA_UPPER: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        ALPHA_LOWER: 'abcdefghijklmnopqrstuvwxyz',
        HEX: '0123456789abcdef',
        NUM: '0123456789'
    };

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Main
     * ---------------------------------- */

    function documentWrite(doc, data) {
        doc.open('text/html', 'replace');
        doc.write(data);
        doc.close();
    }

    /**
     * Creates a unique identifier of the given length.
     *
     * @param  {number} len The length of the unique id generated.
     * @return {string}     A unique identifier that was randomly generated.
     */
    function generateUniqueId(len, charSet) {

        len = len || Constants.DEFAULT_UID_LENGTH;
        charSet = charSet || Constants.DEFAULT_UID_CHARSET;

        var uid = '';
        for (var i = 0; i < len; i++) {
            uid += UidCharacterSets[charSet].charAt(Math.floor(Math.random() * UidCharacterSets[charSet].length));
        }

        return uid;
    }

    /**
     * Creates a v4 UUID in the format of xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
     *
     * @return {string}     A RFC 4122 compliant v4 UUID
     */
    function generateUuid() {
        return generateUniqueId(8, 'HEX')
                 + '-' + generateUniqueId(4, 'HEX')
                 + '-4' + generateUniqueId(3, 'HEX')
                 + '-' + '89ab'.charAt(Math.floor(Math.random() * 4)) + generateUniqueId(3, 'HEX')
                 + '-' + generateUniqueId(8, 'HEX');
    }

    /**
     * Returns the current unix time.
     *
     * @return {number} The current unix time in milliseconds.
     */
    function now() {
        return (new Date()).getTime();
    }

    /**
     * Returns the timezone offset.
     * @return {number} [description]
     */
    function getTimezoneOffset() {
        return __sharedDateObj.getTimezoneOffset();
    }

    /**
     * An empty function with no side-effects.
     */
    function noOp() {}

    /* =====================================
     * Constructor
     * ---------------------------------- */

    (function __constructor() {
        __sharedDateObj = new Date();
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* PubKitShrinkExports<System> */
        /* Class Information
         * ---------------------------------- */


        /* Data
         * ---------------------------------- */
        UidCharacterSets: UidCharacterSets,

        /* Functions
         * ---------------------------------- */

        generateUniqueId: generateUniqueId,
        generateUuid: generateUuid,
        now: now,
        getTimezoneOffset: getTimezoneOffset,
        documentWrite: documentWrite,
        noOp: noOp
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = System();
},{}],33:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A static library of general utility functions.
 *
 * @namespace Utilities
 */
function Utilities() {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    var __typeRegex = /\s([a-zA-Z]+)/;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    var __defaultMatcher = function (a, b) {
        return a === b;
    };

    /* Main
     * ---------------------------------- */

    /**
     * Returns the type of a function.
     *
     * Reference: https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
     *
     * @param  {[type]} entity [description]
     * @return {[type]}        [description]
     */
    function getType(entity) {
        if (entity === undefined) {
            return 'undefined';
        }

        return {}.toString.call(entity).match(__typeRegex)[1].toLowerCase();
    }

    /**
     * Checks if entity is a string.
     *
     * @param  {*}       entity The entity to check.
     * @return {boolean}        True if entity is a string, false otherwise.
     */
    function isString(entity) {
        return getType(entity) === 'string';
    }

    /**
     * Checks if entity is a number.
     *
     * @param  {*}       entity The entity to check.
     * @return {boolean}        True if entity is a number, false otherwise.
     */
    function isNumber(entity) {
        return getType(entity) === 'number' && !isNaN(entity);
    }

    /**
     * Checks if entity is either a number or a string that represents a number.
     *
     * @param  {[type]}  entity [description]
     * @return {Boolean}        [description]
     */
    function isNumeric(entity) {
        if (getType(entity) === 'number') {
            return true;
        }

        if (getType(entity) === 'string' && !isNaN(Number(entity))) {
            return true;
        }

        return false;
    }

    /**
     * Checks if entity is an integer (i.e. a whole number in the range
     * [-Infinity, Infinity]).
     *
     * @param  {*}       entity The entity to check.
     * @return {boolean}        True if entity is an integer, false otherwise.
     */
    function isInteger(entity) {
        return isNumber(entity) && (entity % 1 === 0);
    }

    /**
     * Checks if entity is a function.
     *
     * @param  {*}       entity The entity to check.
     * @return {boolean}        True if entity is a function, false otherwise.
     */
    function isFunction(entity) {
        return getType(entity) === 'function';
    }

    /**
     * Checks if entity is a boolean.
     *
     * @param  {*}       entity The entity to check.
     * @return {boolean}        True if entity is a boolean, false otherwise.
     */
    function isBoolean(entity) {
        return getType(entity) === 'boolean';
    }

    /**
     * Checks if entity is an object (excluding arrays).
     *
     * @param  {*}       entity The entity to check.
     * @return {boolean}        True if entity is an object, false otherwise.
     */
    function isObject(entity) {
        return getType(entity) === 'object';
    }

    /**
     * Checks if entity is a regex object
     *
     * @param  {*}       entity The entity to check.
     * @return {boolean}        True if entity is an regex object, false otherwise.
     */
    function isRegex(entity) {
        return getType(entity) === 'regexp';
    }

    /**
     * Delete either given value from an object or array
     * @param  {[Object|Array]} entity [description]
     * @param  {string} value  [description]
     */
    function arrayDelete(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
    }

    /**
     * Checks if an entity is an array.
     *
     * @param  {*}       entity The entity to check.
     * @return {boolean}        True if the entity is an array, false otherwise.
     */
    function isArray(entity, type, className) {
        if (getType(entity) !== 'array') {
            return false;
        }

        if (typeof type !== 'undefined') {
            if (!isString(type)) {
                throw Whoopsie('INVALID_TYPE', '`type` must be a string');
            }

            if (type === 'class') {
                if (!isString(className)) {
                    throw Whoopsie('INVALID_TYPE', '`className` must be a string');
                }

                for (var i = 0; i < entity.length; i++) {
                    if (typeof entity[i] !== 'object' || entity[i].__type__ !== className) {
                        return false;
                    }
                }
            } else {
                for (var j = 0; j < entity.length; j++) {
                    if (getType(entity[j]) !== type) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    /**
     * Returns a randomly spliced item from an array.
     *
     * @param  {array} arr The array to randomly splice out of.
     * @return {*}         The randomly spliced item. Null if array was empty.
     */
    function randomSplice(arr) {

        return arr.length ? arr.splice(Math.floor(Math.random() * arr.length), 1)[0] : null;
    }

    /**
     * Shuffles array in place.
     * @param {Array} a items An array containing the items.
     * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
    */
    function shuffle(a) {
        var swap;
        var temp;
        var i;
        for (i = a.length - 1; i > 0; i--) {
            swap = Math.floor(Math.random() * (i + 1));
            temp = a[i];
            a[i] = a[swap];
            a[swap] = temp;
        }

        return a;
    }

    function deepCopy(entity) {

        return JSON.parse(JSON.stringify(entity));
    }

    function mergeObjects() {
        var args = Array.prototype.slice.call(arguments);

        var mergedObject = {};

        for (var i = 0; i < args.length; i++) {
            for (var property in args[i]) {
                if (!args[i].hasOwnProperty(property)) {
                    continue;
                }

                mergedObject[property] = args[i][property];
            }
        }

        return mergedObject;
    }

    function mergeArrays() {
        var args = Array.prototype.slice.call(arguments);


        var mergedArray = [];

        for (var i = 0; i < args.length; i++) {
            for (var j = 0; j < args[i].length; j++) {
                mergedArray.push(args[i][j]);
            }
        }

        return mergedArray;
    }

    /**
     * Checks if an entity is empty. Conditions for emptiness vary by type.
     *
     * @param  {(string|object|array)}  entity The entity to check.
     * @return {boolean}                       True if the entity is empty, false
     *                                         otherwise.
     */
    function isEmpty(entity) {
        /* If `entity` is a string or object, check emptiness conditions. Else throw an
         * error. */
        if (isString(entity)) {
            /* Ensure `entity` is not an empty string. */
            if (entity !== '') {
                return false;
            }
        } else if (isObject(entity)) {
            /* If its an `object ensure it has no own properties. */
            for (var key in entity) {
                if (!entity.hasOwnProperty(key)) {
                    continue;
                }

                return false;
            }
        } else if (isArray(entity)) {
            /* If `entity` is an array, ensure its length is not 0. */
            if (entity.length) {
                return false;
            }
        } else {
            throw Whoopsie('INVALID_TYPE', '`entity` must be either a string, object, or an array');
        }

        return true;
    }

    /**
     * Checks if array1 is a subset of array2 using the matcher function
     *
     * @param  {array}        array1 is the array that needs to be checked
     * @param  {array}        array2 is the array to check against
     * @param  {function}     function determining how the array element should be matched
     * @return {boolean}      True if array1 is a subset of array2, false otherwise
     */
    function isArraySubset(arr1, arr2, matcher) {

        if (typeof matcher === 'undefined') {
            matcher = __defaultMatcher;
        }

        for (var i = 0; i < arr1.length; i++) {
            var matched = false;

            for (var j = 0; j < arr2.length; j++) {
                matched = matcher(arr1[i], arr2[j]);

                if (matched) {
                    break;
                }
            }

            if (!matched) {
                return false;
            }
        }

        return true;
    }

    function tryCatchWrapper(fn, args, errorMessage, context) {

        args = args || [];
        context = context || null;
        errorMessage = errorMessage || 'Error occurred while calling function.';

        return function () {
            try {
                fn.apply(context, args);
            } catch (ex) {
            }
        };
    }

    /* eslint-disable */
    // adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
    // internal polyfill for string.prototype.repeat
    function repeatString(inString, count) {
        var str = '' + inString;
        count = +count;
        if (count != count) {
            count = 0;
        }
        if (count < 0) {
            throw new RangeError('repeat count must be non-negative');
        }
        if (count == Infinity) {
            throw new RangeError('repeat count must be less than infinity');
        }
        count = Math.floor(count);
        if (str.length == 0 || count == 0) {
            return '';
        }
        // Ensuring count is a 31-bit integer allows us to heavily optimize the
        // main part. But anyway, most current (August 2014) browsers can't handle
        // strings 1 << 28 chars or longer, so:
        if (str.length * count >= 1 << 28) {
            throw new RangeError('repeat count must not overflow maximum string size');
        }
        var rpt = '';
        for (var i = 0; i < count; i++) {
            rpt += str;
        }
        return rpt;
    }

    // adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
    // internal polyfill for string.prototype.padStart
    function padStart(inString, targetLength, padString) {
        targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (inString.length > targetLength) {
            return String(inString);
        } else {
            targetLength = targetLength - inString.length;
            if (targetLength > padString.length) {
                padString += repeatString(padString, targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + String(inString);
        }
    }

    // adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
    // internal polyfill for string.prototype.padEnd
    function padEnd(inString, targetLength, padString) {
        targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (inString.length > targetLength) {
            return String(inString);
        } else {
            targetLength = targetLength - inString.length;
            if (targetLength > padString.length) {
                padString += repeatString(padString, targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return String(inString) + padString.slice(0, targetLength);
        }
    }
    /* eslint-enable */

    function evalVariable(variableString, scope) {
        scope = scope || null;

        try {
            return eval.call(scope, variableString);
        } catch (ex) {
        }

        return null;
    }

    function evalFunction(functionString, args, scope) {
        scope = scope || null;

        try {
            return eval.call(scope, functionString + '(' + args.join() + ')');
        } catch (ex) {
        }

        return null;
    }

    function appendToArray() {
        var args = Array.prototype.slice.call(arguments);


        var mainArr = args[0];

        for (var i = 1; i < args.length; i++) {
            Array.prototype.push.apply(mainArr, args[i]);
        }

        return mainArr;
    }

    function appendToObject() {
        var args = Array.prototype.slice.call(arguments);


        var mainObj = args[0];

        for (var i = 1; i < args.length; i++) {
            var obj = args[i];

            for (var key in obj) {
                if (!obj.hasOwnProperty(key)) {
                    continue;
                }

                mainObj[key] = obj[key];
            }
        }

        return mainObj;
    }

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* PubKitShrinkExports<Utilities> */
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        randomSplice: randomSplice,
        shuffle: shuffle,
        deepCopy: deepCopy,
        mergeObjects: mergeObjects,
        mergeArrays: mergeArrays,
        isArray: isArray,
        isEmpty: isEmpty,
        isInteger: isInteger,
        isString: isString,
        isNumeric: isNumeric,
        isRegex: isRegex,
        isNumber: isNumber,
        isBoolean: isBoolean,
        isFunction: isFunction,
        isObject: isObject,
        isArraySubset: isArraySubset,
        getType: getType,
        tryCatchWrapper: tryCatchWrapper,
        arrayDelete: arrayDelete,
        repeatString: repeatString,
        padStart: padStart,
        padEnd: padEnd,
        evalVariable: evalVariable,
        evalFunction: evalFunction,
        appendToArray: appendToArray,
        appendToObject: appendToObject
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Utilities();
},{}],34:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps the creation of an `Error` object to ensure that proper error types are
 * set and that messages are formatted properly.
 *
 * @param  {string} type    One of the error types defined in Whoopsie.ErrorTypes.
 * @param  {string} message Message describing what caused the error.
 * @return {Error}          Returns an error with the proper message and type
 */
function Whoopsie(type, message) {

    return new Error(type + ': ' + message);
}

////////////////////////////////////////////////////////////////////////////////
// Enumerations ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

Whoopsie.ErrorTokens = {
    MISSING_ARGUMENT: 1,
    INVALID_TYPE: 2,
    INVALID_VALUE: 3,
    MISSING_PROPERTY: 4,
    NUMBER_OUT_OF_RANGE: 5,
    EMPTY_ENTITY: 6,
    INTERNAL_ERROR: 7,
    DUPLICATE_ENTITY: 8,
    INVALID_ARGUMENT: 9,
    INVALID_CONFIG: 10
};

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Whoopsie;
},{}],35:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var DeviceTypeChecker = require(17);
var HeaderTagSlot = require(24);
var SpaceCamp = require(61);
var Utilities = require(33);
var Whoopsie = require(34);

var ServiceConstructors = [

    {
        name: 'EventsService',
        constructor: require(53)
    },

    {
        name: 'GptService',
        constructor: require(57)
    },

    {
        name: 'PublisherSonarService',
        constructor: require(58)
    },

    {
        name: 'HeaderStatsService',
        constructor: require(54)
    },

    {
        name: 'TimerService',
        constructor: require(59)
    },

    // Compliance service MUST load after Timer Service.
    {
        name: 'ComplianceService',
        constructor: require(52)
    },

    {
        name: 'RenderService',
        constructor: require(56)
    },


    {
        name: 'KeyValueService',
        constructor: require(55)
    }
];

var LayerConstructors = {

    GptLayer: require(4),

    MediationLayer: require(7),

    PartnersLayer: require(8),


    IdentityLayer: require(5),

    VideoInterfaceLayer: require(9)
};


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A dynamic loader that initializes the ht-slots, services, and layers based
 * on the configuration. It provides the shell with a standard interface to
 * interact with the services and layers.
 *
 * @constructor
 */
function Loader(configs) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /**
     * The consolidated direct interface of all the services and layers. The direct
     * interfaces are namespaced to avoid collision.
     *
     * @private {object}
     */
    var __directInterface;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */


    /* Getters and Setter
     * ---------------------------------- */

    /**
     * Returns the consolidated direct interface.
     *
     * @public
     *
     * @return {object} Returns the consolidated direct interface.
     */
    function getDirectInterface() {
        return __directInterface;
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {

        /* Initialize the device type checker */
        SpaceCamp.DeviceTypeChecker = DeviceTypeChecker(configs.DeviceTypeChecker);

        /* Initialize all the header tag slots and store them in `SpaceCamp.htSlots`. */
        for (var htSlotName in configs.htSlots) {
            if (!configs.htSlots.hasOwnProperty(htSlotName)) {
                continue;
            }

            var htSlot = HeaderTagSlot(htSlotName, configs.htSlots[htSlotName]);

            SpaceCamp.htSlots.push(htSlot);
            SpaceCamp.htSlotsMap[htSlotName] = htSlot;

        }
        /* Initialize an empty the direct interface. */
        __directInterface = {
            Services: {},
            Layers: {}
        };

        /* Initialize all the services specified in `ServiceConstructors`. */
        for (var j = 0; j < ServiceConstructors.length; j++) {
            var serviceId = ServiceConstructors[j].name;


            var service = ServiceConstructors[j].constructor(configs.Services[serviceId]);

            if (!service) {
                continue;
            }

            /* We emit errors with the event service in production, but only want to scribe
               in debug mode so we don't build it in otherwise. Add the subscriptions here
               in the loader so they're available ASAP once the EventsService is running. */

            SpaceCamp.services[serviceId] = service;

            /* Get the service's direct interface if it has the standard interface for it. */
            if (service.getDirectInterface && service.getDirectInterface()) {
                __directInterface.Services = Utilities.mergeObjects(__directInterface.Services, service.getDirectInterface());
            }

        }

        /* Initialize the layers specified in `configs.Layers`. The constructors for the
         * layers are specified in `LayerConstructors`. The layers are stacked in the
         * order their configs show up in `configs.Layers`. However, they are actually
         * initialized backwards so that they can be attached easily. */
        var previousLayer;

        for (var i = configs.Layers.length - 1; i >= 0; i--) {
            var layerId = configs.Layers[i].layerId;

            var layer = LayerConstructors[layerId](configs.Layers[i].configs);

            if (layer.getDirectInterface()) {
                __directInterface.Layers = Utilities.mergeObjects(__directInterface.Layers, layer.getDirectInterface());
            }

            if (previousLayer) {
                layer.setNext(previousLayer.execute);
            }

            previousLayer = layer;

        }
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        getDirectInterface: getDirectInterface
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Loader;
},{}],36:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Cache = require(12); // eslint-disable-line no-redeclare
var SpaceCamp = require(61);
var System = require(32);
var Utilities = require(33);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function NormalDistributionTimeoutModule() {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Constants
     * ---------------------------------- */

    /* Store the data for one week. */
    var __CYCLE_TIME = 604800000;

    var __TOTAL_SESSIONS_RECORDED = 5;

    var __TIMEOUT_ADJUSTMENT = 100;

    var __LOWER_BOUND_MULTIPLIER = 0.8;

    var __UPPER_BOUND_MULTIPLIER = 3;

    /**
     * Enum of possible values of session status.
     * @public {Object}
     */
    var SessionStates = {
        IPR: 0,
        DONE: 1
    };

    var __sessionStartTimes;

    /**
     * An object keyed by session ID and the value by the array of adapter response timeouts.
     * @private {object}
     */
    var __sessionResponseTimes;

    /**
     * An object keyed by session ID and valued by the state of the session.
     * @private {object}
     */
    var __sessionStates;

    /**
     * Encrypt partner name in the cache
     *
     * @param {string} eventName The name of the partner.
     */
    function __encryptAdapterName(adapterName) {
        var encryptedName = '';
        for (var i = 0; i < adapterName.length - 3; i++) {
            // Update each character to be 4 character before in ASCII table
            encryptedName = encryptedName + (String.fromCharCode(adapterName.charCodeAt(i) - 4));
        }

        return encryptedName;
    }

    /**
     * Process 'partner_request_complete' event to get partner response times
     *
     * @param {string} eventName The name of the event.
     * @param {object} data The data from the event.
     */
    function __recordPartnerResponse(eventName, data) {

        /* Pull values from data */
        var partner = __encryptAdapterName(data.partner);
        var sessionId = data.sessionId;
        var status = data.status;

        // Skip customized partner without sessionId in partner_request_complete event.
        if (!sessionId) {
            return;
        }

        if (status !== 'success') {
            return;
        }

        var responseTimestamp = System.now();

        // When session has status DONE, we are adding the response time to cache directly.
        if (__sessionStates[sessionId] === SessionStates.DONE) {
            var pastResponsesTimeData = Cache.getData(NormalDistributionTimeoutModule.STORAGE_KEY_NAME);
            if (pastResponsesTimeData === null
                || !pastResponsesTimeData.hasOwnProperty('prt')
                || !Utilities.isArray(pastResponsesTimeData.prt)) {

                return;
            }

            pastResponsesTimeData = pastResponsesTimeData.prt;

            for (var i = 0; i < pastResponsesTimeData.length; i++) {
                if (pastResponsesTimeData[i].sId === sessionId && pastResponsesTimeData[i].sst) {
                    if (!pastResponsesTimeData[i].rt.hasOwnProperty(partner)) {
                        pastResponsesTimeData[i].rt[partner] = [];
                    }
                    pastResponsesTimeData[i].rt[partner].unshift(responseTimestamp - pastResponsesTimeData[i].sst);

                    // Update the cached data
                    Cache.setData(
                        NormalDistributionTimeoutModule.STORAGE_KEY_NAME,
                        {
                            prt: pastResponsesTimeData
                        },
                        __CYCLE_TIME
                    );

                    break;
                }
            }
        } else {
            /* When session has status IPR, we are recording response time in __sessionResponseTimes
             *  The value in __sessionResponseTimes will be added to the cache during hs_session_end event. */
            if (!__sessionStartTimes[sessionId]) {

                return;
            }

            if (!__sessionResponseTimes.hasOwnProperty(sessionId)) {
                __sessionResponseTimes[sessionId] = {};
            }

            if (!__sessionResponseTimes[sessionId].hasOwnProperty(partner)) {
                __sessionResponseTimes[sessionId][partner] = [];
            }
            __sessionResponseTimes[sessionId][partner].push(responseTimestamp - __sessionStartTimes[sessionId]);
        }
    }

    var __eventHandlers = {
        hs_session_start: function (data) { // eslint-disable-line camelcase

            var sessionId = data.sessionId;

            /* Start a new session if the session has not started or the previous session with
             * The same session Id has done running. */
            if (__sessionStartTimes.hasOwnProperty(sessionId) && __sessionStates[sessionId] === SessionStates.IPR) {

                return;
            }

            // Record the starting time for the session and set the session state into In Progress
            __sessionStartTimes[sessionId] = System.now();
            __sessionStates[sessionId] = SessionStates.IPR;
        },
        hs_session_end: function (data) { // eslint-disable-line camelcase

            /* When the session with sessionId has ended, put all of the response times we get until
             * hs_session_end event into cache */
            var sessionId = data.sessionId;
            if (__sessionStartTimes[sessionId] && __sessionStates[sessionId] === SessionStates.IPR) {
                __sessionStates[sessionId] = SessionStates.DONE;

                var pastResponsesTimeData = Cache.getData(NormalDistributionTimeoutModule.STORAGE_KEY_NAME);

                if (pastResponsesTimeData === null
                    || !pastResponsesTimeData.hasOwnProperty('prt')
                    || !Utilities.isArray(pastResponsesTimeData.prt)) {
                    pastResponsesTimeData = [];
                } else {
                    pastResponsesTimeData = pastResponsesTimeData.prt;
                    if (pastResponsesTimeData.length >= __TOTAL_SESSIONS_RECORDED) {
                        pastResponsesTimeData.pop();
                    }
                }

                pastResponsesTimeData.unshift({
                    sId: sessionId,
                    sst: __sessionStartTimes[sessionId],
                    rt: __sessionResponseTimes[sessionId] || {}
                });

                Cache.setData(
                    NormalDistributionTimeoutModule.STORAGE_KEY_NAME,
                    {
                        prt: pastResponsesTimeData
                    },
                    __CYCLE_TIME
                );

                delete __sessionResponseTimes[sessionId];
                delete __sessionStartTimes[sessionId];
            } else {
            }
        },
        partner_request_complete: function (data) { // eslint-disable-line camelcase
            __recordPartnerResponse('partner_request_complete', data);
        }
    };

    function __getMean(arr) {
        var arrLength = arr.length;
        if (arrLength === 0) {
            return 0;
        }

        var total = 0;
        for (var i = 0; i < arrLength; i++) {
            total += arr[i];
        }

        return total / arrLength;
    }

    /* Main
     * ---------------------------------- */

    function getTimeout(originalTimeout) {
        var pastResponsesTimeData = Cache.getData(NormalDistributionTimeoutModule.STORAGE_KEY_NAME);
        if (pastResponsesTimeData === null
            || !pastResponsesTimeData.hasOwnProperty('prt')
            || !Utilities.isArray(pastResponsesTimeData.prt)
            || pastResponsesTimeData.prt.length === 0) {
            return originalTimeout;
        }

        // The responseTimeoutsArray has all of the sample data we are using to calculate standard deviation
        // It has the mean response times for one partner in one session.
        pastResponsesTimeData = pastResponsesTimeData.prt;

        var responseTimeoutsArray = [];
        for (var i = 0; i < pastResponsesTimeData.length; i++) {
            if (!pastResponsesTimeData[i].hasOwnProperty('rt')) {
                continue;
            }

            for (var partner in pastResponsesTimeData[i].rt) {
                if (!pastResponsesTimeData[i].rt.hasOwnProperty(partner)) {
                    continue;
                }

                var responseMean = __getMean(pastResponsesTimeData[i].rt[partner]);
                if (responseMean !== 0) {
                    responseTimeoutsArray.push(responseMean);
                }
            }
        }

        var responseTimeMean = __getMean(responseTimeoutsArray);
        if (responseTimeMean === 0) {

            return originalTimeout;
        }

        var responseTimeArrayLength = responseTimeoutsArray.length;
        var responseDeviation = 0;
        for (var j = 0; j < responseTimeArrayLength; j++) {
            responseDeviation += Math.pow(responseTimeoutsArray[j] - responseTimeMean, 2);
        }
        responseDeviation = Math.sqrt(responseDeviation / responseTimeArrayLength);

        var finalTimeout = Math.floor((responseTimeMean + (2 * responseDeviation)) + __TIMEOUT_ADJUSTMENT);

        // Make sure the timeout is within the range
        var minTimeout = Math.floor(originalTimeout * __LOWER_BOUND_MULTIPLIER);
        var maxTimeout = Math.floor(originalTimeout * __UPPER_BOUND_MULTIPLIER);

        // Make sure the timeout is within the range
        if (finalTimeout < minTimeout) {
            finalTimeout = minTimeout;
        } else if (finalTimeout > maxTimeout) {
            finalTimeout = maxTimeout;
        }


        return finalTimeout;
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        /* Register event listeners */
        for (var eventName in __eventHandlers) {
            if (!__eventHandlers.hasOwnProperty(eventName)) {
                continue;
            }
            SpaceCamp.services.EventsService.on(eventName, __eventHandlers[eventName]);
        }

        __sessionStates = {};
        __sessionResponseTimes = {};
        __sessionStartTimes = {};
    })();

    // =====================================
    // Public Interface
    // ----------------------------------

    return {
        // Class Information
        // ----------------------------------


        getTimeout: getTimeout

    };
}

////////////////////////////////////////////////////////////////////////////////
// Enumerations ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

NormalDistributionTimeoutModule.STORAGE_KEY_NAME = 'lib_mem';

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = NormalDistributionTimeoutModule;
},{}],37:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var GptHelper = require(23);
var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Module for clearing targeting from google slots.
 *
 * @class
 */
function GptClearTargeting(configs, state) {
    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Main
     * ---------------------------------- */

    function clearTargeting(targetingParcels) {

        var history;

        history = state.pageDemandHistory;

        for (var pageKey in history) {
            if (!history.hasOwnProperty(pageKey)) {
                continue;
            }

            window.googletag.pubads().clearTargeting(pageKey);

            delete history[pageKey];
        }

        history = state.gSlotDemandHistory;

        for (var i = 0; i < targetingParcels.length; i++) {
            if (targetingParcels[i].ref) {
                var gSlot = targetingParcels[i].ref;
                var gSlotDivId = gSlot.getSlotElementId();

                if (history.hasOwnProperty(gSlotDivId)) {
                    for (var slotKey in history[gSlotDivId]) {
                        if (!history[gSlotDivId].hasOwnProperty(slotKey)) {
                            continue;
                        }
                        gSlot.clearTargeting(slotKey);
                    }


                    delete history[gSlotDivId];
                }
            }
        }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        state.gSlotDemandHistory = state.gSlotDemandHistory || {};
        state.pageDemandHistory = state.pageDemandHistory || {};
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        clearTargeting: clearTargeting
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = GptClearTargeting;
},{}],38:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var SpaceCamp = require(61);
var GptHelper = require(23);
var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Module for destroying gSlots by removing entries from state.gSlotDemandHistory
 * and googletag.destroySlots(...).
 *
 * @class
 */
function GptDestroySlots(configs, state) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */
    var __gptDestroySlots;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /*
     * Determine the appropriate way to invoke the original googletag.destroySlots(...)
     */
    function __callGptDestroySlots(gSlots) {
        if (__gptDestroySlots) {
            return __gptDestroySlots(gSlots);
        } else {
            return window.googletag.destroySlots(gSlots);
        }
    }

    /* Main
     * ---------------------------------- */

    /**
     * Destroys specific gSlot or all gSlots on the page.
     *
     * @param {array} [gSlot]   Array of gSlots to destroy. If unspecified, all defined
     *                          gSlots will be destroyed.
     * @return {boolean}        true if the slots were destroyed, false otherwise.
     */
    function destroySlots(gSlots) {

        var removeFromHistorySlots = gSlots ? gSlots : GptHelper.getGSlots();

        /* Remove all gSlots to be destroyed from our display history. */
        for (var i = 0; i < removeFromHistorySlots.length; i++) {
            if (state.gSlotDisplayHistory.hasOwnProperty(removeFromHistorySlots[i].getSlotElementId())) {
                delete state.gSlotDisplayHistory[removeFromHistorySlots[i].getSlotElementId()];
            }
        }

        return __callGptDestroySlots(gSlots);
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        if (!state.hasOwnProperty('gSlotDisplayHistory')) {
            state.gSlotDisplayHistory = {};
        }

        var overrideGoogletag = function () {
            if (configs.override && configs.override.destroySlots) {
                /* Keep a reference to the original googletag destroySlots */
                __gptDestroySlots = SpaceCamp.LastLineGoogletag.destroySlots;
            }
        };
        SpaceCamp.initQueue.push(overrideGoogletag);
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        destroySlots: destroySlots
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = GptDestroySlots;
},{}],39:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var GptHelper = require(23);
var Prms = require(20);
var Constants = require(16);
var SpaceCamp = require(61);
var Whoopsie = require(34);
var Utilities = require(33);
var GptMapSlots = require(40);
var GptClearTargeting = require(37);
var GptSetTargeting = require(43);
var HeaderStatsService = require(54);

var TimerService;
var EventsService;


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Module retrieves new demand, clears old demand, sets new demand, and then
 * invokes GPT to display the ad.
 *
 * @class
 */
function GptDisplay(configs, state, executeNext) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    var __mapSlots;
    var __clearTargeting;
    var __setTargeting;
    var __gptDisplay;
    var __gptDisplayQueue;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /*
     * Determine the appropriate way to invoke the original googletag.display(...)
     */
    function __callGptDisplay(divOrSlot) {
        if (__gptDisplay) {
            return __gptDisplay(divOrSlot);
        } else {
            return window.googletag.display(divOrSlot);
        }
    }

    /* Private
     * ---------------------------------- */

    /*
     * Manage the display calls based on request architecture.
     * SRA: queue up the display calls, process as many as possible from head of the queue.
     * MRA: process display calls as soon as they happen.
     */
    function __processGptDisplay(session) {
        if (state.requestArchitecture === Constants.RequestArchitectures.SRA) {
            while (__gptDisplayQueue.length) {
                if (!__gptDisplayQueue[0].done) {
                    return;
                }
                var head = __gptDisplayQueue.shift();
                if (head.outParcels && !Utilities.isEmpty(head.outParcels)) {
                    __clearTargeting(head.outParcels);
                }

                if (head.parcels && !Utilities.isEmpty(head.parcels)) {
                    __setTargeting(head.sessionId, head.parcels);
                }
                __callGptDisplay(head.divOrSlot);
            }
        } else {
            if (session.outParcels && !Utilities.isEmpty(session.outParcels)) {
                __clearTargeting(session.outParcels);
            }

            if (session.parcels && !Utilities.isEmpty(session.parcels)) {
                __setTargeting(session.sessionId, session.parcels);
            }
            __callGptDisplay(session.divOrSlot);
        }
    }

    /* Main
     * ---------------------------------- */

    /**
     * Fetches demand and displays a new ad for g-slot with a specific div ID.
     *
     * @param  {string}  divOrSlot    div ID or GoogleSlotObject for which to display ad.
     * @return {promise}
     */
    function display(divOrSlot) {
        var session = {
            done: false,
            divOrSlot: divOrSlot,
            outParcels: null,
            parcels: null,
            sessionId: ''
        };

        if (state.requestArchitecture === Constants.RequestArchitectures.SRA) {
            /* Get in the queue immediately for SRA. */
            __gptDisplayQueue.push(session);
        }

        /* Check if divid is a string or gslot and extract div ID accordingly. */
        var divId = null;
        if (GptHelper.isGSlot(divOrSlot)) {
            divId = divOrSlot.getSlotElementId();
        } else {
            divId = divOrSlot;
        }

        var gSlot = GptHelper.getGSlotByDivId(divId);

        /* The g-slot with this div ID was not defined. Nothing to do. */
        if (!gSlot) {
            session.done = true;
            __processGptDisplay(session);

            return Prms.resolve();
        }

        /* Create the list of g-slots which need demand. */
        var gSlots = [];
        if (state.requestArchitecture === Constants.RequestArchitectures.SRA) {
            /* For SRA, get demand for all g-slots on a page. */
            gSlots = GptHelper.getGSlots();
        } else {
            /* For MRA, just get the g-slot defined with the passed in div ID. */
            gSlots = gSlot ? [gSlot] : [];
        }

        /* Get rid of g-slots that are in the display history. */
        for (var i = gSlots.length - 1; i >= 0; i--) {
            if (state.gSlotDisplayHistory.hasOwnProperty(gSlots[i].getSlotElementId())) {
                gSlots.splice(i, 1);
            }
        }

        if (!gSlots.length) {
            /* No slots left. Nothing left to do. */
            session.done = true;
            __processGptDisplay(session);

            return Prms.resolve();
        }

        /* Remaining g-slots will need demand. Create the gSlotDemandObjects expected by __mapSlots.
           and mark them as displayed. */
        var gSlotDemandObjects = [];
        for (var j = 0; j < gSlots.length; j++) {
            gSlotDemandObjects.push({
                slot: gSlots[j]
            });
            state.gSlotDisplayHistory[gSlots[j].getSlotElementId()] = true;
        }

        /* For disabled initial load, display must be called first. googletag won't render it
           until the refresh. So, nothing else to do now except call googletag.display(...).
           No demand necessary right now. Do it with the refresh call. */
        if (state.initialLoadState === Constants.InitialLoadStates.DISABLED) {
            session.done = true;
            __processGptDisplay(session);

            return Prms.resolve();
        }

        /* The remaining g-slots will need demand so we can display ads for them. */

        /* Find the ht-slots that map to the g-slots, and get them in parcel form. */
        var outParcels = __mapSlots(gSlotDemandObjects);
        session.outParcels = outParcels;
        if (!outParcels.length) {
            EventsService.emit('warning', 'No valid Header Tag slots found in call to display.');
            session.done = true;
            __processGptDisplay(session);

            return Prms.resolve();
        }

        var calculatedTimeout = state.desktopGlobalTimeout;

        if (SpaceCamp.DeviceTypeChecker.getDeviceType() === 'mobile') {
            calculatedTimeout = state.mobileGlobalTimeout;
        }



        SpaceCamp.globalTimeout = calculatedTimeout;

        /* Start a global timeout. */
        var sessionId = TimerService.createTimer(calculatedTimeout, true);
        TimerService.addTimerCallback(sessionId, function () {
            EventsService.emit('global_timeout_reached', {
                sessionId: sessionId
            });
        });

        session.sessionId = sessionId;

        EventsService.emit('hs_session_start', {
            sessionId: sessionId,
            timeout: calculatedTimeout,
            sessionType: HeaderStatsService.SessionTypes.DISPLAY
        });


        return executeNext(sessionId, outParcels).then(function (receivedParcels) {


            session.parcels = receivedParcels;
            session.done = true;
            __processGptDisplay(session);

            EventsService.emit('hs_session_end', {
                sessionId: sessionId
            });
        });
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        EventsService = SpaceCamp.services.EventsService;
        TimerService = SpaceCamp.services.TimerService;

        if (!state.hasOwnProperty('gSlotDisplayHistory')) {
            state.gSlotDisplayHistory = {};
        }

        if (!state.hasOwnProperty('requestArchitecture')) {
            state.requestArchitecture = Constants.RequestArchitectures.MRA;
        }

        if (!state.hasOwnProperty('initialLoadState')) {
            state.initialLoadState = Constants.InitialLoadStates.ENABLED;
        }

        var overrideGoogletag = function () {
            if (configs.override && configs.override.display) {
                /* Keep a reference to the original googletag display. */
                __gptDisplay = SpaceCamp.LastLineGoogletag.display;
            }
        };
        SpaceCamp.initQueue.push(overrideGoogletag);

        __mapSlots = GptMapSlots(configs, state).mapHtSlots;
        __clearTargeting = GptClearTargeting(configs, state).clearTargeting;
        __setTargeting = GptSetTargeting(configs, state).setTargeting;
        __gptDisplayQueue = [];
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        display: display
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = GptDisplay;
},{}],40:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Browser = require(11);
var GptHelper = require(23);
var HtSlotMapper = require(25);
var SpaceCamp = require(61);
var Utilities = require(33);
var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 *
 *
 * @class
 */
function GptMapSlots(configs, state) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    var __state; // eslint-disable-line no-unused-vars

    /**
     * Instance of the HtSlotMapper class used to map slots. Instantiated in constructor.
     *
     * @private
     * @type {object}
     */
    var __htSlotMapper;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Main
     * ---------------------------------- */

    /**
     *
     *
     * @param  {Array} gSlots Array of google slot objects
     * @return {Array}        Array of parcels mapping HT slots to google slots
     */
    function mapHtSlots(gSlotDemandObjs) {

        var adSlotInfoObjs = [];

        for (var i = 0; i < gSlotDemandObjs.length; i++) {
            var gSlot = gSlotDemandObjs[i].slot;
            var adSlotInfo = {
                reference: gSlot
            };

            if (gSlotDemandObjs[i].firstPartyData) {
                adSlotInfo.firstPartyData = gSlotDemandObjs[i].firstPartyData;
            }

            adSlotInfo.divId = gSlot.getSlotElementId();

            var googleSlotSizes = [];
            var googleSlotAllSizes = gSlot.getSizes(Browser.getViewportWidth(), Browser.getViewportHeight()) || gSlot.getSizes();
            if (!googleSlotAllSizes) {
                continue;
            }

            for (var j = 0; j < googleSlotAllSizes.length; j++) {
                /* Ignore 'fluid', or any other weird future thing that gives us a string
                 * instead of a size object. */
                if (Utilities.isString(googleSlotAllSizes[j])) {
                    continue;
                }
                googleSlotSizes.push([googleSlotAllSizes[j].getWidth(), googleSlotAllSizes[j].getHeight()]);
            }
            var googleSlotTargeting = {};
            var googleSlotTargetingKeys = gSlot.getTargetingKeys();
            for (var k = 0; k < googleSlotTargetingKeys.length; k++) {
                googleSlotTargeting[googleSlotTargetingKeys[k]] = gSlot.getTargeting(googleSlotTargetingKeys[k])
                    .map(function (target) {
                        return String(target);
                    });
            }

            adSlotInfo.sizes = googleSlotSizes;
            adSlotInfo.targeting = googleSlotTargeting;
            adSlotInfo.adUnitPath = gSlot.getAdUnitPath();

            adSlotInfoObjs.push(adSlotInfo);
        }

        var allHtSlots = SpaceCamp.htSlots;
        var filteredHtSlots = __htSlotMapper.filter(allHtSlots, adSlotInfoObjs);
        var selectedSlotParcels = __htSlotMapper.select(filteredHtSlots, adSlotInfoObjs);


        return selectedSlotParcels;
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        __state = state;
        __htSlotMapper = HtSlotMapper(configs.slotMapping);
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        mapHtSlots: mapHtSlots
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = GptMapSlots;
},{}],41:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var SpaceCamp = require(61);
var Whoopsie = require(34);
var Constants = require(16);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Module for updating state to reflect certain configuration values.
 * e.g. enableSingleRequest
 * Provides methods for setting these values outside of the configuration.
 *
 * @class
 */
function GptOptions(configs, state) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    var __gptEnableSingleRequest;
    var __gptDisableInitialLoad;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /*
     * Determine the appropriate way to invoke the original googletag.pubads().enableSingleRequest(...)
     */
    function __callGptEnableSingleRequest() {
        if (__gptEnableSingleRequest) {
            return __gptEnableSingleRequest();
        } else {
            return window.googletag.pubads().enableSingleRequest();
        }
    }

    /*
     * Determine the appropriate way to invoke the original googletag.pubads().disableInitialLoad(...)
     */
    function __callGptDisableInitialLoad() {
        if (__gptDisableInitialLoad) {
            return __gptDisableInitialLoad();
        } else {
            return window.googletag.pubads().disableInitialLoad();
        }
    }

    /* Main
     * ---------------------------------- */

    /*
     * Sets the request architecture to SRA, and calls googletag.pubads().enableSingleRequest()
     * @return  Result of calling googletag.pubads().enableSingleRequest()
     */
    function enableSingleRequest() {
        state.requestArchitecture = Constants.RequestArchitectures.SRA;

        return __callGptEnableSingleRequest();
    }

    /*
     * Sets the initial load state to disabled, and calls googletag.pubads().disableInitialLoad()
     * @return  Result of calling googletag.pubads().disableInitialLoad()
     */
    function disableInitialLoad() {
        state.initialLoadState = Constants.InitialLoadStates.DISABLED;

        return __callGptDisableInitialLoad();
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {

        state.requestArchitecture = configs.enableSingleRequest ? Constants.RequestArchitectures.SRA : Constants.RequestArchitectures.MRA;
        state.initialLoadState = configs.disableInitialLoad ? Constants.InitialLoadStates.DISABLED : Constants.InitialLoadStates.ENABLED;

        var overrideGoogletag = function () {
            if (configs.override) {
                if (configs.override.enableSingleRequest) {
                    __gptEnableSingleRequest = SpaceCamp.LastLineGoogletag.enableSingleRequest;
                }

                if (configs.override.disableInitialLoad) {
                    __gptDisableInitialLoad = SpaceCamp.LastLineGoogletag.disableInitialLoad;
                }
            }
        };
        SpaceCamp.initQueue.push(overrideGoogletag);
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        enableSingleRequest: enableSingleRequest,
        disableInitialLoad: disableInitialLoad
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = GptOptions;
},{}],42:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var GptHelper = require(23);
var SpaceCamp = require(61);
var Whoopsie = require(34);
var GptMapSlots = require(40);
var GptClearTargeting = require(37);
var GptSetTargeting = require(43);
var Constants = require(16);
var Prms = require(20);
var HeaderStatsService = require(54);

var TimerService;
var EventsService;


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Module retrieves new demand, clears old demand, sets new demand, and then
 * invokes GPT to refresh the ad.
 *
 * @class
 */
function GptRefresh(configs, state, executeNext) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    var __mapSlots;
    var __clearTargeting;
    var __setTargeting;
    var __gptRefresh;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /*
     * Determine the appropriate way to invoke the original googletag.pubads().refresh(...)
     */
    function __callGptRefresh(gSlots, options) {
        if (__gptRefresh) {
            return __gptRefresh(gSlots, options);
        } else {
            return window.googletag.pubads().refresh(gSlots, options);
        }
    }

    /* Main
     * ---------------------------------- */

    /**
     * Fetches demand and displays new ads for specific, or all slots on the page.
     *
     * @param {array} [gSlot] Array of g-slots to refresh.
     * @param {object} [options] Configuration object associated with the refresh call.
     * @return {promise}
     */
    function refresh(gSlots, options) {

        /* Refresh was called without g-slots, so refresh all g-slots defined on page. */
        if (!gSlots) {
            gSlots = GptHelper.getGSlots();
        }

        /* Make a copy of the original g-slots, as we need to pass all of them to GPT later. */
        var unfilteredGSlots = gSlots.slice();

        /* Filter out elements that are not g-slots. */
        for (var i = gSlots.length - 1; i >= 0; i--) {
            if (!GptHelper.isGSlot(gSlots[i])) {
                gSlots.splice(i, 1);
            }
        }

        /* MRA only: filter out g-slots not in the display history. */
        if (state.requestArchitecture === Constants.RequestArchitectures.MRA) {
            for (var j = gSlots.length - 1; j >= 0; j--) {
                if (!state.gSlotDisplayHistory.hasOwnProperty(gSlots[j].getSlotElementId())) {
                    gSlots.splice(j, 1);
                }
            }
        }

        if (!gSlots.length) {
            /* No slots left. Nothing more for us to do. */
            __callGptRefresh(unfilteredGSlots, options);

            return Prms.resolve();
        }

        /* The remaining g-slots will need demand so we can show ads for them. */

        /* Remaining g-slots will need demand. Create the gSlotDemandObjects expected by __mapSlots.
           and mark them as displayed. */
        var gSlotDemandObjects = [];
        for (var k = 0; k < gSlots.length; k++) {
            gSlotDemandObjects.push({
                slot: gSlots[k]
            });
            state.gSlotDisplayHistory[gSlots[k].getSlotElementId()] = true;
        }

        /* Find the ht-slots that map to the g-slots, and get them in parcel form. */
        var outParcels = __mapSlots(gSlotDemandObjects);
        if (!outParcels.length) {
            EventsService.emit('warning', 'No valid Header Tag slots found in call to refresh.');
            __callGptRefresh(unfilteredGSlots, options);

            return Prms.resolve();
        }

        var calculatedTimeout = state.desktopGlobalTimeout;

        if (SpaceCamp.DeviceTypeChecker.getDeviceType() === 'mobile') {
            calculatedTimeout = state.mobileGlobalTimeout;
        }



        SpaceCamp.globalTimeout = calculatedTimeout;

        /* Start a global timeout. */
        var sessionId = TimerService.createTimer(calculatedTimeout, true);
        TimerService.addTimerCallback(sessionId, function () {
            EventsService.emit('global_timeout_reached', {
                sessionId: sessionId
            });
        });

        EventsService.emit('hs_session_start', {
            sessionId: sessionId,
            timeout: calculatedTimeout,
            sessionType: HeaderStatsService.SessionTypes.DISPLAY
        });


        return executeNext(sessionId, outParcels).then(function (receivedParcels) {


            __clearTargeting(outParcels);
            __setTargeting(sessionId, receivedParcels);

            EventsService.emit('hs_session_end', {
                sessionId: sessionId
            });

            __callGptRefresh(unfilteredGSlots, options);
        });
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        EventsService = SpaceCamp.services.EventsService;
        TimerService = SpaceCamp.services.TimerService;

        if (!state.hasOwnProperty('gSlotDisplayHistory')) {
            state.gSlotDisplayHistory = {};
        }

        if (!state.hasOwnProperty('requestArchitecture')) {
            state.requestArchitecture = Constants.RequestArchitectures.MRA;
        }

        if (!state.hasOwnProperty('initialLoadState')) {
            state.initialLoadState = Constants.InitialLoadStates.ENABLED;
        }

        var overrideGoogletag = function () {
            if (configs.override && configs.override.refresh) {
                /* Keep a reference to the original googletag refresh */
                __gptRefresh = SpaceCamp.LastLineGoogletag.refresh;
            }
        };
        SpaceCamp.initQueue.push(overrideGoogletag);

        __mapSlots = GptMapSlots(configs, state).mapHtSlots;
        __clearTargeting = GptClearTargeting(configs, state).clearTargeting;
        __setTargeting = GptSetTargeting(configs, state).setTargeting;
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        refresh: refresh
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = GptRefresh;
},{}],43:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var GptHelper = require(23);
var SpaceCamp = require(61);
var Utilities = require(33);
var Whoopsie = require(34);

var EventsService;


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Module for setting targeting on google slots.
 *
 * @class
 */
function GptSetTargeting(configs, state) {
    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Main
     * ---------------------------------- */

    function setTargeting(sessionId, targetingParcels) {

        for (var i = 0; i < targetingParcels.length; i++) {
            if (targetingParcels[i].pass) {
                continue;
            }

            if (!targetingParcels[i].targeting || Utilities.isEmpty(targetingParcels[i].targeting)) {
                continue;
            }

            if (sessionId && targetingParcels[i].targetingType === 'slot') {
                EventsService.emit('hs_slot_kv_pushed', {
                    sessionId: sessionId,
                    statsId: targetingParcels[i].partnerStatsId,
                    htSlotId: targetingParcels[i].htSlot.getId(),
                    requestId: targetingParcels[i].requestId,
                    xSlotNames: [targetingParcels[i].xSlotName]
                });
            }


            var targeting = targetingParcels[i].targeting;

            var history;

            for (var key in targeting) {
                if (!targeting.hasOwnProperty(key)) {
                    continue;
                }

                if (targetingParcels[i].targetingType === 'page') {
                    history = state.pageDemandHistory;
                    history[key] = history[key] || {};
                    history[key] = true;

                    window.googletag.pubads().setTargeting(key, targeting[key]);

                } else {
                    var gSlot = targetingParcels[i].ref;
                    var gSlotDivId = gSlot.getSlotElementId();
                    history = state.gSlotDemandHistory;
                    history[gSlotDivId] = history[gSlotDivId] || {};
                    history[gSlotDivId][key] = true;

                    gSlot.setTargeting(key, gSlot.getTargeting(key).concat(targeting[key]));

                }
            }
        }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        EventsService = SpaceCamp.services.EventsService;

        state.gSlotDemandHistory = state.gSlotDemandHistory || {};
        state.pageDemandHistory = state.pageDemandHistory || {};
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */
    return {
        /* Class Information
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */

        setTargeting: setTargeting
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = GptSetTargeting;
},{}],44:[function(require,module,exports){
'use strict';

/**
 * Local copy of the API object
 */
var API;

/**
 * Retrieve endpoint
 */
var BASE_URL = '//match.adsrvr.org/track/rid';
var TTD_PID = 'casale';
var FORMAT = 'json';

/**
 * Standard partner profile object
 */
var profile = {
    partnerId: 'AdserverOrgIp',
    statsId: 'ADSORG',
    version: '1.3.0',
    source: 'adserver.org',
    cacheExpiry: {
        // 7 days
        match: 604800000,

        // 1 day
        pass: 86400000,

        // 1 day
        error: 86400000
    },
    targetingKeys: {
        exchangeBidding: 'ixpid_1'
    }
};

/**
 * Retrieve pid from the external library
 */
function retrieve() {
    var reqData = {
        ttd_pid: TTD_PID, // eslint-disable-line camelcase
        fmt: FORMAT,
        p: API.configs.publisherId
    };

    API.Utilities.ajax({
        url: API.Utilities.getProtocol() + BASE_URL,
        method: 'GET',
        data: reqData,
        onSuccess: function (data) {
            try {
                var rsp = JSON.parse(data);

                if (!rsp.TDID) {
                    API.registerError('response does not contain TDID');

                    return;
                }

                var uids = [];
                for (var sourceId in rsp) {
                    if (!rsp.hasOwnProperty(sourceId)) {
                        continue;
                    }

                    uids.push({
                        id: rsp[sourceId],
                        ext: {
                            rtiPartner: sourceId
                        }
                    });
                }

                API.registerMatch({
                    source: profile.source,
                    uids: uids
                });
            } catch (e) {
                API.registerError('response is not valid JSON');
            }
        },
        onFailure: function (statusCode) {
            API.registerError('API returned error response ' + statusCode);
        }
    });
}

/**
 * Entrypoint
 */
function main(apiObject) {
    API = apiObject;
    API.onRetrieve(retrieve);
}

module.exports = {
    type: 'identity',
    api: '1',
    main: main,
    profile: profile
};
},{}],45:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Browser = require(11);
var LocalCache = require(12);
var Network = require(27);
var Prms = require(20);
var SpaceCamp = require(61);
var System = require(32);
var Utilities = require(33);

var ComplianceService;
var EventsService;
var PublisherSonarService;


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs Identity partners based on the standard module definition.
 *
 * @class
 */
function IdentityPartnerFactory(partnerModule, validatedConfigs) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /**
     * Partner profile object. Defines static values for standard partner properties.
     *
     * @private {object}
     */
    var __partnerProfile;

    /**
     * Partner name, equalivent to __partnerProfile.partnerId.
     *
     * @private {string}
     */
    var __partnerId;

    /**
     * Partner ID for headerstats events, equalivent to __partnerProfile.statsId.
     *
     * @private {string}
     */
    var __partnerStatsId;

    /**
     * API object to be provided to the partner.
     *
     * @private {object}
     */
    var __partnerApi;

    /**
     * Retrieved identity data.
     *
     * @type {object}
     */
    var __identityStore;

    /**
     * Stored EB targeting KV, if undefined the first retrieved pid will be used.
     *
     * @type {object}
     */
    var __identityEbKv;

    /**
     * Flags if the module used consent data for its partner retrieval.
     * Since the factory doen't actually know if consent is used, this tracks if the module was provided with consent.
     *
     * @type {object}
     */
    var __consentProvided;

    /**
     * Flags if the module used consent data for its partner retrieval.
     * Since the factory doen't actually know if consent is used, this tracks if the module was provided with consent.
     *
     * @type {object}
     */
    var __consentProvided;

    /**
     * Partner call defer from identity layer.
     *
     * @type {function}
     */
    var __retrieveResolve;

    /**
     * Key used for local storage. This is currently equalivent to the partner name.
     *
     * @type {string}
     */
    var __storageKey;

    /**
     * Flag to track register* call
     *
     * @type {string}
     */
    var __isRegisterCalled;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Validation
     * ---------------------------------- */

    /**
     * Does a basic format check for the openrtb eid object, which is also the format used in the cache.
     * This is originally meant as a least-effort check to catch obvious bad values or test values in localstorage.
     *
     * @param {object} data Eid object
     * @returns {boolean} true on pass, false on failure
     */
    function __validateEid(data) {
        if (!data || !data.uids || !Utilities.isString(data.source) || !Utilities.isArray(data.uids)) {
            return false;
        }

        return data.uids.every(function (e) {
            return Boolean(!Utilities.isEmpty(e) && e.id);
        });
    }



    /* Register Retrieval
     * ---------------------------------- */

    /**
     * Processes a retrieval that originated from elsewhere in factory; Performs the following:
     * - Fire the apporiate headerstats event
     * - Trigger result callback if registered
     * - Store result locally if type is match
     *
     * @param {*} type One of 'match', 'pass', and 'error'
     * @param {*} data Data to be stored in cache, the matched object or error message
     */
    function __registerRetrieval(type, data) {

        /* Fire the apporiate headerstats event */
        var eventName = {
            match: 'hs_identity_response',
            pass: 'hs_identity_pass',
            error: 'hs_identity_error'
        }[type];

        EventsService.emit(eventName, {
            statsId: __partnerStatsId
        });

        /* Trigger result callback if registered */
        EventsService.emit('ip_module_result_' + __partnerId, type, data);

        /* Store result locally if type is match */
        if (type === 'match') {
            __identityStore = data;
        }
    }

    /**
     * Processes a retrieval that originated from a partner response, Performs the following:
     * - Store response in cache
     * - Performs internal retrieval steps (__registerRetrieval)
     * - Resolve the retrieve defer if the retrieve pipeline is running
     *
     * @param {*} type One of 'match', 'pass', and 'error'
     * @param {*} data Data to be stored in cache, the matched object or error message
     */
    function __registerResponseRetrieval(type, data) {
        /* Partner modules should only call register* once during a retrieve cycle. */
        /* This flag guards against multiple calls */
        if (__isRegisterCalled) {

            return;
        }

        __isRegisterCalled = true;


        /* Store response in cache */
        var cacheData = {
            response: type,
            version: __partnerProfile.version
        };

        /* Pass does not include data. */
        /* It isn't strictly necessary to strip this out since JSON ignores undefined, but it's cleaner. */
        if (type !== 'pass') {
            cacheData.data = data;
        }

        /* Record if consent is used to retrieve this result */
        if (Object.keys(__consentProvided).length) {
            cacheData.consent = __consentProvided;
        }

        var expiry = __partnerProfile.cacheExpiry[type];
        LocalCache.setData(__storageKey, cacheData, expiry);

        /* Performs internal retrieval steps */
        __registerRetrieval(type, data);

        /* Resolve the retrieve() promise, if a retrieve pipeline is running */
        if (__retrieveResolve) {
            __retrieveResolve();
        }
    }

    /* API Methods
     * ---------------------------------- */

    /**
     * Retrieve available consent information in the standard object format.
     * Note that you must set consent in the profile to use this method.
     *
     * @param {string} type Regulation of which this consent information targets
     */
    function __apiUtilityGetConsent(type) {
        if (!ComplianceService.isPrivacyEnabled()) {
            return null;
        }

        if (type === 'gdpr') {
            var consent = ComplianceService.gdpr.getConsent();

            /* Flags if consent information is provided to the partner */
            if (consent && consent.consentString) {
                __consentProvided.gdpr = true;
            }

            return consent;
        }


        return null;
    }

    /**
     * Synchronously retrieve currently available identity information from another partner.
     *
     * @param {string} partnerName Name of identity partner.
     */
    function __apiUtilityGetIdentityResultFrom(partnerName) {
        // Simply retrieves data from cache and returns it if it's a match.
        // This takes advantage of the fact that the factory stores processed data in the cache.
        // If processing is to be done on the cache post-retrieval that behaviour will have to be replicated here.
        var cache = LocalCache.getData(partnerName);

        if (cache && cache.response === 'match' && cache.data) {
            return cache.data;
        }

        return null;
    }

    function __apiUtilityGuardedAjax(args) {

        var filteredArgs = {
            url: args.url,
            method: args.method,
            async: true,
            withCredentials: true,
            jsonp: false,
            continueAfterTimeout: false,
            timeout: args.timeout || 0
        };

        if (args.onSuccess) {
            filteredArgs.onSuccess = args.onSuccess;
        }

        if (args.onTimeout) {
            filteredArgs.onTimeout = args.onTimeout;
        }

        if (args.onFailure) {
            filteredArgs.onFailure = args.onFailure;
        }

        if (typeof args.data !== 'undefined') {
            filteredArgs.data = args.data;
        }

        if (typeof args.contentType !== 'undefined') {
            filteredArgs.contentType = args.contentType;
        }

        return Network.ajax(filteredArgs);
    }

    /**
     * Triggers sonar retrieve or return the previously retrieved value
     */
    function __apiUtilityGetPublisherSonarData() {
        if (!__partnerProfile.sonar || !__partnerProfile.sonar.enabled) {
            /* Always return empty if sonar is disabled */
            return {};
        }

        // Retrieve from source if nothing in cache
        return PublisherSonarService.getSonarPayload(__partnerProfile.sonar.entrypoints);
    }

    /**
     * Sets EBDA page-level targeting if different than default ({ profile.targetingKeys.exchangeBidding: <pid> })
     *
     * @param {object} kv Targeting key-value pair(s)
     */
    function __apiRegisterEbTargeting(kv) {

        __identityEbKv = kv;
    }

    /* Cache Expiry Checks
     * Returns a boolean or promise resolving to boolean, true if cache should be busted, false otherwise.
     * ---------------------------------- */

    /**
     * Bust cache when sonar entrypoints used by the partner (as declared in profile) is updated.
     * Always synchronous
     */
    function __bustCacheForSonarUpdate(cache) {
        var shouldBust = Boolean(__partnerProfile.sonar && __partnerProfile.sonar.enabled
            && PublisherSonarService.getLastUpdated(__apiUtilityGetPublisherSonarData()) > cache.created);


        return shouldBust;
    }

    /**
     * Bust cache when consent information used by the partner (as declared in profile) is updated.
     * Potentially asynchronous
     */
    function __bustCacheForConsentUpdate(cache) {
        /* Check for synchronous conditions first, there's no reason to wait for consent if any of these are not met */
        if (!__partnerProfile.consent || !ComplianceService.isPrivacyEnabled()) {
            return false;
        }

        /* If cache already uses all profile defined regulations, there's also no reason to bust cache */
        if (cache.data.consent
            && Utilities.isArraySubset(Object.keys(__partnerProfile.consent), Object.keys(cache.data.consent))) {
            return false;
        }

        return ComplianceService.wait().then(function () {
            /* Bust the cache if at least one regulation has updated */
            var shouldBust = Object.keys(__partnerProfile.consent).some(function (reg) {
                /* Cache already contains this regulation from before */
                if (cache.data.consent && cache.data.consent[reg]) {
                    return false;
                }

                /* If data is now available (and it was not previously in cache), the regulation has updated */
                var data = ComplianceService[reg].getConsent();

                return data && data.consentString;
            });


            return shouldBust;
        });
    }

    /**
     * Bust cache when the partner module code (based on profile version) is updated.
     * Always synchronous
     */
    function __bustCacheForModuleUpdate(cache) {
        var shouldBust = cache.data.version !== __partnerProfile.version;


        return shouldBust;
    }

    /**
     * Bust cache when there is a problem with the cached Eids object.
     * Always synchronous
     */
    function __bustCacheForInvalidEids(cache) {
        var shouldBust = !__validateEid(cache.data.data);


        return shouldBust;
    }

    /**
     * Conditions that may trigger a cache bust, based on response type.
     * New cache busting triggers should be added to one or more of these lists to come into effect.
     */
    var __cacheBustTriggers = {
        match: [__bustCacheForSonarUpdate, __bustCacheForInvalidEids],
        pass: [__bustCacheForSonarUpdate, __bustCacheForConsentUpdate, __bustCacheForModuleUpdate],
        error: [__bustCacheForModuleUpdate]
    };

    /* Partner Retrieve Delays
     * Returns null or a promise that resolves when retrieve can proceed.
     * ---------------------------------- */

    function __waitForConsent() {
        /* Wait for compliance if module uses (any) consent information and compliance service is enabled */
        if (__partnerProfile.consent && ComplianceService.isPrivacyEnabled()) {
            return ComplianceService.wait();
        }

        return null;
    }

    /**
     * Partner retrieve should wait until all delays are resolved before proceeding.
     * New defer conditions should be added to this list to come into effect.
     */
    var __partnerRetrieveWaits = [__waitForConsent];

    /* Retrieve Methods
     * ---------------------------------- */

    /**
     * Retrieve from cache.
     *
     * @returns {Promise} resolves on retrieve to cached value, or null upon pass/error
     */
    function __retrieveFromCache() {
        var cache = LocalCache.getEntry(__storageKey);

        return Prms.resolve()
            .then(function () {
                if (!cache) {

                    return null;
                }

                var triggers = __cacheBustTriggers[cache.data.response];

                if (!triggers) {

                    return null;
                }

                /* Each method should return either a boolean or promise, proceed when they are all resolved */
                return Prms.all(triggers.map(function (trigger) {
                    return trigger.call(null, cache);
                }));
            })
            .then(function (results) {
                /* Ignore cached value if at least one cache bust trigger has been activated */
                if (!results || results.indexOf(true) > -1) {
                    return null;
                }


                EventsService.emit('hs_identity_cached', {
                    statsId: __partnerStatsId
                });

                __registerRetrieval(cache.data.response, cache.data.data);

                return cache.data;
            });
    }

    /**
     * Retrieve from partner module.
     *
     * @returns {Promise} resolve when retrieve completes
     */
    function __retrieveFromPartner() {
        return Prms.resolve()
            .then(function () {
                /* Do not proceed until all delays have completed */
                return Prms.all(__partnerRetrieveWaits.map(function (wait) {
                    return wait.call();
                }));
            })
            .then(function () {
                return new Prms(function (resolve) {
                    EventsService.emit('hs_identity_request', {
                        statsId: __partnerStatsId
                    });

                    /* .register*() family of methods should only be called during a retrieve cycle and only once per retreive */
                    __isRegisterCalled = false;

                    /* The factory calls this in .register*() when module finishes retrieving, resolving the promise */
                    __retrieveResolve = resolve;

                    EventsService.emit('ip_module_retrieve_' + __partnerId);
                });
            });
    }

    /* Partner Module interface methods
     * ---------------------------------- */

    /**
     * Returns the partner headerstats ID.
     *
     * @return {string} Partner stats ID.
     */
    function getStatsId() {
        return __partnerStatsId;
    }

    /**
     * Returns retrieved data.
     *
     * @return {object} Stored data.
     */
    function getResults() {
        return __identityStore;
    }

    /**
     * Returns targeting KV used for the Identity Targeting feature.
     *
     * @return {object} Targeting KV.
     */
    function getTargets() {
        if (__identityEbKv) {
            return __identityEbKv;
        } else if (__identityStore && Utilities.isArray(__identityStore.uids) && __identityStore.uids.length && __identityStore.uids[0].id) {
            var kv = {};
            kv[__partnerProfile.targetingKeys.exchangeBidding] = __identityStore.uids[0].id;

            return kv;
        }

        return null;
    }

    /**
     * Attempt to retrieve data from data sources (cache -> onRetrieve callback)
     */
    function retrieve() {
        return __retrieveFromCache().then(function (results) {
            if (!results) {
                return __retrieveFromPartner();
            }

            return null;
        });
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        ComplianceService = SpaceCamp.services.ComplianceService;
        EventsService = SpaceCamp.services.EventsService;
        PublisherSonarService = SpaceCamp.services.PublisherSonarService;


        __partnerProfile = partnerModule.profile;
        __partnerId = __partnerProfile.partnerId;
        __partnerStatsId = __partnerProfile.statsId;

        __identityStore = null;
        __identityEbKv = null;
        __retrieveResolve = null;
        __storageKey = __partnerId;
        __consentProvided = {};

        __partnerApi = {
            Utilities: {
                /* Shared Pub-Kit utilities */
                buildUrl: Network.buildUrl,
                getPageUrl: Browser.getPageUrl,
                getProtocol: Browser.getProtocol,
                getReferrer: Browser.getReferrer,
                getTime: System.now,
                getType: Utilities.getType,
                isArray: Utilities.isArray,
                isEmpty: Utilities.isEmpty,
                isFunction: Utilities.isFunction,
                isInteger: Utilities.isInteger,
                isNumeric: Utilities.isNumeric,
                isString: Utilities.isString,
                isObject: Utilities.isObject,
                isTopFrame: Browser.isTopFrame,
                isXhrSupported: Network.isXhrSupported,

                /* Custom identity utilties */
                ajax: __apiUtilityGuardedAjax,
                getConsent: __apiUtilityGetConsent,
                getIdentityResultFrom: __apiUtilityGetIdentityResultFrom,
                getPublisherSonarData: __apiUtilityGetPublisherSonarData
            },

            /* Events */
            onRetrieve: EventsService.on.bind(null, 'ip_module_retrieve_' + __partnerId),
            onResult: EventsService.on.bind(null, 'ip_module_result_' + __partnerId),

            /* Data registers */
            registerMatch: __registerResponseRetrieval.bind(null, 'match'),
            registerPass: __registerResponseRetrieval.bind(null, 'pass'),
            registerError: __registerResponseRetrieval.bind(null, 'error'),
            registerEbTargeting: __apiRegisterEbTargeting,

            /* Config object */
            configs: validatedConfigs
        };

        partnerModule.main(__partnerApi);
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Data
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */


        getStatsId: getStatsId,
        getResults: getResults,
        getTargets: getTargets,
        retrieve: retrieve
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = IdentityPartnerFactory;
},{}],46:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Classify = require(13);
var Constants = require(16);
var Partner = require(47);
var System = require(32);
var Utilities = require(33);

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * The Dynamic Partner Loader looks for a partner module loaded in window
 * variables and loads it into the wrapper. From the viewpoint of the rest
 * of the wrapper, this class acts as a partner, but all demand requests
 * are forwarded and filled by the dynamically loaded one.
 *
 * Don't ever build a wrapper for a production site with ths "partner" included,
 * it will bloat the file by a lot since it unconditionally requires
 * schema-inspector.
 *
 * @class
 */
function DynamicPartnerLoader(configs) {
    var __profile;

    var __baseClass;

    /**
     * Stores the instantiated partner module after it's loaded.
     */
    var __enclosedPartner;

    /* These are probably the only source files that partner modules should
       be using. Map the filename to the actual module so we can mock the
       require function at runtime. */
    var __requiresMap = {
        'browser.js': require(11),
        'cache.js': require(12),
        'classify.js': require(13),
        'command-queue.js': require(14),
        'config-validators.js': require(15),
        'constants.js': require(16),
        'device-type-checker.js': require(17),
        'network.js': require(27),
        'openrtb.js': require(28),
        'openrtb2_5.js': require(29),
        'partner.js': require(47),
        'scribe.js': require(30),
        'size.js': require(31),
        'space-camp.js': require(61),
        'system.js': require(32),
        'utilities.js': require(33),
        'whoopsie.js': require(34)
    };

    /**
     * This function gets passed as a parameter to dynamically-loaded partner
     * modules to be used as their 'require' function. Use a map to return the
     * correct module from the wrapper source code so the partner module can
     * use it.
     *
     * @param  {string} reqString The source file name being required.
     * @return {opbject}          A functional module of some kind from the
     *                            wrapper.
     */
    function __requireProxy(reqString) {
        /* No way to know the filename of the partner's real validator at
           build time so we can only return our own in this case. The matching
           test page will run the partner's actual config validator. */
        if (reqString.indexOf('validator.js') !== -1) {
            return System.noOp;
        }

        return __requiresMap[reqString];
    }

    /**
     * Loads the partner module and its configs from global window variables.
     *
     * @return {none}
     */
    function __loadPartnerScript() {
        var partnerConfigs = Utilities.mergeObjects(configs, window.adapter.configs);

        var moduleProxy = {
            exports: {}
        };
        window.adapter.bidder(__requireProxy, moduleProxy, moduleProxy.exports);

        __enclosedPartner = moduleProxy.exports(partnerConfigs);
    }

    /**
     * Forward requests for demand to the loaded partner and return its response.
     *
     * @param  {string}    sessionId Session ID for the request
     * @param  {object[]}  inParcels The parcels describing the request
     * @return {Promise[]}           Array of promises for demand
     */
    function __retriever(sessionId, inParcels) {
        /* __enclosedPartner is instantiated synchronously in the constructor,
         * so this should always work unless we've already thrown an exception
         * somewhere else. (If the partner isn't ready, we'll just get an
         * empty array back.) */
        return __enclosedPartner.retrieve(sessionId, inParcels);
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        /* Nothing here actually matters but validation in the partner base class
         * requires that we include it. */
        __profile = {
            partnerId: 'DynamicPartnerLoader',
            namespace: 'DynamicPartnerLoader',
            statsId: 'DYNLDR',
            version: '1.0.0',
            targetingType: 'slot',
            enabledAnalytics: {
                requestTime: true
            },
            features: {
                demandExpiry: {
                    enabled: false,
                    value: 0
                },
                rateLimiting: {
                    enabled: false,
                    value: 0
                }
            },
            targetingKeys: {
                id: 'ix_dyn_id',
                om: 'ix_dyn_cpm',
                pm: 'ix_dyn_cpm',
                pmid: 'ix_dyn_dealid'
            },
            bidUnitInCents: 1,
            lineItemType: Constants.LineItemTypes.ID_AND_SIZE,
            callbackType: Partner.CallbackTypes.ID,
            architecture: Partner.Architectures.SRA,
            requestType: Partner.RequestTypes.ANY
        };

        /* If the partner module is buggy this can throw, but this whole thing
         * is for testing so we actually want it to. */
        __loadPartnerScript();

        var enclosedPartnerId = __enclosedPartner.getPartnerId();
        window.googletag.pubads().setTargeting('PARTNER_ID', enclosedPartnerId);

        /* Rewrite our namespace so wrapper sees us as the enclosed partner */
        __profile.namespace = enclosedPartnerId;

        __baseClass = Partner(__profile, configs, null, {
            retriever: __retriever
        });

        var enclosedDirectInterface = __enclosedPartner.getDirectInterface();

        if (enclosedDirectInterface.hasOwnProperty(enclosedPartnerId)) {
            for (var prop in enclosedDirectInterface[enclosedPartnerId]) {
                if (!enclosedDirectInterface[enclosedPartnerId].hasOwnProperty(prop)) {
                    continue;
                }

                __baseClass._addToDirectInterface(prop, enclosedDirectInterface[enclosedPartnerId][prop]);
            }
        }
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    var derivedClass = {
        /* Class Information
         * ---------------------------------- */



        /* Data
         * ---------------------------------- */

    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = DynamicPartnerLoader;
},{}],47:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var BidTransformer = require(10);
var CommandQueue = require(14);
var Constants = require(16);
var Network = require(27);
var Prms = require(20);
var SpaceCamp = require(61);
var System = require(32);
var Utilities = require(33);
var Whoopsie = require(34);

var EventsService;
var RenderService;
var KeyValueService;


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Base class for all partner modules.
 *
 * @class
 */
function Partner(profile, configs, requiredResources, fns) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    var __profile;

    var __ready;

    var __rateLimit;
    var __rateLimitMap;

    var __directInterface;

    var __retriever;
    var __generateRequestObj;
    var __parseResponse;

    var __bidTransformerDefaultConfigs;

    // Optional data passed into generateRequestObj function for partners.
    var optData = {
        keyValues: {}
    };

    /* Constants
     * ---------------------------------- */

    var BID_TRANSFORMER_TYPES = {
        PRICE: 'price',
        TARGETING: 'targeting',
        VIDEO: 'video'
    };

    /* Protected
     * ---------------------------------- */

    var _configs;

    var _cmd;

    var _adResponseStore;

    var _bidTransformers;

    /* Public
     * ---------------------------------- */

    var adResponseCallback;
    var adResponseCallbacks;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    function __generateAdResponseCallback(callbackId) {
        return function (adResponse) {
            _adResponseStore[callbackId] = adResponse;
            delete adResponseCallbacks[callbackId];
        };
    }

    /**
     * Emits the same headerstats event for the entire collection of slots provided.
     * @param  {string} sessionId            [description]
     * @param  {string} statsEventName       [description]
     * @param  {object} slotCollectionObject [description]
     * @return {[type]}                      [description]
     */
    function _emitStatsEvent(sessionId, statsEventName, slotCollectionObject) {
        for (var htSlotId in slotCollectionObject) {
            if (!slotCollectionObject.hasOwnProperty(htSlotId)) {
                continue;
            }

            for (var requestId in slotCollectionObject[htSlotId]) {
                if (!slotCollectionObject[htSlotId].hasOwnProperty(requestId)) {
                    continue;
                }

                if (!slotCollectionObject[htSlotId][requestId].length) {
                    continue;
                }

                EventsService.emit(statsEventName, {
                    sessionId: sessionId,
                    statsId: __profile.statsId,
                    htSlotId: htSlotId,
                    requestId: requestId,
                    xSlotNames: slotCollectionObject[htSlotId][requestId]
                });
            }
        }
    }

    /**
     * Figures out what the Bid Transformer configuration should be based on provided configs and defaults.
     * @param  {string} type        'price'/'targeting'; 'price' disables rounding buckets and hardcodes some values.
     * @param  {object} defaults    optional defaults when value is not available in config.
     * @return {object}             configuration object used to construct BidTransformer.
     */
    function _generateBidTransformerConfig(type, defaults) {
        var typeConfigOverride = {};

        /* For RETURN_PRICE, only bidUnitInCents is configurable, other values are hardcoded
         * roundingType NONE disable all rounding, so it's fine if floor and bucket configs are there */
        if (type === BID_TRANSFORMER_TYPES.PRICE) {
            typeConfigOverride = {
                outputCentsDivisor: 1,
                outputPrecision: 0,
                roundingType: 'NONE'
            };
        } else if (type === BID_TRANSFORMER_TYPES.TARGETING) {
            // Targeting bid transformer is read from a partner's config by default (legacy)
            typeConfigOverride = configs.bidTransformer;
        } else {
            /* All other targeting types are added to a partner's config via the partners layer
             * before the partner's constructor is invoked */
            typeConfigOverride = configs.bidTransformerTypes[type];
        }

        /* `mergeObjects` overwrites the current merge with each successive argument */
        return Utilities.mergeObjects(

            /* Built-in defaults */
            __bidTransformerDefaultConfigs[type],

            /* Defaults defined in partner profile */
            {
                bidUnitInCents: __profile.bidUnitInCents
            },

            /* Defaults passed in */
            defaults || {},

            /* Transformer type overrides */
            typeConfigOverride || {}
        );
    }

    function _generateReturnParcels(inParcels) {
        var returnParcelSets = [];
        if (__profile.architecture === Partner.Architectures.FSRA) {
            returnParcelSets.push([]);
        }

        var xSlotUsedCount = {};

        for (var i = 0; i < inParcels.length; i++) {
            var htSlotName = inParcels[i].htSlot.getName();

            if (!_configs.mapping.hasOwnProperty(htSlotName)) {
                continue;
            }

            var requestId = '_' + System.generateUniqueId();

            for (var j = 0; j < _configs.mapping[htSlotName].length; j++) {
                var returnParcel = {};

                var xSlotName = _configs.mapping[htSlotName][j];

                returnParcel.partnerId = __profile.partnerId;
                returnParcel.partnerStatsId = __profile.statsId;
                returnParcel.htSlot = inParcels[i].htSlot;
                returnParcel.ref = inParcels[i].ref;
                returnParcel.xSlotRef = _configs.xSlots[xSlotName];
                returnParcel.xSlotName = xSlotName;
                returnParcel.requestId = requestId;
                if (inParcels[i].firstPartyData) {
                    returnParcel.firstPartyData = inParcels[i].firstPartyData;
                }

                if (inParcels[i].identityData) {
                    returnParcel.identityData = inParcels[i].identityData;
                }

                if (__profile.architecture === Partner.Architectures.MRA) {
                    returnParcelSets.push([returnParcel]);
                } else {
                    if (__profile.architecture === Partner.Architectures.FSRA) {
                        returnParcelSets[0].push(returnParcel);
                    } else {
                        if (!xSlotUsedCount.hasOwnProperty(xSlotName)) {
                            xSlotUsedCount[xSlotName] = 0;
                        }

                        if (returnParcelSets.length < xSlotUsedCount[xSlotName] + 1) {
                            returnParcelSets.push([]);
                        }

                        returnParcelSets[xSlotUsedCount[xSlotName]].push(returnParcel);
                        xSlotUsedCount[xSlotName]++;
                    }
                }
            }
        }

        return returnParcelSets;
    }

    function _sendDemandRequest(sessionId, returnParcels) {
        if (returnParcels.length === 0) {
            return Prms.resolve([]);
        }

        optData.keyValues = KeyValueService.getDefaultKeyValueData();

        // Return key value data if partner adapter has permission.
        if (KeyValueService.hasKeyValueAccess(__profile.partnerId)) {
            optData.keyValues = KeyValueService.getKeyValueData();
        }
        var request = __generateRequestObj(returnParcels, optData);

        // Empty request means do not send a bid request
        if (Utilities.isEmpty(request)) {

            return Prms.resolve([]);
        }

        if (__profile.callbackType === Partner.CallbackTypes.CALLBACK_NAME) {
            adResponseCallbacks[request.callbackId] = __generateAdResponseCallback(request.callbackId);
        }
        var xSlotNames = {};

        if (__profile.enabledAnalytics.requestTime) {
            for (var i = 0; i < returnParcels.length; i++) {
                var parcel = returnParcels[i];
                var htSlotId = parcel.htSlot.getId();
                var requestId = parcel.requestId;

                if (!xSlotNames.hasOwnProperty(htSlotId)) {
                    xSlotNames[htSlotId] = {};
                }

                if (!xSlotNames[htSlotId].hasOwnProperty(requestId)) {
                    xSlotNames[htSlotId][requestId] = [];
                }

                xSlotNames[htSlotId][requestId].push(parcel.xSlotName);
            }

            _emitStatsEvent(sessionId, 'hs_slot_request', xSlotNames);
        }

        return new Prms(function (resolve) {
            EventsService.emit('partner_request_sent', {
                partner: __profile.partnerId,
            });

            var startTime;

            var defaultNetworkParams = {
                url: request.url,
                data: request.data,
                method: 'GET',
                timeout: _configs.timeout,
                withCredentials: true,
                jsonp: true,
                sessionId: sessionId,
                globalTimeout: true,
                continueAfterTimeout: true,


                onSuccess: function (responseText, endtime, timedOut) {
                    var responseObj;
                    var requestStatus = 'success';

                    try {
                        if (__profile.callbackType === Partner.CallbackTypes.NONE) {
                            responseObj = JSON.parse(responseText);
                        } else {
                            if (responseText) {
                                eval.call(null, responseText);
                            }
                            responseObj = _adResponseStore[request.callbackId];
                            delete _adResponseStore[request.callbackId];
                        }

                        if (!timedOut || __profile.parseAfterTimeout) {
                            __parseResponse(sessionId, responseObj, returnParcels, xSlotNames, startTime, endtime, timedOut);
                        }
                    } catch (ex) {
                        EventsService.emit('internal_error', __profile.partnerId + ' error parsing demand: ' + ex, ex.stack);

                        requestStatus = 'error';

                        if (__profile.enabledAnalytics.requestTime && !timedOut) {
                            _emitStatsEvent(sessionId, 'hs_slot_error', xSlotNames);
                        }
                    }

                    EventsService.emit('partner_request_complete', {
                        sessionId: sessionId,
                        partner: __profile.partnerId,
                        status: requestStatus,
                    });
                    resolve(returnParcels);
                },

                onTimeout: function () {
                    EventsService.emit('partner_request_complete', {
                        sessionId: sessionId,
                        partner: __profile.partnerId,
                        status: 'timeout',
                    });

                    if (__profile.enabledAnalytics.requestTime) {
                        _emitStatsEvent(sessionId, 'hs_slot_timeout', xSlotNames);
                    }

                    resolve(returnParcels);
                },

                onFailure: function () {
                    EventsService.emit('partner_request_complete', {
                        sessionId: sessionId,
                        partner: __profile.partnerId,
                        status: 'error',
                    });

                    if (__profile.enabledAnalytics.requestTime) {
                        _emitStatsEvent(sessionId, 'hs_slot_error', xSlotNames);
                    }

                    resolve(returnParcels);
                }
            };

            var networkParams;

            /* If custom network params are specified */
            if (request.networkParamOverrides) {
                networkParams = Utilities.mergeObjects(defaultNetworkParams, request.networkParamOverrides);
            } else {
                networkParams = defaultNetworkParams;
            }

            if (__profile.callbackType === Partner.CallbackTypes.NONE || __profile.requestType === Partner.RequestTypes.AJAX) {
                networkParams.jsonp = false;
            }

            /* Make request based on supported type */
            if (__profile.requestType === Partner.RequestTypes.JSONP) {
                startTime = Network.jsonp(networkParams);
            } else {
                startTime = Network.ajax(networkParams);
            }
        });
    }

    /* Helpers
     * ---------------------------------- */
    function _pushToCommandQueue(fn) {
        _cmd.push(fn);
    }

    function isReady() {
        return __ready;
    }

    /* Getters and Setters
     * ---------------------------------- */

    function _setDirectInterface(directInterface) {
        __directInterface = {};
        __directInterface[__profile.namespace] = directInterface;
    }

    function _addToDirectInterface(key, value) {
        __directInterface[__profile.namespace][key] = value;
    }

    function getPartnerId() {
        return __profile.partnerId;
    }

    function getDirectInterface() {
        return __directInterface;
    }

    function getPrefetchDisabled() {
        return __profile.features.prefetchDisabled && __profile.features.prefetchDisabled.enabled;
    }

    /* Main
     * ---------------------------------- */

    function retrieve(sessionId, inParcels) {

        inParcels = inParcels.slice();

        if (_configs.rateLimiting.enabled) {
            var now = System.now();

            if (__profile.targetingType === 'page') {
                if (now <= __rateLimit) {
                    return [];
                } else {
                    __rateLimit = now + _configs.rateLimiting.value;
                }
            } else {
                for (var i = inParcels.length - 1; i >= 0; i--) {
                    var htSlotId = inParcels[i].htSlot.getName();

                    if (__rateLimitMap.hasOwnProperty(htSlotId) && now <= __rateLimitMap[htSlotId]) {
                        inParcels.splice(i, 1);
                    } else {
                        __rateLimitMap[htSlotId] = now + _configs.rateLimiting.value;
                    }
                }
            }
        }

        if (!inParcels.length) {
            return [];
        }

        if (__retriever) {
            return __retriever(sessionId, inParcels);
        }

        var returnParcelSets = _generateReturnParcels(inParcels);

        var demandRequestPromises = [];
        for (var j = 0; j < returnParcelSets.length; j++) {
            demandRequestPromises.push(_sendDemandRequest(sessionId, returnParcelSets[j]));
        }

        return demandRequestPromises;
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        EventsService = SpaceCamp.services.EventsService;
        RenderService = SpaceCamp.services.RenderService;
        KeyValueService = SpaceCamp.services.KeyValueService;


        __bidTransformerDefaultConfigs = {
            targeting: {
                // Should always be overwritten by partner profile
                bidUnitInCents: 1,
                outputCentsDivisor: 1,
                outputPrecision: 0,
                roundingType: 'FLOOR',
                floor: 0,
                buckets: [
                    {
                        max: 2000,
                        step: 5
                    },
                    {
                        max: 5000,
                        step: 100
                    }
                ]
            },
            price: {
                // Should always be overwritten by partner profile
                bidUnitInCents: 1
            },
            video: {
                // Can be overwritten by global video transformer
                bidUnitInCents: 1,
                outputCentsDivisor: 1,
                outputPrecision: 0,
                roundingType: 'FLOOR',
                floor: 0,
                buckets: [
                    {
                        max: 300,
                        step: 1
                    },
                    {
                        max: 2000,
                        step: 5
                    },
                    {
                        max: 7000,
                        step: 100
                    }
                ]
            }
        };

        __profile = profile;

        __rateLimit = 0;
        __rateLimitMap = {};

        _cmd = [];

        adResponseCallbacks = {};
        _adResponseStore = {};

        _configs = {
            timeout: 0,
            lineItemType: profile.lineItemType,
            targetingKeys: profile.targetingKeys,
            rateLimiting: profile.features.rateLimiting
        };

        if (configs.hasOwnProperty('timeout') && configs.timeout > 0) {
            _configs.timeout = configs.timeout;

            EventsService.emit('hs_define_partner_timeout', {
                timeout: _configs.timeout,
                statsId: __profile.statsId
            });
        }

        if (configs.hasOwnProperty('targetingKeyOverride')) {
            for (var targetingKey in configs.targetingKeyOverride) {
                if (!configs.targetingKeyOverride.hasOwnProperty(targetingKey)) {
                    continue;
                }

                if (_configs.targetingKeys.hasOwnProperty(targetingKey)) {
                    _configs.targetingKeys[targetingKey] = configs.targetingKeyOverride[targetingKey];
                }
            }
        }

        if (configs.hasOwnProperty('rateLimiting')) {
            if (configs.rateLimiting.hasOwnProperty('enabled')) {
                _configs.rateLimiting.enabled = configs.rateLimiting.enabled;
            }

            if (configs.rateLimiting.value) {
                _configs.rateLimiting.value = configs.rateLimiting.value;
            }
        }

        if (configs.hasOwnProperty('lineItemType')) {
            _configs.lineItemType = Constants.LineItemTypes[configs.lineItemType];
        }

        _configs.xSlots = configs.xSlots;
        _configs.mapping = configs.mapping;

        __ready = false;

        if (requiredResources) {
            if (!Utilities.isArray(requiredResources)) {
                requiredResources = [requiredResources];
            }

            var resourcePromises = [];

            requiredResources.map(function (url) {
                var deferred = Prms.defer();
                resourcePromises.push(deferred.promise);

                Network.jsonp({
                    url: url,
                    onSuccess: function () {
                        deferred.resolve();
                    }
                });
            });

            Prms.all(resourcePromises).then(function () {
                __ready = true;
                EventsService.emit('partner_instantiated', {
                    partner: __profile.partnerId
                });
                _cmd = CommandQueue(_cmd);
            });
        } else {
            EventsService.emit('partner_instantiated', {
                partner: __profile.partnerId
            });
            __ready = true;
        }

        RenderService.registerPartner(__profile.partnerId, _configs.lineItemType, _configs.targetingKeys.id);

        _bidTransformers = {};

        /* Non-bidder partner modules will not have bidUnitInCents defined */
        if (profile.hasOwnProperty('bidUnitInCents')) {
            _bidTransformers.targeting = BidTransformer(_generateBidTransformerConfig(BID_TRANSFORMER_TYPES.TARGETING));
            _bidTransformers.price = BidTransformer(_generateBidTransformerConfig(BID_TRANSFORMER_TYPES.PRICE));
            _bidTransformers.video = BidTransformer(_generateBidTransformerConfig(BID_TRANSFORMER_TYPES.VIDEO));
        }

        if (fns.retriever) {
            __retriever = fns.retriever;
        } else {
            __parseResponse = fns.parseResponse;
            __generateRequestObj = fns.generateRequestObj;

            adResponseCallback = fns.adResponseCallback;
        }

        __directInterface = {};
        if (!__directInterface.hasOwnProperty(__profile.namespace)) {
            __directInterface[__profile.namespace] = {};
        }

        if (__profile.callbackType === Partner.CallbackTypes.ID) {
            __directInterface[__profile.namespace].adResponseCallback = adResponseCallback;
        } else {
            __directInterface[__profile.namespace].adResponseCallbacks = adResponseCallbacks;
        }
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Data
         * ---------------------------------- */

        _configs: _configs,
        _adResponseStore: _adResponseStore,
        _bidTransformers: _bidTransformers,

        /* Functions
         * ---------------------------------- */

        _setDirectInterface: _setDirectInterface,
        _addToDirectInterface: _addToDirectInterface,

        _generateReturnParcels: _generateReturnParcels,
        _emitStatsEvent: _emitStatsEvent,
        _pushToCommandQueue: _pushToCommandQueue,

        _generateBidTransformerConfig: _generateBidTransformerConfig,

        getPartnerId: getPartnerId,
        getDirectInterface: getDirectInterface,
        getPrefetchDisabled: getPrefetchDisabled,

        isReady: isReady,
        retrieve: retrieve
    };
}

////////////////////////////////////////////////////////////////////////////////
// Enumerations ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

Partner.Architectures = {
    MRA: 0,
    SRA: 1,
    FSRA: 2
};

Partner.CallbackTypes = {
    ID: 0,
    CALLBACK_NAME: 1,
    NONE: 2
};

Partner.RequestTypes = {
    ANY: 0,
    AJAX: 1,
    JSONP: 2
};

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Partner;
},{}],48:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Utilities = require(33);
var Cmp = require(49);
var Classify = require(13);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Base class for all CMPs
 *
 * @class
 */
function Ccpa() {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Constants
     * ---------------------------------- */

    /*
     * USP API function of the window
     *
     * @const {string}
     */
    var __USP_WINDOW_FUNCTION = '__uspapi';

    /*
     * Command name as specified by the CMP API
     *
     * @const {string}
     */
    var __USP_COMMAND = 'getUSPData';

    /**
     * The property to check to validate messages returned by an iframe
     *
     * @const string
     */
    var __USP_FRAME_MESSAGE_PROPERTY = '__uspapiReturn';

    /**
     * The identifying name of the messaging frame to look for
     *
     * @const {string}
     */
    var __USP_FRAME_NAME = '__uspapiLocator';

    /* Private
     * ---------------------------------- */

    /**
     * Reference to the partner base class.
     *
     * @private {object}
     */
    var __baseClass;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /**
     * Function to pass as a callback to Uspapi process
     *
     * @param  {Object} result Resulting object to interpret
     * @param  {Boolean} success Whether or not the previous call was successful
     * @return {Boolean} whether or not the callback was successful
     */
    function __uspCallback(result, success) {
        var type = Utilities.getType(result);

        /* If Uspapi API returns undefined there's nothing to do with it, so use default values. */
        if (type === 'undefined' || !success) {
            return false;
        }


        if (type === 'object') {

            // Use the programmic result interpretation using _dataModel
            __baseClass._interpretResultObject(result);
            __baseClass._obtainedConsent = true;
        } else {
        }

        __baseClass._defer.resolve();

        return true;
    }

    /**
     * Wrapper to call the base _messageListener method with the USP-specific property and callback
     *
     * @param  {Object} event Window event object
     * @return {any} Any result from the base method (which returns the callback return)
     */
    function _messageListener(event) {
        return __baseClass._messageListener(event, __USP_FRAME_MESSAGE_PROPERTY, __uspCallback, _messageListener);
    }

    function getConsent() {
        return __baseClass.getConsent(__baseClass._dataModel);
    }

    function hasObtainedConsent() {
        return __baseClass._obtainedConsent;
    }

    function getPromise() {
        return __baseClass._defer.promise;
    }

    function runCleanup() {
        return __baseClass._cleanup();
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        __baseClass = Cmp();

        __baseClass._dataModel = {
            version: {
                type: 'number',
                default: 1
            },
            uspString: {
                type: 'string',
                default: ''
            }
        };

        __baseClass._addRetriever(
            __baseClass._callInWindow(
                __USP_WINDOW_FUNCTION,
                __USP_COMMAND,
                __baseClass._dataModel.version,
                __uspCallback
            )
        );

        __baseClass._addRetriever(
            __baseClass._callInFrame(__USP_FRAME_NAME,
                {
                    __uspapiCall: {
                        command: __USP_COMMAND,
                        parameter: null,
                        version: __baseClass._dataModel.version
                    }
                },
                _messageListener)
        );
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    var derivedClass = {
        /* Class Information
         * ---------------------------------- */
        __type__: 'Ccpa',

        /* Data
         * ---------------------------------- */

        /* Functions
         * ---------------------------------- */
        getConsent: getConsent,
        hasObtainedConsent: hasObtainedConsent,
        getPromise: getPromise,
        runCleanup: runCleanup,

    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Ccpa;
},{}],49:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Prms = require(20);
var Utilities = require(33);
var Browser = require(11);
var System = require(32);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Base class for all CMPs
 *
 * @class
 */
function Cmp() {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /**
     * Identifier to confirm frame postMessage listeners
     *
     * @private {String}
     */
    var __postMessageId;

    /* Protected
     * ---------------------------------- */

    /**
     * Array of retriever functions to be run
     *
     * @private {Array}
     */
    var __retrievers;

    /**
     * Cpm-specific deferal object to be resolved when retrieve is completed
     *
     * @protected {Object}
     */
    var _defer;

    /**
     * Defines the translation between a possible result object (that is returned
     * to a callback function) and the expected _dataModel so that it can be programmatically interpreted
     * into something that matches the _dataModel. For example, with GDPR:
     *
     * _dataModel = {
     *    applies: {
     *        type: 'boolean',
     *        properties: ['gdprApplies', isUserInEu']
     *    },
     *    consentString: {
     *        type: 'string',
     *        properties: ['consentData']
     *    }
     * }
     *
     * Basically says that we will look at the result object to be interpreted, first for
     * either result.gdprApplies or result.isUserInEu (whichever is found first) that is a
     * boolean and assign it to the _dataModel.applies value. Similarly, we will look for
     * result.consentData that is a string and apply it to _dataModel.consentString
     *
     * @protected {Object}
     */
    var _dataModel;

    /**
     * Function that can be accessed with runCleanup, intended to be
     * attached externally to the global consent timeout/defer
     *
     * @protected {Function}
     */
    var _cleanup;

    /**
     * Name of a custom window function that can be run during retrieve
     *
     * @protected {String}
     */
    var _customFunction;

    /**
     * Holds state as to whether or not consent has been obtained
     * (i.e. callback received)
     *
     * @protected {Boolean}
     */
    var _obtainedConsent;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /**
     * Loops through each defined retriever, stopping after the first that is called successfully.
     * Returns whether or not any retriever was successful. Resolves the defer if none were successful.
     * It will keep track of which retriever was successful (by removing all others) so that only
     * it is called on subsequent retrievals
     *
     * @return {boolean}    Whether or not any retriever was successful
     */
    function retrieve() {
        var calledSomehow = false;
        var successfulRetriever;

        for (var r in __retrievers) {
            if (__retrievers[r].retrieve()) {
                calledSomehow = true;
                successfulRetriever = r;

                break;
            }
        }

        // Wasn't called elsewhere? Just resolve
        if (!calledSomehow) {
            _defer.resolve();
        } else {
            __retrievers = __retrievers.splice(successfulRetriever, 1);
        }

        return calledSomehow;
    }

    /**
     * Adds a retriever function to the array of retrievers, optionally by a specific name
     * so it can be de-registered/removed later if desired (i.e. setting up an event listener)
     *
     * @param  {string} retrieverFunction The actual function that performs the retrieval
     * @param  {string} name Optional name for this retriever, if it is to be referenced later
     */
    function _addRetriever(retrieverFunction, name) {
        __retrievers.push({
            // Just name it by the order it was received if not specified
            name: name || __retrievers.length,
            retrieve: retrieverFunction
        });
    }

    /**
     * Removes a retriever by it's registered name from the __retrievers array
     *
     * @param  {string} The name of the retriever that was provided when _addRetriever was called
     */
    function _removeRetriever(name) {
        // Let's not use filter() just in case
        for (var r in __retrievers) {
            if (__retrievers[r].name === name) {
                __retrievers.splice(r, 1);
            }
        }
    }

    /**
     * Programmatically interprets a result object (such as from a window.__whatever API)
     * and translates the possible result property values into the _dataModel properties
     * that we really want to return. This is defined in the _dataModel object
     *
     * @param  {object} result The result object from a callback
     */
    function _interpretResultObject(result) {
        var self = this; // eslint-disable-line no-invalid-this, consistent-this
        var model = self._dataModel;
        var properties = Object.keys(model);

        // Loop through each property that we want
        properties.forEach(function (property) {
            var propertyRules = model[property];

            // Default expectedType
            var expectedType = 'string';
            var resultProperties = [];

            // Check expectedType
            switch (Utilities.getType(propertyRules)) {
                case 'object':
                    // Expecting a rule that is an object, e.g.: { type: 'string', properties: [...] }
                    if (propertyRules.hasOwnProperty('type')) {
                        expectedType = propertyRules.type;
                    } else {
                        // Expected a result property, just continue
                        return;
                    }

                    break;
                case 'string':
                    // The rule itself is a string, so it's just a 1-to-1 mapping with the expectedType
                    expectedType = model[property];

                    break;
                default:
                    // Continue to use default 'string' for expectedType
                    break;
            }

            // Check valid properties
            if (Utilities.getType(propertyRules) === 'object' && propertyRules.hasOwnProperty('properties')) {
                switch (Utilities.getType(propertyRules.properties)) {
                    case 'array':
                        // A simple array of possible properties, in order of precendence
                        resultProperties = propertyRules.properties;

                        break;

                    case 'object':
                        // A key/value object with versions, i.e. { 'v1.0': 'propertyA', 'v1.1': 'propertyB' }
                        // Build an array, but put them in order with highest version first
                        var versions = Object.keys(propertyRules.properties);
                        versions.sort().reverse()
                            .forEach(function (key) {
                                resultProperties.push(propertyRules.properties[key]);
                            });

                        break;

                    default:
                        // Invalid, return and go on to the next property
                        return;
                }
            } else {
                // No properties defined, it's just a 1-to-1 mapping
                resultProperties = [property];
            }

            // Check each supported result property, translate each result.property -> _dataModel.property
            resultProperties.some(function (resultProperty) {
                if (result.hasOwnProperty(resultProperty) && Utilities.getType(result[resultProperty]) === expectedType) {
                    self._dataModel[property].value = result[resultProperty];

                    // Break after the first matching result property
                    return true;
                }
            });
        });
    }

    /**
     * A retriever that specifically calls a custom function if one was registered
     *
     * @param  {function} Result callback
     * @return {function} A function that returns whether or not the custom function call was successful
     */
    function _callCustomFunction(callback) {
        return function () {
            if (_customFunction !== null) {
                try {
                    _customFunction(callback);

                    return true;
                } catch (ex) {
                }
            }

            return false;
        };
    }

    /**
     * Calls the CMP API function on the page
     *
     * @param  {string}   windowFunction Function of the window to call
     * @param  {string}   command        Name of the CMP API command to pass through
     * @param  {any}      argument       Any argument to pass through to the API (version)
     * @param  {function} callback       Callback function for the API
     * @return {function} Returns a function that returns whether or not a window function was called
     */
    function _callInWindow(windowFunction, command, argument, callback) {
        return function () {
            if (window[windowFunction] && Utilities.getType(window[windowFunction]) === 'function') {
                try {
                    window[windowFunction](command, argument, callback);

                    return true;
                } catch (ex) {
                }
            }

            return false;
        };
    }

    /**
     * Listener for messages sent from CMP iFrame
     *
     * @param  {object} ev Event data from the event listener
     * @param  {string} checkProperty The property of the event data that contains our message
     * @param  {function} callback The call to be made if the listener and data was successful
     * @param  {function} reference to the original listener so the event can be remove/unsubscribed
     */
    function _messageListener(event, checkProperty, callback, listener) {
        try {
            var dataObj;

            if (Utilities.getType(event.data) === 'string') {
                dataObj = JSON.parse(event.data);
            } else {
                dataObj = event.data;
            }

            // Check for valid CMP return object
            if (!dataObj.hasOwnProperty(checkProperty) || Utilities.getType(dataObj[checkProperty]) !== 'object') {
                return;
            }

            var retVal = dataObj[checkProperty];
            if (retVal.callId === __postMessageId) {
                window.removeEventListener('message', listener, false);

                return callback(retVal.returnValue, retVal.success);
            }
        } catch (ex) {
        }
    }

    /**
     * Common function to look for a particular frame in the browser context and post a
     * message to it if it exists.
     *
     * @param  {string} contextSearch Name of the frame or context property to look for
     * @param  {object} message       Message to emit into the frame
     * @return {function} A function that returns whether or not the frame was found and a message was emitted
     */
    function _callInFrame(contextSearch, message, listener) {
        return function () {
            // Try to look for a Uspapi in an ancestor frame

            // Locate an ancestor frame with either the desired context property or frame name
            var frame = Browser.traverseContextTree(function (context) {
                var childElements = [];
                if (context) {
                    childElements = context.document.getElementsByName(contextSearch);
                }

                if ((context && context[contextSearch]) || (childElements.length > 0 && childElements[0].tagName.toLowerCase() === 'iframe')) {
                    return context;
                }

                return null;
            });

            // If we found one, send it a message.
            if (frame) {
                __postMessageId = System.generateUniqueId();

                message.callId = __postMessageId;
                window.addEventListener('message', listener, false);
                frame.postMessage(message, '*');

                return true;
            }

            return false;
        };
    }

    /**
     * Validate and save a custom function by name
     *
     * @param  {string} configFunction Name of the function
     * @return {none}
     */
    function _registerCustomFunction(configFunction) {
        if (configFunction) {
            _customFunction = configFunction;

            try {
                _customFunction = eval(configFunction);
                if (Utilities.getType(_customFunction) !== 'function') {
                    _customFunction = null;
                }
            } catch (ex) {
                _customFunction = null;
            }
        } else {
            _customFunction = null;
        }
    }

    /**
     * Overridable public function to return a copy of the consent string/object
     * Probably a copy of __baseClass._dataModel
     *
     * @return {object}
     */
    function getConsent(dataModel) {
        var outputObject = {};
        Object.keys(dataModel).forEach(function (property) {
            if (dataModel[property].hasOwnProperty('value')) {
                outputObject[property] = dataModel[property].value;
            } else if (dataModel[property].hasOwnProperty('default')) {
                outputObject[property] = dataModel[property].default;
            } else {
                outputObject[property] = null;
            }
        });

        return outputObject;
    }

    /**
     * Overridable public function to return the state of whether or not
     * consent has been successful retrieved/obtained
     *
     * @return {boolean}
     */
    function hasObtainedConsent() {
        return false;
    }

    /**
     * Overridable public function to return the promise that is to be
     * resolved when the CMP API is called and found.
     * Probably __baseClass._defer.promise
     *
     * @return {object}
     */
    function getPromise() {
        return {};
    }

    /**
     * Overridable public function to return a custom function that is to
     * be run when all CMPs have been resolved
     * Probably __baseClass._cleanup
     *
     * @return {function}
     */
    function runCleanup() {
        return _cleanup();
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        __retrievers = [];
        _dataModel = {};
        _defer = Prms.defer();
        _cleanup = function () { };
        _customFunction = null;
        _obtainedConsent = false;
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */

        __type__: 'Cmp',

        /* Data
         * ---------------------------------- */
        _dataModel: _dataModel,
        _defer: _defer,
        _cleanup: _cleanup,
        _obtainedConsent: _obtainedConsent,

        /* Functions
         * ---------------------------------- */
        retrieve: retrieve,
        getPromise: getPromise,
        getConsent: getConsent,
        hasObtainedConsent: hasObtainedConsent,
        runCleanup: runCleanup,
        _addRetriever: _addRetriever,
        _removeRetriever: _removeRetriever,
        _interpretResultObject: _interpretResultObject,
        _registerCustomFunction: _registerCustomFunction,
        _callInWindow: _callInWindow,
        _callCustomFunction: _callCustomFunction,
        _callInFrame: _callInFrame,
        _messageListener: _messageListener
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Cmp;
},{}],50:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Utilities = require(33);
var Cmp = require(49);
var Classify = require(13);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Base class for all CMPs
 *
 * @class
 */
function Gdpr(configs) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Constants
     * ---------------------------------- */

    /**
     * How often to recheck the CMP if we don't have a response yet
     *
     * @const {integer}
     */
    var __CMP_CHECK_INTERVAL = 250;

    /*
     * CMP API function of the window
     *
     * @const {string}
     */
    var __CMP_WINDOW_FUCTION = '__cmp';

    /*
     * Command name as specified by the CMP API
     *
     * @const {string}
     */
    var __CMP_COMMAND = 'getConsentData';

    /**
     * The property to check to validate messages returned by an iframe
     *
     * @const string
     */
    var __CMP_FRAME_MESSAGE_PROPERTY = '__cmpReturn';

    /**
     * Identifying context property of the iframe
     *
     * @const {string}
     */
    var __CMP_FRAME_CONTEXT_PROPERTY = '__cmpLocator';

    /* Private
     * ---------------------------------- */

    /**
     * Reference to the partner base class.
     *
     * @private {object}
     */
    var __baseClass;

    var __complianceTimeout;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /**
     * Function to pass as a callback to Gdpr process
     *
     * @param  {Object} result Resulting object to interpret
     * @param  {Boolean} success Whether or not the previous call was successful
     * @return {Boolean} whether or not the callback was successful
     */
    function __cmpCallback(result) {
        var type = Utilities.getType(result);

        /* Undefined most likely means the callback was run immediately without waiting
           for the CMP to have an answer. Regardless of the reason, we can't do
           anything meaningful with it. */
        if (type === 'undefined') {
            return false;
        }


        if (type === 'string') {
            __baseClass._dataModel.consentString.value = result;
            __baseClass._obtainedConsent = true;
        } else if (type === 'object') {

            // Use the programmic result interpretation using _dataModel
            __baseClass._interpretResultObject(result);
            __baseClass._obtainedConsent = true;
        } else {
        }

        // If not one of those two types, we don't know how to interpret it.

        /* If we got something defined, assume that's the best we're going to get.
           Resolve the promise */
        __baseClass._defer.resolve();

        return true;
    }

    /**
     * Wrapper/override for the base _callInWindow method. Setup to be able to
     * get the result of the standard _callInWindow method, but also setup a
     * GDPR-specific interval to re-call periodically
     *
     * @param  {string}   windowFunction Function of the window to call
     * @param  {string}   command        Name of the CMP API command to pass through
     * @param  {any}      argument       Any argument to pass through to the API (version)
     * @param  {function} callback       Callback function for the API
     * @return {function} A function that returns whether or not a window function was successfully called
     */
    function _callInWindow(windowFunction, command, argument, callback) {
        return function () {
            var callOnce = function () {
                return __baseClass._callInWindow(__CMP_WINDOW_FUCTION, __CMP_COMMAND, null, callback)();
            };

            var result = callOnce();

            if (__complianceTimeout > 0) {
                /* Set an interval to keep checking, because some CMPs call our callback
                   immediately even though they're supposed to wait. */
                var cmpCallIntervalId = window.setInterval(callOnce, __CMP_CHECK_INTERVAL);

                /* Cancel the interval once we either timeout or get a response.
                 * Set it up as a cleanup method */
                __baseClass._cleanup = function () {
                    window.clearInterval(cmpCallIntervalId);
                };
            }

            return result;
        };
    }

    /**
     * Wrapper to call the base _messageListener method with the GDPR-specific property and callback
     *
     * @param  {Object} event Window event object
     * @return {any} Any result from the base method (which returns the callback return)
     */
    function _messageListener(event) {
        return __baseClass._messageListener(event, __CMP_FRAME_MESSAGE_PROPERTY, __cmpCallback, _messageListener);
    }

    function getConsent() {
        return __baseClass.getConsent(__baseClass._dataModel);
    }

    function hasObtainedConsent() {
        return __baseClass._obtainedConsent;
    }

    function getPromise() {
        return __baseClass._defer.promise;
    }

    function runCleanup() {
        __baseClass._cleanup();
    }

    function setApplies(applies) {
        __baseClass._dataModel.applies.value = applies;
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        __baseClass = Cmp();

        __complianceTimeout = configs.timeout;

        __baseClass._registerCustomFunction(configs.customFn);

        __baseClass._dataModel = {
            applies: {
                type: 'boolean',
                default: true,
                properties: {
                    'v1.1': 'gdprApplies',
                    'v1.0': 'isUserInEu'
                }
            },
            consentString: {
                type: 'string',
                default: '',
                properties: ['consentData']
            },
            version: {
                type: 'number',
                default: 1
            }
        };

        __baseClass._addRetriever(
            __baseClass._callCustomFunction(__cmpCallback)
        );

        __baseClass._addRetriever(
            _callInWindow(__CMP_WINDOW_FUCTION, __CMP_COMMAND, null, __cmpCallback)
        );

        __baseClass._addRetriever(
            __baseClass._callInFrame(__CMP_FRAME_CONTEXT_PROPERTY,
                {
                    __cmpCall: {
                        command: __CMP_COMMAND,
                        parameter: null
                    }
                },
                _messageListener)
        );
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    var derivedClass = {
        /* Class Information
         * ---------------------------------- */
        __type__: 'Gdpr',

        /* Data
         * ---------------------------------- */

        /* Functions
         * ---------------------------------- */
        getConsent: getConsent,
        hasObtainedConsent: hasObtainedConsent,
        getPromise: getPromise,
        setApplies: setApplies,
        runCleanup: runCleanup,

    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Gdpr;
},{}],51:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Utilities = require(33);
var Cmp = require(49);
var Classify = require(13);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function Tcf2() {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Constants
     * ---------------------------------- */

    /*
     * USP API function of the window
     *
     * @const {string}
     */
    var __TCF_WINDOW_FUNCTION = '__tcfapi';

    /*
     * Command name as specified by the TCF2 API
     *
     * @const {string}
     */
    var __TCF_GET_COMMAND = 'getTCData';

    /*
     * The event listener command specified by the TCF2 API
     *
     * @const {string}
     */
    var __TCF_EVENT_COMMAND = 'addEventListener';

    /**
     * The property to check to validate messages returned by an iframe
     *
     * @const string
     */
    var __TCF_FRAME_MESSAGE_PROPERTY = '__tcfapiReturn';

    /**
     * The identifying name of the messaging frame to look for
     *
     * @const {string}
     */
    var __TCF_FRAME_NAME = '__tcfapiLocator';

    /**
     * State of whether or not the 'addEventListener' command has been
     * setup and sent to __tcfapi (so we don't do it more than once)
     *
     * @const {boolean}
     */
    var __eventRegistered = false;

    /* Private
     * ---------------------------------- */

    /**
     * Reference to the partner base class.
     *
     * @private {object}
     */
    var __baseClass;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /**
     * Function to pass as a callback to Tcf process
     *
     * @param  {Object} result Resulting object to interpret
     * @param  {Boolean} success Whether or not the previous call was successful
     * @return {Boolean} whether or not the callback was successful
     */
    function __tcfCallback(result, success) {
        var type = Utilities.getType(result);

        /* If tcfapi API returns undefined there's nothing to do with it, so use default values. */
        if (type === 'undefined' || !success) {
            return false;
        }


        if (type === 'object') {

            // Use the programmic result interpretation using _dataModel
            __baseClass._interpretResultObject(result);
            __baseClass._obtainedConsent = true;
        } else {
        }

        __baseClass._defer.resolve();

        return true;
    }

    /**
     * A callback/interpretation function specifically for the addEventListener
     * __tcfapi command that de-registers the 'getTCData' command listener
     *
     * @param  {Object} result Resulting object to interpret
     * @param  {Boolean} success Whether or not the previous call was successful
     * @return {Boolean} whether or not the callback was successful
     */
    function __eventListenerCallback(result, success) {
        // Call the typical __tcfCallback to parse the result
        if (__tcfCallback(result, success)) {
            // De-register getTCData __calInWindow
            __baseClass._removeRetriever(__TCF_GET_COMMAND);

            return true;
        }

        return false;
    }

    /**
     * A retriever function that registers itself on the 'addEventListener'
     * __tcfapi command and calls back to its own __eventListenerCallback
     *
     * @return {Boolean} whether or not the register was successful
     */
    function __registerEventListener() {
        return function () {
            // Call __tcfapi to register the listener
            if (!__eventRegistered) {
                __baseClass._callInWindow(
                    __TCF_WINDOW_FUNCTION,
                    __TCF_EVENT_COMMAND,
                    __baseClass._dataModel.version,
                    __eventListenerCallback
                )();
                __eventRegistered = true;
            }

            // Say that this wasn't successful so we don't stop calling other methods
            return false;
        };
    }

    /**
     * Wrapper to call the base _messageListener method with the TCF-specific property and callback
     *
     * @param  {Object} event Window event object
     * @return {any} Any result from the base method (which returns the callback return)
     */
    function _messageListener(event) {
        return __baseClass._messageListener(event, __TCF_FRAME_MESSAGE_PROPERTY, __tcfCallback, _messageListener);
    }

    function getConsent() {
        return __baseClass.getConsent(__baseClass._dataModel);
    }

    function hasObtainedConsent() {
        return __baseClass._obtainedConsent;
    }

    function getPromise() {
        return __baseClass._defer.promise;
    }

    function runCleanup() {
        return __baseClass._cleanup();
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        __baseClass = Cmp();

        __baseClass._dataModel = {
            applies: {
                type: 'boolean',
                default: true,
                properties: ['gdprApplies']
            },
            consentString: {
                type: 'string',
                default: '',
                properties: ['tcString']
            },
            version: {
                type: 'number',
                default: 2,
                properties: ['tcfPolicyVersion']
            }
        };

        __baseClass._addRetriever(
            __registerEventListener(),
            __TCF_EVENT_COMMAND
        );

        __baseClass._addRetriever(
            __baseClass._callInWindow(
                __TCF_WINDOW_FUNCTION,
                __TCF_GET_COMMAND,
                __baseClass._dataModel.version,
                __tcfCallback
            ),
            __TCF_GET_COMMAND
        );

        __baseClass._addRetriever(
            __baseClass._callInFrame(__TCF_FRAME_NAME,
                {
                    __tcfapiCall: {
                        command: __TCF_GET_COMMAND,
                        parameter: null,
                        version: __baseClass._dataModel.version
                    }
                },
                _messageListener)
        );
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    var derivedClass = {
        /* Class Information
         * ---------------------------------- */
        __type__: 'Tcf2',

        /* Data
         * ---------------------------------- */

        /* Functions
         * ---------------------------------- */
        getConsent: getConsent,
        hasObtainedConsent: hasObtainedConsent,
        getPromise: getPromise,
        runCleanup: runCleanup,

    };

    return Classify.derive(__baseClass, derivedClass);
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = Tcf2;
},{}],52:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var CommandQueue = require(14);
var Prms = require(20);
var SpaceCamp = require(61);
var Utilities = require(33);

var Ccpa = require(48);
var Gdpr = require(50);
var Tcf2 = require(51);


var TimerService;

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * The Compliance Service manages any compliance-related information that might
 * be required within the wrapper or partner modules.
 *
 * @constructor
 */
function ComplianceService(configs) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /**
     * Command queue to run a queue of functions after retrieving consent data.
     */
    var __cmd;

    /**
     * Overall status of the consent retrieval process. Allowed values are members of the
     * __EnumStatuses enumeration.
     *
     * If status is NOT_STARTED, the layer has not yet started retrieving
     * data from CMPs.
     * If status is IN_PROGRESS, the layer is waiting for results.
     * If status is COMPLETE, the layer is no longer waiting and will
     * return a resolved promise when wait() is called.
     *
     * @private {enum}
     */
    var __status;

    /**
     * Storage of Cmp instance references, intended to be accessed by their __type__,
     * e.g. __cmps.Gdpr
     *
     * @private {Object}
     */
    var __cmps;

    /**
     * Enum of values to describe process status.
     *
     * @private {Object}
     */
    var __EnumStatuses = {
        NOT_STARTED: 0,
        IN_PROGRESS: 1,
        COMPLETE: 2
    };

    /**
     * Stores the value of the compliance timeout in ms.
     * This represents the maximum amount of time that retrieving compliance information
     * is allowed to delay any subsequent process.
     *
     * @private {number}
     */
    var __complianceTimeout;

    /**
     * Deferred promise for the compliance information retrieval process. Created when
     * the retrieval process for compliance starts. Resolved when either consent data
     * is retrieved or the timeout has elapsed, whichever comes first.
     *
     * @private {defer}
     */
    var __retrievalDefer;

    /**
     * ID of the timer created with the timer service for compliance timeout
     */
    var __complianceTimerId;

    /* Main
     * ---------------------------------- */

    /**
     * Manually set the `applies` property of the Gdpr consent object
     *
     * @return {none}
     */
    function setGdprApplies(applies) {

        __cmps.Gdpr.setApplies(applies);
    }

    /**
     * Wrapper to retrieve the Gdpr consent object
     *
     * @return {Object} Consent obtained by the Gdpr instance
     */
    function getGdprConsent(version) {
        switch (parseInt(version, 10)) {
            case 2:
                return __cmps.Tcf2.getConsent();
            case 1:
                return __cmps.Gdpr.getConsent();
            default:
                if (__cmps.Tcf2.hasObtainedConsent() || !__cmps.Gdpr.hasObtainedConsent()) {
                    return __cmps.Tcf2.getConsent();
                } else {
                    return __cmps.Gdpr.getConsent();
                }
        }
    }

    /**
     * Wrapper to retrieve the Usp consent object
     *
     * @return {Object} Consent obtained by the Ccpa instance
     */
    function getUspConsent() {
        return __cmps.Ccpa.getConsent();
    }

    /**
     * Returns whether or not privacy features are enabled. If this version of the
     * compliance service is running, that means they are.
     *
     * @return {Boolean} Always returns true
     */
    function isPrivacyEnabled() {
        return true;
    }

    /**
     * Performs all functions necessary to setup each Cmp instance, including
     * instantiation, cleanup registration, collecting promises, and starting
     * the retrieval process for each
     *
     * @return {none}
     */
    function __setupCmps() {
        // Use configs to determine enabledCmps if supported
        var enabledCmps = [Gdpr, Tcf2, Ccpa];
        var promises = [];

        for (var c = 0; c < enabledCmps.length; c++) {
            // Don't reinstantiate a new Cmp if it is already setup
            var cmpName = enabledCmps[c].name || enabledCmps[c].toString().match(/^function\s*([^\s(]+)/)[1];
            if (!__cmps.hasOwnProperty(cmpName) && Utilities.getType(enabledCmps[c]) === 'function') {
                var cmp = enabledCmps[c](configs);
                __cmps[cmp.__type__] = cmp;
                __retrievalDefer.promise.then(cmp.runCleanup);
                promises.push(cmp.getPromise());
            }
        }

        Prms.all(promises).then(function () {
            __retrievalDefer.resolve();
        });

        // Because we can't do Object.values
        var calledSuccessfully = Object.keys(__cmps).map(function (cmp) {
            return __cmps[cmp].retrieve() === true;
        });

    }

    /**
     * Starts the process of retrieving consent data
     *
     * @return nothing
     */
    function __retrieve() {
        // Should only retrieve consent data once, at wrapper initialization
        if (__status !== __EnumStatuses.NOT_STARTED) {
            return;
        }


        __retrievalDefer = Prms.defer();
        __status = __EnumStatuses.IN_PROGRESS;

        /* However the retrieval defer is resolved, that means we're ready to return
         * any results we may have. */
        __retrievalDefer.promise.then(function () {
            // Run any queued function calls
            __cmd = CommandQueue(__cmd);
            __status = __EnumStatuses.COMPLETE;
        });

        __setupCmps();

        /* Special case: If the timeout is zero, don't actually set a timer. Just continue
         * immediately so we don't release the js execution queue. */
        if (__complianceTimeout === 0) {
            __retrievalDefer.resolve();
        } else if (!__complianceTimerId) {
            /* If the timeout isn't zero, and we haven't created a timer yet, register
             * one with a callback to resolve the defer but don't start it yet. */
            __complianceTimerId = TimerService.createTimer(__complianceTimeout, false, function () {
                __retrievalDefer.resolve();
            });
        }
    }

    function __reset() {
        if (__status === __EnumStatuses.COMPLETE) {
            __status = __EnumStatuses.NOT_STARTED;
            __complianceTimerId = null;
            __complianceTimeout = 0;

        }
    }

    /**
     * Takes in a function and returns a wrapped version that inserts the function call
     * into the service's command queue.
     *
     * @return {Function}      Returns a function that, when called, starts the global timer
     */
    function delay(func) {
        return function () {
            // If we haven't started retrieving, start
            if (__status === __EnumStatuses.NOT_STARTED) {
                __retrieve();
            }

            // If we haven't finished, and there's a timer, start it now.
            if (__status !== __EnumStatuses.COMPLETE && __complianceTimerId) {
                TimerService.startTimer(__complianceTimerId);
            }

            var args = arguments;

            __cmd.push(function () {
                func.apply(null, args);
            });

            __retrievalDefer.promise.then(function () {
                __reset();
            });
        };
    }

    /**
     * Returns a promise that resolves when we're no longer waiting on consent results.
     * Resolves with an object containing identity data, empty if none is available.
     *
     * @return {promise} Promise that resolves after all consents are complete
     */
    function wait() {
        // If we haven't started retrieving, start
        if (__status === __EnumStatuses.NOT_STARTED) {
            __retrieve();
        }

        // If we haven't finished, and there's a timer, start it now.
        if (__status !== __EnumStatuses.COMPLETE && __complianceTimerId) {
            TimerService.startTimer(__complianceTimerId);
        }

        __retrievalDefer.promise.then(function () {
            __reset();
        });

        return __retrievalDefer.promise;
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        TimerService = SpaceCamp.services.TimerService;


        __cmps = {};
        __cmd = [];
        __complianceTimeout = configs.timeout;
        __status = __EnumStatuses.NOT_STARTED;

        // Might as well start now.
        __retrieve();
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* PubKitShrinkExports<ComplianceService> */
        /* Class Information
         * ---------------------------------- */


        gdpr: {
            /* Functions
             * ---------------------------------- */
            getConsent: getGdprConsent,
            setApplies: setGdprApplies
        },

        usp: {
            /* Functions
             * ---------------------------------- */
            getConsent: getUspConsent
        },

        isPrivacyEnabled: isPrivacyEnabled,
        delay: delay,
        wait: wait,

    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = ComplianceService;
},{}],53:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var System = require(32);
var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 *
 *
 * @constructor
 */
function EventsService() {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    var __eventsMap;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Helpers
     * ---------------------------------- */

    function __on(event, once, fn) {

        if (!__eventsMap.hasOwnProperty(event)) {
            __eventsMap[event] = [];
        }

        var id = System.generateUniqueId();

        __eventsMap[event].push({
            id: id,
            fn: fn,
            once: once
        });

        return id;
    }

    /* Main
     * ---------------------------------- */

    function on(event, fn) {
        return __on(event, false, fn);
    }

    function once(event, fn) {
        return __on(event, true, fn);
    }

    function off(id) {

        for (var event in __eventsMap) {
            if (!__eventsMap.hasOwnProperty(event)) {
                continue;
            }

            for (var i = __eventsMap[event].length - 1; i >= 0; i--) {
                if (__eventsMap[event][i].id === id) {
                    __eventsMap[event].splice(i, 1);

                    return;
                }
            }
        }
    }

    function emit() {
        var args = Array.prototype.slice.call(arguments);
        var event = args.shift();


        if (!event) {
            return;
        }

        if (!__eventsMap.hasOwnProperty(event)) {
            return;
        }

        for (var i = __eventsMap[event].length - 1; i >= 0; i--) {
            try {
                __eventsMap[event][i].fn.apply(null, args);
            } catch (ex) {
            }

            if (__eventsMap[event][i].once) {
                __eventsMap[event].splice(i, 1);
            }
        }
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        __eventsMap = {};
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* PubKitShrinkExports<EventsService> */
        /* Class Information
         * ---------------------------------- */


        /* Data
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */


        on: on,
        once: once,
        off: off,
        emit: emit
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = EventsService;
},{}],54:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Browser = require(11);
var Cache = require(12); // eslint-disable-line no-redeclare
var NormalDistributionTimeoutModule = require(36);
var Network = require(27);
var SpaceCamp = require(61);
var System = require(32);
var Utilities = require(33);
var Whoopsie = require(34);

var EventsService;


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Provides functions for recording various data such as latency,
 * network latency, request and response counts.
 *
 * Listens to events emitted by other components via the event service.
 *
 * One instance of Header Stats per site.
 * ```
 * config = {
 *     siteId: publisher site ID,
 *     configId: header tag configuration ID
 * }
 * ```
 *
 * @class
 * @constructor
 * @param {object} config     Configuration object for Header Stats
 *
 */
function HeaderStats(config) {
    /* Headerstats endpoint only works with AJAX */
    if (!Network.isXhrSupported()) {

        return null;
    }

    /* =====================================
     * Data
     * ---------------------------------- */

    /**
     * Enum of possible values of session status.
     * @public {Object}
     */
    var SessionStates = {
        IPR: 0,
        DONE: 1,
        SENT: 2
    };

    /**
     * Stores the url to set in constructor as it can change after fallback ad.
     * @private {string}
     */
    var __baseUrl;

    /**
     * Stores the index exchange specific site ID assigned to the property.
     * @private {string}
     */
    var __siteId;

    /**
     * The UUID of the wrapper from the Mongo database.
     * @private {string}
     */
    var __configId;

    /**
     * An object keyed by names of HeaderStats Service data reporting control options.
     * @private {object}
     */
    var __options;

    /**
     * Randomly generated on wrapper load and sent with every call out to HS.
     * @private {string}
     */
    var __instanceId;

    /**
     * A timestamp of when HS is instantiated.
     * @private {number}
     */
    var __pageStartTime;

    /**
     * An object that stores request start times to be later referenced to get the latency.
     * @private {object}
     */
    var __requestStartTimes;

    /**
     * An object that stores session start start times to be later referenced to get the
     * session time
     * @private {object}
     */
    var __sessionStartTimes;

    /**
     * An object that stores session cycles times.
     * @private {object}
     */
    var __auctionCycleTimes;

    /**
     * An object keyed by sessionId and valued by arrays of event objects.
     * @private {object}
     */
    var __pageEvents;

    /**
     * An object keyed by session ID and valued by arrays of slot objects.
     * @private {object}
     */
    var __slotStats;

    /**
     * An object keyed by sessionId and valued by akamai Debug Information of that session.
     * @private {object}
     */
    var __akamaiDebugInfo;

    /**
     * An object keyed by session ID and valued by the state of the session.
     * @private {object}
     */
    var __sessionStates;

    /**
     * An object that stores global timeouts on a per session level.
     */
    var __globalTimeouts;

    /**
     * An object that stores session types on a per session level.
     */
    var __sessionTypes;

    /**
     * Stores any defined partner-specific fimeouts to be sent with headerstats
     * calls. Timeouts stored as strings.
     * @private {object}
     */
    var __partnerTimeouts;

    /**
     * Stores whether a request indicated by a request key has already timed out.
     * @private {object}
     */
    var __requestTimedOut;

    /**
     * Stores session IDs where there was no data for adaptive timeout, therefore
     * signaling that the user was "unknown" for that session.
     */
    var __userUnknownSessions;

    /**
     * Lists of Identity stats events per Identity partner, keyed by partner stats ID.
     * @private {object}
     */
    var __identityEvents;

    /**
     * Configured timeout value for the Identity layer.
     * @private {string}
     */
    var __identityTimeout;

    /**
     * Flag that indicates that the layer-level timeout has been recorded to be sent
     * to the endpoint. The value should be sent only once per session.
     * @private {object}
     */
    var __identityPartnerTimeoutSent;

    /**
     * Timestamp indicating when a request is sent for an Identity partner,
     * keyed by the partner stats ID.
     * @private {object}
     */
    var __identityStartTimes;

    /**
     * Timestamp of first Identity event for this set of data. Used for the "t" property.
     * @private {number}
     */
    var __identityFirstEvent;

    /**
     * Flag that indicates that the master Identity timeout has occured.
     * @private {boolean}
     */
    var __identityTimedOut;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /**
     * Returns a shortened version of an event name, or the original event name
     * if none exists
     *
     * @param {string} eventName
     */
    function __getShortEventName(eventName) {
        var eventNameMap = {
            auction_cycle: 'ac', // eslint-disable-line camelcase
            global_timeout: 'gt', // eslint-disable-line camelcase
            bid_requests: 'brq', // eslint-disable-line camelcase
            bid_responses: 'brs', // eslint-disable-line camelcase
            bid_errors: 'be', // eslint-disable-line camelcase
            bid_passes: 'bp', // eslint-disable-line camelcase
            bid_timeouts: 'bt', // eslint-disable-line camelcase
            dfp_kv_pushed: 'kv', // eslint-disable-line camelcase
            top_bid: 'tb', // eslint-disable-line camelcase
            prefetch: 'p',
            res_latency: 'rl', // eslint-disable-line camelcase
            partner_timeout: 'pt' // eslint-disable-line camelcase
        };

        if (!eventNameMap.hasOwnProperty(eventName)) {
            return eventName;
        }

        return eventNameMap[eventName];
    }

    function __transformIdentityStats() {
        if (Utilities.isEmpty(__identityEvents)) {
            return [];
        }

        var identitySlotObj = {
            s: 'identity',
            t: __identityFirstEvent,
            xslots: {}
        };

        /* Flatten __identityEvents object */
        for (var statsId in __identityEvents) {
            if (!__identityEvents.hasOwnProperty(statsId)) {
                continue;
            }

            if (!identitySlotObj.xslots.hasOwnProperty(statsId)) {
                identitySlotObj.xslots[statsId] = {};
            }

            for (var i = 0; i < __identityEvents[statsId].length; i++) {
                var eventObj = __identityEvents[statsId][i];
                if (eventObj.n === 'bid_requests' || eventObj.n === 'res_latency') {
                    eventObj.v = String(eventObj.v);
                }

                if (!identitySlotObj.xslots[statsId].hasOwnProperty(eventObj.x)) {
                    identitySlotObj.xslots[statsId][eventObj.x] = {};
                }

                var abbreviatedName = __getShortEventName(eventObj.n);

                identitySlotObj.xslots[statsId][eventObj.x][abbreviatedName] = eventObj.v;
            }

            if (!__identityPartnerTimeoutSent.hasOwnProperty(statsId) || __identityPartnerTimeoutSent[statsId] === false) {
                identitySlotObj.xslots[statsId].before[__getShortEventName('partner_timeout')] = __identityTimeout;
                __identityPartnerTimeoutSent[statsId] = true;
            }
        }

        __identityEvents = {};

        return [identitySlotObj];
    }

    /**
     * Store the Identity event using the internal __identityEvents object.
     * Keyed by stats ID.
     *
     * @param {string} eventName The name of the emitted Identity event, not
     *                           the correct "n" value.
     * @param {object} data The data from the event.
     */
    function __recordIdentityEvent(eventName, data) {

        /* If we are starting a new set of data for Identity, get the timestamp */
        if (Utilities.isEmpty(__identityEvents)) {
            __identityFirstEvent = System.now();
        }

        var statsId = data.statsId;
        __identityEvents[statsId] = __identityEvents[statsId] || [];

        var identityEvent = {
            b: statsId,
            x: __identityTimedOut ? 'after' : 'before'
        };

        if (eventName === 'hs_identity_request') {
            identityEvent.n = 'bid_requests';
            identityEvent.v = 1;
            __identityStartTimes[statsId] = System.now();
        } else if (eventName === 'hs_identity_cached') {
            identityEvent.n = 'bid_requests';
            identityEvent.v = 0;
        } else if (eventName === 'hs_identity_response') {
            identityEvent.n = 'bid_responses';
            identityEvent.v = 1;
        } else if (eventName === 'hs_identity_error') {
            identityEvent.n = 'bid_errors';
            identityEvent.v = 1;
        } else if (eventName === 'hs_identity_pass') {
            identityEvent.n = 'bid_passes';
            identityEvent.v = 1;
        } else if (eventName === 'hs_identity_timeout') {
            identityEvent.n = 'bid_timeouts';
            identityEvent.v = 1;
        } else if (eventName === 'hs_identity_bid_latency') {
            identityEvent.n = 'res_latency';
            identityEvent.v = System.now() - __identityStartTimes[statsId];
        }


        __identityEvents[statsId].push(identityEvent);
    }

    /**
     * Parses the stats to determine many data points and present it as a special
     * htSlot named "data".
     */
    function __transformDataStats(sessionId, stats) {
        if (!__userUnknownSessions.hasOwnProperty(sessionId) || Utilities.isEmpty(stats)) {
            return [];
        }

        var eventsWhitelist = [
            'bid_requests',
            'bid_responses',
            'bid_errors',
            'bid_passes',
            'bid_timeouts'
        ];

        var dataSlotObj = {
            s: 'data',
            t: System.now(),
            xslots: {
                UNKN: {}
            }
        };

        for (var htSlotId in stats) {
            if (!stats.hasOwnProperty(htSlotId)) {
                continue;
            }

            var htSlotStats = stats[htSlotId];

            for (var statsId in htSlotStats.events) {
                if (!htSlotStats.events.hasOwnProperty(statsId)) {
                    continue;
                }

                for (var eventName in htSlotStats.events[statsId]) {
                    if (!htSlotStats.events[statsId].hasOwnProperty(eventName)) {
                        continue;
                    }

                    /* If the evenName is not on of those white listed for this,
                     * ignore it by continuing to the next iteration. */
                    if (eventsWhitelist.indexOf(eventName) === -1) {
                        continue;
                    }

                    for (var xSlotName in htSlotStats.events[statsId][eventName]) {
                        if (!htSlotStats.events[statsId][eventName].hasOwnProperty(xSlotName)) {
                            continue;
                        }

                        var xSlotStat = htSlotStats.events[statsId][eventName][xSlotName];
                        var eventValue = xSlotStat.v;
                        var abbreviatedName = __getShortEventName(eventName);

                        if (!dataSlotObj.xslots.UNKN.hasOwnProperty(xSlotName)) {
                            dataSlotObj.xslots.UNKN[xSlotName] = {};
                            dataSlotObj.xslots.UNKN[xSlotName][__getShortEventName('res_latency')] = __globalTimeouts[sessionId];
                        }

                        if (!dataSlotObj.xslots.UNKN[xSlotName].hasOwnProperty(abbreviatedName)) {
                            dataSlotObj.xslots.UNKN[xSlotName][abbreviatedName] = 0;
                        }

                        dataSlotObj.xslots.UNKN[xSlotName][abbreviatedName] += eventValue;
                    }
                }
            }
        }

        return [dataSlotObj];
    }

    /**
     * Returns an array containing all of the lowest level objects of stats.
     * @param {object} stats
     * @return {array}
     */
    function __transformSlotStats(sessionId, stats) {
        var slotStats = [];
        var xSlotName = '';
        var statsId = '';

        for (var htSlotId in stats) {
            if (!stats.hasOwnProperty(htSlotId)) {
                continue;
            }

            var htSlotStats = stats[htSlotId];
            var slotObj = {
                s: htSlotStats.s,
                t: htSlotStats.t,
                xslots: {}
            };

            /* - Flatten stats object
             * - Iterate over different partners */
            for (statsId in htSlotStats.events) {
                if (!htSlotStats.events.hasOwnProperty(statsId)) {
                    continue;
                }

                /* Iterate over different events */
                for (var eventName in htSlotStats.events[statsId]) {
                    if (!htSlotStats.events[statsId].hasOwnProperty(eventName)) {
                        continue;
                    }

                    /* Iterate over different xslots */
                    for (xSlotName in htSlotStats.events[statsId][eventName]) {
                        if (!htSlotStats.events[statsId][eventName].hasOwnProperty(xSlotName)) {
                            continue;
                        }

                        var xSlotStat = htSlotStats.events[statsId][eventName][xSlotName];
                        var eventValue = xSlotStat.v;
                        var abbreviatedName = __getShortEventName(eventName);

                        /* Convert v into a string */
                        if (xSlotStat.n === 'res_latency') {
                            xSlotStat.v = String(xSlotStat.v);
                        }

                        if (!slotObj.xslots.hasOwnProperty(statsId)) {
                            slotObj.xslots[statsId] = {};
                        }

                        if (!slotObj.xslots[statsId].hasOwnProperty(xSlotName)) {
                            slotObj.xslots[statsId][xSlotName] = {};
                        }

                        slotObj.xslots[statsId][xSlotName][abbreviatedName] = eventValue;
                    }
                }

                for (xSlotName in slotObj.xslots[statsId]) {
                    if (!slotObj.xslots[statsId].hasOwnProperty(xSlotName)) {
                        continue;
                    }

                    if (__partnerTimeouts.hasOwnProperty(statsId)) {
                        slotObj.xslots[statsId][xSlotName][__getShortEventName('partner_timeout')] = __partnerTimeouts[statsId];
                    }
                }
            }

            slotStats.push(slotObj);
        }


        return slotStats;
    }
    /**
     * Send out the stats for a given sessionId via post request to the headerstats endpoint.
     *
     * @param {string} sessionId
     */

    function __sendStats(sessionId) {
        /* Validation */
        if (!__sessionStates.hasOwnProperty(sessionId)) {

            return;
        }

        if (__sessionStates[sessionId] === SessionStates.IPR) {

            return;
        }

        if (__sessionStates[sessionId] === SessionStates.SENT) {

            return;
        }

        /* Build request data */
        var bodyObject = {
            p: __sessionTypes[sessionId],
            d: SpaceCamp.DeviceTypeChecker.getDeviceType(),
            c: __configId,
            s: sessionId,
            w: __instanceId,
            t: System.now(),
            pg: {
                t: __pageStartTime,
                e: __pageEvents[sessionId]
            }
        };
        bodyObject[__getShortEventName('global_timeout')] = String(__globalTimeouts[sessionId]);
        if (__options.auctionCycle) {
            bodyObject.ac = __auctionCycleTimes[sessionId];
        }

        bodyObject.sl = Utilities.mergeArrays(
            __transformSlotStats(sessionId, __slotStats[sessionId]),
            __transformDataStats(sessionId, __slotStats[sessionId]),
            __transformIdentityStats()
        );

        bodyObject.akamaiDebugInfo = __akamaiDebugInfo[sessionId];

        /* Clean up */
        delete __akamaiDebugInfo[sessionId];
        delete __pageEvents[sessionId];
        delete __slotStats[sessionId];

        delete __globalTimeouts[sessionId];
        delete __userUnknownSessions[sessionId];
        delete __sessionTypes[sessionId];

        /* Send POST request */
        var url = Network.buildUrl(__baseUrl, null, {
            s: __siteId,
            u: Browser.getPageUrl(),
            v: 3
        });


        Network.ajax({
            method: 'POST',
            url: url,
            data: bodyObject
        });

        /* Change session state to sent */
        __sessionStates[sessionId] = SessionStates.SENT;
    }
    /**
     * Store the partner event using the internal slotStats object.
     *
     * @param {string} eventName The name of the event.
     * @param {object} data The data from the event.
     */

    function __recordPartnerEvent(eventName, data) {

        /* Pull values from data */
        var sessionId = data.sessionId;
        var htSlotId = data.htSlotId;
        var statsId = data.statsId;
        var xSlotNames = data.xSlotNames;
        var requestId = data.requestId || '';

        /* Validation */
        if (!__sessionStates.hasOwnProperty(sessionId)) {

            return;
        }

        if (__sessionStates[sessionId] === SessionStates.DONE) {

            return;
        }

        if (__sessionStates[sessionId] === SessionStates.SENT) {

            return;
        }

        /* Initialize the object if needed */
        if (!__slotStats[sessionId].hasOwnProperty(htSlotId)) {
            __slotStats[sessionId][htSlotId] = {
                s: htSlotId,
                t: System.now(),
                events: {}
            };
        }

        if (!__slotStats[sessionId][htSlotId].events.hasOwnProperty(statsId)) {
            __slotStats[sessionId][htSlotId].events[statsId] = {};
        }

        if (!__slotStats[sessionId][htSlotId].events[statsId].hasOwnProperty(eventName)) {
            __slotStats[sessionId][htSlotId].events[statsId][eventName] = {};
        }

        var currentStatEvent = __slotStats[sessionId][htSlotId].events[statsId][eventName];

        /* Iterate over xSlotNames and store xSlot specific events */

        for (var i = 0; i < xSlotNames.length; i++) {
            var xSlotName = xSlotNames[i];
            var requestKey = sessionId + statsId + htSlotId + xSlotName + requestId;

            if (__requestTimedOut[requestKey]) {
                continue;
            }

            if (eventName === 'bid_timeouts') {
                __requestTimedOut[requestKey] = true;
            }

            if (!currentStatEvent.hasOwnProperty(xSlotName)) {
                currentStatEvent[xSlotName] = {
                    n: eventName,
                    v: 0,
                    b: statsId,
                    x: xSlotName
                };
            }
            var xSlotStats = currentStatEvent[xSlotName];

            /* For latency events we want to capture the longest request */
            if (eventName === 'res_latency') {
                var latency = System.now() - __requestStartTimes[requestKey];

                delete __requestStartTimes[requestKey];
                if (!xSlotStats.v || xSlotStats.v > latency) {
                    xSlotStats.v = latency;
                }
            } else if (eventName === 'prefetch') {
                xSlotStats.v = 1;
            } else {
                xSlotStats.v++;
            }

            /* Bid requests save request time, bid responses capture the latency by emiting the latency event */
            if (eventName === 'bid_requests') {
                __requestStartTimes[requestKey] = System.now();
            } else if (eventName === 'bid_responses') {
                EventsService.emit('hs_slot_valid_bid_latency', data);
            }
        }
    }
    /**
     * An object keyed by the events and values with the functions that handle each event.
     * @private {object}
     */
    var __eventHandlers = {
        hs_session_start: function (data) { // eslint-disable-line camelcase

            var sessionId = data.sessionId;

            if (!__sessionStates.hasOwnProperty(sessionId)) {
                __sessionStates[sessionId] = SessionStates.IPR;
                __sessionStartTimes[sessionId] = System.now();
                __pageEvents[sessionId] = [];
                __slotStats[sessionId] = {};
                __sessionTypes[sessionId] = HeaderStats.SessionTypes.DISPLAY;

                __sessionTypes[sessionId] = data.sessionType;
                __globalTimeouts[sessionId] = data.timeout;
            } else {
            }

            /* Record whether the user for the session is "unknown". Logic for "unknown"
             * is copied from the NormalDistributionTimeoutModule to ensure definition
             * of unknown is kept consistent. */
            var adaptiveTimeoutData = Cache.getData(NormalDistributionTimeoutModule.STORAGE_KEY_NAME);
            if (adaptiveTimeoutData === null
                || !adaptiveTimeoutData.hasOwnProperty('prt')
                || !Utilities.isArray(adaptiveTimeoutData.prt)
                || adaptiveTimeoutData.prt.length === 0) {
                __userUnknownSessions[sessionId] = true;
            }
        },
        hs_session_end: function (data) { // eslint-disable-line camelcase

            var sessionId = data.sessionId;

            if (!__sessionStates.hasOwnProperty(sessionId)) {

                return;
            }

            if (__sessionStates[sessionId] === SessionStates.DONE) {

                return;
            }

            __auctionCycleTimes[sessionId] = String(System.now() - __sessionStartTimes[sessionId]);

            delete __sessionStartTimes[sessionId];

            setTimeout(function () {
                /* Finish the session but delay sending stats by a second to give late partners
                 * a chance to still make it into headerstats */
                __sessionStates[sessionId] = SessionStates.DONE;

                __sendStats(sessionId);
            }, 0);
        },
        hs_akamai_debug: function (data) { // eslint-disable-line camelcase

            var sessionId = data.sessionId;

            __akamaiDebugInfo[sessionId] = {};
            __akamaiDebugInfo[sessionId].hostname = data.hostname;

            if (data.hasOwnProperty('requestHost')) {
                __akamaiDebugInfo[sessionId].requestHost = data.requestHost;
            }

            if (data.hasOwnProperty('akamaiPresent')) {
                __akamaiDebugInfo[sessionId].akamaiPresent = data.akamaiPresent;
            }
        },
        hs_slot_request: function (data) { // eslint-disable-line camelcase
            __recordPartnerEvent('bid_requests', data);
        },
        hs_slot_bid: function (data) { // eslint-disable-line camelcase
            __recordPartnerEvent('bid_responses', data);
        },
        hs_slot_pass: function (data) { // eslint-disable-line camelcase
            __recordPartnerEvent('bid_passes', data);
        },
        hs_slot_timeout: function (data) { // eslint-disable-line camelcase
            __recordPartnerEvent('bid_timeouts', data);
        },
        hs_slot_error: function (data) { // eslint-disable-line camelcase
            __recordPartnerEvent('bid_errors', data);
        },
        hs_slot_highest_bid: function (data) { // eslint-disable-line camelcase
            __recordPartnerEvent('top_bid', data);
        },
        hs_slot_valid_bid_latency: function (data) { // eslint-disable-line camelcase
            __recordPartnerEvent('res_latency', data);
        },
        hs_slot_kv_pushed: function (data) { // eslint-disable-line camelcase
            __recordPartnerEvent('dfp_kv_pushed', data);
        },
        hs_slot_prefetch: function (data) { // eslint-disable-line camelcase
            __recordPartnerEvent('prefetch', data);
        },
        hs_define_partner_timeout: function (data) { // eslint-disable-line camelcase

            __partnerTimeouts[data.statsId] = String(data.timeout);
        },
        hs_identity_request: function (data) { // eslint-disable-line camelcase
            __recordIdentityEvent('hs_identity_request', data);
        },
        hs_identity_cached: function (data) { // eslint-disable-line camelcase
            __recordIdentityEvent('hs_identity_cached', data);
        },
        hs_identity_response: function (data) { // eslint-disable-line camelcase
            __recordIdentityEvent('hs_identity_response', data);
            EventsService.emit('hs_identity_bid_latency', data);
        },
        hs_identity_error: function (data) { // eslint-disable-line camelcase
            __recordIdentityEvent('hs_identity_error', data);
            EventsService.emit('hs_identity_bid_latency', data);
        },
        hs_identity_pass: function (data) { // eslint-disable-line camelcase
            __recordIdentityEvent('hs_identity_pass', data);
            EventsService.emit('hs_identity_bid_latency', data);
        },
        hs_identity_bid_latency: function (data) { // eslint-disable-line camelcase
            if (Utilities.isNumber(__identityStartTimes[data.statsId])) {
                __recordIdentityEvent('hs_identity_bid_latency', data);
            }
        },
        hs_identity_timeout: function (data) { // eslint-disable-line camelcase
            __recordIdentityEvent('hs_identity_timeout', data);
            __identityTimedOut = true;
        },
        hs_define_identity_timeout: function (data) { // eslint-disable-line camelcase

            __identityTimeout = String(data.timeout);

        /* End of Identity events */
        }
    };

    /* =====================================
     * Constructor
     * ---------------------------------- */

    (function __constructor() {
        EventsService = SpaceCamp.services.EventsService;


        /* Set private variables based on the provided config */
        __pageStartTime = System.now();
        __baseUrl = 'https://as-sec.casalemedia.com/headerstats';

        __siteId = config.siteId;
        __configId = config.configId;
        __options = config.options;

        __instanceId = __siteId + System.now();
        __instanceId = __instanceId + System.generateUniqueId(32 - __instanceId.length);

        /* Provide global access to the instanceId */
        SpaceCamp.instanceId = __instanceId;

        __sessionStates = {};
        __pageEvents = {};
        __slotStats = {};
        __akamaiDebugInfo = {};
        __requestStartTimes = {};
        __sessionStartTimes = {};
        __auctionCycleTimes = {};
        __sessionTypes = {};

        __globalTimeouts = {};
        __partnerTimeouts = {};
        __requestTimedOut = {};
        __userUnknownSessions = {};

        __identityEvents = {};
        __identityStartTimes = {};
        __identityTimedOut = false;
        __identityPartnerTimeoutSent = {};

        /* Register event listeners */
        for (var eventName in __eventHandlers) {
            if (!__eventHandlers.hasOwnProperty(eventName)) {
                continue;
            }
            SpaceCamp.services.EventsService.on(eventName, __eventHandlers[eventName]);
        }
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        /* Data
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */


    };
}

////////////////////////////////////////////////////////////////////////////////
// Enumerations ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

HeaderStats.SessionTypes = {
    DISPLAY: 'display',
    VIDEO: 'video'
};

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = HeaderStats;
},{}],55:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var Utilities = require(33);

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function KeyValueService() {
    /* =====================================
     * Data
     * ---------------------------------- */

    var __defaultKeyValueData = {
        site: {},
        user: {}
    };
    var __keyValueData = {};

    /* =====================================
     * Functions
     * ---------------------------------- */

    function __validateKeyValueData(data) {
        return (typeof data !== 'object' || data === null || Array.isArray(data)) ? false : true;
    }

    function getDefaultKeyValueData() {
        return Utilities.deepCopy(__defaultKeyValueData);
    }

    function getKeyValueData() {
        return Utilities.deepCopy(__keyValueData);
    }

    function hasKeyValueAccess() {
        // Logic to be implemented in future story.
        return true;
    }

    function setSiteKeyValueData(data) {
        if (!__validateKeyValueData(data)) {
            return false;
        }

        __keyValueData.site = Utilities.deepCopy(data);

        return true;
    }

    function setUserKeyValueData(data) {
        if (!__validateKeyValueData(data)) {
            return false;
        }

        __keyValueData.user = Utilities.deepCopy(data);

        return true;
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        __keyValueData = Utilities.deepCopy(__defaultKeyValueData);
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */


        getDefaultKeyValueData: getDefaultKeyValueData,
        getKeyValueData: getKeyValueData,
        hasKeyValueAccess: hasKeyValueAccess,
        setSiteKeyValueData: setSiteKeyValueData,
        setUserKeyValueData: setUserKeyValueData
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = KeyValueService;
},{}],56:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Constants = require(16);
var Size = require(31);
var SpaceCamp = require(61);
var System = require(32);
var Utilities = require(33);
var Whoopsie = require(34);

var EventsService;


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Service for storing ads received from partners and then rendering them later.
 *
 * @class
 */
function RenderService(configs) {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */


    /**
     * Object which stores all ads which have been registered.
     * Keys are the pubKitAdId, values are an object containing sessionId,
     * partnerId, renderFn, args, info, and timeOfExpiry.
     *
     * {
     *     [pubKitAdId: string]: {
     *         sessionId: string;
     *         partnerId: string;
     *         adm: string;
     *         timeOfExpiry: number;
     *         auxFn?: Function;
     *         auxArgs?: array;
     *     }
     * }
     *
     * @private {object}
     */
    var __adStorage;

    /**
     * Object which stores all ads which have been registered but then expired.
     * We keep some properties around so that we can report any attempt to render
     * them to headerstats, however we move them to a separate object so that scans
     * of the __adStorage object for expiring ads don't slow down over time.
     *
     * {
     *     [pubKitAdId: string]: boolean;
     * }
     *
     * @private {object}
     */
    var __expiredAdStorage;

    /**
     * IntervalID for the timer which will repeatedly call __removeExpiredAds.
     * Registered in the class constructor, stored in case we need to stop the
     * timer for some reason.
     *
     * @private
     */
    var __expirySweepIntervalId;


    /**
     * Object which stores the line item types and id keys of all partners
     *
     * @private {Object}
     */
    var __partnerInfo = {};

    /**
     * Object which stores pubKitAdIds of ads registered for id+size creatives.
     * Format:
     * {
     *     [partnerId: string]: {
     *         [size: string]: {
     *             [requestId: string]: string[];
     *         }
     *     }
     * }
     *
     * @private {Object}
     */
    var __sizeAdIdMap = {};

    /**
     * Object which stores pubKitAdIds of ads registered for id+price creatives.
     * Format:
     * {
     *     [partnerId: string]: {
     *         [price: string]: {
     *             [requestId: string]: string[];
     *         }
     *     }
     * }
     *
     * @private {Object}
     */
    var __priceAdIdMap = {};

    /**
     * Object which stores pubKitAdIds of ads registered for id+dealId creatives.
     * Format:
     * {
     *     [partnerId: string]: {
     *         [dealId: string]: {
     *             [requestId: string]: string[];
     *         }
     *     }
     * }
     *
     * @private {Object}
     */
    var __dealIdAdIdMap = {};


    /**
     * Map of custom size keys ('widthxheight') to true size arrays [truewidth, trueheight]
     * The custom size will come in the call to renderDfpAd, the true size should map
     * that which is used when registering the ad from the partner module.
     *
     * @private {Object}
     */
    var __sizeRetargetingMap;

    /**
     * Map of requestIds that are associated with non-standard sized creatives (e.g.
     * 'native' or 'fullwidth') to expediate lookup when creatives are registered by size
     *
     * @private {Object}
     */
    var __specialSizedSlotLookup = {};


    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /**
     * Finds an ad IDs array from the given map based on partnerId, dealId/price/size,
     * and targeting values.
     *
     * @param  {[type]} adIdMap             [description]
     * @param  {[type]} partnerId           [description]
     * @param  {[type]} dealIdOrPriceOrSize [description]
     * @param  {[type]} targetingValues     [description]
     * @return {[type]}                     [description]
     */
    function __findAdIdsFromMap(adIdMap, partnerId, dealIdOrPriceOrSize, targetingValues) {
        if (!adIdMap.hasOwnProperty(partnerId)) {
            return;
        }

        if (!adIdMap[partnerId].hasOwnProperty(dealIdOrPriceOrSize)) {
            return;
        }

        var adIdsArray = null;

        for (var i = 0; i < targetingValues.length; i++) {
            var requestId = targetingValues[i];

            if (!adIdMap[partnerId][dealIdOrPriceOrSize].hasOwnProperty(requestId)) {
                continue;
            }

            adIdsArray = adIdMap[partnerId][dealIdOrPriceOrSize][requestId];
        }

        return adIdsArray;
    }

    /* Helpers
     * ---------------------------------- */

    /**
     * Moves a single ad with the given pubKitAdId from the active ad storage
     * to the ad storage graveyard.
     *
     * @param  {string} pubKitAdId
     * @return {boolean} True if the ad was moved, false if it was not found
     * @private
     */
    function __expireAd(pubKitAdId) {
        if (!__adStorage.hasOwnProperty(pubKitAdId)) {
            return false;
        }

        __expiredAdStorage[pubKitAdId] = true;
        delete __adStorage[pubKitAdId];

        return true;
    }

    /**
     * Scans internal ad storage and removes the args and render function of any
     * which have reached their expiry time, to save memory.
     *
     * @private
     */
    function __removeExpiredAds() {
        var now = System.now();

        for (var pubKitAdId in __adStorage) {
            if (!__adStorage.hasOwnProperty(pubKitAdId)) {
                continue;
            }

            if (__adStorage[pubKitAdId].timeOfExpiry && now > __adStorage[pubKitAdId].timeOfExpiry) {
                __expireAd(pubKitAdId);
            }
        }
    }

    /**
     * Registers an ad with the service for later rendering.
     *
     * @param  {object} adEntry      Object describing the ad
     *
     * @return {string}              The PubKit Ad ID to be used to refer back to
     *                               this ad when it needs to be rendered.
     * @private
     */
    function __internalRegisterAd(adEntry) {

        var pubKitAdId;

        /* If we generate a duplicate ID, try again */
        do {
            pubKitAdId = System.generateUniqueId(Constants.PUBKIT_AD_ID_LENGTH, 'ALPHANUM');
        } while (__adStorage.hasOwnProperty[pubKitAdId]);

        __adStorage[pubKitAdId] = adEntry;

        return pubKitAdId;
    }

    function __retrieveAdEntry(pubKitAdId) {

        if (__adStorage.hasOwnProperty(pubKitAdId) && __adStorage[pubKitAdId].timeOfExpiry && System.now() > __adStorage[pubKitAdId].timeOfExpiry) {
            __expireAd(pubKitAdId);
        }

        if (__expiredAdStorage[pubKitAdId]) {
            EventsService.emit('internal_info', 'Attempted to render expired ad ' + pubKitAdId);

            return null;
        }

        if (!__adStorage.hasOwnProperty(pubKitAdId)) {
            throw Whoopsie('INVALID_VALUE', '`pubKitAdId` does not match any registered ad');
        }

        var adEntry = __adStorage[pubKitAdId];
        __expireAd(pubKitAdId);

        return adEntry;
    }

    function __runAuxFn(adEntry) {

        if (adEntry.auxFn) {
            try {
                adEntry.auxFn.apply(null, adEntry.auxArgs);
            } catch (ex) {
                EventsService.emit('internal_error', 'Error occurred running ad aux function.', ex.stack);
            }
        }
    }

    /* Main
     * ---------------------------------- */

    /**
     * Renders the ad associated with the given pubKitAdId into the page location
     * given by doc.
     * If the ad is expired, logs an indication of the attempt with headerstats and
     * stops. If the ad is still valid, renders it by calling its stored renderFn.
     * The renderFn function is called with doc as its first argument followed by
     * the arguments stored in the ad's args array.
     *
     * @param  {object} doc        Reference to DOM document where ad is to be rendered
     * @param  {string} pubKitAdId The ID of the ad you wish to render
     *
     * @public
     */
    function render(doc, pubKitAdId) {

        var adEntry = __retrieveAdEntry(pubKitAdId);
        if (!adEntry) {
            return false;
        }


        __runAuxFn(adEntry);

        try {
            System.documentWrite(doc, adEntry.adm);
        } catch (ex) {
            EventsService.emit('internal_error', 'Error occurred while rendering ad "' + pubKitAdId + '".', ex.stack);

            return false;
        }

        return true;
    }

    /**
     * Registers an ad to be rendered from a DFP creative by ID and size.
     * Calls registerAd to save the ad to internal storage and then records
     * the resulting pubKitAdId in a map for rendering from the DFP creative.
     *
     * @param  {string} sessionId    The active sessionId for headerstats
     * @param  {string} partnerId    The standard ID for the partner registering the ad
     * @param  {string} adm          The ad markup to be rendered
     * @param  {string} requestId    Arbitrary identifier that will be returned from
     *                               DFP targeting to recognize this ad.
     * @param  {array|string} size   Ad size [width, height], or string representing the size.
     * @param  {string} price        Bucketed price in cents.
     * @param  {number} timeOfExpiry The timestamp when this ad will expire.
     * @param  {function} auxFn      Optiopnal function to be called when rendering the ad
     * @param  {array} auxArgs       Array of arguments to be passed to auxFn
     */
    function registerAd(adEntry) {

        var pubKitAdId = __internalRegisterAd(adEntry);


        /* At least one of price or dealId must exist. */
        if (!adEntry.price && !adEntry.dealId) {

            return;
        }

        var partnerId = adEntry.partnerId;
        var requestId = adEntry.requestId;

        if (!__partnerInfo.hasOwnProperty(partnerId)) {

            return;
        }

        var sizeKey;
        if (Utilities.isString(adEntry.size)) {
            sizeKey = adEntry.size;
        } else {
            sizeKey = Size.arrayToString(adEntry.size);
        }

        /* Special sizes (native, fullwidth, etc) cannot be combined with regular
         * sizes or each other in the same slot, so the requestId is unique. */
        if (Size.isSpecialSize(sizeKey)) {
            __specialSizedSlotLookup[requestId] = sizeKey;
        }

        if (!__sizeAdIdMap[partnerId]) {
            __sizeAdIdMap[partnerId] = {};
        }

        if (!__sizeAdIdMap[partnerId][sizeKey]) {
            __sizeAdIdMap[partnerId][sizeKey] = {};
        }

        if (!__sizeAdIdMap[partnerId][sizeKey][requestId]) {
            __sizeAdIdMap[partnerId][sizeKey][requestId] = [];
        }
        __sizeAdIdMap[partnerId][sizeKey][requestId].push(pubKitAdId);

        var price = adEntry.price;
        if (price) {
            if (!__priceAdIdMap[partnerId]) {
                __priceAdIdMap[partnerId] = {};
            }

            if (!__priceAdIdMap[partnerId][price]) {
                __priceAdIdMap[partnerId][price] = {};
            }

            if (!__priceAdIdMap[partnerId][price][requestId]) {
                __priceAdIdMap[partnerId][price][requestId] = [];
            }
            __priceAdIdMap[partnerId][price][requestId].push(pubKitAdId);
        }

        var dealId = adEntry.dealId;
        if (dealId) {
            if (!__dealIdAdIdMap[partnerId]) {
                __dealIdAdIdMap[partnerId] = {};
            }

            if (!__dealIdAdIdMap[partnerId][dealId]) {
                __dealIdAdIdMap[partnerId][dealId] = {};
            }

            if (!__dealIdAdIdMap[partnerId][dealId][requestId]) {
                __dealIdAdIdMap[partnerId][dealId][requestId] = [];
            }
            __dealIdAdIdMap[partnerId][dealId][requestId].push(pubKitAdId);
        }

        return pubKitAdId;
    }



    /**
     * Renders an ad. This function is exposed publicly by the shell and called by
     * DFP creatives. Looks up the line item type registered for the given partner to
     * determine how to interpret extra parameters beyond doc.
     *
     * @param  {string} partnerId  ID of the partner whose ad should be rendered.
     *                             Matches the partner ID in the partner's profile.
     * @param  {object} doc        Reference to DOM document where ad is to be rendered
     */
    function renderLegacyDfpAd(partnerId, doc, targetingMap, width, height) {
        try {

            if (!__sizeAdIdMap.hasOwnProperty(partnerId)) {
                EventsService.emit('internal_error', 'Partner ' + partnerId + ' missing from ad ID map.');

                return;
            }

            if (!Utilities.isObject(targetingMap)) {
                EventsService.emit('internal_error', 'invalid targeting map');

                return;
            }

            if (!targetingMap.hasOwnProperty(__partnerInfo[partnerId].idKey)) {
                EventsService.emit('internal_error', 'targeting map missing key ' + __partnerInfo[partnerId].idKey);

                return;
            }

            var targetingValues = targetingMap[__partnerInfo[partnerId].idKey];

            if (!Utilities.isArray(targetingValues)) {
                EventsService.emit('internal_error', 'invalid targeting map');

                return;
            }

            if (!Utilities.isNumeric(width)) {
                EventsService.emit('internal_error', 'invalid width');

                return;
            }

            if (!Utilities.isNumeric(height)) {
                EventsService.emit('internal_error', 'invalid height');

                return;
            }

            var sizeKey = width + 'x' + height;

            if (__sizeRetargetingMap && __sizeRetargetingMap.hasOwnProperty(sizeKey)) {
                var trueSize = __sizeRetargetingMap[sizeKey];
                sizeKey = trueSize[0] + 'x' + trueSize[1];
            }

            for (var i = 0; i < targetingValues.length; i++) {
                var requestId = targetingValues[i];

                /* Special size value (e.g. native, fullwidth) cannot be combined with
                   regular sizes in the same slot */
                var actualSize = __specialSizedSlotLookup[requestId] || sizeKey;

                if (!__sizeAdIdMap[partnerId].hasOwnProperty(actualSize)) {
                    EventsService.emit('internal_error', 'Size key ' + actualSize + ' missing from ad ID map for partner ' + partnerId);

                    return;
                }

                if (!__sizeAdIdMap[partnerId][actualSize].hasOwnProperty(requestId)) {
                    continue;
                }

                var adIdsArray = __sizeAdIdMap[partnerId][actualSize][requestId];

                if (!adIdsArray.length) {
                    continue;
                }

                var pubKitAdId = Utilities.randomSplice(adIdsArray);

                render(doc, pubKitAdId);

                break;
            }
        } catch (ex) {
            EventsService.emit('internal_error', 'Error occurred while rendering ad for "' + partnerId + '".', ex.stack);
        }
    }

    /**
     * Renders an ad from the consolidated price-based line item.
     *
     * @param  {[type]} messagePayload      [description]
     * @param  {[type]} messageSourceWindow [description]
     * @return {[type]}                     [description]
     */
    function renderDfpSafeFrameAd(messagePayload, messageSourceWindow) {
        if (messagePayload.partner === undefined || messagePayload.id === undefined || messagePayload.targeting === undefined
            || (messagePayload.size === undefined && messagePayload.price === undefined)) {

            return;
        }

        var partnerId = messagePayload.partner;
        var price = messagePayload.price;
        var payloadId = messagePayload.id;
        var targetingMap = messagePayload.targeting;
        var creativeSize = messagePayload.size;

        if (!__partnerInfo[partnerId]) {

            return;
        }

        if (!targetingMap.hasOwnProperty(__partnerInfo[partnerId].idKey)) {
            EventsService.emit('internal_error', 'targeting map missing key ' + __partnerInfo[partnerId].idKey);

            return;
        }

        var requestIds = targetingMap[__partnerInfo[partnerId].idKey];
        var adIdsArray = null;

        /* If a "price" is received from the creative, look that up in the price/deal maps
         * Otherwise, attempt to look up by size */
        if (price !== undefined) {
            /* The precedence for the types of ads is as follows:
             *
             *    1. Deals
             *    2. Deals by price, open market
             *
             * This is reflected in the ordering of `adIdsMaps`. */
            var adIdsMaps = [__dealIdAdIdMap, __priceAdIdMap];
            for (var i = 0; i < adIdsMaps.length; i++) {
                adIdsArray = __findAdIdsFromMap(adIdsMaps[i], partnerId, price, requestIds);

                if (adIdsArray) {
                    break;
                }
            }
        } else if (Size.isSize(creativeSize)) {
            var sizeKey = Size.arrayToString(creativeSize);

            if (__sizeRetargetingMap && __sizeRetargetingMap.hasOwnProperty(sizeKey)) {
                var trueSize = __sizeRetargetingMap[sizeKey];
                sizeKey = Size.arrayToString(trueSize);
            }

            adIdsArray = __findAdIdsFromMap(__sizeAdIdMap, partnerId, sizeKey, requestIds);
        } else {

            return;
        }

        if (!adIdsArray) {

            return;
        }

        var pubKitAdId = Utilities.randomSplice(adIdsArray);

        var adEntry = __retrieveAdEntry(pubKitAdId);
        if (!adEntry) {
            EventsService.emit('internal_error', 'No ad found for ad ID ' + pubKitAdId);

            return;
        }

        __runAuxFn(adEntry);

        var size = adEntry.size;
        var adm = adEntry.adm;

        var frames = document.getElementsByTagName('iframe');
        var iFrame;
        for (var j = 0; j < frames.length; j++) {
            if (frames[j].contentWindow === messageSourceWindow) {
                iFrame = frames[j];

                break;
            }
        }

        if (iFrame) {
            iFrame.width = String(size[0]);
            iFrame.height = String(size[1]);

            if (iFrame.parentElement.style.width !== '' && iFrame.parentElement.style.height !== '') {
                iFrame.parentElement.style.width = size[0] + 'px';
                iFrame.parentElement.style.height = size[1] + 'px';
            }
        }

        messageSourceWindow.postMessage('ix_ht_render_adm:' + JSON.stringify({
            adm: adm,
            id: payloadId,
            size: size
        }), '*');
    }



    /**
     * Registers a partner with the render service, indicating which line item type the
     * partner is configured to use and what idKey should be looked up in the targeting
     * map. Should be called before registering an ad with the partner. Must be called
     * before rendering an ad for the partner.
     *
     * Not needed in Postbid.
     *
     * @param  {string} partnerId      The ID from the partner's profile
     * @param  {integer} lineItemType  Line item type from constants.js
     * @param  {string} idKey          The DFP targeting key used for request id.
     */
    function registerPartner(partnerId, lineItemType, idKey) {

        if (!__partnerInfo.hasOwnProperty(partnerId)) {
            __partnerInfo[partnerId] = {};
        }
        __partnerInfo[partnerId].lineItemType = lineItemType;
        __partnerInfo[partnerId].idKey = idKey;
    }


    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        __adStorage = {};
        __expiredAdStorage = {};
        __sizeRetargetingMap = configs.sizeRetargeting || null;
        __expirySweepIntervalId = setInterval(__removeExpiredAds, Constants.RENDER_SERVICE_EXPIRY_SWEEP_TIMER);
        EventsService = SpaceCamp.services.EventsService;

        /*
            Add a listener from messages posted from safeframe creatives.
         */
        window.addEventListener('message', function (ev) {
            try {
                var expectedPrefix = 'ix_ht_render:';
                if (!Utilities.isString(ev.data) || ev.data.substr(0, expectedPrefix.length) !== expectedPrefix) {
                    return;
                }

                var payload = JSON.parse(ev.data.substr(expectedPrefix.length));

                renderDfpSafeFrameAd(payload, ev.source, ev.origin);
            } catch (ex) {
                EventsService.emit('internal_error', 'Error occurred while rendering ad.', ex.stack);
            }
        }, false);
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* PubKitShrinkExports<RenderService> */
        /* Class Information
         * ---------------------------------- */


        /* Data
         * ---------------------------------- */


        /* Functions
         * ---------------------------------- */


        registerAd: registerAd,
        render: render,
        registerPartner: registerPartner,
        renderDfpAd: renderLegacyDfpAd,

    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = RenderService;
},{}],57:[function(require,module,exports){
'use strict';

var System = require(32);

module.exports = function () {
    return {
    };
};
},{}],58:[function(require,module,exports){
'use strict';

module.exports = function () {
    return {
        getSonarPayload: function () {
            return {};
        },
        getLastUpdated: function () {
            return 0;
        },
        setSonarEmail: function () {
            return {};
        }
    };
};
},{}],59:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Constants = require(16);
var System = require(32);
var Whoopsie = require(34);


////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * This class allows for timers to be created and accessed from all layers,
 * allowing for timers to exist cross layer.
 *
 * @class
 */
function TimerService() {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Public
     * ---------------------------------- */

    var TimerStates = {
        NEW: 0,
        RUNNABLE: 1,
        TERMINATED: 2
    };

    /* Private
     * ---------------------------------- */

    var __timerStorage;

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Helpers
     * ---------------------------------- */

    function __generateTimerCallback(id) {
        return function () {
            __timerStorage[id].state = TimerStates.TERMINATED;

            for (var i = 0; i < __timerStorage[id].cbs.length; i++) {
                try {
                    __timerStorage[id].cbs[i]();
                } catch (ex) {
                }
            }

            delete __timerStorage[id].cbs;
            delete __timerStorage[id].timer;
        };
    }

    /* Main
     * ---------------------------------- */

    function createTimer(timeout, startNow, fn) {

        var id = System.generateUniqueId(Constants.SESSION_ID_LENGTH);

        startNow = startNow ? true : false;
        fn = fn ? [fn] : [];

        __timerStorage[id] = {
            state: TimerStates.NEW,
            cbs: fn,
            timeout: timeout
        };

        if (startNow) {
            __timerStorage[id].state = TimerStates.RUNNABLE;
            __timerStorage[id].timer = setTimeout(__generateTimerCallback(id), timeout);
        }

        return id;
    }

    function startTimer(id) {

        if (!__timerStorage.hasOwnProperty(id)) {

            return;
        }

        if (__timerStorage[id].state !== TimerStates.NEW) {
            return;
        }

        __timerStorage[id].state = TimerStates.RUNNABLE;
        __timerStorage[id].timer = setTimeout(__generateTimerCallback(id), __timerStorage[id].timeout);
    }

    function addTimerCallback(id, fn) {

        if (!__timerStorage.hasOwnProperty(id)) {

            return;
        }

        if (__timerStorage[id].state === TimerStates.TERMINATED) {

            return;
        }

        __timerStorage[id].cbs.unshift(fn);
    }

    function getTimerState(id) {

        if (!__timerStorage.hasOwnProperty(id)) {

            return null;
        }

        return __timerStorage[id].state;
    }

    function clearTimer(id) {

        if (!__timerStorage.hasOwnProperty(id)) {

            return;
        }

        if (__timerStorage[id].state === TimerStates.TERMINATED) {

            return;
        }

        __timerStorage[id].state = TimerStates.TERMINATED;
        clearTimeout(__timerStorage[id].timer);

        delete __timerStorage[id].cbs;
        delete __timerStorage[id].timer;
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        __timerStorage = {};
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* PubKitShrinkExports<TimerService> */
        /* Class Information
         * ---------------------------------- */


        /* Data
         * ---------------------------------- */

        TimerStates: TimerStates,


        /* Functions
         * ---------------------------------- */


        createTimer: createTimer,
        startTimer: startTimer,
        addTimerCallback: addTimerCallback,
        getTimerState: getTimerState,
        clearTimer: clearTimer
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = TimerService;
},{}],60:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Dependencies ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Browser = require(11);
var CommandQueue = require(14);
var Loader = require(35);
var SpaceCamp = require(61);
var Utilities = require(33);
var GptHelper = require(23);

var ComplianceService;
var EventsService;



////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function PreGptShell() {
    /* =====================================
     * Data
     * ---------------------------------- */

    /* Private
     * ---------------------------------- */

    /**
     * The main configs object that contains the configurations for everything.
     *
     * @private {object}
     */
    var __configs;

    /**
     * The combined direct interface of everything in this product.
     *
     * @private {object}
     */
    var __directInterface;

    /**
     * This is only assigned if the product fails to load and overwrites the expected
     * interface with one that only supports basic functionality.
     *
     * @private {object}
     */
    var __fallbackShellInterface;

    /**
     * Object to mimic the googletag.pubads() functions.
     *
     * @private {object}
     */
    var __pubads;

    /**
     * A list of the recognized events for Pre-GPT (aka DFP Mode)
     *
     * @private {Array}
     */
    var __validEvents = {
        error: 1,
        warning: 2,
        global_timeout_reached: 3, // eslint-disable-line camelcase
        partner_instantiated: 4, // eslint-disable-line camelcase
        partner_request_sent: 5, // eslint-disable-line camelcase
        partner_request_complete: 6 // eslint-disable-line camelcase
    };

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /*
     * Determine the appropriate way to invoke the original googletag.display(...)
     */
    function __callGptDisplay(divOrSlot) {
        if (SpaceCamp.LastLineGoogletag.display) {
            return SpaceCamp.LastLineGoogletag.display(divOrSlot);
        }

        return window.googletag.display(divOrSlot);
    }

    /*
     * Determine the appropriate way to invoke the original googletag.pubads().refresh(...)
     */
    function __callGptRefresh(gSlots, options) {
        if (SpaceCamp.LastLineGoogletag.refresh) {
            return SpaceCamp.LastLineGoogletag.refresh(gSlots, options);
        }

        return window.googletag.pubads().refresh(gSlots, options);
    }

    /*
     * Determine the appropriate way to invoke the original googletag.destroySlots(...)
     */
    function __callGptDestroySlots(gSlots) {
        if (SpaceCamp.LastLineGoogletag.destroySlots) {
            return SpaceCamp.LastLineGoogletag.destroySlots(gSlots);
        }

        return window.googletag.destroySlots(gSlots);
    }

    /*
     * Determine the appropriate way to invoke the original googletag.pubads().enableSingleRequest(...)
     */
    function __callGptEnableSingleRequest() {
        if (SpaceCamp.LastLineGoogletag.enableSingleRequest) {
            return SpaceCamp.LastLineGoogletag.enableSingleRequest();
        }

        return window.googletag.pubads().enableSingleRequest();
    }

    /*
     * Determine the appropriate way to invoke the original googletag.pubads().disableInitialLoad(...)
     */
    function __callGptDisableInitialLoad() {
        if (SpaceCamp.LastLineGoogletag.disableInitialLoad) {
            return SpaceCamp.LastLineGoogletag.disableInitialLoad();
        }

        return window.googletag.pubads().disableInitialLoad();
    }

    /* Main
     * ---------------------------------- */

    /**
     * Calls the Pre-GPT layer with the provided div ID, which fetches demand and displays new ads
     * for specific, or all slots on the page.
     *
     * @param {string} divOrSlot div ID or GoogleSlotObject for the ad to be displayed.
     * @return nothing
     */
    function display(divOrSlot) {
        try {
            if (!Utilities.isString(divOrSlot) && !GptHelper.isGSlot(divOrSlot)) {
                EventsService.emit('error', 'divOrSlot must be a string or valid gslot object');

                return __callGptDisplay(divOrSlot);
            }
            __directInterface.Layers.GptLayer.display(divOrSlot).catch(function (ex) {

                EventsService.emit('error', ex);

                return __callGptDisplay(divOrSlot);
            });
        } catch (ex) {

            EventsService.emit('error', ex);

            return __callGptDisplay(divOrSlot);
        }
    }

    /**
     * Calls the Pre-GPT layer to fetch demand and refresh ads for either the
     * given g-slots or all slots on the page.
     * @param {array} [gSlot] array of g-slots to be refreshed
     * @param {object} [options] Configuration object associated with the refresh call.
     * @return nothing
     */
    function refresh(gSlots, options) {
        try {
            if (gSlots && !Utilities.isArray(gSlots)) {
                EventsService.emit('error', 'gSlots must be an array of g-slots.');

                return __callGptRefresh(gSlots, options);
            }

            __directInterface.Layers.GptLayer.refresh(gSlots, options).catch(function (ex) {

                EventsService.emit('error', ex);

                return __callGptRefresh(gSlots, options);
            });
        } catch (ex) {

            EventsService.emit('error', ex);

            return __callGptRefresh(gSlots, options);
        }
    }

    /**
     * Calls the Pre-GPT layer to destroy the given g-slots, or all slots on the page
     * if no g-slots specified.
     * @param {array} [gSlot] array of g-slots to be destroyed.
     * @param {function} [callback] function executed after slots are destroyed
     * @return {boolean} true if slots were destroyed.
     */
    function destroySlots(gSlots, callback) {
        var isDestroyed = false;

        // Param gSlots is optional
        if (!callback && Utilities.isFunction(gSlots)) {
            callback = gSlots;
            gSlots = undefined;
        }

        try {
            if (gSlots && !Utilities.isArray(gSlots)) {
                EventsService.emit('error', 'gSlots must be an array of g-slots.');

                isDestroyed = __callGptDestroySlots(gSlots);
            } else {
                isDestroyed = __directInterface.Layers.GptLayer.destroySlots(gSlots);
            }

            if (Utilities.isFunction(callback)) {
                callback(isDestroyed);

                return isDestroyed;
            }
        } catch (ex) {

            EventsService.emit('error', ex);

            // Do not attempt to destroy slots if they were already destroyed
            isDestroyed = isDestroyed || __callGptDestroySlots(gSlots);

            if (Utilities.isFunction(callback)) {
                // Ensures program execution will continue if callback is source of error
                // If the callback is the source of the error, there is a chance
                // Work is duplicated when this function is called a second time
                try {
                    callback(isDestroyed);

                    return isDestroyed;
                } catch (e) {

                    EventsService.emit('error', e);
                }
            }
        }

        return isDestroyed;
    }

    /**
     * Sets the request architecture to SRA, and calls googletag.pubads().enableSingleRequest()
     * @return  Result of calling googletag.pubads().enableSingleRequest()
     */
    function enableSingleRequest() {
        try {
            return __directInterface.Layers.GptLayer.enableSingleRequest();
        } catch (ex) {

            EventsService.emit('error', ex);

            return __callGptEnableSingleRequest();
        }
    }

    /**
     * Sets the initial load state to disabled, and calls googletag.pubads().disableInitialLoad()
     * @return  Result of calling googletag.pubads().disableInitialLoad()
     */
    function disableInitialLoad() {
        try {
            return __directInterface.Layers.GptLayer.disableInitialLoad();
        } catch (ex) {

            EventsService.emit('error', ex);

            return __callGptDisableInitialLoad();
        }
    }

    /**
     * Mimics googletag.pubads()
     * @return  Object containing pubads() functions.
     */
    function pubads() {
        return __pubads;
    }

    /**
     * [setFirstPartyData description]
     * @return {[type]} [description]
     */
    function setFirstPartyData(data) {
        if (!Utilities.isObject(data)) {
            EventsService.emit('error', 'invalid first-party data: `data` must be an object');

            return;
        }

        if (data.hasOwnProperty('rubicon')) {
            if (!Utilities.isObject(data.rubicon)) {
                EventsService.emit('error', 'invalid first-party data.rubicon');

                return;
            }

            for (var prop in data.rubicon) {
                if (!data.rubicon.hasOwnProperty(prop)) {
                    continue;
                }

                if (['keywords', 'inventory', 'visitor'].indexOf(prop) === -1) {
                    EventsService.emit('error', 'invalid first-party data: unrecognized property ' + prop + ' of `data.rubicon`');

                    return;
                }
            }

            if (data.rubicon.hasOwnProperty('keywords') && !Utilities.isArray(data.rubicon.keywords, 'string')) {
                EventsService.emit('error', 'invalid first-party data: `data.rubicon.keywords` must be an array of strings');

                return;
            }

            if (data.rubicon.hasOwnProperty('inventory')) {
                if (!Utilities.isObject(data.rubicon.inventory)) {
                    EventsService.emit('error', 'invalid first-party data: `data.rubicon.inventory` must be an object');

                    return;
                }

                for (var invKey in data.rubicon.inventory) {
                    if (!data.rubicon.inventory.hasOwnProperty(invKey)) {
                        continue;
                    }

                    if (!Utilities.isArray(data.rubicon.inventory[invKey], 'string')) {
                        EventsService.emit('error', 'invalid first-party data: property ' + invKey + ' of `data.rubicon.inventory` must be an array of strings');

                        return;
                    }
                }
            }

            if (data.rubicon.hasOwnProperty('visitor')) {
                if (!Utilities.isObject(data.rubicon.visitor)) {
                    EventsService.emit('error', 'invalid first-party data: `data.rubicon.visitor` must be an object');

                    return;
                }

                for (var visKey in data.rubicon.visitor) {
                    if (!data.rubicon.visitor.hasOwnProperty(visKey)) {
                        continue;
                    }

                    if (!Utilities.isArray(data.rubicon.visitor[visKey], 'string')) {
                        EventsService.emit('error', 'invalid first-party data: property ' + visKey + ' of `data.rubicon.visitor` must be an array of strings');

                        return;
                    }
                }
            }
        }

        try {
            __directInterface.Layers.PartnersLayer.setFirstPartyData(data);
        } catch (ex) {

            EventsService.emit('error', ex);
        }
    }

    /**
     * [subscribeEvent description]
     * @return {[type]} [description]
     */
    function subscribeEvent(eventName, once, callback) {
        var subscriptionId = '';

        try {
            if (!Utilities.isBoolean(once)) {
                EventsService.emit('error', '`once` must be a boolean');

                return subscriptionId;
            }

            if (!Utilities.isFunction(callback)) {
                EventsService.emit('error', '`callback` must be a function');

                return subscriptionId;
            }

            if (!Utilities.isString(eventName)) {
                EventsService.emit('error', '`eventName` must be a string');

                return subscriptionId;
            }

            if (!__validEvents.hasOwnProperty(eventName)) {
                EventsService.emit('error', 'Unrecognized event ' + eventName);

                return subscriptionId;
            }

            /* API says callback should get a string description, so turn whatever the
             * event actually emitted into a single string */
            var wrappingCallback = function () {
                var args = Array.prototype.slice.call(arguments);

                callback(eventName, JSON.stringify(args));
            };

            if (once) {
                subscriptionId = EventsService.once(eventName, wrappingCallback);
            } else {
                subscriptionId = EventsService.on(eventName, wrappingCallback);
            }
        } catch (ex) {

            EventsService.emit('error', ex);
        }

        return subscriptionId;
    }

    /**
     * [unsubscribeEvent description]
     * @return {[type]} [description]
     */
    function unsubscribeEvent(subscriptionId) {
        try {
            if (!Utilities.isString(subscriptionId)) {
                EventsService.emit('error', '`subscriptionId` must be a string');

                return;
            }

            EventsService.off(subscriptionId);
        } catch (ex) {

            EventsService.emit('error', ex);
        }
    }

    /**
     * Returns Identity data in local storage.
     */
    function getIdentityInfo() {
        var identityInfo = {};
        // Adding extra check for when we test
            identityInfo = __directInterface.Layers.IdentityLayer.getIdentityResults();

        return identityInfo;
    }

    /**
     *
     * Exposes the retrieveVideoDemand function implementation of in the VideoInterfaceLayer
     * @return {[type]} [description]
     */
    function retrieveVideoDemand(htSlotVideoDemandObjs, callback, options) {
        if (!__directInterface.Layers.VideoInterfaceLayer.retrieveVideoDemandValidation(htSlotVideoDemandObjs, callback, options)) {
            return;
        }

        try {
            ComplianceService.delay(function () {
                var receivedInfo = __directInterface.Layers.VideoInterfaceLayer.retrieveVideoDemand(htSlotVideoDemandObjs, options);

                receivedInfo.promise
                    .then(function (receivedDemand) {
                        callback(receivedDemand);
                    })
                    .catch(function (ex) {
                        EventsService.emit('error', ex);

                        setTimeout(callback.bind(null, {}), 0);
                    });
            })();
        } catch (ex) {

            EventsService.emit('error', ex);

            setTimeout(callback.bind(null, {}), 0);
        }
    }

    /**
     *
     * Exposes the buildGamMvt function implementation of in the VideoInterfaceLayer
     * @return {[type]} [description]
     */
    function buildGamMvt(htSlotsParams, demandObjs) {
        return __directInterface.Layers.VideoInterfaceLayer.buildGamMvt(htSlotsParams, demandObjs);
    }

    /**
     * Stores hashed email in localstorage along with triggering new RTI calls
     * @param {*} email - Sonar email to set in localstorage
     */
    function setSonarEmail(email) {
        var result = {
            status: false,
            message: 'Identity feature not enabled'
        };
        result = SpaceCamp.services.PublisherSonarService.setSonarEmail(email);
        if (result.status) {
            __directInterface.Layers.IdentityLayer.invokeAllPartners();
        }

        return result;
    }

    /* =====================================
     * Constructors
     * ---------------------------------- */

    (function __constructor() {
        SpaceCamp.LastLineGoogletag = {};

        try {
            /* Metascript to set value of __configs variable, will run during build: */
__configs = window.wrapper.configs;

            window.googletag = window.googletag || {};
            window.googletag.cmd = window.googletag.cmd || [];

            __directInterface = Loader(__configs).getDirectInterface();

            ComplianceService = SpaceCamp.services.ComplianceService;
            EventsService = SpaceCamp.services.EventsService;

            /* GPT layer is required to be the first element in Layers.
             * The build will fail otherwise. */
            var override = __configs.Layers[0].configs.override;
            if (override) {
                /* Create last line of defence references to googletag functions to prevent.
                   Reference these to avoid infinite loops. */
                var makeLastLine = function () {
                    /* Override functions: first keep a reference to original googletag function,
                       then override googletag function with our function. */
                    if (override.display) {
                        SpaceCamp.LastLineGoogletag.display = window.googletag.display;
                        window.googletag.display = ComplianceService.delay(display);
                    }

                    if (override.refresh) {
                        SpaceCamp.LastLineGoogletag.refresh = window.googletag.pubads().refresh.bind(window.googletag.pubads());
                        window.googletag.pubads().refresh = ComplianceService.delay(refresh);
                    }

                    if (override.destroySlots) {
                        SpaceCamp.LastLineGoogletag.destroySlots = window.googletag.destroySlots;
                        window.googletag.destroySlots = ComplianceService.delay(destroySlots);
                    }

                    if (override.enableSingleRequest) {
                        SpaceCamp.LastLineGoogletag.enableSingleRequest = window.googletag.pubads().enableSingleRequest.bind(window.googletag.pubads());
                        window.googletag.pubads().enableSingleRequest = enableSingleRequest;
                    }

                    if (override.disableInitialLoad) {
                        SpaceCamp.LastLineGoogletag.disableInitialLoad = window.googletag.pubads().disableInitialLoad.bind(window.googletag.pubads());
                        window.googletag.pubads().disableInitialLoad = disableInitialLoad;
                    }
                };

                SpaceCamp.initQueue.unshift(makeLastLine);

                var runInitQueue = function () {
                    SpaceCamp.initQueue = CommandQueue(SpaceCamp.initQueue);
                };

                if (Utilities.isArray(window.googletag.cmd)) {
                    window.googletag.cmd.unshift(runInitQueue);
                } else {
                    /* Because at some point, the cmd queue turns into an object with .push() */
                    window.googletag.cmd.push(runInitQueue);
                }
            }

            __pubads = {
                refresh: ComplianceService.delay(refresh),
                enableSingleRequest: enableSingleRequest,
                disableInitialLoad: disableInitialLoad
            };

            try {
                __directInterface.Layers.IdentityLayer.retrieve();
            } catch (ex) {
            }

        } catch (ex) {

            __fallbackShellInterface = {
                display: __callGptDisplay,
                destroySlots: __callGptDestroySlots,
                pubads: function () {
                    return {
                        refresh: __callGptRefresh,
                        enableSingleRequest: __callGptEnableSingleRequest,
                        disableInitialLoad: __callGptDisableInitialLoad
                    };
                },
                setFirstPartyData: function () {},
                subscribeEvent: function () {
                    return '';
                },
                unsubscribeEvent: function () {}
            };
        }
    })();

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    if (__fallbackShellInterface) {
        return __fallbackShellInterface;
    }

    var shellInterface = {};

    /* If any variables are provided in window.headertag, preserve them.
       If a variable has the same name as a public API method, it will subsequently
       be overwritten. */
    if (window[SpaceCamp.NAMESPACE]) {
        for (var prop in window[SpaceCamp.NAMESPACE]) {
            if (!window[SpaceCamp.NAMESPACE].hasOwnProperty(prop)) {
                continue;
            }

            shellInterface[prop] = window[SpaceCamp.NAMESPACE][prop];
        }
    }

    // Populate public API

    /* Class Information
     * ---------------------------------- */

    /* Functions
     * ---------------------------------- */

    shellInterface.display = ComplianceService.delay(display);
    shellInterface.refresh = ComplianceService.delay(refresh);
    shellInterface.destroySlots = ComplianceService.delay(destroySlots);
    shellInterface.enableSingleRequest = enableSingleRequest;
    shellInterface.disableInitialLoad = disableInitialLoad;
    shellInterface.pubads = pubads;
    shellInterface.setFirstPartyData = setFirstPartyData;
    shellInterface.subscribeEvent = subscribeEvent;
    shellInterface.unsubscribeEvent = unsubscribeEvent;
    shellInterface.apiReady = true;
    shellInterface.setSiteKeyValueData = SpaceCamp.services.KeyValueService.setSiteKeyValueData;
    shellInterface.setUserKeyValueData = SpaceCamp.services.KeyValueService.setUserKeyValueData;
    shellInterface.getIdentityInfo = getIdentityInfo;
    shellInterface.retrieveVideoDemand = retrieveVideoDemand;
    shellInterface.buildGamMvt = buildGamMvt;
    shellInterface.setSonarEmail = setSonarEmail;


try {
eval(window.adapter.exports);

} catch(err) {
}


    return shellInterface;
}


window[SpaceCamp.NAMESPACE] = window[SpaceCamp.NAMESPACE] || {};
window[SpaceCamp.NAMESPACE].cmd = window[SpaceCamp.NAMESPACE].cmd || [];

var cmd = window[SpaceCamp.NAMESPACE].cmd;

window[SpaceCamp.NAMESPACE] = PreGptShell();
window[SpaceCamp.NAMESPACE].cmd = CommandQueue(cmd);
},{}],61:[function(require,module,exports){
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Main ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var SpaceCamp = {
    /* PubKitShrinkExports<SpaceCamp> */

NAMESPACE: 'headertag',

PRODUCT: 'DfpMode',

    services: {},

    htSlots: [],

    htSlotsMap: {},
    DeviceTypeChecker: {},

    /* Currently only used by googletag override */
    initQueue: [],

    /* Loaded by bid layer */
    globalTimeout: null,

    /* Generated by header-stats-service */
    instanceId: null,

    version: '2.28.0-canary'
};

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = SpaceCamp;
},{}]},{},[1,60]);
