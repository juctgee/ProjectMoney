import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import { LineChart } from 'react-native-chart-kit';

// Define months array
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const BudgetScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());

  const transactionData = route.params?.transactionData;  // Receive data from TransactionScreen

  // Function to process transaction data and divide it into weekly data
  const getWeeklyData = () => {
    if (!transactionData || transactionData.length === 0) return [0, 0, 0, 0];  // If no data, return empty weeks

    const weeklyData = [0, 0, 0, 0]; // Assuming 4 weeks in the month
    transactionData.forEach(item => {
      // Parse the amount to a number and assign it to the appropriate week (this is just a simple division logic)
      const amount = parseFloat(item.amount.replace(/[^0-9.-]+/g, ""));  // Remove non-numeric chars from the amount

      // For simplicity, assuming each transaction is randomly assigned to a week (could be based on the transaction date)
      const week = Math.floor(Math.random() * 4);  // Randomly assign each transaction to a week
      weeklyData[week] += amount;  // Add amount to the corresponding week
    });

    return weeklyData;
  };

  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: getWeeklyData(),
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 26,
    },
  };

  const handlePrevMonth = () => {
    setCurrentMonthIndex(prevIndex => (prevIndex === 0 ? 11 : prevIndex - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex(prevIndex => (prevIndex === 11 ? 0 : prevIndex + 1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.monthText}>{months[currentMonthIndex]}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <LineChart
          data={data}
          width={320}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateBudgetScreen')}>
        <Text style={styles.buttonText}>Create Budget</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 10,
    marginTop: 80,
  },
  monthText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  createButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BudgetScreen;
