import React,{useState} from 'react'
import signUpImg from '../../assets/signup.svg'
import './style.css'
import {Link} from 'react-router-dom'
import {useHistory} from 'react-router-dom'
const Register = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const history = useHistory()

    const PostData = () =>{
        fetch("/api/signup",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
                email,
                password
            })}).then(res=>res.json())
        .then(data =>{
            if(data.error)
            {
         setMessage(data.error)
    
            }
            else{
                history.push('/signin')
            }
    
        })
    }


    const handleSubmit = (e) =>{
        e.preventDefault();
        PostData()
    }
    return (
        <div className="base-container">
        <div className="header">Register</div>
        <div className="content">
          <div className="image">
            <img src={signUpImg} alt="signup-img"  />
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" value={email} name="email" placeholder="email" onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password"  name="password" placeholder="password" onChange={(e)=>setPassword(e.target.value)}/>
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="button" className="btn" onClick={(e)=>handleSubmit(e)}>
            Register
          </button>
          <h3><Link to="/signin">you aleardy have an account?</Link></h3>
          {message && (<h3>{message}</h3>)}
        </div>
      </div>
    )
}


export default Register
