/*		google.js
 *
 *		The purpose of this file is to implement a callback for Amazon's SP-API
 *		oAuth Authentication Scheme
*/

import Callbacks from './callbacks.js'

import googleAuth from "google-auth-library";

export default class GoogleCallback extends Callbacks {

	class = 'google';

	exampleData = {
		"Working":true
	}

	scope = "https://mail.google.com/";

	credentials = {
	    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
	    project_id: process.env.GOOGLE_PROJECT_ID,
	    auth_uri: "https://accounts.google.com/o/oauth2/auth",
	    token_uri: "https://oauth2.googleapis.com/token",
	    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
	    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	    redirect_uris: [process.env.GOOGLE_REDIRECT]
	};

	constructor(initializers =null){
		super(initializers, "/public/callbacks/google");
		console.log("Google Should Be Initialized");
	}

	async getAuthorizationUrl(){

		const hasRequiredParameters = this.requiredParams(["user_id"], []);
		if(!hasRequiredParameters){
			return;
		}

		const oauth2Client = new googleAuth.OAuth2Client(
		    this.credentials.client_id,
		    this.credentials.client_secret,
		    this.credentials.redirect_uris[0]
		  );

		const authUrl = await oauth2Client.generateAuthUrl({
		    access_type: "offline",
		    scope: ['https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive'],
		    prompt: "consent",
		    state: this.body.user_id
		});

		this.res.redirect(authUrl);

		//this.response.reply(authUrl);
	}

	async navigateToDashboard(){
		const hasRequiredParameters = this.requiredParams(["user_id"], []);
		if(!hasRequiredParameters){
			return;
		}

		var sheetId = await this.database.tables.googleSheets.findByUserId(this.body.user_id);
		var url = `https://docs.google.com/spreadsheets/d/${sheetId[0].sheet_id}`;
		this.res.redirect(url);
	}

	async manualInsertion(){
		
		var token = {
		 "access_token": "ya29.a0AVA9y1ts0ZIj30l2nvhDNNnZdWQiaItofR2IMurcVR1ZO5M09j8zaJ39Kles-kXhHgxtdQJEpiGphE6bDcmeIsMo_v0gHsnvzaglOZOJOYhV-LClkkwlbVu20H6ay7SkNMPY--s8L4i58_X6HHpKXD3X4RWMaCgYKATASARASFQE65dr8TnyI8rllQKjkyGZoOII9Vg0163",
        "refresh_token": "1//096UtdKhaFI0cCgYIARAAGAkSNwF-L9IrPelyjt-cQZsiDE9Lm2H2OuDZSIDmBvqYy2de7ye3osEYDwCMC7kAmaYs3LnN1uHaSSo",
        "scope": "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets",
        "token_type": "Bearer",
        "expiry_date": 1662909760813,
    	}
        
	try {
		  var res = await this.database.tables.googleTokens.createToken("b348e714-896f-4fd0-a8f4-62967d24239d", token);
		} catch(err){
			return this.response.reply(err);
			//return this.errors.error("database", "Unable to save Google Token");
		}

		this.response.reply(res);
	}

	async authorized(){

		const hasRequiredParameters = this.requiredParams(["state","code","scope"], []);
		if(!hasRequiredParameters){
			return;
		}

		// Now that we have the code, we can exchange it for a refresh token...

	      var user = this.body.state;
		  var code = this.body.code;

		  // code is a single use token that is used to retrieve our access token
		  const oauth2Client = new googleAuth.OAuth2Client(
		    this.credentials.client_id,
		    this.credentials.client_secret,
		    this.credentials.redirect_uris[0]
		  );

		  try {
		    var tokens = await oauth2Client.getToken(code);
		  } catch (err) {
		    this.error.errors("Unable to exchange Google Code for Refresh Token");
		    return;
		  }

		  var token = tokens.tokens;

    	try {
		  await this.database.tables.googleTokens.createToken(user, token);
		} catch(err){
			return this.errors.error("database", "Unable to save Google Token");
		}

		setTimeout( () => {
			this.googleDrive.createDashboardSpreadsheet(user);
		}, 1500);

		

		this.res.redirect('https://dev.datarova.com/settings');

	}

}