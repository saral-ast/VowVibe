import React from 'react';

interface GuestLayoutProps {
    children: React.ReactNode;
}

export const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            {children}
        </div>
    );
};
