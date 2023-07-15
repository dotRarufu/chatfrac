import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'chat-bubble',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="chat "
      [class.chat-end]="sender === 'user'"
      [class.chat-start]="sender === 'bot'"
    >
      <div
        class="chat-bubble  text-secondary-content"
        [class.bg-primary]="sender === 'user'"
        [class.bg-secondary]="sender === 'bot'"
        [class.text-primary-content]="sender === 'user'"
        [class.text-secondary-content]="sender === 'bot'"
      >
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
      </div>
    </div>
  `,
})
export default class ChatBubbleComponent {
  @Input() sender: 'user' | 'bot' = 'user';
  @Input() message = '';
  @Input() link?: string;
}
