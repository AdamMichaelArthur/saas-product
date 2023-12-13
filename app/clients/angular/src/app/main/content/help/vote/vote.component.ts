import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})

export class VoteComponent implements OnInit {

  questionsOrig = [];

	ngOnInit(){
      this.questionsOrig = this.questions;
      this.loadQuestions();
  	}

  questions = [
    {
      headline: 'New Members',
      question: 'How big do you think this community should be?',
      options: ['Small - less than 100 members', 'Medium - less than 500 members', 'Large - no limit if site requirements are met']
    },
    {
      headline: 'Link Algorithm',
      question: 'Should we have a minimum site traffic requirement for automatic points?',
      options: ['No', '1,000 Visitors a Month', '5,000 Visitors a Month', '10,000 Visitors a Month', '25,000+ Visitors a Month']
    },
    {
      headline: 'New Members',
      question: 'The Link Algorithm Should:',
      options: ["Discount DR -- it's too easily manipulated", 'Give some weight to DR, but not too much', 'Give DR a lot of weight in the algorithm', 'We should give substantial weight to a sites DR, especially if its high']
    },
    {
      headline: 'Site Features',
      question: 'Do you frequently look for sites that are for sale?',
      options: ['Yes', 'No']
    }
    // more questions can be added here
  ];

  loadQuestions(){
     const closedQuestions = JSON.parse(localStorage.getItem('closedQuestions') || '[]');
      this.questions = this.questions.filter(q => !closedQuestions.includes(q.question));   
  }

	closeQuestion(questionToRemove: any) {
	  const index = this.questions.findIndex(question => question.question === questionToRemove.question);
	  if (index > -1) {
	    this.questions.splice(index, 1);

	  	// Save closed question to localStorage
      	const closedQuestions = JSON.parse(localStorage.getItem('closedQuestions') || '[]');
      	closedQuestions.push(questionToRemove.question);
      	localStorage.setItem('closedQuestions', JSON.stringify(closedQuestions));

	  }
	}

  reset(){
    localStorage.setItem('closedQuestions', JSON.stringify([]));
    this.questions = this.questionsOrig
    this.loadQuestions();
  }

}
