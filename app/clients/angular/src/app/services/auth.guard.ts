import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}
  canActivate() {
    const cookieExists: boolean = this.cookieService.check('Authorization');
    if (cookieExists) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }



  }
}
