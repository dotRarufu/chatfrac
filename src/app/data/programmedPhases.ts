import { BehaviorSubject } from 'rxjs';
import { Phase } from '../pages/refactor.component';
import { preTestQuestions } from '../preTestQuestions';
import { examplesQuestions } from '../examplesCategory';
import { v4 as uuidv4 } from 'uuid';
import Question from '../types/Question';
import { modelsQuestions } from '../modelsCategory';
import { definitionQuestions } from '../definitionCategory';
import isAllCategoryAnswered from '../utils/isAllCategoryAnswered';
import generateQuestionsPhases from '../utils/generateQuestionsPhases';

export type Categories = 'models' | 'examples' | 'definition';

// const nameSubject = new BehaviorSubject('');
// const name$ = nameSubject.asObservable;
const NO_ANSWER = () => ['_'];
export const BOT = 'bot';
export const LocalStorageKeys = {
  PRETEST_SCORE: 'chatFrac_pretestScore',
  PRETEST_NUMBER: 'chatFrac_pretestNumber',
  NAME: 'chatFrac_name',
  SCHOOL: 'chatFrac_school',
  MODELS_SCORE: 'chatFrac_modelsScore',
  DEFINITION_SCORE: 'chatFrac_definitionScore',
  EXAMPLES_SCORE: 'chatFrac_examplesScore',
  EXAMPLES_NUMBER: 'chatFrac_examplesNumber',
  MODELS_NUMBER: 'chatFrac_modelsNumber',
  DEFINITION_NUMBER: 'chatFrac_definitionNumber',
};
export const CATEGORIES: {
  MODELS: Categories;
  EXAMPLES: Categories;
  DEFINITION: Categories;
} = {
  MODELS: 'models',
  EXAMPLES: 'examples',
  DEFINITION: 'definition',
};

const startingPhases: Phase[] = [
  {
    id: 'introduction',
    next: () => 'demographics-1',
    getMessages: () => [
      { data: { bubble: 'Welcome to ChatFrac' }, sender: BOT },
      {
        data: {
          bubble: 'Start learning about fractions by tapping on "Get started"',
        },
        sender: BOT,
      },
    ],
    isQuestion: {
      answer: NO_ANSWER,
      inputType: 'BUTTON',
      buttonName: 'Get started',
      id: uuidv4(),
    },
  },
  {
    id: 'demographics-1',
    next: () => 'demographics-1-confirm',
    getMessages: () => [{ data: { bubble: "What's your name" }, sender: BOT }],
    isQuestion: { answer: NO_ANSWER, inputType: 'INPUT', id: uuidv4() },
    sideEffect: async (isCorrectAnswer, userInput) => {
      localStorage.setItem(LocalStorageKeys.NAME, userInput);

      return;
    },
  },
  {
    id: 'demographics-1-confirm',
    next: (_, userInput) => {
      if (userInput === 'Yes') return 'demographics-2';

      return 'demographics-1-attempt';
    },
    getMessages: () => [
      {
        data: {
          bubble: `Your name is ${localStorage.getItem(
            LocalStorageKeys.NAME,
          )}, is that right?`,
        },
        sender: BOT,
      },
    ],
    isQuestion: {
      answer: NO_ANSWER,
      inputType: 'QUICK_REPLY',
      quickReplies: ['Yes', "No, that's wrong"],
      id: uuidv4(),
    },
  },
  {
    id: 'demographics-1-attempt',
    next: (_, userInput) => 'demographics-1-confirm',
    getMessages: () => [
      { data: { bubble: "What's your name then" }, sender: BOT },
    ],
    isQuestion: { answer: NO_ANSWER, inputType: 'INPUT', id: uuidv4() },
    sideEffect: async (isCorrectAnswer, userInput) => {
      localStorage.setItem(LocalStorageKeys.NAME, userInput);

      return;
    },
  },
  {
    id: 'demographics-2',
    next: () => 'demographics-2-confirm',
    isQuestion: { answer: NO_ANSWER, inputType: 'INPUT', id: uuidv4() },
    sideEffect: async (_, userInput) => {
      localStorage.setItem(LocalStorageKeys.SCHOOL, userInput);

      return;
    },
    getMessages: () => [
      {
        sender: BOT,
        data: {
          bubble: `Alright ${localStorage.getItem(
            LocalStorageKeys.NAME,
          )}, which school are you from?`,
        },
      },
    ],
  },
  {
    id: 'demographics-2-confirm',
    next: (_, userInput) => {
      if (userInput === 'Yes') return 'pretest-inform';

      return 'demographics-2-attempt';
    },
    getMessages: () => [
      {
        data: {
          bubble: `You are from ${localStorage.getItem(
            LocalStorageKeys.SCHOOL,
          )}, is that right?`,
        },
        sender: BOT,
      },
    ],
    isQuestion: {
      answer: NO_ANSWER,
      inputType: 'QUICK_REPLY',
      quickReplies: ['Yes', "No, that's wrong"],
      id: uuidv4(),
    },
  },
  {
    id: 'demographics-2-attempt',
    next: (_, userInput) => 'demographics-2-confirm',
    getMessages: () => [
      { data: { bubble: 'Which school are you from then?' }, sender: BOT },
    ],
    isQuestion: { answer: NO_ANSWER, inputType: 'INPUT', id: uuidv4() },
    sideEffect: async (isCorrectAnswer, userInput) => {
      localStorage.setItem(LocalStorageKeys.SCHOOL, userInput);

      return;
    },
  },
];

