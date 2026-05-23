function Header({ onGetStarted }) {
  return (
    <header className="sticky top-0 z-20 border-b-[3px] border-(--line) bg-[rgba(255,253,249,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#home"
          className="inline-flex items-center gap-3 text-lg font-extrabold tracking-tight sm:text-xl"
        >
          <span className="flex h-10 w-10 items-center justify-center border-[3px] border-black bg-(--sun) text-base shadow-[3px_3px_0_0_#111] font-bold">
            SRH
          </span>
          <span className="leading-none font-bold text-xl hidden sm:flex">Student Resource Hub</span>
        </a>
        <nav className="hidden items-center gap-2 rounded-full border-[3px] border-black bg-white px-2 py-2 text-sm font-extrabold uppercase tracking-[0.12em] md:flex">
          <a
            className="rounded-full px-4 py-2 transition hover:bg-(--sun)"
            href="#features"
          >
            Features
          </a>
          <a
            className="rounded-full px-4 py-2 transition hover:bg-(--sky)"
            href="#how-it-works"
          >
            How it works
          </a>
          <a
            className="rounded-full px-4 py-2 transition hover:bg-(--mint)"
            href="#faq"
          >
            Faq
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            className="border-[3px] border-black bg-(--berry) px-4 py-2 text-sm font-bold tracking-[0.12em] shadow-[3px_3px_0_0_#111] transition hover:-translate-y-0.5"
            onClick={onGetStarted}
            type="button"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
