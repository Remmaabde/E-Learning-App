import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { api } from "../Axios/axios";
import { Link, useNavigate } from "react-router-dom";

const InstructorSidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setProfile(res.data);
      })
      .catch(err => {
  console.error(err);
  const msg = err?.response?.data?.error || err.message || "Failed to fetch profile";
        setError(msg);
    
        try {
          const raw = localStorage.getItem('user');
          if (raw) {
            const u = JSON.parse(raw);
            setProfile(u);
            setError("");
          }
        } catch (e) {
          

            
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/notifications/send",
        { toEmail: targetEmail, title, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Notification sent");
      setTitle(""); setMessage(""); setTargetEmail("");
    } catch (err: any) {
      alert("Failed to send: " + (err?.response?.data?.error || err.message));
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!profile) {
    if (error) {
      return <div className="p-8 text-red-600">Error loading profile: {error}</div>;
    }
    return <div className="p-8">Please login to access the instructor area.</div>;
  }

  if (profile.role !== "instructor") {
    return <div className="p-8 text-red-600">Access denied: instructor only area.</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <div className="flex">
        <div className="fixed right-4 top-24 z-50 bg-white/90 dark:bg-gray-800 p-2 rounded shadow text-xs">
          <div className="font-semibold">Token</div>
          <div className="break-all max-w-xs text-[11px] text-gray-600 dark:text-gray-300">{localStorage.getItem('token') ? localStorage.getItem('token') : 'NO TOKEN'}</div>
        </div>
        <aside className={`transition-all duration-200 bg-gray-100 dark:bg-gray-800 p-4 ${open ? 'w-64' : 'w-16'}`}>
          <button className="mb-4 p-2 bg-gray-200 dark:bg-gray-700 rounded" onClick={() => setOpen(o => !o)}>
            {open ? 'Collapse' : '>'}
          </button>

          <nav className="flex flex-col gap-2">
            <Link to="/instructor/dashboard" className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">{open ? 'Dashboard' : 'D'}</Link>
            <Link to="/instructor/my-courses" className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">{open ? 'My Courses' : 'M'}</Link>
            <Link to="/instructor/create-course" className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">{open ? 'Create Course' : 'C'}</Link>
            <Link to="/instructor/notifications" className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">{open ? 'Notifications' : 'N'}</Link>
            <Link to="/instructor/analytics" className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">{open ? 'Student Analytics' : 'A'}</Link>
            <Link to="/instructor/quizzes" className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">{open ? 'Quizzes' : 'Q'}</Link>
            <Link to="/profile" className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">{open ? 'Profile' : 'P'}</Link>
            <Link to="/assistant" className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">{open ? 'AI Assistant' : 'A'}</Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-4">Instructor Area</h2>
            <div className="mb-6">
              <input
                className="w-full p-2 rounded mb-2"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={async () => {
                try {
                  const res = await api.get(`/search/courses?q=${encodeURIComponent(searchQuery)}`);
                  setSearchResults(res.data || []);
                } catch (e) {
                  console.error(e);
                }
              }}>Search</button>
              <div className="mt-3">
                {searchResults.map(r => (
                  <div key={r._id} className="p-2 border-b">{r.title} - {r.category} - {r.rating}</div>
                ))}
              </div>
            </div>

          <section className="mb-8">
            <h3 className="text-xl mb-2">Send Notification to Student</h3>
            <form onSubmit={handleSend} className="max-w-md">
              <input className="w-full mb-2 p-2 rounded" placeholder="Student email" value={targetEmail} onChange={e => setTargetEmail(e.target.value)} />
              <input className="w-full mb-2 p-2 rounded" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
              <textarea className="w-full mb-2 p-2 rounded" placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-[#310055] text-white rounded">Send</button>
                <button type="button" onClick={() => navigate('/instructor/notifications')} className="px-4 py-2 border rounded">View Notifications</button>
              </div>
            </form>
          </section>

        </main>
      </div>
    </div>
  );
};

export default InstructorSidebar;
