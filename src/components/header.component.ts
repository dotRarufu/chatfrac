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
      class="relative bg-primary p-[16px] py-[8px] flex items-center justify-between h-[76px] shadow"
    >
      <div class=" flex gap-[12px] items-center">
        <div class="avatar">
          <div class="w-[52px] h-[52px] rounded-full">
            <img src="assets/chatfrac-logo.jpg" />
          </div>
        </div>
        <div class="flex flex-col justify-center">
          <span class="text-[24px] text-secondary h-[28px] leading-none">
            ChatFrac
          </span>

          <span class="text-base text-secondary h-[13px] leading-none">
            ONLINE
          </span>
        </div>
      </div>

      <!-- <div
        class="w-[52px] h-[52px] text-secondary btn btn-ghost flex justify-center items-center"
        (click)="installPwa()"
      >
        <download-icon />
      </div> -->
      <div class="absolute bottom-0 right-0 flex gap-1 ">
          <img class="aspect-square w-[46px]" src="assets/pips/sir-cj-removebg-preview.png" alt="1">
          <img class="aspect-square w-[46px]" src="assets/pips/maam-ana-removebg-preview.png" alt="2">
          <img class="aspect-square w-[46px]" src="assets/pips/sir-rodel-removebg-preview.png" alt="3">
      </div>
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
