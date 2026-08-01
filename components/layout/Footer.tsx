export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 text-sm text-slate-600 sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} AI Personal Blog</p>
      </div>
    </footer>
  );
}
