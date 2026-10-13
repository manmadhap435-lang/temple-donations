import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onDirectSubmit: (data: { name: string; amount: number; comments: string; date: string }) => Promise<boolean>;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onDirectSubmit,
}) => {
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('1000');
  const [gotraComments, setGotraComments] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'details' | 'verify'>('details');

  const payeeUpi = '9052244870-2@ibl';
  const payeeName = 'DASARI LAXMANARAO';

  // Construct standard UPI URIs keeping raw @ for valid VPA matching in mobile apps
  const cleanAmount = (parseFloat(amount) || 0).toString();
  const noteText = `Temple Donation - ${donorName.trim() || 'Devotee'}`;
  const encodedNote = encodeURIComponent(noteText);
  const encodedName = encodeURIComponent(payeeName);

  // Standard UPI URI for QR code generation
  const upiUri = `upi://pay?pa=${payeeUpi}&pn=${encodedName}&am=${cleanAmount}&cu=INR&tn=${encodedNote}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(upiUri, {
        width: 260,
        margin: 2,
        color: {
          dark: '#2b0606',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [isOpen, upiUri]);

  if (!isOpen) return null;

  const handleProceedToPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) {
      alert('దయచేసి దాత పేరును నమోదు చేయండి (Please enter Donor Name).');
      return;
    }
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      alert('దయచేసి సరైన విరాళం మొత్తాన్ని నమోదు చేయండి (Please enter a valid amount).');
      return;
    }
    setStep('verify');
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (cleanUtr.length < 6) {
      alert('దయచేసి సరైన 12 అంకెల UPI Reference / UTR నంబరును నమోదు చేయండి (Please enter valid UPI Reference/UTR number).');
      return;
    }

    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const commentWithUtr = `[UPI_PENDING:UTR${cleanUtr}] ${gotraComments.trim()}`;

      const ok = await onDirectSubmit({
        name: donorName.trim(),
        amount: parseFloat(amount),
        comments: commentWithUtr,
        date: today,
      });

      if (ok) {
        alert('ధన్యవాదాలు! మీ విరాళ వివరాలు మరియు UTR నంబర్ సమర్పించబడ్డాయి. అడ్మిన్ ధృవీకరించిన వెంటనే జాబితాలో అధికారికంగా కనిపిస్తుంది.\n(Thank you! Your donation with UTR has been submitted for verification.)');
        // Reset
        setDonorName('');
        setAmount('1000');
        setGotraComments('');
        setUtrNumber('');
        setStep('details');
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert('సమర్పించడంలో లోపం ఏర్పడింది. దయచేసి మళ్ళీ ప్రయత్నించండి.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1200, padding: '15px' }}>
      <div
        className="modal glass"
        style={{
          maxWidth: '520px',
          maxHeight: '92vh',
          overflowY: 'auto',
          textAlign: 'left',
          padding: '28px',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
          border: '1.5px solid var(--primary-gold)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-gold)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              🙏 Sri Pala Polamma Thalli Temple
            </span>
            <h2 style={{ fontSize: '1.4rem', margin: '4px 0 0 0', color: 'var(--text-light)', fontFamily: 'Cinzel, serif' }}>
              Online Donation (విరాళం)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.6rem',
              cursor: 'pointer',
              lineHeight: '1',
              padding: '0 5px',
            }}
          >
            &times;
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleProceedToPay} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
              దేవాలయ నిర్మాణానికి మీ వంతు సహాయంగా విరాళాన్ని ఆన్‌లైన్ UPI ద్వారా అందించండి. 🙏
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary-gold)', marginBottom: '5px' }}>
                Donor Full Name (దాత పేరు) *
              </label>
              <input
                type="text"
                placeholder="ఉదా: బొబ్బిలి రాజన్న / manmadha pitta"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary-gold)', marginBottom: '5px' }}>
                Donation Amount (విరాళం మొత్తం ₹) *
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                {['501', '1116', '2500', '30116', '50000'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      background: amount === preset ? 'var(--primary-gold)' : 'rgba(255,255,255,0.06)',
                      color: amount === preset ? 'var(--bg-dark-maroon)' : 'var(--text-light)',
                      border: '1px solid var(--primary-gold)',
                      borderRadius: '4px',
                    }}
                  >
                    ₹{parseInt(preset).toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Enter custom amount in ₹"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary-gold)', marginBottom: '5px' }}>
                Comments/village/MeterialDonation/Mobile_no
              </label>
              <input
                type="text"
                placeholder="Tekkali/50CementBags/9553526015"
                value={gotraComments}
                onChange={(e) => setGotraComments(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ background: 'rgba(212, 175, 55, 0.08)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--primary-gold)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                <strong>Account Holder:</strong> {payeeName}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <strong>PhonePe UPI ID:</strong> {payeeUpi}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                marginTop: '10px',
                padding: '12px',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '1px',
                width: '100%',
              }}
            >
              Proceed to Pay ₹{parseFloat(amount || '0').toLocaleString('en-IN')} ➔
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                background: '#ffffff',
                padding: '16px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ color: '#2b0606', fontWeight: 700, fontSize: '0.88rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#5f259f', fontWeight: 'bold', fontSize: '1rem' }}>पे</span>
                <span>PhonePe • GPay • Paytm • BHIM</span>
              </div>
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt="PhonePe UPI QR"
                  style={{ width: '220px', height: '220px', display: 'block', borderRadius: '6px' }}
                />
              )}
              <div style={{ color: '#2b0606', fontWeight: 700, fontSize: '0.95rem', marginTop: '6px', textAlign: 'center' }}>
                {payeeName}
              </div>
              <div style={{ color: '#666', fontSize: '0.8rem', textAlign: 'center' }}>
                UPI ID: <strong>{payeeUpi}</strong>
              </div>
              <div style={{ color: '#2b0606', fontSize: '1.1rem', fontWeight: 800, marginTop: '4px' }}>
                ₹{parseFloat(amount || '0').toLocaleString('en-IN')}
              </div>
            </div>

            {/* 100% Secure Payment via Scanner / Gallery & UPI ID */}
            <div
              style={{
                background: 'rgba(212, 175, 55, 0.08)',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(212, 175, 55, 0.35)',
              }}
            >
              <div
                style={{
                  fontSize: '0.86rem',
                  color: 'var(--primary-gold)',
                  fontWeight: 700,
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                🔒 100% సురక్షిత చెల్లింపు విధానం (Secure UPI Payment):
              </div>

              {/* Primary Action Buttons: Save QR to Gallery & Copy UPI ID */}


              {/* Step-by-step instructions */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  lineHeight: '1.5',
                  color: 'var(--text-light)',
                }}
              >

                <ol style={{ margin: '0 0 0 16px', padding: 0 }}>

                  <li>మీ <strong>PhonePe / Google Pay / Paytm</strong> యాప్ ఓపెన్ చేసి, <strong>Scan QR (📷 స్కానర్)</strong> నొక్కండి.</li>
                  <li>స్కానర్ స్క్రీన్‌లో QR కోడ్‌తో నేరుగా పే చేయండి.</li>
                  <li>లేదా <strong>'Copy UPI ID'</strong> ద్వారా నేరుగా UPI ID కి చెల్లించండి.</li>
                </ol>

              </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleSubmitDonation} style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px' }}>
              <div style={{ background: 'rgba(255, 193, 7, 0.1)', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #ffc107' }}>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#ffeb3b', lineHeight: 1.4 }}>
                  ⚠️ <strong>ముఖ్య గమనిక:</strong> చెల్లింపు పూర్తయిన తర్వాత మీ Google Pay / PhonePe / Paytm యాప్‌లో వచ్చే <strong>12-అంకెల UPI Reference / UTR Number</strong> ను క్రింద నమోదు చేయండి.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary-gold)', marginBottom: '5px' }}>
                  12-Digit UPI Reference / UTR Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 428912345678 (From payment receipt)"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9A-Za-z]/g, ''))}
                  required
                  style={{ width: '100%', letterSpacing: '1px', fontWeight: 600 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setStep('details')}
                  disabled={isSubmitting}
                  style={{ flex: 1 }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                  style={{
                    flex: 2,
                    background: 'var(--primary-gold)',
                    color: 'var(--bg-dark-maroon)',
                    fontWeight: 700,
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm & Submit Donation'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonateModal;
