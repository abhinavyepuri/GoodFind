import * as React from 'react';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    isLoading,
  } = useAuthStore();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (isAuthModalOpen) {
      setError('');
    }
  }, [isAuthModalOpen, authModalTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (authModalTab === 'register') {
      const res = await register({
        email: cleanEmail,
        password,
        name: name.trim() || cleanEmail.split('@')[0],
        phone: phone.trim(),
      });
      if (!res.success) {
        setError(res.error || 'Failed to create account.');
      }
    } else {
      const res = await login(cleanEmail, password);
      if (!res.success) {
        setError(res.error || 'Invalid email or password.');
      }
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <div className="relative">
        <DialogClose onClose={closeAuthModal} />

        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-extrabold text-xs tracking-widest text-primary uppercase">
              GOODFIND STORE
            </span>
          </div>
          <DialogTitle>
            {authModalTab === 'login' ? 'Sign In to Your Account' : 'Create Your GoodFind Account'}
          </DialogTitle>
          <DialogDescription>
            {authModalTab === 'login'
              ? 'Access your saved addresses, live order tracking, and express checkout.'
              : 'Join to save your shipping details, track deliveries, and unlock express 1-click checkout.'}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-muted p-1 my-4">
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('login');
              setError('');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              authModalTab === 'login'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('register');
              setError('');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              authModalTab === 'register'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalTab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Alexandria Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 h-10 text-xs sm:text-sm bg-muted/40 rounded-xl"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-10 text-xs sm:text-sm bg-muted/40 rounded-xl"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-foreground">Password</label>
              {authModalTab === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Demo account: simply type any 6+ character password or use your registered password.')}
                  className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 h-10 text-xs sm:text-sm bg-muted/40 rounded-xl"
                required
              />
            </div>
          </div>

          {authModalTab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Phone Number <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="tel"
                  placeholder="+1 (555) 234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 h-10 text-xs sm:text-sm bg-muted/40 rounded-xl"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="brand"
            disabled={isLoading}
            className="w-full h-11 rounded-xl text-xs sm:text-sm font-semibold shadow-md mt-2 flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Processing...' : authModalTab === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-5 pt-4 border-t border-border/60 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>Encrypted with 256-bit SSL & bcrypt tokenization</span>
        </div>
      </div>
    </Dialog>
  );
}
export default AuthModal;
