/* Watches the chat collection for changes */
import 'dotenv/config'
global.version = process.env.VERSION;
import fs from 'fs';
import path from 'path'
import Voca from 'voca'
import axios from 'axios';
/* Handle Public Routes */
import Base from '../Base/base.js'
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Errors from '../Errors/errors.js'
import DatabaseConnection from '../Database/Mongo/mongo.js'
import Response from '../Response/response.js';
import dayjs from 'dayjs';
import { DateTime } from "luxon";
import { MongoClient, ObjectId } from 'mongodb';


export default class ChatWatcher {

  constructor() {

  }

  startWatching() {

  	if(process.env.disable_chat_watcher == "true"){
  		return;
  	}

  	console.log("Chat Service Started");

  	let chat = global.db.collection("chats");

  	// This sends a chat message from the client to slack
	chat.watch( [ { $match: { 'fullDocument.source': { $ne: 'server' }, operationType: 'insert' } } ] )
		.on('change', async data => {
			if(data.operationType == 'insert'){

				// First, we need to search if a ts exists 
				let thread = await chat.findOne( { 
					"created_by": data.fullDocument.created_by,
  					"ts": { $exists: true }
				} )

				var ts = null;
				if(thread === null){
					// This is the parent message
				} else {

					ts = thread.ts;
				}

			  	// This now needs to be forwarded to slack.  
			  	this.notifySlack(data.fullDocument, ts)

			  }
	})

	// This responds to a slack notification event, which will allow us to properly route the message.
	let slack = global.db.collection("slack_events");
	slack.watch().on('change', async data => {
		if(data.operationType == 'insert'){

				let chat = global.db.collection("chats");

				let query = {  "ts": data.fullDocument.event.thread_ts, "chatMessage": { $ne: data.fullDocument.event.text } }
				
				console.log(84, data.fullDocument['event'], 'chats');

				let dupCheck = await chat.findOne({ 'message.ts': data.fullDocument['event']['ts'] } );

				if(dupCheck !== null){
					console.log("We've got a duplicate");
					return;
				} else {
					console.log("Not a duplicate");
				}

				var thread = await chat.findOne( query );

				var ts = null;
				if(thread === null){
					// This is the parent message or a duplicate
				} else {
					//console.log(53, "This is a threaded message", thread.ts);
					ts = thread.ts;

					let chatDocument = { 	
							channel: '#support', 
			  				created_by: thread.created_by, 
			  				chatMessage: data.fullDocument.event.text, 
			  				modified_by: thread.modified_by, 
			  				owner: thread.owner, 
			  				selected: false,
			  				source: 'server',
			  				... data.fullDocument
			  			}

			  		chat.insertOne( chatDocument )
				}

		}
	})
  }

  async notifySlack(fullDocument, ts =null){

  	console.log(112, "notifySlack called");
  	// When the user links the primary administration account with slack, we expect, by convention
  	// that this is the intended support channel.
  	// Inside the target slack channel, a member of the channel must /invite @Content Bounty in order 
  	// for the bot to be able to send and receive messages to that channel.

  	let usersCollection = global.db.collection("users");
    let slackToken = await usersCollection.findOne( { "role":"administrator", "slack.token.incoming_webhook.channel": { $exists: true } }, { "projection": { "slack.token" : 1 } } );

		// Handle error condition
    console.log(slackToken);

    if(slackToken === null){
			return;
    }

  	let channel = slackToken.slack.token.incoming_webhook.channel_id;
  	let auth = slackToken.slack.token.access_token;

  	let payload = {
	    "channel":channel,
	    "text":fullDocument.chatMessage
  	}

  	console.log(119, payload);

  	if(ts !== null){
  		payload['thread_ts'] = ts;
  	}

  	let chat = global.db.collection("chats");

	let config = {
	  method: 'post',
	  url: 'https://slack.com/api/chat.postMessage',
	  headers: { 
	    'Authorization': `Bearer ${auth}`, 
	    'Content-Type': 'application/json'
	  },
	  data: JSON.stringify(payload)
	};


	try {
  		var data = await axios.request(config);
  	} catch(err){
  		console.log(76, err);
  	}

  	console.log(149, data.data);
  	let query = { _id: fullDocument._id }
  	let update = { $set: { ... data.data } }

  	try {
  		var updateResult = await chat.updateOne(query, update);
  	} catch(err){
  		console.log(98, err);
  	}

  	console.log(78, updateResult, data.data);

  }

}

var chatWatcher = new ChatWatcher();
setTimeout( () => {
	chatWatcher.startWatching();
}, 5000)
