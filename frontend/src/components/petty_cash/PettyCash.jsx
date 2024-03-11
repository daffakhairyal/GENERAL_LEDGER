import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { IoMdAddCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaLock, FaUnlock, FaPrint } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from '../Pagination';
import TambahPettyCash from './TambahPettyCash';
import EditPettyCash from './EditPettyCash';
import HapusPettyCash from './HapusPettyCash';

const PettyCashComponent = ({ user }) => {
    const [pettyCashEntries, setPettyCashEntries] = useState([]);
    const [statusDataLoaded, setStatusDataLoaded] = useState(false);
    const [showPettyCashEntry, setShowPettyCashEntry] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPettyCashEntryKey, setSelectedPettyCashEntryKey] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/petty_cash');
                const processedEntries = processEntries(response.data);
                setPettyCashEntries(processedEntries);
                setStatusDataLoaded(true);
            } catch (error) {
                console.error('Error fetching petty cash entries: ', error);
            }
        };

        fetchData();
    }, []);

    const processEntries = (entries) => {
        const groupedEntries = {};
        entries.forEach(entry => {
            const key = `${entry.noVoucher}-${entry.tanggal}-${entry.jenis}`;
            if (groupedEntries[key]) {
                groupedEntries[key].debit += entry.debit;
                groupedEntries[key].credit += entry.credit;
            } else {
                groupedEntries[key] = { ...entry };
            }
        });
        return Object.entries(groupedEntries).map(([key, value]) => ({
            ...value,
            key // Menambahkan kunci sebagai properti di setiap entri
        }));
    };

    const navigate = useNavigate();

    const savePettyCashEntry = async (formData) => {
        try {
            await axios.post('http://localhost:5000/petty_cash', formData);
            setShowPettyCashEntry(false);
            fetchData();
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.msg);
            } else {
                console.error('Error saving petty cash entry: ', error);
            }
        }
    };

    const handleEditPettyCashEntry = (entryKey) => {
        setShowEditModal(true);
        setSelectedPettyCashEntryKey(entryKey);
    };

    const handleDeletePettyCashEntry = (entryKey) => {
        setShowDeleteModal(true);
        setSelectedPettyCashEntryKey(entryKey);
    };

    const handlePrintPettyCashEntry = (entryKey) => {
        const entry = pettyCashEntries.find(item => item.key === entryKey);
        if (entry) {
            navigate(`/petty-cash-entry/${entry.uuid}`);
        } else {
            console.error(`Petty cash entry with key ${entryKey} not found.`);
        }
    };

    const handleLockUnlockPettyCashEntry = async (entryKey, newStatus) => {
        try {
            const entry = pettyCashEntries.find(item => item.key === entryKey);
            if (entry) {
                await axios.patch(`http://localhost:5000/petty_cash/${entry.uuid}`, { status: newStatus });
                setPettyCashEntries(prevEntries => {
                    return prevEntries.map(entry => {
                        if (entry.key === entryKey) {
                            return { ...entry, status: newStatus };
                        }
                        return entry;
                    });
                });
            }
        } catch (error) {
            console.error(`Error ${newStatus === 1 ? 'locking' : 'unlocking'} petty cash entry: `, error);
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
                        <button className="bg-yellow-400 hover:bg-yellow-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handlePrintPettyCashEntry(entry.key)}>
                            <FaPrint className='text-zinc-100' />
                        </button>
                        {user.role === 'admin' && (
                            <button className="bg-green-400 hover:bg-green-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handleLockUnlockPettyCashEntry(entry.key, false)}>
                                <FaUnlock className='text-zinc-100' />
                            </button>
                        )}
                    </Fragment>
                );
            case false:
                return (
                    <Fragment>
                        <button className="bg-blue-400 hover:bg-blue-500 duration-500 text-white font-bold py-2 px-4 rounded" onClick={() => handleEditPettyCashEntry(entry.key)}>
                            <FaEdit className='text-zinc-100' />
                        </button>
                        <button className="bg-red-400 hover:bg-red-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handleDeletePettyCashEntry(entry.key)}>
                            <MdDelete className='text-zinc-100' />
                        </button>
                        <button className="bg-yellow-400 hover:bg-yellow-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handlePrintPettyCashEntry(entry.key)}>
                            <FaPrint className='text-zinc-100' />
                        </button>
                        <button className="bg-green-400 hover:bg-green-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handleLockUnlockPettyCashEntry(entry.key, true)}>
                            <FaLock className='text-zinc-100' />
                        </button>
                    </Fragment>
                );
            default:
                return null;
        }
    };

    const filteredPettyCashEntries = pettyCashEntries.filter((entry) => {
        return (
            (entry.tanggal && entry.tanggal.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (entry.description && entry.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (entry.createdBy && entry.createdBy.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const indexOfLastEntry = Math.min(currentPage * entriesPerPage, filteredPettyCashEntries.length);
    const indexOfFirstEntry = Math.max(0, indexOfLastEntry - entriesPerPage);
    const currentEntries = filteredPettyCashEntries.slice(indexOfFirstEntry, indexOfLastEntry);

    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Fragment>
            <div className='m-8'>
                <div className='text-2xl font-semibold'>
                    <h1>Petty Cash Entries</h1>
                </div>
                <div className='bg-zinc-100 mt-5 shadow-md rounded h-full'>
                    <div className='m-3 p-1'>
                        <button
                            className='flex rounded bg-blue-400 hover:bg-blue-500 duration-500 p-2 mt-2 shadow-md'
                            onClick={() => setShowPettyCashEntry(true)}
                        >
                            <IoMdAddCircle className='text-zinc-100 text-xl mt-0.5' />
                            <span className='ml-1 text-zinc-100'>Add Petty Cash Entry</span>
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
                                        <tr key={entry.key} className='hover:bg-gray-100'>
                                            <td className="shadow-md border border-slate-200 mx-4 my-4 p-4 flex justify-center items-center space-x-2">
                                                {renderActionButtons(entry)}
                                            </td>
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
                                totalEntries={filteredPettyCashEntries.length}
                                entriesPerPage={entriesPerPage}
                                currentPage={currentPage}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <TambahPettyCash
                isVisible={showPettyCashEntry}
                onClose={() => setShowPettyCashEntry(false)}
                user={user}
                onSave={savePettyCashEntry}
            />
<EditPettyCash
    isVisible={showEditModal}
    onClose={() => setShowEditModal(false)}
    pettyCashEntryId={selectedPettyCashEntryKey} // Menggunakan selectedPettyCashEntryKey sebagai prop
/>

            <HapusPettyCash
                isVisible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                pettyCashEntryId={selectedPettyCashEntryKey}
                user={user}
            />
            {errorMessage && (
                <div className='text-red-500'>{errorMessage}</div>
            )}
        </Fragment>
    );
};

export default PettyCashComponent;
