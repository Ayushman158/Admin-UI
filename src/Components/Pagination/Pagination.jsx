import React from "react";
import "./Pagination.css";


const Pagination = ({ pageCount, currentPage, onPageChange }) => {
  const pageNumbers = [];
  
  for (let i = 1; i <= pageCount; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
    <nav>
      <ul className="pagination">
        <li
          className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => {
            if(currentPage>1){
              onPageChange(1);
            }
          }
          }
        >
          <span className="page-link" aria-label="First">
            &laquo;&laquo;
          </span>
        </li>
        <li
          className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => {
            if(currentPage>1){
              onPageChange(currentPage - 1 );
            }
          }
          }
        >
          <span className="page-link" aria-label="Previous">
            &laquo;
          </span>
        </li>
        {pageNumbers.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`page-item ${
              pageNumber === currentPage ? "active" : ""
            }`}
            onClick={() => onPageChange(pageNumber)}
          >
            <span className="page-link">{pageNumber}</span>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === pageCount ? "disabled" : ""
          }`}
          onClick={() => {
            if (currentPage < pageCount) {
              onPageChange(currentPage + 1);
            }
          }}
        >
          <span className="page-link" aria-label="Next">
            &raquo;
          </span>
        </li>
        <li
          className={`page-item ${
            currentPage === pageCount ? "disabled" : ""
          }`}
          onClick={() => {
            if (currentPage < pageCount) {
              onPageChange(pageCount);
            }
          }}
        >
          <span className="page-link" aria-label="Last">
            &raquo;&raquo;
          </span>
        </li>
      </ul>
    </nav>
    </div>
  );
};

export default Pagination;
