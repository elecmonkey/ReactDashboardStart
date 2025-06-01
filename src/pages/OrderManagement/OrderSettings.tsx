import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Select,
  Row,
  Col,
  Divider,
  message,
  Spin,
} from 'antd';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { settingsService } from '@/services';
import type { OrderSettings } from '@/types';

const OrderSettingsPage: React.FC = () => {
  useDocumentTitle('订单设置');
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderSettings, setOrderSettings] = useState<OrderSettings | null>(null);

  // 获取订单设置
  const fetchOrderSettings = async () => {
    try {
      const response = await settingsService.getOrderSettings();
      if (response.success && response.data) {
        setOrderSettings(response.data);
        form.setFieldsValue(response.data);
      }
    } catch (error) {
      message.error('获取订单设置失败');
      console.error('Failed to fetch order settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderSettings();
  }, [form]);

  const handleSave = async (values: Partial<OrderSettings>) => {
    setSaving(true);
    try {
      const response = await settingsService.updateOrderSettings(values);
      if (response.success) {
        setOrderSettings(response.data);
        message.success('订单设置保存成功！');
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error) {
      message.error('保存订单设置失败');
      console.error('Failed to save order settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSetting = async (field: keyof OrderSettings, checked: boolean) => {
    const updatedSettings = {
      ...orderSettings,
      [field]: checked,
    };
    
    try {
      const response = await settingsService.updateOrderSettings(updatedSettings);
      if (response.success) {
        setOrderSettings(response.data);
        message.success(`${getFieldLabel(field)}已${checked ? '开启' : '关闭'}`);
      }
    } catch (error) {
      message.error('更新设置失败');
    }
  };

  const getFieldLabel = (field: keyof OrderSettings): string => {
    const labels: Record<keyof OrderSettings, string> = {
      autoConfirmDays: '自动确认天数',
      autoCompleteAfterShip: '发货后自动完成',
      allowCancel: '允许取消订单',
      cancelTimeLimit: '取消时限',
      defaultCurrency: '默认货币',
      requirePhone: '必填手机号',
      requireAddress: '必填地址',
      enableCoupon: '启用优惠券',
      maxOrderItems: '最大商品数',
      orderPrefix: '订单前缀',
      invoiceValidation: '发票验证',
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
      <Row gutter={16}>
        <Col span={12}>
          <Card title="订单基础设置" style={{ marginBottom: 16 }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={orderSettings || {}}
            >
              <Form.Item
                label="自动确认收货天数"
                name="autoConfirmDays"
                help="发货后多少天自动确认收货"
              >
                <InputNumber
                  min={1}
                  max={30}
                  style={{ width: '100%' }}
                  addonAfter="天"
                />
              </Form.Item>

              <Form.Item
                label="发货后自动完成"
                name="autoCompleteAfterShip"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="允许取消订单"
                name="allowCancel"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="取消订单时限"
                name="cancelTimeLimit"
                help="下单后多少分钟内可以取消"
              >
                <InputNumber
                  min={5}
                  max={1440}
                  style={{ width: '100%' }}
                  addonAfter="分钟"
                />
              </Form.Item>

              <Form.Item
                label="默认货币"
                name="defaultCurrency"
              >
                <Select>
                  <Select.Option value="CNY">人民币 (CNY)</Select.Option>
                  <Select.Option value="USD">美元 (USD)</Select.Option>
                  <Select.Option value="EUR">欧元 (EUR)</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={saving}
                >
                  保存基础设置
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="订单验证设置" style={{ marginBottom: 16 }}>
            <Form layout="vertical" initialValues={orderSettings || {}}>
              <Form.Item
                label="必须填写手机号"
                name="requirePhone"
                valuePropName="checked"
              >
                <Switch 
                  checked={orderSettings?.requirePhone || false}
                  onChange={(checked) => handleToggleSetting('requirePhone', checked)}
                />
              </Form.Item>

              <Form.Item
                label="必须填写收货地址"
                name="requireAddress"
                valuePropName="checked"
              >
                <Switch 
                  checked={orderSettings?.requireAddress || false}
                  onChange={(checked) => handleToggleSetting('requireAddress', checked)}
                />
              </Form.Item>

              <Form.Item
                label="启用优惠券"
                name="enableCoupon"
                valuePropName="checked"
              >
                <Switch 
                  checked={orderSettings?.enableCoupon || false}
                  onChange={(checked) => handleToggleSetting('enableCoupon', checked)}
                />
              </Form.Item>

              <Form.Item
                label="单个订单最大商品数"
                name="maxOrderItems"
              >
                <InputNumber
                  min={1}
                  max={100}
                  style={{ width: '100%' }}
                  addonAfter="件"
                  value={orderSettings?.maxOrderItems}
                  onChange={(value) => value && handleSave({ ...orderSettings, maxOrderItems: value })}
                />
              </Form.Item>

              <Divider />

              <Form.Item label="订单号前缀" name="orderPrefix">
                <Input 
                  value={orderSettings?.orderPrefix}
                  placeholder="请输入订单号前缀" 
                  onChange={(e) => handleSave({ ...orderSettings, orderPrefix: e.target.value })}
                />
              </Form.Item>

              <Form.Item label="发票抬头验证" name="invoiceValidation" valuePropName="checked">
                <Switch 
                  checked={orderSettings?.invoiceValidation || false}
                  onChange={(checked) => handleToggleSetting('invoiceValidation', checked)}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Card title="通知设置">
        <Row gutter={16}>
          <Col span={8}>
            <h4>订单状态变更通知</h4>
            <Form layout="vertical">
              <Form.Item label="新订单通知">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="支付成功通知">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="发货通知">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="签收通知">
                <Switch defaultChecked />
              </Form.Item>
            </Form>
          </Col>

          <Col span={8}>
            <h4>通知方式</h4>
            <Form layout="vertical">
              <Form.Item label="短信通知">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="邮件通知">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="站内信通知">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="微信推送">
                <Switch />
              </Form.Item>
            </Form>
          </Col>

          <Col span={8}>
            <h4>管理员通知</h4>
            <Form layout="vertical">
              <Form.Item label="新订单提醒">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="订单异常提醒">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="退款申请提醒">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="库存不足提醒">
                <Switch defaultChecked />
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <Divider />

        <Button type="primary" size="large">
          保存所有通知设置
        </Button>
      </Card>
    </div>
  );
};

export default OrderSettingsPage; 