import { Component, OnInit, ViewContainerRef, ViewChild, EventEmitter, Input,
  Output, ElementRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { DataService } from '../../../../services/data.service';
import { JoyrideService }from 'ngx-joyride';

import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

@Component({
  selector: 'app-post-offer',
  templateUrl: './post-offer.component.html',
  styleUrls: ['./post-offer.component.css']
})
export class PostOfferComponent implements OnInit {

  dropdownValues: number[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private renderer: Renderer2, private dataService: DataService, private readonly joyrideService: JoyrideService) 
  { 
    this.dropdownValues = Array.from({ length: 100 }, (_, i) => i + 1);
  }

  yourForm: FormGroup;

  @HostListener('document:hidden.bs.modal', ['$event']) 

  onModalClose(event: any) {
	    // Do something when the modal is hidden
	    this.resetVariables();
	    console.log(28, "Modal Hidden");
   }

   valueChangesSubscription: Subscription | undefined;

  ngOnInit() {
    this.yourForm = this.fb.group({
      'offer_headline': ['', Validators.required],
      'offer_buywithpoints' : [0, [Validators.required, Validators.min(1)]],
      'offer_category': ['default', [Validators.required, this.categoryValidator]],
    });

    this.sub();

   this.yourForm.get('offer_headline').disable();
   this.yourForm.get('offer_buywithpoints').disable();

    var myModal = document.getElementById('requestModal')
	myModal.addEventListener('hidden.bs.modal', function (event) {
  		// Call your function here
  		
	})

  }

  @Output() public offerPosted = new EventEmitter<any>();

  sendEventToChild(_id: String) {
    const eventData = 'Custom event data from parent';
    this.offerPosted.emit();
  }



  unSub(){
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  sub(){
    this.valueChangesSubscription = this.yourForm.valueChanges.subscribe((newValues) => {
      // This code will be executed whenever any value in the form changes.
      console.log(66, newValues)
      //this.determineValue()
    });    
  }

	categoryValidator(control: FormControl) {
		console.log(52, control.value);
	  if (control.value === 'default') {
	    return { 'defaultSelected': true };
	  }
	  return null;
	}

  onSubmit() {
	  if (this.yourForm.valid) {
	    // Submit the form
      this.postOffer();
	  } else {
	    // If the form is invalid, mark all controls as touched to trigger the validation messages
	    this.yourForm.markAllAsTouched();

	  }
  }

  @ViewChild('myoffersbtn') myOffersBtn: ElementRef;

  inputNewContent = false;
  inputHumanWritten = false;
  offer_headline: String = '';
  offer_lookingfor: String = '';
  offer_buyitnow = 0.00;
  offer_category: String = '';
  allowPointInput = true;

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

  offer_buywithpoints = 0;

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


  displayLinkConditions = false;
  displayNewsletterConditions = false;
  displayShoutoutConditions = false;
  displayAdSpaceConditions = false;
  displayDomainConditions = false;
  displayServiceConditions = false;
  displaySomethingElseConditions = false;
  rows = 5;
  linkPointValue = 0;

  looking_forAr = [];

  onOfferBuyItNowChange(newValue: number) {
    // Perform any actions or logic here based on the new value
    console.log('offer_buyitnow changed:', newValue);
    this.offer_buywithpoints = Math.floor(newValue / 25);
  }

  onCategorySelected(){

    this.offer_headline = this.offer_category
    this.yourForm.get('offer_buywithpoints').enable();
    this.yourForm.get('offer_headline').enable();

  	this.displayLinkConditions = false;
  	this.displayNewsletterConditions = false;
  	this.displayShoutoutConditions = false;
  	this.displayAdSpaceConditions = false;
  	this.displayDomainConditions = false;
  	this.displayServiceConditions = false;
  	this.displaySomethingElseConditions = false;

  	if(this.offer_category == "Link"){
  		this.displayLinkConditions = true;
  		this.yourForm.get('offer_buywithpoints').disable();
      this.yourForm.get('offer_headline').disable();
      this.offer_headline = ``;
  		this.offer_buywithpoints = 0;

      //this.yourForm.addControl('inputDr', this.fb.control('', Validators.required));
      this.yourForm.addControl('inputDr', this.fb.control([0, Validators.required]));
      this.yourForm.addControl('inputSiteTraffic', this.fb.control('', Validators.required));
      this.yourForm.addControl('inputPageTraffic', this.fb.control('', Validators.required));
      this.yourForm.addControl('primaryNiche', this.fb.control('', Validators.required));
      this.yourForm.addControl('inputNewContent', this.fb.control('', Validators.required));
      this.yourForm.addControl('inputHumanWritten', this.fb.control('', Validators.required));
      this.yourForm.addControl('inputDomain', this.fb.control('', Validators.required));

  	} else {
  		this.yourForm.get('offer_buywithpoints').enable();
  		this.offer_buywithpoints = 0;  		
      this.yourForm.get('offer_buywithpoints').enable();
      this.offer_headline = '';
      this.yourForm.removeControl('inputDr');
      this.yourForm.removeControl('inputSiteTraffic');
      this.yourForm.removeControl('inputPageTraffic');
      this.yourForm.removeControl('primaryNiche');
      this.yourForm.removeControl('inputNewContent');
      this.yourForm.removeControl('inputHumanWritten');
      this.yourForm.removeControl('inputDomain');
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

    if(this.offer_category == "default"){
      this.yourForm.get('offer_buywithpoints').disable()
      this.yourForm.get('offer_headline').disable()
    }

    this.offer_headline_el.nativeElement.focus();




  }

  @ViewChild('offer_headline_el') offer_headline_el: ElementRef;

async postOffer(){

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
      inputSiteTraffic: (Math.round(this.inputSiteTraffic / 500) * 500),
      inputPageTraffic: (Math.round(this.inputPageTraffic / 500) * 500),
      inputNiche:this.inputNiche,
      domain:this.inputDomain,

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

    obj['disable_parameter_checking'] = true;

    obj['website'] = 'www.google.com';

    let postOfferEndpoint = `/api/app/marketplace/postOffer`

    let post = await this.http.post(postOfferEndpoint, obj).toPromise();

    this.resetVariables();

    this.dismissModal();

    this.sendEventToChild('');
  }

  @ViewChild('myModal') myModal: ElementRef;

  dismissModal(){
    const modalElement: HTMLElement = this.myModal.nativeElement;
    this.renderer.selectRootElement(modalElement).dispatchEvent(new Event('click'));
    this.resetVariables();
  }

  refreshFlextables(){

  }

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

    this.offer_category = '';
    this.allowPointInput = true;
    Object.keys(this.yourForm.controls).forEach(key => {
    	this.yourForm.get(key).markAsPristine();
	});

    this.inputDr = null;
    this.inputNiche = null;
    this.inputHumanWritten = false;
    this.inputNiche = null;
    this.inputPageTraffic = null;
    this.inputSiteTraffic = null;
    this.offer_headline = '';

  	this.yourForm = this.fb.group({
        'offer_headline': ['', Validators.required],
        'offer_buywithpoints' : [0, Validators.required],
        'offer_category': ['default', [Validators.required, this.categoryValidator]]
      });

      this.yourForm.get('offer_buywithpoints').disable()
      this.yourForm.get('offer_headline').disable()

    }

  bValueDetermined = false;
  determineValue(){
    this.unSub();
    this.bValueDetermined = true;
    // Use Math.log to represent the natural logarithm function in JavaScript.
    // Add 1 to each of the logarithm terms to avoid taking log of 0.
    
    let drMultiplier = 0;

    if(this.inputDr > 10){
      drMultiplier = 0.15;
    }

    if(this.inputDr > 17){
      drMultiplier = 0.20;
    }

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
    if(this.inputSiteTraffic > 25000){
      siteTrafficScore = 0.4 * Math.log(this.inputSiteTraffic + 1);
    }

    if(this.inputSiteTraffic > 35000){
      siteTrafficScore = 0.5 * Math.log(this.inputSiteTraffic + 1);
    }

    if(this.inputSiteTraffic > 50000){
      siteTrafficScore = 0.6 * Math.log(this.inputSiteTraffic + 1);
    }

    if(this.inputSiteTraffic > 100000){
      siteTrafficScore = 0.7 * Math.log(this.inputSiteTraffic + 1);
    }

    if(this.inputSiteTraffic > 1000000){
      siteTrafficScore = 0.9 * Math.log(this.inputSiteTraffic + 1);
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

    if(this.inputNewContent == true){
      pageTrafficScore = 0;
      this.inputPageTraffic = 0;
    }
    // For boolean variables, assign a value of 1 if true and 0 if false.

    var newContentScore = this.inputNewContent ? 0.05 : 0;
    console.log(468, this.inputNewContent, 'New Content Score: ' + newContentScore);

    var humanWrittenScore = this.inputHumanWritten ? 0.50 : 0;
    console.log(471, this.inputHumanWritten, 'Human Written Score: ' + humanWrittenScore);

    // if(this.inputSiteTraffic > 100000){
    //   if(this.inputPageTraffic < 1){
    //     siteTrafficScore = 0.6 * Math.log(this.inputSiteTraffic + 1);
    //   }
    // }

    // if(this.inputSiteTraffic > 10000){
    //   if(this.inputPageTraffic < 1){
    //     siteTrafficScore = 0.6 * Math.log(this.inputSiteTraffic + 1);
    //   }
    // }

    // The final link value is the sum of all these weighted scores.
    var linkValue = siteDRScore + siteTrafficScore + pageTrafficScore + newContentScore + humanWrittenScore;

    if(this.inputDr > 20){
    if(this.inputHumanWritten){
      linkValue += 5;
    } else {
      linkValue -= 2;
    }}

    if(linkValue < 0){
      linkValue = 0;
    }

    this.linkPointValue = Math.min(Math.floor(linkValue), 100);
    console.log(503, this.inputDr, 'Link Value: ' + linkValue);

    const areAllInputsValid = this.checkInputs();
    console.log(552, areAllInputsValid)
    if(areAllInputsValid === false){
      this.sub();
      return;
    }
    console.log(516, areAllInputsValid); // Output: false

    this.offer_headline = `DR ${this.inputDr} Site in the ${this.inputNiche} niche with ${parseInt(this.inputSiteTraffic).toLocaleString()} site traffic and ${this.inputPageTraffic.toLocaleString()} page traffic`;

    if(this.inputNewContent){
      this.offer_headline = `(New Content) DR ${this.inputDr} Site in the ${this.inputNiche} niche with ${parseInt(this.inputSiteTraffic).toLocaleString()} site traffic`;
    }

    if(this.inputHumanWritten){
      this.offer_headline = `(Human Written) DR ${this.inputDr} Site in the ${this.inputNiche} niche with ${parseInt(this.inputSiteTraffic).toLocaleString()} site traffic & ${parseInt(this.inputPageTraffic).toLocaleString()} page traffic`;
    }

    console.log(505, this.inputHumanWritten)

    if((this.inputNewContent) && (this.inputHumanWritten)){
      this.offer_headline = `(New Content & HUMAN WRITTEN) DR ${this.inputDr} Site in the ${this.inputNiche} niche with ${parseInt(this.inputSiteTraffic).toLocaleString()} site traffic`;
    }

    this.offer_buywithpoints = this.linkPointValue;
    this.sub()
    return linkValue;
  }

  checkInputs() {
  return (
    this.inputDr !== null &&
    this.inputNiche !== null &&
    this.inputPageTraffic !== null &&
    this.inputSiteTraffic !== null
  );
}
}
