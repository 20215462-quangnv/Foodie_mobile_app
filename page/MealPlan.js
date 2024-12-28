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
  Tag,
  Modal,
} from '@ant-design/react-native';
import { IconOutline } from '@ant-design/icons-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import mealPlanController from '../controller/MealPlanController';

const MealPlannerScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealPlan, setMealPlan] = useState([
    {
      "id": 13,
      "createdAt": "2024-12-27T23:30:37.144454",
      "updatedAt": "2024-12-27T23:31:18.191624",
      "name": "bua sang",
      "timeStamp": "2024-12-28T00:00",
      "status": "PASSED",
      "food": {
        "id": 9,
        "createdAt": "2024-12-27T23:15:38.120555",
        "updatedAt": "2024-12-27T23:15:38.120555",
        "name": "food1",
        "type": "string",
        "description": "test",
        "imageUrl": null,
        "owner": {
          "id": 4,
          "createdAt": "2024-12-27T22:29:00.928869",
          "updatedAt": "2024-12-27T22:29:00.928869",
          "email": "levanminh19102003@gmail.com",
          "fullName": "le minh",
          "phoneNumber": "0948524911",
          "timeZone": 0,
          "language": "1",
          "deviceId": "string",
          "photoUrl": null,
          "notificationToken": null,
          "username": "levanminh19102003@gmail.com",
          "groupIds": [
            16,
            17
          ]
        },
        "measureUnit": null,
        "foodCategory": null,
        "groupId": 16
      },
      "group_id": 16,
      "owner_id": 4
    },
    {
      "id": 14,
      "createdAt": "2024-12-28T16:07:52.081279",
      "updatedAt": "2024-12-28T16:07:52.081279",
      "name": "bữa trưa",
      "timeStamp": "2024-12-28T18:00",
      "status": "NOT_PASS_YET",
      "food": {
        "id": 9,
        "createdAt": "2024-12-27T23:15:38.120555",
        "updatedAt": "2024-12-27T23:15:38.120555",
        "name": "food1",
        "type": "string",
        "description": "test",
        "imageUrl": null,
        "owner": {
          "id": 4,
          "createdAt": "2024-12-27T22:29:00.928869",
          "updatedAt": "2024-12-27T22:29:00.928869",
          "email": "levanminh19102003@gmail.com",
          "fullName": "le minh",
          "phoneNumber": "0948524911",
          "timeZone": 0,
          "language": "1",
          "deviceId": "string",
          "photoUrl": null,
          "notificationToken": null,
          "username": "levanminh19102003@gmail.com",
          "groupIds": [
            16,
            17
          ]
        },
        "measureUnit": null,
        "foodCategory": null,
        "groupId": 16
      },
      "group_id": 16,
      "owner_id": 4
    },
    {
      "id": 15,
      "createdAt": "2024-12-28T16:20:54.590797",
      "updatedAt": "2024-12-28T16:20:54.590797",
      "name": "bữa tối",
      "timeStamp": "2024-12-29T18:00",
      "status": "NOT_PASS_YET",
      "food": {
        "id": 10,
        "createdAt": "2024-12-28T16:19:08.859644",
        "updatedAt": "2024-12-28T16:19:08.859644",
        "name": "ga ham",
        "type": "",
        "description": "món hầm",
        "imageUrl": null,
        "owner": {
          "id": 4,
          "createdAt": "2024-12-27T22:29:00.928869",
          "updatedAt": "2024-12-27T22:29:00.928869",
          "email": "levanminh19102003@gmail.com",
          "fullName": "le minh",
          "phoneNumber": "0948524911",
          "timeZone": 0,
          "language": "1",
          "deviceId": "string",
          "photoUrl": null,
          "notificationToken": null,
          "username": "levanminh19102003@gmail.com",
          "groupIds": [
            16,
            17
          ]
        },
        "measureUnit": null,
        "foodCategory": null,
        "groupId": 17
      },
      "group_id": 17,
      "owner_id": 4
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [listGroup, setListGroup] = useState([]);
  const [alreadyFetchGroup, setAlreadyFetchGroup] = useState(false);
  const [idToNameMap, setIdToNameMap] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [mealPlansByDate, setMealPlansByDate] = useState({});

  const getDateString = (timestamp) => {
    return timestamp.split('T')[0];
  };

  const fetchMealPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      // await fetchGroup();
      // const formattedDate = date.toISOString().split('T')[0];
      const data = await mealPlanController.getAllMealPlan(listGroup);
      const sortedData = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMealPlan(sortedData);
    } catch (err) {
      // setError('Không thể tải dữ liệu');
    } finally {
      // console.log(mealPlan)
      setLoading(false);
    }
  };

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/user/group/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      const json = await response.json();
      const groups = []
      if (json.resultCode === 'SUCCESS') {
        groups = json.data.map(group => ({
          id: group.id,
          name: group.name
        }))
      }
      setListGroup(groups);
    }
    catch(err) {
      console.log('Error fetching groups:', err);
      setListGroup([
        {
          id: 16,
          name: 'cong ty'
        },
        {
          id: 17,
          name: 'nha'
        },
      ])
    }
    finally {
      setAlreadyFetchGroup(true)
    }
  }

  const organizeMealPlans = (mealPlans) => {
    const plansByDate = {};
    const marked = {};

    mealPlans.forEach(plan => {
      const dateStr = getDateString(plan.timeStamp);
      
      // Nhóm meal plans theo ngày
      if (!plansByDate[dateStr]) {
        plansByDate[dateStr] = [];
      }
      plansByDate[dateStr].push(plan);

      // Đánh dấu ngày có meal plan trên calendar
      marked[dateStr] = {
        marked: true,
        dotColor: '#10b981'
      };
    });

    // Nếu có ngày được chọn, đánh dấu nó
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    marked[selectedDateStr] = {
      ...marked[selectedDateStr],
      selected: true,
      selectedColor: '#10b981'
    };

    setMealPlansByDate(plansByDate);
    setMarkedDates(marked);
  };

  useEffect(() => {
    fetchGroup();
  }, [])

  useEffect(() => {
    if (alreadyFetchGroup) {
      fetchMealPlan()
      organizeMealPlans(mealPlan);
    }
  }, [alreadyFetchGroup]);

  useEffect(() => {
    const map = listGroup.reduce((acc, group) => {
      acc[group.id] = group.name;
      return acc;
    }, {});
    setIdToNameMap(map);
  }, [listGroup]);

  const onDayPress = (day) => {
    const selectedDate = new Date(day.dateString);
    setSelectedDate(selectedDate);
  };

      // creat modal
      const createMealPlan = () => {
        return {
  
        }
      }

  const renderMealPlan = () => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const plansForSelectedDate = mealPlansByDate[selectedDateStr] || [];
    if (loading) {
      return (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <ActivityIndicator text="Loading..." />
        </View>
      );
    }

    else if (plansForSelectedDate.length === 0) {
      return (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: '#999' }}>Không có kế hoạch bữa ăn cho ngày này.</Text>
        </View>
      );
    }

    // const sortedPlans = [...plansForSelectedDate].sort((a, b) => 
    //   new Date(a.timeStamp) - new Date(b.timeStamp)
    // );

    return plansForSelectedDate.map((meal, index) => (
      <View key={index}>
        <Card>
          <Card.Header
            title={<Text style={{ fontSize: 18, fontWeight: 'bold' }}>{meal.name}</Text>}
            extra={
              <Tag
                style={meal.status === "NOT_PASS_YET" ? styles.successTag : styles.warningTag}
              >
                {meal.status === "NOT_PASS_YET" ? 'Chưa đến' : 'Đã qua'}
              </Tag>
            }
          />
          <Card.Body>
            <View style={{ padding: 15 }}>
              <Text>Giờ: {meal.timeStamp.split('T')[1]}</Text>
              <Text>Món ăn: {meal.food.name}</Text>
              <Text>Nhóm: {idToNameMap[meal.group_id]}</Text>
              <Text>Người tạo: {meal.owner_id}</Text>
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
          <Button 
            style={styles.addButton}
            onPress={() => setVisible(true)}
          >
            <IconOutline name="plus-circle" size={35} color="white" />
          </Button>
        </View>

        <Calendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          theme={{
            todayTextColor: '#10b981',
            selectedDayBackgroundColor: '#10b981',
            arrowColor: '#10b981',
          }}
        />

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    borderWidth: 0,
    backgroundColor: 'transparent'
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