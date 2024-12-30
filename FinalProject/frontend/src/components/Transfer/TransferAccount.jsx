import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Select from 'react-select';
import BalanceDisplay from "../Account/BalanceDisplay";
import { customSelectStyles } from "../../util/customStyle";

export default function TransferAccount({formik}) {
    const { account_number, balance } = useSelector((state) => state.user);
    const [accountOptions, setAccountOptions] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);

    useEffect(() => {
        if (account_number) {
            const accountOption = {
                value: account_number,
                label: (
                    <div className="flex items-center font-semibold">
                        {account_number}
                    </div>
                ),
            };
            setAccountOptions([accountOption]);
            setSelectedAccount(accountOption);
            formik.setFieldValue('sender_account_number', account_number);
        }
    }, [account_number]);

    return (
        <div className="w-8/12 mx-auto p-6 flex bg-white rounded-xl justify-between">
            <div className="w-3/12 font-semibold">
                Từ tài khoản nguồn
            </div>
            <div className="w-7/12 flex flex-col font-semibold space-y-4">
                <Select
                    name="sender_account_number"
                    value={selectedAccount}  // Set the selected value
                    onChange={(option) => setSelectedAccount(option)}  // Update state on change
                    options={accountOptions}
                    styles={customSelectStyles}
                />
                <div className="flex space-x-4">
                    <p className="text-gray-500">Số dư:</p>
                    <BalanceDisplay balance={balance}/>
                </div>
                
            </div>
        </div>
    );
}


