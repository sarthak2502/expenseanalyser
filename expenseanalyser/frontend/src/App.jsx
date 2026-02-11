import React, { useState } from 'react';
import EmployeesPage from './EmployeesPage.jsx';

function App() {
  const [activeMenu, setActiveMenu] = useState('employees');

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">Fullstack Employee Dashboard</div>
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
                className={activeMenu === 'employees' ? 'active' : ''}
                onClick={() => setActiveMenu('employees')}
              >
                All Employees
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
          {activeMenu === 'employees' && <EmployeesPage />}
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

