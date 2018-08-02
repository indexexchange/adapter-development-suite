/* eslint-disable no-param-reassign */

'use strict';

(function () {
    var CHARACTER_SETS = {
        ALPHANUM: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        ALPHA: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        ALPHA_UPPER: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        ALPHA_LOWER: 'abcdefghijklmnopqrstuvwxyz',
        HEX: '0123456789abcdef',
        NUM: '0123456789'
    };

    function mergeObjects(target, source) {
        for (var prop in source) {
            if (!source.hasOwnProperty(prop)) {
                continue;
            }

            target[prop] = source[prop];
        }

        return target;
    }

    function generateUniqueId(len, charSet) {
        len = len || 8;
        charSet = charSet || 'ALPHANUM';

        var uid = '';
        for (var i = 0; i < len; i++) {
            uid += CHARACTER_SETS[charSet].charAt(
                Math.floor(Math.random() * CHARACTER_SETS[charSet].length)
            );
        }

        return uid;
    }

    window.Utilities = {
        mergeObjects: mergeObjects,
        generateUniqueId: generateUniqueId
    };
})();
