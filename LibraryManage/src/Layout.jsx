import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { useState, useEffect } from 'react'
import { getApiUrl, getApiHeaders, getLibraryApiUrl, getLibraryApiHeaders, debugApiConfig } from './utils/apiConfig';

function Layout() {
  const [name,setName]= useState([])
      const[todayfootfall,settodayfootfall]=useState("Loading...")
      const[totalfootfall,settotalfootfall]=useState("Loading...")
      const [Students,setStudents] = useState([]);
      const[loading,setloading]=useState(true);
      const [signup, setSignup] = useState(false);
      const[login,setLogin]= useState(false);
      const [welcome,setwelcome]=useState("");
      const [welcome2,setwelcome2]=useState("");
      const[books,setBooks]=useState([]);
      const[time,settime]=useState(null);
      const [universalformData, setuniversalFormData] = useState({
          name: '',
          PRN: ''
        });
       const[info, setInfo]=useState([]);
       const[info2, setInfo2]=useState([]);
       const[library,setlibrary]=useState(false);
          const [formData, setFormData] = useState({
           name: '',
           PRN: '',
           password: '',
           isLibrary:false
         });
      
      
      
      


      useEffect(()=>{
      
           const  fetchData=async ()=>{   
             try {
            const response = await fetch('/fetch');
            const data = await response.json();
            setName(data);
          } catch (error) {
            console.log(error.message);
          }

          //  fetch(getLibraryApiUrl('todays_footfall'), {
          //          headers: getLibraryApiHeaders()
          //      })
          //      .then(response => response.json())
          //                      .then(data => {
          //         const curfootfall = Number(data.todays_footfall);
          //         settodayfootfall(curfootfall);
          //       })
          //      .catch(error => {
          //          console.error('Error fetching today\'s footfall:', error);
          //      });

          try {
            const response = await fetch('/api/hourlyfootfall');
            const data = await response.json();
            // setName(data);
            settodayfootfall(data.footfall);
          } catch (error) {
            console.log(error.message);
          }

           const token = localStorage.getItem('token');

           if(token){
           // console.log("token exists");
             fetch('/gettime', {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                            })
                            .then(res => res.json())
                            .then(data => {
                               // console.log("message from gettime ", data.strtime);
                                if(data.message==="yes"){
                                  settime(data.strtime)
                                }else{
                                  settime(data.strtime);
                                }
                            })
                            .catch(err => console.error(err));
           }else{
            //console.log("token doesnt exists");
           }



            //  fetch(getLibraryApiUrl('total_footfall'), {
            //        headers: getLibraryApiHeaders()
            //    })
            //    .then(response => response.json())
            //                    .then(data => {
            //       const totfootfall = Number(data.total_footfall);
            //      // settotalfootfall(totfootfall);
            //     })
            //    .catch(error => {
            //        console.error('Error fetching total footfall:', error);
            //    });

              
               try {

                const response = await fetch('/totalfootfalll');
                 const data = await response.json();
                 if(data.success){
                  settotalfootfall(data.footfall);
                 }else{
                  settotalfootfall(null);
                 }
                
               } catch (error) {
                settotalfootfall(null);
               }


           }
           fetchData()
   
        const interval= setInterval( fetchData , 1000);
   
         return () => clearInterval(interval);
   
     },[]);
      

      useEffect(()=>{
          const getData=async ()=>{
             try{await fetch(`/fetchtime`) //for stats page
                  .then(response => response.json())
                  .then(data => {
                    setloading(false);
                  //console.log(data);
                    setStudents(data);
                    // console.log(Students);
                   // setName(data);
                    
                      
                  })
                  }
                  catch(error){
                      //seterr(true);
                      setloading(true);
                      console.error(error);
                      
                  }
          }
      
          getData()
      
          
        },[]);

                 useEffect(()=>{
           const fetchData =async()=>{
             try{
               const booksUrl = getApiUrl('endpoint=book_all&limit=10000');
               const booksHeaders = getApiHeaders();
               
               const response = await fetch(booksUrl, {
                       headers: booksHeaders
               });
               
               if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
               }
               
               const data = await response.json();
               
               if (data.data && data.data.books) {
                 const kitab = data.data.books;
                 setBooks(kitab);
               } else {
                 console.error('Invalid data structure:', data);
               }
             }
             catch(error){
                 console.error('Error fetching books:', error);
             }
           }
           fetchData();
           
         },[]);

         useEffect(()=>{
          const fetchData=async()=>{
            try {
              await fetch(`/timetable`).then(response=>response.json()).then(data=>{
                //console.log(data);
              })
            } catch (error) {
              console.log(error.message);
            }
          }
          fetchData()
         },[])




  return (
    <div>
       <Header signup={signup} setSignup={setSignup} login={login} setLogin={setLogin} library={library} time={time} settime={settime}/>
       <Outlet context={{name,setName,todayfootfall,settodayfootfall,totalfootfall,settotalfootfall,Students,setStudents,loading,setloading,signup,setSignup,login,setLogin,welcome,setwelcome, books,setBooks,universalformData,setuniversalFormData,welcome2,setwelcome2,info, setInfo,info2, setInfo2,library,setlibrary,formData,setFormData,time,settime}} />
       <Footer/>
    </div>
  )
}

export default Layout
