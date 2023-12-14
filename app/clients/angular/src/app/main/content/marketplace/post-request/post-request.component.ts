import { Component, OnInit, ViewContainerRef, ViewChild, EventEmitter, Input,
  Output, ElementRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';


import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

@Component({
  selector: 'app-post-request',
  templateUrl: './post-request.component.html',
  styleUrls: ['./post-request.component.css']
})

export class PostRequestComponent {

  constructor(private http: HttpClient, private renderer: Renderer2) { }

  @ViewChild('myModal') myModal: ElementRef;
  @Output() updateRequestsTable = new EventEmitter<void>();

  selectedCategory = "";
  comment = '';
  subject = '';
    categories = [
  	'Link',
  	'Newsletter',
  	'Social Media Shoutout',
  	'Ad Space',
  	'Domain',
  	'Service',
  	'Something Else'
  ];

  offer_headline = "";
  offer_category = "";
  offer_lookingfor = "";
  offer_marketvalue = "";

  resetVariables() {

  }

  async postRequest(){

	let stringToSplit = this.offer_lookingfor;
	let splitArray = stringToSplit.split('\n');

	//console.log(142, splitArray);

	let payload = {
      headline: this.offer_headline,
      category: this.offer_category,
      marketvalue: this.offer_marketvalue,
      looking_for: this.offer_lookingfor,
      type: 'request',
      status: 'available'
	}

	var obj = Object.fromEntries(Object.entries(payload).filter(([key, value]) => value !== null));


    let post = await this.http.post(`api/datasource/offers`, obj).toPromise();
     this.updateRequestsTable.emit();
    this.dismissModal();
   
  }

  dismissModal() {
    const modalElement: HTMLElement = this.myModal.nativeElement;
    this.renderer.selectRootElement(modalElement).dispatchEvent(new Event('click'));
    alert("Your Request Has Been Published To The Marketplace");
    this.resetVariables();
  }

}
