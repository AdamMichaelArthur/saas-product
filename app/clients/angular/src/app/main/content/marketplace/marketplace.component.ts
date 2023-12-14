import { Component, OnInit, ViewContainerRef, ViewChild, EventEmitter, Input,
  Output, ElementRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FlextableComponent } from "../../../reusable/ui/flextable/flextable.component"
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { DataService } from '../../../services/data.service';
import { JoyrideService }from 'ngx-joyride';
import { Router, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { Modal } from 'bootstrap';

import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})

export class MarketplaceComponent implements AfterViewInit {

  /* Mat Drawer / Side Panel */
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('targetDiv', { read: ViewContainerRef }) targetDiv: ViewContainerRef;
  @ViewChild('getPlan') getPlan: ElementRef;

  @ViewChild('postAnOfferBtn') postAnOfferBtn: ElementRef;
  @ViewChild('postARequestBtn') postRequestBtn: ElementRef;
  @ViewChild('getPointsBtn') getPointsBtn: ElementRef;

  panelId = "";
  offer_buywithpoints = 0;

  @ViewChild('closeProposal') closeProposal: ElementRef;

  loadWhatPeopleNeed = false;
  offersDataLoaded(){
    this.loadWhatPeopleNeed = true;
    if(this.tab == "what_people_have"){
      this.whatPeopleHaveBtn.nativeElement.click();
    }
  }


  loadMyOffers = false;
  whatPeopleNeedLoaded(){
    //alert("whatPeopleNeedLoaded a")
    this.loadMyOffers = true;
    if(this.tab == "what_people_need"){
      this.whatPeopleHaveBtn.nativeElement.click();
    }
  }

  pendingProposals = false;
  myOffersLoaded(){
    if(this.tab == "my_offers"){
      this.myOffersBtn.nativeElement.click();
    }
    this.pendingProposals = true;
  }

  myRequests = false;
  pendingProposalsLoaded(){
    //alert("pendingProposalsLoaded")
    this.myRequests = true;
    if(this.tab == "pending_proposals"){
      this.whatPeopleHaveBtn.nativeElement.click();
    }
  }

  escrowTab = false;
  myRequestsLoaded(){
    //alert("myRequestsLoaded")
    this.escrowTab = true;
    if(this.tab == "my_reqquests"){
      this.whatPeopleHaveBtn.nativeElement.click();
    }
  }

  escrowLoaded(){
    //alert("escrowLoaded")
  }

  async proposeExchange(id: any, headline: any, proposal: any, cash: any, points: any){

    var api_url = environment.v1 + `/datasource/offers/array/id/${id}`

    let obj = {
      key: 'proposals',
      value: { 'headline': headline, 'proposal': proposal, 'status': 'unread', buyer_id: '$res.locals.user._id', seller_id: '$created_by', points: points, cash: cash }
    }

    await this.http.post(api_url, obj).toPromise();

    const modalElement: HTMLElement = this.closeProposal.nativeElement;
    modalElement.click();

    alert("Proposal Sent");

    await this.pending_proposals.refreshTable();
    await this.what_people_have.refreshTable();

  }

  onOfferBuyItNowChange(newValue: number) {
    // Perform any actions or logic here based on the new value
    console.log('offer_buyitnow changed:', newValue);
    this.offer_buywithpoints = Math.floor(newValue / 25);
  }


  activePanel(componentInfo: any){
    console.log(28)
    this.panelId = componentInfo._id;
    if(this.drawer.opened){
      setTimeout( () => {
        //this.flextable.refreshTaxble();
      }, 1500)      
    }

    this.drawer.toggle()
  }

  @ViewChild('what_people_have') what_people_have: FlextableComponent;
  @ViewChild('what_people_need') what_people_need: FlextableComponent;
  @ViewChild('my_offers') my_offers: FlextableComponent;
  @ViewChild('pending_proposals') pending_proposals: FlextableComponent;
  @ViewChild('my_requests') my_requests: FlextableComponent;
  @ViewChild('escrow') escrow: FlextableComponent;

