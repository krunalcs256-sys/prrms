import { LogoutOutlined, MedicineBoxOutlined, ShareAltOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import NotificationBell from './NotificationBell';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/patients', icon: <MedicineBoxOutlined />, label: 'Patients' },
  { key: '/referrals', icon: <ShareAltOutlined />, label: 'Referrals' },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" breakpoint="lg" collapsedWidth={0}>
        <div style={{ padding: '20px 16px 12px', textAlign: 'center' }}>
          <Typography.Title level={5} style={{ color: 'white', margin: 0 }}>
            PRRMS
          </Typography.Title>
          <Typography.Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
            Patient Referral System
          </Typography.Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 24px',
            background: '#1677ff',
            gap: 8,
          }}
        >
          <NotificationBell />
          <Avatar size="small" icon={<UserOutlined />} style={{ background: 'rgba(255,255,255,0.2)' }} />
          <Typography.Text style={{ color: 'white' }}>{user?.name}</Typography.Text>
          {user?.department && (
            <Typography.Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>
              ({user.department})
            </Typography.Text>
          )}
          <LogoutOutlined
            style={{ color: 'white', cursor: 'pointer', fontSize: 16, marginLeft: 8 }}
            title="Logout"
            onClick={handleLogout}
          />
        </Header>

        <Content style={{ margin: 24, minHeight: 'calc(100vh - 112px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
