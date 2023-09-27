import { correctAnswerGifs } from '../correctAnswerGifs';
import {
  BOT,
  CATEGORIES,
  Categories,
  LocalStorageKeys,
} from '../data/programmedPhases';
import { definitionQuestions } from '../definitionCategory';
import { examplesQuestions } from '../examplesCategory';
import { modelsQuestions } from '../modelsCategory';
import { Message, Phase } from '../pages/refactor.component';
import Question from '../types/Question';
import isAllCategoryAnswered from './isAllCategoryAnswered';
import { v4 as uuidv4 } from 'uuid';
import randomNumber from './randomNumber';
import { incorrectMessages, preTestQuestions } from '../preTestQuestions';
import { postTestQuestions } from '../postTestQuestions';

type PrePostCategories = 'pretest' | 'posttest';

export const PREPOSTCATEGORIES: {
  PRE_TEST: PrePostCategories;
  POST_TEST: PrePostCategories;
} = {
  PRE_TEST: 'pretest',
  POST_TEST: 'posttest',
};

const generatePrePostQuestionsPhases = (category: PrePostCategories) => {
  let selectedLocalStorageKeys = { number: '', score: '' };
  let selectedCategoryQuestions: Question[] = [];

  switch (category) {
    case PREPOSTCATEGORIES.PRE_TEST:
      selectedLocalStorageKeys.number = LocalStorageKeys.PRETEST_NUMBER;
      selectedLocalStorageKeys.score = LocalStorageKeys.PRETEST_SCORE;
      selectedCategoryQuestions = preTestQuestions;
      break;
    case PREPOSTCATEGORIES.POST_TEST:
      selectedLocalStorageKeys.number = LocalStorageKeys.POSTTEST_NUMBER;
      selectedLocalStorageKeys.score = LocalStorageKeys.POSTTEST_SCORE;
      selectedCategoryQuestions = postTestQuestions;
      break;

    default:
      break;
  }

  const res: Phase[] = [
    {
      id: `${category}-question`,
      next: (isCorrectAnswer) => {
        const currentNumber = Number(
          localStorage.getItem(selectedLocalStorageKeys.number) || 1,
        );
        const isLastNumber = currentNumber > 5;

        if (isLastNumber) return `${category}-result`;

        // todo: might not need to create unique correct and wrong phase for every category
        return isCorrectAnswer
          ? `${category}-question-correct`
          : `${category}-question-wrong`;
      },
      getMessages: () => {
        const currentNumber = Number(
          localStorage.getItem(selectedLocalStorageKeys.number) || 1,
        );
        const isLastNumber = currentNumber > 5;

        if (isLastNumber)
          return [
            {
              sender: BOT,
              data: {
                bubble: `You already answered all questions in ${category}`,
              },
            },
            {
              sender: BOT,
              data: {
                bubble: 'Type anything to proceed.',
              },
            },
          ];

        const currentQuestion = selectedCategoryQuestions[currentNumber - 1];

        const content = currentQuestion.content.text;

        let data: Message[] = [];

        if (typeof content !== 'string') {
          if ('imgSrc' in content) {
            const newData: Message = {
              data: { image: content.imgSrc },
              sender: BOT,
            };

            data.unshift(newData);

            return data;
          }
          if ('videoLink' in content) {
            const newData: Message = {
              data: { image: content.videoLink },
              sender: BOT,
            };

            data.unshift(newData);

            return data;
          }
        }

        return [
          {
            data: { bubble: content },
            sender: BOT,
          },
        ];
      },
      sideEffect: async (isCorrectAnswer) => {
        if (isCorrectAnswer) {
          const oldScore = Number(
            localStorage.getItem(selectedLocalStorageKeys.score) || 1,
          );
          const newScore = oldScore + 1;

          localStorage.setItem(
            selectedLocalStorageKeys.score,
            newScore.toString(),
          );
        }

        const currentNumber = Number(
          localStorage.getItem(selectedLocalStorageKeys.number) || 1,
        );
        const reachedLastNumber = currentNumber > 5;

        if (reachedLastNumber) return;

        const oldNumber = Number(
          localStorage.getItem(selectedLocalStorageKeys.number) || 1,
        );
        const newNumber = oldNumber + 1;
        localStorage.setItem(
          selectedLocalStorageKeys.number,
          newNumber.toString(),
        );
      },
      isQuestion: {
        answer: () => {
          const currentNumber = Number(
            localStorage.getItem(selectedLocalStorageKeys.number) || 1,
          );

          return selectedCategoryQuestions[currentNumber - 1].answers;
        },
        inputType: 'INPUT',
        id: uuidv4(),
      },
    },
    {
      id: `${category}-question-correct`,
      next: () => `${category}-question`,
      getMessages: () => {
        const randomMessages = [
          'Moving on to the next question',
          "Let's proceed to the following question",
          'Now, onto the next question',
          'Time for the next question',
          'Next up',
          'Here comes the next question',
        ];

        return [
          {
            data: {
              bubble:
                randomMessages[randomNumber(0, randomMessages.length - 1)],
            },
            sender: BOT,
          },
        ];
      },
    },
    {
      id: `${category}-question-wrong`,
      next: () => `${category}-question`,
      getMessages: () => {
        const randomMessages = [
          'Moving on to the next question',
          "Let's proceed to the following question",
          'Now, onto the next question',
          'Time for the next question',
          'Next up',
          'Here comes the next question',
        ];

        return [
          {
            data: {
              bubble:
                randomMessages[randomNumber(0, randomMessages.length - 1)],
            },
            sender: BOT,
          },
        ];
      },
    },
    {
      id: `${category}-result`,
      getMessages: () => {
        const score = localStorage.getItem(selectedLocalStorageKeys.score) || 0;
        const totalItems =
          Number(localStorage.getItem(selectedLocalStorageKeys.number) || 1) -
          1;

        const message = `You've answered ${score} items correctly out of ${totalItems}`;

        return [{ data: { bubble: message }, sender: BOT }];
      },
      next: () => {
        if (category === PREPOSTCATEGORIES.POST_TEST) return 'chat-end';

        if (isAllCategoryAnswered())
          return 'carousel-from-all-already-answered';

        return 'category-select';
      },
      sideEffect: () => {
        const score = localStorage.getItem(selectedLocalStorageKeys.score);

        // When user failed to answer anything correct
        if (score === null)
          localStorage.setItem(selectedLocalStorageKeys.score, '0');

        return fetch('').then();
      },
    },
  ];

  return res;
};

export default generatePrePostQuestionsPhases;
