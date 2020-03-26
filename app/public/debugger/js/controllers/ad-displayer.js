'use strict';

(function () {
    var ConfigHelpers = window.ConfigHelpers;

    var configs = null;

    var protocol = document.location.protocol === 'https:' ? 'https:' : 'http:';
    var port = protocol === 'https:' ? '5838' : '5837';

    function loadScript(url) {
        return new Promise(function (resolve) {
            var script = window.document.createElement('script');
            script.type = 'text/javascript';
            script.async = false;
            script.src = url;

            script.onload = function () {
                resolve();
            };

            var node = window.document.getElementsByTagName('script')[0];
            node.parentNode.insertBefore(script, node);
        });
    }

    function retrieveConfigs() {
        return new Promise(function (resolve) {
            window.addEventListener('message', function (ev) {
                if (typeof ev.data !== 'string' || ev.data.length === 0) {
                    return;
                }

                if (ev.data.indexOf('adapter-debugger-response:') === -1) {
                    return;
                }

                configs = JSON.parse(
                    ev.data.slice('adapter-debugger-response:'.length)
                );

                resolve();
            }, false);

            window.parent.postMessage('adapter-debugger-request:', '*');
        });
    }

    function setupPage() {
        return new Promise(function (resolve) {
            window.page = window.page || {};
            window.page.deviceType = function () {
                if (configs.deviceType === 'mobile') {
                    return 'mobile';
                }

                return 'desktop';
            };

            if (configs.privacyJsApi === 'enable') {
                window.__cmp = function (a, b, cb) {
                    cb({
                        gdprApplies: true,
                        consentData: 'TEST_GDPR_CONSENT_STRING'
                    });
                };

                window.__uspapi = function (cmd, ver, cb) {
                    cb({
                        version: 1,
                        uspString: 'TEST_USPAPI_CONSENT_STRING'
                    }, true);
                };

                window.__tcfapi = function (cmd, ver, cb, params) {
                    cb({
                        tcfPolicyVersion: 2,
                        tcString: 'TEST_TCF2_CONSENT_STRING',
                        gdprApplies: true
                    }, true);
                };
            }

            var now = (new Date()).getTime();

            if (configs.adsrvrOrg === 'enable') {
                localStorage.setItem(
                    'IXWRAPPERAdserverOrgIp',
                    JSON.stringify({
                        t: now,
                        d: {
                            response: 'match',
                            data: {
                                TDID: 'TEST_ADSRVR_ORG_STRING'
                            }
                        },
                        e: now + 604800000
                    })
                );
            } else {
                localStorage.setItem(
                    'IXWRAPPERAdserverOrgIp',
                    JSON.stringify({
                        t: now,
                        d: {
                            response: 'error'
                        },
                        e: now + 604800000
                    })
                );
            }

            resolve();
        });
    }

    function loadGpt() {
        return new Promise(function (resolve) {
            window.googletag = window.googletag || {};
            window.googletag.cmd = window.googletag.cmd || [];

            window.googletag.cmd.push(function () {
                window.googletag.defineSlot('/77475840/pktf/sf-price', [[1, 1]], 'div-desktop-a')
                    .addService(window.googletag.pubads());

                window.googletag.defineSlot('/77475840/pktf/ff-price', [[1, 1]], 'div-desktop-b')
                    .addService(window.googletag.pubads());

                window.googletag.defineSlot('/77475840/pktf/sf-price', [[1, 1]], 'div-mobile-a')
                    .addService(window.googletag.pubads());

                window.googletag.defineSlot('/77475840/pktf/ff-price', [[1, 1]], 'div-mobile-b')
                    .addService(window.googletag.pubads());

                if (configs.singleRequest === 'enable') {
                    window.googletag.pubads().enableSingleRequest();
                }

                if (configs.initialLoad === 'disable') {
                    window.googletag.pubads().disableInitialLoad();
                }

                window.googletag.enableServices();

                resolve();
            });

            var url = protocol + '//www.googletagservices.com/tag/js/gpt.js';

            loadScript(url);
        });
    }

    function loadWrapperConfigs() {
        return new Promise(function (resolve) {
            var url = protocol
                + '//localhost:' + port + '/public/debugger/js/wrapper/configs/debug-configs.js';

            loadScript(url).then(function () {
                resolve();
            });
        });
    }

    function loadAdapter() {
        return new Promise(function (resolve) {
            window.adapter = window.adapter || {};
            window.adapter.configs = ConfigHelpers.generatePartnerConfig(configs);

            var urlBidder = protocol + '//localhost:' + port + '/adapter/dfp-auto/bidder.js';
            var urlExports = protocol + '//localhost:' + port + '/adapter/dfp-auto/exports.js';

            Promise.all([loadScript(urlBidder), loadScript(urlExports)])
                .then(function () {
                    resolve();
                });
        });
    }

    function loadWrapper() {
        return new Promise(function (resolve) {
            if (configs.singleRequest === 'enable') {
                window.wrapper.configs.Layers[0].configs.enableSingleRequest = true;
            } else {
                window.wrapper.configs.Layers[0].configs.enableSingleRequest = false;
            }

            if (configs.initialLoad === 'enable') {
                window.wrapper.configs.Layers[0].configs.disableInitialLoad = false;
            } else {
                window.wrapper.configs.Layers[0].configs.disableInitialLoad = true;
            }

            window.googletag.pubads().setTargeting('EXPECTED_PRICE', configs.expectedBid);

            var url = protocol
                + '//localhost:' + port + '/public/debugger/js/wrapper/debug-wrapper.js';

            loadScript(url).then(function () {
                resolve();
            });
        });
    }

    function display() {
        var gSlots = window.googletag.pubads().getSlots();

        for (var i = 0; i < gSlots.length; i++) {
            window.headertag.display(gSlots[i].getSlotElementId());
        }
    }

    function refresh() {
        window.headertag.pubads().refresh();
    }

    function loadCmdQueue() {
        // Save a reference to the command queue. Used to iterate over the array after the top
        // reference is overwritten
        var cmdQueue = window.top.headertag.cmd;

        // Gives access to headertag object on the top level window element
        window.top.headertag = window.headertag;

        // Transfer commands from the temporary top level queue to the headertag queue
        for (var i = 0; i < cmdQueue.length; i++) {
            window.headertag.cmd.push(cmdQueue[i]);
        }
    }

    $(window).on('load', function () {
        $('#button-display').click(display);
        $('#button-refresh').click(refresh);

        retrieveConfigs()
            .then(function () {
                return setupPage();
            })
            .then(function () {
                return loadGpt();
            })
            .then(function () {
                return loadWrapperConfigs();
            })
            .then(function () {
                return loadAdapter();
            })
            .then(function () {
                return loadWrapper();
            })
            .then(function () {
                loadCmdQueue();
            });
    });
})();
