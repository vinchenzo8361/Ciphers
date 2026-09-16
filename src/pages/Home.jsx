import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Unlock, BookOpen, FlaskConical, ShieldAlert, Cpu, Image as ImageIcon } from 'lucide-react';

export default function Home() {
  const cards = [
    {
      title: 'ENCODER',
      description: 'Transform readable text into secret codes and ciphers.',
      icon: <Lock size={48} />,
      path: '/encoder',
      active: true
    },
    {
      title: 'DECODER',
      description: 'Translate encrypted messages back into readable text.',
      icon: <Unlock size={48} />,
      path: '/decoder',
      active: true
    },
    {
      title: 'CODEBREAKER',
      description: 'Analyze and auto-crack simple ciphers.',
      icon: <Cpu size={48} />,
      path: '/codebreaker',
      active: true
    },
    {
      title: 'LEARNING LIBRARY',
      description: 'Learn the history and math behind classical ciphers.',
      icon: <BookOpen size={48} />,
      path: '/library',
      active: true
    },
    {
      title: 'PLAYGROUND',
      description: 'Chain multiple ciphers together in a custom pipeline.',
      icon: <FlaskConical size={48} />,
      path: '/playground',
      active: true
    },
    {
      title: 'RSA',
      description: 'COMING SOON',
      icon: <ShieldAlert size={48} />,
      path: '/rsa',
      active: false
    },
    {
      title: 'STEGANOGRAPHY',
      description: 'COMING SOON',
      icon: <ImageIcon size={48} />,
      path: '/steganography',
      active: false
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>CIPHER LAB</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
          A sandbox for exploring, combining, and learning about text transformations and classical ciphers.
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '1200px'
      }}>
        {cards.map((card, i) => (
          card.active ? (
            <Link key={i} to={card.path} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ color: 'var(--accent)' }}>{card.icon}</div>
              <h2 style={{ fontSize: '1.25rem' }}>{card.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{card.description}</p>
            </Link>
          ) : (
            <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', opacity: 0.6, cursor: 'not-allowed' }}>
              <div style={{ color: 'var(--text-secondary)' }}>{card.icon}</div>
              <h2 style={{ fontSize: '1.25rem' }}>{card.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 'bold' }}>{card.description}</p>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
