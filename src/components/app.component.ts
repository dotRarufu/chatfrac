import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import ChatBubbleComponent from './chat-bubble.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import ChatInputComponent from './chat-input.component';
import { Message } from 'src/app/types/Message';
import ChatCarouselComponent from './chat-carousel.component';
import HeaderComponent from './header.component';
import QuickRepliesComponent, {
  QuickReplyContent,
} from './quick-replies.component';
import {
  ActionsService,
  ButtonContent,
} from 'src/app/services/actions.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ChatBubbleComponent,
    ChatInputComponent,
    FormsModule,
    RouterModule,
    ChatCarouselComponent,
    HeaderComponent,
    QuickRepliesComponent,
  ],
  template: `
    <div
      class="w-full max-w-[480px] border-[2px] border-base-content rounded-[5px] mx-auto h-screen flex flex-col "
    >
      <app-header />

      <div class="h-full p-[16px] overflow-y-scroll overflow-x-clip" #scrollMe>
        <div *ngFor="let message of messageService.messages()">
          <chat-bubble
            *ngIf="message.type === 'ChatBubble'"
            [sender]="message.sender"
            [message]="message.content"
          />
          <chat-carousel
            *ngIf="message.type === 'Carousel'"
            [content]="message.content"
          />
        </div>
      </div>

      <div class=" p-[8px]">
        <ng-container [ngSwitch]="actionsService.content().type">
          <ng-container *ngSwitchCase="'QuickReply'">
            <quick-replies [content]="getQuickReplyContent()" />
            <div class="pt-[16px]">
              <chat-input [inputIsDisabled]="true" />
            </div>
          </ng-container>

          <chat-input *ngSwitchCase="'Input'" />
          <!-- [isDisabled]="stateService.isChatInputDisabled$ | async" -->

          <ng-container *ngSwitchCase="'Button'">
            <button
              (click)="getButtonContent().callback()"
              class="btn w-full btn-primary"
            >
              {{ getButtonContent().label }}
            </button>
          </ng-container>

          <div *ngSwitchDefault class="">Error</div>
        </ng-container>
      </div>
    </div>

    <router-outlet />
  `,
})
export class AppComponent implements OnInit, AfterViewChecked {
  value = '';

  getQuickReplyContent(): QuickReplyContent {
    const content = this.actionsService.content();
    const isQuickReply = content.type === 'QuickReply';
    if (isQuickReply) return { type: 'QuickReply', items: content.items };

    throw new Error('not a quick reply ');
  }

  getButtonContent(): ButtonContent {
    const content = this.actionsService.content();
    const isQuickReply = content.type === 'Button';
    if (isQuickReply)
      return {
        type: 'Button',
        label: content.label,
        callback: content.callback,
      };

    throw new Error('not a button ');
  }

  constructor(
    public messageService: MessageService,
    public actionsService: ActionsService,
    public stateService: StateService,
  ) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  @ViewChild('scrollMe') private myScrollContainer?: ElementRef;

  ngOnInit() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.myScrollContainer !== undefined) {
      try {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight;
      } catch (err) {}
    }
  }
}
