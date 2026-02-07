import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext();

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    // Default location
    const [location, setLocation] = useState({
        pincode: '462022',
        city: 'Bhopal',
        area: 'Indrapuri'
    });

    useEffect(() => {
        const storedLocation = localStorage.getItem('userLocation');
        if (storedLocation) {
            setLocation(JSON.parse(storedLocation));
        }
    }, []);

    const updateLocation = (newLocation) => {
        setLocation(newLocation);
        localStorage.setItem('userLocation', JSON.stringify(newLocation));
    };

    return (
        <LocationContext.Provider value={{ location, updateLocation }}>
            {children}
        </LocationContext.Provider>
    );
};
