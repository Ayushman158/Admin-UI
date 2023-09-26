import React, { useEffect, useState } from "react";
import axios from "axios";
import { TABLE_API } from "../../utils/config";
import "@fortawesome/fontawesome-free/css/all.css";
import Pagination from "../Pagination/Pagination";
import "./Userlist.css";
import Search from "../Search/Search";
import { Button, Modal } from 'react-bootstrap';
import EditUserModal from "../EditModal/EditUserModal";

const pageSize = 10;

const Userlist = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [modalAction, setModalAction] = useState(null); // Control variable for modal action
  const [modalData, setModalData] = useState(null); // Data for the modal (e.g., user data)

  const handleSearch = (term) => {
    if (!term) {
      setData(originalData);
    } else {
      const filteredData = originalData.filter((item) => {
        return (
          item.name.toLowerCase().includes(term.toLowerCase()) ||
          item.email.toLowerCase().includes(term.toLowerCase()) ||
          item.role.toLowerCase().includes(term.toLowerCase())
        );
      });
      setData(filteredData);
    }
  };

  useEffect(() => {
    axios
      .get(TABLE_API)
      .then((res) => {
        setOriginalData(res.data);
        setData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const pageCount = data ? Math.ceil(data.length / pageSize) : 0;

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedRows([]);
    setSelectAll(false);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = data.slice(startIndex, endIndex);

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleEditUser = (userId) => {
    // Set the modal action and data for editing
    setModalAction("edit");
    setModalData(data.find((user) => user.id === userId));
  };

  const handleSaveEdit = (editedUser) => {
    const updatedData = data.map((user) =>
      user.id === editedUser.id ? editedUser : user
    );
    setData(updatedData);
    // Close the modal
    setModalAction(null);
  };

  const handleDeleteConfirmation = (id) => {
    // Set the modal action and data for deletion
    setModalAction("delete");
    setModalData({ id });
  };

  const handleConfirmDelete = () => {
    if (modalData && modalData.id) {
      const updatedData = data.filter((info) => info.id !== modalData.id);
      setData(updatedData);
      setSelectedRows(selectedRows.filter((rowId) => rowId !== modalData.id));
      setSelectAll(false);
      // Close the modal
      setModalAction(null);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      const pageIds = currentPageData.map((info) => info.id);
      setSelectedRows(pageIds);
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    const updatedData = data.filter((info) => !selectedRows.includes(info.id));
    setData(updatedData);
    setSelectedRows([]);
    setSelectAll(false);
  };

  return (
    <div>
      <Search onSearch={handleSearch} />
      <div className="userlist-container">
        {!data ? (
          "No data found"
        ) : (
          <div className="table-container">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>
                    <h3>Name</h3>
                  </th>
                  <th>
                    <h3>Email</h3>
                  </th>
                  <th>
                    <h3>Role</h3>
                  </th>
                  <th>
                    <h3>Action</h3>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((info) => (
                  <tr
                    key={info.id}
                    className={selectedRows.includes(info.id) ? "selected-row" : ""}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(info.id)}
                        onChange={() => handleRowSelect(info.id)}
                      />
                    </td>
                    <td>{info.name}</td>
                    <td>{info.email}</td>
                    <td>{info.role}</td>
                    <td className="btn-container">
                      <button onClick={() => handleEditUser(info.id)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDeleteConfirmation(info.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button 
              variant="danger" 
              className="custom-button" 
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </Button>
            <Pagination
              pageCount={pageCount}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
      {modalAction === "edit" && modalData && (
        <EditUserModal
          user={modalData}
          onSave={handleSaveEdit}
          onClose={() => setModalAction(null)}
        />
      )}
      {modalAction === "delete" && modalData && (
        <Modal show={true} onHide={() => setModalAction(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this user?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalAction(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Userlist;
