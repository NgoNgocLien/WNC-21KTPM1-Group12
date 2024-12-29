import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Select from 'react-select';
import BalanceDisplay from "../Account/BalanceDisplay";

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
                    styles={customStyles}
                />
                <div className="flex space-x-4">
                    <p className="text-gray-500">Số dư:</p>
                    <BalanceDisplay balance={balance}/>
                </div>
                
            </div>
        </div>
    );
}

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        display: 'flex',
        alignItems: 'center',
        padding: 10,
        marginBottom: 1,
        backgroundColor: state.isFocused ? '#f5f5f5' : 'white',
        color: 'black',
    }),
    menu: (provided) => ({
        ...provided,
        borderBottomLeftRadius: '0.5rem', 
        borderBottomRightRadius: '0.5rem', 
    }),
    singleValue: (provided, state) => ({
        ...provided,
        display: 'flex',
        alignItems: 'center',
    }),
    control: (provided, state) => ({
        ...provided,
        border: state.isFocused && '2px solid rgb(153 27 27 / var(--tw-bg-opacity, 1))',
        boxShadow: state.isFocused ? '0 0 0 2px rgba(255,0,0,0.2)' : 'none',
        '&:hover': {
            border: '2px solid rgb(153 27 27 / var(--tw-bg-opacity, 1))',
        },
    }),
    dropdownIndicator: (provided, state) => ({
        ...provided,
        color: state.isFocused ? 'rgb(153 27 27 / var(--tw-bg-opacity, 1))' : 'black',
    }),
    indicatorSeparator: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? 'rgb(153 27 27 / var(--tw-bg-opacity, 1))' : 'black',
    }),
};
