'use strict';

window.wrapper = window.wrapper || {};
window.wrapper.configs = {
    DeviceTypeChecker: {
        method: 'REFERENCE',
        configs: {
            reference: 'window.page.deviceType'
        }
    },
    htSlots: {
        htSlotDesktopA: {
            id: 'htSlotDesktopAId',
            divId: 'div-desktop-a',
            sizeMapping: {
                '0x0': [[1, 1]]
            },
            deviceType: 'desktop'
        },
        htSlotDesktopB: {
            id: 'htSlotDesktopBId',
            divId: 'div-desktop-b',
            sizeMapping: {
                '0x0': [[1, 1]]
            },
            deviceType: 'desktop'
        },
        htSlotMobileA: {
            id: 'htSlotMobileAId',
            divId: 'div-mobile-a',
            sizeMapping: {
                '0x0': [[1, 1]]
            },
            deviceType: 'mobile'
        },
        htSlotMobileB: {
            id: 'htSlotMobileBId',
            divId: 'div-mobile-b',
            sizeMapping: {
                '0x0': [[1, 1]]
            },
            deviceType: 'mobile'
        }
    },
    Services: {
        HeaderStatsService: {
            siteId: '1',
            configId: '12323',
            options: {
                auctionCycle: true
            }
        },
        EventsService: {},
        RenderService: {},
        TimerService: {},
        ComplianceService: {
            gdprAppliesDefault: false,
            timeout: 1000
        },
        KeyValueService: {}
    },
    Layers: [
        {
            layerId: 'GptLayer',
            configs: {
                globalTimeout: 5000,
                enableSingleRequest: true,
                disableInitialLoad: false,
                override: {
                    display: false,
                    refresh: false,
                    destroySlots: false,
                    enableSingleRequest: false,
                    disableInitialLoad: false
                },
                slotMapping: {
                    selectors: ['divId'],
                    filters: ['deviceType']
                }
            }
        },
        {
            layerId: 'MediationLayer',
            configs: {
                mediationLevel: 'NONE'
            }
        },
        {
            layerId: 'IdentityLayer',
            configs: {
                timeout: 200,
                partners: {
                    AdserverOrgIp: {
                        enabled: true,
                        configs: {
                            publisherId: 11111
                        }
                    }
                }
            }
        },
        {
            layerId: 'PartnersLayer',
            configs: {
                partners: {
                    DynamicPartnerLoader: {
                        enabled: true,
                        configs: {
                            xSlots: {},
                            mapping: {}
                        }
                    }
                }
            }
        }
    ]
};
