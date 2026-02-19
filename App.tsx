import React, { useState } from 'react';
import { DataService } from './services/dataService';
import { Participant, UserRole } from './types';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { Button } from './components/ui/Button';
import { Zap, LogOut, Shield, User } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [loginInput, setLoginInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const performLogin = async (username: string) => {
    setIsLoading(true);
    try {
        const user = await DataService.login(username);
        if (user) {
            setCurrentUser(user);
        } else {
            alert("Usuário não encontrado.");
        }
    } catch (err) {
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) return;
    performLogin(loginInput);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginInput('');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold-600/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-ink-800/50 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-md bg-ink-900 border border-ink-800 p-8 rounded-2xl shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/10 text-gold-500 mb-4 border border-gold-500/20">
                <Zap className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Ink Consortium</h1>
            <p className="text-gray-400">Gerencie sua tattoo dos sonhos.</p>
          </div>

          <div className="space-y-6">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Acesso (Nome ou Email)</label>
                  <input
                    type="text"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="Digite seu nome..."
                    className="w-full bg-ink-950 border border-ink-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-gray-600"
                  />
                </div>
                <Button 
                    type="submit" 
                    className="w-full py-3 text-lg font-bold" 
                    isLoading={isLoading}
                >
                  Entrar
                </Button>
              </form>

              <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-ink-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-ink-900 text-gray-500">Acesso Rápido (Demo)</span>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => performLogin('admin')}
                    className="text-sm py-3"
                    isLoading={isLoading}
                  >
                    <Shield className="w-4 h-4 text-gold-500" />
                    Sou Tatuador
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => performLogin('Jean')}
                    className="text-sm py-3"
                    isLoading={isLoading}
                  >
                    <User className="w-4 h-4 text-blue-400" />
                    Sou Cliente
                  </Button>
              </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 text-gray-200 font-sans selection:bg-gold-500 selection:text-black">
      {/* Sidebar / Navbar Mobile */}
      <nav className="fixed top-0 left-0 right-0 bg-ink-900/80 backdrop-blur-md border-b border-ink-800 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="bg-gold-500 text-black p-1.5 rounded">
                    <Zap className="w-5 h-5" />
                </div>
                <span className="font-display font-bold text-lg text-white tracking-wide">INK CONSORTIUM</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                    <p className="text-sm font-bold text-white">{currentUser.name}</p>
                    <p className="text-xs text-gold-500 uppercase tracking-wider">{currentUser.role}</p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="p-2 hover:bg-ink-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto">
        {currentUser.role === UserRole.ADMIN ? (
            <AdminDashboard />
        ) : (
            <UserDashboard user={currentUser} />
        )}
      </main>
    </div>
  );
};

export default App;