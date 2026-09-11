// Live Doctor Portfolio Simulation Dock Preview Manager
// Real-time preview of the doctor's live website sections with dynamic themes

export class PortfolioPreviewManager {
  constructor() {
    this.currentTab = 'hero';
    this.doctorData = {
      fullName: 'Dr. Rahul Sharma',
      degrees: 'MBBS, MS (Ortho), MCh',
      specialty: 'Senior Consultant Orthopedic Surgeon',
      councilNumber: 'TSMC / 64821',
      hospital: 'Metro Orthopedic Specialty Hospital',
      experience: '15+ Years',
      clinicAddress: 'Suite 402, Medical Arts Building, Hyderabad',
      opdSchedule: 'Mon–Sat: 10:00 AM – 2:00 PM & 5:00 PM – 8:00 PM',
      procedures: 'Robotic Total Knee Replacement (TKR)\nMinimally Invasive Total Hip Replacement (THR)\nKnee Arthroscopy & ACL Reconstruction',
      headshotUrl: '',
      colorMood: 'luxury_sapphire',
      primaryCta: 'Book OPD Consultation'
    };
  }

  init() {
    this.setupTabListeners();
    this.render();
  }

  setupTabListeners() {
    document.querySelectorAll('.preview-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.preview-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTab = btn.dataset.tab;
        this.render();
      });
    });
  }

  updateDoctorData(data) {
    if (!data) return;
    Object.assign(this.doctorData, data);
    this.render();
  }

  render() {
    const canvas = document.getElementById('simulationCanvas');
    const urlBar = document.getElementById('previewBrowserUrl');
    if (!canvas) return;

    // Apply active theme class to canvas
    const theme = this.doctorData.colorMood || 'luxury_sapphire';
    canvas.className = `simulation-canvas theme-${theme}`;

    // Doctor clean domain
    const cleanSlug = (this.doctorData.fullName || 'doctor')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 16);
    if (urlBar) {
      urlBar.textContent = `https://${cleanSlug || 'doctor'}-portfolio.com`;
    }

    // Doctor avatar or photo
    const avatarContent = this.doctorData.headshotUrl
      ? `<img src="${this.doctorData.headshotUrl}" alt="${this.doctorData.fullName}" onerror="this.parentElement.innerHTML='👨‍⚕️'"/>`
      : `👨‍⚕️`;

    // Top doctor card
    const doctorCardHtml = `
      <div class="sim-doctor-card">
        <div class="sim-doctor-avatar">
          ${avatarContent}
        </div>
        <div class="sim-doctor-info">
          <h4>${this.doctorData.fullName || 'Dr. Doctor Name'}</h4>
          <p>${this.doctorData.specialty || 'Medical Specialist'}</p>
          <div class="sim-reg">
            <span>${this.doctorData.degrees || 'MBBS'}</span> • 
            <span style="color: #10B981; font-weight: 700;">✓ Reg: ${this.doctorData.councilNumber || 'Verified Council'}</span>
          </div>
        </div>
      </div>
    `;

    // Render depending on active tab
    if (this.currentTab === 'hero') {
      canvas.innerHTML = `
        ${doctorCardHtml}
        <div class="sim-box">
          <div class="sim-box-title">
            <span>Hero Banner Simulation</span>
            <span style="font-size: 0.65rem; color: #10B981; font-weight: 800;">● Live Simulated</span>
          </div>
          <div style="font-size: 0.88rem; font-weight: 800; margin-bottom: 0.35rem;">
            ${this.doctorData.fullName || 'Dr. Doctor Name'}
          </div>
          <p style="font-size: 0.76rem; color: var(--text-secondary); margin-bottom: 0.75rem; line-height: 1.45;">
            ${this.doctorData.specialty || 'Clinical Specialist'}${this.doctorData.experience ? ` with ${this.doctorData.experience} of dedicated clinical expertise` : ''} at ${this.doctorData.hospital || 'Premier Medical Center'}.
          </p>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.85rem;">
            <div class="sim-accent-btn" style="flex: 1; padding: 0.5rem 0.65rem; border-radius: 6px; font-size: 0.74rem; font-weight: 700; text-align: center; cursor: default;">
              📅 ${this.doctorData.primaryCta || 'Book Consultation'}
            </div>
            <div style="padding: 0.5rem 0.75rem; background: #25D366; color: white; border-radius: 6px; font-size: 0.74rem; font-weight: 700; display: flex; align-items: center; gap: 0.3rem;">
              💬 WhatsApp
            </div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; font-size: 0.68rem; color: var(--text-muted);">
            <span style="padding: 0.2rem 0.5rem; background: #F1F5F9; border-radius: 4px;">🛡️ State Council Verified</span>
            <span style="padding: 0.2rem 0.5rem; background: #F1F5F9; border-radius: 4px;">🏥 OPD & Surgical Center</span>
          </div>
        </div>

        <div class="sim-box" style="background: #F0F9FF; border-color: #BAE6FD;">
          <div class="sim-box-title" style="color: #0369A1;">
            <span>💡 Doctor Portfolio Impact</span>
          </div>
          <div style="font-size: 0.75rem; color: #0C4A6E; line-height: 1.45;">
            Your custom portfolio will showcase your verified surgical credentials, direct OPD appointment routing, and direct WhatsApp consultations to patients.
          </div>
        </div>
      `;
    } else if (this.currentTab === 'practice') {
      canvas.innerHTML = `
        ${doctorCardHtml}
        <div class="sim-box">
          <div class="sim-box-title">
            <span>Clinical Practice &amp; OPD</span>
          </div>
          <div style="font-size: 0.82rem; font-weight: 800; margin-bottom: 0.25rem;">
            🏥 ${this.doctorData.hospital || 'Primary Hospital Affiliation'}
          </div>
          <div style="font-size: 0.74rem; color: var(--text-secondary); margin-bottom: 0.85rem; line-height: 1.4;">
            📍 ${this.doctorData.clinicAddress || 'Clinic Address & Consultation Suite'}
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.75rem; font-size: 0.74rem; margin-bottom: 0.65rem;">
            <div style="font-weight: 800; margin-bottom: 0.2rem;">⏰ Consultation Timings:</div>
            <div style="color: var(--text-secondary); font-weight: 500;">${this.doctorData.opdSchedule || 'Monday–Saturday: 10:00 AM – 2:00 PM & 5:00 PM – 8:00 PM'}</div>
          </div>
          <div style="display: flex; gap: 0.5rem; font-size: 0.72rem;">
            <span style="background: #E0F2FE; color: #0369A1; padding: 0.25rem 0.6rem; border-radius: 4px; font-weight: 700;">
              ✓ In-Person OPD
            </span>
            <span style="background: #DCFCE7; color: #166534; padding: 0.25rem 0.6rem; border-radius: 4px; font-weight: 700;">
              ✓ WhatsApp Booking
            </span>
          </div>
        </div>
      `;
    } else if (this.currentTab === 'procedures') {
      const procList = (this.doctorData.procedures || '')
        .split('\n')
        .map(p => p.trim())
        .filter(Boolean)
        .slice(0, 5);

      canvas.innerHTML = `
        ${doctorCardHtml}
        <div class="sim-box">
          <div class="sim-box-title">
            <span>Specialized Treatments &amp; Surgeries</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.75rem;">
            ${procList.length > 0 ? procList.map(p => `
              <div style="padding: 0.45rem 0.65rem; background: #F8FAFC; border-radius: 6px; border-left: 3px solid #0284C7; font-weight: 700; color: #1E293B; display: flex; align-items: center; gap: 0.4rem;">
                <span>🩺</span>
                <span>${p}</span>
              </div>
            `).join('') : `
              <div style="padding: 0.45rem 0.65rem; background: #F8FAFC; border-radius: 6px; border-left: 3px solid #0284C7; font-weight: 700; color: #1E293B;">
                🩺 Robotic Joint Replacement & Arthroscopy
              </div>
              <div style="padding: 0.45rem 0.65rem; background: #F8FAFC; border-radius: 6px; border-left: 3px solid #0284C7; font-weight: 700; color: #1E293B;">
                🩺 Minimally Invasive Surgery
              </div>
            `}
          </div>
        </div>
      `;
    } else if (this.currentTab === 'credentials') {
      canvas.innerHTML = `
        ${doctorCardHtml}
        <div class="sim-box">
          <div class="sim-box-title">
            <span>Medical Qualifications &amp; Licensing</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.55rem; font-size: 0.74rem;">
            <div style="padding: 0.55rem 0.75rem; background: #F8FAFC; border-radius: 6px; border: 1px solid #E2E8F0;">
              <strong style="color: var(--primary-navy); display: block; margin-bottom: 2px;">🎓 Degrees & Certifications:</strong>
              <div style="color: var(--text-secondary);">${this.doctorData.degrees || 'MBBS, MS, MCh'}</div>
            </div>
            <div style="padding: 0.55rem 0.75rem; background: #DEF7EC; border-radius: 6px; border: 1px solid #BCF0DA;">
              <strong style="color: #03543F; display: block; margin-bottom: 2px;">🛡️ State Medical Council Registration:</strong>
              <div style="color: #046C4E; font-weight: 800;">${this.doctorData.councilNumber || 'TSMC / 64821 (Verified)'}</div>
            </div>
            <div style="padding: 0.55rem 0.75rem; background: #F1F5F9; border-radius: 6px; border: 1px solid #E2E8F0;">
              <strong style="color: var(--primary-navy); display: block; margin-bottom: 2px;">🏥 Clinical Experience:</strong>
              <div style="color: var(--text-secondary);">${this.doctorData.experience || '14+ Years in Active Practice'}</div>
            </div>
          </div>
        </div>
      `;
    }
  }
}
