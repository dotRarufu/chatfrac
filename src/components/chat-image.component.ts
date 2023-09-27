import { Component, Input, signal } from '@angular/core';
import { SafePipeModule } from 'safe-pipe';

@Component({
  selector: 'chat-image',
  standalone: true,
  imports: [SafePipeModule],
  template: `
    <div class="rounded-[1rem]  max-w-[80vw] pl-[8px] m-[8px] ml-0">
      <div class="rounded-[1rem] overflow-clip bg-black">
        <img
          class="w-full aspect-square object-contain max-w-[80vw]"
          [src]="url"
          alt="chat image"
          (load)="handleLoaded()"
          [class.hidden]="!isLoaded()"
        />
        <div
          class=" bg-base-200 w-full aspect-square max-w-[80vw] rounded-[8px] animate-pulse"
          [class.hidden]="isLoaded()"
        ></div>
      </div>
    </div>
  `,
})
export default class ChatImageComponent {
  @Input() url = '';
  isLoaded = signal(false);
  handleLoaded() {
    this.isLoaded.set(true);
  }
}
