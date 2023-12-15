import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, NavigationEnd } from '@angular/router';
import { BaseComponent } from "./legacy/base/base.component"
import { BaseService } from "./legacy/base/base.service"
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'saas-product';

  constructor(cookieService: CookieService, private router: Router) {

    const currentPath = this.router.url;

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentPath = event.urlAfterRedirects;

      const cookieExists: boolean = cookieService.check('Authorization');
      if (cookieExists) {
        this.router.navigate([currentPath]);
      } else {
        this.router.navigate(['/login']);
      }

    });

    return;

    }
  }