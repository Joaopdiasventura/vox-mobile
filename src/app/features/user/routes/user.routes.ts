import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'access',
    loadComponent: () =>
      import('../access/access-page/access-page.component').then(
        (m) => m.AccessPageComponent
      ),
  },
  {
    path: 'access/validate/:token',
    loadComponent: () =>
      import('../access/validate/validate-page/validate-page.component').then(
        (m) => m.ValidatePageComponent
      ),
  },
  {
    path: 'validate-account/:email',
    loadComponent: () =>
      import('../account/validation-page/validation-page.component').then(
        (m) => m.ValidationPageComponent
      ),
  },
];
