"use client";

import { useState } from "react";
import { Preloader } from "./Preloader";
import { Cursor } from "./Cursor";
import { Grain } from "./Grain";
import { SmoothScroll } from "./SmoothScroll";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Projects } from "./Projects";
import { About } from "./About";
import { Experience } from "./Experience";
import { Background } from "./Background";
import { OpenSource } from "./OpenSource";
import { Contact } from "./Contact";
import { ScrollProgress } from "./motion-primitives";

export function Shell() {
  // Hero + nav hold their entrance until the intro panel clears.
  const [ready, setReady] = useState(false);

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Grain />
      <Cursor />
      <SmoothScroll />
      <ScrollProgress />
      <Nav ready={ready} />
      <main id="main">
        <Hero ready={ready} />
        <Projects />
        <About />
        <Experience />
        <Background />
        <OpenSource />
        <Contact />
      </main>
    </>
  );
}
