import React from 'react'
import { useEffect } from 'react'
import { Users, BarChart3, Clock, BookOpen, UserCheck, Search, CreditCard, Zap, TrendingUp, Calendar, Activity } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

function About() {

  const {name,setName,todayfootfall,settodayfootfall,totalfootfall,settotalfootfall,signup,setSignup, Students,setStudents,login,setLogin,welcome,setwelcome} = useOutletContext()


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            LiBManage
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive digital solution for modern library operations, designed to streamline 
            student management, track usage patterns, and enhance the overall library experience.
          </p>
        </div>

        {/* Current Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Current Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Student Management */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Student Management</h3>
              </div>
              <p className="text-gray-600">
                Complete listing and management of all students currently utilizing library services, 
                with real-time status updates and comprehensive student profiles.
              </p>
            </div>

            {/* Real-time Analytics */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <Activity className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Real-time Data</h3>
              </div>
              <p className="text-gray-600">
                Live tracking of total footfall and hourly visitor statistics, providing instant 
                insights into library usage patterns and peak hours.
              </p>
            </div>

            {/* Statistics Dashboard */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Statistics & Graphs</h3>
              </div>
              <p className="text-gray-600">
                Interactive visual representations of hourly and total footfall data through 
                comprehensive charts and graphs for better decision-making.
              </p>
            </div>
          </div>
        </div>

        {/* Development Status */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-16 rounded-r-lg">
          <div className="flex items-center mb-3">
            <Clock className="h-6 w-6 text-amber-600 mr-2" />
            <h3 className="text-lg font-semibold text-amber-800">Development Phase</h3>
          </div>
          <p className="text-amber-700">
            This system is currently in active development. We're continuously working to enhance 
            functionality and add new features based on user feedback and library requirements.
          </p>
        </div>

        {/* Upcoming Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Upcoming Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Student Analytics */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                <h4 className="text-lg font-semibold text-gray-800">Student Analytics</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Comprehensive analysis of individual student library usage patterns, visit frequency, 
                and behavior insights to enhance personalized services.
              </p>
            </div>

            {/* Book Search by Author */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-3">
                <Search className="h-6 w-6 text-green-600 mr-2" />
                <h4 className="text-lg font-semibold text-gray-800">Author Search</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Advanced search functionality to find books by specific authors, with auto-complete 
                and filtering options for quick and accurate results.
              </p>
            </div>

            {/* Subject-based Search */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center mb-3">
                <BookOpen className="h-6 w-6 text-purple-600 mr-2" />
                <h4 className="text-lg font-semibold text-gray-800">Subject Search</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Categorized book search by subjects and topics, making it easier for students 
                to find relevant academic and reference materials.
              </p>
            </div>

            {/* ID Card Scanner */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-center mb-3">
                <CreditCard className="h-6 w-6 text-red-600 mr-2" />
                <h4 className="text-lg font-semibold text-gray-800">ID Card Scanner</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Direct library entry system using student ID card scanning for seamless 
                access control and automatic attendance tracking.
              </p>
            </div>

            {/* Quick Login/Logout */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center mb-3">
                <Zap className="h-6 w-6 text-orange-600 mr-2" />
                <h4 className="text-lg font-semibold text-gray-800">One-Click Access</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Lightning-fast login and logout system with single-click functionality 
                for improved user experience and reduced wait times.
              </p>
            </div>

            {/* Enhanced User Management */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
              <div className="flex items-center mb-3">
                <UserCheck className="h-6 w-6 text-indigo-600 mr-2" />
                <h4 className="text-lg font-semibold text-gray-800">Enhanced Management</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Advanced user management features including role-based access, detailed 
                user profiles, and comprehensive activity logging.
              </p>
            </div>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
          <p className="text-gray-600 text-lg max-w-4xl mx-auto">
            To create a fully integrated, intelligent library management ecosystem that not only 
            streamlines operations but also provides valuable insights to improve library services 
            and enhance the academic experience for all users.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
