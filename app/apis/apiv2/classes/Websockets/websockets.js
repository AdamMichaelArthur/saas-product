// Created Jul 22 2022 by Adam Arthur

/*	Initializes an Express App Server and listens on the port specified environment variable.

*/


import "module-alias/register.js";
import 'dotenv/config'
import DatabaseConnection from '../Database/Mongo/mongo.js'
import { MongoClient, ObjectId } from 'mongodb';

import express from "express";
import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const app = express();
const server = new HTTPServer(app);
const io = new SocketIOServer(server);

export default class Websockets {

  bDatabaseConnected = false;

  events = [];

  constructor(){
    this.app = new express();
    this.server = new HTTPServer(this.app)
    this.socket = new SocketIOServer(this.server)

    const classPrototype = Websockets.prototype;
    const methodNames = Object.getOwnPropertyNames(classPrototype).filter(
        (prop) => typeof classPrototype[prop] === 'function' && prop !== 'constructor'
    );

    for(var method of methodNames){
      if(method[0] == '_'){
        this.events.push(method);
      }
    }
  }

  startServer(){
    this.connectToDatabase();
  }

  stopServer(){

  }

  // Connects to the database, and if successful, sets a "db" object.  Makes sure to start
  // listening only after a database connection is established.
  connectToDatabase(){
    this.database = new DatabaseConnection( (db)=> 
      { 
        this.bDatabaseConnected = true;
        this.db = db;
        this.server.listen(process.env.WEBSOCKET_2);
        this.handleConnection();
        console.log(`Websockets Listening on port ${process.env.WEBSOCKET_2}`);
      } );
    return;
  }

  handleConnection(){
    this.socket.on('connection', (socket) => {
      console.log("Client Connected")
      this.listenForEvents(socket);
      this.handleDisconnection(socket);
    });
  }

  listenForEvents(socket){
    for(var event of this.events){
      let eventListenCmd = `socket.on('${event.slice(1)}', (data) => { if(this.check("data")) { this.${event}(data, socket.id); }; } )`
      // Yes, I've heard all the security stuff about eval.  I like eval.  So go away.  You wanna write all this code manually go be my guest.
      eval(eventListenCmd);
      
    }
  }

  check(data){
    // Implement some type checking in the future.
    // Every command & data will be sent here first.  Can use for authorization, type checking, etc. etc.
    
    return true;
  }

  /* We invent a convention: if function names begin with "_" -- we're listening for an event of the same name, but without the _.  */
  /* As a security note -- this code should be considered highly unsecure.  For proof of concept, demo purposes only.  */
  /*
  async _update_document_location(data){


    let collection = this.db.collection(data['collection']);
    delete data['collection'];

    let query = {
      _id: new ObjectId(data._id)
    }

    let update = {
      $set: { "GPS": data['GPS'] }
    }

    try {
      let result = await collection.updateOne(query, update);
    } catch(err){
      console.log(101, "Problem with database", err);
    }
  }
  */

  openChangeStreams = [];

  closeConnectionChangeStreams(socketId, request =null){
      this.openChangeStreams.forEach(element => {
          if (element.socketId === socketId) {
              let changeStreamHandle = element.changeStreamHandle;
              if(request == null){
                changeStreamHandle.close();
              } else {
                if(request === element.request){
                  changeStreamHandle.close();
                }
              }
          }
      });
  }

  handleDisconnection(socket){
    socket.on('disconnect', () => {
      console.log(212, "client disconnected, closing change streams for", socket.id);
      this.closeConnectionChangeStreams(socket.id);
    });
  }

}

(() => {
    try {
        const server = new Websockets();
        server.startServer()
    } catch (error) {
        console.error(error);
    }
})();
