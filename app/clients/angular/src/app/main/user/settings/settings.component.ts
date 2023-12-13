import { Component, OnInit } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

	openAIAPIKey = '';
	linkGmailEndpoint = '/api/google/gmail/authorize';
	linkbuttonclass = 'link-button';
	
	/* Google Services */
	linkDocsEndpoint = '/api/google/docs/getAuthorizationUrl'					// Requests scopes for docs, sheets, drive, presentations
	linkAnalyticsEndpoint = '/api/google/analytics/getAuthorizationUrl'		
	searchConsoleEndpoint = '/api/google/search/getAuthorizationUrl'

	constructor(private http: HttpClient) { }

	ngOnInit(): void {
		this.getOpenAIAPIKey();
	}

	gmailAuthorizationUrl($event){
		console.log(19, $event['redirect_uri']);
		window.location = $event.redirect_uri;
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
