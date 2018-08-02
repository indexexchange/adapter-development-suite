'use strict';

(function () {
    function requireProxy() {
        return {};
    }

    var moduleProxy = {};
    window.adapter.systemTests(requireProxy, moduleProxy);
    window.testCases = moduleProxy.exports;
})();
