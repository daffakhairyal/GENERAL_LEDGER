import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Pagination from "../Pagination";
import * as XLSX from 'xlsx';
import { SiMicrosoftexcel } from "react-icons/si";

const ReportTransferBank = () => {
    const [transferBankEntries, setTransferBankEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getTransferBankEntries();
    }, [currentPage, entriesPerPage]);

    const getTransferBankEntries = async () => {
        try {
            const response = await axios.get("http://localhost:5000/transfer_bank");
            setTransferBankEntries(response.data);
        } catch (error) {
            console.error("Error fetching transfer bank entries: ", error);
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    };

    const filteredEntries = transferBankEntries.filter(entry => {
        // Check if any field contains the search term
        return Object.values(entry).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        ) &&
        (fromDate === '' || new Date(entry.tanggal) >= new Date(fromDate)) &&
        (toDate === '' || new Date(entry.tanggal) <= new Date(toDate));
    });
    

    const indexOfLastEntry = Math.min(currentPage * entriesPerPage, filteredEntries.length);
    const indexOfFirstEntry = Math.max(0, indexOfLastEntry - entriesPerPage);
    const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);

    const totalDebit = currentEntries.reduce((total, entry) => total + entry.debit, 0);
    const totalCredit = currentEntries.reduce((total, entry) => total + entry.credit, 0);

    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const exportToExcel = () => {
        const headers = [
            "Description",
            "Date",
            "Debit",
            "Credit",
            "Created By"
        ];
    
        const dataForExport = currentEntries.map(entry => ({
            Description: entry.description,
            Date: new Date(entry.tanggal),
            Debit: entry.debit,
            Credit: entry.credit,
            "Created By": entry.createdBy,
        }));
    
        dataForExport.push({
            Description: 'Total',
            Date: '',
            Debit: totalDebit,
            Credit: totalCredit,
            "Created By": '',
        });
    
        const worksheet = XLSX.utils.json_to_sheet(dataForExport, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transfer Bank");
        XLSX.writeFile(workbook, "transfer_bank.xlsx");
    };

    return (
        <Fragment>
            <div className='m-8'>
                <div className='text-2xl font-semibold'>
                    <h1>Transfer Bank Report</h1>
                </div>
                <div className='bg-zinc-100 mt-5 shadow-md rounded h-full '>
                    <div className='m-3 p-1'>
                        <input
                            type="text"
                            placeholder="Search..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 mt-2 border border-gray-300 rounded"
                        />
                        <input
                            type="date"
                            placeholder="From Date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="p-2 ml-2 mt-2 border border-gray-300 rounded"
                        />
                        <input
                            type="date"
                            placeholder="To Date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="p-2 ml-2 mt-2 border border-gray-300 rounded"
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
                        <button
                            onClick={exportToExcel}
                            className="p-2 ml-2 mt-2 bg-green-500 hover:bg-green-600 duration-300 text-white rounded hover:bg-blue-700"
                        >
                            <div className="flex"><SiMicrosoftexcel className="text-lg mt-1 mr-2"/>Export to Excel</div>
                        </button>
                        <div className='mt-2'>
                            <table className="table-auto w-full mb-3  border-collapse border border-gray-300">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2">Description</th>
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2">Debit</th>
                                        <th className="px-4 py-2">Credit</th>
                                        <th className="px-4 py-2">Created By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEntries.map((entry, index) => (
                                        <tr key={index} className="hover:bg-gray-100">
                                            <td className="border border-slate-200 px-4 py-2">{entry.description}</td>
                                            <td className="border border-slate-200 px-4 py-2">{formatDate(entry.tanggal)}</td>
                                            <td className="border border-slate-200 px-4 py-2">{formatCurrency(entry.debit)}</td>
                                            <td className="border border-slate-200 px-4 py-2">{formatCurrency(entry.credit)}</td>
                                            <td className="border border-slate-200 px-4 py-2">{entry.createdBy}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="2" className="px-4 py-2 font-semibold text-right">Total:</td>
                                        <td className="border border-slate-200 px-4 py-2 font-semibold">{formatCurrency(totalDebit)}</td>
                                        <td className="border border-slate-200 px-4 py-2 font-semibold">{formatCurrency(totalCredit)}</td>
                                        <td className="border border-slate-200 px-4 py-2"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div>
                            <Pagination className='mt-3'
                                totalEntries={filteredEntries.length}
                                entriesPerPage={entriesPerPage}
                                currentPage={currentPage}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default ReportTransferBank;
