import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class=" bg-primary p-[16px] flex items-center justify-between h-[92px]"
    >
      <div class=" flex gap-[12px] items-center">
        <div class="avatar">
          <div class="w-[52px] h-[52px] rounded-full">
            <img src="assets/sample-logo.jpeg" />
          </div>
        </div>
        <div>
          <span class="text-[24px] text-primary-content"> Chatbot App </span>
          <div
            class="flex items-center gap-[8px] "
            *ngIf="messageService.isTyping$ | async"
          >
            <span class="text-base text-primary-content"> typing </span>

            <div class="flex items-center h-[17px]">
              <div
                class="animate-[mercury_1.8s_ease-in-out_infinite] bg-[#6CAD96] rounded-full h-[7px] mr-[4px] align-middle w-[7px] inline-block [animation-delay:200ms]"
              ></div>
              <div
                class="animate-[mercury_1.8s_ease-in-out_infinite] bg-[#6CAD96] rounded-full h-[7px] mr-[4px] align-middle w-[7px] inline-block [animation-delay:300ms]"
              ></div>
              <div
                class="animate-[mercury_1.8s_ease-in-out_infinite] bg-[#6CAD96] rounded-full h-[7px] mr-0 align-middle w-[7px] inline-block [animation-delay:400ms] "
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class HeaderComponent {
  constructor(public messageService: MessageService) {}
}
