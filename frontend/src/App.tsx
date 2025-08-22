
import { ThemeProvider } from "./context/ThemeContext";

import LandingPage from "./Pages/landingPage";



function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        
        <main className="flex-1">
          <LandingPage />
        </main>
    
      </div>
    </ThemeProvider>
  );
}

export default App;