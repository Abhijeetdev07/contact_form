function ContactList({ contacts, onDelete, sortOrder, onSortOrderChange }) {
  const list = Array.isArray(contacts) ? contacts : [];

  function formatDate(value) {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString();
  }

  function handleDeleteClick(contact) {
    const label = contact?.name ? `"${contact.name}"` : 'this contact';
    const ok = window.confirm(`Are you sure you want to delete ${label}?`);
    if (!ok) return;
    onDelete?.(contact);
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Contacts</h2>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sort
          </span>
          <select
            value={sortOrder || 'newest'}
            onChange={(e) => onSortOrderChange?.(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800 outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        Submitted contacts will appear here.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="border-b border-slate-200 px-3 py-2">Name</th>
              <th className="border-b border-slate-200 px-3 py-2">Email</th>
              <th className="border-b border-slate-200 px-3 py-2">Phone</th>
              <th className="border-b border-slate-200 px-3 py-2">Message</th>
              <th className="border-b border-slate-200 px-3 py-2">Date</th>
              <th className="border-b border-slate-200 px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-sm text-slate-600">
                  No contacts yet.
                </td>
              </tr>
            ) : (
              list.map((c) => (
                <tr key={c._id || c.id} className="text-sm text-slate-800">
                  <td className="border-b border-slate-100 px-3 py-2">
                    {c.name}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2">
                    {c.email}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2">
                    {c.phone}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2">
                    {c.message || '-'}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2">
                    {formatDate(c.createdAt)}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(c)}
                      className="rounded-md border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ContactList;
