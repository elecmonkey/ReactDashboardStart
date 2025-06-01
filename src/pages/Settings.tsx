import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Space,
  Divider,
  message,
  Row,
  Col,
  Spin,
} from 'antd';
import { useAppStore } from '@/store/appStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { settingsService } from '@/services';
import type { Settings } from '@/types';

const SettingsPage: React.FC = () => {
  useDocumentTitle('系统设置');
  
  const { theme, setTheme } = useAppStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [systemSettings, setSystemSettings] = useState<Settings | null>(null);

  // 获取系统设置
  const fetchSettings = async () => {
    try {
      const response = await settingsService.getSettings();
      if (response.success && response.data) {
        setSystemSettings(response.data);
        form.setFieldsValue(response.data);
      }
    } catch (error) {
      message.error('获取系统设置失败');
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [form]);

  const handleSave = async (values: Partial<Settings>) => {
    setSaving(true);
    try {
      const response = await settingsService.updateSettings(values);
      if (response.success) {
        setSystemSettings(response.data);
        message.success('设置保存成功！');
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error) {
      message.error('保存设置失败');
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    
    // 同时更新后端设置
    const updatedSettings = {
      ...systemSettings,
      theme: newTheme,
    };
    handleSave(updatedSettings);
    message.success(`已切换到${checked ? '深色' : '浅色'}主题`);
  };

  const handleToggleSetting = async (field: keyof Settings, checked: boolean) => {
    const updatedSettings = {
      ...systemSettings,
      [field]: checked,
    };
    
    try {
      const response = await settingsService.updateSettings(updatedSettings);
      if (response.success) {
        setSystemSettings(response.data);
        message.success(`${getFieldLabel(field)}已${checked ? '开启' : '关闭'}`);
      }
    } catch (error) {
      message.error('更新设置失败');
    }
  };

  const getFieldLabel = (field: keyof Settings): string => {
    const labels: Record<keyof Settings, string> = {
      siteName: '网站名称',
      siteDescription: '网站描述',
      adminEmail: '管理员邮箱',
      language: '语言',
      theme: '主题',
      maintenanceMode: '维护模式',
      autoSave: '自动保存',
      emailNotification: '邮件通知',
      sessionTimeout: '会话超时',
      passwordStrength: '密码强度',
      loginFailLimit: '登录失败限制',
    };
    return labels[field] || field;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>系统设置</h1>
      
      <Row gutter={24}>
        <Col span={12}>
          <Card title="基本设置" style={{ marginBottom: 24 }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={systemSettings || {}}
            >
              <Form.Item
                label="网站名称"
                name="siteName"
                rules={[{ required: true, message: '请输入网站名称!' }]}
              >
                <Input placeholder="请输入网站名称" />
              </Form.Item>

              <Form.Item
                label="网站描述"
                name="siteDescription"
              >
                <Input.TextArea
                  rows={3}
                  placeholder="请输入网站描述"
                />
              </Form.Item>

              <Form.Item
                label="管理员邮箱"
                name="adminEmail"
                rules={[
                  { required: true, message: '请输入管理员邮箱!' },
                  { type: 'email', message: '请输入有效的邮箱地址!' }
                ]}
              >
                <Input placeholder="请输入管理员邮箱" />
              </Form.Item>

              <Form.Item
                label="语言设置"
                name="language"
              >
                <Select>
                  <Select.Option value="zh-CN">简体中文</Select.Option>
                  <Select.Option value="en-US">English</Select.Option>
                  <Select.Option value="ja-JP">日本語</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={saving}
                >
                  保存基本设置
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="系统配置" style={{ marginBottom: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>深色主题</span>
                <Switch
                  checked={theme === 'dark'}
                  onChange={handleThemeChange}
                />
              </div>

              <Divider />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>维护模式</span>
                <Switch
                  checked={systemSettings?.maintenanceMode || false}
                  onChange={(checked) => handleToggleSetting('maintenanceMode', checked)}
                />
              </div>

              <Divider />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>自动保存</span>
                <Switch
                  checked={systemSettings?.autoSave || false}
                  onChange={(checked) => handleToggleSetting('autoSave', checked)}
                />
              </div>

              <Divider />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>邮件通知</span>
                <Switch
                  checked={systemSettings?.emailNotification || false}
                  onChange={(checked) => handleToggleSetting('emailNotification', checked)}
                />
              </div>
            </Space>
          </Card>

          <Card title="安全设置">
            <Form layout="vertical" initialValues={systemSettings || {}}>
              <Form.Item label="会话超时时间(分钟)" name="sessionTimeout">
                <Select 
                  onChange={(value) => handleSave({ ...systemSettings, sessionTimeout: value })}
                >
                  <Select.Option value={15}>15分钟</Select.Option>
                  <Select.Option value={30}>30分钟</Select.Option>
                  <Select.Option value={60}>1小时</Select.Option>
                  <Select.Option value={120}>2小时</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="密码强度要求" name="passwordStrength">
                <Select 
                  onChange={(value) => handleSave({ ...systemSettings, passwordStrength: value })}
                >
                  <Select.Option value="low">低</Select.Option>
                  <Select.Option value="medium">中</Select.Option>
                  <Select.Option value="high">高</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="登录失败次数限制" name="loginFailLimit">
                <Select 
                  onChange={(value) => handleSave({ ...systemSettings, loginFailLimit: value })}
                >
                  <Select.Option value={3}>3次</Select.Option>
                  <Select.Option value={5}>5次</Select.Option>
                  <Select.Option value={10}>10次</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SettingsPage; 