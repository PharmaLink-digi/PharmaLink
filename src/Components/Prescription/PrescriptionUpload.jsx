import React, { useState } from 'react';
import './PrescriptionUpload.css';
import { useTranslation } from 'react-i18next';
import { CameraFill, FileEarmarkImageFill, CheckCircleFill, ExclamationTriangleFill } from 'react-bootstrap-icons';

export default function PrescriptionUpload() {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState(null);
  const [step, setStep] = useState(1);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  const processImage = () => {
    setIsProcessing(true);
    // Simulate AI Processing delay
    setTimeout(() => {
      setIsProcessing(false);
      // Simulate a random confidence score
      const randomConfidence = Math.floor(Math.random() * (100 - 50 + 1) + 50);
      setConfidence(randomConfidence);
      setStep(2);
    }, 2000);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 p-4">
            <h2 className="fw-bold mb-4 text-center">Upload Prescription</h2>
            
            {step === 1 && (
              <>
                <div className="upload-zone text-center p-5 mb-4 rounded bg-light border border-2 border-dashed">
                  {file ? (
                    <img src={file} alt="Prescription" className="img-fluid rounded max-h-300" />
                  ) : (
                    <>
                      <FileEarmarkImageFill size={50} className="text-secondary mb-3" />
                      <h5>Drag & Drop your prescription</h5>
                      <p className="text-muted">or click to browse</p>
                    </>
                  )}
                  <input type="file" className="form-control-file opacity-0 position-absolute w-100 h-100 top-0 start-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
                </div>
                
                <button 
                  className="btn btn-primary w-100 py-3 fw-bold large-touch-target" 
                  disabled={!file || isProcessing}
                  onClick={processImage}
                >
                  {isProcessing ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : (
                    <CameraFill className="me-2" />
                  )}
                  {isProcessing ? 'AI Processing...' : 'Process Prescription'}
                </button>
              </>
            )}

            {step === 2 && (
              <div className="text-center py-4">
                {confidence >= 80 ? (
                  <>
                    <CheckCircleFill size={60} className="text-success mb-3" />
                    <h3 className="fw-bold text-success mb-2">High Confidence ({confidence}%)</h3>
                    <p className="text-muted mb-4">Your prescription has been read successfully. You can proceed with the order.</p>
                    <button className="btn btn-success w-100 py-3 fw-bold large-touch-target">Proceed to Checkout</button>
                  </>
                ) : (
                  <>
                    <ExclamationTriangleFill size={60} className="text-warning mb-3" />
                    <h3 className="fw-bold text-warning-custom mb-2">Manual Review Required ({confidence}%)</h3>
                    <div className="alert alert-warning text-start" role="alert">
                      Our AI couldn't read your prescription with high certainty. 
                      It has been sent to a certified pharmacist for manual review. 
                      You will receive a notification once verified.
                    </div>
                    <button className="btn btn-outline-warning w-100 py-3 fw-bold large-touch-target" onClick={() => setStep(1)}>
                      Upload a Clearer Image
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
