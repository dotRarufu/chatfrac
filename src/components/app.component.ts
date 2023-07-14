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
  template: ` <router-outlet />`,
})
export class AppComponent {}
