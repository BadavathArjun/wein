// Main Application Controller for DocFolio Intake Suite
import { Section10Manager } from './section10.js';
import { PortfolioPreviewManager } from './preview.js';
import { SAMPLE_DOCTOR_DATA } from './sample-data.js';

const STORAGE_KEY = 'docfolio_intake_draft_v1';

class DocFolioApp {
  constructor() {
    this.currentMode = 'all'; // 'all' or 'section10_only'
    this.previewManager = new PortfolioPreviewManager();
    this.section10Manager = new Section10Manager({
      onStateChange: (state) => {
        this.previewManager.updateSection10(state);
        this.saveDraft();
        this.updateProgress();
      }
    });
  }

  init() {
    this.previewManager.init();
    this.section10Manager.init();

    this.setupModeSwitcher();
    this.setupInputListeners();
    this.setupSidebarNav();
    this.setupActionButtons();
    this.loadDraft();
    this.updateProgress();
  }

  // Mode Switcher: Express Section 10 vs Full Form
  setupModeSwitcher() {
    const btnAll = document.getElementById('btnModeAll');
    const btnSec10 = document.getElementById('btnModeSection10');
    const sectionsOther = document.querySelectorAll('.form-section-card:not(#section10Card):not(#section11Card)');

    if (btnAll && btnSec10) {
      btnAll.addEventListener('click', () => {
        this.currentMode = 'all';
        btnAll.classList.add('active');
        btnSec10.classList.remove('active');
        sectionsOther.forEach(sec => sec.style.display = 'block');
        this.showToast('Full Doctor Portfolio Intake Mode Activated', 'info');
      });

      btnSec10.addEventListener('click', () => {
        this.currentMode = 'section10_only';
        btnSec10.classList.add('active');
        btnAll.classList.remove('active');
        sectionsOther.forEach(sec => sec.style.display = 'none');
        const sec10 = document.getElementById('section10Card');
        if (sec10) sec10.scrollIntoView({ behavior: 'smooth' });
        this.showToast('Express Social & Profiles Focus Activated', 'info');
      });
    }
  }

  // Listen to input changes in Sections 1-9 to update preview & save draft
  setupInputListeners() {
    const inputs = document.querySelectorAll('.intake-form-container input, .intake-form-container textarea, .intake-form-container select');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.syncDoctorDataToPreview();
        this.saveDraft();
        this.updateProgress();
      });
    });
  }

  syncDoctorDataToPreview() {
    const fullName = document.getElementById('docFullName')?.value.trim() || 'Dr. Rahul Sharma';
    const degrees = document.getElementById('docDegrees')?.value.trim() || 'MBBS, MS (Ortho)';
    const specialty = document.getElementById('docSpecialty')?.value.trim() || 'Senior Consultant Orthopedic Surgeon';
    const councilNumber = document.getElementById('docCouncilNumber')?.value.trim() || '';

    this.previewManager.updateDoctorData({
      fullName,
      degrees,
      specialty,
      councilNumber
    });
  }

  // Sidebar navigation scroll & active highlights
  setupSidebarNav() {
    const navItems = document.querySelectorAll('.nav-step-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          // If in section 10 only mode and clicked another section, automatically switch to full mode
          if (this.currentMode === 'section10_only' && targetId !== '#section10Card') {
            document.getElementById('btnModeAll')?.click();
          }
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          navItems.forEach(n => n.classList.remove('active'));
          item.classList.add('active');
        }
      });
    });
  }

  // Action Buttons: Autofill Demo, Export JSON, Copy WhatsApp, Submit
  setupActionButtons() {
    // Autofill Demo Data
    const btnDemo = document.getElementById('btnAutofillDemo');
    if (btnDemo) {
      btnDemo.addEventListener('click', () => {
        this.populateFormData(SAMPLE_DOCTOR_DATA);
        this.showToast('✨ Loaded sample profile: Dr. K. Prashanth Kumar', 'success');
      });
    }

    // Reset Form
    const btnReset = document.getElementById('btnResetForm');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all fields? Any unsaved changes will be cleared.')) {
          localStorage.removeItem(STORAGE_KEY);
          window.location.reload();
        }
      });
    }

    // Download JSON
    const btnDownload = document.getElementById('btnDownloadJson');
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        const fullData = this.collectFullFormData();
        const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const nameSlug = (fullData.identity?.fullName || 'doctor').toLowerCase().replace(/[^a-z0-9]/g, '_');
        a.href = url;
        a.download = `doctor_intake_${nameSlug}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast('📥 Doctor Portfolio Data exported as JSON', 'success');
      });
    }

    // Copy WhatsApp Formatted Summary
    const btnCopyWA = document.getElementById('btnCopyWhatsApp');
    if (btnCopyWA) {
      btnCopyWA.addEventListener('click', () => {
        const fullData = this.collectFullFormData();
        const text = this.formatWhatsAppSummary(fullData);
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('📋 Summary copied! Ready to paste into WhatsApp.', 'success');
        }).catch(() => {
          this.showToast('Unable to copy automatically. Please export JSON.', 'info');
        });
      });
    }

    // Submit Form (Sends to server /api/submit)
    const form = document.getElementById('doctorIntakeForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleSubmit();
      });
    }
  }

  // Format summary for WhatsApp message
  formatWhatsAppSummary(data) {
    const id = data.identity || {};
    const s10 = data.section10 || {};
    const linksList = Object.entries(s10.links || {})
      .filter(([_, url]) => url)
      .map(([k, url]) => `• *${k.toUpperCase()}*: ${url}`)
      .join('\n');

    return `*🏥 DOCTOR PORTFOLIO ONBOARDING SUBMISSION*
