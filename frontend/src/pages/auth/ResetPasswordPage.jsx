import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
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
      await authService.resetPassword(token, form.password);
      setSuccess(true);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-nim-success/10 text-nim-success rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="font-display text-h3 text-nim-text mb-4">Password reset successful</h2>
        <p className="text-body text-nim-text-secondary mb-8">
          Your password has been successfully updated. You can now use it to log in.
        </p>
        <Link to="/auth/login">
          <Button className="w-full">
            Go to login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-h2 text-nim-text mb-2">Create new password</h2>
      <p className="text-body text-nim-text-secondary mb-8">
        Please enter your new password below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <Input
          label="New Password"
          name="password"
          type="password"
          icon={Lock}
          placeholder="At least 6 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          icon={Lock}
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Reset password
        </Button>
      </form>
    </div>
  );
}
