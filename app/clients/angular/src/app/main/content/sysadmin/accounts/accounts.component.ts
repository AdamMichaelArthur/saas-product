import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit, FlexTableInterface  {

  constructor() { }

  ngOnInit(): void {
  }

  headerButtonClicked(event: any){

  }

  tableButtonClicked(requestResult: any){

  }

}
