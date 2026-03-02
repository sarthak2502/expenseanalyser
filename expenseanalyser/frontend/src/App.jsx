import React, { useState } from 'react';
import ExpensesPage from './ExpensesPage.jsx';
import UsersPage from './UsersPage.jsx';
import AddExpenseFilesPage from './AddExpenseFilesPage.jsx';

function App() {
  const [activeMenu, setActiveMenu] = useState('expenses');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const chooseMenu = (key) => {
    setActiveMenu(key);
    closeSidebar();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <button
          type="button"
          className="hamburger-button"
          aria-label="Toggle menu"
          onClick={() => setSidebarOpen((o) => !o)}
        >
          ☰
        </button>
        <div className="logo">
          <span className="logo-title">Expense Analyzer</span>
          <span className="logo-subtitle">Personal Financial Insights Platform</span>
        </div>
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

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          onKeyDown={(e) => e.key === 'Escape' && closeSidebar()}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}

      <div className="app-body">
        <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
          <nav>
            <ul>
              <li
                className={activeMenu === 'expenses' ? 'active' : ''}
                onClick={() => chooseMenu('expenses')}
              >
                All Expenses
              </li>
              <li
                className={activeMenu === 'users' ? 'active' : ''}
                onClick={() => chooseMenu('users')}
              >
                Users
              </li>
              <li
                className={activeMenu === 'addExpenseFiles' ? 'active' : ''}
                onClick={() => chooseMenu('addExpenseFiles')}
              >
                Add Expense Files
              </li>
              <li
                className={activeMenu === 'reports' ? 'active' : ''}
                onClick={() => chooseMenu('reports')}
              >
                Reports
              </li>
              <li
                className={activeMenu === 'settings' ? 'active' : ''}
                onClick={() => chooseMenu('settings')}
              >
                Settings
              </li>
            </ul>
          </nav>
        </aside>

        <main className="content">
          {activeMenu === 'expenses' && <ExpensesPage />}
          {activeMenu === 'users' && <UsersPage />}
          {activeMenu === 'addExpenseFiles' && <AddExpenseFilesPage />}
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

      <footer className="app-footer">
        Built by Sarthak Goel
      </footer>
    </div>
  );
}

export default App;

