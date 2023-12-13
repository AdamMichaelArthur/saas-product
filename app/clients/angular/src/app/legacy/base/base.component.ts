import { Component, OnInit, ElementRef,   ViewChild, ViewChildren, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from './base.service'

// import { FlexibleComponent } from '../flexible-table/flexible-table.component';

declare var Box:any;

@Component({
  selector: 'app-base',
  template: 'NO HTML TO BE FOUND HERE',
  styleUrls: ['./base.component.css']
})

export class BaseComponent {

  
  @Output() displayPopup: EventEmitter<any> = new EventEmitter();
  @Input() btn_response;

  errorFound = false
  errorMessage = {}
  response: any
  displayTableButtonArea: Boolean = false;
  filters: Array<any> = [];
  iconMenus: Array<any> = [];
  iconMenusStr = "";
  filtersStr = "";
  addDataForm = [];
  addDataFormStr = "";
  googleDocs = [];
    kickbackStep = "";
      kickbackreason = "";
        processSteps = []
          spreadsheetLink = "#";
            documentLink = "#";
              documentDownloadLink = "#";
                spreadsheetDownloadLink = "#";

  code_generator_available = false;

  constructor(public service: BaseService, public elementRef: ElementRef) { }

  ngOnInit() {
    this.filtersStr = JSON.stringify(this.filters);
  }

  // @ViewChild(FlexibleComponent)
  // flexTable: FlexibleComponent;

  refreshTable() {
    console.log("Refreshing FlexTable");
    //this.flexTable.getInitialDataTableList()
  }


  kickbackReason(response){
    console.log(44, this.kickbackStep, this.kickbackreason, response)

    this.service.postAction("bounty", "kickbackToStep", { "kickbackStep": this.kickbackStep, "bounty_id" : response.bounty.bounty_id, "refDocId":response.bounty.refDocId, "kickback_reason":this.kickbackreason }).subscribe((data: any) => {
          this.tableButtonSubviews[3] = false;
          this.displayTableButtonArea = false;
    })



  }

  compact: boolean = true
  displayButtonArea: boolean = true;
  buttonNames: Array<string> = []
  buttonSubviews: Array<boolean> = []
  tableButtonNames: Array<string> = []
  tableButtonSubviews: Array<boolean> = []

  openPage(routename: string) {

  }

  consoleText() {
    console.log(77, "This is a test")
  }

  lastButtonClicked: string = "";
  flextableHeaderButtonClicked(buttonName: any) {
    
  }


  buttonClicked(buttonName: string){

  }

   displayTableButtonUI(tableButtonName: string){
       for(var i = 0; i < this.tableButtonNames.length; i++){
           if(this.tableButtonNames[i] == tableButtonName){
             this.tableButtonSubviews[i] = true; 
           } else {
             this.tableButtonSubviews[i] = false; 
           }
         }
     return true;
   }

  refreshFlextable(){
    console.log(162, "Base refresh flextable called");
    //this.flexTable.getInitialDataTableList()
  }

   updateHeaderButtons(headerButtons: string) {
     this.buttonNames = headerButtons.split(",");
     for(var i = 0; i < this.buttonNames.length; i++){
       this.buttonSubviews[i] = false;
     }
   }

   updateTableButtons(tableButtons: string) {
     this.tableButtonNames = tableButtons.split(",");
     for(var i = 0; i < this.tableButtonNames.length; i++){
       this.tableButtonSubviews[i] = false;
     }
   }

   tableButtonClicked($event){

      this.response = $event
      console.log(95, this.response);
      this.displayTableButtonUI(this.response.button)
      this.displayTableButtonArea = !this.displayTableButtonArea

      if(($event.button == "Files")||($event.button == "Template")){
        this.bountySpreadsheet = $event.bountySpreadsheet
        this.bountyDocument = $event.bountyDocument

        var contentExplorer = new Box.ContentExplorer();
          setTimeout((accessToken, folderId) => {
            contentExplorer.show(folderId,accessToken,{
              container:  "#my-box-content-explorer"
          });
         },500, $event.accessToken, $event.folderId)      
      }

  }

  hideHeaderButtonArea(){
    console.log(126, "Hiding Area");
    this.displayButtonArea = true;  
  }
  
   hideTableButtonArea(){
    console.log(131, "Hiding Area");
    this.displayTableButtonArea = false;  

  }
  


  hideBounty(){
    this.displayTableButtonArea = false;  
  }

  displayIconMenu: boolean = false;

  showIconMenu(event){
    this.displayIconMenu = true;
    this.onMouseClick(event);
  }

  hideIconMenu(){
    this.displayIconMenu = false;
  }
  
  onMouseClick(e: any) {
      
      e.srcElement.style.color = "black"
      console.log(e.srcElement);

      var myRect = e.srcElement.getBoundingClientRect();
      console.log(180, myRect);
      var parentRect = this.elementRef.nativeElement.getBoundingClientRect();
      console.log(182, parentRect)

      var popupX = myRect.x - parentRect.x + 20;
      var popupY = myRect.y + (myRect.height/2)

      var iconmenu = document.getElementById("iconmenu");
      iconmenu.style.left = String(popupX) + "px";
      iconmenu.style.top = String(popupY) + "px"

      const popupHeight = 400, // hardcode these values
        popupWidth = 300;    // or compute them dynamically

      let popupXPosition,
          popupYPosition

      if(e.clientX + popupWidth > window.innerWidth){
          popupXPosition = e.pageX - popupWidth;
      }else{
          popupXPosition = e.pageX;
      }

      if(e.clientY + popupHeight > window.innerHeight){
          popupYPosition = e.pageY - popupHeight;
      }else{
          popupYPosition = e.pageY;
      }

    }

    pushValueIntoArray(id, key, value, pluralize =false){
      console.log(219, "sending addToArray", id, key, value, pluralize);
      this.service.addToArray(id, key, value, pluralize).subscribe(
               (data: any) => {   
                   this.refreshFlextable()
       
               });
    }

    pullValueFromArray(id, key, value, pluralize =false){
      console.log(219, "trying to remove from array", id, key, value, pluralize);
      this.service.pullFromArray(id, key, value, pluralize).subscribe(
               (data: any) => {   
                   this.refreshFlextable()
               });
    }

   hidePopup(){
     console.log(232, "Hide popup", this.displayTableButtonArea)
    this.displayTableButtonArea = !this.displayTableButtonArea
    this.displayPopup.emit(false);
    this.refreshTable()
  }

  bountySpreadsheet = ""
  bountyDocument = ""
  bountyScript = "";


  openFile($event, id, filename){
      console.log(415, $event, id, filename)
      $event.preventDefault();

    if(filename.indexOf("xlsx") != -1){
      var spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${id}/edit#gid=0`  
      window.open(spreadsheetUrl, "_blank");
    }

    if(filename.indexOf("docx") != -1){
      var documentUrl = `https://docs.google.com/document/d/${id}/edit`;  
      window.open(documentUrl , "_blank");
    }

    return false;

  }

  openSpreadsheet($event, id =null){

        var spreadsheetId = this.bountySpreadsheet
        if(id != null){
          spreadsheetId = id;
        }
        
        console.log(411, $event)
        $event.preventDefault();
        var spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0`  

        console.log(366, spreadsheetUrl);

         window.open(spreadsheetUrl, "_blank");
        return false;
    }

    openDocument($event){
        console.log(415, $event)
        $event.preventDefault();  
        var documentUrl = `https://docs.google.com/document/d/${this.bountyDocument}/edit`;
         window.open( documentUrl, "_blank");
        return false;
    }

    openScript($event){

        $event.preventDefault();  
        var documentUrl = `https://docs.google.com/document/d/${this.bountyScript}/edit`;
         window.open( documentUrl, "_blank");
        return false;
    }

    
}
