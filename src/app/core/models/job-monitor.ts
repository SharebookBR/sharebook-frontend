export interface JobMonitorSummary {
  totalJobs: number;
  activeJobs: number;
  inactiveJobs: number;
  jobsWithHistory: number;
  jobsNeverExecuted: number;
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
  lastExecutionDurationSeconds?: number;
  lastExecutionDetails?: string;
}

export interface JobMonitorDashboard {
  summary: JobMonitorSummary;
  executor: JobMonitorExecutor;
  jobs: JobMonitorItem[];
}
