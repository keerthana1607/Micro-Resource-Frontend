

import React from 'react';
import { CheckIcon } from '@heroicons/react/solid';

const Pricing = () => {
  return (
    <div name='pricing' className='w-full text-white my-24'>
      <div className='w-full h-[800px] bg-gray-800 absolute mix-blend-overlay'></div>

      <div className='max-w-[1240px] mx-auto py-12'>

        <div className='text-center py-8 text-gray-300'>
          <h2 className='text-3xl uppercase'>Our IT Solutions</h2>
          {/* <h3 className='text-5xl font-bold text-white py-8'>Choose the right plan for your tax needs.</h3> */}
          <p className='text-3xl'>
          Explore our range of IT services designed to meet the needs of businesses of all sizes. Whether you're looking for essential support or advanced solutions, we have plans that will help you achieve your goals.
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>

          <div className='bg-white text-gray-900 m-4 p-8 rounded-xl shadow-2xl relative'>
            {/* <span className='uppercase px-3 py-1 bg-blue-200 text-blue-900 rounded-2xl text-sm'>Basic</span>
            <div>
              <p className='text-6xl font-bold py-4 flex'>$29<span className='text-xl text-gray-500 flex flex-col justify-end'>/mo</span></p>
            </div> */}
            <p className='text-2xl py-8 text-gray-500'>Essential IT support for small businesses to maintain and manage their technology needs effectively.</p>
            <div className='text-2xl'>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />24/7 Technical Support</p>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />Basic Network Monitoring</p>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />Software Updates</p>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />Basic Data Backup</p>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />Monthly reports</p>
                <button className='w-full py-4 my-4 bg-blue-500 text-white rounded-lg'>Get Started</button>
            </div>
          </div>

          <div className='bg-white text-gray-900 m-4 p-8 rounded-xl shadow-2xl relative'>
            {/* <span className='uppercase px-3 py-1 bg-blue-200 text-blue-900 rounded-2xl text-sm'>Professional</span>
            <div>
              <p className='text-6xl font-bold py-4 flex'>$99<span className='text-xl text-gray-500 flex flex-col justify-end'>/mo</span></p>
            </div> */}
            <p className='text-2xl py-8 text-gray-500'>Comprehensive IT solutions with advanced features for businesses looking for robust and proactive technology management.</p>
            <div className='text-2xl'>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />Advanced Network Security</p>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />24/7 Monitoring and Alerts</p>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />Cloud Services Integration</p>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />Dedicated IT Specialist</p>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />Monthly Performance Reviews</p>
                <button className='w-full py-4 my-4 bg-blue-500 text-white rounded-lg'>Get Started</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Pricing;

