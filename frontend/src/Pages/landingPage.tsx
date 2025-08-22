import type { ICourse } from "../types/course";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { api } from "../Axios/axios";

const courseCategories = [
	"UI/UX",
	"Full Stack Development",
	"AI Engineering",
	"FrontEnd DevelopMent",
	"Backend Development",
	"Graphic Design",
	"Prompt Engineering",
	"LLM",
];

const features = [
	{
		icon: (
			// Clock SVG
			<svg
				width="59"
				height="54"
				viewBox="0 0 59 54"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M29.4993 12V27L40.3327 32M56.5827 27C56.5827 40.8071 44.4571 52 29.4993 52C14.5416 52 2.41602 40.8071 2.41602 27C2.41602 13.1929 14.5416 2 29.4993 2C44.4571 2 56.5827 13.1929 56.5827 27Z"
					stroke="#310055"
					stroke-width="3.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		),
		title: "Flexible Learning",
		desc: "Learn at your own pace",
	},
	{
		icon: (
			
			<svg
				width="59"
				height="36"
				viewBox="0 0 59 36"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M0 36V29.7563C0 28.4813 0.348264 27.3 1.04479 26.2125C1.74132 25.125 2.70417 24.3 3.93333 23.7375C4.50694 23.475 5.06007 23.2313 5.59271 23.0063C6.16632 22.7813 6.76042 22.575 7.375 22.3875V36H0ZM9.83333 20.25C7.78472 20.25 6.0434 19.5938 4.60938 18.2813C3.17535 16.9688 2.45833 15.375 2.45833 13.5C2.45833 11.625 3.17535 10.0312 4.60938 8.71875C6.0434 7.40625 7.78472 6.75 9.83333 6.75C11.8819 6.75 13.6233 7.40625 15.0573 8.71875C16.4913 10.0312 17.2083 11.625 17.2083 13.5C17.2083 15.375 16.4913 16.9688 15.0573 18.2813C13.6233 19.5938 11.8819 20.25 9.83333 20.25ZM9.83333 15.75C10.5299 15.75 11.1035 15.5438 11.5542 15.1313C12.0458 14.6813 12.2917 14.1375 12.2917 13.5C12.2917 12.8625 12.0458 12.3375 11.5542 11.925C11.1035 11.475 10.5299 11.25 9.83333 11.25C9.13681 11.25 8.54271 11.475 8.05104 11.925C7.60035 12.3375 7.375 12.8625 7.375 13.5C7.375 14.1375 7.60035 14.6813 8.05104 15.1313C8.54271 15.5438 9.13681 15.75 9.83333 15.75ZM9.83333 36V29.7C9.83333 28.425 10.1816 27.2625 10.8781 26.2125C11.6156 25.125 12.5785 24.3 13.7667 23.7375C16.3069 22.575 18.8882 21.7125 21.5104 21.15C24.1326 20.55 26.7958 20.25 29.5 20.25C32.2042 20.25 34.8674 20.55 37.4896 21.15C40.1118 21.7125 42.6931 22.575 45.2333 23.7375C46.4215 24.3 47.3639 25.125 48.0604 26.2125C48.7979 27.2625 49.1667 28.425 49.1667 29.7V36H9.83333ZM14.75 31.5H44.25V29.7C44.25 29.2875 44.1271 28.9125 43.8812 28.575C43.6764 28.2375 43.3896 27.975 43.0208 27.7875C40.8083 26.775 38.5753 26.025 36.3219 25.5375C34.0684 25.0125 31.7944 24.75 29.5 24.75C27.2056 24.75 24.9316 25.0125 22.6781 25.5375C20.4247 26.025 18.1917 26.775 15.9792 27.7875C15.6104 27.975 15.3031 28.2375 15.0573 28.575C14.8524 28.9125 14.75 29.2875 14.75 29.7V31.5ZM29.5 18C26.7958 18 24.4809 17.1188 22.5552 15.3562C20.6295 13.5937 19.6667 11.475 19.6667 9C19.6667 6.525 20.6295 4.40625 22.5552 2.64375C24.4809 0.881251 26.7958 0 29.5 0C32.2042 0 34.5191 0.881251 36.4448 2.64375C38.3705 4.40625 39.3333 6.525 39.3333 9C39.3333 11.475 38.3705 13.5937 36.4448 15.3562C34.5191 17.1188 32.2042 18 29.5 18ZM29.5 13.5C30.8521 13.5 31.9993 13.0688 32.9417 12.2063C33.925 11.3063 34.4167 10.2375 34.4167 9C34.4167 7.7625 33.925 6.7125 32.9417 5.85C31.9993 4.95 30.8521 4.5 29.5 4.5C28.1479 4.5 26.9802 4.95 25.9969 5.85C25.0545 6.7125 24.5833 7.7625 24.5833 9C24.5833 10.2375 25.0545 11.3063 25.9969 12.2063C26.9802 13.0688 28.1479 13.5 29.5 13.5ZM49.1667 20.25C47.1181 20.25 45.3767 19.5938 43.9427 18.2813C42.5087 16.9688 41.7917 15.375 41.7917 13.5C41.7917 11.625 42.5087 10.0312 43.9427 8.71875C45.3767 7.40625 47.1181 6.75 49.1667 6.75C51.2153 6.75 52.9566 7.40625 54.3906 8.71875C55.8247 10.0312 56.5417 11.625 56.5417 13.5C56.5417 15.375 55.8247 16.9688 54.3906 18.2813C52.9566 19.5938 51.2153 20.25 49.1667 20.25ZM49.1667 15.75C49.8632 15.75 50.4368 15.5438 50.8875 15.1313C51.3792 14.6813 51.625 14.1375 51.625 13.5C51.625 12.8625 51.3792 12.3375 50.8875 11.925C50.4368 11.475 49.8632 11.25 49.1667 11.25C48.4701 11.25 47.876 11.475 47.3844 11.925C46.9337 12.3375 46.7083 12.8625 46.7083 13.5C46.7083 14.1375 46.9337 14.6813 47.3844 15.1313C47.876 15.5438 48.4701 15.75 49.1667 15.75ZM51.625 36V22.3875C52.2396 22.575 52.8132 22.7813 53.3458 23.0063C53.9194 23.2313 54.4931 23.475 55.0667 23.7375C56.2958 24.3 57.2587 25.125 57.9552 26.2125C58.6517 27.3 59 28.4813 59 29.7563V36H51.625Z"
					fill="#1D1B20"
				/>
			</svg>
		),

		title: "Global Community",
		desc: "Connect with learners worldwide",
	},
	{
		icon: (
			<img
				src="/Images/Teacher.png"
				alt="Teacher"
				className="w-14 h-14 object-contain"
			/>
		),
		title: "Expert Teacher",
		desc: "Learn from professionals",
	},
	{
		icon: (
			
			<img
				src="/Images/certificate.png"
				alt="Certificate"
				className="w-14 h-14 object-contain"
			/>
		),
		title: "Certification",
		desc: "Get certified",
	},
];






type PlatformStats = {
	totalCourses: number;
	totalStudents: number;
	totalInstructors: number;
};

export default function LandingPage() {
	const [stats, setStats] = useState<PlatformStats | null>(null);
	
	useEffect(() => {
		api.get("/platform/stats").then(res => setStats(res.data)).catch(() => setStats(null));
	}, []);
	type Testimonial = { name: string; text: string; stars: number; avatar: string };
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
	const [testimonialIndex, setTestimonialIndex] = useState(0);
	const [newTestimonial, setNewTestimonial] = useState({ name: "", text: "", stars: 5, avatar: "" });
	const visibleTestimonials = testimonials.slice(testimonialIndex, testimonialIndex + 3);
	const canPrev = testimonialIndex > 0;
	const canNext = testimonialIndex + 3 < testimonials.length;


	useEffect(() => {
		api.get("/testimonials").then(res => setTestimonials(res.data)).catch(() => setTestimonials([]));
	}, []);

	
	const handleTestimonialChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		setNewTestimonial({ ...newTestimonial, [e.target.name]: e.target.value });
	};

	const handleTestimonialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const res = await api.post("/testimonials", newTestimonial);
			setTestimonials([...testimonials, res.data]);
			setNewTestimonial({ name: "", text: "", stars: 5, avatar: "" });
		} catch {
			alert("Failed to submit testimonial");
		}
	};


			const [courses, setCourses] = useState<ICourse[]>([]);
		const [showAllCourses, setShowAllCourses] = useState(false);

		// Fetch all courses from backend on mount
		useEffect(() => {
			api.get("/courses").then(res => setCourses(res.data)).catch(() => setCourses([]));
			setShowAllCourses(true);
		}, []);

		const handleAllCourses = async () => {
	
			try {
				const res = await api.get("/courses");
				setCourses(res.data);
				setShowAllCourses(true);
			} catch (err) {
				alert("Failed to fetch all courses");
			}
		};

		return (
		<div className="bg-[#F9F0FF] dark:bg-gray-900 min-h-screen transition-colors duration-300 text-sm">
			<Header />
					{/* Platform Stats */}
					{stats && (
						<div className="flex justify-center gap-8 my-4">
							<div className="bg-[#f2dfff] rounded-lg px-6 py-2 text-lg font-bold text-[#310055]">Total Courses: {stats.totalCourses}</div>
							<div className="bg-[#f2dfff] rounded-lg px-6 py-2 text-lg font-bold text-[#310055]">Total Students: {stats.totalStudents}</div>
							<div className="bg-[#f2dfff] rounded-lg px-6 py-2 text-lg font-bold text-[#310055]">Total Instructors: {stats.totalInstructors}</div>
						</div>
					)}
					{/* Hero Section */}
			<section
				id="home"
				className="flex flex-col lg:flex-row items-center justify-between px-4 lg:px-12 pt-8 pb-4"
			>
				{/* Left Column */}
				<div className="flex-1 flex flex-col gap-2 mt-2">
					<span className="text-[48px] font-inter font-normal leading-[100%] tracking-[0] text-black dark:text-white">
						DirectEd
					</span>
					<span className="text-[48px] font-inter font-normal leading-[100%] tracking-[0] text-black dark:text-white">
						Empowering
					</span>
					<span className="text-[48px] font-inter font-normal leading-[100%] tracking-[0] text-black dark:text-white">
						Minds, Shaping
					</span>
					<span className="text-[48px] font-inter font-normal leading-[100%] tracking-[0] text-black dark:text-white">
						Futures
					</span>
					<p className="mt-6 text-[24px] font-inter font-normal leading-[100%] tracking-[0] text-black dark:text-white max-w-xl">
						Learn from expert instructors, earn certificates, and get AI-powered
						support all in one accessible, easy-to-use platform built for students
						and educators.
					</p>
					<div className="flex items-center gap-4 mt-8">
						
						<div className="flex -space-x-4">
							<img
								src="/Images/User1.jpg"
								alt="user1"
								className="w-14 h-14 rounded-full border-4 border-black dark:border-gray-900"
							/>
							<img
								src="/Images/User2.jpg"
								alt="user2"
								className="w-14 h-14 rounded-full border-4 border-black dark:border-gray-900"
							/>
							<img
								src="/Images/User3.jpg"
								alt="user3"
								className="w-14 h-14 rounded-full border-4 border-black dark:border-gray-900"
							/>
							<img
								src="/Images/User4.jpg"
								alt="user4"
								className="w-14 h-14 rounded-full border-4 border-black dark:border-gray-900"
							/>
						</div>
						<span className="ml-6 text-[24px] font-inter font-normal leading-[100%] tracking-[0] text-black dark:text-white">
							Trusted by over 300K+ students
						</span>
					</div>
				</div>
			
				<div className="flex-1 flex justify-center mt-10 lg:mt-2">
					<img
						src="/Images/community.jpg"
						alt="Community"
						className="w-[500px] max-w-full rounded-3xl shadow-md"
					/>
				</div>
			</section>

	
			<section id="about" className="mt-12 mb-8">
				<h2 className="text-center text-[40px] font-inter font-bold leading-[100%] tracking-[0] text-black dark:text-white mb-10">
					Explore our courses on DirectEd
				</h2>
		
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center mb-12">
					{courseCategories.map((cat) => (
						<div
							key={cat}
							className="flex items-center justify-center w-[230px] h-[230px] rounded-[30px] bg-[#d2b4e9] p-[40px] text-center"
						>
							<span className="font-inter font-semibold text-[30px] leading-[100%] tracking-[0] text-black">
								{cat}
							</span>
						</div>
					))}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 justify-items-center mb-16">
					{features.map((f) => (
						<div
							key={f.title}
							className="flex flex-col items-center w-[250px] h-[160px] rounded-[20px] bg-[#f2dfff] p-4 gap-3"
						>
							{f.icon}
							<span className="font-inter font-semibold text-[24px] leading-[100%] tracking-[0] text-black">
								{f.title}
							</span>
							<span className="font-inter font-normal text-[20px] leading-[100%] tracking-[0] text-black">
								{f.desc}
							</span>
						</div>
					))}
				</div>
			</section>


			<section id="courses" className="mb-8">
				<h2 className="text-center text-[28px] font-inter font-bold leading-[100%] tracking-[0] text-black dark:text-white mb-6">
					Featured Courses
				</h2>
				<div className="flex flex-col lg:flex-row gap-14 justify-center items-stretch mb-6">
					  {courses.map((course, i) => (
						<div
							key={i}
							className="flex flex-col w-[320px] h-[320px] rounded-[10px] bg-[#f2dfff] p-3"
						>
							<img
								src={course.image}
								alt={course.title}
								className="w-[180px] h-[100px] object-cover rounded-lg mb-2"
							/>
							<div className="flex justify-between items-center mb-1">
								<div className="flex items-center gap-1">
				
									<svg
										width="16"
										height="16"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											cx="12"
											cy="12"
											r="11"
											stroke="#AB51E3"
											strokeWidth="2"
										/>
										<path
											d="M12 7v5l4 2"
											stroke="#AB51E3"
											strokeWidth="2"
											strokeLinecap="round"
										/>
									</svg>
									<span className="font-inter font-normal text-[10px] leading-[100%] tracking-[0] text-black">
										{course.duration}
									</span>
								</div>
								<div className="flex items-center border bg-[#AB51E3] rounded-[8px] px-3 py-0 w-[85px] h-[30px]">
									<span className="font-inter font-normal text-[12px] leading-[100%] tracking-[0] text-black">
										{course.category}
									</span>
								</div>
							</div>
							<span className="font-inter font-normal text-[14px] leading-[100%] tracking-[0] text-black mb-4">
								{course.title}
							</span>
							<span className="font-inter font-normal text-[12px] leading-[100%] tracking-[0] text-black mb-1">
								{course.description}
							</span>
							<div className="flex justify-between items-center mt-auto">
								<span className="font-inter font-normal text-[10px] leading-[100%] tracking-[0] text-black">
									{course.instructor}
								</span>
								<div className="flex items-center gap-1">
									{[1, 2, 3, 4].map((s) => (
										<svg
											key={s}
											width="12"
											height="12"
											fill="#FFD600"
											viewBox="0 0 24 24"
										>
											<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
										</svg>
									))}
									<svg
										width="12"
										height="12"
										fill="#FFD600"
										viewBox="0 0 24 24"
									>
										<defs>
											<linearGradient id="half">
												<stop
													offset="50%"
													stopColor="#FFD600"
												/>
												<stop
													offset="50%"
													stopColor="#E0E0E0"
												/>
											</linearGradient>
										</defs>
										<path
											d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
											fill="url(#half)"
										/>
									</svg>
									<span className="font-inter font-normal text-[8px] leading-[100%] tracking-[0] text-black ml-1">
										{course.rating}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
						<div className="flex justify-center">
							<button
								className="font-inter font-normal text-[10px] leading-[100%] tracking-[0] text-black border bg-[#AB51E3] rounded-[20px] px-[20px] py-[8px] w-[100px] h-[32px]"
								onClick={handleAllCourses}
								disabled={showAllCourses}
							>
								ALL COURSES
							</button>
						</div>
			</section>

	

			 <section id="testimonials" className="mb-8">
				<div className="flex flex-col lg:flex-row gap-4 justify-center items-stretch">
				 {visibleTestimonials.map((t, idx) => (
					<div
					 key={idx}
					 className="w-[350px] h-[125px] rounded-md border border-gray-300 bg-[#310055] p-4 flex flex-col gap-2"
					>
					 <div className="flex gap-1">
						{[...Array(t.stars)].map((_, i) => (
						 <svg
							key={i}
							width="14"
							height="13"
							fill="#C8BA21"
							viewBox="0 0 24 24"
						 >
							<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
						 </svg>
						))}
					 </div>
					 <span className="font-roboto font-normal text-[12px] leading-[150%] tracking-[0] text-white">
						{t.text}
					 </span>
					 <span className="font-roboto font-bold text-[12px] leading-[150%] tracking-[0] text-white">
						{t.name}
					 </span>
					</div>
				 ))}
				</div>

				<form className="flex flex-col items-center gap-2 mt-6" onSubmit={handleTestimonialSubmit}>
					<input
						type="text"
						name="name"
						placeholder="Your Name"
						value={newTestimonial.name}
						onChange={handleTestimonialChange}
						className="border rounded px-2 py-1"
						required
					/>
					<input
						type="text"
						name="avatar"
						placeholder="Avatar URL (optional)"
						value={newTestimonial.avatar}
						onChange={handleTestimonialChange}
						className="border rounded px-2 py-1"
					/>
					<textarea
						name="text"
						placeholder="Your Testimonial"
						value={newTestimonial.text}
						onChange={handleTestimonialChange}
						className="border rounded px-2 py-1"
						required
					/>
					<select
						name="stars"
						value={newTestimonial.stars}
						onChange={handleTestimonialChange}
						className="border rounded px-2 py-1"
					>
						{[5, 4, 3, 2, 1].map((s) => (
							<option key={s} value={s}>{s} Stars</option>
						))}
					</select>
					<button type="submit" className="bg-[#AB51E3] text-white rounded px-4 py-2 mt-2">Submit Testimonial</button>
				</form>

				<div className="flex justify-center gap-2 mt-2">
				 <button
					className="p-1 rounded-full bg-[#A46FCC] disabled:opacity-50"
					onClick={() =>
					 setTestimonialIndex((i) => Math.max(i - 1, 0))
					}
					disabled={!canPrev}
				 >
					<svg
					 width="18"
					 height="18"
					 fill="none"
					 viewBox="0 0 24 24"
					>
					 <path
						d="M15 18l-6-6 6-6"
						stroke="#fff"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					 />
					</svg>
				 </button>
				 <button
					className="p-1 rounded-full bg-[#A46FCC] disabled:opacity-50"
					onClick={() =>
					 setTestimonialIndex((i) => Math.min(i + 1, testimonials.length - 3))
					}
					disabled={!canNext}
				 >
					<svg
					 width="18"
					 height="18"
					 fill="none"
					 viewBox="0 0 24 24"
					>
					 <path
						d="M9 6l6 6-6 6"
						stroke="#fff"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					 />
					</svg>
				 </button>
				</div>
			 </section>
			<Footer />
		</div>
	);
}