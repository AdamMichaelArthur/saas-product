import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
//import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})

export class BillingComponent implements AfterViewInit {
  elements: any;
  stripe: any;
  card: any;
  paymentMethods: any = [];
  activeSubscriptions: any = [];
  subscriptionPlans: any = [];
  deletedRowIndex: number | null = null;
  isVisible: boolean = false;
  userAccount = { }

  @ViewChild('addcard') addcard;
  @ViewChild('tableloading') tableloading;
  @ViewChild('stripeloading') stripeloading;

  constructor(public http: HttpClient, public location: Location) { }

  currentPlan = '';
  planInfo: any = { }
  changePlanEndpoint = '/api/plans/changePlan';

  async ngAfterViewInit() {

    console.log(36);

    this.stripeloading.startLoader();
    this.isVisible = false;
    const stripe = await import('@stripe/stripe-js');
    const stripePromise = stripe.loadStripe('pk_test_nXe9cSnVNkXqFWgEJEcyxz6s');
    this.stripe = await stripePromise;

    //const stripePromise = loadStripe('pk_test_nXe9cSnVNkXqFWgEJEcyxz6s');
    //this.stripe = await stripePromise;

    const appearance = {
      theme: 'flat'
    };
    
    const elements = this.stripe.elements(appearance);
    this.card = this.createAndMountCard(elements);

    this.card.addEventListener('change', this.handleCardChange.bind(this));
    this.card.addEventListener('ready', this.handleCardReady.bind(this, elements));
    
    this.paymentMethods = await this.fetchPaymentMethods();
    this.activeSubscriptions = await this.fetchCustomerSubscriptions();
    this.subscriptionPlans = await this.fetchSubscriptionPlans();

    console.log(56, this.subscriptionPlans);
    
    if(this.activeSubscriptions.length > 0){
      this.currentPlan = this.activeSubscriptions[0].plan.metadata.displayName;
    } else {
      this.currentPlan = "Not On A Plan"
    }

    for(let plan of this.subscriptionPlans){
      plan["planInfo"] = {
        "planFrom": "free",
        "planTo": plan.displayName,
        "frequency":"monthly",
        "prorationPolicy":"no_charge"        
      }
    }

    console.log(69, this.subscriptionPlans);

  }

  async submit(){
    var paymentMethod = await this.stripe.createPaymentMethod({ type: 'card', card: this.card } )
    await this.http.post(`/api/stripe/attachPaymentMethod/paymentMethodId`, paymentMethod).toPromise();
    this.paymentMethods = await this.fetchPaymentMethods();
    this.addcard.stopLoader();
    this.addcard.disabled = true;
    this.card.clear();
  }

  async deleteCard(event: any, card: any, rowIndex: any){
    await this.tableloading.startLoader();
    event.preventDefault();
    if(this.paymentMethods.length == 1){
      alert("By removing your only remaining payment method, any paid subscription will automatically cancel at the end of your current billing cycle and you will be automatically put on the Free plan.");
    }

    await this.http.get(`/api/stripe/detachPaymentMethod/paymentMethodId/${card.id}`).toPromise();

    this.paymentMethods = await this.fetchPaymentMethods();
    this.tableloading.stopLoader();
  }

  stripeIsReady(){
    // implement this
    alert("Stripe is ready");
  }

  stripeDidFinishEnteringCardInfo(event: any){
    // implement this
    this.addcard.disabled = false;
    this.addcard.stopLoader();
    //alert("Did Finish Entering Credit Card Info")
  }

  stripeDidReportError(event: any){
    // implement this
    this.addcard.disabled = true;
    this.addcard.stopLoader();
  }

  async paymentComplete(results: any, self: any) {
    // implement this
    alert("payment complete");
  }

  private async fetchPaymentMethods(){
    const paymentMethods: any = await this.http.get('/api/stripe/getPaymentMethods').toPromise();
    return paymentMethods.paymentMethods.data;
  }

  private async fetchCustomerSubscriptions(){
    const activeSubscriptions: any = await this.http.get('/api/stripe/getActiveSubscriptions').toPromise();
    return activeSubscriptions.result;
   }

  private async fetchSubscriptionPlans(){
    const subscriptionPlans: any = await this.http.get('/api/plans/getPlans').toPromise();
    this.userAccount = subscriptionPlans['userAccount']
    return subscriptionPlans.plans;    
  }

  async planChanged($event){
    console.log(137, $event);
    if(typeof $event.error !== 'undefined'){
      // We weren't able to upgrade...
    } else {
      this.hardRefresh();
    }
  }

  async changeSubscription($event, planId: String){
    $event.preventDefault();
    alert(planId);
    let httpOptions = {
        headers: new HttpHeaders({
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }),
        "withCredentials": true
      };

      try {
        var subscriptionPlans: any = await this.http.post('/api/plans/changePlan', { 
          "planFrom": "free",
          "planTo": planId,
          "frequency":"monthly",
          "prorationPolicy":"no_charge"
        }, httpOptions ).toPromise();
          } catch(err){
            alert(err)
      }

    this.hardRefresh();
  }

  hardRefresh() {
    window.location.reload();
  }

  cardElementId = "#card-element";
  
  private createAndMountCard(elements: any) {
    const style = this.getCardStyle();
    const card = elements.create('card', { style });
    card.mount(this.cardElementId);
    return card;
  }

  private getCardStyle(){
    return {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };
  }

  private handleCardChange(event: any){
    console.log(160, event)
    if (event.complete) {
      this.stripeDidFinishEnteringCardInfo(event);
    } else if (event.error) {
      this.stripeDidReportError(event);
    }
  }

  private handleCardReady(elements: any){
    console.log(102)
    this.stripeloading.stopLoader();
    this.isVisible = true;
    return;
    const cardElement = elements.getElement('card');
    setTimeout(() => {
      console.log("Trying to focus");
      cardElement.focus();
    }, 1000);
    this.stripeIsReady();
  }
}
