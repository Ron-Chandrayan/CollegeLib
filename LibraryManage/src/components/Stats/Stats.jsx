import React from 'react'
import { useState, useEffect } from 'react'
import { data } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

function Stats() {

  const{Students,setStudents,loading,setloading}= useOutletContext()
  console.log(Students);
  

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

  if(loading===true){
    return(<><p>Loading</p></>)
  }
  else{
    return( <div>
      {Students.map((element, index) => (
        <div key={index}>
          <p>Name: {element.name}</p>
          <p>PRN: {element.PRN}</p>
        </div>
      ))}
    </div>)
    
  }
  
}

export default Stats
