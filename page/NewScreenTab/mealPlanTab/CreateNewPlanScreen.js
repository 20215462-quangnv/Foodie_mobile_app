import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import {getFoodsByGroupId} from '../../../controller/FoodController';
import {createMealPlan} from '../../../controller/MealPlanController';

const CreateMealPlan = ({ route, navigation }) => {
  const {groupList} = route.params;
  const [mealName, setMealName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState('');
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // New states for loading and result modals
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    if (selectedGroup) {
      fetchMeals(selectedGroup);
    }
  }, [selectedGroup]);

  const fetchMeals = async (groupId) => {
    try {
      const response = await getFoodsByGroupId(groupId);
      setMeals(response.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) {
      setSelectedTime(time);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const mealPlan = {
        name: mealName,
        timeStamp: selectedDate.toISOString().split('T')[0] +'T'+ selectedTime.toString().split(' ')[4].slice(0,5),
        foodId: selectedMeal
      };

      const response = await createMealPlan(mealPlan);
      
      setIsLoading(false);
      setIsSuccess(true);
      setResultMessage('Tạo kế hoạch thành công!');
      setShowResult(true);

      // Reset form after successful creation
      setMealName('');
      setSelectedDate(new Date());
      setSelectedTime(new Date());
      setSelectedGroup('');
      setSelectedMeal('');
      
    } catch (error) {
      setIsLoading(false);
      setIsSuccess(false);
      setResultMessage('Có lỗi xảy ra khi tạo kế hoạch. Vui lòng thử lại!');
      setShowResult(true);
      console.error('Error creating meal plan:', error);
    }
  };

  const handleCloseResult = () => {
    setShowResult(false);
    if (isSuccess) {
      // navigation.goBack()
    }
  };

  // Loading Modal
  const LoadingModal = () => (
    <Modal transparent visible={isLoading}>
      <View style={styles.modalBackground}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4EA72E" />
          <Text style={styles.loadingText}>Đang xử lý...</Text>
        </View>
      </View>
    </Modal>
  );

  // Result Modal
  const ResultModal = () => (
    <Modal transparent visible={showResult}>
      <View style={styles.modalBackground}>
        <View style={styles.resultContainer}>
          <Text style={[
            styles.resultText,
            { color: isSuccess ? '#4EA72E' : '#FF0000' }
          ]}>
            {resultMessage}
          </Text>
          <TouchableOpacity
            style={[styles.resultButton, { backgroundColor: isSuccess ? '#4EA72E' : '#FF0000' }]}
            onPress={handleCloseResult}
          >
            <Text style={styles.resultButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tạo Kế Hoạch</Text>
      </View>
      <ScrollView style={styles.container}>
        {/* Existing form content */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tên bữa ăn</Text>
          <TextInput
            style={styles.input}
            value={mealName}
            onChangeText={setMealName}
            placeholder="Nhập tên bữa ăn"
            keyboardType="default"
            autoCorrect={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Chọn ngày</Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{selectedDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Chọn giờ</Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text>{selectedTime.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              onChange={handleTimeChange}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Chọn nhóm</Text>
          <Picker
            selectedValue={selectedGroup}
            onValueChange={(itemValue) => setSelectedGroup(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Chọn nhóm" value="" />
            {groupList.map((group) => (
              <Picker.Item key={group.id} label={group.name} value={group.id} />
            ))}
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Chọn món ăn</Text>
          <Picker
            selectedValue={selectedMeal}
            onValueChange={(itemValue) => setSelectedMeal(itemValue)}
            style={styles.picker}
            enabled={selectedGroup !== ''}
          >
            <Picker.Item label="Chọn món ăn" value="" />
            {meals.map((meal) => (
              <Picker.Item key={meal.id} label={meal.name} value={meal.id} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Tạo Kế Hoạch</Text>
        </TouchableOpacity>
      </ScrollView>

      <LoadingModal />
      <ResultModal />
    </View>
  );
};

const styles = StyleSheet.create({
  // Existing styles...
  header: {
    flex: 0.15, 
    backgroundColor: "#4EA72E", 
    padding: 10,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    margin: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#4EA72E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // New styles for modals
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  resultButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  resultButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateMealPlan;