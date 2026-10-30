function EmptyState({ title, message }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-lg">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-lg font-black text-blue-700">
        -
      </div>
      <p className="text-lg font-black text-slate-950">{title}</p>
      {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
    </div>
  );
}

export default EmptyState;
