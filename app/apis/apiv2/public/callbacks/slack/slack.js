import { Base, ResponseError } from '@base'
import axios from 'axios';
import { MongoClient, ObjectId } from 'mongodb';
import qs from 'qs';
import dayjs from 'dayjs';

export default class Slack extends Base {

	required_scopes = ['incoming-webhook','commands','chat:write','channels:history','groups:history','im:history','mpim:history','incoming-webhook'];

  constructor(){
    super();
  }

  async authorized(state ='', code =''){

  	console.log(17, state, code);

  	this.response.reply("ok");
    
  	let data = qs.stringify({
		  'code': code,
		  'redirect_uri': 'https://easy-oauth.saas-product.com/api/public/callbacks/slack/authorized',
		  'client_id': process.env.SLACK_APP_CLIENT_ID,
		  'client_secret': process.env.SLACK_APP_CLIENT_SECRET
	  });

	let config = {
	  method: 'post',
	  maxBodyLength: Infinity,
	  url: 'https://slack.com/api/oauth.v2.access',
	  headers: { 
	    'Content-Type': 'application/x-www-form-urlencoded'
	  },
	  data : data
	};

	console.log(41, config);

	try {
		var response = await axios.request(config);
	} catch(err){
		this.response.reply("Not bueno");
		//return true;
	}

	if(response.data["ok"] === true){
		console.log(51, "We've got a working code.");
		let slackAuths = this.database.db.collection("slack_auths");
		await slackAuths.updateOne( { "_id": new ObjectId(state) }, { $set: { token: response.data} } );
	} else {
		this.response.reply("No bueno");
		//return true;		
	}

	this.res.redirect('https://easy-oauth.saas-product.com/assets/statichtml/success.html');
    
  }

  async event(){
  	console.log(this.body);
  	if(this.body['type'] == 'url_verification'){
  		this.response.reply( { challenge: this.body.challenge } )
  		return;
  	}
  	
  	let slackIntegrationCollection = this.database.db.collection("slack_events");
	let insertResult = await slackIntegrationCollection.insertOne( this.body );

  }

  async getAuthorizationUrl(state ="", successRedirect ="", errorRedirect =""){

    let collection = this.database.db.collection("slack_auths");
    let result = await collection.insertOne( { "state": state, "successRedirect": successRedirect, "errorRedirect": errorRedirect } );
    let insertedId = result["insertedId"];

    let authorizeUrl = `https://slack.com/oauth/v2/authorize?state=${insertedId}&redirect_uri=https://easy-oauth.saas-product.com/api/public/callbacks/slack/authorized&scope=${this.required_scopes.toString()}&client_id=${process.env.SLACK_APP_CLIENT_ID}`;
  	this.response.reply( { "redirect_uri": authorizeUrl, "retrievalKey": insertedId });
  }
  
  async retrieveToken(){
    let collection = this.database.db.collection("slack_auths");
    let result = await collection.findOne( { _id: new ObjectId(this.body.retrievalKey) } );
    this.response.reply( result );       
  }

}