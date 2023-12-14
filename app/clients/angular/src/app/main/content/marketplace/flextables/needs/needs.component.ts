import { Component, OnInit, ViewContainerRef, ViewChild, EventEmitter, Input,
  Output, ElementRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FlextableComponent } from "../../../../../reusable/ui/flextable/flextable.component"
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';

import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';


@Component({
  selector: 'app-needs',
  templateUrl: './needs.component.html',
  styleUrls: ['./needs.component.css']
})

export class NeedsComponent implements AfterViewInit {

  webpageSummaryEndpoint = 'api/chatgpt/simpleWebpageInput'

  webpageSummaryPayload = {
    "input":'',
    "output": "{ summary: text } ",
    "prompt":"Tell me what industry this webpage is in.  Tell me what niche this webpage is in.  Write exactly two sentences about what this site is about.  Be gramatically correct."
  }

	newContent = false;
	humanWritten = false;

	  inputDr = 50;
	  inputSiteTraffic = 150000;
	  inputPageTraffic = 1500;
    bValueDetermined = false;

    webpageEntered = false;

    step0 = true;
    step1 = false;
    step2 = false;
    step3 = false;

  nextStep(step){
    if(step == 'step1'){
      this.step1 = true;
      this.step0 = false;
    }

    if(step == 'step2'){
      this.step2 = true;
      this.step1 = false;
    }
  }

  bShowPageSummaryInput = false;
  pageDescription = 'This is a test';
  pageAnalysis($event){

    console.log(60, $event);
    let pageInfo = $event['summary']
    console.log(65, pageInfo)
    this.pageDescription = pageInfo;
    this.bShowPageSummaryInput = true;
    this.nextStep('step2');
  }

	determineValue(){
    this.bValueDetermined = true;
	  // Use Math.log to represent the natural logarithm function in JavaScript.
	  // Add 1 to each of the logarithm terms to avoid taking log of 0.
	  
	  let drMultiplier = 0.25;
	  if(this.inputDr > 25){
	  	drMultiplier = 0.35;
	  }
	  if(this.inputDr > 35){
	  	drMultiplier = 0.45;
	  }
	  if(this.inputDr > 45){
	  	drMultiplier = 0.65;
	  }
	  if(this.inputDr > 55){
	  	drMultiplier = 0.87;
	  }
	  if(this.inputDr > 75){
	  	drMultiplier = 0.90;
	  }
	  if(this.inputDr > 85){
	  	drMultiplier = 0.95;
	  }

	  var siteDRScore = drMultiplier * Math.log(this.inputDr + 1);
	  console.log('Site DR Score: ' + siteDRScore);

	  var siteTrafficScore = 0.2 * Math.log(this.inputSiteTraffic + 1);
	  console.log('Site Traffic Score: ' + siteTrafficScore);
	  if(this.inputSiteTraffic > 50000){
	  	siteTrafficScore = 0.3 * Math.log(this.inputSiteTraffic + 1);
	  }

	  if(this.inputSiteTraffic > 100000){
	  	siteTrafficScore = 0.4 * Math.log(this.inputSiteTraffic + 1);
	  }

	  if(this.inputSiteTraffic > 150000){
	  	siteTrafficScore = 0.5 * Math.log(this.inputSiteTraffic + 1);
	  }

	  if(this.inputSiteTraffic > 200000){
	  	siteTrafficScore = 0.6 * Math.log(this.inputSiteTraffic + 1);
	  }

	  let pageTrafficMultiplier = 0;

	  if(this.inputPageTraffic < 100){
	  	pageTrafficMultiplier = 0.2;
	  }

	  if((this.inputPageTraffic > 100) && (this.inputPageTraffic < 999)){
	  	pageTrafficMultiplier = 0.45;
	  }

	  if(this.inputPageTraffic > 999) {
	  	pageTrafficMultiplier = 0.75;
	  }

	  var pageTrafficScore = pageTrafficMultiplier * Math.log(this.inputPageTraffic + 1);
	  console.log('Page Traffic Score: ' + pageTrafficScore);

	  if(this.inputPageTraffic > 100){
	  	pageTrafficScore = 1;
	  }

	  if(this.inputPageTraffic > 499){
	  	pageTrafficScore = 4;
	  }

	  if(this.inputPageTraffic > 1000){
	  	pageTrafficScore = 6;
	  }

	  if(this.inputPageTraffic > 1499){
	  	pageTrafficScore = 10;
	  }


	  // For boolean variables, assign a value of 1 if true and 0 if false.

	  var newContentScore = this.newContent ? 0.05 : 0;
	  console.log('New Content Score: ' + newContentScore);

	  var humanWrittenScore = this.humanWritten ? 0.25 : 0;
	  console.log('Human Written Score: ' + humanWrittenScore);

	  // if(this.inputSiteTraffic > 100000){
	  // 	if(this.inputPageTraffic < 1){
	  // 		siteTrafficScore = 0.6 * Math.log(this.inputSiteTraffic + 1);
	  // 	}
	  // }

	  // if(this.inputSiteTraffic > 10000){
	  // 	if(this.inputPageTraffic < 1){
	  // 		siteTrafficScore = 0.6 * Math.log(this.inputSiteTraffic + 1);
	  // 	}
	  // }

	  // The final link value is the sum of all these weighted scores.
	  var linkValue = siteDRScore + siteTrafficScore + pageTrafficScore + newContentScore + humanWrittenScore;

	  this.linkPointValue = Math.min(Math.floor(linkValue), 10);
	  console.log('Link Value: ' + linkValue);
	  return linkValue;
	}


