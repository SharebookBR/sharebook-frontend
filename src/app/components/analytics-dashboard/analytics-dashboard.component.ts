import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
import { environment } from '../../../environments/environment';

Chart.register(...registerables);

interface WeeklyPoint { label: string; value: number; }
interface BookMetric { path: string; title: string; count: number; }
interface DashboardData {
  sessions: WeeklyPoint[];
  downloads: WeeklyPoint[];
  totalDownloads: number;
  totalLogins: number;
  totalSignups: number;
  topBooksByViews: BookMetric[];
  topBooksByDownloads: BookMetric[];
  topBooksByViewsPerWeek: Record<string, BookMetric[]>;
  topBooksByDownloadsPerWeek: Record<string, BookMetric[]>;
}

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartSessions') chartSessionsRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartDownloads') chartDownloadsRef: ElementRef<HTMLCanvasElement>;

  data: DashboardData | null = null;
  loading = true;
  error = false;
  selectedWeek = '';

  private chartSessions: Chart | null = null;
  private chartDownloads: Chart | null = null;
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
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.chartSessions?.destroy();
    this.chartDownloads?.destroy();
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

  get weekOptions(): string[] {
    return [...this.allLabels].reverse();
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

    const labels = this.allLabels;
    const current = this.selectedWeek;

    const bgS = labels.map(l => l === current ? this.ORANGE : this.BLUE);
    const bgD = labels.map(l => l === current ? this.ORANGE_DL : this.BLUE_DL);
    const brS = labels.map(l => l === current ? this.BORDER_OR : this.BORDER);

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
        labels,
        datasets: [{
          data: labels.map(l => this.sessionsMap[l] ?? 0),
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
        labels,
        datasets: [{
          data: labels.map(l => this.downloadsMap[l] ?? 0),
          backgroundColor: bgD,
          borderColor: brS,
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: opts
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
