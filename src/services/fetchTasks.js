// utils/getAllTasks.js
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getAllTasksForAdmin = async () => {
    try {
      const tasksRef = collection(db, "tasks");
      const q = query(tasksRef, orderBy("dueDate")); // Ascending order
      const snapshot = await getDocs(q);
  
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      return tasks;
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      return [];
    }
  };


export const getTasksForUser = async (userID) => {
    try {
      const tasksRef = collection(db, "tasks");
      const q = query(tasksRef, where("userID", "==", userID), orderBy('dueDate'));
      const snapshot = await getDocs(q);
  
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      return tasks;
    } catch (error) {
      console.error("Error fetching user tasks:", error);
      return [];
    }
  };
 
export const getAllTasks=async(isAdmin, userId, companyId)=>{  
  try{    
    if(isAdmin){      
      const tasksRef = collection(db,"userData",userId,"tasks");
      const q = query(tasksRef, orderBy("dueDate")); // Ascending order
      const snapshot = await getDocs(q);
  
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      return tasks;
    }else{
      console.log(companyId);
      
      const tasksRef = collection(db, "userData",companyId,"tasks");
      const q = query(tasksRef, where("userID", "==", userId), orderBy('dueDate'));
      const snapshot = await getDocs(q);
  
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      return tasks;
    }
  }catch(err){
    console.log("Error fetching tasks",err);
    return [];
  }
}