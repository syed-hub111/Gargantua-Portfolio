import React, { useEffect } from 'react';
import { X, ExternalLink, Github, CheckCircle2, Layers } from 'lucide-react';

export function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="project-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ borderTop: `2px solid ${project.color}` }}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close project inspection modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="glass-pill" style={{ color: project.color, borderColor: project.color }}>
              ARTIFACT {project.number}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
              {project.category}
            </span>
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            {project.name}
          </h2>
          <p style={{ color: project.color, fontSize: '1.05rem', fontWeight: 500, marginTop: '0.25rem' }}>
            {project.subtitle}
          </p>
        </div>

        {/* Deep Description */}
        <p style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '1.05rem', marginBottom: '1.8rem' }}>
          {project.longDescription || project.description}
        </p>

        {/* Architecture & Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div style={{ marginBottom: '1.8rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: '#94a3b8', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Key Technical Highlights
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {project.highlights.map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <CheckCircle2 size={16} color={project.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5 }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Tags */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.85rem', color: '#94a3b8', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
            Technologies & Frameworks
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#e0f2fe'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions Bottom */}
        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <Github size={16} />
              <span>Explore GitHub Repository</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <ExternalLink size={16} />
              <span>Launch Live Deployment</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
