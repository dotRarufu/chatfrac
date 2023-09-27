import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import DownloadIconComponent from '../icons/download.component';
import { IconsModule } from 'src/app/icons/icons.module';
import { LocalStorageKeys } from 'src/app/data/programmedPhases';

@Component({
  selector: 'refactored-app-header',
  standalone: true,
  imports: [CommonModule, DownloadIconComponent, IconsModule],
  template: `
    <div
      class=" bg-primary p-[16px] py-[8px] flex items-center justify-between h-[76px] shadow"
    >
      <div class=" flex gap-[12px] items-center">
        <div class="avatar">
          <div class="w-[52px] h-[52px] rounded-full">
            <img src="assets/chatfrac-logo.jpg" />
          </div>
        </div>
        <div class="flex flex-col justify-center">
          <span class="text-[24px] text-primary-content h-[28px] leading-none">
            ChatFrac
          </span>

          <span class="text-base text-primary-content h-[13px] leading-none">
            ONLINE
          </span>
        </div>
      </div>

      <div
        class="w-[52px] h-[52px] text-primary-content btn btn-ghost btn-square"
        (click)="isModalOpen.set(true)"
      >
        <i-feather name="rotate-ccw" class="text-primary-content w-full" />
      </div>
    </div>

    <dialog
      id="my_modal_2"
      class="modal modal-bottom"
      [class.modal-open]="isModalOpen()"
    >
      <div class="modal-box rounded-[8px]">
        <h3 class="font-bold text-lg">Confirmation</h3>
        <p class="py-4">
          Are you sure you want to reset the app's data? This will delete your
          progress and score.
        </p>
        <div class="join flex">
          <button
            (click)="isModalOpen.set(false); resetLocalStorage()"
            class="join-item flex-1 btn btn-ghost"
          >
            Yes
          </button>
          <button
            (click)="isModalOpen.set(false)"
            class="join-item flex-1 btn btn-error"
          >
            No
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button (click)="isModalOpen.set(false)">close</button>
      </form>
    </dialog>
  `,
})
export default class RefactoredHeaderComponent {
  constructor(public messageService: MessageService) {}
  isModalOpen = signal(false);
  deferredPrompt?: any;

  resetLocalStorage() {
    const keys = Object.values(LocalStorageKeys);

    keys.forEach((key) => localStorage.removeItem(key));

    window.location.reload();
  }

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
