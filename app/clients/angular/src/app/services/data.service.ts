import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

/*
    Messages and Notifications are real-time events that we may want to notify the user as they happen.
    There are multiple ways to accomplish this, but the two most common are polling and websockets.  

    I decided against websockets at this time to minimize the complexity of the framework.  I may
    revisit the issue in the future, but for now we're going to use polling.  

    For my purposes, polling every 60 seconds is more than sufficient.  Adjust up or down based
    on the use cases, but this isn't intended to be used as a chat so I can't imagine many use cases
    where you need more frequent updates than that.  If you do need real time or near-real time, I
    might suggest implementing websockets if this hasn't been done already.
*/

export class DataService {
  private sharedData: any;

  private userPlan: String = 'free'

  private dataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public data$: Observable<any> = this.dataSubject.asObservable();

  private pollFrequency: number = 60000; // The time, in milliseconds, to poll.  

  constructor( private http: HttpClient ) { }

  // Any notifications
  private notificationsAr: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public publicNotificationsAr$: Observable<any> = this.notificationsAr.asObservable();

  // Any messages
  private messagesAr: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public publicMessagesAr$: Observable<any> = this.messagesAr.asObservable();

  // Display First / Last Name
  private fName: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private lName: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public public_fName$: Observable<any> = this.fName.asObservable();
  public public_lName$: Observable<any> = this.lName.asObservable();

  // Points and Account Balance
  private pointsBalance: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private cashBalance:  BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public public_pointsBalance$: Observable<any> = this.pointsBalance.asObservable();
  public public_cashBalance$: Observable<any> = this.cashBalance.asObservable();

  // Account Type
  private accountType: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public public_accountType$: Observable<any> = this.accountType.asObservable();

  setNames(fName: string, lName: string, accountType: string){
    this.fName.next(fName);
    this.lName.next(lName);
    this.accountType.next(accountType);
  }

  setBalances(balance: number, points: number){
    this.pointsBalance.next(points);
    this.cashBalance.next(balance);
  }

  async refreshNotifications(){
      const notifications: any = await this.http.get('/api/notifications').toPromise();
      this.notificationsAr.next(notifications);

      this.setPlan(notifications['plan']);
      this.setAttachedPaymentMethod(notifications['paymentMethodAttached'])

      const messages: any = await this.http.get('/api/messages').toPromise();
      this.messagesAr.next(messages)
  }

  paywallStartDate: Date = new Date(2023, 8, 15);

  // Intended to be called once
  startPolling() {
    setInterval( async () => {

      const notifications: any = await this.http.get('/api/notifications').toPromise();
      this.notificationsAr.next(notifications);

      this.setPlan(notifications['plan']);
      this.setAttachedPaymentMethod(notifications['paymentMethodAttached']);
      this.setPaywallStart(notifications['paywallStartDate'])

      const messages: any = await this.http.get('/api/messages').toPromise();
      this.messagesAr.next(messages)

      // Update the notifications and messages array...  
    }, this.pollFrequency);
  }
  // The profile name of the user
  // private profileName: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  // public publicProfileName$: Observable<any> = this.profileName.asObservable();
  
  setPaywallStart(startDate: string){
    if(this.bPaywallDateSet === false){
      this.paywallStartDate = new Date(startDate);
      this.bPaywallDateSet = true;
    }
    
  }

  bPaywallDateSet = false;
  getPaywallStart(){
    if(this.bPaywallDateSet === true){
      return this.paywallStartDate;
    }
    return null;
  }

  setSharedData(data: any) {
    this.sharedData = data;
    console.log(27, "Updating menu");
    //this.updateProfileName("Adam Arthur")
  }

  getSharedData(): any {
    //console.log(32)
    //this.updateProfileName("Adam Arthur");
    return this.sharedData;
  }

  // updateProfileName(profileName: any){
  //   console.log(35, "Updating Profile Name", profileName);
  // 	this.profileName.next(profileName);
  // }

  updateData(data: any) {
    console.log(43, "d", data);
    this.dataSubject.next(data);
    //this.dataSubject.next(data);

    
    //this.updateProfileName("Adam Arthur")
  }

  private chatButtonClickSubject = new Subject<void>();

  notifyChatButtonClick(): void {
    this.chatButtonClickSubject.next();
  }

  getChatButtonClickObservable() {
    return this.chatButtonClickSubject.asObservable();
  }

  setPlan(userPlan: String){
    console.log(136, userPlan)
    this.userPlan = userPlan
  }

  getPlan(){
    return this.userPlan;
  }

  bPaymentMethodAttached: Boolean = false;

  isPaymentMethodAttached(){
    return this.bPaymentMethodAttached;
  }

  setAttachedPaymentMethod(isPaymentMethodAttached: Boolean){
    this.bPaymentMethodAttached = isPaymentMethodAttached;
  }

  getProductName(){
    return environment.productName;
  }

}
