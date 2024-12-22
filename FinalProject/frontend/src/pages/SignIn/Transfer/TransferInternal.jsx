import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import StepLabel from '../../../components/Transfer/StepLabel'
import TransferInternalStep1 from './../../../components/Transfer/TransferInternalStep1';
import TransferInternalStep2 from './../../../components/Transfer/TransferInternalStep2';
import TransferInternalStep3 from './../../../components/Transfer/TransferInternalStep3';
import TransferInternalStep4 from './../../../components/Transfer/TransferInternalStep4';
import AddContactModal from './../../../components/Account/Modal/AddContactModal';

export default function TransferInternal() {
  const [currentStep, setCurrentStep] = useState(1)
  const [values, setValues] = useState(null)
  const [transaction, setTransaction] = useState(null)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <StepLabel
        label="Chuyển tiền trong NoMeoBank"
        currentStep={currentStep} />

      {
        currentStep === 1 && (
          <TransferInternalStep1
            setCurrentStep={setCurrentStep}
            setValues={setValues}
          />
        )
      }

      {
        currentStep === 2 && (
          <TransferInternalStep2
            setCurrentStep={setCurrentStep}
            values={values}
            setTransaction={setTransaction}
          />
        )
      }

      {
        currentStep === 3 && (
          <TransferInternalStep3
            setCurrentStep={setCurrentStep}
            values={values}
            setTransaction={setTransaction}
          />
        )
      }

      {
        currentStep === 4 && (
          <TransferInternalStep4
            transaction={transaction}
            setIsAddModalOpen={setIsAddModalOpen}
          />
        )
      }

      <AddContactModal 
        isOpen={isAddModalOpen} 
        closeModal={() => setIsAddModalOpen(false)} 
        recipient={{
          bank_id: transaction?.id_recipient_bank,
          account_number: transaction?.recipient_account_number,
          fullname: transaction?.recipient_name,
        }}
      />
    </>
  )
}
