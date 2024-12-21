import React, { useState} from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaCircle, FaCheck } from 'react-icons/fa';

const steps = [
    { id: 1, label: 'Khởi tạo'},
    { id: 2, label: 'Xác nhận' },
    { id: 3, label: 'Xác thực' },
    { id: 4, label: 'Kết quả' },
  ];

export default function StepLabel({label, currentStep}) {
  return (
    <>
        <p className="text-lg font-semibold">{label}</p>

        <div className="w-full flex justify-around my-4">
        <div className="flex-grow h-[2px] bg-red-800 mx-1 mt-4 "></div>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full 
              ${step.id <= currentStep ? 'bg-red-800 text-white' : 'bg-white border-2 border-gray-400 text-gray-400'}`}>
            {
              step.id < currentStep 
              ? <span><FaCheck className="" /></span>
              : <span>{step.id}</span>
            }
            </div>
            <span className={`mt-2 ${step.id <= currentStep ? 'text-black font-semibold' : 'text-gray-400'}`}>{step.label}</span>
          </div>
          <div className={`flex-grow h-[2px]  mx-1 mt-4 ${step.id < currentStep ? 'bg-red-800':'bg-gray-300'} `}></div>
          </React.Fragment>
        ))}
        </div>
    </>
  )
}
