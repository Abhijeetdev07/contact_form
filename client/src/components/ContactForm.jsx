import { useState } from 'react';

function ContactForm({ onSubmit }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function validate(nextValues) {
    const nextErrors = {};

    const name = (nextValues.name || '').trim();
    const email = (nextValues.email || '').trim();
    const phone = (nextValues.phone || '').trim();
    const message = (nextValues.message || '').trim();

    if (!name) nextErrors.name = 'Name is required';
    if (!phone) nextErrors.phone = 'Phone is required';

    if (!email) {
      nextErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = 'Enter a valid email';
    }

    if (message.length > 200) {
      nextErrors.message = 'Message must be 200 characters or less';
    }

    return nextErrors;
  }

  const currentErrors = validate(values);
  const isFormValid = Object.keys(currentErrors).length === 0;

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (touched[name]) {
        setErrors(validate(next));
      }
      return next;
    });
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => {
      const nextTouched = { ...prev, [name]: true };
      setErrors(validate(values));
      return nextTouched;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSubmitError('');
    setTouched({ name: true, email: true, phone: true, message: true });

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      if (typeof onSubmit === 'function') {
        await Promise.resolve(onSubmit(values));
      }
      setValues({ name: '', email: '', phone: '', message: '' });
      setErrors({});
      setTouched({});
    } catch (err) {
      const message = err?.message || 'Failed to submit contact';
      setSubmitError(message);

      if (err?.fieldErrors && typeof err.fieldErrors === 'object') {
        setErrors((prev) => ({ ...prev, ...err.fieldErrors }));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Add Contact</h2>
      <p className="mt-1 text-sm text-slate-600">
        Fill the details and submit.
      </p>

      {submitError ? (
        <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {submitError}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-3">
        <div>
          <label className="text-sm font-medium text-slate-700">Name</label>
          <input
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-400 ${
              errors.name && touched.name
                ? 'border-rose-300'
                : 'border-slate-300'
            }`}
            placeholder="Your name"
          />
          {errors.name && touched.name ? (
            <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            type="email"
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-400 ${
              errors.email && touched.email
                ? 'border-rose-300'
                : 'border-slate-300'
            }`}
            placeholder="you@example.com"
          />
          {errors.email && touched.email ? (
            <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <input
            name="phone"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            type="number"
            minLength={10}
            maxLength={10}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-400 ${
              errors.phone && touched.phone
                ? 'border-rose-300'
                : 'border-slate-300'
            }`}
            placeholder="0000000000"
          />
          {errors.phone && touched.phone ? (
            <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Message</label>
          <textarea
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={4}
            maxLength={200}
            className={`mt-1 w-full resize-none rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-400 ${
              errors.message && touched.message
                ? 'border-rose-300'
                : 'border-slate-300'
            }`}
            placeholder="Optional message"
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.message && touched.message ? (
              <p className="text-xs text-rose-600">{errors.message}</p>
            ) : (
              <span />
            )}
            <p className="text-xs text-slate-500">
              {values.message.length}/200
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`mt-2 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white ${
            !isFormValid || isSubmitting
              ? 'cursor-not-allowed bg-slate-400'
              : 'bg-slate-900 hover:bg-slate-800'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
