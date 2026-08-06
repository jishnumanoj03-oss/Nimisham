import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      toast.error(message);
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-h2 text-nim-text mb-2">Welcome back</h2>
      <p className="text-body text-nim-text-secondary mb-8">
        Log in to your Nimisham account
      </p>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Input
          label="Email"
          name="email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link
            to="/auth/forgot-password"
            className="text-caption text-nim-accent hover:text-nim-accent-hover transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Log in
        </Button>
      </form>

      <p className="text-center text-small text-nim-text-secondary mt-8">
        Don&apos;t have an account?{' '}
        <Link to="/auth/register" className="text-nim-accent hover:text-nim-accent-hover font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
