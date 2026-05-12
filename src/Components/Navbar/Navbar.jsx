import React from 'react';
import { FiSearch, FiBell, FiSettings, FiUser } from 'react-icons/fi';

const Navbar = () => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        height: '70px',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 32px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        boxSizing: 'border-box'
      }}
    >
      {/* Brand - Left */}
      <div
        style={{
          fontWeight: 800,
          fontSize: '1.25rem',
          color: '#0a1128',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        PharmaLink
      </div>

      {/* Search Bar - Center */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flex: '1 1 auto',
          margin: '0 48px',
          maxWidth: '600px',
          minWidth: '300px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            backgroundColor: '#f8f0f0',
            border: '1px solid #f2e1e1',
            borderRadius: '50px',
            height: '46px',
            padding: '0 5px 0 18px',
            boxSizing: 'border-box'
          }}
        >
          <FiSearch
            style={{
              color: '#9ca3af',
              fontSize: '18px',
              flexShrink: 0,
              marginRight: '12px'
            }}
          />
          
          <input
            type="text"
            placeholder="Amoxicillin 500mg"
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '0',
              fontSize: '0.95rem',
              color: '#374151',
              minWidth: '0',
              fontFamily: 'inherit'
            }}
          />
          
          <button
            type="button"
            style={{
              backgroundColor: '#910040',
              color: '#ffffff',
              borderRadius: '50px',
              padding: '5px 25px',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              flexShrink: 0,
              height: '36px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              marginLeft: '8px',
              fontFamily: 'inherit'
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Icons - Right */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexShrink: 0
        }}
      >
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4b5563'
          }}
        >
          <FiBell style={{ fontSize: '20px', strokeWidth: '1.5' }} />
        </button>
        
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4b5563'
          }}
        >
          <FiSettings style={{ fontSize: '20px', strokeWidth: '1.5' }} />
        </button>
        
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4b5563'
          }}
        >
          <FiUser style={{ fontSize: '20px', strokeWidth: '1.5' }} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;