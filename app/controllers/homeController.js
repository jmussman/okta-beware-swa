// homeController.js
// Copyright © 2024 Joel A Mussman. All rights reserved.
//

import express from 'express'
import cache from 'express-cache-ctrl'
import session from 'express-session';
import path from 'path'

import userCredentials from '../config/userCredentials.js'

let appServer = null

const homeController = (applicationPort, codespaceName) => {

    const app = express()
    const iconPath = path.join(import.meta.dirname, '../public/assets/images/favicon.ico')
    console.log(iconPath)

    // Support URL encoded body.

    app.use(express.urlencoded({ extended: true }))

    // Set the view compilation engine to EJS.

    app.set('views', path.join(import.meta.dirname, '../views'))
    app.set('view engine', 'ejs')

    // Establish the session.

    app.use(session({
        secret: 'pyratesFavoriteLetterIsC',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    }));    

    // Anything out of /assets is static.

    app.use('/assets', express.static('./public/assets'))
    
    // Handle the favorite icon.

    app.use('/favicon.ico', cache.disable(), (request, response, next) => {

        response.sendFile(iconPath)
    })

    // Public landing page.

    app.get([ '/', '/index', '/index.html' ], cache.disable(), (request, response, next) => {

        if (!request.session.user) {

            response.redirect('/login')
        
        } else {

            response.render('pages/index')
        }
    })

    // Login

    app.get('/login', cache.disable(), (request, response, next) => {

        response.render('pages/login', { username: '', error: undefined })
    })

    app.post('/login', cache.disable(), (request, response, next) => {

        if (!request.body.username || !request.body.password || userCredentials[request.body.username] != request.body.password) {
            
            response.render('pages/login', { username: request.body.username, error: 'Invalid username or password' })
        
        } else { 

            request.session.user = request.body.username
            console.log(`successful sign-on as ${request.session.user}`)
            response.redirect('/')
        }
    })

    // Logout

    app.get('/logout', (request, response, next) => {

        console.log(`successful sign-off as ${request.session.user}`)
        delete request.session.user
        response.redirect('/login')
    })

    appServer = app.listen(applicationPort)
    console.log(`Pyrates application is listening on port ${applicationPort}: visit http://localhost:${applicationPort} (use cmd-click or ctrl-click to open)`)

    // Is this running in a codespace? Print the URL to the application on the console.

    if (codespaceName) {

        console.log(`This application is listenting in a Codespace at https://${codespaceName}-${applicationPort}.app.github.dev (use cmd-click or ctrl-click to open)`)
    }
}

const shutdown = () => {

    // This performs a clean shutdown of the express router.

    appServer?.close()
}

export default homeController
export { shutdown }