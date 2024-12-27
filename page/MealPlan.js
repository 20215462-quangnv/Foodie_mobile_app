import React, { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { 
  Provider,
  Button,
  Card,
  WhiteSpace,
  WingBlank, 
  Text,
  ActivityIndicator,
  Tag
} from '@ant-design/react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const MealPlannerScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealPlan, setMealPlan] = useState([
    {
      name: "Bữa sáng",
      time: "07:00",
      status: "Đã lên kế hoạch",
      food: "Phở bò, Sinh tố",
      group_name: "Gia đình",
      owner_name: "Nguyễn Văn A",
    },
    {
      name: "Bữa trưa",
      time: "12:00",
      status: "Chưa chuẩn bị",
      food: "Cơm gà, Canh chua",
      group_name: "Công ty",
      owner_name: "Trần Thị B",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchMealPlan = async (date) => {
    try {
      setLoading(true);
      setError(null);

      const formattedDate = date.toISOString().split('T')[0];
      const response = await fetch(`http://localhost:8080/meal-plans?date=${formattedDate}`);
      const data = await response.json();

      setMealPlan(data);
    } catch (err) {
      // setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealPlan(selectedDate);
  }, [selectedDate]);

  const renderMealPlan = () => {
    if (loading) {
      return (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <ActivityIndicator text="Loading..." />
        </View>
      );
    }

    if (mealPlan.length === 0) {
      return (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: '#999' }}>Không có kế hoạch bữa ăn cho ngày này.</Text>
        </View>
      );
    }

    return mealPlan.map((meal, index) => (
      <View key={index}>
        <Card>
          <Card.Header
            title={<Text style={{ fontSize: 18, fontWeight: 'bold' }}>{meal.name}</Text>}
            extra={
              <Tag
                style={meal.status === "Đã lên kế hoạch" ? styles.successTag : styles.warningTag}
              >
                {meal.status}
              </Tag>
            }
          />
          <Card.Body>
            <View style={{ padding: 15 }}>
              <Text>Giờ: {meal.time}</Text>
              <Text>Món ăn: {meal.food}</Text>
              <Text>Nhóm: {meal.group_name}</Text>
              <Text>Người tạo: {meal.owner_name}</Text>
            </View>
          </Card.Body>
        </Card>
        <WhiteSpace size="lg" />
      </View>
    ));
  };

  return (
    <Provider>
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Kế Hoạch Bữa Ăn</Text>
        </View>

        {/* Date Picker */}
        <View style={{ backgroundColor: 'white', padding: 15 }}>
          <Button
            onPress={() => setShowDatePicker(true)}
            type="ghost"
          >
            {selectedDate.toLocaleDateString('vi-VN')}
          </Button>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="calendar"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setSelectedDate(date);
              }
            }}
          />
        )}

        {/* Content */}
        <ScrollView style={{ flex: 1 }}>
          <WingBlank size="lg">
            {renderMealPlan()}
          </WingBlank>
        </ScrollView>
      </View>
    </Provider>
  );
};

const styles = {
  header: {
    backgroundColor: '#10b981',
    padding: 16,
    elevation: 4,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  successTag: {
    backgroundColor: '#87d068',
    borderColor: '#87d068',
  },
  warningTag: {
    backgroundColor: '#f50',
    borderColor: '#f50',
  },
};

export default MealPlannerScreen;