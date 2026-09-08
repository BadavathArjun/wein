// Live Doctor Portfolio Simulation Dock Preview Manager
import { PLATFORMS } from './platforms.js';

export class PortfolioPreviewManager {
  constructor() {
    this.currentTab = 'hero';
    this.doctorData = {
      fullName: 'Dr. Rahul Sharma',
      degrees: 'MBBS, MS (Ortho), MCh',
      specialty: 'Senior Consultant Orthopedic Surgeon',
      councilNumber: 'MCI-58492'
    };
    this.section10State = {
      consent: 'yes',
      selectedPlatforms: [],
      links: {},
      primaryProfile: '',
      placements: []
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
    if (data.fullName) this.doctorData.fullName = data.fullName;
    if (data.degrees) this.doctorData.degrees = data.degrees;
    if (data.specialty) this.doctorData.specialty = data.specialty;
    if (data.councilNumber) this.doctorData.councilNumber = data.councilNumber;
    this.render();
  }

  updateSection10(state) {
    this.section10State = state;
    this.render();
  }

  render() {
    const canvas = document.getElementById('simulationCanvas');
    const urlBar = document.getElementById('previewBrowserUrl');
    if (!canvas) return;

    // Doctor clean domain
    const cleanSlug = (this.doctorData.fullName || 'doctor')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 16);
    if (urlBar) {
      urlBar.textContent = `https://${cleanSlug}-portfolio.com`;
    }

    const { consent, selectedPlatforms, links, primaryProfile } = this.section10State;
    const isHiddenPublicly = consent === 'no';

    // Doctor profile top card
    const doctorCardHtml = `
      <div class="sim-doctor-card">
        <div class="sim-doctor-avatar">
          👨‍⚕️
        </div>
        <div class="sim-doctor-info">
          <h4>${this.doctorData.fullName}</h4>
          <p>${this.doctorData.specialty}</p>
          <div class="sim-reg">${this.doctorData.degrees} • Reg: ${this.doctorData.councilNumber || 'Verified'}</div>
        </div>
      </div>
    `;

    if (isHiddenPublicly) {
      canvas.innerHTML = `
        ${doctorCardHtml}
        <div class="sim-empty-notice" style="background: white; border-radius: var(--radius-md); border: 1px dashed var(--border-medium); padding: 2rem 1rem;">
          <div class="sim-empty-icon">🔒</div>
          <div style="font-weight: 700; color: var(--primary-navy); margin-bottom: 0.25rem;">Private / Internal Mode Selected</div>
          <div style="font-size: 0.76rem; color: var(--text-muted);">
            You selected <em>"No, don't display them publicly"</em>. Social buttons will be omitted from the public website and kept strictly for agency records.
          </div>
        </div>
      `;
      return;
    }

    if (!selectedPlatforms || selectedPlatforms.length === 0) {
      canvas.innerHTML = `
        ${doctorCardHtml}
        <div class="sim-empty-notice">
          <div class="sim-empty-icon">🌐</div>
          <div><strong>No Social Profiles Selected</strong></div>
          <div>Select your active profiles in Section 10 to see them dynamically appear here on your portfolio preview.</div>
        </div>
      `;
      return;
    }

    // Render depending on active tab
    if (this.currentTab === 'hero') {
      canvas.innerHTML = `
        ${doctorCardHtml}
        <div class="sim-box">
          <div class="sim-box-title">
            <span>Hero Social Proof Bar</span>
            <span style="font-size: 0.65rem; color: var(--accent-teal);">● Live Preview</span>
          </div>
          <p style="font-size: 0.74rem; color: var(--text-muted); margin-bottom: 0.85rem;">
            Placed directly below your introduction & consultation CTA for immediate trust:
          </p>
          <div class="sim-pills-row">
            ${selectedPlatforms.map(id => {
              const platform = PLATFORMS.find(p => p.id === id);
              if (!platform) return '';
              const link = links[id] || '#';
              const isPrimary = primaryProfile === id;

              return `
                <a href="${link}" target="_blank" class="sim-social-pill ${isPrimary ? 'primary-highlight' : ''}" 
                   style="background: ${isPrimary ? platform.color : platform.bgLight}; color: ${isPrimary ? '#FFFFFF' : platform.color}; border: 1px solid ${platform.color}40;">
                  <span style="display: flex;">${platform.icon}</span>
                  <span>${platform.name}</span>
                  ${isPrimary ? '<span>⭐</span>' : ''}
                </a>
              `;
            }).join('')}
          </div>
        </div>

        <div class="sim-box" style="background: #F0F9FF; border-color: #BAE6FD;">
          <div class="sim-box-title" style="color: #0369A1;">
            <span>💡 Doctor Portfolio Impact</span>
          </div>
          <div style="font-size: 0.74rem; color: #0C4A6E; line-height: 1.45;">
            Having <strong>${selectedPlatforms.length} verified channels</strong> listed directly increases patient conversion by <strong>42%</strong> by validating your authentic clinical reputation.
          </div>
        </div>
      `;
    } else if (this.currentTab === 'header') {
      canvas.innerHTML = `
        ${doctorCardHtml}
        <div class="sim-box">
          <div class="sim-box-title">Header Navigation Mockup</div>
          <div class="sim-header-mockup">
            <div class="sim-header-logo">${this.doctorData.fullName.split(' ')[0]} ${this.doctorData.fullName.split(' ')[1] || ''}</div>
            <div class="sim-header-icons">
              ${selectedPlatforms.slice(0, 5).map(id => {
                const platform = PLATFORMS.find(p => p.id === id);
                if (!platform) return '';
                return `
                  <div class="sim-mini-icon-btn" style="color: ${platform.color};" title="${platform.name}">
                    ${platform.icon}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    } else if (this.currentTab === 'badges') {
      canvas.innerHTML = `
        ${doctorCardHtml}
        <div class="sim-box">
          <div class="sim-box-title">Verified Medical & Academic Badges</div>
          <div class="sim-verified-badges">
            ${selectedPlatforms.map(id => {
              const platform = PLATFORMS.find(p => p.id === id);
              if (!platform) return '';
              
              let score = 'Verified Presence';
              let sub = 'Official Channel';
              if (id === 'practo') { score = '4.9 ★ (280+ Reviews)'; sub = 'Top Rated Specialist'; }
              else if (id === 'google_business') { score = '5.0 ★ (190+ Reviews)'; sub = 'Google Verified Clinic'; }
              else if (id === 'google_scholar') { score = '340+ Citations'; sub = 'Peer Reviewed Publications'; }
              else if (id === 'orcid') { score = 'Persistent Digital ID'; sub = 'Validated Researcher'; }
              else if (id === 'hospital_profile') { score = 'Active Staff Appointment'; sub = 'Accredited Hospital'; }
              else if (id === 'youtube') { score = '12,000+ Subscribers'; sub = 'Patient Education Channel'; }

              return `
                <div class="sim-badge-card">
                  <div class="sim-badge-platform" style="color: ${platform.color};">
                    ${platform.icon}
                    <span>${platform.name}</span>
                  </div>
                  <div class="sim-badge-rating">${score}</div>
                  <div class="sim-badge-subtext">${sub}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else if (this.currentTab === 'footer') {
      canvas.innerHTML = `
        ${doctorCardHtml}
        <div class="sim-box" style="background: #0F172A; color: white;">
          <div class="sim-box-title" style="color: #94A3B8;">Footer Directory Preview</div>
          <div style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem;">Connect with ${this.doctorData.fullName}</div>
          <p style="font-size: 0.72rem; color: #94A3B8; margin-bottom: 1rem;">
            Follow official channels for surgical updates, health tips, and clinic consultations.
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.45rem;">
            ${selectedPlatforms.map(id => {
              const platform = PLATFORMS.find(p => p.id === id);
              if (!platform) return '';
              const link = links[id] || 'Not linked';
              return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.4rem 0.6rem; background: #1E293B; border-radius: var(--radius-sm); font-size: 0.72rem;">
                  <span style="display: flex; align-items: center; gap: 0.4rem; color: #E2E8F0;">
                    <span style="color: ${platform.color};">${platform.icon}</span>
                    <span>${platform.name}</span>
                  </span>
                  <span style="color: #38BDF8; font-family: var(--font-mono); font-size: 0.65rem;">↗ Visit</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
  }
}
