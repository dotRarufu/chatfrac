import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from './message.service';
import { UserService } from './user.service';
import showMessages from '../utils/showMessages';
import Phases from '../types/Phases';
import { StateService } from './state.service';
import { Router } from '@angular/router';
import { preTestQuestions } from '../preTestQuestions';
import { ActionsService } from './actions.service';
import { definitionQuestions } from '../definitionCategory';
import { examplesQuestions } from '../examplesCategory';
import { postTestQuestions } from '../postTestQuestions';
import { modelsQuestions } from '../modelsCategory';

@Injectable({
  providedIn: 'root',
})
export class StepService {
  private readonly currentSubject = new BehaviorSubject(1);
  current$ = this.currentSubject.asObservable();
  current = signal(Phases.GREET);

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private stateService: StateService,
    private router: Router,
    private actionsService: ActionsService,
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
  private getCurrentPostTestAnswers() {
    const currentIndex = this.stateService.currentPostTestQuestion();
    const questions = postTestQuestions;

    return questions[currentIndex].answers;
  }
  private getCurrentDefinitionAnswers() {
    const currentIndex = this.stateService.currentDefinitionQuestion();
    const questions = definitionQuestions;

    return questions[currentIndex].answers;
  }
  private getCurrentExamplesAnswers() {
    const currentIndex = this.stateService.currentExamplesQuestion();
    const questions = examplesQuestions;

    return questions[currentIndex].answers;
  }
  private getCurrentModelsAnswers() {
    const currentIndex = this.stateService.currentModelsQuestion();
    const questions = modelsQuestions;

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
  private checkPostTestIsLastQuestion() {
    return (
      this.stateService.currentPostTestQuestion() >= postTestQuestions.length
    );
  }
  private checkDefinitionIsLastQuestion() {
    return (
      this.stateService.currentDefinitionQuestion() >=
      definitionQuestions.length
    );
  }
  private checkModelsIsLastQuestion() {
    return this.stateService.currentModelsQuestion() >= modelsQuestions.length;
  }
  private checkExamplesIsLastQuestion() {
    return (
      this.stateService.currentExamplesQuestion() >= examplesQuestions.length
    );
  }

  private updateCategoryScoreToNonNull(category: string) {
    const categoryScore =
      this.userService.getCurrentValue().categories[category];
    const newUserData = this.userService.getCurrentValue();
    newUserData.categories[category] = 0;
    console.log('category:', category);
    console.log('categoryScore:', categoryScore);
    if (categoryScore === null) {
      this.userService.set(newUserData);
    }
  }
  private updatePostTestScoreToNonNull() {
    const score = this.userService.getCurrentValue().postTestScore;
    const newUserData = this.userService.getCurrentValue();
    newUserData.postTestScore = 0;

    if (score === null) {
      this.userService.set(newUserData);
    }
  }
  private updatePreTestScoreToNonNull() {
    const score = this.userService.getCurrentValue().preTestScore;
    const newUserData = this.userService.getCurrentValue();
    newUserData.preTestScore = 0;

    if (score === null) {
      this.userService.set(newUserData);
    }
  }

  update() {
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
            this.updatePreTestScoreToNonNull();

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
            this.updatePreTestScoreToNonNull();
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

      case Phases.DEFINITION_INTRO:
        {
          const score =
            this.userService.getCurrentValue().categories['definition'];

          if (score !== null) {
            this.moveToPhase(Phases.CATEGORY_ALREADY_SELECTED);
          } else {
            this.moveToPhase(Phases.DEFINITION_INTRO);
          }
        }
        break;
      case Phases.DEFINITION_INTRO_2:
        {
          this.moveToPhase(Phases.DEFINITION_INTRO_2);
        }
        break;
      case Phases.DEFINITION_INTRO_3:
        {
          this.actionsService.content.set({
            type: 'Input',
          });
          this.moveToPhase(Phases.DEFINITION_INTRO_3);
        }
        break;
      case Phases.DEFINITION_INTRO_4:
        {
          this.actionsService.content.set({
            type: 'Input',
          });
          this.moveToPhase(Phases.DEFINITION_QUESTION);
        }
        break;

      case Phases.DEFINITION_QUESTION:
        {
          const message = this.getUserMessage();
          const answers = this.getCurrentDefinitionAnswers();
          const isCorrect = this.checkAnswer(message, answers);

          if (isCorrect) {
            this.userService.increaseCategoryScore('definition');
            this.stateService.currentDefinitionQuestion.update(
              (old) => old + 1,
            );

            this.moveToPhase(Phases.DEFINITION_CORRECT);

            return;
          }

          this.moveToPhase(Phases.DEFINITION_WRONG);
        }
        break;
      case Phases.DEFINITION_CORRECT:
        {
          const isLastQuestion = this.checkDefinitionIsLastQuestion();

          if (isLastQuestion) {
            this.moveToPhase(Phases.DEFINITION_RESULT);
            this.updateCategoryScoreToNonNull('definition');

            return;
          }

          this.moveToPhase(Phases.DEFINITION_QUESTION);
        }
        break;
      case Phases.DEFINITION_WRONG:
        {
          this.stateService.currentDefinitionQuestion.update((old) => old + 1);
          const isLastQuestion = this.checkDefinitionIsLastQuestion();

          if (isLastQuestion) {
            this.moveToPhase(Phases.DEFINITION_RESULT);
            this.updateCategoryScoreToNonNull('definition');

            return;
          }

          this.moveToPhase(Phases.DEFINITION_QUESTION);
        }
        break;

      case Phases.DEFINITION_RESULT:
        {
          this.moveToPhase(Phases.SELECT_CATEGORY_1);
        }
        break;

      case Phases.EXAMPLES_INTRO_1:
        {
          const score =
            this.userService.getCurrentValue().categories['examples'];

          if (score !== null) {
            this.moveToPhase(Phases.CATEGORY_ALREADY_SELECTED);
          } else {
            this.moveToPhase(Phases.EXAMPLES_INTRO_1);
          }
        }
        break;
      case Phases.EXAMPLES_QUESTION:
        {
          const message = this.getUserMessage();
          const answers = this.getCurrentExamplesAnswers();
          const isCorrect = this.checkAnswer(message, answers);

          if (isCorrect) {
            this.userService.increaseCategoryScore('examples');
            this.stateService.currentExamplesQuestion.update((old) => old + 1);

            this.moveToPhase(Phases.EXAMPLES_CORRECT);

            return;
          }

          this.moveToPhase(Phases.EXAMPLES_WRONG);
        }
        break;
      case Phases.EXAMPLES_CORRECT:
        {
          const isLastQuestion = this.checkExamplesIsLastQuestion();

          if (isLastQuestion) {
            this.moveToPhase(Phases.EXAMPLES_RESULT);
            this.updateCategoryScoreToNonNull('examples');

            return;
          }

          this.moveToPhase(Phases.EXAMPLES_QUESTION);
        }
        break;
      case Phases.EXAMPLES_WRONG:
        {
          this.stateService.currentExamplesQuestion.update((old) => old + 1);
          const isLastQuestion = this.checkExamplesIsLastQuestion();

          if (isLastQuestion) {
            this.moveToPhase(Phases.EXAMPLES_RESULT);
            this.updateCategoryScoreToNonNull('examples');

            return;
          }

          this.moveToPhase(Phases.EXAMPLES_QUESTION);
        }
        break;

      case Phases.EXAMPLES_RESULT:
        {
          this.moveToPhase(Phases.SELECT_CATEGORY_1);
        }
        break;
      case Phases.MODELS_INTRO_1_BLOCK:
        {
          const score = this.userService.getCurrentValue().categories['models'];

          if (score !== null) {
            this.moveToPhase(Phases.CATEGORY_ALREADY_SELECTED);
          } else {
            this.moveToPhase(Phases.MODELS_INTRO_1_BLOCK);
          }
        }
        break;
      case Phases.MODELS_QUESTION:
        {
          const message = this.getUserMessage();
          const answers = this.getCurrentModelsAnswers();
          const isCorrect = this.checkAnswer(message, answers);

          if (isCorrect) {
            this.userService.increaseCategoryScore('models');
            this.stateService.currentModelsQuestion.update((old) => old + 1);

            this.moveToPhase(Phases.MODELS_CORRECT);

            return;
          }

          this.moveToPhase(Phases.MODELS_WRONG);
        }
        break;
      case Phases.MODELS_CORRECT:
        {
          const isLastQuestion = this.checkModelsIsLastQuestion();

          if (isLastQuestion) {
            this.moveToPhase(Phases.MODELS_RESULT);
            this.updateCategoryScoreToNonNull('models');

            return;
          }

          this.moveToPhase(Phases.MODELS_QUESTION);
        }
        break;
      case Phases.MODELS_WRONG:
        {
          this.stateService.currentModelsQuestion.update((old) => old + 1);
          const isLastQuestion = this.checkModelsIsLastQuestion();

          if (isLastQuestion) {
            this.moveToPhase(Phases.MODELS_RESULT);
            this.updateCategoryScoreToNonNull('models');

            return;
          }

          this.moveToPhase(Phases.MODELS_QUESTION);
        }
        break;

      case Phases.MODELS_RESULT:
        {
          this.moveToPhase(Phases.SELECT_CATEGORY_1);
        }
        break;

      case Phases.POSTTEST_QUESTION:
        {
          const message = this.getUserMessage();
          const answers = this.getCurrentPostTestAnswers();
          const isCorrect = this.checkAnswer(message, answers);

          if (isCorrect) {
            this.userService.increasePostTestScore();
            this.stateService.currentPostTestQuestion.update((old) => old + 1);

            this.moveToPhase(Phases.POSTTEST_CORRECT);

            return;
          }

          this.moveToPhase(Phases.POSTTEST_WRONG);
        }
        break;
      case Phases.POSTTEST_CORRECT:
        {
          const isLastQuestion = this.checkPostTestIsLastQuestion();

          if (isLastQuestion) {
            this.moveToPhase(Phases.POSTTEST_RESULT);
            this.updatePostTestScoreToNonNull();

            return;
          }

          this.moveToPhase(Phases.POSTTEST_QUESTION);
        }
        break;
      case Phases.POSTTEST_WRONG:
        {
          this.stateService.currentPostTestQuestion.update((old) => old + 1);
          const isLastQuestion = this.checkPostTestIsLastQuestion();

          if (isLastQuestion) {
            this.moveToPhase(Phases.POSTTEST_RESULT);
            this.updatePostTestScoreToNonNull();

            return;
          }

          this.moveToPhase(Phases.POSTTEST_QUESTION);
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
