import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Tag,
  Card,
  Statistic,
  Row,
  Col,
  Spin,
} from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { orderService } from '@/services';
import type { Order, OrderStats } from '@/types';

const OrderList: React.FC = () => {
  useDocumentTitle('订单列表');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // 获取订单列表和统计
  const fetchData = async () => {
    try {
      const [ordersResponse, statsResponse] = await Promise.all([
        orderService.getOrders(),
        orderService.getOrderStats(),
      ]);

      if (ordersResponse.success && ordersResponse.data) {
        setOrders(ordersResponse.data);
      }

      if (statsResponse.success && statsResponse.data) {
        setOrderStats(statsResponse.data);
      }
    } catch (error) {
      message.error('获取订单数据失败');
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusColors: Record<Order['status'], string> = {
    pending: 'orange',
    paid: 'blue',
    shipped: 'purple',
    delivered: 'green',
    cancelled: 'red',
  };

  const statusLabels: Record<Order['status'], string> = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    delivered: '已送达',
    cancelled: '已取消',
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        // 更新本地状态
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        message.success('订单状态更新成功');
        // 重新获取统计数据
        const statsResponse = await orderService.getOrderStats();
        if (statsResponse.success && statsResponse.data) {
          setOrderStats(statsResponse.data);
        }
      } else {
        message.error(response.message || '更新失败');
      }
    } catch (error) {
      message.error('更新订单状态失败');
      console.error('Failed to update order status:', error);
    }
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '客户信息',
      key: 'customer',
      width: 150,
      render: (_: any, record: Order) => (
        <div>
          <div>{record.customerName}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.customerPhone}</div>
        </div>
      ),
    },
    {
      title: '商品',
      dataIndex: 'products',
      key: 'products',
      width: 200,
    },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 100,
      render: (amount: number) => `¥${amount}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: Order['status']) => (
        <Tag color={statusColors[status]}>
          {statusLabels[status]}
        </Tag>
      ),
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
    },
    {
      title: '下单时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Order) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewOrder(record)}
          >
            查看
          </Button>
          <Select
            size="small"
            value={record.status}
            style={{ width: 80 }}
            onChange={(value) => handleStatusChange(record.id, value)}
          >
            <Select.Option value="pending">待付款</Select.Option>
            <Select.Option value="paid">已付款</Select.Option>
            <Select.Option value="shipped">已发货</Select.Option>
            <Select.Option value="delivered">已送达</Select.Option>
            <Select.Option value="cancelled">已取消</Select.Option>
          </Select>
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
                title="总订单数"
                value={orderStats?.total || 0}
                suffix="单"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="待付款"
                value={orderStats?.pending || 0}
                suffix="单"
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="已付款"
                value={orderStats?.paid || 0}
                suffix="单"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总金额"
                value={orderStats?.totalAmount || 0}
                prefix="¥"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Table
            dataSource={orders.map(order => ({ ...order, key: order.id }))}
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
          title="订单详情"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={800}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              关闭
            </Button>,
          ]}
        >
          {selectedOrder && (
            <div>
              <Row gutter={16}>
                <Col span={12}>
                  <p><strong>订单号:</strong> {selectedOrder.id}</p>
                  <p><strong>客户姓名:</strong> {selectedOrder.customerName}</p>
                  <p><strong>联系电话:</strong> {selectedOrder.customerPhone}</p>
                  <p><strong>商品信息:</strong> {selectedOrder.products}</p>
                </Col>
                <Col span={12}>
                  <p><strong>订单金额:</strong> ¥{selectedOrder.totalAmount}</p>
                  <p><strong>支付方式:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>订单状态:</strong> 
                    <Tag color={statusColors[selectedOrder.status]} style={{ marginLeft: 8 }}>
                      {statusLabels[selectedOrder.status]}
                    </Tag>
                  </p>
                  <p><strong>下单时间:</strong> {selectedOrder.createdAt}</p>
                </Col>
              </Row>
              <p><strong>收货地址:</strong> {selectedOrder.shippingAddress}</p>
            </div>
          )}
        </Modal>
      </div>
    </Spin>
  );
};

export default OrderList; 