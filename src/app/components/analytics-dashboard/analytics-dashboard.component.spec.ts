import { HttpClient } from '@angular/common/http';
import { AnalyticsDashboardComponent } from './analytics-dashboard.component';

describe('AnalyticsDashboardComponent', () => {
  let component: AnalyticsDashboardComponent;

  beforeEach(() => {
    component = new AnalyticsDashboardComponent({} as HttpClient);
  });

  it('formats period comparisons without implying a verdict', () => {
    expect(component.metricChange(1167, 981)).toBe('+19% vs período anterior');
    expect(component.metricChange(0, 0)).toBe('sem variação');
  });

  it('describes average position changes in search language', () => {
    component.data = {
      searchConsole: {
        available: true,
        startDate: '2026-07-27',
        endDate: '2026-08-23',
        current: { clicks: 1167, impressions: 24103, ctr: 0.0484, position: 9.11 },
        previous: { clicks: 981, impressions: 25785, ctr: 0.038, position: 5.04 },
        daily: [],
        opportunities: []
      }
    } as any;

    expect(component.ctrChange()).toBe('+1,04 p.p. vs período anterior');
    expect(component.positionChange()).toBe('4,07 posições abaixo');
  });

  it('turns a landing page URL into a short readable label', () => {
    expect(component.opportunityPageLabel(
      'https://www.sharebook.com.br/livros/a-volta-ao-mundo-em-80-dias'
    )).toBe('a volta ao mundo em 80 dias');
  });
});
