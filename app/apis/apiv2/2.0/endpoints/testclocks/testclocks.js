import { Base, ResponseError } from '@base'
import { MongoClient, ObjectId } from 'mongodb';

export default class Testclocks extends Base {

  constructor(){
    super();
  }

  async attachStripeClockCustomerToAccount(stripe_id ="", subscription_id ="", plan =""){

    let account_id = this.user.accountId;

    console.log(14, account_id);

    var update={ _id: account_id };

    // The "stripe_id" is the "customer_id"
    let accounts = this.database.mongo.db.collection("accounts");
    let cmd = { $set: { stripe_id: stripe_id, subscription_id: subscription_id, plan: plan} };
    let existingDoc = await accounts.findOne({_id:account_id});
        console.log("Existing document:", existingDoc);

        console.log(1, update, cmd);
        let result = await accounts.updateOne(update, cmd);
        let updatedDoc = await accounts.findOne({_id: account_id});
        console.log("Updated document:", updatedDoc);
        this.response.reply(result);

  }

  async test(){
    
    return true;
  }

}