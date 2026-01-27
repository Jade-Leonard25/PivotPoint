import '../globals.css'
import * as React from 'react';
export const metadata ={
    title:'Dashboard',
    description:'Official Dashboard of PivotPoint'
}
export default function DashboardLayout({children}){
    return(
        <div className='flex'>
            {children}
        </div>
    )
}