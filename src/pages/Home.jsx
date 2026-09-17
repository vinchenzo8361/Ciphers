import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Unlock, BookOpen, FlaskConical, ShieldAlert, Cpu, Image as ImageIcon } from 'lucide-react';

export default function Home() {
  const cards = [
    {
      title: 'ENCODER',
      description: 'Transform readable text into secret codes and ciphers.',
      icon: <Lock size={24} />,
      path: '/encoder',
      active: true
    },
    {
      title: 'DECODER',
      description: 'Translate encrypted messages back into readable text.',
      icon: <Unlock size={24} />,
      path: '/decoder',
      active: true
    },
    {
      title: 'CODEBREAKER',
      description: 'Analyze and auto-crack simple ciphers.',
      icon: <Cpu size={24} />,
      path: '/codebreaker',
      active: true
    },
    {
      title: 'LEARNING LIBRARY',
      description: 'Learn the history and math behind classical ciphers.',
      icon: <BookOpen size={24} />,
      path: '/library',
      active: true
    },
    {
      title: 'PLAYGROUND',
      description: 'Chain multiple ciphers together in a custom pipeline.',
      icon: <FlaskConical size={24} />,
      path: '/playground',
      active: true
    },
    {
      title: 'CODEBREAKING GUIDE',
      description: 'Learn simple techniques to crack codes.',
      icon: <BookOpen size={24} />,
      path: '/codebreaking-guide',
      active: true
    },
    {
      title: 'PASSWORD CREATOR',
      description: 'Generate highly secure randomized passwords.',
      icon: <Lock size={24} />,
      path: '/password-creator',
      active: true
    },
    {
      title: 'RSA',
      description: 'COMING SOON',
      icon: <ShieldAlert size={24} />,
      path: '/rsa',
      active: false
    },
    {
      title: 'STEGANOGRAPHY',
      description: 'COMING SOON',
      icon: <ImageIcon size={24} />,
      path: '/steganography',
      active: false
    }
  ];

  return (
    <div className="flex flex-col items-center gap-8" style={{ minHeight: '70vh', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', letterSpacing: '-1px', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          CIPHER LAB
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Encode. Decode. Experiment. Learn. <br/>
          <span style={{ fontSize: '0.95rem' }}>Explore classical ciphers, encodings, and text transformations — one method at a time or chained together.</span>
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        width: '100%',
        maxWidth: '1000px'
      }}>
        {cards.map((card, i) => (
          card.active ? (
            <Link key={i} to={card.path} className="panel panel-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'inherit', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {card.icon}
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '600', letterSpacing: '-0.5px' }}>{card.title}</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>{card.description}</p>
            </Link>
          ) : (
            <div key={i} className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: 0.6, cursor: 'not-allowed' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {card.icon}
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '600', letterSpacing: '-0.5px' }}>{card.title}</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px' }}>{card.description}</p>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
