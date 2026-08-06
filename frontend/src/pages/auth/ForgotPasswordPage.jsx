import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email format');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to process request';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-nim-success/10 text-nim-success rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="font-display text-h3 text-nim-text mb-4">Check your email</h2>
        <p className="text-body text-nim-text-secondary mb-8">
          If an account exists for <span className="font-medium text-nim-text">{email}</span>, we've sent instructions to reset your password.
        </p>
        <Link to="/auth/login">
          <Button variant="secondary" className="w-full">
            Return to login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link 
        to="/auth/login"
        className="inline-flex items-center gap-2 text-small text-nim-text-muted hover:text-nim-text transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to login
      </Link>
      
      <h2 className="font-display text-h2 text-nim-text mb-2">Reset password</h2>
      <p className="text-body text-nim-text-secondary mb-8">
        Enter your email address and we'll send you instructions to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <Input
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          error={error}
          autoComplete="email"
        />

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Send reset link
        </Button>
      </form>
    </div>
  );
}
