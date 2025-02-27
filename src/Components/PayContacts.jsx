// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';
// import { FiStar, FiSearch, FiSend } from 'react-icons/fi';
// import axios from 'axios';

// const PaymentContacts = () => {
//   const [contacts, setContacts] = useState([]);
//   const [newContact, setNewContact] = useState({ name: '', phone: '' });
//   const [amount, setAmount] = useState('');
//   const [selectedContacts, setSelectedContacts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [recentTransactions, setRecentTransactions] = useState([]);


//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const [contactsRes, transactionsRes] = await Promise.all([
//           axios.get(`https://${import.meta.env.VITE_BACKEND}/contacts/get`),
//           axios.get(`https://${import.meta.env.VITE_BACKEND}/transactions/get`),
//         ]);
//         setContacts(contactsRes.data);
//         setRecentTransactions(transactionsRes.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         toast.error('Failed to load data. Please try again.');
//       }
//     };

//     fetchInitialData();
//   }, []);

//   const handleAddContact = async () => {
//     if (newContact.name && newContact.phone) {
//       try {
//         const res = await axios.post(`https://${import.meta.env.VITE_BACKEND}/contacts/add`, newContact);
//         setContacts([...contacts, res.data]);
//         setNewContact({ name: '', phone: '' });
//         toast.success('Contact added successfully!');
//       } catch (error) {
//         console.error('Error adding contact:', error);
//         toast.error('Failed to add contact. Please try again.');
//       }
//     } else {
//       toast.error('Please provide valid details.');
//     }
//   };

//   const handleSendMoney = async () => {
//     if (!amount || selectedContacts.length === 0) {
//       toast.error('Please enter an amount and select at least one contact.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const parsedAmount = parseFloat(amount); // Convert to number
//       if (isNaN(parsedAmount) || parsedAmount <= 0) {
//         toast.error('Please enter a valid amount.');
//         return;
//       }

//       const paymentMethod = "creditCard";  // Or dynamically based on user selection
//       const userId = "userId_value";      // Replace with actual user ID

//       const res = await axios.post(`https://${import.meta.env.VITE_BACKEND}/transactions/send`, {
//         amount: parsedAmount,
//         contacts: selectedContacts,
//         paymentMethod: paymentMethod,
//         userId: userId,
//       });

//       setRecentTransactions([...res.data, ...recentTransactions]);
//       setSelectedContacts([]);
//       setAmount('');
//       toast.success('Transaction successful!');
//     } catch (error) {
//       console.error('Error sending money:', error);
//       toast.error('Failed to process transaction. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectContact = (contactId) => {
//     setSelectedContacts((prevSelected) =>
//       prevSelected.includes(contactId)
//         ? prevSelected.filter((id) => id !== contactId)
//         : [...prevSelected, contactId]
//     );
//   };

//   const toggleFavorite = async (contactId) => {
//     try {
//       const contact = contacts.find((c) => c.id === contactId);
//       const updatedContact = { ...contact, isFavorite: !contact.isFavorite };

//       await axios.put(`https://${import.meta.env.VITE_BACKEND}/contacts/${contactId}`, updatedContact);
//       setContacts((prevContacts) =>
//         prevContacts.map((c) =>
//           c.id === contactId ? updatedContact : c
//         )
//       );
//     } catch (error) {
//       console.error('Error updating favorite status:', error);
//       toast.error('Failed to update favorite status. Please try again.');
//     }
//   };

//   const filteredContacts = contacts.filter(
//     (contact) =>
//       contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       contact.phone.includes(searchQuery)
//   );

//   return (
//     <div className="dark:bg-gray-800 dark:text-white min-h-screen">
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-semibold text-indigo-600">Pay Contacts</h2>
//         </div>

