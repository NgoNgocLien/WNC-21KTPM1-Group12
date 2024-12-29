import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Select from 'react-select';

import banks from "../../util/banks";

export default function ExternalBankSelect({formik}) {
    return (
        <div className="w-full flex bg-white rounded-xl justify-between">
            <div className="w-3/12 font-semibold">
                Đến ngân hàng
            </div>
            <div className="w-7/12 flex flex-col font-semibold space-y-4">
                <Select
                    name="id_recipient_bank"
                    // placeholder="Chọn ngân hàng đến"
                    value={bankOptions.find(option => option.value === formik.values.id_recipient_bank)}
                    onChange={(option) => {
                        formik.setFieldValue('id_recipient_bank', option.value);
                    }}
                    options={bankOptions}
                    styles={customStyles}
                    // className="w-full flex-1 bg-white p-2 text-base text-gray-900 placeholder:test-base placeholder:text-gray-400 focus:outline focus:outline-0 text-md"
                    />
            </div>
        </div>
    );
}

const bankOptions = banks
    .filter(bank => bank.bank_name !== 'NoMeoBank')
    .map(bank => ({
        value: bank.bank_id,
        label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
            src={bank.brand_logo}
            alt="Bank Logo"
            style={{ width: 20, height: 20, borderRadius: '50%', marginRight: 10 }}
            />
            {bank.bank_name}
        </div>
    ),
  }));

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        display: 'flex',
        alignItems: 'center',
        padding: 10,
        backgroundColor: state.isFocused ? '#f5f5f5' : 'white',
        color: 'black',
        borderRadius: '20px'
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
