import { Component, Input } from '@angular/core';
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
        />
      </div>
    </div>
  `,
})
export default class ChatImageComponent {
  @Input() url = '';
}
