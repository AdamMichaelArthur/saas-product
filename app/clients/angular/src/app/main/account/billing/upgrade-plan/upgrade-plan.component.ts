import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import {BillingComponent} from '..//billing.component'
import { DataService } from '../../../../services/data.service';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upgrade-plan',
  templateUrl: './upgrade-plan.component.html',
  styleUrls: ['./upgrade-plan.component.css']
})

export class UpgradePlanComponent extends BillingComponent implements AfterViewInit, OnInit  {

  @ViewChild('stripeCardElement') stripeCardElement!: ElementRef

	bIsPaymentMethodAttached: Boolean = false;
  bShowAddCreditCard = true;

  constructor(private dataService: DataService, public override location: Location, public override http: HttpClient) { 
  	super(http, location);
  }

  private generateRandomString(length: number): string {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      let result = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }
      return result;
    }

    newElementId = '';

    ngOnInit(){
     const randomString = this.generateRandomString(10);
     this.newElementId = randomString;

     this.cardElementId = randomString;      
     alert("ngOnInit")
    }

  override async ngAfterViewInit() {

    this.stripeCardElement.nativeElement.id = this.newElementId;

    setTimeout( () => {
      this.stripeCardElement.nativeElement.id = this.newElementId;
      super.ngAfterViewInit();
    }, 1000)

    

    alert("AfterViewInit");

	  this.bIsPaymentMethodAttached = this.dataService.isPaymentMethodAttached();
    this.bAllowSwitchPlans = this.bIsPaymentMethodAttached;
    if(this.bIsPaymentMethodAttached == true){
      this.bShowAddCreditCard = true;
      this.seePlans();
    } else {
      this.bShowAddCreditCard = false;
      this.addCreditCard();
    }
  }

  override async submit(){
    await super.submit();
    //this.bIsPaymentMethodAttached = true;
    //this.bAllowSwitchPlans = true;
    await this.dataService.refreshNotifications();

    this.bIsPaymentMethodAttached = this.dataService.isPaymentMethodAttached();
    if(this.bIsPaymentMethodAttached == true){
      this.bAllowSwitchPlans = true;
    } else {
      this.bAllowSwitchPlans = false;
    }
  }

  bAllowSwitchPlans: Boolean = false;

  seePlans(){
  	this.bIsPaymentMethodAttached = !this.bIsPaymentMethodAttached;
    this.bShowAddCreditCard = false;
  }

  addCreditCard(){
    this.bIsPaymentMethodAttached = false;
    this.bShowAddCreditCard = true;
  }
}
