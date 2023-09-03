function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export const getDaysInRange = (selectedMonth: number): number[] => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calculate the previous month based on the selected month
    const previousMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const previousMonthYear = selectedMonth === 0 ? currentYear - 1 : currentYear;

    // Calculate the starting and ending dates
    let startDate: Date;
    let endDate: Date;

    if (selectedMonth === 1) { // February
        const isCurrentYearLeap = isLeapYear(currentYear);
        const isPreviousYearLeap = isLeapYear(previousMonthYear);

        if (isCurrentYearLeap && isPreviousYearLeap) {
            startDate = new Date(previousMonthYear, previousMonth, 22);
        } else if (isCurrentYearLeap && !isPreviousYearLeap) {
            startDate = new Date(previousMonthYear, previousMonth, 21);
        } else if (!isCurrentYearLeap && isPreviousYearLeap) {
            startDate = new Date(previousMonthYear, previousMonth, 21);
        } else {
            startDate = new Date(previousMonthYear, previousMonth, 20);
        }

        endDate = new Date(currentYear, selectedMonth, 20);
    } else {
        startDate = new Date(previousMonthYear, previousMonth, 21);
        endDate = new Date(currentYear, selectedMonth, 20);
    }

    // Iterate through the dates and add them to the result array
    let currentDateInRange = startDate;
    const daysInRange: number[] = [];
    while (currentDateInRange <= endDate) {
        daysInRange.push(currentDateInRange.getDate());
        currentDateInRange.setDate(currentDateInRange.getDate() + 1);
    }
    
    return daysInRange;
}

// Usage: Call the function with the selected month (0 for January, 1 for February, etc.)
const days = getDaysInRange(1);
console.log(days);


// Example usage:
// const selectedMonth = 2; // February (0-based index)
// const lunarDays = getLunarDaysInRange(selectedMonth);
// console.log(lunarDays);
// Usage:
// July
// days will be [25, 26, 27, 28, 29, 30, 1, 2, ..., 31]

// export const getDaysInRange = (month: number) => {
//     const today = new Date();
//     const currentMonth = today.getMonth();
//     const currentYear = today.getFullYear();
//     const nextMonth = currentMonth + 1 > 11 ? 0 : currentMonth + 1;
//     const nextYear = currentMonth + 1 > 11 ? currentYear + 1 : currentYear;

//     const startDate = month === currentMonth ? 25 : 1;
//     const endDate = month === nextMonth ? 24 : new Date(currentYear, month + 1, 0).getDate();

//     const days = [];

//     for (let i = startDate; i <= endDate; i++) {
//         days.push(i);
//     }

//     return days;
// }
