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
          Modal.alert(
            'Đang xử lý',
            <ActivityIndicator animating />,
            [{ text: '', onPress: () => {} }],
            { maskClosable: false }
          );

          try {
            const selectedDateStr = selectedDate.toISOString().split('T')[0];
            const response = await deleteMealPlan(meal.id);
            
            // Đóng modal loading
            Portal.remove();

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
            Portal.remove();
            
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