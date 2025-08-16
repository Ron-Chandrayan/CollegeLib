import React from 'react'
import { useState, useEffect } from 'react'
import { data } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom'
import { Users, Activity } from 'lucide-react'  // Add this line
import Linegraph from '../Linegraph/Linegraph'
import Barcharts from '../Barcharts/Barcharts'





function Stats() {
  const{Students,setStudents,loading,setloading,universalformData,setuniversalFormData,welcome,welcome2,info2, setInfo2,info,setInfo}= useOutletContext()
  //console.log(Students);
 
   const[prn,setprn]=useState(universalformData?.PRN || '');
   const[received,setreceived]=useState(false);
   const [count,setcount]=useState(0);
   
  useEffect(() => {
    console.log("Students changed:", Students);
    if(Students.length!=0){
      setreceived(true);
      const FStudents=Students.filter((element)=>{
        return (element.PRN===welcome2);
      });
      setcount(FStudents.length);
      console.log(count);
    }
  }, [Students]);

                      useEffect(()=>{
            const getData=async ()=>{
              try{await fetch(`/api/hourlyfootfall`)
                    .then(response => response.json())
                    .then(data => {
                      
                      // console.log(data)
                      //setInfo(data)
                                                
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
                      
                      // console.log(data)
                      //setInfo2(data)
                                                
                    })
                    }
                    catch(error){
                        //seterr(true);                
                        console.error(error);             
                    }
            }
            getData2()

            
          },[]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-100 shadow-lg border-b border-gray-200/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center mb-3">
                <div className="w-3 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-4"></div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/40">
                  <div className={`w-2.5 h-2.5 rounded-full mr-3 ${received ? 'bg-green-500 shadow-green-300 shadow-sm' : 'bg-amber-500 shadow-amber-300 shadow-sm'} animate-pulse`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {received ? "Live Data Connected" : "Connecting..."}
                  </span>
                </div>
                <div className="hidden sm:block text-xs text-gray-500 bg-gray-100/80 px-3 py-1 rounded-full">
                  Real-time Analytics
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs opacity-90 font-medium">Welcome Back</p>
                    <p className="text-sm font-bold">{welcome} {welcome2}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs opacity-90 font-medium">Total Visits</p>
                    <p className="text-lg font-bold">
                      {received ? count : "..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          <div className="w-full">
            <Linegraph data={info} />
          </div>
          <div className="w-full">
            <Barcharts data={info2} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats