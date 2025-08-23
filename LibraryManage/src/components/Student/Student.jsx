import React from 'react';

function Student({ name, Students }) { // Students prop kept, but unused

  // Optional: Remove logic (currently not used in UI)
  // function remove({ prnno, name }) {
  //   const apiUrl = '/api/?endpoint=in_out';
  //   const apiKey = 'ahambrahmasmi';

  //   const payload = {
  //     cardNumber: prnno,
  //     purpose: name
  //   };

  //   fetch(apiUrl, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'X-API-KEY': apiKey
  //     },
  //     body: JSON.stringify(payload)
  //   })
  //   .then(res => res.json())
  //   .then(data => {
  //     console.log('Success:', data);
  //   })
  //   .catch(err => {
  //     console.error('Error:', err);
  //   });
  // }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800">Students Currently in Library</h2>
      </div>

      <div className="p-6">
        {name.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-sm mx-auto">
              <p className="text-amber-800 font-medium">No students in lib</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {name.map((element, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:bg-slate-100 transition-colors relative"
              >
                <p className="font-medium text-slate-800 mb-1">{element.name}</p>
                <p className="text-sm text-slate-600">{element.PRN}</p>
                <p className="text-sm text-slate-600">{element.purpose}</p>

                {/* Optional remove button (uncomment if needed) */}
                
                <button
                  onClick={() => remove({ prnno: element.PRN, name: element.purpose })}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                >
                  ×
                </button>
               
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Student;
