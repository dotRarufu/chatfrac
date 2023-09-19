import { Component } from '@angular/core';

@Component({
  selector: 'fraction-icon',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="m5.79 21.61l-1.58-1.22l14-18l1.58 1.22l-14 18M4 2v2h2v8h2V2H4m11 10v2h4v2h-2c-1.1 0-2 .9-2 2v4h6v-2h-4v-2h2c1.11 0 2-.89 2-2v-2a2 2 0 0 0-2-2h-4Z"
      />
    </svg>
  `,
})
export default class FractionIconComponent {}
