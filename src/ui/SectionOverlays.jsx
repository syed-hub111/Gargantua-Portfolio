import React, { useState, useEffect } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Download,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Send,
  Copy,
  Check,
  UserCheck,
  Phone,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Trophy,
  Briefcase,
  Compass
} from 'lucide-react';
import {
  PERSONAL_INFO,
  PROJECTS,
  SKILL_CATEGORIES,
  JOURNEY_MILESTONES
} from '../data/portfolioData';
import { spaceAudio } from '../audio/spaceAudio';

export function SectionOverlays({
  activeSectorId,
  onWarpToSector,
  onSelectProject,
  activeSkillCategory,
  onHoverSkillCategory,
  activeMilestoneIndex = 0,
  onSelectMilestone,
}) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [isAutoTouring, setIsAutoTouring] = useState(false);

  // Automatic Spacetime Cruise (Auto-Warp Tour)
  useEffect(() => {
    let timer;
    if (isAutoTouring && activeSectorId === 'journey') {
      timer = setInterval(() => {
        onSelectMilestone?.((prev) => (prev + 1) % JOURNEY_MILESTONES.length);
        spaceAudio.playChime(580, 'sine', 0.2, 0.03);
      }, 4200);
    }
    return () => clearInterval(timer);
  }, [isAutoTouring, activeSectorId, onSelectMilestone]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`;
    setFormSent(true);
    setTimeout(() => setFormSent(false), 4000);
  };

  return (
    <>
      {/* SECTOR 0: THE SINGULARITY (HERO) */}
      <section className={`section-overlay ${activeSectorId === 'gateway' ? 'active' : ''}`} data-sector="gateway">
        <div className="hero-gateway-frame">
          {/* Top Title Bar */}
          <div className="hero-top-block">
            <div className="section-tag">
              <Sparkles size={13} />
              <span>RELATIVISTIC ASTROPHYSICS // 0.00 AU</span>
            </div>

            <h1 className="hero-main-title">
              SYED SAMEER. S.
            </h1>

            <p className="hero-subtitle-role">
              Full Stack WEB & Mobile Developer
            </p>
          </div>

          {/* Central Open Viewport - 100% transparent and unobstructed for Gargantua */}
          <div className="hero-center-viewport-space" />

          {/* Bottom Action Deck - Anchored below the black hole */}
          <div className="hero-bottom-deck">
            <p className="hero-concise-desc">
              Architecting scalable cross-platform mobile ecosystems, high-performance MERN platforms, and real-time visual computing.
            </p>

            <div className="hero-buttons-row">
              <button
                className="invitation-prompt"
                onClick={() => onWarpToSector('home')}
              >
                <span>INITIATE ORBITAL TRAJECTORY</span>
                <ArrowDown size={15} />
              </button>

              <button
                className="btn-secondary"
                onClick={() => onWarpToSector('projects')}
              >
                <span>Inspect Mission Artifacts</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTOR 1: THE ORIGIN (HOME) */}
      <section className={`section-overlay ${activeSectorId === 'home' ? 'active' : ''}`} data-sector="home">
        <div className="origin-section-wrap">
          {/* Top Aerospace Telemetry Header Bar */}
          <div className="origin-hud-top">
            <div className="origin-header-box">
              <div className="section-tag">
                <Cpu size={13} />
                <span>THE ORIGIN // SECTOR 01</span>
              </div>

              <h2 className="section-title text-gradient-cyan">
                Architecting Scalable Systems
              </h2>

              <p className="section-desc origin-desc">
                Bridging robust backend engineering with high-precision user interfaces. Developing production-ready Flutter mobile applications, reactive web ecosystems, and cloud integrations.
              </p>
            </div>

            {/* Live Telemetry Status Readout Box */}
            <div className="origin-status-telemetry">
              <div className="telemetry-readout-item">
                <span className="telemetry-label">ORBITAL SECTOR</span>
                <span className="telemetry-val" style={{ color: 'var(--accent-cyan)' }}>
                  01 // THE ORIGIN
                </span>
              </div>
              <div className="telemetry-readout-item">
                <span className="telemetry-label">TRAJECTORY</span>
                <span className="telemetry-val" style={{ color: 'var(--accent-gold)' }}>
                  SLINGSHOT // 0.17c
                </span>
              </div>
              <div className="telemetry-readout-item">
                <span className="telemetry-label">PRIMARY LANDMARK</span>
                <span className="telemetry-val" style={{ color: '#10b981' }}>
                  GARGANTUA ACCRETION DISK
                </span>
              </div>
            </div>
          </div>

          {/* Center Viewport Space - 100% CLEAR for the 3D Gargantua Black Hole */}
          <div className="origin-center-viewport-space" />

          {/* Bottom Aerospace Engineering Pillars Dock & Action Buttons */}
          <div className="origin-bottom-dock">
            {/* Precision Engineering Pillars */}
            <div className="origin-pillars-grid">
              <div className="origin-pillar-card" style={{ '--card-accent': 'var(--accent-cyan)' }}>
                <div className="pillar-card-header">
                  <span className="pillar-num">01</span>
                  <span className="pillar-name" style={{ color: 'var(--accent-cyan)' }}>MOBILE ENGINEERING</span>
                </div>
                <p className="pillar-desc">
                  Flutter, Riverpod & reactive state architectures for high-reliability cross-platform apps.
                </p>
                <div className="pillar-tags-row">
                  <span className="pillar-tag">Flutter</span>
                  <span className="pillar-tag">Dart</span>
                  <span className="pillar-tag">Riverpod</span>
                </div>
              </div>

              <div className="origin-pillar-card" style={{ '--card-accent': 'var(--accent-gold)' }}>
                <div className="pillar-card-header">
                  <span className="pillar-num">02</span>
                  <span className="pillar-name" style={{ color: 'var(--accent-gold)' }}>FULL STACK & MERN</span>
                </div>
                <p className="pillar-desc">
                  React.js, Node.js, Express, MongoDB, and enterprise payroll/ERP data pipelines.
                </p>
                <div className="pillar-tags-row">
                  <span className="pillar-tag">React.js</span>
                  <span className="pillar-tag">Node.js</span>
                  <span className="pillar-tag">MongoDB</span>
                </div>
              </div>

              <div className="origin-pillar-card" style={{ '--card-accent': 'var(--accent-purple)' }}>
                <div className="pillar-card-header">
                  <span className="pillar-num">03</span>
                  <span className="pillar-name" style={{ color: 'var(--accent-purple)' }}>AI & GRAPHICS COMPUTING</span>
                </div>
                <p className="pillar-desc">
                  Google Gemini API, generative models, and Three.js/WebGL relativistic shaders.
                </p>
                <div className="pillar-tags-row">
                  <span className="pillar-tag">Gemini AI</span>
                  <span className="pillar-tag">Three.js</span>
                  <span className="pillar-tag">GLSL</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="origin-buttons-row">
              <button className="btn-primary" onClick={() => onWarpToSector('projects')}>
                <span>View Mission Artifacts</span>
                <ArrowRight size={16} />
              </button>
              <button className="btn-secondary" onClick={() => onWarpToSector('about')}>
                <span>Observation Horizon</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTOR 2: OBSERVATION HORIZON (ABOUT) */}
      <section className={`section-overlay ${activeSectorId === 'about' ? 'active' : ''}`} data-sector="about">
        <div className="about-grid">
          <div>
            <div className="section-tag">
              <UserCheck size={13} />
              <span>OBSERVATION HORIZON // SECTOR 02</span>
            </div>

            <h2 className="section-title">
              Behind the Architecture
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.8rem' }}>
              {PERSONAL_INFO.bio.map((paragraph, idx) => (
                <p key={idx} style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '0.98rem' }}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span className="glass-pill">
                <span>🎓</span>
                <span>{PERSONAL_INFO.education.college} ({PERSONAL_INFO.education.years})</span>
              </span>
              <span className="glass-pill">
                <span>📍</span>
                <span>{PERSONAL_INFO.location}</span>
              </span>
              <span className="glass-pill">
                <span>⚡</span>
                <span>{PERSONAL_INFO.status}</span>
              </span>
            </div>
          </div>

          {/* High-Precision Observation Telemetry Pod */}
          <div className="portrait-hologram-card">
            <div className="hologram-avatar-icon">
              <UserCheck size={38} />
            </div>

            <span className="glass-pill" style={{ marginBottom: '1rem' }}>
              TELEMETRY NODE // SYED SAMEER S
            </span>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
              {PERSONAL_INFO.name}
            </h3>

            <p style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginBottom: '1rem' }}>
              {PERSONAL_INFO.role} • B.E. CSE
            </p>

            <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '300px' }}>
              Interactive observation station rendered with titanium geometry, laser alignment disc, and aerospace telemetry readouts.
            </p>

            <div style={{ marginTop: '1.4rem' }}>
              <a
                href={PERSONAL_INFO.resumeUrl}
                download="Syed_Sameer_S_Resume.pdf"
                className="btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
              >
                <Download size={14} />
                <span>Download Official Resume</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTOR 3: MISSION ARTIFACTS (PROJECTS) */}
      <section className={`section-overlay ${activeSectorId === 'projects' ? 'active' : ''}`} data-sector="projects">
        <div className="projects-section-wrap">
          {/* Top Aerospace Telemetry Header Bar */}
          <div className="projects-hud-top">
            <div className="projects-header-box">
              <div className="section-tag">
                <Layers size={13} />
                <span>MISSION ARTIFACTS // SECTOR 03</span>
              </div>

              <h2 className="section-title">
                Orbital Systems & Platforms
              </h2>

              <p className="section-desc">
                Central planetary data globe surrounded by 5 active telemetry satellites. Click any 3D orbital module directly to inspect technical blueprints, live demos, and source code.
              </p>
            </div>

            {/* Live Telemetry Status Readout */}
            <div className="projects-status-telemetry">
              <div className="telemetry-readout-item">
                <span className="telemetry-label">PLANETARY CORE</span>
                <span className="telemetry-val" style={{ color: 'var(--accent-cyan)' }}>SYNCHRONIZED</span>
              </div>
              <div className="telemetry-readout-item">
                <span className="telemetry-label">ORBITAL SATELLITES</span>
                <span className="telemetry-val" style={{ color: 'var(--accent-gold)' }}>05 ONLINE</span>
              </div>
              <div className="telemetry-readout-item">
                <span className="telemetry-label">COSMIC COORD</span>
                <span className="telemetry-val">[26.0, 0.0, -48.0]</span>
              </div>
            </div>
          </div>

          {/* Center Area is 100% CLEAR - No cards overlapping the 3D globe and orbital effects! */}
          <div className="projects-center-viewport-space" />

          {/* Bottom Aerospace Orbital Telemetry Dock */}
          <div className="projects-orbital-dock">
            <div className="dock-hint-bar">
              <span className="dock-led-pulse" />
              <span>ORBITAL FLEET DOCK // SELECT A MISSION TO INSPECT</span>
            </div>

            <div className="dock-pills-row">
              {PROJECTS.map((proj) => (
                <button
                  key={proj.id}
                  className="orbital-dock-pill"
                  style={{ '--pill-color': proj.color }}
                  onClick={() => {
                    spaceAudio.playWarp();
                    onSelectProject(proj);
                  }}
                >
                  <span className="dock-pill-dot" />
                  <div className="dock-pill-info">
                    <span className="dock-pill-num">MISSION {proj.number}</span>
                    <span className="dock-pill-name">{proj.name}</span>
                  </div>
                  <span className="dock-pill-badge">
                    {proj.category.includes('•') ? proj.category.split('•')[0].trim() : proj.category.split('|')[0].trim()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTOR 4: SYSTEMS MATRIX (SKILLS) */}
      <section className={`section-overlay ${activeSectorId === 'skills' ? 'active' : ''}`} data-sector="skills">
        <div className="skills-section-wrap">
          {/* Top Aerospace Telemetry Header Bar */}
          <div className="skills-hud-top">
            <div className="skills-header-box">
              <div className="section-tag">
                <Cpu size={13} />
                <span>SYSTEMS MATRIX // SECTOR 04</span>
              </div>

              <h2 className="section-title">
                Propulsion & Capabilities
              </h2>

              <p className="section-desc">
                Interconnected 5-domain technical neural tree orbiting the central architecture core.
              </p>
            </div>

            {/* Live Telemetry Status Readout Box */}
            <div className="skills-status-telemetry">
              <div className="telemetry-readout-item">
                <span className="telemetry-label">MATRIX CORE</span>
                <span className="telemetry-val" style={{ color: 'var(--accent-cyan)' }}>SYNCHRONIZED</span>
              </div>
              <div className="telemetry-readout-item">
                <span className="telemetry-label">NEURAL HUBS</span>
                <span className="telemetry-val" style={{ color: 'var(--accent-gold)' }}>05 ONLINE</span>
              </div>
              <div className="telemetry-readout-item">
                <span className="telemetry-label">CAPABILITIES</span>
                <span className="telemetry-val" style={{ color: 'var(--accent-emerald)' }}>24 VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Center Viewport Space - 100% CLEAR so the 3D Skill Tree is fully visible and fits on screen! */}
          <div className="skills-center-viewport-space" />

          {/* Bottom Aerospace Skill Matrix Dock */}
          <div className="skills-matrix-dock">
            <div className="dock-hint-bar">
              <span className="dock-led-pulse" />
              <span>NEURAL SKILL HUBS // 5 CONNECTED DOMAINS</span>
            </div>

            <div className="skills-category-grid">
              {SKILL_CATEGORIES.map((cat, idx) => {
                const isHighlighted = activeSkillCategory === cat.name;
                return (
                  <div
                    key={cat.name}
                    className={`skill-category-card ${isHighlighted ? 'highlighted' : ''}`}
                    style={{
                      '--cat-color': cat.color,
                      borderTop: `2px solid ${cat.color}`,
                    }}
                    onMouseEnter={() => onHoverSkillCategory?.(cat.name)}
                    onMouseLeave={() => onHoverSkillCategory?.(null)}
                  >
                    <div className="skill-card-header">
                      <div className="skill-card-title-row">
                        <span className="skill-card-num">0{idx + 1}</span>
                        <h3 className="skill-card-name">{cat.name}</h3>
                      </div>
                      <span className="skill-card-tag" style={{ color: cat.color }}>
                        {cat.tag}
                      </span>
                    </div>

                    <div className="skill-pills-wrap">
                      {cat.skills.map((s) => (
                        <span key={s} className="skill-pill-item">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTOR 5: HYPERSPACE WARP TUNNEL & TEMPORAL CONTINUUM (JOURNEY) */}
      <section className={`section-overlay ${activeSectorId === 'journey' ? 'active' : ''}`} data-sector="journey">
        <div className="journey-section-wrap">
          {/* Top Aerospace Telemetry Header Bar */}
          <div className="journey-hud-top">
            <div className="journey-header-box">
              <div className="section-tag">
                <Sparkles size={13} />
                <span>SPACETIME ODYSSEY // SECTOR 05</span>
              </div>

              <h2 className="section-title">
                Traveling Through Time & Space
              </h2>

              <p className="section-desc">
                A relativistic voyage through academic foundation, competitive AI triumphs, enterprise software architectures, and real-time WebGL frontiers.
              </p>
            </div>

            {/* Live Telemetry Status Readout Box */}
            <div className="journey-status-telemetry">
              <div className="telemetry-readout-item">
                <span className="telemetry-label">WARP DRIVE VELOCITY</span>
                <span className="telemetry-val" style={{ color: 'var(--accent-cyan)' }}>
                  HYPERSPACE // 9.8c
                </span>
              </div>
              <div className="telemetry-readout-item">
                <span className="telemetry-label">TEMPORAL ANCHOR</span>
                <span className="telemetry-val" style={{ color: JOURNEY_MILESTONES[activeMilestoneIndex]?.color || 'var(--accent-gold)' }}>
                  GATE 0{activeMilestoneIndex + 1} • {JOURNEY_MILESTONES[activeMilestoneIndex]?.year}
                </span>
              </div>
              <div className="telemetry-readout-item">
                <span className="telemetry-label">DESTINATION VECTOR</span>
                <span className="telemetry-val" style={{ color: '#10b981' }}>
                  SIGNAL ARRAY (CONTACT)
                </span>
              </div>
            </div>
          </div>

          {/* Center Viewport Space - 100% Unobstructed for the 3D Hyperspace Warp Drive & Oncoming Stargates */}
          <div className="journey-center-viewport-space">
            <div className="warp-scroll-prompt">
              <div className="warp-pulse-orb" />
              <span>SCROLL TO TRAVERSE THE TIME-SPACE CONTINUUM</span>
              <ArrowDown size={14} className="warp-bounce-arrow" />
            </div>
          </div>

          {/* Bottom Chrono-Cockpit: Timeline Stepper & Mission Briefing Hologram */}
          <div className="journey-chrono-cockpit">
            {/* Horizontal Timeline Spacetime Scrubber Track */}
            <div className="chrono-stepper-track">
              {JOURNEY_MILESTONES.map((m, idx) => {
                const isSelected = activeMilestoneIndex === idx;
                return (
                  <button
                    key={m.title}
                    className={`chrono-epoch-pill ${isSelected ? 'active' : ''}`}
                    style={{
                      '--epoch-color': m.color || 'var(--accent-cyan)',
                    }}
                    onClick={() => {
                      spaceAudio.playChime(520 + idx * 50, 'sine', 0.18, 0.04);
                      onSelectMilestone?.(idx);
                    }}
                  >
                    <span className="epoch-pill-dot" />
                    <div className="epoch-pill-text">
                      <span className="epoch-pill-year">{m.year}</span>
                      <span className="epoch-pill-badge">{m.badge}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Milestone Briefing Hologram Card */}
            {(() => {
              const currentM = JOURNEY_MILESTONES[activeMilestoneIndex] || JOURNEY_MILESTONES[0];
              const IconComponent =
                currentM.icon === 'GraduationCap' ? GraduationCap :
                currentM.icon === 'Trophy' ? Trophy :
                currentM.icon === 'Briefcase' ? Briefcase :
                currentM.icon === 'Layers' ? Layers :
                Compass;

              const isLastGate = activeMilestoneIndex === JOURNEY_MILESTONES.length - 1;
              const eraColor = currentM.color || 'var(--accent-cyan)';

              return (
                <div
                  className="chrono-briefing-card"
                  style={{
                    borderColor: `${eraColor}55`,
                    boxShadow: `0 10px 40px rgba(0, 0, 0, 0.65), 0 0 25px ${eraColor}20`,
                  }}
                >
                  <div className="briefing-card-top">
                    <div className="briefing-badge-cluster">
                      <div
                        className="briefing-icon-box"
                        style={{
                          background: `${eraColor}18`,
                          borderColor: `${eraColor}55`,
                          boxShadow: `0 0 16px ${eraColor}35`,
                        }}
                      >
                        <IconComponent size={20} color={eraColor} />
                      </div>
                      <div className="briefing-meta-col">
                        <span className="briefing-epoch-code" style={{ color: eraColor }}>
                          TEMPORAL COORDINATE // GATE 0{activeMilestoneIndex + 1} OF 0{JOURNEY_MILESTONES.length}
                        </span>
                        <div className="briefing-badge-row">
                          <span
                            className="glass-pill"
                            style={{
                              padding: '0.2rem 0.65rem',
                              fontSize: '0.74rem',
                              color: eraColor,
                              borderColor: `${eraColor}44`,
                            }}
                          >
                            {currentM.year} • {currentM.badge}
                          </span>
                          <span className="briefing-loc-tag">
                            📍 {currentM.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Flight Controls */}
                    <div className="chrono-nav-controls">
                      <button
                        className="chrono-ctrl-btn"
                        onClick={() => {
                          if (activeMilestoneIndex > 0) {
                            onSelectMilestone?.(activeMilestoneIndex - 1);
                          } else {
                            onWarpToSector?.('skills');
                          }
                        }}
                        title={activeMilestoneIndex === 0 ? "Back to Skills" : "Previous Gate"}
                      >
                        <ChevronLeft size={16} />
                        <span>{activeMilestoneIndex === 0 ? 'Skills' : 'Previous Era'}</span>
                      </button>

                      {isLastGate ? (
                        <button
                          className="chrono-ctrl-btn arrival-btn"
                          style={{
                            background: 'rgba(16, 185, 129, 0.3)',
                            borderColor: '#10b981',
                            color: '#10b981',
                            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                          }}
                          onClick={() => onWarpToSector?.('contact')}
                          title="Exit Warp & Arrive at Contact"
                        >
                          <span>Arrive at Contact Horizon</span>
                          <ArrowRight size={14} />
                        </button>
                      ) : (
                        <button
                          className="chrono-ctrl-btn"
                          onClick={() => {
                            const next = activeMilestoneIndex + 1;
                            spaceAudio.playChime(520 + next * 50, 'sine', 0.18, 0.04);
                            onSelectMilestone?.(next);
                          }}
                          title="Accelerate to Next Era"
                        >
                          <span>Next Era</span>
                          <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="briefing-milestone-title">
                    {currentM.title}
                  </h3>

                  <p className="briefing-milestone-desc">
                    {currentM.description}
                  </p>

                  {/* Scannable Technology & Impact Chips */}
                  {currentM.highlights && (
                    <div className="briefing-highlights-row">
                      {currentM.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="briefing-highlight-chip"
                          style={{ '--chip-color': eraColor }}
                        >
                          <span className="chip-spark">✦</span>
                          <span>{h}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* SECTOR 6: SIGNAL ARRAY (CONTACT) */}
      <section className={`section-overlay ${activeSectorId === 'contact' ? 'active' : ''}`} data-sector="contact">
        <div style={{ width: '100%', maxWidth: '1100px' }}>
          <div className="section-tag">
            <Mail size={13} />
            <span>SIGNAL ARRAY // SECTOR 06</span>
          </div>

          <h2 className="section-title">
            Interstellar Signal
          </h2>

          <p className="section-desc">
            Seeking opportunities to apply technical skills in high-impact software development environments. Transmit your message into the cosmos.
          </p>

          <div className="contact-grid">
            {/* Functional Message Dispatch Panel */}
            <form className="contact-form-panel" onSubmit={handleFormSubmit}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.2rem' }}>
                Transmit Communications Packet
              </h3>

              <div className="form-group">
                <label className="form-label">CALLSIGN / NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Vance"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">TRANSMISSION FREQUENCY / EMAIL</label>
                <input
                  type="email"
                  required
                  placeholder="elena@domain.com"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">PAYLOAD / MESSAGE</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Hello Syed, we have an ambitious mobile & web platform to develop..."
                  className="form-textarea"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Send size={15} />
                <span>{formSent ? 'Packet Transmitted!' : 'Transmit Signal'}</span>
              </button>
            </form>

            {/* Direct Channel Telemetry */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
                <h4 style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginBottom: '0.4rem', letterSpacing: '0.08em' }}>
                  DIRECT CHANNEL
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>
                    {PERSONAL_INFO.email}
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.8rem' }}
                  >
                    {copiedEmail ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Direct Phone Link */}
              <a
                href={`tel:${PERSONAL_INFO.phone}`}
                className="contact-link-row"
              >
                <Phone size={18} color="var(--accent-gold)" />
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>Telephone Direct</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{PERSONAL_INFO.phone}</div>
                </div>
                <ExternalLink size={15} style={{ marginLeft: 'auto' }} color="#64748b" />
              </a>

              {/* GitHub Link */}
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-row"
              >
                <Github size={18} color="var(--accent-cyan)" />
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>GitHub Repositories</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>github.com/syed-hub111</div>
                </div>
                <ExternalLink size={15} style={{ marginLeft: 'auto' }} color="#64748b" />
              </a>

              {/* LinkedIn Link */}
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-row"
              >
                <Linkedin size={18} color="var(--accent-cyan)" />
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>LinkedIn Profile</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>linkedin.com/in/syedsameers2006/</div>
                </div>
                <ExternalLink size={15} style={{ marginLeft: 'auto' }} color="#64748b" />
              </a>

              {/* Downloadable Resume */}
              <a
                href={PERSONAL_INFO.resumeUrl}
                download="SYED_SAMEER_S_CV.pdf"
                className="contact-link-row"
              >
                <Download size={18} color="var(--accent-gold)" />
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>Download Official Resume</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Complete CV • Verified Credentials</div>
                </div>
                <ExternalLink size={15} style={{ marginLeft: 'auto' }} color="#64748b" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
