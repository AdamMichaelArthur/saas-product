import { Component, OnInit, ElementRef, ViewChild, HostListener, Renderer2 } from '@angular/core';

import { BaseComponent } from '../../../legacy/base/base.component';
import { BaseService } from '../../../legacy/base/base.service'
import { SharedService } from '../../../legacy/_services/shared.service'
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Router, NavigationExtras } from '@angular/router'


interface Frequency {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-child2',
  templateUrl: './child2.component.html',
  styleUrls: ['./child2.component.css']
})

export class Child2Component {

  isoDateString = "";

  constructor(private renderer: Renderer2) {
    this.isoDateString = new Date().toISOString()
  }

  ngOnInit() {

  }

  headerButtonClicked(event: any){
  	alert(event)
  }

  tableButtonClicked(requestResult: any){
    alert( JSON.stringify(requestResult ) );
  }

}

