import { Injectable, signal } from '@angular/core';
import { QuickReplyContent } from 'src/components/quick-replies.component';

// type Actions = 'Button' | 'Input' | 'QuickReply';
export type ButtonContent = {
  type: 'Button';
  label: string;
  callback: () => void;
};

type Actions = ButtonContent | QuickReplyContent | { type: 'Input', isDisabled?: boolean };

@Injectable({
  providedIn: 'root',
})
export class ActionsService {
  content = signal<Actions>({ type: 'Input' });
}
