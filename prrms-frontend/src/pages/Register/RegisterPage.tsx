import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Select, Typography, message } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';

const DEPARTMENT_OPTIONS = [
  { label: 'General', value: 'GENERAL' },
  { label: 'Cardiology', value: 'CARDIOLOGY' },
  { label: 'Neurology', value: 'NEUROLOGY' },
  { label: 'Orthopedics', value: 'ORTHOPEDICS' },
  { label: 'Gynecology', value: 'GYNECOLOGY' },
  { label: 'Pediatrics', value: 'PEDIATRICS' },
  { label: 'Oncology', value: 'ONCOLOGY' },
  { label: 'Radiology', value: 'RADIOLOGY' },
  { label: 'Surgery', value: 'SURGERY' },
];

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'DOCTOR' | 'ADMIN';
  department?: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'DOCTOR' | 'ADMIN'>('DOCTOR');
  const [form] = Form.useForm<FormValues>();

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      const user = await register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        department: values.role === 'DOCTOR' ? values.department : null,
      });
      setUser(user);
      message.success('Registration successful');
      navigate('/patients');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e6f0ff 0%, #f0f2f5 100%)',
      }}
    >
      <Card style={{ width: 440, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Typography.Title level={3} style={{ marginBottom: 4 }}>
            Create Account
          </Typography.Title>
          <Typography.Text type="secondary">
            Patient Referral &amp; Record Management System
          </Typography.Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Full name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Enter a valid email address' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Email address"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Password is required' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Password (min 6 characters)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Confirm password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="role"
            initialValue="DOCTOR"
            rules={[{ required: true }]}
          >
            <Select
              size="large"
              options={[
                { label: 'Doctor', value: 'DOCTOR' },
                { label: 'Admin', value: 'ADMIN' },
              ]}
              onChange={(val) => {
                setRole(val);
                if (val === 'ADMIN') form.setFieldValue('department', undefined);
              }}
            />
          </Form.Item>

          {role === 'DOCTOR' && (
            <Form.Item
              name="department"
              rules={[{ required: true, message: 'Department is required for doctors' }]}
            >
              <Select
                size="large"
                placeholder="Select department"
                options={DEPARTMENT_OPTIONS}
              />
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Register
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Typography.Text type="secondary">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}