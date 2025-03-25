import React from "react";
import { useState } from "react";
import SearchForm from "../SearchForm";

const HeroSection = ({ renderSearchForm }) => {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

  return (
    <div id="hero-section" className="hero-section w-full h-215 relative bg-gray-100 text-center py-16 px-8 flex justify-center items-center">
      <img
        src="src/static/bg.png"
        alt="Stylish fashion"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
          Discover Your Style
        </h1>
        <p className="text-lg md:text-xl mt-4 mb-4 text-gray-600">
          Unleash your inner fashionista with our curated collection of modern clothing.
        </p>
        {renderSearchForm && (
            <SearchForm onSearchResults={handleSearchResults} />
          )}
        <button className="mt-6 px-6 py-3 bg-black text-white text-lg rounded-lg hover:bg-gray-800 transition-all">
          <a href="#product-list" className="hover:text-white">Explore Now</a>
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