const preTestPhases: Phase[] = [
  {
    id: 'pretest-inform',
    next: () => 'pretest-question',
    getMessages: () => [
      { data: { bubble: 'Thank you.' }, sender: BOT },
      {
        data: {
          bubble:
            "Before you continue your journey on improving your mastery level of Addition and Substraction of Dissimilar Fractions, let's see first how good you are in this matter.",
        },
        sender: BOT,
      },
      {
        data: { bubble: 'Read and analyze each question carefully' },
        sender: BOT,
      },
      {
        data: {
          bubble:
            'Type your answer on the provided chatbox below and ensure that your answer must be in the LOWEST TERM in the form of IMPROPER FRACTIONS',
        },
        sender: BOT,
      },
    ],
  },
  {
    id: 'pretest-question',
    next: (isCorrectAnswer) => {
      const currentNumber = Number(
        localStorage.getItem(LocalStorageKeys.PRETEST_NUMBER) || 1,
      );
      const isLastNumber = currentNumber > 5;

      if (isLastNumber) return 'pretest-result';

      return isCorrectAnswer
        ? 'pretest-question-correct'
        : 'pretest-question-wrong';
    },
    getMessages: () => {
      const currentNumber = Number(
        localStorage.getItem(LocalStorageKeys.PRETEST_NUMBER) || 1,
      );
      const isLastNumber = currentNumber > 5;

      if (isLastNumber)
        return [
          {
            sender: BOT,
            data: {
              bubble: 'You already answered all questions in pretest',
            },
          },
          {
            sender: BOT,
            data: {
              bubble: 'Type anything to proceed.',
            },
          },
        ];

      const currentQuestion = preTestQuestions[currentNumber - 1];

      return [
        // update type for data property
        {
          data: { bubble: currentQuestion.content.text as string },
          sender: BOT,
        },
      ];
    },
    sideEffect: async (isCorrectAnswer, userInput) => {
      if (isCorrectAnswer) {
        const oldScore = Number(
          localStorage.getItem(LocalStorageKeys.PRETEST_SCORE) || 1,
        );
        const newScore = oldScore + 1;

        localStorage.setItem(
          LocalStorageKeys.PRETEST_SCORE,
          newScore.toString(),
        );
      }

      // add go back to state after a session
      // add loading state while side effect is running, try db calls in side effect

      const currentNumber = Number(
        localStorage.getItem(LocalStorageKeys.PRETEST_NUMBER) || 1,
      );
      const reachedLastNumber = currentNumber > 5;

      if (reachedLastNumber) return;

      const oldNumber = Number(
        localStorage.getItem(LocalStorageKeys.PRETEST_NUMBER) || 1,
      );
      const newNumber = oldNumber + 1;
      localStorage.setItem(
        LocalStorageKeys.PRETEST_NUMBER,
        newNumber.toString(),
      );
    },
    isQuestion: {
      answer: () => {
        const currentNumber = Number(
          localStorage.getItem(LocalStorageKeys.PRETEST_NUMBER) || 1,
        );

        return preTestQuestions[currentNumber - 1].answers;
      },
      inputType: 'INPUT',
      id: uuidv4(),
    },
  },
  {
    id: 'pretest-question-wrong',
    next: () => 'pretest-question',
    getMessages: () => [
      { data: { bubble: '==========Wrong=====' }, sender: BOT },
    ],
  },
  {
    id: 'pretest-question-correct',
    next: () => 'pretest-question',
    getMessages: () => [
      { data: { bubble: '==========Correct=====' }, sender: BOT },
    ],
  },
  {
    id: 'pretest-result',
    getMessages: () => {
      const score = localStorage.getItem(LocalStorageKeys.PRETEST_SCORE) || 0;
      const totalItems =
        Number(localStorage.getItem(LocalStorageKeys.PRETEST_NUMBER) || 1) - 1;

      const message = `You've answered ${score} items correctly out of ${totalItems}`;

      return [{ data: { bubble: message }, sender: BOT }];
    },
    next: () => {
      if (isAllCategoryAnswered()) return 'carousel-from-all-already-answered';

      return 'category-select';
    },
    sideEffect: () => {
      const score = localStorage.getItem(LocalStorageKeys.EXAMPLES_SCORE);

      // When user failed to answer anything correct
      if (score === null)
        localStorage.setItem(LocalStorageKeys.PRETEST_SCORE, '0');

      return fetch('').then();
    },
  },
];

