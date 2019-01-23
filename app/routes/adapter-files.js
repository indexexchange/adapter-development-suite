/* eslint-disable no-sync, no-magic-numbers, no-console */

// =============================================================================
// IMPORTS /////////////////////////////////////////////////////////////////////
// =============================================================================

const Fs = require('fs');
const Path = require('path');

const Express = require('express');
const MetaScript = require('metascript');

const Router = Express.Router();

// =============================================================================
// MAIN ////////////////////////////////////////////////////////////////////////
// =============================================================================

const cwd = process.env.INIT_CWD;
let dir = cwd;

if (typeof process.argv[2] === 'string') {
    const partnerFolder = process.argv[2];
    const htWrapperAdaptersDir = cwd.substring(
        0,
        cwd.lastIndexOf('ht-wrapper-adapters') + 'ht-wrapper-adapters'.length
    );

    dir = Path.join(htWrapperAdaptersDir, partnerFolder);
}

console.log(`Using files in directory ${dir}`);

const fileNames = Fs.readdirSync(dir);

const productScopes = {
    'dfp-auto': {
        TEST: false,
        DEBUG: false,

        FEATURES: {
            GPT_LINE_ITEMS: true,
            RETURN_PRICE: true
        }
    },
    'dfp-manual': {
        TEST: false,
        DEBUG: false,

        FEATURES: {
            GPT_LINE_ITEMS: true,
            RETURN_PRICE: true
        }
    },
    universal: {
        TEST: false,
        DEBUG: false,

        FEATURES: {
            GPT_LINE_ITEMS: true,
            RETURN_CREATIVE: true,
            RETURN_PRICE: true
        }
    },
    'post-bid': {
        TEST: false,
        DEBUG: false,

        FEATURES: {
            RETURN_PRICE: true,
            INTERNAL_RENDER: true
        }
    }
};

const adapterFileTransforms = {
    bidder: {
        fileNameRegex: /^.+-htb\.js$/,
        transform: (contents) => {
            return ``
                + `window.adapter = window.adapter || {};\n`
                + `window.adapter.bidder = function (require, module, exports) {\n`
                + `${contents}`
                + `};\n`;
        }
    },
    validator: {
        fileNameRegex: /^.+-htb-validator\.js$/,
        transform: (contents) => {
            return ``
                + `window.adapter = window.adapter || {};\n`
                + `window.adapter.validator = function (require, module, exports) {\n`
                + `${contents}`
                + `};\n`;
        }
    },
    exports: {
        fileNameRegex: /^.+-htb-exports\.js$/,
        transform: (contents) => {
            const lines = contents.toString()
                .split('\n')
                .map((line) => {
                    return line
                        .trimRight()
                        .replace(/'/g, '\\\'');
                });

            const jsStringRepresentation = lines.map((line) => {
                return `+ '${line}\\n'`;
            })
                .join('\n');

            return ``
                + `window.adapter = window.adapter || {};\n`
                + `window.adapter.exports = ''\n`
                + `${jsStringRepresentation};`;
        }
    },
    'system-tests': {
        fileNameRegex: /^.+-htb-system-tests\.js$/,
        transform: (contents) => {
            return ``
                + `window.adapter = window.adapter || {};\n`
                + `window.adapter.systemTests = function (require, module, exports) {\n`
                + `${contents}`
                + `};\n`;
        }
    }
};

function generateAdapterFile(productMode, fileType) {
    return new Promise((resolve, reject) => {
        const regex = adapterFileTransforms[fileType].fileNameRegex;
        let found = false;

        for (const fileName of fileNames) {
            if (!regex.test(fileName)) {
                continue;
            }

            found = true;

            Fs.readFile(Path.join(dir, fileName), 'utf8', (err, rawContents) => {
                if (err) {
                    reject(err);
                }

                const metaScriptedContents = MetaScript
                    .transform(rawContents, productScopes[productMode]);

                const wrappedContents = adapterFileTransforms[fileType]
                    .transform(metaScriptedContents);

                resolve(wrappedContents);
            });
        }

        if (found === false) {
            console.log(`${fileType} file is missing and is required`);
        }
    });
}

Router.get('/adapter/:productMode/:fileType.js', (req, res) => {
    const productMode = req.params.productMode;
    const fileType = req.params.fileType;

    if (!productScopes.hasOwnProperty(productMode)) {
        res.status(404);
        res.send(`Product mode "${productMode}" not recognized.`);

        return;
    }

    if (!adapterFileTransforms.hasOwnProperty(fileType)) {
        res.status(404);
        res.send(`File type "${fileType}" not recognized.`);

        return;
    }

    generateAdapterFile(productMode, fileType)
        .then((metaScriptedContents) => {
            res.set('Content-Type', 'application/javascript');
            res.send(metaScriptedContents);
        })
        .catch((err) => {
            res.status(500);
            res.send(err);
        });
});

// =============================================================================
// EXPORTS /////////////////////////////////////////////////////////////////////
// =============================================================================

module.exports = Router;
