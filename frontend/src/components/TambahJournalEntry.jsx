/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TambahJournalEntry = ({ isVisible, onClose, user }) => {
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); 
    const [journalEntries, setJournalEntries] = useState([
        {
            description: '',
            debit: '',
            credit: '',
        },
    ]);
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const addJournalEntry = () => {
        setJournalEntries([
            ...journalEntries,
            {
                description: '',
                debit: '',
                credit: '',
            },
        ]);
    };

    const removeJournalEntry = (index) => {
        const newJournalEntries = [...journalEntries];
        newJournalEntries.splice(index, 1);
        setJournalEntries(newJournalEntries);
    };

    const saveJournalEntry = async (e) => {
        e.preventDefault();
        try {
            await Promise.all(
                journalEntries.map((entry) =>
                    axios.post('http://localhost:5000/journal_entries', {
                        createdBy: user.name,
                        description: entry.description,
                        debit: entry.debit,
                        credit: entry.credit,
                        date: date,
                    })
                )
            );
            setMsg('Journal entry berhasil ditambahkan!');
            setJournalEntries([
                {
                    description: '',
                    debit: '',
                    credit: '',
                },
            ]);
            window.location.reload();
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const newJournalEntries = [...journalEntries];
        newJournalEntries[index][name] = value;
        setJournalEntries(newJournalEntries);

        // Menghitung total debit
        let debitTotal = 0;
        journalEntries.forEach((entry) => {
            if (!isNaN(entry.debit)) {
                debitTotal += parseFloat(entry.debit);
            }
        });
        setTotalDebit(debitTotal);

        // Menghitung total kredit
        let creditTotal = 0;
        journalEntries.forEach((entry) => {
            if (!isNaN(entry.credit)) {
                creditTotal += parseFloat(entry.credit);
            }
        });
        setTotalCredit(creditTotal);
    };

    if (!isVisible) return null;

    return (
        <div className='z-10 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
            <div className='bg-white p-8 rounded-lg shadow-md w-[100vh]'>
                <h2 className='text-2xl font-semibold mb-4'>Tambah Journal Entry</h2>
                {msg && <div className='text-green-500 mb-4'>{msg}</div>}
                <form onSubmit={saveJournalEntry}>
                    <div className='mb-4'>
                        <label htmlFor='date' className='block text-gray-700 font-medium mb-2'>
                            Date
                        </label>
                        <input
                            type='date'
                            id='date'
                            name='date'
                            value={date}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    {journalEntries.map((entry, index) => (
                        <div key={index} className='flex flex-wrap mb-4'>
                            <input
                                type='text'
                                name='description'
                                value={entry.description}
                                className='w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder='Description'
                            />
                            <input
                                type='number'
                                name='debit'
                                value={entry.debit}
                                className='w-1/6 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder='Debit'
                            />
                            <input
                                type='number'
                                name='credit'
                                value={entry.credit}
                                className='w-1/6 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder='Credit'
                            />
                            {index > 0 && (
                                <button
                                    type='button'
                                    className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md ml-2'
                                    onClick={() => removeJournalEntry(index)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <div className='flex flex-wrap mb-4'>
                        <span className='w-1/3 px-3 py-2 font-medium'>Total Debit:</span>
                        <span className='w-1/6 px-3 py-2 font-medium'>{totalDebit}</span>
                    </div>
                    <div className='flex flex-wrap mb-4'>
                        <span className='w-1/3 px-3 py-2 font-medium'>Total Credit:</span>
                        <span className='w-1/6 px-3 py-2 font-medium'>{totalCredit}</span>
                    </div>
                    <div className='flex justify-end'>
                        <button
                            type='button'
                            onClick={addJournalEntry}
                            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'
                        >
                            Add Entry
                        </button>
                        <button type='submit' className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ml-2'>
                            Save
                        </button>
                        <button
                            type='button'
                            className='bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md ml-2'
                            onClick={() => onClose()}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TambahJournalEntry;
