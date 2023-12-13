import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header.component'
import { DataService } from '../../../services/data.service';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile-pic',
  templateUrl: './profile-pic.component.html',
  styleUrls: ['./profile-pic.component.css']
})

export class ProfilePicComponent implements OnInit {

  bHeaderImage: boolean = false;
  
  data: any;
  private dataSubscription: Subscription = Subscription.EMPTY;

  constructor(private dataService: DataService, private cookieService: CookieService, private router: Router) { }

  profileName: String = "";
  firstName: String = "";
  lastName: String = "";
  fInitial: String = "";
  lInitial: String = "";
  accountType: String = "";
  //dataService: DataService = new DataService()
  //data: any = null;
  //private dataSubscription: Subscription = new Subscription();

  ngOnInit(): void {
  	//this.dataService: DataService = new DataService()

	this.dataSubscription = this.dataService.data$.subscribe(data => {
        this.data = data;
        //this.profileName = data;

   });

    this.dataSubscription = this.dataService.public_fName$.subscribe(data => {

      this.firstName = data;
      if(data)
        this.fInitial = data[0]
     });

    this.dataSubscription = this.dataService.public_lName$.subscribe(data => {

      this.lastName = data;
      if(data)
        this.lInitial = data[0]
     });  

    this.dataSubscription = this.dataService.public_accountType$.subscribe(data => {
      this.accountType = data;
     });  

  }

	signOut(event: Event){
		event.preventDefault();
		this.cookieService.delete('Authorization', '/');
		this.router.navigate(['/login']);
	}

}
