import { useEffect, useState } from "react";
import { api } from "../Axios/axios";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    if (token) {
      api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          console.log("Profile response:", res.data);
          setUser(res.data);
        })
        .catch(err => {
          console.error("Profile fetch error:", err);
          setError("Failed to load profile: " + (err?.response?.data?.error || err.message));
          setUser(null);
        });
    } else {
      setError("No authentication token found");
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setMessage("");
    const formData = new FormData();
    formData.append("profilePic", image);
    const token = localStorage.getItem("token");
    try {
      await api.post("/auth/upload-profile-pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Profile picture uploaded!");
    } catch (err: any) {
      setMessage("Failed to upload picture");
    }
  };

  if (!user && !error) return <div className="p-8">Loading profile...</div>;
  
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="flex flex-col items-center mb-6">
        <img
          src={preview || user.profilePic || "/Images/default-profile.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border mb-2"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button
          onClick={handleUpload}
          className="mt-2 px-4 py-2 bg-[#310055] text-white rounded-full"
        >
          Upload Picture
        </button>
        {message && <div className="mt-2 text-sm text-green-600">{message}</div>}
      </div>
      <div className="mb-2"><strong>Name:</strong> {user.name}</div>
      <div className="mb-2"><strong>Email:</strong> {user.email}</div>
      <div className="mb-2"><strong>Role:</strong> {user.role}</div>
    </div>
  );
}
