import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
import { environment } from '../../../environments/environment';

Chart.register(...registerables);

interface DownloadLogsSummaryPoint {
  day: string;
  allowed: number;
  blockedThrottle: number;
  blockedDailyLimit: number;
}

interface DownloadLogEvent {
  timestamp: string;
  ip: string;
  outcome: string;
  slug: string;
  title: string;
}

interface PagedDownloadLogEvents {
  page: number;
  pageSize: number;
  totalItems: number;
  items: DownloadLogEvent[];
}

@Component({
  selector: 'app-download-logs-dashboard',
  templateUrl: './download-logs-dashboard.component.html',
  styleUrls: ['./download-logs-dashboard.component.css']
})
export class DownloadLogsDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('chartDownloads') chartRef: ElementRef<HTMLCanvasElement>;

  from = '';
  to = '';

  summary: DownloadLogsSummaryPoint[] = [];
  paged: PagedDownloadLogEvents | null = null;

  loading = true;
  error = false;

  currentPage = 1;
  pageSize = 100;
  readonly pageSizeOptions = [100, 250, 500, 1000];

  private chart: Chart | null = null;
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 6);
    this.to = this.toIsoDate(today);
    this.from = this.toIsoDate(weekAgo);
    this.loadAll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chart?.destroy();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadAll();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = Number(size);
    this.currentPage = 1;
    this.loadEvents();
  }

  goToPage(page: number): void {
    const next = Math.min(Math.max(page, 1), this.totalPages);
    if (next === this.currentPage) return;
    this.currentPage = next;
    this.loadEvents();
  }

  get totalItems(): number {
    return this.paged?.totalItems ?? 0;
  }

  get totalPages(): number {
    return Math.max(Math.ceil(this.totalItems / this.pageSize), 1);
  }

  get visiblePages(): number[] {
    if (this.totalPages <= 5) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
    const start = Math.max(1, Math.min(this.currentPage - 2, this.totalPages - 4));
    return Array.from({ length: 5 }, (_, i) => start + i);
  }

  get totalAllowed(): number {
    return this.summary.reduce((s, x) => s + x.allowed, 0);
  }

  get totalBlockedThrottle(): number {
    return this.summary.reduce((s, x) => s + x.blockedThrottle, 0);
  }

  get totalBlockedDailyLimit(): number {
    return this.summary.reduce((s, x) => s + x.blockedDailyLimit, 0);
  }

  formatTimestamp(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }

  outcomeLabel(outcome: string): string {
    switch (outcome) {
      case 'Allowed': return 'Permitido';
      case 'BlockedThrottle': return 'Throttle (5s)';
      case 'BlockedDailyLimit': return 'Limite diário';
      default: return outcome;
    }
  }

  outcomeClass(outcome: string): string {
    switch (outcome) {
      case 'Allowed': return 'outcome-allowed';
      case 'BlockedThrottle': return 'outcome-throttle';
      case 'BlockedDailyLimit': return 'outcome-daily';
      default: return '';
    }
  }

  private toIsoDate(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  private loadAll(): void {
    this.loading = true;
    this.error = false;
    this.loadSummary();
    this.loadEvents();
  }

  private loadSummary(): void {
    this.http.get<DownloadLogsSummaryPoint[]>(`${environment.apiEndpoint}/DownloadLogs/Summary`, {
      params: { from: this.from, to: this.to }
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.summary = data;
          this.loading = false;
          this.renderChart();
        },
        error: () => { this.loading = false; this.error = true; }
      });
  }

  private loadEvents(): void {
    this.http.get<PagedDownloadLogEvents>(`${environment.apiEndpoint}/DownloadLogs`, {
      params: { from: this.from, to: this.to, page: this.currentPage, pageSize: this.pageSize }
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => { this.paged = data; },
        error: () => { this.error = true; }
      });
  }

  private renderChart(): void {
    if (!this.chartRef?.nativeElement) return;

    const labels = this.summary.map(s => this.formatDayLabel(s.day));
    const allowed = this.summary.map(s => s.allowed);
    const blockedThrottle = this.summary.map(s => s.blockedThrottle);
    const blockedDailyLimit = this.summary.map(s => s.blockedDailyLimit);

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = allowed;
      this.chart.data.datasets[1].data = blockedThrottle;
      this.chart.data.datasets[2].data = blockedDailyLimit;
      this.chart.update();
      return;
    }

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Permitido',
            data: allowed,
            backgroundColor: 'rgba(41,171,226,0.7)',
            borderColor: '#29abe2',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Bloqueado (throttle 5s)',
            data: blockedThrottle,
            backgroundColor: 'rgba(255,165,0,0.75)',
            borderColor: '#f0a000',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Bloqueado (limite diário)',
            data: blockedDailyLimit,
            backgroundColor: 'rgba(220,53,69,0.75)',
            borderColor: '#dc3545',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: true, position: 'bottom', labels: { font: { size: 11 } } }
        },
        scales: {
          x: { stacked: true, ticks: { font: { size: 10 } }, grid: { display: false } },
          y: { stacked: true, beginAtZero: true, ticks: { font: { size: 10 }, precision: 0 }, grid: { color: '#f0f0f0' } }
        }
      }
    });
  }

  private formatDayLabel(iso: string): string {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
}
