import React from 'react';
import { ExternalLink, Clock, BookOpen, Users, GraduationCap, Newspaper, Award, Building2 } from 'lucide-react';

function Others() {
  const linkCategories = [
    {
      title: "Digital Libraries & Resources",
      icon: <BookOpen className="w-5 h-5" />,
      color: "from-blue-500 to-blue-600",
      links: [
        { name: "National Digital Library", url: "https://ndl.iitkgp.ac.in/" },
        { name: "E-Pathshala", url: "https://epgp.inflibnet.ac.in/" },
        { name: "E-GyanKosh", url: "https://egyankosh.ac.in/handle/123456789/35033" },
        { name: "NPTEL Videos", url: "https://nptelvideos.com/" },
        { name: "National Academy Repositories", url: "https://nad.gov.in/" }
      ]
    },
    {
      title: "Learning Platforms",
      icon: <GraduationCap className="w-5 h-5" />,
      color: "from-emerald-500 to-emerald-600",
      links: [
        { name: "SWAYAM", url: "https://swayam.gov.in/" },
        { name: "Research Funds (AICTE)", url: "https://www.aicte.edu.in/opportunities/students/research-funds" }
      ]
    },
    {
      title: "Competitive Exams",
      icon: <Award className="w-5 h-5" />,
      color: "from-purple-500 to-purple-600",
      links: [
        { name: "UPSC", url: "https://upsc.gov.in/" },
        { name: "GATE", url: "http://gate.iitd.ac.in/" },
        { name: "GRE", url: "https://www.ets.org/gre.html" },
        { name: "SAT", url: "https://satsuite.collegeboard.org/sat" },
        { name: "TOEFL", url: "https://www.ets.org/toefl.html" }
      ]
    },
    {
      title: "Scholarships & Financial Aid",
      icon: <Users className="w-5 h-5" />,
      color: "from-orange-500 to-orange-600",
      links: [
        { name: "Scholarships Portal", url: "https://scholarships.gov.in/" }
      ]
    },
    {
      title: "University Resources",
      icon: <Building2 className="w-5 h-5" />,
      color: "from-indigo-500 to-indigo-600",
      links: [
        { name: "Mumbai University Syllabus", url: "https://mu.ac.in/syllabus#1548848043985-b224e6f7-a0de" }
      ]
    },
    {
      title: "News & Publications",
      icon: <Newspaper className="w-5 h-5" />,
      color: "from-red-500 to-red-600",
      links: [
        { name: "E-Newspapers", url: "https://www.onlinenewspapers.com/india.shtml" }
      ]
    }
  ];

  const rules = [
    "Maintain complete silence in the library. Group discussions are strictly prohibited.",
    "Personal belongings including books, bags, and carry bags are not permitted inside.",
    "Members are fully responsible for all issued items until proper return.",
    "Report any lost or damaged materials to library staff immediately.",
    "Lost/damaged items must be replaced with latest edition or compensated at double cost.",
    "Borrowing privileges may be suspended for misuse or inappropriate behavior.",
    "Mobile phones and electronic devices must remain silent and usage is prohibited.",
    "Reference materials must be consulted within library premises only.",
    "All returns must be made at the circulation desk during operating hours.",
    "Renewals are permitted only when no reservations exist for the item.",
    "Physical presence of materials is required for renewal processes.",
    "Proxy borrowing on behalf of others is strictly forbidden.",
    "Unauthorized removal of materials will result in disciplinary action."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 mb-12 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              GST Central Library
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your gateway to knowledge and academic excellence
            </p>
          </div>
          
          <div className="prose prose-lg max-w-4xl mx-auto text-gray-700">
            <p className="text-center leading-relaxed">
              Welcome to the GST Central Library Portal! This platform has been thoughtfully developed 
              to enhance your interaction with our library services, providing seamless access to 
              academic resources, digital collections, and essential information.
            </p>
            <p className="text-center mt-4">
              We are committed to supporting your academic journey and research endeavors. Your feedback 
              helps us continuously improve our services for the GST community.
            </p>
            <p className="text-center text-sm text-gray-500 mt-6 italic">
              — Crafted with dedication by the Development Team
            </p>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Academic Resources & Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {linkCategories.map((category, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 overflow-hidden">
                <div className={`bg-gradient-to-r ${category.color} p-4`}>
                  <div className="flex items-center space-x-3 text-white">
                    {category.icon}
                    <h3 className="font-semibold text-lg">{category.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between group text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.name}
                          </span>
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Library Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Library Guidelines</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rules.map((rule, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Library Timings */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20 h-fit">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Operating Hours</h2>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-gray-800 mb-2">Regular Hours</h4>
                  <p className="text-gray-700">
                    <span className="font-medium">Monday - Saturday</span><br />
                    08:00 AM - 07:00 PM<br />
                    <span className="text-sm text-gray-500">(11 hours daily)</span>
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                  <h4 className="font-semibold text-gray-800 mb-2">Vacation Hours</h4>
                  <p className="text-gray-700">
                    09:00 AM - 05:00 PM<br />
                    <span className="text-sm text-gray-500">(8 hours daily)</span>
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-2">Closed</h4>
                  <p className="text-gray-700">
                    Sundays & Public Holidays
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <h4 className="font-semibold text-gray-800 mb-2">Extended Hours</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Need access beyond 7 PM?
                  </p>
                  <a 
                    href="mailto:librariangst@sies.edu.in"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors duration-200"
                  >
                    Contact Library
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
      </div>
    </div>
  );
}

export default Others;
 