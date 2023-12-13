import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../services/data.service';
import { first } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  registerEndpoint = "/api/register";
  registrationData: any = { }

  // Our default account type.  Can be modified using query params
  accountType = "user";

  profileForm: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dataService: DataService) { 
  }

    ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
      // Access the query parameters
      console.log(30, queryParams);
      if(queryParams['account_type']){
        this.accountType = queryParams['account_type'];
      }

      this.profileForm = this.fb.group({
        account_type: [this.accountType],
        firstName: 'Adam'
      })
  }

     loading = false;

  async waitForRegistrationResponse(response: any){

    if(response == false){
      console.error("Login Failure");
      return;
    }
    
    this.dataService.setSharedData(response);
    this.dataService.setNames(response.firstName, response.lastName, "User");

    this.router.navigate([response.home]);

  }


}
