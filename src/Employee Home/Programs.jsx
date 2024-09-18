import React from 'react';
import './Programs.css';
import hrms1 from '../assets/hrms1.jpg'; // Adjust these paths if needed
import hrms2 from '../assets/hrms2.jpg';
import hrms3 from '../assets/hrms3.jpg';

const Programs = () => {
    return (
        <div>
            <h1>Our Employee Services</h1>
            <div className="programs">
                <div className="program">
                    <img src={hrms1} alt="Employee Onboarding" />
                    <div className="caption">
                        <p>Streamlined Onboarding</p>
                    </div>
                </div>
                <div className="program">
                    <img src={hrms2} alt="Payroll Management" />
                    <div className="caption">
                        <p>Projects & works</p>
                    </div>
                </div>
                <div className="program">
                    <img src={hrms3} alt="Benefits and Rewards" />
                    <div className="caption">
                        <p>Comprehensive Benefits</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Programs;
