import React from 'react';

const Pagination = ({ totalEntries, entriesPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    // Function to generate page numbers
    const getPageNumbers = () => {
        const maxPagesToShow = 3; // Number of page numbers to show before using ellipsis
        const pages = [];
        let startPage, endPage;

        if (totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
            startPage = 1;
            endPage = Math.min(totalPages, maxPagesToShow);
        } else if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2)) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - Math.floor(maxPagesToShow / 2);
            endPage = currentPage + Math.floor(maxPagesToShow / 2);
        }

        if (startPage > 1) {
            pages.push(1);
            if (startPage !== 2) pages.push("...");
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        if (endPage < totalPages) {
            if (endPage !== totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="mt-4">
            <nav>
                <ul className="pagination flex flex-row justify-center">
                    <li className={`page-item ${currentPage === 1 ? 'hidden' : ''}`}>
                        <button onClick={() => onPageChange(currentPage - 1)} className="shadow-md page-link bg-gray-200 px-3 py-1 rounded-lg mr-2">
                            Prev
                        </button>
                    </li>
                    {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === "..." ? (
                                <span className="page-ellipsis mr-2">...</span>
                            ) : (
                                <li className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                    <button onClick={() => onPageChange(page)} className="shadow-md page-link bg-gray-200 px-3 py-1 rounded-lg mr-2">
                                        {page}
                                    </button>
                                </li>
                            )}
                        </React.Fragment>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'hidden' : ''}`}>
                        <button onClick={() => onPageChange(currentPage + 1)} className="shadow-md page-link bg-gray-200 px-3 py-1 rounded-lg mr-2">
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;
