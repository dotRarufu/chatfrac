import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { StepService } from 'src/app/services/step.service';
import { Message } from 'src/app/types/Message';
import SendIconComponent from './icons/send.component';
import { ActionsService } from 'src/app/services/actions.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'chat-input',
  standalone: true,
  imports: [FormsModule, SendIconComponent],

  template: `
    <div class="join selection:text-[16px]  rounded-[5px]  w-full">
      <input
        [(ngModel)]="value"
        type="text"
        placeholder="Type something"
        class="input w-full outline-none join-item bg-secondary text-secondary-content focus:outline-0 relative"
      />
      <!-- [disabled]="inputIsDisabled || false" -->
      <button
        (click)="handleSend()"
        class="btn join-item btn-primary"
        [class.btn-disabled]="inputIsDisabled || false"
      >
        <send-icon />
      </button>
    </div>
  `,
})
export default class ChatInputComponent {
  value = '';
  @Input() inputIsDisabled? = false;
  isDisabled: boolean | null = null;

  checkIsDisabled() {
    const currentAction = this.actionsService.content();

    if (currentAction.type === 'Input') {
      const currentActionIsDisabled = currentAction.isDisabled || false;
      const res =
        (this.isDisabled && !currentActionIsDisabled) ||
        currentActionIsDisabled;

      return res;
    }

    return true;
  }

  constructor(
    public messageService: MessageService,
    private stepService: StepService,
    public actionsService: ActionsService,
    private stateService: StateService,
  ) {
    this.stateService.isChatInputDisabled$.subscribe({
      next: (s) => {
        this.isDisabled = s;
      },
    });
  }

  handleSend() {
    if (this.checkIsDisabled()) return;

    if (!this.value) return;

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
