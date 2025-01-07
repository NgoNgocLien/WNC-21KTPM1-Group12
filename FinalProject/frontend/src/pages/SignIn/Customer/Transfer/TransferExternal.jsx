import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import StepLabel from '../../../../components/Transfer/StepLabel'
import TransferExternalStep1 from '../../../../components/Transfer/TransferExternalStep1';
import TransferStep2 from '../../../../components/Transfer/TransferStep2';
import TransferStep3 from '../../../../components/Transfer/TransferStep3';
import TransferStep4 from '../../../../components/Transfer/TransferStep4';
import AddContactModal from '../../../../components/Account/AddContactModal';
import { EXTERNAL } from '../../../../util/config';

export default function TransferExternal() {
  const location = useLocation();
  const { contact } = location.state || {};

  const [currentStep, setCurrentStep] = useState(1)
  const [values, setValues] = useState(null)
  const [transaction, setTransaction] = useState(null)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <StepLabel
        label="Chuyển tiền ngoài NoMeoBank"
        currentStep={currentStep} />

      {
        currentStep === 1 && (
          <TransferExternalStep1
            setCurrentStep={setCurrentStep}
            setValues={setValues}
            contact={contact}
          />
        )
      }

      {
        currentStep === 2 && (
          <TransferStep2
            type={EXTERNAL}
            setCurrentStep={setCurrentStep}
            values={values}
            setTransaction={setTransaction}
          />
        )
      }

      {
        currentStep === 3 && (
          <TransferStep3
            type={EXTERNAL}   
            setCurrentStep={setCurrentStep}
            values={values}
            setTransaction={setTransaction}
          />
        )
      }

      {
        currentStep === 4 && (
          <TransferStep4
            type={EXTERNAL}
            transaction={transaction}
            setIsAddModalOpen={setIsAddModalOpen}
          />
        )
      }

      {
        transaction && (
          <AddContactModal 
            isOpen={isAddModalOpen} 
            closeModal={() => setIsAddModalOpen(false)} 
            recipient={{
              bank_id: transaction?.id_recipient_bank,
              account_number: transaction?.recipient_account_number,
              fullname: transaction?.recipient_name,
            }}
          />
        )
      }
      
    </>
  )
}
