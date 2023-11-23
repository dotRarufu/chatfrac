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
  selector: 'refactored-chat-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="handleCallback()"
      class="btn w-full btn-primary text-secondary"
      [class.btn-disabled]="notAllowed()"
    >
      {{ content }}
    </button>
  `,
})
export default class RefactoredChatButtonComponent implements OnChanges {
  @Input() content: string = '';
  @Input() contentId: string = '';
  @Output() send = new EventEmitter<string>();
  notAllowed = signal(false);

  handleCallback() {
    if (this.notAllowed()) return;

    this.send.emit(this.content);
    this.notAllowed.set(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const previousContentId = changes['contentId'].previousValue as string;
    const newContentId = changes['contentId'].currentValue as string;

    if (newContentId !== previousContentId) this.notAllowed.set(false);

    const newContent = changes['content'].currentValue as string;

    this.content = newContent;
    this.notAllowed.set(false);
  }
}
