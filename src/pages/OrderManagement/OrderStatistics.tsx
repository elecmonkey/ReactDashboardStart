import React from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const OrderStatistics: React.FC = () => {
  useDocumentTitle('订单统计');

  const monthlyData = [
    {
      key: '1',
      month: '2024-01',
      orders: 156,
      amount: 234567,
      growth: 12.5,
    },
    {
      key: '2',
      month: '2024-02',
      orders: 189,
      amount: 298456,
      growth: 21.1,
    },
    {
      key: '3',
      month: '2024-03',
      orders: 143,
      amount: 187923,
      growth: -24.3,
    },
  ];

  const categoryData = [
    {
      key: '1',
      category: '手机',
      orders: 45,
      amount: 356789,
      percentage: 42.3,
    },
    {
      key: '2',
      category: '电脑',
      orders: 23,
      amount: 234567,
      percentage: 27.8,
    },
    {
      key: '3',
      category: '平板',
      orders: 18,
      amount: 98456,
      percentage: 11.7,
    },
    {
      key: '4',
      category: '配件',
      orders: 32,
      amount: 152789,
      percentage: 18.2,
    },
  ];

  const monthlyColumns = [
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: '订单数量',
      dataIndex: 'orders',
      key: 'orders',
      render: (orders: number) => `${orders}单`,
    },
    {
      title: '销售金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '增长率',
      dataIndex: 'growth',
      key: 'growth',
      render: (growth: number) => (
        <span style={{ color: growth > 0 ? '#52c41a' : '#ff4d4f' }}>
          {growth > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {Math.abs(growth)}%
        </span>
      ),
    },
  ];

  const categoryColumns = [
    {
      title: '商品类别',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '订单数量',
      dataIndex: 'orders',
      key: 'orders',
      render: (orders: number) => `${orders}单`,
    },
    {
      title: '销售金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => `${percentage}%`,
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日订单"
              value={28}
              suffix="单"
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日销售额"
              value={45698}
              prefix="¥"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月订单"
              value={488}
              suffix="单"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月销售额"
              value={720934}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="订单转化率"
              value={68.5}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均订单金额"
              value={1247}
              prefix="¥"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="退款率"
              value={2.3}
              suffix="%"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="客户满意度"
              value={4.7}
              suffix="/5.0"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="月度订单趋势" style={{ height: 400 }}>
            <Table
              dataSource={monthlyData}
              columns={monthlyColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="商品类别统计" style={{ height: 400 }}>
            <Table
              dataSource={categoryData}
              columns={categoryColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderStatistics; 