import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { Message } from 'src/app/types/Message';
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
import SendIconComponent from 'src/components/icons/send.component';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  delay,
  delayWhen,
  interval,
  map,
  mergeMap,
  of,
  tap,
  timer,
  zip,
} from 'rxjs';
import RefactoredChatInputComponent from 'src/components/refactored/refactored-chat-input.component';
import RefactoredQuickRepliesComponent from 'src/components/refactored/refactored-quick-replies.component';
import programmedPhases from '../data/programmedPhases';
import RefactoredChatButtonComponent from 'src/components/refactored/refactored-chat-button.component';
import { CarouselItem } from '../types/Message';
import { v4 as uuidv4 } from 'uuid';
import RefactoredHeaderComponent from 'src/components/refactored/refactored-app-header.component';

type InputType = 'QUICK_REPLY' | 'INPUT' | 'BUTTON';

export type PhaseQuestion = {
  answer: () => string[];
  inputType: InputType;
  buttonName?: string;
  quickReplies?: string[];
  id: string;
};

export interface Phase {
  id: string;
  next: (isCorrectAnswer: boolean | null, userInput: string) => string;
  getMessages: () => Message[];

  isQuestion?: PhaseQuestion;
  sideEffect?: (
    isCorrectAnswer: boolean | null,
    userInput: string,
  ) => Promise<void>;
}

export type Message = {
  sender: 'user' | 'bot';
  data: {
    bubble?: string;
    carousel?: CarouselItem[];
    image?: string;
    video?: string;
  };
};

const DELAY = 100;

const getPhase = (phaseId: string) => {
  const match = programmedPhases.find(({ id }) => id === phaseId);

  if (match) return match;

  const endPhase: Phase = {
    isQuestion: { answer: () => ['_'], inputType: 'INPUT', id: uuidv4() },
    id: 'end-of-everything',
    getMessages: () => [
      { data: { bubble: 'You have reached the end.' }, sender: 'bot' },
    ],
    next: () => '_',
  };

  return endPhase;
};

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
    SendIconComponent,
    ReactiveFormsModule,
    RefactoredChatInputComponent,
    RefactoredQuickRepliesComponent,
    RefactoredChatButtonComponent,
    RefactoredHeaderComponent,
  ],
  template: `
    <div
      class="w-full max-w-[480px] rounded-[5px] mx-auto h-screen flex flex-col "
      *ngIf="{
        isTyping: isTyping$ | async,
        activePhaseQuestion: activePhaseQuestion$ | async
      } as observables"
    >
      <refactored-app-header />

      <div
        class="h-[calc(100vh-140px)] flex flex-col p-[16px] overflow-y-scroll overflow-x-clip scroll-smooth "
        #scrollMe
        (scroll)="onScroll()"
      >
        <div class="flex-1">
          <div *ngFor="let message of messages$ | async">
            <chat-bubble
              *ngIf="message.data.bubble !== undefined"
              [sender]="message.sender"
              [message]="message.data.bubble"
            />
            <chat-carousel
              *ngIf="message.data.carousel !== undefined"
              [content]="message.data.carousel"
            />
            <chat-video
              *ngIf="message.data.video !== undefined"
              [url]="message.data.video"
            />
            <chat-image
              *ngIf="message.data.image !== undefined"
              [url]="message.data.image"
            />
          </div>
        </div>

        <div *ngIf="observables.isTyping" class="basis-[44px]">
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

      <div
        class=" p-[8px]"
        [ngSwitch]="observables.activePhaseQuestion?.inputType"
      >
        <ng-container *ngSwitchCase="'QUICK_REPLY'">
          <refactored-quick-replies
            [content]="observables.activePhaseQuestion?.quickReplies || []"
            [contentId]="observables.activePhaseQuestion?.id || ''"
            (send)="sendMessage($event)"
          />
          <div class="pt-[16px]">
            <chat-input [inputIsDisabled]="true" />
          </div>
        </ng-container>

        <ng-container *ngSwitchCase="'BUTTON'">
          <refactored-chat-button
            (send)="
              sendMessage(observables.activePhaseQuestion?.buttonName || '')
            "
            [content]="observables.activePhaseQuestion?.buttonName || ''"
            [contentId]="observables.activePhaseQuestion?.id || ''"
          />
        </ng-container>
        <refactored-chat-input
          [inputIsDisabled]="!!observables.isTyping"
          (send)="sendMessage($event)"
          *ngSwitchDefault
        />
      </div>
    </div>
  `,
})
export default class RefactorComponent implements AfterViewChecked {
  userInputSubject = new BehaviorSubject<string>('');
  userInput$ = this.userInputSubject.asObservable();
  userInputField = new FormControl('', { nonNullable: true });

