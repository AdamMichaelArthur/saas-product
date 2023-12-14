import { Component, OnInit, HostListener, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';

declare var YT: any;
declare function gtag_report_conversion(url: string): void;

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css'],
  animations: [
      trigger('slideUpDown', [
        state('show', style({
          transform: 'translateY(0)',
        })),
        state('hide', style({
          transform: 'translateY(100%)',
        })),
        transition('show => hide', [
          animate('0.5s ease-out'),
        ]),
        transition('hide => show', [
          animate('0.5s ease-in'),
        ]),
      ])
    ]
})

export class WebsiteComponent implements OnInit, AfterViewInit {


  adjective = ["Excited", "Anxious", "Overweight", "Demonic", "Jumpy", "Misunderstood", "Squashed", "Gargantuan","Broad", "Crooked", "Curved", "Deep", "Even","Excited", "Anxious", "Overweight", "Demonic", "Jumpy", "Misunderstood", "Squashed", "Gargantuan","Broad", "Crooked", "Curved", "Deep", "Even", "Flat", "Hilly", "Jagged", "Round", "Shallow", "Square", "Steep", "Straight", "Thick", "Thin", "Cooing", "Deafening", "Faint", "Harsh", "High-pitched", "Hissing", "Hushed", "Husky", "Loud", "Melodic", "Moaning", "Mute", "Noisy", "Purring", "Quiet", "Raspy", "Screeching", "Shrill", "Silent", "Soft", "Squeaky", "Squealing", "Thundering", "Voiceless", "Whispering"] 
  object = ["Taco", "Operating System", "Sphere", "Watermelon", "Cheeseburger", "Apple Pie", "Spider", "Dragon", "Remote Control", "Soda", "Barbie Doll", "Watch", "Purple Pen", "Dollar Bill", "Stuffed Animal", "Hair Clip", "Sunglasses", "T-shirt", "Purse", "Towel", "Hat", "Camera", "Hand Sanitizer Bottle", "Photo", "Dog Bone", "Hair Brush", "Birthday Card"]
  list;

  generator() {
    return this.adjective[Math.floor(Math.random() * this.adjective.length)] + " " + this.object[Math.floor(Math.random() * this.object.length)];
  }

  @HostListener('window:unload', ['$event'])

  unloadHandler(event: Event): void {
    console.log('Unload event triggered', event);
    // Do more things
    navigator.sendBeacon(this.url, JSON.stringify({ "action": "hello", "msg": `${this.visitorName} left.` }));
  }

  bDidAnything = false;
  bScrolled = false;
  visitorName;

  startTime = new Date();
  url = "api/public/analytics/click";  

	offerForm: FormGroup;

  websites = [];
  website = "";
  applicationsReceived = 0;
  applicationsApproved = 0;
  remainingApprovals = 0;

  public form: FormGroup;

  @Output() isVisible: EventEmitter<boolean> = new EventEmitter();

  private observer: IntersectionObserver;

  getRandomNumber(): number {

    const randomValue = Math.random(); // Generates a random float between 0 and 1

    if(randomValue < 0.50){
      return 1;
    }

    return 2;

    if (randomValue < 1 / 3) {
      return 1;
    } else if (randomValue < 2 / 3) {
      return 2;
    } else {
      return 3;
    }
  }

  variant = 0;
  variant1 = false;
  variant2 = false;
  variant3 = false;
  variant4 = false;
  default = false;

  loadVariant(variant){
    this.variant1 = false;
    this.variant2 = false;
    this.variant3 = false;
    this.variant4 = false;   
    this.default = false; 

    if(variant == 1){
      this.variant1 = true;
    }

    if(variant == 2){
      this.variant2 = true;
    }

    if(variant == 3){
      this.variant3 = true;
    }

    if(variant == 4){
      this.variant4 = true;
    }

    this.variant = variant;
  }

  referrer: string = "";
  ad: string = "";
  video = "";

  private queryParamSubscription: Subscription;

  loadedTime: Date;
  formSubmitTime: Date;

  queryParams = {};

	constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private http: HttpClient, private el: ElementRef) {

      this.loadedTime = new Date();
      this.formSubmitTime = new Date();

      this.visitorName = this.generator();

        this.form = new FormGroup({
          firstName: new FormControl('', Validators.required),
          lastName: new FormControl('', Validators.required),
          emailAddress: new FormControl('', [Validators.required, Validators.email]),
          screenName: new FormControl(''),
          websitesOffered: new FormControl('', Validators.required),
          role: new FormControl('', Validators.required),
          combinedTraffic: new FormControl('', Validators.required),
          hasLinks: new FormControl(false),
          hasNewsletter: new FormControl(false),
          hasSocialMedia: new FormControl(false),
          hasContentCreation: new FormControl(false),
          hasTechnicalServices: new FormControl(false),
          hasOther: new FormControl(false),
          bAcceptsTerms: new FormControl(false, WebsiteComponent.mustBeChecked),
          bAcceptsPhilosophy: new FormControl(false)
          // ... other form controls as needed
        });

        var num = this.getRandomNumber();
        this.loadVariant(num);
        
        this.queryParamSubscription = this.route.queryParams.subscribe(params => {
          if (params.hasOwnProperty('ref')) {
            this.referrer = params['ref'];
          }

          if (params.hasOwnProperty('ad')) {
            this.ad = params['ad'];
          }

          if (params.hasOwnProperty('video')){
            this.video = params['video'];
          }

          this.queryParams = params;

          console.log(177, params)

        });


        // if(num == 1){
        //   this.displayPopup = true;
        // }

        // this.form = new FormGroup({
        //   firstName: new FormControl('Adam', Validators.required),
        //   lastName: new FormControl('Arthur', Validators.required),
        //   emailAddress: new FormControl('adamarthursandiego@gmail.com', [Validators.required, Validators.email]),
        //   screenName: new FormControl('iansa4219'),
        //   websitesOffered: new FormControl('www.website.co,', Validators.required),
        //   role: new FormControl('admin', Validators.required),
        //   combinedTraffic: new FormControl('10000', Validators.required),
        //   hasLinks: new FormControl(false),
        //   hasNewsletter: new FormControl(false),
        //   hasSocialMedia: new FormControl(false),
        //   hasContentCreation: new FormControl(false),
        //   hasTechnicalServices: new FormControl(false),
        //   hasOther: new FormControl(false),
        //   bAcceptsTerms: new FormControl(false, WebsiteComponent.mustBeChecked),
        //   bAcceptsPhilosophy: new FormControl(false)
        // });
          // ... other form controls as needed


  }

  showBox: boolean = false;
  showBottomBannerBox: boolean = false;
  displayCount = 0;
  socialProofTimer: any;

  displayPopup = false;
  applicationEmail = "";

  closePopup(){
    this.displayPopup = false;
  }
  
  formSubmitted = false;
  async startApplication(variant){
    //this.displayPopup = false;
    //window.location.hash = "application"
    this.formSubmitted = true;
    this.displayPopup = false;
    this.loadVariant(0);

    this.default = true;

    this.formSubmitTime = new Date();
    var seconds = 0;
    var minutes = 0;
    var remainingSeconds = 0;

    if (this.loadedTime && this.formSubmitTime) {
      // Get time difference in milliseconds
      const timeDifference = this.formSubmitTime.getTime() - this.loadedTime.getTime();

      // Convert to seconds and minutes
      seconds = Math.floor(timeDifference / 1000);
      minutes = Math.floor(seconds / 60);

      // Remaining seconds after minutes are accounted for
      remainingSeconds = seconds % 60;

      console.log(`Time difference: ${minutes} minutes and ${remainingSeconds} seconds`);
    }

   try {
        let post = await this.http.post(`/api/public/analytics/submitApplication`, { 
          "variant": variant, 
          "email":this.applicationEmail, 
          "website": this.website, 
          "referrer": this.referrer, 
          "ad": this.ad,
          "visitorName": this.visitorName,
          "timeToSubmission": `${minutes}:${String(remainingSeconds).padStart(2, '0')}`,
          ... this.queryParams
        } ).toPromise();
      } catch(err){

    }

    //gtag_report_conversion("/application");

  }



  async ngAfterViewInit(){

    const response: any = await this.http.get(`/api/public/analytics/incrementApplicationPageHitCount`).toPromise();
    if(this.referrer !== ""){
      navigator.sendBeacon(this.url, JSON.stringify({ "action": "hello", "msg": `${this.visitorName} joined us from ${this.referrer} via ad: ${this.ad}` }));
    } else {
      navigator.sendBeacon(this.url, JSON.stringify({ "action": "hello", "msg": `${this.visitorName} joined us directly` }));
    }

    if(this.referrer === ""){
      this.referrer = "Direct";
      this.ad = "none"
    }

    let obj = {             
      source: this.referrer,
      ad: this.ad,
      visitorName: this.visitorName ,
      variant: this.variant
    }

    if(this.video != ""){
      obj['video'] = this.video
    }

    console.log(259, obj, this.referrer, this.ad, this.visitorName);

    try {
        let post = await this.http.post(`/api/public/analytics/trackPageHitSource`, 
          obj ).toPromise();
      } catch(err){
        // Handle the error...
    }

    setInterval( async () => {

      navigator.sendBeacon(`/api/public/analytics/updateTimeOnSite`, JSON.stringify(obj));

      // try {
      //     let post = await this.http.post(`/api/public/analytics/updateTimeOnSite`, 
      //       obj ).toPromise();
      //   } catch(err){

      // }      
    }, 2000);

    // if (window['YT']) {
    //   this.startVideo();
    // } else {
    //   // If not loaded yet, wait for the script to load before proceeding.
    //   window['onYouTubeIframeAPIReady'] = () => this.startVideo();
    // }

  }

