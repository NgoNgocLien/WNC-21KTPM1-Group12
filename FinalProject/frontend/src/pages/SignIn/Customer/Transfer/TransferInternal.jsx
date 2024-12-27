import React, { useState } from 'react';

import StepLabel from '../../../../components/Transfer/StepLabel'
import TransferInternalStep1 from '../../../../components/Transfer/TransferInternalStep1';
import TransferStep2 from '../../../../components/Transfer/TransferStep2';
import TransferStep3 from '../../../../components/Transfer/TransferStep3';
import TransferStep4 from '../../../../components/Transfer/TransferStep4';
import AddContactModal from '../../../../components/Account/Modal/AddContactModal';
import { INTERNAL } from '../../../../util/config';

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
          <TransferStep2
            type={INTERNAL}
            setCurrentStep={setCurrentStep}
            values={values}
            setTransaction={setTransaction}
          />
        )
      }

      {
        currentStep === 3 && (
          <TransferStep3
            type={INTERNAL}   
            setCurrentStep={setCurrentStep}
            values={values}
            setTransaction={setTransaction}
          />
        )
      }

      {
        currentStep === 4 && (
          <TransferStep4
            type={INTERNAL}
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
