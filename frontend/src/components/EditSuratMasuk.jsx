/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const EditSuratMasuk = ({ isVisible, onClose, user, suratMasukId }) => {
    const [suratMasuk, setSuratMasuk] = useState(null);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuratMasuk = async () => {
            try {
                if (suratMasukId) { // Menambahkan pengecekan kondisional
                    const response = await axios.get(`http://localhost:5000/surat_masuk/${suratMasukId}`);
                    const fetchedSuratMasuk = response.data;
                    // Update createdBy based on logged in user if user exists
                    if (user) {
                        fetchedSuratMasuk.createdBy = user.name;
                    }
                    setSuratMasuk(fetchedSuratMasuk);
                }
            } catch (error) {
                console.error("Error fetching surat masuk:", error);
            }
        };
    
        fetchSuratMasuk();
    }, [suratMasukId, user]);

    const updateSuratMasuk = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/surat_masuk/${suratMasukId}`, suratMasuk);
            setMsg("Surat masuk berhasil diperbarui!");
            window.location.reload();
        } catch (error) {
            console.error("Error updating surat masuk:", error);
            setMsg("Gagal memperbarui surat masuk");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuratMasuk(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    if (!isVisible || !suratMasuk) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 overflow-auto bg-black bg-opacity-50'>
            <div className="bg-white p-8 rounded-lg shadow-md w-[100vh]">
                <h2 className="text-2xl font-semibold mb-4">Edit Surat Masuk</h2>
                {msg && <div className="text-green-500 mb-4">{msg}</div>}
                <form onSubmit={updateSuratMasuk}>
                    <div className='flex flex-wrap'>
                        <div className="mb-4 w-1/4">
                            <label htmlFor="createdBy" className="block text-gray-700 font-medium mb-2">Dibuat oleh</label>
                            <input type="text" name="createdBy" id="createdBy" value={suratMasuk.createdBy} className="w-full px-3 py-2 border border-slate-400 text-slate-300 rounded-md focus:outline-none focus:border-blue-500" readOnly />
                        </div>
                        <div className="mb-4 w-1/4">
                            <label htmlFor="tanggalSuratMasuk" className="block text-gray-700 font-medium mb-2">Tanggal Surat Masuk</label>
                            <input type="date" id="tanggalSuratMasuk" name="tanggal_surat_masuk" value={suratMasuk.tanggal_surat_masuk} className="ml-2 px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/5">
                            <label htmlFor="noUrutSuratMasuk" className="block text-gray-700 font-medium mb-2">No Urut Surat Masuk</label>
                            <input type="text" id="noUrutSuratMasuk" name="no_urut_surat_masuk" value={suratMasuk.no_urut_surat_masuk} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/5">
                            <label htmlFor="noReferensiSurat" className="block text-gray-700 font-medium mb-2">No Referensi Surat</label>
                            <input type="text" id="noReferensiSurat" name="no_referensi_surat" value={suratMasuk.no_referensi_surat} className="w-full ml-2 px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="peruntukanSurat" className="block text-gray-700 font-medium mb-2">Peruntukan Surat</label>
                            <input type="text" id="peruntukanSurat" name="peruntukan_surat" value={suratMasuk.peruntukan_surat} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="perihalSurat" className="block text-gray-700 font-medium mb-2">Perihal Surat</label>
                            <input type="text" id="perihalSurat" name="perihal_surat" value={suratMasuk.perihal_surat} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="pembawaSurat" className="block text-gray-700 font-medium mb-2">Pembawa Surat</label>
                            <input type="text" id="pembawaSurat" name="pembawa_surat_nama" value={suratMasuk.pembawa_surat_nama} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="pembawaSuratKeterangan" className="block text-gray-700 font-medium mb-2">Pembawa Surat Keterangan</label>
                            <input type="text" id="pembawaSuratKeterangan" name="pembawa_surat_keterangan" value={suratMasuk.pembawa_surat_keterangan} className="ml-2 w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="penerimaSurat" className="block text-gray-700 font-medium mb-2">Penerima Surat Nama</label>
                            <input type="text" id="penerimaSurat" name="penerima_surat_nama" value={suratMasuk.penerima_surat_nama} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="penerimaSuratJabatan" className="block text-gray-700 font-medium mb-2">Penerima Surat Jabatan</label>
                            <input type="text" id="penerimaSuratJabatan" name="penerima_surat_jabatan" value={suratMasuk.penerima_surat_jabatan} className="w-full ml-2 px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="alamatArsipLemariNo" className="block text-gray-700 font-medium mb-2">Alamat Arsip Lemari No.</label>
                            <input type="text" id="alamatArsipLemariNo" name="alamat_arsip_lemari_no" value={suratMasuk.alamat_arsip_lemari_no} className="w-full  px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="alamatArsipMapNo" className="block text-gray-700 font-medium mb-2">Alamat Arsip Map No.</label>
                            <input type="text" id="alamatArsipMapNo" name="alamat_arsip_map_no" value={suratMasuk.alamat_arsip_map_no} className="w-full ml-2 px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
                        </div>
                        <div className="mb-4 w-1/2">
                            <label htmlFor="tempatSuratMenyurat" className="block text-gray-700 font-medium mb-2">Tempat Surat Menyurat</label>
                            <input type="text" id="tempatSuratMenyurat" name="tempat_surat_menyurat" value={suratMasuk.tempat_surat_menyurat} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} />
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

export default EditSuratMasuk;
