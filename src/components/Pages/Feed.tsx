import axios from "axios"
import { useDispatch } from "react-redux"
import { removeprevFeed } from "../../utils/feedSlice"

const Feed = ({ feedData }: any) => {
    const dispatch = useDispatch()    

    const connectionacceptreject = async (status: any, _id: any) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL + "/request/send/" + status + "/" + _id}`, {}, {
                withCredentials: true
            })
            if (res?.status === 200) {
                dispatch(removeprevFeed(feedData?._id))
            }
        } catch (error) {
            console.log(error)
        }

    }


    return (
        <>
            <div className="card bg-base-100 w-96 shadow-sm">
                <figure>
                    <img
                        src={feedData?.photoUrl}
                        alt="Shoes"
                        className="w-full h-65"
                    />
                </figure>
                <div className="card-body">
                    <h2 className="card-title items-center">{feedData?.firstName}</h2>
                    <p className="flex items-start">{feedData?.about}</p>
                    <div className="card-actions justify-center">
                        <button className="btn btn-primary cursor-pointer" onClick={() => connectionacceptreject("ignored", feedData?._id)}>Ignore</button>
                        <button className="btn btn-secondary cursor-pointer" onClick={() => connectionacceptreject("interested", feedData?._id)}>Interested</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Feed