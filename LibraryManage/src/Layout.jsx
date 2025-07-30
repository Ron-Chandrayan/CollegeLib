import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { useState, useEffect } from 'react'

function Layout() {
  const [name,setName]= useState([])
      const[todayfootfall,settodayfootfall]=useState("Loading...")
      const[totalfootfall,settotalfootfall]=useState("Loading...")
      const [Students,setStudents] = useState([]);
      const[loading,setloading]=useState(true);
      const [signup, setSignup] = useState(false);
      const[login,setLogin]= useState(false);
      const [welcome,setwelcome]=useState("");
      const[books,setBooks]=useState([]);
      
      
      


      useEffect(()=>{
      
           const  fetchData=()=>{   
             const apiKey = import.meta.env.VITE_SECRET_KEY;                //for sies data
              const baseUrl = import.meta.env.VITE_API_URL;  //for home page
                  
              try{fetch(`${baseUrl}/api/list_all`, {
                  headers: {
                      'XApiKey': apiKey // Use XAPIKEY header
                  }
                  })
                  .then(response => response.json())
                  .then(data => {console.log(data)
                      //seterr(false)
                      const info = data.students
                      setName(info);
                      // console.log(info[0].name)
                      
                  })
                  }
                  catch(error){
                      seterr(true);
                      console.error(error);
                  }
      
                  fetch(`${baseUrl}/api/todays_footfall`, {
                      headers: {
                          'XAPIKEY': apiKey // Use XAPIKEY header
                      }
                      })
                      .then(response => response.json())
                      .then(data => {console.log(data)
                        const curfootfall = Number(data.todays_footfall);
                        settodayfootfall(curfootfall);
                      });
                  
                  fetch(`${baseUrl}/api/total_footfall`, {
                      headers: {
                          'XAPIKEY': apiKey // Use XAPIKEY header
                      }
                      })
                      .then(response => response.json())
                      .then(data => {console.log(data)
                        const totfootfall = Number(data.total_footfall);
                        settotalfootfall(totfootfall);
                      })

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
                  // console.log(data);
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
      
          setInterval(getData,5000);
      
          
        },[]);

        useEffect(()=>{
          const fetchData =async()=>{
            const BASEURL = import.meta.env.VITE_API_URL2;;
            const apikey = import.meta.env.VITE_SECRET_KEY2;

            try{fetch(`${BASEURL}`, {
                  headers: {
                      'x-api-key': apikey // Use XAPIKEY header
                  }
                  })
                  .then(response => response.json())
                  .then(data => {console.log(data.data.books);
                    const kitab = data.data.books;
                    setBooks(kitab);
                    console.log(kitab);
                      //seterr(false)
                      // const info = data.students
                      // setName(info);
                      // // console.log(info[0].name)
                      
                  })
                  }
                  catch(error){
                      seterr(true);
                      console.error(error);
                  }
          }
          fetchData();
          
        },[])



  return (
    <div>
       <Header signup={signup} setSignup={setSignup} login={login} setLogin={setLogin}/>
       <Outlet context={{name,setName,todayfootfall,settodayfootfall,totalfootfall,settotalfootfall,Students,setStudents,loading,setloading,signup,setSignup,login,setLogin,welcome,setwelcome, books,setBooks}} />
       <Footer/>
    </div>
  )
}

export default Layout
