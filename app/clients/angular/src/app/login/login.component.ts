import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { BaseService} from "../legacy/base/base.service"
import { NetworkRequestButtonComponent } from '../reusable/ui/network-request-button/network-request-button.component'
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router,
    public dataService: DataService,
    private globalService: GlobalService,
    public service: BaseService) { 
  }

  @ViewChild('login') loginButton: NetworkRequestButtonComponent;
  @ViewChild('firstDigit') firstDigit: ElementRef;

  corporationObj = "10";

  username = "";
  password = "";

  rememberMe: boolean = false;

  authorizeEndpoint = "/api/authorize";

  loginData: any = { }

  ngOnInit(): void {
    this.loginData = {
      "userId": this.username,
      "pwd": this.password 
    }
    const cookieValue = this.cookieService.get('rememberMe');
    if(cookieValue != ""){
      try {
        var loginData = JSON.parse(cookieValue)
      } catch(err){
        // Unable to parse cookie...  
        return;
      }
      this.loginData = loginData;
      this.rememberMe = true;
    }

    console.log(36, cookieValue);
  }

  async waitForLoginResponse(response: any){

    if(response == false){
      console.error("Login Failure");
      return;
    }

    this.dataService.setSharedData(response);
    this.dataService.setNames(response.fName, response.lName, "User");
    this.dataService.setPlan(response.plan);
    this.dataService.setAttachedPaymentMethod(response['paymentMethodAttached'])

    let home = response.home;
    if(typeof response.home === 'undefined'){
      home = "/main/user/home"
    }    

    this.router.navigate([home]);

    if(this.rememberMe == true){
      this.cookieService.set('rememberMe', JSON.stringify(this.loginData));
    }
  }

  async onLogin() {

  }

  bRecoverAccount = false;

  async recoverAccount($event){
    $event.preventDefault();
    if(this.loginData.userId.length < 5){
      alert("Please enter a valid email address to get a recovery code");
      return;
    }

    this.bRecoverAccount = !this.bRecoverAccount;
    //this.firstDigit.nativeElement.select();

  }

  async tryLogin($event){
    this.loginButton.startNetworkRequest($event);
  }

}
