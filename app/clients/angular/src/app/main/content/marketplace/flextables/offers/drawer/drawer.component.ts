import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})

export class DrawerComponent {

	_panelId: string = "abcd";
	@Input() childVar: string;

	@Output() childVarChange = new EventEmitter<string>();
	//@Output() public parentEvent = new EventEmitter<any>();
	  
  	@Input() parentEvent;

	@Input() set panelId(value: string) {
	    this._panelId = value;
	    this.onDataChange();
	  }

	get panelData(): string {
	    return this._panelId;

	}

	onDataChange() {

	}

	goBack(): void {
    	this.childVarChange.emit("");
  	}

}
