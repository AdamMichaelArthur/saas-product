import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})

export class AsideComponent {

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService) { 
  }

  menus: any[] = [];

  async ngOnInit() {
      const tmp = this.dataService.getSharedData();
      this.dataService.startPolling();
      if (typeof tmp !== 'undefined') {
        this.menus = tmp.menus;
      } else {
        try {
              const response: any = await this.http.get('/api/getNavigationMenus').toPromise();
              this.menus = response["menus"];

              let userInfo = response["userInfo"];

              const first_name = userInfo?.first_name ?? false;
              const last_name = userInfo?.last_name ?? false;
              const account_type = userInfo?.account_type ?? false;

              this.dataService.setNames(first_name, last_name, account_type);

              const balance = userInfo?.balance ?? 0;
              const points = userInfo?.points ?? 0;
              this.dataService.setBalances(balance, points)

          } catch (error) {
            // Handle login error
            console.log(39, "error");
          }

      }
  }

}
