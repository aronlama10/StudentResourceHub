const RESOURCE_TAGS = [
  "Placement prep",
  "Design systems",
  "Research methods",
  "Coding challenges",
  "Presentation decks",
  "Scholarship alerts",
];

function Resources() {
  return (
    <section id="resources" className="pt-16">
      <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000]">
        <p className="text-sm font-black uppercase tracking-widest text-black/70">
          Resource stacks
        </p>
        <h2 className="text-3xl font-black">Pick a lane and go deep</h2>
        <p className="mt-3 text-sm font-semibold text-black/80">
          Explore curated playlists, design kits, and placement prep packed with
          highlights.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {RESOURCE_TAGS.map((label) => (
            <span
              key={label}
              className="border-2 border-black bg-[#fff3a3] px-3 py-2 text-xs font-bold shadow-[3px_3px_0_0_#000]"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Resources;
