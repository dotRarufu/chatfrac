import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionsService } from 'src/app/services/actions.service';
import { MessageService } from 'src/app/services/message.service';
import { StepService } from 'src/app/services/step.service';
import { ChatBubble } from 'src/app/types/Message';

export type QuickReplyContent = {
  type: 'QuickReply';
  items: {
    label: string;
    callback?: () => void;
  }[];
};

@Component({
  selector: 'refactored-quick-replies',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class=" flex gap-[16px] carousel px-[16px] ">
      <div *ngFor="let item of content" class="carousel-item ">
        <div
          class="rounded-[24px] font-normal btn-sm  text-[20px] px-[28px] py-[4px]   btn btn-primary w-full normal-case min-h-[28px] h-[28px] "
          (click)="handleCallback(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  `,
})
export default class RefactoredQuickRepliesComponent {
  @Input() content: string[] = [];
  @Output() send = new EventEmitter<string>();

  handleCallback(content: string) {
    this.send.emit(content);
  }
}
