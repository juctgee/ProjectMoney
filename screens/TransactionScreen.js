import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const initialData = {
  January: [
    {
      id: "1",
      category: "Shopping",
      icon: "basket",
      amount: "-120",
      time: "10:00 AM",
      description: "Buy some grocery",
    },
    {
      id: "2",
      category: "Education",
      icon: "school",
      amount: "-13,000",
      time: "03:30 PM",
      description: "Tuition fees",
    },
  ],
  February: [
    {
      id: "1",
      category: "Food",
      icon: "fast-food",
      amount: "-32",
      time: "07:30 PM",
      description: "Buy a ramen",
    },
    {
      id: "2",
      category: "Salary",
      icon: "cash",
      amount: "+5000",
      time: "04:30 PM",
      description: "Salary for February",
    },
  ],
};

const handleSubmitTransaction = () => {
  // ส่งข้อมูลไปที่ BudgetScreen
  navigation.navigate('BudgetScreen', {
    transactionData: transactionData,
  });
};
const TransactionScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [updatedTransaction, setUpdatedTransaction] = useState({
    category: "",
    amount: "",
    time: "",
    description: "",
  });
  const [newTransaction, setNewTransaction] = useState({
    category: "",
    amount: "",
    time: "",
    description: "",
  });
  const [transactionData, setTransactionData] = useState(initialData);
  const [todayTransaction, setTodayTransaction] = useState([
    {
      id: "1",
      category: "Food",
      icon: "fast-food",
      amount: "-15",
      time: "10:00 AM",
      description: "Coffee",
    },
  ]);
  const [yesterdayTransaction, ] = useState([
    {
      id: "",
      category: "",
      icon: "",
      amount: "",
      time: "",
      description: "",
    },
  ]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (selectedTransaction) {
      setUpdatedTransaction({
        category: selectedTransaction.category,
        amount: selectedTransaction.amount,
        time: selectedTransaction.time,
        description: selectedTransaction.description,
      });
    }
  }, [selectedTransaction]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={30} color="#fff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.categoryText}>{item.category}</Text>
        <Text style={styles.descriptionText}>{item.description}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text
          style={
            item.amount.startsWith("+")
              ? styles.amountPositive
              : styles.amountNegative
          }
        >
          {item.amount}
        </Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setSelectedTransaction(item);
            setShowEditModal(true);
          }}
        >
          <Ionicons name="create" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTransaction(item.id)}
        >
          <Ionicons name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  
  const handleEditSave = () => {
    if (selectedTransaction) {
      const updatedData = transactionData[selectedMonth].map((transaction) => {
        if (transaction.id === selectedTransaction.id) {
          return {
            ...transaction,
            category: updatedTransaction.category,
            amount: updatedTransaction.amount,
            time: updatedTransaction.time,
            description: updatedTransaction.description,
          };
        }
        return transaction;
      });

      setTransactionData((prevData) => ({
        ...prevData,
        [selectedMonth]: updatedData,
      }));

      alert("Transaction Updated");
      setShowEditModal(false);
    }
  };

  const handleAddTransaction = () => {
    const newTransactionData = {
      ...newTransaction,
      id: (transactionData[selectedMonth].length + 1).toString(),
      time: "10:00 AM",
    };

    // Add the new transaction to todayTransaction array
    setTodayTransaction((prevTodayTransactions) => [
      ...prevTodayTransactions,
      newTransactionData,
    ]);

    // Add the new transaction to the current month's transaction data
    setTransactionData((prevData) => ({
      ...prevData,
      [selectedMonth]: [...prevData[selectedMonth], newTransactionData],
    }));

    alert("Transaction Added");
    setShowAddModal(false);
  };

  const handleDeleteTransaction = (transactionId) => {
    const updatedData = transactionData[selectedMonth].filter(
      (transaction) => transaction.id !== transactionId
    );
    const updatedTodayTransaction = transactionData[selectedMonth].filter(
      (transaction) => transaction.id !== transactionId
    );

    setTransactionData((prevData) => ({
      ...prevData,
      [selectedMonth]: updatedData,
    }));

    setTodayTransaction(updatedTodayTransaction);

    alert("Transaction Deleted");
  };

  // Separate transactions into positive and negative amounts
  const getSortedTransactions = (transactions) => {
    const negativeTransactions = transactions.filter((transaction) =>
      transaction.amount.startsWith("-")
    );
    const positiveTransactions = transactions.filter((transaction) =>
      transaction.amount.startsWith("+")
    );

    return [...negativeTransactions, ...positiveTransactions];
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setShowModal(false); // ปิด modal หลังจากเลือกเดือน
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.monthSelector}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.monthText}>{selectedMonth}</Text>
          <Ionicons name="chevron-down" size={20} color="#6a0dad" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Month</Text>
            <ScrollView style={styles.scrollView}>
              {months.map((month, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.monthItem}
                  onPress={() => handleMonthSelect(month)} // เรียกใช้ฟังก์ชันนี้เมื่อเลือกเดือน
                >
                  <Text style={styles.monthText}>{month}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType="slide"
        visible={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Edit Transaction</Text>

            <TextInput
              style={styles.input}
              placeholder="Category"
              value={updatedTransaction.category}
              onChangeText={(text) =>
                setUpdatedTransaction({ ...updatedTransaction, category: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={updatedTransaction.amount}
              onChangeText={(text) =>
                setUpdatedTransaction({ ...updatedTransaction, amount: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={updatedTransaction.description}
              onChangeText={(text) =>
                setUpdatedTransaction({
                  ...updatedTransaction,
                  description: text,
                })
              }
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleEditSave}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType="slide"
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add New Transaction</Text>

            <TextInput
              style={styles.input}
              placeholder="Category"
              value={newTransaction.category}
              onChangeText={(text) =>
                setNewTransaction({ ...newTransaction, category: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={newTransaction.amount}
              onChangeText={(text) =>
                setNewTransaction({ ...newTransaction, amount: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newTransaction.description}
              onChangeText={(text) =>
                setNewTransaction({ ...newTransaction, description: text })
              }
            />

            {/* Add Date and Time Fields */}
            <TextInput
              style={styles.input}
              placeholder="Date (e.g., 2025-02-05)"
              value={newTransaction.date}
              onChangeText={(text) =>
                setNewTransaction({ ...newTransaction, date: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Time (e.g., 10:00 AM)"
              value={newTransaction.time}
              onChangeText={(text) =>
                setNewTransaction({ ...newTransaction, time: text })
              }
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddTransaction}
            >
              <Text style={styles.saveButtonText}>Add Transaction</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.sectionHeader}>Today</Text>
      <FlatList
        data={todayTransaction}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <Text style={styles.sectionHeader}>Yesterday</Text>
      <FlatList
        data={yesterdayTransaction}
        keyExtractor={(item) => item.id}
      />

      <Text style={styles.sectionHeader}>Transactions for {selectedMonth}</Text>
      <FlatList
        data={getSortedTransactions(transactionData[selectedMonth])}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+ Add Transaction</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f7f7f7",
  },
  headerContainer: {
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthText: {
    fontSize: 18,
    color: "#6a0dad",
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  scrollView: {
    height: 200,
  },
  monthItem: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#6a0dad",
    paddingVertical: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: "#6a0dad",
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 20,
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: "#6a0dad",
    borderRadius: 25,
    padding: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  descriptionText: {
    fontSize: 14,
    color: "#777",
  },
  amountContainer: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  amountPositive: {
    fontSize: 16,
    color: "green",
  },
  amountNegative: {
    fontSize: 16,
    color: "red",
  },
  timeText: {
    fontSize: 12,
    color: "#777",
  },
  actionButtons: {
    flexDirection: "row",
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: "#6a0dad",
    padding: 5,
    marginRight: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    padding: 5,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#6a0dad",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default TransactionScreen;
