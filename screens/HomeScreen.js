import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Modal, TextInput, Image, PermissionsAndroid, Alert } from 'react-native';
import { LineChart } from 'react-native-svg-charts';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [selectedTab, setSelectedTab] = useState('Today');
  const [savingsData, setSavingsData] = useState({
    Today: [],
    Week: [],
    Month: [],
    Year: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ label: '', amount: '', time: '' });
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const data = savingsData[selectedTab].map((item) => item.amount);

  const requestPermissions = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Gallery permission denied');
    }
  };

const fetchSavingsData = async () => {
  try {
    const response = await fetch('http://192.168.1.48:8082/api/savings/home', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ /* your payload data */ }),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      setSavingsData(data); // Assuming the API response contains the savings data
    } else {
      console.error('Failed to fetch savings data: ', data);
    }
  } catch (error) {
    console.error('Error fetching savings data:', error);
  }
};


  // Add new savings item to the server
  const handleAddItem = async () => {
    const newAmount = parseFloat(newItem.amount);
    if (isNaN(newAmount)) {
      alert('Amount must be a valid number');
      return;
    }

    // Make an API request to save the new savings item
    try {
      const response = await fetch('http://192.168.1.48:8082/api/savings/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: newItem.label,
          amount: newAmount,
          time: newItem.time,
        }),
      });

      if (response.ok) {
        const addedItem = await response.json();
        // Update the savingsData state with the new item
        setSavingsData({
          ...savingsData,
          [selectedTab]: [...savingsData[selectedTab], addedItem],
        });
        setShowModal(false);
        setNewItem({ label: '', amount: '', time: '' });
        setImageUri(null);

        Alert.alert('New Savings Item Added', `You added $${newAmount} to ${newItem.label}`);
      } else {
        console.error('Failed to add savings item');
      }
    } catch (error) {
      console.error('Error adding savings item:', error);
    }
  };

  const handleDeleteItem = (index) => {
    const updatedSavings = savingsData[selectedTab].filter((_, i) => i !== index);
    setSavingsData({
      ...savingsData,
      [selectedTab]: updatedSavings,
    });
    saveDataToStorage({
      ...savingsData,
      [selectedTab]: updatedSavings,
    });
  };

  const handleEditItem = (index) => {
    const itemToEdit = savingsData[selectedTab][index];
    setNewItem({ label: itemToEdit.label, amount: itemToEdit.amount, time: itemToEdit.time });
    setEditItemIndex(index);
    setShowModal(true);
  };

  const handleSelectImage = () => {
    requestPermissions();
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.5 },
      (response) => {
        console.log('ImagePicker Response:', response);
        if (response.didCancel) {
          console.log('User canceled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          setImageUri(response.assets[0].uri);
        }
      }
    );
  };

  const saveDataToStorage = async (data) => {
    try {
      await AsyncStorage.setItem('savingsData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('savingsData');
        if (savedData) {
          setSavingsData(JSON.parse(savedData));
        } else {
          setSavingsData({
            Today: [],
            Week: [],
            Month: [],
            Year: [],
          });
          Alert.alert(
            'Welcome to Savings Tracker',
            'Thank you for joining! Start adding your savings today.'
          );
          await AsyncStorage.setItem('savingsData', JSON.stringify({
            Today: [],
            Week: [],
            Month: [],
            Year: [],
          }));
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };

    loadSavedData();
    fetchSavingsData(); // Fetch data from API when component mounts
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <FontAwesome5 name="user-circle" size={40} color="#FFC0CB" />
          <Text style={styles.month}>{currentMonth} {currentYear}</Text>
          <TouchableOpacity>
            <MaterialIcons name="notifications-none" size={28} color="purple" />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceTitle}>Account Balance</Text>
          <Text style={styles.balance}>${savingsData[selectedTab].reduce((acc, item) => acc + item.amount, 0)}</Text>
        </View>

        <View style={styles.incomeExpenseContainer}>
          <TouchableOpacity style={styles.incomeCard}>
            <Text style={styles.cardText}>Income</Text>
            <Text style={styles.income}>$5000</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.expenseCard}>
            <Text style={styles.cardText}>Expenses</Text>
            <Text style={styles.expense}>$2000</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Savings Frequency</Text>
        <LineChart
          style={styles.chart}
          data={data}
          svg={{ stroke: 'purple', strokeWidth: 2 }}
          contentInset={{ top: 20, bottom: 20 }}
        />

        <View style={styles.tabContainer}>
          {['Today', 'Week', 'Month', 'Year'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
              <Text style={selectedTab === tab ? styles.activeTab : styles.tab}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.savingsContainer}>
          <Text style={styles.sectionTitle}>Maximum Savings</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {savingsData[selectedTab]?.map((item, index) => (
          <SavingsItem
            key={index}
            icon={item.icon}
            label={item.label}
            amount={item.amount}
            time={item.time}
            onDelete={() => handleDeleteItem(index)}
            onEdit={() => handleEditItem(index)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Savings</Text>
            <TextInput
              style={styles.input}
              placeholder="Label"
              value={newItem.label}
              onChangeText={(text) => setNewItem({ ...newItem, label: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={newItem.amount}
              onChangeText={(text) => setNewItem({ ...newItem, amount: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Time"
              value={newItem.time}
              onChangeText={(text) => setNewItem({ ...newItem, time: text })}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleAddItem}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const SavingsItem = ({ icon, label, amount, time, onDelete, onEdit }) => (
  <View style={styles.savingsItem}>
    <FontAwesome5 name={icon} size={30} color="black" />
    <View style={styles.savingsDetails}>
      <Text style={styles.savingsLabel}>{label}</Text>
      <View style={styles.savingsAmountContainer}>
        <Text style={styles.savingsAmount}>{amount}</Text>
      </View>
    </View>
    <View style={styles.deleteContainer}>
      <MaterialIcons name="edit" size={24} color="blue" onPress={onEdit} />
      <MaterialIcons name="delete" size={24} color="red" onPress={onDelete} />
      <Text style={styles.timeText}>{time}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F3',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
  },
  month: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 15,
    elevation: 8,
  },
  balanceTitle: {
    fontSize: 18,
    color: '#888',
  },
  balance: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  incomeExpenseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  incomeCard: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  expenseCard: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  income: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00796b',
  },
  expense: {
    fontSize: 20,
    fontWeight: '600',
    color: '#d32f2f',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  chart: {
    height: 200,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tab: {
    fontSize: 18,
    color: '#888',
  },
  activeTab: {
    fontSize: 18,
    color: 'purple',
    fontWeight: 'bold',
  },
  savingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAll: {
    fontSize: 16,
    color: '#888',
  },
  savingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 5,
  },
  savingsDetails: {
    flex: 1,
    marginLeft: 10,
  },
  savingsLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  savingsAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  savingsAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
  },
  deleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 50,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
