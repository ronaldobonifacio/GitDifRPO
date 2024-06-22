const separateDateAndTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const date = dateTime.toISOString().split('T')[0];
    const time = dateTime.toISOString().split('T')[1].split('.')[0];
  
    return { date, time };
  };
  
  const extractFileName = (filePath) => {
    const match = filePath.match(/\/([^/]+)$/);
    if (match && match.length > 1) {
      return match[1];
    } else {
      return filePath;
    }
  };
  
  module.exports = { separateDateAndTime, extractFileName };  