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
import { incorrectMessages } from '../preTestQuestions';

const generateQuestionsPhases = (category: Categories) => {
  let selectedLocalStorageKeys = { number: '', score: '' };
  let selectedCategoryQuestions: Question[] = [];

  switch (category) {
    case CATEGORIES.EXAMPLES:
      selectedLocalStorageKeys.number = LocalStorageKeys.EXAMPLES_NUMBER;
      selectedLocalStorageKeys.score = LocalStorageKeys.EXAMPLES_SCORE;
      selectedCategoryQuestions = examplesQuestions;
      break;
    case CATEGORIES.MODELS:
      selectedLocalStorageKeys.number = LocalStorageKeys.MODELS_NUMBER;
      selectedLocalStorageKeys.score = LocalStorageKeys.MODELS_SCORE;
      selectedCategoryQuestions = modelsQuestions;
      break;
    case CATEGORIES.DEFINITION:
      selectedLocalStorageKeys.number = LocalStorageKeys.DEFINITION_NUMBER;
      selectedLocalStorageKeys.score = LocalStorageKeys.DEFINITION_SCORE;
      selectedCategoryQuestions = definitionQuestions;
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
                bubble: `You already answered all questions in ${category} category`,
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
          // create util func for tese

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
        const gif =
          correctAnswerGifs[randomNumber(0, correctAnswerGifs.length - 1)];

        return [{ data: { image: gif }, sender: BOT }];
      },
    },
    {
      id: `${category}-question-wrong`,
      next: () => `${category}-question`,
      getMessages: () => {
        const currentNumber = Number(
          localStorage.getItem(selectedLocalStorageKeys.number) || 1,
        );
        const currentQuestion = selectedCategoryQuestions[currentNumber - 1];
        const solutions: Message[] = (currentQuestion.solutions || []).map(
          (s) => ({ sender: BOT, data: { bubble: s } }),
        );
        const incorrectMessage =
          incorrectMessages[randomNumber(0, incorrectMessages.length - 1)];
        const data: Message[] = [
          { data: { bubble: incorrectMessage }, sender: BOT },
          { data: { bubble: 'Solution:' }, sender: BOT },
          ...solutions,
        ];

        return data;
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

export default generateQuestionsPhases;
