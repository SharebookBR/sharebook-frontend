export interface JobMonitorSummary {
  totalJobs: number;
  activeJobs: number;
  inactiveJobs: number;
  jobsWithHistory: number;
  jobsNeverExecuted: number;
  healthyJobs: number;
  delayedJobs: number;
  jobsWithError: number;
}

export interface JobMonitorExecutor {
  lastExecutionAt?: string;
  lastExecutionSuccess?: boolean;
  lastExecutionDurationSeconds?: number;
  details?: string;
}

export interface JobMonitorItem {
  order: number;
  jobName: string;
  description: string;
  interval: string;
  active: boolean;
  bestDayOfWeek?: string;
  bestTimeToExecute?: string;
  nextExecutionAt?: string;
  lastExecutionAt?: string;
  lastExecutionSuccess?: boolean;
  lastExecutionDurationSeconds?: number;
  lastExecutionDetails?: string;
  healthStatus: 'healthy' | 'delayed' | 'error' | 'inactive' | 'unknown' | string;
  healthLabel: string;
  healthReason: string;
  recentHistory: JobMonitorHistoryItem[];
}

export interface JobMonitorHistoryItem {
  creationDate?: string;
  isSuccess: boolean;
  timeSpentSeconds: number;
  details?: string;
}

export interface JobMonitorDashboard {
  summary: JobMonitorSummary;
  executor: JobMonitorExecutor;
  jobs: JobMonitorItem[];
}
