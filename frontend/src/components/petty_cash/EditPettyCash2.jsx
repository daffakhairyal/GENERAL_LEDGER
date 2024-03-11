import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { FiX } from 'react-icons/fi';
import { FaRegPlusSquare } from 'react-icons/fa';
import { VscSave } from "react-icons/vsc";

const EditPettyCash = ({ isVisible, onClose, pettyCashEntryId, user }) => {
    const [initialDate] = useState(new Date().toISOString().slice(0, 10));
    const [selectedDate, setSelectedDate] = useState('');
    const [pettyCashEntries, setPettyCashEntries] = useState([
        {
            noVoucher: '',
            jenis: '',
            tanggal: '',
            description: '',
            account: '',
            detail: '',
            debit: 0,
            credit: 0,
            karyawan: '',
            divisi: '',
            createdBy: ''
        },
    ]);
    const [msg, setMsg] = useState('');
    const [chartOfAccounts, setChartOfAccounts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [tableEntries, setTableEntries] = useState([]);
    const [entriesAdded, setEntriesAdded] = useState(false);
    const [karyawan, setKaryawan] = useState('');
    const [divisi, setDivisi] = useState('');
    const [divisions, setDivisions] = useState([]);

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

    useEffect(() => {
        const fetchDivisions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/divisions');
                setDivisions(response.data);
            } catch (error) {
                console.error('Error fetching divisions:', error);
            }
        };

        fetchDivisions();
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
        setPettyCashEntries(entries => [{ ...entries[0], description: value }]);
    };

    const handleAccountChange = (result) => {
        setSelectedAccount(result.account);
        setPettyCashEntries(entries => [{ ...entries[0], description: result.name, account: result.account }]);
        setSearchTerm(result.name);
        setSearchResults([]);
    };

    const handleEntryChange = (index, field, value) => {
        setPettyCashEntries(entries => entries.map((item, idx) => idx === index ? { ...item, [field]: value } : item));
    };

    const addNewEntry = () => {
        setTableEntries([
            ...tableEntries,
            { 
                ...pettyCashEntries[0], 
                tanggal: selectedDate || initialDate, 
                karyawan,
                divisi
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
        setPettyCashEntries([entryToEdit]);
        setSelectedDate(entryToEdit.tanggal);
        setTableEntries(tableEntries.filter((entry, i) => i !== index));
    };

    const savePettyCashEntry = async (e) => {
        e.preventDefault();
        if (!entriesAdded) {
            setMsg('Isi petty cash terlebih dahulu.');
            setTimeout(() => {
                setMsg('');
            }, 3000); 
            return;
        }
        try {
            const response = await Promise.all(
                tableEntries.map((entry) =>
                    axios.post('http://localhost:5000/petty_cash', {
                        createdBy: user.name,
                        noVoucher: entry.noVoucher,
                        jenis: entry.jenis,
                        tanggal: entry.tanggal,
                        description: entry.description,
                        account: entry.account,
                        detail: entry.detail,
                        debit: entry.debit,
                        credit: entry.credit,
                        karyawan: entry.karyawan,
                        divisi: entry.divisi
                    })
                )
            );
            if (response.every(res => res.status === 201)) {
                setMsg('Petty cash entries berhasil ditambahkan!');
                setTableEntries([]);
                setEntriesAdded(false);
                window.location.reload();
            } else {
                setMsg('Terjadi kesalahan saat menyimpan entri petty cash.');
            }
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg || 'Terjadi kesalahan saat menyimpan entri petty cash.');
            } else {
                setMsg('Terjadi kesalahan saat menyimpan entri petty cash.');
            }
        }
        setTimeout(() => {
            setMsg('');
        }, 3000); 
    };

    const totalDebit = tableEntries.reduce((acc, entry) => acc + parseFloat(entry.debit || 0), 0);
    const totalCredit = tableEntries.reduce((acc, entry) => acc + parseFloat(entry.credit || 0), 0);

    return (
        <div className={`fixed inset-0 flex justify-center items-start z-50 overflow-auto bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? 'opacity-100 animate-fade-in' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-white p-8 rounded-lg shadow-md w-[1200px] mt-8 ">
                <h2 className='text-2xl font-semibold mb-4'>Tambah Petty Cash</h2>
                {msg && <div className='text-green-500 mb-4 animate-fade-in'>{msg}</div>}
                <form onSubmit={savePettyCashEntry}>
                    {pettyCashEntries.map((entry, index) => (
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
                                    <label htmlFor={`karyawan_${index}`} className='block text-gray-700 font-medium mb-2'>
                                        Karyawan
                                    </label>
                                    <input
                                        type='text'
                                        id={`karyawan_${index}`}
                                        name={`karyawan_${index}`}
                                        value={karyawan}
                                        onChange={(e) => setKaryawan(e.target.value)}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                                        placeholder='Enter employee...'
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`divisi_${index}`} className='block text-gray-700 font-medium mb-2'>
                                        Divisi
                                    </label>
                                    <select
                                        id={`divisi_${index}`}
                                        name={`divisi_${index}`}
                                        value={divisi}
                                        onChange={(e) => setDivisi(e.target.value)}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                                    >
                                        <option value=''>Pilih Divisi</option>
                                        {divisions.map(division => (
                                            <option key={division.id} value={division.name}>{division.name}</option>
                                        ))}
                                    </select>
                                </div>
                                </div>
                            <div className='grid grid-cols-2 gap-4 mt-4'>
                                <div>
                                    <label htmlFor={`description_${index}`} className='block text-gray-700 font-medium mb-2'>
                                        Detail
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
                                        disabled
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                                        placeholder='Search for account...'
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`detail_${index}`} className='block text-gray-700 font-medium mb-2'>
                                        Description
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
                                        placeholder='Enter debit...'
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
                                        placeholder='Enter credit...'
                                    />
                                </div>
                            </div>
                            <div className='flex justify-end mt-4'>
                                <button type='button' onClick={addNewEntry} className='flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'>
                                    <FaRegPlusSquare className='text-xl' />
                                    <span>Tambah Entry</span>
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className='mt-4'>
                        <div className='flex justify-between'>
                            <h3 className='text-lg font-semibold'>Total Debit</h3>
                            <span className='text-lg font-semibold'>{totalDebit}</span>
                        </div>
                        <div className='flex justify-between mt-2'>
                            <h3 className='text-lg font-semibold'>Total Credit</h3>
                            <span className='text-lg font-semibold'>{totalCredit}</span>
                        </div>
                    </div>
                    <div className='mt-4 flex justify-end'>
                        <button type='submit' className='flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600'>
                            <VscSave className='text-xl' />
                            <span>Simpan</span>
                        </button>
                        <button type='button' onClick={onClose} className='flex items-center space-x-2 px-4 py-2 ml-4 bg-red-500 text-white rounded-md hover:bg-red-600'>
                            <FiX className='text-xl' />
                            <span>Tutup</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPettyCash;
