import { Route } from '@angular/router';

import { HomeComponent } from './home-old.component';

export const HOME_ROUTE: Route = {
  path: 'home',
  component: HomeComponent,
  data: {
    pageTitle: 'home.title',
  },
};
