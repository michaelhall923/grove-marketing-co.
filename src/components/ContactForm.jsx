import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function ContactForm({ title }) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [formErrors, setFormErrors] = useState([]); // array of strings
  const [fieldErrors, setFieldErrors] = useState({}); // { first_name?: string, ... }
  const [errorMessage, setErrorMessage] = useState(''); // network/unknown

  const SITE_KEY = '6LcQruArAAAAAGynM7LD6tBUCEskfVakSKO-sFOi';

  useEffect(() => {
    if (!SITE_KEY || typeof document === 'undefined' || document.querySelector('script[data-recaptcha]')) return;
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = 'true';
    document.head.appendChild(script);
  }, [SITE_KEY]);

  function resetErrors() {
    setFormErrors([]);
    setFieldErrors({});
    setErrorMessage('');
  }

  function firstOf(x) {
    return Array.isArray(x) ? (x[0] ?? '') : (x ?? '');
  }

  function applyZodFlattenErrors(err) {
    const fe = {};
    if (err?.fieldErrors && typeof err.fieldErrors === 'object') {
      for (const [k, v] of Object.entries(err.fieldErrors)) {
        const msg = firstOf(v);
        if (msg) fe[k] = msg;
      }
    }
    setFieldErrors(fe);

    const top = Array.isArray(err?.formErrors) ? err.formErrors.filter(Boolean) : [];
    setFormErrors(top);
  }

  async function getRecaptchaToken(action) {
    if (!SITE_KEY) throw new Error('Missing reCAPTCHA site key');
    if (typeof window === 'undefined') throw new Error('reCAPTCHA is not available');
    // wait until grecaptcha is ready
    await new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(resolve);
      } else {
        // poll briefly if script is still loading
        const start = Date.now();
        const timer = setInterval(() => {
          if (window.grecaptcha && window.grecaptcha.ready) {
            clearInterval(timer);
            window.grecaptcha.ready(resolve);
          } else if (Date.now() - start > 5000) {
            clearInterval(timer);
            resolve(); // proceed; execute will throw if not loaded
          }
        }, 50);
      }
    });
    return await window.grecaptcha.execute(SITE_KEY, { action });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    resetErrors();

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    const payload = {
      first_name: fd.get('first_name')?.toString().trim() || '',
      last_name: fd.get('last_name')?.toString().trim() || '',
      email_address: fd.get('email_address')?.toString().trim() || '',
      phone_number: fd.get('phone_number')?.toString().trim() || '',
      company_name: fd.get('company_name')?.toString().trim() || '',
      notes: fd.get('notes')?.toString().trim() || '',
    };

    // reCAPTCHA v3
    const recaptchaAction = 'contact';
    let recaptchaToken = '';
    try {
      recaptchaToken = await getRecaptchaToken(recaptchaAction);
      if (!recaptchaToken) throw new Error('Failed to get reCAPTCHA token');
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'reCAPTCHA failed. Please refresh and try again.',
      );
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('contact', {
        body: { ...payload, recaptchaToken, recaptchaAction },
      });

      if (error) {
        // Try to extract structured error body from FunctionsHttpError
        let parsed = null;
        try {
          const ctx = error.context;
          if (ctx && typeof ctx.json === 'function') {
            parsed = await ctx.json();
          }
        } catch {
          /* ignore */
        }
        if (parsed?.error && typeof parsed.error === 'object') {
          applyZodFlattenErrors(parsed.error);
          setStatus('error');
          setErrorMessage('');
          return;
        }
        const msg =
          (parsed && typeof parsed.error === 'string' && parsed.error) ||
          error.message ||
          'Submission failed';
        setErrorMessage(msg);
        setStatus('error');
        return;
      }

      if (!data?.ok) {
        if (data?.error && typeof data.error === 'object') {
          applyZodFlattenErrors(data.error);
          setStatus('error');
          setErrorMessage('');
          return;
        }
        setErrorMessage(typeof data?.error === 'string' ? data.error : 'Submission failed');
        setStatus('error');
        return;
      }

      setStatus('success');
      formEl.reset();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  const disabled = status === 'loading';

  return (
    <form
      id="contactForm"
      onSubmit={onSubmit}
      className="relative w-full rounded-xl bg-[#343229] p-4 shadow-[4px_0_0_#0B1F1E,_-4px_0_0_#0B1F1E,_0_4px_0_#0B1F1E] md:bg-transparent md:p-0 md:shadow-none"
      aria-busy={disabled}
      noValidate
    >
      <h3 className="absolute -top-22 right-0 left-0 text-2xl md:-top-32">{title}</h3>
      <h2 className="absolute -top-14 -right-10 -left-10 text-5xl md:-top-24 md:text-6xl">
        CAST US A LINE!
      </h2>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            autoComplete="given-name"
            required
            disabled={disabled}
            aria-invalid={!!fieldErrors.first_name}
            aria-describedby={fieldErrors.first_name ? 'err-first_name' : undefined}
            className={`w-full ${fieldErrors.first_name ? 'border border-red-500' : ''}`}
          />
          {fieldErrors.first_name && (
            <p id="err-first_name" className="mt-1 text-sm text-red-500">
              {fieldErrors.first_name}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            autoComplete="family-name"
            required
            disabled={disabled}
            aria-invalid={!!fieldErrors.last_name}
            aria-describedby={fieldErrors.last_name ? 'err-last_name' : undefined}
            className={`w-full ${fieldErrors.last_name ? 'border border-red-500' : ''}`}
          />
          {fieldErrors.last_name && (
            <p id="err-last_name" className="mt-1 text-sm text-red-500">
              {fieldErrors.last_name}
            </p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email_address"
            placeholder="Email Address"
            autoComplete="email"
            required
            disabled={disabled}
            aria-invalid={!!fieldErrors.email_address}
            aria-describedby={fieldErrors.email_address ? 'err-email_address' : undefined}
            className={`w-full ${fieldErrors.email_address ? 'border border-red-500' : ''}`}
          />
          {fieldErrors.email_address && (
            <p id="err-email_address" className="mt-1 text-sm text-red-500">
              {fieldErrors.email_address}
            </p>
          )}
        </div>

        <div>
          <input
            type="tel"
            name="phone_number"
            placeholder="Phone #"
            autoComplete="tel"
            required
            disabled={disabled}
            aria-invalid={!!fieldErrors.phone_number}
            aria-describedby={fieldErrors.phone_number ? 'err-phone_number' : undefined}
            className={`w-full ${fieldErrors.phone_number ? 'border border-red-500' : ''}`}
          />
          {fieldErrors.phone_number && (
            <p id="err-phone_number" className="mt-1 text-sm text-red-500">
              {fieldErrors.phone_number}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <input
            type="text"
            name="company_name"
            placeholder="Company/Organization"
            autoComplete="organization"
            required
            disabled={disabled}
            aria-invalid={!!fieldErrors.company_name}
            aria-describedby={fieldErrors.company_name ? 'err-company_name' : undefined}
            className={`w-full ${fieldErrors.company_name ? 'border border-red-500' : ''}`}
          />
          {fieldErrors.company_name && (
            <p id="err-company_name" className="mt-1 text-sm text-red-500">
              {fieldErrors.company_name}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <textarea
            name="notes"
            placeholder="Additional Notes"
            rows={5}
            disabled={disabled}
            aria-invalid={!!fieldErrors.notes}
            aria-describedby={fieldErrors.notes ? 'err-notes' : undefined}
            className={`w-full ${fieldErrors.notes ? 'border border-red-500' : ''}`}
          />
          {fieldErrors.notes && (
            <p id="err-notes" className="mt-1 text-sm text-red-500">
              {fieldErrors.notes}
            </p>
          )}
        </div>
      </div>

      {/* Top-level status + form errors */}
      <div className="mt-3 min-h-[1.5rem] space-y-1" aria-live="polite">
        {status === 'success' && (
          <p className="text-green-500">
            Thanks! We got your message and will get back to you shortly.
          </p>
        )}
        {status === 'error' && !!errorMessage && (
          <p className="text-red-500">Error: {errorMessage}</p>
        )}
        {status === 'error' && formErrors.length > 0 && (
          <ul className="list-disc pl-5 text-red-500">
            {formErrors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        )}
      </div>

      <button className="mt-2 w-full" type="submit" disabled={disabled}>
        {status === 'loading' ? 'Sending...' : 'Submit'}
      </button>

      {/* Required attribution when hiding the badge (kept tiny & low-contrast, but visible) */}
      {SITE_KEY && (
        <p className="mt-1 text-[10px] leading-tight text-[#C9C4B5] opacity-60">
          This site is protected by reCAPTCHA and the Google{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Terms of Service
          </a>{' '}
          apply.
        </p>
      )}
    </form>
  );
}
