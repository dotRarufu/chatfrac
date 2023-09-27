import { Observable, Observer, fromEvent, map, merge } from 'rxjs';

const createOnline$ = () => {
  return merge(
    fromEvent(window, 'offline').pipe(map(() => false)),
    fromEvent(window, 'online').pipe(map(() => true)),
    new Observable((sub: Observer<boolean>) => {
      sub.next(navigator.onLine);
      sub.complete();
    }),
  );
};

export default createOnline$;
