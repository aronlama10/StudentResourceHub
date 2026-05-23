const STEPS = [
  {
    step: "01",
    title: "Register or log in",
    text: "The CTA opens a modal with a fast login/register toggle.",
  },
  {
    step: "02",
    title: "Enter the dashboard",
    text: "Authenticated users move past the landing page and into the resource area.",
  },
  {
    step: "03",
    title: "Browse or post resources",
    text: "Share notes, past papers, assignment templates, and PDF files.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 pt-6">
      <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-black/55">
        How it works
      </p>
      <h2 className="max-w-2xl text-3xl font-black tracking-[-0.03em] sm:text-4xl">
        Three steps from visitor to contributor
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {STEPS.map((item) => (
          <div
            key={item.step}
            className="border-[3px] border-black bg-[var(--card)] p-6 shadow-[5px_5px_0_0_#111]"
          >
            <span className="inline-flex border-[2px] border-black bg-[var(--sky)] px-3 py-1 text-xs font-black tracking-[0.14em] shadow-[2px_2px_0_0_#111]">
              {item.step}
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

export default HowItWorks;
