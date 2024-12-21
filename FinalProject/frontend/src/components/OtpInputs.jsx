import React, { useState } from 'react';

const OtpInputs = ({otp, setOtp}) => {
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus on next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  return (
    <>
    <div className="text-center mb-4">
        <p className="text-gray-700">Vui lòng kiểm tra email của bạn để nhận mã OTP và nhập vào ô bên dưới.</p>
      </div>
      
      <div className="flex justify-center space-x-3">
        {otp.map((data, index) => (
          <input
            className="w-14 h-16 text-center border-2 border-gray-500 rounded"
            type="text"
            name="otp"
            maxLength="1"
            key={index}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
    </>
  );
};

export default OtpInputs;
