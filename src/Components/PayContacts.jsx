import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiStar, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import Razorpay from 'razorpay';
import { useAuth } from "../context/AuthContext";

const PaymentContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    userId: '',    
    userUpi: '',    
  });
  const [amount, setAmount] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
    const [bankData, setBankData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("wallet"); // 🔥 Added this line

  const { user } = useAuth();
  useEffect(() => {
    const userId = user?._id || localStorage.getItem("userId");
  
    setNewContact((prev) => ({
      ...prev,
      userId,
      userUpi: user?.upiId,
    }));
  }, [user, bankData]);
  
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [contactsRes] = await Promise.all([
          axios.get(`https://${import.meta.env.VITE_BACKEND}/api/contacts`),
        ]);
        setContacts(contactsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data. Please try again.');
      }
    };
    fetchInitialData();
  }, []);

  const handleAddContact = async () => {
    const { name, phone, userId, userUpi } = newContact;
  
    if (!name || !phone || !userId || !userUpi) {
      toast.error('Please fill all contact details.');
      return;
    }
  
    try {
      const res = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/addcontacts`, {
        name,
        phone,
        userId,
        userUpi,
      });
      setContacts([...contacts, res.data]);
      setNewContact({ name: '', phone: '', userId: '', userUpi: '' }); // reset form
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

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );
  const handleSendMoney = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    if (selectedContacts.length === 0) {
      toast.error('Please select at least one contact.');
      return;
    }

    try {
      setLoading(true);

      if (paymentMethod === "wallet") {
        const res = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/contacts/send-money`, {
          userId: user?._id || localStorage.getItem("userId"),
          amount: Number(amount),
          paymentMethod: "wallet",
          contacts: selectedContacts
        });

        if (res.data.message === "Amount sent successfully") {
          toast.success("Amount sent from wallet successfully!");
          setAmount('');
          setSelectedContacts([]);
        } else {
          toast.error("Wallet transaction failed.");
        }
      } else if (paymentMethod === "razorpay") {
        const res = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/contacts/send-money`, {
          userId: user?._id || localStorage.getItem("userId"),
          amount: Number(amount),
          paymentMethod: "razorpay",
          contacts: selectedContacts
        });

        const { orderId, amount: orderAmount, currency } = res.data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderAmount * 100,
          currency,
          name: "PayManni",
          description: "Send Money to Contacts",
          order_id: orderId,
          handler: async function (response) {
            try {
              const verifyRes = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/contacts/verify-payment`, {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes.data.message === "Payment verified successfully") {
                toast.success("Payment via Razorpay successful!");
                setAmount('');
                setSelectedContacts([]);
              } else {
                toast.error("Payment verification failed.");
              }
            } catch (error) {
              console.error("Verification error:", error);
              toast.error("Payment verification failed.");
            }
          },
          prefill: {
            name: user?.name || "User",
            email: user?.email || "user@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#6366f1",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error("Invalid payment method selected.");
      }

    } catch (error) {
      console.error('Send money error:', error);
      toast.error("Transaction failed.");
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="dark:bg-gray-900 dark:text-white min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl font-bold text-indigo-500 mb-8">Pay Contacts</h2>

        {/* Add Contact Section */}
        <motion.div
          className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Add New Contact</h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            />
            <input
              type="text"
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="Phone Number"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
          <input
    type="text"
    placeholder="User ID"
    value={newContact.userId}
    readOnly
    className="bg-gray-700 text-gray-400 px-4 py-2 rounded-md w-fit min-w-[120px] max-w-xs truncate border border-gray-600"
  />

  <input
    type="text"
    placeholder="User UPI"
    value={newContact.userUpi}
    readOnly
    className="bg-gray-700 text-gray-400 px-4 py-2 rounded-md w-fit min-w-[120px] max-w-xs truncate border border-gray-600"
  />
            <button
              onClick={handleAddContact}
              className="px-4 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
            >
              Add
            </button>
          </div>
        </motion.div>

        {/* Search Contacts */}
        <div className="flex items-center space-x-4 mb-8">
          <FiSearch className="text-xl text-gray-400" />
          <input
            type="text"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Contact List */}
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact._id}
              className="flex justify-between items-center p-4 bg-gray-700 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-indigo-500 text-white rounded-full text-lg font-semibold">
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
            </motion.div>
          ))}
        </div>

        {/* Payment Options & Amount Input */}
        <motion.div
          className="bg-gray-800 shadow-lg rounded-lg p-6 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-medium mb-4">Enter Amount & Choose Payment Method</h3>
          
          <input
            type="number"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 mb-4"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* 🔥 Payment Method Selection */}
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="wallet">Wallet</option>
            <option value="razorpay">Razorpay</option>
          </select>

          <button
            onClick={handleSendMoney}
            className={`w-full py-3 mt-4 text-white rounded-lg ${
              loading ? 'bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Send Money'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentContacts;