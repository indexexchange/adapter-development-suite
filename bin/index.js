/* eslint-disable no-magic-numbers, no-console, no-process-exit */

// =============================================================================
// IMPORTS /////////////////////////////////////////////////////////////////////
// =============================================================================

const debug = require('debug')('app:server');

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

if (typeof process.argv[2] === 'undefined') {
    console.log('Partner name is not provided, using files in the current folder');
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
