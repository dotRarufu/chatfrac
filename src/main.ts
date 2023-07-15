import { AppComponent } from './components/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { Routes, provideRouter } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app/pages/landing.component'),
  },
  {
    path: 'chat',
    loadComponent: () => import('./app/pages/chat.component'),
  },
  {
    path: 'download-result',
    loadComponent: () => import('./app/pages/result.component'),
  },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
}).catch((err) => console.error(err));
