/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid'; // Note the updated path for v2
import MyProfile from '../emp_Profile/Components/MyProfile'
import Basic_Info from '../emp_Profile/Components/Basic_Info'
import Personal_Info from '../emp_Profile/Components/Personal_Info'
import Work_Info from '../emp_Profile/Components/Work_Info'
import Statutory_Details from '../emp_Profile/Components/Statutory_Details'
import Skills_Info from '../emp_Profile/Components/Skills_Info'
import Salary_Account_Details from '../emp_Profile/Components/Salary_Account_Details'
import Dependent_Details from '../emp_Profile/Components/Dependent_Details'
import Work_Experience from '../emp_Profile/Components/Work_Experience'
import Education_Info from '../emp_Profile/Components/Education_Info'
import Header from '../components/Header';


const Profile=()=> {

  const handleBack = () => {
    // Logic to go back, such as navigating to the previous page
    window.history.back();
  };



  return (
    
      <>
      
   
<Header/>
        <div className="relative flex flex-col space-y-2 mx-4 mt-10">
          {/* Back Arrow Icon */}
          <button 
            onClick={handleBack}
            className=" top-0 left-0 flex items-center space-x-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white ">
            <ArrowLeftIcon className="h-6 w-6 bg-black rounded-xl" aria-hidden="true" />
          </button>
          
          {/* Profile Content */}
          <div className="mt-8">
        <MyProfile />
       
          <div className='flex justify-between'>
            <div className=' flex-col space-y-2'>
              <Basic_Info />
              <Personal_Info />
            </div>
            <div className=' flex-col space-y-2'>
              <Work_Info />
              <Statutory_Details />
            </div>
            <div className=' flex-col space-y-2'>
              <Skills_Info />
              <Salary_Account_Details />
            </div>
          </div>
          <div className='space-y-2'>
            {/* <Dependent_Details />
            <Education_Info />
            <Work_Experience /> */}
          </div>
     
      </div>

      {/* <Route path='/doc-viewer/:docId' element={<DocViewer />} />

<BirthdayWishes />
<WorkAnniversary /> */}
    </div>
  
    </>
  

  )
}

export default Profile