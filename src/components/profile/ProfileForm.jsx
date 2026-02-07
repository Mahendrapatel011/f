// components/ProfileForm.jsx
import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import FormField from '../common/FormField';
import Button from '../common/Button';
import ProfileAvatar from './ProfileAvatar';

const ProfileForm = ({ initialData, onSubmit, onAddEmail, onAddMobile }) => {
    const [formData, setFormData] = useState({
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        age: initialData?.age || '',
        email: initialData?.email || '',
        mobile: initialData?.mobile || '',
        dob: initialData?.dob || '',
        gender: initialData?.gender || '',
        address: initialData?.address || '',
        avatar: initialData?.avatar || ''
    });

    // Track if email/mobile exist in database (not just in form)
    const [hasEmail, setHasEmail] = useState(!!initialData?.email);
    const [hasMobile, setHasMobile] = useState(!!initialData?.mobile);

    const [loading, setLoading] = useState(false);

    // Update form when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData?.firstName || '',
                lastName: initialData?.lastName || '',
                age: initialData?.age || '',
                email: initialData?.email || '',
                mobile: initialData?.mobile || '',
                dob: initialData?.dob || '',
                gender: initialData?.gender || '',
                address: initialData?.address || '',
                avatar: initialData?.avatar || ''
            });
            // Update database existence flags
            setHasEmail(!!initialData?.email);
            setHasMobile(!!initialData?.mobile);
        }
    }, [initialData]);

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (imageData) => {
        setFormData(prev => ({
            ...prev,
            avatar: imageData
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (onSubmit) {
                await onSubmit(formData);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex justify-center items-center mb-8">
                <ProfileAvatar
                    src={formData.avatar}
                    alt="Profile Photo"
                    size="lg"
                    editable={true}
                    onImageChange={handleAvatarChange}
                />
            </div>

            {/* Row 1: First Name, Last Name, Age */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="First Name" required>
                    <Input
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </FormField>

                <FormField label="Last Name" required>
                    <Input
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </FormField>

                <FormField label="Age" required>
                    <Input
                        type="number"
                        name="age"
                        placeholder="29"
                        value={formData.age}
                        onChange={handleChange}
                        min="1"
                        max="120"
                        required
                    />
                </FormField>
            </div>

            {/* Row 2: Email, Mobile Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Email" required={!hasEmail}>
                    {hasEmail ? (
                        <>
                            <Input
                                type="email"
                                name="email"
                                placeholder="johndoe@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled
                                className="bg-gray-50 cursor-not-allowed"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </>
                    ) : (
                        <>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Add your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="flex-1"
                                />
                                <button
                                    type="button"
                                    onClick={() => onAddEmail && onAddEmail(formData.email)}
                                    className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] transition-colors text-sm whitespace-nowrap"
                                >
                                    Add Email
                                </button>
                            </div>
                            <p className="text-xs text-amber-600 mt-1">⚠️ Please add your email address</p>
                        </>
                    )}
                </FormField>

                <FormField label="Mobile Number" required={!hasMobile}>
                    {hasMobile ? (
                        <>
                            <Input
                                type="tel"
                                name="mobile"
                                placeholder="9878989046"
                                value={formData.mobile}
                                onChange={handleChange}
                                disabled
                                className="bg-gray-50 cursor-not-allowed"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Mobile cannot be changed</p>
                        </>
                    ) : (
                        <>
                            <div className="flex gap-2">
                                <Input
                                    type="tel"
                                    name="mobile"
                                    placeholder="Add your mobile number"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="flex-1"
                                    maxLength="10"
                                />
                                <button
                                    type="button"
                                    onClick={() => onAddMobile && onAddMobile(formData.mobile)}
                                    className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] transition-colors text-sm whitespace-nowrap"
                                >
                                    Add Mobile
                                </button>
                            </div>
                            <p className="text-xs text-amber-600 mt-1">⚠️ Please add your mobile number</p>
                        </>
                    )}
                </FormField>
            </div>

            {/* Row 3: Date of Birth, Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Date of Birth" required>
                    <Input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                    />
                </FormField>

                <FormField label="Gender" required>
                    <Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        options={genderOptions}
                        placeholder="Select Gender"
                        required
                    />
                </FormField>
            </div>

            {/* Row 4: Address */}
            <FormField label="Address" required>
                <Input
                    name="address"
                    placeholder="MP nagar, Zone 2, Bhopal, Madhya Pradesh, 462022"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
            </FormField>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
                <Button
                    type="submit"
                    variant="secondary"
                    size="md"
                    disabled={loading}
                    className="min-w-[200px]"
                >
                    {loading ? 'Updating...' : 'Update'}
                </Button>
            </div>
        </form>
    );
};

export default ProfileForm;