import axios from "axios";
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import { addUser, removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { useEffect } from "react";

const NavBar = () => {
    const user = useSelector((store: any) => store.user)
    const dispatch = useDispatch()
    const Navigate = useNavigate()

    const logout = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/logout`, null, {
                withCredentials: true
            })
            if (res?.status === 200) {
                dispatch(removeUser(null))
                dispatch(removeFeed(null))
                Navigate("/login")
            }
        } catch (error) {
            console.log(error)
        }

    }

    const handleclick = () => {
        if (user) {
            Navigate("/")
        } else {
            Navigate("/login")
        }
    }

    const fetchUSer = async () => {
        try {

            const res = await axios.get('http://localhost:3000/profile', {
                withCredentials: true
            })
            if (res?.status === 200) {
                dispatch(addUser(res?.data?.data))

            }
        } catch (error) {
            console.log(error);
            Navigate("/login")
        }
    }

    useEffect(() => {
        fetchUSer()
    }, [])
    return (
        <>
            <div className="navbar bg-neutral shadow-sm">
                <div className="flex-1 cursor-pointer" onClick={handleclick}>
                    Dev Tinder
                </div>
                <div className="flex gap-2 items-center justify-center">
                    <p>Welcome {user?.firstName}</p>
                    <div className="dropdown dropdown-end mx-3">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">

                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src={user?.photoUrl ?? "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                            </div>
                        </div>
                        <ul
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>
                                <Link to={"/profile"} className="justify-between">
                                    Profile
                                </Link>
                            </li> 

                            <li>
                                <Link to={"/connection"} className="justify-between">
                                    Connections
                                </Link>
                            </li>
                             <li>
                                <Link to={"/request"} className="justify-between">
                                    Request
                                </Link>
                            </li>
                            <li className="flex items-start cursor-pointer">
                                <button onClick={logout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavBar