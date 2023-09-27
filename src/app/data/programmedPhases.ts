import { BehaviorSubject } from 'rxjs';
import { Phase } from '../pages/refactor.component';
import { preTestQuestions } from '../preTestQuestions';

// const nameSubject = new BehaviorSubject('');
// const name$ = nameSubject.asObservable;

const BOT = 'bot';
const LocalStorageKeys = {
  PRETEST_SCORE: 'chatFrac_pretestScore',
  PRETEST_NUMBER: 'chatFrac_pretestNumber',
  NAME: 'chatFrac_name',
  SCHOOL: 'chatFrac_school',
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
      answer: () => ['_'],
      inputType: 'BUTTON',
      buttonName: 'Get started',
    },
  },
  {
    id: 'demographics-1',
    next: () => 'demographics-1-confirm',
    getMessages: () => [{ data: { bubble: "What's your name" }, sender: BOT }],
    isQuestion: { answer: () => ['_'], inputType: 'INPUT' },
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
      answer: () => ['_'],
      inputType: 'QUICK_REPLY',
      quickReplies: ['Yes', "No, that's wrong"],
    },
  },
  {
    id: 'demographics-1-attempt',
    next: (_, userInput) => 'demographics-1-confirm',
    getMessages: () => [
      { data: { bubble: "What's your name then" }, sender: BOT },
    ],
    isQuestion: { answer: () => ['_'], inputType: 'INPUT' },
    sideEffect: async (isCorrectAnswer, userInput) => {
      localStorage.setItem(LocalStorageKeys.NAME, userInput);

      return;
    },
  },
  {
    id: 'demographics-2',
    next: () => 'demographics-2-confirm',
    isQuestion: { answer: () => ['_'], inputType: 'INPUT' },
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
      answer: () => ['_'],
      inputType: 'QUICK_REPLY',
      quickReplies: ['Yes', "No, that's wrong"],
    },
  },
  {
    id: 'demographics-2-attempt',
    next: (_, userInput) => 'demographics-2-confirm',
    getMessages: () => [
      { data: { bubble: 'Which school are you from then?' }, sender: BOT },
    ],
    isQuestion: { answer: () => ['_'], inputType: 'INPUT' },
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
      // if current question is last, then 'pretest-result'
      // else next question or pretest-wrong-answer
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
              bubble: 'You already answered all questions in this category',
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
    next: () => 'category-select',
  },
];

const selectCategoryPhases: Phase[] = [
  {
    id: 'category-select',
    getMessages: () => [
      { data: { bubble: 'Select a category.' }, sender: BOT },
    ],
    isQuestion: {
      answer: () => ['_'],
      inputType: 'QUICK_REPLY',
      quickReplies: ['Definition', 'Examples', 'Models'],
    },
    next: (_, userInput) => userInput,
  },
];
const examplesCategoryPhases: Phase[] = [
  {
    id: 'Examples',
    getMessages: () => [
      { data: { bubble: 'Welcome to examples category.' }, sender: BOT },

      {
        data: { video: 'https://www.youtube.com/embed/Kzh04tWNDkQ' },
        sender: BOT,
      },
    ],

    next: (_, userInput) => userInput,
  },
];
const modelsCategoryPhases: Phase[] = [
  {
    id: 'Models',
    getMessages: () => [
      { data: { bubble: 'Welcome to Models category.' }, sender: BOT },
    ],

    next: (_, userInput) => userInput,
  },
];
const definitionCategoryPhases: Phase[] = [
  {
    id: 'Definition',
    getMessages: () => [
      { data: { bubble: 'Welcome to Definition category.' }, sender: BOT },
      { data: { image: 'assets/definitionCategory/dissimilar-fraction-step-1.png' }, sender: BOT },
    ],

    next: (_, userInput) => userInput,
  },
];
const carouselPhases: Phase[] = [
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
                clickCallback: () => console.log('123!'),
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
