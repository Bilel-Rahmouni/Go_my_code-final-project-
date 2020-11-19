import React, { useState } from 'react'
import loginImg from '../../assets/signin.svg'
import './style.css'
import {Link, useHistory} from 'react-router-dom'


const SignIn = () => {

  const[email,setEmail] =useState("");
  const[password,setPassword] =useState("");
  const[message,setMessage] = useState("")
  const history = useHistory()  
  const PostData = ()=>{
      fetch('/api/token',{
          method: "POST", 
          headers: {
              "Content-Type": "application/json"
          }, 
          body: JSON.stringify({
              email,
              password
          })
      }).then(res=> res.json())
      .then(data=>{
          if(data.error){
            setMessage(data.error)
          }
          else{
              localStorage.setItem("jwt",data.token)
              history.push('/')
             
          }
      })

  }

  const handleSubmit = (e) =>{
      e.preventDefault();
      PostData()
  }

    return (
        <div className="base-container">
        <div className="header">Sign In</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} alt="signin-img" />
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="email">email</label>
              <input type="text" name="email" placeholder="email" onChange={(e)=>{setEmail(e.target.value)}} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" placeholder="password" onChange={(e)=>{setPassword(e.target.value)}} />
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="button" className="btn" onClick={(e)=>{handleSubmit(e)}}>
            Sign In
          </button>
          {message && (<h3>{message}</h3>)}
          <h3><Link to="/register">you don't have an account?</Link></h3>
        </div>
      </div>
    )
}

export default SignIn
