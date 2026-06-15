import React from 'react';
import './WarehouseDashboard.css';
import { useTranslation } from 'react-i18next';
import { BoxSeamFill, GraphUp, PeopleFill, CartCheckFill } from 'react-bootstrap-icons';

export default function WarehouseDashboard() {
  const { t } = useTranslation();

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="fw-bold text-dark">Warehouse Analytics Dashboard</h2>
          <p className="text-muted">Real-time demand forecasting and supply metrics</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 d-flex flex-row align-items-center gap-3">
            <div className="dashboard-icon bg-primary-custom rounded-circle p-3 text-white">
              <BoxSeamFill size={24} />
            </div>
            <div>
              <p className="text-muted mb-0 fw-medium">Total Inventory</p>
              <h3 className="fw-bold mb-0">1.2M <span className="fs-6 text-success">+5%</span></h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 d-flex flex-row align-items-center gap-3">
            <div className="dashboard-icon bg-success rounded-circle p-3 text-white">
              <CartCheckFill size={24} />
            </div>
            <div>
              <p className="text-muted mb-0 fw-medium">B2B Orders</p>
              <h3 className="fw-bold mb-0">8,432 <span className="fs-6 text-success">+12%</span></h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 d-flex flex-row align-items-center gap-3">
            <div className="dashboard-icon bg-warning rounded-circle p-3 text-dark">
              <GraphUp size={24} />
            </div>
            <div>
              <p className="text-muted mb-0 fw-medium">Demand Forecast</p>
              <h3 className="fw-bold mb-0">High</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 d-flex flex-row align-items-center gap-3">
            <div className="dashboard-icon bg-danger rounded-circle p-3 text-white">
              <PeopleFill size={24} />
            </div>
            <div>
              <p className="text-muted mb-0 fw-medium">Active Pharmacies</p>
              <h3 className="fw-bold mb-0">450 <span className="fs-6 text-success">+2</span></h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-4">Regional Demand - Diabetes Medication</h5>
            {/* Simple CSS-based bar chart representation */}
            <div className="chart-wrapper">
              <div className="d-flex align-items-end h-100 gap-3 pb-3 border-bottom">
                <div className="bar bg-primary-custom" style={{ height: '80%', width: '40px' }} title="Cairo"></div>
                <div className="bar bg-primary-custom opacity-75" style={{ height: '50%', width: '40px' }} title="Alexandria"></div>
                <div className="bar bg-primary-custom opacity-50" style={{ height: '30%', width: '40px' }} title="Giza"></div>
                <div className="bar bg-primary-custom opacity-25" style={{ height: '10%', width: '40px' }} title="Other"></div>
              </div>
              <div className="d-flex gap-3 pt-2">
                <span style={{ width: '40px', textAlign: 'center', fontSize: '12px' }}>Cairo</span>
                <span style={{ width: '40px', textAlign: 'center', fontSize: '12px' }}>Alex</span>
                <span style={{ width: '40px', textAlign: 'center', fontSize: '12px' }}>Giza</span>
                <span style={{ width: '40px', textAlign: 'center', fontSize: '12px' }}>Other</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 alert-card bg-warning-subtle">
            <h5 className="fw-bold mb-3 text-warning-emphasis">Predictive Alert</h5>
            <p className="text-dark">
              <strong>Seasonal Spike Detected:</strong> Cold and flu medication demand is projected to increase by 45% in the next 2 weeks based on historical data and current region trends.
            </p>
            <button className="btn btn-warning fw-bold w-100 mt-auto">Adjust Supply Distribution</button>
          </div>
        </div>
      </div>
    </div>
  );
}