const selectCategoryPhases: Phase[] = [
  {
    id: 'already-selected',
    getMessages: () => [
      { data: { bubble: 'This category was already selected.' }, sender: BOT },
    ],
    next: () => 'category-select-anti-not-allowed',
  },
  {
    id: 'already-selected-anti-not-allowed',
    getMessages: () => [
      { data: { bubble: 'This category was already selected.' }, sender: BOT },
    ],
    next: () => 'category-select',
  },
  {
    id: 'category-select',
    getMessages: () => [
      { data: { bubble: 'Select a category.' }, sender: BOT },
    ],
    isQuestion: {
      answer: NO_ANSWER,
      inputType: 'QUICK_REPLY',
      quickReplies: ['Definition', 'Examples', 'Models'],
      id: uuidv4(),
    },
    next: (_, userInput) => {
      const definitionScore = localStorage.getItem(
        LocalStorageKeys.DEFINITION_SCORE,
      );
      const examplesScore = localStorage.getItem(
        LocalStorageKeys.EXAMPLES_SCORE,
      );
      const modelsScore = localStorage.getItem(LocalStorageKeys.MODELS_SCORE);

      if (isAllCategoryAnswered()) return 'carousel-intro';

      let selected: string | null = '';

      switch (userInput) {
        case 'Definition':
          selected = definitionScore;
          break;
        case 'Examples':
          selected = examplesScore;
          break;
        case 'Models':
          selected = modelsScore;
          break;

        default:
          break;
      }

      const selectedAlreadyHasScore = selected !== null && !!selected;

      if (selectedAlreadyHasScore) return 'already-selected';

      return userInput;
    },
  },
  {
    id: 'category-select-anti-not-allowed',
    getMessages: () => [
      { data: { bubble: 'Select a category.' }, sender: BOT },
    ],
    isQuestion: {
      answer: NO_ANSWER,
      inputType: 'QUICK_REPLY',
      quickReplies: ['Definition', 'Examples', 'Models'],
      id: uuidv4(),
    },
    next: (_, userInput) => {
      const definitionScore = localStorage.getItem(
        LocalStorageKeys.DEFINITION_SCORE,
      );
      const examplesScore = localStorage.getItem(
        LocalStorageKeys.EXAMPLES_SCORE,
      );
      const modelsScore = localStorage.getItem(LocalStorageKeys.MODELS_SCORE);

      if (isAllCategoryAnswered()) return 'carousel-intro';

      let selected: string | null = '';

      switch (userInput) {
        case 'Definition':
          selected = definitionScore;
          break;
        case 'Examples':
          selected = examplesScore;
          break;
        case 'Models':
          selected = modelsScore;
          break;

        default:
          break;
      }

      const selectedAlreadyHasScore = selected !== null && !!selected;

      if (selectedAlreadyHasScore) return 'already-selected-anti-not-allowed';

      return userInput;
    },
  },
];

