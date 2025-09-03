import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { toast } from "react-toastify";
import { transactionService } from "@/services/api/transactionService";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import ApperIcon from "@/components/ApperIcon";
import AddTransactionModal from "@/components/organisms/AddTransactionModal";
import TransactionRow from "@/components/molecules/TransactionRow";
import StatCard from "@/components/molecules/StatCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Farms from "@/components/pages/Farms";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Finances = () => {
  const [transactions, setTransactions] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [farmFilter, setFarmFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState("expense");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [transactionsData, farmsData, cropsData] = await Promise.all([
        transactionService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);
      
      setTransactions(transactionsData);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError("Failed to load financial data");
    } finally {
      setLoading(false);
    }
  };

const handleTransactionAdded = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleTransactionEdit = async (transaction) => {
    // For now, just log - in a full implementation, you'd open an edit modal
    console.log('Edit transaction:', transaction);
    // This would trigger AddTransactionModal in edit mode with pre-populated data
  };

  const handleTransactionDelete = async (transaction) => {
    if (window.confirm(`Are you sure you want to delete this ${transaction.type_c} transaction? This action cannot be undone.`)) {
      try {
        await transactionService.delete(transaction.Id);
        setTransactions(prev => prev.filter(t => t.Id !== transaction.Id));
        toast.success("Transaction deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete transaction");
      }
    }
  };

  const openAddModal = (type) => {
    setModalType(type);
    setShowAddModal(true);
  };

  const filteredTransactions = transactions.filter(transaction => {
const farm = farms.find(f => f.Id === transaction.farm_id_c);
    const crop = crops.find(c => c.Id === transaction.crop_id_c);
    
    const matchesSearch = (transaction.title_c || transaction.description_c || transaction.description)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.category_c || transaction.category).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farm?.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (crop?.type_c || crop?.type)?.toLowerCase().includes(searchTerm.toLowerCase());
const matchesType = typeFilter === "all" || (transaction.type_c || transaction.type) === typeFilter;
    const matchesFarm = farmFilter === "all" || transaction.farm_id_c === parseInt(farmFilter);
    
    return matchesSearch && matchesType && matchesFarm;
  });

  const getFinancialStats = () => {
const thisMonth = transactions.filter(t => {
const transactionDate = new Date(t.date_c || t.date);
      const isValidDate = transactionDate && !isNaN(transactionDate.getTime());
      return isValidDate && transactionDate >= startOfMonth(new Date()) && transactionDate <= endOfMonth(new Date());
    });

    const lastMonth = transactions.filter(t => {
      const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));
      const transactionDate = new Date(t.date_c || t.date);
      const isValidTransactionDate = transactionDate && !isNaN(transactionDate.getTime());
      if (!isValidTransactionDate) return 0;
      return transactionDate >= lastMonthStart && transactionDate <= lastMonthEnd;
    });

