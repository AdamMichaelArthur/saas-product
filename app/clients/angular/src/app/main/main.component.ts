import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService) { 

  }

  ngOnInit(): void {
    const tmp = this.dataService.getSharedData();


  }

}