//         {/* Add Contact */}
//         <motion.div
//           className="bg-gray-900 shadow-lg rounded-lg p-6 mb-6"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//         >
//           <h3 className="text-lg font-medium mb-4">Add New Contact</h3>
//           <div className="flex items-center space-x-4">
//             <input
//               type="text"
//               className="w-full p-3 border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
//               placeholder="Name"
//               value={newContact.name}
//               onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
//             />
//             <input
//               type="text"
//               className="w-full p-3 border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
//               placeholder="Phone Number"
//               value={newContact.phone}
//               onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
//             />
//             <button
//               onClick={handleAddContact}
//               className="p-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
//             >
//               Add
//             </button>
//           </div>
//         </motion.div>

//         {/* Search and Contacts */}
//         <div className="flex items-center space-x-4 mb-8">
//           <FiSearch className="text-xl text-gray-400" />
//           <input
//             type="text"
//             className="w-full p-3 border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
//             placeholder="Search contacts..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {/* Contact List */}
//         <div className="space-y-4">
//           {filteredContacts.map((contact) => (
//             <div
//               key={contact._id}
//               className="flex justify-between items-center p-4 bg-gray-700 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
//             >
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center justify-center w-12 h-12 bg-indigo-500 text-white rounded-full">
//                   {contact.name[0]}
//                 </div>
//                 <div>
//                   <p className="font-medium">{contact.name}</p>
//                   <p className="text-sm text-gray-400">{contact.phone}</p>
//                 </div>
//               </div>
//               <div className="flex space-x-4 items-center">
//                 <button
//                   onClick={() => toggleFavorite(contact._id)}
//                   className={`text-xl ${contact.isFavorite ? 'text-yellow-500' : 'text-gray-500'}`}
//                 >
//                   <FiStar />
//                 </button>
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-5 w-5 text-indigo-500"
//                   checked={selectedContacts.includes(contact._id)}
//                   onChange={() => handleSelectContact(contact._id)}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Amount and Send Button */}
//         <motion.div
//           className="bg-gray-900 shadow-lg rounded-lg p-6 mt-8"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//         >
//           <h3 className="text-lg font-medium mb-4">Enter Amount</h3>
//           <input
//             type="number"
//             className="w-full p-3 border border-gray-700 rounded-lg mb-4 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
//             placeholder="Amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />
//           <button
//             onClick={handleSendMoney}
//             className={`w-full py-3 text-white rounded-lg ${loading ? 'bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
//             disabled={loading}
//           >
//             {loading ? 'Processing...' : 'Send Money'}
//           </button>
//         </motion.div>

//         {/* Recent Transactions */}
//         <div className="mt-8">
//           <h3 className="text-xl font-medium mb-4">Recent Transactions</h3>
//           <ul className="space-y-4">
//             {recentTransactions.map((transaction, index) => (
//               <li
//                 key={index}
//                 className="flex justify-between items-center py-4 px-6 bg-gray-700 rounded-lg shadow-md"
//               >
//                 <div>
//                   <p className="font-medium">{transaction.contacts[0]?.name}</p>
//                   <p className="text-sm text-gray-400">{transaction.contacts[0]?.phone}</p>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="text-gray-400">{transaction.paymentMethod}</span>
//                   <span className="ml-4 text-green-400 font-medium">₹{transaction.amount}</span>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentContacts;
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiStar, FiSearch, FiSend } from 'react-icons/fi';
import axios from 'axios';
import Razorpay from 'razorpay';

const PaymentContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [amount, setAmount] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [contactsRes, transactionsRes] = await Promise.all([
          axios.get(`https://${import.meta.env.VITE_BACKEND}/api/contacts`),
          axios.get(`https://${import.meta.env.VITE_BACKEND}/api/transactions`),
        ]);
        setContacts(contactsRes.data);
        setRecentTransactions(transactionsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data. Please try again.');
      }
    };
    fetchInitialData();
  }, []);

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Please enter valid details.');
      return;
    }

    try {
      const res = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/contacts`, newContact);
      setContacts([...contacts, res.data]);
      setNewContact({ name: '', phone: '' });
      toast.success('Contact added successfully!');
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('Failed to add contact.');
    }
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(contactId)
        ? prevSelected.filter((id) => id !== contactId)
        : [...prevSelected, contactId]
    );
  };

  const toggleFavorite = async (contactId) => {
    try {
      const contact = contacts.find((c) => c._id === contactId);
      const updatedContact = { isFavorite: !contact.isFavorite };

      await axios.put(`https://${import.meta.env.VITE_BACKEND}/api/contacts/${contactId}`, updatedContact);
      setContacts((prevContacts) =>
        prevContacts.map((c) => (c._id === contactId ? { ...c, isFavorite: !c.isFavorite } : c))
      );
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Failed to update favorite.');
    }
  };

  const handleSendMoney = async () => {
    if (!amount || selectedContacts.length === 0) {
      toast.error('Enter an amount and select at least one contact.');
      return;
    }

    setLoading(true);
    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        toast.error('Enter a valid amount.');
        return;
      }

      // Step 1: Create an order
      const response = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/send-money`, {
        userId: "user_123", // Replace with actual user ID
        amount: parsedAmount,
        paymentMethod: "razorpay",
        contacts: selectedContacts,
      });

      if (response.data.success) {
        handlePayment(response.data.orderId, parsedAmount);
      } else {
        toast.error('Error creating payment.');
      }
    } catch (error) {
      console.error('Error sending money:', error);
      toast.error('Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (orderId, amount) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "PayManni",
      description: "Payment for Order",
      order_id: orderId,
      handler: function (response) {
        verifyPayment(response);
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const verifyPayment = async (paymentResponse) => {
    try {
      const response = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/verify-payment`, paymentResponse);

      if (response.data.success) {
        toast.success('Payment successful!');
      } else {
        toast.error('Payment verification failed.');
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error('Error verifying payment.');
    }
  };
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );


  
  return (
    <div className="dark:bg-gray-800 dark:text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-indigo-600">Pay Contacts</h2>
        </div>

        {/* Add Contact */}
        <motion.div
          className="bg-gray-900 shadow-lg rounded-lg p-6 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-medium mb-4">Add New Contact</h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              className="w-full p-3 border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            />
            <input
              type="text"
              className="w-full p-3 border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
              placeholder="Phone Number"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
            <button
              onClick={handleAddContact}
              className="p-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
            >
              Add
            </button>
          </div>
        </motion.div>

        {/* Search and Contacts */}
        <div className="flex items-center space-x-4 mb-8">
          <FiSearch className="text-xl text-gray-400" />
          <input
            type="text"
            className="w-full p-3 border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Contact List */}
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact._id}
              className="flex justify-between items-center p-4 bg-gray-700 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-500 text-white rounded-full">
                  {contact.name[0]}
                </div>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-400">{contact.phone}</p>
                </div>
              </div>
              <div className="flex space-x-4 items-center">
                <button
                  onClick={() => toggleFavorite(contact._id)}
                  className={`text-xl ${contact.isFavorite ? 'text-yellow-500' : 'text-gray-500'}`}
                >
                  <FiStar />
                </button>
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-500"
                  checked={selectedContacts.includes(contact._id)}
                  onChange={() => handleSelectContact(contact._id)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Amount and Send Button */}
        <motion.div
          className="bg-gray-900 shadow-lg rounded-lg p-6 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-medium mb-4">Enter Amount</h3>
          <input
            type="number"
            className="w-full p-3 border border-gray-700 rounded-lg mb-4 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
  onClick={handleSendMoney}
  className={`w-full py-3 text-white rounded-lg ${loading ? 'bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
  disabled={loading}
>
  {loading ? 'Processing...' : 'Send Money'}
</button>

        </motion.div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <h3 className="text-xl font-medium mb-4">Recent Transactions</h3>
          <ul className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-4 px-6 bg-gray-700 rounded-lg shadow-md"
              >
                <div>
                  <p className="font-medium">{transaction.contacts[0]?.name}</p>
                  <p className="text-sm text-gray-400">{transaction.contacts[0]?.phone}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400">{transaction.paymentMethod}</span>
                  <span className="ml-4 text-green-400 font-medium">₹{transaction.amount}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentContacts;
