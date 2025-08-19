import React from 'react'
import { useState, useEffect } from 'react'
import Student from '../Student/Student'
import Searching from '../Seaching/Searching'
import { useOutletContext } from 'react-router-dom'
import wallpaper from '../../assets/wallpaper.jpeg';
import loadingGif from '../../assets/loading-gst.gif';
import AnimatedAuth from '../Auth/AnimatedAuth';
import { Users, BarChart3, Clock, BookOpen, UserCheck, Search, CreditCard, Zap, TrendingUp, Calendar, Activity } from 'lucide-react'

function Home() {
    const {name,setName,todayfootfall,settodayfootfall,totalfootfall,settotalfootfall,signup,setSignup, Students,setStudents,login,setLogin,welcome,setwelcome,universalformData,setuniversalFormData,welcome2,setwelcome2,library,setlibrary,formData,setFormData} = useOutletContext()

    const[err,seterr]= useState(false)
    const[errMessage, setErrMessage] = useState("")
    const[search,setsearch]=useState("");
    const[filter,setFilter]= useState("");
    const [isClosed, setIsClosed] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const crowdClass = 
    name.length >= 120 ? 'text-red-600' :
    name.length >= 90 ? 'text-orange-600' :
    name.length >= 45 ? 'text-yellow-600' :
    name.length > 0 ? 'text-green-600' :
    'text-slate-400';

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
          setIsAuthLoading(false); // no token, done loading
          return;
        }

        fetch('/validate', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            if (data.valid) {
              if(data.type==="library"){
                setlibrary(true);
              }
              setSignup(true);
              setLogin(true);
              setwelcome(data.name);
              setwelcome2(data.PRN);
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

                fetch('/gettime', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                })
                .then(res => res.json())
                .then(data => {
                    //console.log("PRN from /gettime:", data.prn);
                })
                .catch(err => console.error(err));

    }, []);

    useEffect(()=>{
        const getData=async ()=>{
        try{
        await fetch('/fetchusers') //for stats page
            .then(response => response.json())
            .then(data => {
                if(signup===false && login===false){
                    
                }else{
                    data.forEach(element => {
                        if(element.PRN===formData.PRN){
                            setwelcome(element.name);
                            console.log(welcome);
                        }
                    });
                }
            })
        }
        catch(error){
            console.error(error);
        }
    }
    getData();
    },[login , signup ,welcome ])

    useEffect(() => {
        const checkTime = () => {
          const now = new Date();
          const currentHours = now.getHours();
          const currentMinutes = now.getMinutes();

          // 17:35 in 24-hour format = 5:35 PM
          if (((currentHours > 17 || (currentHours === 17 && currentMinutes >= 45)) )||(currentHours<8 || (currentHours === 8 && currentMinutes <= 15))) {
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
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="flex flex-col items-center space-y-6">
              {/* Custom loading GIF */}
              <div className="relative">
                <img 
                  src={loadingGif} 
                  alt="Loading..." 
                  className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40"
                />
              </div>
              
              {/* Enhanced loading text */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-slate-700 font-semibold text-xl">Loading Library</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
                <p className="text-slate-500 text-sm">Please wait while we prepare your dashboard...</p>
              </div>
            </div>
          </div>
        );
    }

    if(signup){
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
                <div className="max-w-6xl mx-auto">

                     <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-16 rounded-r-lg">
                        <div className="flex items-center mb-3">
                            <Clock className="h-6 w-6 text-amber-600 mr-2" />
                            <h3 className="text-lg font-semibold text-amber-800">Development Phase</h3>
                        </div>
                        <p className="text-amber-700">
                            This system is currently in active development. We're continuously working to enhance 
                            functionality and add new features based on user feedback and library requirements.
                            We are in the process of updating our PYQ page. All the PYQ question papers are getting uploaded and will take a few business days.
                            We are currently awaiting validation from our librarian to implement it in our library. Once it's implemented entry/exit will become more feasible and there will be a dedicated site for our own library.  In the meantime feel free to check out it's features and don't forget to tell your friends about it!
                        </p>
                    </div>

                    {/* Enhanced Header */}
                    <div className="bg-gradient-to-br from-white/80 via-blue-50/80 to-indigo-100/80 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 mb-8 border border-white/50 backdrop-blur-xl">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                            <div className="flex-1 mb-6 lg:mb-0">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative">
                                        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                                        <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                                        Library Dashboard
                                    </h1>
                                </div>
                                <p className="text-slate-600/90 text-lg sm:text-xl font-medium">
                                    Intelligent student presence tracking & management system
                                </p>
                            </div>
                            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/30">
                                <div className="relative">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                                </div>
                                <span className="text-sm font-semibold text-slate-700">Live System</span>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-xl">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">
                                        {login ? "Welcome Back" : "Welcome"}
                                    </p>
                                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                                        {welcome}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Statistics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                        <div className="group bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl p-6 border border-green-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-sm font-semibold text-slate-600 mb-2">Today's Footfall</p>
                            <p className="text-3xl sm:text-4xl font-bold text-green-600">{todayfootfall}</p>
                        </div>
                        
                        <div className="group bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-6 border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-sm font-semibold text-slate-600 mb-2">Total Footfall</p>
                            <p className="text-3xl sm:text-4xl font-bold text-blue-600">{totalfootfall}</p>
                        </div>
                        
                        <div className="group bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl p-6 border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-sm font-semibold text-slate-600 mb-2">Current Students</p>
                            <p className="text-3xl sm:text-4xl font-bold text-purple-600">{name.length}</p>
                        </div>
                        
                        <div className="group bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl p-6 border border-orange-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isClosed ? 'bg-gradient-to-br from-red-500 to-pink-600' : 'bg-gradient-to-br from-green-500 to-emerald-600'}`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className={`w-3 h-3 rounded-full animate-pulse ${isClosed ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            </div>
                            <p className="text-sm font-semibold text-slate-600 mb-2">Library Status</p>
                            <p className={`text-2xl sm:text-3xl font-bold ${isClosed ? 'text-red-600' : 'text-green-600'}`}>
                                {isClosed ? 'Closed' : 'Open'}
                            </p>
                        </div>
                        
                        <div className="group bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl p-6 border border-indigo-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${(name.length) > 30 ? 'bg-gradient-to-br from-orange-500 to-red-600' : 'bg-gradient-to-br from-indigo-500 to-blue-600'}`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className={`w-3 h-3 rounded-full animate-pulse ${(name.length) > 30 ? 'bg-orange-500' : 'bg-indigo-500'}`}></div>
                            </div>
                            <p className="text-sm font-semibold text-slate-600 mb-2">Activity Level</p>
                            <p className={`text-2xl sm:text-3xl font-bold ${crowdClass}`}>
                                {
                                    name.length >= 120 ? "Overcrowded" :
                                    name.length >= 90 ? "Busy" :
                                    name.length >= 45 ? "Normal" :
                                    name.length > 0 ? "Light Crowd" :
                                    "Empty"
                                }
                            </p>
                        </div>
                    </div>

                    {/* Enhanced Search Section */}
                    

                    {/* Students Section */} 
                    {library?<>

                    <div className='mb-8'>
                        <div className="bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/40">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Search students..." 
                                        onChange={(e) => setsearch(e.target.value)} 
                                        value={search}
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 text-slate-900 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                                    />
                                </div>
                                <select 
                                    value={filter} 
                                    onChange={(e) => setFilter(e.target.value)} 
                                    className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 bg-white/80 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:bg-white min-w-32"
                                >
                                    <option value="name">Search by Name</option>
                                    <option value="PRN">Search by PRN</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <Searching search={search} filter={filter} name={name} Students={Students} /></>:null}

                    {/* <Searching search={search} filter={filter} name={name} Students={Students} /> */}
                </div>
            </div>
        )
    } else {
        return (
            <AnimatedAuth 
                onAuthSuccess={(data) => {
                    setSignup(true);
                    setLogin(true);
                    setwelcome(data.name);
                    setwelcome2(data.PRN);
                    setlibrary(data.type === 'library');
                    seterr(false);
                    setErrMessage("");
                }}
            />
        );
    }
}

export default Home
