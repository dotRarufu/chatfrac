import { Component, Input } from '@angular/core';

@Component({
  selector: 'send-icon',
  standalone: true,
  template: `
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.0001 14.5L21.0001 3.5M10.0001 14.5L13.5001 21.5C13.5439 21.5957 13.6144 21.6769 13.703 21.7338C13.7917 21.7906 13.8948 21.8209 14.0001 21.8209C14.1054 21.8209 14.2085 21.7906 14.2971 21.7338C14.3858 21.6769 14.4562 21.5957 14.5001 21.5L21.0001 3.5M10.0001 14.5L3.00007 11C2.90433 10.9561 2.8232 10.8857 2.76632 10.7971C2.70944 10.7084 2.6792 10.6053 2.6792 10.5C2.6792 10.3947 2.70944 10.2916 2.76632 10.2029C2.8232 10.1143 2.90433 10.0439 3.00007 10L21.0001 3.5"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export default class SendIconComponent {}
