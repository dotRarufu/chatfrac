import { Component, Input } from '@angular/core';
import { SafePipeModule } from 'safe-pipe';

@Component({
  selector: 'chat-video',
  standalone: true,
  imports: [SafePipeModule],
  template: `
    <div class="rounded-[1rem]  max-w-[80vw] pl-[8px] m-[8px] ml-0">
      <div class="rounded-[1rem] overflow-clip ">
        <iframe
          class="w-full aspect-square"
          [src]="url | safe: 'resourceUrl'"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  `,
})
export default class ChatVideoComponent {
  @Input() url = '';
}
