export const formatTime = (dateString) => {
    const currentDate = new Date(dateString);
  
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
  
    // Format single-digit hours, minutes, and seconds with leading zeros
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  
    // Return formatted time string
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };
  
  export const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    return `${day}-${month}-${year}`;
  };
  

  