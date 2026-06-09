import {
  ClearOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { useState } from 'react';
import { getDoctors } from '../../api/doctors';
import { createPatient, getPatientById, getPatients } from '../../api/patients';
import type { GetPatientsParams } from '../../api/patients';
import { bulkRefer } from '../../api/referrals';
import type { BulkReferralRequest, CreatePatientRequest, PatientResponse } from '../../types';

const { RangePicker } = DatePicker;

const FILTER_DEPARTMENT_OPTIONS = [
  { label: 'General', value: 'GENERAL' },
  { label: 'Gynecology', value: 'GYNECOLOGY' },
  { label: 'Cardiology', value: 'CARDIOLOGY' },
  { label: 'Neurology', value: 'NEUROLOGY' },
  { label: 'Orthopedics', value: 'ORTHOPEDICS' },
  { label: 'Pediatrics', value: 'PEDIATRICS' },
  { label: 'Oncology', value: 'ONCOLOGY' },
  { label: 'Radiology', value: 'RADIOLOGY' },
  { label: 'Surgery', value: 'SURGERY' },
];

const STATUS_OPTIONS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Referred for Review', value: 'REFERRED_FOR_REVIEW' },
  { label: 'Discharged', value: 'DISCHARGED' },
];

const GENDER_OPTIONS = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' },
];

const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Urgent', value: 'URGENT' },
];

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'green',
  REFERRED_FOR_REVIEW: 'orange',
  DISCHARGED: 'default',
};

