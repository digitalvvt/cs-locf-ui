
import React from 'react';
import AppLayout from './AppLayout';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return <AppLayout>{children}</AppLayout>;
};
