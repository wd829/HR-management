export const getDaysInRange = (selectedMonth) => {
    const currentYear = new Date().getFullYear();

    const previousMonth = selectedMonth - 1 < 0 ? 11 : selectedMonth - 1;
    const previousMonthLastDay = new Date(currentYear, previousMonth, 0).getDate();

    const selectedMonthFirstDay = new Date(currentYear, selectedMonth, 1).getDay();
    const selectedMonthLastDay = new Date(currentYear, selectedMonth, 24).getDate();

    const days = [];

    // Add days from previous month

    for (let i = 25; i <= previousMonthLastDay; i++) {
        days.push(i)
    }

    // Add days from selected month
    for (let i = selectedMonthFirstDay; i <= selectedMonthLastDay; i++) {
        days.push(i);
    }

    return days;
}

// Usage:
// July
// days will be [25, 26, 27, 28, 29, 30, 1, 2, ..., 31]