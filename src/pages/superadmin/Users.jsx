import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
// Button removed: no action buttons on Users table
import { getUsers } from '@/services/superadminApi';
import { Shield, Users as UsersIcon, User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await getUsers(page, 10, search, roleFilter);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'SUPERADMIN', label: 'Super Admin' },
    { value: 'EVENT_ADMIN', label: 'Event Admin' },
    { value: 'SCAN_STAFF', label: 'Scan Staff' },
    { value: 'CUSTOMER', label: 'Customer' },
  ];

  // status changes are managed in Event Admins; no status action here

  const roleIcons = {
    SUPERADMIN: <Shield className="h-4 w-4" />,
    EVENT_ADMIN: <UsersIcon className="h-4 w-4" />,
    SCAN_STAFF: <User className="h-4 w-4" />,
    CUSTOMER: <User className="h-4 w-4" />,
  };

  const columns = [
    {
      key: 'fullName',
      label: 'Name',
      render: (row) => (
        <div className="flex items-center gap-2">
          {roleIcons[row.role]}
          {row.fullName}
        </div>
      ),
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];


  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage platform users"
      />

        {/* Role filter (placed above search) */}
        <div>
          <Select value={roleFilter} onValueChange={(value) => { setRoleFilter(value); setPage(1); }}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable columns={columns} data={users} loading={false} />
      )}
    </div>
  );
}
