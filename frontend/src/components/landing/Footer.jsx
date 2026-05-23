function Footer({ onGetStarted }) {
  return (
    <footer className="border-t-[3px] border-[var(--line)] bg-[rgba(255,253,249,0.82)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 text-sm font-medium sm:px-6 lg:flex-row lg:px-8">
        <div>
          <p className="text-lg font-black uppercase tracking-[0.14em]">
            Student Resource Hub
          </p>
          <p className="mt-2 max-w-xl text-black/68">
            A clean landing page for students who need fast access to the right
            resources and a clear path into the dashboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a
            className="underline decoration-2 decoration-black/40 underline-offset-4"
            href="#features"
          >
            Features
          </a>
          <a
            className="underline decoration-2 decoration-black/40 underline-offset-4"
            href="#how-it-works"
          >
            How it works
          </a>
          <a
            className="underline decoration-2 decoration-black/40 underline-offset-4"
            href="#faq"
          >
            FAQ
          </a>
          <button
            className="border-[3px] border-black bg-[var(--mint)] px-4 py-2 font-extrabold uppercase tracking-[0.12em] shadow-[3px_3px_0_0_#111]"
            onClick={onGetStarted}
            type="button"
          >
            Join Free
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
