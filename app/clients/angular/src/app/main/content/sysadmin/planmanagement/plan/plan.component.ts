import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SubscriptionObject } from './subscription.model';
import { NetworkRequestButtonComponent } from '../../../../../reusable/ui/network-request-button/network-request-button.component'

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'planmanagement-panel',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})

export class PlanComponent {

   @ViewChild('request') requestButton: NetworkRequestButtonComponent;

	  _panelId: string = "abcd";

    model = new SubscriptionObject("", "", 0);

    startRequest = false;

    price = 0.00;

    submitted = false;

    bHandleUpdate = false;

  onSubmit() { 

    let copiedObject = Object.assign({}, this.origJsonBody, this.jsonBody);
    Object.assign(copiedObject.prices, this.origJsonBody['prices'])

    // Max Price: 999999999999 / 100
    let maxPrice = Math.ceil((999999999999) / 100)
    console.log(34, String(maxPrice));

    copiedObject['prices'][0]['unit_amount'] = String(this.price * 100)

    this.submitted = true; 
    copiedObject['disable_parameter_checking'] = true;
    delete copiedObject['prices'][0]['recurring'];
    delete copiedObject['prices'][0]['type']
    this.requestButton.request ="/api/administration/plans/editPlan"
    this.requestButton.verb = "POST"
    this.requestButton.payload = copiedObject;

    this.bHandleUpdate = true;
    this.requestButton.result.subscribe((event: any) => {
      this.updateResult(event)
    })

    this.requestButton.startNetworkRequest({});

  }

  updateResult(event){
    if(this.bHandleUpdate == false){
      return;
    }

    console.log(47, event);
    this.requestButton.reset();
    this.bHandleUpdate = false;
    this.submitted = false;
    this.startRequest = true;
    this.requestButton.verb = "GET";
    this.requestButton.request = `/api/administration/plans/getPlan/planId/${this._panelId}`
    this.requestButton.result.subscribe((event: any) => {
      this.dataReceived(event);
    })
    this.requestButton.startNetworkRequest({})
  }

	@Input() set panelId(value: string) {
	    this._panelId = value;
	    this.onDataChange();
	  }

	  get panelData(): string {
	    return this._panelId;

	  }

  @Input() childVar: string;
  @Output() childVarChange = new EventEmitter<string>();

  onDataChange() {

    if(this.bHandleUpdate){
      return;
    }

    this.jsonBody['_id'] = this._panelId;
    this.requestButton.reset();
    this.startRequest = true;
    this.requestButton.request = `/api/administration/plans/getPlan/planId/${this._panelId}`
    this.requestButton.startNetworkRequest({})
    
  }

  getObjectKeys(object: any | null = null): string[] {
    if (object === null) {
      return Object.keys(this.jsonBody);
    } else {
      return Object.keys(object);
    }
  }

  isArray(value: any) : boolean {
    return Array.isArray(value)
  }

  isObject(value: any): boolean {
    return typeof value === 'object';
  }

  isUndefined(value: any): boolean {
    return typeof value === 'undefined'
  }

  goBack(): void {
    console.log(47, "Go Back Called?")
    this.jsonBody = this.jsonBodyTemplate;
    this.childVarChange.emit("");
  }

  jsonBodyTemplate = {
    _id: '',
    users: 0,
    currency: '',
    frequency: '',
    freeTrialDays: 0,
    gracePeriod: 3,
    paymentReminders: true,

    prices: [ { currency: '', id: '', unit_amount: '' } ]
    
  }

  jsonBody= {
    _id: '',
    users: 0,
    currency: '',
    frequency: '',
    freeTrialDays: 0,
    gracePeriod: 3,
    paymentReminders: true,
    prices: [ { currency: '', id: '', unit_amount: '' } ]
  }

  origJsonBody = { }

  dataReceived(event){

    if(this.bHandleUpdate){
      return;
    }

    this.jsonBody = this.jsonBodyTemplate

    this.origJsonBody = event["plan"];

    this.jsonBody.prices = [];
    let jsonBody = event["plan"];

    this.requestButton.reset();

    this.jsonBody['_id'] = jsonBody['_id'];
    this.jsonBody['users'] = jsonBody['users'];
    this.jsonBody['currency'] = jsonBody['currency'];
    this.jsonBody['freeTrialDays'] = jsonBody['freeTrialDays'];
    this.jsonBody['gracePeriod'] = jsonBody['gracePeriod'];
    this.jsonBody['frequency'] = jsonBody['frequency'];
    this.jsonBody['paymentReminders'] = jsonBody['paymentReminders'];

    for(var price of jsonBody.prices){
      this.jsonBody.prices.push({
        currency: price['currency'],
        id: price['id'],
        unit_amount: (price['unit_amount'] / 100 ).toFixed(2)
      })
      this.price = (price['unit_amount'] / 100 );
    }

  }


}
