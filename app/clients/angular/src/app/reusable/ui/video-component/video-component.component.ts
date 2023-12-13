import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'help-video',
  templateUrl: './video-component.component.html',
  styleUrls: ['./video-component.component.css']
})

export class VideoComponentComponent implements OnInit, AfterViewInit {
  isMinimized = true;
  isMaximized = false;
  isVisible = true;

  @Input() embedded_video_url: string;
  @Input() videoTitle = "";

  embedded_video: SafeResourceUrl;

  @ViewChild('fullPageModal') fullPageModal!: ElementRef;

  constructor(private sanitizer: DomSanitizer) {
   	 this.embedded_video = this.sanitizer.bypassSecurityTrustResourceUrl(''); 
  }

  ngOnInit(){

  }

  ngAfterViewInit() {
	 this.embedded_video = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.embedded_video_url); 
  }

  openModal() {
    this.fullPageModal.nativeElement.classList.add('show');
    this.fullPageModal.nativeElement.style.display = 'block';
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.fullPageModal.nativeElement.style.display = 'none';
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
  }

  dismiss(){
  	this.isVisible = false;
  }
}
