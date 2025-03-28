// Hours and minutes to decimal. Ex shift starts 9:45 - 18:00 = 8:25 Hours -> 8.15
const calculateHoursAndMinutes = (checkIn, checkOut) => {
    const diffInMs = checkOut - checkIn;
    const totalMinutes = diffInMs / (1000 * 60); // Total minutes
    const hours = Math.floor(totalMinutes / 60); // Whole hours
    const remainingMinutes = Math.round((totalMinutes % 60) / 15) * 15; // Round to nearest 15
    const minutesDecimal = remainingMinutes === 60 ? 0 : remainingMinutes / 100; // Convert to decimal
    return hours + minutesDecimal;
}

export default calculateHoursAndMinutes