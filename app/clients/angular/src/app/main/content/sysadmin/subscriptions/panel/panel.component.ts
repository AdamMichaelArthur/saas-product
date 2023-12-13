import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SubscriptionObject } from './subscription.model';

@Component({
  selector: 'subscription-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})


export class PanelComponent {

	_panelId: string = "abcd";

  model = new SubscriptionObject("", "", 0);

  submitted = false;

  onSubmit() { 

    console.log(25, this.model);

    this.submitted = true; 

  }

	@Input() set panelId(value: string) {
	    this._panelId = value;
	    this.onDataChange();
	  }

	  get panelData(): string {
	    return this._panelId;

	  }

  @Input() childVar: string;
  @Output() childVarChange = new EventEmitter<string>();

  updateChildVar() {
    const newVar = 'New Value';
    this.childVarChange.emit(newVar);
  }

  dismiss(){
  	this.childVarChange.emit("");
  }

  onDataChange() {
    console.log(26, "Child Data changed:", this._panelId);
    this.model = new SubscriptionObject("", "", 0);
    this.model.planName = this._panelId;
  }

goBack(): void {
    this.childVarChange.emit("");
  }

}
