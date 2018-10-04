'use strict';

(function () {
    var ConfigHelpers = window.ConfigHelpers;

    function getConfigs() {
        var configNameToSelector = {
            deviceType: 'input[name=radio-device-type]:checked',
            gdprApplies: 'input[name=radio-gdpr-applies]:checked',
            adsrvrOrg: 'input[name=radio-adsrvr-org]:checked',
            singleRequest: 'input[name=radio-single-request]:checked',
            initialLoad: 'input[name=radio-initial-load]:checked',
            adapterConfig: 'textarea[name=textarea-adapter-config]',
            desktopSlotConfig1: 'textarea[name=textarea-desktop-slot-config-1]',
            desktopSlotConfig2: 'textarea[name=textarea-desktop-slot-config-2]',
            desktopSlotConfig3: 'textarea[name=textarea-desktop-slot-config-3]',
            desktopSlotConfig4: 'textarea[name=textarea-desktop-slot-config-4]',
            mobileSlotConfig1: 'textarea[name=textarea-mobile-slot-config-1]',
            mobileSlotConfig2: 'textarea[name=textarea-mobile-slot-config-2]',
            mobileSlotConfig3: 'textarea[name=textarea-mobile-slot-config-3]',
            mobileSlotConfig4: 'textarea[name=textarea-mobile-slot-config-4]',
            expectedBid: 'input[name=text-expected-bid]'
        };

        var configs = {};

        for (var configName in configNameToSelector) {
            if (!configNameToSelector.hasOwnProperty(configName)) {
                continue;
            }

            var selector = configNameToSelector[configName];
            var value = $(selector).val();

            if (typeof value !== 'string' || value === '') {
                continue;
            }

            configs[configName] = value;
        }

        return configs;
    }

    function requireProxy() {
        return window.SchemaInspector;
    }

    function validatePartnerConfigs() {
        var configs = getConfigs();

        var partnerConfigs = null;
        try {
            partnerConfigs = ConfigHelpers.generatePartnerConfig(configs);
        } catch (ex) {
            $('#validation-logs').text(ex.message);

            return false;
        }

        var moduleProxy = {
            exports: {}
        };
        window.adapter.validator(requireProxy, moduleProxy, moduleProxy.exports);

        var partnerValidator = moduleProxy.exports;

        var results = partnerValidator(partnerConfigs);

        if (results) {
            results = results.replace('\n', '<br />');
            $('#validation-logs').html(results + '<br />');

            return false;
        }

        $('#validation-logs').text('Partner configuration validated successfully.');

        return true;
    }

    function loadAdDisplayer() {
        if (!validatePartnerConfigs()) {
            return;
        }

        var radioProtocol = $('input[name=radio-protocol]:checked').val();

        var protocol = radioProtocol === 'https' ? 'https:' : 'http:';
        var port = radioProtocol === 'https' ? '5838' : '5837';

        var url = protocol + '//localhost:' + port + '/public/debugger/ad-displayer.html';

        $('#ad-displayer').attr('src', url);
    }

    function toggleConfig(ev) {
        if (!ev.hasOwnProperty('currentTarget')) {
            return;
        }

        if (ev.currentTarget.id === 'adapter-tab') {
            $('#page-tab').removeClass('active');
            $('#adapter-tab').addClass('active');
            $('#page-config').css('display', 'none');
            $('#adapter-config').css('display', 'block');
        } else if (ev.currentTarget.id === 'page-tab') {
            $('#adapter-tab').removeClass('active');
            $('#page-tab').addClass('active');
            $('#page-config').css('display', 'block');
            $('#adapter-config').css('display', 'none');
        }
    }

    function toggleXSlot() {
        var value = $('input[name=radio-bid-by]:checked').val();
        if (value === 'size') {
            $('.alt').css('display', 'block');
        } else if (value === 'slot') {
            $('.alt').css('display', 'none');
        }
    }

    window.addEventListener('message', function (ev) {
        try {
            if (typeof ev.data !== 'string' && ev.data.length < 1) {
                return;
            }

            if (ev.data.indexOf('adapter-debugger-request:') === -1) {
                return;
            }

            var configs = JSON.stringify(getConfigs());

            ev.source.postMessage('adapter-debugger-response:' + configs, '*');
        } catch (ex) {

        }
    }, false);

    $(window).on('load', function () {
        $('#form-configurations').restoreForm();
        toggleXSlot();

        $('#button-load-test').click(loadAdDisplayer);

        // Add listener for Bid By section
        $('#bid-slot').click(toggleXSlot);
        $('#bid-size').click(toggleXSlot);

        // Add listener for configuration sections
        $('#page-tab').click(toggleConfig);
        $('#adapter-tab').click(toggleConfig);

        // Logic for configuration section upon load
        if ($('#page-tab').hasClass('active')) {
            $('#page-config').css('display', 'block');
            $('#adapter-config').css('display', 'none');
        } else if ($('#adapter-tab').hasClass('active')) {
            $('#page-config').css('display', 'none');
            $('#adapter-config').css('display', 'block');
        }

        // Resize the height of things
        $('#ad-displayer').css('height', (window.innerHeight - 215) + 'px');
        $('.tab-content').css('height', (window.innerHeight - 145) + 'px');
    });

    $(window).on('unload', function () {
        $('#form-configurations').saveForm();
    });
})();
