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
      class=" bg-primary p-[16px] py-[8px] flex items-center justify-between h-[76px] shadow"
    >
      <div class=" flex gap-[12px] items-center">
        <div class="avatar">
          <div class="w-[52px] h-[52px] rounded-full">
            <img src="assets/sample-logo.jpeg" />
          </div>
        </div>
        <div class="flex flex-col justify-center">
          <span class="text-[24px] text-primary-content h-[28px] leading-none"> ChatFrac </span>
          
            <span class="text-base text-primary-content h-[13px] leading-none"> ONLINE </span>
          
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
