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
  ],
  template: `
    <div
      class="w-full max-w-[480px] border border-red-500 mx-auto h-screen flex flex-col"
    >
      <div class="text-[32px] h-fit bg-primary p-[16px]">Chatbot App</div>

      <div class="h-full p-[16px] overflow-y-scroll" #scrollMe>
        <div *ngFor="let message of messageService.messages()">
          <!-- // * 2. Instantiate component based on the passed type -->

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

      <div class="h-fit p-[16px]">
        <chat-input />
      </div>
    </div>

    <router-outlet />
  `,
})
export class AppComponent implements OnInit, AfterViewChecked {
  value = '';

  constructor(public messageService: MessageService) {}

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
