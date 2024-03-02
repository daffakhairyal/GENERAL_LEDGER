/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import Layout from '../components/layout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';
import ReportGeneralLedger from './../components/ReportGeneralLedger'; // Ganti RecordSuratMasuk menjadi ReportGeneralLedger

const ReportGeneralLedgerPage = () => { // Ganti nama komponen menjadi ReportGeneralLedgerPage
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate('/');
    }
  }, [isError, navigate]);

  // Tambahkan console.log() di sini untuk melihat nilai user
  useEffect(() => {
    console.log('Nilai user:', user);
  }, [user]);

  return (
    <Layout>
      <ReportGeneralLedger user={user} /> 
    </Layout>
  );
};

export default ReportGeneralLedgerPage;
