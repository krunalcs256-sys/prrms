import { BellFilled, CheckOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge, Button, Drawer, Empty, List, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import * as notificationApi from '../api/notifications';

dayjs.extend(relativeTime);

const BELL_RING_CSS = `
@keyframes bell-ring {
  0%   { transform: rotate(0deg); }
  8%   { transform: rotate(16deg); }
  16%  { transform: rotate(-14deg); }
  24%  { transform: rotate(12deg); }
  32%  { transform: rotate(-10deg); }
  40%  { transform: rotate(7deg); }
  48%  { transform: rotate(-4deg); }
  56%  { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}
@keyframes badge-pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.25); }
}
`;

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationApi.getUnreadCount,
    refetchInterval: 30_000,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: notificationApi.getNotifications,
    enabled: open,
  });

  const markRead = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAll = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const hasUnread = unreadCount > 0;

  return (
    <>
      <style>{BELL_RING_CSS}</style>

      <Badge
        count={unreadCount}
        overflowCount={99}
        offset={[-4, 4]}
        styles={{
          indicator: {
            animation: hasUnread ? 'badge-pulse 2s ease-in-out infinite' : 'none',
            boxShadow: '0 0 0 2px #1677ff',
          },
        }}
      >
        <Button
          type="text"
          onClick={() => setOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 10,
            background: hasUnread ? 'rgba(255,255,255,0.15)' : 'transparent',
            transition: 'background 0.2s',
          }}
          icon={
            <BellFilled
              style={{
                fontSize: 20,
                color: 'white',
                display: 'block',
                transformOrigin: 'top center',
                animation: hasUnread ? 'bell-ring 3s ease 1s infinite' : 'none',
              }}
            />
          }
        />
      </Badge>

      <Drawer
        title={
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <BellFilled style={{ color: '#1677ff' }} />
              <span>Notifications</span>
              {hasUnread && (
                <Badge
                  count={unreadCount}
                  overflowCount={99}
                  style={{ background: '#ff4d4f' }}
                />
              )}
            </Space>
            {hasUnread && (
              <Button
                size="small"
                type="link"
                onClick={() => markAll.mutate()}
                loading={markAll.isPending}
                style={{ padding: 0 }}
              >
                Mark all read
              </Button>
            )}
          </Space>
        }
        onClose={() => setOpen(false)}
        open={open}
        width={390}
      >
        {notifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="You're all caught up!"
            style={{ marginTop: 48 }}
          />
        ) : (
          <List
            dataSource={notifications}
            renderItem={(n) => (
              <List.Item
                style={{
                  alignItems: 'flex-start',
                  padding: '12px 4px',
                  borderRadius: 8,
                  background: n.isRead ? 'transparent' : 'rgba(22,119,255,0.04)',
                  marginBottom: 4,
                  opacity: n.isRead ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                }}
                extra={
                  !n.isRead && (
                    <Button
                      size="small"
                      type="text"
                      icon={<CheckOutlined style={{ color: '#52c41a' }} />}
                      title="Mark as read"
                      onClick={() => markRead.mutate(n.id)}
                    />
                  )
                }
              >
                <List.Item.Meta
                  avatar={
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: n.isRead ? 'transparent' : '#1677ff',
                        marginTop: 6,
                        flexShrink: 0,
                      }}
                    />
                  }
                  title={
                    <Typography.Text style={{ fontWeight: n.isRead ? 400 : 600, fontSize: 13 }}>
                      {n.message}
                    </Typography.Text>
                  }
                  description={
                    <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                      {dayjs(n.createdAt).fromNow()}
                    </Typography.Text>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </>
  );
}
