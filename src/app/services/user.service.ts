import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import UserData from '../types/UserData';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userDataSubject = new BehaviorSubject<UserData>({
    name: 'default name',
    school: 'default school',
    preTestScore: 0,
    postTestScore: 0,
  });
  userData$ = this.userDataSubject.asObservable();

  constructor() {}

  set(data: UserData) {
    this.userDataSubject.next(data);
  }

  getCurrentvalue() {
    return this.userDataSubject.getValue();
  }

  increasePreTestScore() {
    const old = this.getCurrentvalue();
    this.set({ ...old, preTestScore: old.preTestScore + 1 });
  }
}
