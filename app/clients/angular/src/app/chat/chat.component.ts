import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DataService } from '../services/data.service';
import { environment } from '../../environments/environment';

import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  isChatButtonClicked = false;
  chatMessage = '';

  chatHistory = [];

  constructor(private dataService: DataService, private http: HttpClient) { }

  @Input() visible: boolean;
  @Input() hidden: boolean;
  @ViewChild('chatContainer') private chatContainer: ElementRef;
  @ViewChild('chatTextArea') private chatTextArea: ElementRef;

  minimizedCounter = 0;
  minimizedMax = 60;
  public baseUrl = environment.apiBase

  ngOnInit(): void {
    this.dataService.getChatButtonClickObservable().subscribe(() => {
      this.bScrollToBottom = true;
      this.isChatButtonClicked = !this.isChatButtonClicked;
      this.scrollToBottom();

    });

    setInterval( () => {
      if(this.isChatButtonClicked){
        this.getChatMessages();
      } else {
        this.minimizedCounter++;
        if(this.minimizedCounter > this.minimizedMax){
          this.getChatMessages();
          this.minimizedCounter = 0;
        }
      } 
    }, 5000)
    this.chatTextArea?.nativeElement.focus();

  }

  bScrollToBottom = false;
  ngAfterViewChecked() {
    if(this.bScrollToBottom){
      this.scrollToBottom();
      this.bScrollToBottom = false;
    }
  }


  chatIconClicked($event){
  	this.isChatButtonClicked = !this.isChatButtonClicked;
  }

  lastChatHistory = [];
  async getChatMessages(){

    console.log(74, this.baseUrl);

    console.log(766, environment.v1)

    var api_url = environment.v1 + '/datasource/chats/max_records/-1'
    let messages = await this.http.get(api_url).toPromise();
    console.log(78, api_url, messages);
    if(Array.isArray(messages['chats']))

      console.log(messages['chats'].length, this.chatHistory.length)
      // A user has submitted a message, but it hasn't had time to sync up with the db.  
      if(messages['chats'].length < this.chatHistory.length){
        return;
      }

      this.chatHistory = messages['chats'];

    if(this.chatHistory.length != this.lastChatHistory.length){
      this.scrollToBottom();
      this.bScrollToBottom = true;
      this.lastChatHistory = this.chatHistory
    }
    
  }

  async sendChatMessage(){

    

    const chatMessage = this.chatMessage;
    this.chatMessage = '';
    this.chatTextArea.nativeElement.focus();
    console.log(88, this.chatHistory);
    this.chatHistory.push({
        chatMessage: chatMessage,
        channel: '#support',     
        bubble: 'user'
    })

    this.bScrollToBottom = true;

    var api_url =  environment.v1 + '/datasource/chats'
    console.log(114, api_url)
    let post = await this.http.post(api_url, {
      chatMessage: chatMessage,
      channel: '#support',
      bubble: 'user'
    }).toPromise();

  }


  scrollToBottom(): void {
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    this.chatTextArea.nativeElement.focus();
  }

  closeChat($event){
    this.chatIconClicked($event);
  }

}
