import { Component, OnInit, ViewContainerRef, ViewChild, EventEmitter, Output, ElementRef, Renderer2 } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FlextableComponent } from "../../../../../reusable/ui/flextable/flextable.component"
import { FormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { ProposeExchangeComponent } from '../../propose-exchange/propose-exchange.component';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})

export class OffersComponent {
    constructor(public dialog: MatDialog) {}

    offer_buyitnow; offer_headline; offer_buywithpoints; offer_category;

rows = 5;
  offer_lookingfor: String = '';

    proposeExchange(){
      alert("Use addtoarray!");
    }

    onOfferBuyItNowChange(newValue: number) {
      // Perform any actions or logic here based on the new value
      console.log('offer_buyitnow changed:', newValue);
      this.offer_buywithpoints = Math.floor(newValue / 25);
    }


	  @ViewChild('drawer') drawer: MatDrawer;
	  @ViewChild('flextable') flextable: FlextableComponent;
  	@ViewChild('targetDiv', { read: ViewContainerRef }) targetDiv: ViewContainerRef;
    @ViewChild('requestModal', { static: true }) requestModal!: ElementRef;
    @ViewChild('proposeExchangeDialog') proposeExchangeDialog: ProposeExchangeComponent;

  	@Output() childVarChange = new EventEmitter<string>();

  	@Output() public parentEvent = new EventEmitter<any>();

  	sendEventToChild(_id: String) {
    	const eventData = 'Custom event data from parent';
    	this.parentEvent.emit(_id);
  	}

  	panelId = "";

  	activePanel(componentInfo: any){
    	this.panelId = componentInfo._id;
    	this.drawer.toggle()
  	}

	headerButtonClicked(event: any){
  		alert(event)
	}

	tableButtonClicked(requestResult: any){

      let buttonName = requestResult["buttonName"];
      let id = requestResult["_id"];
      let row = requestResult["row"];
      

      if(buttonName == "Propose Exchange"){
        //this.dialog.open(ProposeExchangeComponent);
        this.proposeExchangeDialog.openDialog();
      }

    	//alert( "clicked" );
    	//console.log(40, "clicked", requestResult);
    	//this.drawer.toggle();
    	//this.sendEventToChild(requestResult["_id"]);
	}

	closePanel(newVar: string) {
    	this.drawer.toggle()
	}

  postOffer(){

  }
   	
}
