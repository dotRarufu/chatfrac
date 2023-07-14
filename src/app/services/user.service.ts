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
    categories: {
      animals: null,
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

  getCurrentvalue() {
    return this.userDataSubject.getValue();
  }

  increasePreTestScore() {
    const old = this.getCurrentvalue();
    const newValue = {
      ...old,
      preTestScore: old.preTestScore === null ? 1 : old.preTestScore + 1,
    };

    this.set(newValue);
  }

  increaseCategoryScore(category: string) {
    const old = this.getCurrentvalue();
    const oldCategoryValue = old.categories[category];
    const newCategoryValue = {
      ...old,
      categories: {
        ...old.categories,
        [category]: oldCategoryValue === null ? 1 : oldCategoryValue + 1,
      },
    };

    console.log('old:', old);
    console.log('new:', newCategoryValue);

    this.set(newCategoryValue);
  }
}
