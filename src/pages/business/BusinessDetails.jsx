// pages/business/BusinessDetails.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { IoArrowBack } from 'react-icons/io5';
import BasicDetailsSection from '../../components/business/details/BasicDetailsSection';
import BusinessAddressSection from '../../components/business/details/BusinessAddressSection';
import WorkingHoursSection from '../../components/business/details/WorkingHoursSection';

import BusinessNavbar from '../../components/business/BusinessNavbar';
import { FaSpinner } from 'react-icons/fa';

const BusinessDetails = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Track editing state for each section
    const [editMode, setEditMode] = useState({
        basic: false,
        address: false,
        hours: false
    });
    const [originalData, setOriginalData] = useState(null);

    const [formData, setFormData] = useState({
        // Basic Details
        labName: '',
        email: '',
        ownerName: '',
        mobileNumber: '',
        contactPerson: '',
        panNumber: '',
        businessCertificate: null,
        businessCertificateUrl: null, // For displaying existing
        ownerIdProof: null,
        ownerIdProofUrl: null, // For displaying existing
        gstNumber: '',
        yearsOfExperience: '',

        // Address
        fullAddress: '',
        pinCode: '',
        subArea: '',
        city: '',
        state: '',
        country: '',

        // Working Hours
        is24x7: false,
        workingHours: [
            { day: 'Monday', isOpen: true, openingTime: '09:00', closingTime: '06:00', isClosed: false },
            { day: 'Tuesday', isOpen: true, openingTime: '09:00', closingTime: '06:00', isClosed: false },
            { day: 'Wednesday', isOpen: true, openingTime: '09:00', closingTime: '06:00', isClosed: false },
            { day: 'Thursday', isOpen: true, openingTime: '09:00', closingTime: '06:00', isClosed: false },
            { day: 'Friday', isOpen: true, openingTime: '09:00', closingTime: '06:00', isClosed: false },
            { day: 'Saturday', isOpen: true, openingTime: '09:00', closingTime: '06:00', isClosed: false },
            { day: 'Sunday', isOpen: false, openingTime: '09:00', closingTime: '06:00', isClosed: true },
        ]
    });

    useEffect(() => {
        fetchBusinessDetails();
    }, []);

    const fetchBusinessDetails = async () => {
        try {
            const token = localStorage.getItem('businessToken');
            if (!token) {
                navigate('/login/business');
                return;
            }

            const response = await axios.get('http://localhost:5000/api/business/auth/me', {
                headers: { Authorization: `Bearer ${token} ` }
            });

            if (response.data.success) {
                const data = response.data.data.business;
                const kycDocs = data.kycData?.documents || [];
                const regCert = kycDocs.find(d => d.type === 'registrationCertificate')?.url;
                const idProof = kycDocs.find(d => d.type === 'ownerIdProof')?.url;

                setFormData(prev => ({
                    ...prev,
                    labName: data.businessName || '',
                    email: data.email || '',
                    ownerName: data.ownerName || '',
                    mobileNumber: data.mobile || '',
                    contactPerson: data.contactPerson || '',
                    yearsOfExperience: data.yearsOfExperience || '',

                    // Prioritize root kycData, fallback to nested if structure varies
                    panNumber: data.kycData?.panNumber || '',
                    gstNumber: data.kycData?.gstNumber || '',

                    businessCertificateUrl: regCert || null,
                    ownerIdProofUrl: idProof || null,

                    // Address
                    fullAddress: data.address?.fullAddress || data.kycData?.address || '',
                    pinCode: data.address?.pincode || data.kycData?.pincode || '',
                    subArea: data.address?.subArea || data.kycData?.subArea || '',
                    city: data.address?.city || data.kycData?.city || '',
                    state: data.address?.state || data.kycData?.state || '',
                    country: data.address?.country || 'India',

                    // Working Hours
                    is24x7: data.is24x7 || false,
                    workingHours: data.workingHours && data.workingHours.length > 0
                        ? data.workingHours
                        : prev.workingHours
                }));
                // Set original data for cancel functionality
                setOriginalData({
                    labName: data.businessName || '',
                    email: data.email || '',
                    ownerName: data.ownerName || '',
                    mobileNumber: data.mobile || '',
                    contactPerson: data.contactPerson || '',
                    yearsOfExperience: data.yearsOfExperience || '',
                    panNumber: data.kycData?.panNumber || '',
                    gstNumber: data.kycData?.gstNumber || '',
                    businessCertificateUrl: regCert || null,
                    ownerIdProofUrl: idProof || null,
                    fullAddress: data.address?.fullAddress || data.kycData?.address || '',
                    pinCode: data.address?.pincode || data.kycData?.pincode || '',
                    subArea: data.address?.subArea || data.kycData?.subArea || '',
                    city: data.address?.city || data.kycData?.city || '',
                    state: data.address?.state || data.kycData?.state || '',
                    country: data.address?.country || 'India',
                    is24x7: data.is24x7 || false,
                    workingHours: data.workingHours && data.workingHours.length > 0 ? data.workingHours : formData.workingHours
                });
            }
        } catch (error) {
            console.error('Error fetching details:', error);
            toast.error('Failed to load business details');
        } finally {
            setLoading(false);
        }
    };

    const isAnyEditing = Object.values(editMode).some(val => val);

    const handleGlobalEdit = () => {
        setEditMode({
            basic: true,
            address: true,
            hours: true
        });
    };

    const handleDiscard = () => {
        setFormData(originalData);
        setEditMode({
            basic: false,
            address: false,
            hours: false
        });
    };

    // Update handleSave to exit edit mode on success... actually handleSave calls fetch which resets? 
    // No, fetch updates data but not editMode.
    // I need to intercept handleSave success. 
    // But handleSave is defined above... I can wrapper it?
    // Or simpler: handleGlobalSave calls handleSave then sets editMode false.

    // Actually, I'll just change the footer buttons to call new wrappers or update state directly.
    // But handleSave is async.

    const handleGlobalSave = async () => {
        await handleSave();
        setEditMode({
            basic: false,
            address: false,
            hours: false
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleWorkingHoursChange = (index, field, value) => {
        const updatedHours = [...formData.workingHours];
        updatedHours[index] = { ...updatedHours[index], [field]: value };

        // If closed is checked, uncheck open and vice versa
        if (field === 'isClosed' && value) {
            updatedHours[index].isOpen = false;
        } else if (field === 'isOpen' && value) {
            updatedHours[index].isClosed = false;
        }

        setFormData(prev => ({ ...prev, workingHours: updatedHours }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('businessToken');
            const submitData = new FormData();

            // Append Text Fields via 'updates' or direct keys
            // Controller expects direct keys mostly
            submitData.append('labName', formData.labName);
            submitData.append('email', formData.email);
            submitData.append('ownerName', formData.ownerName);
            submitData.append('mobileNumber', formData.mobileNumber);
            submitData.append('contactPerson', formData.contactPerson);
            submitData.append('panNumber', formData.panNumber);
            submitData.append('gstNumber', formData.gstNumber);
            submitData.append('yearsOfExperience', formData.yearsOfExperience);
            submitData.append('is24x7', formData.is24x7);

            // Address object as JSON string
            const addressObj = {
                fullAddress: formData.fullAddress,
                pincode: formData.pinCode,
                subArea: formData.subArea,
                city: formData.city,
                state: formData.state,
                country: formData.country,
            };
            submitData.append('address', JSON.stringify(addressObj));

            // Working Hours as JSON string
            submitData.append('workingHours', JSON.stringify(formData.workingHours));

            // Files
            if (formData.businessCertificate) {
                submitData.append('businessCertificate', formData.businessCertificate);
            }
            if (formData.ownerIdProof) {
                submitData.append('ownerIdProof', formData.ownerIdProof);
            }

            const response = await axios.put(
                'http://localhost:5000/api/business/auth/profile',
                submitData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Profile updated successfully!');
                // Refresh data to get new file URLs if needed
                fetchBusinessDetails();
            }

        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (section) => {
        setEditMode(prev => ({ ...prev, [section]: true }));
    };

    const handleCancel = (section) => {
        setFormData(originalData);
        setEditMode(prev => ({ ...prev, [section]: false }));
    };

    const handleSectionSave = async (section) => {
        await handleSave(); // Reuse global save for now, or implement specific
        setEditMode(prev => ({ ...prev, [section]: false }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <BusinessNavbar />
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-[1150px] mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-2"
                    >
                        <IoArrowBack className="w-4 h-4" />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <h1 className="text-xl md:text-2xl font-bold text-[#1a237e]">Business Details</h1>
                    <p className="text-sm text-gray-500 mt-1">Complete your full information to get started with HealthRate</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1150px] mx-auto px-4 py-6">
                <div className="space-y-6">
                    {/* Basic Details */}
                    <BasicDetailsSection
                        formData={formData}
                        onChange={handleInputChange}
                        isEditing={editMode.basic}
                        onEdit={() => handleEdit('basic')}
                        onSave={() => handleSectionSave('basic')}
                        onCancel={() => handleCancel('basic')}
                    />

                    {/* Business Address */}
                    <BusinessAddressSection
                        formData={formData}
                        onChange={handleInputChange}
                        isEditing={editMode.address}
                        onEdit={() => handleEdit('address')}
                        onSave={() => handleSectionSave('address')}
                        onCancel={() => handleCancel('address')}
                    />

                    {/* Working Hours */}
                    <WorkingHoursSection
                        formData={formData}
                        onChange={handleInputChange}
                        onWorkingHoursChange={handleWorkingHoursChange}
                        isEditing={editMode.hours}
                        onEdit={() => handleEdit('hours')}
                        onSave={() => handleSectionSave('hours')}
                        onCancel={() => handleCancel('hours')}
                    />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 mt-8 pb-6">
                    {!isAnyEditing ? (
                        <button
                            onClick={handleGlobalEdit}
                            className="px-8 py-2.5 bg-[#1a237e] text-white font-medium rounded-lg hover:bg-[#0d1757] transition-colors"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleDiscard}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={saving}
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleGlobalSave}
                                disabled={saving}
                                className="px-8 py-2.5 bg-[#1a237e] text-white font-medium rounded-lg hover:bg-[#0d1757] transition-colors flex items-center gap-2"
                            >
                                {saving && <FaSpinner className="animate-spin" />}
                                Save Changes
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};


export default BusinessDetails;