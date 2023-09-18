import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { StepService } from 'src/app/services/step.service';
import { Message } from 'src/app/types/Message';
import SendIconComponent from '../icons/send.component';
import { ActionsService } from 'src/app/services/actions.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'refactored-chat-input',
  standalone: true,
  imports: [FormsModule, SendIconComponent, ReactiveFormsModule],

  template: `
    <div class="join selection:text-[16px]  rounded-[5px]  w-full">
      <input
        [formControl]="value"
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
export default class RefactoredChatInputComponent {
  value = new FormControl('', { nonNullable: true });
  @Input() inputIsDisabled? = false;
  isDisabled: boolean | null = null;
  @Output() send = new EventEmitter<string>();

  handleSend() {
    this.send.emit(this.value.value);
    this.value.reset();
  }
}
