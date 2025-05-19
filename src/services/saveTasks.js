// saveTasks.js
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig"; // adjust the path as per your folder structure

const saveTasks = async (tasks,e,userId) => {
  const { userID, taskName, priority, assignee, status, dueDate, description, remarks } = tasks;

  
  e.preventDefault();

  if (!taskName || !assignee) {
    alert("Enter Required Fields");
    return;
  }

  try {
    await addDoc(collection(db,"userData",userId, "tasks"), {
      userID,
      taskName,
      priority,
      assignee,
      status,
      dueDate,
      description,
      remarks,
      createdAt: new Date()
    });
  } catch (err) {
    console.log("Error saving task:", err);
  }
};

export default saveTasks;
