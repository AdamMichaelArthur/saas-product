import { Component, OnInit, Input, Output, EventEmitter, ContentChild, AfterContentInit, ElementRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'row-button',
  templateUrl: './rowbutton.component.html',
  styleUrls: ['./rowbutton.component.css']
})

export class RowbuttonComponent {

  @Input() customClasses: string = "";
  @Input() fullWidth: string = "d-grid gap-2 mt-3";
  @Input() useContainer: boolean = true;
  @Input() disabled: boolean = false;
  @Input() row: any = {}
  @Output() tableBtnClicked = new EventEmitter<boolean>();

  httpVerb: string = "GET";

  material_icon = ""

  // Initial state
  idle: boolean = true;

  // Request Initiated
  loading: boolean = false;

  // Success
  success: boolean = false;

  // Failure
  failure: boolean = false;

  // Show the circle
  circle: boolean = false;

  button_text = "Network Request Button"

  initial_button_text = "";

  // Move text to the left
  shouldApplyMoveToLeftAnimation: boolean = false;
  
  errorMessage: String = "";

  state: number = 0;

  startLoader(){
    console.log(51, this.row)
    this.tableBtnClicked.emit(this.row);
  }

  stopLoader(){

    this.tableBtnClicked.emit(false);
  }

}
