import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from './message.service';
import { UserService } from './user.service';
import showMessages from '../utils/showMessages';
import Phases from '../types/Phases';
import { StateService } from './state.service';
import { Router } from '@angular/router';
import { preTestQuestions } from '../questions';

@Injectable({
  providedIn: 'root',
})
export class StepService {
  private readonly currentSubject = new BehaviorSubject(1);
  current$ = this.currentSubject.asObservable();
  current = signal(Phases.CATEGORIES_END_CAROUSEL);

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private stateService: StateService,
    private router: Router,
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

  private getCurrentPreTestAnswers() {
    const currentIndex = this.stateService.currentPreTestQuestion();
    const questions = preTestQuestions;

    return questions[currentIndex].answers;
  }

  private checkAnswer(message: string, answers: string[]) {
    const isCorrect = answers.includes(message);

    return isCorrect;
  }

  private checkIsLastQuestion() {
    return (
      this.stateService.currentPreTestQuestion() >= preTestQuestions.length
    );
  }

  update() {
    console.log('update runs:', this.current());
    switch (this.current()) {
      case Phases.NO_MORE:
        {
          this.router.navigate(['/']);
        }
        break;
      case Phases.CHAT_END:
        {
          this.moveToPhase(Phases.CHAT_END_BACK_BUTTON);
        }
        break;
      case Phases.CHAT_END_BACK_BUTTON:
        {
          this.moveToPhase(Phases.NO_MORE);
          this.router.navigate(['/']);
        }
        break;
      case Phases.CATEGORIES_END_1:
        {
          this.moveToPhase(Phases.POSTTEST_INTRO);
        }
        break;
      case Phases.CATEGORY_ALREADY_SELECTED:
        {
          this.moveToPhase(Phases.SELECT_CATEGORY_1);
        }
        break;
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
            const data = this.userService.getCurrentValue();
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
          const data = this.userService.getCurrentValue();
          this.userService.set({ ...data, school: message });
          this.moveToPhase(Phases.PRETEST_INTRO);
        }
        break;
      case Phases.PRETEST_QUESTION:
        {
          const message = this.getUserMessage();
          const answers = this.getCurrentPreTestAnswers();
          const isCorrect = this.checkAnswer(message, answers);

          if (isCorrect) {
            this.userService.increasePreTestScore();
            this.stateService.currentPreTestQuestion.update((old) => old + 1);

            this.moveToPhase(Phases.PRETEST_CORRECT);

            return;
          }

          this.moveToPhase(Phases.PRETEST_WRONG);
        }
        break;
      case Phases.PRETEST_CORRECT:
        {
          const isLastQuestion = this.checkIsLastQuestion();

          if (isLastQuestion) {
            this.moveToPhase(Phases.PRETEST_RESULT);

            return;
          }

          this.moveToPhase(Phases.PRETEST_QUESTION);
        }
        break;
      case Phases.PRETEST_WRONG:
        {
          this.stateService.currentPreTestQuestion.update((old) => old + 1);
          const isLastQuestion = this.checkIsLastQuestion();

          if (isLastQuestion) {
            this.moveToPhase(Phases.PRETEST_RESULT);

            return;
          }

          this.moveToPhase(Phases.PRETEST_QUESTION);
        }
        break;
      case Phases.PRETEST_INTRO:
        {
          this.moveToPhase(Phases.PRETEST_QUESTION);
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
            this.userService.getCurrentValue().categories['animals'];

          // console.log('steps | animals intro runs');

          if (score !== null) {
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
            this.userService.getCurrentValue().categories['animals'];

          if (score === null) {
            this.userService.increaseCategoryScore('animals');
          }

          this.moveToPhase(Phases.SELECT_CATEGORY_1);
        }
        break;

      case Phases.PLACES_INTRO:
        {
          const score = this.userService.getCurrentValue().categories['places'];

          // console.log('steps | animals intro runs');

          if (score !== null) {
            this.moveToPhase(Phases.CATEGORY_ALREADY_SELECTED);
          } else {
            this.moveToPhase(Phases.PLACES_INTRO);
          }
        }
        break;
      case Phases.PLACES_1:
        {
          const message = this.getUserMessage();

          if (message === 'Manila') {
            this.userService.increaseCategoryScore('places');
            this.moveToPhase(Phases.PLACES_1_CORRECT);
            break;
          }
          this.moveToPhase(Phases.PLACES_1_WRONG);
        }
        break;
      case Phases.PLACES_1_CORRECT:
        {
          this.moveToPhase(Phases.PLACES_2);
        }
        break;
      case Phases.PLACES_1_WRONG:
        {
          this.moveToPhase(Phases.PLACES_2);
        }
        break;
      case Phases.PLACES_2:
        {
          const message = this.getUserMessage();

          if (message === 'Tokyo') {
            this.userService.increaseCategoryScore('places');
            this.moveToPhase(Phases.PLACES_2_CORRECT);
            break;
          }
          this.moveToPhase(Phases.PLACES_2_WRONG);
        }
        break;
      case Phases.PLACES_2_CORRECT:
        {
          this.moveToPhase(Phases.PLACES_RESULT);
        }
        break;
      case Phases.PLACES_2_WRONG:
        {
          this.moveToPhase(Phases.PLACES_RESULT);
        }
        break;
      case Phases.PLACES_RESULT:
        {
          const score = this.userService.getCurrentValue().categories['places'];

          if (score === null) {
            this.userService.increaseCategoryScore('places');
          }

          this.moveToPhase(Phases.SELECT_CATEGORY_1);
        }
        break;

      case Phases.NUMBERS_INTRO:
        {
          const score =
            this.userService.getCurrentValue().categories['numbers'];

          // console.log('steps | animals intro runs');

          if (score !== null) {
            this.moveToPhase(Phases.CATEGORY_ALREADY_SELECTED);
          } else {
            this.moveToPhase(Phases.NUMBERS_INTRO);
          }
        }
        break;
      case Phases.NUMBERS_1:
        {
          const message = this.getUserMessage();

          if (message === '1') {
            this.userService.increaseCategoryScore('numbers');
            this.moveToPhase(Phases.NUMBERS_1_CORRECT);
            break;
          }
          this.moveToPhase(Phases.NUMBERS_1_WRONG);
        }
        break;
      case Phases.NUMBERS_1_CORRECT:
        {
          this.moveToPhase(Phases.NUMBERS_2);
        }
        break;
      case Phases.NUMBERS_1_WRONG:
        {
          this.moveToPhase(Phases.NUMBERS_2);
        }
        break;
      case Phases.NUMBERS_2:
        {
          const message = this.getUserMessage();

          if (message === '1') {
            this.userService.increaseCategoryScore('numbers');
            this.moveToPhase(Phases.NUMBERS_2_CORRECT);
            break;
          }
          this.moveToPhase(Phases.NUMBERS_2_WRONG);
        }
        break;
      case Phases.NUMBERS_2_CORRECT:
        {
          this.moveToPhase(Phases.NUMBERS_RESULT);
        }
        break;
      case Phases.NUMBERS_2_WRONG:
        {
          this.moveToPhase(Phases.NUMBERS_RESULT);
        }
        break;
      case Phases.NUMBERS_RESULT:
        {
          const score =
            this.userService.getCurrentValue().categories['numbers'];

          if (score === null) {
            this.userService.increaseCategoryScore('numbers');
          }

          this.moveToPhase(Phases.SELECT_CATEGORY_1);
        }
        break;
      case Phases.CATEGORIES_END_NO:
        {
          this.moveToPhase(Phases.POSTTEST_INTRO);
        }
        break;
      case Phases.POSTTEST_INTRO:
        {
          this.moveToPhase(Phases.POSTTEST_1);
        }
        break;
      case Phases.POSTTEST_1:
        {
          const message = this.getUserMessage();

          if (message === '2') {
            this.userService.increasePostTestScore();
            this.moveToPhase(Phases.POSTTEST_1_CORRECT);
          } else {
            this.moveToPhase(Phases.POSTTEST_1_WRONG);
          }
        }
        break;
      case Phases.POSTTEST_1_CORRECT:
        {
          this.moveToPhase(Phases.POSTTEST_2);
        }
        break;
      case Phases.POSTTEST_1_WRONG:
        {
          this.moveToPhase(Phases.POSTTEST_2);
        }
        break;
      case Phases.POSTTEST_2:
        {
          const message = this.getUserMessage();

          if (message === '4') {
            this.userService.increasePostTestScore();
            this.moveToPhase(Phases.POSTTEST_2_CORRECT);
          } else {
            this.moveToPhase(Phases.POSTTEST_2_WRONG);
          }
        }
        break;
      case Phases.POSTTEST_2_CORRECT:
        {
          this.moveToPhase(Phases.POSTTEST_RESULT);
        }
        break;
      case Phases.POSTTEST_2_WRONG:
        {
          this.moveToPhase(Phases.POSTTEST_RESULT);
        }
        break;
      case Phases.POSTTEST_RESULT:
        {
          this.moveToPhase(Phases.CHAT_END);
        }
        break;
      default:
        break;
    }
  }
}
