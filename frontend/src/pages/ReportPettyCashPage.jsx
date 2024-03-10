/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import Layout from '../components/layout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';
import ReportPettyCash from '../components/petty_cash/ReportPettyCash'; // Change from ReportGeneralLedger to ReportPettyCash

const ReportPettyCashPage = () => { // Change component name to ReportPettyCashPage
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

  // Add a console.log() here to see the value of user
  useEffect(() => {
    console.log('User value:', user);
  }, [user]);

  return (
    <Layout>
      <ReportPettyCash user={user} /> {/* Change from ReportGeneralLedger to ReportPettyCash */}
    </Layout>
  );
};

export default ReportPettyCashPage;
