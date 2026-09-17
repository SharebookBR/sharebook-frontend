import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
import { environment } from '../../../environments/environment';

Chart.register(...registerables);

interface WeeklyPoint { label: string; value: number; }
interface BookMetric { path: string; title: string; count: number; }
interface EventMetric { eventName: string; count: number; users: number; }
interface SearchTermMetric { term: string; count: number; users: number; }
interface SearchDeviceMetric { device: string; count: number; users: number; }
interface SearchAnalytics {
  totalSearches: number;
  users: number;
  distinctTerms: number;
  topTerms: SearchTermMetric[];
  devices: SearchDeviceMetric[];
}
interface SearchConsoleMetricSummary {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}
interface SearchConsoleDailyMetric {
  date: string;
  clicks: number;
  impressions: number;
}
interface SearchConsoleOpportunity extends SearchConsoleMetricSummary {
  query: string;
  page: string;
}
interface SearchConsoleAnalytics {
  available: boolean;
  startDate: string;
  endDate: string;
  current: SearchConsoleMetricSummary;
  previous: SearchConsoleMetricSummary;
  daily: SearchConsoleDailyMetric[];
  opportunities: SearchConsoleOpportunity[];
}
interface DashboardData {
  sessions: WeeklyPoint[];
  downloads: WeeklyPoint[];
  totalDownloads: number;
  totalLogins: number;
  totalSignups: number;
  logins: WeeklyPoint[];
  signups: WeeklyPoint[];
  topBooksByViews: BookMetric[];
  topBooksByDownloads: BookMetric[];
  topBooksByViewsPerWeek: Record<string, BookMetric[]>;
  topBooksByDownloadsPerWeek: Record<string, BookMetric[]>;
  eventSummary: EventMetric[];
  eventSummaryPerWeek: Record<string, EventMetric[]>;
  searchAnalytics: SearchAnalytics;
  searchConsole?: SearchConsoleAnalytics;
}

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartSessions') chartSessionsRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartDownloads') chartDownloadsRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartOrganic') chartOrganicRef: ElementRef<HTMLCanvasElement>;

  data: DashboardData | null = null;
  loading = true;
  error = false;
  selectedWeek = '';

  private chartSessions: Chart | null = null;
  private chartDownloads: Chart | null = null;
  private chartOrganic: Chart | null = null;
  private destroy$ = new Subject<void>();

  readonly BLUE = 'rgba(41,171,226,0.7)';
  readonly BLUE_DIM = 'rgba(41,171,226,0.2)';
  readonly BLUE_DL = 'rgba(41,171,226,0.35)';
  readonly BLUE_DIM2 = 'rgba(41,171,226,0.1)';
  readonly ORANGE = 'rgba(255,165,0,0.8)';
  readonly ORANGE_DL = 'rgba(255,165,0,0.5)';
  readonly BORDER = '#29abe2';
  readonly BORDER_OR = '#f0a000';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<DashboardData>(`${environment.apiEndpoint}/analytics/dashboard`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.data = data;
          this.loading = false;
          this.selectedWeek = this.currentWeekLabel();
        },
        error: () => {
          this.loading = false;
          this.error = true;
        }
      });
  }

  ngAfterViewInit() {}

  ngAfterViewChecked() {
    if (this.data && !this.chartSessions) {
      this.buildCharts();
    }
    if (this.searchConsole.available && !this.chartOrganic) {
      this.buildOrganicChart();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.chartSessions?.destroy();
    this.chartDownloads?.destroy();
    this.chartOrganic?.destroy();
  }

  get allLabels(): string[] {
    if (!this.data) return [];
    const s = new Set([
      ...this.data.sessions.map(x => x.label),
      ...this.data.downloads.map(x => x.label)
    ]);
    return Array.from(s).sort();
  }

  get sessionsMap(): Record<string, number> {
    return (this.data?.sessions ?? []).reduce((acc, x) => { acc[x.label] = x.value; return acc; }, {} as Record<string, number>);
  }

  get downloadsMap(): Record<string, number> {
    return (this.data?.downloads ?? []).reduce((acc, x) => { acc[x.label] = x.value; return acc; }, {} as Record<string, number>);
  }

  get totalSessions(): number {
    return this.data?.sessions.reduce((s, x) => s + x.value, 0) ?? 0;
  }

  get kpiSessions(): number {
    if (!this.selectedWeek || this.selectedWeek === 'all') return this.totalSessions;
    return this.sessionsMap[this.selectedWeek] ?? 0;
  }

  get kpiDownloads(): number {
    if (!this.selectedWeek || this.selectedWeek === 'all') return this.data?.totalDownloads ?? 0;
    return this.downloadsMap[this.selectedWeek] ?? 0;
  }

  get loginsMap(): Record<string, number> {
    return (this.data?.logins ?? []).reduce((acc, x) => { acc[x.label] = x.value; return acc; }, {} as Record<string, number>);
  }

  get signupsMap(): Record<string, number> {
    return (this.data?.signups ?? []).reduce((acc, x) => { acc[x.label] = x.value; return acc; }, {} as Record<string, number>);
  }

  get kpiLogins(): number {
    if (!this.selectedWeek || this.selectedWeek === 'all') return this.data?.totalLogins ?? 0;
    return this.loginsMap[this.selectedWeek] ?? 0;
  }

  get kpiSignups(): number {
    if (!this.selectedWeek || this.selectedWeek === 'all') return this.data?.totalSignups ?? 0;
    return this.signupsMap[this.selectedWeek] ?? 0;
  }

  get weekOptions(): string[] {
    return [...this.allLabels].reverse();
  }

  isoToFriendly(label: string): string {
    const [yearStr, weekStr] = label.split('-W');
    const year = parseInt(yearStr, 10);
    const week = parseInt(weekStr, 10);
    // Monday of ISO week
    const jan4 = new Date(year, 0, 4);
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (week - 1) * 7);
    const weekInMonth = Math.floor((monday.getDate() - 1) / 7) + 1;
    const month = String(monday.getMonth() + 1).padStart(2, '0');
    return `${monday.getFullYear()}-${month}-W${weekInMonth}`;
  }

  get currentTopViews(): BookMetric[] {
    if (!this.data) return [];
    if (!this.selectedWeek || this.selectedWeek === 'all') return this.data.topBooksByViews;
    return this.data.topBooksByViewsPerWeek[this.selectedWeek] ?? [];
  }

  get currentTopDownloads(): BookMetric[] {
    if (!this.data) return [];
    if (!this.selectedWeek || this.selectedWeek === 'all') return this.data.topBooksByDownloads;
    return this.data.topBooksByDownloadsPerWeek[this.selectedWeek] ?? [];
  }

  private eventCount(name: string): number {
    return this.currentEventSummary.find(e => e.eventName === name)?.count ?? 0;
  }

  get funnelShare(): { open: number; shared: number; rate: string } {
    const open = this.eventCount('share_modal_open');
    const shared = this.eventCount('social_share');
    return { open, shared, rate: open > 0 ? ((shared / open) * 100).toFixed(0) + '%' : '—' };
  }

  get funnelRequest(): { open: number; success: number; rate: string } {
    const open = this.eventCount('book_request_modal_open');
    const success = this.eventCount('book_request_success');
    return { open, success, rate: open > 0 ? ((success / open) * 100).toFixed(0) + '%' : '—' };
  }

  get currentEventSummary(): EventMetric[] {
    if (!this.data) return [];
    if (!this.selectedWeek || this.selectedWeek === 'all') return this.data.eventSummary ?? [];
    return this.data.eventSummaryPerWeek?.[this.selectedWeek] ?? [];
  }

  get searchAnalytics(): SearchAnalytics {
    return this.data?.searchAnalytics ?? {
      totalSearches: 0,
      users: 0,
      distinctTerms: 0,
      topTerms: [],
      devices: []
    };
  }

  get searchConsole(): SearchConsoleAnalytics {
    return this.data?.searchConsole ?? {
      available: false,
      startDate: '',
      endDate: '',
      current: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
      previous: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
      daily: [],
      opportunities: []
    };
  }

  metricChange(current: number, previous: number): string {
    if (previous === 0) return current === 0 ? 'sem variação' : 'novo no período';
    const change = ((current - previous) / previous) * 100;
    const prefix = change > 0 ? '+' : '';
    return `${prefix}${change.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}% vs período anterior`;
  }

  ctrChange(): string {
    const change = (this.searchConsole.current.ctr - this.searchConsole.previous.ctr) * 100;
    const prefix = change > 0 ? '+' : '';
    return `${prefix}${change.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} p.p. vs período anterior`;
  }

  positionChange(): string {
    const current = this.searchConsole.current.position;
    const previous = this.searchConsole.previous.position;
    if (previous === 0 || current === previous) return 'sem variação relevante';
    const difference = Math.abs(current - previous).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return current < previous
      ? `${difference} posições acima`
      : `${difference} posições abaixo`;
  }

  formatIsoDate(value: string): string {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }

  opportunityPageLabel(page: string): string {
    const path = page.replace(/^https?:\/\/[^/]+/i, '').replace(/\/$/, '');
    const slug = path.split('/').filter(Boolean).pop();
    if (!slug) return page;
    return decodeURIComponent(slug).replace(/-/g, ' ');
  }

  get searchesPerDay(): number {
    return this.searchAnalytics.totalSearches / 30;
  }

  get searchesPerUser(): number {
    return this.searchAnalytics.users > 0
      ? this.searchAnalytics.totalSearches / this.searchAnalytics.users
      : 0;
  }

  get desktopSearches(): SearchDeviceMetric | undefined {
    return this.searchAnalytics.devices.find(device => device.device === 'desktop');
  }

  deviceShare(device: SearchDeviceMetric): number {
    return this.searchAnalytics.totalSearches > 0
      ? (device.count / this.searchAnalytics.totalSearches) * 100
      : 0;
  }

  deviceLabel(device: string): string {
    const labels: Record<string, string> = {
      desktop: 'Computador',
      mobile: 'Celular',
      tablet: 'Tablet'
    };
    return labels[device] ?? device;
  }

  get baseUrl(): string {
    return 'https://sharebook.com.br';
  }

  currentWeekLabel(): string {
    const now = new Date();
    const jan4 = new Date(now.getFullYear(), 0, 4);
    const startOfWeek1 = new Date(jan4);
    startOfWeek1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
    const diff = now.getTime() - startOfWeek1.getTime();
    const week = Math.floor(diff / (7 * 86400000)) + 1;
    return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
  }

  onWeekChange(week: string) {
    this.selectedWeek = week;
    this.updateCharts();
  }

  private buildCharts() {
    if (!this.chartSessionsRef?.nativeElement || !this.chartDownloadsRef?.nativeElement) return;

    const isoLabels = this.allLabels;
    const friendlyLabels = isoLabels.map(l => this.isoToFriendly(l));
    const current = this.selectedWeek;

    const bgS = isoLabels.map(l => l === current ? this.ORANGE : this.BLUE);
    const bgD = isoLabels.map(l => l === current ? this.ORANGE_DL : this.BLUE_DL);
    const brS = isoLabels.map(l => l === current ? this.BORDER_OR : this.BORDER);

    const opts: any = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { font: { size: 10 }, maxRotation: 45 }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { font: { size: 10 } }, grid: { color: '#f0f0f0' } }
      }
    };

    this.chartSessions = new Chart(this.chartSessionsRef.nativeElement, {
      type: 'bar',
      data: {
        labels: friendlyLabels,
        datasets: [{
          data: isoLabels.map(l => this.sessionsMap[l] ?? 0),
          backgroundColor: bgS,
          borderColor: brS,
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: opts
    });

    this.chartDownloads = new Chart(this.chartDownloadsRef.nativeElement, {
      type: 'bar',
      data: {
        labels: friendlyLabels,
        datasets: [{
          data: isoLabels.map(l => this.downloadsMap[l] ?? 0),
          backgroundColor: bgD,
          borderColor: brS,
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: opts
    });
  }

  private buildOrganicChart() {
    if (!this.chartOrganicRef?.nativeElement || this.searchConsole.daily.length === 0) return;

    const labels = this.searchConsole.daily.map(point => {
      const [, month, day] = point.date.split('-');
      return `${day}/${month}`;
    });

    this.chartOrganic = new Chart(this.chartOrganicRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Cliques',
            data: this.searchConsole.daily.map(point => point.clicks),
            borderColor: this.BORDER,
            backgroundColor: this.BLUE_DIM,
            borderWidth: 2,
            pointRadius: 2,
            tension: 0.25,
            yAxisID: 'clicks'
          },
          {
            label: 'Impressões',
            data: this.searchConsole.daily.map(point => point.impressions),
            borderColor: this.BORDER_OR,
            backgroundColor: this.ORANGE_DL,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.25,
            yAxisID: 'impressions'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 10, usePointStyle: true }
          }
        },
        scales: {
          x: { ticks: { maxTicksLimit: 7, font: { size: 10 } }, grid: { display: false } },
          clicks: {
            beginAtZero: true,
            position: 'left',
            ticks: { precision: 0, font: { size: 10 } },
            grid: { color: '#f0f0f0' }
          },
          impressions: {
            beginAtZero: true,
            position: 'right',
            ticks: { precision: 0, font: { size: 10 } },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }

  private updateCharts() {
    if (!this.chartSessions || !this.chartDownloads) return;
    const labels = this.allLabels;
    const current = this.selectedWeek;

    const bgS = labels.map(l => current === 'all' ? this.BLUE : (l === current ? this.ORANGE : this.BLUE_DIM));
    const bgD = labels.map(l => current === 'all' ? this.BLUE_DL : (l === current ? this.ORANGE_DL : this.BLUE_DIM2));
    const brS = labels.map(l => current === 'all' ? this.BORDER : (l === current ? this.BORDER_OR : this.BORDER));

    this.chartSessions.data.datasets[0].backgroundColor = bgS;
    this.chartSessions.data.datasets[0].borderColor = brS;
    this.chartSessions.update();

    this.chartDownloads.data.datasets[0].backgroundColor = bgD;
    this.chartDownloads.data.datasets[0].borderColor = brS;
    this.chartDownloads.update();
  }
}
