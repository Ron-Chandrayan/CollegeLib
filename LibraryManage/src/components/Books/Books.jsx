import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import BookSearching from '../BookSearching.jsx/BookSearching';

function Books() {
    const{books, setBooks}=useOutletContext()
    const[i,seti]=useState(1);
    const[paginatedbooks,setpaginatedbooks]=useState([])
    const[booksearch,setbooksearch]=useState("");
    const[filter,setFilter]=useState("");

    useEffect(()=>{
              const fetchData =async()=>{
                const BASEURL = 'https://libman.ethiccode.in/api/index.php';
                const apikey = 'ahambrahmasmi';
    
                try{fetch(`/api/api/index.php?endpoint=book_all&page=${i}&limit=20`, {
                      headers: {
                          'x-api-key': apikey // Use XAPIKEY header
                      }
                      })
                      .then(response => response.json())
                      .then(data => {console.log(data.data.books);
                        const paginatedkitab = data.data.books
                          //seterr(false)
                          // const info = data.students
                          // setName(info);
                          // // console.log(info[0].name)
                          setpaginatedbooks(paginatedkitab)
                          
                      })
                      }
                      catch(error){
                          seterr(true);
                          console.error(error);
                      }
              }
              fetchData();
              
            },[i])

return(<>
    {/* Header Section */}
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Library Management</h1>
            <p className="text-blue-100 text-lg">Browse and search through our book collection - Page {i}</p>
        </div>
    </div>

    {/* Main Content Container */}
    <div className="max-w-7xl mx-auto px-6 py-8 bg-gray-50 min-h-screen">
        
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Search Books
            </h2>
            
            <form onSubmit={(e)=>{
              e.preventDefault();
            }} className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <div className="flex-1 w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Enter book title or author..." 
                  id="" 
                  onChange={(e)=>{
                    setbooksearch(e.target.value)
                  }} 
                  value={booksearch}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-900 bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                />
              </div>
              <div className="w-full sm:w-auto">
                <select 
                  value={filter} 
                  onChange={(e)=>{
                    setFilter(e.target.value);
                  }} 
                  className="w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md appearance-none"
                >
                  <option value="" hidden>Select search filter</option>
                   <option value="title">Search by Title</option>
                   <option value="author">Search by Author</option>
                </select>
              </div>
            </form>
        </div>

        {/* Books Display Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <BookSearching paginatedbooks={paginatedbooks}  filter={filter} books={books} bookname={booksearch} />
        </div>

        {/* Pagination Section */}
        <div className="mt-8 flex justify-center">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-2 flex items-center space-x-1">
                
                {/* Previous Button */}
                <button 
                  onClick={()=>{
                      if(i>1){
                          seti(i-1);
                      }
                  }}
                  disabled={i <= 1}
                  className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1 px-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-600 text-white font-semibold shadow-sm">
                        {i}
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200 cursor-pointer">
                        {i+1}
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200 cursor-pointer">
                        {i+2}
                    </div>
                </div>

                {/* Next Button */}
                <button 
                  onClick={()=>{
                      if(i<(Math.floor((books.length)/20))){
                          seti(i+1)
                      }
                  }}
                  disabled={i >= Math.floor((books.length)/20)}
                  className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>

            </div>
        </div>

        {/* Page Info */}
        <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
                Page {i} of {Math.ceil(books.length / 20)} | Showing up to 20 books per page
            </p>
        </div>

    </div>

</>)
}

export default Books