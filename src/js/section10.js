// Section 10 — Social Media & Professional Profiles Controller
import { PLATFORMS, PLACEMENT_OPTIONS, CONSENT_OPTIONS } from './platforms.js';

export class Section10Manager {
  constructor(options = {}) {
    this.onStateChange = options.onStateChange || (() => {});
    
    // State
    this.state = {
      consent: 'yes',
      selectedPlatforms: new Set(),
      links: {},
      primaryProfile: '',
      placements: new Set(['header', 'hero', 'about', 'contact', 'footer', 'designer_decides'])
    };
    
    this.currentCategoryFilter = 'all';
  }

  init() {
    this.renderConsentCards();
    this.renderPlatformGrid();
    this.renderPlacementCards();
    this.setupFilterListeners();
    this.setupQuickPresets();
    this.updatePrimaryDropdown();
  }

  // Question 🔥: Privacy & Public Display Consent
  renderConsentCards() {
    const container = document.getElementById('consentCardsContainer');
    if (!container) return;

    container.innerHTML = CONSENT_OPTIONS.map(opt => `
      <div class="consent-card ${this.state.consent === opt.value ? 'active' : ''}" data-value="${opt.value}">
        <div class="consent-radio-dot"></div>
        <div class="consent-details">
          <div class="consent-header-row">
            <div class="consent-title">
              <span>${opt.icon}</span>
              <span>${opt.title}</span>
            </div>
            <span class="consent-badge ${opt.badgeClass}">${opt.badge}</span>
          </div>
          <p class="consent-desc">${opt.desc}</p>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.consent-card').forEach(card => {
      card.addEventListener('click', () => {
        const val = card.dataset.value;
        this.setConsent(val);
      });
    });
  }

  setConsent(val) {
    this.state.consent = val;
    document.querySelectorAll('.consent-card').forEach(c => {
      c.classList.toggle('active', c.dataset.value === val);
    });
    this.notifyChange();
  }

  // Question 44: Platforms Selection Grid
  renderPlatformGrid() {
    const grid = document.getElementById('platformsSelectGrid');
    if (!grid) return;

    const filtered = PLATFORMS.filter(p => {
      if (this.currentCategoryFilter === 'all') return true;
      return p.category === this.currentCategoryFilter;
    });

    grid.innerHTML = filtered.map(p => {
      const isSelected = this.state.selectedPlatforms.has(p.id);
      return `
        <div class="platform-select-card ${isSelected ? 'selected' : ''}" data-platform-id="${p.id}">
          <div class="platform-icon-wrap" style="background: ${p.bgLight}; color: ${p.color}">
            ${p.icon}
          </div>
          <div class="platform-info">
            <div class="platform-name">${p.name}</div>
            <div class="platform-tag">${p.tag}</div>
          </div>
          <div class="platform-checkbox"></div>
        </div>
      `;
    }).join('');

    // Attach click handlers
    grid.querySelectorAll('.platform-select-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.platformId;
        this.togglePlatform(id);
      });
    });

    this.updateSummaryBar();
  }

  togglePlatform(id) {
    if (this.state.selectedPlatforms.has(id)) {
      this.state.selectedPlatforms.delete(id);
      delete this.state.links[id];
      if (this.state.primaryProfile === id) {
        this.state.primaryProfile = '';
      }
    } else {
      this.state.selectedPlatforms.add(id);
    }

    this.updatePlatformCardsVisual();
    this.renderRevealedLinks();
    this.updatePrimaryDropdown();
    this.updateSummaryBar();
    this.notifyChange();
  }

  updatePlatformCardsVisual() {
    document.querySelectorAll('.platform-select-card').forEach(card => {
      const id = card.dataset.platformId;
      card.classList.toggle('selected', this.state.selectedPlatforms.has(id));
    });
  }

  updateSummaryBar() {
    const bar = document.getElementById('platformsSummaryBar');
    if (!bar) return;
    const count = this.state.selectedPlatforms.size;
    if (count === 0) {
      bar.innerHTML = `<span>No profiles selected yet. Choose the channels you maintain above.</span>`;
    } else {
      bar.innerHTML = `
        <span><strong>${count}</strong> profile${count > 1 ? 's' : ''} selected. Fill the link fields below.</span>
        <button type="button" class="btn-pill-action" id="btnClearSelection">Clear All</button>
      `;
      const clearBtn = document.getElementById('btnClearSelection');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          this.state.selectedPlatforms.clear();
          this.state.links = {};
          this.state.primaryProfile = '';
          this.updatePlatformCardsVisual();
          this.renderRevealedLinks();
          this.updatePrimaryDropdown();
          this.updateSummaryBar();
          this.notifyChange();
        });
      }
    }
  }

  // Dynamic Revealed Link Inputs (Questions 45 to 58)
  renderRevealedLinks() {
    const container = document.getElementById('revealedLinksContainer');
    const emptyNotice = document.getElementById('emptyLinksNotice');
    if (!container) return;

    if (this.state.selectedPlatforms.size === 0) {
      container.innerHTML = '';
      if (emptyNotice) emptyNotice.style.display = 'block';
      return;
    }

    if (emptyNotice) emptyNotice.style.display = 'none';

    // Maintain order defined in PLATFORMS
    const selectedList = PLATFORMS.filter(p => this.state.selectedPlatforms.has(p.id));

    container.innerHTML = selectedList.map(p => {
      const existingVal = this.state.links[p.id] || '';
      const isValid = this.validateUrl(existingVal, p);

      return `
        <div class="revealed-link-card" id="linkCard_${p.id}">
          <div class="revealed-card-header">
            <div class="revealed-platform-title">
              <span class="platform-icon-wrap" style="width: 28px; height: 28px; background: ${p.bgLight}; color: ${p.color}">
                ${p.icon}
              </span>
              <span><strong>#${p.number}.</strong> ${p.name}</span>
            </div>
            <div class="revealed-actions">
              <button type="button" class="btn-remove-link" data-remove-id="${p.id}" title="Remove this profile">
                ✕ Remove
              </button>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 0.5rem;">
            ${p.isParagraph ? `
              <textarea 
                class="form-control" 
                id="input_${p.id}" 
                data-platform-id="${p.id}"
                placeholder="${p.placeholder}"
                rows="3">${existingVal}</textarea>
            ` : `
              <div class="input-with-test-action">
                <input 
                  type="url" 
                  class="form-control" 
                  id="input_${p.id}" 
                  data-platform-id="${p.id}"
                  placeholder="${p.placeholder}"
                  value="${existingVal}"
                  autocomplete="off"
                />
                <button type="button" class="btn-test-link" id="btnTest_${p.id}" data-test-id="${p.id}" ${existingVal ? '' : 'disabled'}>
                  🔗 Test Link
                </button>
              </div>
            `}
            <div class="link-validation-indicator" id="validation_${p.id}">
              ${existingVal && isValid ? '<span class="validation-valid">✓ Valid link format</span>' : `<span class="validation-hint">💡 Example: ${p.example}</span>`}
            </div>
          </div>
          <p class="form-hint">${p.helperText}</p>
        </div>
      `;
    }).join('');

    // Attach input & test link events
    selectedList.forEach(p => {
      const input = document.getElementById(`input_${p.id}`);
      const testBtn = document.getElementById(`btnTest_${p.id}`);
      const valIndicator = document.getElementById(`validation_${p.id}`);

      if (input) {
        input.addEventListener('input', (e) => {
          const val = e.target.value.trim();
          this.state.links[p.id] = val;

          if (testBtn) {
            testBtn.disabled = !val;
          }

          const isValid = this.validateUrl(val, p);
          if (valIndicator) {
            if (val && isValid) {
              valIndicator.innerHTML = '<span class="validation-valid">✓ Link verified & ready</span>';
            } else if (val) {
              valIndicator.innerHTML = '<span class="validation-hint">⚠️ Please check full URL format (include https://)</span>';
            } else {
              valIndicator.innerHTML = `<span class="validation-hint">💡 Example: ${p.example}</span>`;
            }
          }

          this.notifyChange();
        });
      }

      if (testBtn) {
        testBtn.addEventListener('click', () => {
          const url = this.state.links[p.id];
          if (url) {
            const finalUrl = url.startsWith('http') ? url : `https://${url}`;
            window.open(finalUrl, '_blank', 'noopener,noreferrer');
          }
        });
      }
    });

    // Remove buttons
    container.querySelectorAll('.btn-remove-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.removeId;
        this.togglePlatform(id);
      });
    });
  }

  validateUrl(url, platform) {
    if (!url) return false;
    try {
      const regex = new RegExp(platform.pattern, 'i');
      return regex.test(url) || url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return url.length > 5;
    }
  }

  // Question 59: Dynamic Primary Profile Dropdown
  updatePrimaryDropdown() {
    const select = document.getElementById('primaryProfileSelect');
    const previewBadge = document.getElementById('primaryBadgePreview');
    if (!select) return;

    const selectedList = PLATFORMS.filter(p => this.state.selectedPlatforms.has(p.id));

    if (selectedList.length === 0) {
      select.innerHTML = `<option value="">-- No profiles selected yet --</option>`;
      select.disabled = true;
      if (previewBadge) {
        previewBadge.innerHTML = '<span>No primary profile set</span>';
      }
      return;
    }

    select.disabled = false;
    let optionsHtml = `<option value="">-- Highlight None (Treat All Equally) --</option>`;

    selectedList.forEach(p => {
      const isSelected = this.state.primaryProfile === p.id;
      optionsHtml += `<option value="${p.id}" ${isSelected ? 'selected' : ''}>⭐ ${p.name} (${p.tag})</option>`;
    });

    select.innerHTML = optionsHtml;

    // If current primary profile is not in list, auto-select first one
    if (!this.state.primaryProfile && selectedList.length > 0) {
      // Default recommendation: Practo, Google Business, or LinkedIn
      const preferred = selectedList.find(p => ['practo', 'google_business', 'linkedin', 'instagram'].includes(p.id));
      this.state.primaryProfile = preferred ? preferred.id : selectedList[0].id;
      select.value = this.state.primaryProfile;
    }

    // Attach change listener
    select.onchange = (e) => {
      this.state.primaryProfile = e.target.value;
      this.updatePrimaryBadgePreview();
      this.notifyChange();
    };

    this.updatePrimaryBadgePreview();
  }

  updatePrimaryBadgePreview() {
    const previewBadge = document.getElementById('primaryBadgePreview');
    if (!previewBadge) return;

    if (!this.state.primaryProfile) {
      previewBadge.innerHTML = '<span>None highlighted</span>';
      return;
    }

    const platform = PLATFORMS.find(p => p.id === this.state.primaryProfile);
    if (platform) {
      previewBadge.innerHTML = `
        <span style="color: ${platform.color};">${platform.icon}</span>
        <span>Featured: <strong>${platform.name}</strong></span>
      `;
    }
  }

  // Question 60: Placement Options
  renderPlacementCards() {
    const container = document.getElementById('placementGridContainer');
    if (!container) return;

    container.innerHTML = PLACEMENT_OPTIONS.map(opt => {
      const isSelected = this.state.placements.has(opt.id);
      return `
        <div class="placement-card ${isSelected ? 'selected' : ''}" data-placement-id="${opt.id}">
          <div class="placement-top-row">
            <div class="placement-title">
              <span>${opt.icon}</span>
              <span>${opt.label}</span>
            </div>
            <div class="placement-checkbox"></div>
          </div>
          <p class="placement-desc">${opt.desc}</p>
          ${opt.isRecommended ? '<span class="placement-recommended-tag">⭐ Recommended</span>' : ''}
        </div>
      `;
    }).join('');

    container.querySelectorAll('.placement-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.placementId;
        if (this.state.placements.has(id)) {
          this.state.placements.delete(id);
        } else {
          this.state.placements.add(id);
        }
        card.classList.toggle('selected', this.state.placements.has(id));
        this.notifyChange();
      });
    });
  }

  // Filter Pills & Quick Presets
  setupFilterListeners() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategoryFilter = btn.dataset.category;
        this.renderPlatformGrid();
      });
    });
  }

  setupQuickPresets() {
    const btnMedical = document.getElementById('btnPresetMedical');
    const btnTop3 = document.getElementById('btnPresetTop3');

    if (btnMedical) {
      btnMedical.addEventListener('click', () => {
        ['practo', 'google_business', 'hospital_profile', 'lybrate'].forEach(id => {
          this.state.selectedPlatforms.add(id);
        });
        this.updatePlatformCardsVisual();
        this.renderRevealedLinks();
        this.updatePrimaryDropdown();
        this.updateSummaryBar();
        this.notifyChange();
      });
    }

    if (btnTop3) {
      btnTop3.addEventListener('click', () => {
        ['google_business', 'linkedin', 'instagram'].forEach(id => {
          this.state.selectedPlatforms.add(id);
        });
        this.updatePlatformCardsVisual();
        this.renderRevealedLinks();
        this.updatePrimaryDropdown();
        this.updateSummaryBar();
        this.notifyChange();
      });
    }
  }

  // Load state from saved data
  loadState(data) {
    if (!data) return;
    if (data.consent) this.state.consent = data.consent;
    if (Array.isArray(data.selectedPlatforms)) {
      this.state.selectedPlatforms = new Set(data.selectedPlatforms);
    }
    if (data.links) {
      this.state.links = { ...data.links };
    }
    if (data.primaryProfile) {
      this.state.primaryProfile = data.primaryProfile;
    }
    if (Array.isArray(data.placements)) {
      this.state.placements = new Set(data.placements);
    }

    this.renderConsentCards();
    this.updatePlatformCardsVisual();
    this.renderRevealedLinks();
    this.updatePrimaryDropdown();
    this.updateSummaryBar();
    this.renderPlacementCards();
    this.notifyChange();
  }

  getState() {
    return {
      consent: this.state.consent,
      selectedPlatforms: Array.from(this.state.selectedPlatforms),
      links: { ...this.state.links },
      primaryProfile: this.state.primaryProfile,
      placements: Array.from(this.state.placements)
    };
  }

  notifyChange() {
    this.onStateChange(this.getState());
  }
}
