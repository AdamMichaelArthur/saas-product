import { Component, OnInit } from '@angular/core';
import {AddDomainComponent } from './add-domain/add-domain.component'
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.css']
})

export class DomainsComponent implements OnInit {

	isVisible = true;

	activeDomains = [ ]

	async ngOnInit() {
		var claimedDomains: any = await this.http.get(`/api/affiliates/getClaimedDomains`).toPromise();
		console.log(claimedDomains);
		this.activeDomains = claimedDomains.result;
	}

	async removeDomain($event, domainId){

		try {
		var response: any = await this.http.post(`/api/affiliates/removeDomain`, { "domainId" : domainId }).toPromise();
		} catch(err){
			console.log(err);
			return false;
		}

		var claimedDomains: any = await this.http.get(`/api/affiliates/getClaimedDomains`).toPromise();
		this.activeDomains = claimedDomains.result;

	}

	async addDomain(){
		if(this.domain.length <= 0){
			return false;
		}

		let rootDomain = this.getRootDomain(this.domain);

		try {
			var response: any = await this.http.post(`/api/affiliates/addDomain`, { "domain" : rootDomain }).toPromise();
		} catch(err){
			console.log(err);
			return false;
		}

		var claimedDomains: any = await this.http.get(`/api/affiliates/getClaimedDomains`).toPromise();
		this.activeDomains = claimedDomains.result;
		
	}

	domain: string;

	constructor(public dialog: MatDialog, private http: HttpClient) {}

	  openDialog(): void {
	  	let dialogRef = this.dialog.open(AddDomainComponent);

	    // const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
	    //   data: {name: this.name, animal: this.animal},
	    // });

	    // dialogRef.afterClosed().subscribe(result => {
	    //   console.log('The dialog was closed');
	    //   this.animal = result;
	    // });
	  }

	getRootDomain(urlString) {
		  let hostname = '';
		  try {
		    const parsedUrl = new URL(urlString);
		    hostname = parsedUrl.hostname;
		  } catch (error) {
		    const match = urlString.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
		    if (match) {
		      hostname = match[1];
		    } else {
		      return this.getRootDomain('https://' + urlString);	
		    }
		  }

		  const parts = hostname.split('.').reverse();

		  // Check if there is a subdomain
		  if (parts.length > 2) {
		    return parts[1] + '.' + parts[0];
		  }
		  return hostname;
	}
}
