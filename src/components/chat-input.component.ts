import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { StepService } from 'src/app/services/step.service';
import { Message } from 'src/app/types/Message';
import SendIconComponent from './icons/send.component';
import { ActionsService } from 'src/app/services/actions.service';
import { StateService } from 'src/app/services/state.service';
import { CommonModule } from '@angular/common';
import FractionFormInputComponent from './fraction-form.component';
import FractionIconComponent from './icons/fraction.component';

@Component({
  selector: 'chat-input',
  standalone: true,
  imports: [
    SendIconComponent,
    CommonModule,
    FractionFormInputComponent,
    FractionIconComponent,
    ReactiveFormsModule,
  ],

  template: `
    <fraction-form-input
      *ngIf="inFractionForm()"
      (close)="inFractionForm.set(false)"
      (send)="sendFraction($event)"
    />

    <div
      *ngIf="!inFractionForm()"
      class="join selection:text-[16px]  rounded-[5px]  w-full"
    >
      <button
        (click)="inFractionForm.set(true)"
        class="btn join-item btn-primary"
        [class.btn-disabled]="inputIsDisabled || false"
      >
        <fraction-icon />
      </button>
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
export default class ChatInputComponent implements OnChanges {
  value = new FormControl('', { nonNullable: true });
  @Input() inputIsDisabled? = false;
  isDisabled: boolean | null = null;
  inFractionForm = signal(false);

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

  sendFraction(message: string) {
    if (this.checkIsDisabled()) return;

    const data: Message = {
      content: message,
      sender: 'user',
      type: 'ChatBubble',
    };
    this.messageService.add(data);

    // can move this inside messageService.add
    this.stepService.update();
  }

  handleSend() {
    if (this.checkIsDisabled()) return;

    if (!this.value) return;

    const data: Message = {
      content: this.value.value,
      sender: 'user',
      type: 'ChatBubble',
    };
    this.messageService.add(data);

    // can move this inside messageService.add
    this.stepService.update();

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
