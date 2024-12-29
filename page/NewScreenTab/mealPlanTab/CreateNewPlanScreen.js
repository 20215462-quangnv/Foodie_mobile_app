import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import {getFoodByGroup} from '../../../controller/FoodController';
import {createMealPlan} from '../../../controller/MealPlanController';

const CreateMealPlan = ({ route }) => {
  const {groupList} = route.params;
  const [mealName, setMealName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState('');
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Fetch meals when selected group changes
  useEffect(() => {
    if (selectedGroup) {
      fetchMeals(selectedGroup);
    }
  }, [selectedGroup]);

  const fetchMeals = async (groupId) => {
    try {
      // Replace with your actual API endpoint
      const response = await getFoodByGroup(groupId);
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
    try {
      const mealPlan = {
        name: mealName,
        timeStamp: selectedDate.toISOString().split('T')[0] +'T'+ selectedTime.toString().split(' ')[4].slice(0,5),
        foodId: selectedMeal
      };

      // Replace with your actual API endpoint
      console.log(mealPlan)
      const response = await createMealPlan(mealPlan)

      // Handle success
      console.log('Meal plan created successfully');
      // Reset form
      setMealName('');
      setSelectedDate(new Date());
      setSelectedTime(new Date());
      setSelectedGroup('');
      setSelectedMeal('');
    } catch (error) {
      console.error('Error creating meal plan:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tạo Kế Hoạch</Text>
      </View>
      <ScrollView style={styles.container}>

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
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 0.1, 
    backgroundColor: "#4EA72E", 
    padding: 10,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    // paddingBottom : 10,
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
    margin: 20
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
    marginTop: 50,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateMealPlan;