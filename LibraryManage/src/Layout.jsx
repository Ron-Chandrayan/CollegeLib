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
             const apiKey = '4rnWNLFd3I5sh4jMiP3BKnhOnxtPJ2sPcQRT4tplQK0';                  //for sies data
              const baseUrl = 'https://libman.ethiccode.in.net/';  //for home page
                  
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

      //               fetch('/api/?endpoint=list_all', {
      //               headers: {
      //                 'X-API-KEY': 'ahambrahmasmi'
      //               }
      //             })
      //               .then(res => res.json())
      //               .then(data => {
      //                 //console.log(data);
      //                 const info = data.data.students;
      //                 console.log(info);
      //                 setName(info);

      //               })
      //               .catch(err => console.error(err));

                  
      //               fetch('/api/?endpoint=todays_footfall', {
      //               headers: {
      //                 'X-API-KEY': 'ahambrahmasmi'
      //               }
      //             })
      //               .then(res => res.json())
      //               .then(data => {
      //                 //console.log(data.data.todays_footfall);
      //                 const info = data.data.todays_footfall;
      //                 settodayfootfall(info);

      //               })
      //               .catch(err => console.error(err));

      //               fetch('/api/?endpoint=total_footfall', {
      //               headers: {
      //                 'X-API-KEY': 'ahambrahmasmi'
      //               }
      //             })
      //               .then(res => res.json())
      //               .then(data => {console.log(data.data.total_footfall);
      //                 const info = data.data.total_footfall;
      //                 settotalfootfall(info);

      //               })
      //               .catch(err => console.error(err));


                    }
                    fetchData()
      
                 const interval= setInterval( fetchData , 3000);
      
                  return () => clearInterval(interval);
      
          },[]);
      

      useEffect(()=>{
          const getData=async ()=>{
             try{await fetch(`http://localhost:5000/fetchtime`) //for stats page
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
            const BASEURL = 'https://libman.ethiccode.in/api/index.php';
            const apikey = 'ahambrahmasmi';

            try{fetch(`/api/api/index.php?endpoint=book_all&limit=10000`, {
                  headers: {
                      'x-api-key': apikey // Use XAPIKEY header
                  }
                  })
                  .then(response => response.json())
                  .then(data => {console.log(data.data.books);
                    const kitab = data.data.books;
                    setBooks(kitab);
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

// useEffect(() => {
//   const getData = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/fetchtime`);
//       const data = await response.json();
//       //console.log(data); // check what you receive
//       setStudents(data);
//       console.log(Students);
//       setloading(false);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   getData(); // fetch immediately on mount

//   const interval = setInterval(getData, 5000); // fetch every 5 sec

//   return () => clearInterval(interval); // clear on unmount
// }, []);

  return (
    <div>
       <Header signup={signup} setSignup={setSignup}/>
       <Outlet context={{name,setName,todayfootfall,settodayfootfall,totalfootfall,settotalfootfall,Students,setStudents,loading,setloading,signup,setSignup,login,setLogin,welcome,setwelcome, books,setBooks}} />
       <Footer/>
    </div>
  )
}

export default Layout
