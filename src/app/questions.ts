import Question from './types/Question';

export const correctMessages = [
  'Congratulations! Your answer is absolutely correct!',
  "Well done! You've got it right!",
  "Great job! That's the correct answer!",
  "You're absolutely right! Excellent work!",
  'Bravo! Your answer is spot on!',
  'You nailed it! Your answer is correct!',
  'Correctamundo! You got the right answer!',
  "You're on fire! That's the correct answer!",
  'Perfect! Your answer is absolutely correct!',
  "You're absolutely on point! Your answer is correct!",
  "That's correct! You're doing fantastic!",
  "You're crushing it! That's the right answer!",
  "You're spot-on! Your answer is correct!",
  "Fantastic! You've answered correctly!",
  "You're acing it! That's the correct answer!",
  'Impressive! Your answer is correct!',
  "You're a star! That's the right answer!",
  'Absolutely correct! Great job!',
  "You've got it! That's the correct answer!",
  'Spotless! Your answer is correct!',
  "Incredible! You've answered correctly!",
  "You're doing amazing! That's the right answer!",
  'Outstanding! Your answer is correct!',
  "Terrific! You've got it right!",
  "Hooray! That's the correct answer!",
  'Wonderful! Your answer is correct!',
  "You're smashing it! That's the right answer!",
  'Perfecto! Your answer is correct!',
  "Superb! You've answered correctly!",
  "You're doing brilliantly! That's the correct answer!",
  'Excellent! Your answer is correct!',
];

export const expectationMessages = [
  "Let's see if you will get this one right.",
  "Here's a challenge for you. Can you get this right?",
  'Time to test your knowledge. Will you get this one right?',
  'Think carefully. Can you answer this correctly?',
  "Get ready! Let's see if you can answer this right.",
  'This one might be a bit tricky. Can you get it right?',
  "Let's put your skills to the test. Will you answer this correctly?",
  "Challenge accepted? Let's see if you can get this one right.",
  'Time for a brain teaser. Can you answer this correctly?',
  "Ready for a challenge? Let's see if you can get this right.",
  "Here's a question for you. Can you answer it correctly?",
  "Let's see if you've been paying attention. Can you get this right?",
  'This one requires some thinking. Will you answer it correctly?',
  "Let's test your knowledge. Can you get this question right?",
  'Get your thinking cap on. Will you answer this correctly?',
  "Let's see if you're up for the challenge. Can you get this right?",
  "Think you know the answer? Let's see if you're right.",
  'Ready to show off your knowledge? Can you get this question right?',
  'This one might catch you off guard. Can you still answer it correctly?',
  "Let's see if you can crack this question. Can you get it right?",
  'Time for a little quiz. Will you answer this question correctly?',
  "Think you're an expert? Let's see if you can answer this correctly.",
  "Here's a test for you. Can you get this question right?",
  "Ready to put your skills to the test? Let's see if you can answer this correctly.",
  "Let's see if you can solve this one. Can you get it right?",
  "Think you've got what it takes? Can you answer this correctly?",
  "Prepare yourself! Let's see if you can get this question right.",
  'This one requires some focus. Can you answer it correctly?',
  'Ready to prove your knowledge? Can you get this right?',
  "Let's see if you can rise to the challenge. Can you answer this correctly?",
  'Get ready to impress. Can you answer this question correctly?',
];

export const incorrectMessages = [
  "Nope, that's not correct.",
  'Oops, wrong answer. Try again!',
  'Not quite right. Keep going!',
  'Incorrect. Give it another shot!',
  'Wrong answer. Keep trying!',
  "Sorry, that's not correct.",
  'Close, but not quite right.',
  'Not the correct answer. Keep going!',
  "Incorrect. Don't give up!",
  'Wrong answer. Keep on trying!',
  "Nope, that's not it. Try again!",
  'Sorry, incorrect answer.',
  'Almost there, but not quite right.',
  'Not the right answer. Keep trying!',
  'Wrong answer. You can do better!',
  'Incorrect. Give it another go!',
  "Nope, that's not the correct answer.",
  'Oops, wrong answer. Keep trying!',
  'Not quite there. Try again!',
  "Wrong answer. Don't give up!",
  "Sorry, that's not the correct answer.",
  "Close, but it's not the right answer.",
  'Not the correct answer. Keep going!',
  'Incorrect. Keep on trying!',
  'Wrong answer. Give it another shot!',
  "Nope, that's not the correct answer.",
  'Oops, incorrect answer. Try again!',
  'Not quite right. Keep on trying!',
  "Wrong answer. You're getting closer!",
  "Sorry, that's not the right answer.",
  'Close, but not quite there. Keep going!',
];

