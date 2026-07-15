import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import Feed from "./components/Pages/Feed";
import { addfeed } from "./utils/feedSlice";

const Body = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userdata = useSelector((store: any) => store.user)
    const feedData=useSelector((store:any)=>store.feed)
    


    const fetchFeed = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/feed`, {
                withCredentials: true
            })
            dispatch(addfeed(res?.data?.user))
        } catch (error) {
            console.log(error);
            navigate("/login")
        }
    }
    

    useEffect(() => {
            fetchFeed()
    }, [])
    return (
        <>
            <NavBar />
           {userdata&&window.location.pathname==="/"&& <div className="flex item-center justify-center my-2">
                <Feed feedData={feedData?.[0]}/>
            </div>}
            <Outlet />
            <Footer />
        </>
    )
}


export default Body;