import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {

 // Retrieve the headers from the resolved data
    const headers = this.route.snapshot.data['headers'];

    // Extract the necessary information from the headers and set the cookie
    const cookieValue = headers.get('CookieValueHeader');
    const cookieName = headers.get('CookieNameHeader');
    // Set the cookie using ngx-cookie-service
    // Adjust the expiry and path as needed

    console.log(24, headers);
    //this.cookieService.set(cookieName, cookieValue, 1, '/');


  }

}
