import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { IoMdAddCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaLock, FaUnlock, FaPrint } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from '../Pagination';
import TambahTransferBank from './TambahTransferBank';
import EditTransferBank from './EditTransferBank';
import HapusTransferBank from './HapusTransferBank';

const TransferBank = ({ user }) => {
    const [transferBankEntries, setTransferBankEntries] = useState([]);
    const [statusDataLoaded, setStatusDataLoaded] = useState(false);
    const [showTransferBankEntry, setShowTransferBankEntry] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTransferBankEntryId, setSelectedTransferBankEntryId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/transfer_bank');
                setTransferBankEntries(response.data);
                setStatusDataLoaded(true);
            } catch (error) {
                console.error('Error fetching transfer bank entries: ', error);
            }
        };

        fetchData();
    }, []);

    const navigate = useNavigate();

    const saveTransferBankEntry = async (formData) => {
        try {
            await axios.post('http://localhost:5000/transfer_bank', formData);
            setShowTransferBankEntry(false);
            fetchData();
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.msg);
            } else {
                console.error('Error saving transfer bank entry: ', error);
            }
        }
    };

    const handleEditTransferBankEntry = (transferBankEntryId) => {
        setShowEditModal(true);
        setSelectedTransferBankEntryId(transferBankEntryId);
        const selectedEntry = transferBankEntries.find(entry => entry.uuid === transferBankEntryId);
        setEditEntry(selectedEntry); // Set the transfer bank entry to be edited to state for use in EditTransferBank
    };

    const handleDeleteTransferBankEntry = (transferBankEntryId) => {
        setShowDeleteModal(true);
        setSelectedTransferBankEntryId(transferBankEntryId);
    };

    const handlePrintTransferBankEntry = (transferBankEntryId) => {
        const transferBankEntry = transferBankEntries.find(item => item.uuid === transferBankEntryId);
        if (transferBankEntry) {
            navigate(`/transfer-bank-entry/${transferBankEntryId}`);
        } else {
            console.error(`Transfer bank entry with id ${transferBankEntryId} not found.`);
        }
    };

    const handleLockUnlockTransferBankEntry = async (transferBankEntryId, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/transfer_bank/${transferBankEntryId}`, { status: newStatus });
            setTransferBankEntries(prevEntries => {
                return prevEntries.map(entry => {
                    if (entry.uuid === transferBankEntryId) {
                        return { ...entry, status: newStatus };
                    }
                    return entry;
                });
            });
        } catch (error) {
            console.error(`Error ${newStatus === 1 ? 'locking' : 'unlocking'} transfer bank entry: `, error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const renderActionButtons = (entry) => {
        if (!statusDataLoaded) return null;
    
        switch (entry.status) {
            case true:
                return (
                    <Fragment>
                        <button className="bg-yellow-400 hover:bg-yellow-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handlePrintTransferBankEntry(entry.uuid)}>
                            <FaPrint className='text-zinc-100' />
                        </button>
                        {user.role === 'admin' && (
                            <button className="bg-green-400 hover:bg-green-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handleLockUnlockTransferBankEntry(entry.uuid, false)}>
                                <FaUnlock className='text-zinc-100' />
                            </button>
                        )}
                    </Fragment>
                );
            case false:
                return (
                    <Fragment>
                        <button className="bg-blue-400 hover:bg-blue-500 duration-500 text-white font-bold py-2 px-4 rounded" onClick={() => handleEditTransferBankEntry(entry.uuid)}>
                            <FaEdit className='text-zinc-100' />
                        </button>
                        <button className="bg-red-400 hover:bg-red-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handleDeleteTransferBankEntry(entry.uuid)}>
                            <MdDelete className='text-zinc-100' />
                        </button>
                        <button className="bg-yellow-400 hover:bg-yellow-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handlePrintTransferBankEntry(entry.uuid)}>
                            <FaPrint className='text-zinc-100' />
                        </button>
                        <button className="bg-green-400 hover:bg-green-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handleLockUnlockTransferBankEntry(entry.uuid, true)}>
                            <FaLock className='text-zinc-100' />
                        </button>
                    </Fragment>
                );
            default:
                return null;
        }
    };

    const filteredTransferBankEntries = transferBankEntries.filter((entry) => {
        return (
            (entry.tanggal && entry.tanggal.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (entry.description && entry.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (entry.createdBy && entry.createdBy.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const indexOfLastEntry = Math.min(currentPage * entriesPerPage, filteredTransferBankEntries.length);
    const indexOfFirstEntry = Math.max(0, indexOfLastEntry - entriesPerPage);
    const currentEntries = filteredTransferBankEntries.slice(indexOfFirstEntry, indexOfLastEntry);

    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Fragment>
            <div className='m-8'>
                <div className='text-2xl font-semibold'>
                    <h1>Transfer Bank Entries</h1>
                </div>
                <div className='bg-zinc-100 mt-5 shadow-md rounded h-full'>
                    <div className='m-3 p-1'>
                        <button
                            className='flex rounded bg-blue-400 hover:bg-blue-500 duration-500 p-2 mt-2 shadow-md'
                            onClick={() => setShowTransferBankEntry(true)}
                        >
                            <IoMdAddCircle className='text-zinc-100 text-xl mt-0.5' />
                            <span className='ml-1 text-zinc-100'>Add Transfer Bank Entry</span>
                        </button>
                        <input
                            type='text'
                            placeholder='Search...'
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='p-2 mt-2 border border-gray-300 rounded'
                        />
                        <select
                            className='p-2 ml-2 mt-2 border border-gray-300 rounded'
                            onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
                            value={entriesPerPage}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <div className='mt-2'>
                            <table className='table-auto w-full mb-3 border-collapse border border-gray-300'>
                                <thead className='bg-gray-200'>
                                    <tr>
                                        <th className='px-4 py-2'>Actions</th>
                                        <th className='px-4 py-2'>No</th>
                                        <th className='px-4 py-2'>Voucher No</th>
                                        <th className='px-4 py-2'>Date</th>
                                        <th className='px-4 py-2'>Description</th>
                                        <th className='px-4 py-2'>Type</th>
                                        <th className='px-4 py-2'>Debit</th>
                                        <th className='px-4 py-2'>Credit</th>
                                        <th className='px-4 py-2'>Created By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEntries.map((entry, index) => (
                                        <tr key={entry.uuid} className='hover:bg-gray-100'>
                                            <td className="shadow-md border border-slate-200 mx-4 my-4 p-4 flex justify-center items-center space-x-2">
                                                {renderActionButtons(entry)}
                                            </td>
                                            <td className='border border-slate-200 px-4 py-2'>{indexOfFirstEntry + index + 1}</td>
                                            <td className='border border-slate-200 px-4 py-2'>{entry.noVoucher}</td>
                                            <td className='border border-slate-200 px-4 py-2'>{formatDate(entry.tanggal)}</td>
                                            <td className='border border-slate-200 px-4 py-2'>{entry.detail}</td>
                                            <td className='border border-slate-200 px-4 py-2'>{entry.jenis}</td>
                                            <td className='border border-slate-200 px-4 py-2'>{entry.debit}</td>
                                            <td className='border border-slate-200 px-4 py-2'>{entry.credit}</td>
                                            <td className='border border-slate-200 px-4 py-2'>{entry.createdBy}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <Pagination
                                className='mt-3'
                                totalEntries={filteredTransferBankEntries.length}
                                entriesPerPage={entriesPerPage}
                                currentPage={currentPage}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <TambahTransferBank
                isVisible={showTransferBankEntry}
                onClose={() => setShowTransferBankEntry(false)}
                user={user}
                onSave={saveTransferBankEntry}
            />
            <EditTransferBank
                isVisible={showEditModal}
                onClose={() => setShowEditModal(false)}
                transferBankEntryId={selectedTransferBankEntryId}
                user={user}
            />
            <HapusTransferBank
                isVisible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                transferBankEntryId={selectedTransferBankEntryId}
                user={user}
            />
            {errorMessage && (
                <div className='text-red-500'>{errorMessage}</div>
            )}
        </Fragment>
    );
};

export default TransferBank;
