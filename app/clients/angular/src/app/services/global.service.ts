import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GlobalService {

  userPlan: any = 'free';

  constructor() { }

  setPlan(userPlan: String){
  	this.userPlan = userPlan
  }

  getPlan(){
  	return this.userPlan
  }

}
