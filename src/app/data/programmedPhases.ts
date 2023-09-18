import { BehaviorSubject } from 'rxjs';
import { Phase } from '../pages/refactor.component';
import { preTestQuestions } from '../preTestQuestions';

// const nameSubject = new BehaviorSubject('');
// const name$ = nameSubject.asObservable;

const programmedPhases: Phase[] = [
  {
    id: 'introduction',
    next: () => 'demographics-1',
    getMessages: () => [
      { data: 'Welcome to ChatFrac', sender: 'bot' },
      {
        data: 'Start learning about fractions by tapping on "Get started"',
        sender: 'bot',
      },
    ],
    isQuestion: {
      answer: '_',
      inputType: 'BUTTON',
      buttonName: 'Get started',
    },
  },
  {
    id: 'demographics-1',
    next: () => 'demographics-1-confirm',
    getMessages: () => [{ data: "What's your name", sender: 'bot' }],
    isQuestion: { answer: '_', inputType: 'INPUT' },
    sideEffect: async (isCorrectAnswer, userInput) => {
      // nameSubject.next(userInput);
      localStorage.setItem('chatFrac_name', userInput);
      const valuepersisted = localStorage.getItem('chatFrac_name');

      // console.log('1 side effect set name:', userInput);
      // console.log('persisted name:', valuepersisted);
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
        data: `Your name is ${localStorage.getItem(
          'chatFrac_name',
        )}, is that right?`,
        sender: 'bot',
      },
    ],
    isQuestion: {
      answer: '_',
      inputType: 'QUICK_REPLY',
      quickReplies: ['Yes', "No, that's wrong"],
    },
  },
  {
    id: 'demographics-1-attempt',
    next: (_, userInput) => 'demographics-1-confirm',
    getMessages: () => [{ data: "What's your name then", sender: 'bot' }],
    isQuestion: { answer: '_', inputType: 'INPUT' },
    sideEffect: async (isCorrectAnswer, userInput) => {
      // nameSubject.next(userInput);
      localStorage.setItem('chatFrac_name', userInput);
      console.log('2 side effect set name:', userInput);

      return;
    },
  },
  {
    id: 'demographics-2',
    next: () => 'demographics-2-confirm',
    isQuestion: { answer: '_', inputType: 'INPUT' },
    sideEffect: async (_, userInput) => {
      // nameSubject.next(userInput);
      localStorage.setItem('chatFrac_school', userInput);
      console.log('1 side effect set school:', userInput);

      return;
    },
    getMessages: () => [
      {
        sender: 'bot',
        data: `Alright ${localStorage.getItem(
          'chatFrac_name',
        )}, which school are you from?`,
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
        data: `You are from ${localStorage.getItem(
          'chatFrac_school',
        )}, is that right?`,
        sender: 'bot',
      },
    ],
    isQuestion: {
      answer: '_',
      inputType: 'QUICK_REPLY',
      quickReplies: ['Yes', "No, that's wrong"],
    },
  },
  {
    id: 'demographics-2-attempt',
    next: (_, userInput) => 'demographics-2-confirm',
    getMessages: () => [
      { data: 'Which school are you from then?', sender: 'bot' },
    ],
    isQuestion: { answer: '_', inputType: 'INPUT' },
    sideEffect: async (isCorrectAnswer, userInput) => {
      // nameSubject.next(userInput);
      localStorage.setItem('chatFrac_school', userInput);
      console.log('2 side effect set school:', userInput);

      return;
    },
  },
  {
    id: 'pretest-inform',
    next: () => 'pretest-question',
    getMessages: () => [
      { data: 'Thank you.', sender: 'bot' },
      {
        data: "Before you continue your journey on improving your mastery level of Addition and Substraction of Dissimilar Fractions, let's see first how good you are in this matter.",
        sender: 'bot',
      },
      { data: 'Read and analyze each question carefully', sender: 'bot' },
      {
        data: 'Type your answer on the provided chatbox below and ensure that your answer must be in the LOWEST TERM in the form of IMPROPER FRACTIONS',
        sender: 'bot',
      },
    ],
  },
  {
    id: 'pretest-question',
    next: (isCorrectAnswer) => {
      // if current question is last, then 'pretest-result'
      // else next question or pretest-wrong-answer
      const currentNumber = Number(
        localStorage.getItem('chatFrac_pretestNumber') || 1,
      );
      const isLastNumber = currentNumber >= 5;

      if (isLastNumber) return 'pretest-result';

      return isCorrectAnswer
        ? 'pretest-question-correct'
        : 'pretest-question-wrong';
    },
    getMessages: () => {
      const currentNumber = Number(
        localStorage.getItem('chatFrac_pretestNumber') || 1,
      );
      const isLastNumber = currentNumber >= 5;

      if (isLastNumber)
        return [
          {
            sender: 'bot',
            data: 'You already answered all questions in this category',
          },
        ];

      const currentQuestion = preTestQuestions[currentNumber - 1];

      return [
        // update type for data property
        { data: currentQuestion.content.text as string, sender: 'bot' },
      ];
    },
    sideEffect: async () => {
      // if answer is correct increment record in db
      // increment localstorage current question number
      const oldValue = Number(localStorage.getItem('chatFrac_pretestNumber'));
      const newValue = oldValue + 1;
      localStorage.setItem('chatFrac_pretestNumber', newValue.toString());
    },
    isQuestion: { answer: 'Yes', inputType: 'INPUT' },
  },
  {
    id: 'pretest-question-wrong',
    next: () => 'pretest-question',
    getMessages: () => [{ data: '==========Wrong=====', sender: 'bot' }],
  },
  {
    id: 'pretest-question-correct',
    next: () => 'pretest-question',
    getMessages: () => [{ data: '==========Correct=====', sender: 'bot' }],
  },
];

export default programmedPhases;
