import React from 'react'
import { useState, useEffect } from 'react'
import { data } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import Linegraph from '../Linegraph/Linegraph';
import Barcharts from '../Barcharts/Barcharts';


function Stats() {

  const{Students,setStudents,loading,setloading,universalformData,setuniversalFormData}= useOutletContext()
  //console.log(Students);
  const[info, setInfo]=useState([]);
   const[info2, setInfo2]=useState([]);
   const[prn,setprn]=useState("");
   setprn(universalformData.PRN);
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




   useEffect(()=>{
    const getData=async ()=>{
       try{await fetch(`/api/hourlyfootfall`)
            .then(response => response.json())
            .then(data => {
              
              // console.log(data)
              setInfo(data)
                                         
            })
            }
            catch(error){
                //seterr(true);                
                console.error(error);             
            }
    }

    getData()
    const getData2=async ()=>{
       try{await fetch(`/api/dailyfootfall`)
            .then(response => response.json())
            .then(data => {
              
              console.log(data)
              setInfo2(data)
                                         
            })
            }
            catch(error){
                //seterr(true);                
                console.error(error);             
            }
    }
    getData2()

    
  },[]);

  return (<>
        <p>Welcome {prn}</p>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Linegraph data={info} />
      <Barcharts data={info2}/>
       </div></>
      );

}
export default Stats
