import { Component, Input, ViewChild, ElementRef, ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core';
import { NetworkRequestButtonComponent } from '../network-request-button/network-request-button.component'
import { DataService } from '../../../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';

import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

@Component({
  selector: 'app-prompt-playground',
  templateUrl: './prompt-playground.component.html',
  styleUrls: ['./prompt-playground.component.css']
})

export class PromptPlaygroundComponent implements OnInit, AfterViewInit {

	@Input() input: any = {
		input: "",
		comparisonTarget: "",
		prompt: "",
		prompt2: "",
		comparisonPrompt: "",
		output:"",
		result: "",
		info: {
			"id":"",
			"name":""
		},
		firstInputLabel: "",
		secondInputLabel: "",
		validation: { },
		functionName: "",
		functionId: ""
	}

	chunkSizes = [
		1000,
		2000,
		3000,
		4000,
		5000,
		6000,
		7000,
		8000,
		9000,
		10000,
		11000,
		12000,
		13000,
		14000,
		15000
	]
	chunkSize = 1000;

	@ViewChild('request') request: NetworkRequestButtonComponent;
	@ViewChild('updateRequestButton') updateRequestButton: NetworkRequestButtonComponent;
	@ViewChild('saveRequestButton') saveRequestButton: NetworkRequestButtonComponent;
	@ViewChild('validation') validation: ElementRef;
	@ViewChild('resultTextarea') resultTextArea: ElementRef;
	@ViewChild('functionInfo') functionInfo: ElementRef;

	bCreateNewMode = true;

	@Input() id: string = "";

	constructor(private cdr: ChangeDetectorRef, private dataService: DataService, private http: HttpClient, private router: Router,
    private route: ActivatedRoute) { }

	ngOnInit(){
		const paramValue = this.route.snapshot.paramMap.get('id');

		this.id = paramValue
	    
		console.log(34, this.id);
		if(this.id !== ""){
			// An ID was passed -- let's retrieve it.
			(async () => {
				let promptPayload = await this.http.get(`/api/datasource/gptfunctions/id/${this.id}`).toPromise();
				console.log(47, promptPayload)
				console.log(38, "works");

				this.payload = promptPayload['gptfunctions']
				this.input = this.payload;
				this.bCreateNewMode = false;
				this.saveRequestEndpoint = `api/datasource/gptfunctions/id/${this.id}`
				this.functionName = this.payload['functionName'];
				this.functionTemperature = this.payload['functionTemperature']
				this.setPayload();
				console.log(92, this.payload);
				
				// setInterval( () => {
				// 	this.setPayload();
				// }, 2500);
			})()
		}
	}

	ngAfterViewInit(){
		this.setPayload();
	}

	setPayload(){


		const validation = this.validation.nativeElement.value;

		console.log(81, validation);
		
		try {
			JSON.parse(validation)
		} catch(err){
			console.log(err, this.input.validation);

			alert("The validation must be a valid JSON object");
			return;
		}

		this.payload = {
			input: this.input.input,
			analysisTarget: this.analysisTarget,
			comparisonTarget: this.input.comparisonTarget,
			model: this.selectedModel,
			prompt: this.input.prompt,
			prompt2: this.input.prompt2,
			comparisonPrompt: this.input.comparisonPrompt,
			output: this.input.output,
			layer: this.layer,
			firstInputLabel: this.input.firstInputLabel,
			secondInputLabel: this.input.secondInputLabel,
			validation: JSON.parse(validation),
			functionName: this.functionName,
			chunkSize: this.chunkSize,
			functionId: this.functionId,
			functionTemperature: this.functionTemperature
		}	

		this.payload.functionTemperature = parseInt(this.payload.functionTemperature)

		this.functionInfo.nativeElement.value = JSON.stringify( { "functionId": this.input._id, "functionName": this.input.functionName }, null, 2 )
		console.log(45, this.payload);

	}

	requestEndpoint = '/api/chatgpt/promptExplorer';

	saveRequestEndpoint = 'api/datasource/gptfunctions'
	analysisTarget = 'body';
	selectedModel = 'gpt-3.5-turbo';
	functionName = "";
	functionCategory = "";
	functionTemperature = 1;
	functionId = "";

	targets = ['a','abbr','acronym','address','applet','area','article','aside','audio','b','base','basefont','bdi','bdo','big','blockquote','body','br','button','canvas','caption','center','cite','code',
	'col','colgroup','data','datalist','dd','del','details','dfn','dialog','dir','div','dl','dt','em','embed','fieldset','figcaption','figure','font','footer','form','frame','frameset','h1','h2','h3','h4',
	'h5','h6','head','header','hr','html','i','iframe','img','input','ins','kbd','label','legend','li','link','main','map','mark','meta','meter','nav','noframes','noscript','object','ol','optgroup','option',
	'output','p','param','picture','pre','progress','q','rp','rt','ruby','s','samp','script','section','select','small','source','span','strike','strong','style','sub','summary',
	'sup','table','tbody','td','template','textarea','tfoot','th','thead','time','title','tr','track','tt','u','ul','var','video','wbr'];

	layers = [ 'textContent','innerHTML','innerText', 'outerHTML'];
	layer = 'innerText'

	bPreventDefault = true;

	payload: any = {
		disable_parameter_checking: true,
		functionName: '',
		functionId: '',
    	input: '',
    	prompt: '',
    	prompt2: '',
    	comparisonPrompt: '',
    	output: '',
    	model: '',
    	comparisonTarget: '',
    	analysisTarget: '',
    	layer: '',
    	firstInputLabel: '',
    	secondInputLabel: '',
    	chunkSize: '',
    	validation: { },
    	temperature: 1
	}

	dropdown = [ "gpt-3.5-turbo", "gpt-4-32k" ];

	public stringify(obj: any): string {
	    return JSON.stringify(obj);
	  }

	  test = "abcd";

	preflight(){

		console.log(162, this.payload);

		//this.setPayload();
		//return this.payload;
		return false;
	}

	saveResponse($event){

		if(this.functionName.length < 5){
			alert("You must provide a descriptive name for this function");
			return;
		}

		// Prompt Saved
		this.saveRequestEndpoint = `api/datasource/gptfunctions/id/${$event['gptfunctions']['_id']}`
		console.log(168, this.saveRequestEndpoint);
	}

	updateResponse($event){
		console.log(127, $event);
	}

	waitForResponse(response){
		console.log(29, response.response);
		this.input.result = response.response;
		let content = JSON.stringify(response.response, null, 2);

		this.resultTextArea.nativeElement.innerHTML = content

		console.log(73, content);
	}

	async sendRequest($event){
		this.resultTextArea.nativeElement.innerHTML = "";
		this.setPayload();
		await this.request.startNetworkRequest($event, true, this.payload);
	}

	async saveNewRequest($event){
		this.setPayload();
		await this.saveRequestButton.startNetworkRequest($event, true, this.payload);
		this.bCreateNewMode = false;

	}

	async updateRequest($event){
		this.setPayload();
		await this.updateRequestButton.startNetworkRequest($event, true, this.payload);
	}
	
}
