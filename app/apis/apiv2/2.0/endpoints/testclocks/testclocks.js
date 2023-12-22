import { Base, ResponseError } from '@base'
import { MongoClient, ObjectId } from 'mongodb';

export default class Testclocks extends Base {

  constructor(){
    super();
  }

  async attachStripeClockCustomerToAccount(stripe_id ="", subscription_id ="", plan =""){
    this.userAccount.stripe_id = stripe_id;
    this.userAccount.subscription_id = subscription_id;
    this.userAccount.plan = plan;
  }

  async test(){
    
    return true;
  }

}