/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const TambahSuratMasuk = ({ isVisible, onClose , user}) => {
    const [createdBy, setCreatedBy] = useState(user ? user.name : ""); // Menggunakan user.name sebagai nilai awal
  const [tanggalSuratMasuk, setTanggalSuratMasuk] = useState("");
  const [noUrutSuratMasuk, setNoUrutSuratMasuk] = useState("");
  const [noReferensiSurat, setNoReferensiSurat] = useState("");
  const [peruntukanSurat, setPeruntukanSurat] = useState("");
  const [perihalSurat, setPerihalSurat] = useState("");
  const [pembawaSurat, setPembawaSurat] = useState("");
  const [pembawaSuratKeterangan, setPembawaSuratKeterangan] = useState("");
  const [penerimaSurat, setPenerimaSurat] = useState("");
  const [penerimaSuratJabatan, setPenerimaSuratJabatan] = useState("");
  const [alamatArsipLemariNo, setAlamatArsipLemariNo] = useState("");
  const [alamatArsipMapNo, setAlamatArsipMapNo] = useState("");
  const [tempatSuratMenyurat, setTempatSuratMenyurat] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const saveSuratMasuk = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/surat_masuk", {
        createdBy: user.name,
        tanggal_surat_masuk: tanggalSuratMasuk,
        no_urut_surat_masuk: noUrutSuratMasuk,
        no_referensi_surat: noReferensiSurat,
        peruntukan_surat: peruntukanSurat,
        perihal_surat: perihalSurat,
        pembawa_surat_nama: pembawaSurat,
        pembawa_surat_keterangan: pembawaSuratKeterangan,
        penerima_surat_nama: penerimaSurat,
        penerima_surat_jabatan: penerimaSuratJabatan,
        alamat_arsip_lemari_no: alamatArsipLemariNo,
        alamat_arsip_map_no: alamatArsipMapNo,
        tempat_surat_menyurat: tempatSuratMenyurat
      });
      setMsg("Surat masuk berhasil ditambahkan!");
      
      // Reset form setelah sukses
      setTanggalSuratMasuk("");
      setNoUrutSuratMasuk("");
      setNoReferensiSurat("");
      setPeruntukanSurat("");
      setPerihalSurat("");
      setPembawaSurat("");
      setPembawaSuratKeterangan("");
      setPenerimaSurat("");
      setPenerimaSuratJabatan("");
      setAlamatArsipLemariNo("");
      setAlamatArsipMapNo("");
      setTempatSuratMenyurat("");
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
      <div className="bg-white p-8 rounded-lg shadow-md w-[100vh]">
        <h2 className="text-2xl font-semibold mb-4">Tambah Surat Masuk</h2>
        {msg && <div className="text-green-500 mb-4">{msg}</div>}
        <form onSubmit={saveSuratMasuk}>
          <div className='flex flex-wrap'>
          <div className="mb-4 w-1/4">
              <label htmlFor="createdBy" className="block text-gray-700 font-medium mb-2">Dibuat oleh</label>
              <input type="text" id="createdBy" name="createdBy" value={user.name} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" readOnly />
            </div>
            <div className="mb-4 w-1/4">
              <label htmlFor="tanggalSuratMasuk" className=" block text-gray-700 font-medium mb-2">Tanggal Surat Masuk</label>
              <input type="date" id="tanggalSuratMasuk" name="tanggalSuratMasuk" value={tanggalSuratMasuk} className="ml-2 px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setTanggalSuratMasuk(e.target.value)} />
            </div>
            <div className="mb-4 w-1/5">
              <label htmlFor="noUrutSuratMasuk" className=" block text-gray-700 font-medium mb-2">No</label>
              <input type="text" id="noUrutSuratMasuk" name="noUrutSuratMasuk" value={noUrutSuratMasuk} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setNoUrutSuratMasuk(e.target.value)} />
            </div>
            <div className="mb-4 w-1/5">
              <label htmlFor="noReferensiSurat" className=" block text-gray-700 font-medium mb-2 ">No Referensi</label>
              <input type="text" id="noReferensiSurat" name="noReferensiSurat" value={noReferensiSurat} className=" w-full ml-2 px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setNoReferensiSurat(e.target.value)} />
            </div>
            <div className="mb-4 w-1/2">
              <label htmlFor="peruntukanSurat" className="block text-gray-700 font-medium mb-2">Peruntukkan Surat</label>
              <input type="text" id="peruntukanSurat" name="peruntukanSurat" value={peruntukanSurat} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setPeruntukanSurat(e.target.value)} />
            </div>
            <div className="mb-4 w-full">
              <label htmlFor="perihalSurat" className="block text-gray-700 font-medium mb-2">Perihal Surat</label>
              <input type="text" id="perihalSurat" name="perihalSurat" value={perihalSurat} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setPerihalSurat(e.target.value)} />
            </div>
            <div className="mb-4 w-1/2">
              <label htmlFor="pembawaSurat" className="block text-gray-700 font-medium mb-2">Pembawa Surat</label>
              <input type="text" id="pembawaSurat" name="pembawaSurat" value={pembawaSurat} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setPembawaSurat(e.target.value)} />
            </div>
            <div className="mb-4 w-1/2">
              <label htmlFor="pembawaSuratKeterangan" className="block text-gray-700 font-medium mb-2">Pembawa Surat Keterangan</label>
              <input type="text" id="pembawaSuratKeterangan" name="pembawaSuratKeterangan" value={pembawaSuratKeterangan} className="ml-2 w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setPembawaSuratKeterangan(e.target.value)} />
            </div>
            <div className="mb-4 w-1/2">
              <label htmlFor="penerimaSurat" className="block text-gray-700 font-medium mb-2">Penerima Surat Nama</label>
              <input type="text" id="penerimaSurat" name="penerimaSurat" value={penerimaSurat} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setPenerimaSurat(e.target.value)} />
            </div>
            <div className="mb-4 w-1/2">
              <label htmlFor="penerimaSuratJabatan" className="block text-gray-700 font-medium mb-2">Penerima Surat Jabatan</label>
              <input type="text" id="penerimaSuratJabatan" name="penerimaSuratJabatan" value={penerimaSuratJabatan} className="w-full ml-2 px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setPenerimaSuratJabatan(e.target.value)} />
            </div>
            <div className="mb-4 w-1/2">
              <label htmlFor="alamatArsipLemariNo" className="block text-gray-700 font-medium mb-2">Alamat Arsip Lemari No.</label>
              <input type="text" id="alamatArsipLemariNo" name="alamatArsipLemariNo" value={alamatArsipLemariNo} className="w-full  px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setAlamatArsipLemariNo(e.target.value)} />
            </div>
            <div className="mb-4 w-1/2">
              <label htmlFor="alamatArsipMapNo" className="block text-gray-700 font-medium mb-2">Alamat Arsip Map No.</label>
              <input type="text" id="alamatArsipMapNo" name="alamatArsipMapNo" value={alamatArsipMapNo} className="w-full ml-2 px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setAlamatArsipMapNo(e.target.value)} />
            </div>
            <div className="mb-4 w-1/2">
              <label htmlFor="tempatSuratMenyurat" className="block text-gray-700 font-medium mb-2">Tempat Surat Menyurat</label>
              <input type="text" id="tempatSuratMenyurat" name="tempatSuratMenyurat" value={tempatSuratMenyurat} className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:border-blue-500" onChange={(e) => setTempatSuratMenyurat(e.target.value)} />
            </div>
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

export default TambahSuratMasuk;
