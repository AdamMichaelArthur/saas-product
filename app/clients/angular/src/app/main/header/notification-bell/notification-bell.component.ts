import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})

export class NotificationBellComponent implements OnInit {

	@Input() title: string = '';
	@Input() notification: string = '';
	@Input() time: string = '';
	@Input() icon: string = '';
  @Input() path: string = '';
  @Input() refDocId: string = '';

  routerPath = '';
  constructor() { }

  ngOnInit(): void {
    this.routerPath = this.path + this.refDocId;
  }

}
