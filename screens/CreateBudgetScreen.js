import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = ['Food', 'Education', 'Entertainment', 'Health', 'Others'];

const CreateBudgetScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('3000');
  const [isAlertEnabled, setIsAlertEnabled] = useState(true);
  const [category, setCategory] = useState('Select Category');
  const [isModalVisible, setModalVisible] = useState(false);
  
  // Wrap the fetch logic in an async function
  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.1.48:8082/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'example', email: 'example@mail.com', password: 'password123' }),
      });
      const data = await response.json();
      console.log('Response:', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleContinue = () => {
    console.log("Navigating to Budget with amount:", amount);
    console.log("Selected Category:", category);
    fetchData();  // Call fetch data when continuing
    navigation.navigate('Budget'); // ✅ ชื่อ Route ต้องตรงกับที่กำหนดไว้ใน MainNavigator
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>How much do you want to spend?</Text>
      <TextInput
        style={styles.amountInput}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Category Dropdown */}
      <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>{category}</Text>
        <Ionicons name="chevron-down" size={20} color="#9E9E9E" />
      </TouchableOpacity>

      {/* Category Selection Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.categoryItem} onPress={() => {
                  setCategory(item);
                  setModalVisible(false);
                }}>
                  <Text style={styles.categoryText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Alert Toggle */}
      <View style={styles.alertContainer}>
        <View>
          <Text style={styles.alertText}>Receive Alert</Text>
          <Text style={styles.alertSubText}>Receive alert when it reaches some point.</Text>
        </View>
        <Switch value={isAlertEnabled} onValueChange={setIsAlertEnabled} />
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8C52FF',
    padding: 20,
  },
  questionText: {
    color: 'white',
    fontSize: 16,
    marginTop: 30,
  },
  amountInput: {
    backgroundColor: 'white',
    color: '#333',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
  },
  dropdown: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownText: {
    color: '#9E9E9E',
  },
  alertContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  alertText: {
    color: 'white',
    fontSize: 16,
  },
  alertSubText: {
    color: '#D1C4E9',
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: '#6A1B9A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#6A1B9A',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CreateBudgetScreen;
