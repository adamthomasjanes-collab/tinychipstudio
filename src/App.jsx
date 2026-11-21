import React, {
  Suspense,
  lazy,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Clients from "./components/Clients";
import Services from "./components/Services";
import Work from "./components/Work";
import Process from "./components/Process";
import Pricing from "./components/Pricing";
import Problem from "./components/Problem";
import Stakes from "./components/Stakes";
import AboutSection from "./components/AboutSection";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { installTracking } from "./lib/track";
import Guide from "./guide/Guide";
import { GuideProvider } from "./guide/GuideContext";
import useReveal from "./hooks/useReveal";
import useMicro from "./fx/useMicro";

// Opened on demand, so they aren't part of the first download.
const CaseStudySheet = lazy(() => import("./components/CaseStudySheet"));
const Panel = lazy(() => import("./components/Panel"));
const ScorecardPanel = lazy(() => import("./components/ScorecardPanel"));
const CallPanel = lazy(() => import("./components/CallPanel"));

/**
 * Visitors can see client proof and explore the redesigns before choosing
 * services, payment options and the next step for their own website.
 */
export default function App() {
  const [active, setActive] = useState(null);
  const caseTrigger = useRef(null);
  const openCase = useCallback((project, trigger) => {
    caseTrigger.current = trigger || document.activeElement;
    setActive(project);
  }, []);
  const closeSheet = useCallback(() => setActive(null), []);

  // In-site tools open from links: #scorecard and #book-call. Closing clears the hash.
  const PANELS = ["scorecard", "book-call"];
  const fromHash = () =>
    PANELS.includes(window.location.hash.slice(1))
      ? window.location.hash.slice(1)
      : null;
  const [panel, setPanel] = useState(null);
  useEffect(() => {
    const sync = () => startTransition(() => setPanel(fromHash()));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const closePanel = useCallback(() => {
    setPanel(null);
    if (PANELS.includes(window.location.hash.slice(1))) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useReveal();
  useMicro();
  useEffect(installTracking, []);

  return (
    <GuideProvider>
      {/* The shell goes `inert` while a case study is open. */}
      <div id="app-shell">
        <a href="#main" className="skip">
          Skip to content
        </a>
        <Header />
        <main id="main">
          <Hero onOpen={openCase} />
          <Problem />
          <Clients onOpen={openCase} />
          <Work onOpen={openCase} />
          <AboutSection />
          <Services />
          <Pricing />
          <Process />
          <Stakes />
          <section className="marquee" aria-hidden="true">
            <div>
              TINY PIXELS ✳ BIG PRESENCE ✳ GOOD WORK ✳ CLEAR MESSAGE ✳ NEXT STEP
              ✳ BUILT TO BE USED ✳
            </div>
          </section>
          <Faq />
          <Contact />
        </main>
        <Footer />
        <Guide />
      </div>

      <Suspense fallback={null}>
        {active && (
          <CaseStudySheet
            key={active.id}
            project={active}
            returnFocus={caseTrigger.current}
            onClose={closeSheet}
          />
        )}
        {panel === "scorecard" && (
          <Panel
            id="scorecard"
            sys="TINY CHIP / FREE WEBSITE SCORECARD"
            title="HOW DOES YOUR WEBSITE MEASURE UP?"
            closeLabel="CLOSE"
            onClose={closePanel}
          >
            {() => <ScorecardPanel />}
          </Panel>
        )}
        {/* Only for old #book-call links, or when no calendar link is set in site.js:
            every "Book a call" button goes straight to the calendar. */}
        {panel === "book-call" && (
          <Panel
            id="book-call"
            sys="TINY CHIP / BOOK 15 MINUTES"
            title="LET’S TALK FOR 15 MINUTES."
            closeLabel="CLOSE"
            onClose={closePanel}
          >
            {() => <CallPanel />}
          </Panel>
        )}
      </Suspense>
    </GuideProvider>
  );
}
