import React from 'react';
import { Outlet } from 'react-router-dom'; // Removed useLocation as it caused unused variable warning
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ withNavbar = true, withFooter = true }) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            {withNavbar && <Navbar />}
            <div className="flex-grow-1">
                <Outlet />
            </div>
            {withFooter && <Footer />}
        </div>
    );
};

export default Layout;
