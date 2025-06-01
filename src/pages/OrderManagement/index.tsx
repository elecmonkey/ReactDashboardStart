import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Card } from 'antd';
import {
  FileTextOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const OrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useDocumentTitle('订单管理');

  const menuItems = [
    {
      key: '/orders',
      icon: <FileTextOutlined />,
      label: '订单列表',
    },
    {
      key: '/orders/payments',
      icon: <DollarOutlined />,
      label: '支付管理',
    },
    {
      key: '/orders/statistics',
      icon: <BarChartOutlined />,
      label: '订单统计',
    },
    {
      key: '/orders/settings',
      icon: <SettingOutlined />,
      label: '订单设置',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>订单管理</h1>
      
      <div style={{ display: 'flex', gap: 24 }}>
        <Card 
          style={{ width: 240, height: 'fit-content' }}
          bodyStyle={{ padding: 0 }}
        >
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ border: 'none' }}
          />
        </Card>
        
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OrderManagement; 