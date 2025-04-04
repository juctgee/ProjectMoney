import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // เปลี่ยนการนำเข้าที่นี่

const settingsOptions = [
  { label: 'Currency', value: 'USD', options: ['USD', 'EUR', 'GBP'] },
  { label: 'Language', value: 'English', options: ['English', 'Thai', 'French'] },
  { label: 'Theme', value: 'Light', options: ['Light', 'Dark'] },
  { label: 'Security', value: 'Fingerprint', options: ['Fingerprint', 'Password'] },
  { label: 'Notification', value: 'Enabled', options: ['Enabled', 'Disabled'] },
];

const SettingsScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);
  const [settings, setSettings] = useState(settingsOptions); // ติดตามการอัปเดตค่าต่างๆ

  const handleNavigate = (setting) => {
    setCurrentSetting(setting);
    setModalVisible(true);  // เปิด Modal เมื่อเลือกตัวเลือก
  };

  const handleSave = (newValue) => {
    // อัพเดทค่าในแต่ละตัวเลือก
    const updatedOptions = settings.map(option =>
      option.label === currentSetting.label ? { ...option, value: newValue } : option
    );
    setSettings(updatedOptions);  // อัปเดตค่าใน state
    setModalVisible(false);  // ปิด Modal
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {settings.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionContainer}
            onPress={() => handleNavigate(option)}
          >
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>{option.label}</Text>
              <Text style={styles.optionValue}>{option.value}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8C52FF" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal สำหรับเลือกค่า */}
      {currentSetting && (
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select {currentSetting.label}</Text>
              <Picker
                selectedValue={currentSetting.value}
                style={styles.picker}
                onValueChange={(itemValue) => handleSave(itemValue)}
              >
                {currentSetting.options.map((option, idx) => (
                  <Picker.Item key={idx} label={option} value={option} />
                ))}
              </Picker>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
  optionValue: {
    fontSize: 16,
    color: '#888',
    marginLeft: 10,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  modalCloseButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#6C63FF',
    borderRadius: 5,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
