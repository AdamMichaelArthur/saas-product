import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})

export class ThreadComponent implements OnInit, OnChanges {

ngOnChanges(changes: SimpleChanges) {
    if (changes['parentEvent']) {
      this.parentEvent.subscribe(event => {
        console.log(23, event);
        this.getPost(event);
        // Your logic here...
      });
    }
  }

	comment = "";
  post_id = "";

	post = { 
    subject: '',
    post: '',
    posterEmail: '',
    posterName: '',
    replies: []
  } ;

  fullWidth = false;

	constructor(private http: HttpClient, private route: ActivatedRoute) { }

  async getPost(_id){
    let post = await this.http.get(`api/datasource/forums/id/${_id}`).toPromise();
    this.post_id = _id;
    this.post = post['forums'];
  }

	async ngOnInit(){

    const threadId = this.route.snapshot.paramMap.get('id');
    if(null !== threadId){
      this.fullWidth = true;
      await this.getPost(threadId);
      
    }
	}

  @Input() parentEvent;

  handleEvent($event){
    console.log(30, $event);
  }

	@Input() set panelId(value: string) {
	    this._panelId = value;
	    this.onDataChange();
	  }

	  get panelData(): string {
	    return this._panelId;

	  }

  @Input() childVar: string;
  @Output() closePanel = new EventEmitter<any>();

	_panelId: string = "abcd";

  onDataChange() {
  
  }

  async leaveComment(){

  	let submission = await this.http.post(`api/datasource/forums/array/id/${this.post_id}`,
  		{
		    "key": "replies",
    		"value": {
        		"poster": "$user_id",
            "posterEmail": "$user_email",
            "posterFirstName": "$user_first_name",
            "posterLastName": "$user_last_name",
        		"post": this.comment,
        		"created_at": "$created_at",
        		"modified_at": "$modified_at"
    	}
  	}).toPromise();

  	this.comment = '';
  	this.closePanel.emit(true);

  }

}
