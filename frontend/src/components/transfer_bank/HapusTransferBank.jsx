import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HapusTransferBank = ({ isVisible, onClose, transferBankEntryId }) => {
    const [transferBankEntry, setTransferBankEntry] = useState(null);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (isVisible && transferBankEntryId) {
            const fetchTransferBankEntry = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/transfer_bank/${transferBankEntryId}`);
                    setTransferBankEntry(response.data);
                } catch (error) {
                    console.error('Error fetching transfer bank entry: ', error);
                }
            };

            fetchTransferBankEntry();
        }
    }, [isVisible, transferBankEntryId]);

    const deleteTransferBankEntry = async () => {
        try {
            await axios.delete(`http://localhost:5000/transfer_bank/${transferBankEntryId}`);
            setMsg("Transfer bank entry berhasil dihapus!");
            // Lakukan operasi setelah transfer bank entry dihapus, misalnya reload data atau tindakan lainnya
            window.location.reload();
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            } else {
                console.error('Error deleting transfer bank entry: ', error);
            }
        }
    };

    const handleCancel = () => {
        onClose(); // Menutup komponen saat tombol Batal diklik
    };

    return (
        <div className={`fixed inset-0 flex justify-center items-center z-50 overflow-auto bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-white p-8 rounded-lg shadow-md mt-8 ">
                <h2 className="text-2xl font-semibold mb-4">Hapus Transfer Bank Entry</h2>
                <div className="mb-4">
                    <p className="text-gray-700 font-medium mb-2">Apakah Anda yakin ingin menghapus transfer bank entry ini?</p>
                    {msg && <p className="text-green-500 text-sm">{msg}</p>}
                </div>
                <div className="flex justify-end">
                    <button type="button" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md" onClick={deleteTransferBankEntry}>Hapus</button>
                    <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md ml-2" onClick={handleCancel}>Batal</button>
                </div>
            </div>
        </div>
    );
};

export default HapusTransferBank;
