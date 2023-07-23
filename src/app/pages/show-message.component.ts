import { Component, OnInit, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'src/app/services/message.service';
import { StepService } from 'src/app/services/step.service';
import { UserService } from 'src/app/services/user.service';
import showMessages from 'src/app/utils/showMessages';
import Phases from '../types/Phases';
import {
  Carousel,
  ChatBubble,
  ChatImage,
  ChatVideo,
  Message,
} from '../types/Message';
import { StateService } from '../services/state.service';
import { ActionsService } from '../services/actions.service';
import ChatComponent from './chat.component';
import randomNumber from '../utils/randomNumber';
import { SupabaseService } from '../services/supabase.service';
import { from, map } from 'rxjs';
import {
  correctMessages,
  expectationMessages,
  incorrectMessages,
  preTestQuestions,
} from '../questions';
import Question from '../types/Question';
import {
  definitionQuestions,
  introMessages1,
  introMessages1Taglish,
  introMessages2,
  introMessages2Taglish,
  introMessages3,
  introMessages4,
} from '../definitionCategory';

const DELAY = 100; // can make this random, for a better effect

@Component({
  selector: 'show-message',
  standalone: true,
  imports: [CommonModule],
  template: `<div></div>`,
})
export class ShowMessageComponent implements OnInit {
  private newBotMessage(
    content: { text: string | { videoLink: string } | { imgSrc: string } },
    options?: { isLink: boolean },
  ) {
    if (content.text instanceof Object && 'videoLink' in content.text) {
      const result: ChatVideo = {
        type: 'ChatVideo',
        videoLink: content.text.videoLink,
      };

      return result;
    }

    if (content.text instanceof Object && 'imgSrc' in content.text) {
      const result: ChatImage = {
        type: 'ChatImage',
        imgSrc: content.text.imgSrc,
      };

      return result;
    }

    if (content.text !== undefined) {
      const result: ChatBubble = {
        sender: 'bot',
        content: content.text,
        type: 'ChatBubble',
        isLink: options?.isLink,
      };

      return result;
    }
    throw new Error('impossible');
  }

  private showMessages(
    messages: Message[],
    mapFn?: () => void,
    lastly?: () => void,
    delay?: number,
  ) {
    this.stateService.setIsChatInputDisabled(true);
    // console.log('input is disabled');
    this.messageService.isTyping(true);

    const mapFnWrapper = (message: Message) => {
      // runs every item
      this.messageService.add(message);
      mapFn && mapFn();
    };

    const lastFnWrapper = () => {
      // console.log('input is enabled');
      this.messageService.isTyping(false);

      this.stateService.setIsChatInputDisabled(false);
      lastly && lastly();
    };

    showMessages<Message>(
      delay || DELAY,
      messages,
      mapFnWrapper,
      lastFnWrapper,
    );
  }

  private runLogicUpdate() {
    this.stepService.update();
  }

  private moveToPhase(p: Phases) {
    this.stepService.current.set(p);
    // console.log('show message | move to:', p);
  }

  private getCurrentPreTestQuestion() {
    const currentIndex = this.stateService.currentPreTestQuestion();
    const questions = preTestQuestions;

    return questions[currentIndex].content.text;
  }
  private getCurrentDefinitionQuestion() {
    const currentIndex = this.stateService.currentDefinitionQuestion();
    const questions = definitionQuestions;
    console.log('definition questions length:', definitionQuestions.length);
    console.log('currentIndex:', currentIndex);
    return questions[currentIndex].content.text;
  }

  constructor(
    private messageService: MessageService,
    private stepService: StepService,
    private userService: UserService,
    private stateService: StateService,
    private actionsService: ActionsService,
    private supabaseService: SupabaseService,
  ) {
    effect(() => {
      const step = this.stepService.current();

      switch (step) {
        case Phases.SELECT_CATEGORY_1:
          {
            const noMoreCategories = !Object.values(
              this.userService.getCurrentValue().categories,
            ).includes(null);

            if (noMoreCategories) {
              setTimeout(() => {
                this.moveToPhase(Phases.CATEGORIES_END_1);
              }, 100);

              break;
            }

            const messages: Message[] = [
              this.newBotMessage({ text: 'Select a category.' }),
            ];

            const showQuickReplies = () => {
              this.actionsService.content.set({
                type: 'QuickReply',
                items: [
                  {
                    label: 'Definition',
                    callback: () => this.moveToPhase(Phases.DEFINITION_INTRO),
                  },
                  {
                    label: 'Numbers',
                    callback: () => this.moveToPhase(Phases.NUMBERS_INTRO),
                  },
                  {
                    label: 'Places',
                    callback: () => this.moveToPhase(Phases.PLACES_INTRO),
                  },
                ],
              });
            };

            this.showMessages(messages, undefined, showQuickReplies);
          }
          break;
        case Phases.CATEGORY_ALREADY_SELECTED:
          {
            const messages: Message[] = [
              this.newBotMessage({
                text: 'You already finished this category',
              }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.GREET:
          {
            const messages: Message[] = [
              this.newBotMessage({
                text: 'Greetings, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad m',
              }),
            ];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Get Started',
                callback: () => {
                  this.runLogicUpdate();
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton);
            // this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.DEMOGRAPHICS_NAME_1:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: "What's your name" }),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.DEMOGRAPHICS_NAME_2:
          {
            const messages: Message[] = [
              this.newBotMessage({
                text: `Your name is ${
                  this.stateService.string()['name']
                }, is that right?`,
              }),
            ];

            const showQuickReplies = () => {
              this.actionsService.content.set({
                type: 'QuickReply',
                items: [
                  {
                    label: 'Yes',
                  },
                  {
                    label: 'No',
                  },
                ],
              });
            };

            // todo: maybe remove the mapFn param, if its always undefined
            this.showMessages(messages, undefined, showQuickReplies);
          }
          break;
        case Phases.DEMOGRAPHICS_SCHOOL:
          {
            const messages: Message[] = [
              this.newBotMessage({
                text: `Cool, ${this.userService.getCurrentValue().name}`,
              }),
              this.newBotMessage({ text: 'Which school are you from?' }),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.PRETEST_INTRO:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Thank you.' }),
              this.newBotMessage({
                text: 'In order to help you further, please proceed answering the pre-test.',
              }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PRETEST_QUESTION:
          {
            const expectationMessage = expectationMessages[randomNumber(0, 29)];
            const currentQuestion = this.getCurrentPreTestQuestion();
            const messages = [
              this.newBotMessage({ text: expectationMessage }),
              this.newBotMessage({ text: currentQuestion }),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.PRETEST_WRONG:
          {
            const currentIndex = this.stateService.currentPreTestQuestion();
            const correctAnswer = preTestQuestions[currentIndex].answers[0];
            const incorrectMessage = incorrectMessages[randomNumber(0, 29)];
            const solution = preTestQuestions[currentIndex].solutions;
            const solutionMessages =
              solution !== undefined
                ? [
                    this.newBotMessage({ text: 'Solution:' }),
                    ...solution.map((s) => this.newBotMessage({ text: s })),
                  ]
                : [];

            const messages = [
              this.newBotMessage({ text: incorrectMessage }),
              this.newBotMessage({
                text: 'Correct answer is ' + correctAnswer,
              }),
              ...solutionMessages,
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PRETEST_CORRECT:
          {
            const correctMessage = correctMessages[randomNumber(0, 29)];
            const messages = [this.newBotMessage({ text: correctMessage })];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        case Phases.PRETEST_RESULT:
          {
            const total = preTestQuestions.length;
            const score = this.userService.getCurrentValue().preTestScore;
            const messages: Message[] = [
              this.newBotMessage({
                text: 'Congratulations, you have finished the pre-test.',
              }),
              this.newBotMessage({
                text: `Pre-test result: ${score === null ? 0 : score}/${total}`,
              }),
              this.newBotMessage({
                text: 'You may now proceed to the next step.',
              }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        case Phases.DEFINITION_INTRO:
          {
            const introMessagesBubble = introMessages1.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [
              this.newBotMessage({ text: 'You selected definition category.' }),
              ...introMessagesBubble,
            ];

            const showQuickReplies = () => {
              this.actionsService.content.set({
                type: 'QuickReply',
                items: [
                  {
                    label: 'Yes',
                    callback: () =>
                      this.moveToPhase(Phases.DEFINITION_INTRO_TAGLISH),
                  },
                  {
                    label: 'No',
                    callback: () => this.moveToPhase(Phases.DEFINITION_INTRO_2),
                  },
                ],
              });
            };

            this.showMessages(messages, undefined, showQuickReplies, 100);
          }
          break;
        case Phases.DEFINITION_INTRO_TAGLISH:
          {
            const introMessagesBubble = introMessages1Taglish.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Next',
                callback: () => this.moveToPhase(Phases.DEFINITION_INTRO_2),
              });
            };

            this.showMessages(
              messages,
              undefined,
              () => {
                showButton();
              },
              100,
            );
          }
          break;

        case Phases.DEFINITION_INTRO_2_TAGLISH:
          {
            const introMessagesBubble = introMessages2Taglish.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Next',
                callback: () => this.moveToPhase(Phases.DEFINITION_INTRO_2),
              });
            };

            this.showMessages(
              messages,
              undefined,
              () => {
                showButton();
              },
              100,
            );
          }
          break;
        case Phases.DEFINITION_INTRO_2:
          {
            const introMessagesBubble = introMessages2.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showQuickReplies = () => {
              this.actionsService.content.set({
                type: 'QuickReply',
                items: [
                  {
                    label: 'Yes',
                    callback: () =>
                      this.moveToPhase(Phases.DEFINITION_INTRO_2_TAGLISH),
                  },
                  {
                    label: 'No',
                    callback: () => this.moveToPhase(Phases.DEFINITION_INTRO_3),
                  },
                ],
              });
            };

            this.showMessages(messages, undefined, showQuickReplies, 100);
          }
          break;
        case Phases.DEFINITION_INTRO_3:
          {
            const introMessagesBubble = introMessages3.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Next',

                // callback: () => this.moveToPhase(Phases.DEFINITION_INTRO_4),
                callback: () => this.runLogicUpdate(),
              });
            };

            this.showMessages(
              messages,
              undefined,
              () => {
                showButton();
              },
              100,
            );
          }
          break;
        case Phases.DEFINITION_INTRO_4:
          {
            const introMessagesBubble = introMessages4.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Next',
                callback: () => this.runLogicUpdate(),
              });
            };

            this.showMessages(
              messages,
              undefined,
              () => {
                showButton();
              },
              100,
            );
          }
          break;
        case Phases.DEFINITION_QUESTION:
          {
            const expectationMessage = expectationMessages[randomNumber(0, 29)];
            const currentQuestion = this.getCurrentDefinitionQuestion();
            const messages = [
              this.newBotMessage({ text: expectationMessage }),
              this.newBotMessage({ text: currentQuestion }),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.DEFINITION_WRONG:
          {
            const currentIndex = this.stateService.currentDefinitionQuestion();
            const correctAnswer = definitionQuestions[currentIndex].answers[0];
            const incorrectMessage = incorrectMessages[randomNumber(0, 29)];
            const solution = definitionQuestions[currentIndex].solutions;
            const solutionMessages =
              solution !== undefined
                ? [
                    this.newBotMessage({ text: 'Solution:' }),
                    ...solution.map((s) => this.newBotMessage({ text: s })),
                  ]
                : [];

            const messages = [
              this.newBotMessage({ text: incorrectMessage }),
              this.newBotMessage({
                text: 'Correct answer is ' + correctAnswer,
              }),
              ...solutionMessages,
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.DEFINITION_CORRECT:
          {
            const correctMessage = correctMessages[randomNumber(0, 29)];
            const messages = [this.newBotMessage({ text: correctMessage })];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        case Phases.DEFINITION_RESULT:
          {
            const total = definitionQuestions.length;
            const score =
              this.userService.getCurrentValue().categories['definition'];
            const messages: Message[] = [
              this.newBotMessage({
                text: 'Congratulations on finishing this Definition Category, you did well in the exercises.',
              }),
              this.newBotMessage({
                text: `Result: ${score === null ? 0 : score}/${total}`,
              }),
              this.newBotMessage({
                text: 'You may now proceed to the next step.',
              }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        case Phases.ANIMALS_INTRO:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'You selected animals category.' }),
              this.newBotMessage({ text: 'This category is about animals' }),
            ];

            this.showMessages(messages, undefined, () =>
              this.moveToPhase(Phases.ANIMALS_1),
            );
          }
          break;
        case Phases.ANIMALS_1:
          {
            // console.log('show mesage  | animals 1');
            const messages: Message[] = [
              this.newBotMessage({ text: 'Question 1' }),
              this.newBotMessage({
                text: 'What is a small domesticated carnivorous mammal with soft fur, a short snout, and retractable claws',
              }),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.ANIMALS_1_CORRECT:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Correct' }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.ANIMALS_1_WRONG:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Wrong' }),
              this.newBotMessage({ text: 'Correct answer is cat' }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.ANIMALS_2:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Question 2' }),
              this.newBotMessage({
                text: 'What is a widely kept as a pet or for catching mice, and many breeds have been developed',
              }),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.ANIMALS_2_CORRECT:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Correct' }),
              this.newBotMessage({ text: 'It is a cat' }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.ANIMALS_2_WRONG:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Wrong' }),
              this.newBotMessage({ text: 'Its still a cat' }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.ANIMALS_RESULT:
          {
            const score =
              this.userService.getCurrentValue().categories['animals'];

            const messages: Message[] = [
              this.newBotMessage({
                text: 'Congratulations, you have finished the animals category.',
              }),
              this.newBotMessage({
                text: `Animals category result: ${
                  score === null ? 0 : score
                }/2`,
              }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        case Phases.PLACES_INTRO:
          {
            // console.log('show-message| animals intro ');
            const messages: Message[] = [
              this.newBotMessage({ text: 'You selected places category.' }),
              this.newBotMessage({ text: 'This category is about places' }),
            ];

            this.showMessages(messages, undefined, () =>
              this.moveToPhase(Phases.PLACES_1),
            );
          }
          break;
        case Phases.PLACES_1:
          {
            // console.log('show mesage  | animals 1');
            const messages: Message[] = [
              this.newBotMessage({ text: 'Question 1' }),
              this.newBotMessage({
                text: 'What is the capital of the Philippines? ',
              }),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.PLACES_1_CORRECT:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Correct' }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PLACES_1_WRONG:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Wrong' }),
              this.newBotMessage({ text: 'Correct answer is Manila' }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PLACES_2:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Question 2' }),
              this.newBotMessage({ text: 'What is the capital of Japan' }),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.PLACES_2_CORRECT:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Correct' }),
              this.newBotMessage({ text: 'It is Tokyo' }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PLACES_2_WRONG:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Wrong' }),
              this.newBotMessage({ text: 'Its Tokyo' }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PLACES_RESULT:
          {
            const score =
              this.userService.getCurrentValue().categories['places'];

            const messages: Message[] = [
              this.newBotMessage({
                text: 'Congratulations, you have finished the places category.',
              }),
              this.newBotMessage({
                text: `Places category result: ${score === null ? 0 : score}/2`,
              }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        case Phases.NUMBERS_INTRO:
          {
            // console.log('show-message| animals intro ');
            const messages: Message[] = [
              this.newBotMessage({ text: 'You selected numbers category.' }),
              this.newBotMessage({ text: 'This category is about numbers' }),
            ];

            this.showMessages(messages, undefined, () =>
              this.moveToPhase(Phases.NUMBERS_1),
            );
          }
          break;
        case Phases.NUMBERS_1:
          {
            // console.log('show mesage  | animals 1');
            const messages: Message[] = [
              this.newBotMessage({ text: 'Question 1' }),
              this.newBotMessage({ text: 'What is 1 x 1 ' }),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.NUMBERS_1_CORRECT:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Correct' }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.NUMBERS_1_WRONG:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Wrong' }),
              this.newBotMessage({ text: 'Correct answer is 1' }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.NUMBERS_2:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Question 2' }),
              this.newBotMessage({ text: 'What is 1 / 1' }),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.NUMBERS_2_CORRECT:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Correct' }),
              this.newBotMessage({ text: 'It is 1' }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PLACES_2_WRONG:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Wrong' }),
              this.newBotMessage({ text: 'Its 1' }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.NUMBERS_RESULT:
          {
            const score =
              this.userService.getCurrentValue().categories['numbers'];

            const messages: Message[] = [
              this.newBotMessage({
                text: 'Congratulations, you have finished the numbers category.',
              }),
              this.newBotMessage({
                text: `Numbers category result: ${
                  score === null ? 0 : score
                }/2`,
              }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        case Phases.CHAT_END:
          {
            const messages: Message[] = [
              this.newBotMessage({
                text: 'You have answered all of the questions I have.',
              }),
            ];

            const showButton = () => {
              console.log('buitton shown');
              this.actionsService.content.set({
                type: 'Button',
                label: 'Go Back',
                callback: () => this.runLogicUpdate(),
              });
            };

            this.showMessages(messages, undefined, () => {
              showButton();
              this.runLogicUpdate();
            });
          }
          break;
        case Phases.CHAT_END_BACK_BUTTON:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Thank you.' }),
            ];

            this.supabaseService.save().subscribe({
              next: () => console.log('done saving data'),
              error: () => console.log('error saving data, retrying'),
            });

            this.showMessages(messages);
          }
          break;
        case Phases.CATEGORIES_END_1:
          {
            const messages: Message[] = [
              this.newBotMessage({
                text: 'Job well done, you accomplished all the categories',
              }),
              this.newBotMessage({ text: 'Do you still have any questions?' }),
            ];

            const showQuickReplies = () => {
              this.actionsService.content.set({
                type: 'QuickReply',
                items: [
                  {
                    label: 'Yes',
                    callback: () =>
                      this.moveToPhase(Phases.CATEGORIES_END_CAROUSEL),
                  },
                  {
                    label: 'No',
                    callback: () => this.moveToPhase(Phases.CATEGORIES_END_NO),
                  },
                ],
              });
            };

            this.showMessages(messages, undefined, showQuickReplies);
          }
          break;

        case Phases.CATEGORIES_END_CAROUSEL:
          {
            const messages: Message[] = [
              {
                content: [
                  {
                    message: 'ABC',
                    image: '',
                    clickCallback: () => console.log('ABC!'),
                    link: 'https://www.fb.com/dotRarufu',
                  },
                  {
                    message: '123',
                    image: '',
                    clickCallback: () => console.log('123!'),
                    link: 'https://www.fb.com/dotRarufu',
                  },
                  {
                    message: '123',
                    image: '',
                    clickCallback: () => console.log('123!'),
                    link: 'https://www.fb.com/dotRarufu',
                  },
                ],
                type: 'Carousel',
              },
              this.newBotMessage({
                text: 'You may also take a look on this gdrive to further improve your mastery level on addition and subtraction of dissimilar fractions',
              }),
              this.newBotMessage(
                { text: 'https://gdrive.link.here' },
                { isLink: true },
              ),
            ];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Okay',
                callback: () => {
                  this.moveToPhase(Phases.POSTTEST_INTRO);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };

            this.showMessages(messages, undefined, () => showButton());
          }
          break;
        case Phases.POSTTEST_1:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Question 1:' }),
              this.newBotMessage({ text: '1 + 1 = ?' }),
            ];

            this.showMessages(messages);
          }
          break;

        case Phases.POSTTEST_INTRO:
          {
            const messages: Message[] = [
              this.newBotMessage({
                text: 'You will be answering post-test questions',
              }),
              this.newBotMessage({
                text: 'This is to gauge your understanding of the topic',
              }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.POSTTEST_1_WRONG:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Wrong:' }),
              this.newBotMessage({ text: 'The correct answer is 2' }),
              this.newBotMessage({ text: 'Solution: 1 + 1 = 2' }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.POSTTEST_1_CORRECT:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Correct' }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.POSTTEST_2:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Question 2' }),
              this.newBotMessage({ text: '2 + 2 = ?' }),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.POSTTEST_2_CORRECT:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Correct' }),
              this.newBotMessage({
                text: 'Because 2 + 2 is simply equals to 4',
              }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.POSTTEST_2_WRONG:
          {
            const messages: Message[] = [
              this.newBotMessage({ text: 'Wrong ❌' }),
              this.newBotMessage({ text: 'Solution: 2 + 2 = 4 ' }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.POSTTEST_RESULT:
          {
            const score = this.userService.getCurrentValue().postTestScore;

            const messages: Message[] = [
              this.newBotMessage({
                text: 'Congratulations, you have finished the post-test.',
              }),
              this.newBotMessage({
                text: `Post-test result: ${score === null ? 0 : score}/2`,
              }),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.NO_MORE:
          {
            this.getRandomQuote().subscribe({
              next: (quote) => {
                const messages: Message[] = [
                  this.newBotMessage({
                    text: `${quote.text} - ${quote.author}`,
                  }),
                ];

                this.showMessages(messages);
              },
              error: () => {
                const messages: Message[] = [
                  this.newBotMessage({
                    text: 'You already answered all of the questions',
                  }),
                ];

                this.showMessages(messages);
              },
            });
          }
          break;

        default:
          break;
      }
    });
  }

  ngOnInit(): void {}

  private getRandomQuote() {
    const request = fetch('https://type.fit/api/quotes').then((r) => r.json());
    const request$ = from(request);
    const quote = request$.pipe(
      map((r) => {
        const response = r as { text: string; author: string }[];

        return response;
      }),
      map((r) => {
        const index = randomNumber(0, r.length - 1);

        return r[index];
      }),
    );

    return quote;
  }
}
