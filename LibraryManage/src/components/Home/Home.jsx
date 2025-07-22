import React from 'react'
import { useState, useEffect } from 'react'
import Student from '../Student/Student'
import Searching from '../Seaching/Searching'
import { useOutletContext } from 'react-router-dom'
import wallpaper from '../../assets/wallpaper.jpeg';



function Home() {
    // const [name,setName]= useState([])
    // const[todayfootfall,settodayfootfall]=useState("Loading...")
    // const[totalfootfall,settotalfootfall]=useState("Loading...")


    const {name,setName,todayfootfall,settodayfootfall,totalfootfall,settotalfootfall,signup,setSignup, Students,setStudents,login,setLogin,welcome,setwelcome} = useOutletContext()

    const[err,seterr]= useState(false)
    const[search,setsearch]=useState("");
    const[filter,setFilter]= useState("");
    const [isClosed, setIsClosed] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    

     const [formData, setFormData] = useState({
    name: '',
    PRN: '',
    password: ''
  });

            useEffect(() => {
            const URL = import.meta.env.VITE_API_URL3;
            const token = localStorage.getItem('token');

              if (!token) {
                setIsAuthLoading(false); // no token, done loading
                return;
              }

              fetch(`${URL}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              })
                .then(res => res.json())
                .then(data => {
                  if (data.valid) {
                    setSignup(true);
                    setLogin(true);
                    setwelcome(data.name);
                    seterr(false);
                  } else {
                    localStorage.removeItem('token');
                    setSignup(false);
                    setLogin(false);
                  }
                })
                .catch(err => {
                  console.error('Token validation error:', err);
                  localStorage.removeItem('token');
                  setSignup(false);
                  setLogin(false);
                })
                .finally(() => {
                  setIsAuthLoading(false);  // IMPORTANT: Turn off loading here always
                });
            }, []);




   useEffect(()=>{
              const getData=async ()=>{
             try{
              const URL = import.meta.env.VITE_API_URL4;
              await fetch(`${URL}`) //for stats page
                  .then(response => response.json())
                  .then(data => {
                   
                    //console.log(data);
                    if(signup===false && login===false){
                      console.log("not logged in ")
                    }else{
                      console.log(data);
                      data.forEach(element => {
                        if(element.PRN===formData.PRN){
                         // console.log(element.name);
                          setwelcome(element.name);
                          console.log(welcome);
                          
                        }
                      });
                    }
                    
                      
                  })
                  
                  }
                  catch(error){
                      //seterr(true);
                      // setloading(true);
                      console.error(error);
                      
                  }
          }
          getData();
            },[login , signup ,welcome ])


        const handleChange = (e) => {
        setFormData(prev => ({
          ...prev,
          [e.target.name]: e.target.value
        }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault(); // stop form reload

        try {
          const URL = import.meta.env.VITE_API_URL5;
          const res = await fetch(`${URL}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });

          

          const data = await res.json();

                    if (res.status === 200 && data.success) {
            console.log('✅ Form successfully submitted!');
            console.log('📤 Submitted Data:', formData);
            console.log('📥 Server Response:', data);
            setFormData({
               name: '',
                PRN: '',
              password: ''
            })

            // Save JWT token to localStorage
            localStorage.setItem('token', data.token);

            // Save user name from response to welcome state
            setwelcome(data.name);

            // Set signup/login state true
            setSignup(true);
            setLogin(true);
            seterr(false);
          } else {
            if (data.message === "User exists" || data.message === "wrong password") {
              setSignup(false);
              seterr(true);
            }
          }

      
        } catch (err) {
          console.error('❌ Error:', err.message);
        }
      };

      useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // 17:35 in 24-hour format = 5:35 PM
      if (((currentHours > 19 || (currentHours === 19 && currentMinutes >= 30)) )||(currentHours<8 || (currentHours === 8 && currentMinutes <= 15))) {
        setIsClosed(true);
      } else {
        setIsClosed(false);
      }
    };

    checkTime(); // Check immediately
    const interval = setInterval(checkTime, 60 * 1000); // Recheck every minute

    return () => clearInterval(interval); // Clean up on unmount
  }, []);


  
          if (isAuthLoading) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col items-center space-y-4">
        {/* Main spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-slate-200 rounded-full animate-spin">
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          
          {/* Inner pulse dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading text with animated dots */}
        <div className="flex items-center space-x-1">
          <span className="text-slate-600 font-medium text-lg">Loading</span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
        );
      }

    if(signup){

      return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
         <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8 mb-8 border border-blue-200/50 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Library Dashboard
            </h1>
          </div>
          <p className="text-slate-600/80 text-lg font-medium">
            Student presence tracking system
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-white/20">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-slate-700">Live</span>
        </div>
      </div>
      
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
              {login?"Welcome Back":"Welcome"}
            </p>
            <h2 className="text-2xl font-bold text-slate-800 mt-1">
              {welcome}
            </h2>
          </div>
        </div>
      </div>
    </div>


        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <p className="text-sm font-medium text-slate-600 mb-2">Today's Footfall</p>
            <p className="text-3xl font-bold text-green-600">{todayfootfall}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <p className="text-sm font-medium text-slate-600 mb-2">Total Footfall</p>
            <p className="text-3xl font-bold text-blue-600">{totalfootfall}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <p className="text-sm font-medium text-slate-600 mb-2">No. of students in library</p>
            <p className="text-3xl font-bold text-blue-600">{name.length}</p>
          </div>
           <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
             <p className="text-sm font-medium text-slate-600 mb-2">Status</p>
            {isClosed?<p className="text-3xl font-bold text-red-600" >Library Closed</p>:<p className="text-3xl font-bold text-green-600" >Library Open</p>}</div>
        </div>

        {/* Search Section */}
      <div className='flex flex-wrap m-3'>
            <form onSubmit={(e)=>{
              e.preventDefault();
            }} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
              <input 
                type="text" 
                placeholder="Search" 
                id="" 
                onChange={(e)=>{
                  setsearch(e.target.value)
                }} 
                value={search}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-gray-50 transition-colors duration-200"
              />
              <select 
                value={filter} 
                onChange={(e)=>{
                  setFilter(e.target.value);
                }} 
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white cursor-pointer transition-colors duration-200 min-w-20"
              >
                 <option value="name">Name</option>
                 <option value="PRN">PRN</option>
              </select>
            </form>
        </div>

        {/* Students Section */}
        <Searching search={search} filter={filter} name={name} Students={Students} />

        
      </div>
    </div>
  )

    }else{
      return(<>
<div className="min-h-screen bg-cover bg-center  flex items-center justify-center p-4"  style={{ backgroundImage: `url(${wallpaper})` }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h2>
            <p className="text-gray-600">{login?"Welcome Back":"Create your account to get started"}</p> 
          </div>

          <div className='flex flex-wrap'>
            <div onSubmit={handleSubmit} className="w-full space-y-6">
              {login?(null):(<div> 
                <p className="text-sm font-semibold text-gray-700 mb-2">Name</p>
                <div>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder='username' 
                    onChange={handleChange} 
                    value={formData.name} 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>)}
              

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">PRN</p>
                <div>
                  <input 
                    type="text" 
                    name="PRN" 
                    placeholder="enter PRN" 
                    onChange={handleChange} 
                    value={formData.PRN} 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Password</p>
                <div>
                  <input 
                    type="password" 
                    name="password" 
                    placeholder='your password' 
                    onChange={handleChange} 
                    value={formData.password} 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>

              <button 
                type='Submit'
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-blue-300 focus:outline-none"
              >
                Submit
              </button>
              <div >Click here to&nbsp;<span  className='text-blue-600 cursor-pointer' onClick={()=>{setLogin(!login) 
                seterr(false)
                setFormData({
                      name: '',
                      PRN: '',
                      password:''
                    }); }} >{login?"Sign Up":"Login"}</span></div>
            </div>

            {err ? (<div className="w-full mt-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-red-700 font-medium">{login?"Wrong Password":"User already exists. Please LogIn"}</p>
                </div>
              </div>): null }
          </div>
        </div>
      </div>
    </div></>)
      
    }

  
}

export default Home
