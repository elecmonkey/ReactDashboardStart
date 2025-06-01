import { z } from 'zod';

// 统计数据 Schema
export const StatisticsSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  value: z.number().min(0, '值不能为负数'),
  suffix: z.string().optional(),
  prefix: z.string().optional(),
  color: z.string().optional(),
  change: z.number().optional(),
  changePercent: z.number().optional(),
});

// 仪表板数据 Schema
export const DashboardDataSchema = z.object({
  statistics: z.array(StatisticsSchema),
  charts: z.array(z.any()).optional(),
  recentActivities: z.array(z.any()).optional(),
});

// 系统状态 Schema
export const SystemStatusSchema = z.object({
  cpu: z.number().min(0, 'CPU使用率不能为负数').max(100, 'CPU使用率不能超过100%'),
  memory: z.number().min(0, '内存使用率不能为负数').max(100, '内存使用率不能超过100%'),
  disk: z.number().min(0, '磁盘使用率不能为负数').max(100, '磁盘使用率不能超过100%'),
  network: z.number().min(0, '网络使用率不能为负数'),
  uptime: z.number().min(0, '运行时间不能为负数').optional(),
  temperature: z.number().optional(),
});

// 图表数据集 Schema
export const ChartDatasetSchema = z.object({
  label: z.string().min(1, '数据集标签不能为空'),
  data: z.array(z.number()),
  backgroundColor: z.union([z.string(), z.array(z.string())]).optional(),
  borderColor: z.string().optional(),
  borderWidth: z.number().min(0, '边框宽度不能为负数').optional(),
  fill: z.boolean().optional(),
  tension: z.number().min(0, '张力不能为负数').max(1, '张力不能超过1').optional(),
});

// 图表数据 Schema
export const ChartDataSchema = z.object({
  labels: z.array(z.string()),
  datasets: z.array(ChartDatasetSchema),
});

// 趋势数据 Schema
export const TrendDataSchema = z.object({
  period: z.string().min(1, '周期不能为空'),
  value: z.number().min(0, '值不能为负数'),
  change: z.number().optional(),
  changePercent: z.number().optional(),
  target: z.number().min(0, '目标值不能为负数').optional(),
});

// 销售数据 Schema
export const SalesDataSchema = z.object({
  today: z.number().min(0, '今日销售额不能为负数'),
  yesterday: z.number().min(0, '昨日销售额不能为负数'),
  thisWeek: z.number().min(0, '本周销售额不能为负数'),
  lastWeek: z.number().min(0, '上周销售额不能为负数'),
  thisMonth: z.number().min(0, '本月销售额不能为负数'),
  lastMonth: z.number().min(0, '上月销售额不能为负数'),
  thisYear: z.number().min(0, '今年销售额不能为负数'),
  lastYear: z.number().min(0, '去年销售额不能为负数'),
});

// 用户活动数据 Schema
export const UserActivitySchema = z.object({
  activeUsers: z.number().min(0, '活跃用户数不能为负数'),
  newUsers: z.number().min(0, '新用户数不能为负数'),
  returningUsers: z.number().min(0, '回访用户数不能为负数'),
  sessionDuration: z.number().min(0, '会话时长不能为负数'),
  bounceRate: z.number().min(0, '跳出率不能为负数').max(100, '跳出率不能超过100%'),
});

// 业务指标 Schema
export const BusinessMetricsSchema = z.object({
  revenue: z.number().min(0, '收入不能为负数'),
  orders: z.number().min(0, '订单数不能为负数'),
  conversion: z.number().min(0, '转化率不能为负数').max(100, '转化率不能超过100%'),
  avgOrderValue: z.number().min(0, '平均订单价值不能为负数'),
  customerRetention: z.number().min(0, '客户保留率不能为负数').max(100, '客户保留率不能超过100%'),
});

// 仪表板配置 Schema
export const DashboardConfigSchema = z.object({
  layout: z.array(z.object({
    id: z.string(),
    x: z.number().min(0),
    y: z.number().min(0),
    w: z.number().min(1),
    h: z.number().min(1),
  })),
  widgets: z.array(z.object({
    id: z.string(),
    type: z.string(),
    title: z.string(),
    visible: z.boolean(),
    config: z.record(z.any()).optional(),
  })),
  refreshInterval: z.number().min(1, '刷新间隔至少1秒').max(3600, '刷新间隔不超过1小时').optional(),
});

// 导出类型
export type Statistics = z.infer<typeof StatisticsSchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;
export type SystemStatus = z.infer<typeof SystemStatusSchema>;
export type ChartData = z.infer<typeof ChartDataSchema>;
export type ChartDataset = z.infer<typeof ChartDatasetSchema>;
export type TrendData = z.infer<typeof TrendDataSchema>;
export type SalesData = z.infer<typeof SalesDataSchema>;
export type UserActivity = z.infer<typeof UserActivitySchema>;
export type BusinessMetrics = z.infer<typeof BusinessMetricsSchema>;
export type DashboardConfig = z.infer<typeof DashboardConfigSchema>; 