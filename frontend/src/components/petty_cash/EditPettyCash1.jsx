import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheck, FiX, FiSearch } from 'react-icons/fi';

const EditPettyCash = ({ isVisible, onClose, pettyCashEntryId, user }) => {
    const [entryData, setEntryData] = useState({
        noVoucher: '',
        jenis: '',
        tanggal: '',
        description: '',
        account: '',
        detail: '',
        debit: 0,
        credit: 0,
        karyawan: '',
        divisi: ''
    });
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [divisions, setDivisions] = useState([]);

    useEffect(() => {
        const fetchEntryData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/petty_cash/${pettyCashEntryId}`);
                const formattedDate = new Date(response.data.tanggal).toISOString().slice(0, 10);
                setEntryData({ ...response.data, tanggal: formattedDate });
            } catch (error) {
                console.error('Error fetching petty cash entry data:', error);
            }
        };

        fetchEntryData();
    }, [pettyCashEntryId]);

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

    const searchAccounts = async (keyword) => {
        if (keyword.trim() === '') {
            setSearchResults([]);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/chart_of_account?q=${keyword}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching chart of accounts:', error);
        }
    };

    const handleDescriptionChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
        searchAccounts(value);
        setSelectedAccount('');
        setEntryData({ ...entryData, description: value });
    };

    const handleAccountChange = (result) => {
        setSelectedAccount(result.account);
        setEntryData({ ...entryData, description: result.name, account: result.account });
        setSearchTerm(result.name);
        setSearchResults([]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEntryData({ ...entryData, [name]: value });
    };

    const handleSave = async () => {
        try {
            await axios.patch(`http://localhost:5000/petty_cash/${pettyCashEntryId}`, entryData);
            onClose();
        } catch (error) {
            console.error('Error updating petty cash entry:', error);
        }
    };

    return (
        <div className={`fixed inset-0 flex justify-center items-center z-50 overflow-auto bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-white p-8 rounded-lg shadow-md w-[600px] animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Edit Petty Cash</h2>
                <form onSubmit={handleSave}>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label htmlFor="noVoucher" className="block text-base font-medium text-gray-700">No Voucher</label>
                            <input type="text" id="noVoucher" name="noVoucher" value={entryData.noVoucher} onChange={handleInputChange} disabled className=" p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="jenis" className="block text-base font-medium text-gray-700">Jenis</label>
                            <select id="jenis" name="jenis" value={entryData.jenis} onChange={handleInputChange} disabled className="p-2 mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="">Pilih Jenis</option>
                                <option value="Petty Cash Out">Petty Cash Out</option>
                                <option value="Petty Cash In">Petty Cash In</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tanggal" className="block text-base font-medium text-gray-700">Tanggal</label>
                            <input type="date" id="tanggal" name="tanggal" value={entryData.tanggal} onChange={handleInputChange} className="p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        </div>
                        <div className="">
                            <label htmlFor="description" className="block text-base font-medium text-gray-700">Description</label>
                            <input type="text" id="description" name="description" value={entryData.description} onChange={handleDescriptionChange} className="p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder='Search for description...' />
                        </div>
                        <div className="">
                            <label htmlFor="account" className="block text-base font-medium text-gray-700">Account</label>
                            <input type="text" id="account" name="account" readOnly value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} className="p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder='Search for account...' />
                        </div>
                        <div className='col-span-2'>
                            <label htmlFor="detail" className="block text-base font-medium text-gray-700">Detail</label>
                            <input type="text" id="detail" name="detail" value={entryData.detail} onChange={handleInputChange} className="p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="karyawan" className="block text-base font-medium text-gray-700">Karyawan</label>
                            <input type="text" id="karyawan" name="karyawan" value={entryData.karyawan} onChange={handleInputChange} className="p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="divisi" className="block text-base font-medium text-gray-700">Divisi</label>
                            <select id="divisi" name="divisi" value={entryData.divisi} onChange={handleInputChange} className="p-2 mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="">Pilih Divisi</option>
                                {divisions.map((division) => (
                                    <option key={division.id} value={division.name}>{division.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="debit" className="block text-base font-medium text-gray-700">Debit</label>
                            <input type="number" id="debit" name="debit" value={entryData.debit} onChange={handleInputChange} className="p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="credit" className="block text-base font-medium text-gray-700">Credit</label>
                            <input type="number" id="credit" name="credit" value={entryData.credit} onChange={handleInputChange} className="p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button type="submit" className="inline-flex items-center px-4 py-2 bg-green-500 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-green-600 active:bg-green-700 focus:outline-none focus:border-green-700 focus:ring focus:ring-green-200 disabled:opacity-25 transition">
                            <FiCheck className="mr-2" /> Simpan
                        </button>
                        <button type="button" onClick={onClose} className="inline-flex items-center px-4 py-2 ml-4 bg-red-500 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-red-600 active:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition">
                            <FiX className="mr-2" /> Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPettyCash;
