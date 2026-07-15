import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../../utils/connectionSlice";

const Connection = () => {
    const dispatch = useDispatch()
    const connectiondata = useSelector((store: any) => store.connection)

    const allConnection = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/connection`, {
                withCredentials: true
            })
            console.log(res, "connectionres");
            if (res?.status === 200) {
                dispatch(addConnection(res?.data?.data))
            }

        } catch (error) {
            console.log(error);

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
                        <div key={item?._id} className="bg-base-100 shadow-sm flex justify-between p-5 items-center mb-5">
                            <img
                                src={item?.photoUrl}
                                alt="Movie"
                                className="w-25 h-25 rounded-full m-3"
                            />
                            <div className="text-start">
                                <h2 className="card-title">{item?.firstName}</h2>
                                <p>{item?.age}</p>
                                <p>{item?.gender}</p>
                               
                            </div>
                             <div className="card-actions justify-end">
                                    <button className="btn btn-primary">Reject</button>
                                    <button className="btn btn-secondary">Accept</button>
                                </div>

                        </div>
                    )
                })
            }

        </div>
    )
}

export default Connection