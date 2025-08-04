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
      const [universalformData, setuniversalFormData] = useState({
          name: '',
          PRN: ''
        });
       const[info, setInfo]=useState([]);
       const[info2, setInfo2]=useState([]);
      
      
      
      


      useEffect(()=>{
      
           const  fetchData=()=>{   
             try{
               fetch(getLibraryApiUrl('list_all'), {
                   headers: getLibraryApiHeaders()
               })
               .then(response => response.json())
                               .then(data => {
                    const info = data.students
                    setName(info);
                })
               .catch(error => {
                   console.error('Error fetching students:', error);
               });
       
               fetch(getLibraryApiUrl('todays_footfall'), {
                   headers: getLibraryApiHeaders()
               })
               .then(response => response.json())
                               .then(data => {
                  const curfootfall = Number(data.todays_footfall);
                  settodayfootfall(curfootfall);
                })
               .catch(error => {
                   console.error('Error fetching today\'s footfall:', error);
               });
               
               fetch(getLibraryApiUrl('total_footfall'), {
                   headers: getLibraryApiHeaders()
               })
               .then(response => response.json())
                               .then(data => {
                  const totfootfall = Number(data.total_footfall);
                  settotalfootfall(totfootfall);
                })
               .catch(error => {
                   console.error('Error fetching total footfall:', error);
               });

             } catch(error){
                 console.error('Error in fetchData:', error);
             }
           }
           fetchData()
   
        const interval= setInterval( fetchData , 3000);
   
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
                      
                      // console.log(data)
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



  return (
    <div>
       <Header signup={signup} setSignup={setSignup} login={login} setLogin={setLogin}/>
       <Outlet context={{name,setName,todayfootfall,settodayfootfall,totalfootfall,settotalfootfall,Students,setStudents,loading,setloading,signup,setSignup,login,setLogin,welcome,setwelcome, books,setBooks,universalformData,setuniversalFormData,welcome2,setwelcome2,info, setInfo,info2, setInfo2}} />
       <Footer/>
    </div>
  )
}

export default Layout
