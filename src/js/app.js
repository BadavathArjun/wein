// Main Application Controller for DocFolio Medical Intake Suite
// Executive Doctor Onboarding & WhatsApp Transmission Engine
import { SAMPLE_DOCTOR_DATA } from './sample-data.js';

const STORAGE_KEY = 'docfolio_medical_intake_draft_v2';

class DocFolioApp {
  constructor() {}

  init() {
    this.setupInputListeners();
    this.setupQuickChips();
    this.setupSidebarNav();
    this.setupMobileNavigation();
    this.setupScrollSpy();
    this.setupActionButtons();
    this.loadDraft();
    this.updateProgress();
  }

  // Listen to input changes in Sections to autosave and update progress
  setupInputListeners() {
    const inputs = document.querySelectorAll('.intake-form-container input, .intake-form-container textarea, .intake-form-container select');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.saveDraft();
        this.updateProgress();
      });
      input.addEventListener('change', () => {
        this.saveDraft();
        this.updateProgress();
      });
    });
  }

  // Quick chips handler for effortless doctor credential and specialty input
  setupQuickChips() {
    const chips = document.querySelectorAll('.quick-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const targetId = chip.dataset.target;
        const val = chip.dataset.value;
        const targetInput = document.getElementById(targetId);
        if (!targetInput || !val) return;

        if (targetInput.tagName === 'TEXTAREA') {
          const current = targetInput.value.trim();
          if (!current) {
            targetInput.value = val;
          } else if (!current.includes(val)) {
            targetInput.value = current + '\n' + val;
          }
        } else if (targetId === 'docExperience') {
          targetInput.value = val;
        } else {
          const current = targetInput.value.trim();
          if (!current) {
            targetInput.value = val;
          } else if (!current.includes(val)) {
            targetInput.value = current + ', ' + val;
          }
        }

        // Trigger input event to re-evaluate autosave and progress
        targetInput.dispatchEvent(new Event('input', { bubbles: true }));
        this.showToast(`Selected: ${val}`, 'info');
      });
    });
  }

  // Sidebar navigation scroll & active highlights (Desktop)
  setupSidebarNav() {
    const navItems = document.querySelectorAll('.nav-step-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          navItems.forEach(n => n.classList.remove('active'));
          item.classList.add('active');
        }
      });
    });
  }

  // Mobile Bottom Bar, Drawer & Stepper Navigation
  setupMobileNavigation() {
    const sections = Array.from(document.querySelectorAll('.form-section-card'));
    let currentSectionIdx = 0;

    const getSectionIndexFromId = (id) => {
      return sections.findIndex(s => s.getAttribute('id') === id);
    };

    const scrollToSection = (targetId) => {
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Card stepper footer buttons (Prev / Next)
    document.querySelectorAll('.btn-step-prev, .btn-step-next').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-step-target') || btn.getAttribute('href');
        if (targetId) {
          scrollToSection(targetId);
        }
      });
    });

    // Mobile Bottom Bar Prev / Next buttons
    const btnBarPrev = document.getElementById('btnMobileBarPrev');
    const btnBarNext = document.getElementById('btnMobileBarNext');

    if (btnBarPrev) {
      btnBarPrev.addEventListener('click', () => {
        if (currentSectionIdx > 0) {
          const target = sections[currentSectionIdx - 1];
          if (target) scrollToSection(`#${target.id}`);
        }
      });
    }

    if (btnBarNext) {
      btnBarNext.addEventListener('click', () => {
        if (currentSectionIdx < sections.length - 1) {
          const target = sections[currentSectionIdx + 1];
          if (target) scrollToSection(`#${target.id}`);
        }
      });
    }

    // Mobile Drawer open/close
    const drawer = document.getElementById('mobileNavDrawer');
    const btnOpen = document.getElementById('btnMobileDrawerOpen');
    const btnHeaderMenu = document.getElementById('btnHeaderMenu');
    const btnClose = document.getElementById('btnDrawerClose');
    const backdrop = document.getElementById('drawerBackdrop');

    const openDrawer = () => {
      if (drawer) {
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    };

    const closeDrawer = () => {
      if (drawer) {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    };

    btnOpen?.addEventListener('click', openDrawer);
    btnHeaderMenu?.addEventListener('click', openDrawer);
    btnClose?.addEventListener('click', closeDrawer);
    backdrop?.addEventListener('click', closeDrawer);

    // Escape key closes drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer?.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Mobile Drawer item clicks
    document.querySelectorAll('.drawer-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href');
        closeDrawer();
        if (targetId) {
          setTimeout(() => scrollToSection(targetId), 150);
        }
      });
    });

    // Expose helper to update bottom bar during ScrollSpy
    this.updateCurrentSectionIndicator = (id) => {
      const idx = getSectionIndexFromId(id);
      if (idx !== -1) {
        currentSectionIdx = idx;
        const targetCard = sections[idx];
        const num = targetCard.getAttribute('data-section-number') || `0${idx + 1}`.slice(-2);
        const name = targetCard.getAttribute('data-section-name') || targetCard.querySelector('h3')?.textContent || 'Section';

        const numEl = document.getElementById('mobileBarNum');
        const titleEl = document.getElementById('mobileBarTitle');

        if (numEl) numEl.textContent = `${num}/10`;
        if (titleEl) titleEl.textContent = name;

        if (btnBarPrev) {
          btnBarPrev.style.opacity = idx === 0 ? '0.35' : '1';
          btnBarPrev.style.pointerEvents = idx === 0 ? 'none' : 'auto';
        }
        if (btnBarNext) {
          btnBarNext.style.opacity = idx === sections.length - 1 ? '0.35' : '1';
          btnBarNext.style.pointerEvents = idx === sections.length - 1 ? 'none' : 'auto';
        }

        // Sync active class in mobile drawer
        document.querySelectorAll('.drawer-nav-item').forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    };
  }

  // ScrollSpy to highlight active section and update mobile status bar
  setupScrollSpy() {
    const sections = document.querySelectorAll('.form-section-card');
    const navItems = document.querySelectorAll('.nav-step-item');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach(item => {
            if (item.getAttribute('href') === `#${id}`) {
              navItems.forEach(n => n.classList.remove('active'));
              item.classList.add('active');
            }
          });
          if (this.updateCurrentSectionIndicator) {
            this.updateCurrentSectionIndicator(id);
          }
        }
      });
    }, {
      rootMargin: '-15% 0px -60% 0px'
    });

    sections.forEach(section => observer.observe(section));
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
        if (confirm('Are you sure you want to reset all fields? All unsaved inputs will be cleared.')) {
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
        this.showToast('📥 Doctor Portfolio profile exported as JSON', 'success');
      });
    }

    // Copy WhatsApp Formatted Summary
    const btnCopyWA = document.getElementById('btnCopyWhatsApp');
    if (btnCopyWA) {
      btnCopyWA.addEventListener('click', () => {
        const fullData = this.collectFullFormData();
        const text = this.formatWhatsAppSummary(fullData);
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('📋 WhatsApp summary copied! Ready to send to 9493690611.', 'success');
        }).catch(() => {
          this.showToast('Unable to copy automatically. Please export JSON.', 'info');
        });
      });
    }

    // Submit Form (Dispatches to server and automatically opens WhatsApp 9493690611)
    const form = document.getElementById('doctorIntakeForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleSubmit();
      });
    }
  }

  // Format all submitted form fields for WhatsApp message
  formatWhatsAppSummary(data, refId = '') {
    const id = data.identity || {};
    const qual = data.qualifications || {};
    const prac = data.clinicalPractice || {};
    const treat = data.treatments || {};
    const timing = data.clinicTimings || {};
    const ach = data.achievements || {};
    const res = data.research || {};
    const media = data.mediaAssets || {};
    const design = data.designPreferences || {};

    let msg = `*🏥 DOCTOR PORTFOLIO INTAKE SUBMISSION*\n`;
    msg += `─────────────────────────\n`;
    if (refId) msg += `*Reference Code*: ${refId}\n\n`;

    // 1. Identity & Contact
    msg += `*👨‍⚕️ 1. DOCTOR IDENTITY & CONTACT*\n`;
    msg += `• *Full Name*: ${id.fullName || 'Not specified'}\n`;
    msg += `• *Degrees*: ${id.degrees || 'N/A'}\n`;
    msg += `• *Specialty*: ${id.specialty || 'N/A'}\n`;
    if (id.gender) msg += `• *Gender*: ${id.gender}\n`;
    msg += `• *Phone*: ${id.phone || 'N/A'}\n`;
    if (id.whatsapp) msg += `• *WhatsApp*: ${id.whatsapp}\n`;
    msg += `• *Email*: ${id.email || 'N/A'}\n`;
    msg += `• *City*: ${id.city || 'N/A'}\n\n`;

    // 2. Qualifications
    msg += `*🎓 2. QUALIFICATIONS & COUNCIL REG*\n`;
    if (qual.undergraduate) msg += `• *MBBS / UG*: ${qual.undergraduate}\n`;
    if (qual.postgraduate) msg += `• *MD / MS / DNB*: ${qual.postgraduate}\n`;
    if (qual.fellowships) msg += `• *Fellowships*: ${qual.fellowships}\n`;
    msg += `• *Medical Council Reg*: ${qual.councilNumber || 'N/A'}\n\n`;

    // 3. Clinical Practice
    msg += `*🏥 3. CLINICAL PRACTICE*\n`;
    if (prac.experienceYears) msg += `• *Experience*: ${prac.experienceYears}\n`;
    if (prac.primaryHospital) msg += `• *Primary Hospital*: ${prac.primaryHospital}\n`;
    if (prac.designation) msg += `• *Designation*: ${prac.designation}\n`;
    if (prac.visitingClinics) msg += `• *Visiting Clinics*: ${prac.visitingClinics}\n`;
    if (prac.bio) msg += `• *Bio Summary*: ${prac.bio.length > 250 ? prac.bio.slice(0, 250) + '...' : prac.bio}\n\n`;

    // 4. Treatments & Procedures
    msg += `*🩺 4. PROCEDURES & CONDITIONS*\n`;
    if (treat.coreProcedures) msg += `• *Core Procedures*: ${treat.coreProcedures.replace(/\n/g, ', ')}\n`;
    if (treat.conditionsTreated) msg += `• *Conditions Treated*: ${treat.conditionsTreated.replace(/\n/g, ', ')}\n`;
    if (treat.advancedTechnology) msg += `• *Technology / Equipment*: ${treat.advancedTechnology}\n\n`;

    // 5. Clinic Timings & OPD
    msg += `*📍 5. CLINIC & OPD SCHEDULE*\n`;
    if (timing.primaryClinicName) msg += `• *Primary Clinic*: ${timing.primaryClinicName}\n`;
    if (timing.primaryAddress) msg += `• *Address*: ${timing.primaryAddress}\n`;
    if (timing.opdSchedule) msg += `• *OPD Timings*: ${timing.opdSchedule}\n`;
    if (timing.appointmentMode) msg += `• *Appointment Booking*: ${timing.appointmentMode}\n\n`;

    // 6. Achievements
    if (ach.patientMilestone || ach.awards) {
      msg += `*🏆 6. ACHIEVEMENTS & AWARDS*\n`;
      if (ach.patientMilestone) msg += `• *Milestones*: ${ach.patientMilestone}\n`;
      if (ach.awards) msg += `• *Awards*: ${ach.awards.replace(/\n/g, '; ')}\n\n`;
    }

    // 7. Research
    if (res.publicationsCount || res.keyPapers) {
      msg += `*📚 7. RESEARCH & PUBLICATIONS*\n`;
      if (res.publicationsCount) msg += `• *Publications*: ${res.publicationsCount}\n`;
      if (res.keyPapers) msg += `• *Key Papers*: ${res.keyPapers.replace(/\n/g, '; ')}\n\n`;
    }

    // 8. Media Assets
    if (media.headshotUrl || media.clinicPhotosUrl) {
      msg += `*📸 8. PHOTOS & MEDIA ASSETS*\n`;
      if (media.headshotUrl) msg += `• *Headshot URL*: ${media.headshotUrl}\n`;
      if (media.clinicPhotosUrl) msg += `• *Clinic Photos*: ${media.clinicPhotosUrl}\n\n`;
    }

    // 9. Design Preferences
    msg += `*🎨 9. DESIGN PREFERENCES*\n`;
    msg += `• *Color Theme*: ${design.colorMood || 'Luxury Sapphire'}\n`;
    msg += `• *Primary CTA*: ${design.primaryCta || 'Book OPD Consultation'}\n`;
    msg += `─────────────────────────\n`;
    msg += `_Delivered to DocFolio Portfolio Studio (WhatsApp: +91 9493690611)_`;

    return msg;
  }

  // Handle Form Submission: Sends to backend and dispatches directly to WhatsApp
  async handleSubmit() {
    const fullData = this.collectFullFormData();
    const submitBtn = document.getElementById('btnSubmitForm');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ Connecting to WhatsApp (+91 9493690611)...';
    }

    const mockId = `DOC-${Math.floor(100000 + Math.random() * 900000)}`;
    let finalSubmissionId = mockId;

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData)
      });
      const result = await response.json();

      if (result.success) {
        finalSubmissionId = result.submissionId;
      }
    } catch (err) {
      console.warn('Backend note (operating directly):', err);
    }

    // Format all submitted data for WhatsApp
    const waText = this.formatWhatsAppSummary(fullData, finalSubmissionId);
    const targetPhone = '919493690611';
    const waUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(waText)}`;

    // Automatically open WhatsApp in new tab
    try {
      window.open(waUrl, '_blank');
    } catch (e) {
      console.warn('Popup blocked, opening available via modal', e);
    }

    // Show Success Modal with direct WhatsApp send button
    this.showSuccessModal(finalSubmissionId, waUrl);
    this.showToast('✅ Intake submitted! Opening WhatsApp: 9493690611', 'success');

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>🚀</span> Finalize &amp; Send Directly to WhatsApp (+91 9493690611)';
    }
  }

  showSuccessModal(refId, waUrl = '') {
    const modal = document.getElementById('submissionSuccessModal');
    const refSpan = document.getElementById('successRefId');
    const waBtn = document.getElementById('btnModalSendWhatsApp');
    if (refSpan) refSpan.textContent = refId;
    if (waBtn && waUrl) {
      waBtn.href = waUrl;
    }
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
        primaryCta: document.getElementById('docPrimaryCta')?.value || 'Book OPD Consultation'
      },
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

    this.saveDraft();
    this.updateProgress();
  }

  // Local Storage Save & Restore
  saveDraft() {
    const data = this.collectFullFormData();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      const text = document.getElementById('autoSaveText');
      if (text) text.textContent = 'Auto-Saved';
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  loadDraft() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        this.populateFormData(data);
        this.showToast('📋 Restored your saved draft intake', 'info');
      }
    } catch (e) {
      console.warn('LocalStorage load failed:', e);
    }
  }

  // Live Section Progress Calculation, Desktop & Drawer Checkmarks
  updateProgress() {
    const data = this.collectFullFormData();
    
    // Check completion of each section
    const sec1Filled = !!(data.identity.fullName && (data.identity.phone || data.identity.email));
    const sec2Filled = !!(data.qualifications.undergraduate || data.qualifications.councilNumber);
    const sec3Filled = !!(data.clinicalPractice.primaryHospital || data.clinicalPractice.experienceYears);
    const sec4Filled = !!(data.treatments.coreProcedures || data.treatments.conditionsTreated);
    const sec5Filled = !!(data.clinicTimings.primaryClinicName || data.clinicTimings.primaryAddress || data.clinicTimings.opdSchedule);
    const sec6Filled = !!(data.achievements.patientMilestone || data.achievements.awards);
    const sec7Filled = !!(data.research.publicationsCount || data.research.keyPapers);
    const sec8Filled = !!(data.mediaAssets.headshotUrl || data.mediaAssets.clinicPhotosUrl);
    const sec9Filled = !!(data.designPreferences.colorMood);
    const sec10Filled = sec1Filled && (sec2Filled || sec3Filled);

    const sectionsStatus = [
      { id: 'stepCheck01', drawerId: 'drawerCheck01', cardId: 'section1Card', filled: sec1Filled },
      { id: 'stepCheck02', drawerId: 'drawerCheck02', cardId: 'section2Card', filled: sec2Filled },
      { id: 'stepCheck03', drawerId: 'drawerCheck03', cardId: 'section3Card', filled: sec3Filled },
      { id: 'stepCheck04', drawerId: 'drawerCheck04', cardId: 'section4Card', filled: sec4Filled },
      { id: 'stepCheck05', drawerId: 'drawerCheck05', cardId: 'section5Card', filled: sec5Filled },
      { id: 'stepCheck06', drawerId: 'drawerCheck06', cardId: 'section6Card', filled: sec6Filled },
      { id: 'stepCheck07', drawerId: 'drawerCheck07', cardId: 'section7Card', filled: sec7Filled },
      { id: 'stepCheck08', drawerId: 'drawerCheck08', cardId: 'section8Card', filled: sec8Filled },
      { id: 'stepCheck09', drawerId: 'drawerCheck09', cardId: 'section9Card', filled: sec9Filled },
      { id: 'stepCheck10', drawerId: 'drawerCheck10', cardId: 'section11Card', filled: sec10Filled }
    ];

    let filledCount = 0;
    sectionsStatus.forEach(sec => {
      const el = document.getElementById(sec.id);
      const drawerEl = document.getElementById(sec.drawerId);
      const cardEl = document.getElementById(sec.cardId);

      if (sec.filled) {
        if (el) el.classList.add('filled');
        if (drawerEl) drawerEl.classList.add('filled');
        if (cardEl) cardEl.classList.add('section-filled');
        filledCount++;
      } else {
        if (el) el.classList.remove('filled');
        if (drawerEl) drawerEl.classList.remove('filled');
        if (cardEl) cardEl.classList.remove('section-filled');
      }
    });

    const percent = Math.min(100, Math.round((filledCount / 10) * 100));

    const fillBar = document.getElementById('heroProgressFill');
    const percentLabel = document.getElementById('heroProgressPercent');
    const stepsLabel = document.getElementById('heroProgressSteps');
    const mobileFill = document.getElementById('mobileBarFill');
    const drawerText = document.getElementById('drawerProgressText');

    if (fillBar) fillBar.style.width = `${percent}%`;
    if (mobileFill) mobileFill.style.width = `${percent}%`;
    if (percentLabel) percentLabel.textContent = `${percent}% Complete`;
    if (stepsLabel) stepsLabel.textContent = `${filledCount} of 10 Sections Filled`;
    if (drawerText) drawerText.textContent = `${filledCount} of 10 Completed (${percent}%)`;
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
    }, 3200);
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
