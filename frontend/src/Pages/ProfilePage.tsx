import { useEffect, useState } from "react";
import { api } from "../Axios/axios";
import { Camera, User, Mail, Shield, Upload } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    
    const storedPreview = localStorage.getItem("profilePicturePreview");
    if (storedPreview) {
      setPreview(storedPreview);
    }
    
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
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setPreview(imageUrl);
      
    
      localStorage.setItem("profilePicturePreview", imageUrl);
      
      
      setMessage("Profile picture updated! It will be saved until you choose a new one.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const getCurrentProfilePic = () => {
  
    return preview || user?.profilePic || "/Images/default-avatar.png";
  };

  const clearProfilePicture = () => {
    setPreview("");
    setImage(null);
    localStorage.removeItem("profilePicturePreview");
    setMessage("Profile picture reset to default.");
    setTimeout(() => setMessage(""), 3000);
  };

  if (!user && !error) return (
    <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
      <div className="bg-[#f2dfff] rounded-lg px-8 py-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AB51E3]"></div>
          <span className="text-[#310055] font-semibold text-lg">Loading profile...</span>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
      <div className="bg-red-50 border border-red-300 rounded-lg px-8 py-6 shadow-lg max-w-md">
        <div className="flex items-center space-x-3">
          <div className="text-red-500">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="text-red-800 font-semibold">Error Loading Profile</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F0FF] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#310055] mb-2">My Profile</h1>
          <p className="text-lg text-gray-600">Manage your account information</p>
        </div>

        
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        
          <div className="bg-gradient-to-r from-[#AB51E3] to-[#310055] px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-[#f2dfff]">
                  <img
                    src={getCurrentProfilePic()}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/Images/default-avatar.png";
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#f2dfff] rounded-full p-2 border-2 border-white">
                  <Camera className="w-4 h-4 text-[#310055]" />
                </div>
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-purple-100 text-sm">{user.email}</p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

        
          <div className="p-8">
          
            <div className="mb-8">
             
              <div className="bg-[#f2dfff] rounded-xl p-6">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="w-20 h-20 rounded-full border-4 border-[#AB51E3] overflow-hidden bg-white">
                    <img
                      src={getCurrentProfilePic()}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/Images/default-avatar.png";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label 
                      htmlFor="profile-upload"
                      className="inline-flex items-center px-6 py-3 bg-[#AB51E3] text-white rounded-full hover:bg-[#310055] transition-colors duration-200 cursor-pointer font-medium"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Choose New Picture
                    </label>
                    {preview && (
                      <button
                        onClick={clearProfilePicture}
                        className="ml-3 inline-flex items-center px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors duration-200 font-medium"
                      >
                        Reset to Default
                      </button>
                    )}
                  </div>
                </div>
                {message && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-green-700 text-sm">{message}</p>
                  </div>
                )}
              </div>
            </div>

          
            <div>
              <h3 className="text-lg font-semibold text-[#310055] mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#f2dfff] rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <User className="w-5 h-5 text-[#AB51E3] mr-2" />
                    <span className="font-medium text-[#310055]">Full Name</span>
                  </div>
                  <p className="text-gray-700 text-lg">{user.name}</p>
                </div>
                
                <div className="bg-[#f2dfff] rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <Mail className="w-5 h-5 text-[#AB51E3] mr-2" />
                    <span className="font-medium text-[#310055]">Email Address</span>
                  </div>
                  <p className="text-gray-700 text-lg">{user.email}</p>
                </div>
                
                <div className="bg-[#f2dfff] rounded-xl p-6 md:col-span-2">
                  <div className="flex items-center mb-3">
                    <Shield className="w-5 h-5 text-[#AB51E3] mr-2" />
                    <span className="font-medium text-[#310055]">Account Role</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#AB51E3] text-white">
                      {user.role}
                    </span>
                    <span className="ml-3 text-gray-600 text-sm">
                      {user.role === 'student' ? 'Access to courses and learning materials' : 
                       user.role === 'instructor' ? 'Can create and manage courses' : 
                       'Full platform administration access'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
}
