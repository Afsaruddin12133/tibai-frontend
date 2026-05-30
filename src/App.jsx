import AppRoutes from './routes/AppRoutes';
import { SessionProvider } from './context/SessionContext';

/**
 * Root Application Component
 * 
 * Sets up global styled resets (antialiased font smoothing) and wraps the entire
 * application routing mechanism in a SessionProvider context, allowing all sub-pages 
 * (like Session, History, and Results) to access live learning data.
 */
function App() {
  return (
    <div className="antialiased text-gray-900 bg-[#F9FAFB] min-h-screen">
      <SessionProvider>
        <AppRoutes />
      </SessionProvider>
    </div>
  );
}

export default App;
