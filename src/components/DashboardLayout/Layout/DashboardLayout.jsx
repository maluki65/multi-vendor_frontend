import { useState, useEffect } from "react";
import './layout.css';
import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function DashboardLayout ({ fullName, role, email, children}){
  return(
      <div className='relative sm:-8 p-4 bg-gray-100 min-h-screen flex flex-row'>
        <div className='sm:flex hidden mr-10 relative'>
          <Sidebar
            role={role}
            fullName={fullName}
          />
        </div>
        <div className='flex-1 max-sm:w-full max-w-7xl mx-auto sm:pr-5'>
          <Navbar
            role={role}
            fullName={fullName}
            email={email}
          />
          <main className="flex-1 px-4 overflow-y-auto bg-transparent rounded-xl">
            {children}
          </main>
        </div>
      </div>
      
  )
}