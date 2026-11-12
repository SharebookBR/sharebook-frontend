import { Routes } from '@angular/router';

/**
 * Rotas da área de análises, montadas em `/admin/analises` (ver app-routing.module.ts).
 *
 *   /admin/analises               → hub com os painéis
 *   /admin/analises/visao-geral   → audiência, busca, SEO e catálogo
 *   /admin/analises/downloads     → volume, limites e comportamento de downloads
 *   /admin/analises/onboarding    → jornadas de e-mail de boas-vindas
 */
export const ANALISES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./analises-hub/analises-hub.component').then((m) => m.AnalisesHubComponent),
  },
  {
    path: 'visao-geral',
    loadComponent: () =>
      import('./visao-geral/analise-visao-geral.component').then((m) => m.AnaliseVisaoGeralComponent),
  },
  {
    path: 'downloads',
    loadComponent: () =>
      import('./downloads/analise-downloads.component').then((m) => m.AnaliseDownloadsComponent),
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./onboarding/analise-onboarding.component').then((m) => m.AnaliseOnboardingComponent),
  },
];
