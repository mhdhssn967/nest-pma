// services/deleteTask.js
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // adjust if your firebase config path is different

export const deleteTask = async (taskId, companyId) => {
  try {
    const taskRef = doc(db,"userData",companyId, "tasks", taskId);
    await deleteDoc(taskRef);
    console.log(`Task with ID ${taskId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
