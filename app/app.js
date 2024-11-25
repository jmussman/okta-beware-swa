// app.js
// Copyright © 2024 Joel A Mussman. All rights reserved.
//

import { config as dotenvConfig } from 'dotenv'
import path from 'path'

import homeController, { shutdown as homeControllerShutdown } from './controllers/homeController.js'

const launch = () => {

    // Inject the base, client id, client secret, and applicaiton port into the controller.

    dotenvConfig()

    // Is this running in a codespace? Print the URL to the application on the console.

    if (process.env.CODESPACE_NAME) {

        console.log(`Application is running at https://${process.env.CODESPACE_NAME}-${process.env.APPLICATION_PORT}.app.github.dev (use cmd-click or ctrl-click to open)`)
    }

    homeController(process.env.APPLICATION_PORT)
}

const shutdown = () => {

    // Shutdown the homecontroller request loop.

    homeControllerShutdown()
}

if (path.basename(process.argv[1]) === 'app.js') {

    process.chdir(path.dirname(import.meta.filename))

    // The application was invoked from the command line

    launch()
}

export { launch, shutdown }