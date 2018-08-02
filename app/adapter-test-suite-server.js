/* eslint-disable no-sync, global-require */

// =============================================================================
// IMPORTS /////////////////////////////////////////////////////////////////////
// =============================================================================

const Fs = require('fs');
const Http = require('http');
const Https = require('https');
const Path = require('path');

const Express = require('express');

// =============================================================================
// CONSTANTS ///////////////////////////////////////////////////////////////////
// =============================================================================

const SECURE_KEY_PATH = './ssl/localhost.key';
const SECURE_CERT_PATH = './ssl/localhost.crt';

// =============================================================================
// MAIN ////////////////////////////////////////////////////////////////////////
// =============================================================================

function loadRoutes(app, location) {
    const fileNames = Fs.readdirSync(location);

    for (const fileName of fileNames) {
        const router = require(Path.join(location, fileName));

        app.use(router);
    }
}

function AdapterTestSuiteServer(port, secure = false) {
    // Setup the Express Application.
    const app = Express();

    // Statically serve the contents of `./public` under '/public'. Dotfiles are
    // ignored by default so the ESLint files will not be served up.
    app.use('/public', Express.static(Path.join(__dirname, 'public')));

    // Load all the Express Routers from the `./routes` directory and add it
    // to the current Express Application.
    loadRoutes(app, Path.join(__dirname, 'routes'));

    // Select the correct server library based on whether the server should
    // be secure or not.
    let server = null;

    if (secure) {
        const serverOptions = {
            key: Fs.readFileSync(Path.join(__dirname, SECURE_KEY_PATH)),
            cert: Fs.readFileSync(Path.join(__dirname, SECURE_CERT_PATH))
        };

        server = Https.createServer(serverOptions, app);
    } else {
        server = Http.createServer(app);
    }

    // Bind the server to a port and have it start listening for requests.
    server.listen(port);

    return server;
}

// =============================================================================
// EXPORTS /////////////////////////////////////////////////////////////////////
// =============================================================================

module.exports = AdapterTestSuiteServer;
