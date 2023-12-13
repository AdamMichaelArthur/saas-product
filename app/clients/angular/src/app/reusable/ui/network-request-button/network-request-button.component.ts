import { Component, OnInit, Input, Output, EventEmitter, ContentChild, AfterContentInit, ElementRef } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { TimeoutError } from 'rxjs';

@Component({
  selector: 'network-request-button',
  templateUrl: './network-request-button.component.html',
  styleUrls: ['./network-request-button.component.css']
})
export class NetworkRequestButtonComponent implements OnInit, AfterContentInit {

  @ContentChild('buttonText', { static: false }) buttonTextElement!: ElementRef;

  constructor( private http: HttpClient) {  }

  ngAfterContentInit() {
    if (this.buttonTextElement) {
      const buttonText = this.buttonTextElement.nativeElement.t
      this.button_text = buttonText;
      this.initial_button_text = buttonText;
      console.log(18, buttonText); // Output: "Login"
      // Perform other actions using the buttonText variable
    }
  }

  @Input() request: string = "";
  @Input() payload: object = {};
  @Input() verb: string = "GET";
  @Input() customClasses: string = "";
  @Input() fullWidth: string = "d-grid gap-2 mt-3";
  @Input() useContainer: boolean = true;
  @Input() icon: string = "";
  @Input() preventDefault: boolean = false;

  @Output() result: EventEmitter<any> = new EventEmitter<any>();

  httpVerb: string = "GET";

  @Input() disabled: boolean = false;

  material_icon = ""

  // Initial state
  idle: boolean = true;

  // Request Initiated
  loading: boolean = false;

  // Success
  success: boolean = false;

  // Failure
  failure: boolean = false;

  // Show the circle
  circle: boolean = false;

  button_text = "Network Request Button"

  initial_button_text = "";

  // Move text to the left
  shouldApplyMoveToLeftAnimation: boolean = false;
  
  errorMessage: String = "";

  state: number = 0;

  reset(){
    this.idle = true;
    this.loading = false;
    this.success = false;
    this.failure = false;
    this.circle = false;
    this.disabled = false;
    this.shouldApplyMoveToLeftAnimation = false;
  }

  ngOnInit(): void {
  	this.initial_button_text = this.button_text;
  }

  async startLoader(){
    this.loading = true;
    this.circle = true;
  }

  setError(errorMessage){
            this.material_icon = "error"
          this.errorMessage = errorMessage;
          this.loading = false;
          this.failure = true;
          this.shouldApplyMoveToLeftAnimation = true;
          this.state = 3;
          this.result.emit(false);
          setTimeout( () => {
            this.loading = false;
            this.idle = true;
            this.failure = false;
            this.success = false;
            this.circle = false;
            this.shouldApplyMoveToLeftAnimation = false;
            this.button_text = this.initial_button_text;
            this.material_icon = "";
            this.disabled = false;
          }, 5000);  
  }

  /* Default timeout is 10 seconds */
  @Input() timeoutDuration: any = 10000;
  @Input() preflightCallback: any = null;
  async preFlight(){
    if(this.preflightCallback !== null){
      return this.preflightCallback();
    }
    return false;
  }

  async startNetworkRequest($event: any, preventDefault: boolean = false, payload: any = false){

    var Payload = this.payload;
    
    let preflightResult = await this.preFlight();

    if(preflightResult !== false){
      Payload = preflightResult;
      console.log(128, preflightResult)
    }

    if(this.disabled){
      return false;
    }
    
    

    this.loading = false;
    this.material_icon = "";
    this.success = false;
    

    if(payload !== false){
      Payload = payload;
    }

    if(this.preventDefault !== false){
      if(preventDefault !== false){

      } else {

        return;
        // Do nothing
      }
    } else {
        // Do nothing
    }

  	this.loading = true;
  	this.circle = true;

    console.log(113, this.payload);

    this.timeoutDuration = parseInt(this.timeoutDuration) 

    this.httpVerb = this.verb;

    this.disabled = true;
  		try {
        if(this.httpVerb == "GET"){
  			  var response: any = await this.http.get(this.request).pipe(timeout(this.timeoutDuration)).toPromise();
        }
        if(this.httpVerb == "POST"){
          var response: any = await this.http.post(this.request, Payload).pipe(timeout(this.timeoutDuration)).toPromise();
        }
        if(this.httpVerb == "PUT"){
          var response: any = await this.http.put(this.request, Payload).pipe(timeout(this.timeoutDuration)).toPromise();
        }
        if(this.httpVerb == "PATCH"){
          var response: any = await this.http.patch(this.request, Payload).pipe(timeout(this.timeoutDuration)).toPromise();
        }
        if(this.httpVerb == "DELETE"){
          var response: any = await this.http.delete(this.request, Payload).pipe(timeout(this.timeoutDuration)).toPromise();
        }
  		} catch(err: any){

        console.log(128, err.status);

        if (err instanceof TimeoutError) {
          this.setError("The request timed out: it took too long to complete");
          return;
        }

        if (err instanceof HttpErrorResponse) {

          // Handle HttpErrorResponse
          console.error('An HTTP error occurred:', err);
          if(typeof err["error"]["ErrorDetails"] !== 'undefined'){
            this.setError(err["error"]["ErrorDetails"]["Description"])
            return;
          }

          this.setError("We seem to be offline or there is a problem accessing the server");
          return;
        } else {   

          if(typeof err["error"]["ErrorDetails"] !== 'undefined'){
    			  const errorMessage = err["error"]["ErrorDetails"]["Description"];
    			  this.setError(errorMessage)
          } else {
            this.setError("We seem to be offline or there is a problem accessing the server");
          }
    			return;
        }
        this.setError("We seem to be offline or there is a problem accessing the server 2");
        return;
  		}

  	this.loading = false;
  	this.material_icon = "done";
  	this.success = true;
    this.result.emit(response);


    setTimeout( () => {
      this.disabled = false;
      this.reset();
    }, 5000)
  }

  sendDataToParent() {
    const data = 'Data to be returned';
	this.result.emit(data);
  }

}
