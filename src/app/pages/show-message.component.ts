import { Component, OnInit, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'src/app/services/message.service';
import { StepService } from 'src/app/services/step.service';
import { UserService } from 'src/app/services/user.service';
import showMessages from 'src/app/utils/showMessages';
import Phases from '../types/Phases';
import { Carousel, ChatBubble } from '../types/Message';
import { StateService } from '../services/state.service';
import { ActionsService } from '../services/actions.service';

// const messages: Carousel[] = [
//   {
//     content: [
//       {
//         message: 'ABC',
//         image: '',
//         clickCallback: () => console.log('ABC!'),
//       },
//       {
//         message: '123',
//         image: '',
//         clickCallback: () => console.log('123!'),
//       },
//       {
//         message: '123',
//         image: '',
//         clickCallback: () => console.log('123!'),
//       },
//     ],
//     type: 'Carousel',
//   },
// ];

const DELAY = 500; // can make this random, for a better effect

@Component({
  selector: 'show-message',
  standalone: true,
  imports: [CommonModule],
  template: `<div></div>`,
})
export default class ShowMessageComponent implements OnInit {
  private newBotMessage(text: string) {
    const res: ChatBubble = {
      content: text,
      sender: 'bot',
      type: 'ChatBubble',
    };

    return res;
  }

  private showMessages(
    messages: ChatBubble[],
    mapFn?: () => void,
    lastly?: () => void,
  ) {
    this.stateService.setIsChatInputDisabled(true);
    // console.log('input is disabled');

    const mapFnWrapper = (message: ChatBubble) => {
      // runs every item
      this.messageService.add(message);
      mapFn && mapFn();
    };

    const lastFnWrapper = () => {
      // console.log('input is enabled');
      this.stateService.setIsChatInputDisabled(false);
      lastly && lastly();
    };

    showMessages(DELAY, messages, mapFnWrapper, lastFnWrapper);
  }

  private runLogicUpdate() {
    this.stepService.update();
  }

  private newUserMessage(message: string) {
    const data: ChatBubble = {
      content: message,
      sender: 'user',
      type: 'ChatBubble',
    };

    this.messageService.add(data);
  }

  private moveToPhase(p: Phases) {
    this.stepService.current.set(p);
    // console.log('show message | move to:', p);
  }

  constructor(
    private messageService: MessageService,
    private stepService: StepService,
    private userService: UserService,
    private stateService: StateService,
    private actionsService: ActionsService,
  ) {
    effect(() => {
      const step = this.stepService.current();

      switch (step) {
        case Phases.SELECT_CATEGORY_1:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Select a category.'),
            ];

            const showQuickReplies = () => {
              this.actionsService.content.set({
                type: 'QuickReply',
                items: [
                  {
                    label: 'Animals',
                    callback: () => {
                      this.moveToPhase(Phases.ANIMALS_INTRO);
                      console.log('quick reply | select animals category');
                    },
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
            const messages: ChatBubble[] = [
              this.newBotMessage('You already finished this category'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.GREET:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage(
                'Greetings, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad m',
              ),
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
            const messages: ChatBubble[] = [
              this.newBotMessage("What's your name"),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.DEMOGRAPHICS_NAME_2:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage(
                `Your name is ${
                  this.stateService.string()['name']
                }, is that right?`,
              ),
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
            const messages: ChatBubble[] = [
              this.newBotMessage(
                `Cool, ${this.userService.getCurrentvalue().name}`,
              ),
              this.newBotMessage('Which school are you from?'),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.PRETEST_1:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Thank you.'),
              this.newBotMessage(
                'In order to help you further, please proceed answering the pre-test.',
              ),
              this.newBotMessage('Question 1:'),
              this.newBotMessage('1 + 1 = ?'),
            ];

            this.showMessages(messages);
          }
          break;

        case Phases.PRETEST_1_WRONG:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Wrong:'),
              this.newBotMessage('The correct answer is 2'),
              this.newBotMessage('Solution: 1 + 1 = 2'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PRETEST_1_CORRECT:
          {
            const messages: ChatBubble[] = [this.newBotMessage('Correct')];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PRETEST_2:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Question 2'),
              this.newBotMessage('2 + 2 = ?'),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.PRETEST_2_CORRECT:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Correct'),
              this.newBotMessage('Because 2 + 2 is simply equals to 4'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PRETEST_2_WRONG:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Wrong ❌'),
              this.newBotMessage('Solution: 2 + 2 = 4 '),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PRETEST_RESULT:
          {
            const score = this.userService.getCurrentvalue().preTestScore;
            const messages: ChatBubble[] = [
              this.newBotMessage(
                'Congratulations, you have finished the pre-test.',
              ),
              this.newBotMessage(
                `Pre-test result: ${score === -1 ? 0 : score}/2`,
              ),
              this.newBotMessage('You may now proceed to the next step.'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        case Phases.ANIMALS_INTRO:
          {
            console.log('show-message| animals intro ');
            const messages: ChatBubble[] = [
              this.newBotMessage('You selected animals category.'),
              this.newBotMessage('This category is about animals'),
            ];

            this.showMessages(messages, undefined, () =>
              this.moveToPhase(Phases.ANIMALS_1),
            );
          }
          break;
        case Phases.ANIMALS_1:
          {
            console.log('show mesage  | animals 1');
            const messages: ChatBubble[] = [
              this.newBotMessage('Question 1'),
              this.newBotMessage(
                'What is a small domesticated carnivorous mammal with soft fur, a short snout, and retractable claws',
              ),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.ANIMALS_1_CORRECT:
          {
            const messages: ChatBubble[] = [this.newBotMessage('Correct')];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.ANIMALS_1_WRONG:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Wrong'),
              this.newBotMessage('Correct answer is cat'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.ANIMALS_2:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Question 2'),
              this.newBotMessage(
                'What is a widely kept as a pet or for catching mice, and many breeds have been developed',
              ),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.ANIMALS_2_CORRECT:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Correct'),
              this.newBotMessage('It is a cat'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.ANIMALS_2_WRONG:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Correct'),
              this.newBotMessage('Its still a cat'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.ANIMALS_RESULT:
          {
            const score =
              this.userService.getCurrentvalue().categories['animals'];

            const messages: ChatBubble[] = [
              this.newBotMessage(
                'Congratulations, you have the animals category.',
              ),
              this.newBotMessage(
                `Animals category result: ${score === -1 ? 0 : score}/2`,
              ),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        default:
          break;
      }
    });

    // this.stepService.increase();
  }

  ngOnInit(): void {}
}
