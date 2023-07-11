import { AppComponent } from './components/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { Routes, provideRouter } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full',
  },
  {
    path: 'chat',
    loadComponent: () => import('./app/pages/show-message.component'),
  },
  // {
  //   path: 'pre-test',
  //   loadComponent: () => import('../app/pages/pre-test.component'),
  // },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
}).catch((err) => console.error(err));
