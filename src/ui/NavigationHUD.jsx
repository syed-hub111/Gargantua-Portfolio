import React, { useState } from 'react';
import { Volume2, VolumeX, Download, Github, Linkedin } from 'lucide-react';
import { PERSONAL_INFO, SECTORS } from '../data/portfolioData';
import { spaceAudio } from '../audio/spaceAudio';

export function NavigationHUD({ activeSectorId, onWarpToSector }) {
  const [isAudioActive, setIsAudioActive] = useState(false);

  const handleAudioToggle = () => {
    const active = spaceAudio.toggleMute();
    setIsAudioActive(active);
  };

  return (
    <header className="nav-hud">
      {/* Brand & Identity Telemetry */}
      <div className="brand-badge" onClick={() => onWarpToSector('gateway')}>
        <div className="brand-orb" />
        <div>
          <h1 className="brand-title">{PERSONAL_INFO.name}</h1>
          <p className="brand-subtitle">{PERSONAL_INFO.role}</p>
        </div>
      </div>

      {/* Planetary Sector Navigator */}
      <nav className="sector-nav" aria-label="3D Cosmos Sectors">
        {SECTORS.map((sector) => {
          const isActive = activeSectorId === sector.id;
          return (
            <button
              key={sector.id}
              className={`sector-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => onWarpToSector(sector.id)}
            >
              <span>{sector.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Action Controls Right */}
      <div className="nav-actions">
        {/* Procedural Web Audio Synth Toggle */}
        <button
          className="icon-btn"
          onClick={handleAudioToggle}
          title={isAudioActive ? 'Mute Cosmic Ambient Synth' : 'Enable Cosmic Ambient Synth'}
          aria-label="Toggle Cosmic Audio"
        >
          {isAudioActive ? (
            <div className="sound-bars">
              <span className="sound-bar playing" />
              <span className="sound-bar playing" />
              <span className="sound-bar playing" />
            </div>
          ) : (
            <VolumeX size={18} />
          )}
        </button>

        {/* GitHub Link */}
        <a
          href={PERSONAL_INFO.github}
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn"
          title="GitHub Profile"
          aria-label="GitHub Profile"
        >
          <Github size={18} />
        </a>

        {/* LinkedIn Link */}
        <a
          href={PERSONAL_INFO.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn"
          title="LinkedIn Profile"
          aria-label="LinkedIn Profile"
        >
          <Linkedin size={18} />
        </a>

        {/* Resume Download */}
        <a
          href={PERSONAL_INFO.resumeUrl}
          download="SYED_SAMEER_S_CV.pdf"
          className="btn-primary"
          title="Download Official Resume CV"
        >
          <Download size={15} />
          <span>Resume</span>
        </a>
      </div>
    </header>
  );
}
