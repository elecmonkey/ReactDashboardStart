import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Progress, Spin } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { dashboardService } from '@/services';
import type { Statistics, Order, SystemStatus } from '@/types';

const Dashboard: React.FC = () => {
  useDocumentTitle('仪表板');

  const [loading, setLoading] = useState(true);
  const [statisticsData, setStatisticsData] = useState<Statistics[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
  });

  // 获取仪表板数据
  const fetchDashboardData = async () => {
    try {
      // 并行获取所有数据
      const [dashboardResponse, ordersResponse, statusResponse] = await Promise.all([
        dashboardService.getDashboardData(),
        dashboardService.getRecentOrders(),
        dashboardService.getSystemStatus(),
      ]);

      if (dashboardResponse.success && dashboardResponse.data) {
        setStatisticsData(dashboardResponse.data.statistics);
      }

      if (ordersResponse.success && ordersResponse.data) {
        setRecentOrders(ordersResponse.data);
      }

      if (statusResponse.success && statusResponse.data) {
        setSystemStatus(statusResponse.data);
      }
    } catch (error) {
      console.error('Fetch dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getIconByTitle = (title: string) => {
    switch (title) {
      case '总用户数':
        return <UserOutlined />;
      case '总订单数':
        return <ShoppingCartOutlined />;
      case '总收入':
        return <DollarOutlined />;
      case '完成率':
        return <TrophyOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: '产品',
      dataIndex: 'products',
      key: 'products',
    },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `¥${amount}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let statusText = '';
        let color = 'default';
        
        switch (status) {
          case 'paid':
            statusText = '已付款';
            color = 'green';
            break;
          case 'pending':
            statusText = '待付款';
            color = 'orange';
            break;
          case 'shipped':
            statusText = '已发货';
            color = 'blue';
            break;
          case 'delivered':
            statusText = '已送达';
            color = 'green';
            break;
          case 'cancelled':
            statusText = '已取消';
            color = 'red';
            break;
          default:
            statusText = status;
        }
        
        return <span style={{ color }}>{statusText}</span>;
      },
    },
    {
      title: '日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => date.split(' ')[0], // 只显示日期部分
    },
  ];

  return (
    <Spin spinning={loading}>
      <div>
        <h1 style={{ marginBottom: 24 }}>仪表板</h1>
        
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          {statisticsData.map((item, index) => (
            <Col span={6} key={index}>
              <Card>
                <Statistic
                  title={item.title}
                  value={item.value}
                  prefix={getIconByTitle(item.title)}
                  suffix={item.suffix}
                  valueStyle={{ color: item.color }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={16}>
          {/* 最近订单 */}
          <Col span={16}>
            <Card title="最近订单" style={{ height: 400 }}>
              <Table
                dataSource={recentOrders.map(order => ({ ...order, key: order.id }))}
                columns={columns}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
          
          {/* 系统状态 */}
          <Col span={8}>
            <Card title="系统状态" style={{ height: 400 }}>
              <div style={{ marginBottom: 20 }}>
                <p>CPU 使用率</p>
                <Progress percent={systemStatus.cpu} status="active" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <p>内存使用率</p>
                <Progress percent={systemStatus.memory} status="active" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <p>磁盘使用率</p>
                <Progress percent={systemStatus.disk} status="active" />
              </div>
              <div>
                <p>网络带宽</p>
                <Progress percent={systemStatus.network} status="active" />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default Dashboard; 