import * as React from 'react';
import AppContent from '../components/AppContent';
import Header from '../components/Header';
import logo from '../logo.svg';
import './App.css';
import Login from './Login';
import TokenGenerator from './TokenGenerator';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Header pageTitle="Frontend client connected to Keycloak" logoSrc={logo} />
        <div className="container-fluid">
          <div className="row">
            <div className="col">
             <TokenGenerator/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

// import React, { useState, useEffect } from 'react';
// import AppContent from '../components/AppContent';
// import Header from '../components/Header';
// import logo from '../logo.svg';
// import './App.css';
// import Login from './Login';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import NewLogin from './NewLogin';
// import { useIsAuthenticated } from "@azure/msal-react";
// // import Login from '../msl/Login';
// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
//   const isAuthenticated = useIsAuthenticated();
//   useEffect(() => {
//     const accessToken = localStorage.getItem('accessToken');
//     setIsLoggedIn(!!accessToken);
//   }, []);

//   const handleLoginSuccess = () => {
//     toast.success('Login successful!');
//     setIsLoggedIn(true);
//   };

//   return (
//     <div className="App">
//       <Header pageTitle="Frontend client connected to Keycloak" logoSrc={logo} />
//       <div className="container-fluid">
//       {/* <div>
//       {isAuthenticated ? <p>Logged in!</p> : <Login />}
//     </div> */}
//         {/* <NewLogin/> */}
//         <div className="row">
//           <div className="col">
//             <ToastContainer />
//             {isLoggedIn ? (
//               <AppContent />
//             ) : (
//               <Login onLoginSuccess={handleLoginSuccess} />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;

