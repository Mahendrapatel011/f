// components/business/details/BusinessAddressSection.jsx
import React from 'react';
import { HiOutlineMapPin } from 'react-icons/hi2';
import SectionCard from './SectionCard';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormTextarea from './FormTextarea';

const BusinessAddressSection = ({ formData, onChange }) => {
    const stateOptions = [
        { value: 'delhi', label: 'Delhi' },
        { value: 'maharashtra', label: 'Maharashtra' },
        { value: 'karnataka', label: 'Karnataka' },
        { value: 'tamil_nadu', label: 'Tamil Nadu' },
        { value: 'gujarat', label: 'Gujarat' },
        { value: 'rajasthan', label: 'Rajasthan' },
        { value: 'uttar_pradesh', label: 'Uttar Pradesh' },
        { value: 'west_bengal', label: 'West Bengal' },
    ];

    const countryOptions = [
        { value: 'india', label: 'India' },
    ];

    return (
        <SectionCard
            icon={<HiOutlineMapPin className="w-5 h-5" />}
            title="Business Address"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Address - Full Width */}
                <div className="md:col-span-2">
                    <FormTextarea
                        label="Full Address"
                        placeholder="Enter complete address with landmark"
                        value={formData.fullAddress}
                        onChange={(val) => onChange('fullAddress', val)}
                        rows={2}
                    />
                </div>

                {/* Row 2 */}
                <FormInput
                    label="Pin Code"
                    placeholder="Enter pin code"
                    value={formData.pinCode}
                    onChange={(val) => onChange('pinCode', val)}
                />
                <FormInput
                    label="City"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(val) => onChange('city', val)}
                />

                {/* Row 3 */}
                <FormSelect
                    label="State"
                    options={stateOptions}
                    value={formData.state}
                    onChange={(val) => onChange('state', val)}
                    placeholder="Select state"
                />
                <FormSelect
                    label="Country"
                    options={countryOptions}
                    value={formData.country}
                    onChange={(val) => onChange('country', val)}
                    placeholder="Select country"
                />
            </div>
        </SectionCard>
    );
};

export default BusinessAddressSection;