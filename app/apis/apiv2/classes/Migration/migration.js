
/*
	This file is intended to help migrate from v1.0 to v2.0
*/
import Base from "@base"
import stripePrototype from 'stripe';
import { MongoClient, ObjectId } from 'mongodb';

export default class Migrations extends Base {

	stripe = stripePrototype(process.env.stripe_key);

	constructor(){
		super();
	}

	// In v1.0, we create a stripe customer account with every new account
	// but we really don't use it much.

	// This code creates a new Stripe customer for each account and 
	// attaches the stripe customer id to the accounts document
	async ensureAllAccountsAreStripeCustomers(db){

		// Let's do a test query
		let query = { }
		let collection = db.collection("users");

		let projection = { projection: { _id: 1, owner: 1, first_name:1, last_name:1, email:1, accountId: 1 } }
		var result = await collection.find(query, projection);
		this.db = db;

    console.log(31, await result.count());

	    for await (const doc of result) {
	    	console.log(36, doc);
	  //  	await this.createCustomer(doc.email, doc.first_name, doc.last_name, doc.accountId, doc._id);
	    }
	}

	async createCustomer(email ="", firstName ="", lastName ="", accountId ="", userId =""){
    let customer;
    console.log(47, accountId, userId);

    try {
      customer = await this.stripe.customers.create({
          name: `${firstName} ${lastName}`,
          email: email,
          metadata: {
            account_id: new ObjectId(accountId),
            user_id: new ObjectId(userId)
          }
        });
    } catch(err){
    	console.log(37, err);
      return false;
    }

    // First thing we're going to do is create a new document:
    var doc = {
    	created_by: new ObjectId(userId),
    	modified_by: new ObjectId(userId),
    	owner: new ObjectId(accountId),
    	createdAt: new Date().toISOString(),
    	modifiedAt: new Date().toISOString(),
    	... customer
    }

    // Take this doc and upsert
    let collection = this.db.collection("stripe_customers");
    let updateResult = await collection.updateOne({ owner: doc.owner }, { $set: doc }, { upsert: true} );

    // Then, we want to update the account
    collection = this.db.collection("accounts");
    let account = await collection.updateOne({_id: accountId }, { $set: { "stripe_id": doc.id } } );
    console.log(72, account, doc.id);

    return customer;
  }

}