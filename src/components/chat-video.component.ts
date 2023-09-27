import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { SafePipeModule } from 'safe-pipe';

@Component({
  selector: 'chat-video',
  standalone: true,
  imports: [SafePipeModule, CommonModule],
  template: `
    <div class="rounded-[1rem]  max-w-[80vw] pl-[8px] m-[8px] ml-0">
      <div class="rounded-[1rem] overflow-clip ">
        <iframe
          class="w-full aspect-square"
          [class.hidden]="!dataLoaded()"
          [src]="url | safe: 'resourceUrl'"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          (load)="dataLoaded.set(true)"
        ></iframe>

        <div
          *ngIf="!dataLoaded()"
          class="w-full aspect-square flex place-content-center bg-secondary"
        >
          <span class="loading loading-spinner loading-md"></span>
        </div>
      </div>
    </div>
  `,
})
export default class ChatVideoComponent {
  @Input() url = '';
  dataLoaded = signal(false);
}
