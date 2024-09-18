// import React from 'react'
// import './Main.css';
// import { Link } from 'react-router-dom';



// const Main = () => {
//   return (
//     <div className='hello '>
//       <div className='hello-text'>
//         <h1>Streamline Your Taxes with Ease!!!</h1>
//         <p>
       
// Taxes are essential financial contributions that individuals and businesses make to support government functions and public services.
//  They fund critical areas such as infrastructure, education, healthcare, and social programs.
//         </p>
//         <Link to="/faq" className="btn-link">
//         <button className='btnn' >Explore More 
//         <i class="fa fa-caret-right" style={{fontSize: "24px",marginLeft:"10px"}}></i>
       
//         </button>
//         </Link>
//       </div>
//     </div>
//   )
// }

// export default Main


import React, { useState } from 'react';
import './Main.css';
import { FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const Main = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className='hello'>
      <div className='hello-text'>
      <h1>Welcome to Your Employee Portal!</h1>
        <p>
          Your employee portal is your central hub for accessing important HR information and resources. Here, you can manage your personal details, view project information, and work on your assigned project. Stay connected and up-to-date with all your HR needs.
        </p>
        
         <button className='btnn' >Explore More 
        <i class="fa fa-caret-right" style={{fontSize: "24px",marginLeft:"10px"}}></i>
        </button>
       
      </div>
     

      
    
    </div>
  );
};

export default Main;

