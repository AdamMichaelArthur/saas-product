import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signups',
  templateUrl: './signups.component.html',
  styleUrls: ['./signups.component.css']
})

export class SignupsComponent implements OnInit {

	constructor(private http: HttpClient) {}

	referredAccounts = [];

	async ngOnInit(){

		try {
			var response: any = await this.http.get(`/api/affiliates/getReferredAccounts`).toPromise();
		} catch(err){
			console.log(err);
		}

		this.referredAccounts = response.result;

	}

}
