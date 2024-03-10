/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from "axios";

const EditDivisi = ({ isVisible, onClose, divisionId }) => {
    const [name, setName] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (isVisible && divisionId) {
            const fetchDivisionData = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/divisions/${divisionId}`);
                    setName(response.data.name);
                } catch (error) {
                    console.error('Error fetching division data:', error);
                }
            };

            fetchDivisionData();
            
        }
    }, [isVisible, divisionId]);

    const updateDivision = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/divisions/${divisionId}`, {
                name: name
            });
            setMsg("Divisi berhasil diperbarui!");
            setName("");
            window.location.reload()
            // Tambahkan logika penanganan setelah divisi diperbarui
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    if (!isVisible) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 overflow-auto bg-black bg-opacity-50'>
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4">Edit Divisi</h2>
                {msg && <div className="text-green-500 mb-4">{msg}</div>}
                <form onSubmit={updateDivision}>
                    <div className="mb-4">
                        <label htmlFor="nama" className="block text-gray-700 font-medium mb-2">Nama Divisi</label>
                        <input type="text" id="nama" name="nama" value={name} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setName(e.target.value)} />
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

export default EditDivisi;
