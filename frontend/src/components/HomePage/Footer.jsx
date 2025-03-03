import React from "react";
import "../../styles/HomePage/Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <Link to="/" state={{ section: "header" }} className="text-3xl font-bold text-white-800">
                    SNEAKY
                </Link>
                <p>Contact us: hiiamdiv@yandex.ru</p>
            </div>
        </footer>
    )
}

export default Footer;