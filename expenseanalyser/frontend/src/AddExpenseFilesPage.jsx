import React, { useEffect, useState } from 'react';
import apiClient from './apiClient.js';

function AddExpenseFilesPage() {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [expenseFiles, setExpenseFiles] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState('Bank Account');

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/users');
      setUsers(res.data);
    } catch (e) {
      setError('Failed to load users');
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await apiClient.get('/accounts');
      setAccounts(res.data);
    } catch (e) {
      setError('Failed to load accounts');
    }
  };

  const fetchExpenseFiles = async () => {
    try {
      const res = await apiClient.get('/expense-files');
      setExpenseFiles(res.data);
    } catch (e) {
      setError('Failed to load uploaded files');
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchUsers(), fetchAccounts(), fetchExpenseFiles()]).finally(() => setLoading(false));
  }, []);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!newAccountName.trim()) return;
    try {
      const res = await apiClient.post('/accounts', {
        accountName: newAccountName.trim(),
        accountType: newAccountType
      });
      setAccounts((prev) => [...prev, res.data]);
      setSelectedAccountId(String(res.data.id));
      setShowAccountModal(false);
      setNewAccountName('');
      setNewAccountType('Bank Account');
    } catch (e) {
      setError('Failed to create account');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!selectedUserId || !selectedAccountId) {
      setError('Please select User and Account');
      return;
    }
    if (!file) {
      setError('Please select a file (.csv or .xlsx)');
      return;
    }
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'csv' && ext !== 'xlsx') {
      setError('Only .csv and .xlsx files are allowed');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', selectedUserId);
      formData.append('accountId', selectedAccountId);
      await apiClient.post('/expense-files/upload', formData);
      setSuccess(`File "${file.name}" uploaded successfully.`);
      setFile(null);
      await fetchExpenseFiles();
    } catch (e) {
      setError(e.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = typeof dateStr === 'string' ? dateStr : dateStr;
    return d.slice(0, 19).replace('T', ' ');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await apiClient.delete(`/expense-files/${id}`);
      await fetchExpenseFiles();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete file');
    }
  };

  const handleDownload = async (id, fileName) => {
    setError('');
    try {
      const res = await apiClient.get(`/expense-files/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', fileName || 'download');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (e) {
      if (e.response?.status === 404 && e.response?.data instanceof Blob) {
        try {
          const text = await e.response.data.text();
          const json = JSON.parse(text);
          if (json.code === 'FILE_MISSING') {
            const remove = window.confirm(
              'File no longer exists on server. Do you want to remove this record?'
            );
            if (remove) {
              await apiClient.delete(`/expense-files/${id}`);
              await fetchExpenseFiles();
            }
            return;
          }
        } catch (_) {}
      }
      setError(e.response?.data?.message || 'Download failed');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="employees-page">
      <div className="page-header">
        <h2>Add Expense Files</h2>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner" style={{ background: '#d4edda', color: '#155724', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{success}</div>}

      <form onSubmit={handleUpload} className="modal-form" style={{ maxWidth: '480px', marginBottom: '2rem' }}>
        <div className="form-group">
          <label htmlFor="user">User</label>
          <select
            id="user"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="account">Account</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select
              id="account"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              required
              style={{ flex: 1 }}
            >
              <option value="">Select account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.accountName} ({a.accountType})</option>
              ))}
            </select>
            <button type="button" className="secondary-button" onClick={() => setShowAccountModal(true)}>
              + New
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="file">File (.csv or .xlsx)</label>
          <input
            id="file"
            type="file"
            accept=".csv,.xlsx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        <div className="modal-actions">
          <button type="submit" className="primary-button" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Uploaded Files</h3>
      {expenseFiles.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No files uploaded yet.</p>
      ) : (
        <table className="employees-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>User</th>
              <th>Account</th>
              <th>Uploaded At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenseFiles.map((f) => (
              <tr key={f.id}>
                <td>{f.fileName}</td>
                <td>{f.userName ?? '—'}</td>
                <td>{f.accountName ?? '—'}</td>
                <td>{formatDate(f.uploadedAt)}</td>
                <td>
                  <button
                    className="secondary-button"
                    onClick={() => handleDownload(f.id, f.fileName)}
                  >
                    Download
                  </button>
                  <button className="danger-button" onClick={() => handleDelete(f.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAccountModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New Account</h3>
              <button className="icon-button" onClick={() => setShowAccountModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateAccount} className="modal-form">
              <div className="form-group">
                <label htmlFor="accountName">Account Name</label>
                <input
                  id="accountName"
                  type="text"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="e.g. HDFC Credit Card, ICICI Savings"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="accountType">Account Type</label>
                <select
                  id="accountType"
                  value={newAccountType}
                  onChange={(e) => setNewAccountType(e.target.value)}
                >
                  <option value="Bank Account">Bank Account</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setShowAccountModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddExpenseFilesPage;
