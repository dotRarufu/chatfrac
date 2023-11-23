import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import isFraction, { Fraction } from 'src/app/utils/isFraction';

@Component({
  selector: 'chat-bubble',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="chat"
      [class.chat-end]="sender === 'user'"
      [class.chat-start]="sender === 'bot'"
    >
      <div
        class="chat-bubble  text-secondary-content"
        [class.bg-primary]="sender === 'user'"
        [class.bg-secondary]="sender === 'bot'"
        [class.text-secondary]="sender === 'user'"
        [class.text-secondary-content]="sender === 'bot'"
      >
        <ng-container *ngIf="!isFraction; else fractionForm">
          <a
            class="text-blue-500 underline "
            [href]="link"
            *ngIf="link !== undefined"
          >
            {{ message }}
          </a>
          <span *ngIf="link === undefined">
            {{ message }}
          </span>
        </ng-container>

        <ng-template #fractionForm>
          <div class="flex gap-1 items-center">
            <span *ngIf="isFraction?.whole">{{ isFraction?.whole }}</span>
            <div class="flex flex-col gap-1 justify-center">
              <div class="text-center">{{ isFraction?.numerator }}</div>
              <hr />
              <div class="text-center">{{ isFraction?.denominator }}</div>
            </div>
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export default class ChatBubbleComponent implements OnInit {
  @Input() sender: 'user' | 'bot' = 'user';
  @Input() message = '';
  @Input() link?: string;

  isFraction: Fraction | null = null;

  ngOnInit(): void {
    this.isFraction = isFraction(this.message);
  }
}
