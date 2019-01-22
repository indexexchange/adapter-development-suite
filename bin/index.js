/* eslint-disable no-sync, no-magic-numbers, no-console, no-process-exit */

// =============================================================================
// IMPORTS /////////////////////////////////////////////////////////////////////
// =============================================================================

const debug = require('debug')('app:server');
const Fs = require('fs');
const AdapterTestSuiteServer = require('../app/adapter-test-suite-server');

// =============================================================================
// CONSTANTS ///////////////////////////////////////////////////////////////////
// =============================================================================

const DEFAULT_SERVER_PORT = 5837;
const DEFAULT_SECURE_SERVER_PORT = 5838;

// =============================================================================
// MAIN ////////////////////////////////////////////////////////////////////////
// =============================================================================

function onErrorHandler(port) {
    return (err) => {
        if (err.syscall !== 'listen') {
            throw err;
        }

        const bind = typeof port === 'string'
            ? `pipe ${port}`
            : `port ${port}`;

        switch (err.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);

                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);

                break;
            default:
                throw err;
        }
    };
}

function onListeningHandler(addr, port) {
    return () => {
        const bind = typeof port === 'string'
            ? `pipe ${port}`
            : `port ${port}`;

        debug(`Listening on ${bind}`);
    };
}

const cwd = process.env.INIT_CWD;
const repoNameLength = 'ht-wrapper-adapters'.length;

if (typeof process.argv[2] === 'string') {
    const partnerFolder = process.argv[2];
    const htWrapperAdaptersDir = cwd.substring(
        0,
        cwd.lastIndexOf('ht-wrapper-adapters') + repoNameLength
    );
    const folders = Fs.readdirSync(htWrapperAdaptersDir);

    let found = false;
    for (const folderName of folders) {
        if (folderName === partnerFolder) {
            found = true;

            break;
        }
    }

    if (!found) {
        console.log(`Adapter folder "${partnerFolder}" was not found, please make sure the adapter folder name provided is correct`);
        process.exit(0);
    }
}

if (typeof process.argv[2] === 'undefined') {
    if (cwd.length - cwd.lastIndexOf('ht-wrapper-adapters') === repoNameLength
        || cwd.length - cwd.lastIndexOf('node_modules') === 'node_modules'.length) {
        console.log(`The tool should be run under an adapter's folder if adapter folder name is not provided`);
        process.exit(0);
    }
    console.log('Adapter name is not provided');
}

const serverPort = DEFAULT_SERVER_PORT;
const server = AdapterTestSuiteServer(serverPort, false);
server.on('listening', onListeningHandler(server.address(), serverPort));
server.on('error', onErrorHandler(serverPort));

const secureServerPort = DEFAULT_SECURE_SERVER_PORT;
const secureServer = AdapterTestSuiteServer(secureServerPort, true);
secureServer.on('listening', onListeningHandler(secureServer.address(), secureServerPort));
secureServer.on('error', onErrorHandler(secureServerPort));

console.log(`
Server started...

Before you begin, go to https://localhost:${secureServerPort} and accept the
self-signed certificate.

To start debugging, go to:

    http://localhost:${serverPort}/public/debugger/adapter-debugger.html

To run the system tests, go to either:

    HTTP:  http://localhost:${serverPort}/public/tester/system-tester.html
    HTTPS: https://localhost:${secureServerPort}/public/tester/system-tester.html

Press ctrl+c at any time to exit debugging.
`);