player: any;

@ViewChild('youtubePlayer', { static: false }) youtubePlayer: ElementRef;

startVideo(): void {

  // this.player = YT.get(this.youtubePlayer.nativeElement.id);

  // this.player = new YT.Player(this.youtubePlayer.nativeElement, {
  //   events: {
  //     'onReady': (event) => {
  //       // event.target.playVideo(); // Uncomment if you want the video to autoplay on load
  //       console.log(174, this.player)
  //     },
  //     'onStateChange': (event) => this.onPlayerStateChange(event)
  //   }
  // });
}

onPlayerStateChange(event): void {
  if (event.data === YT.PlayerState.PLAYING) {
    console.log('Video is playing');
    // Call your function here
  }
}

  sendBeacon(url, payload){
    navigator.sendBeacon(url, JSON.stringify(payload));
  }


  socialProofMessages = [
    'msg 1',
    'msg 2',
    'msg 3',
    'msg 4',
    'msg 5',
    'msg 6',

  ];

  socialProofTitles = [
    'title 1',
    'title 2',
    'title 3',
    'title 4',
    'title 5',
    'title 6',

  ]

  handleVisibility($event){
    alert("Huh")
  }

	async ngOnInit(){
    window.addEventListener('scroll', this.scroll, true);

	  this.offerForm = this.formBuilder.group({

      
      // category: [response.offers.category, Validators.required],
      // headline: [response.offers.headline, Validators.required],
      // inputDr: [response.offers.inputDr, Validators.required],
      // inputPageTraffic: [response.offers.inputPageTraffic, Validators.required],
      // inputSiteTraffic: [response.offers.inputSiteTraffic, Validators.required],
      // looking_for: ['test'],
      // pointsCost: [response.offers.pointsCost, Validators.required],
      // status: [response.offers.status, Validators.required]
    });

    // this.socialProofTimer = setInterval(() => {
    //   this.showBox = !this.showBox;
    //   this.displayCount++;
    //   setTimeout( () => {
    //     this.showBox = false;
    //   }, 5000);

    //   if(this.socialProofTimer > 6){
    //     clearInterval(this.socialProofTimer);
    //   }
    // }, 65000);


    const response: any = await this.http.get(`/api/public/analytics/getTotalRegisteredApplications`).toPromise();
    this.remainingApprovals = response.result;
    //console.log(60, remainingApprovals);

	}

  toggleSpreadsheet(): void {
  window.open('https://docs.google.com/spreadsheets/d/1PXCApAhrMhlcfgalyI1CJfJGsQh6pILzY4-UON-DqGo/edit#gid=0', '_blank');
}

dismissBanner(){
  this.bannerDismissed = true;
  this.showBottomBannerBox = false;
}

bannerDismissed = false;
scroll = (): void => {

  return;

  if(this.bannerDismissed == true){
    this.showBottomBannerBox = false;
    return;
  }

    const scrollPosition = window.pageYOffset;
    const screenHeight = window.innerHeight;
    if (scrollPosition > screenHeight * 0.40) { // 5% of the viewport height
      this.showBottomBannerBox = true;
    } else {
      this.showBottomBannerBox = false;
    }

    //console.log(159, this.form.get('firstName').touched);

    if(this.form.get('firstName').touched){
      this.showBottomBannerBox = false;
    }
  }

toggleBox(): void {
    this.showBottomBannerBox = !this.showBottomBannerBox;
  }

closeBox(): void {
    this.showBox = false;
  }

get stateName() {
    return this.showBox ? 'show' : 'hide';
  }


  addWebsite(){
    this.websites.push(this.website);
    this.website = "";
  }

  submitted = false;

  static mustBeChecked(control: FormControl) {
    return control.value === true ? null : { mustBeChecked: true };
  }

  async onSubmit($e) {
    $e.preventDefault();

    //

    if (this.form.valid) {
      const formData = this.form.value;

      try {
        let post = await this.http.post(`/api/public/analytics/submitApplication`, formData ).toPromise();
        this.submitted = true;
      } catch(err){
        // Handle the error...
      }
    }
  }

  async notifySlack(msg =""){
    navigator.sendBeacon("http://localhost:4201", JSON.stringify({ "action": "d", "msg": msg }));
  }

}