const examplesCategoryPhases: Phase[] = [
  {
    id: 'Examples',
    isQuestion: {
      answer: NO_ANSWER,
      inputType: 'BUTTON',
      buttonName: 'Yes',
      id: uuidv4(),
    },
    getMessages: () => [
      { data: { bubble: "Let's begin." }, sender: BOT },

      {
        data: { video: 'https://www.youtube.com/embed/Kzh04tWNDkQ' },
        sender: BOT,
      },
      {
        data: {
          bubble:
            'You can pause the video or adjust the speed of the video if you need to.',
        },
        sender: BOT,
      },
      { data: { bubble: 'Are you finished?' }, sender: BOT },
    ],

    next: (_, userInput) => 'examples-2',
  },
  {
    id: 'examples-2',
    isQuestion: {
      answer: NO_ANSWER,
      inputType: 'BUTTON',
      buttonName: 'Yes',
      id: uuidv4(),
    },
    getMessages: () => [
      { data: { bubble: "Let's proceed to our next example" }, sender: BOT },

      {
        data: { video: 'https://www.youtube.com/embed/opaJvQJyH00' },
        sender: BOT,
      },
      {
        data: {
          bubble:
            'You can pause the video or adjust the speed of the video if you need to.',
        },
        sender: BOT,
      },
      { data: { bubble: 'Get it?' }, sender: BOT },
    ],

    next: (_, userInput) => 'examples-3',
  },
  {
    id: 'examples-3',
    isQuestion: {
      answer: NO_ANSWER,
      inputType: 'BUTTON',
      buttonName: 'Yes',
      id: uuidv4(),
    },
    getMessages: () => [
      { data: { bubble: "Let's continue" }, sender: BOT },

      {
        data: { video: 'https://www.youtube.com/embed/yqI7uaEXOt8' },
        sender: BOT,
      },
      {
        data: {
          bubble:
            'You can pause the video or adjust the speed of the video if you need to.',
        },
        sender: BOT,
      },
      { data: { bubble: 'Do you understand?' }, sender: BOT },
    ],

    next: (_, userInput) => 'examples-4',
  },
  {
    id: 'examples-4',
    isQuestion: {
      answer: NO_ANSWER,
      inputType: 'BUTTON',
      buttonName: 'Yes',
      id: uuidv4(),
    },
    getMessages: () => [
      { data: { bubble: "Let's continue" }, sender: BOT },

      {
        data: { video: 'https://www.youtube.com/embed/JYfWinTqrCY' },
        sender: BOT,
      },
      {
        data: {
          bubble:
            'You can pause the video or adjust the speed of the video if you need to.',
        },
        sender: BOT,
      },
      { data: { bubble: 'Do you understand?' }, sender: BOT },
    ],

    next: (_, userInput) => 'examples-5',
  },
  {
    id: 'examples-5',
    isQuestion: {
      answer: NO_ANSWER,
      inputType: 'BUTTON',
      buttonName: 'Yes',
      id: uuidv4(),
    },
    getMessages: () => [
      { data: { bubble: "Let's proceed to our next example" }, sender: BOT },

      {
        data: { video: 'https://www.youtube.com/embed/wFoH8ioQm88' },
        sender: BOT,
      },
      {
        data: {
          bubble:
            'You can pause the video or adjust the speed of the video if you need to.',
        },
        sender: BOT,
      },
      { data: { bubble: 'Get it?' }, sender: BOT },
    ],

    next: (_, userInput) => 'examples-6',
  },
  {
    id: 'examples-6',
    isQuestion: {
      answer: NO_ANSWER,
      inputType: 'BUTTON',
      buttonName: 'Yes',
      id: uuidv4(),
    },
    getMessages: () => [
      { data: { bubble: "Let's continue" }, sender: BOT },

      {
        data: { video: 'https://www.youtube.com/embed/UYkrQJrnoE0' },
        sender: BOT,
      },
      {
        data: {
          bubble:
            'You can pause the video or adjust the speed of the video if you need to.',
        },
        sender: BOT,
      },
      { data: { bubble: 'Do you understand?' }, sender: BOT },
    ],

    next: (_, userInput) => 'examples-7',
  },
  {
    id: 'examples-7',
    isQuestion: {
      answer: NO_ANSWER,
      inputType: 'BUTTON',
      buttonName: 'Yes',
      id: uuidv4(),
    },
    getMessages: () => [
      { data: { bubble: "Let's proceed to our next example" }, sender: BOT },

      {
        data: { video: 'https://www.youtube.com/embed/iPTvSUlRGYg' },
        sender: BOT,
      },
      {
        data: {
          bubble:
            'You can pause the video or adjust the speed of the video if you need to.',
        },
        sender: BOT,
      },
      { data: { bubble: 'Did you understand everything?' }, sender: BOT },
      {
        data: {
          bubble:
            'You may go back and replay some clips if you still not understand things.',
        },
        sender: BOT,
      },
    ],

    next: (_, userInput) => 'examples-question-intro',
  },
  {
    id: 'examples-question-intro',
    getMessages: () => [
      {
        data: {
          bubble:
            "Now, let's look if you increase your level of comprehension with regards Addition and Subtraction of Dissimilar Fractions",
        },
        sender: BOT,
      },
    ],
    isQuestion: {
      answer: NO_ANSWER,
      inputType: 'BUTTON',
      buttonName: 'NEXT',
      id: uuidv4(),
    },
    next: (_, userInput) => {
      return 'examples-question';
    },
    sideEffect: (_, a) => {
      localStorage.setItem(LocalStorageKeys.EXAMPLES_NUMBER, '1');

      return fetch('').then();
    },
  },
  ...generateQuestionsPhases(CATEGORIES.EXAMPLES),
];

