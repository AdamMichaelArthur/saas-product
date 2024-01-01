import { MongoClient } from "mongodb";

global.isDatabaseConnected = false;

export default class DatabaseConnection {

	database = 'mongodb';
	username = process.env.DB_USERNAME
	password = process.env.DB_PASSWORD
	port = process.env.DB_PORT;
	domain = process.env.DB_DOMAIN;
	dbname = process.env.DB_NAME;
	authDB = process.env.DB_AUTHDB;
	replicaSet = process.env.DB_REPLICASET
	authSource = process.env.authSource
	socketTimeout = process.env.socketTimeoutMS
	connectionTimeout = process.env.connectTimeoutMS
	directConnection = process.env.directConnection
	callback = null;
	

	constructor(callback, altCallback =() => { }){
		if(global.isDatabaseConnected == false){
			this.callback = callback;
			this.connection_uri = 'mongodb://'+this.username+':'+ this.password+'@'+ this.domain+':'+ this.port+'/'+ this.dbname + '?authSource=admin' + '&socketTimeoutMS=' + 
			this.socketTimeout + '&connectTimeoutMS=' + this.connectionTimeout + 'replicaSet=rs0' + '&directConnection=' + this.directConnection + '&appName=google-maps-crm';
			console.log(this.connection_uri);
			this.client = new MongoClient(this.connection_uri, { useNewUrlParser: true, useUnifiedTopology: true });
			this.websocketCallback = altCallback
			this.connect();
			// Set up event listeners

		} else {
			this.callback = callback;
			this.connection_uri = global.databaseConnection.connection_uri;
			this.socketTimeout = global.databaseConnection.socketTimeout;
			this.client = global.databaseConnection.client;
			this.activeConnection = global.databaseConnection.activeConnection;
			this.db = global.databaseConnection.db;
			this.bDatabaseReady = true;
			//this.callback.connected();
		}
	}



	async connect() {
		try {
		    this.activeConnection = await this.client.connect();
		    this.db = this.activeConnection.db();
		    this.callback.connected();
		    console.log("Connected successfully to MongoDB");
		    global.isDatabaseConnected = true;
		    global.databaseConnection = this;
		    this.websocketCallback(this.db);
		    this.eventDisconnected();
            //this.eventReconnected();
            //this.eventConnectionReady();
		} catch (error) {
		    this.handleException(error);
		}
	}

	handleException(error) {
    	console.error("An exception occurred:", error);
  	}

	// Handle Database Events

	eventConnectionReady() {
		console.log("Setting up connection ready event");
        this.client.on("connectionReady", () => {
            console.warn("MongoDB connection ready");
        });

        this.activeConnection.on("connectionReadt", () => {
            console.warn("MongoDB connection ready");
        });
    }

	eventDisconnected() {
		console.log("Setting up disconnect event");
        this.client.on("connectionClosed", () => {
            console.warn("a MongoDB connection closed, attempting to reconnect");
            // Implement reconnection logic here
            this.reconnect();
        });

    }

    eventReconnected() {
        this.activeConnection.on("reconnect", () => {
            console.log("MongoDB reconnected");
            // Handle reconnection event
        });
    }

    async reconnect() {
        const maxAttempts = 5;
        let attempts = 0;
        const delay = 10000; // Delay in milliseconds

        while (attempts < maxAttempts) {
            try {
                await this.client.connect();
                console.log("Reconnected to MongoDB");
                this.db = this.client.db();
                // Notify successful reconnection
                break;
            } catch (error) {
                attempts++;
                console.error(`Reconnection attempt ${attempts} failed:`, error);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        if (attempts === maxAttempts) {
            console.error("Failed to reconnect to MongoDB after maximum attempts");
            // Handle failed reconnection scenario
        }
    }

	// Timeout event
	async eventTimeout(){

	}

	// A document was inserted
	async insertEvent(){

	}

	// A document was updated
	async updateEvent(){
		// Change the 'updatedAt' and 'updatedBy' field
	}

	// A document was deleted
	async deleteEvent(){

	}

	// An index was created
	async indexEvent(){

	}

	// Some enterprise organizations require advanced tracking of who accesses and manipulates data, and when.and
	


	
}