const thisMonthIncome = thisMonth.filter(t => (t.type_c || t.type) === "income").reduce((sum, t) => sum + (t.amount_c || t.amount), 0);
    const thisMonthExpenses = thisMonth.filter(t => (t.type_c || t.type) === "expense").reduce((sum, t) => sum + (t.amount_c || t.amount), 0);
    const lastMonthIncome = lastMonth.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const lastMonthExpenses = lastMonth.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

    const incomeChange = lastMonthIncome > 0 ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome * 100).toFixed(1) : 0;
    const expenseChange = lastMonthExpenses > 0 ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100).toFixed(1) : 0;

    return {
      thisMonthIncome,
      thisMonthExpenses,
      netIncome: thisMonthIncome - thisMonthExpenses,
      incomeChange: `${incomeChange >= 0 ? '+' : ''}${incomeChange}%`,
      expenseChange: `${expenseChange >= 0 ? '+' : ''}${expenseChange}%`,
      incomeTrend: incomeChange >= 0 ? "up" : "down",
      expenseTrend: expenseChange <= 0 ? "up" : "down" // Lower expenses are good
    };
  };

  const stats = getFinancialStats();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Finances</h1>
          <p className="text-gray-600">
            Track your farm income, expenses, and monitor financial performance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="accent"
            onClick={() => openAddModal("income")}
            size="md"
          >
            <ApperIcon name="TrendingUp" size={16} className="mr-2" />
            Add Income
          </Button>
          <Button 
            variant="secondary"
            onClick={() => openAddModal("expense")}
            size="md"
          >
            <ApperIcon name="TrendingDown" size={16} className="mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Monthly Income"
          value={`$${stats.thisMonthIncome.toFixed(2)}`}
          change={stats.incomeChange}
          trend={stats.incomeTrend}
          icon="TrendingUp"
          color="success"
        />
        <StatCard
          title="Monthly Expenses"
          value={`$${stats.thisMonthExpenses.toFixed(2)}`}
          change={stats.expenseChange}
          trend={stats.expenseTrend}
          icon="TrendingDown"
          color="error"
        />
        <StatCard
          title="Net Income"
          value={`$${stats.netIncome.toFixed(2)}`}
          icon="DollarSign"
          color={stats.netIncome >= 0 ? "success" : "error"}
          trend={stats.netIncome >= 0 ? "up" : "down"}
        />
        <StatCard
          title="Total Transactions"
          value={transactions.length}
          icon="Receipt"
          color="info"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </Select>

        <Select
          value={farmFilter}
          onChange={(e) => setFarmFilter(e.target.value)}
        >
          <option value="all">All Farms</option>
          {farms.map(farm => (
<option key={farm.Id} value={farm.Id}>
              {farm.Name}
            </option>
          ))}
        </Select>
      </div>

      {/* Transaction Summary by Category */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Categories */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Income by Category</h3>
            {(() => {
              const incomeByCategory = transactions
.filter(t => (t.type_c || t.type) === "income")
                .reduce((acc, t) => {
                  const category = t.category_c || t.category;
                  acc[category] = (acc[category] || 0) + (t.amount_c || t.amount);
                  return acc;
                }, {});

              return Object.keys(incomeByCategory).length === 0 ? (
                <p className="text-gray-500 text-center py-4">No income recorded yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(incomeByCategory)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, amount]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="success" size="sm">
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </Badge>
                        </div>
                        <span className="font-medium text-green-600">${amount.toFixed(2)}</span>
                      </div>
                    ))}
                </div>
              );
            })()}
          </Card>

          {/* Expense Categories */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
            {(() => {
const expensesByCategory = transactions
                .filter(t => (t.type_c || t.type) === "expense")
                .reduce((acc, t) => {
                  const category = t.category_c || t.category;
                  acc[category] = (acc[category] || 0) + (t.amount_c || t.amount);
                  return acc;
                }, {});

              return Object.keys(expensesByCategory).length === 0 ? (
                <p className="text-gray-500 text-center py-4">No expenses recorded yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(expensesByCategory)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, amount]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="error" size="sm">
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </Badge>
                        </div>
                        <span className="font-medium text-red-600">${amount.toFixed(2)}</span>
                      </div>
                    ))}
                </div>
              );
            })()}
          </Card>
        </div>
      )}

      {/* Transactions List */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          {filteredTransactions.length > 0 && (
            <Badge variant="info" size="md">
              {filteredTransactions.length} transactions
            </Badge>
          )}
        </div>
        
        {filteredTransactions.length === 0 ? (
          transactions.length === 0 ? (
            <Empty
              title="No financial records yet"
              message="Start tracking your farm's financial performance by recording your first income or expense transaction."
              buttonText="Add First Transaction"
              onAction={() => openAddModal("expense")}
              icon="DollarSign"
            />
          ) : (
            <Empty
              title="No transactions match your search"
              message="Try adjusting your search terms or filters to find the transactions you're looking for."
              icon="Search"
            />
          )
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredTransactions
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((transaction, index) => {
const farm = farms.find(f => f.Id === transaction.farm_id_c);
                const crop = crops.find(c => c.Id === transaction.crop_id_c);
                return (
                  <motion.div
                    key={transaction.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TransactionRow 
transaction={transaction} 
                      farm={farm} 
                      crop={crop}
                      onEdit={handleTransactionEdit}
                      onDelete={handleTransactionDelete}
                    />
                  </motion.div>
                );
              })}
          </motion.div>
        )}
      </Card>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onTransactionAdded={handleTransactionAdded}
        initialType={modalType}
      />
    </div>
  );
};

export default Finances;