  async refreshFlextables(){
    console.log(112, "refreshFlextables called");
    await this.what_people_have.refreshTable();
    await this.what_people_need.refreshTable();
    await this.my_offers.refreshTable();
    await this.pending_proposals.refreshTable();
    await this.my_requests.refreshTable();
    await this.escrow.refreshTable();
  }

  @ViewChild('btn') btn: ElementRef;
  @ViewChild('buyitnowPopup') buyitnowPopup: ElementRef;
  @ViewChild('buywithPoints') buywithPoints: ElementRef;

  exchange_headline: String = '';
  exchange_lookingfor: String = '';
  exchange_buyitnow = 0.00;
  exchange_category: String = '';
  exchange_buywithpoints = 0.00;
  exchange_id = "";

  buyitnowData = {};
  buyitnowEndpoint = '/api/app/marketplace/buyItNow';
  buywithpointsEndpoint = '/api/app/marketplace/buyWithPoints'
  buyitnowPayload = { }
  buywithpointsPayload = { }
  buywithproposedExchange = { }

  buywithpointsLink = '';

  onexchangeBuyItNowChange($event){
    alert("Post it post it")
  }

  purchaseComplete($event){

  }

  @ViewChild('closeBuyWithPoints') closeBuyWithPoints: ElementRef;

  buyWithPointsComplete($event, payload){
    const modalElement: HTMLElement = this.closeBuyWithPoints.nativeElement;
    modalElement.click();
    this.what_people_have.refreshTable();
    this.escrow.refreshTable();
    this.refreshTopNav();

    console.log(1795, $event, payload);
    this.router.navigate([`main/marketplace/offer-details/id/${payload.id}`]);
    //
  }

  async refreshTopNav(){
    const response: any = await this.http.get('/api/getNavigationMenus').toPromise();
    let userInfo = response["userInfo"];
    const balance = userInfo?.balance ?? 0;
    const points = userInfo?.points ?? 0;
    this.dataService.setBalances(balance, points);

    this.dataService.refreshNotifications()
  }

  acceptProposalTableButtonClicked(requestResult: any){
    //alert("Accept Proposal Table Button Clicked");
      let buttonName = requestResult["buttonName"];
      let id = requestResult["_id"];
      let row = requestResult["row"];
      
      //alert(buttonName)

      if(buttonName == "Accept"){
         this.escrow.refreshTable(); 
      }
  }

  tableButtonClicked(requestResult: any){

      let buttonName = requestResult["buttonName"];
      let id = requestResult["_id"];
      let row = requestResult["row"];
      

      if(buttonName == "Propose Exchange"){
        
        // if(this.checkNeedsPlan() === true){
        //   return;
        // }

        this.btn.nativeElement.click();
        this.exchange_id = id;
        this.exchange_headline = "Test"
        this.exchange_lookingfor = "A";
        this.exchange_buyitnow = 10;
        this.exchange_category = "C";
        this.exchange_buywithpoints = 20

        // this.pending_proposals.refreshTable();
        // this.buywithproposedExchange['id'] = id;
        // this.buywithproposedExchange['created_by'] = row['created_by'];
        // this.buywithproposedExchange['points'] = this.exchange_buywithpoints;
      }

      if(buttonName == "Accept"){
        alert("Accept a Proposal")
      }

      if(buttonName == "Reject"){
        alert("Reject a Proposal");
      }

      if(buttonName == "Do It For Points"){
        alert("Do it for points");
      }

      if(buttonName == "Buy It Now"){
        console.log(74, requestResult)
        this.buyitnowPopup.nativeElement.click();
        this.buyitnowData = row;
        this.buyitnowPayload['price'] = this.buyitnowData['buyitnow'];
        this.buyitnowPayload['id'] = id;
        this.buyitnowPayload['created_by'] = row['created_by'];
        console.log(152, row, this.buyitnowPayload);
      }
 
      if(buttonName == "Buy With Points"){

        // if(this.checkNeedsPlan() === true){
        //   return;
        // }

        this.buywithPoints.nativeElement.click();
        this.buyitnowData = row;
        this.buywithpointsPayload['id'] = id;
        this.buywithpointsPayload['created_by'] = row['created_by'];
        this.buywithpointsPayload['points'] = this.buyitnowData['pointsCost'];
        this.buywithpointsPayload['link'] = ''
        this.buywithpointsPayload['anchor_text'] = ''
        console.log(161, row, this.buywithpointsPayload);
      }

  }
  
