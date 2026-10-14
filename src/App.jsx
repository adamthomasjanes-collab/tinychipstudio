import React, { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Proof from './components/Proof';
import Work from './components/Work';
import Process from './components/Process';
import Services from './components/Services';
import Stakes from './components/Stakes';
import Audit from './components/Audit';
import About from './components/About';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { installTracking } from './lib/track';
import CaseStudySheet from './components/CaseStudySheet';
import Panel from './components/Panel';
import ScorecardPanel from './components/ScorecardPanel';
import CallPanel from './components/CallPanel';
import Guide from './guide/Guide';
import { GuideProvider } from './guide/GuideContext';
import useReveal from './hooks/useReveal';
import useMicro from './fx/useMicro';

/**
 * Page order follows the StoryBrand arc:
 * hero (what you want) → problem → guide (empathy + proof) → work → plan →
 * ways in → stakes (success vs. failure) → the awkward part (objections, said
 * first) → about → questions → call to action.
 */
export default function App() {
  const [active, setActive] = useState(null);
  const closeSheet = useCallback(() => setActive(null), []);

  // In-site tools open from links: #scorecard and #book-call. Closing clears the hash.
  const PANELS = ['scorecard', 'book-call'];
  const fromHash = () => (PANELS.includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : null);
  const [panel, setPanel] = useState(null);
  useEffect(() => {
    const sync = () => setPanel(fromHash());
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const closePanel = useCallback(() => {
    setPanel(null);
    if (PANELS.includes(window.location.hash.slice(1))) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const openBook = useCallback(() => {
    window.history.replaceState(null, '', '#book-call');
    setPanel(null);
    setTimeout(() => setPanel('book-call'), 0);
  }, []);
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
          <Hero />
          <Problem />
          <Proof />
          <Work onOpen={setActive} />
          <section className="marquee" aria-hidden="true">
            <div>TINY PIXELS ✳ BIG PRESENCE ✳ GOOD WORK ✳ CLEAR MESSAGE ✳ NEXT STEP ✳ BUILT TO BE USED ✳</div>
          </section>
          <Process />
          <Services />
          <Stakes />
          <Audit />
          <About />
          <Faq />
          <Contact />
        </main>
        <Footer />
        <Guide />
      </div>

      {active && <CaseStudySheet key={active.id} project={active} onClose={closeSheet} />}
      {panel === 'scorecard' && (
        <Panel id="scorecard" sys="TINY CHIP / FREE WEBSITE SCORECARD" title="HOW DOES YOUR WEBSITE MEASURE UP?" closeLabel="CLOSE" onClose={closePanel}>
          {() => <ScorecardPanel onBook={openBook} />}
        </Panel>
      )}
      {panel === 'book-call' && (
        <Panel id="book-call" sys="TINY CHIP / BOOK 15 MINUTES" title="LET’S TALK FOR 15 MINUTES." closeLabel="CLOSE" onClose={closePanel}>
          {() => <CallPanel />}
        </Panel>
      )}
    </GuideProvider>
  );
}
