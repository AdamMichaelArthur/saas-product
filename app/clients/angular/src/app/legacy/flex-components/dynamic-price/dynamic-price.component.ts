import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { BaseComponent } from '../../base/base.component';
import { map, take, catchError } from 'rxjs/operators';
import * as moment from 'moment';


@Component({
  selector: 'dynamic-price',
  templateUrl: './dynamic-price.component.html',
  styleUrls: ['./dynamic-price.component.css']
})

export class DynamicPriceComponent extends BaseComponent implements OnInit {

  @Input() key: string = ""      // The name of the mongo collection
  @Input() refDocId: string = ""

  trackTime: boolean = false;
  interval: any
  btnTitle = "Start"
  price: Number = 0.00
  duration: any

  time: any = "0"
  _id: string = "";         // The document _id of the dynamically priced item
  _start: string = "";      // The date when the price starts at the minimum or maximum
  _end: string = "";        // The date when the item becomes unavailable
  _minimum: number = 0;     // The lowest price this item is allowed to go
  _maximum: number = 0;     // The maximum price this item is allowed to go
  _ascending: boolean = false    // If false, the price goes from 0 up, it true stars at max to min
  _unique: boolean = false       // If set to true, once this item is "bought" it is removed from availability
  _hold: boolean = false         // Someone may want to lock an item for a short period to make a buying decision
  _frequency: number = 1;        // The number of seconds between price adjustments
  
  /*  How this is going to work

    The component gets a start date, and starts incrementing or decreasing the 
    price.
    
  
  */

  constructor(public override service: BaseService, public override elementRef: ElementRef) {
    super(service, elementRef) 
  }

  override ngOnInit(): void {
      this.getTrackingDoc().subscribe(data => {
      });
  }

  changePrice(self){
      self.duration.add(1, 's')
      self.time =`${self.duration.days()} day ${self.duration.hours()} hours ${self.duration.minutes()} minutes ${self.duration.seconds()} seconds update?` ;
  }


  getTrackingDoc(){
    var api_url = this.service.baseUrl + '/actions/datasource/track/action/getTracker'

    return this.service.http.post(api_url, { refDocId: this.refDocId }, this.service.httpOptions).pipe(map(response => {
      {
        var isTrackingNow = response['actions'].trackingDoc.trackingState
        console.log(69, response['actions']);
        if(isTrackingNow){
         
          this.interval = setInterval(this.changePrice, this._frequency*1000, this)
          this.btnTitle = 'Stop'

        } else {

        }
        
        this.trackTime = isTrackingNow

        this.duration = moment.duration(response['actions'].totalElapsed, 's')
        this.time =`${this.duration.days()} day ${this.duration.hours()} hours ${this.duration.minutes()} minutes ${this.duration.seconds()} seconds updat4` ;

      return response
      }
    }), catchError(this.service.handleError))    
  }

  // getTrackingDoc(){
  //   var api_url = this.service.baseUrl + '/actions/datasource/track/action/getTracker'

  //   return this.service.http.post(api_url, { refDocId: this.refDocId }, this.service.httpOptions).pipe(map(response => {
  //     {
  //       var isTrackingNow = response['actions'].trackingDoc.trackingState
  //       console.log(69, response['actions']);
  //       if(isTrackingNow){
  //         var mmt = moment().set('hour', 0)
  //              .set('minute', 0)
  //              .set('second', 0)
               
  //         if(response['actions'].totalElapsed > 0){
  //           mmt.add(response['actions'].totalElapsed, 'seconds')
  //         }
  //         this._start = mmt.format('HH:mm:ss');
  //         this.interval = setInterval(this.changePrice, this._frequency*1000, this)
  //         this.btnTitle = 'Stop'
  //         //this.trackTime = false;
  //       } else {
  //           console.log(86, "here", response['actions'].totalElapsed)
  //           var mmt = moment().set('hour', 0)
  //              .set('minute', 0)
  //              .set('second', 0)
               
  //         if(response['actions'].totalElapsed > 0){
  //           this.time = mmt.add(response['actions'].totalElapsed, 'seconds')

  //         }
  //         //this.trackTime = false
  //       }
  //       this._start = mmt.format('HH:mm:ss');
  //       //this.time = mmt.format('HH:mm:ss');
  //       // var duration2 = moment.duration(totalElapsed, 'seconds')
  //       this.trackTime = isTrackingNow

  //       var tst = moment.duration(response['actions'].totalElapsed, 's')
  //       this.time =`${tst.days()} day ${tst.hours()} hours ${tst.minutes()} minutes ${tst.seconds()} seconds` ;//tst.toJSON()
  //       console.log(96, this.trackTime, isTrackingNow)
  //     return response
  //     }
  //   }), catchError(this.service.handleError))    
  // }

  trackIntermittentTime(bToggleTrackState =false){

    // If bToggleTrackState is true, this will cause time tracking to start
    // if false, it will pause time tracking
    console.log(65, bToggleTrackState);
    var body = {
      refDocId: this.refDocId,
      trackingState: bToggleTrackState
    }

    var api_url = this.service.baseUrl + '/actions/datasource/track/action/track'

    console.log(142, api_url)

    return this.service.http.post(api_url, body, this.service.httpOptions).pipe(map(response => {
      {

        console.log(147, response);
      return response
      }
    }), catchError(this.service.handleError))
  }

  toggleTimeTracking(){
    this.trackTime = !this.trackTime
    console.log(this.trackTime)

    this.trackIntermittentTime(this.trackTime).subscribe(data => {
        
      });


    console.log("Toggle Time Tracking", this.trackTime);
    if(this.trackTime){      
      // this.time = moment().set('hour', 0)
      //                     .set('minute', 0)
      //                     .set('second', 0)
      //                     .format('HH:mm:ss');
      this._start = this.time
      console.log("Setting interval")
      this.interval = setInterval(this.changePrice, this._frequency*1000, this)
      this.btnTitle = 'Stop'
    } else {
      console.log("clearing interval")
      clearTimeout(this.interval)
      this.btnTitle = 'Start'
    }
  }
}