  async leaveComment(){

  }

  // End Mat Drawer / Side Panel

	@ViewChild('requestModal') requestModal;

	@HostListener('document:hidden.bs.modal', ['$event']) 

	onModalClose(event: any) {
	    // Do something when the modal is hidden
	    this.resetVariables();
	    console.log(28, "Modal Hidden");
	  }

	ngAfterViewInit(){


    
	}


  categories = [
  	'Link',
  	'Newsletter',
  	'Social Media Shoutout',
  	'Ad Space',
  	'Domain',
  	'Service',
  	'Something Else'
  ];

  selectedCategory = "";
  comment = '';
  subject = '';
  
  @ViewChild('myModal') myModal: ElementRef;

  dismissModal() {
    const modalElement: HTMLElement = this.myModal.nativeElement;
    this.renderer.selectRootElement(modalElement).dispatchEvent(new Event('click'));
    this.resetVariables();
  }

  constructor(private http: HttpClient, private renderer: Renderer2, private dataService: DataService, private readonly joyrideService: JoyrideService, 
    private router: Router, private route: ActivatedRoute) { }

  requestsDiv = false;

  tab = '';
  //escrow = false;
  async ngOnInit(){
    // api/datasource/forums/distinct/category/all
    //let categories = await this.http.get(`api/datasource/forums/distinct/category/all`).toPromise();
    //this.categories = categories['forums'];
    // setTimeout( () => {
    //   this.test = true;
    // }, 5500)

    // setTimeout( () => {
    //   this.requestsDiv = true;
    // }, 2500)

    // setTimeout( () => {
    //   this.escrow = true;
    // }, 13500)

    //this.joyrideService.startTour( { steps: ['firstStep', 'secondStep', 'thirdStep', 'fifthStep'] } );

    setTimeout( () => {
      this.refreshTopNav();
    }, 1500)
    

    this.route.fragment.pipe(
      filter(fragment => !!fragment)
    ).subscribe(fragment => {
      console.log('Current fragment:', fragment);
      this.tab = fragment;
    });

  }

  displayLinkConditions = false;
  displayNewsletterConditions = false;
  displayShoutoutConditions = false;
  displayAdSpaceConditions = false;
  displayDomainConditions = false;
  displayServiceConditions = false;
  displaySomethingElseConditions = false;
  rows = 5;

  looking_forAr = [];

  onCategorySelected(){

  	this.displayLinkConditions = false;
  	this.displayNewsletterConditions = false;
  	this.displayShoutoutConditions = false;
  	this.displayAdSpaceConditions = false;
  	this.displayDomainConditions = false;
  	this.displayServiceConditions = false;
  	this.displaySomethingElseConditions = false;

  	if(this.offer_category == "Link"){
  		this.displayLinkConditions = true;
  	}

  	if(this.offer_category == "Newsletter"){
  		this.displayNewsletterConditions = true;
  	}

  	if(this.offer_category == "Social Media Shoutout"){
  		this.displayShoutoutConditions = true;
  	}

  	if(this.offer_category == "Ad Space"){
  		this.displayAdSpaceConditions = true;
  	}

  	if(this.offer_category == "Domain"){
  		this.displayDomainConditions = true;
  	}

  	if(this.offer_category == "Service"){
  		this.displayServiceConditions = true;
  	}

  	if(this.offer_category == "Something Else"){
  		this.displaySomethingElseConditions = true;
  	}


  }

