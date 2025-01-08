import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import StepLabel from '../../../../components/Transfer/StepLabel'
import TransferInternalStep1 from '../../../../components/Transfer/TransferInternalStep1';
import TransferStep2 from '../../../../components/Transfer/TransferStep2';
import TransferStep3 from '../../../../components/Transfer/TransferStep3';
import TransferStep4 from '../../../../components/Transfer/TransferStep4';
import AddContactModal from '../../../../components/Account/AddContactModal';
import { INTERNAL } from '../../../../util/config';

export default function TransferInternal() {
  const location = useLocation();
  const { debt, contact } = location.state || {};

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
            debt={debt}
            contact={contact}
          />
        )
      }

      {
        currentStep === 2 && (
          <TransferStep2
            setCurrentStep={setCurrentStep}
            values={values}
          />
        )
      }

      {
        currentStep === 3 && (
          <TransferStep3
            setCurrentStep={setCurrentStep}
            values={values}
            setTransaction={setTransaction}
            transaction={transaction}
            debt={debt}

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
