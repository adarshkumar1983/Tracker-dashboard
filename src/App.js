import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <div> 
    <Container style={{ flex: 1 }} >
      <Row>
        <Col>
          <UserAuthContextProvider>
            <Routes>
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                    
                    <div style={{ width: "100%",}}>
                      <Dashboard />

       
                      
                    </div>
    
                  </ProtectedRoute>
                }

               />

                <Route
                  path="/"
                  element={
                    <div style={{ width: "400px" ,marginTop:"100" }}>
                      <Login />
                    </div>

                  }
               />
              <Route
                path="/signup"
                element={
                  <div style={{ width: "400px" }}>
                    <Signup />
                  </div>
                }
              />
            </Routes>

          </UserAuthContextProvider>

        </Col>

      </Row>

    </Container>
     
 
    </div>
  );
}



export default App;