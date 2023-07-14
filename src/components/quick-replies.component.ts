import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  selector: 'quick-replies',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class=" flex gap-[16px] carousel px-[16px] ">
      <div *ngFor="let item of content.items" class="carousel-item ">
        <div
          class="rounded-[24px] font-normal btn-sm  text-[20px] px-[28px] py-[4px]   btn btn-primary w-full normal-case min-h-[28px] h-[28px] "
          (click)="handleCallback(item.label, item.callback)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
  `,
})
export default class QuickRepliesComponent {
  @Input() content: QuickReplyContent = { items: [], type: 'QuickReply' };

  constructor(
    private stepService: StepService,
    private actionsService: ActionsService,
    private messageService: MessageService,
  ) {}

  private runLogicUpdate() {
    this.stepService.update();
  }

  handleCallback(label: string, callback?: () => void) {
    callback && callback();

    const data: ChatBubble = {
      content: label,
      sender: 'user',
      type: 'ChatBubble',
    };

    this.messageService.add(data);
    // might have conflict when next action is a button
    this.actionsService.content.set({ type: 'Input', isDisabled: false });
    this.runLogicUpdate();
  }
}
