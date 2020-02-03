'use strict';

window.wrapper = window.wrapper || {};
window.wrapper.configs = {
    "DeviceTypeChecker": {
        "method": "REFERENCE",
        "configs": {
            "reference": "window.page.deviceType"
        }
    },
    "htSlots": {
        "htSlotDesktopA": {
            "id": "htSlotDesktopAId",
            "divId": "div-desktop-a",
            "sizeMapping": {
                "0x0": [[1, 1]]
            },
            "deviceType": "desktop",
            "type": "BANNER"
        },
        "htSlotDesktopB": {
            "id": "htSlotDesktopBId",
            "divId": "div-desktop-b",
            "sizeMapping": {
                "0x0": [[1, 1]]
            },
            "deviceType": "desktop",
            "type": "BANNER"
        },
        "htSlotMobileA": {
            "id": "htSlotMobileAId",
            "divId": "div-mobile-a",
            "sizeMapping": {
                "0x0": [[1, 1]]
            },
            "deviceType": "mobile",
            "type": "BANNER"
        },
        "htSlotMobileB": {
            "id": "htSlotMobileBId",
            "divId": "div-mobile-b",
            "sizeMapping": {
                "0x0": [[1, 1]]
            },
            "deviceType": "mobile",
            "type": "BANNER"
        }
    },
    "Services": {
        "HeaderStatsService": {
            "siteId": "1",
            "configId": "12323",
            "options": {
                "auctionCycle": true
            }
        },
        "KeyValueService": {},
        "EventsService": {},
        "RenderService": {},
        "TimerService": {},
        "ComplianceService": {
            "gdprAppliesDefault": false,
            "timeout": 1000
        }
    },
    "Layers": [{
        "layerId": "GptLayer",
        "configs": {
            "mobileGlobalTimeout": 5000,
            "desktopGlobalTimeout": 5000,
            "enableSingleRequest": true,
            "disableInitialLoad": false,
            "override": {
                "display": false,
                "refresh": false,
                "destroySlots": false,
                "enableSingleRequest": false,
                "disableInitialLoad": false
            },
            "slotMapping": {
                "selectors": ["divId"],
                "filters": ["deviceType"]
            }
        }
    }, {
            "layerId": "VideoInterfaceLayer",
            "configs": {
                "desktopVideoGlobalTimeout": 100000,
                "mobileVideoGlobalTimeout": 150000
            }
    }, {
        "layerId": "MediationLayer",
        "configs": {
            "mediationLevel": "NONE"
        }
    }, {
        "layerId": "IdentityLayer",
        "configs": {
            "timeout": 200,
            "partners": {
                "AdserverOrgIp": {
                    "enabled": true,
                    "configs": {
                        "publisherId": 11111
                    }
                }
            }
        }
    }, {
        "layerId": "PartnersLayer",
        "configs": {
            "bidTransformerTypes": {
                "video": {
                    "floor": 0,
                    "buckets": [
                        {
                            "max": 200,
                            "step": 5
                        },
                        {
                            "max": 1000,
                            "step": 10
                        },
                        {
                            "max": 7000,
                            "step": 50
                        }
                    ]
                }
            },
            "partners": {
                "DynamicPartnerLoader": {
                    "enabled": true,
                    "configs": {
                        "xSlots": {},
                        "mapping": {}
                    }
                }
            }
        }
    }]
};