const modelsCategoryPhases: Phase[] = [
  {
    id: 'Models',
    getMessages: () => [
      { data: { bubble: 'Welcome to Models category.' }, sender: BOT },
    ],

    next: (_, userInput) => 'models-1-block',
  },
  ...generateQuestionsPhases(CATEGORIES.MODELS),
  {
    id: 'models-1-block',
    getMessages: () => [
      {
        data: { video: 'https://www.youtube.com/embed/5WCsDIDehTc' },
        sender: BOT,
      },

      {
        data: { bubble: 'Draw the given fractions into model forms.' },
        sender: BOT,
      },
      {
        data: {
          bubble:
            'Combine, redraw and rename the fractions base on the new figure.',
        },
        sender: BOT,
      },
      {
        data: {
          bubble: 'Combine and add the new figure to get the final answer.',
        },
        sender: BOT,
      },
    ],
    next: () => 'models-2-block',
    isQuestion: {
      answer: NO_ANSWER,
      id: uuidv4(),
      inputType: 'BUTTON',
      buttonName: 'Next',
    },
  },
  {
    id: 'models-2-block',
    getMessages: () => [
      {
        data: { bubble: "Let's have another example." },
        sender: BOT,
      },
      {
        data: { video: 'https://www.youtube.com/embed/UxUPhbuEGEA' },
        sender: BOT,
      },

      {
        data: { bubble: 'Draw the given fractions into model forms.' },
        sender: BOT,
      },
      {
        data: {
          bubble:
            'Combine, redraw and rename the fractions base on the new figure.',
        },
        sender: BOT,
      },
      {
        data: {
          bubble: 'Combine and add the new figure to get the final answer.',
        },
        sender: BOT,
      },
    ],
    next: () => 'models-question',
    isQuestion: {
      answer: NO_ANSWER,
      id: uuidv4(),
      inputType: 'BUTTON',
      buttonName: 'Next',
    },
  },
];

