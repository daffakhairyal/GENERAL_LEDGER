/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { IoMdAddCircle } from "react-icons/io";
import { FaEdit, FaLock, FaUnlock, FaPrint } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Pagination from "./Pagination";
import TambahSuratMasuk from "./TambahSuratMasuk";
import EditSuratMasuk from "./EditSuratMasuk";
import HapusSuratMasuk from "./HapusSuratMasuk";

const RecordSuratMasuk = ({ user }) => {
    const userRole = user && user.role;

    if (!user || !userRole) {
        return <div>Loading...</div>;
    }

    const [suratMasuk, setSuratMasuk] = useState([]);
    const [showTambahModal, setShowTambahModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSuratMasukId, setSelectedSuratMasukId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getSuratMasuk();
    }, [currentPage, entriesPerPage]);

    const navigate = useNavigate(); // Initialize useNavigate

    const getSuratMasuk = async () => {
        try {
            const response = await axios.get("http://localhost:5000/surat_masuk");
            setSuratMasuk(response.data);
        } catch (error) {
            console.error("Error fetching surat masuk: ", error);
        }
    };

    const handleEditSuratMasuk = (suratMasukId) => {
        setShowEditModal(true);
        setSelectedSuratMasukId(suratMasukId);
    };

    const handleDeleteSuratMasuk = (suratMasukId) => {
        setShowDeleteModal(true);
        setSelectedSuratMasukId(suratMasukId);
    };

    const handleLockSurat = async (suratId) => {
        try {
            await axios.patch(`http://localhost:5000/surat_masuk/${suratId}`, { status: 1 });
            const updatedSuratMasuk = suratMasuk.map(surat => {
                if (surat.uuid === suratId) {
                    return { ...surat, status: 1 };
                }
                return surat;
            });
            setSuratMasuk(updatedSuratMasuk);
        } catch (error) {
            console.error("Error locking surat: ", error);
        }
    };

    const handleUnlockSurat = async (suratId) => {
        try {
            await axios.patch(`http://localhost:5000/surat_masuk/${suratId}`, { status: 0 });
            const updatedSuratMasuk = suratMasuk.map(surat => {
                if (surat.uuid === suratId) {
                    return { ...surat, status: 0 };
                }
                return surat;
            });
            setSuratMasuk(updatedSuratMasuk);
        } catch (error) {
            console.error("Error unlocking surat: ", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return formattedDate;
    };

    const filteredSuratMasuk = suratMasuk.filter(surat => {
        return surat.perihal_surat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                surat.penerima_surat_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                surat.tanggal_surat_masuk.toLowerCase().includes(searchTerm.toLowerCase()) ||
                surat.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const indexOfLastEntry = Math.min(currentPage * entriesPerPage, filteredSuratMasuk.length);
    const indexOfFirstEntry = Math.max(0, indexOfLastEntry - entriesPerPage);
    const currentEntries = filteredSuratMasuk.slice(indexOfFirstEntry, indexOfLastEntry);

    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const handlePrintSuratMasuk = (suratId) => {
        // Navigate to SuratMasukTemplate page with the selected surat id
        const surat = suratMasuk.find(item => item.uuid === suratId);
        if (surat) {
            navigate(`/surat-masuk/${suratId}`);
        } else {
            console.error(`Surat with id ${suratId} not found.`);
        }
    };

    return (
        <Fragment>
            <div className='m-8'>
                <div className='text-2xl font-semibold'>
                    <h1>Surat Masuk</h1>
                </div>
                <div className='bg-zinc-100 mt-5 shadow-md rounded h-full '>
                    <div className='m-3 p-1'>
                        <input
                            type="text"
                            placeholder="Search..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 mt-2 border border-gray-300 rounded"
                        />
                        <select
                            className="p-2 ml-2 mt-2 border border-gray-300 rounded"
                            onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
                            value={entriesPerPage}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <div className='mt-2'>
                            <table className="table-auto w-full mb-3  border-collapse border border-gray-300">
                                <thead className="bg-gray-200">
                                    <tr>
                                        
                                        <th className="px-4 py-2">No</th>
                                        <th className="px-4 py-2">Perihal Surat</th>
                                        <th className="px-4 py-2">Penerima Surat</th>
                                        <th className="px-4 py-2">Tanggal Surat Masuk</th>
                                        <th className="px-4 py-2">Dibuat oleh</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEntries.map((surat, index) => (
                                        <tr key={surat.uuid} className="hover:bg-gray-100">
                                            <td className="border border-slate-200 px-4 py-2">{indexOfFirstEntry + index + 1}</td>
                                            <td className="border border-slate-200 px-4 py-2">{surat.perihal_surat}</td>
                                            <td className="border border-slate-200 px-4 py-2">{surat.penerima_surat_nama}</td>
                                            <td className="border border-slate-200 px-4 py-2">{formatDate(surat.tanggal_surat_masuk)}</td>
                                            <td className="border border-slate-200 px-4 py-2">{surat.createdBy}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <Pagination className='mt-3'
                                totalEntries={filteredSuratMasuk.length}
                                entriesPerPage={entriesPerPage}
                                currentPage={currentPage}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <TambahSuratMasuk className='duration-500' isVisible={showTambahModal} onClose={() => setShowTambahModal(false)} user={user} />
            <EditSuratMasuk className='duration-500' isVisible={showEditModal} onClose={() => setShowEditModal(false)} suratMasukId={selectedSuratMasukId} user={user} />
            <HapusSuratMasuk className='duration-500' isVisible={showDeleteModal} onClose={() => setShowDeleteModal(false)} suratMasukId={selectedSuratMasukId} user={user} />
        </Fragment>
    );
}

export default RecordSuratMasuk;
