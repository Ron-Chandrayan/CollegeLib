import React from 'react';

function Others() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <section className="bg-white shadow-lg rounded-2xl p-6 text-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-4">Dear Library Users,</h1>
        <p className="leading-relaxed text-justify">
          Welcome to the GST Central Library Portal!
          <br /><br />
          This platform has been developed by the website development team to enhance your interaction with the GST Central Library. It is designed to provide easy access to library information, services, ongoing activities, and relevant academic resources.
          <br /><br />
          Our goal is to create a seamless and user-friendly experience that supports your academic and research needs.
          <br /><br />
          We welcome your suggestions and feedback regarding the portal and the library services. Your input is valuable and will help us continuously improve the system to better serve the GST community.
          <br /><br />
          — Developed with dedication by the Team
        </p>
      </section>

      <section className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">📚 Important Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-blue-700 underline">
          <div>
            <h3 className="font-semibold mb-1">Digital Libraries</h3>
            <ul className="space-y-1">
              <li><a href="https://ndl.iitkgp.ac.in/" target="_blank">National Digital Library</a></li>
              <li><a href="https://epgp.inflibnet.ac.in/" target="_blank">E-Pathshala</a></li>
              <li><a href="https://egyankosh.ac.in/handle/123456789/35033" target="_blank">E-GyanKosh</a></li>
              <li><a href="https://nptelvideos.com/" target="_blank">NPTEL Videos</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Learning Platforms</h3>
            <ul className="space-y-1">
              <li><a href="https://swayam.gov.in/" target="_blank">SWAYAM</a></li>
              <li><a href="https://www.aicte.gov.in/opportunities/students/research-funds" target="_blank">Research Funds (AICTE)</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Exam & Career Portals</h3>
            <ul className="space-y-1">
              <li><a href="https://scholarships.gov.in/" target="_blank">Scholarships Portal</a></li>
              <li><a href="https://upsc.gov.in/" target="_blank">UPSC</a></li>
              <li><a href="http://gate.iitd.ac.in/" target="_blank">GATE</a></li>
              <li><a href="https://www.ets.org/gre.html" target="_blank">GRE</a></li>
              <li><a href="https://satsuite.collegeboard.org/sat" target="_blank">SAT</a></li>
              <li><a href="https://www.ets.org/toefl.html" target="_blank">TOEFL</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-1">University & Curriculum</h3>
            <ul className="space-y-1">
              <li><a href="https://mu.ac.in/syllabus#1548848043985-b224e6f7-a0de" target="_blank">Mumbai University Syllabus</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-1">News & Resources</h3>
            <ul className="space-y-1">
              <li><a href="https://www.onlinenewspapers.com/india.shtml" target="_blank">E-Newspapers</a></li>
              <li><a href="https://nad.gov.in/" target="_blank">National Academy Repositories</a></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">📖 General Rules</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Maintain silence in the library at all times. Group discussions are strictly not allowed.</li>
          <li>Personal books, printed materials, bags, and plastic carry bags are not allowed inside the library.</li>
          <li>Members are responsible for all issued items until they are returned in good condition.</li>
          <li>Report lost or damaged books to the library staff immediately.</li>
          <li>Lost/damaged books must be replaced with the latest edition or compensated at double the cost.</li>
          <li>Borrowing privileges can be suspended in case of misuse or misbehavior.</li>
          <li>Mobile phone use is strictly prohibited in and around the library premises.</li>
          <li>Reference copies must be consulted within the library.</li>
          <li>Books must be returned to the circulation desk during working hours.</li>
          <li>Renewals are allowed only if there are no reservations.</li>
          <li>Materials must be physically brought in for renewal.</li>
          <li>No one may borrow books on another's behalf.</li>
          <li>Unauthorized removal of books may lead to disciplinary action.</li>
        </ul>
      </section>

      <section className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">⏰ Library Timings</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>Monday to Saturday:</strong> 08:00 AM to 07:00 PM (11 hours)<br />
          <strong>During Vacation:</strong> 09:00 AM to 05:00 PM (8 hours)<br />
          <strong>Closed:</strong> Sundays and Public Holidays<br /><br />
          For extended hours beyond 7 PM, contact the circulation counter or email: <a className="text-blue-600 underline" href="mailto:librariangst@sies.edu.in">librariangst@sies.edu.in</a>
        </p>
      </section>
    </div>
  );
}

export default Others;