  /* Mat Drawer / Side Panel */
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('targetDiv', { read: ViewContainerRef }) targetDiv: ViewContainerRef;

  linkPointValue = 0;
  panelId = "";

  activePanel(componentInfo: any){
    console.log(28)
    this.panelId = componentInfo._id;
    if(this.drawer.opened){
      setTimeout( () => {
        //this.flextable.refreshTable();
      }, 1500)      
    }

    
    this.drawer.toggle()
  }

  tableButtonClicked(requestResult: any){
    console.log(41, requestResult);
    this.drawer.toggle()
    
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
    const modalElement: HTMLElement = this.myModal.nativeElement.click()
    this.resetVariables();
  }

  constructor(private http: HttpClient, private renderer: Renderer2, private dataService: DataService) { }

  async ngOnInit(){
    // api/datasource/forums/distinct/category/all
    //let categories = await this.http.get(`api/datasource/forums/distinct/category/all`).toPromise();
    //this.categories = categories['forums'];

    this.inputDr = Math.floor(Math.random() * 100) + 1; // Random value between 1 and 100
    this.inputSiteTraffic = Math.floor(Math.random() * 200000) + 10000; // Random value between 10,000 and 210,000
    this.inputPageTraffic = Math.floor(Math.random() * 2000) + 500; // Random value between 500 and 2500

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

  async refreshTopNav(){
    setTimeout( async () => {
      const response: any = await this.http.get('/api/getNavigationMenus').toPromise();
      let userInfo = response["userInfo"];
      const balance = userInfo?.balance ?? 0;
      const points = userInfo?.points ?? 0;
      this.dataService.setBalances(balance, points);
    }, 500)
  }

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

  async postRequest(){
  	alert("Post a request")
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


  async getPoints(){

	let stringToSplit = this.offer_lookingfor;
	let splitArray = stringToSplit.split('\n');

	//console.log(142, splitArray);

      //category
      //status
      // available
      // state
      // type
      // quality_approved

	let payload = {
      headline: `DR ${this.inputDr} with ${this.inputSiteTraffic} site traffic and ${this.inputPageTraffic} pg visits`,
      pointsCost: this.linkPointValue + 3,
      buyitnow: (this.linkPointValue + 3)*35,
      /* Link Category */
      inputDr: this.inputDr,
      inputSiteTraffic: this.inputSiteTraffic,
      inputPageTraffic: this.inputPageTraffic,
      inputNiche: this.inputNiche,
      inputDomain: this.inputDomain,
      looking_for: ['Points', 'Cash'],
        disable_parameter_checking:true,
        points: this.linkPointValue,
        siteDR: this.inputDr, 
        siteTraffic: this.inputSiteTraffic, 
        pageTraffic: this.inputPageTraffic, 
        newContent: this.newContent, 
        humanWriten: this.humanWritten, 
        status: 'quality_check',
        available: 'quality_check',
        state: 'quality_check',
        type: 'buywithpoints',
        quality_approved: false,
        category: 'Link',
        website: this.webpageSummaryPayload.input
	}

  console.log(408, payload);

	var obj = Object.fromEntries(Object.entries(payload).filter(([key, value]) => value !== null));

	  

    let givePoints = await this.http.post('/api/app/marketplace/bankaccount/addPointsForLink', payload).toPromise()

    // Warning: this shouldn't be necessary, but the points aren't updated fast enough in the DB causing points conflict.
    setTimeout( async () => {
      let post = await this.http.post(`api/app/marketplace/postOffer`, payload).toPromise();
    }, 250);
    
    this.dismissModal();
    this.refreshTopNav();
    this.resetVariables();
  }
  
  test = false;

  determineSiteStatistics = false;

  siteStatistics($event){

  }

  resetVariables() {

    this.step1 = false;
    this.step2 = false;
    this.step3 = false;
    this.step0 = true;
    this.bShowPageSummaryInput = false;

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

    this.inputDr = Math.floor(Math.random() * 100) + 1; // Random value between 1 and 100
    this.inputSiteTraffic = Math.floor(Math.random() * 200000) + 10000; // Random value between 10,000 and 210,000
    this.inputPageTraffic = Math.floor(Math.random() * 2000) + 500; // Random value between 500 and 2500

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


}
