import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Tag,
  Upload,
  Image,
  Spin,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { Product } from '@/types';
import { productService } from '@/services';
import { createAntdFormValidator } from '@/utils';
import { CreateProductRequestSchema, UpdateProductRequestSchema } from '@/schemas';
import type { CreateProductRequest, UpdateProductRequest } from '@/schemas';

const ProductManagement: React.FC = () => {
  useDocumentTitle('产品管理');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  // 创建表单验证器
  const createValidator = createAntdFormValidator(CreateProductRequestSchema);
  const updateValidator = createAntdFormValidator(UpdateProductRequestSchema);

  // 获取产品列表
  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      message.error('获取产品列表失败');
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      const response = await productService.deleteProduct(productId);
      if (response.success) {
        message.success('产品删除成功');
        fetchProducts(); // 重新获取列表
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      message.error('删除产品失败');
      console.error('Delete product error:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingProduct) {
        // 编辑产品
        const response = await productService.updateProduct(editingProduct.id, values);
        if (response.success) {
          message.success('产品更新成功');
        } else {
          message.error(response.message || '更新失败');
        }
      } else {
        // 添加产品
        const response = await productService.createProduct(values);
        if (response.success) {
          message.success('产品添加成功');
        } else {
          message.error(response.message || '添加失败');
        }
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchProducts(); // 重新获取列表
    } catch (error) {
      console.error('Submit product error:', error);
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  };

  const columns = [
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image: string) => (
        <Image
          width={50}
          height={50}
          src={image}
          alt="产品图片"
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price}`,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <span style={{ color: stock === 0 ? 'red' : stock < 10 ? 'orange' : 'green' }}>
          {stock}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'available' ? 'green' : 'red'}>
          {status === 'available' ? '上架' : '下架'}
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
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个产品吗？"
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
  const currentValidator = editingProduct ? updateValidator : createValidator;

  return (
    <Spin spinning={loading}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h1>产品管理</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加产品
          </Button>
        </div>

        <Table
          dataSource={products.map(product => ({ ...product, key: product.id }))}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />

        <Modal
          title={editingProduct ? '编辑产品' : '添加产品'}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={() => setIsModalVisible(false)}
          okText="确定"
          cancelText="取消"
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ status: 'available', stock: 0, price: 0 }}
          >
            <Form.Item
              label="产品名称"
              name="name"
              rules={currentValidator.getAntdRules('name')}
              extra="1-100个字符"
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              label="分类"
              name="category"
              rules={currentValidator.getAntdRules('category')}
            >
              <Select>
                <Select.Option value="手机">手机</Select.Option>
                <Select.Option value="电脑">电脑</Select.Option>
                <Select.Option value="平板">平板</Select.Option>
                <Select.Option value="配件">配件</Select.Option>
                <Select.Option value="其他">其他</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              label="价格"
              name="price"
              rules={currentValidator.getAntdRules('price')}
              extra="价格范围：0-999999.99"
            >
              <InputNumber
                min={0}
                max={999999.99}
                precision={2}
                style={{ width: '100%' }}
                placeholder="请输入价格"
                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value: string | undefined) => {
                  if (!value) return 0;
                  return parseFloat(value.replace(/¥\s?|(,*)/g, '')) || 0;
                }}
              />
            </Form.Item>
            
            <Form.Item
              label="库存"
              name="stock"
              rules={currentValidator.getAntdRules('stock')}
              extra="库存数量必须为非负整数"
            >
              <InputNumber
                min={0}
                precision={0}
                style={{ width: '100%' }}
                placeholder="请输入库存数量"
              />
            </Form.Item>
            
            <Form.Item
              label="状态"
              name="status"
              rules={currentValidator.getAntdRules('status')}
            >
              <Select>
                <Select.Option value="available">上架</Select.Option>
                <Select.Option value="unavailable">下架</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              label="图片URL"
              name="image"
              rules={currentValidator.getAntdRules('image')}
              extra="请输入有效的图片URL（可选）"
            >
              <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>
            
            <Form.Item
              label="产品描述"
              name="description"
              rules={currentValidator.getAntdRules('description')}
              extra="描述不超过1000个字符（可选）"
            >
              <Input.TextArea 
                rows={4} 
                placeholder="请输入产品描述" 
                showCount
                maxLength={1000}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default ProductManagement;