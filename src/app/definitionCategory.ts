import Question from './types/Question';

export type MessageFormat = {
  content: { text: string | { videoLink: string } | { imgSrc: string } };
};

export const introMessages1: MessageFormat[] = [
  {
    content: {
      text: 'In this category, we will learn how to add subtract dissimilar fractions but before we proceed, let us know first what fractions is.',
    },
  },
  {
    content: {
      text: 'Fractions refers to a part of a whole.',
    },
  },
  {
    content: {
      text: 'Example',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/fraction-example.png' },
    },
  },
  {
    content: {
      text: 'Any number that is less than one (1) are called Proper Fractions. This is the kind of fraction that the numerator has the lowest number, and the denominator has the highest number.',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/proper-fraction.png' },
    },
  },
  {
    content: {
      text: 'The line in the middle of the numbers is called the Vinculum or the Fraction Bar.',
    },
  },
  {
    content: {
      text: 'The number above the bar is called Numerator.',
    },
  },
  {
    content: {
      text: 'The number below the bar is called Denominator.',
    },
  },
  {
    content: {
      text: 'Do you need a Tagalog-English Translation?',
    },
  },
];
export const introMessages1Taglish: MessageFormat[] = [
  {
    content: {
      text: 'Pag-aaralan natin sa kategoryang ito kung paano mag-add at mag-subtract ng mga Dissimilar Fractions pero bago muna tayo pumunta sa parteng ’yan, alamin muna natin ang kahulugan ng fractions o kilala sa tawag na hating-bilang.',
    },
  },
  {
    content: {
      text: 'Fractions refers to a part of a whole in other words ang fraction ay parte isang buo. Ibig sabihin mas maliit sila sa isang buo o sa isa.',
    },
  },
  {
    content: {
      text: 'Example',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/fraction-example.png' },
    },
  },
  {
    content: {
      text: 'Ang tawag sa mga hating bilang na mas mababa sa isa (1) ay tinatawag na Proper Fractions. Ito rin yung mga fraction na mas mababa ang number ng numerator kesa sa denominator.',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/proper-fraction.png' },
    },
  },
  {
    content: {
      text: 'May linya sa pagitan ng dalawang numero kapag sinusulat ang fractions ito ay tinatawag na Vinculum o Fraction Bar.',
    },
  },
  {
    content: {
      text: 'Ang nasa taas ng Bar ay tinatawag na Numerator',
    },
  },
  {
    content: {
      text: 'Ang nasa ilalim naman ay tinatawag na Denominator.',
    },
  },
];

