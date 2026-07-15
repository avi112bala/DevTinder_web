import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../../utils/requestSlice";

const RequestReceive = () => {
    const dispatch = useDispatch()
    const connectiondata = useSelector((store: any) => store.request)

    const allConnection = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/request/received`, {
                withCredentials: true
            })            
            if (res?.status === 200) {
                dispatch(addRequest(res?.data?.data))
            }

        } catch (error) {
            console.log(error);
        }
    }

    const connectionacceptreject=async(status:any,_id:any)=>{
      try {
          const res =await axios.post(`${import.meta.env.VITE_BASE_URL+"/request/review/"+status+"/"+_id}`,{},{
            withCredentials:true
        })
        if(res?.status===200){
            dispatch(removeRequest(_id))
        }

      } catch (error) {
        console.log(error)
      }
        
    }

    useEffect(() => {
        allConnection()
    }, [])
    return (
        <div className="w-1/2 m-auto gap-4 my-10 overflow-x-auto h-screen">
            {
                connectiondata?.map((item: any) => {
                    return (
                        <div key={item?._id} className="bg-base-100 shadow-sm flex justify-between p-5 items-center mb-4">
                            <img
                                src={item?.fromUserId?.photoUrl}
                                alt="Movie"
                                className="w-25 h-25 rounded-full m-3"
                            />
                            <div className="text-start">
                                <h2 className="card-title">{item?.fromUserId?.firstName}</h2>
                                <p>{item?.fromUserId?.age}</p>
                                <p>{item?.fromUserId?.gender}</p>
                               
                            </div>
                             <div className="card-actions justify-end">
                                    <button className="btn btn-primary" onClick={()=>connectionacceptreject("rejected",item?._id)}>Reject</button>
                                    <button className="btn btn-secondary" onClick={()=>connectionacceptreject("accepted",item?._id)}>Accept</button>
                                </div>

                        </div>
                    )
                })
            }

        </div>
    )
}

export default RequestReceive