import '../globals.css'
import * as React from 'react';
export const metadata ={
    title:'Dashboard',
    description:''
}
export default function DashboardLayout({children}){
    return(
        <div>
            {children}
        </div>
    )
}