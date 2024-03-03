import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { IoMdAddCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaLock, FaUnlock, FaPrint } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from './Pagination';
import TambahJournalEntry from './TambahJournalEntry';
import EditJournalEntry from './EditJournalEntry';
import HapusJournalEntry from './HapusJournalEntry';

const JournalEntryComponent = ({ user }) => {
    const [journalEntries, setJournalEntries] = useState([]);
    const [statusDataLoaded, setStatusDataLoaded] = useState(false); // State to track whether status data is loaded
    const [showJournalEntry, setShowJournalEntry] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedJournalEntryId, setSelectedJournalEntryId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/journal_entries');
                console.log('Journal entries response:', response.data)
                setJournalEntries(response.data);
                setStatusDataLoaded(true); // Set statusDataLoaded to true when data is fetched successfully
            } catch (error) {
                console.error('Error fetching journal entries: ', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Update status data loaded whenever journalEntries changes
        setStatusDataLoaded(true);
    }, [journalEntries]);

    const navigate = useNavigate();

    const handleEditJournalEntry = (journalEntryId) => {
        setShowEditModal(true);
        setSelectedJournalEntryId(journalEntryId);
    };

    const handleDeleteJournalEntry = (journalEntryId) => {
        setShowDeleteModal(true);
        setSelectedJournalEntryId(journalEntryId);
    };

    const handlePrintJournalEntry = (journalEntryId) => {
        const journalEntry = journalEntries.find(item => item.uuid === journalEntryId);
        if (journalEntry) {
            navigate(`/journal-entry/${journalEntryId}`);
        } else {
            console.error(`Journal entry with id ${journalEntryId} not found.`);
        }
    };

    const handleLockUnlockJournalEntry = async (journalEntryId, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/journal_entries/${journalEntryId}`, { status: newStatus });
            // Update status di state lokal
            setJournalEntries(prevEntries => {
                return prevEntries.map(entry => {
                    if (entry.uuid === journalEntryId) {
                        return { ...entry, status: newStatus };
                    }
                    return entry;
                });
            });
        } catch (error) {
            console.error(`Error ${newStatus === 1 ? 'locking' : 'unlocking'} journal entry: `, error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const renderActionButtons = (entry) => {
        console.log('Entry status:', entry.status);
    
        if (!statusDataLoaded) return null;
    
        switch (entry.status) {
            case true: // Jika status adalah true (misalnya, aktif atau terkunci)
                return (
                    <Fragment>
                        <button className="bg-yellow-400 hover:bg-yellow-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handlePrintJournalEntry(entry.uuid)}>
                            <FaPrint className='text-zinc-100' />
                        </button>
                        <button className="bg-green-400 hover:bg-green-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handleLockUnlockJournalEntry(entry.uuid, false)}>
                            <FaUnlock className='text-zinc-100' />
                        </button>
                    </Fragment>
                );
            case false: // Jika status adalah false (misalnya, tidak aktif atau terbuka)
                return (
                    <Fragment>
                        <button className="bg-blue-400 hover:bg-blue-500 duration-500 text-white font-bold py-2 px-4 rounded" onClick={() => handleEditJournalEntry(entry.uuid)}>
                            <FaEdit className='text-zinc-100' />
                        </button>
                        <button className="bg-red-400 hover:bg-red-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handleDeleteJournalEntry(entry.uuid)}>
                            <MdDelete className='text-zinc-100' />
                        </button>
                        <button className="bg-yellow-400 hover:bg-yellow-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handlePrintJournalEntry(entry.uuid)}>
                            <FaPrint className='text-zinc-100' />
                        </button>
                        <button className="bg-green-400 hover:bg-green-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handleLockUnlockJournalEntry(entry.uuid, true)}>
                            <FaLock className='text-zinc-100' />
                        </button>
                    </Fragment>
                );
            default:
                return null;
        }
    };
    

    const filteredJournalEntries = journalEntries.filter((entry) => {
        return (
            entry.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const indexOfLastEntry = Math.min(currentPage * entriesPerPage, filteredJournalEntries.length);
    const indexOfFirstEntry = Math.max(0, indexOfLastEntry - entriesPerPage);
    const currentEntries = filteredJournalEntries.slice(indexOfFirstEntry, indexOfLastEntry);

    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Fragment>
            <div className='m-8'>
                <div className='text-2xl font-semibold'>
                    <h1>Journal Entries</h1>
                </div>
                <div className='bg-zinc-100 mt-5 shadow-md rounded h-[75vh] '>
                    <div className='m-3 p-1'>
                        <button
                            className='flex rounded bg-blue-400 hover:bg-blue-500 duration-500 p-2 mt-2 shadow-md'
                            onClick={() => setShowJournalEntry(true)}
                        >
                            <IoMdAddCircle className='text-zinc-100 text-xl mt-0.5' />
                            <span className='ml-1 text-zinc-100'>Tambah Journal Entry</span>
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
                            <table className='table-auto w-full mb-3  border-collapse border border-gray-300'>
                                <thead className='bg-gray-200'>
                                    <tr>
                                        <th className='px-4 py-2'>Actions</th>
                                        <th className='px-4 py-2'>No</th>
                                        <th className='px-4 py-2'>Date</th>
                                        <th className='px-4 py-2'>Description</th>
                                        <th className='px-4 py-2'>Debit</th>
                                        <th className='px-4 py-2'>Credit</th>
                                        <th className='px-4 py-2'>Created By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEntries.map((entry, index) => (
                                        <tr key={entry.uuid} className='hover:bg-gray-100'>
                                            <td className="border border-slate-200 px-4 py-2 flex justify-center">
                                                {renderActionButtons(entry)}
                                            </td>
                                            <td className='border border-slate-200 px-4 py-2'>{indexOfFirstEntry + index + 1}</td>
                                            <td className='border border-slate-200 px-4 py-2'>{formatDate(entry.date)}</td>
                                            <td className='border border-slate-200 px-4 py-2'>{entry.description}</td>
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
                                totalEntries={filteredJournalEntries.length}
                                entriesPerPage={entriesPerPage}
                                currentPage={currentPage}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <TambahJournalEntry
                className='duration-500'
                isVisible={showJournalEntry}
                onClose={() => setShowJournalEntry(false)}
                user={user}
            />
            <EditJournalEntry
                className='duration-500'
                isVisible={showEditModal}
                onClose={() => setShowEditModal(false)}
                journalEntryId={selectedJournalEntryId}
                user={user}
            />
            <HapusJournalEntry
                className='duration-500'
                isVisible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                journalEntryId={selectedJournalEntryId}
                user={user}
            />
        </Fragment>
    );
};

export default JournalEntryComponent;
