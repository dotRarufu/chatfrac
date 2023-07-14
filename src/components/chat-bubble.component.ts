import { Component, Input } from '@angular/core';

@Component({
  selector: 'chat-bubble',
  standalone: true,
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
        {{ message }}
      </div>
    </div>
  `,
})
export default class ChatBubbleComponent {
  @Input() sender: 'user' | 'bot' = 'user';
  @Input() message = '';
}
