/**
 * Filters tasks by a search keyword (case-insensitive).
 * Searches in taskName, remarks, and description fields.
 *
 * @param {Array} allData - Array of task objects.
 * @param {string} keyword - The search keyword.
 * @returns {Array} - Filtered list of tasks.
 */

export const filterDataByStatus=(allData, value)=>{
  
    if (value!='All'){
    const filteredData=allData.filter((data)=>data.status==value)
    return filteredData
}else{
    return allData
}
}

export const filterDataBySearch = (allData, keyword) => {
  
    if (!keyword || keyword.trim() === "") {
      return allData;
    }
  
    const lowerKeyword = keyword.toLowerCase();
  
    return allData.filter((task) =>
      task.taskName?.toLowerCase().includes(lowerKeyword) ||
      task.remarks?.toLowerCase().includes(lowerKeyword) ||
      task.description?.toLowerCase().includes(lowerKeyword)
    );
  };

  export const filterDataByEmployee=(allData, value)=>{  
      
    if (value!='All'){
    const filteredData=allData.filter((data)=>data.assignee==value)
    return filteredData
}else{
    return allData
}
}

export const filterDataByPriority=(allData, value)=>{  
  if (value!='All'){
  const filteredData=allData.filter((data)=>data.priority==value)
  return filteredData
}else{
  return allData
}
}