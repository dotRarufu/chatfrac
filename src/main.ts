import { AppComponent } from './components/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { Routes, provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app/pages/landing.component'),
  },
  {
    path: 'chat',
    loadComponent: () => import('./app/pages/chat.component'),
  },
  // {
  //   path: 'download-result',
  //   loadComponent: () => import('./app/pages/result.component'),
  // },
  {
    path: 'refactor',
    loadComponent: () => import('./app/pages/refactor.component'),
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
}).catch((err) => console.error(err));
