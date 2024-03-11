/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import DivisionPage from './pages/Division';
import FileCOAPage from './pages/FileCOAPage';
import PettyCashPage from './pages/PettyCashPage';
import ReportPettyCashPage from './pages/ReportPettyCashPage';
import TransferBankPage from './pages/TransferBankPage';
import ReportTransferBankPage from './pages/ReportTransferBankPage';

const App = () => {
  return (
    <div className=''>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/divisions" element={<DivisionPage />} />
          <Route path="/file/coa" element={<FileCOAPage />} />
          <Route path="/file/petty_cash" element={<PettyCashPage />} />
          <Route path="/report/petty_cash" element={<ReportPettyCashPage />} />
          <Route path="/file/transfer_bank" element={<TransferBankPage />} />
          <Route path="/report/transfer_bank" element={<ReportTransferBankPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
