import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import ChartComponent from './ChartComponent';
import TableComponent from './TableComponent';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const firebaseConfig = {
    apiKey: "AIzaSyBddNzqwVLCeEEc2q3TJrerASUuawVrN40",
    authDomain: "tracker-a7db9.firebaseapp.com",
    projectId: "tracker-a7db9",
    storageBucket: "tracker-a7db9.appspot.com",
    messagingSenderId: "425135442305",
    appId: "1:425135442305:web:462c10ee1d01aedd778080",
    measurementId: "G-ZHFDC39525"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const database = app.database();


const Dashboard = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activityCount, setActivityCount] = useState(0);


  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const userId = auth.currentUser.uid;
        const snapshot = await database.ref(`activities/${userId}`).once('value');
        const tableDataFromFirebase = snapshot.val();

        if (!tableDataFromFirebase) {
          throw new Error('No data available');
        }

        const transformedData = Object.keys(tableDataFromFirebase).map((key) => {
          const activity = tableDataFromFirebase[key];
          const instances = Object.values(activity.instances);
          const instancesInInterval = instances.filter(instance => {
            const startTime = new Date(instance.startTime);
            return (!startDate || startTime >= startDate) && (!endDate || startTime <= endDate);
          });
          const totalElapsedTime = calculateTotalElapsedTime(instancesInInterval);

          // Find the earliest start time among all instances
          const firstInstanceStartTime = instances.reduce((minStartTime, instance) => {
            const startTime = new Date(instance.startTime);
            return minStartTime ? (startTime < minStartTime ? startTime : minStartTime) : startTime;
          }, null);

          return {
            id: key,
            ...activity,
            instances: instancesInInterval,
            totalElapsedTime: totalElapsedTime,
            startDate: firstInstanceStartTime, 
          };
        });

        setTableData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching table data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchTableData();
      } else {
        console.error('User not logged in.');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [startDate, endDate]); // Listen to changes in startDate and endDate

  const calculateTotalElapsedTime = (instances) => {
    let totalElapsedTime = 0;
    if (instances) {
      instances.forEach((instance) => {
        totalElapsedTime += instance.elapsedTime || 0;
      });
    }
    
    // Convert totalElapsedTime to hours, minutes, and seconds
    const hours = Math.floor(totalElapsedTime / 3600);
    const minutes = Math.floor((totalElapsedTime % 3600) / 60);
    const seconds = totalElapsedTime % 60;
  
    return { hours, minutes, seconds };
  };

  useEffect(() => {
    const fetchActivityCount = async () => {
      try {
        const userId = firebase.auth().currentUser.uid;
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
        const lastWeekTimestamp = lastWeek.getTime();
        
        const snapshot = await firebase.database().ref(`activities/${userId}`).once('value');
        const activities = snapshot.val();

        let activityInstanceCount = 0;
        for (const key in activities) {
          const instances = activities[key].instances || {};
          for (const instanceKey in instances) {
            const instanceTimestamp = instances[instanceKey].timestamp || 0;
            if (instanceTimestamp >= lastWeekTimestamp) {
              activityInstanceCount++;
              break; // Count each activity only once if it has instances within the last 7 days
            }
          }
        }

        setActivityCount(activityInstanceCount);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching activity count:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        fetchActivityCount();
      } else {
        console.error('User not logged in.');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);




  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '20px', color: 'red', fontWeight: 'bold' }}>Error: {error}</div>;
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <div style={{display:"flex",marginTop:"10%",alignItems: 'flex-start'}}>
      <div style={{backgroundColor:"lightgreen", width:"230px", height:"100px",marginRight: '50px', borderRadius:'20px', fontSize: '33px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Total Activities {tableData.length}</div>      
        <div style={{ backgroundColor:"aqua" ,width:"700px ",height:"100px" ,borderRadius:'20px', fontSize: '20px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center',zIndex: '2' }}>
          <label htmlFor="start-date">Start Date:</label>
          <DatePicker id="start-date" selected={startDate} onChange={date => setStartDate(date)} />
          <label htmlFor="end-date">End Date:</label>
          <DatePicker id="end-date" selected={endDate} onChange={date => setEndDate(date)} />
        </div>
        <div style={{backgroundColor:"lightgreen", width:"230px", height:"100px",marginRight: '50px', borderRadius:'20px', fontSize: '30px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center',marginLeft:"20px"}}>
      <h2> {activityCount}</h2>
    </div>
   </div>

      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '20px' }}>
        <div style={{ flex: '6', Width: '500px', marginRight: '20px', overflowY: 'auto', maxHeight: '500px', borderRadius: '0 0 10px 8px' }}>
          <h2 style={{ textAlign: 'center', color: '#e24333', marginBottom: '10px', position: 'sticky', top: '0', backgroundColor: 'white', zIndex: '1' }}>Activity Table</h2>
          <TableComponent tableData={tableData} />
        </div>
        <div style={{ flex: '7', Width: '500px' }}>
          <h2 style={{ textAlign: 'center', color: '#e24333', marginBottom: '20px' }}>Activity Chart</h2>
          <ChartComponent tableData={tableData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;