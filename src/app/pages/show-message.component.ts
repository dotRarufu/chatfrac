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

const DELAY = 2000; // can make this random, for a better effect

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
    console.log('input is disabled');

    const mapFnWrapper = (message: ChatBubble) => {
      // runs every item
      this.messageService.add(message);
      mapFn && mapFn();
    };

    const lastFnWrapper = () => {
      console.log('input is enabled');
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
        case Phases.GREET: {
          const messages: ChatBubble[] = [
            this.newBotMessage(
              'Greetings, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad m',
            ),
          ];

          this.showMessages(messages, undefined, () => this.runLogicUpdate());

          break;
        }
        case Phases.DEMOGRAPHICS_NAME_1: {
          const messages: ChatBubble[] = [
            this.newBotMessage("What's your name"),
          ];

          this.showMessages(messages);

          break;
        }
        case Phases.DEMOGRAPHICS_NAME_2: {
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

          break;
        }
        case Phases.DEMOGRAPHICS_SCHOOL: {
          const messages: ChatBubble[] = [
            this.newBotMessage(
              `Cool, ${this.userService.getCurrentvalue().name}`,
            ),
            this.newBotMessage('Which school are you from?'),
          ];

          this.showMessages(messages);

          break;
        }
        case Phases.PRETEST_1:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Okay'),
              this.newBotMessage('Lets now move to pre-test'),
              this.newBotMessage('First question'),
              this.newBotMessage('What is the correct answer to this 1?'),
            ];

            this.showMessages(messages);
          }
          break;

        case Phases.PRETEST_1_WRONG:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage(
                'Pre-test: Wrong answer | Correct answer: a correct answer',
              ),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PRETEST_1_CORRECT:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Pre-test: You got the correct answer'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PRETEST_2:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Next question'),
              this.newBotMessage('What is the correct answer for this 2'),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.PRETEST_2_CORRECT:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Pre-test: You got the correct answer 2'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PRETEST_2_WRONG:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage(
                'Pre-test: Wrong answer | Correct answer: a correct answer 2',
              ),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PRETEST_RESULT:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage(
                'Congratulations, youve finished the pre-test',
              ),
              this.newBotMessage(
                `Pre-test result: ${
                  this.userService.getCurrentvalue().preTestScore
                }/2`,
              ),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.SELECT_CATEGORY_1:
          {
            const messages: Carousel[] = [
              {
                content: [
                  {
                    message: 'ABC',
                    image: '',
                    clickCallback: () => console.log('ABC!'),
                  },
                  {
                    message: '123',
                    image: '',
                    clickCallback: () => console.log('123!'),
                  },
                  {
                    message: '123',
                    image: '',
                    clickCallback: () => console.log('123!'),
                  },
                ],
                type: 'Carousel',
              },
            ];

            showMessages(DELAY, messages, (message) =>
              this.messageService.add(message),
            );
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
