import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext();

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    // Initialize location from localStorage or use default
    const [location, setLocation] = useState(() => {
        const storedLocation = localStorage.getItem('userLocation');
        return storedLocation ? JSON.parse(storedLocation) : {
            pincode: '462022',
            city: 'Bhopal',
            area: 'Indrapuri'
        };
    });

    useEffect(() => {
        // No longer need to load from localStorage here as it's done in useState initializer
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
