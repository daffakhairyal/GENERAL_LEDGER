/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from "axios";

const EditPegawai = ({ isVisible, onClose, userId }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [role, setRole] = useState("");
    const [division, setDivision] = useState("");
    const [msg, setMsg] = useState("");
    const [divisions, setDivisions] = useState([]);

    useEffect(() => {
        if (isVisible && userId) {
            const fetchData = async () => {
                try {
                    const [userData, divisionData] = await Promise.all([
                        axios.get(`http://localhost:5000/users/${userId}`),
                        axios.get('http://localhost:5000/divisions/')
                    ]);

                    setName(userData.data.name);
                    setEmail(userData.data.email);
                    setRole(userData.data.role);
                    setDivision(userData.data.division);
                    setDivisions(divisionData.data); // Mengatur data divisi
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchData();
        }
    }, [isVisible, userId]);

    const updateUser = async (e) => {
        e.preventDefault();
        if (!password || !confPassword) {
            setMsg("Password dan Confirm Password harus diisi.");
            return;
        }
    
        // Validasi apakah password dan confPassword cocok
        if (password !== confPassword) {
            setMsg("Password dan Confirm Password harus cocok.");
            return;
        }
        try {
            await axios.patch(`http://localhost:5000/users/${userId}`, {
                name: name,
                email: email,
                password: password,
                confPassword: confPassword,
                role: role,
                division: division
            });
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
                <h2 className="text-2xl font-semibold mb-4">Edit Pegawai</h2>
                <form onSubmit={updateUser}>
                    <div className="mb-4">
                        <label htmlFor="nama" className="block text-gray-700 font-medium mb-2">Nama</label>
                        <input type="text" id="nama" name="nama" value={name} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                        <input type="email" id="email" name="email" value={email} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                        <input type="password" id="password" name="password" value={password} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setPassword(e.target.value)} placeholder="******" />
                        
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confPassword" className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                        <input type="password" id="confpassword" name="confPassword" value={confPassword} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setConfPassword(e.target.value)} placeholder="******" />
                        {password !== confPassword && <p className="text-red-500 text-sm mt-1">Password tidak cocok!</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="role" className="block text-gray-700 font-medium mb-2">Role</label>
                        <select id="role" name="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500">
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="divisi" className="block text-gray-700 font-medium mb-2">Divisi</label>
                        <select id="division" name="divisi" value={division} onChange={(e) => setDivision(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500">
                            <option value="">Pilih Divisi</option>
                            {/* Memetakan data divisi menjadi opsi dropdown */}
                            {divisions.map((division) => (
                                <option key={division.id} value={division.name}>{division.name}</option>
                            ))}
                        </select>
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

export default EditPegawai;
