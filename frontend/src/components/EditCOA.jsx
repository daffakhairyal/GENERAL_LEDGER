import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlineSave, AiOutlineClose } from 'react-icons/ai'; // Importing required icons

const EditCOA = ({ isVisible, onClose, COAId }) => {
    const [formData, setFormData] = useState({
        name: '',
        account: '',
        induk: '',
        type: '',
        level: 1,
        defSaldo: 1,
        klasifikasi: '',
    });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (isVisible && COAId) {
            const fetchCOAData = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/chart_of_account/${COAId}`);
                    const fetchedCOA = response.data;
                    setFormData(fetchedCOA);
                } catch (error) {
                    console.error('Error fetching COA data:', error);
                }
            };

            fetchCOAData();
        }
    }, [isVisible, COAId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const updateCOA = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/chart_of_account/${COAId}`, formData);
            setMsg('Chart of Account berhasil diperbarui!');
            window.location.reload();
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    const handleCancel = () => {
        onClose(); // Menutup komponen saat tombol Batal diklik
    };

    return (
        <div className={`fixed inset-0 flex justify-center items-center z-50 overflow-auto bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-white p-8 rounded-lg shadow-md mt-8 w-full max-w-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Edit Chart of Account</h2>
                    <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <AiOutlineClose className="w-6 h-6" />
                    </button>
                </div>
                {msg && <p className="text-green-500 text-sm mb-4">{msg}</p>}
                <form onSubmit={updateCOA}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                Name
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="account" className="block text-gray-700 font-medium mb-2">
                                Account
                                <input
                                    type="text"
                                    id="account"
                                    name="account"
                                    value={formData.account}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="induk" className="block text-gray-700 font-medium mb-2">
                                Induk
                                <input
                                    type="text"
                                    id="induk"
                                    name="induk"
                                    value={formData.induk}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
                                Type
                                <input
                                    type="text"
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="level" className="block text-gray-700 font-medium mb-2">
                                Level
                                <input
                                    type="number"
                                    id="level"
                                    name="level"
                                    value={formData.level}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="defSaldo" className="block text-gray-700 font-medium mb-2">
                                Default Saldo
                                <select
                                    id="defSaldo"
                                    name="defSaldo"
                                    value={formData.defSaldo}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                    onChange={handleChange}
                                >
                                    <option value={1}>1</option>
                                    <option value={-1}>-1</option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="klasifikasi" className="block text-gray-700 font-medium mb-2">
                                Klasifikasi
                                <select
                                    id="klasifikasi"
                                    name="klasifikasi"
                                    value={formData.klasifikasi}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                    onChange={handleChange}
                                >
                                    <option value="Assets">Assets</option>
                                    <option value="Liability">Liability</option>
                                    <option value="Equity">Equity</option>
                                    <option value="Income">Income</option>
                                    <option value="Expense">Expense</option>
                                    <option value="Other Income">Other Income</option>
                                    <option value="Other Expense">Other Expense</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button type="submit" className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2">
                            <AiOutlineSave className="w-4 h-4 mr-2" />
                            Save
                        </button>
                        <button type="button" className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md" onClick={handleCancel}>
                            <AiOutlineClose className="w-4 h-4 mr-2" />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCOA;
