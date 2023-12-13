import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { BaseComponent } from '../../base/base.component';
import { Output, EventEmitter } from '@angular/core';

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
  @Input() datasource = ""
  @Input() id = "";
  @Output() itemRemoved = new EventEmitter<any>();
  @Input() disableDropdownDelete: boolean = true;
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

  removeArrayItem(value: any){
      console.log(65, value);
      this.service.pullFromArray(this.id, this.key, value, true).subscribe(
               (data: any) => {   
     
           for(var i = 0; i < this.data.length; i++){
             if(this.data[i] == value){
               this.data.splice(i, 1);
               this.itemRemoved.emit({ id: this.id, key: this.key, value: value })
             }
           }    
      });
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

    console.log(70, this.disableDropdownDelete);

    this.service.key = this.datasource;

    // this.service.getDistinctArray(this.key, this.distinct, this.all).subscribe((data: any) => {
    //   console.log(22, data);
    //   this.fruits = data;
    // })
  }
}
