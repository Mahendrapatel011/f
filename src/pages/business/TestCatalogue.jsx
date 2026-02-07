// pages/business/TestCatalogue.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Components
import BusinessNavbar from '../../components/business/BusinessNavbar';
import TestCatalogueHeader from '../../components/business/testCatalogue/TestCatalogueHeader';
import TestCatalogueActions from '../../components/business/testCatalogue/TestCatalogueActions';
import TestSearchFilter from '../../components/business/testCatalogue/TestSearchFilter';
import TestTable from '../../components/business/testCatalogue/TestTable';
import Pagination from '../../components/business/testCatalogue/Pagination';
import AddTestModal from '../../components/business/testCatalogue/AddTestModal';
import EditTestModal from '../../components/business/testCatalogue/EditTestModal';
import UploadRateListModal from '../../components/business/testCatalogue/UploadRateListModal';
import BulkEditModal from '../../components/business/testCatalogue/BulkEditModal';

const TestCatalogue = () => {
    const navigate = useNavigate();

    // State Management
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const testsPerPage = 5;

    // Data provided from Backend
    const [categoriesList, setCategoriesList] = useState([]);
    const [subCategoriesList, setSubCategoriesList] = useState([]);
    const [masterTestsList, setMasterTestsList] = useState([]);

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);

    // Initial Data Fetch
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                // Fetch Categories
                const catRes = await axios.get('http://localhost:5000/api/admin/categories');
                if (catRes.data.success) {
                    setCategoriesList(catRes.data.data);
                }

                // Fetch SubCategories
                const subCatRes = await axios.get('http://localhost:5000/api/admin/sub-categories');
                if (subCatRes.data.success) {
                    setSubCategoriesList(subCatRes.data.data);
                }

                // Fetch Master Tests
                const masterRes = await axios.get('http://localhost:5000/api/admin/master-tests');
                if (masterRes.data.success) {
                    setMasterTestsList(masterRes.data.data);
                }
            } catch (error) {
                console.error('Error fetching master data:', error);
                // Fallback or Toast error
            }
        };

        fetchMasterData();
    }, []);

    // Fetch Tests
    useEffect(() => {
        const fetchTests = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:5000/api/business/tests', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('businessToken')}` }
                });
                if (res.data.success) {
                    setTests(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching tests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, [currentPage, searchQuery, selectedCategory, selectedStatus]);

    // Filter tests based on search and filters
    const filteredTests = tests.filter(test => {
        const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            test.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());

        const testCategoryId = test.category?._id || test.category;
        const matchesCategory = selectedCategory === 'all' || testCategoryId === selectedCategory;

        const matchesStatus = selectedStatus === 'all' ||
            (selectedStatus === 'active' && test.isActive) ||
            (selectedStatus === 'inactive' && !test.isActive);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Handlers
    const handleToggleStatus = async (testId) => {
        try {
            await axios.patch(`http://localhost:5000/api/business/tests/${testId}/toggle`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('businessToken')}` }
            });

            setTests(prev => prev.map(test =>
                test._id === testId ? { ...test, isActive: !test.isActive } : test
            ));
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleEdit = (test) => {
        setSelectedTest(test);
        setIsEditModalOpen(true);
    };

    const handleAddTest = async (formData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/business/tests', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('businessToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                setTests(prev => [res.data.data, ...prev]);
            }
        } catch (error) {
            console.error('Error adding test:', error);
        }
    };

    const handleUpdateTest = async (testId, formData) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/business/tests/${testId}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('businessToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                setTests(prev => prev.map(test =>
                    test._id === testId ? res.data.data : test
                ));
            }
        } catch (error) {
            console.error('Error updating test:', error);
        }
    };

    const handleDeleteTest = async (testId) => {
        try {
            await axios.delete(`http://localhost:5000/api/business/tests/${testId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('businessToken')}` }
            });

            setTests(prev => prev.filter(test => test._id !== testId));
        } catch (error) {
            console.error('Error deleting test:', error);
        }
    };

    const handleUploadRateList = async (file) => {
        console.log('Uploading file:', file);
        // API Call:
        // const formData = new FormData();
        // formData.append('file', file);
        // await axios.post('http://localhost:5000/api/business/tests/upload', formData, {
        //     headers: { 
        //         Authorization: `Bearer ${localStorage.getItem('businessToken')}`,
        //         'Content-Type': 'multipart/form-data'
        //     }
        // });
    };

    const handleBulkEdit = async (options) => {
        console.log('Bulk edit options:', options);
        // API Call:
        // await axios.post('http://localhost:5000/api/business/tests/bulk-edit', options, {
        //     headers: { Authorization: `Bearer ${localStorage.getItem('businessToken')}` }
        // });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <BusinessNavbar />

            <main className="w-full max-w-[1150px] mx-auto px-4 py-6">
                {/* Header */}
                <TestCatalogueHeader />

                {/* Action Buttons */}
                <TestCatalogueActions
                    onUploadRateList={() => setIsUploadModalOpen(true)}
                    onAddTestManually={() => setIsAddModalOpen(true)}
                    onBulkEdit={() => setIsBulkEditModalOpen(true)}
                />

                {/* Search & Filters */}
                <TestSearchFilter
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    categories={categoriesList}
                />

                {/* Test Table */}
                <TestTable
                    tests={filteredTests}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleEdit}
                    loading={loading}
                />

                {/* Pagination */}
                {filteredTests.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </main>

            {/* Modals */}
            <AddTestModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddTest}
                categories={categoriesList}
                subCategories={subCategoriesList}
                masterTests={masterTestsList}
            />

            <EditTestModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedTest(null);
                }}
                onUpdate={handleUpdateTest}
                onDelete={handleDeleteTest}
                test={selectedTest}
                categories={categoriesList}
                subCategories={subCategoriesList}
                masterTests={masterTestsList}
            />

            <UploadRateListModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUpload={handleUploadRateList}
            />

            <BulkEditModal
                isOpen={isBulkEditModalOpen}
                onClose={() => setIsBulkEditModalOpen(false)}
                onApply={handleBulkEdit}
                categories={categoriesList}
            />
        </div>
    );
};

export default TestCatalogue;