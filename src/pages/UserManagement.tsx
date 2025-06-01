import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
  Spin,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { User } from '@/types';
import { userService } from '@/services';
import { CreateUserRequestSchema, UpdateUserRequestSchema } from '@/schemas';
import { createAntdFormValidator } from '@/utils';
import type { CreateUserRequest, UpdateUserRequest } from '@/schemas';

const UserManagement: React.FC = () => {
  useDocumentTitle('用户管理');

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // 创建表单验证器
  const createValidator = createAntdFormValidator(CreateUserRequestSchema);
  const updateValidator = createAntdFormValidator(UpdateUserRequestSchema);

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      message.error('获取用户列表失败');
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await userService.deleteUser(userId);
      if (response.success) {
        message.success('用户删除成功');
        fetchUsers(); // 重新获取列表
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      message.error('删除用户失败');
      console.error('Delete user error:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        // 编辑用户 - 使用 zod 验证
        const validator = updateValidator;
        const validatedData = await validator.validateBeforeSubmit({
          ...values,
          id: editingUser.id
        } as UpdateUserRequest);
        
        const response = await userService.updateUser(editingUser.id, validatedData);
        if (response.success) {
          message.success('用户更新成功');
        } else {
          message.error(response.message || '更新失败');
        }
      } else {
        // 添加用户 - 使用 zod 验证
        const validator = createValidator;
        const validatedData = await validator.validateBeforeSubmit(values as CreateUserRequest);
        
        const response = await userService.createUser(validatedData);
        if (response.success) {
          message.success('用户添加成功');
        } else {
          message.error(response.message || '添加失败');
        }
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers(); // 重新获取列表
    } catch (error) {
      console.error('Submit user error:', error);
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : role === 'manager' ? 'orange' : 'blue'}>
          {role === 'admin' ? '管理员' : role === 'manager' ? '管理者' : role === 'user' ? '普通用户' : '访客'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '激活' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 根据编辑状态选择验证器
  const currentValidator = editingUser ? updateValidator : createValidator;

  return (
    <Spin spinning={loading}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h1>用户管理</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加用户
          </Button>
        </div>

        <Table
          dataSource={users.map(user => ({ ...user, key: user.id }))}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />

        <Modal
          title={editingUser ? '编辑用户' : '添加用户'}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={() => setIsModalVisible(false)}
          okText="确定"
          cancelText="取消"
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ status: 'active', role: 'user' }}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={currentValidator.getAntdRules('username')}
              extra="3-20个字符，只能包含字母、数字和下划线"
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              label="邮箱"
              name="email"
              rules={currentValidator.getAntdRules('email')}
            >
              <Input />
            </Form.Item>

            {!editingUser && (
              <Form.Item
                label="密码"
                name="password"
                rules={createValidator.getAntdRules('password')}
                extra="至少8个字符，包含大小写字母、数字和特殊字符"
              >
                <Input.Password />
              </Form.Item>
            )}
            
            <Form.Item
              label="角色"
              name="role"
              rules={currentValidator.getAntdRules('role')}
            >
              <Select>
                <Select.Option value="guest">访客</Select.Option>
                <Select.Option value="user">普通用户</Select.Option>
                <Select.Option value="manager">管理者</Select.Option>
                <Select.Option value="admin">管理员</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              label="状态"
              name="status"
              rules={currentValidator.getAntdRules('status')}
            >
              <Select>
                <Select.Option value="active">激活</Select.Option>
                <Select.Option value="inactive">禁用</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="手机号"
              name="phone"
              rules={currentValidator.getAntdRules('phone')}
            >
              <Input placeholder="可选" />
            </Form.Item>

            <Form.Item
              label="真实姓名"
              name="realName"
              rules={currentValidator.getAntdRules('realName')}
            >
              <Input placeholder="可选" />
            </Form.Item>

            <Form.Item
              label="部门"
              name="department"
              rules={currentValidator.getAntdRules('department')}
            >
              <Input placeholder="可选" />
            </Form.Item>

            <Form.Item
              label="职位"
              name="position"
              rules={currentValidator.getAntdRules('position')}
            >
              <Input placeholder="可选" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default UserManagement;