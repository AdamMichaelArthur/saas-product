import { Component, OnInit, ViewContainerRef, ViewChild, Output } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FlextableComponent } from "../../../../reusable/ui/flextable/flextable.component"

@Component({
  selector: 'app-planmanagement',
  templateUrl: './planmanagement.component.html',
  styleUrls: ['./planmanagement.component.css']
})
export class PlanmanagementComponent implements OnInit {

  constructor() { }

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
  @ViewChild('flextable') flextable: FlextableComponent;
  @ViewChild('targetDiv', { read: ViewContainerRef }) targetDiv: ViewContainerRef;

  panelId = "";

  activePanel(componentInfo: any){
    this.panelId = componentInfo._id;
    if(this.drawer.opened){
      setTimeout( () => {
        this.flextable.refreshTable();
      }, 1500)      
    }

    
    this.drawer.toggle()
  }

}
