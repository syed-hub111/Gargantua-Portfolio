import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { UniverseCanvas } from './canvas/UniverseCanvas';
import { NavigationHUD } from './ui/NavigationHUD';
import { SectionOverlays } from './ui/SectionOverlays';
import { ProjectModal } from './ui/ProjectModal';
import { CursorGlow } from './ui/CursorGlow';
import { SECTORS } from './data/portfolioData';
import { spaceAudio } from './audio/spaceAudio';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectorIndex, setActiveSectorIndex] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSkillCategory, setActiveSkillCategory] = useState(null);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);

  // Sector boundaries mapping progress (0.0 to 1.0)
  const sectorThresholds = useMemo(() => [
    { id: 'gateway', p: 0.09 },
    { id: 'home', p: 0.24 },
    { id: 'about', p: 0.42 },
    { id: 'projects', p: 0.58 },
    { id: 'skills', p: 0.72 },
    { id: 'journey', p: 0.93 },
    { id: 'contact', p: 1.00 },
  ], []);

  // Listen to window scroll events and sync with 3D space-time journey
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
          const currentScroll = window.scrollY;
          const p = Math.min(1, Math.max(0, currentScroll / maxScroll));
          setScrollProgress(p);

          // Determine active sector index
          let activeIdx = 0;
          for (let i = 0; i < sectorThresholds.length; i++) {
            if (p <= sectorThresholds[i].p) {
              activeIdx = i;
              break;
            }
          }
          setActiveSectorIndex(activeIdx);

          // Dynamically sync 3D hyperspace flight progress with activeMilestoneIndex
          if (p >= 0.71 && p <= 0.95) {
            const journeyP = (p - 0.73) / (0.93 - 0.73);
            const milestoneIdx = Math.min(4, Math.max(0, Math.floor(journeyP * 5)));
            setActiveMilestoneIndex(milestoneIdx);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectorThresholds]);

  // Smooth scroll to a specific milestone gate in 3D hyperspace
  const handleSelectMilestone = useCallback((idx) => {
    setActiveMilestoneIndex(idx);
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const targetProgress = 0.75 + idx * 0.04;
    window.scrollTo({
      top: targetProgress * maxScroll,
      behavior: 'smooth',
    });
  }, []);

  // Smooth warp to a specific sector
  const handleWarpToSector = useCallback((sectorId) => {
    const targetIdx = SECTORS.findIndex((s) => s.id === sectorId);
    if (targetIdx === -1) return;

    setIsWarping(true);
    spaceAudio.playWarp();

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    let targetProgress = 0;
    if (targetIdx === 0) targetProgress = 0.0;
    else if (targetIdx === 1) targetProgress = 0.17;
    else if (targetIdx === 2) targetProgress = 0.33;
    else if (targetIdx === 3) targetProgress = 0.50;
    else if (targetIdx === 4) targetProgress = 0.66;
    else if (targetIdx === 5) targetProgress = 0.75; // Jump into hyperspace warp corridor
    else if (targetIdx === 6) targetProgress = 0.97; // Reached Contact Horizon

    const targetY = targetProgress * maxScroll;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });

    setActiveSectorIndex(targetIdx);
    setScrollProgress(targetProgress);

    setTimeout(() => {
      setIsWarping(false);
    }, 900);
  }, []);

  // Keyboard navigation support (ArrowDown, ArrowUp, etc.)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedProject) return; // Ignore when modal is open
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const nextIdx = Math.min(SECTORS.length - 1, activeSectorIndex + 1);
        handleWarpToSector(SECTORS[nextIdx].id);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        const prevIdx = Math.max(0, activeSectorIndex - 1);
        handleWarpToSector(SECTORS[prevIdx].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSectorIndex, handleWarpToSector, selectedProject]);

  const activeSector = SECTORS[activeSectorIndex] || SECTORS[0];

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Custom Cosmic Desktop Cursor */}
      <CursorGlow />

      {/* Top Universal HUD */}
      <NavigationHUD
        activeSectorId={activeSector.id}
        onWarpToSector={handleWarpToSector}
      />

      {/* Real-time 3D Universe WebGL Canvas */}
      <UniverseCanvas
        scrollProgress={scrollProgress}
        isWarping={isWarping}
        activeSkillCategory={activeSkillCategory}
        onHoverSkillCategory={setActiveSkillCategory}
        activeMilestoneIndex={activeMilestoneIndex}
        onSelectMilestone={handleSelectMilestone}
        onSelectProject={(proj) => setSelectedProject(proj)}
        onSelectPlanet={(planetName) => {
          spaceAudio.playChime(580, 'sine', 0.2, 0.03);
        }}
      />

      {/* Synchronized HTML UI Overlays for each Sector */}
      <SectionOverlays
        activeSectorId={activeSector.id}
        activeSkillCategory={activeSkillCategory}
        onHoverSkillCategory={setActiveSkillCategory}
        activeMilestoneIndex={activeMilestoneIndex}
        onSelectMilestone={handleSelectMilestone}
        onWarpToSector={handleWarpToSector}
        onSelectProject={(proj) => setSelectedProject(proj)}
      />

      {/* Side Warp Telemetry HUD */}
      <aside className="warp-hud" aria-hidden="true">
        <div className="telemetry-code">{activeSector.code}</div>
        <div className="hud-track">
          <div
            className="hud-progress"
            style={{ height: `${scrollProgress * 100}%` }}
          />
          <div
            className="hud-point"
            style={{ top: `${scrollProgress * 100}%` }}
          />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#94a3b8' }}>
          {Math.round(scrollProgress * 100)}%
        </div>
      </aside>

      {/* 3D Project Detail Inspection Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Scroll Track generating 3D journey height */}
      <div className="scroll-container" aria-hidden="true" />
    </main>
  );
}
