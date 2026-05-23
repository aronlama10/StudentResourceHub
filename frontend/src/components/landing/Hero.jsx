import heroStudents from "../../assets/hero-students.jpg";
import notepadImg from "../../assets/notepad.jpg";
import writingImg from "../../assets/writing.jpg";

function Hero({ onPrimaryAction, onSecondaryAction }) {
  return (
    <section
      id="home"
      className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14"
    >
      <div className="space-y-6">
        <span className="inline-flex w-fit border-[3px] border-black bg-[var(--sky)] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-[2px_2px_0_0_#111]">
          Resource sharing portal
        </span>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-black/55">
            Hello, future contributor.
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[0.92] tracking-[-0.05em] sm:text-5xl lg:text-7xl">
            Find, share, and post study resources without the clutter.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-black/68 sm:text-lg">
            Student Resource Hub gives you one clean entry point. Log in or
            register to unlock the dashboard, browse community uploads, and post
            notes, past question papers, assignment templates, and PDF
            resources.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="border-[3px] border-black bg-[var(--sun)] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.1em] shadow-[2px_2px_0_0_#111] transition hover:-translate-y-0.5"
            onClick={onPrimaryAction}
            type="button"
          >
            Get Started
          </button>
          <a
            className="border-[3px] border-black bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.1em] shadow-[2px_2px_0_0_#111] transition hover:-translate-y-0.5"
            href="#how-it-works"
          >
            See how it works
          </a>
          <button
            className="border-[3px] border-black bg-[var(--mint)] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] shadow-[2px_2px_0_0_#111] transition hover:-translate-y-0.5"
            onClick={onSecondaryAction}
            type="button"
          >
            Log in
          </button>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-medium text-black/68">
          <span className="border-[3px] border-black bg-white px-3 py-2 shadow-[2px_2px_0_0_#111]">
            Dashboard access
          </span>
          <span className="border-[3px] border-black bg-white px-3 py-2 shadow-[2px_2px_0_0_#111]">
            Notes and PDFs
          </span>
          <span className="border-[3px] border-black bg-white px-3 py-2 shadow-[2px_2px_0_0_#111]">
            Post your own resources
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-4">
          <div className="relative overflow-hidden rounded-md border-[3px] border-black bg-[var(--card)] shadow-[4px_4px_0_0_#111]">
            <img
              src={heroStudents}
              alt="Students studying together"
              className="w-full h-64 object-cover"
              loading="lazy"
            />
            <div className="absolute left-4 bottom-4 rounded bg-black/60 px-3 py-1 text-sm font-semibold text-white">
              Study resources & community
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center overflow-hidden rounded-md border-[3px] border-black bg-white p-4 shadow-[2px_2px_0_0_#111]">
              <img
                src={notepadImg}
                alt="Notepad and pen"
                className="w-full h-28 object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex items-center justify-center overflow-hidden rounded-md border-[3px] border-black bg-white p-4 shadow-[2px_2px_0_0_#111]">
              <img
                src={writingImg}
                alt="Person writing notes"
                className="w-full h-28 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div className="mt-2 text-xs text-black/60">
          Photos:{" "}
          <a
            className="underline"
            href="https://unsplash.com/@yunustug"
            target="_blank"
            rel="noreferrer"
          >
            Yunus Tuğ
          </a>
          ,{" "}
          <a
            className="underline"
            href="https://unsplash.com/@nediyodukenson"
            target="_blank"
            rel="noreferrer"
          >
            Kübra Arslaner
          </a>
          ,{" "}
          <a
            className="underline"
            href="https://unsplash.com/@amstram"
            target="_blank"
            rel="noreferrer"
          >
            Scott Graham
          </a>{" "}
          on{" "}
          <a
            className="underline"
            href="https://unsplash.com"
            target="_blank"
            rel="noreferrer"
          >
            Unsplash
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
