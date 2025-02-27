
import { BrowserRouter,Route, Router, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/index.jsx';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer/>
      <BrowserRouter>
          <Routes>
            <Route path ='/' element = {<Signup/>} />
            <Route  path ='/dashboard' element = {<Dashboard/>}/>
          </Routes>
      </BrowserRouter>
    </>
  
  );
}

export default App;
