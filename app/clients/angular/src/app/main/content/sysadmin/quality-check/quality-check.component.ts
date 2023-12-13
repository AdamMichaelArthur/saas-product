import { Component } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

@Component({
  selector: 'app-quality-check',
  templateUrl: './quality-check.component.html',
  styleUrls: ['./quality-check.component.css']
})

export class QualityCheckComponent {

	constructor(private http: HttpClient) { }

	async tableBtnClicked($event){
		alert($event.buttonName);
		if($event.buttonName == "Approve"){
		      let post = await this.http.get(`api/app/marketplace/approve/id/${$event.row._id}`).toPromise();
		    }

		if($event.buttonName == "Reject"){
		      let post = await this.http.get(`api/app/marketplace/reject/id/${$event.row._id}`).toPromise();
		    }
		

		}

}
