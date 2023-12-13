import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { GenericLoadingButtonComponent } from '../../generic-loading-button/generic-loading-button.component'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'variable-state-button',
  templateUrl: './variable-state-button.component.html',
  styleUrls: ['./variable-state-button.component.css']
})

export class VariableStateButtonComponent extends GenericLoadingButtonComponent implements OnInit {

	states = [];
	currentState = null;

	cond1: any;
	cond2: any;

	displayText = "";

	displayed = false;

	endpoint = '';
	payload = {};
	confirmText;

	@Input('rowIndex') rowIndex = 0; 

	buttonName;

	@Input('stateInput') stateInput;
	@Input('row') row: any = {}
	@Input('stateIndex') stateIndex;
	options;

	badge = false;

	@Output() public networkActionCompleted = new EventEmitter<any>();

	constructor(private http: HttpClient) { 
		super();
	}

	ngOnInit(){
		console.log(26, this.row);
		//let row = 0;
		let pos = 0;
		
		for(var i = 0; i < this.stateInput.length; i++){
			if(i !== this.stateIndex){
				continue;
			}

			let state = this.stateInput[i];

			console.log(47, state);

			if(!state.conditionals){
				continue;
			}

			let conditionalsObj = Object.keys(state.conditionals);
			let conditionalValues: any = Object.values(state.conditionals);			

			let pass = true;

			for(let i = 0; i < conditionalsObj.length; i++){
				if(conditionalValues[i][0] == "$"){
					conditionalValues[i] = conditionalValues[i].substring(1);
					//console.log(41, i, conditionalsObj[i], conditionalValues[i]);
					//console.log(42, this.row[conditionalsObj[i]], this.row[conditionalValues[i]])

					if(this.row[conditionalsObj[i]] !== this.row[conditionalValues[i]]){
						pass = false;
					} else {
						this.endpoint = state.endpoint;
						this.payload = this.row;
						this.confirmText = state.confirmText;
					}
				} else {
					
					console.log(67, i, conditionalsObj[i], conditionalValues[i]);
					console.log(68, this.row[conditionalsObj[i]], this.row[conditionalValues[i]])

					if(conditionalValues[i][0] == "!"){

						conditionalValues[i] = conditionalValues[i].substring(1);
						if(this.row[conditionalsObj[i]] === this.row[conditionalValues[i]]){
							pass = false;
						} else {
							this.endpoint = state.endpoint;
							this.payload = this.row;
							this.confirmText = state.confirmText;
						}

						//pass = true;


					} else {
					if(this.row[conditionalsObj[i]] !== conditionalValues[i]){
						pass = false;
						}
					}}
				}

			
			
			if(pass){
				this.displayText = state.displayText;
				this.options = state;
				if(state.badge === true){
					this.badge = true;
				}
				this.displayed = true;
			}			

			} 
			// if(state.state != this.row.status){
			// 	//console.log(31, state.state, this.row.status);
			// 	continue;
			// }
			
			// if(!state.conditionals){
			// 	//console.log(36, 'continuing');
			// 	continue;
			// }


			


			// console.log(40, state, this.stateInput[pos], conditionalsObj, conditionalValues);


				//console.log(42, conditionalsObj, conditionalValues);
					// let pass = true;

					// for(let i = 0; i < conditionalsObj.length; i++){
					// 	if(conditionalValues[i][0] == "$"){
					// 		conditionalValues[i] = conditionalValues[i].substring(1);
					// 		console.log(41, i, conditionalValues[i], this.row[conditionalsObj[i]], conditionalsObj[i])
					// 		if(this.row[conditionalsObj[i]] !== this.row[conditionalValues[i]]){
					// 			pass = false;
					// 		}
					// 	} else {
					// 		console.log(46, this.row[conditionalsObj[i]], conditionalValues[i]);
					// 		if(this.row[conditionalsObj[i]] !== conditionalValues[i]){
					// 			pass = false;
					// 		}
					// 	}
					// }



				//console.log(33, state.conditionals);
				//this.displayText = "Waiting On Seller"
				//if(state.conditionals){

					

				//} else {
				//	this.displayText = "Conditionals false"
				//}
			
			//}
			//row++;
		//	pos++;
		//}
		this.buttonName = this.displayText;
		console.log(161, this.rowIndex)

	}

	async performStateAction(){
		//this.displayed = false;
		if(typeof this.confirmText !== 'undefined'){
		let bConfirmed = confirm(this.confirmText);
		if(bConfirmed === false){
			return false;
		}}

		this.payload['disable_parameter_checking'] = true;

		console.log(168, this.payload);

		try {
			var result = await this.http.post(this.endpoint, this.payload).toPromise();
			this.networkActionCompleted.emit({buttonName: this.buttonName, rowIndex: this.rowIndex, networkRequestResult: true})
		} catch(err){	
			this.networkActionCompleted.emit({buttonName: this.buttonName, rowIndex: this.rowIndex, networkRequestResult: false})
		}
		console.log(143, result)
	}

	setStates(states: Array<any>){
		this.states = states;
	}

	setConditionals(cond1: any, cond2: any){
		this.cond1 = cond1;
		this.cond2 = cond2;
	}

	setState(state: any){
		if(-1 !== this.states.indexOf(state)){
			this.currentState = state;
		} else {
			return false;
		}
	}



}
