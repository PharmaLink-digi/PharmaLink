import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  ShieldCheck, 
  Calendar3, 
  GeoAltFill,
  Prescription2
} from 'react-bootstrap-icons';

const ProductCard = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
      <div 
        className="card border-0 rounded-4 shadow-sm" 
        style={{ 
          width: '420px',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* Top Header Section */}
        <div 
          className="card-header border-0 rounded-top-4 p-4 pb-3"
          style={{ backgroundColor: '#f1eeed' }}
        >
          <div className="d-flex align-items-start gap-3">
            {/* Icon Container */}
            <div 
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              <Prescription2 
                size={32} 
                color="#9c0841" 
                style={{ transform: 'translateY(-1px)' }}
              />
            </div>

            {/* Title & Badge */}
            <div className="flex-grow-1 pt-1">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 
                    className="fw-bold mb-1" 
                    style={{ 
                      color: '#1a1a1a',
                      fontSize: '1.35rem',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2
                    }}
                  >
                    Amoxicillin 500mg
                  </h5>
                  <p 
                    className="mb-0" 
                    style={{ 
                      color: '#817174',
                      fontSize: '0.95rem',
                      fontWeight: 400
                    }}
                  >
                    Pfizer Pharmaceuticals
                  </p>
                </div>
                
                {/* Verified Badge */}
                <span 
                  className="badge rounded-pill d-flex align-items-center gap-1 px-2 py-1"
                  style={{ 
                    backgroundColor: '#e8f8ef',
                    color: '#01704a',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.01em'
                  }}
                >
                  <ShieldCheck size={13} />
                  Verified Seller
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Grid Section */}
        <div className="card-body px-4 py-4">
          <div className="row g-4">
            {/* Available Qty */}
            <div className="col-6">
              <p 
                className="text-uppercase mb-1" 
                style={{ 
                  color: '#9e8e91',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em'
                }}
              >
                Available Qty
              </p>
              <p 
                className="fw-bold mb-0" 
                style={{ 
                  color: '#2d2d2d',
                  fontSize: '1.3rem',
                  letterSpacing: '-0.01em'
                }}
              >
                1,250 Boxes
              </p>
            </div>

            {/* Asking Price */}
            <div className="col-6">
              <p 
                className="text-uppercase mb-1" 
                style={{ 
                  color: '#9e8e91',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em'
                }}
              >
                Asking Price
              </p>
              <p className="mb-0 d-flex align-items-baseline gap-1">
                <span 
                  className="fw-bold" 
                  style={{ 
                    color: '#815b63',
                    fontSize: '1.4rem',
                    letterSpacing: '-0.01em',
                    lineHeight: 1
                  }}
                >
                  EGP 45.00
                </span>
                <span 
                  style={{ 
                    color: '#a89ea0',
                    fontSize: '0.8rem',
                    fontWeight: 500
                  }}
                >
                  /box
                </span>
              </p>
            </div>

            {/* Expiration */}
            <div className="col-6">
              <p 
                className="text-uppercase mb-1" 
                style={{ 
                  color: '#9e8e91',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em'
                }}
              >
                Expiration
              </p>
              <p 
                className="mb-0 d-flex align-items-center gap-2" 
                style={{ 
                  color: '#4a4a4a',
                  fontSize: '1.05rem',
                  fontWeight: 500
                }}
              >
                <Calendar3 size={16} color="#c4a35a" />
                Oct 2025
              </p>
            </div>

            {/* Location */}
            <div className="col-6">
              <p 
                className="text-uppercase mb-1" 
                style={{ 
                  color: '#9e8e91',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em'
                }}
              >
                Location
              </p>
              <p 
                className="mb-0 d-flex align-items-center gap-2" 
                style={{ 
                  color: '#4a4a4a',
                  fontSize: '1.05rem',
                  fontWeight: 500
                }}
              >
                <GeoAltFill size={16} color="#c45b6e" />
                Heliopolis, Cairo
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="mx-4 my-0" style={{ borderColor: '#f0ecec', opacity: 1 }} />

        {/* Footer Section */}
        <div className="card-footer border-0 bg-transparent px-4 py-3 rounded-bottom-4">
          <div className="d-flex justify-content-between align-items-center">
            {/* User Info */}
            <div className="d-flex align-items-center gap-2">
              <div 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #e8e0e0'
                }}
              >
                <img 
                  src="https://ui-avatars.com/api/?name=El+Ezaby&background=0d8abc&color=fff&size=64" 
                  alt="El-Ezaby" 
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="d-flex flex-column">
                <span 
                  className="fw-semibold" 
                  style={{ 
                    color: '#4a4a4a',
                    fontSize: '0.9rem',
                    lineHeight: 1.3
                  }}
                >
                  El-Ezaby
                </span>
                <span 
                  style={{ 
                    color: '#9e8e91',
                    fontSize: '0.78rem',
                    fontWeight: 500
                  }}
                >
                  Heliopolis
                </span>
              </div>
            </div>

            {/* Request Trade Button */}
            <button 
              className="btn border-0"
              style={{ 
                backgroundColor: '#9a0043',
                color: '#ffffff',
                borderRadius: '10px',
                padding: '12px 28px',
                fontSize: '0.92rem',
                fontWeight: 500,
                letterSpacing: '0.01em',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(154, 0, 67, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#7a0035';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(154, 0, 67, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#9a0043';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(154, 0, 67, 0.2)';
              }}
            >
              Request<br className="d-sm-none" /> Trade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;