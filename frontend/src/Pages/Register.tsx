
import { useState } from "react";
import { api } from "../Axios/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
	const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		if (form.password.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}
		try {
			await api.post("/auth/signup", form);
			navigate("/login");
		} catch (err: any) {
			setError(err?.response?.data?.error || "Registration failed");
		}
	};

	return (
		<div  className="min-h-screen flex">
			{/* Left column */}
			<div className="flex-1 flex flex-col items-center justify-center bg-[#310055] text-white p-8">
				<h1 className="font-bold" style={{ fontFamily: 'Kaisei Haruno Umi, serif', fontWeight: 700, fontSize: 64, textAlign: 'center' }}>
					Welcome to DirectEd
				</h1>
				<img
					src="/Images/register.jpg"
					alt="Register"
					className="w-64 h-64 rounded-full object-cover mt-10 shadow-lg"
				/>
			</div>
			{/* Right column */}
			<div className="flex-1 flex flex-col justify-center bg-white p-8 relative">
				<form onSubmit={handleSubmit} className="max-w-md mx-auto w-full">
					<h2 className="text-center font-inter font-bold text-[36px] leading-[100%] mb-4">Register</h2>
					<p className="text-center font-inter text-[24px] font-normal mb-8">Create a new account to get started and enjoy seamless access to our features.</p>
					{error && <div className="text-red-600 text-center mb-2">{error}</div>}
					<label className="block font-inter font-normal text-[20px] leading-[100%] mb-1">Name</label>
					<input
						type="text"
						name="name"
						value={form.name}
						onChange={handleChange}
						required
						className="w-full mb-4 px-5 py-3 rounded-full bg-[#f1e8f8] font-inter text-[20px] font-normal outline-none border-none"
						style={{ borderRadius: 50 }}
					/>
					<label className="block font-inter font-normal text-[20px] leading-[100%] mb-1">Email</label>
					<input
						type="email"
						name="email"
						value={form.email}
						onChange={handleChange}
						required
						className="w-full mb-4 px-5 py-3 rounded-full bg-[#f1e8f8] font-inter text-[20px] font-normal outline-none border-none"
						style={{ borderRadius: 50 }}
					/>
					<label className="block font-inter font-normal text-[20px] leading-[100%] mb-1">Password</label>
					<input
						type="password"
						name="password"
						value={form.password}
						onChange={handleChange}
						minLength={6}
						required
                        placeholder="should be at least 6 characters"
						className="w-full mb-4 px-5 py-3 rounded-full bg-[#f1e8f8] font-inter text-[20px] font-normal outline-none border-none"
						style={{ borderRadius: 50 }}
					/>
					<label className="block font-inter font-normal text-[20px] leading-[100%] mb-1">Role</label>
					<select
						name="role"
						value={form.role}
						onChange={handleChange}
						className="w-full mb-6 px-5 py-3 rounded-full bg-[#f1e8f8] font-inter text-[20px] font-normal outline-none border-none"
						style={{ borderRadius: 50 }}
					>
						<option value="student">Student</option>
						<option value="instructor">Instructor</option>
					</select>
					<button
						type="submit"
						className="w-full py-3 rounded-full bg-[#310055] text-white font-bold text-[20px] mt-2 mb-4"
						style={{ borderRadius: 50 }}
					>
						Register
					</button>
					<div className="text-center mt-2 mb-10 text-[16px] font-inter font-normal">
						<span className="text-black">Do you have an account? </span>
						<Link to="/login" className="text-[#310055] font-inter font-normal underline">Sign in here</Link>
					</div>
				</form>
			
				<div className="absolute left-1/2 transform -translate-x-1/2 flex gap-8 bottom-10">
		
					<a href="#" aria-label="Twitter">
                        <img
                            src="/Images/twitter.png"
                            alt="Twitter"
                            className="w-8 h-8 rounded-full object-cover"
                        />
					</a>
			
					<a href="#" aria-label="Facebook">
						 <img
                            src="/Images/facebook.png"
                            alt="Facebook"
                            className="w-8 h-8 rounded-full object-cover"
                        />
					</a>
					
					<a href="#" aria-label="Apple">
						 <img
                            src="/Images/apple.png"
                            alt="Apple"
                            className="w-8 h-8 rounded-full object-cover"
                        />
					</a>
				</div>
			</div>
		</div>
	);
}
