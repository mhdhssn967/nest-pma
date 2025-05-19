import { db } from "../firebaseConfig"; // make sure your firebase config exports 'db'
import { doc, updateDoc, serverTimestamp, deleteField } from "firebase/firestore";

/**
 * Updates the status of a task in Firestore
 * @param {string} taskId - ID of the task document
 * @param {string} newStatus - The new status (e.g., "In Progress", "Completed")
 * @param {string} newRemarks - The new remarks content to be set.
 * @returns {Promise<void>} **/

export const updateTaskStatus = async (companyId, taskId, newStatus) => {
  try {
    const taskRef = doc(db,"userData",companyId, "tasks", taskId);
    await updateDoc(taskRef, {
      status: newStatus,
    });
    console.log(`Task ${taskId} status updated to ${newStatus}`);
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

export const updateTaskRemarks = async (companyId, taskId, newRemarks) => {
  try {
    const taskRef = doc(db,"userData",companyId, "tasks", taskId);
    await updateDoc(taskRef, {
      remarks: newRemarks,
    });
    console.log(`Task ${taskId} remarks updated to "${newRemarks}"`);
  } catch (error) {
    console.error("Error updating task remarks:", error); 
    throw error;
  }
};


export const updateTaskStartedOn = async (companyId, taskId) => {
  try {
    const taskRef = doc(db,"userData",companyId, "tasks", taskId);
    await updateDoc(taskRef, {
      startedOn: serverTimestamp(),
    });
    console.log(`Task ${taskId} startedOn set to current timestamp`);
  } catch (error) {
    console.error("Error updating task startedOn:", error);
    throw error;
  }
};

export const updateTaskCompletedOn = async (companyId, taskId) => {
  try {
    const taskRef = doc(db,"userData",companyId, "tasks", taskId);
    await updateDoc(taskRef, {
      completedOn: serverTimestamp(),
    });
    console.log(`Task ${taskId} completedOn set to current timestamp`);
  } catch (error) {
    console.error("Error updating task startedOn:", error);
    throw error;
  }
};


export const resetTaskDates = async (companyId, taskId) => {
  try {
    const taskRef = doc(db,"userData",companyId, "tasks", taskId);
    await updateDoc(taskRef, {
      completedOn: deleteField(),
      startedOn: deleteField()
    });
    console.log(`Task ${taskId} completedOn field deleted`);
  } catch (error) {
    console.error("Error deleting completedOn field:", error);
    throw error;
  }
};

