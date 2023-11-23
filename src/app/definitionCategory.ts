import Question from './types/Question';

export type MessageFormat = {
  content: { text: string | { videoLink: string } | { imgSrc: string } };
};

export const introMessages1: MessageFormat[] = [
  {
    content: {
      text: 'In this category, we will learn how to add and subtract Rational Numbers but before we proceed, let us know first what Rational Number is.',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/new/real-numbers.png' },
    },
  },
  {
    content: {
      text: 'What is a Rational Number?',
    },
  },
  {
    content: {
      text: 'A rational number, in Mathematics, can be defined as any number which can be represented in the form of p/q where q ≠ 0.',
    },
  },
  {
    content: {
      text: 'Also, we can say that any fraction fits under the category of rational numbers, where the denominator and numerator are integers and the denominator is not equal to zero.',
    },
  },

  {
    content: {
      text: 'A rational number is any number that can be written as a fraction, where both the numerator and the denominator are integers, and the denominator is not equal to zero.',
    },
  },
];

export const introMessages2: MessageFormat[] = [
  {
    content: {
      text: 'How to identify rational numbers?',
    },
  },
  {
    content: {
      text: 'To identify if a number is rational or not,',
    },
  },
  {
    content: {
      text: 'It is represented in the form of p/q, where q≠0.',
    },
  },
  {
    content: {
      text: 'The ratio p/q can be further simplified and represented in decimal form.',
    },
  },
  {
    content: {
      text: 'Examples: ',
    },
  },
  {
    content: {
      text: { imgSrc: 'assets/definitionCategory/new/rational-numbers.png' },
    },
  },
  {
    content: {
      text: 'Types of Rational Numbers',
    },
  },
  {
    content: {
      text: 'There are four types of rational numbers:',
    },
  },
  {
    content: {
      text: 'Integers',
    },
  },
  {
    content: {
      text: 'Fractions made up of integers',
    },
  },
  {
    content: {
      text: 'Terminating decimal numbers',
    },
  },
  {
    content: {
      text: 'Non-terminating decimal numbers with infinitely repeating patterns',
    },
  },
];

export const introMessages3: MessageFormat[] = [
  {
    content: {
      text: 'Integers',
    },
  },
  {
    content: {
      text: 'Any integer can be converted cleanly into a fraction, and is a rational number.',
    },
  },
  {
    content: {
      text: 'For example, 3 can be expressed as 3/1. And since both the numerator (3) and denominator (1) are integers, and the denominator is not 0, then 3 is a rational number. This works for negative integers like -2 (or -2/1) and -2006 (or -2006/1).',
    },
  },
  {
    content: {
      text: 'The number 0 is also a rational number, because it can be converted into fraction. For example, 0/1, 0/-4, and 0/18,572 are all valid fractions, and meet the definition of a rational number.',
    },
  },

  {
    content: {
      text: 'Fractions made up of integers',
    },
  },
  {
    content: {
      text: 'Any fraction made up of integers is a rational number, as long as the denominator is not 0.',
    },
  },
  {
    content: {
      text: 'For example, 1/3, -5/3, and 27/-463 are all rational numbers',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/new/fractions-made-of-integers.png',
      },
    },
  },
  {
    content: {
      text: 'Terminating Decimal Numbers',
    },
  },
  {
    content: {
      text: 'Any decimal number that terminates, or ends at some point, is a rational number.',
    },
  },
  {
    content: {
      text: 'For example, take the decimal number 0.5. This can be converted to 1/2, which means its a rational number.',
    },
  },
  {
    content: {
      text: "Even longer terminating decimal numbers can be cleanly converted into fractions. For instance, 0.0001 can be expressed as 1/10,000, meaning that it's a rational number.",
    },
  },
  {
    content: {
      text: "As long as a decimal number eventually terminates, without rounding or approximation, it's a rational number.",
    },
  },
  {
    content: {
      text: 'Non-terminating Decimal Numbers With Infinitely Repeating Patterns',
    },
  },
  {
    content: {
      text: 'Decimal numbers that go on forever with repeating patterns are rational numbers. But this is a bit tricky, because the pattern must repeat infinitely.',
    },
  },
  {
    content: {
      text: "For example, take the number 0.33333... Even though this is often simplified as 0.33, the pattern of 3's after the decimal point repeat infinitely. This means that the number can be converted into the fraction 1/3, and is a rational number.",
    },
  },
];

