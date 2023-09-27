import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  signal,
} from '@angular/core';
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
          [class.btn-disabled]="notAllowed()"
          (click)="handleCallback(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  `,
})
export default class RefactoredQuickRepliesComponent implements OnChanges {
  @Input() content: string[] = [];
  @Output() send = new EventEmitter<string>();
  @Input() contentId: string = '';
  notAllowed = signal(false);
  // can add id input to update notAllowed signal whenever this changes

  handleCallback(content: string) {
    if (this.notAllowed()) return;

    this.send.emit(content);
    this.notAllowed.set(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const previousContentId = changes['contentId'].previousValue as string;
    const newContentId = changes['contentId'].currentValue as string;

    if (newContentId !== previousContentId) this.notAllowed.set(false);

    const newContent = changes['content'].currentValue as string[];

    this.content = newContent;
    this.notAllowed.set(false);
  }
}
