// 统计数据类型
export interface Statistics {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  color?: string;
}

// 仪表板数据类型
export interface DashboardData {
  statistics: Statistics[];
}

// 系统状态类型
export interface SystemStatus {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

// 图表数据类型
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

// 趋势数据类型
export interface TrendData {
  period: string;
  value: number;
  change?: number;
  changePercent?: number;
} 