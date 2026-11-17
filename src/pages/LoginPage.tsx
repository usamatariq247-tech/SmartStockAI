import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Link2, Lock, Mail, ScanLine, ShieldCheck, Sparkles } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import { useAuth } from '@/context/AuthContext';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/data/users';
import { cn } from '@/lib/utils';

interface FormErrors {
  email?: string;
  password?: string;
}

const features = [
  { icon: ScanLine, title: 'AI-powered detection', text: 'Real-time camera monitoring of stock and pallets.' },
  { icon: Sparkles, title: 'Demand forecasting', text: 'Predict shortages and overstock before they happen.' },
  { icon: Link2, title: 'Blockchain traceability', text: 'Tamper-proof batch history from supplier to shelf.' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState<'form' | 'demo' | null>(null);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: string, p: string, source: 'form' | 'demo') => {
    setFormError('');
    setLoading(source);
    const result = await login(e, p);
    setLoading(null);
    if (result.ok) navigate(redirectTo, { replace: true });
    else setFormError(result.error ?? 'Unable to sign in.');
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (validate()) void submit(email, password, 'form');
  };

  const handleDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setErrors({});
    void submit(DEMO_EMAIL, DEMO_PASSWORD, 'demo');
  };

  return (
    <div className="flex min-h-full bg-white">
      {/* Brand panel */}
      <div className="relative hidden w-[46%] overflow-hidden bg-navy-800 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

        <Logo className="relative" />

        <div className="relative">
          <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight text-white">
            Smarter warehouses. <span className="text-teal-300">Fully traceable</span> supply chains.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300">
            AI-powered warehouse management and supply chain traceability in one platform.
          </p>

          <ul className="mt-10 space-y-5">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-teal-300">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="text-sm text-slate-300">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-400">© {new Date().getFullYear()} SmartStock AI · Final Year Project</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-surface px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="inline-block rounded-2xl bg-navy-800 px-4 py-3">
              <Logo />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight text-ink">Welcome back</h2>
            <p className="mt-1.5 text-sm text-slate-500">Sign in to manage your warehouse operations.</p>

            {formError && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              <Field label="Email address" htmlFor="email" error={errors.email}>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={cn('input-base pl-11', errors.email && 'input-error')}
                  />
                </div>
              </Field>

              <Field label="Password" htmlFor="password" error={errors.password}>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={cn('input-base pl-11 pr-12', errors.password && 'input-error')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </Field>

              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  Remember me
                </label>
                <button type="button" className="font-medium text-teal-700 hover:text-teal-800">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" size="lg" className="w-full" loading={loading === 'form'} disabled={loading === 'demo'}>
                Sign in
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-400">
              <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
            </div>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full"
              icon={<ShieldCheck className="h-4 w-4 text-teal-600" />}
              loading={loading === 'demo'}
              disabled={loading === 'form'}
              onClick={handleDemo}
            >
              Continue with demo account
            </Button>

            <div className="mt-5 rounded-xl bg-teal-50 px-4 py-3 text-xs leading-relaxed text-teal-900">
              <p className="font-semibold">Demo credentials</p>
              <p className="mt-0.5 font-mono">
                {DEMO_EMAIL} / {DEMO_PASSWORD}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
