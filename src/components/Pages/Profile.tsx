import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface ProfileData {
  _id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  about: string;
  photoUrl: string;
  age: string;
  gender: string;
}

const Profile = () => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [emailId, setemailId] = useState("");
  const [about, setabout] = useState("");
  const [photoUrl, setphotoUrl] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setuserId] = useState("");
  const navigate = useNavigate();

  const { data, isError, isLoading } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/profile`, {
        withCredentials: true,
      });
      return res.data.data;
    },
  });

  useEffect(() => {
    if (isError) navigate("/login");
  }, [isError, navigate]);

  // Sync fetched profile into local editable state once it arrives
  useEffect(() => {
    if (!data) return;
    setfirstName(data.firstName ?? "");
    setlastName(data.lastName ?? "");
    setemailId(data.emailId ?? "");
    setabout(data.about ?? "");
    setphotoUrl(data.photoUrl ?? "");
    setAge(data.age ?? "");
    setGender(data.gender ?? "");
    setuserId(data._id ?? "");
  }, [data]);

  const handleProfileUpdate = async () => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/profile/edit`,
        { firstName, lastName, emailId, about, photoUrl, age, gender, userId },
        { withCredentials: true },
      );

      if (res?.status === 200) {
        setMessage(res?.data?.message);
        setTimeout(() => {
          setMessage("");
        }, 2000);
      }
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.message ??
          "Something went wrong. Please try again.")
        : "Something went wrong. Please try again.";
      setError(msg);
      setTimeout(() => setError(""), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-white" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <label className="label justify-center text-white text-2xl mt-1">
        Edit Profile
      </label>
      <div className="flex gap-4 items-center justify-center w-full">
        <div className="bg-white border-base-300 rounded-lg w-xs p-2">
          <label className="label text-start">First Name</label>
          <input
            type="text"
            className="input bg-red-100!"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setfirstName(e.target.value)}
          />

          <label className="label">Last Name</label>
          <input
            type="text"
            className="input bg-red-100!"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setlastName(e.target.value)}
          />

          <label className="label">About</label>
          <input
            type="text"
            className="input bg-red-100!"
            placeholder="About"
            value={about}
            onChange={(e) => setabout(e.target.value)}
          />

          <label className="label">Profile Pic</label>
          <input
            type="text"
            className="input bg-red-100!"
            placeholder="Profile Pic"
            value={photoUrl}
            onChange={(e) => setphotoUrl(e.target.value)}
          />

          <label className="label">Email</label>
          <input
            type="email"
            className="input bg-red-100!"
            placeholder="Email"
            value={emailId}
            onChange={(e) => setemailId(e.target.value)}
          />

          <label className="label">Age</label>
          <input
            type="text"
            inputMode="numeric"
            className="input bg-red-100!"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <label className="label">Gender</label>
          <input
            type="text"
            className="input bg-red-100!"
            placeholder="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />

          <button
            className="btn btn-neutral mt-4"
            onClick={handleProfileUpdate}
          >
            Update Profile
          </button>
        </div>

        <div className="bg-base-300 w-xs p-2">
          <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
              <img
                src={photoUrl}
                alt={`${firstName}'s profile`}
                className="w-full h-65 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title items-center">{firstName}</h2>
              <p className="flex items-start">About: {about}</p>
              <p className="flex items-start">Email: {emailId}</p>
              <p className="flex items-start">Age: {age}</p>
              <p className="flex items-start">Gender: {gender}</p>
              <div className="card-actions justify-center">
                <button className="btn btn-primary">Ignore</button>
                <button className="btn btn-secondary">Interested</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="toast toast-top toast-end">
        {message && (
          <div className="alert alert-success">
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
