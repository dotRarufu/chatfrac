import { MessageFormat } from './definitionCategory';
import Question from './types/Question';

export const examplesIntro1Messages: MessageFormat[] = [
  {
    content: {
      text: "Let's begin,",
    },
  },
  {
    content: {
      text: {
        videoLink: 'https://www.youtube.com/embed/N0aW74yE4Co',
      },
    },
  },
  {
    content: {
      text: 'You can pause the video or adjust the speed of the video if you need to.',
    },
  },
  {
    content: {
      text: 'Are you finished?',
    },
  },
];
export const examplesIntro2Messages: MessageFormat[] = [
  {
    content: {
      text: "Let's proceed to our next example",
    },
  },
  {
    content: {
      text: {
        videoLink: 'https://www.youtube.com/embed/7Uny-f6LKOY',
      },
    },
  },
  {
    content: {
      text: 'You can pause the video or adjust the speed of the video if you need to.',
    },
  },
  {
    content: {
      text: 'Get it?',
    },
  },
];
export const examplesIntro3Messages: MessageFormat[] = [
  {
    content: {
      text: "Let's continue",
    },
  },
  {
    content: {
      text: {
        videoLink: 'https://www.youtube.com/embed/tiHV3ilDAqc',
      },
    },
  },
  {
    content: {
      text: 'You can pause the video or adjust the speed of the video if you need to.',
    },
  },
  {
    content: {
      text: 'Do you understand?',
    },
  },
];
// export const examplesIntro4Messages: MessageFormat[] = [
//   {
//     content: {
//       text: "Let's proceed to our next example",
//     },
//   },
//   {
//     content: {
//       text: {
//         videoLink: 'https://www.youtube.com/embed/ByWXiPSV2V8',
//       },
//     },
//   },
//   {
//     content: {
//       text: 'You can pause the video or adjust the speed of the video if you need to.',
//     },
//   },
//   {
//     content: {
//       text: 'Do you understand?',
//     },
//   },
// ];
// export const examplesIntro5Messages: MessageFormat[] = [
//   {
//     content: {
//       text: "Let's proceed to our next example",
//     },
//   },
//   {
//     content: {
//       text: {
//         videoLink: 'https://www.youtube.com/embed/wFoH8ioQm88',
//       },
//     },
//   },
//   {
//     content: {
//       text: 'You can pause the video or adjust the speed of the video if you need to.',
//     },
//   },
//   {
//     content: {
//       text: 'Get it?',
//     },
//   },
// ];
// export const examplesIntro6Messages: MessageFormat[] = [
//   {
//     content: {
//       text: "Let's continue",
//     },
//   },
//   {
//     content: {
//       text: {
//         videoLink: 'https://www.youtube.com/embed/UYkrQJrnoE0',
//       },
//     },
//   },
//   {
//     content: {
//       text: 'You can pause the video or adjust the speed of the video if you need to.',
//     },
//   },
//   {
//     content: {
//       text: 'Do you understand?',
//     },
//   },
// ];
export const examplesIntro7Messages: MessageFormat[] = [
  {
    content: {
      text: "Let's proceed to our next example",
    },
  },
  {
    content: {
      text: {
        videoLink: 'https://www.youtube.com/embed/ByWXiPSV2V8',
      },
    },
  },
  {
    content: {
      text: 'You can pause the video or adjust the speed of the video if you need to.',
    },
  },
  {
    content: {
      text: 'Did you understand everything?',
    },
  },
  {
    content: {
      text: 'You may go back and replay some clips if you still not understand things.',
    },
  },
];
// export const examplesIntro8Messages: MessageFormat[] = [
//   {
//     content: {
//       text: {
//         videoLink: 'https://www.youtube.com/embed/Sso_xpZqW5U',
//       },
//     },
//   },
//   {
//     content: {
//       text: {
//         videoLink: 'https://www.youtube.com/embed/iPTvSUlRGYg',
//       },
//     },
//   },

//   {
//     content: {
//       text: 'You can pause the video or adjust the speed of the video if you need to.',
//     },
//   },
//   {
//     content: {
//       text: 'Did you understand everything?',
//     },
//   },
//   {
//     content: {
//       text: 'You may go back and replay some clips if you still not understand things.',
//     },
//   },
// ];

export const examplesQuestions: Question[] = [
  {
    content: {
      text: '1. 1/7 + 1/3 =?',
    },
    solutions: ['= 3/21 + 7/21', '10/21'],
    answers: ['10/21'],
  },
  {
    content: {
      text: '2. 5/18 + 8/9 =?',
    },
    solutions: ['= 5/18 + 16/18', '= 21/18 or 7/6'],
    answers: ['7/6', '21/18'],
  },
  {
    content: {
      text: "3. Mom needs 3 1/3 kg of spaghetti pasta for tomorrow's big celebration. If I already bought 5/6 kg of spaghetti pasta yesterday how much spaghetti pasta does she still needs?",
    },
    solutions: ['3 1/3 - 5/6', '= 10/3 - 5/6', '= 20/6 - 5/6', '= 15/6 or 5/2'],
    answers: ['5/2', '15/6'],
  },
  {
    content: {
      text: '4. 1/2 - 1/4 =?',
    },
    solutions: ['= 2/4 - 1/4', '= 1/4'],
    answers: ['1/4'],
  },
  {
    content: {
      text: '5. 3/8 - 1/6 =?',
    },
    solutions: ['= 9/24 - 4/24', '= 5/24'],
    answers: ['5/24'],
  },
];
