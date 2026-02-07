import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../components/common/Home';
import Login from '../pages/auth/Login';
import BusinessLogin from '../pages/auth/BusinessLogin';
import ForgotPassword from '../pages/auth/ForgotPassword';
import OtpVerify from '../pages/auth/OtpVerify';
import SetNewPassword from '../pages/auth/SetNewPassword';
import Register from '../pages/auth/Register';
import BusinessRegister from '../pages/auth/BusinessRegister';
import BusinessForgotPassword from '../pages/auth/BusinessForgotPassword';
import BusinessOtpVerify from '../pages/auth/BusinessOtpVerify';
import BusinessSetNewPassword from '../pages/auth/BusinessSetNewPassword';
import BusinessKYC from '../pages/auth/BusinessKYC';
import ResetPassword from '../pages/auth/ResetPassword';
import PathologyListing from '../pages/customer/PathologyListing';
import LabDetail from '../pages/customer/LabDetail';
import ProfilePage from '../pages/customer/ProfilePage';
import CartPage from '../pages/customer/CartPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import BusinessDashboard from '../pages/business/BusinessDashboard';
import BusinessDetails from '../pages/business/BusinessDetails';
import TestCatalogue from '../pages/business/TestCatalogue';

// Dummy Component for placeholder pages
const PlaceholderPage = ({ title }) => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <h1 className="text-4xl font-bold text-[#1e3a5f]">{title} Page</h1>
    </div>
);

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />

                {/* Navigation Routes */}
                <Route path="services" element={<PlaceholderPage title="Services" />} />
                <Route path="about" element={<PlaceholderPage title="About us" />} />
                <Route path="contact" element={<PlaceholderPage title="Contact Us" />} />

                {/* Auth Routes */}
                <Route path="login/customer" element={<Login />} />
                <Route path="login/business" element={<BusinessLogin />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="otp-verify" element={<OtpVerify />} />
                <Route path="set-new-password" element={<SetNewPassword />} />
                <Route path="register" element={<Register />} />
                <Route path="register/business" element={<BusinessRegister />} />
                <Route path="forgot-password/business" element={<BusinessForgotPassword />} />
                <Route path="otp-verify/business" element={<BusinessOtpVerify />} />
                <Route path="set-new-password/business" element={<BusinessSetNewPassword />} />
                <Route path="kyc/business" element={<BusinessKYC />} />
                <Route path="reset-password" element={<ResetPassword />} />

                {/* Protected Routes - Logged In User */}
                <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="listing" element={<ProtectedRoute><PathologyListing /></ProtectedRoute>} />
                <Route path="lab/:id" element={<ProtectedRoute><LabDetail /></ProtectedRoute>} />
                <Route path="test/:id" element={<ProtectedRoute><LabDetail /></ProtectedRoute>} />
                <Route path="cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />

                {/* Catch-all for 404 */}
                <Route path="*" element={<PlaceholderPage title="404 - Not Found" />} />
            </Route>

            {/* Business Routes - Separate Layout */}
            <Route path="/business/dashboard" element={<BusinessDashboard />} />
            <Route path="/business/details" element={<BusinessDetails />} />
            <Route path="/business/test-catalogue" element={<TestCatalogue />} />
        </Routes>
    );
};

export default AppRoutes;
