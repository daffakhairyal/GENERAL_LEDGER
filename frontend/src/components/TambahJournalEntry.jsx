import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";

const TambahJournalEntry = ({ isVisible, onClose, user }) => {
    const [initialDate] = useState(new Date().toISOString().slice(0, 10));
    const [selectedDate, setSelectedDate] = useState('');
    const [journalEntries, setJournalEntries] = useState([
        {
            noVoucher: '',
            jenis: '',
            tanggal: '',
            description: '',
            account: '',
            detail: '',
            debit: 0,
            credit: 0,
        },
    ]);
    const [msg, setMsg] = useState('');
    const [chartOfAccounts, setChartOfAccounts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [tableEntries, setTableEntries] = useState([]);
    const [entriesAdded, setEntriesAdded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/chart_of_account');
                setChartOfAccounts(response.data);
            } catch (error) {
                console.error('Error fetching chart of accounts:', error);
            }
        };

        fetchData();
    }, []);

    const searchAccounts = (keyword) => {
        if (keyword.trim() === '') {
            setSearchResults([]);
            return;
        }

        const results = chartOfAccounts.filter(account =>
            account.name.toLowerCase().includes(keyword.toLowerCase()) ||
            account.account.toLowerCase().includes(keyword.toLowerCase())
        );
        setSearchResults(results);
        if (results.length === 0) {
            console.log('Tidak ada hasil yang ditemukan untuk kata kunci:', keyword);
        }
    };

    const handleDescriptionChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
        searchAccounts(value);
        setSelectedAccount('');
        setJournalEntries(entries => [{ ...entries[0], description: value }]);
    };

    const handleAccountChange = (result) => {
        setSelectedAccount(result.account);
        setJournalEntries(entries => [{ ...entries[0], description: result.name, account: result.account }]);
        setSearchTerm(result.name);
        setSearchResults([]);
    };

    const handleEntryChange = (index, field, value) => {
        setJournalEntries(entries => entries.map((item, idx) => idx === index ? { ...item, [field]: value } : item));
    };

    const addNewEntry = () => {
        setTableEntries([
            ...tableEntries,
            { 
                ...journalEntries[0], 
                tanggal: selectedDate || initialDate, // Menggunakan tanggal yang telah dipilih atau tanggal awal jika tidak ada yang dipilih
            },
        ]);
        setEntriesAdded(true);
    };

    const removeEntry = (index) => {
        const updatedEntries = [...tableEntries];
        updatedEntries.splice(index, 1);
        setTableEntries(updatedEntries);
    };

    const editEntry = (index) => {
        const entryToEdit = tableEntries[index];
        setJournalEntries([entryToEdit]);
        setSelectedDate(entryToEdit.tanggal);
        setTableEntries(tableEntries.filter((entry, i) => i !== index));
    };

    const saveJournalEntry = async (e) => {
        e.preventDefault();
        if (!entriesAdded) {
            setMsg('Isi journal terlebih dahulu.');
            setTimeout(() => {
                setMsg('');
            }, 3000); // Menetapkan waktu 3000ms (3 detik) sebelum menghapus pesan
            return;
        }
        try {
            const response = await Promise.all(
                tableEntries.map((entry) =>
                    axios.post('http://localhost:5000/journal_entries', {
                        createdBy: user.name,
                        noVoucher: entry.noVoucher,
                        jenis: entry.jenis,
                        tanggal: entry.tanggal,
                        description: entry.description,
                        account: entry.account,
                        detail: entry.detail,
                        debit: entry.debit,
                        credit: entry.credit,
                    })
                )
            );
            if (response.every(res => res.status === 201)) {
                setMsg('Journal entries berhasil ditambahkan!');
                setTableEntries([]);
                setEntriesAdded(false);
                window.location.reload();
            } else {
                setMsg('Terjadi kesalahan saat menyimpan entri jurnal.');
            }
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg || 'Terjadi kesalahan saat menyimpan entri jurnal.');
            } else {
                setMsg('Terjadi kesalahan saat menyimpan entri jurnal.');
            }
        }
        setTimeout(() => {
            setMsg('');
        }, 3000); // Menetapkan waktu 3000ms (3 detik) sebelum menghapus pesan
    };

    if (!isVisible) return null;

    const totalDebit = tableEntries.reduce((acc, entry) => acc + parseFloat(entry.debit || 0), 0);
    const totalCredit = tableEntries.reduce((acc, entry) => acc + parseFloat(entry.credit || 0), 0);

    return (
        <div className='fixed inset-0 flex justify-center z-50 overflow-auto bg-black bg-opacity-50'>
            <div className='absolute top-0 left-0 right-0 flex justify-center h-50'>
                <div className='bg-white p-8 rounded-lg shadow-md w-[1000px]'>
                    <h2 className='text-2xl font-semibold mb-4'>Tambah Journal Entry</h2>
                    {msg && <div className='text-green-500 mb-4'>{msg}</div>}
                    <form onSubmit={saveJournalEntry}>
                        {journalEntries.map((entry, index) => (
                            <div key={index} className='mb-4'>
                                <div className='grid grid-cols-3 gap-4'>
                                    <div>
                                        <label htmlFor={`no_voucher_${index}`} className='block text-gray-700 font-medium mb-2'>
                                            No Voucher
                                        </label>
                                        <input
                                            type='text'
                                            id={`no_voucher_${index}`}
                                            name={`no_voucher_${index}`}
                                            value={entry.noVoucher}
                                            onChange={(e) => handleEntryChange(index, 'noVoucher', e.target.value)}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                                            placeholder='Enter no voucher...'
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`jenis_${index}`} className='block text-gray-700 font-medium mb-2'>
                                            Jenis
                                        </label>
                                        <select
                                            id={`jenis_${index}`}
                                            name={`jenis_${index}`}
                                            value={entry.jenis}
                                            onChange={(e) => handleEntryChange(index, 'jenis', e.target.value)}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                                        >
                                            <option value=''>Pilih Jenis</option>
                                            <option value='Petty Cash Out'>Petty Cash Out</option>
                                            <option value='Petty Cash In'>Petty Cash In</option>
                                            <option value='Bank Out'>Bank Out</option>
                                            <option value='Bank In'>Bank In</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor={`tanggal_${index}`} className='block text-gray-700 font-medium mb-2'>
                                            Tanggal
                                        </label>
                                        <input
                                            type='date'
                                            id={`tanggal_${index}`}
                                            name={`tanggal_${index}`}
                                            value={selectedDate || initialDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                                            placeholder='Enter tanggal...'
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4 mt-4'>
                                    <div>
                                        <label htmlFor={`description_${index}`} className='block text-gray-700 font-medium mb-2'>
                                            Description
                                        </label>
                                        <input
                                            type='text'
                                            id={`description_${index}`}
                                            name={`description_${index}`}
                                            value={entry.description}
                                            onChange={handleDescriptionChange}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                                            placeholder='Search for description...'
                                        />

                                        {typeof searchTerm === 'string' && searchTerm.trim() !== '' && searchResults.length > 0 && (
                                            <ul className="mt-2 absolute z-10 max-w-[calc(100%-2rem)] bg-white border border-gray-300 rounded-md shadow-md">
                                                {searchResults.slice(0, 10).map(result => (
                                                    <li key={result.id} className="py-2 px-4 hover:bg-gray-100 cursor-pointer transition duration-300 w-full" onClick={() => handleAccountChange(result)}>
                                                        {result.account} - {result.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor={`account_${index}`} className='block text-gray-700 font-medium mb-2'>
                                            Account
                                        </label>
                                        <input
                                            type='text'
                                            id={`account_${index}`}
                                            name={`account_${index}`}
                                            value={selectedAccount}
                                            onChange={(e) => setSelectedAccount(e.target.value)}
                                            className='w-full px-3 py-2 border border-gray-300 bg-slate-200 text-slate-500 rounded-md focus:outline-none focus:border-blue-500'
                                            placeholder='Search for account...'
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`detail_${index}`} className='block text-gray-700 font-medium mb-2'>
                                            Detail
                                        </label>
                                        <input
                                            type='text'
                                            id={`detail_${index}`}
                                            name={`detail_${index}`}
                                            value={entry.detail}
                                            onChange={(e) => handleEntryChange(index, 'detail', e.target.value)}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                                            placeholder='Enter detail...'
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4 mt-4'>
                                    <div>
                                        <label htmlFor={`debit_${index}`} className='block text-gray-700 font-medium mb-2'>
                                            Debit
                                        </label>
                                        <input
                                            type='number'
                                            id={`debit_${index}`}
                                            name={`debit_${index}`}
                                            value={entry.debit}
                                            onChange={(e) => handleEntryChange(index, 'debit', e.target.value)}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                                            placeholder='Enter debit amount...'
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`credit_${index}`} className='block text-gray-700 font-medium mb-2'>
                                            Credit
                                        </label>
                                        <input
                                            type='number'
                                            id={`credit_${index}`}
                                            name={`credit_${index}`}
                                            value={entry.credit}
                                            onChange={(e) => handleEntryChange(index, 'credit', e.target.value)}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                                            placeholder='Enter credit amount...'
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className='flex justify-end'>
                            <button
                                type='button'
                                onClick={addNewEntry}
                                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'
                            >
                                Add Entry
                            </button>
                        </div>
                        {tableEntries.length > 0 && (
                            <div>
                                <table className='w-full mt-4'>
                                    <thead>
                                        <tr>
                                            <th className='px-4 py-2'>No Voucher</th>
                                            <th className='px-4 py-2'>Jenis</th>
                                            <th className='px-4 py-2'>Tanggal</th>
                                            <th className='px-4 py-2'>Name</th>
                                            <th className='px-4 py-2'>Account</th>
                                            <th className='px-4 py-2'>Detail</th>
                                            <th className='px-4 py-2'>Debit</th>
                                            <th className='px-4 py-2'>Credit</th>
                                            <th className='px-4 py-2'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableEntries.map((entry, index) => (
                                            <tr key={index}>
                                                <td className='border px-4 py-2'>{entry.noVoucher}</td>
                                                <td className='border px-4 py-2'>{entry.jenis}</td>
                                                <td className='border px-4 py-2'>{entry.tanggal}</td>
                                                <td className='border px-4 py-2'>{entry.description}</td>
                                                <td className='border px-4 py-2'>{entry.account}</td>
                                                <td className='border px-4 py-2'>{entry.detail}</td>
                                                <td className='border px-4 py-2'>{entry.debit}</td>
                                                <td className='border px-4 py-2'>{entry.credit}</td>
                                                <td className='border px-5 py-2 flex justify-between'>
                                                    <button
                                                        type="button"
                                                        onClick={() => editEntry(index)}
                                                        className='bg-yellow-500 text-xl mx-1 hover:bg-yellow-600 text-white px-2 py-1 rounded-md'
                                                    >
                                                        <MdEdit/>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEntry(index)}
                                                        className='bg-red-500 mx-1 text-xl hover:bg-red-600 text-white px-2 py-1 rounded-md'
                                                    >
                                                        <RiDeleteBin6Line/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className='flex justify-end mt-4'>
                                    <div>Total Debit: {totalDebit}</div>
                                    <div className='ml-4'>Total Credit: {totalCredit}</div>
                                </div>
                            </div>
                        )}
                        <div className='flex justify-end mt-4'>
                            <button
                                type='submit'
                                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2'
                            >
                                Save
                            </button>
                            <button
                                type='button'
                                onClick={() => onClose()}
                                className='bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md'
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TambahJournalEntry;
