// utils/profileCompletion.js

/**
 * Calculate business profile completion percentage
 * @param {Object} businessData - The business data object
 * @returns {number} Completion percentage (0-100)
 */
export const calculateProfileCompletion = (businessData) => {
    if (!businessData) return 0;

    let filledCount = 0;
    let totalFields = 0;

    // 1. Basic Details (Top level)
    const basicFields = ['businessName', 'ownerName', 'email', 'mobile', 'contactPerson', 'yearsOfExperience'];
    totalFields += basicFields.length;
    basicFields.forEach(field => {
        if (businessData[field] && businessData[field].toString().trim() !== '') filledCount++;
    });

    // 2. KYC Details & Address
    const kyc = businessData.kycData || {};
    const addr = businessData.address || {};

    // PAN & GST
    if (kyc.panNumber || businessData.panNumber) filledCount++; totalFields++;
    if (kyc.gstNumber || businessData.gstNumber) filledCount++; totalFields++;

    // Address Fields (Fallback to kycData address if main address is empty)
    const fullAddr = addr.fullAddress || kyc.address;
    const city = addr.city || kyc.city;
    const state = addr.state || kyc.state;
    const pincode = addr.pincode || kyc.pincode;

    if (fullAddr) filledCount++; totalFields++;
    if (city) filledCount++; totalFields++;
    if (state) filledCount++; totalFields++;
    if (pincode) filledCount++; totalFields++;

    // 3. Documents (In kycData.documents array)
    const docs = kyc.documents || [];
    const hasRegCert = docs.some(d => d.type === 'registrationCertificate') || businessData.registrationCertificate;
    const hasIdProof = docs.some(d => d.type === 'ownerIdProof') || businessData.ownerIdProof;

    if (hasRegCert) filledCount++; totalFields++;
    if (hasIdProof) filledCount++; totalFields++;

    // 4. Working Hours
    if (businessData.workingHours && businessData.workingHours.length > 0) {
        filledCount++;
    }
    totalFields++;

    // Calculate details percentage (Max 60%)
    const detailsScore = totalFields > 0 ? (filledCount / totalFields) * 60 : 0;

    // 5. KYC Verified (40%)
    const kycScore = businessData.kycStatus === 'verified' ? 40 : 0;

    return Math.round(detailsScore + kycScore);
};
