import React, { useState, useEffect } from "react";
import './layout.css';
import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function DashboardLayout ({ fullName, storeName, role, email,  children, disableNavigation}){
  return(
      <div className='relative sm:-8 px-2 py-4 bg-gray-100 min-h-screen flex flex-row'>
        <div className='sm:flex hidden mr-10 relative'>
          <Sidebar
            role={role}
            fullName={fullName}
            disableNavigation={disableNavigation}
          />
        </div>
        <div className='flex-1 max-sm:w-full max-w-10xl mx-auto sm:pr-5'>
          <Navbar
            role={role}
            fullName={fullName}
            email={email}
            storeName={storeName}
          />
          <main className="flex-1 px-4 overflow-y-auto bg-transparent rounded-xl mainCon">
            {children}
          </main>
        </div>
      </div>
      
  )
}