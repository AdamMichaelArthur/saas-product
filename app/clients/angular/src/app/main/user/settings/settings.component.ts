import { Component, OnInit } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

	openAIAPIKey = '';
	
	linkbuttonclass = 'link-button';
	
	interval = null;

	/* Google Services */
	linkGmailEndpoint = 'https://easy-oauth.saas-product.com/api/public/callbacks/google/gmail/getAuthorizationUrl';
	linkSlackEndpoint = 'https://easy-oauth.saas-product.com/api/public/callbacks/slack/getAuthorizationUrl';
	linkDocsEndpoint = '/api/google/docs/getAuthorizationUrl'					// Requests scopes for docs, sheets, drive, presentations
	linkAnalyticsEndpoint = '/api/google/analytics/getAuthorizationUrl'		
	searchConsoleEndpoint = '/api/google/search/getAuthorizationUrl'

	constructor(private http: HttpClient) { }

	ngOnInit(): void {
		this.getOpenAIAPIKey();
		this.linkSlackEndpoint = this.linkSlackEndpoint + "?webhookUrl=" + this.getProtocolAndDomain();
	}

	getProtocolAndDomain() {
	  const url = window.location.href;
	  const protocol = document.location.protocol;
	  const hostname = document.location.hostname;
	  return `${protocol}//${hostname}/api/public/callbacks/slack/event`;
	}

  /*	In a production app, you'll likely want to setup your own google api projects.
			gmailAuthorizationUrl($event){
				console.log(19, $event['redirect_uri']);
				window.location = $event.redirect_uri;
			}		
  */

	/* I've setup a service called "easy-oauth" which is designed to simplify getting auth tokens during development */
	async gmailAuthorizationUrl($event) {
	    // Make a call to retrieve the token
	    console.log(19, $event);
	    window.open($event.redirect_uri, '_blank');
	    clearTimeout(this.interval);
	    this.interval = setInterval( async () => {
	    	// Check to see if we've got a token yet
	    	let request = `https://easy-oauth.saas-product.com/api/public/callbacks/google/gmail/retrieveToken`
	    	let payload = {
	    		retrievalKey: $event["retrievalKey"]
	    	}
	    	var response: any = await this.http.post(request, payload).pipe(timeout(5000)).toPromise();
	    	console.log(54, response);

	    	if ("token" in response) {
				    console.log("The 'tokens' key exists in the response.");

				    clearTimeout(this.interval);
				    let request = `api/google/gmail/saveToken`
				    let payload = {
				    	"token": response.token
				    }

						var response: any = await this.http.post(request, payload).pipe(timeout(5000)).toPromise();
						alert("Gmail Linked");

				} else {
				    console.log("The 'tokens' key does not exist in the response.");
				}



	    }, 1500);
	}

  async slackAuthorizationUrl($event){
			console.log(19, this.getProtocolAndDomain());

	    window.open($event.redirect_uri, '_blank');
	    clearTimeout(this.interval);

	    	this.interval = setInterval( async () => {
	    	// Check to see if we've got a token yet
	    	let request = `https://easy-oauth.saas-product.com/api/public/callbacks/slack/retrieveToken`
	    	let payload = {
	    		retrievalKey: $event["retrievalKey"]
	    	}

	    	console.log(94, payload);

	    	var response: any = await this.http.post(request, payload).pipe(timeout(5000)).toPromise();
	    	console.log(54, response);

	    	if ("token" in response) {
				    console.log("The 'tokens' key exists in the response.");

				    clearTimeout(this.interval);
				    let request = `api/slack/saveToken`
				    let payload = {
				    	"token": response.token
				    }

						var response: any = await this.http.post(request, payload).pipe(timeout(5000)).toPromise();
						alert("Slack Linked");

				} else {
				    console.log("The 'tokens' key does not exist in the response.");
				}



	    }, 1500);

  }

	docsAuthorizationUrl($event){
		window.location = $event.redirect_uri;
	}

	analyticsAuthorizationUrl($event){
		console.log(34, $event);
		window.location = $event.redirect_uri;
	}

	searchConsoleAuthorization($event){
		window.location = $event.redirect_uri;
	}

	async saveOpenAIAPIKey(){
		let saveResult = await this.http.post(`/api/main/user/saveOpenAIAPIKey`, { "openAIAPIKey": this.openAIAPIKey } ).toPromise();
  		alert("Changes Saved");  	
  	}

  	async getOpenAIAPIKey(){
  		let apiKey = await this.http.get('api/main/user/getOpenAIAPIKey').toPromise();
  		this.openAIAPIKey = apiKey['api_key'];
  	}
}
