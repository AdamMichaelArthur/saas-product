import { Component, OnInit, ElementRef, Input, EventEmitter } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { BaseComponent } from '../../base/base.component';
import { NavigationExtras, Router } from '@angular/router';
import { SharedService } from '../../_services/shared.service';

@Component({
  selector: 'menu-flex-dropdown',
  templateUrl: './view-dropdown.component.html',
  styleUrls: ['./view-dropdown.component.css']
})

export class FlexMenuComponent implements OnInit {

  // options
  @Input() key = "";
  @Input() distinct = ""
  // @Input() all = true;
  // @Input() test = "";
  @Input() data = []
  // options related to navigating to new route
  @Input() flowToNewRoute: boolean = false;
  @Input() routeToGoTo: string = "";
  /* The mongo _id of the document this collection represents */
  @Input() _id: string = "";

  /* The key inside the document that represents the date */
  @Input() _dateKey: string = "";

  /* The value of the _key */
  @Input() _dateValue: string = "";

  @Input() _variableData: object = {}

  @Input() date: any;

  @Input() dynamicRoutes = "";
  dynamicRoutesAr: Array<string> = []
  // @Input() dynamicRoutesAr: Array<any> = []
  // options related to navigating to new route ends
  // options

  // dummy data for custom drop down

  @Input() private updateMenuItem: EventEmitter<object>;

  isDropdownSelectdFirst = true;
  isDropdownSelectd = false;
  isDropdown = false;
  select_default_val = null;
  number: 0
  openDropDown() {
    this.isDropdown = !this.isDropdown;
    
  }

  hideDropDown(value: any) {

    console.log(66, "hideDropDown", this.routeToGoTo)

    if (this.flowToNewRoute) {
      this.sharedService._id = this._id
      this.sharedService._dateKey = this._dateKey
      this.sharedService._dateValue = this._dateValue
      this.sharedService._variableData = this._variableData
      this.sharedService.date = this.date

      console.log(63, this.sharedService, this.dynamicRoutesAr);

      if(this.dynamicRoutesAr.length > 0){
        //console.log(64, this.data.indexOf(value), this.data, value)
        var arPos = this.data.indexOf(value)
        var dynamicRoute = this.dynamicRoutesAr[arPos]
        console.log(76, dynamicRoute)
        //return this.openInNewTab(this.router,  b)
        return this.router.navigate([dynamicRoute]);
      }

      this.sharedService.routingToBountyDetail = true
      this.router.navigate([this.routeToGoTo]);
      //this.openInNewTab(this.router, this.routeToGoTo)
    }

    console.log(65, this.flowToNewRoute);

    return;
  }

  openInNewTab(router: Router, namedRoute) {
    let newRelativeUrl = router.createUrlTree([namedRoute]);
    let baseUrl = window.location.href.replace(router.url, '');

    window.open(baseUrl + newRelativeUrl, '_blank');
}

  // dummy data for custom drop down end

  fruits: Array<string> = []

  constructor(public service: BaseService, public elementRef: ElementRef, private router: Router, public sharedService: SharedService) {
    //super(service, elementRef)
    // this.fruits = ["Apple", "Orange", "Banana"]
    console.log(73, this.dynamicRoutes)
  }

  ngOnInit(){

    console.log(typeof this.data[0], this.data)
    if(typeof this.data[0] != "string")
      this.data = this.data[0]  

    console.log(102, this.dynamicRoutes)
    if(this.dynamicRoutes.length > 0)
      this.dynamicRoutesAr = this.dynamicRoutes.split(",")

    console.log(101, this._variableData);
    
  }
}
