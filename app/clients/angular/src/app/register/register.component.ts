import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { DataService } from '../services/data.service';
import { first } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { NetworkRequestButtonComponent } from '../reusable/ui/network-request-button/network-request-button.component'

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  @ViewChild('createAccount') createAccountButton: NetworkRequestButtonComponent;

registrationForm: FormGroup;
registerEndpoint = "/api/register";
registrationData: any = { }

// Our default account type.  Can be modified using query params
accountType = "user";

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dataService: DataService) {}

  ngOnInit() {

    const queryParams = this.route.snapshot.queryParams;

    if(queryParams['account_type']){
        this.accountType = queryParams['account_type'];
    }

    this.registrationForm = this.formBuilder.group({
      firstName: ['Adam', Validators.required],
      lastName: ['Arthur', Validators.required],
      userId: ['adamarthur513@gmail.com', [Validators.required, Validators.email]],
      pwd: ['dino', Validators.required],
      termsAndConditions: [true, Validators.requiredTrue],
      account_type: [this.accountType]
    });
  }

  submitForm() {
    if (this.registrationForm.valid) {
      const formData = { ...this.registrationForm.value };
      console.log(36, formData);
    }
  }

  async waitForRegistrationResponse(response: any){

    if(response == false){
      console.error("Login Failure");
      return;
    }
    
    console.log(68, response);

    this.dataService.setSharedData(response);
    this.dataService.setNames(response.fName, response.lName, "User");

    if(typeof response["redirect-override"] !== 'undefined'){
       window.location.href = response["redirect-override"];
       return;
    }  

    this.router.navigate([response.home]);

  }

}
