'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import bcrypt from 'bcryptjs';
import { requestPasswordResetAction, signupAction, verifyCodeAction } from '@/actions/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

export default function AuthModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [enteredCode, setEnteredCode] = useState("");
  const { isAuthModalOpen, authMode, closeAuthModal, openAuthModal } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (authMode === 'login') {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("locked")) {
          alert("Your account is temporarily locked. Please try again in 15 minutes.");
        } else {
          alert("Invalid email or password");
        }
      } else {
        closeAuthModal();
        window.location.reload();
      }
    } else {
      // Signup - call server action
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);

      const result = await signupAction(formData);

      if (result.success) {
        setStep('verify');
      } else {
        alert(result.error || "Failed to start signup");
      }
    }

    setIsLoading(false);
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('code', enteredCode);
    formData.append('password', password);
    formData.append('name', name);

    const result = await verifyCodeAction(formData);

    if (result.success) {
      alert("Signup successful! You can now log in.");
      setStep('form');
      openAuthModal('login');
    } else {
      alert(result.error || "Failed to verify code");
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);

      await requestPasswordResetAction(formData);
      alert("If an account exists, a reset link has been sent to your email.");
      openAuthModal('login');
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="sm:max-w-md">
        {/* <DialogHeader>
          <DialogTitle>
            {authMode === 'login' ? 'Welcome back' : 'Create account'}
          </DialogTitle>
        </DialogHeader> */}

        <div className="flex justify-center">
          <div className="hidden md:flex items-center gap-1.5 rounded-full border border-neutral-200 p-1 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
            <button
              onClick={() => openAuthModal('login')}
              className={`flex items-center gap-1.5 rounded-full px-5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                authMode === 'login'
                  ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className={`flex items-center gap-1.5 rounded-full px-5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                authMode === 'signup'
                  ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Signup
            </button>
          </div>
        </div>
        
      {(step === 'form' && (authMode === 'login' || authMode === 'signup')) && (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          
          {authMode === 'signup' && (
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}

            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          
            <div className="space-y-2">
              <Label>Password</Label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
        
            <Button type="submit" className="w-full hover:cursor-pointer" disabled={isLoading}>
              {isLoading ? "Please wait..." : authMode === 'login' ? "Sign in" : "Create account"}
            </Button>

          {authMode === 'login' && (
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => openAuthModal('forgot')}
                className="text-blue-600 hover:underline hover:cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          )}

        </form>
      )}

      {authMode === 'forgot' && (
        <form onSubmit={handleForgotPassword} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full hover:cursor-pointer" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>

          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="text-sm text-blue-600 hover:underline w-full text-center hover:cursor-pointer"
          >
            Back to login
          </button>
        </form>
      )}

        {step === 'verify' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Enter verification code from email</Label>
              <Input 
                type="text" 
                maxLength={6}
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                required
              />
            </div>
            <Button type="button" onClick={handleVerifyCode} className="w-full hover:cursor-pointer">
              Verify Code
            </Button>
            <button onClick={() => setStep('form')} className="text-sm text-gray-500 hover:underline hover:cursor-pointer block text-center">
              Back to form
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}