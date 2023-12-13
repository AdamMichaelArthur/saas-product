import { Component, AfterViewInit, ElementRef } from '@angular/core';

declare var bootstrap: any; // If you're using Bootstrap 5

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})


export class OnboardingComponent {

	constructor(private elRef: ElementRef) {}

	activeSlideIndex = 0;
	ngAfterViewInit(){
	    const myCarousel = this.elRef.nativeElement.querySelector('#carouselExampleCaptions');

	    const carousel = new bootstrap.Carousel(myCarousel);

	    myCarousel.addEventListener('slid.bs.carousel', (event: any) => {
	      // You can access the relatedTarget property to get the newly shown slide
	      const newSlide = event.relatedTarget;
	      
	      console.log(newSlide);

	      this.activeSlideIndex = Array.from(myCarousel.querySelectorAll('.carousel-item')).indexOf(event.relatedTarget);

	      console.log(30, this.activeSlideIndex)

	    });
	}

	slideCaptions = [
		'Browser For Valuable Assets',
		'Get Points Fast, No Money Needed'
	]

	index = 0;


}
