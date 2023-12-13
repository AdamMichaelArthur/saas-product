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

      if(currentPath.toString().includes("#")){
        return;
      }

      if(currentPath.toString().includes("?")){
        return;
      }
      
      console.log(currentPath);

      if (currentPath.includes('/yourfullschool')) {
        this.router.navigate([currentPath]);
        return;
      }

    if (currentPath.includes('/application')) {
      this.router.navigate([currentPath]);
    }
   else {
        const cookieExists: boolean = cookieService.check('Authorization');
        if (cookieExists) {
          this.router.navigate(['/main/marketplace']);
        } else {
          this.router.navigate(['/login']);
        }
      }
    });

    return;

    }
  }

