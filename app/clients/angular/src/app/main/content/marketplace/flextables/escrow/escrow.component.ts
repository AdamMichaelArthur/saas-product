import { Component } from '@angular/core';

@Component({
  selector: 'app-escrow',
  templateUrl: './escrow.component.html',
  styleUrls: ['./escrow.component.css']
})

export class EscrowComponent {

	tableButtonClicked(requestResult: any){
    	//alert( "clicked" );
    	console.log(40, "clicked", requestResult);
    	//this.drawer.toggle();
    	//this.sendEventToChild(requestResult["_id"]);
	}
	
}
