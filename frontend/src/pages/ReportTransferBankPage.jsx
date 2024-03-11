/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import Layout from '../components/layout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';
import ReportTransferBank from '../components/transfer_bank/ReportTransferBank'; // Mengubah dari ReportPettyCash menjadi ReportTransferBank

const ReportTransferBankPage = () => { // Mengubah nama komponen menjadi ReportTransferBankPage
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
      <ReportTransferBank user={user} /> {/* Mengubah dari ReportPettyCash menjadi ReportTransferBank */}
    </Layout>
  );
};

export default ReportTransferBankPage;
