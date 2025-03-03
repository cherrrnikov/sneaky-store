import React from "react";
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";
import ProductDetail from "./ProductDetail";
import { useState, useEffect } from "react";

const ProductPage = () => {
    const [showSearchInHeader, setShowSearchInHeader] = useState(true);

    useEffect(() => {
    const handleResize = () => {
        setShowSearchInHeader(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="ProductPage page" >
            <Header renderSearchForm={showSearchInHeader}/>
                <ProductDetail/>
            <Footer/>
        </div>
    )
}

export default ProductPage;