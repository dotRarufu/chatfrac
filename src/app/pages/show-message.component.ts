import { Component, OnInit, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'src/app/services/message.service';
import { StepService } from 'src/app/services/step.service';
import { UserService } from 'src/app/services/user.service';
import showMessages from 'src/app/utils/showMessages';
import Phases from '../types/Phases';
import { Carousel, ChatBubble, Message } from '../types/Message';
import { StateService } from '../services/state.service';
import { ActionsService } from '../services/actions.service';
import ChatComponent from './chat.component';
import randomNumber from '../utils/randomNumber';
import { SupabaseService } from '../services/supabase.service';
import { from, map } from 'rxjs';

const DELAY = 2500; // can make this random, for a better effect

@Component({
  selector: 'show-message',
  standalone: true,
  imports: [CommonModule],
  template: `<div></div>`,
})
export class ShowMessageComponent implements OnInit {
  private newBotMessage(text: string, options?: { isLink: boolean }) {
    const res: ChatBubble = {
      content: text,
      sender: 'bot',
      type: 'ChatBubble',
      isLink: options?.isLink,
    };

    return res;
  }

  private showMessages(
    messages: Message[],
    mapFn?: () => void,
    lastly?: () => void,
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

    showMessages<Message>(DELAY, messages, mapFnWrapper, lastFnWrapper);
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
            console.log('asd:', noMoreCategories);
            console.log(
              'acats:',
              this.userService.getCurrentValue().categories,
            );
            if (noMoreCategories) {
              setTimeout(() => {
                this.moveToPhase(Phases.CATEGORIES_END_1);
              }, 100);

              break;
            }

            const messages: ChatBubble[] = [
              this.newBotMessage('Select a category.'),
            ];

            const showQuickReplies = () => {
              this.actionsService.content.set({
                type: 'QuickReply',
                items: [
                  {
                    label: 'Animals',
                    callback: () => this.moveToPhase(Phases.ANIMALS_INTRO),
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
                `Cool, ${this.userService.getCurrentValue().name}`,
              ),
              this.newBotMessage('Which school are you from?'),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.PRETEST_INTRO:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Thank you.'),
              this.newBotMessage(
                'In order to help you further, please proceed answering the pre-test.',
              ),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PRETEST_1:
          {
            const messages: ChatBubble[] = [
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
            const score = this.userService.getCurrentValue().preTestScore;
            const messages: ChatBubble[] = [
              this.newBotMessage(
                'Congratulations, you have finished the pre-test.',
              ),
              this.newBotMessage(
                `Pre-test result: ${score === null ? 0 : score}/2`,
              ),
              this.newBotMessage('You may now proceed to the next step.'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        case Phases.ANIMALS_INTRO:
          {
            // console.log('show-message| animals intro ');
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
            // console.log('show mesage  | animals 1');
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
              this.newBotMessage('Wrong'),
              this.newBotMessage('Its still a cat'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.ANIMALS_RESULT:
          {
            const score =
              this.userService.getCurrentValue().categories['animals'];

            const messages: ChatBubble[] = [
              this.newBotMessage(
                'Congratulations, you have finished the animals category.',
              ),
              this.newBotMessage(
                `Animals category result: ${score === null ? 0 : score}/2`,
              ),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        case Phases.PLACES_INTRO:
          {
            // console.log('show-message| animals intro ');
            const messages: ChatBubble[] = [
              this.newBotMessage('You selected places category.'),
              this.newBotMessage('This category is about places'),
            ];

            this.showMessages(messages, undefined, () =>
              this.moveToPhase(Phases.PLACES_1),
            );
          }
          break;
        case Phases.PLACES_1:
          {
            // console.log('show mesage  | animals 1');
            const messages: ChatBubble[] = [
              this.newBotMessage('Question 1'),
              this.newBotMessage('What is the capital of the Philippines? '),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.PLACES_1_CORRECT:
          {
            const messages: ChatBubble[] = [this.newBotMessage('Correct')];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PLACES_1_WRONG:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Wrong'),
              this.newBotMessage('Correct answer is Manila'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PLACES_2:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Question 2'),
              this.newBotMessage('What is the capital of Japan'),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.PLACES_2_CORRECT:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Correct'),
              this.newBotMessage('It is Tokyo'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PLACES_2_WRONG:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Wrong'),
              this.newBotMessage('Its Tokyo'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PLACES_RESULT:
          {
            const score =
              this.userService.getCurrentValue().categories['places'];

            const messages: ChatBubble[] = [
              this.newBotMessage(
                'Congratulations, you have finished the places category.',
              ),
              this.newBotMessage(
                `Places category result: ${score === null ? 0 : score}/2`,
              ),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        case Phases.NUMBERS_INTRO:
          {
            // console.log('show-message| animals intro ');
            const messages: ChatBubble[] = [
              this.newBotMessage('You selected numbers category.'),
              this.newBotMessage('This category is about numbers'),
            ];

            this.showMessages(messages, undefined, () =>
              this.moveToPhase(Phases.NUMBERS_1),
            );
          }
          break;
        case Phases.NUMBERS_1:
          {
            // console.log('show mesage  | animals 1');
            const messages: ChatBubble[] = [
              this.newBotMessage('Question 1'),
              this.newBotMessage('What is 1 x 1 '),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.NUMBERS_1_CORRECT:
          {
            const messages: ChatBubble[] = [this.newBotMessage('Correct')];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.NUMBERS_1_WRONG:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Wrong'),
              this.newBotMessage('Correct answer is 1'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.NUMBERS_2:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Question 2'),
              this.newBotMessage('What is 1 / 1'),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.NUMBERS_2_CORRECT:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Correct'),
              this.newBotMessage('It is 1'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.PLACES_2_WRONG:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Wrong'),
              this.newBotMessage('Its 1'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.NUMBERS_RESULT:
          {
            const score =
              this.userService.getCurrentValue().categories['numbers'];

            const messages: ChatBubble[] = [
              this.newBotMessage(
                'Congratulations, you have finished the numbers category.',
              ),
              this.newBotMessage(
                `Numbers category result: ${score === null ? 0 : score}/2`,
              ),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;

        case Phases.CHAT_END:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage(
                'You have answered all of the questions I have.',
              ),
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
            const messages: ChatBubble[] = [this.newBotMessage('Thank you.')];

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
              this.newBotMessage(
                'Job well done, you accomplished all the categories',
              ),
              this.newBotMessage('Do you still have any questions?'),
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
              this.newBotMessage(
                'You may also take a look on this gdrive to further improve your mastery level on addition and subtraction of dissimilar fractions',
              ),
              this.newBotMessage('https://gdrive.link.here', { isLink: true }),
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
            const messages: ChatBubble[] = [
              this.newBotMessage('Question 1:'),
              this.newBotMessage('1 + 1 = ?'),
            ];

            this.showMessages(messages);
          }
          break;

        case Phases.POSTTEST_INTRO:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('You will be answering post-test questions'),
              this.newBotMessage(
                'This is to gauge your understanding of the topic',
              ),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.POSTTEST_1_WRONG:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Wrong:'),
              this.newBotMessage('The correct answer is 2'),
              this.newBotMessage('Solution: 1 + 1 = 2'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.POSTTEST_1_CORRECT:
          {
            const messages: ChatBubble[] = [this.newBotMessage('Correct')];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.POSTTEST_2:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Question 2'),
              this.newBotMessage('2 + 2 = ?'),
            ];

            this.showMessages(messages);
          }
          break;
        case Phases.POSTTEST_2_CORRECT:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Correct'),
              this.newBotMessage('Because 2 + 2 is simply equals to 4'),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.POSTTEST_2_WRONG:
          {
            const messages: ChatBubble[] = [
              this.newBotMessage('Wrong ❌'),
              this.newBotMessage('Solution: 2 + 2 = 4 '),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.POSTTEST_RESULT:
          {
            const score = this.userService.getCurrentValue().postTestScore;

            const messages: ChatBubble[] = [
              this.newBotMessage(
                'Congratulations, you have finished the post-test.',
              ),
              this.newBotMessage(
                `Post-test result: ${score === null ? 0 : score}/2`,
              ),
            ];

            this.showMessages(messages, undefined, () => this.runLogicUpdate());
          }
          break;
        case Phases.NO_MORE:
          {
            this.getRandomQuote().subscribe({
              next: (quote) => {
                const messages: ChatBubble[] = [
                  this.newBotMessage(`${quote.text} - ${quote.author}`),
                ];

                this.showMessages(messages);
              },
              error: () => {
                const messages: ChatBubble[] = [
                  this.newBotMessage(
                    'You already answered all of the questions',
                  ),
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