  closePanel(newVar: string) {
     this.drawer.toggle();
  }
  
  headerButtonClicked(event: any){
    if(event == 'Start New Thread'){
      this.startNewThread();
    }
  }

  startNewThread(){

  }


  offer_headline: String = '';
  offer_lookingfor: String = '';
  offer_buyitnow = 0.00;
  offer_category: String = '';

  headline = null;
  looking_for = null;
  buyitnow = null;
  category = null;
  verified = null;

  /* Link Category */
  inputDr = null;
  inputSiteTraffic = null;
  inputPageTraffic = null;
  inputNiche = null;
  inputDomain = null;

  /* Newsletter Category */
  newsletterSubscribers = null;
  newsletterOpenRate = null;
  newsletterFrequency = null;

  /* Social Media Shoutout */
  shoutoutFollowers = null;
  shoutoutPlatform = null;
  shoutoutNiche = null;

  /* Adspace */
  adspaceType = null;
  adspaceDuration = null;
  adspaceEyeballs = null;

  /* Domain */
  domainName = null;
  domainTraffic = null;

  /* Service */
  serviceDescription = null;

  /* Something Else */
  somethingElse = null;

    @ViewChild('whatpeoplehavebtn') whatPeopleHaveBtn: ElementRef;
    @ViewChild('myrequestsbtn') myRequestsBtn: ElementRef;
    @ViewChild('whatpeopleneedbtn ') whatPeopleNeedBtn: ElementRef;
    @ViewChild('myoffersbtn') myOffersBtn: ElementRef;
    @ViewChild('pendingproposalsbtn') pendingProposalsBtn: ElementRef;
    @ViewChild('escrowbtn') escrowBtn: ElementRef;


  async requestPosted(){
    let nativeEl = this.myRequestsBtn.nativeElement;
    nativeEl.click();
    await this.my_requests.refreshTable();
  }

  displayPostRequest = true;
  displayGetPoints = true;
  displayPostOffer = true;

  async postRequest(){
    this.postRequestBtn.nativeElement.click();
    return;

     let userPlan = this.dataService.getPlan(); 

     if(userPlan == "free"){
       this.displayPostRequest = false;
       this.postRequestBtn.nativeElement.click();
     }
  }


  async getPoints($event){
     this.getPointsBtn.nativeElement.click();
     return;

     let userPlan = this.dataService.getPlan(); 

     if(userPlan == "free"){
       this.displayGetPoints = false;
       
     }

  }

  async postOffer(){

     this.postAnOfferBtn.nativeElement.click();
     return;
     
     let userPlan = this.dataService.getPlan(); 

     if(userPlan == "free"){
       this.displayPostOffer = false;
       
     }

     


    return;

  let stringToSplit = this.offer_lookingfor;
  let splitArray = stringToSplit.split('\n');

  	// Split this.offer_lookingfor into an array
    let payload = {
      headline:this.offer_headline,
      looking_for:splitArray,
      buyitnow:this.offer_buyitnow,
      category:this.offer_category,
      pointsCost: this.offer_buywithpoints,

      /* Link Category */
      inputDr:this.inputDr,
      inputSiteTraffic:this.inputSiteTraffic,
      inputPageTraffic:this.inputPageTraffic,
      inputNiche:this.inputNiche,
      inputDomain:this.inputDomain,

      /* Newsletter Category */
      newsletterSubscribers:this.newsletterSubscribers,
      newsletterOpenRate:this.newsletterOpenRate,
      newsletterFrequency:this.newsletterFrequency,

      /* Social Media Shoutout */
      shoutoutFollowers:this.shoutoutFollowers,
      shoutoutPlatform:this.shoutoutPlatform,
      shoutoutNiche:this.shoutoutNiche,

      /* Adspace */
      adspaceType:this.adspaceType,
      adspaceDuration:this.adspaceDuration,
      adspaceEyeballs:this.adspaceEyeballs,

      /* Domain */
      domainName:this.domainName,
      domainTraffic:this.domainTraffic,

      /* Service */
      serviceDescription:this.serviceDescription,

      /* Something Else */
      somethingElse:this.somethingElse
    }

    var obj = Object.fromEntries(Object.entries(payload).filter(([key, value]) => value !== null));
  	console.log(135, obj);

    obj['status'] = 'available';
    obj['pointsCost'] = 10;

    let post = await this.http.post(`api/datasource/offers`, obj).toPromise();

    this.resetVariables();

    alert("Your Offer Has Been Published");

    this.dismissModal();

    this.refreshFlextables();

    const btn: HTMLElement = this.myOffersBtn.nativeElement;
    btn.click();
  }
  

