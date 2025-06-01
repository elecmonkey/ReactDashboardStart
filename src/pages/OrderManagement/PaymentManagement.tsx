import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Tag,
  Button,
  Space,
  Modal,
  Descriptions,
  Row,
  Col,
  Statistic,
  message,
  Spin,
} from 'antd';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { paymentService } from '@/services';
import type { Payment, PaymentStats } from '@/types';

const PaymentManagement: React.FC = () => {
  useDocumentTitle('支付管理');

  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 获取支付列表和统计
  const fetchData = async () => {
    try {
      const [paymentsResponse, statsResponse] = await Promise.all([
        paymentService.getPayments(),
        paymentService.getPaymentStats(),
      ]);

      if (paymentsResponse.success && paymentsResponse.data) {
        setPayments(paymentsResponse.data);
      }

      if (statsResponse.success && statsResponse.data) {
        setPaymentStats(statsResponse.data);
      }
    } catch (error) {
      message.error('获取支付数据失败');
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const methodLabels: Record<Payment['method'], string> = {
    wechat: '微信支付',
    alipay: '支付宝',
    credit: '信用卡',
    bank: '银行转账',
  };

  const statusColors: Record<Payment['status'], string> = {
    pending: 'orange',
    success: 'green',
    failed: 'red',
    refunded: 'purple',
  };

  const statusLabels: Record<Payment['status'], string> = {
    pending: '处理中',
    success: '成功',
    failed: '失败',
    refunded: '已退款',
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalVisible(true);
  };

  const handleRetryPayment = async (paymentId: string) => {
    try {
      const response = await paymentService.retryPayment(paymentId);
      if (response.success) {
        message.success('重试支付成功');
        fetchData(); // 重新获取数据
      } else {
        message.error(response.message || '重试失败');
      }
    } catch (error) {
      message.error('重试支付失败');
      console.error('Failed to retry payment:', error);
    }
  };

  const columns = [
    {
      title: '支付单号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '关联订单',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 150,
    },
    {
      title: '支付金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => `¥${amount}`,
    },
    {
      title: '支付方式',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      render: (method: Payment['method']) => methodLabels[method],
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: Payment['status']) => (
        <Tag color={statusColors[status]}>
          {statusLabels[status]}
        </Tag>
      ),
    },
    {
      title: '交易流水号',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Payment) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewPayment(record)}
          >
            查看
          </Button>
          {record.status === 'pending' && (
            <Button
              type="link"
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => handleRetryPayment(record.id)}
            >
              重试
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总支付单数"
                value={paymentStats?.total || 0}
                suffix="单"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="成功支付"
                value={paymentStats?.success || 0}
                suffix="单"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="处理中"
                value={paymentStats?.pending || 0}
                suffix="单"
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="成功金额"
                value={paymentStats?.totalAmount || 0}
                prefix="¥"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Table
            dataSource={payments.map(payment => ({ ...payment, key: payment.id }))}
            columns={columns}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        <Modal
          title="支付详情"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={600}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              关闭
            </Button>,
          ]}
        >
          {selectedPayment && (
            <Descriptions column={2} bordered>
              <Descriptions.Item label="支付单号">
                {selectedPayment.id}
              </Descriptions.Item>
              <Descriptions.Item label="关联订单">
                {selectedPayment.orderId}
              </Descriptions.Item>
              <Descriptions.Item label="支付金额">
                ¥{selectedPayment.amount}
              </Descriptions.Item>
              <Descriptions.Item label="支付方式">
                {methodLabels[selectedPayment.method]}
              </Descriptions.Item>
              <Descriptions.Item label="支付状态">
                <Tag color={statusColors[selectedPayment.status]}>
                  {statusLabels[selectedPayment.status]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="交易流水号">
                {selectedPayment.transactionId}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {selectedPayment.createdAt}
              </Descriptions.Item>
              <Descriptions.Item label="完成时间">
                {selectedPayment.completedAt || '-'}
              </Descriptions.Item>
              {selectedPayment.refundReason && (
                <Descriptions.Item label="退款原因" span={2}>
                  {selectedPayment.refundReason}
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </Modal>
      </div>
    </Spin>
  );
};

export default PaymentManagement; 