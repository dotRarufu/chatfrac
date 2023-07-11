import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from './message.service';
import { UserService } from './user.service';
import showMessages from '../utils/showMessages';
import Phases from '../types/Phases';

@Injectable({
  providedIn: 'root',
})
export class StepService {
  private readonly currentSubject = new BehaviorSubject(1);
  current$ = this.currentSubject.asObservable();
  current = signal(Phases.DEMOGRAPHICS_NAME);

  constructor(
    private messageService: MessageService,
    private userService: UserService
  ) {}

  getCurrent() {
    return this.currentSubject.getValue();
  }

  update() {
    switch (this.current()) {
      case Phases.DEMOGRAPHICS_NAME:
        {
          const messages = this.messageService.messages();
          const userMessage = messages[messages.length - 1];
          if (userMessage.type === 'ChatBubble') {
            const data = this.userService.getCurrentvalue();
            this.userService.set({ ...data, name: userMessage.content });
            this.current.update((old) => old + 1);
          }
        }
        break;
      case Phases.DEMOGRAPHICS_SCHOOL:
        {
          const messages = this.messageService.messages();
          const userMessage = messages[messages.length - 1];
          if (userMessage.type === 'ChatBubble') {
            const data = this.userService.getCurrentvalue();
            this.userService.set({ ...data, school: userMessage.content });
            this.current.update((old) => old + 1);
          }
        }
        break;
      case Phases.PRETEST_1:
        {
          const messages = this.messageService.messages();
          const userMessage = messages[messages.length - 1].content;

          if (userMessage === 'a correct answer') {
            this.userService.increasePreTestScore();
            this.current.update((old) => Phases.PRETEST_1_CORRECT);
          } else {
            this.current.update((old) => Phases.PRETEST_1_WRONG);
          }
        }
        break;
      case Phases.PRETEST_1_CORRECT:
        {
          this.current.update((old) => Phases.PRETEST_2);
        }
        break;
      case Phases.PRETEST_1_WRONG:
        {
          this.current.update((old) => Phases.PRETEST_2);
        }
        break;
      case Phases.PRETEST_2:
        {
          // console.log('runs 4.1 or 4.2');
          const messages = this.messageService.messages();
          const userMessage = messages[messages.length - 1].content;

          if (userMessage === 'a correct answer') {
            this.userService.increasePreTestScore();
            this.current.update((old) => Phases.PRETEST_2_CORRECT);
          } else {
            this.current.update((old) => Phases.PRETEST_2_WRONG);
          }
        }
        break;
      case Phases.PRETEST_2_CORRECT:
        {
          this.current.update((old) => Phases.PRETEST_RESULT);
        }
        break;
      case Phases.PRETEST_2_WRONG:
        {
          this.current.update((old) => Phases.PRETEST_RESULT);
        }
        break;
      case Phases.PRETEST_RESULT:
        {
          this.current.update((old) => Phases.SELECT_CATEGORY_1);
        }
        break;

      default:
        break;
    }
  }
}
