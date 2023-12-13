import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})

export class MessageItemComponent implements OnInit {

	@Input() message: string = '';
	@Input() from: string = '';
	@Input() time: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
