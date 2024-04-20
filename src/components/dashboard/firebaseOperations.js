

import { database } from '../../firebase'; // Import the database object from firebase.js
import { get, ref, onValue } from 'firebase/database';

const fetchDataFromFirebase = async () => {
  try {
    const dataRef = ref(database, 'forgedata');
    const snapshot = await get(dataRef);
    const data = [];
    snapshot.forEach((childSnapshot) => {
      data.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    return data;
  } catch (error) {
    console.error('Error fetching data from Firebase:', error);
    throw error;
  }
};

export { fetchDataFromFirebase };
