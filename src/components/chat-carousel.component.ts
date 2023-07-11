import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CarouselItem } from 'src/app/types/Message';

@Component({
  selector: 'chat-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="carousel carousel-center max-w-md p-4 space-x-4 bg-neutral rounded-box my-[8px]"
    >
      <div *ngFor="let c of content" class="carousel-item">
        <div class="card w-[200px] h-[100px] bg-primary text-primary-content">
          <div class="card-body">
            <h2 class="card-title">{{ c.message }}</h2>

            <div class="card-actions justify-end">
              <button
                (click)="handleClick(c.clickCallback)"
                class="btn btn-secondary"
                [class.btn-disabled]="shouldDisableButtons"
              >
                Select
              </button>
            </div>
          </div>
        </div>
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
