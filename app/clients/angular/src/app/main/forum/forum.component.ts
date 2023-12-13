import { Component, OnInit, ViewContainerRef, ViewChild, EventEmitter, Output, ElementRef, Renderer2 } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FlextableComponent } from "../../reusable/ui/flextable/flextable.component"
import { FormsModule } from '@angular/forms';


import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})

export class ForumComponent implements OnInit {

  categories = [];
  selectedCategory = "";
  comment = '';
  subject = '';
  
  @ViewChild('myModal') myModal: ElementRef;

  dismissModal() {
    const modalElement: HTMLElement = this.myModal.nativeElement;
    this.renderer.selectRootElement(modalElement).dispatchEvent(new Event('click'));
  }

  constructor(private http: HttpClient, private renderer: Renderer2) { }

  async ngOnInit(){
    // api/datasource/forums/distinct/category/all
    let categories = await this.http.get(`api/datasource/forums/distinct/category/all`).toPromise();
    this.categories = categories['forums'];
  }

  closePanel(newVar: string) {
     this.drawer.toggle();
  }
  
  headerButtonClicked(event: any){
    if(event == 'Start New Thread'){
      this.startNewThread();
    }
  }

  startNewThread(){

  }

  tableButtonClicked(requestResult: any){
  	console.log(19, requestResult);
  	this.drawer.toggle()
    this.sendEventToChild(requestResult["_id"]);
  }


  async leaveComment(){

    let post = await this.http.post(`api/datasource/forums`, {
      subject: this.comment,
      post: this.subject,
      replies: []
    }).toPromise();
    this.dismissModal();
  }
  
  @Output() public parentEvent = new EventEmitter<any>();


  sendEventToChild(_id: String) {
    const eventData = 'Custom event data from parent';
    this.parentEvent.emit(_id);
  }

  handleEvent(eventData: string) {
    console.log('Received event data in parent:', eventData);
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
