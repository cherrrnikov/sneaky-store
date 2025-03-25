import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; 

const SearchForm = () => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    setQuery("");
    if (inputRef.current) {
      inputRef.current.blur();
    }
    navigate(`/search/${query}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full lg:w-1/3 relative">
      <input
        ref={inputRef} 
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products..."
        className="w-full px-4 py-2 border border-black-300 rounded-full focus:outline-none placeholder-gray-500 text-black"
      />
        <button
          type="submit"
          className="w-8 h-8 flex items-center justify-center focus:outline-none absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <svg
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

    </form>
  );
};

export default SearchForm;
