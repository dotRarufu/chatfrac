import Question from './types/Question';

export const correctMessages = [
  'Congratulations! Your answer is absolutely correct!',
  "Well done! You've got it right!",
  "Great job! That's the correct answer!",
  "You're absolutely right! Excellent work!",
  'Bravo! Your answer is spot on!',
  'You nailed it! Your answer is correct!',
  'Correct! You got the right answer!',
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
  'This one requires some thinking. Will you answer it correctly?',
  "Let's test your knowledge. Can you get this question right?",
  'Get your thinking cap on. Will you answer this correctly?',
  "Think you know the answer? Let's see if you're right.",
  'This one might catch you off guard. Can you still answer it correctly?',
  "Let's see if you can crack this question. Can you get it right?",
  "Here's a test for you. Can you get this question right?",
  "Ready to put your skills to the test? Let's see if you can answer this correctly.",
  "Let's see if you can solve this one. Can you get it right?",
  'This one requires some focus. Can you answer it correctly?',
];

export const incorrectMessages = [
  "Nope, that's not correct.",
  'Oops, wrong answer.',
  'Incorrect.',
  'Wrong answer.',
  "Sorry, that's not correct.",
  'Close, but not quite right.',
  'Not the correct answer.',
  "Nope, that's not it.",
  'Sorry, incorrect answer.',
  'Almost there, but not quite right.',
  'Not the right answer.',
  "Sorry, that's not the correct answer.",
];

