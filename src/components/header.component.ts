import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import DownloadIconComponent from './icons/download.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, DownloadIconComponent],
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

      <!-- <div
        class="w-[52px] h-[52px] text-primary-content btn btn-ghost flex justify-center items-center"
        (click)="installPwa()"
      >
        <download-icon />
      </div> -->
    </div>
  `,
})
export default class HeaderComponent {
  constructor(public messageService: MessageService) {}

  deferredPrompt?: any;

  private setupPwa() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault(); // Prevent the default behavior
      this.deferredPrompt = event;
    });
  }

  installPwa() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt(); // Prompt the user to install the PWA
      this.deferredPrompt = null; // Reset the deferredPrompt
    }
  }
}
