/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from "axios";

const EditCOA = ({ isVisible, onClose, COAId }) => {
    const [name, setName] = useState("");
    const [account, setAccount] = useState("");
    const [induk, setInduk] = useState("");
    const [tipe, setTipe] = useState("");
    const [level, setLevel] = useState(1);
    const [defSaldo, setDefSaldo] = useState(1);
    const [klasifikasi, setKlasifikasi] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (isVisible && COAId) {
            const fetchCOAData = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/chart_of_account/${COAId}`);
                    const fetchedCOA = response.data;
                    setName(fetchedCOA.name);
                    setAccount(fetchedCOA.account);
                    setInduk(fetchedCOA.induk);
                    setTipe(fetchedCOA.type);
                    setLevel(fetchedCOA.level);
                    setDefSaldo(fetchedCOA.defSaldo);
                    setKlasifikasi(fetchedCOA.klasifikasi);
                } catch (error) {
                    console.error('Error fetching COA data:', error);
                }
            };

            fetchCOAData();
            
        }
    }, [isVisible, COAId]);

    const updateCOA = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/chart_of_account/${COAId}`, {
                name: name,
                account: account,
                induk: induk,
                type: tipe,
                level: level,
                defSaldo: defSaldo,
                klasifikasi: klasifikasi
            });
            setMsg("Chart of Account berhasil diperbarui!");
            setName("");
            setAccount("");
            setInduk("");
            setTipe("");
            setLevel(1);
            setDefSaldo(1);
            setKlasifikasi("");
            window.location.reload();
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-full max-w-xl p-8">
                <h2 className="text-2xl font-semibold mb-4 text-center">Edit Chart of Account</h2>
                {msg && <div className="text-green-500 mb-4 text-center">{msg}</div>}
                <form onSubmit={updateCOA}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                            <input type="text" id="name" name="name" value={name} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="account" className="block text-gray-700 font-medium mb-2">Account</label>
                            <input type="text" id="account" name="account" value={account} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setAccount(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="induk" className="block text-gray-700 font-medium mb-2">Induk</label>
                            <input type="text" id="induk" name="induk" value={induk} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setInduk(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="tipe" className="block text-gray-700 font-medium mb-2">Tipe</label>
                            <input type="text" id="tipe" name="tipe" value={tipe} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setTipe(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="level" className="block text-gray-700 font-medium mb-2">Level</label>
                            <input type="number" id="level" name="level" value={level} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setLevel(parseInt(e.target.value))} />
                        </div>
                        <div>
                            <label htmlFor="defSaldo" className="block text-gray-700 font-medium mb-2">Def</label>
                            <select id="defSaldo" name="defSaldo" value={defSaldo} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setDefSaldo(parseInt(e.target.value))}>
                                <option value={1}>1</option>
                                <option value={-1}>-1</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="klasifikasi" className="block text-gray-700 font-medium mb-2">Klasifikasi</label>
                            <select id="klasifikasi" name="klasifikasi" value={klasifikasi} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setKlasifikasi(e.target.value)}>
                                <option value="Assets">Assets</option>
                                <option value="Liability">Liability</option>
                                <option value="Equity">Equity</option>
                                <option value="Income">Income</option>
                                <option value="Expense">Expense</option>
                                <option value="Other Income">Other Income</option>
                                <option value="Other Expense">Other Expense</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2">Simpan</button>
                        <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md" onClick={() => onClose()}>Batal</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCOA;
