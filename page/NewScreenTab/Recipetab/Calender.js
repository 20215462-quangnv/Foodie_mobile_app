import React, { useRef, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';

const WeekCalendar = ({setDate}) => {
  const [weeks, setWeeks] = useState([]);
  const flatListRef = useRef(null);

  // Hàm tạo dữ liệu cho lịch tuần
  const generateWeeks = () => {
    const weeksArray = [];
    let startOfWeek = moment().startOf('week'); // Lấy ngày đầu tuần (Monday)
    
    // Tạo 5 tuần, có thể thay đổi số tuần tuỳ ý
    for (let i = 0; i < 5; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        week.push(startOfWeek.clone().add(j, 'days'));
      }
      weeksArray.push(week);
      startOfWeek.add(7, 'days'); // Tiến đến tuần tiếp theo
    }
    setWeeks(weeksArray);
  };

  useEffect(() => {
    generateWeeks();
  }, []);

  // Cuộn đến tuần hiện tại
  useEffect(() => {
    const currentWeekIndex = weeks.findIndex((week) =>
      week.some((day) => day.isSame(moment(), 'day'))
    );
    if (flatListRef.current && currentWeekIndex >= 0) {
      flatListRef.current.scrollToIndex({ animated: true, index: currentWeekIndex });
    }
  }, [weeks]);

  const renderItem = ({ item }) => (
    <View style={styles.weekContainer}>
      {item.map((day, index) => (
        <View
          key={index}
          style={[
            styles.dayContainer,
             // Nền đỏ cho ngày hiện tại
          ]}
          >
            <Text style={[styles.dayText]}>{day.format('ddd')}</Text>
          <TouchableOpacity style={[styles.dateContainer, moment().isSame(day, 'day') && styles.todayDay,]}
          onPress ={() => setDate(day.toDate())}>
                  <Text style={[styles.dayText, , moment().isSame(day, 'day') && styles.todayDayText]}>{day.format('D')}</Text>
            </TouchableOpacity>
          
        </View>
      ))}
    </View>
  );

  // Hàm xử lý khi không thể cuộn đến chỉ mục
  const handleScrollToIndexFailed = (error) => {
    const offset = error.averageItemLength * error.index;
    flatListRef.current.scrollToOffset({ animated: true, offset });
  };

  // Hàm lấy layout của item
  const getItemLayout = (data, index) => ({
    length: 100, // Chiều cao của mỗi item (1 tuần)
    offset: 100 * index, // Vị trí của item
    index,
  });

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={weeks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout} // Cung cấp thông tin layout cho mỗi item
        onScrollToIndexFailed={handleScrollToIndexFailed} // Xử lý khi không thể cuộn đến chỉ mục
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekContainer: {
    flexDirection: 'row',
    margin: 5,
    },
  dayContainer: {
    width: 50,
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 2,
  },
  dateContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  todayDay: {
    backgroundColor: '#8E1E20', // Nền đỏ cho ngày hiện tại
    color: 'white', // Màu chữ trắng
    },
  todayDayText: {
    color: 'white', // Màu chữ trắng
  },
});

export default WeekCalendar;
