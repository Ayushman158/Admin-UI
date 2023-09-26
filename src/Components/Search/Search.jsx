import React, {useState} from 'react'
import { Form } from "react-bootstrap";
import "./Search.css"


const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
      setSearchTerm(event.target.value);
      onSearch(event.target.value)
  }
  return (
    <Form.Control
      className='search'
      type="text"
      placeholder="Search By Name, Email or Role" 
      onChange={handleChange} 
      value={searchTerm}
    />
  );
};

export default Search;