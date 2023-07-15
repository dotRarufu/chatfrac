import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CarouselItem } from 'src/app/types/Message';
import MessengerIconComponent from './icons/messenger.component';

@Component({
  selector: 'chat-carousel',
  standalone: true,
  imports: [CommonModule, MessengerIconComponent],
  template: `
    <div class=" flex gap-[16px] carousel px-[16px] ">
      <div
        *ngFor="let item of content"
        class="carousel-item rounded-[12px] bg-secondary  px-[12px] py-[8px]  normal-case  w-[143px] flex flex-col gap-[8px]"
      >
        <img
          class="w-[167px] h-[80px] rounded-[8px] "
          [src]="
            item.image ||
            'https://cdn.matthewjamestaylor.com/img/matthew-james-taylor.jpg'
          "
        />
        <span class="font-normal text-base text-secondary-content">
          {{ item.message || 'Person Name' }}
        </span>
        <div class="h-[1px] w-full bg-secondary-content "></div>
        <a
          [href]="item.link"
          class="px-[4px] py-[8px] flex justify-center w-full btn btn-ghost gap-[8px]"
        >
          <messenger-icon />
          <span class="font-normal text-base text-primary capitalize">
            Message
          </span>
        </a>
      </div>
    </div>
  `,
})
export default class ChatCarouselComponent {
  @Input() content: CarouselItem[] = [];
  shouldDisableButtons = false;

  handleClick(callback: () => void) {
    this.shouldDisableButtons = true;
    callback();
  }
}
