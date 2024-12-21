import React, { useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import StepLabel from '../../../../components/Transfer/StepLabel'
import TransferInternalStep1 from './TransferInternalStep1';

export default function TransferInternal() {
  const [currentStep, setCurrentStep] = useState(1)
  const [values, setValues] = useState(null)

  return (
    <main className="ms-64 p-8 flex flex-col gap-4 bg-red-50 overflow-auto">
      <StepLabel 
        label="Chuyển tiền trong NoMeoBank"
        currentStep={currentStep}/>

      {
        currentStep === 1 && (
          <TransferInternalStep1 
            setCurrentStep={setCurrentStep}
            setValues={setValues}/>
        )
      }

      {/* {
        currentStep === 2 && (
          <TransferInternalStep2 setCurrentStep={setCurrentStep}/>
        )
      } */}
      
    </main>
  )
}
