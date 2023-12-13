import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-getpaid',
  templateUrl: './getpaid.component.html',
  styleUrls: ['./getpaid.component.css']
})

export class GetpaidComponent implements OnInit {

	loginLink = "";

	constructor(private http: HttpClient) {}

	async ngOnInit(){
		try {
			var response: any = await this.http.get(`/api/affiliates/getStripeLogin`).toPromise();
		} catch(err){
			console.log(err);
		}

		this.loginLink = response.stripe_login_link.url;
		console.log(22, this.loginLink);
	}
	// getStripeLogin

}
