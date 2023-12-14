import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {

  offerForm: FormGroup;
  offer: object;
  protectedInfo = '*********************';
  showProposals = false;
  myProposal = false;
  ref_doc_id = '';
  escrowed = false;
  showPrivateMessages = false;
  type: string = '';
  exchange = 'exchange'
  questionsForm: FormGroup;
  messagesForm: FormGroup;
  questions = [];
  messages = [];
  message = "";
  bPostQuestion = false;
  bPostMessage = false;

  headline = "";
  category = "";
  looking_for = "";

  offer_type = "Offer"

  postQuestionForm(){
    this.bPostQuestion = !this.bPostQuestion;
  }

  postMessageForm(){
    this.bPostMessage = !this.bPostMessage;
  }

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private http: HttpClient) {}

  async ngOnInit() {

  	const id = this.route.snapshot.params['id']; // This will give you the value of the 'id' parameter from the URL
  	
  	// Do a network request to get the offers document 
  	console.log('ID parameter:', id);

    var response: any = await this.http.get(`api/datasource/offers/id/${id}`).toPromise();

    this.offer = response.offers;    
    this.type = this.offer['type'];
    if(this.type == "request"){
      this.offer_type = "Request";
    }
    
    this.headline = this.offer['headline'];
    this.category = this.offer['category'];
    this.looking_for = this.offer['looking_for'].toString();
    if(this.offer['questions']){
      this.questions = this.offer['questions'];
    }

    if(this.offer['messages']){
      this.messages = this.offer['messages']
    }

    this.offerForm = this.formBuilder.group({
      category: [response.offers.category, Validators.required],
      headline: [response.offers.headline, Validators.required],
      inputDr: [response.offers.inputDr, Validators.required],
      inputPageTraffic: [response.offers.inputPageTraffic, Validators.required],
      inputSiteTraffic: [response.offers.inputSiteTraffic, Validators.required],
      looking_for: ['test'],
      pointsCost: [response.offers.pointsCost, Validators.required],
      status: [response.offers.status, Validators.required]
    });

    this.questionsForm = this.formBuilder.group({
      question: ['']
    });

    this.messagesForm = this.formBuilder.group({
      message: ['']
    })

    this.offerForm.disable();

     try {
     var protectedInfo: any = await this.http.post(`/api/app/marketplace/getSensitiveInfo`, 
       {     
         "ref_doc_id":id,
        "key":"website",
        "coll":"offers"
       }).toPromise();

    if(protectedInfo !== null){
      this.protectedInfo = protectedInfo.result;
      this.showProposals = true;
      this.offerForm.enable();
    }

    } catch(err) {
      // Do nothing...
    }
 
    console.log(36, response);
    this.ref_doc_id = id;

    

    await this.getMyProposal();
    // /datasource/bounties/id/61e4044ca1c5307319a86a8b

    if(response['offers']['state'] == 'escrowed'){
      this.escrowed = true;
      this.showPrivateMessages = true;
      this.showProposals = false;
      this.myProposal = true;

    }
  }

  async addQuestionForm(){

  }

  async addMessageForm(){

  }

  async getMyProposal(){
     console.log(69, this.ref_doc_id);

     try {
       var myProposal = await this.http.post(`/api/app/marketplace/getMyProposal`, { ref_doc_id: this.ref_doc_id } ).toPromise();
       
     } catch(err){
       console.log(74, err);
     }

     if(myProposal['result'].length > 0){
       this.myProposal = true;
     }
     console.log(76, myProposal['result'].length);
  }

  onSubmit() {
    if (this.offerForm.valid) {
      console.log('Form submitted:', this.offerForm.value);
      // You can perform further actions here, like sending the data to the server
    } else {
      // Form is invalid, show validation errors if needed
    }
  }

  question = "";

  async postQuestion(){

    if(this.question.length < 1){
      alert("You must write something in the question box");
      return;
    }

    let submission = await this.http.post(`api/app/marketplace/question/id/${this.ref_doc_id}`,
      {
        "key": "questions",
        "value": {
            "post": this.question
      },
      'offer': this.offer
    }).toPromise();

    await this.refreshPage();
    //this.question = "";

  }

  async postEncryptedMessage(){

    if(this.message.length < 1){
      alert("You must write something in the question box");
      return;
    }

    let submission = await this.http.post(`api/app/marketplace/message/id/${this.ref_doc_id}`,
      {
        "key": "messages",
        "value": {
            "post": this.message
      },
      'offer': this.offer
    }).toPromise();

    this.message = '';
    await this.refreshPage();
  }

  async refreshPage(){
    var response: any = await this.http.get(`api/datasource/offers/id/${this.ref_doc_id}`).toPromise();
    this.offer = response.offers;    
    this.bPostQuestion = false;
    if(this.offer['questions']){
      this.questions = this.offer['questions'];
    }

    if(this.offer['messages']){
      this.messages = this.offer['messages']
    }
  }

}