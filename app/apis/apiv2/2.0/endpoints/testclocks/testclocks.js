import { Base, ResponseError } from '@base'
import { MongoClient, ObjectId } from 'mongodb';

export default class Testclocks extends Base {

  constructor(){
    super();
  }

  async attachStripeClockCustomerToAccount(stripe_id ="", subscription_id ="", plan =""){

    let account_id = this.user.accountId;

    console.log(14, account_id);

    // The "stripe_id" is the "customer_id"
  	var result = await this.database.mongo.updateOne(
      { _id: account_id }, 
      { $set: { 
          stripe_id: stripe_id,
          subscription_id: subscription_id,
      } }, "accounts", { upsert: false });
    
  	this.response.reply(result);

  }

  async test(){
    
    return true;
  }

}