export const introMessages2: MessageFormat[] = [
  {
    content: {
      text: 'Let us proceed to the other types of fractions',
    },
  },
  {
    content: {
      text: '1. Unit Fractions',
    },
  },
  {
    content: {
      text: 'These are the fractions whose numerator is 1.',
    },
  },
  {
    content: {
      text: 'Example:',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/unit-fraction.png' },
    },
  },
  {
    content: {
      text: '2. Improper Fractions',
    },
  },
  {
    content: {
      text: 'These are the fractions whose numerator is greater than the denominator.',
    },
  },
  {
    content: {
      text: 'Example:',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/improper-fraction.png' },
    },
  },
  {
    content: {
      text: '3. Mixed Number',
    },
  },
  {
    content: {
      text: 'Combination of Whole Number and Fraction.',
    },
  },
  {
    content: {
      text: 'Example:',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/mixed-number.png' },
    },
  },
  {
    content: {
      text: 'Do you need a Tagalog-English Translation?',
    },
  },
];
export const introMessages2Taglish: MessageFormat[] = [
  {
    content: {
      text: 'Bukod sa Proper Fraction ay mayroon pang iba’t ibang uri ng Fraction',
    },
  },
  {
    content: {
      text: '1. Unit Fractions',
    },
  },
  {
    content: {
      text: 'Ito ay ang mga fraction na ang numerator ay 1.',
    },
  },
  {
    content: {
      text: 'Halimbawa:',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/unit-fraction.png' },
    },
  },
  {
    content: {
      text: '2. Improper Fractions',
    },
  },
  {
    content: {
      text: 'Ito naman ang mga fraction na mas mataas ang numerator nito kesa sa kanyang Denominator.',
    },
  },
  {
    content: {
      text: 'Halimbawa:',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/improper-fraction.png' },
    },
  },
  {
    content: {
      text: '3. Mixed Number',
    },
  },
  {
    content: {
      text: 'Combination naman ito ng Whole Number at Fraction.',
    },
  },
  {
    content: {
      text: 'Halimbawa:',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/mixed-number.png' },
    },
  },
];
export const introMessages3: MessageFormat[] = [
  {
    content: {
      text: 'Well since you understand the types of fractions, let us proceed to the Kinds of Group Fractions.',
    },
  },
  {
    content: {
      text: '1. Similar Fractions',
    },
  },
  {
    content: {
      text: 'Fractions that have the same denominator.',
    },
  },
  {
    content: {
      text: 'Example:',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/similar-fraction.png' },
    },
  },
  {
    content: {
      text: '2. Dissimilar Fractions',
    },
  },
  {
    content: {
      text: 'Fractions that have different denominators.',
    },
  },
  {
    content: {
      text: 'Example:',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/dissimilar-fraction.png' },
    },
  },
  {
    content: {
      text: '3. Equivalent Fractions',
    },
  },
  {
    content: {
      text: 'Fractions that have the same value.',
    },
  },
  {
    content: {
      text: 'Examples:',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/equivalent-fraction-1.png' },
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/equivalent-fraction-2.png' },
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/equivalent-fraction-3.png' },
    },
  },
];
export const introMessages3Taglish: MessageFormat[] = [
  {
    content: {
      text: 'Well since you understand the types of fractions, let us proceed to the Kinds of Group Fractions.',
    },
  },
  {
    content: {
      text: '1. Similar Fractions',
    },
  },
  {
    content: {
      text: 'Ito yung mga grupo ng fraction na ang denominator ay magkaparehas.',
    },
  },
  {
    content: {
      text: 'Halimbawa:',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/similar-fraction.png' },
    },
  },
  {
    content: {
      text: '2. Dissimilar Fractions',
    },
  },
  {
    content: {
      text: 'Ito ang mga fraction na ang denominator nila ay magkakaiba.',
    },
  },
  {
    content: {
      text: 'Halimbawa:',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/dissimilar-fraction.png' },
    },
  },
  {
    content: {
      text: '3. Equivalent Fractions',
    },
  },
  {
    content: {
      text: 'Mga Fraction na may same value or kapag nilagay natin siya into simplest form or lowest term ay pare-parehas yung mga makukuha na value.',
    },
  },
  {
    content: {
      text: 'Halimbawa:',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/equivalent-fraction-1.png' },
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/equivalent-fraction-2.png' },
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/equivalent-fraction-3.png' },
    },
  },
];
const introMessages4Subtract: MessageFormat[] = [
  {
    content: {
      text: 'Subtracting Dissimilar Fractions',
    },
  },
  {
    content: {
      text: 'The Steps are the same, but it will be different in last step because you will subtract.',
    },
  },

  {
    content: {
      text: 'These are the steps on how to Subtract Dissimilar Fractions',
    },
  },
  {
    content: {
      text: 'Step 1: Determine the LCD of the Dissimilar Fractions',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/subtract/step-1.png',
      },
    },
  },
  {
    content: {
      text: '5 and 10 are different denominators, the most important rule in adding Dissimilar Fractions is to make the denominators the same.',
    },
  },

  {
    content: {
      text: '5 and 10 are different denominators, the most important rule in adding Dissimilar Fractions is to make the denominators the same.',
    },
  },
  {
    content: {
      text: 'You can do it by listing.',
    },
  },
  {
    content: {
      text: '5= 5, 10, 15, 20, 25',
    },
  },
  {
    content: {
      text: '10= 10, 20, 30, 40, 50',
    },
  },
  {
    content: {
      text: 'In this example, the LCD is 10.',
    },
  },
  {
    content: {
      text: 'Step 2: Make the fractions similar by finding the LCD.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/subtract/step-2.png',
      },
    },
  },
  {
    content: {
      text: 'So, we got the same denominator, Good Job. Proceed to the next step.',
    },
  },
  {
    content: {
      text: 'Step 3: To get your new numerator, divide the LCD by the denominator of each fraction and multiply the quotient by its numerator.',
    },
  },

  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/subtract/step-3.png',
      },
    },
  },
  {
    content: {
      text: 'Since 8/10 is the fraction that we change the denominator, we need to divide the denominator, which is 10 to the denominator of 8/5, which is 5, and 10 divided by 5 equals 2. The quotient will be multiplied to its numerator so 2 x 8= 16, so your new numerator becomes 16.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/subtract/step-3-1.png',
      },
    },
  },
  {
    content: {
      text: 'Step 4: Perform the operation.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/subtract/step-4.png',
      },
    },
  },
  {
    content: {
      text: 'Take note that you don’t need to change the value of denominator if they are the same.',
    },
  },
  {
    content: {
      text: 'I hope you get the steps on Subtracting Dissimilar Fractions.',
    },
  },
];
export const introMessages4: MessageFormat[] = [
  {
    content: {
      text: 'Did you understand kinds of Group Fractions?',
    },
  },
  {
    content: {
      text: 'Then let us know on how to Add and Subtract Dissimilar Fractions',
    },
  },
  {
    content: {
      text: 'Adding Dissimilar Fractions',
    },
  },
  {
    content: {
      text: 'These are the steps on how to Add Dissimilar Fractions',
    },
  },
  {
    content: {
      text: 'Step 1: Determine the LCD of the Dissimilar Fractions',
    },
  },
  {
    content: {
      text: 'The LCD or Least Common Denominator is the smallest number that can be used for all denominators of 2 or more fractions. It is commonly used in Addition and Subtraction of Dissimilar Fractions. Example',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/dissimilar-fraction-step-1.png',
      },
    },
  },
  {
    content: {
      text: '5 and 10 are different denominators, the most important rule in adding Dissimilar Fractions is to make the denominators the same.',
    },
  },
  {
    content: {
      text: 'You can do it by listing.',
    },
  },
  {
    content: {
      text: '5= 5, 10',
    },
  },
  {
    content: {
      text: '10= 10',
    },
  },
  {
    content: {
      text: 'In this example, the LCD is 10.',
    },
  },
  {
    content: {
      text: 'Step 2: Make the fractions similar by finding the LCD.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/dissimilar-fraction-step-2.png',
      },
    },
  },
  {
    content: {
      text: 'So, we got the same denominator, Good Job. Proceed to the next step.',
    },
  },
  {
    content: {
      text: 'Step 3: To get your new numerator, divide the LCD by the denominator of each fraction and multiply the quotient by its numerator.',
    },
  },

  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/dissimilar-fraction-step-3.png',
      },
    },
  },
  {
    content: {
      text: 'Since 8/10 is the fraction that we change the denominator, we need to divide the denominator, which is 10 to the denominator of 8/5, which is 5, and 10 divided by 5 equals 2. The quotient will be multiplied to its numerator so 2 x 8= 16, so your new numerator becomes 16.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/dissimilar-fraction-step-3-1.png',
      },
    },
  },
  {
    content: {
      text: 'Step 4: Perform the operation.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/dissimilar-fraction-step-4.png',
      },
    },
  },
  {
    content: {
      text: 'Take note that you don’t need to change the value of denominator if they are the same.',
    },
  },
  {
    content: {
      text: 'I hope you get the steps on Adding Dissimilar Fractions.',
    },
  },
  ...introMessages4Subtract,
];
export const introMessages4Taglish: MessageFormat[] = [
  {
    content: {
      text: 'Adding Dissimilar Fractions',
    },
  },
  {
    content: {
      text: 'Ito ang mga hakbang kung paano mag-add ng dissimilar fractions.',
    },
  },
  {
    content: {
      text: 'Step 1: Determine the LCD of the Dissimilar Fractions',
    },
  },
  {
    content: {
      text: 'The LCD or Least Common Denominator is the smallest number that can be used for all denominators of 2 or more fractions. It is commonly used in Addition and Subtraction of Dissimilar Fractions. Example',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/dissimilar-fraction-step-1.png',
      },
    },
  },
  {
    content: {
      text: '5 and 10 are different denominators, the most important rule in adding Dissimilar Fractions is to make the denominators the same.',
    },
  },
  {
    content: {
      text: 'You can do it by listing.',
    },
  },
  {
    content: {
      text: '5 = 5, 10, 15, 20, 25',
    },
  },
  {
    content: {
      text: '10 = 10, 20, 30, 40, 50',
    },
  },
  {
    content: {
      text: 'Since 10 is their first similar multiple or their least common multiple, therefore, 10 is the LCD in this example.',
    },
  },
  // {
  //   content: {
  //     text: 'In this example, the LCD is 10.',
  //   },
  // },
  {
    content: {
      text: 'Step 2: Make the fractions similar by finding the LCD.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/dissimilar-fraction-step-2.png',
      },
    },
  },
  {
    content: {
      text: 'So, we got the same denominator, Good Job. Proceed to the next step.',
    },
  },
  {
    content: {
      text: 'Step 3: To get your new numerator, divide the LCD by the denominator of each fraction and multiply the quotient by its numerator.',
    },
  },

  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/dissimilar-fraction-step-3.png',
      },
    },
  },
  {
    content: {
      text: 'Since 8/10 is the fraction that we change the denominator, we need to divide the denominator, which is 10 to the denominator of 8/5, which is 5, and 10 divided by 5 equals 2. The quotient will be multiplied to its numerator so 2 x 8= 16, so your new numerator becomes 16.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/dissimilar-fraction-step-3-1.png',
      },
    },
  },
  {
    content: {
      text: 'Step 4: Perform the operation.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/dissimilar-fraction-step-4.png',
      },
    },
  },
  {
    content: {
      text: 'Take note that you don’t need to change the value of denominator if they are the same.',
    },
  },
  {
    content: {
      text: 'I hope you get the steps on Adding Dissimilar Fractions.',
    },
  },
  ...introMessages4Subtract,
];

export const definitionQuestions: Question[] = [
  {
    content: {
      text: '1. Ano ang tawag ng nasa ilalim ng fraction bar o Vinculum?',
    },
    answers: ['DENOMINATOR'],
  },
  {
    content: {
      text: '2. Ano ang tawag sa mga fractions na magkaiba ang kanilang denominator?',
    },
    answers: ['DISSIMILAR FRACTIONS'],
  },
  {
    content: {
      text: '3. Ano ang tawag sa linya na nasa pagitan ng Fraction?',
    },
    answers: ['FRACTION BAR', 'VINCULUM'],
  },
  {
    content: {
      text: '4. It refers to a part of a whole.',
    },
    answers: ['FRACTION'],
  },
  {
    content: {
      text: '5. It is the smallest number that can be used for all denominators of 2 or more fractions.',
    },
    answers: ['LEAST COMMON DENOMINATOR'],
  },
];
