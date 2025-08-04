import React from 'react'
import { useState, useEffect } from 'react'
import { data } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import Linegraph from '../Linegraph/Linegraph';
import Barcharts from '../Barcharts/Barcharts';


function Stats() {

  const{Students,setStudents,loading,setloading,universalformData,setuniversalFormData,welcome,welcome2,info2, setInfo2,info,setInfo}= useOutletContext()
  //console.log(Students);
 
   const[prn,setprn]=useState(universalformData?.PRN || '');
   const[received,setreceived]=useState(false);
   
        useEffect(() => {
        console.log("Students changed:", Students);
      }, [Students]);

      if(Students.length!=0){
        setreceived(true);
      }
   
  // console.log(universalformData);

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






  return (<>
        <p>{received?"Data received":"loading"}</p>
        <p>Welcome {welcome} {welcome2}</p>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Linegraph data={info} />
      <Barcharts data={info2}/>
       </div></>
      );

}
export default Stats
