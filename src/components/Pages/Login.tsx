import axios from "axios"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { addUser } from "../../utils/userSlice"
import { useNavigate } from "react-router-dom"

const Login = () => {
    const [email, setEmail] = useState("sarvani@gmail.com")
    const [password, setPassword] = useState("Dhoni@123456")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [isLogedIn, setIsLogedIn] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:3000/login", {
                emailId: email,
                password
            },
                { withCredentials: true })
            if (res?.status === 200) {
                dispatch(addUser(res?.data?.data))
                navigate('/')
            }
        } catch (error) {
            navigate('/login')
            console.log(error)
        }
    }

     const handleSignup = async () => {
        try {
            const res = await axios.post("http://localhost:3000/signup", {
                firstName,
                lastName,
                emailId: email,
                password,
                photoUrl:"https://cdn.vectorstock.com/i/500p/81/62/grey-business-avatar-placeholder-vector-38508162.jpg",
            },
                { withCredentials: true })                
            if (res?.status === 200) {
                dispatch(addUser(res?.data?.data))
                navigate('/profile')
            }
        } catch (error) {
            navigate('/login')
            console.log(error)
        }
    }

    return (
        <>
            <fieldset className="fieldset bg-white border-base-300 rounded-box w-xs border p-4 m-auto">
                <label className="label justify-center text-black text-2xl">{isLogedIn ? "Login" : "Sign Up"}</label>


                {!isLogedIn && <>
                    <label className="label">First Name</label>
                    <input type="text" className="input bg-red-100!" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />

                    <label className="label">Last Name</label>
                    <input type="text" className="input bg-red-100!" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </>}

                <label className="label">Email</label>
                <input type="email" className="input bg-red-100!" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <label className="label">Password</label>
                <input type="password" className="input bg-red-100!" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button className="btn btn-neutral mt-4" onClick={() => isLogedIn?handleLogin():handleSignup()}>{isLogedIn ? "Login" : "Signup"}</button>

                <p onClick={()=>setIsLogedIn((prev:any)=>!prev)} className="cursor-pointer">{isLogedIn?"New User?Create Account":"Existing User?Login"}</p>
            </fieldset>
        </>
    )
}

export default Login