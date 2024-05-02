
import React, { useState ,useEffect} from 'react';
import { Navbar, Container, Nav,  } from 'react-bootstrap';
import { useUserAuth } from "../../context/UserAuthContext";

import logo from '../NavBar/health.png';

import { auth, database } from '../../firebase';



const CustomNavbar = () => {

  const { user, logOut } = useUserAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const userRef = database.ref('users/' + userId);
          userRef.on('value', (snapshot) => {
            const data = snapshot.val();
            setUserData(data);
          });
        } else {
          console.log('No user is signed in.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  
    // Clean up function
    return () => {
      // Unsubscribe from Firebase listeners if any
      database.ref().off();
    };
  }, []);
  

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  

  
  return (
    <Navbar bg="dark" variant="dark" fixed="top">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt="Logo"
            src={logo}
            width="50"
            height="50"
            style={{ borderRadius: '50%' }}
            className="d-inline-block align-top"
          />
        </Navbar.Brand>


<Nav className="ml-auto">

<Nav className="ml-auto mr-auto">

    
</Nav>
  {user && (
    <div className="user-info" onClick={toggleDetails}>
      {/* Move expanded-details outside of Nav to make it appear over the navbar */}
      {showDetails && (

        <div 
        style={{
          position: 'absolute',
          top: '100%', /* Position it below the user-info div */
         
          backgroundColor: '#343a40', /* Adjust as needed */
          padding: '10px',
          borderRadius: '10px',
          zIndex: '1000' /* Ensure it appears above other elements */
        }}
        className="expanded-details">
          <p className="text-light mb-1">{user.displayName || user.email}</p>
          <button onClick={logOut} className="btn btn-danger btn-sm">Logout</button>
        </div>
      )}
      
      <img
        src={user.photoURL } 
        // src={user.photoURL || defaultProfilePic} // Use default profile picture if photoURL is missing
        alt="User Photo"
        width="45"
        height="45"
        className="rounded-circle mr-2"
      />
    </div>
  )}
</Nav>

      </Container>
    </Navbar>
  );
};

export default CustomNavbar;


