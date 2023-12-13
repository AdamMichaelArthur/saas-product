import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

	notifications: number = 0;
	messagesCount: number = 0;

	testCount: number = 0;
	messagesAr: any = [ ];

  	data: any;
  	private dataSubscription: Subscription = Subscription.EMPTY;

	notificationsAr: any = [ ]

	pointsBalance: number = 0;
	cashBalance: number = 0;

	constructor(public dataService: DataService, private cookieService: CookieService, private router: Router) { }


	  ngOnInit(): void {


		this.dataSubscription = this.dataService.publicNotificationsAr$.subscribe(data => {
	        this.notificationsAr = data?.notifications;
	        this.notifications = data?.count
	   });

		this.dataSubscription = this.dataService.publicMessagesAr$.subscribe(data => {
	        this.messagesAr = data?.messages;
	        this.messagesCount = data?.count
	   });

		this.dataSubscription = this.dataService.public_fName$.subscribe(data => {

	   });

		this.dataSubscription = this.dataService.public_lName$.subscribe(data => {

	   });	

	   this.dataService.public_cashBalance$.subscribe(data => {
	   		this.cashBalance = data;
	   })

	   this.dataService.public_pointsBalance$.subscribe(data => {
	   		this.pointsBalance = data;
	   })

	   setInterval( ()=> {
	   		this.updateCountdown()
	   }, 1000);

	  }

	onChatButtonClick($event: Event): void {
		$event.preventDefault();
    	this.dataService.notifyChatButtonClick();
  	}

	handleSidebarClick(){
	    const sidebar = document.querySelector('body');
	    sidebar?.classList.toggle('toggle-sidebar');
	}

	signOut(event: Event){
		event.preventDefault();
		this.cookieService.delete('Authorization', '/');
		this.router.navigate(['/login']);
	}

    // Your target date as an ISO string
    isoString = "2023-09-15T00:00:00.000Z";
    
    Countdown: any = '';

	updateCountdown() {

			console.log(88, this.Countdown)

            var now: Date = new Date();
			var targetDate: Date = new Date("2023-09-15T00:00:00.000Z");
            var difference = targetDate.getTime() - now.getTime()
            console.log(91, targetDate.getTime() - now.getTime());

            // // Calculate days, hours, minutes, and seconds
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            console.log(97, days, hours, minutes, seconds);

            // // Display the countdown
            this.Countdown = `Free For the next ${days}d ${hours}h ${minutes}m ${seconds}s`;
            console.log(103, this.Countdown)
        }

}
