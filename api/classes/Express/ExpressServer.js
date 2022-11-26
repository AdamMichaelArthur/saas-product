// Created Jul 22 2022 by Adam Arthur

/*	Initializes an Express App Server and listens on the port specified environment variable.

*/
import Base from '../Base/base.js'
import express from 'express';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import Errors from '../Errors/errors.js'
//import DatabaseConnection from '../Database/connection.js'
import Response from '../Response/response.js';

export default class ExpressServer extends Base {

    app = express();


    constructor(port, timeout, JSON_BODY_POST_SIZE_LIMIT, TEXT_BODY_POST_SIZE_LIMIT) {
        super();
        this.port = port;
        this.timeout = 0; //Number(timeout);
        this.JSON_BODY_POST_SIZE_LIMIT = JSON_BODY_POST_SIZE_LIMIT;
        this.TEXT_BODY_POST_SIZE_LIMIT = TEXT_BODY_POST_SIZE_LIMIT
        this.app.set("port", this.port);
        this.router = express.Router();
        this.base_url = process.env.BASE_URL;
        this.unhandledException();
    }

    async startServer() {
        this.server = http.createServer(this.app);
        this.server.listen(this.port);
        this.server.timeout = this.timeout;

        console.log(`Server Listening on port ${this.port}`);

        this.app.use((req, res, next) => {
            bodyParser.json()(req, res, err => {
                if (err) {
                    this.errors.req = req;
                    this.errors.res = res;
                    return this.errors.error("invalid_json");
                }
                next();
            });
        });

        console.log(72, this.TEXT_BODY_POST_SIZE_LIMIT);

        this.app.use(bodyParser.text({
            limit: '50mb'
        }));

        this.app.use(bodyParser.raw( {
            limit: '50mb'
        }));

        this.app.use(cookieParser());

        //this.database = new DatabaseConnection();

        // try {
        //     await this.database.connect();
        // } catch (err) {
        //     console.log(err);
        //     process.exit(1);
        // }

        this.app.use("/", (req, res, next) => {
            this.errors.req = req;
            this.errors.res = res;

            // First step in making this object available to every class instance
            res.locals.amz = this.amazonSPAPI;

            // Check for supported content-types
            const content_type = req.get('Content-Type');

            const requestType = req.method;

            if (requestType == "GET") {
                return next();
            }

            // For now, we only support application/json
            console.log(110, content_type);

            if ((content_type != "application/json")&&(content_type != "text/plain")) {
                return this.errors.error("unsupported-content-type");
            }

            console.log(103)
            return next();
        });

        this.app.use("/authorize", (req, res, next) => {
            return this.authorize(req, res);
        });

        /* Authorization code goes here */
        this.app.use("/", (req, res, next) => {


            // Check if this is a "public" route.  If so, we allow the request to proceed without loading any User Specific Resources
            const path = this._getFirstPath(req.originalUrl);
            console.log(118, path);
            if ((path == 'public') || (path == 'authorize')) {
                this.user_id = null;
                return next();
            }

            // Check the users authorization status
            if (!this.authorizeUser(req, res)) {
                return this.errors.error("unauthorized");
            } else {
                //this.user_id = this.authorize.user_id;
                res.locals.user_id = this.user_id;
            }

            // If we get here, the request passed one of our authentication mechanisms

            // This puts every endpoint inside of a try / catch block, enabling us to "throw" and error anytime we want
            try {
                console.log(134, "trying next");
                next();
            } catch (err) {
                return this.errors._error(res, "unhandled_exception", err);
            }

            // if(!res.writableEnded){
            // 	res.status(200);
            // 	var response = new Response();
            // 	response.successResponse["Warning"] = "No error was thrown, but the endpoint didn't return any data to the client.  If this is intentional, then you can ignore this warning.  If not, go back and check your implementation of the endpoint";
            // 	res.json(response.successResponse);
            // }

        });

        await this.loadClasses();

        this.app.use("/", (req, res, next) => {
            this.req = res;
            this.res = res;
            this.next = next;
            this.response.req = req;
            this.response.res = res;

            this.next();
        });

        this.app.use("/", () => {
            return this.errors.error("invalid_route");
        });

        // Finally, we check and make sure data was sent to the client.
        // This will only happen if an endpoint doesn't return anything.
        this.app.use("/", (req, res) => {
            console.log(160, "Here");
            res.status(500);
            res.json({
                "Working": true
            })
        })
    }

    /*  This code allows us to throw an exception from the errors class anywhere inside an endpoint, without necessarily having to use try / catch blocks every
    	single time.
    */
    unhandledException() {
        process.on('uncaughtException', function(err) {
            if (typeof err.Errors !== 'undefined') {
                return err.Errors._error(err.err);
            }
            console.error('An uncaught error occurred!');
            console.error(err.stack);
        });
    }

    async loadClasses() {

    }

    _getFirstPath(fullUrl) {
        var path = fullUrl;

        if (path[0] == '/') {
            path = this.voca.splice(path, 0, 1);
        }

        var firstForwardSlash = this.voca.indexOf(path, `/`, 0);
        var firstPath = this.voca.substring(path, 0, firstForwardSlash);

        return firstPath
    }
}