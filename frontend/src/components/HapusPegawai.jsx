/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from "axios";

const HapusPegawai = ({ isVisible, onClose, userId }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [division, setDivision] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (isVisible && userId) {
            const fetchData = async () => {
                try {
                    const userData = await axios.get(`http://localhost:5000/users/${userId}`);
                    setName(userData.data.name);
                    setEmail(userData.data.email);
                    setRole(userData.data.role);
                    setDivision(userData.data.division);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchData();
        }
    }, [isVisible, userId]);

    const deleteUser = async () => {
        try {
            await axios.delete(`http://localhost:5000/users/${userId}`);
            window.location.reload();
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
                <h2 className="text-2xl font-semibold mb-4">Hapus Pegawai</h2>
                <div className="mb-4">
                    <p className="text-gray-700 font-medium mb-2">Apakah Anda yakin ingin menghapus pegawai ini?</p>
                    <p className="text-gray-700 mb-2">Nama: {name}</p>
                    <p className="text-gray-700 mb-2">Email: {email}</p>
                    <p className="text-gray-700 mb-2">Role: {role}</p>
                    <p className="text-gray-700 mb-2">Divisi: {division}</p>
                    {msg && <p className="text-red-500 text-sm">{msg}</p>}
                </div>
                <div className="flex justify-end">
                    <button type="button" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md" onClick={deleteUser}>Hapus</button>
                    <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md ml-2" onClick={() => onClose()}>Batal</button>
                </div>
            </div>
        </div>
    );
};

export default HapusPegawai;
