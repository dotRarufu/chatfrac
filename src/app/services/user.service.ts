import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import UserData from '../types/UserData';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userDataSubject = new BehaviorSubject<UserData>({
    name: '',
    school: '',
    categories: {
      definition: null,
      places: null,
      numbers: null,
    },
    preTestScore: null,
    postTestScore: null,
  });
  userData$ = this.userDataSubject.asObservable();

  constructor() {}

  set(data: UserData) {
    this.userDataSubject.next(data);
  }

  getCurrentValue() {
    return this.userDataSubject.getValue();
  }

  increasePreTestScore() {
    const old = this.getCurrentValue();
    const newValue = {
      ...old,
      preTestScore: old.preTestScore === null ? 1 : old.preTestScore + 1,
    };

    this.set(newValue);
  }

  increasePostTestScore() {
    const old = this.getCurrentValue();
    const newValue = {
      ...old,
      postTestScore: old.postTestScore === null ? 1 : old.postTestScore + 1,
    };

    this.set(newValue);
  }

  increaseCategoryScore(category: string) {
    const old = this.getCurrentValue();
    const oldCategoryValue = old.categories[category];
    const newCategoryValue = {
      ...old,
      categories: {
        ...old.categories,
        [category]: oldCategoryValue === null ? 1 : oldCategoryValue + 1,
      },
    };

    this.set(newCategoryValue);
  }
}
