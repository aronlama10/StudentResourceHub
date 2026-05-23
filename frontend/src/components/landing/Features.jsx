const FEATURES = [
  {
    title: "Simple sign-in gate",
    text: "Users must log in or register before they reach the dashboard.",
  },
  {
    title: "Student-first uploads",
    text: "The dashboard is built around notes, question papers, templates, and PDFs.",
  },
  {
    title: "NeoBrutalist layout",
    text: "Bold borders, offset shadows, and responsive cards keep the page sharp.",
  },
];

function Features() {
  return (
    <section id="features" className="scroll-mt-24 pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-black/55">
            Features
          </p>
          <h2 className="max-w-2xl text-3xl font-black tracking-[-0.03em] sm:text-4xl">
            Built for a focused student journey
          </h2>
        </div>
        <span className="hidden border-[3px] border-black bg-[var(--mint)] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] shadow-[3px_3px_0_0_#111] md:inline-flex">
          Login first, dashboard after
        </span>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {FEATURES.map((item) => (
          <div
            key={item.title}
            className="border-[3px] border-black bg-[var(--card)] p-6 shadow-[5px_5px_0_0_#111] transition hover:-translate-y-1"
          >
            <span className="inline-flex border-[2px] border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] shadow-[2px_2px_0_0_#111]">
              Section
            </span>
            <h3 className="mt-4 text-xl font-black tracking-[-0.02em]">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-black/72">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
