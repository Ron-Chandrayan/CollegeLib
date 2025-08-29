import React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify'; // ✅ Import toast
import 'react-toastify/dist/ReactToastify.css'; // ✅ Ensure CSS is loaded
import { getApiUrl, getApiHeaders, getLibraryApiUrl, getLibraryApiHeaders, debugApiConfig } from '../../utils/apiConfig';

function Student({ name, Students }) { // Students prop kept, but unused

   

const[i,seti]=useState(1);

   const itemsPerPage = 10;
    const start = (i - 1) * itemsPerPage;
    const end = i * itemsPerPage;

    let slicename = name.slice(start, end);

  // Optional: Remove logic (currently not used in UI)
  async function remove({ prnno, name }) {
   

    const payload = {
      PRN: prnno,
      purpose:name
    };

    try {

      const res = await fetch('/submit', {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
      
            const data = await res.json();
      
            if (data.success===true) {
              toast.success(data.message || "Student removed!");
            } else {
              toast.error(data.message || "Something went wrong");
            }

       const resp = await fetch(getLibraryApiUrl('in_out'), {
              method: 'POST',
              headers: getLibraryApiHeaders(),
              body: JSON.stringify(payload),
            });
      
    } catch (error) {
      toast.error("Network error");
    }
    
  }

  // return (
  //   <div className="bg-white rounded-xl shadow-lg border border-slate-200">
  //     <div className="p-6 border-b border-slate-200">
  //       <h2 className="text-xl font-semibold text-slate-800">Students Currently in Library</h2>
  //     </div>

  //     <div className="p-6">
  //       {name.length === 0 ? (
  //         <div className="text-center py-8">
  //           <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-sm mx-auto">
  //             <p className="text-amber-800 font-medium">No students in lib</p>
  //           </div>
  //         </div>
  //       ) : (
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //           {name.map((element, index) => (
  //             <div
  //               key={index}
  //               className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:bg-slate-100 transition-colors relative"
  //             >
  //               <p className="font-medium text-slate-800 mb-1">{element.name}</p>
  //               <p className="text-sm text-slate-600">{element.PRN}</p>
  //               <p className="text-sm text-slate-600">{element.purpose}</p>

  //               {/* Optional remove button (uncomment if needed) */}
                
  //               <button
  //                 onClick={() => remove({ prnno: element.PRN, name: element.purpose })}
  //                 className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
  //               >
  //                 ×
  //               </button>
               
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">Members Currently in Library</h2>
        <p className="text-slate-600 mt-1">Showing Page: {i}</p>
      </div>

      {slicename.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-amber-800 font-semibold text-lg">No members in library</p>
            <p className="text-amber-700 text-sm mt-2">The library is currently empty</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="text-left py-2 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider w-16">
                  Sr.No.
                </th>
                <th className="text-left py-2 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider w-32">
                  Card Number
                </th>
                <th className="text-left py-2 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left py-2 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider w-24">
                  Purpose
                </th>
                <th className="text-center py-2 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider w-20">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {slicename.map((element, index) => (
                <tr 
                  key={name.indexOf(element)}
                  className="hover:bg-slate-50 transition-colors duration-150 group"
                >
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {(name.indexOf(element)) + 1}
                  </td>
                  <td className="py-4 px-6 text-slate-800 font-mono text-sm">
                    {element.PRN}
                  </td>
                  <td className="py-4 px-6 text-slate-800 font-medium">
                    {element.name}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {element.purpose}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => remove({ prnno: element.PRN, name: element.purpose })}
                      className="inline-flex items-center gap-2 px-3 h-9 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold shadow-sm ring-1 ring-red-300 hover:ring-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                      title="Mark as OUT"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      OUT
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {slicename.length > 0 && (<>
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
          <p className="text-sm text-slate-600 text-center">
            Showing {name.length} student{name.length !== 1 ? 's' : ''} currently in the library
          </p>
        </div>

              <div className="flex items-center justify-between bg-white px-6 py-4 border-t border-gray-200 shadow-sm">
          {/* Previous Button */}
          <button
            onClick={() => {
              seti(i - 1);
            }}
            disabled={i == 1}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">
              {i}
            </span>
            <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors duration-200">
              {i + 1}
            </span>
            <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors duration-200">
              {i + 2}
            </span>
          </div>

          {/* Next Button */}
          <button
            onClick={() => {
              seti(i + 1);
            }}
            disabled={i >= ((Math.ceil(name.length)) / 10)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 transition-colors duration-200"
          >
            Next
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        </>
      )}
    </div>
  );

}

export default Student;
