import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-flex-dropdown',
  templateUrl: './flex-dropdown.component.html',
  styleUrls: ['./flex-dropdown.component.css']
})

// @Component({
//   selector: 'app-flex-dropdown',
//   templateUrl: './view-dropdown.component.html',
//   styleUrls: ['./view-dropdown.component.css']
// })

export class FlexDropdownComponent extends BaseComponent implements OnInit {

  // options
  @Input() key = "";
  @Input() distinct = ""
  @Input() all = true;
  @Input() initialNone = false;
  @Input() dynamicRoutes: string = "";
  @Input() dynamicRoutesAr: Array<any> = []
  @Input() disableDropdownDelete: boolean = true;

  // options

  // dummy data for custom drop down
    data = [
      {
        id: 3,
        name: "dp 3",
        select_val: ["Banana 1","Banana 2","Banana 3"]
      }
    ]
    
    isDropdownSelectdFirst = true;
    isDropdownSelectd = false;
    isDropdown = false;
    @Input() select_default_val = "adam";
    @Output() change = new EventEmitter();

    number:0
    openDropDown(){
      this.isDropdown = !this.isDropdown;
      //this.select_default_val = value
      //console.log(63, "openDropDown")
    }

    onSelected($value){
      //console.log(47, this.select_default_val)
      this.select_default_val = $value
      this.change.emit(this.select_default_val);
      //console.log(49, this.select_default_val)
    }

    hideDropDown(value:any){
      return;
      this.isDropdown = false;
      this.isDropdownSelectd = true;
      this.isDropdownSelectdFirst = false;
      this.select_default_val = value
      console.log(71, "hideDropDown")
    }

    removeArrayItem(value: any){
      console.log(65, value);
    }
  // dummy data for custom drop down end

  fruits: Array<string> = []

  constructor(public override service: BaseService, public override elementRef: ElementRef) {
    super(service, elementRef)
    this.fruits = ["Apple", "Orange", "Banana"]
    // this.dynamicRoutesAr = JSON.parse(this.dynamicRoutes)
    // console.log(77, this.dynamicRoutes)
  }

  override ngOnInit(): void {

    this.service.getDistinctArray(this.key, this.distinct, this.all).subscribe((data: any) => {
      console.log(22, data);
      this.fruits = data;
    })
  }
}