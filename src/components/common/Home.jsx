import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import LandingPage from '../../pages/customer/LandingPage';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        if (authService.isAuthenticated()) {
            // If logged in, redirect to listing page
            navigate('/listing', { replace: true });
        }
    }, [navigate]);

    // If not logged in, show landing page
    return <LandingPage />;
};

export default Home;