export const preTestQuestions: Question[] = [
  {
    content: { text: '1. 1/5 + 3/7 =' },
    answers: ['22/35'],
  },
  {
    content: { text: '2. 11/10 + 12/5 =' },
    answers: ['7/2', '35/10'],
  },
  {
    content: {
      text: '3. Kevin received 3/4 blocks of chocolate from his mother and another 1/3 block of chocolate from his father. How many block of chocolate does he have now?',
    },
    solutions: ['3/4 + 1/3 =', '= 13/12 or 1 and 1/12 blocks of chocolate'],
    answers: ['1 and 1/12 blocks of chocolate', '1 1/12', '13/12'],
  },
  {
    content: { text: '4. 7/4 - 3/2=' },
    answers: ['1/4'],
  },
  {
    content: { text: '5. 23/2 – 3/5=' },
    answers: ['109/10', '10 and 9/10', '10 9/10'],
  },
  {
    content: {
      text: '6. Rodel has 11/4 packets of clay. If he crafts a sculpture using 5/3 packets, how much clay does he have left?',
    },
    solutions: ['11/4 - 5/3 =', '= 33/12-20/12'],
    answers: ['13/12 packets of clay', '13/12'],
  },
  {
    content: { text: '7. 2/8 + 2/3 =' },
    answers: ['11/12'],
  },
  {
    content: { text: '8. 3/8 + 3/4 =' },
    answers: ['42/48', '7/8'],
  },
  {
    content: {
      text: '9. In the afternoon, your mother cooks 3/4 kg of rice before she fetches your younger brother in the school, however, she remembered that your relatives would pay a visit later in the evening. She decided to call and tell you to cook an additional 3/2 kg for dinner. How many kg of rice is prepared for dinner later?',
    },
    solutions: ['3/4 + 3/2 =', '= 9/4 or 2 and 1/4 kg of rice'],
    answers: ['2 1/4 kg of rice', '9/4', '2 and 1/4', '2 1/4'],
  },
  {
    content: { text: '10. 1/8 - 1/16=' },
    answers: ['1/16'],
  },
  {
    content: { text: '11. 7/3- 5/6=' },
    answers: ['9/6', '3/2'],
  },
  {
    content: {
      text: '12. You bought three boxes of 12 inch pizza as your birthday present for your mother for her 60th birthday. If the sum of the slice of pizzas is 24/8 and your family already ate 3/2 of its portion, how many pizza slices were left?',
    },
    solutions: ['24/8 - 3/2=', '= 24/8 - 12/8', '= 12/8 or 3/2'],
    answers: ['3/2 slices of pizza', '12/8', '3/2'],
  },
  {
    content: { text: '13. 2/6 + 1/7 =' },
    answers: ['10/21'],
  },
  {
    content: { text: '14. 9/8 - 1/4=' },
    answers: ['7/8'],
  },
  {
    content: { text: '15. 3/5 + 2/3 =' },
    answers: ['7/8'],
  },
  {
    content: { text: '16. 1/5-1/8=' },
    answers: ['3/40'],
  },
  {
    content: { text: '17. 5/6-2/3=' },
    answers: ['1/6'],
  },
  {
    content: { text: '18. 1/4 + 1/2 =' },
    answers: ['3/4'],
  },
  {
    content: { text: '19. 1/3 + 2/10 =' },
    answers: ['8/10', '16/30'],
  },
  {
    content: { text: '20. 15/4- 2/3 =' },
    answers: ['37/12', '3 and 1/12', '3 1/12'],
  },
  {
    content: { text: '21. 13/15- 7/9 =' },
    answers: ['12/135', '4/45'],
  },
  {
    content: { text: '22. 17/9 – 1/3 =' },
    answers: ['14/9', '1 and 5/9', '1 5/9'],
  },
  {
    content: { text: '23. 7/12 + 4/6 =' },
    answers: ['5/4', '15/12'],
  },
  {
    content: { text: '24. 23/36 + 4/9 =' },
    answers: ['39/36', '13/12'],
  },
  {
    content: {
      text: '25. Analene caught fish weighing 5 and 2/3 kg. She gave 3 and 1/6 kg of fish to Cj, how many kilograms does Analene have left?',
    },
    solutions: ['5 2/3 - 3 1/6 =', '= 2 3/6 or 2 1/2 kg of fish'],
    answers: ['2 1/2 kg of fish', '2 3/6', '2 and 1/2', '2 1/2'],
  },
  {
    content: {
      text: '26. Sheila found that her car tank is running out of gas and it only has 1/8 gas so she decided to go to the nearest gasoline station. If she would like to fill it up to 3/4 of its tank, how much gasoline should she add?',
    },
    solutions: ['3/4 - 1/8', '= 5/8'],
    answers: ['5/8 gasoline', '5/8'],
  },
  {
    content: {
      text: "27. Yesterday, Joseph's family ate 14/7 kilos of Mangoes and 38/12 kilos of Avocados. What were the total kilograms of fruits they ate?",
    },
    solutions: ['14/7 + 38/12 =', '= 31/6 or 5 and 1/6 kilos of fruits'],
    answers: ['5 1/6 kilos of fruits', '31/6', '5 and 1/6', '5 1/6'],
  },
  {
    content: {
      text: '28. Angeline walked 2/7 kilometers and stopped at the nearest convenience store to buy snacks and to rest. She then walked 5/9 kilometers again to see her best friend at the park. What was the total distance she walked?',
    },
    solutions: ['2/7 + 5/9 =', '= 53/63 kilometers'],
    answers: ['53/63 kilometers', '53/63'],
  },
  {
    content: {
      text: '29. A recipe needs 7/4 teaspoon of soy sauce and 1/2 teaspoon of Vinegar. How much more Soy Sauce does the recipe need?',
    },
    solutions: ['7/4-1/2=', '= 5/4 teaspoon of Soy Sauce'],
    answers: ['5/4 teaspoon of Soy Sauce', '5/4'],
  },
  {
    content: {
      text: '30. Today is your graduation, and your parents decided to buy you caramel and chocolate chip cakes for a small celebration. To share your success with others, you decided to share it with some of your neighbors. You gave off 2/9 of your caramel cake and 1/3 of your chocolate chip cake. How many cakes were left if the remaining caramel and chocolate chip cake were combined?',
    },
    solutions: [
      'For caramel cake, 9/9 - 2/9 = 7/9',
      'For chocolate chip cake 3/3 - 1/3 = 2/3',
      'Then add both remaining cakes, 7/9 + 2/3= 21/27 +18 /27',
      '= 39/27 or 13/9',
    ],
    answers: ['13/9 cakes', '39/27', '13/9'],
  },
];