export const preTestQuestions: Question[] = [
  {
    content: {
      text: {
        videoLink: 'https://www.youtube.com/embed/Ks9vndiO5sQ',
      },
    },
    answers: ['22/35'],
  },
  {
    content: { text: '1/5 + 3/7 =' },
    answers: ['22/35'],
  },
  {
    content: { text: '11/10 + 12/5 =' },
    answers: ['35/10', '7/2'],
  },
  {
    content: {
      text: 'Kevin received 3/4 blocks of chocolate from his mother and another 1/3 block of chocolate from his father. How many blocks of chocolate does he have now?',
    },
    solutions: ['3/4 + 1/3 ='],
    answers: ['13/12', '1 and 1/12 blocks of chocolate'],
  },
  {
    content: { text: '7/4 - 3/2=' },
    answers: ['1/4'],
  },
  {
    content: { text: '23/2 – 3/5=' },
    answers: ['109/10', '10 and 9/10'],
  },
  {
    content: {
      text: 'Rodel has 11/4 packets of clay. If he crafts a sculpture using 5/3 packets, how much clay does he have left?',
    },
    answers: ['13/12 packets of clay'],
    solutions: ['11/4 - 5/3 =', '= 33/12-20/12'],
  },
  {
    content: { text: '2/8 + 2/3 =' },
    answers: ['11/12'],
  },
  {
    content: { text: '3/8 + 3/4 =' },
    answers: ['42/48', '7/8'],
  },
  {
    content: {
      text: 'In the afternoon, your mother cooks 3/4 kg of rice before she fetches your younger brother in the school, however, she remembered that your relatives would pay a visit later in the evening. She decided to call and tell you to cook an additional 3/2 kg for dinner. How many kg of rice is prepared for dinner later?',
    },
    answers: ['9/4', '2 and 1/4 kg of rice'],
    solutions: ['3/4 + 3/2 ='],
  },
  {
    content: { text: '1/8 - 1/16=' },
    answers: ['1/16'],
  },
  {
    content: { text: '7/3- 5/6=' },
    answers: ['9/6', '3/2'],
  },
  {
    content: {
      text: 'You bought three boxes of 12 inch pizza as your birthday present for your mother for her 60th birthday. If the sum of the slice of pizzas is 24/8 and your family already ate 3/2 of its portion, how many pizza slices were left?',
    },
    answers: ['12/8', '3/2'],
    solutions: ['24/8 - 3/2=', '= 24/8 - 12/8'],
  },
  {
    content: { text: '2/6 + 1/7 =' },
    answers: ['10/21'],
  },
  {
    content: { text: '9/8 - 1/4=' },
    answers: ['7/8'],
  },
  {
    content: { text: '3/5 + 2/3 =' },
    answers: ['7/8'],
  },
  {
    content: { text: '1/5-1/8=' },
    answers: ['3/40'],
  },
  {
    content: { text: '5/6-2/3=' },
    answers: ['1/6'],
  },
  {
    content: { text: '1/4 + 1/2 =' },
    answers: ['3/4'],
  },
  {
    content: { text: '1/3 + 2/10 =' },
    answers: ['16/30', '8/10'],
  },
  {
    content: { text: '15/4- 2/3 =' },
    answers: ['37/12', '3 and 1/12'],
  },
  {
    content: { text: '13/15- 7/9 =' },
    answers: ['12/135', '4/45'],
  },
  {
    content: { text: '17/9 – 1/3 =' },
    answers: ['14/9', '1 and 5/9'],
  },
  {
    content: { text: '7/12 + 4/6 =' },
    answers: ['15/12', '5/4'],
  },
  {
    content: { text: '23/36 + 4/9 =' },
    answers: ['39/36', '13/12'],
  },
  {
    content: {
      text: 'Analene caught fish weighing 5 and 2/3 kg. She gave 3 and 1/6 kg of fish to Cj, how many kilograms does Analene have left?',
    },
    answers: ['2 3/6', '2 1/2 kg of fish'],
    solutions: ['5 2/3 - 3 1/6 ='],
  },
  {
    content: {
      text: 'Sheila found that her car tank is running out of gas and it only has 1/8 gas so she decided to go to the nearest gasoline station. If she would like to fill it up to 3/4 of its tank, how much gasoline should she add? (5/8)',
    },
    answers: ['5/8'],
    solutions: ['3/4 - 1/8'],
  },
  {
    content: {
      text: "Yesterday, Joseph's family ate 14/7 kilos of Mangoes and 38/12 kilos of Avocados. What were the total kilograms of fruits they ate?",
    },
    answers: ['31/6', '5 and 1/6 kilos of fruits'],
    solutions: ['14/7 + 38/12 ='],
  },
  {
    content: {
      text: 'Angeline walked 2/7 kilometers and stopped at the nearest convenience store to buy snacks and to rest. She then walked 5/9 kilometers again to see her best friend at the park. What was the total distance she walked?',
    },
    answers: ['53/63 kilometers'],
    solutions: ['2/7 + 5/9 ='],
  },
  {
    content: {
      text: 'A recipe needs 7/4 teaspoon of soy sauce and 1/2 teaspoon of Vinegar. How much more Soy Sauce does the recipe need?',
    },
    solutions: ['7/4-1/2='],
    answers: ['5/4 teaspoon of Soy Sauce'],
  },
  {
    content: {
      text: 'Today is your graduation, and your parents decided to buy you caramel and chocolate chip cakes for a small celebration. To share your success with others, you decided to share it with some of your neighbors. You gave off 2/9 of your caramel cake and 1/3 of your chocolate chip cake. How many cakes were left if the remaining caramel and chocolate chip cake were combined?',
    },
    solutions: [
      'For caramel cake, 9/9 - 2/9 = 7/9',
      'For chocolate chip cake 3/3 - 1/3 = 2/3',
      'Then add both remaining cakes, 7/9 + 2/3= 21/27 +18 /27',
    ],
    answers: ['39/27', '13/9'],
  },
];
