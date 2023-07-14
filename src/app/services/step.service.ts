import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from './message.service';
import { UserService } from './user.service';
import showMessages from '../utils/showMessages';
import Phases from '../types/Phases';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root',
})
export class StepService {
  private readonly currentSubject = new BehaviorSubject(1);
  current$ = this.currentSubject.asObservable();
  current = signal(Phases.GREET);
  // current = signal(Phases.GREET);

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private stateService: StateService,
  ) {}

  getCurrent() {
    return this.currentSubject.getValue();
  }

  private getUserMessage() {
    // Assumes that every last message is by user
    const messages = this.messageService.messages();
    const message = messages[messages.length - 1];

    if (message.type === 'ChatBubble') {
      if (message.sender !== 'user')
        throw new Error('is not a message by user');

      return message.content;
    }

    throw new Error('user message has to be of chatbubble type');
  }

  private moveToPhase(p: Phases) {
    this.current.set(p);
    // console.log('step servce | move to:', p);
  }

  update() {
    switch (this.current()) {
      case Phases.GREET:
        {
          this.moveToPhase(Phases.DEMOGRAPHICS_NAME_1);
        }
        break;
      case Phases.DEMOGRAPHICS_NAME_1:
        {
          const message = this.getUserMessage();

          this.moveToPhase(Phases.DEMOGRAPHICS_NAME_2);
          this.stateService.string.update((old) => ({ ...old, name: message }));
        }
        break;
      case Phases.DEMOGRAPHICS_NAME_2:
        {
          const message = this.getUserMessage();

          if (message === 'Yes') {
            const data = this.userService.getCurrentvalue();
            this.userService.set({
              ...data,
              name: this.stateService.string()['name'],
            });

            this.moveToPhase(Phases.DEMOGRAPHICS_SCHOOL);
          } else {
            this.moveToPhase(Phases.DEMOGRAPHICS_NAME_1);
          }
        }
        break;
      case Phases.DEMOGRAPHICS_SCHOOL:
        {
          const message = this.getUserMessage();
          const data = this.userService.getCurrentvalue();
          this.userService.set({ ...data, school: message });
          this.moveToPhase(Phases.PRETEST_1);
        }
        break;
      case Phases.PRETEST_1:
        {
          const message = this.getUserMessage();

          if (message === '2') {
            this.userService.increasePreTestScore();
            this.moveToPhase(Phases.PRETEST_1_CORRECT);
          } else {
            this.moveToPhase(Phases.PRETEST_1_WRONG);
          }
        }
        break;
      case Phases.PRETEST_1_CORRECT:
        {
          this.moveToPhase(Phases.PRETEST_2);
        }
        break;
      case Phases.PRETEST_1_WRONG:
        {
          this.moveToPhase(Phases.PRETEST_2);
        }
        break;
      case Phases.PRETEST_2:
        {
          const message = this.getUserMessage();

          if (message === '4') {
            this.userService.increasePreTestScore();
            this.moveToPhase(Phases.PRETEST_2_CORRECT);
          } else {
            this.moveToPhase(Phases.PRETEST_2_WRONG);
          }
        }
        break;
      case Phases.PRETEST_2_CORRECT:
        {
          this.moveToPhase(Phases.PRETEST_RESULT);
        }
        break;
      case Phases.PRETEST_2_WRONG:
        {
          this.moveToPhase(Phases.PRETEST_RESULT);
        }
        break;
      case Phases.PRETEST_RESULT:
        {
          this.moveToPhase(Phases.SELECT_CATEGORY_1);
        }
        break;
      case Phases.ANIMALS_INTRO:
        {
          const score =
            this.userService.getCurrentvalue().categories['animals'];

          console.log('steps | animals intro runs');

          if (score !== -1) {
            this.moveToPhase(Phases.CATEGORY_ALREADY_SELECTED);
          } else {
            this.moveToPhase(Phases.ANIMALS_INTRO);
          }
        }
        break;
      case Phases.ANIMALS_1:
        {
          const message = this.getUserMessage();

          if (message === 'cat') {
            this.userService.increaseCategoryScore('animals');
            this.moveToPhase(Phases.ANIMALS_1_CORRECT);
            break;
          }
          this.moveToPhase(Phases.ANIMALS_1_WRONG);
        }
        break;
      case Phases.ANIMALS_1_CORRECT:
        {
          this.moveToPhase(Phases.ANIMALS_2);
        }
        break;
      case Phases.ANIMALS_1_WRONG:
        {
          this.moveToPhase(Phases.ANIMALS_2);
        }
        break;
      case Phases.ANIMALS_2:
        {
          const message = this.getUserMessage();

          if (message === 'cat') {
            this.userService.increaseCategoryScore('animals');
            this.moveToPhase(Phases.ANIMALS_2_CORRECT);
            break;
          }
          this.moveToPhase(Phases.ANIMALS_2_WRONG);
        }
        break;
      case Phases.ANIMALS_2_CORRECT:
        {
          this.moveToPhase(Phases.ANIMALS_RESULT);
        }
        break;
      case Phases.ANIMALS_2_WRONG:
        {
          this.moveToPhase(Phases.ANIMALS_RESULT);
        }
        break;
      case Phases.ANIMALS_RESULT:
        {
          const score =
            this.userService.getCurrentvalue().categories['animals'];

          if (score === -1) {
            this.userService.increaseCategoryScore('animals');
          }

          this.moveToPhase(Phases.SELECT_CATEGORY_1);
        }
        break;
      case Phases.CATEGORY_ALREADY_SELECTED:
        {
          this.moveToPhase(Phases.SELECT_CATEGORY_1);
        }
        break;

      default:
        break;
    }
  }
}
