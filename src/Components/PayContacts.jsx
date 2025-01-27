import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiStar, FiSearch, FiSend } from 'react-icons/fi';
import axios from 'axios';
const PaymentContacts = () => {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'John Doe', phone: '+1234567890', isFavorite: false },
    { id: 2, name: 'Jane Smith', phone: '+1987654321', isFavorite: true },
    { id: 3, name: 'Alice Johnson', phone: '+1122334455', isFavorite: false },
    { id: 4, name: 'Bob Brown', phone: '+5566778899', isFavorite: true },
  ]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [amount, setAmount] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const apiBaseUrl = `${import.meta.env.VITE_BACKEND}/api`  ; // Replace with your API base URL

  // Fetch contacts and recent transactions on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [contactsRes, transactionsRes] = await Promise.all([
          axios.get(`${apiBaseUrl}/contacts/get`),
          axios.get(`${apiBaseUrl}/transactions/get`),
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
    if (newContact.name && newContact.phone) {
      try {
        const res = await axios.post(`${apiBaseUrl}/contacts/add`, newContact);
        setContacts([...contacts, res.data]);
        setNewContact({ name: '', phone: '' });
        toast.success('Contact added successfully!');
      } catch (error) {
        console.error('Error adding contact:', error);
        toast.error('Failed to add contact. Please try again.');
      }
    } else {
      toast.error('Please provide valid details.');
    }
  };

  const handleSendMoney = async () => {
    if (!amount || selectedContacts.length === 0) {
      toast.error('Please enter an amount and select at least one contact.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${apiBaseUrl}/transactions/send`, {
        amount,
        contacts: selectedContacts,
      });
      setRecentTransactions([...res.data, ...recentTransactions]);
      setSelectedContacts([]);
      setAmount('');
      toast.success('Transaction successful!');
    } catch (error) {
      console.error('Error sending money:', error);
      toast.error('Failed to process transaction. Please try again.');
    } finally {
      setLoading(false);
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
      const contact = contacts.find((c) => c.id === contactId);
      const updatedContact = { ...contact, isFavorite: !contact.isFavorite };

      await axios.put(`${apiBaseUrl}/contacts/${contactId}`, updatedContact);
      setContacts((prevContacts) =>
        prevContacts.map((c) =>
          c.id === contactId ? updatedContact : c
        )
      );
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast.error('Failed to update favorite status. Please try again.');
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
  );
  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Pay Contacts</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-600 text-white hover:bg-gray-700"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* Add Contact */}
        <motion.div
          className="bg-gray-50 shadow-md rounded-lg p-6 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-medium mb-4">Add New Contact</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            />
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Phone Number"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
            <button
              onClick={handleAddContact}
              className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Add
            </button>
          </div>
        </motion.div>

        {/* Search and Contacts */}
        <div className="flex items-center space-x-2 mb-6">
          <FiSearch className="text-xl" />
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Contact List */}
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full">
                  {contact.name[0]}
                </div>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                </div>
              </div>
              <div className="flex space-x-4 items-center">
                <button
                  onClick={() => toggleFavorite(contact.id)}
                  className={`text-xl ${contact.isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
                >
                  <FiStar />
                </button>
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-500"
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => handleSelectContact(contact.id)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Amount and Send Button */}
        <motion.div
          className="bg-gray-50 shadow-md rounded-lg p-6 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-medium mb-4">Enter Amount</h3>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            onClick={handleSendMoney}
            className={`w-full py-2 text-white rounded-lg ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Send Money'}
          </button>
        </motion.div>

        {/* Recent Transactions */}
        <div className="mt-6">
          <h3 className="text-xl font-medium mb-4">Recent Transactions</h3>
          <ul>
            {recentTransactions.map((transaction, index) => (
              <li key={index} className="flex justify-between items-center py-2">
                <span>{transaction.name}</span>
                <span className="text-green-500 font-medium">₹{transaction.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentContacts;
