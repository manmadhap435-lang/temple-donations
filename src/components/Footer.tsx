import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      className="footer-section glass"
      style={{
        marginTop: '32px',
        padding: '24px 16px',
        borderRadius: '14px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      {/* Decorative top line */}
      <div
        style={{
          width: '65px',
          height: '2px',
          margin: '0 auto 10px',
          borderRadius: '10px',
          background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
          flexShrink: 0,
        }}
      />

      {/* Donation Heading */}
      <h3
        className="cinzel-font"
        style={{
          margin: 0,
          fontSize: '1.15rem',
          fontWeight: 700,
          letterSpacing: '0.4px',
          lineHeight: 1.3,
          color: 'var(--primary-gold)',
        }}
      >
        🙏 Contact for Donations
      </h3>

      {/* Developer Credit */}
      <div
        style={{
          marginTop: '9px',
          fontSize: '0.78rem',
          lineHeight: 1.3,
          color: 'var(--text-muted)',
        }}
      >
        Design & Developed by
      </div>

      {/* Developer Name */}
      <div
        style={{
          display: 'inline-block',
          alignSelf: 'center',
          marginTop: '4px',
          padding: '4px 14px',
          borderRadius: '18px',
          background:
            'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(255,153,51,0.10))',
          border: '1px solid rgba(212,175,55,0.40)',
          boxShadow: '0 2px 8px rgba(212,175,55,0.10)',
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: '0.92rem',
            color: '#d4af37',
            letterSpacing: '0.3px',
          }}
        >
          ✨ Manmadha Pitta ✨
        </span>
      </div>

      {/* Copyright */}
      <p
        style={{
          margin: '12px 0 8px',
          fontSize: '0.76rem',
          lineHeight: 1.4,
          color: 'var(--text-muted)',
        }}
      >
        © {new Date().getFullYear()} Powerstar Youth Newcolony - Ravivalasa
      </p>

      {/* Contact Numbers */}
      <div
        className="footer-contacts"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '6px',
        }}
      >
        <a
          href="tel:9346184327"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            padding: '5px 12px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            fontSize: '0.76rem',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
          }}
        >
          📞 9346184327
        </a>

        <a
          href="tel:6302505146"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            padding: '5px 12px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            fontSize: '0.76rem',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
          }}
        >
          📞 6302505146
        </a>

        <a
          href="tel:9052244870"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            padding: '5px 12px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            fontSize: '0.76rem',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
          }}
        >
          📞 9052244870
        </a>

        <a
          href="tel:9493277803"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            padding: '5px 12px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            fontSize: '0.76rem',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
          }}
        >
          📞 9493277803
        </a>
      </div>
    </footer>
  );
};
