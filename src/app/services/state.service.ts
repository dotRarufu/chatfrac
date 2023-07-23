import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, filter, map } from 'rxjs';
import { Message } from '../types/Message';

type State<T> = {
  [key: string]: T;
};

@Injectable({
  providedIn: 'root',
})
export class StateService {
  string = signal<State<string>>({});
  number = signal<State<number>>({});
  boolean = signal<State<boolean>>({});
  private readonly isChatInputDisabledSubject = new BehaviorSubject<boolean>(
    false,
  );
  isChatInputDisabled$ = this.isChatInputDisabledSubject.asObservable();
  currentPreTestQuestion = signal(0);
  currentDefinitionQuestion = signal(0);
  currentExamplesQuestion = signal(0);
  // .pipe(map((s) => (s === null ? false : s)));

  constructor() {}

  setIsChatInputDisabled(s: boolean) {
    this.isChatInputDisabledSubject.next(s);
  }
  // addState(key: string) {
  //   s
  // }
}
