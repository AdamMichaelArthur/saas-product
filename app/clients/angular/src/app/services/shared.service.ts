import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  isUserloggedIn = false;
  public gugly = true;
  private baseUrl = environment.apiBase;

  _id: any;
  _dateKey: any;
  _dateValue: any;
  _variableData: any
  date: any;
  weeklyView: any;
  monthlyView: any;
  routingToBountyDetail = false
  referringPage: any;
  xbody: any

  constructor() { }

  drop(event: CdkDragDrop<string[]>) {

    if (event.previousContainer === event.container) {

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      event.container.data.splice(event.currentIndex, 1, event.previousContainer.data[event.previousIndex])
      event.previousContainer.data.splice(event.previousIndex, 1);
      // take an action in the backend, and return the result...

      //   transferArrayItem(event.previousContainer.data,
      //       event.container.data,
      //       event.previousIndex,
      //       event.currentIndex);
    }
  }

  refreshData() {

  }
}
