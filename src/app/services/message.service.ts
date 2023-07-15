import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, filter, map } from 'rxjs';
import { Message } from '../types/Message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // isTyping = signal(false);

  private readonly isTypingSubject = new BehaviorSubject(false);
  isTyping$ = this.isTypingSubject.asObservable();

  messages = signal<Message[]>([]);

  constructor() {}

  add(data: Message) {
    const newMessages = [...this.messages(), data];
    this.messages.set(newMessages);
  }

  isTyping(s: boolean) {
    this.isTypingSubject.next(s);
  }
}
