import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})

export class ButtonComponent {

	isExpanded = false;

  toggle() {
    this.isExpanded = !this.isExpanded;
  }


}
