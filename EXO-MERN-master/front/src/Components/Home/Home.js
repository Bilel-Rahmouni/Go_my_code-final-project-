import React,{useState} from 'react'
import './home.css'
import {useHistory} from 'react-router-dom'
import Modal from 'react-modal'
Modal.setAppElement('#root')
const Home = () => {

    const [data,setData] = useState('')
    const[message,setMessage] = useState("")
    const[modalView,setModalView] = useState(false)
    const history = useHistory()

    const PostData = () =>{
        fetch("/api/justify",{
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                "authorization" : localStorage.getItem("jwt")
            }, 
            body: data 
        }).then(response => response.text())
        .then(result =>{setMessage(result)
            setModalView(true)
        }).catch(error => console.log('error', error));
          
        
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
       PostData()

    }
    return (
    
        <div className="container">
            <button className="signOut-btn" onClick={()=>{
                localStorage.removeItem('jwt')
               history.push('/signin')}}>Sign Out</button>
            <div className="label">
            <label>Enter your text to justify</label>
            </div>
            <textarea placeholder="Remember, be nice!" cols="60" rows="30" onChange={(e)=>{setData(e.target.value)}}/>
            <button onClick={(e)=>{handleSubmit(e) }}>Justify <span role="img">🧑🏽‍💻</span></button>

            <Modal isOpen={modalView} onRequestClose={()=>{setModalView(!modalView)}}>
                <h1>{message == "Payment Required" ? "You must pay to access this feature" : "The justified Text"}</h1>
       <pre>
           {message}
       </pre>
       
       <button onClick={()=>{setModalView(!modalView)}}>Close</button>
     </Modal>
        </div>
      
    )
}

export default Home
