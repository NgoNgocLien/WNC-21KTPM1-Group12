// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export const useCustomerStore = create(
//   persist(
//     (set) => ({
//       customers: [],
//       getAllCustomers: async () => {
//         const response = await fetch('');
//         const customers = await response.json();
//         set({ customers });
//       },
//       getCustomerById: async (id) => {
//         const response = await fetch('');
//         const customer = await response.json();
//         return customer;
//       },
//       addCustomer: async (customer) => {
//         const response = await fetch('', {
//           method: 'POST',
//           body: JSON.stringify(customer),
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         const newCustomer = await response.json();
//         set((state) => ({ customers: [...state.customers, newCustomer] }));
//       },
//       removeCustomer: async (id) => {
//         await fetch('', {
//           method: 'DELETE',
//           body: JSON.stringify({ id }),
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         set((state) => ({
//           customers: state.customers.filter((customer) => customer.id !== id),
//         }));
//       }
//     }),
//     {
//       name: 'customer-storage',
//       getStorage: () => sessionStorage
//     }
//   )
// );