// src/utils/getAllUsers.js
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig"; // update the path if needed

export const fetchAllEmployees = async (companyId) => {
  try {
    const employeesRef = collection(db, 'userData', companyId, 'employees');
    const snapshot = await getDocs(employeesRef);

    if (snapshot.empty) {
      return []; // No employee records
    }

    const employees = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: data.uid, 
        empName: data.empName || '',
      };
    });

    return employees;

  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
};



export const ifAdmin = async (userId) => {
  try {
    if (!userId) {
      console.log("No userId provided to Admin");
      return false;
    }

    const adminDocRef = doc(db, 'userData', userId);        
    const adminDocSnap = await getDoc(adminDocRef);

    if (adminDocSnap.exists()) {
      // Optional: add further checks like adminDocSnap.data().role === 'admin'
      return true;
    } else {
      return false;
    }

  } catch (err) {
    console.error('Error in checking if admin:', err);
    return false; // ensure function returns something on error
  }
};

export default fetchAllEmployees;


export const getUserCompanyDetails = async (userid) => {
  try {
    // Query the 'allemployees' collection directly
    const q = query(
      collection(db, 'allEmployees'),
      where('uid', '==', userid)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data();

      return {
        companyId: docData.companyId || '',
        companyName: docData.companyName || ''
      };
    } else {
      console.warn('No employee found in allemployees for this UID.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching company details:', error);
    return null;
  }
};


export const getEmployeeName = async (userId) => {
  try {
    const employeeDocRef = doc(db, 'allEmployees', userId);
    const docSnap = await getDoc(employeeDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.empName || null;
    } else {
      console.warn('Employee document not found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching employee name:', error);
    return null;
  }
};

// Get company details

// src/services/getCompanyDetails.js
export const getCompanyDetails = async (currentUser) => {
  try {
    const adminDocRef = doc(db, 'userData', currentUser);
    const adminDocSnap = await getDoc(adminDocRef);

    if (adminDocSnap.exists()) {
      // Admin user
      const adminData = adminDocSnap.data();
      return {
        companyId: currentUser,
        companyName: adminData.companyName || "Admin",
        employeeName:adminData.adminName
      };
    } else {
      // Employee user
      const detRef = await getUserCompanyDetails(currentUser);
      const nameRef = await getEmployeeName(currentUser);

      return {
        companyId: detRef?.companyId || '',
        companyName:detRef?.companyName,
        employeeName: nameRef || "Employee"
      };
    }
  } catch (error) {
    console.error("Error fetching company details:", error);
    return {
      isAdmin: false,
      companyId: '',
      employeeName: ''
    };
  }
};
