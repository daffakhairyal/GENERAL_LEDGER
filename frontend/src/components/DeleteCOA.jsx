/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from "axios";

const HapusCOA = ({ isVisible, onClose, COAId }) => {
    const [name, setName] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (isVisible && COAId) {
            const fetchCOAData = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/chart_of_account/${COAId}`);
                    setName(response.data.name);
                } catch (error) {
                    console.error('Error fetching COA data:', error);
                }
            };

            fetchCOAData();
        }
    }, [isVisible, COAId]);

    const deleteCOA = async () => {
        try {
            await axios.delete(`http://localhost:5000/chart_of_account/${COAId}`);
            setMsg("Chart of Account berhasil dihapus!");
            window.location.reload();
            // Tambahkan logika penanganan setelah COA dihapus
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
            <div className="bg-white p-8 rounded-lg shadow-md mt-8 ">
                <h2 className="text-2xl font-semibold mb-4">Hapus Chart of Account</h2>
                <div className="mb-4">
                    <p className="text-gray-700 font-medium mb-2">Apakah Anda yakin ingin menghapus Chart of Account ini?</p>
                    {msg && <p className="text-red-500 text-sm">{msg}</p>}
                </div>
                <div className="flex justify-end">
                    <button type="button" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md" onClick={deleteCOA}>Hapus</button>
                    <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md ml-2" onClick={handleCancel}>Batal</button>
                </div>
            </div>
        </div>
    );
};

export default HapusCOA;
