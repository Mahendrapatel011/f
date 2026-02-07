import { useState, useEffect } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const BusinessKYC = () => {
    const [formData, setFormData] = useState({
        panNumber: '',
        gstNumber: '',
        registrationNumber: '',
        registrationCertificate: null,
        ownerAadhar: null,
        ownerIdProof: null,
        idProofType: '',
        address: '',
        pincode: '',
        city: '',
        state: ''
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;

        // Auto-uppercase for PAN and GST and remove spaces
        if (name === 'panNumber' || name === 'gstNumber') {
            finalValue = value.toUpperCase().replace(/\s/g, '');
        }

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));

        // Real-time validation
        const newErrors = { ...errors };

        // PAN Number validation
        if (name === 'panNumber') {
            const panRegex = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
            if (finalValue && !panRegex.test(finalValue)) {
                newErrors.panNumber = 'Invalid PAN format (Ex: ABCDE1234F)';
            } else {
                delete newErrors.panNumber;
            }
        }

        // GST Number validation
        if (name === 'gstNumber') {
            const gstRegex = /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$/;
            if (finalValue && !gstRegex.test(finalValue)) {
                newErrors.gstNumber = 'Invalid GST format (15 characters)';
            } else {
                delete newErrors.gstNumber;
            }
        }

        // Pincode validation
        if (name === 'pincode') {
            if (finalValue && finalValue.length > 0 && finalValue.length !== 6) {
                newErrors.pincode = 'Pincode must be 6 digits';
            } else {
                delete newErrors.pincode;
            }
        }

        // Clear error when field is being edited
        if (!finalValue) {
            delete newErrors[name];
        }

        setErrors(newErrors);
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
            if (errors[name]) {
                setErrors(prev => ({ ...prev, [name]: '' }));
            }
        }
    };

    const handlePincodeChange = async (e) => {
        const value = e.target.value;
        if (value.length > 6) return;

        setFormData(prev => ({ ...prev, pincode: value }));

        if (value.length === 6) {
            try {
                const response = await axios.get(`https://api.postalpincode.in/pincode/${value}`);
                if (response.data && response.data[0].Status === 'Success') {
                    const postOffice = response.data[0].PostOffice[0];
                    setFormData(prev => ({
                        ...prev,
                        city: postOffice.District,
                        state: postOffice.State
                    }));
                }
            } catch (error) {
                console.error("Pincode lookup failed", error);
                // Do nothing, user can manually enter
            }
        }
    };

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch existing data (if any) to pre-fill the form
    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                const token = localStorage.getItem('businessToken');
                if (!token) return;

                const response = await axios.get('http://localhost:5000/api/business/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data.success) {
                    const data = response.data.data.business;
                    setFormData(prev => ({
                        ...prev,
                        panNumber: data.kycData?.panNumber || data.panNumber || '',
                        gstNumber: data.kycData?.gstNumber || data.gstNumber || '',
                        registrationNumber: data.kycData?.registrationNumber || data.registrationNumber || '',

                        // Address might be an object or string depending on how it was saved
                        address: data.address?.fullAddress || data.kycData?.address || (typeof data.address === 'string' ? data.address : '') || '',
                        pincode: data.address?.pincode || data.kycData?.pincode || data.pincode || '',
                        city: data.address?.city || data.kycData?.city || data.city || '',
                        state: data.address?.state || data.kycData?.state || data.state || '',

                        idProofType: data.kycData?.idProofType || data.idProofType || '',

                        // Files cannot be pre-filled in input[type="file"], handling them visually would require more UI changes
                        // For now we pre-fill text fields as requested
                    }));
                }
            } catch (error) {
                console.error("Error fetching business data", error);
            }
        };

        fetchBusinessData();
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // Regex patterns (Allowed case-insensitive for robustness)
        const panRegex = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
        const gstRegex = /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$/;

        // Validations
        if (!formData.panNumber) {
            newErrors.panNumber = 'PAN Number is required';
        } else if (!panRegex.test(formData.panNumber.trim())) {
            newErrors.panNumber = 'Invalid PAN Number format (Ex: ABCDE1234F)';
        }

        if (!formData.gstNumber) {
            newErrors.gstNumber = 'GST Number is required';
        } else if (!gstRegex.test(formData.gstNumber)) {
            newErrors.gstNumber = 'Invalid GST Number format';
        }

        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.pincode) newErrors.pincode = 'Pincode is required';
        else if (formData.pincode.length !== 6) newErrors.pincode = 'Pincode must be 6 digits';

        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration Number is required';

        if (!formData.registrationCertificate) newErrors.registrationCertificate = 'Registration Certificate is required';
        if (!formData.ownerAadhar) newErrors.ownerAadhar = 'Owner Aadhar is required';
        if (!formData.idProofType) newErrors.idProofType = 'Please select an ID Proof Type';
        if (!formData.ownerIdProof) newErrors.ownerIdProof = 'Owner ID Proof is required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error('Please fix the errors in the form');
            return;
        }

        const data = new FormData();
        data.append('panNumber', formData.panNumber);
        data.append('gstNumber', formData.gstNumber);
        data.append('registrationNumber', formData.registrationNumber);
        data.append('idProofType', formData.idProofType);

        data.append('address', formData.address);
        data.append('pincode', formData.pincode);
        data.append('city', formData.city);
        data.append('state', formData.state);

        data.append('registrationCertificate', formData.registrationCertificate);
        data.append('ownerAadhar', formData.ownerAadhar);
        data.append('ownerIdProof', formData.ownerIdProof);

        setLoading(true);
        try {
            const token = localStorage.getItem('businessToken');
            const response = await axios.post('http://localhost:5000/api/business/auth/kyc', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success('KYC Submitted Successfully!');
                navigate('/business/dashboard');
            }
        } catch (error) {
            console.error('KYC Error:', error);

            // Handle field-specific errors from backend
            if (error.response?.data?.errors) {
                const backendErrors = {};
                error.response.data.errors.forEach(err => {
                    backendErrors[err.field] = err.message;
                });
                setErrors(backendErrors);
                toast.error('Please fix the errors in the form');
            } else {
                toast.error(error.response?.data?.message || 'Failed to submit KYC');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex-grow bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 flex items-center justify-center p-4">
            {/* KYC Card */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[420px] p-6 sm:p-8">
                {/* Header */}
                <h1 className="text-xl sm:text-2xl font-bold text-[#1a237e] text-center mb-6">
                    KYC Verification
                </h1>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Business PAN Number */}
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            Business PAN Number
                        </label>
                        <input
                            type="text"
                            name="panNumber"
                            value={formData.panNumber}
                            onChange={handleInputChange}
                            placeholder="Enter PAN Number"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm uppercase ${errors.panNumber ? 'border-red-500' : 'border-gray-300'}`}
                            maxLength={10}
                        />
                        {errors.panNumber && <p className="text-xs text-red-500 mt-1">{errors.panNumber}</p>}
                    </div>

                    {/* GST Number */}
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            GST Number
                        </label>
                        <input
                            type="text"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleInputChange}
                            placeholder="Enter your GST Number"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm uppercase ${errors.gstNumber ? 'border-red-500' : 'border-gray-300'}`}
                            maxLength={15}
                        />
                        {errors.gstNumber && <p className="text-xs text-red-500 mt-1">{errors.gstNumber}</p>}
                    </div>

                    {/* Address & Location Section */}
                    <div className="space-y-3">
                        {/* Address */}
                        <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                                Registered Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter full address"
                                rows="2"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm resize-none ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                        </div>

                        {/* Pincode with Auto Lookup */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                                    Pincode
                                </label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handlePincodeChange}
                                    placeholder="e.g. 462001"
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                                    maxLength={6}
                                />
                                {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                            </div>
                            <div>
                                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="City"
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm bg-gray-50 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                                    readOnly={!!formData.city}
                                />
                                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                            </div>
                        </div>

                        {/* State */}
                        <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                                State
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="State"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm bg-gray-50 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                                readOnly={!!formData.state}
                            />
                            {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                        </div>
                    </div>

                    {/* Registration Number */}
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                            Registration Number
                        </label>
                        <input
                            type="text"
                            name="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleInputChange}
                            placeholder="Business Registration Number"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm ${errors.registrationNumber ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.registrationNumber && <p className="text-xs text-red-500 mt-1">{errors.registrationNumber}</p>}
                    </div>

                    {/* Business Registration Certificate */}
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                            Business Registration Certificate
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                name="registrationCertificate"
                                onChange={handleFileChange}
                                className="hidden"
                                id="registrationCertificate"
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <label
                                htmlFor="registrationCertificate"
                                className={`flex items-center justify-between w-full px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm ${errors.registrationCertificate ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <span className="text-gray-400 truncate">
                                    {formData.registrationCertificate?.name || 'Upload Certificate'}
                                </span>
                                <IoCloudUploadOutline className="w-5 h-5 text-gray-400" />
                            </label>
                        </div>
                        {errors.registrationCertificate && <p className="text-xs text-red-500 mt-1">{errors.registrationCertificate}</p>}
                    </div>

                    {/* Owner's Aadhar Card */}
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                            Owner's Aadhar Card
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                name="ownerAadhar"
                                onChange={handleFileChange}
                                className="hidden"
                                id="ownerAadhar"
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <label
                                htmlFor="ownerAadhar"
                                className={`flex items-center justify-between w-full px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm ${errors.ownerAadhar ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <span className="text-gray-400 truncate">
                                    {formData.ownerAadhar?.name || 'Upload Aadhar Card'}
                                </span>
                                <IoCloudUploadOutline className="w-5 h-5 text-gray-400" />
                            </label>
                        </div>
                        {errors.ownerAadhar && <p className="text-xs text-red-500 mt-1">{errors.ownerAadhar}</p>}
                    </div>

                    {/* Owner's ID Proof */}
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                            Owner's ID Proof{' '}
                            <span className="text-[10px] text-gray-400">(Aadhar, Driving License, etc.)</span>
                        </label>
                        <select
                            name="idProofType"
                            value={formData.idProofType}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm text-gray-700 mb-2 ${errors.idProofType ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select ID Proof Type</option>
                            <option value="aadhar">Aadhar Card</option>
                            <option value="driving">Driving License</option>
                            <option value="passport">Passport</option>
                            <option value="voter">Voter ID</option>
                        </select>
                        {errors.idProofType && <p className="text-xs text-red-500 mt-1 mb-2">{errors.idProofType}</p>}

                        <div className="relative">
                            <input
                                type="file"
                                name="ownerIdProof"
                                onChange={handleFileChange}
                                className="hidden"
                                id="ownerIdProof"
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <label
                                htmlFor="ownerIdProof"
                                className={`flex items-center justify-between w-full px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm ${errors.ownerIdProof ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <span className="text-gray-400 truncate">
                                    {formData.ownerIdProof?.name || 'Upload ID Proof'}
                                </span>
                                <IoCloudUploadOutline className="w-5 h-5 text-gray-400" />
                            </label>
                        </div>
                        {errors.ownerIdProof && <p className="text-xs text-red-500 mt-1">{errors.ownerIdProof}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-[#1a237e] text-white rounded-lg font-semibold hover:bg-[#0d1442] transition-colors text-sm mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit KYC'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BusinessKYC;