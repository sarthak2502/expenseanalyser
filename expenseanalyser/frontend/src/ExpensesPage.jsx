import React, { useEffect, useState } from 'react';
import apiClient from './apiClient.js';

const initialFormState = {
  id: null,
  title: '',
  amount: '',
  category: '',
  expenseDate: ''
};

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get('/expenses');
      setExpenses(response.data);
    } catch (e) {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const openCreateModal = () => {
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (expense) => {
    setFormData({
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      expenseDate: expense.expenseDate || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        expenseDate: formData.expenseDate
      };

      if (formData.id) {
        await apiClient.put(`/expenses/${formData.id}`, payload);
      } else {
        await apiClient.post('/expenses', payload);
      }

      await fetchExpenses();
      closeModal();
    } catch (e) {
      setError('Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this expense?');
    if (!confirmed) return;

    try {
      await apiClient.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (e) {
      setError('Failed to delete expense');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = typeof dateStr === 'string' ? dateStr : dateStr;
    return d.slice(0, 10);
  };

  return (
    <div className="employees-page">
      <div className="page-header">
        <h2>All Expenses</h2>
        <button className="primary-button" onClick={openCreateModal}>
          + Add Expense
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div>Loading expenses...</div>
      ) : (
        <table className="employees-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Expense Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No expenses found.
                </td>
              </tr>
            ) : (
              expenses.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.title}</td>
                  <td>{exp.category}</td>
                  <td>{exp.amount != null ? Number(exp.amount).toFixed(2) : ''}</td>
                  <td>{formatDate(exp.expenseDate)}</td>
                  <td>
                    <button className="secondary-button" onClick={() => openEditModal(exp)}>
                      Edit
                    </button>
                    <button className="danger-button" onClick={() => handleDelete(exp.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>{formData.id ? 'Edit Expense' : 'Add Expense'}</h3>
              <button className="icon-button" onClick={closeModal}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Swiggy Order, Uber Ride"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Food, Travel, Bills"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="expenseDate">Expense Date</label>
                <input
                  id="expenseDate"
                  name="expenseDate"
                  type="date"
                  value={formData.expenseDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpensesPage;
