{/* eslint-disable react-hooks/rules-of-hooks */}
{/* eslint-disable react/prop-types */}
{/* eslint-disable no-unused-vars */}
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const EditJournalEntry = ({ isVisible, onClose, user, journalEntryId }) => {
    const [journalEntry, setJournalEntry] = useState(null);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJournalEntry = async () => {
            try {
                if (journalEntryId) {
                    const response = await axios.get(`http://localhost:5000/journal_entries/${journalEntryId}`);
                    const fetchedJournalEntry = response.data;
                    if (user) {
                        fetchedJournalEntry.createdBy = user.name;
                    }
                    setJournalEntry(fetchedJournalEntry);
                }
            } catch (error) {
                console.error("Error fetching journal entry:", error);
            }
        };
    
        fetchJournalEntry();
    }, [journalEntryId, user]);

    const updateJournalEntry = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/journal_entries/${journalEntryId}`, journalEntry);
            setMsg("Journal entry berhasil diperbarui!");
            window.location.reload();
        } catch (error) {
            console.error("Error updating journal entry:", error);
            setMsg("Gagal memperbarui journal entry");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJournalEntry(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    if (!isVisible || !journalEntry) return null;

    return (
        <div className='z-10 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
            <div className="bg-white p-8 rounded-lg shadow-md w-[100vh]">
                <h2 className="text-2xl font-semibold mb-4">Edit Journal Entry</h2>
                {msg && <div className="text-green-500 mb-4">{msg}</div>}
                <form onSubmit={updateJournalEntry}>
                    <div className='flex flex-wrap'>
                        <div className="mb-4 w-1/4">
                            <label htmlFor="createdBy" className="block text-gray-700 font-medium mb-2">Dibuat oleh</label>
                            <input type="text" name="createdBy" id="createdBy" value={journalEntry.createdBy} className="w-full px-3 py-2 border border-slate-400 text-slate-300 rounded-md focus:outline-none focus:border-blue-500" readOnly />
                        </div>
                        <div className="mb-4 w-1/4">
                            <label htmlFor="date" className="block text-gray-700 font-medium mb-2">Date</label>
                            <input type="date" id="date" name="date" value={formatDate(journalEntry.date)} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/4">
                            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
                            <input type="text" id="description" name="description" value={journalEntry.description} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/5">
                            <label htmlFor="debit" className="block text-gray-700 font-medium mb-2">Debit</label>
                            <input type="number" id="debit" name="debit" value={journalEntry.debit} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/5">
                            <label htmlFor="credit" className="block text-gray-700 font-medium mb-2">Credit</label>
                            <input type="number" id="credit" name="credit" value={journalEntry.credit} className="w-full ml-2 px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        {/* Add other input fields according to your database fields */}
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Simpan</button>
                        <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md ml-2" onClick={() => onClose()}>Batal</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditJournalEntry;