export const introMessages4: MessageFormat[] = [
  {
    content: {
      text: 'Addition of Rational Numbers with Unlike Denominators',
    },
  },
  {
    content: {
      text: 'On adding rational numbers, here are the steps that should be followed:',
    },
  },
  {
    content: {
      text: 'Step 1. Find the common denominator by determining the LCD of the Rational Numbers with Unlike Denominators using listing method.',
    },
  },
  {
    content: {
      text: 'The LCD or Least Common Denominator is the smallest number that can be used for all denominators of 2 or more fractions. It is commonly used in Addition and Subtraction of Dissimilar Fractions.',
    },
  },

  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/new/rational-addition-example.png',
      },
    },
  },
  {
    content: {
      text: 'In the equation, the addends have unlike denominators which is 5 and 10. Once the denominators are dissimilar, it is important to determine first their LCD to make the denominators the same. One of the methods that can be use is listing method',
    },
  },
  {
    content: {
      text: 'Step 2. Make the denominator similar by using the LCD.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/new/rational-addition-step-2.png',
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
      text: 'Step 3: To get your new numerator, divide the LCD by the denominator of each number and multiply the quotient by its numerator.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/new/rational-addition-step-3-1.png',
      },
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/new/rational-addition-step-3-2.png',
      },
    },
  },
  {
    content: {
      text: 'Note: If the LCD and the denominator are just the same, just bring it down and then proceed with the other term or if there is no other term, proceed to Step 4.',
    },
  },
  {
    content: {
      text: 'Now, substitute.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/new/rational-addition-step-3-3.png',
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
        imgSrc: 'assets/definitionCategory/new/rational-addition-step-4-1.png',
      },
    },
  },
];

export const introMessages5: MessageFormat[] = [
  {
    content: {
      text: 'Subtraction of Rational Numbers with Unlike Denominators',
    },
  },
  {
    content: {
      text: 'On subtracting rational numbers, here are the steps that should be followed:',
    },
  },
  {
    content: {
      text: 'Step 1. Find the common denominator by determining the LCD of the Rational Numbers with Unlike Denominators using listing method.',
    },
  },
  {
    content: {
      text: 'The LCD or Least Common Denominator is the smallest number that can be used for all denominators of 2 or more fractions. It is commonly used in Addition and Subtraction of Dissimilar Fractions.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/new/rational-subtraction-1.png',
      },
    },
  },
  {
    content: {
      text: 'In the equation, the two terms have unlike denominators which is 5 and 10. Once the denominators are dissimilar, it is important to determine first their LCD to make the denominators the same. One of the methods that can be use is listing method.',
    },
  },
  {
    content: {
      text: 'Step 2. Make the denominator similar by using the LCD.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/new/rational-subtraction-2.png',
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
      text: 'Step 3: To get your new numerator, divide the LCD by the denominator of each number and multiply the quotient by its numerator.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/new/rational-subtraction-3-1.png',
      },
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/new/rational-subtraction-3-2.png',
      },
    },
  },
  {
    content: {
      text: 'Note: If the LCD and the denominator are just the same, just bring it down and then proceed with the other term or if there is no other term, proceed to Step 4.',
    },
  },
  {
    content: {
      text: 'Now, substitute.',
    },
  },
  {
    content: {
      text: {
        imgSrc: 'assets/definitionCategory/new/rational-subtraction-3-3.png',
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
        imgSrc: 'assets/definitionCategory/new/rational-subtraction-4.png',
      },
    },
  },
];

export const introMessages6: MessageFormat[] = [
  {
    content: {
      text: 'When Adding and Subtracting Rational Numbers with Unlike Denominators, you need to remember that;',
    },
  },
  {
    content: {
      text: 'It is easy to simplify a fraction when denominators are alike.',
    },
  },
  {
    content: {
      text: 'The first step is always find their common denominator.',
    },
  },
  {
    content: {
      text: 'Why fractions need to have first a common denominator before we add or subtract it?',
    },
  },
  {
    content: {
      text: 'Why do you need to find equivalent fractions before subtracting fractions?',
    },
  },
  {
    content: {
      text: 'To combine or compare parts of a whole.',
    },
  },
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
