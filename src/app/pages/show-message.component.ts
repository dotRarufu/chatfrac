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
} from '../preTestQuestions';
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
import {
  examplesIntro1Messages,
  examplesIntro2Messages,
  examplesIntro3Messages,
  examplesQuestions,
} from '../examplesCategory';
import { postTestQuestions } from '../postTestQuestions';
import {
  modelsIntro1Block,
  modelsIntro2Block,
  modelsIntro3Block,
  modelsIntro4Block,
  modelsIntro5Linear,
  modelsIntro6Linear,
  modelsIntro7Linear,
  modelsIntro8Linear,
  modelsQuestions,
  modelsQuestionsIntro,
} from '../modelsCategory';

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
  private getCurrentPostTestQuestion() {
    const currentIndex = this.stateService.currentPostTestQuestion();
    const questions = postTestQuestions;

    return questions[currentIndex].content.text;
  }
  private getCurrentDefinitionQuestion() {
    const currentIndex = this.stateService.currentDefinitionQuestion();
    const questions = definitionQuestions;
    return questions[currentIndex].content.text;
  }
  private getCurrentExamplesQuestion() {
    const currentIndex = this.stateService.currentExamplesQuestion();
    const questions = examplesQuestions;
    return questions[currentIndex].content.text;
  }
  private getCurrentModelsQuestion() {
    const currentIndex = this.stateService.currentModelsQuestion();
    const questions = modelsQuestions;
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
                    label: 'Examples',
                    callback: () => this.moveToPhase(Phases.EXAMPLES_INTRO_1),
                  },
                  {
                    label: 'Models',
                    callback: () =>
                      this.moveToPhase(Phases.MODELS_INTRO_1_BLOCK),
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

        case Phases.EXAMPLES_INTRO_1:
          {
            const introMessagesBubble = examplesIntro1Messages.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Yes',
                callback: () => {
                  this.moveToPhase(Phases.EXAMPLES_INTRO_2);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton, 100);
          }
          break;
        case Phases.EXAMPLES_INTRO_2:
          {
            const introMessagesBubble = examplesIntro2Messages.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Yes',
                callback: () => {
                  this.moveToPhase(Phases.EXAMPLES_INTRO_3);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton, 100);
          }
          break;
        case Phases.EXAMPLES_INTRO_3:
          {
            const introMessagesBubble = examplesIntro3Messages.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Yes',
                callback: () => {
                  this.moveToPhase(Phases.EXAMPLES_INTRO_4);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton, 100);
          }
          break;
        case Phases.EXAMPLES_INTRO_4:
          {
            const introMessagesBubble = examplesIntro3Messages.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Yes',
                callback: () => {
                  this.moveToPhase(Phases.EXAMPLES_INTRO_5);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton, 100);
          }
          break;
        case Phases.EXAMPLES_INTRO_5:
          {
            const introMessagesBubble = examplesIntro3Messages.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Yes',
                callback: () => {
                  this.moveToPhase(Phases.EXAMPLES_INTRO_6);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton, 100);
          }
          break;
        case Phases.EXAMPLES_INTRO_6:
          {
            const introMessagesBubble = examplesIntro3Messages.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Yes',
                callback: () => {
                  this.moveToPhase(Phases.EXAMPLES_INTRO_7);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton, 100);
          }
          break;
        case Phases.EXAMPLES_INTRO_7:
          {
            const introMessagesBubble = examplesIntro3Messages.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Yes',
                callback: () => {
                  // todo: move to question or ilalagay pa ba yung replay
                  this.moveToPhase(Phases.EXAMPLES_QUESTION_INTRO);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton, 100);
          }
          break;

        case Phases.EXAMPLES_QUESTION_INTRO:
          {
            const messages: Message[] = [
              this.newBotMessage({
                text: "Now, let's look if you increase your level of comprehension with regards Addition and Subtraction of Dissimilar Fractions",
              }),
              this.newBotMessage({ text: 'Are you ready?' }),
            ];

            this.showMessages(messages, undefined, () =>
              this.moveToPhase(Phases.EXAMPLES_QUESTION),
            );
          }
          break;

        case Phases.EXAMPLES_QUESTION:
          {
            const expectationMessage = expectationMessages[randomNumber(0, 29)];
            const currentQuestion = this.getCurrentExamplesQuestion();
            const messages = [
              this.newBotMessage({ text: expectationMessage }),
              this.newBotMessage({ text: currentQuestion }),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.EXAMPLES_WRONG:
          {
            const currentIndex = this.stateService.currentExamplesQuestion();
            const correctAnswer = examplesQuestions[currentIndex].answers[0];
            const incorrectMessage = incorrectMessages[randomNumber(0, 29)];
            const solution = examplesQuestions[currentIndex].solutions;
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
        case Phases.EXAMPLES_CORRECT:
          {
            const correctMessage = correctMessages[randomNumber(0, 29)];
            const messages = [this.newBotMessage({ text: correctMessage })];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        case Phases.EXAMPLES_RESULT:
          {
            const total = examplesQuestions.length;
            const score =
              this.userService.getCurrentValue().categories['examples'];
            const messages: Message[] = [
              this.newBotMessage({
                text: 'Congratulations, you have finished the Examples category.',
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
        case Phases.MODELS_INTRO_1_BLOCK:
          {
            const introMessagesBubble = modelsIntro1Block.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Next',
                callback: () => {
                  this.moveToPhase(Phases.MODELS_INTRO_2_BLOCK);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton);
          }
          break;
        case Phases.MODELS_INTRO_2_BLOCK:
          {
            const introMessagesBubble = modelsIntro2Block.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Yes',
                callback: () => {
                  this.moveToPhase(Phases.MODELS_INTRO_3_BLOCK);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton);
          }
          break;
        case Phases.MODELS_INTRO_3_BLOCK:
          {
            const introMessagesBubble = modelsIntro3Block.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Next',
                callback: () => {
                  this.moveToPhase(Phases.MODELS_INTRO_4_BLOCK);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton);
          }
          break;
        case Phases.MODELS_INTRO_4_BLOCK:
          {
            const introMessagesBubble = modelsIntro4Block.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Yes',
                callback: () => {
                  this.moveToPhase(Phases.MODELS_INTRO_5_LINEAR);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton);
          }
          break;
        case Phases.MODELS_INTRO_5_LINEAR:
          {
            const introMessagesBubble = modelsIntro5Linear.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Next',
                callback: () => {
                  this.moveToPhase(Phases.MODELS_INTRO_6_LINEAR);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton);
          }
          break;
        case Phases.MODELS_INTRO_6_LINEAR:
          {
            const introMessagesBubble = modelsIntro6Linear.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Yes',
                callback: () => {
                  this.moveToPhase(Phases.MODELS_INTRO_7_LINEAR);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton);
          }
          break;
        case Phases.MODELS_INTRO_7_LINEAR:
          {
            const introMessagesBubble = modelsIntro7Linear.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Next',
                callback: () => {
                  this.moveToPhase(Phases.MODELS_INTRO_8_LINEAR);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton);
          }
          break;
        case Phases.MODELS_INTRO_8_LINEAR:
          {
            const introMessagesBubble = modelsIntro8Linear.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            const showButton = () => {
              this.actionsService.content.set({
                type: 'Button',
                label: 'Yes',
                callback: () => {
                  this.moveToPhase(Phases.MODELS_QUESTIONS_INTRO);
                  this.actionsService.content.set({ type: 'Input' });
                },
              });
            };
            this.showMessages(messages, undefined, showButton);
          }
          break;
        case Phases.MODELS_QUESTIONS_INTRO:
          {
            const introMessagesBubble = modelsQuestionsIntro.map((m) =>
              this.newBotMessage(m.content),
            );

            const messages: Message[] = [...introMessagesBubble];

            this.showMessages(messages, undefined, () =>
              this.moveToPhase(Phases.MODELS_QUESTION),
            );
          }
          break;
        case Phases.MODELS_QUESTION:
          {
            const expectationMessage = expectationMessages[randomNumber(0, 29)];
            const currentQuestion = this.getCurrentModelsQuestion();
            const messages = [
              this.newBotMessage({ text: expectationMessage }),
              this.newBotMessage({ text: currentQuestion }),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.MODELS_WRONG:
          {
            const currentIndex = this.stateService.currentModelsQuestion();
            const correctAnswer = modelsQuestions[currentIndex].answers[0];
            const incorrectMessage = incorrectMessages[randomNumber(0, 29)];
            const solution = modelsQuestions[currentIndex].solutions;
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
        case Phases.MODELS_CORRECT:
          {
            const correctMessage = correctMessages[randomNumber(0, 29)];
            const messages = [this.newBotMessage({ text: correctMessage })];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        case Phases.MODELS_RESULT:
          {
            const total = modelsQuestions.length;
            const score =
              this.userService.getCurrentValue().categories['models'];
            const messages: Message[] = [
              this.newBotMessage({
                text: 'Congratulations, you have finished the Models category.',
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
        case Phases.CATEGORIES_END_NO:
          {
            const messages: Message[] = [
              this.newBotMessage({
                text: 'You may also take a look on this gdrive to further improve your mastery level on addition and subtraction of dissimilar fractions',
              }),
              this.newBotMessage(
                {
                  text: 'https://drive.google.com/drive/folders/150Aq1vu-XJHfNWlHxRp4nR4HwnFKLpWh',
                },
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

        case Phases.POSTTEST_INTRO:
          {
            const messages: Message[] = [
              this.newBotMessage({
                text: 'In order assess your understanding of the topic, please proceed answering the post-test.',
              }),
            ];

            this.showMessages(messages, undefined, () =>
              this.moveToPhase(Phases.POSTTEST_QUESTION),
            );
          }
          break;
        case Phases.POSTTEST_QUESTION:
          {
            const expectationMessage = expectationMessages[randomNumber(0, 29)];
            const currentQuestion = this.getCurrentPostTestQuestion();
            const messages = [
              this.newBotMessage({ text: expectationMessage }),
              this.newBotMessage({ text: currentQuestion }),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.POSTTEST_WRONG:
          {
            const currentIndex = this.stateService.currentPostTestQuestion();
            const correctAnswer = postTestQuestions[currentIndex].answers[0];
            const incorrectMessage = incorrectMessages[randomNumber(0, 29)];
            const solution = postTestQuestions[currentIndex].solutions;
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
        case Phases.POSTTEST_CORRECT:
          {
            const correctMessage = correctMessages[randomNumber(0, 29)];
            const messages = [this.newBotMessage({ text: correctMessage })];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        case Phases.POSTTEST_RESULT:
          {
            const total = postTestQuestions.length;
            const score = this.userService.getCurrentValue().postTestScore;
            const messages: Message[] = [
              this.newBotMessage({
                text: 'Congratulations, you have finished the post-test.',
              }),
              this.newBotMessage({
                text: `Post-test result: ${
                  score === null ? 0 : score
                }/${total}`,
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
