import { collection, addDoc, updateDoc, doc, query, where, getDocs, orderBy, Timestamp, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * Clock in an employee
 */
export const clockIn = async (companyId, uid, empName, data) => {
  try {
    const timesheetRef = collection(db, "userData", companyId, "timesheets");
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

    const newDoc = {
      uid,
      empName,
      date: dateStr,
      loginTime: serverTimestamp(),
      logoutTime: null,
      workMode: data.workMode,
      tasksPlanned: data.tasksPlanned,
      tasksCompleted: null,
      salesOutreach: data.salesOutreach || 0,
      status: "active",
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(timesheetRef, newDoc);
    return { id: docRef.id, ...newDoc };
  } catch (error) {
    console.error("Error clocking in:", error);
    throw error;
  }
};

/**
 * Clock out an employee
 */
export const clockOut = async (companyId, timesheetId, data) => {
  try {
    const docRef = doc(db, "userData", companyId, "timesheets", timesheetId);
    await updateDoc(docRef, {
      logoutTime: serverTimestamp(),
      tasksCompleted: data.tasksCompleted,
      salesOutreach: data.salesOutreach || 0,
      status: "completed"
    });
  } catch (error) {
    console.error("Error clocking out:", error);
    throw error;
  }
};

/**
 * Get active timesheet for a user
 */
export const getActiveTimesheet = async (companyId, uid) => {
  try {
    const timesheetRef = collection(db, "userData", companyId, "timesheets");
    const q = query(
      timesheetRef,
      where("uid", "==", uid),
      where("status", "==", "active"),
      orderBy("loginTime", "desc")
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching active timesheet:", error);
    return null;
  }
};

/**
 * Fetch timesheets for history
 */
export const fetchTimesheets = async (companyId, uid, isAdmin) => {
  try {
    const timesheetRef = collection(db, "userData", companyId, "timesheets");
    let q;
    if (isAdmin) {
      q = query(timesheetRef, orderBy("loginTime", "desc"));
    } else {
      q = query(
        timesheetRef,
        where("uid", "==", uid),
        orderBy("loginTime", "desc")
      );
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching timesheets:", error);
    return [];
  }
};
