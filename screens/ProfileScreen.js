import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ route, navigation }) {
  const [isAccountModalVisible, setAccountModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [profileImage, setProfileImage] = useState(require('../assets/images/cat.png'));
  
  const saveProfile = async () => {
    try {
      // บันทึกชื่อใหม่และอีเมลใหม่
      await AsyncStorage.setItem('userName', newUserName);
      await AsyncStorage.setItem('email', newEmail); // บันทึกอีเมลใหม่
    } catch (e) {
      console.error('Failed to save profile data', e);
    }
    setEditModalVisible(false);
  };

  // ดึงข้อมูลที่เก็บไว้จาก AsyncStorage
  useEffect(() => {
    const getProfileData = async () => {
      try {
        const savedUserName = await AsyncStorage.getItem('userName');
        const savedEmail = await AsyncStorage.getItem('email');
        if (savedUserName !== null && savedEmail !== null) {
          setNewUserName(savedUserName);
          setNewEmail(savedEmail);
        }
      } catch (e) {
        console.error('Failed to load profile data', e);
      }
    };
    getProfileData();

    // Request permission for the image picker
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage({ uri: result.uri });
    }
  };

  const toggleAccountModal = () => {
    setAccountModalVisible(!isAccountModalVisible);
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    navigation.replace('Login');
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const toggleEditModal = () => {
    setEditModalVisible(!isEditModalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={profileImage} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.profileDetails}>
          {newUserName && newEmail ? (
            <>
              <Text style={styles.profileName}>{newUserName}</Text>
              <Text style={styles.profileEmail}>{newEmail}</Text>
            </>
          ) : (
            <Text style={styles.profileName}>No profile data</Text>
          )}
        </View>
        <TouchableOpacity style={styles.editButton} onPress={toggleEditModal}>
          <FontAwesome5 name="pen" size={16} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.menuItem} onPress={toggleAccountModal}>
        <View style={styles.menuIconContainer}>
          <FontAwesome5 name="wallet" size={24} color="#A020F0" />
        </View>
        <Text style={styles.menuText}>Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={navigateToSettings}>
        <View style={styles.menuIconContainer}>
          <FontAwesome5 name="cog" size={24} color="#A020F0" />
        </View>
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
        <View style={styles.menuIconContainer}>
          <FontAwesome5 name="sign-out-alt" size={24} color="red" />
        </View>
        <Text style={[styles.menuText, { color: 'red' }]}>Logout</Text>
      </TouchableOpacity>

      <Modal
        visible={isAccountModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleAccountModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Account Information</Text>
            <Text style={styles.modalText}>Name: {newUserName || 'N/A'}</Text>
            <Text style={styles.modalText}>Email: {newEmail || 'N/A'}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={toggleAccountModal}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isLogoutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Logout?</Text>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={cancelLogout}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#6C63FF' }]} onPress={confirmLogout}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              value={newUserName}
              onChangeText={setNewUserName}
              placeholder="Enter new name"
            />
            <TextInput
              style={styles.input}
              value={newEmail}
              onChangeText={setNewEmail} // ใช้ onChangeText ในการอัพเดตอีเมล
              placeholder="Enter new email"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={toggleEditModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#6C63FF' }]} onPress={saveProfile}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileDetails: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: 'gray',
  },
  editButton: {
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f0e6ff',
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
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
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#A020F0',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
});
