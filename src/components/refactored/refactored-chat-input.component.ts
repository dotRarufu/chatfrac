import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
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

      <button
        (click)="handleSend()"
        class="btn join-item btn-primary"
        [class.btn-disabled]="inputIsDisabled"
      >
        <send-icon />
      </button>
    </div>
  `,
})
export default class RefactoredChatInputComponent implements OnChanges {
  value = new FormControl('', { nonNullable: true });
  @Input() inputIsDisabled: boolean = false;
  @Output() send = new EventEmitter<string>();

  handleSend() {
    if (!this.value.value) return;

    this.send.emit(this.value.value);
    this.value.reset();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newInputIsDisabled = changes['inputIsDisabled']
      .currentValue as boolean;

    this.inputIsDisabled = newInputIsDisabled;

    if (newInputIsDisabled) this.value.disable();
    else this.value.enable();
  }
}
