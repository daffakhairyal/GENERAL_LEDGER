/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const EditSuratKeluar = ({ isVisible, onClose, user, suratKeluarId }) => {
    const [suratKeluar, setSuratKeluar] = useState(null);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuratKeluar = async () => {
            try {
                if (suratKeluarId) { // Menambahkan pengecekan kondisional
                    const response = await axios.get(`http://localhost:5000/surat_keluar/${suratKeluarId}`);
                    const fetchedSuratKeluar = response.data;
                    // Update createdBy based on logged in user if user exists
                    if (user) {
                        fetchedSuratKeluar.createdBy = user.name;
                    }
                    setSuratKeluar(fetchedSuratKeluar);
                }
            } catch (error) {
                console.error("Error fetching surat keluar:", error);
            }
        };
    
        fetchSuratKeluar();
    }, [suratKeluarId, user]);

    const updateSuratKeluar = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/surat_keluar/${suratKeluarId}`, suratKeluar);
            setMsg("Surat keluar berhasil diperbarui!");
            window.location.reload();
        } catch (error) {
            console.error("Error updating surat keluar:", error);
            setMsg("Gagal memperbarui surat keluar");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuratKeluar(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    if (!isVisible || !suratKeluar) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 overflow-auto bg-black bg-opacity-50'>
            <div className="bg-white p-8 rounded-lg shadow-md w-[100vh]">
                <h2 className="text-2xl font-semibold mb-4">Edit Surat Keluar</h2>
                {msg && <div className="text-green-500 mb-4">{msg}</div>}
                <form onSubmit={updateSuratKeluar}>
                    <div className='flex flex-wrap'>
                        <div className="mb-4 w-1/4">
                            <label htmlFor="createdBy" className="block text-gray-700 font-medium mb-2">Dibuat oleh</label>
                            <input type="text" name="createdBy" id="createdBy" value={suratKeluar.createdBy} className="w-full px-3 py-2 border border-slate-400 text-slate-300 rounded-md focus:outline-none focus:border-blue-500" readOnly />
                        </div>
                        <div className="mb-4 w-1/4">
                            <label htmlFor="tanggalSuratKeluar" className="block text-gray-700 font-medium mb-2">Tanggal Surat Keluar</label>
                            <input type="date" id="tanggalSuratKeluar" name="tanggal_surat_keluar" value={suratKeluar.tanggal_surat_keluar} className="ml-2 px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/5">
                            <label htmlFor="noUrutSuratKeluar" className="block text-gray-700 font-medium mb-2">No Urut Surat Keluar</label>
                            <input type="text" id="noUrutSuratKeluar" name="no_urut_surat_keluar" value={suratKeluar.no_urut_surat_keluar} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/5">
                            <label htmlFor="noReferensiSurat" className="block text-gray-700 font-medium mb-2">No Referensi Surat</label>
                            <input type="text" id="noReferensiSurat" name="no_referensi_surat" value={suratKeluar.no_referensi_surat} className="w-full ml-2 px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="peruntukanSurat" className="block text-gray-700 font-medium mb-2">Peruntukan Surat</label>
                            <input type="text" id="peruntukanSurat" name="peruntukan_surat" value={suratKeluar.peruntukan_surat} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="perihalSurat" className="block text-gray-700 font-medium mb-2">Perihal Surat</label>
                            <input type="text" id="perihalSurat" name="perihal_surat" value={suratKeluar.perihal_surat} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="pembawaSurat" className="block text-gray-700 font-medium mb-2">Pembawa Surat</label>
                            <input type="text" id="pembawaSurat" name="pembawa_surat_nama" value={suratKeluar.pembawa_surat_nama} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="pembawaSuratKeterangan" className="block text-gray-700 font-medium mb-2">Pembawa Surat Keterangan</label>
                            <input type="text" id="pembawaSuratKeterangan" name="pembawa_surat_keterangan" value={suratKeluar.pembawa_surat_keterangan} className="ml-2 w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="penerimaSurat" className="block text-gray-700 font-medium mb-2">Penerima Surat Nama</label>
                            <input type="text" id="penerimaSurat" name="penerima_surat_nama" value={suratKeluar.penerima_surat_nama} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="penerimaSuratJabatan" className="block text-gray-700 font-medium mb-2">Penerima Surat Jabatan</label>
                            <input type="text" id="penerimaSuratJabatan" name="penerima_surat_jabatan" value={suratKeluar.penerima_surat_jabatan} className="w-full ml-2 px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="alamatArsipLemariNo" className="block text-gray-700 font-medium mb-2">Alamat Arsip Lemari No.</label>
                            <input type="text" id="alamatArsipLemariNo" name="alamat_arsip_lemari_no" value={suratKeluar.alamat_arsip_lemari_no} className="w-full  px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="alamatArsipMapNo" className="block text-gray-700 font-medium mb-2">Alamat Arsip Map No.</label>
                            <input type="text" id="alamatArsipMapNo" name="alamat_arsip_map_no" value={suratKeluar.alamat_arsip_map_no} className="w-full ml-2 px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="tempatSuratMenyurat" className="block text-gray-700 font-medium mb-2">Tempat Surat Menyurat</label>
                            <input type="text" id="tempatSuratMenyurat" name="tempat_surat_menyurat" value={suratKeluar.tempat_surat_menyurat} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        {/* Tambahkan input lainnya sesuai dengan field yang ada di database */}
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

export default EditSuratKeluar;
