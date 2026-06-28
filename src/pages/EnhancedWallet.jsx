import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaWallet, 
  FaPlus, 
  FaArrowUp, 
  FaArrowDown, 
  FaCreditCard,
  FaQrcode,
  FaHistory,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaShieldAlt,
  FaGift
} from 'react-icons/fa';
import { MdAccountBalance, MdTrendingUp, MdSecurity } from 'react-icons/md';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../Components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/Card';
import { getAuthHeaders, getApiBase, getUserId } from '../utils/authStorage';
import { isCreditTransaction, formatCurrency as fmtCurrency } from '../utils/format';
import SpendingChart from '../Components/charts/SpendingChart';

const EnhancedWallet = () => {
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [allTransactions, setAllTransactions] = useState([]);
  const [monthStats, setMonthStats] = useState({ spent: 0, received: 0, count: 0, growth: 0 });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Sample data for demonstration
  const balanceHistory = [
    { name: 'Mon', balance: 2400 },
    { name: 'Tue', balance: 2210 },
    { name: 'Wed', balance: 2800 },
    { name: 'Thu', balance: 2580 },
    { name: 'Fri', balance: 3200 },
    { name: 'Sat', balance: 3100 },
    { name: 'Sun', balance: 3350 }
  ];

  const quickActions = [
    {
      title: 'Add Money',
      subtitle: 'Bank transfer, UPI',
      icon: <FaPlus />,
      color: 'from-green-500 to-emerald-600',
      action: () => setShowAddMoney(true)
    },
    {
      title: 'Withdraw',
      subtitle: 'To bank account',
      icon: <FaArrowDown />,
      color: 'from-rose-500 to-red-600',
      action: () => setShowWithdraw(true)
    },
    {
      title: 'Send Money',
      subtitle: 'To contacts, mobile',
      icon: <FaArrowUp />,
      color: 'from-blue-500 to-cyan-600',
      action: () => navigate('/transfer')
    },
    {
      title: 'Pay Bills',
      subtitle: 'Utilities, recharge',
      icon: <FaCreditCard />,
      color: 'from-purple-500 to-pink-600',
      action: () => navigate('/pay-bills')
    },
    {
      title: 'QR Pay',
      subtitle: 'Scan & pay instantly',
      icon: <FaQrcode />,
      color: 'from-orange-500 to-red-500',
      action: () => navigate('/qr-scanner')
    }
  ];

  const offers = [
    {
      title: 'Cashback Offer',
      description: 'Get 5% cashback on bill payments',
      validTill: '31 Dec 2024',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Friend Referral',
      description: 'Refer friends and earn ₹100',
      validTill: 'Limited time',
      gradient: 'from-pink-400 to-red-500'
    }
  ];

  useEffect(() => {
    fetchWalletData();
  }, [user]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      
      if (!userId) {
        navigate('/login-user');
        return;
      }

      // Fetch user account details
      const response = await axios.get(
        `${getApiBase()}/api/myaccount/${userId}`,
        { headers: getAuthHeaders() }
      );

      setWalletData({
        balance: response.data.balance || 0,
        accountType: 'Premium',
        accountNumber: `PAYM${userId.slice(-6).toUpperCase()}`,
        isVerified: true
      });

      try {
        const txRes = await axios.get(
          `${getApiBase()}/api/transactions/all`,
          { headers: getAuthHeaders() }
        );
        const allTxns = txRes.data.transactions || txRes.data || [];
        setAllTransactions(allTxns);

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        const thisMonth = allTxns.filter((t) => new Date(t.createdAt || t.timestamp || t.date) >= monthStart);
        const prevMonth = allTxns.filter((t) => {
          const d = new Date(t.createdAt || t.timestamp || t.date);
          return d >= prevMonthStart && d <= prevMonthEnd;
        });

        const spent = thisMonth.filter((t) => !isCreditTransaction(t)).reduce((s, t) => s + Math.abs(Number(t.amount) || 0), 0);
        const received = thisMonth.filter((t) => isCreditTransaction(t)).reduce((s, t) => s + Math.abs(Number(t.amount) || 0), 0);
        const prevSpent = prevMonth.filter((t) => !isCreditTransaction(t)).reduce((s, t) => s + Math.abs(Number(t.amount) || 0), 0);
        const growth = prevSpent > 0 ? ((spent - prevSpent) / prevSpent) * 100 : 0;

        setMonthStats({ spent, received, count: thisMonth.length, growth });

        const txns = allTxns.slice(0, 10).map((t, i) => ({
          id: t._id || t.id || i,
          type: isCreditTransaction(t) ? 'credit' : 'debit',
          amount: Math.abs(t.amount || 0),
          description: t.description || t.note || t.category || 'Transaction',
          timestamp: t.createdAt || t.date || new Date(),
          status: t.status || 'completed'
        }));
        setTransactions(txns);
      } catch {
        setTransactions([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to load wallet data');
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const amount = parseFloat(addAmount);
    const userId = getUserId();

    try {
      const response = await axios.post(
        `${getApiBase()}/api/deposit`,
        { amount, userId },
        { headers: getAuthHeaders() }
      );

      if (response.data.walletBalance !== undefined) {
        setWalletData(prev => ({
          ...prev,
          balance: response.data.walletBalance
        }));
        setTransactions(prev => [{
          id: Date.now(),
          type: 'credit',
          amount,
          description: 'Added money to wallet',
          timestamp: new Date(),
          status: 'completed'
        }, ...prev]);
        setAddAmount('');
        setShowAddMoney(false);
        toast.success(`₹${amount} added successfully!`);
      } else {
        toast.error('Deposit failed. Please try again.');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error(error.response?.data?.message || 'Failed to add money');
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    const userId = getUserId();

    if (amount > (walletData?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      const response = await axios.post(
        `${getApiBase()}/api/withdraw`,
        { amount, userId },
        { headers: getAuthHeaders() }
      );

      const newBalance = response.data.walletBalance ?? response.data.balance;
      if (newBalance !== undefined) {
        setWalletData((prev) => ({ ...prev, balance: newBalance }));
        setTransactions((prev) => [{
          id: Date.now(),
          type: 'debit',
          amount,
          description: 'Withdrawn to bank',
          timestamp: new Date(),
          status: 'completed',
        }, ...prev]);
        setWithdrawAmount('');
        setShowWithdraw(false);
        toast.success(`₹${amount} withdrawn successfully!`);
        fetchWalletData();
      } else {
        toast.error('Withdrawal failed. Please try again.');
      }
    } catch (error) {
      console.error('Withdraw error:', error);
      toast.error(error.response?.data?.message || 'Failed to withdraw');
    }
  };

  const formatCurrency = (amount) => fmtCurrency(amount);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your wallet...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 pt-20">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wallet</h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
                <FaShieldAlt className="text-green-600 dark:text-green-400 text-sm" />
                <span className="text-green-700 dark:text-green-300 text-sm font-medium">Verified</span>
              </div>
              <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full">
                <FaStar className="text-yellow-600 dark:text-yellow-400 text-sm" />
                <span className="text-yellow-700 dark:text-yellow-300 text-sm font-medium">Premium</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Account: {walletData?.accountNumber}</p>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-blue-100 mb-2 flex items-center">
                    <FaWallet className="mr-2" />
                    Available Balance
                  </p>
                  <div className="flex items-center space-x-3">
                    <motion.h2
                      className="text-4xl font-bold"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                      {balanceVisible 
                        ? formatCurrency(walletData?.balance || 0)
                        : '••••••'
                      }
                    </motion.h2>
                    <button
                      onClick={() => setBalanceVisible(!balanceVisible)}
                      className="text-blue-200 hover:text-white transition-colors"
                    >
                      {balanceVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center justify-end mb-2 ${monthStats.growth >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    <MdTrendingUp className={`mr-1 ${monthStats.growth < 0 ? 'rotate-180' : ''}`} />
                    <span className="text-sm">{monthStats.growth >= 0 ? '+' : ''}{monthStats.growth.toFixed(1)}%</span>
                  </div>
                  <p className="text-blue-200 text-sm">vs last month</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                <div className="text-center">
                  <p className="text-2xl font-bold">{formatCurrency(monthStats.spent)}</p>
                  <p className="text-blue-200 text-sm">Spent this month</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{formatCurrency(monthStats.received)}</p>
                  <p className="text-blue-200 text-sm">Received</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{monthStats.count}</p>
                  <p className="text-blue-200 text-sm">Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                className={`bg-gradient-to-br ${action.color} p-6 rounded-2xl text-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300`}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="text-2xl mb-3">{action.icon}</div>
                <h4 className="font-semibold mb-1">{action.title}</h4>
                <p className="text-sm opacity-90">{action.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Weekly spending</CardTitle>
            </CardHeader>
            <CardContent>
              <SpendingChart transactions={allTransactions} dark={false} />
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FaHistory className="mr-2 text-blue-600" />
                    Recent Transactions
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/transactions')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'credit' 
                            ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'credit' ? <FaArrowDown /> : <FaArrowUp />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(transaction.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {transaction.status}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Offers & Security */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {/* Offers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaGift className="mr-2 text-pink-600" />
                  Special Offers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {offers.map((offer, index) => (
                  <motion.div
                    key={index}
                    className={`bg-gradient-to-r ${offer.gradient} p-4 rounded-xl text-white`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <h4 className="font-semibold mb-1">{offer.title}</h4>
                    <p className="text-sm opacity-90 mb-2">{offer.description}</p>
                    <p className="text-xs opacity-75">Valid till: {offer.validTill}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MdSecurity className="mr-2 text-green-600" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-Factor Authentication</span>
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <HiSparkles className="text-white text-xs" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">PIN Protection</span>
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <HiSparkles className="text-white text-xs" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Device Security</span>
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <HiSparkles className="text-white text-xs" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Add Money Modal */}
        <AnimatePresence>
          {showAddMoney && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddMoney(false)}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add Money</h3>
                  <button
                    onClick={() => setShowAddMoney(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Quick amount buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {[500, 1000, 2000].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setAddAmount(amount.toString())}
                        className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleAddMoney}
                    className="w-full"
                    disabled={!addAmount || parseFloat(addAmount) <= 0}
                  >
                    <HiLightningBolt className="mr-2" />
                    Add Money Instantly
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddMoney(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showWithdraw && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWithdraw(false)}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Withdraw</h3>
                  <button
                    onClick={() => setShowWithdraw(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Available: {formatCurrency(walletData?.balance || 0)}
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount to withdraw
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleWithdraw}
                    className="w-full bg-gradient-to-r from-rose-500 to-red-600"
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                  >
                    Withdraw to Bank
                  </Button>
                  <Button variant="outline" onClick={() => setShowWithdraw(false)} className="w-full">
                    Cancel
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default EnhancedWallet;