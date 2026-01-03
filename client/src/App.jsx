import { useEffect, useRef, useState } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

function App() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [successBanner, setSuccessBanner] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const bannerTimeoutRef = useRef(null);

  const sortedContacts = [...contacts].sort((a, b) => {
    const aTime = new Date(a?.createdAt || 0).getTime();
    const bTime = new Date(b?.createdAt || 0).getTime();

    if (sortOrder === 'oldest') {
      return aTime - bTime;
    }
    return bTime - aTime;
  });

  async function fetchContacts() {
    setLoadError('');
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/contacts');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to fetch contacts');
      }

      setContacts(Array.isArray(data?.contacts) ? data.contacts : []);
    } catch (err) {
      setLoadError(err?.message || 'Failed to fetch contacts');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  async function handleSubmit(values) {
    const res = await fetch('http://localhost:5000/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = new Error(data?.message || 'Failed to submit contact');
      err.fieldErrors = data?.errors;
      throw err;
    }

    if (data?.contact) {
      setContacts((prev) => [data.contact, ...prev]);
    } else {
      await fetchContacts();
    }

    setDeleteError('');
    setLoadError('');
    setSuccessBanner('Contact submitted successfully.');
    if (bannerTimeoutRef.current) window.clearTimeout(bannerTimeoutRef.current);
    bannerTimeoutRef.current = window.setTimeout(() => {
      setSuccessBanner('');
    }, 1000);
  }

  async function handleDelete(contact) {
    setDeleteError('');
    const id = contact?._id || contact?.id;
    if (!id) return;

    const previous = contacts;
    setContacts((prev) => prev.filter((c) => (c._id || c.id) !== id));

    try {
      const res = await fetch(`http://localhost:5000/api/contacts/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to delete contact');
      }

      setLoadError('');
      setSuccessBanner('Contact deleted successfully.');
      if (bannerTimeoutRef.current) window.clearTimeout(bannerTimeoutRef.current);
      bannerTimeoutRef.current = window.setTimeout(() => {
        setSuccessBanner('');
      }, 1000);
    } catch (err) {
      setContacts(previous);
      setDeleteError(err?.message || 'Failed to delete contact');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">
            Contact Management
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            MERN mini project (Form + List)
          </p>
        </header>

        {loadError ? (
          <div className="mt-6 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {loadError}
          </div>
        ) : null}

        {successBanner ? (
          <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {successBanner}
          </div>
        ) : null}

        {deleteError ? (
          <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {deleteError}
          </div>
        ) : null}

        <main className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
          <div className="lg:col-span-1 xl:col-span-1">
            <ContactForm onSubmit={handleSubmit} />
          </div>

          <div className="lg:col-span-2 xl:col-span-3">
            {isLoading ? (
              <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Contacts</h2>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <span
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
                    aria-hidden="true"
                  />
                  <span>Loading...</span>
                </div>
              </section>
            ) : (
              <ContactList
                contacts={sortedContacts}
                onDelete={handleDelete}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
