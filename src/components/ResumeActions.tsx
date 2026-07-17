"use client";

/* Uses the browser's own print engine rather than shipping a generated
   PDF: "Save as PDF" from Chrome or Firefox produces a better-looking,
   properly selectable document than anything built server-side, and it
   can never fall out of date with the page it came from. Hidden in the
   printed output via .no-print. */
export function ResumeActions() {
  return (
    <div className="no-print mb-8 flex flex-wrap items-center gap-3 border-b border-neutral-300 pb-6">
      <button
        type="button"
        onClick={() => window.print()}
        className="cursor-pointer bg-neutral-900 px-5 py-2.5 text-[9.5pt] font-semibold tracking-[0.06em] text-white uppercase transition-colors hover:bg-neutral-700"
      >
        Download PDF
      </button>
      <p className="text-[8.5pt] text-neutral-500">
        Opens your print dialog — choose “Save as PDF” as the destination.
      </p>
    </div>
  );
}
