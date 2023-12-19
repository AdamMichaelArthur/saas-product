// Created Jul 22 2022 by Adam Arthur

/*	Initializes an Express App Server and listens on the port specified environment variable.

  ## Relevant Environment Variables
  WEBSOCKET_2: the port the server listen on
  SOCKET_IO_PATH: the path the server listens on.

  ## How this works on the server
  This file is run independently of the main project.  (Although it doesn't necessarily need to be that way)
  It is managed by PM2, and served behind a reverse proxy on nginx.  The SOCKET_IO_PATH is important because
  this is what allows us to connect to the server without referencing its underlying port.  So instead of 
  using a URI http://www.example.com:52179, we can instead use https://www.example.com/socket.io/ when connecting
  with our clients.

  ## How It Works
  - It establishes a connection to the database
  - It looks at the function names in this file.  If it begins with an underscore, "_",  an event listener for the same of that
    function is automatically created.  So if we define a function `async _update_document_location(data)`, it will automatically
    register for an event called 'update_document_location'
  - On the client side, you'll 'call' this function by `socket.emit("update_document_location", data)`, which will be automatically
    routed to the function you called
  
  ## Using MongoDB Change Stream for Event Notifications
  - One of the main purposes of using websockets is to get notified of events as they happen, without having to implement polling.
  - Using MongoDB change streams is an extremely effective way to syncronize various events and dispatch them via websockets to
    clients.

    The basic strategy works like this:

    1. Define a function to "request" or "listen" for events that will happen on a particular collection
       ex. async _request_restaurant_orders(data =null, socketId =null)

       You'll want to plan on passing some kind of filter or identify information.  I use ObjectId's a lot
       for this purposes.  In my example, I only want to get orders for a particular restaurant, so I pass
       that restaurants _id as a filter.

       Example
       -------
      let restaurant_id = data['restaurant_id'];      
      let collection = this.db.collection('orders');
      let operationTypes = ['insert', 'update'];

      let query = { $exists: true }
      var changeStreamQuery = [
        { $match: { 
            operationType: { $in: operationTypes },
            "fullDocument.restaurant_id": new ObjectId(restaurant_id)
          } 
        }
      ];

       This sets up our change stream query.  We'll get notifications of any insert or update, and only for documents
       whose restaurant_id matches the _id we sent in our request.

    2. Handle change events when they happen

      The function gets the socketId of the connected client, which makes it very straightforward to send data back
      to the specific client that requested the data.

      let changeStreamHandle = collection.watch(changeStreamQuery)
      .on('change', async data => {
          // Do some processing here
          this.socket.to(socketId).emit('event_handler_on_client', some_important_data);
      });

    3. Add the changeStreamHandle to our array of handles, so we can cleanup when the client disconnects

    this.openChangeStreams.push ( { socketId: socketId, changeStreamHandle: changeStreamHandle, request: 'request_restaurant_orders' } );

    ## A Basic Workflow

    1. Define your event listener here, in websockets.js
    2. In your client, on initialization or another relevant time, request change stream updates by calling socket.emit("request_restaurant_orders", restaurant)
    3. In your client, implement socket.on("event") for the requested event

    ## Some notes
    In my code, I will often keep my listener function and my event notification label the same.  But this is not necessary.  So I might call my listeneer "request_restaurant_orders"
    and my socket.on("event") as receive_restaurant_orders, but its purely convention and there's nothing deeper than that.

    ## Some good examples:
    My iOS App Example Project "food-delivery-app" uses this extensively for realtime streams and is a good example.
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
    this.socket = new SocketIOServer(this.server, {path: process.env.SOCKET_IO_PATH})

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