  offerPosted(){
    this.my_offers.refreshTable();
    //alert("Your Offer Has Been Published");
    //this.refreshFlextables();
    const btn: HTMLElement = this.myOffersBtn.nativeElement;
    btn.click();    
  }

  test = false;

  resetVariables() {

  	this.displayLinkConditions = false;
  	this.displayNewsletterConditions = false;
  	this.displayShoutoutConditions = false;
  	this.displayAdSpaceConditions = false;
  	this.displayDomainConditions = false;
  	this.displayServiceConditions = false;
  	this.displaySomethingElseConditions = false;

    this.headline = null;
    this.looking_for = null;
    this.buyitnow = null;
    this.category = null;
    this.verified = null;

    /* Link Category */
    this.inputDr = null;
    this.inputSiteTraffic = null;
    this.inputPageTraffic = null;
    this.inputNiche = null;
    this.inputDomain = null;

    /* Newsletter Category */
    this.newsletterSubscribers = null;
    this.newsletterOpenRate = null;
    this.newsletterFrequency = null;

    /* Social Media Shoutout */
    this.shoutoutFollowers = null;
    this.shoutoutPlatform = null;
    this.shoutoutNiche = null;

    /* Adspace */
    this.adspaceType = null;
    this.adspaceDuration = null;
    this.adspaceEyeballs = null;

    /* Domain */
    this.domainName = null;
    this.domainTraffic = null;

    /* Service */
    this.serviceDescription = null;

    /* Something Else */
    this.somethingElse = null;
  }

  @Output() public parentEvent = new EventEmitter<any>();


  sendEventToChild(_id: String) {
    const eventData = 'Custom event data from parent';
    this.parentEvent.emit(_id);
  }

  handleEvent(eventData: string) {
    console.log('Received event data in parent:', eventData);
  }

  @ViewChild('flextable') flextable: FlextableComponent;

  async escrowTableButtonClicked($event){

    if($event['row']['category'] == 'Link'){
      var userInput = prompt("Please enter where the link appears");
      if (userInput == null || userInput == "") {
          alert("Providing the link is required to complete this task");
      } else {
          //alert("Hello " + userInput + "! How are you today?");
      }
    }

    let post = await this.http.post(`api/app/marketplace/addLink`, { link: userInput }).toPromise();

    console.log(572, $event);
    //alert("Complete")
    this.refreshTopNav();
  }

  setTab(hashtag: string): void {

    this.router.navigate([], { 
      relativeTo: this.route,
      fragment: hashtag.replace('#', ''), 
      replaceUrl: true 
    });
  }


  bHidden = true;
  bNeedsPlan = true;
  bDisplayPlanModal = false;

  checkNeedsPlan(){

      let userPlan = this.dataService.getPlan(); 

     if(userPlan == "free"){
       this.bDisplayPlanModal = true;
       setTimeout( () => {
         //const modal = new Modal();
         //modal.show();         
     }, 1500)

       return true;
     }   

     return false;
  }



}
