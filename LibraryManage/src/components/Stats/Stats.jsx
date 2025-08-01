import React from 'react'
import { useState, useEffect } from 'react'
import { data } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

function Stats() {

  const{Students,setStudents,loading,setloading}= useOutletContext()
  //console.log(Students);
  

  // useEffect(()=>{
  //   const getData=async ()=>{
  //      try{await fetch(`http://localhost:5000/fetch`)
  //           .then(response => response.json())
  //           .then(data => {
  //             setloading(false);
  //             console.log(data)
  //             setStudents(data);
              
                
  //           })
  //           }
  //           catch(error){
  //               //seterr(true);
  //               setloading(true);
  //               console.error(error);
                
  //           }
  //   }

  //   setInterval(getData,5000);

    
  // },[]);

  return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
          <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-2">⚠️ Under Maintenance</h1>
            <p className="text-gray-700 text-base">
              This page is currently under maintenance. Please check back later.
            </p>
          </div>
        </div>
      );

}
export default Stats