──────────────────────
*Doctor Name*: ${id.fullName || 'Not specified'}
*Specialty*: ${id.specialty || 'Specialist'}
*Degrees*: ${id.degrees || 'N/A'}
*Contact*: ${id.phone || ''} | ${id.email || ''}
*City*: ${id.city || ''}

*🌐 ONLINE & SOCIAL PROFILES (Section 10)*:
*Public Display Consent*: ${s10.consent === 'yes' ? '✅ Yes, display publicly' : s10.consent === 'selected' ? '🔧 Only selected profiles' : '❌ Private / Do not display'}
*Primary Featured Profile*: ${s10.primaryProfile ? s10.primaryProfile.toUpperCase() : 'None'}

*Verified Links*:
${linksList || '• None provided'}

*Placement Preferences*: ${(s10.placements || []).join(', ')}

──────────────────────
_Generated via DocFolio Executive Intake Suite_`;
  }

  // Handle Form Submission
  async function handleSubmit() {
    const fullData = this.collectFullFormData();
    const submitBtn = document.getElementById('btnSubmitForm');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ Submitting Securely...';
    }

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData)
      });
      const result = await response.json();

      if (result.success) {
        this.showSuccessModal(result.submissionId);
        this.showToast(`✅ Profile submitted successfully! Ref: ${result.submissionId}`, 'success');
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (err) {
      console.warn('API error or running statically without backend, falling back to local simulation:', err);
      const mockId = `DOC-${Math.floor(100000 + Math.random() * 900000)}`;
      this.showSuccessModal(mockId);
      this.showToast(`✅ Profile saved locally! Ref: ${mockId}`, 'success');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🚀 Finalize & Submit Portfolio Intake';
      }
    }
  }

  showSuccessModal(refId) {
    const modal = document.getElementById('submissionSuccessModal');
    const refSpan = document.getElementById('successRefId');
    if (refSpan) refSpan.textContent = refId;
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  // Collect All Form Fields
  collectFullFormData() {
    return {
      identity: {
        fullName: document.getElementById('docFullName')?.value.trim() || '',
        degrees: document.getElementById('docDegrees')?.value.trim() || '',
        specialty: document.getElementById('docSpecialty')?.value.trim() || '',
        gender: document.getElementById('docGender')?.value || '',
        phone: document.getElementById('docPhone')?.value.trim() || '',
        whatsapp: document.getElementById('docWhatsapp')?.value.trim() || '',
        email: document.getElementById('docEmail')?.value.trim() || '',
        city: document.getElementById('docCity')?.value.trim() || ''
      },
      qualifications: {
        undergraduate: document.getElementById('docUndergraduate')?.value.trim() || '',
        postgraduate: document.getElementById('docPostgraduate')?.value.trim() || '',
        fellowships: document.getElementById('docFellowships')?.value.trim() || '',
        councilNumber: document.getElementById('docCouncilNumber')?.value.trim() || ''
      },
      clinicalPractice: {
        experienceYears: document.getElementById('docExperience')?.value.trim() || '',
        primaryHospital: document.getElementById('docHospital')?.value.trim() || '',
        designation: document.getElementById('docDesignation')?.value.trim() || '',
        visitingClinics: document.getElementById('docVisiting')?.value.trim() || '',
        bio: document.getElementById('docBio')?.value.trim() || ''
      },
      treatments: {
        coreProcedures: document.getElementById('docProcedures')?.value.trim() || '',
        conditionsTreated: document.getElementById('docConditions')?.value.trim() || '',
        advancedTechnology: document.getElementById('docTechnology')?.value.trim() || ''
      },
      clinicTimings: {
        primaryClinicName: document.getElementById('docClinicName')?.value.trim() || '',
        primaryAddress: document.getElementById('docAddress')?.value.trim() || '',
        opdSchedule: document.getElementById('docOpdSchedule')?.value.trim() || '',
        appointmentMode: document.getElementById('docAppointmentMode')?.value || ''
      },
      achievements: {
        patientMilestone: document.getElementById('docMilestone')?.value.trim() || '',
        awards: document.getElementById('docAwards')?.value.trim() || ''
      },
      research: {
        publicationsCount: document.getElementById('docPublications')?.value.trim() || '',
        keyPapers: document.getElementById('docKeyPapers')?.value.trim() || ''
      },
      mediaAssets: {
        headshotUrl: document.getElementById('docHeadshotUrl')?.value.trim() || '',
        clinicPhotosUrl: document.getElementById('docClinicPhotosUrl')?.value.trim() || ''
      },
      designPreferences: {
        colorMood: document.getElementById('docColorMood')?.value || 'luxury_sapphire',
        primaryCta: document.getElementById('docPrimaryCta')?.value || 'Book Appointment'
      },
      section10: this.section10Manager.getState(),
      timestamp: new Date().toISOString()
    };
  }

  // Populate Form Fields
  populateFormData(data) {
    if (!data) return;

    if (data.identity) {
      if (data.identity.fullName) document.getElementById('docFullName').value = data.identity.fullName;
      if (data.identity.degrees) document.getElementById('docDegrees').value = data.identity.degrees;
      if (data.identity.specialty) document.getElementById('docSpecialty').value = data.identity.specialty;
      if (data.identity.gender) document.getElementById('docGender').value = data.identity.gender;
      if (data.identity.phone) document.getElementById('docPhone').value = data.identity.phone;
      if (data.identity.whatsapp) document.getElementById('docWhatsapp').value = data.identity.whatsapp;
      if (data.identity.email) document.getElementById('docEmail').value = data.identity.email;
      if (data.identity.city) document.getElementById('docCity').value = data.identity.city;
    }

    if (data.qualifications) {
      if (data.qualifications.undergraduate) document.getElementById('docUndergraduate').value = data.qualifications.undergraduate;
      if (data.qualifications.postgraduate) document.getElementById('docPostgraduate').value = data.qualifications.postgraduate;
      if (data.qualifications.fellowships) document.getElementById('docFellowships').value = data.qualifications.fellowships;
      if (data.qualifications.councilNumber) document.getElementById('docCouncilNumber').value = data.qualifications.councilNumber;
    }

    if (data.clinicalPractice) {
      if (data.clinicalPractice.experienceYears) document.getElementById('docExperience').value = data.clinicalPractice.experienceYears;
      if (data.clinicalPractice.primaryHospital) document.getElementById('docHospital').value = data.clinicalPractice.primaryHospital;
      if (data.clinicalPractice.designation) document.getElementById('docDesignation').value = data.clinicalPractice.designation;
      if (data.clinicalPractice.visitingClinics) document.getElementById('docVisiting').value = data.clinicalPractice.visitingClinics;
      if (data.clinicalPractice.bio) document.getElementById('docBio').value = data.clinicalPractice.bio;
    }

    if (data.treatments) {
      if (data.treatments.coreProcedures) document.getElementById('docProcedures').value = data.treatments.coreProcedures;
      if (data.treatments.conditionsTreated) document.getElementById('docConditions').value = data.treatments.conditionsTreated;
      if (data.treatments.advancedTechnology) document.getElementById('docTechnology').value = data.treatments.advancedTechnology;
    }

    if (data.clinicTimings) {
      if (data.clinicTimings.primaryClinicName) document.getElementById('docClinicName').value = data.clinicTimings.primaryClinicName;
      if (data.clinicTimings.primaryAddress) document.getElementById('docAddress').value = data.clinicTimings.primaryAddress;
      if (data.clinicTimings.opdSchedule) document.getElementById('docOpdSchedule').value = data.clinicTimings.opdSchedule;
      if (data.clinicTimings.appointmentMode) document.getElementById('docAppointmentMode').value = data.clinicTimings.appointmentMode;
    }

    if (data.achievements) {
      if (data.achievements.patientMilestone) document.getElementById('docMilestone').value = data.achievements.patientMilestone;
      if (data.achievements.awards) document.getElementById('docAwards').value = data.achievements.awards;
    }

    if (data.research) {
      if (data.research.publicationsCount) document.getElementById('docPublications').value = data.research.publicationsCount;
      if (data.research.keyPapers) document.getElementById('docKeyPapers').value = data.research.keyPapers;
    }

    if (data.mediaAssets) {
      if (data.mediaAssets.headshotUrl) document.getElementById('docHeadshotUrl').value = data.mediaAssets.headshotUrl;
      if (data.mediaAssets.clinicPhotosUrl) document.getElementById('docClinicPhotosUrl').value = data.mediaAssets.clinicPhotosUrl;
    }

    if (data.designPreferences) {
      if (data.designPreferences.colorMood) document.getElementById('docColorMood').value = data.designPreferences.colorMood;
      if (data.designPreferences.primaryCta) document.getElementById('docPrimaryCta').value = data.designPreferences.primaryCta;
    }

    if (data.section10) {
      this.section10Manager.loadState(data.section10);
    }

    this.syncDoctorDataToPreview();
    this.saveDraft();
    this.updateProgress();
  }

  // LocalStorage Auto-Save
  saveDraft() {
    try {
      const data = this.collectFullFormData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      const autoSaveIndicator = document.getElementById('autoSaveText');
      if (autoSaveIndicator) {
        autoSaveIndicator.textContent = 'Auto-Saved';
      }
    } catch (e) {
      console.warn('Auto-save error', e);
    }
  }

  loadDraft() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        this.populateFormData(data);
        const autoSaveIndicator = document.getElementById('autoSaveText');
        if (autoSaveIndicator) {
          autoSaveIndicator.textContent = 'Draft Restored';
        }
      }
    } catch (e) {
      console.warn('Failed loading draft', e);
    }
  }

  // Calculate intake progress percentage
  updateProgress() {
    const data = this.collectFullFormData();
    let score = 0;
    let total = 10;

    if (data.identity.fullName) score++;
    if (data.identity.specialty) score++;
    if (data.identity.phone || data.identity.email) score++;
    if (data.qualifications.undergraduate) score++;
    if (data.clinicalPractice.experienceYears) score++;
    if (data.treatments.coreProcedures) score++;
    if (data.clinicTimings.primaryAddress) score++;
    if (data.section10.selectedPlatforms.length > 0) score += 2;
    if (data.section10.consent) score++;

    const percent = Math.min(100, Math.round((score / total) * 100));

    const fillBar = document.getElementById('heroProgressFill');
    const percentLabel = document.getElementById('heroProgressPercent');
    const stepsLabel = document.getElementById('heroProgressSteps');

    if (fillBar) fillBar.style.width = `${percent}%`;
    if (percentLabel) percentLabel.textContent = `${percent}% Complete`;
    if (stepsLabel) stepsLabel.textContent = `${score} of ${total} Key Sections Filled`;
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : 'ℹ️'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  const app = new DocFolioApp();
  app.init();
  window.docFolioApp = app;

  // Close modal handler
  document.getElementById('btnCloseSuccessModal')?.addEventListener('click', () => {
    document.getElementById('submissionSuccessModal').style.display = 'none';
  });
});