const definitionCategoryPhases: Phase[] = [
  {
    id: 'Definition',
    getMessages: () => [
      {
        data: {
          bubble:
            'In this category, we will learn how to add subtract dissimilar fractions but before we proceed, let us know first what fractions is.',
        },
        sender: BOT,
      },
      {
        data: {
          bubble: 'Fractions refers to a part of a whole.',
        },
        sender: BOT,
      },
      {
        data: {
          bubble: 'Example',
        },
        sender: BOT,
      },
      {
        data: {
          image: 'assets/definitionCategory/fraction-example.png',
        },
        sender: BOT,
      },
      {
        data: {
          bubble:
            'Any number that is less than one (1) are called Proper Fractions. This is the kind of fraction that the numerator has the lowest number, and the denominator has the highest number.',
        },
        sender: BOT,
      },
      {
        data: {
          image: 'assets/definitionCategory/proper-fraction.png',
        },
        sender: BOT,
      },
      {
        data: {
          bubble:
            'The line in the middle of the numbers is called the Vinculum or the Fraction Bar.',
        },
        sender: BOT,
      },
      {
        data: {
          bubble: 'The number above the bar is called Numerator.',
        },
        sender: BOT,
      },
      {
        data: {
          bubble: 'The number below the bar is called Denominator.',
        },
        sender: BOT,
      },
      {
        data: {
          bubble: 'Do you need a Tagalog-English Translation?',
        },
        sender: BOT,
      },
    ],
    next: () => 'definition-question',
    isQuestion: {
      answer: NO_ANSWER,
      id: uuidv4(),
      inputType: 'QUICK_REPLY',
      quickReplies: ['No', 'Yes'],
    },
  },
  ...generateQuestionsPhases(CATEGORIES.DEFINITION),
];

const carouselPhases: Phase[] = [
  {
    id: 'carousel-from-all-already-answered',
    getMessages: () => [
      {
        data: {
          bubble: "You've already answered all the categories",
        },
        sender: BOT,
      },
    ],
    next: () => 'carousel-1',
  },
  {
    id: 'carousel-intro',
    getMessages: () => [
      {
        data: {
          bubble: 'Congratulations, you have finished all the categories',
        },
        sender: BOT,
      },
    ],
    next: () => 'carousel-1',
  },
  {
    id: 'carousel-1',
    getMessages: () => {
      return [
        {
          data: {
            carousel: [
              {
                message: 'Sir Rodel',
                image: 'assets/pips/sir-rodel.png',
                clickCallback: () => console.log('ABC!'),
                link: 'https://www.facebook.com/rdlnvl',
              },
              {
                message: "Ma'am Ana",
                image: 'assets/pips/maam-ana.png',
                clickCallback: () => console.log('123!'),
                link: 'https://www.facebook.com/Aeguist.thrwe',
              },
              {
                message: 'Sir CJ',
                image: 'assets/pips/sir-cj.png',
                clickCallback: () => console.log('456!'),
                link: 'https://www.facebook.com/cjleonardooo',
              },
            ],
          },
          sender: BOT,
        },
      ];
    },
    next: () => 'carouse-2',
  },
];

const programmedPhases: Phase[] = [
  ...startingPhases,
  ...preTestPhases,
  ...selectCategoryPhases,
  ...examplesCategoryPhases,
  ...modelsCategoryPhases,
  ...definitionCategoryPhases,
  ...carouselPhases,
];

export default programmedPhases;
