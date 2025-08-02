import React from 'react'
import { useState, useEffect } from 'react'
import { data } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import Linegraph from '../Linegraph/Linegraph';

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




   useEffect(()=>{
    const getData=async ()=>{
       try{await fetch(`/api/hourlyfootfall`)
            .then(response => response.json())
            .then(data => {
              
              console.log(data)
                                         
            })
            }
            catch(error){
                //seterr(true);                
                console.error(error);             
            }
    }

    setInterval(getData,5000);

    
  },[]);

  return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Linegraph />
       </div>
      );

}
export default Stats
