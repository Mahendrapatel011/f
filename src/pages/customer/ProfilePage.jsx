// pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import ProfileForm from '../../components/profile/ProfileForm';
import MyAccountPage from './profile/MyAccountPage';
import MyReportPage from './profile/MyReportPage';
import ResetPasswordPage from './profile/ResetPasswordPage';
import DeleteAccountPage from './profile/DeleteAccountPage';
import HelpSupportPage from './profile/HelpSupportPage';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import profileService from '../../services/profileService';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // OTP Modal states
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpType, setOtpType] = useState(''); // 'email' or 'mobile'
    const [otpValue, setOtpValue] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [pendingValue, setPendingValue] = useState(''); // email or mobile being added

    // Fetch user profile on component mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await profileService.getProfile();

            if (response.success) {
                const customer = response.data.customer;
                setUserData({
                    firstName: customer.firstName || '',
                    lastName: customer.lastName || '',
                    age: customer.age || '',
                    email: customer.email || '',
                    mobile: customer.mobile || '',
                    dob: customer.dob ? new Date(customer.dob).toISOString().split('T')[0] : '',
                    gender: customer.gender || '',
                    address: customer.address || '',
                    avatar: customer.profilePicture || ''
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (data) => {
        try {
            const updateData = {
                firstName: data.firstName,
                lastName: data.lastName,
                age: parseInt(data.age),
                dob: data.dob,
                gender: data.gender,
                address: data.address,
                profilePicture: data.avatar
            };

            const response = await profileService.updateProfile(updateData);

            if (response.success) {
                alert('Profile updated successfully!');
                // Refresh profile data
                await fetchProfile();
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            alert(err.message || 'Failed to update profile');
        }
    };

    const handleAddEmail = async (email) => {
        if (!email) {
            alert('Please enter an email address');
            return;
        }

        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            const response = await profileService.addEmail(email);
            if (response.success) {
                setPendingValue(email);
                setOtpType('email');
                setShowOtpModal(true);
                alert(response.message);
            }
        } catch (err) {
            console.error('Error adding email:', err);
            alert(err.message || 'Failed to add email');
        }
    };

    // Set this to true to skip OTP verification for adding mobile number
    const SKIP_MOBILE_OTP_PROFILE = true;

    const handleAddMobile = async (mobile) => {
        if (!mobile) {
            alert('Please enter a mobile number');
            return;
        }

        // Validate mobile format (10 digits)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            const response = await profileService.addMobile(mobile);
            if (response.success) {
                if (SKIP_MOBILE_OTP_PROFILE) {
                    alert('Mobile number added successfully!');
                    await fetchProfile();
                } else {
                    setPendingValue(mobile);
                    setOtpType('mobile');
                    setShowOtpModal(true);
                    alert(response.message);
                }
            }
        } catch (err) {
            console.error('Error adding mobile:', err);
            alert(err.message || 'Failed to add mobile');
        }
    };

    const handleVerifyOtp = async () => {
        if (!otpValue) {
            alert('Please enter OTP');
            return;
        }

        setOtpLoading(true);
        try {
            const response = await profileService.verifyAddition({
                otp: otpValue,
                type: otpType
            });

            if (response.success) {
                alert(response.message);
                setShowOtpModal(false);
                setOtpValue('');
                setPendingValue('');
                setOtpType('');
                // Refresh profile to show new email/mobile
                await fetchProfile();
            }
        } catch (err) {
            console.error('Error verifying OTP:', err);
            alert(err.message || 'Invalid OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleCloseOtpModal = () => {
        setShowOtpModal(false);
        setOtpValue('');
        setPendingValue('');
        setOtpType('');
    };

    const openSidebar = () => setIsSidebarOpen(true);
    const closeSidebar = () => setIsSidebarOpen(false);

    const getPageTitle = () => {
        const titles = {
            profile: 'My Profile',
            account: 'My Account',
            report: 'My Bookings',
            password: 'Reset Password',
            delete: 'Delete Account',
            help: 'Help & Support'
        };
        return titles[activeTab] || 'My Profile';
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <ProfileForm
                        initialData={userData}
                        onSubmit={handleProfileUpdate}
                        onAddEmail={handleAddEmail}
                        onAddMobile={handleAddMobile}
                    />
                );
            case 'account':
                return <MyAccountPage />;
            case 'report':
                return <MyReportPage />;
            case 'password':
                return <ResetPasswordPage />;
            case 'delete':
                return <DeleteAccountPage />;
            case 'help':
                return <HelpSupportPage />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 md:py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f] mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading profile...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={fetchProfile}
                            className="mt-2 text-sm text-red-700 underline hover:text-red-800"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Main Content */}
                {!loading && !error && userData && (
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Sidebar */}
                        <ProfileSidebar
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            isOpen={isSidebarOpen}
                            onClose={closeSidebar}
                        />

                        {/* Main Content */}
                        <div className="flex-1 bg-white rounded-xl shadow-md p-4 md:p-8">
                            {/* Mobile Header with Menu Button */}
                            <div className="flex items-center gap-4 mb-6">
                                {/* Hamburger Menu Button - Only visible on mobile */}
                                <button
                                    onClick={openSidebar}
                                    className="md:hidden p-2 rounded-lg bg-[#1e3a5f] text-white 
                                        hover:bg-[#2d4a6f] transition-colors"
                                >
                                    <FaBars className="text-xl" />
                                </button>

                                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                                    {getPageTitle()}
                                </h1>
                            </div>

                            {renderContent()}
                        </div>
                    </div>
                )}
            </div>

            {/* OTP Verification Modal */}
            <Modal
                isOpen={showOtpModal}
                onClose={handleCloseOtpModal}
                size="md"
            >
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Verify {otpType === 'email' ? 'Email' : 'Mobile'}
                    </h2>

                    <p className="text-sm text-gray-600">
                        We've sent an OTP to <span className="font-semibold">{pendingValue}</span>
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter OTP
                        </label>
                        <Input
                            type="text"
                            value={otpValue}
                            onChange={(e) => setOtpValue(e.target.value)}
                            placeholder="Enter 4-digit OTP"
                            maxLength="4"
                            className="text-center text-lg tracking-widest"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            size="md"
                            onClick={handleCloseOtpModal}
                            disabled={otpLoading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={handleVerifyOtp}
                            disabled={otpLoading || !otpValue}
                            className="flex-1"
                        >
                            {otpLoading ? 'Verifying...' : 'Verify'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProfilePage;