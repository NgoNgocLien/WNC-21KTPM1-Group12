export const customSelectStyles = {
    option: (provided, state) => ({
        ...provided,
        display: 'flex',
        alignItems: 'center',
        padding: 10,
        marginBottom: 1,
        backgroundColor: state.isFocused
            ? '#f5f5f5'
            : state.isSelected
            ? 'rgb(255, 255, 255)' // Change this color as needed
            : 'white',
        color: state.isFocused ? 'rgb(185 28 28)' : 'black',
        '&:active': {
            backgroundColor: 'rgb(229, 231, 235)', // Change this color as needed
        },
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
        border: '1px solid rgb(209 213 219 / var(--tw-bg-opacity, 1))', 
        boxShadow: state.isFocused ? '0 0 0 2px rgba(255,0,0,0.2)' : 'none',
        position: 'relative', 
        borderRadius: '0.75rem',
        paddingTop: 4,
        paddingBottom: 4.5,
        transition: 'border-color 0s', 
        '&:hover::before': {
            content: '""',
            position: 'absolute',
            top: -1,
            right: -1,
            bottom: -1,
            left: -1,
            border: '2px solid rgb(153 27 27 / var(--tw-bg-opacity, 1))',
            borderRadius: 'inherit', 
            pointerEvents: 'none',
        },
        cursor: 'pointer',
        caretColor: 'transparent',
    }),
    placeholder: (provided, state) => ({
        ...provided,
        color: 'rgb(156 163 175)', 
        fontSize: '1rem',
        fontWeight: '400',

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