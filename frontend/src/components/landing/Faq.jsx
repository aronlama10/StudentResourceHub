const FAQ_ITEMS = [
  {
    question: "Why do users have to log in or register first?",
    answer:
      "The dashboard is restricted so students can safely browse and add shared academic resources.",
  },
  {
    question: "What can students post later in the dashboard?",
    answer:
      "Only notes, past question papers, assignment templates, and PDF files are meant to be uploaded.",
  },
  {
    question: "Is this landing page responsive?",
    answer:
      "Yes. The layout stacks cleanly on smaller screens and keeps the NeoBrutalist framing on desktop.",
  },
];

function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 pt-6">
      <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-black/55">
        FAQ
      </p>
      <h2 className="text-3xl font-black tracking-[-0.03em] sm:text-4xl">
        Quick answers
      </h2>
      <div className="mt-8 grid gap-4">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.question}
            className="group border-[3px] border-black bg-[var(--card)] p-5 shadow-[5px_5px_0_0_#111]"
          >
            <summary className="cursor-pointer text-lg font-black tracking-[-0.02em] marker:content-['']">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-6 text-black/72">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default Faq;
