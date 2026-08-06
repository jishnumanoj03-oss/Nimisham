import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, AtSign, Mail, Lock, Camera } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const creatorTypeOptions = [
  { value: 'photographer', label: 'Photographer' },
  { value: 'ai-artist', label: 'AI Artist' },
  { value: 'both', label: 'Both' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    creatorType: '',
  });
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
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (!/^[a-z0-9_]+$/.test(form.username)) errs.username = 'Only lowercase letters, numbers, and underscores';
    else if (form.username.length < 3) errs.username = 'At least 3 characters';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
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
      const { confirmPassword, ...data } = form;
      // Only send creatorType if selected
      if (!data.creatorType) delete data.creatorType;
      await register(data);
      toast.success('Account created! Welcome to Nimisham.');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
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
      <h2 className="font-display text-h2 text-nim-text mb-2">Create your account</h2>
      <p className="text-body text-nim-text-secondary mb-8">
        Join the creative community
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Full Name"
          name="name"
          icon={User}
          placeholder="Your full name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
        />

        <Input
          label="Username"
          name="username"
          icon={AtSign}
          placeholder="choose_a_username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          autoComplete="username"
        />

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
          placeholder="At least 6 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          icon={Lock}
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <Select
          label="Creator Type"
          name="creatorType"
          value={form.creatorType}
          onChange={handleChange}
          options={creatorTypeOptions}
          placeholder="Select your focus (optional)"
          error={errors.creatorType}
        />

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create account
        </Button>
      </form>

      <p className="text-center text-small text-nim-text-secondary mt-8">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-nim-accent hover:text-nim-accent-hover font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
