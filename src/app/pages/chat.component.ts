import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Message } from 'src/app/types/Message';
import {
  ActionsService,
  ButtonContent,
} from 'src/app/services/actions.service';
import { StateService } from 'src/app/services/state.service';
import ChatBubbleComponent from 'src/components/chat-bubble.component';
import ChatInputComponent from 'src/components/chat-input.component';
import ChatCarouselComponent from 'src/components/chat-carousel.component';
import HeaderComponent from 'src/components/header.component';
import QuickRepliesComponent, {
  QuickReplyContent,
} from 'src/components/quick-replies.component';
import { ShowMessageComponent } from './show-message.component';
import { SupabaseService } from '../services/supabase.service';
import ChatVideoComponent from 'src/components/chat-video.component';
import ChatImageComponent from 'src/components/chat-image.component';

@Component({
  selector: 'chat',
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
    ShowMessageComponent,
    ChatVideoComponent,
    ChatImageComponent,
  ],
  template: `
    <div
      class="w-full max-w-[480px] rounded-[5px] mx-auto h-screen flex flex-col "
    >
      <app-header />

      <div
        class="h-[calc(100vh-140px)] flex flex-col p-[16px] overflow-y-scroll overflow-x-clip  "
        #scrollMe
      >
        <div class="flex-1  ">
          <div *ngFor="let message of messageService.messages()">
            <chat-bubble
              *ngIf="message.type === 'ChatBubble'"
              [sender]="message.sender"
              [message]="message.content"
              [link]="message.isLink ? message.content : undefined"
            />
            <chat-carousel
              *ngIf="message.type === 'Carousel'"
              [content]="message.content"
            />
            <chat-video
              *ngIf="message.type === 'ChatVideo'"
              [url]="message.videoLink"
            />
            <chat-image
              *ngIf="message.type === 'ChatImage'"
              [url]="message.imgSrc"
            />
          </div>
        </div>

        <div *ngIf="messageService.isTyping$ | async" class="basis-[44px]">
          <div class="chat chat-start">
            <div class="chat-bubble chat-bubble-secondary">
              <div class="flex items-center h-[28px]">
                <div
                  class="animate-[mercury_1.8s_ease-in-out_infinite] bg-[#6CAD96] rounded-full h-[7px] mr-[4px] align-middle w-[7px] inline-block [animation-delay:200ms]"
                ></div>
                <div
                  class="animate-[mercury_1.8s_ease-in-out_infinite] bg-[#6CAD96] rounded-full h-[7px] mr-[4px] align-middle w-[7px] inline-block [animation-delay:300ms]"
                ></div>
                <div
                  class="animate-[mercury_1.8s_ease-in-out_infinite] bg-[#6CAD96] rounded-full h-[7px] mr-0 align-middle w-[7px] inline-block [animation-delay:400ms] "
                ></div>
              </div>
            </div>
          </div>
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
              *ngIf="supabaseService.isSavingData()"
              class="btn w-full btn-primary"
              [disabled]="true"
            >
              <span class="loading loading-spinner loading-md"></span>
              Saving data
            </button>

            <button
              *ngIf="!supabaseService.isSavingData()"
              (click)="getButtonContent().callback()"
              class="btn w-full btn-primary"
            >
              {{ getButtonContent().label }}
            </button>
          </ng-container>

          <div *ngSwitchDefault class=""></div>
        </ng-container>
      </div>
    </div>

    <show-message />
  `,
})
export default class ChatComponent implements OnInit, AfterViewChecked {
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
    public supabaseService: SupabaseService,
  ) {
    console.log('chat comp runs');
  }

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
