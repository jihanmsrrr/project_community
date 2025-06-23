import React from 'react';

const TaglineComponent = () => {
  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        fontSize: '1.1rem',
        fontWeight: '600',
        color: 'white',  // Set text color directly
        backgroundColor: '#002d57',  // Dark blue background
        borderRadius: '12px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: 'fit-content',
        margin: '0.25rem 0',
        transition: 'all 0.3s ease',
        textDecoration: 'none',  // Ensure no underline
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#001f3c';  // Darker blue on hover
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#002d57';  // Original background on hover out
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      }}
    >
      <span 
        style={{
          width: '4px',
          height: '10px',
          backgroundColor: '#f39c12',  // Orange for the indicator
          borderRadius: '2px',
          marginRight: '0.5rem',
          display: 'inline-block',
        }}
      ></span>
      <span>Berita dan Informasi</span>
    </div>
  );
};

export default TaglineComponent;
