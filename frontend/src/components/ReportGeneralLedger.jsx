/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Pagination from "./Pagination";
import TambahSuratMasuk from "./TambahSuratMasuk";
import EditSuratMasuk from "./EditSuratMasuk";
import HapusSuratMasuk from "./HapusSuratMasuk";

const ReportGeneralLedger = ({ user }) => {
    const [journalEntries, setJournalEntries] = useState([]);
    const [showTambahModal, setShowTambahModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEntryId, setSelectedEntryId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getJournalEntries();
    }, [currentPage, entriesPerPage]);

    const navigate = useNavigate();

    const getJournalEntries = async () => {
        try {
            const response = await axios.get("http://localhost:5000/journal_entries");
            setJournalEntries(response.data);
        } catch (error) {
            console.error("Error fetching journal entries: ", error);
        }
    };

    const handleEditEntry = (entryId) => {
        setShowEditModal(true);
        setSelectedEntryId(entryId);
    };

    const handleDeleteEntry = (entryId) => {
        setShowDeleteModal(true);
        setSelectedEntryId(entryId);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const filteredEntries = journalEntries.filter(entry => {
        return entry.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.amount.toString().includes(searchTerm.toLowerCase()) ||
                entry.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const indexOfLastEntry = Math.min(currentPage * entriesPerPage, filteredEntries.length);
    const indexOfFirstEntry = Math.max(0, indexOfLastEntry - entriesPerPage);
    const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);

    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    return (
        <Fragment>
            <div className='m-8'>
                <div className='text-2xl font-semibold'>
                    <h1>General Ledger Report</h1>
                </div>
                <div className='bg-gray-100 mt-5 shadow-md rounded'>
                    <div className='m-3 p-1'>
                        <input
                            type="text"
                            placeholder="Search..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 mt-2 border border-gray-300 rounded"
                        />
                        <select
                            className="p-2 ml-2 mt-2 border border-gray-300 rounded"
                            onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
                            value={entriesPerPage}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <div className='mt-2'>
                            <table className="table-auto w-full mb-3  border-collapse border border-gray-300">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2">No</th>
                                        <th className="px-4 py-2">Account</th>
                                        <th className="px-4 py-2">Amount</th>
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2">Created By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEntries.map((entry, index) => (
                                        <tr key={entry.id} className="hover:bg-gray-100">
                                            <td className="border border-slate-200 px-4 py-2">{indexOfFirstEntry + index + 1}</td>
                                            <td className="border border-slate-200 px-4 py-2">{entry.account}</td>
                                            <td className="border border-slate-200 px-4 py-2">{entry.amount}</td>
                                            <td className="border border-slate-200 px-4 py-2">{formatDate(entry.date)}</td>
                                            <td className="border border-slate-200 px-4 py-2">{entry.createdBy}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <Pagination className='mt-3'
                                totalEntries={filteredEntries.length}
                                entriesPerPage={entriesPerPage}
                                currentPage={currentPage}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <TambahSuratMasuk className='duration-500' isVisible={showTambahModal} onClose={() => setShowTambahModal(false)} user={user} />
            <EditSuratMasuk className='duration-500' isVisible={showEditModal} onClose={() => setShowEditModal(false)} suratMasukId={selectedEntryId} user={user} />
            <HapusSuratMasuk className='duration-500' isVisible={showDeleteModal} onClose={() => setShowDeleteModal(false)} suratMasukId={selectedEntryId} user={user} />
        </Fragment>
    );
}

export default ReportGeneralLedger;
