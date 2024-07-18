import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import RateChanger from './components/rate';
import DataTable from './components/userTable';
import SignInSide from './components/auth';
import MessagesForm from './components/singleMessages';
import SellPMTable from './components/sellPM';
import BuyPMSellTable from './components/buyPM';
import { AuthProvider, useAuth } from './context/authContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/" />;
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<SignInSide />} />
          <Route path='/users' element={<PrivateRoute element={App} Component={DataTable} />} />
          <Route path='/rate' element={<PrivateRoute element={App} Component={RateChanger} />} />
          <Route path='/messages' element={<PrivateRoute element={App} Component={MessagesForm} />} />
          <Route path='/sellpm' element={<PrivateRoute element={App} Component={SellPMTable} />} />
          <Route path='/buypm' element={<PrivateRoute element={App} Component={BuyPMSellTable} />} />
        </Routes>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
