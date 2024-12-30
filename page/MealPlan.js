import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Pressable} from 'react-native';
import { ActionSheet } from '@ant-design/react-native';
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
  Portal
} from '@ant-design/react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { Calendar } from 'react-native-calendars';
import {getAllMealPlan, deleteMealPlan} from '../controller/MealPlanController';
import { getToken } from '../controller/AuthController';
import { useNavigation } from '@react-navigation/native';
import { getUserFromStorage } from '../controller/UserController';
const MealPlannerScreen = () => {
  const navigation = useNavigation()
  const getBearerAuth = async () => {
    const token = await getToken(); // Lấy token từ AsyncStorage
    return `Bearer ${token}`; // Trả về chuỗi Bearer token
  };

  //const [groupId, setGroupId] = useState({});
  const getUserGroupList = async () => {
    const user = await getUserFromStorage(); // Lấy token từ AsyncStorage
    return user.groupIds; // Trả về chuỗi Bearer token
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [plansForSelectedDate, setPlansForSelectedDate] = useState();
  const [mealPlan, setMealPlan] = useState([]);
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
   const userGroupIds = await getUserGroupList();
    try {
      setLoading(true);
      setError(null);
      // await fetchGroup();
      // const formattedDate = date.toISOString().split('T')[0];
      const data = await getAllMealPlan(userGroupIds);
      const sortedData = data.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      // console.log('>>>>>>>>>sortedData',sortedData)
      setMealPlan(sortedData);
      // console.log('>>>>', data.data)
      return data.data
    } catch (err) {
      // setError('Không thể tải dữ liệu');
    } finally {
      // console.log(mealPlan)
      setLoading(false);
    }
  };

  const fetchGroup = async () => {
    try {
    const bearerAuth = await getBearerAuth();
      setLoading(true);
      const response = await fetch('http://192.168.43.107:8080/api/user/group/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerAuth,
        }
      })
      const json = await response.json();
      console.log(json)
      let groups = []
      if (json.resultCode === 'SUCCESS') {
        groups = json.data.map(group => ({
          id: group.id,
          name: group.name
        }))
      }
      // console.log(groups)
      setListGroup(groups);
    }
    catch(err) {
      // console.log('Error fetching groups:', err);
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
      console.error("Error fetching groups:", err);
    }
    finally {
      setAlreadyFetchGroup(true)
    }
  }

  const organizeMealPlans = (mealPlans) => {
    const plansByDate = {};
    const marked = {};

    // Đánh dấu dot cho những ngày có meal plan
    mealPlans.forEach(plan => {
      const dateStr = getDateString(plan.timeStamp);
      if (!plansByDate[dateStr]) {
        plansByDate[dateStr] = [];
      }
      plansByDate[dateStr].push(plan);
      marked[dateStr] = { 
        marked: true,
        dotColor: '#10b981' 
      };
    });

    setMealPlansByDate(plansByDate);
    // Thêm selected cho ngày được chọn
    marked[selectedDate.toISOString().split('T')[0]] = {
      ...marked[selectedDate.toISOString().split('T')[0]],
      selected: true, 
      selectedColor: '#10b981' 
    };
    setMarkedDates(marked);
  };

  useEffect(() => {
    fetchGroup();
  }, [])

  useEffect(() => {
  
      fetchMealPlan().then(data => {organizeMealPlans(data); console.log("dayadsdvdsfb fxg: "+data)});
    
  }, []);

  useEffect(() => {
    const map = listGroup.reduce((acc, group) => {
      acc[group.id] = group.name;
      return acc;
    }, {});
    setIdToNameMap(map);
  }, [listGroup]);

  useEffect(() => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    setPlansForSelectedDate(mealPlansByDate[selectedDateStr] || []);
  }, [selectedDate, mealPlansByDate]);

  const onDayPress = (day) => {
    setSelectedDate(new Date(day.dateString));
    // Cập nhật markedDates khi chọn ngày mới
    const newMarkedDates = {};
    // Giữ lại dots cho những ngày có meal plan
    Object.entries(markedDates).forEach(([date, mark]) => {
      if (mark.dotColor) {
        newMarkedDates[date] = { 
          marked: true,
          dotColor: mark.dotColor 
        };
      }
    });
    // Chỉ đánh dấu selected cho ngày được chọn

    

    newMarkedDates[day.dateString] = {
      ...newMarkedDates[day.dateString],
      selected: true, 
      selectedColor: '#10b981' 
    };
    setMarkedDates(newMarkedDates);
  };

      // creat modal
      const createMealPlan = () => {
        return {
  
        }
      }

  const handleDeleteMealPlan = async (meal) => {
    try {
      // Hiện modal xác nhận xóa
      Modal.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa kế hoạch này không?', [
        {
          text: 'Hủy',
          onPress: () => console.log('Cancel'),
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            // Hiện loading
            // Modal.alert(
            //   'Đang xử lý',
            //   <ActivityIndicator animating />,
            //   [{ text: 'Close', onPress: () => {} }],
            //   { maskClosable: false }
            // );
  
            try {
              const selectedDateStr = selectedDate.toISOString().split('T')[0];
              const response = await deleteMealPlan(meal.id);
              
              // Đóng modal loading
              // Portal.remove();
  
              if (response.resultCode === "SUCCESS") {
                // Cập nhật UI
                const plansByDate = mealPlansByDate;
                plansByDate[selectedDateStr] = mealPlansByDate[selectedDateStr].filter((p) => p.id !== meal.id);
                setMealPlansByDate(plansByDate);
                setPlansForSelectedDate(plansByDate[selectedDateStr] || []);
                
                if(plansByDate[selectedDateStr].length === 0) {
                  const newMarkedDates = markedDates;
                  delete newMarkedDates[selectedDateStr];
                  setMarkedDates(newMarkedDates);
                }
  
                // Hiện thông báo thành công
                Modal.alert('Thành công', 'Đã xóa kế hoạch thành công', [
                  { text: 'OK', onPress: () => {} }
                ]);
              }
            } catch (error) {
              // Đóng modal loading
              // Portal.remove();
              
              // Hiện thông báo lỗi
              Modal.alert('Lỗi', 'Không thể xóa kế hoạch. Vui lòng thử lại sau.', [
                { text: 'OK', onPress: () => {} }
              ]);
              console.error('cant delete', error);
            }
          }
        }
      ]);
    } catch(err) {
      console.error('Error showing delete confirmation:', err);
    }
  };
  const renderMealPlan = () => {
    // const selectedDateStr = selectedDate.toISOString().split('T')[0];
    // // const plansForSelectedDate = mealPlansByDate[selectedDateStr] || [];
    // setPlansForSelectedDate(mealPlansByDate[selectedDateStr] || []);
    if (loading) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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



    const handleLongPress = (meal) => {
      const BUTTONS = ['Chỉnh sửa', 'Xóa', 'Hủy'];
      const CANCEL_INDEX = 2;
      const DESTRUCTIVE_INDEX = 1;
  
      ActionSheet.showActionSheetWithOptions(
        {
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          destructiveButtonIndex: DESTRUCTIVE_INDEX,
          title: 'Tùy chọn',
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              console.log('Edit meal:', meal);
              break;
            case 1: // Xóa
              console.log('Delete meal:', meal);
              handleDeleteMealPlan(meal);
              break;
          }
        }
      );
    };

    return plansForSelectedDate.map((meal, index) => (
      <View key={index}>
        <Pressable
          onLongPress={() => handleLongPress(meal)}
          delayLongPress={500} // 500ms delay để kích hoạt long press
        >
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
        </Pressable>
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
            <TouchableOpacity onPress={() => navigation.navigate('CreateMealPlan', {groupList: listGroup})}>
                <Icon name="plus" size={24} color="white" />
            </TouchableOpacity>
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
        <ScrollView style={{ flex: 1, marginTop: 20}}>
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
    flex: 0.2, 
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
  }
};

export default MealPlannerScreen;