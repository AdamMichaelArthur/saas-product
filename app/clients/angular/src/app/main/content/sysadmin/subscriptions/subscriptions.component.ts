import { Component, OnInit, ViewContainerRef, ViewChild, Output } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})

export class SubscriptionsComponent implements OnInit {

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
  }

  headerButtonClicked(event: any){

  }

  tableButtonClicked(requestResult: any){

  }

  closePanel(newVar: string) {
    this.drawer.toggle()
  }
  
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('targetDiv', { read: ViewContainerRef }) targetDiv: ViewContainerRef;

  panelId = "";

  activePanel(componentInfo: any){
    this.panelId = componentInfo._id;
    this.drawer.toggle()
  }
}
