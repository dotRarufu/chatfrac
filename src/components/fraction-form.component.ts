import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { StepService } from 'src/app/services/step.service';
import { Message } from 'src/app/types/Message';
import SendIconComponent from './icons/send.component';
import { ActionsService } from 'src/app/services/actions.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'fraction-form-input',
  standalone: true,
  imports: [ReactiveFormsModule, SendIconComponent],

  template: `
    <div class="flex justify-between p-4 gap-2 rounded-[5px] w-full">
      <div
        class="w-full justify-center border border-base-content/50 bg-secondary p-4 flex items-center gap-2 rounded-md"
      >
        <input
          (keypress)="numberOnly($event)"
          [formControl]="wholeNumber"
          type="text"
          class="input rounded-md border border-base-content/50 text-center aspect-square outline-none join-item bg-secondary-200 p-1 text-[20px] font-bold text-secondary-content focus:outline-0 "
        />
        <div class="flex flex-col gap-2">
          <input
            (keypress)="numberOnly($event)"
            [formControl]="numerator"
            type="text"
            class="input border border-base-content/50 rounded-md text-center p-1 text-[20px] font-bold aspect-square outline-none join-item bg-secondary-200 text-secondary-content focus:outline-0 "
          />
          <div class="h-[1px] bg-base-content/70 w-full"></div>
          <input
            (keypress)="numberOnly($event)"
            type="text"
            [formControl]="denominator"
            class="input border border-base-content/50 rounded-md text-center p-1 text-[20px] font-bold aspect-square outline-none join-item bg-secondary-200 text-secondary-content focus:outline-0 "
          />
        </div>
      </div>

      <div class="gap-2 w-[48px] flex flex-col justify-between">
        <button (click)="handleSend()" class="btn flex-1 btn-primary">
          <send-icon />
        </button>
        <button (click)="close.emit()" class="btn btn-error">X</button>
      </div>
    </div>
  `,
})
export default class FractionFormInputComponent {
  @Output() send = new EventEmitter<string>();
  @Output() close = new EventEmitter();
  numerator = new FormControl('', { nonNullable: true });
  denominator = new FormControl('', { nonNullable: true });
  wholeNumber = new FormControl('', { nonNullable: true });

  handleSend() {
    const wholeNumber = this.wholeNumber.value;
    const numerator = this.numerator.value;
    const denominator = this.denominator.value;
    const output = wholeNumber
      ? `${wholeNumber} ${numerator}/${denominator}`
      : `${numerator}/${denominator}`;
    this.send.emit(output);
    this.close.emit();

    this.numerator.reset();
    this.denominator.reset();
    this.wholeNumber.reset();
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
