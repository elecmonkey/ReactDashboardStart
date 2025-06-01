import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { LoginRequestSchema } from '@/schemas';
import { createAntdFormValidator, validate } from '@/utils';
import type { LoginRequest } from '@/types';

const Login: React.FC = () => {
  useDocumentTitle('登录');
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<LoginRequest>();

  // 创建表单验证器
  const formValidator = createAntdFormValidator(LoginRequestSchema);

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      // 使用 zod 进行表单数据验证
      const validatedData = await formValidator.validateBeforeSubmit(values);
      
      const response = await authService.login(validatedData);
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        message.success('登录成功！');
        navigate('/dashboard');
      } else {
        message.error(response.message || '登录失败');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error instanceof Error ? error.message : '登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 实时验证字段
  const handleFieldChange = (changedFields: any[]) => {
    changedFields.forEach(({ name, value }) => {
      if (value) {
        const fieldName = Array.isArray(name) ? name[0] : name;
        const validationResult = validate(LoginRequestSchema.partial(), { [fieldName]: value });
        
        if (!validationResult.success) {
          const fieldError = validationResult.errors?.find(err => err.includes(fieldName));
          if (fieldError) {
            form.setFields([{
              name: fieldName,
              errors: [fieldError],
            }]);
          }
        }
      }
    });
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        title="管理系统登录"
        style={{
          width: 400,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          onFieldsChange={handleFieldChange}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={formValidator.getAntdRules('username')}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名 (admin)"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={formValidator.getAntdRules('password')}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码 (admin123)"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: 16, color: '#666' }}>
          <p>测试账号：admin / admin123</p>
          <div style={{ fontSize: '12px', color: '#999' }}>
            <p>• 用户名不能为空</p>
            <p>• 密码至少6个字符</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login; 