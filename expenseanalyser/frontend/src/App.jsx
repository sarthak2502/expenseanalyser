import React, { useState } from 'react';
import ExpensesPage from './ExpensesPage.jsx';

function App() {
  const [activeMenu, setActiveMenu] = useState('expenses');

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">Expense Analyzer</div>
        <div className="header-actions">
          <button className="icon-button" aria-label="Notifications">
            🔔
          </button>
          <div className="user-profile">
            <span className="user-avatar">U</span>
            <span className="user-name">User</span>
            <button className="logout-button">Logout</button>
          </div>
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <nav>
            <ul>
              <li
                className={activeMenu === 'expenses' ? 'active' : ''}
                onClick={() => setActiveMenu('expenses')}
              >
                All Expenses
              </li>
              <li
                className={activeMenu === 'reports' ? 'active' : ''}
                onClick={() => setActiveMenu('reports')}
              >
                Reports
              </li>
              <li
                className={activeMenu === 'settings' ? 'active' : ''}
                onClick={() => setActiveMenu('settings')}
              >
                Settings
              </li>
            </ul>
          </nav>
        </aside>

        <main className="content">
          {activeMenu === 'expenses' && <ExpensesPage />}
          {activeMenu === 'reports' && (
            <div className="placeholder">
              <h2>Reports</h2>
              <p>Reports section placeholder.</p>
            </div>
          )}
          {activeMenu === 'settings' && (
            <div className="placeholder">
              <h2>Settings</h2>
              <p>Settings section placeholder.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

