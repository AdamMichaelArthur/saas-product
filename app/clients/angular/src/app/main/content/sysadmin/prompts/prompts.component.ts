import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-prompts',
  templateUrl: './prompts.component.html',
  styleUrls: ['./prompts.component.css']
})

export class PromptsComponent{

  constructor() {}


	funcId = "64954882a882c0cbffaa3fcf";

	gptFunctions = [];

	input = {
		input: "https://northhamptonvets.com/super-fluffy-cat-breeds/",
		comparisonTarget: "https://petkeen.com/fluffy-cat-breeds/",
		prompt: "You have been given the <head> ElementRef from two html documents: labeled Document 1 and Document 2.  Your task is to identify the target keywords of both documents, using information gleaned from the <head>.",
		output:"Output in JSON format.  Use two keys: \"document_1\": [], and \"document_2\": [].  Put the target keywords from each in their respective arrays.",
		result: "result textarea",
		selectedModel:  "",
		info: {
			"id":"12345",
			"name":"Function Name"
		},
		firstInputLabel: "Document 1",
		secondInputLabel: "Document 2",
		validation: {
 			"document_1": [],
 			"document_2":[]
		}

	}

	createGptFunction(){
		this.gptFunctions.push("");
	}

}
