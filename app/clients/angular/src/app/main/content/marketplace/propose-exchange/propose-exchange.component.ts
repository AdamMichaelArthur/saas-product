import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { OffersComponent } from '../flextables/offers/offers.component'

@Component({
  selector: 'app-propose-exchange',
  templateUrl: './propose-exchange.component.html',
  styleUrls: ['./propose-exchange.component.css']
})

export class ProposeExchangeComponent implements OnInit {

	@Input() rowData: Object;

	@ViewChild('btn') btn: ElementRef;
	@ViewChild('offerDialog') offerDialog: OffersComponent;

	ngOnInit(){

		setTimeout( () => {

			//

		}, 5000);

	}

	openDialog(){
		this.btn.nativeElement.click();
	}

}
