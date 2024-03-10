import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { IoMdAddCircle } from "react-icons/io";
import { FaEdit, FaLock, FaUnlock, FaPrint } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import Pagination from "./Pagination";
import AddCOA from "./AddCOA";
import EditCOA from "./EditCOA";
import DeleteCOA from "./DeleteCOA";

const FileCOA = ({ user }) => {
    const [coa, setCOA] = useState([]);
    const [showTambahModal, setShowTambahModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCOAId, setSelectedCOAId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getCOA();
    }, [currentPage, entriesPerPage]);

    const navigate = useNavigate();

    const getCOA = async () => {
        try {
            const response = await axios.get("http://localhost:5000/chart_of_account");
            setCOA(response.data);
        } catch (error) {
            console.error("Error fetching coa: ", error);
        }
    };

    const filteredCOA = coa.filter(item => {
        return (
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const indexOfLastEntry = Math.min(currentPage * entriesPerPage, filteredCOA.length);
    const indexOfFirstEntry = Math.max(0, indexOfLastEntry - entriesPerPage);
    const currentEntries = filteredCOA.slice(indexOfFirstEntry, indexOfLastEntry);

    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Fragment>
            <div className='m-8'>
                <div className='text-2xl font-semibold'>
                    <h1>COA</h1>
                </div>
                <div className='bg-zinc-100 mt-5 shadow-md rounded h-full w-full '>
                    <div className='m-3 p-1'>
                        <button className='flex rounded bg-blue-400 hover:bg-blue-500 duration-500 p-2 mt-2 shadow-md' onClick={() => setShowTambahModal(true)}>
                            <IoMdAddCircle className='text-zinc-100 text-xl mt-0.5' />
                            <span className='ml-1 text-zinc-100'>Tambah COA</span>
                        </button>
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
                            <table className="table-auto w-full mb-3 bg-zinc-200   border-collapse border border-gray-300">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2">Actions</th>
                                        <th className="px-4 py-2">No</th>
                                        <th className="px-4 py-2">No Account</th>
                                        <th className="px-4 py-2">Nama Account</th>
                                        <th className="px-4 py-2">Induk</th>
                                        <th className="px-4 py-2">Tipe</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Level</th>
                                        <th className="px-4 py-2">Def</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEntries.map((item, index) => (
                                        <tr key={item.uuid} className="bg-gray-100 hover:bg-gray-300 ">
                                            <td className="border border-slate-200 px-4 py-2 flex justify-center">
                                                <button className="bg-blue-400 hover:bg-blue-500 duration-500 text-white font-bold py-2 px-4 rounded" onClick={() => {
                                                    setShowEditModal(true);
                                                    setSelectedCOAId(item.uuid);
                                                }}>
                                                    <FaEdit className='text-zinc-100' />
                                                </button>
                                                <button className="bg-red-400 hover:bg-red-500 duration-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => {
                                                    setShowDeleteModal(true);
                                                    setSelectedCOAId(item.uuid);
                                                }}>
                                                    <MdDelete className='text-zinc-100' />
                                                </button>
                                            </td>
                                            <td className="border border-slate-200 px-4 py-2 text-center">{indexOfFirstEntry + index + 1}</td>
                                            <td className="border border-slate-200 px-4 py-2 text-center">{item.account}</td>
                                            <td className="border border-slate-200 px-4 py-2">{item.name}</td>
                                            <td className="border border-slate-200 px-4 py-2 text-center">{item.induk}</td>
                                            <td className="border border-slate-200 px-4 py-2 text-center">{item.klasifikasi}</td>
                                            <td className="border border-slate-200 px-4 py-2 text-center">{item.type}</td>
                                            <td className="border border-slate-200 px-4 py-2 text-center">{item.level}</td>
                                            <td className="border border-slate-200 px-4 py-2 text-center">{item.defSaldo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <Pagination className='mt-3 mb-3'
                                totalEntries={filteredCOA.length}
                                entriesPerPage={entriesPerPage}
                                currentPage={currentPage}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <AddCOA isVisible={showTambahModal} onClose={() => setShowTambahModal(false)} user={user} />
            <EditCOA isVisible={showEditModal} onClose={() => setShowEditModal(false)} COAId={selectedCOAId} user={user} />
            <DeleteCOA isVisible={showDeleteModal} onClose={() => setShowDeleteModal(false)} COAId={selectedCOAId} user={user} />
        </Fragment>
    );
}

export default FileCOA;
