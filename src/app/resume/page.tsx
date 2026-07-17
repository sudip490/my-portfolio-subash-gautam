import type { Metadata } from "next";
import { ResumeActions } from "@/components/ResumeActions";
import {
  resumeHeader,
  resumeSummary,
  resumeExperience,
  resumeOpenSource,
  resumeProjects,
  resumeSkills,
  resumeEducation,
  resumeLeadership,
} from "@/data/resume";

export const metadata: Metadata = {
  title: "Resume",
  description: `${resumeHeader.name} — ${resumeHeader.title}. ${resumeHeader.location}.`,
  /* Kept out of the index: it duplicates the homepage's content almost
     entirely, and a resume competing with the portfolio in search results
     helps neither. */
  robots: { index: false, follow: false },
};

function Rule({ children }: { children: string }) {
  return (
    <h2 className="mt-6 mb-2 border-b border-neutral-300 pb-1 text-[10.5pt] font-bold tracking-[0.08em] uppercase">
      {children}
    </h2>
  );
}

/* Deliberately light on classes and printed on white. The portfolio's dark
   palette and display face are wrong here: this document has to survive a
   parser, a printer, and a recruiter's ten-second skim. */
export default function ResumePage() {
  return (
    <main className="resume mx-auto max-w-[8.5in] bg-white px-[0.6in] py-[0.5in] text-[10pt] leading-[1.42] text-neutral-900">
      <ResumeActions />

      {/* ---- Header ---- */}
      <header>
        <h1 className="text-[22pt] leading-none font-bold tracking-tight">
          {resumeHeader.name}
        </h1>
        <p className="mt-1.5 text-[11.5pt] text-neutral-700">{resumeHeader.title}</p>
        <p className="mt-2 text-[9pt] text-neutral-700">
          {resumeHeader.location} · {resumeHeader.email} · {resumeHeader.phone}
        </p>
        <p className="mt-1 text-[9pt] text-neutral-700">
          {resumeHeader.links.map((l, i) => (
            <span key={l.href}>
              {i > 0 && " · "}
              <a href={l.href} className="underline-offset-2 hover:underline">
                {l.label}
              </a>
            </span>
          ))}
        </p>
      </header>

      {/* ---- Summary ---- */}
      <Rule>Summary</Rule>
      <p>{resumeSummary}</p>

      {/* ---- Experience ---- */}
      <Rule>Experience</Rule>
      {resumeExperience.map((role) => (
        <section key={role.org} className="break-inside-avoid">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-[11pt] font-bold">
              {role.title} — {role.org}
            </h3>
            <p className="text-[9pt] text-neutral-700">{role.period}</p>
          </div>
          <p className="text-[9pt] text-neutral-700">{role.location}</p>

          {role.projects.map((p) => (
            <div key={p.name} className="mt-3 break-inside-avoid">
              <p className="text-[10pt] font-semibold">
                {p.name}
                <span className="font-normal text-neutral-600"> — {p.note}</span>
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-[1.1em] marker:text-neutral-400">
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}

      {/* ---- Open source ---- */}
      <Rule>Open Source</Rule>
      <ul className="space-y-1.5">
        {resumeOpenSource.map((p) => (
          <li key={p.name} className="break-inside-avoid">
            <span className="font-semibold">{p.name}</span>
            <span className="text-neutral-600"> — {p.downloads}</span>
            <br />
            {p.note}
          </li>
        ))}
      </ul>

      {/* ---- Projects ---- */}
      <Rule>Projects</Rule>
      <ul className="space-y-1.5">
        {resumeProjects.map((p) => (
          <li key={p.name} className="break-inside-avoid">
            <span className="font-semibold">{p.name}</span>
            <span className="text-neutral-600"> — {p.href}</span>
            <br />
            {p.note}
          </li>
        ))}
      </ul>

      {/* ---- Skills ---- */}
      <Rule>Skills</Rule>
      <ul className="space-y-0.5">
        {resumeSkills.map((s) => (
          <li key={s.group}>
            <span className="font-semibold">{s.group}:</span> {s.items}
          </li>
        ))}
      </ul>

      {/* ---- Education ---- */}
      <Rule>Education</Rule>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <p>
          <span className="font-semibold">{resumeEducation.degree}</span> —{" "}
          {resumeEducation.org}
        </p>
        <p className="text-[9pt] text-neutral-700">{resumeEducation.period}</p>
      </div>

      {/* ---- Leadership ---- */}
      <Rule>Leadership</Rule>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <p>
          <span className="font-semibold">{resumeLeadership.title}</span> —{" "}
          {resumeLeadership.org}
        </p>
        <p className="text-[9pt] text-neutral-700">{resumeLeadership.period}</p>
      </div>
      <p className="text-neutral-700">{resumeLeadership.note}</p>
    </main>
  );
}
