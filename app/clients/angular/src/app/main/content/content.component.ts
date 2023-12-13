import { Component, OnInit } from '@angular/core';
import { AsideComponent } from '../aside/aside.component'
import { FooterComponent } from '../footer/footer.component'
import { HeaderComponent } from '../header/header.component'

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})

export class ContentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
