import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <div class=" h-fit bg-primary p-[16px] flex gap-[12px] items-center">
      <div class="avatar">
        <div class="w-[40px] h-[40px] rounded-full">
          <img src="assets/sample-logo.jpeg" />
        </div>
      </div>
      <span class="text-[24px] text-primary-content"> Chatbot App </span>
    </div>
  `,
})
export default class HeaderComponent {}
