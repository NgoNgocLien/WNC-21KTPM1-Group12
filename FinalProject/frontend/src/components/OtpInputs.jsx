import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAccessToken } from '../util/cookie';
import { BASE_URL, EXPIRED_OTP_TIME } from '../util/config';

const OtpInputs = ({otp, setOtp}) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [seconds, setSeconds] = useState(EXPIRED_OTP_TIME);

  useEffect(() => {
    let timer;
    if (isDisabled) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(timer);
            setIsDisabled(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isDisabled]);

  const {email} = useSelector((state) => state.user)
  const access_token = getAccessToken();

  const handleClick = async () => {
    setIsDisabled(true);
    setSeconds(EXPIRED_OTP_TIME);
    setOtp(new Array(6).fill(""))
    const response = await fetch(`${BASE_URL}/otp/send`,{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`, 
      },
      body: JSON.stringify({
          email
      })
    })

    if (!response.ok){
      throw new Error('Failed to fetch user account info');
    } 
  }

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };



  return (
    <>
    <div className="text-center mb-4">
        <p className="text-gray-700">Vui lòng kiểm tra email của bạn để nhận mã OTP và nhập vào ô bên dưới.</p>
        {
          isDisabled ? (
            <p
              className="text-underline mt-2 cursor-not-allowed text-gray-500"
            >
              Gửi lại mã khác ({seconds}s)
            </p>
          ) : (
          <p
            onClick={handleClick}
            className="text-underline text-red-800 mt-2 cursor-pointer"
          >
            Gửi lại mã khác
          </p>
          )
        }
      </div>
      
      <div className="flex justify-center space-x-3">
        {otp.map((data, index) => (
          <input
            className="w-14 h-16 text-center border-2 border-gray-500 rounded text-2xl"
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