  isTypingSubject = new BehaviorSubject(false);
  isTyping$ = this.isTypingSubject.asObservable();

  messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable().pipe(
    concatMap((item) =>
      of(item).pipe(
        tap((_) => this.isTypingSubject.next(true)),
        delayWhen((m) => {
          const isBotMessage = m[m.length - 1].sender === 'bot';

          return timer(isBotMessage ? DELAY : 0);
        }),
        tap((_) => this.isTypingSubject.next(false)),
      ),
    ),
  );

  activePhaseSubject = new BehaviorSubject<Phase>({
    id: 'bootloader',
    next: () => 'introduction',
    getMessages: () => [
      {
        data: { bubble: 'Boots up | this should not be visible' },
        sender: 'bot',
      },
    ],
  });
  // bug in activePhaseA$ and activePhase$, not synced with each other
  activePhaseA$ = this.activePhaseSubject.asObservable();
  activePhase$ = this.activePhaseSubject.asObservable();

  activePhaseQuestion = new BehaviorSubject<PhaseQuestion | undefined>(
    undefined,
  );
  activePhaseQuestion$ = this.activePhaseQuestion.asObservable().pipe(
    // To not immediately show after emit
    delay(DELAY),
  );

  activePhaseEffect = combineLatest({
    activePhase: this.activePhase$,
    userInput: this.userInput$,
  }).subscribe(({ activePhase, userInput }) => {
    const { isQuestion, sideEffect } = activePhase;
    console.log('activePhase:', activePhase);
    if (isQuestion) {
      this.activePhaseQuestion.next(isQuestion);

      if (userInput === '') return;

      // userInputField.reset() does not run immediately, use this instead
      this.userInputSubject.next('');

      const isCorrectAnswer = isQuestion.answer().includes(userInput);

      sideEffect && sideEffect(isCorrectAnswer, userInput);
      this.moveToNextPhase(isCorrectAnswer, userInput);

      return;
    }

    sideEffect && sideEffect(null, userInput);

    this.moveToNextPhase(null, userInput);
  });

  sendMessage(d: string) {
    const oldValues = this.messagesSubject.getValue();
    const newValues: Message[] = [
      ...oldValues,
      { data: { bubble: d }, sender: 'user' },
    ];

    this.messagesSubject.next(newValues);

    this.userInputSubject.next(d);
  }

  moveToNextPhase(isAnswerCorrect: boolean | null, userInput: string) {
    const currentPhase = this.activePhaseSubject.getValue();
    const nextPhase = getPhase(currentPhase.next(isAnswerCorrect, userInput));

    // Order matters, show message before moving to next phase

    nextPhase.getMessages().forEach((m) => this.pushNewMessage(m));

    this.activePhaseSubject.next(nextPhase);
  }

  pushNewMessage(m: Message) {
    const oldValues = [...this.messagesSubject.getValue()];
    const newValues = [...oldValues, m];

    this.messagesSubject.next(newValues);
  }

  // =====================================

  disableScrollDown = false;
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  onScroll() {
    let element = this.myScrollContainer.nativeElement;
    let atBottom =
      element.scrollHeight - element.scrollTop === element.clientHeight;
    if (this.disableScrollDown && atBottom) {
      this.disableScrollDown = false;
    } else {
      this.disableScrollDown = true;
    }
  }

  private scrollToBottom(): void {
    if (this.disableScrollDown) {
      return;
    }
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
