import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'view-flex-dropdown',
  templateUrl: './view-dropdown.component.html',
  styleUrls: ['./view-dropdown.component.css']
})

export class ViewDropdownComponent implements OnInit {

  // options
  @Input() key = "";
  @Input() distinct = ""
  @Input() all = true;
  @Input() data = []
  @Input() test = []
  // options

  // dummy data for custom drop down

  isDropdownSelectdFirst = true;
  isDropdownSelectd = false;
  isDropdown = false;
  select_default_val = null;
  number: 0
  openDropDown() {
    this.isDropdown = !this.isDropdown;
    console.log(63, "openDropDown", this.test)
  }

  hideDropDown(value: any) {
    return;
    this.isDropdown = false;
    this.isDropdownSelectd = true;
    this.isDropdownSelectdFirst = false;
    this.select_default_val = value
    console.log(71, "hideDropDown")
  }
  // dummy data for custom drop down end

  fruits: Array<string> = []

  constructor(public service: BaseService, public elementRef: ElementRef) {
    //super(service, elementRef)
    // this.fruits = ["Apple", "Orange", "Banana"]
  }

  ngOnInit(): void {
    console.log(510, this.data);
    // this.service.getDistinctArray(this.key, this.distinct, this.all).subscribe((data: any) => {
    //   console.log(22, data);
    //   this.fruits = data;
    // })
  }
}
