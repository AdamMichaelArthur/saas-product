import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ballot',
  templateUrl: './ballot.component.html',
  styleUrls: ['./ballot.component.css']
})

export class BallotComponent implements OnInit {

  @Input() question: string = '';
  @Input() options: string[] = [];
  @Input() headline: string = '';

  @Output() close = new EventEmitter<void>();

  selectedOption = '';

  ngOnInit(){
    // Retrieve the selected option from local storage during initialization
    const storedOption = localStorage.getItem(this.question);

    if (storedOption) {
      this.selectedOption = storedOption;
    }
  }

  vote(option: string) {
    this.selectedOption = option;
    localStorage.setItem(this.question, option);
  }
  
  closeQuestion() {
    this.close.emit();
  }

}
