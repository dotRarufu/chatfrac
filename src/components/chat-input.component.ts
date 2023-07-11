import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { StepService } from 'src/app/services/step.service';
import { Message } from 'src/app/types/Message';

@Component({
  selector: 'chat-input',
  standalone: true,
  imports: [FormsModule],

  template: `
    <div class="join selection:text-[16px] p-[8px] rounded-[5px]  w-full">
      <input
        [(ngModel)]="value"
        type="text"
        placeholder="Type something"
        class="input w-full join-item"
      />
      <button (click)="handleSend()" class="btn join-item">Send</button>
    </div>
  `,
})
export default class ChatInputComponent {
  value = '';

  constructor(
    public messageService: MessageService,
    private stepService: StepService
  ) {}

  handleSend() {
    const data: Message = {
      content: this.value,
      sender: 'user',
      type: 'ChatBubble',
    };
    this.messageService.add(data);

    // can move this inside messageService.add
    this.stepService.update();
    this.value = '';
  }
}
