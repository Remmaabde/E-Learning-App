import { useState, useEffect, useRef } from "react";
import { Trash2, Send, AlertTriangle, FileText, BrainCircuit } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

// Define the structure for a message
interface Message {
  sender: 'user' | 'assistant';
  text: string;
  sources?: { source: string; name: string }[];
}

// Define types for dynamic controls
type UserType = "student" | "instructor";
type DifficultyLevel = "beginner" | "intermediate" | "advanced";
type RequestType = "tutoring" | "quiz_generation" | "flashcard_creation";
type TechTrack = "Design" | "Web Development" | "Generative AI";

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for dynamic controls
  const [userType, setUserType] = useState<UserType>("student");
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>("intermediate");
  const [techTrack, setTechTrack] = useState<TechTrack>("Generative AI");

  const sessionIdRef = useRef<string>(uuidv4());
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const textAreaRef = useRef<null | HTMLTextAreaElement>(null);

  // --- API Communication ---
  const sendMessageToApi = async (
    messageText: string,
    requestType: RequestType,
    endpoint: string
  ) => {
    if (!messageText.trim()) return;

    const userMessage: Message = { sender: 'user', text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);
    setError(null);

    // Determine the topic for content generation
    let topic = messageText;
    if (requestType !== 'tutoring') {
      topic = messageText.replace(/^(Generate a quiz on:|Create flashcards on:)\s*/i, '').trim();
    }

    try {
      const API_BASE_URL = "http://127.0.0.1:8000";
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'direct-ed-ai-secret-key-12345', // Replace with your actual API key
        },
        body: JSON.stringify({
          input: {
            input: topic,
            user_type: userType,
            request_type: requestType,
            subject: techTrack, // Use the dynamic techTrack state
            difficulty_level: difficultyLevel
          },
          config: {
            configurable: {
              session_id: sessionIdRef.current,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        sender: 'assistant',
        text: data.output.answer,
        sources: data.output.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      setMessages((prev) => [...prev, { sender: 'assistant', text: `Sorry, something went wrong: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    const messageText = newMessage.trim();
    if (!messageText) return;

    let requestType: RequestType = 'tutoring';
    let endpoint = '/api/assistant/chat/invoke';

    // Check if it's a quick action command
    if (messageText.toLowerCase().startsWith('generate a quiz on:')) {
      requestType = 'quiz_generation';
      endpoint = '/api/assistant/content/generate/invoke';
    } else if (messageText.toLowerCase().startsWith('create flashcards on:')) {
      requestType = 'flashcard_creation';
      endpoint = '/api/assistant/content/generate/invoke';
    }

    sendMessageToApi(messageText, requestType, endpoint);
  };

  const handleQuickAction = (action: 'quiz_generation' | 'flashcard_creation') => {
    const placeholderText = action === 'quiz_generation'
      ? "Generate a quiz on: "
      : "Create flashcards on: ";
    setNewMessage(placeholderText);
    textAreaRef.current?.focus();
  };

  const handleDelete = () => {
    setMessages([]);
    sessionIdRef.current = uuidv4();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-purple-50 rounded-2xl shadow-md p-6 grid grid-cols-4 gap-6 w-full max-w-7xl h-[90vh] mx-auto">

      {/* --- Left Sidebar with Dynamic Controls --- */}
      <div className="col-span-1 flex flex-col h-full">
        <div className="bg-[#A46FCC] rounded-md p-4 flex-1 flex flex-col text-white">
          <div className="bg-white text-black text-base font-[Montserrat] rounded p-2 mb-4">
            Recent Chats
          </div>
          <ul className="text-base space-y-1 overflow-y-auto flex-1 mb-4">
            {messages.filter(m => m.sender === 'user').length > 0 ? (
              messages.filter(m => m.sender === 'user').map((msg, i) => (
                <li key={i} className="truncate p-1 rounded cursor-pointer hover:bg-purple-500">
                  • {msg.text}
                </li>
              ))
            ) : (
              <li>No chats yet...</li>
            )}
          </ul>

          {/* --- Dynamic Controls --- */}
          <div className="space-y-4 font-[Montserrat]">
            <div>
              <label htmlFor="userType" className="block text-sm font-medium mb-1">User Type</label>
              <select
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value as UserType)}
                className="w-full p-2 rounded bg-purple-700 border-purple-500 focus:ring-white focus:border-white"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
            <div>
              <label htmlFor="difficultyLevel" className="block text-sm font-medium mb-1">Difficulty Level</label>
              <select
                id="difficultyLevel"
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value as DifficultyLevel)}
                className="w-full p-2 rounded bg-purple-700 border-purple-500 focus:ring-white focus:border-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label htmlFor="tech_track" className="block text-sm font-medium mb-1">Tech Track</label>
              <select
                id="tech_track"
                value={techTrack}
                onChange={(e) => setTechTrack(e.target.value as TechTrack)}
                className="w-full p-2 rounded bg-purple-700 border-purple-500 focus:ring-white focus:border-white"
              >
                <option value="Generative AI">Generative AI</option>
                <option value="Web Development">Web Development</option>
                <option value="Design">Design</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* --- Main Chat Area --- */}
      <div className="col-span-3 flex flex-col h-full overflow-hidden">
        <div className="w-full flex justify-end items-center gap-4">
          <button onClick={handleDelete}>
            <Trash2 className="w-7 h-7 hover:text-red-700" style={{ color: "#082567" }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto border bg-white border-gray-200 p-6 rounded-lg mt-2 space-y-4">
          {messages.length > 0 ? (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-lg text-base border-l-4 ${msg.sender === 'user' ? 'bg-[#A46FCC] text-white border-purple-700' : 'bg-gray-100 text-[#424242] border-purple-400'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <h4 className="text-xs font-bold mb-1">Sources:</h4>
                      <ul className="text-xs space-y-1">
                        {msg.sources.map((source, idx) => (
                          <li key={idx}>
                            {/* --- FIX IS HERE: Conditionally render the link --- */}
                            {source.source ? (
                              <a href={source.source} target="_blank" rel="noopener noreferrer" className={`underline ${msg.sender === 'user' ? 'hover:text-gray-200' : 'hover:text-gray-500'}`}>
                                {source.name || 'Link'}
                              </a>
                            ) : (
                              <span>{source.name || 'Source'}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-base">No messages yet. Ask a question to begin!</p>
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg border-l-4 border-purple-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- Input Area --- */}
        <div className="mt-4">
          {error && <div className="text-red-500 text-sm mb-2 flex items-center gap-2"><AlertTriangle size={16} /> {error}</div>}
          <div className="flex items-center justify-end gap-2 mb-2 text-sm text-gray-500">
            <button onClick={() => handleQuickAction('quiz_generation')} className="flex items-center gap-1 p-2 rounded-md hover:bg-gray-200">
              <FileText size={14} /> Generate Quiz
            </button>
            <button onClick={() => handleQuickAction('flashcard_creation')} className="flex items-center gap-1 p-2 rounded-md hover:bg-gray-200">
              <BrainCircuit size={14} /> Create Flashcards
            </button>
          </div>
          <div className="flex items-center border-2 border-[#A46FCC] rounded p-2 bg-white">
            <textarea
              ref={textAreaRef}
              placeholder="Type a new message here"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              className="flex-1 resize-none outline-none text-[#424242] p-2 rounded text-base bg-transparent"
              rows={1}
            />
            <button onClick={handleSend} disabled={isLoading} title="Send message">
              <Send className="text-[#A46FCC] w-7 h-7 ml-3 hover:opacity-80 disabled:opacity-50" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
