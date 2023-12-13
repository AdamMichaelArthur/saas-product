import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

	profile: any = {
		fullName: "",
		about: "",
		company:  "",
		job:  "",
		country:  "",
		address: "",
		phone: "",
		email: ""
	}

	settings: any = {
		accountChanges:true,
		newProducts:true,
		marketingAndPromos:true,
		securityAlerts:true,
	}

	password: any = {
		oldPassword: "",
		newPassword: "",
		confirmNewPassword: ""
	}

  constructor(private http: HttpClient) { }

  async ngOnInit() {
  	let profile = await this.http.get(`/api/main/user/profile/getProfile`).toPromise();
  	this.profile = profile['profile'];

  	let settings = await this.http.get(`/api/main/user/profile/getSettings`).toPromise();
  	this.settings = settings['settings'];
  	console.log(43, this.settings);

  }

  async onSubmit() {
  	let saveResult = await this.http.post(`/api/main/user/profile/save`, this.profile).toPromise();
  	alert("Changes Saved");
  }

  async saveSettings(){
	let saveResult = await this.http.post(`/api/main/user/profile/saveSettings`, this.settings).toPromise();
  	alert("Changes Saved");  	
  }

  async changePassword(){
  	if(this.password.newPassword !== this.password.confirmNewPassword){
  		alert("The new password and the confirmation do not match");
  		return;
  	}

  	if(this.password.newPassword.length < 4){
  		alert("Passwords must be at least four characters long");
  		return;
  	}

    let alertMsg = "Password Changed";

     try {
      var changePasswordResult = await this.http.post(`/api/changePassword`, this.password).toPromise();
     } catch(err){
       alertMsg = err.error.Context;
     }

     this.password = { };
  	alert(alertMsg);

  }

}
