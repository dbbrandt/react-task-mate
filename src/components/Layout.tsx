import React from 'react';
import Link from 'next/link';
import Image from "next/image";

interface LayoutProps {}
const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({ children }) => {
    return (
        <div className="page">
            <Link href="/" className="logo">
                <Image src="/logo.png" alt="logo" width={150} height={150}/>
            </Link>
            {children}
        </div>
    );
};

export default Layout;
