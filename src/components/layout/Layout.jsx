import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthNavbar from './AuthNavbar';
import LoggedInNavbar from './LoggedInNavbar';
import UserFooter from './UserFooter';
import BusinessNavbar from '../business/BusinessNavbar';

const Layout = () => {
    const location = useLocation();

    // Auth pages (Login, Register, etc.)
    const authPaths = ['/login', '/forgot-password', '/otp-verify', '/set-new-password', '/register', '/kyc/business'];
    const isAuthPage = authPaths.some(path => location.pathname.startsWith(path));

    // Logged in user pages (Profile, Dashboard, etc.)
    const userPaths = ['/profile', '/dashboard', '/cart', '/listing', '/Listing', '/lab', '/test'];
    const isUserPage = userPaths.some(path => location.pathname.startsWith(path));

    const renderNavbar = () => {
        if (isAuthPage) return <AuthNavbar />;
        if (isUserPage) return <LoggedInNavbar />;

        // Fallback for 404/Unknown paths based on login status
        const token = localStorage.getItem('token');
        const businessToken = localStorage.getItem('businessToken');

        if (token) return <LoggedInNavbar />;
        if (businessToken) return <BusinessNavbar />;

        return <Navbar />;
    };

    const renderFooter = () => {
        const token = localStorage.getItem('token');
        const businessToken = localStorage.getItem('businessToken');

        if (isAuthPage || isUserPage || token || businessToken) return null;
        return <Footer />;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {renderNavbar()}
            <main className="flex-grow flex flex-col">
                <Outlet />
            </main>
            {renderFooter()}
        </div>
    );
};

export default Layout;
