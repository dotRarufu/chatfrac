import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'landing-page',
  standalone: true,
  template: `
    <div
      class="w-full max-w-[480px] bg-primary  justify-center mx-auto h-screen flex flex-col  "
    >
      <div
        class="flex flex-col gap-[8px] items-center text-[24px] font-semibold text-primary-content  h-[85%] pt-[30%] px-[16px] "
      >
        <div
          class="flex gap-[8px] justify-center items-center h-[120px] w-[140px] rounded-[8px] bg-gray-400 text-gray-500 "
        >
          Logo
        </div>
        Chatbot Name
        <div class="h-full"></div>
        <button
          (click)="handleButtonClick()"
          class="btn btn-secondary w-full btn-md "
        >
          Start
        </button>
      </div>
    </div>
  `,
})
export default class LandingPageComponent {
  constructor(private router: Router) {}

  handleButtonClick() {
    this.router.navigate(['chat']);
  }
}
