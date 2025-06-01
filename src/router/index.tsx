import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Spin } from 'antd';

// 懒加载页面组件
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const UserManagement = lazy(() => import('@/pages/UserManagement'));
const ProductManagement = lazy(() => import('@/pages/ProductManagement'));
const Settings = lazy(() => import('@/pages/Settings'));

// 订单管理相关页面 - 懒加载
const OrderManagement = lazy(() => import('@/pages/OrderManagement'));
const OrderList = lazy(() => import('@/pages/OrderManagement/OrderList'));
const PaymentManagement = lazy(() => import('@/pages/OrderManagement/PaymentManagement'));
const OrderStatistics = lazy(() => import('@/pages/OrderManagement/OrderStatistics'));
const OrderSettings = lazy(() => import('@/pages/OrderManagement/OrderSettings'));

// 页面加载中组件
const PageLoading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px' 
  }}>
    <Spin size="large" tip="页面加载中..." />
  </div>
);

// 懒加载包装器
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoading />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <LazyWrapper>
        <Login />
      </LazyWrapper>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <LazyWrapper>
            <Dashboard />
          </LazyWrapper>
        ),
      },
      {
        path: 'users',
        element: (
          <LazyWrapper>
            <UserManagement />
          </LazyWrapper>
        ),
      },
      {
        path: 'products',
        element: (
          <LazyWrapper>
            <ProductManagement />
          </LazyWrapper>
        ),
      },
      {
        path: 'orders',
        element: (
          <LazyWrapper>
            <OrderManagement />
          </LazyWrapper>
        ),
        children: [
          {
            index: true,
            element: (
              <LazyWrapper>
                <OrderList />
              </LazyWrapper>
            ),
          },
          {
            path: 'payments',
            element: (
              <LazyWrapper>
                <PaymentManagement />
              </LazyWrapper>
            ),
          },
          {
            path: 'statistics',
            element: (
              <LazyWrapper>
                <OrderStatistics />
              </LazyWrapper>
            ),
          },
          {
            path: 'settings',
            element: (
              <LazyWrapper>
                <OrderSettings />
              </LazyWrapper>
            ),
          },
        ],
      },
      {
        path: 'settings',
        element: (
          <LazyWrapper>
            <Settings />
          </LazyWrapper>
        ),
      },
    ],
  },
]); 