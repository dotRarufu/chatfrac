import { Component, OnInit, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'src/app/services/message.service';
import { StepService } from 'src/app/services/step.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import showMessages from 'src/app/utils/showMessages';
import Phases from '../types/Phases';
import { Carousel, ChatBubble } from '../types/Message';

const DELAY = 2000; // can make this random, for a better effect

@Component({
  selector: 'show-message',
  standalone: true,
  imports: [CommonModule],
  template: `<div></div>`,
})
export default class ShowMessageComponent implements OnInit {
  constructor(
    private messageService: MessageService,
    private stepService: StepService,
    private userService: UserService,
    private router: Router
  ) {
    effect(() => {
      const step = this.stepService.current();

      switch (step) {
        case Phases.DEMOGRAPHICS_NAME: {
          const messages: ChatBubble[] = [
            {
              content: 'Hi, welcome to chatbot app',
              sender: 'bot',
              type: 'ChatBubble',
            },
            {
              content: 'What is your name?',
              sender: 'bot',
              type: 'ChatBubble',
            },
          ];

          showMessages(DELAY, messages, (message) =>
            this.messageService.add(message)
          );

          break;
        }
        case Phases.DEMOGRAPHICS_SCHOOL: {
          const messages: ChatBubble[] = [
            {
              content: `Cool, ${this.userService.getCurrentvalue().name}`,
              sender: 'bot',
              type: 'ChatBubble',
            },
            {
              content: 'Which school are you from?',
              sender: 'bot',
              type: 'ChatBubble',
            },
          ];

          showMessages(DELAY, messages, (message) =>
            this.messageService.add(message)
          );

          break;
        }
        case Phases.PRETEST_1:
          {
            const messages: ChatBubble[] = [
              {
                content: 'Okay',
                sender: 'bot',
                type: 'ChatBubble',
              },
              {
                content: 'Lets now move to pre-test',
                sender: 'bot',
                type: 'ChatBubble',
              },
              {
                content: 'First question',
                sender: 'bot',
                type: 'ChatBubble',
              },
              {
                content: 'What is the correct answer to this 1?',
                sender: 'bot',
                type: 'ChatBubble',
              },
            ];

            showMessages(DELAY, messages, (message) =>
              this.messageService.add(message)
            );
          }
          break;

        case Phases.PRETEST_1_WRONG:
          {
            const messages: ChatBubble[] = [
              {
                content:
                  'Pre-test: Wrong answer | Correct answer: a correct answer',
                sender: 'bot',
                type: 'ChatBubble',
              },
            ];

            showMessages(DELAY, messages, (message) => {
              this.messageService.add(message);
              this.stepService.update();
            });
          }
          break;
        case Phases.PRETEST_1_CORRECT:
          {
            const messages: ChatBubble[] = [
              {
                content: 'Pre-test: You got the correct answer',
                sender: 'bot',
                type: 'ChatBubble',
              },
            ];
            // * 1. Create object of either type ChatBubble, Carousel, ChatMenu

            showMessages(DELAY, messages, (message) => {
              this.messageService.add(message);
              this.stepService.update();
            });
          }
          break;
        case Phases.PRETEST_2:
          {
            const messages: ChatBubble[] = [
              {
                content: 'Next question',
                sender: 'bot',
                type: 'ChatBubble',
              },
              {
                content: 'What is the correct answer for this 2',
                sender: 'bot',
                type: 'ChatBubble',
              },
            ];

            showMessages(DELAY, messages, (message) =>
              this.messageService.add(message)
            );
          }
          break;
        case Phases.PRETEST_2_CORRECT:
          {
            const messages: ChatBubble[] = [
              {
                content: 'Pre-test: You got the correct answer 2',
                sender: 'bot',
                type: 'ChatBubble',
              },
            ];

            // todo: disable sending message when this is running, use the callback param
            showMessages(DELAY, messages, (message) => {
              this.messageService.add(message);
              this.stepService.update();
            });
          }
          break;
        case Phases.PRETEST_2_WRONG:
          {
            const messages: ChatBubble[] = [
              {
                content:
                  'Pre-test: Wrong answer | Correct answer: a correct answer 2',
                sender: 'bot',
                type: 'ChatBubble',
              },
            ];

            showMessages(DELAY, messages, (message) => {
              this.messageService.add(message);
              this.stepService.update();
            });
          }
          break;
        case Phases.PRETEST_RESULT:
          {
            const messages: ChatBubble[] = [
              {
                content: 'Congratulations, youve finished the pre-test',
                sender: 'bot',
                type: 'ChatBubble',
              },
              {
                content: `Pre-test result: ${
                  this.userService.getCurrentvalue().preTestScore
                }/2`,
                sender: 'bot',
                type: 'ChatBubble',
              },
            ];

            showMessages(DELAY, messages, (message) => {
              this.messageService.add(message);
            });

            setTimeout(() => {
              this.stepService.update();
            }, messages.length * DELAY);
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
                ],
                type: 'Carousel',
              },
            ];

            showMessages(DELAY, messages, (message) =>
              this.messageService.add(message)
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

  // ngOnInit(): void {
  //   this.stepService.current$
  //     .pipe(tap((s) => console.log('step:', s)))
  //     .subscribe({
  //       next: (step) => {
  //         // todo: turn the cases into constant, to not adjust numbers everytime
  //         switch (step) {
  //           case 1: {
  //             const messages = [
  //               'Hi, welcome to chatbot app',
  //               'What is your name?',
  //             ];

  //             const DELAY = 2000; // can make this random, for a better effect
  //             showMessages(DELAY, messages, (message) =>
  //               this.messageService.add(message)
  //             );

  //             this.stepService.increase();

  //             break;
  //           }
  //           case 2: {
  //             computed(() => {
  //               // filter user messages
  //               console.log('runs');
  //               const messages = this.messageService.messages();
  //               const userMessage = messages[messages.length - 1].content;
  //               const data = this.userService.getCurrentvalue();
  //               this.userService.set({ ...data, name: userMessage });
  //               this.stepService.increase();
  //             });

  //             break;
  //           }
  //           case 3: {
  //             const messages = ['Cool', 'Which school are you from?'];
  //             const DELAY = 2000;

  //             showMessages(DELAY, messages, (message) =>
  //               this.messageService.add(message)
  //             );

  //             computed(() => {
  //               const messages = this.messageService.messages();
  //               const userMessage = messages[messages.length - 1].content;
  //               const data = this.userService.getCurrentvalue();
  //               this.userService.set({ ...data, school: userMessage });

  //               this.stepService.increase();
  //             });
  //             break;
  //           }
  //           case 4: {
  //             const messages = ['Okay', 'Lets now move to pre-test'];
  //             const DELAY = 2000;

  //             showMessages(DELAY, messages, (message) =>
  //               this.messageService.add(message)
  //             );

  //             setTimeout(() => {
  //               this.stepService.increase();
  //               this.router.navigate([]);
  //             }, messages.length * DELAY);

  //             break;
  //           }

  //           default:
  //             break;
  //         }
  //       },
  //     });
  // }
}
// store message in messages
// while watching user's messages, now in the demographics, check if should move to next step
// increase current step
// while watching current step, run the next set of instructions
// when all is fulfilled, navigate to next part
