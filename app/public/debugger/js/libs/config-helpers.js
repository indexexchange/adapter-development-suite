'use strict';

(function () {
    var Utilities = window.Utilities;

    function generatePartnerConfig(flatConfigs) {
        var partnerConfigs = {
            xSlots: {},
            mapping: {
                htSlotDesktopA: [],
                htSlotDesktopB: [],
                htSlotMobileA: [],
                htSlotMobileB: []
            }
        };

        if (typeof flatConfigs.adapterConfig === 'string'
            && flatConfigs.adapterConfig.length > 0) {
            var parsedAdapterConfigs = null;
            try {
                parsedAdapterConfigs = JSON.parse(flatConfigs.adapterConfig);
                partnerConfigs = Utilities.mergeObjects(partnerConfigs, parsedAdapterConfigs);
            } catch (ex) {
                throw Error('Error parsing Adapter-Level config: ' + ex.message);
            }
        }

        var xSlotConfigMap = [
            {
                source: flatConfigs.desktopSlotConfig1,
                htSlotName: 'htSlotDesktopA'
            },
            {
                source: flatConfigs.desktopSlotConfig2,
                htSlotName: 'htSlotDesktopA'
            },
            {
                source: flatConfigs.desktopSlotConfig3,
                htSlotName: 'htSlotDesktopB'
            },
            {
                source: flatConfigs.desktopSlotConfig4,
                htSlotName: 'htSlotDesktopB'
            },
            {
                source: flatConfigs.mobileSlotConfig1,
                htSlotName: 'htSlotMobileA'
            },
            {
                source: flatConfigs.mobileSlotConfig2,
                htSlotName: 'htSlotMobileA'
            },
            {
                source: flatConfigs.mobileSlotConfig3,
                htSlotName: 'htSlotMobileB'
            },
            {
                source: flatConfigs.mobileSlotConfig4,
                htSlotName: 'htSlotMobileB'
            }
        ];

        for (var i = 0; i < xSlotConfigMap.length; i++) {
            var source = xSlotConfigMap[i].source;
            var target = partnerConfigs.xSlots;
            var htSlotName = xSlotConfigMap[i].htSlotName;

            if (typeof source !== 'string' || source.length === 0) {
                continue;
            }

            var parsedSource = null;
            try {
                parsedSource = JSON.parse(source);
            } catch (ex) {
                var letter = i % 2 === 0 ? 'A' : 'B';
                var slotType = 'Desktop Slot ';
                var slotNum = Math.floor(i / 2);
                if (slotNum > 1) {
                    slotNum -= 2;
                    slotType = 'Mobile Slot ';
                }
                slotNum++;

                throw Error(
                    'Error parsing Slot ' + slotType + slotNum + letter + ' config: ' + ex.message
                );
            }

            var uid = Utilities.generateUniqueId();
            target[uid] = parsedSource;

            partnerConfigs.mapping[htSlotName].push(uid);
        }

        return partnerConfigs;
    }

    window.ConfigHelpers = {
        generatePartnerConfig: generatePartnerConfig
    };
})();
