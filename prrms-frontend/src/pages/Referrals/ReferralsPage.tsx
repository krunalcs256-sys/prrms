import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Popconfirm, Space, Table, Tabs, Tag, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useState } from 'react';
import { getIncoming, getOutgoing, updateReferralStatus } from '../../api/referrals';
import type { ReferralResponse } from '../../types';

const PRIORITY_COLOR: Record<string, string> = {
  NORMAL: 'blue',
  URGENT: 'red',
};

const STATUS_COLOR: Record<string, string> = {
  PENDING_REVIEW: 'orange',
  ACCEPTED: 'blue',
  REJECTED: 'default',
  COMPLETED: 'green',
};

function OutgoingTable() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  const { data, isFetching } = useQuery({
    queryKey: ['referrals', 'outgoing', page, size],
    queryFn: () => getOutgoing(page, size),
  });

  const columns: ColumnsType<ReferralResponse> = [
    { title: 'Patient', dataIndex: 'patientName', width: 150 },
    { title: 'UHID', dataIndex: 'patientUhid', width: 120 },
    { title: 'Encounter ID', dataIndex: 'encounterId', width: 140 },
    { title: 'Referred To', dataIndex: 'targetDoctorName', width: 160 },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      width: 200,
      ellipsis: true,
      render: (r: string) => r || '—',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      width: 100,
      render: (p: string) => <Tag color={PRIORITY_COLOR[p] ?? 'default'}>{p}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 155,
      render: (s: string) => (
        <Tag color={STATUS_COLOR[s] ?? 'default'}>{s.replace(/_/g, ' ')}</Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      width: 160,
      render: (d: string) => dayjs(d).format('DD MMM YYYY, HH:mm'),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data?.content ?? []}
      loading={isFetching}
      scroll={{ x: 1100 }}
      pagination={{
        total: data?.totalElements ?? 0,
        pageSize: size,
        current: page + 1,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50],
        showTotal: (total) => `Total ${total} referrals`,
        onChange: (p, s) => { setPage(p - 1); setSize(s); },
      }}
    />
  );
}

function IncomingTable() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  const { data, isFetching } = useQuery({
    queryKey: ['referrals', 'incoming', page, size],
    queryFn: () => getIncoming(page, size),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED' }) =>
      updateReferralStatus(id, status),
    onSuccess: (_, vars) => {
      const label = vars.status === 'ACCEPTED' ? 'accepted' : vars.status === 'REJECTED' ? 'rejected' : 'completed';
      message.success(`Referral ${label}`);
      qc.invalidateQueries({ queryKey: ['referrals'] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update referral';
      message.error(msg);
    },
  });

  const columns: ColumnsType<ReferralResponse> = [
    { title: 'Patient', dataIndex: 'patientName', width: 150 },
    { title: 'UHID', dataIndex: 'patientUhid', width: 120 },
    { title: 'Encounter ID', dataIndex: 'encounterId', width: 140 },
    { title: 'Referred By', dataIndex: 'sourceDoctorName', width: 160 },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      width: 200,
      ellipsis: true,
      render: (r: string) => r || '—',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      width: 100,
      render: (p: string) => <Tag color={PRIORITY_COLOR[p] ?? 'default'}>{p}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 155,
      render: (s: string) => (
        <Tag color={STATUS_COLOR[s] ?? 'default'}>{s.replace(/_/g, ' ')}</Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      width: 160,
      render: (d: string) => dayjs(d).format('DD MMM YYYY, HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => {
        if (record.status === 'PENDING_REVIEW') {
          return (
            <Space size="small">
              <Popconfirm
                title="Accept this referral?"
                onConfirm={() => statusMutation.mutate({ id: record.id, status: 'ACCEPTED' })}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  size="small"
                  type="primary"
                  loading={statusMutation.isPending}
                >
                  Accept
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Reject this referral?"
                onConfirm={() => statusMutation.mutate({ id: record.id, status: 'REJECTED' })}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button size="small" danger loading={statusMutation.isPending}>
                  Reject
                </Button>
              </Popconfirm>
            </Space>
          );
        }
        if (record.status === 'ACCEPTED') {
          return (
            <Popconfirm
              title="Mark this referral as completed?"
              onConfirm={() => statusMutation.mutate({ id: record.id, status: 'COMPLETED' })}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" type="primary" ghost loading={statusMutation.isPending}>
                Complete
              </Button>
            </Popconfirm>
          );
        }
        return null;
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data?.content ?? []}
      loading={isFetching}
      scroll={{ x: 1300 }}
      pagination={{
        total: data?.totalElements ?? 0,
        pageSize: size,
        current: page + 1,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50],
        showTotal: (total) => `Total ${total} referrals`,
        onChange: (p, s) => { setPage(p - 1); setSize(s); },
      }}
    />
  );
}

export default function ReferralsPage() {
  return (
    <Card
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          Referrals
        </Typography.Title>
      }
    >
      <Tabs
        items={[
          { key: 'outgoing', label: 'Outgoing', children: <OutgoingTable /> },
          { key: 'incoming', label: 'Incoming', children: <IncomingTable /> },
        ]}
      />
    </Card>
  );
}