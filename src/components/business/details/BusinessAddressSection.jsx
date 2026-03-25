// components/business/details/BusinessAddressSection.jsx
import React from 'react';
import { HiOutlineMapPin } from 'react-icons/hi2';
import { usePlacesWidget } from 'react-google-autocomplete';
import SectionCard from './SectionCard';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormTextarea from './FormTextarea';

const BusinessAddressSection = ({ formData, onChange }) => {
    const { ref } = usePlacesWidget({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSy_YOUR_API_KEY_HERE", // Replace with actual API key in .env
        onPlaceSelected: (place) => {
            console.log(place);
            if (!place || !place.address_components) return;

            // Extract values
            let street_number = '';
            let route = '';
            let subArea = '';
            let city = '';
            let state = '';
            let country = '';
            let pincode = '';

            place.address_components.forEach((component) => {
                const types = component.types;
                if (types.includes("street_number")) {
                    street_number = component.long_name;
                }
                if (types.includes("route")) {
                    route = component.long_name;
                }
                if (types.includes("sublocality") || types.includes("sublocality_level_1") || types.includes("neighborhood")) {
                    subArea = component.long_name;
                }
                if (types.includes("locality")) {
                    city = component.long_name;
                }
                if (types.includes("administrative_area_level_1")) {
                    state = component.long_name;
                }
                if (types.includes("country")) {
                    country = component.long_name;
                }
                if (types.includes("postal_code")) {
                    pincode = component.long_name;
                }
            });

            // Set formatted address
            const fullAddress = place.formatted_address || `${street_number} ${route}`.trim();
            onChange('fullAddress', fullAddress);
            if (pincode) onChange('pinCode', pincode);
            if (subArea) onChange('subArea', subArea);
            if (city) onChange('city', city);

            // Map state to your dropdown values (basic parsing, adjust as needed)
            if (state) {
                const stateLower = state.toLowerCase().replace(/\s+/g, '_');
                onChange('state', stateLower);
            }
            if (country) {
                const countryLower = country.toLowerCase();
                onChange('country', countryLower);
            }
        },
        options: {
            types: ["establishment", "geocode"],
            componentRestrictions: { country: "in" },
        },
    });

    const stateOptions = [
        { value: 'delhi', label: 'Delhi' },
        { value: 'maharashtra', label: 'Maharashtra' },
        { value: 'karnataka', label: 'Karnataka' },
        { value: 'tamil_nadu', label: 'Tamil Nadu' },
        { value: 'gujarat', label: 'Gujarat' },
        { value: 'rajasthan', label: 'Rajasthan' },
        { value: 'm मध्य प्रदेश', label: 'Madhya Pradesh' },
        { value: 'madhya_pradesh', label: 'Madhya Pradesh' },
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
                <div className="md:col-span-2 space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Full Address (Auto-complete)</label>
                    <input
                        ref={ref}
                        type="text"
                        placeholder="Search your business address or google location..."
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
                        defaultValue={formData.fullAddress}
                        onChange={(e) => onChange('fullAddress', e.target.value)}
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
                    label="Sub Area"
                    placeholder="Enter sub-area / locality"
                    value={formData.subArea}
                    onChange={(val) => onChange('subArea', val)}
                />

                {/* Row 3 */}
                <FormInput
                    label="City"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(val) => onChange('city', val)}
                />
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