export default function PatientsPage() {
  const qc = useQueryClient();
  const [filterForm] = Form.useForm();
  const [referForm] = Form.useForm();
  const [addForm] = Form.useForm();

  const [filters, setFilters] = useState<GetPatientsParams>({ name: '', page: 0, size: 20 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<PatientResponse[]>([]);
  const [referModalOpen, setReferModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewPatientId, setViewPatientId] = useState<number | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ['patients', filters],
    queryFn: () => getPatients(filters),
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
    enabled: referModalOpen,
  });

  const { data: patientDetail, isFetching: detailLoading } = useQuery({
    queryKey: ['patient', viewPatientId],
    queryFn: () => getPatientById(viewPatientId!),
    enabled: viewPatientId !== null,
  });

  const referMutation = useMutation({
    mutationFn: bulkRefer,
    onSuccess: (res) => {
      message.success(res.message || `${res.totalReferred} referral(s) created successfully`);
      setReferModalOpen(false);
      referForm.resetFields();
      setSelectedRowKeys([]);
      setSelectedPatients([]);
      qc.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to create referrals';
      message.error(msg);
    },
  });

  const addMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      message.success('Patient created successfully');
      setAddModalOpen(false);
      addForm.resetFields();
      qc.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to create patient';
      message.error(msg);
    },
  });

  const rowSelection: TableRowSelection<PatientResponse> = {
    selectedRowKeys,
    onChange: (keys, rows) => {
      setSelectedRowKeys(keys);
      setSelectedPatients(rows);
    },
  };

  const handleFilter = (values: {
    name?: string;
    department?: string;
    status?: string;
    dateRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
  }) => {
    const [from, to] = values.dateRange ?? [undefined, undefined];
    setFilters({
      name: values.name ?? '',
      department: values.department,
      status: values.status,
      fromDate: from ? from.format('YYYY-MM-DD') : undefined,
      toDate: to ? to.format('YYYY-MM-DD') : undefined,
      page: 0,
      size: filters.size ?? 20,
    });
  };

  const handleClear = () => {
    filterForm.resetFields();
    setFilters({ name: '', page: 0, size: 20 });
  };

  const handleReferSubmit = (values: {
    targetDoctorId: number;
    priority: string;
    remarks?: string;
  }) => {
    const targetDoctor = doctors.find((d) => d.id === values.targetDoctorId);
    const payload: BulkReferralRequest = {
      patientIds: selectedPatients.map((p) => p.id),
      targetDoctorId: values.targetDoctorId,
      targetDoctorName: targetDoctor?.name ?? String(values.targetDoctorId),
      priority: values.priority as 'NORMAL' | 'URGENT',
      remarks: values.remarks,
    };
    referMutation.mutate(payload);
  };

  const handleAddSubmit = (values: {
    uhid: string;
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    encounterId: string;
    department: string;
    appointmentDate: dayjs.Dayjs;
  }) => {
    const payload: CreatePatientRequest = {
      ...values,
      appointmentDate: values.appointmentDate.format('YYYY-MM-DD'),
    };
    addMutation.mutate(payload);
  };

  const closeReferModal = () => {
    setReferModalOpen(false);
    referForm.resetFields();
  };

  const columns: ColumnsType<PatientResponse> = [
    { title: 'UHID', dataIndex: 'uhid', width: 120, fixed: 'left' },
    { title: 'Name', dataIndex: 'name', width: 150 },
    { title: 'Age', dataIndex: 'age', width: 60, align: 'center' },
    { title: 'Gender', dataIndex: 'gender', width: 90 },
    {
      title: 'Department',
      dataIndex: 'department',
      width: 130,
      render: (d: string) =>
        FILTER_DEPARTMENT_OPTIONS.find((o) => o.value === d)?.label ?? d,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 170,
      render: (s: string) => (
        <Tag color={STATUS_COLOR[s] ?? 'default'}>{s.replace(/_/g, ' ')}</Tag>
      ),
    },
    { title: 'Assigned Doctor', dataIndex: 'assignedDoctorName', width: 160 },
    {
      title: 'Appointment Date',
      dataIndex: 'appointmentDate',
      width: 145,
      render: (d: string) => (d ? dayjs(d).format('DD MMM YYYY') : '—'),
    },
    { title: 'Encounter ID', dataIndex: 'encounterId', width: 140 },
    {
      title: '',
      key: 'view',
      width: 60,
      fixed: 'right' as const,
      render: (_: unknown, record: PatientResponse) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={(e) => { e.stopPropagation(); setViewPatientId(record.id); }}
        />
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Card bodyStyle={{ paddingBottom: 12 }}>
        <Form form={filterForm} layout="inline" onFinish={handleFilter} style={{ gap: 8 }}>
          <Form.Item name="name" style={{ marginBottom: 8 }}>
            <Input
              placeholder="Search patient name"
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 210 }}
            />
          </Form.Item>
          <Form.Item name="department" style={{ marginBottom: 8 }}>
            <Select
              placeholder="Department"
              options={FILTER_DEPARTMENT_OPTIONS}
              allowClear
              style={{ width: 150 }}
            />
          </Form.Item>
          <Form.Item name="status" style={{ marginBottom: 8 }}>
            <Select
              placeholder="Status"
              options={STATUS_OPTIONS}
              allowClear
              style={{ width: 185 }}
            />
          </Form.Item>
          <Form.Item name="dateRange" style={{ marginBottom: 8 }}>
            <RangePicker format="DD MMM YYYY" placeholder={['From date', 'To date']} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                Search
              </Button>
              <Button icon={<ClearOutlined />} onClick={handleClear}>
                Clear
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title={
          <Space>
            <Typography.Text strong>Patients</Typography.Text>
            {selectedRowKeys.length > 0 && (
              <Tag color="blue">{selectedRowKeys.length} selected</Tag>
            )}
          </Space>
        }
        extra={
          <Space>
            <Button
              icon={<PlusOutlined />}
              onClick={() => setAddModalOpen(true)}
            >
              Add Patient
            </Button>
            <Button
              type="primary"
              icon={<ShareAltOutlined />}
              disabled={selectedRowKeys.length === 0}
              onClick={() => setReferModalOpen(true)}
            >
              Refer Selected ({selectedRowKeys.length})
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data?.content ?? []}
          rowSelection={rowSelection}
          loading={isFetching}
          scroll={{ x: 1260 }}
          pagination={{
            total: data?.totalElements ?? 0,
            pageSize: filters.size ?? 20,
            current: (filters.page ?? 0) + 1,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
            showTotal: (total) => `Total ${total} patients`,
            onChange: (page, size) =>
              setFilters((prev) => ({ ...prev, page: page - 1, size })),
          }}
        />
      </Card>

      {/* Patient detail drawer */}
      <Drawer
        title={patientDetail ? `${patientDetail.name} — ${patientDetail.uhid}` : 'Patient Details'}
        open={viewPatientId !== null}
        onClose={() => setViewPatientId(null)}
        width={480}
        loading={detailLoading}
      >
        {patientDetail && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="UHID">{patientDetail.uhid}</Descriptions.Item>
            <Descriptions.Item label="Name">{patientDetail.name}</Descriptions.Item>
            <Descriptions.Item label="Age">{patientDetail.age}</Descriptions.Item>
            <Descriptions.Item label="Gender">{patientDetail.gender}</Descriptions.Item>
            <Descriptions.Item label="Department">
              {FILTER_DEPARTMENT_OPTIONS.find((o) => o.value === patientDetail.department)?.label ??
                patientDetail.department}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={STATUS_COLOR[patientDetail.status] ?? 'default'}>
                {patientDetail.status.replace(/_/g, ' ')}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Encounter ID">{patientDetail.encounterId}</Descriptions.Item>
            <Descriptions.Item label="Assigned Doctor">
              {patientDetail.assignedDoctorName}
            </Descriptions.Item>
            <Descriptions.Item label="Appointment Date">
              {patientDetail.appointmentDate ? dayjs(patientDetail.appointmentDate).format('DD MMM YYYY') : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Registered On">
              {dayjs(patientDetail.createdAt).format('DD MMM YYYY, HH:mm')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      {/* Add Patient modal */}
      <Modal
        title="Add New Patient"
        open={addModalOpen}
        onCancel={() => { setAddModalOpen(false); addForm.resetFields(); }}
        footer={null}
        width={520}
        destroyOnClose
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddSubmit} style={{ marginTop: 8 }}>
          <Form.Item
            name="uhid"
            label="UHID"
            rules={[
              { required: true, message: 'UHID is required' },
              { pattern: /^\d{10}$/, message: 'UHID must be exactly 10 digits' },
            ]}
          >
            <Input placeholder="e.g. 1000000001" maxLength={10} />
          </Form.Item>

          <Form.Item
            name="name"
            label="Patient Name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder="Full name" />
          </Form.Item>

          <Space style={{ width: '100%' }} size="middle">
            <Form.Item
              name="age"
              label="Age"
              rules={[{ required: true, message: 'Age is required' }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={0} max={150} style={{ width: '100%' }} placeholder="0–150" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Gender is required' }]}
              style={{ flex: 1 }}
            >
              <Select options={GENDER_OPTIONS} placeholder="Select gender" />
            </Form.Item>
          </Space>

          <Form.Item
            name="encounterId"
            label="Encounter ID"
            rules={[{ required: true, message: 'Encounter ID is required' }]}
          >
            <Input placeholder="e.g. ENC20250001" />
          </Form.Item>

          <Space style={{ width: '100%' }} size="middle">
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: 'Department is required' }]}
              style={{ flex: 1 }}
            >
              <Select options={FILTER_DEPARTMENT_OPTIONS} placeholder="Select department" />
            </Form.Item>

            <Form.Item
              name="appointmentDate"
              label="Appointment Date"
              rules={[{ required: true, message: 'Appointment date is required' }]}
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
            </Form.Item>
          </Space>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => { setAddModalOpen(false); addForm.resetFields(); }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={addMutation.isPending}>
                Create Patient
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Refer patients modal */}
      <Modal
        title="Create Referral"
        open={referModalOpen}
        onCancel={closeReferModal}
        footer={null}
        width={500}
        destroyOnClose
      >
        <div style={{ marginBottom: 16, padding: '12px', background: '#f5f5f5', borderRadius: 8 }}>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Referring {selectedPatients.length} patient(s):
          </Typography.Text>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {selectedPatients.slice(0, 5).map((p) => (
              <Tag key={p.id}>
                {p.name} <Typography.Text type="secondary">({p.uhid})</Typography.Text>
              </Tag>
            ))}
            {selectedPatients.length > 5 && (
              <Tag color="blue">+{selectedPatients.length - 5} more</Tag>
            )}
          </div>
        </div>

        <Form form={referForm} layout="vertical" onFinish={handleReferSubmit}>
          <Form.Item
            name="targetDoctorId"
            label="Refer To Doctor"
            rules={[{ required: true, message: 'Please select a doctor' }]}
          >
            <Select
              placeholder="Select doctor"
              showSearch
              options={doctors.map((d) => ({
                label: `${d.name}${d.department ? ` — ${d.department}` : ''}`,
                value: d.id,
              }))}
              filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            initialValue="LOW"
            rules={[{ required: true }]}
          >
            <Select options={PRIORITY_OPTIONS} />
          </Form.Item>

          <Form.Item name="remarks" label="Remarks (optional)">
            <Input.TextArea rows={3} placeholder="Add any clinical notes..." />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={closeReferModal}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={referMutation.isPending}>
                Create Referral
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}