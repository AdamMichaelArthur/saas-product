import { Base, ResponseError } from '@base'
import { google } from 'googleapis';
import { MongoClient, ObjectId } from 'mongodb';
import stripePrototype from 'stripe';
import dayjs from 'dayjs';

const stripe = stripePrototype(process.env.stripe_key);

export default class Stripe extends Base {

	constructor(){
		super();
	}

  /* Stripe provides a secret for every endpoint that is registered.  However, we have an internal authentication
  	 mechanism in place that involves the creation of authenticated endpoints 


  */

async test() {
    
    if (typeof this.api_key !== 'undefined') {
        
    } else {
        // In this case, we send a 200 back to the client, but we decline to actually do anything
        // We don't want to be inserting data into our database unless we are certain of its source
        return true;
    }    
    this.response.reply(this.body);
} 

/*  This is a public callback for Stripe Events.  The proper functioning of this method is critical: we rely on Stripe Events
    being successfully called to replenish accounts.  This endpoint serves one purpose: to receive the event and drop it into
    the database, while associating it with the account and user it's related to.  
*/
async event() {

    this.authenticated = false;
    this.response.reply("works");

    // For testing our callback, if an api_key is not provided as a URL parameter, we return a status 200 but
    // we don't do anything with the data, and we certainly don't drop it into our database.
    if (typeof this.api_key !== 'undefined') {
        // This allows us to perform actions that are normally restricted to protected routes
        this.authenticated = await this.loadCollectionClassesFromApiKey(this.api_key);
    } else {
        // In this case, we send a 200 back to the client, but we decline to actually do anything
        // We don't want to be inserting data into our database unless we are certain of its source
        return true;
    }

    // We drop down to use the mongo/node api directly, without the interference of the framework.

    // Get our db object
    const db = this.database.mongo.db;
    const collection = db.collection("accounts");

    // This is synonymous with the "customer_id" parameter seen in Stripe API Responses
    let stripe_id = "";

    // It's not universal that objectType is customer.  I'm not in love with how we're determining the stripe_id here
    // If this is failing a good place to start looking is at the stripe api responses and see if we're actually picking
    // up on the customer_id
    let objectType = this.body.data.object.object;

    // There is some inconsistency in where the customer id value is stored.  This adjusts for that inconsistency
    if (objectType === "customer") {
        stripe_id = this.body.data.object.id;
    } else {
        stripe_id = this.body.data.object.customer;
    }

    // By framework protocol, we expect every account to have a stripe_id.  As stated earlier, this might appear as "customer" or "customer_id"
    // in Stripe API responses, and typically starts with "cus"
    const query = { "stripe_id": stripe_id }

    // We use the stripe_id to figure out which account we're dealing with
    const account = await collection.findOne(query);

    // If we are unable to find an attached customer id, there are two possibilities: this is an event not associated with the platform, or there 
    // was a breakdown.  We assume the former.  We drop it into a collection for debugging, just in case it's the latter and we need to diagnose
    // what's going on.  The expected result is that Stripe Objects created with this instance get dropped into the stripe_events, and Stripe
    // Objects created outside this instance get thrown into unaffiliated_stripe_events.  This way, the user can use their Stripe account for
    // anything they want that has nothing to do with this instance, and those events won't pollute our dataset.
    if(account == null){
        delete this.body.api_key;
        this.database.mongo.collection = "unaffiliated_stripe_events";
        this.database.mongo.insertOne(this.body);
         return true;
    }

    let user;
    const usersColl = db.collection("users");

    // When a user registers, they create an account at the same time.  The first document that has the role administrator is defined at the primary
    // account, and we associate all stripe events with this account/user pair
    user = await usersColl.findOne({
        "accountId": account._id,
        "role": "administrator"
    });

    // If we are unable to get a user at this stage, something horrible has gone wrong.  There's probably a bug or error in the code
    // We drop the event into unaffiliated_stripe_events for possible debugging.
    if(user == null){
        delete this.body.api_key;
        console.log(2, "Should insert into unaff", this.body);
        this.database.mongo.collection = "unaffiliated_stripe_events";
        this.database.mongo.insertOne(this.body);
        return true;
    }

    // Merge everything together in prep for document storage
    // This causes the ownership of the Stripe Event to be the user and account of the primary administrator
    var doc = {
        "created_by": user._id,
        "modified_by": user._id,
        "owner": account._id,
        ...this.body
    }

    // Remove the API key, as we don't want this in the document store
    delete this.body.api_key;

    // Finally, drop the data into the "stripe_events" collection
    this.database.mongo.collection = "stripe_events";
    this.database.mongo.insertOne(doc);

    // Send a reply to the client.  Generally with webhooks as long as a status: 200 is sent, it's considered a successful request
    this.response.reply("ok");
    return true;

  }

   async createPaymentIntent(){

      // Create a PaymentIntent with the order amount and currency
      try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 10,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        }
      });
      } catch(err){
          console.log(err);
          this.errors.error("stripe", "Unable to create payment intent");
      }
      
      this.response.reply({ "payment_intent" : paymentIntent } );
      return true;
  }
}
