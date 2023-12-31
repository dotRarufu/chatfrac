import { Injectable, signal } from '@angular/core';

import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { CategoryRow, ResultRow } from '../types/collection';
import { UserService } from './user.service';
import UserData from '../types/UserData';
import {
  delay,
  forkJoin,
  from,
  map,
  mergeMap,
  retry,
  switchMap,
  tap,
} from 'rxjs';
import { StateService } from './state.service';
import { CATEGORIES, LocalStorageKeys } from '../data/programmedPhases';
import { client } from '../lib/supabase';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  readonly client = client;
  isSavingData = signal(false);

  constructor(private userService: UserService) {}

  save() {
    const categories = this.userService.getCurrentValue().categories;
    const categoryNames = Object.keys(categories);
    const categoryScores = categoryNames.map((c) => {
      return { name: c, score: categories[c] || 0 };
    });
    const { name, school, preTestScore, postTestScore } =
      this.userService.getCurrentValue();
    const id$ = this.insertRecord(
      name,
      school,
      preTestScore || 0,
      postTestScore || 0,
    );
    const res$ = id$.pipe(
      tap((_) => {
        this.isSavingData.set(true);
        console.log('saving data: true');
      }),
      switchMap((id) => this.insertCategory(id, categoryScores)),
      delay(5000),
      tap((_) => {
        this.isSavingData.set(false);
        console.log('saving data: false');
      }),
    );

    return res$;
  }

  private insertCategory(
    id: number,
    categories: { name: string; score: number }[],
  ) {
    const categoryData = categories.map((c) => ({
      name: c.name,
      score: c.score,
      result_id: id,
    }));

    const requests$ = categoryData.map((c) => {
      const res = from(this.client.from('category').insert(c));

      const res$ = res.pipe(
        map((r) => {
          if (r.error !== null)
            throw new Error('error inserrting category score');

          return r.statusText;
        }),
      );

      return res$;
    });

    const forked$ = forkJoin([...requests$]);

    return forked$;
  }

  private insertRecord(
    name: string,
    school: string,
    preTestScore: number,
    postTestScore: number,
  ) {
    const data = {
      name,
      school,
      post_test: postTestScore || 0,
      pre_test: preTestScore || 0,
    };

    const request$ = from(this.client.from('result').insert(data).select('id'));

    const res = request$.pipe(
      map((r) => {
        if (r.error !== null) throw new Error('error saving data');

        return r.data[0].id;
      }),
      retry(999),
    );

    return res;
  }
}
