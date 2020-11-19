import React,{useEffect} from 'react';
import './App.css';
import {SignIn, Register,Home} from './Components/index'
import {Route, useHistory}from 'react-router-dom'

function App() {
  const history = useHistory()

  useEffect(()=>{
    const token =localStorage.getItem("jwt")
    if(!token){
        history.push('/signin')
      }
  },[])

  
  return (
      <div className="App">
        <div className="login">
        <Route exact path="/" component={Home} />
          <Route path="/signin" component={SignIn} />
          <Route  path="/register" component={Register} />

        </div>
        </div>
  );
}

export default App;
