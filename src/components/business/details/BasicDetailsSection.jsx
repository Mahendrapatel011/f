// components/business/details/BasicDetailsSection.jsx
import React from 'react';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import SectionCard from './SectionCard';
import FormInput from './FormInput';
import FileUpload from './FileUpload';

const BasicDetailsSection = ({ formData, onChange }) => {
    return (
        <SectionCard
            icon={<HiOutlineClipboardDocumentList className="w-5 h-5" />}
            title="Basic Details"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Row 1 */}
                <FormInput
                    label="Lab Name / Business Name"
                    placeholder="Enter your lab name"
                    value={formData.labName}
                    onChange={(val) => onChange('labName', val)}
                    required
                />
                <FormInput
                    label="Business Owner Name"
                    placeholder="Enter owner name"
                    value={formData.ownerName}
                    onChange={(val) => onChange('ownerName', val)}
                    required
                />

                {/* Row 2 */}
                <FormInput
                    label="Email"
                    type="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={(val) => onChange('email', val)}
                    required
                />
                <FormInput
                    label="Mobile Number"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={formData.mobileNumber}
                    onChange={(val) => onChange('mobileNumber', val)}
                    required
                />

                {/* Row 3 */}
                <FormInput
                    label="Primary Contact Person"
                    placeholder="Enter contact person name"
                    value={formData.contactPerson}
                    onChange={(val) => onChange('contactPerson', val)}
                    required
                />
                <FormInput
                    label="Business PAN Number"
                    placeholder="Enter business PAN number"
                    value={formData.panNumber}
                    onChange={(val) => onChange('panNumber', val)}
                    required
                />

                {/* Row 4 - Uploads */}
                <FileUpload
                    label="Business Registration Certificate"
                    value={formData.businessCertificate}
                    onChange={(val) => onChange('businessCertificate', val)}
                    existingUrl={formData.businessCertificateUrl}
                />
                <FileUpload
                    label="Owner ID Proof (Aadhar, Driving License, etc)"
                    value={formData.ownerIdProof}
                    onChange={(val) => onChange('ownerIdProof', val)}
                    existingUrl={formData.ownerIdProofUrl}
                />

                {/* Row 5 */}
                <FormInput
                    label="GST Number"
                    placeholder="Enter your GST number"
                    value={formData.gstNumber}
                    onChange={(val) => onChange('gstNumber', val)}
                />
                <FormInput
                    label="Years of Experience"
                    placeholder="Enter your experience"
                    value={formData.yearsOfExperience}
                    onChange={(val) => onChange('yearsOfExperience', val)}
                    required
                />
            </div>
        </SectionCard>
    );
};

export default BasicDetailsSection;