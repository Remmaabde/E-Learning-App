import { useState } from "react";
import { api } from "../Axios/axios";
import { Link } from "react-router-dom";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    try {
      const res = await api.post("/auth/request-reset-token", { email });
      console.log("Response data:", res.data); // Debug log
      
      setMessage(res.data.message || "Reset token generated successfully");
      
      // Your backend returns resetToken directly in the response
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
        console.log("Reset token received:", res.data.resetToken); // Debug log
      }
    } catch (err: any) {
      console.error("Error requesting reset token:", err.response?.data); // Debug log
      setError(err?.response?.data?.error || "Failed to request reset token");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!resetToken.trim()) {
      setError("Please enter the reset token");
      return;
    }
    
    if (!newPassword.trim()) {
      setError("Please enter a new password");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      const res = await api.post("/auth/reset-password", { 
        email: email.trim(),
        resetToken: resetToken.trim(), 
        newPassword: newPassword.trim()
      });
      
      console.log("Password reset response:", res.data); // Debug log
      setMessage(res.data.message || "Password reset successful");
      
      // Clear sensitive fields after successful reset
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Error resetting password:", err.response?.data); // Debug log
      setError(err?.response?.data?.error || "Failed to reset password");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(resetToken);
      setMessage("Reset token copied to clipboard!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg" style={{ background: "#FAF5F5" }}>
        <h2 className="text-3xl font-inter font-bold mb-2" style={{ color: "#310055" }}>
          Forgot Password
        </h2>
        <p className="text-sm mb-6" style={{ color: "#000" }}>
          Please enter your email then click request reset token
        </p>
        
        {error && (
          <div className="text-red-600 text-center mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        {message && (
          <div className="text-green-600 text-center mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            {message}
          </div>
        )}
        
        {/* Step 1: Request Reset Token */}
        <form onSubmit={handleRequestToken} className="mb-6">
          <label className="block font-inter text-base mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full mb-4 px-5 py-3 bg-white font-inter text-base outline-none border border-black focus:border-purple-500 transition-colors"
            style={{ borderRadius: 50, borderWidth: 1 }}
            placeholder="Enter your email address"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-full font-bold text-white mt-2 mb-4 hover:opacity-90 transition-opacity"
            style={{ background: "#310055", borderRadius: 50 }}
          >
            Request Reset Token
          </button>
        </form>
        
        {/* Display Reset Token */}
        {resetToken && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center mb-3">
              <span className="text-sm text-black font-semibold">Your reset token:</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 px-3 py-2 bg-white rounded border text-xs font-mono break-all">
                {resetToken}
              </div>
              <button
                type="button"
                onClick={copyToClipboard}
                className="px-3 py-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-600 text-center">
              Copy this token and paste it in the field below
            </p>
          </div>
        )}
        
        {/* Step 2: Reset Password */}
        <form onSubmit={handleResetPassword}>
          <label className="block font-inter text-base mb-1">Reset Token</label>
          <input
            type="text"
            value={resetToken}
            onChange={e => setResetToken(e.target.value)}
            required
            className="w-full mb-4 px-5 py-3 bg-white font-inter text-base outline-none border border-black focus:border-purple-500 transition-colors"
            style={{ borderRadius: 50, borderWidth: 1 }}
            placeholder="Paste your reset token here"
          />
          
          <label className="block font-inter text-base mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            className="w-full mb-4 px-5 py-3 bg-white font-inter text-base outline-none border border-black focus:border-purple-500 transition-colors"
            style={{ borderRadius: 50, borderWidth: 1 }}
            placeholder="Enter new password"
          />
          
          <label className="block font-inter text-base mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="w-full mb-4 px-5 py-3 bg-white font-inter text-base outline-none border border-black focus:border-purple-500 transition-colors"
            style={{ borderRadius: 50, borderWidth: 1 }}
            placeholder="Confirm new password"
          />
          
          <button
            type="submit"
            className="w-full py-3 rounded-full font-bold text-white mt-2 mb-4 hover:opacity-90 transition-opacity"
            style={{ background: "#310055", borderRadius: 50 }}
          >
            Reset Password
          </button>
        </form>
        
        <div className="text-center mt-4">
          <Link to="/login" className="font-inter underline hover:opacity-80 transition-opacity" style={{ color: "#310055" }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}