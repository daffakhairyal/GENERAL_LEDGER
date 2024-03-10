/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const TambahPegawai = ({ isVisible, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("");
  const [division, setDivision] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    if (isVisible) {
      const fetchDivisions = async () => {
        try {
          const response = await axios.get('http://localhost:5000/divisions/');
          setDivisions(response.data);
        } catch (error) {
          console.error('Error fetching divisions:', error);
        }
      };

      fetchDivisions();
    }
  }, [isVisible]);

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/users", {
        name: name,
        email: email,
        password: password,
        confPassword: confPassword,
        role: role,
        division: division
      });
      setMsg("User berhasil ditambahkan!");
      
      // Reset form setelah sukses
      setName("");
      setEmail("");
      setPassword("");
      setConfPassword("");
      setRole("");
      setDivision("");
      window.location.reload()
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
        <h2 className="text-2xl font-semibold mb-4">Tambah Pegawai</h2>
        {msg && <div className="text-green-500 mb-4">{msg}</div>}
        <form onSubmit={saveUser}>
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
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 font-medium mb-2">Role</label>
            <select id="role" name="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500">
              <option value="">Pilih Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="divisi" className="block text-gray-700 font-medium mb-2">Divisi</label>
            <select id="divisi" name="divisi" value={division} onChange={(e) => setDivision(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500">
              <option value="">Pilih Divisi</option>
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

export default TambahPegawai;
