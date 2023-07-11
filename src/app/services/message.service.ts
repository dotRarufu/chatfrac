import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, filter, map } from 'rxjs';
import { Message } from '../types/Message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // private readonly messagesSubject = new BehaviorSubject<Message[]>([]);
  // messages$ = this.messagesSubject.asObservable();
  // userMessages$ = this.messages$.pipe(
  //   map((messages) => messages.filter((m) => m.sender === 'user')),
  //   filter((messages) => messages.length > 0)
  // );

  messages = signal<Message[]>([]);

  constructor() {}

  // add(data: Message) {
  //   const newMessages = [...this.messagesSubject.getValue(), data];
  //   this.messagesSubject.next(newMessages);
  // }
  add(data: Message) {
    const newMessages = [...this.messages(), data];
    this.messages.set(newMessages);
  }
}
