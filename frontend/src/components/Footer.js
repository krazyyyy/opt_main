import { useNavigate } from 'react-router-dom';
import { Routes } from '../constants/constants';
import React, { Component }  from 'react';

const Footer = () => {
    const navigate = useNavigate();
    return (
        <footer>
            <div className="flex_row flexBox_center">
                <h2 className="pointer" onClick={() => navigate(Routes.ABOUT)}>
                    About
                </h2>
                <h2
                    className="margin_inline_med pointer"
                    onClick={() => navigate(Routes.PRIVACY)}
                >
                    Privacy Policy
                </h2>
                <h2 className="pointer" onClick={() => navigate(Routes.TERMS)}>
                    Terms and Conditions
                </h2>
                <h2 className="margin_inline_med pointer">
                    <a
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        href="mailto:admin@optimumstaking.finance"
                    >
                        Contact us
                    </a>
                </h2>
                <h2
                    className="pointer"
                    onClick={() =>
                        window.open('https://www.certik.com/projects/optimum')
                    }
                >
                    Certik Audit
                </h2>
            </div>
        </footer>
    );
};

export default Footer;
