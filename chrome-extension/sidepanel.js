// DOM Elements - Onboarding
const onboardingApi = document.getElementById('onboarding-api');
const onboardingCompany = document.getElementById('onboarding-company');
const onboardingGoals = document.getElementById('onboarding-goals');
const mainSection = document.getElementById('main-section');

// Onboarding buttons
const onboardingApiNext = document.getElementById('onboarding-api-next');
const onboardingCompanyBack = document.getElementById('onboarding-company-back');
const onboardingCompanyNext = document.getElementById('onboarding-company-next');
const onboardingGoalsBack = document.getElementById('onboarding-goals-back');
const onboardingGoalsFinish = document.getElementById('onboarding-goals-finish');
const importProfileBtn = document.getElementById('import-profile-btn');
const importFileInput = document.getElementById('import-file-input');

// Main section elements
const analyzeBtn = document.getElementById('analyze-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsSection = document.getElementById('settings-section');
const settingsBackBtn = document.getElementById('settings-back-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const exportSettingsBtn = document.getElementById('export-settings-btn');
const importSettingsBtn = document.getElementById('import-settings-btn');
const settingsImportFile = document.getElementById('settings-import-file');
const resetExtensionBtn = document.getElementById('reset-extension-btn');
const loadingDiv = document.getElementById('loading');
const resultsDiv = document.getElementById('results');
const errorDiv = document.getElementById('error');
const emptyState = document.getElementById('empty-state');
const retryBtn = document.getElementById('retry-btn');
const copyBtn = document.getElementById('copy-btn');
const csvBtn = document.getElementById('csv-btn');
const reanalyzeBtn = document.getElementById('reanalyze-btn');
const currentUrlSpan = document.getElementById('current-url');
const exportAllBtn = document.getElementById('export-all-btn');
const viewTargetsBtn = document.getElementById('view-targets-btn');

// Store current analysis data for copying
let currentAnalysisData = null;
let userProfile = null;
let currentFilter = 'all';
let savedEvents = {}; // Store analyzed events by URL
let currentTabUrl = null;
let eventsSortBy = 'roi'; // Default sort

// Default profile structure
const defaultProfile = {
  geminiApiKey: '',
  companyName: '',
  yourRole: '',
  product: '',
  valueProp: '',
  targetPersonas: '',
  targetIndustries: '',
  competitors: '',
  dealSize: '',
  conversionRate: '',
  oppWinRate: '',
  eventGoal: '',
  notes: '',
  onboardingComplete: false
};

// Initialize side panel
document.addEventListener('DOMContentLoaded', async () => {
  userProfile = await loadProfile();
  savedEvents = await loadSavedEvents();
  
  if (userProfile.onboardingComplete && userProfile.geminiApiKey) {
    showMainSection();
    await updateCurrentUrl();
    await checkForCachedAnalysis();
    updateEventsCount();
  } else {
    showOnboardingStep(1);
  }
});

// Profile Management
async function loadProfile() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['userProfile'], (result) => {
      resolve({ ...defaultProfile, ...(result.userProfile || {}) });
    });
  });
}

async function saveProfile(profile) {
  userProfile = profile;
  return new Promise((resolve) => {
    chrome.storage.local.set({ userProfile: profile }, resolve);
  });
}

// Events Storage
async function loadSavedEvents() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['savedEvents'], (result) => {
      resolve(result.savedEvents || {});
    });
  });
}

async function saveEvent(url, data) {
  const eventKey = normalizeUrl(url);
  savedEvents[eventKey] = {
    ...data,
    url: url,
    analyzedAt: new Date().toISOString(),
    lastViewed: new Date().toISOString()
  };
  return new Promise((resolve) => {
    chrome.storage.local.set({ savedEvents }, resolve);
  });
}

async function deleteEvent(url) {
  const eventKey = normalizeUrl(url);
  delete savedEvents[eventKey];
  return new Promise((resolve) => {
    chrome.storage.local.set({ savedEvents }, resolve);
  });
}

function normalizeUrl(url) {
  try {
    const u = new URL(url);
    return u.origin + u.pathname;
  } catch {
    return url;
  }
}

function getEventByUrl(url) {
  const eventKey = normalizeUrl(url);
  return savedEvents[eventKey] || null;
}

async function checkForCachedAnalysis() {
  if (!currentTabUrl) return;
  
  // Hide saved event banner when checking current page
  hideSavedEventBanner();
  
  const cached = getEventByUrl(currentTabUrl);
  const cachedIndicator = document.getElementById('cached-indicator');
  const analyzeBtn = document.getElementById('analyze-btn');
  
  if (cached) {
    // Show cached results
    cachedIndicator?.classList.remove('hidden');
    analyzeBtn?.classList.add('hidden'); // Hide main analyze button
    showResults(cached);
  } else {
    // Reset to empty state for new/unanalyzed page
    cachedIndicator?.classList.add('hidden');
    analyzeBtn?.classList.remove('hidden'); // Show main analyze button
    resultsDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    emptyState.classList.remove('hidden');
    currentAnalysisData = null;
  }
}

function updateEventsCount() {
  const countEl = document.getElementById('events-count');
  if (countEl) {
    const count = Object.keys(savedEvents).length;
    countEl.textContent = count;
    countEl.classList.toggle('hidden', count === 0);
  }
}

// Onboarding Navigation
function showOnboardingStep(step) {
  onboardingApi.classList.add('hidden');
  onboardingCompany.classList.add('hidden');
  onboardingGoals.classList.add('hidden');
  mainSection.classList.add('hidden');
  
  if (step === 1) {
    onboardingApi.classList.remove('hidden');
    document.getElementById('api-key-input').value = userProfile.geminiApiKey || '';
  } else if (step === 2) {
    onboardingCompany.classList.remove('hidden');
    document.getElementById('ob-company-name').value = userProfile.companyName || '';
    document.getElementById('ob-your-role').value = userProfile.yourRole || '';
    document.getElementById('ob-product').value = userProfile.product || '';
    document.getElementById('ob-value-prop').value = userProfile.valueProp || '';
  } else if (step === 3) {
    onboardingGoals.classList.remove('hidden');
    document.getElementById('ob-target-personas').value = userProfile.targetPersonas || '';
    document.getElementById('ob-target-industries').value = userProfile.targetIndustries || '';
    document.getElementById('ob-competitors').value = userProfile.competitors || '';
    document.getElementById('ob-deal-size').value = userProfile.dealSize || '';
    document.getElementById('ob-conversion-rate').value = userProfile.conversionRate || '';
    document.getElementById('ob-opp-win-rate').value = userProfile.oppWinRate || '';
    document.getElementById('ob-event-goal').value = userProfile.eventGoal || '';
    document.getElementById('ob-notes').value = userProfile.notes || '';
  }
}

function showMainSection() {
  onboardingApi.classList.add('hidden');
  onboardingCompany.classList.add('hidden');
  onboardingGoals.classList.add('hidden');
  mainSection.classList.remove('hidden');
  showCurrentPageView(); // Default to current page view
}

// Main Navigation (Current Page vs Events Index)
document.getElementById('nav-current')?.addEventListener('click', () => {
  showCurrentPageView();
});

document.getElementById('nav-events')?.addEventListener('click', () => {
  showEventsIndexView();
});

document.getElementById('nav-personas')?.addEventListener('click', () => {
  showPersonasIndexView();
});

function hideAllViews() {
  document.getElementById('current-page-view')?.classList.add('hidden');
  document.getElementById('events-index-view')?.classList.add('hidden');
  document.getElementById('personas-index-view')?.classList.add('hidden');
  document.getElementById('nav-current')?.classList.remove('active');
  document.getElementById('nav-events')?.classList.remove('active');
  document.getElementById('nav-personas')?.classList.remove('active');
}

function showCurrentPageView() {
  hideAllViews();
  document.getElementById('current-page-view')?.classList.remove('hidden');
  document.getElementById('nav-current')?.classList.add('active');
}

function showEventsIndexView() {
  hideAllViews();
  document.getElementById('events-index-view')?.classList.remove('hidden');
  document.getElementById('nav-events')?.classList.add('active');
  renderEventsIndex();
}

function showPersonasIndexView() {
  hideAllViews();
  document.getElementById('personas-index-view')?.classList.remove('hidden');
  document.getElementById('nav-personas')?.classList.add('active');
  renderPersonasIndex();
}

function renderPersonasIndex() {
  const container = document.getElementById('personas-master-list');
  if (!container) return;
  
  // Build persona -> events map
  const personaEventsMap = {};
  
  Object.values(savedEvents).forEach(event => {
    const personas = event.expectedPersonas || [];
    const people = event.people || [];
    
    personas.forEach(persona => {
      // Use 'persona' field which is the job title/role category
      const personaName = persona.persona || persona.title || persona.name || 'Unknown Persona';
      
      if (!personaEventsMap[personaName]) {
        personaEventsMap[personaName] = {
          name: personaName,
          events: []
        };
      }
      
      // Count people matching this persona at this event
      const matchingPeople = people.filter(p => {
        const pRole = (p.role || p.title || p.persona || '').toLowerCase();
        const personaLower = personaName.toLowerCase();
        // Check if person's role/title contains persona keywords
        const personaWords = personaLower.split(/\s+/);
        return personaWords.some(word => word.length > 2 && pRole.includes(word)) ||
               pRole.includes(personaLower) || 
               personaLower.includes(pRole);
      }).length;
      
      personaEventsMap[personaName].events.push({
        url: event.url,
        eventName: event.eventName || 'Unknown Event',
        date: event.date || '',
        peopleCount: matchingPeople,
        personaData: persona
      });
    });
  });
  
  const personaList = Object.values(personaEventsMap).sort((a, b) => 
    b.events.length - a.events.length
  );
  
  if (personaList.length === 0) {
    container.innerHTML = `
      <div class="events-empty">
        <div class="empty-icon">🎭</div>
        <p>No personas found yet</p>
        <p class="hint">Analyze events to see personas here</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = personaList.map(persona => {
    const totalPeople = persona.events.reduce((sum, e) => sum + e.peopleCount, 0);
    
    return `
      <div class="persona-master-card">
        <div class="persona-master-header">
          <div class="persona-master-title">
            <span class="persona-icon">🎯</span>
            <h3>${escapeHtml(persona.name)}</h3>
          </div>
          <div class="persona-master-stats">
            <span class="stat-badge">${persona.events.length} event${persona.events.length !== 1 ? 's' : ''}</span>
            <span class="stat-badge people">${totalPeople} people</span>
          </div>
        </div>
        <div class="persona-events-list">
          ${persona.events.map(event => `
            <div class="persona-event-row" data-url="${escapeHtml(event.url)}" data-persona="${escapeHtml(persona.name)}">
              <div class="persona-event-info">
                <span class="event-name">${escapeHtml(event.eventName)}</span>
                ${event.date ? `<span class="event-date">${escapeHtml(event.date)}</span>` : ''}
              </div>
              <div class="persona-event-count">
                <span class="people-count">${event.peopleCount} people</span>
              </div>
              <button class="btn-icon persona-dive-btn" title="View Persona Details">🔍</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
  
  // Add click handlers
  container.querySelectorAll('.persona-event-row').forEach(row => {
    row.querySelector('.persona-dive-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const url = row.dataset.url;
      const personaName = row.dataset.persona;
      openPersonaFromMasterIndex(url, personaName);
    });
    
    row.addEventListener('click', () => {
      const url = row.dataset.url;
      const personaName = row.dataset.persona;
      openPersonaFromMasterIndex(url, personaName);
    });
  });
}

function openPersonaFromMasterIndex(eventUrl, personaName) {
  const event = savedEvents[eventUrl];
  if (!event) return;
  
  const personas = event.expectedPersonas || [];
  const persona = personas.find(p => (p.persona || p.title || p.name || '') === personaName);
  
  if (persona) {
    openPersonaModal(persona, event);
  }
}

// Sort change handler
document.getElementById('events-sort')?.addEventListener('change', (e) => {
  eventsSortBy = e.target.value;
  renderEventsIndex();
});

// Export events as CSV
document.getElementById('export-events-csv')?.addEventListener('click', exportEventsAsCSV);

function calculateEventROI(event) {
  const people = event.people || [];
  const targetCount = people.filter(p => isTargetPersona(p)).length;
  if (!userProfile.dealSize || !userProfile.conversionRate) return 0;
  const dealSize = parseFloat(userProfile.dealSize) || 0;
  const convRate = parseFloat(userProfile.conversionRate) / 100 || 0;
  const winRate = parseFloat(userProfile.oppWinRate) / 100 || 0.25;
  return targetCount * convRate * winRate * dealSize;
}

function sortEvents(events, sortBy) {
  return [...events].sort((a, b) => {
    switch (sortBy) {
      case 'roi':
        return calculateEventROI(b) - calculateEventROI(a);
      case 'targets':
        const aTargets = (a.people || []).filter(p => isTargetPersona(p)).length;
        const bTargets = (b.people || []).filter(p => isTargetPersona(p)).length;
        return bTargets - aTargets;
      case 'people':
        return (b.people || []).length - (a.people || []).length;
      case 'date':
        return new Date(b.analyzedAt || 0) - new Date(a.analyzedAt || 0);
      case 'eventDate':
        return (b.date || '').localeCompare(a.date || '');
      case 'name':
        return (a.eventName || '').localeCompare(b.eventName || '');
      default:
        return 0;
    }
  });
}

function renderEventsIndex() {
  const container = document.getElementById('events-list');
  const tableHeader = document.getElementById('events-table-header');
  if (!container) return;
  
  const events = sortEvents(Object.values(savedEvents), eventsSortBy);
  
  if (events.length === 0) {
    tableHeader?.classList.add('hidden');
    container.innerHTML = `
      <div class="events-empty">
        <div class="empty-icon">📭</div>
        <p>No events analyzed yet</p>
        <p class="hint">Analyze your first event to see it here</p>
      </div>
    `;
    return;
  }
  
  tableHeader?.classList.remove('hidden');
  
  container.innerHTML = events.map(event => {
    const people = event.people || [];
    const targetCount = people.filter(p => isTargetPersona(p)).length;
    const roi = calculateEventROI(event);
    const roiText = roi > 0 ? `$${formatNumber(roi)}` : '-';
    const analyzedDate = event.analyzedAt ? new Date(event.analyzedAt).toLocaleDateString() : '-';
    
    return `
      <div class="event-row" data-url="${escapeHtml(event.url)}">
        <div class="col-name">
          <div class="event-row-title">${escapeHtml(event.eventName || 'Unknown Event')}</div>
          <div class="event-row-location">${escapeHtml(event.location || '')}</div>
        </div>
        <div class="col-date">${escapeHtml(event.date || '-')}</div>
        <div class="col-people">${people.length}</div>
        <div class="col-targets"><span class="target-highlight">${targetCount}</span></div>
        <div class="col-roi ${roi > 0 ? 'roi-positive' : ''}">${roiText}</div>
        <div class="col-actions">
          <button class="btn-icon view-event-btn" title="View">👁️</button>
          <button class="btn-icon delete-event-btn" title="Delete">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
  
  // Add event handlers
  container.querySelectorAll('.event-row').forEach(row => {
    const url = row.dataset.url;
    
    row.querySelector('.view-event-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      viewEventDetails(url);
    });
    
    row.querySelector('.delete-event-btn')?.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (confirm('Delete this event analysis?')) {
        await deleteEvent(url);
        updateEventsCount();
        renderEventsIndex();
        showToast('Event deleted');
      }
    });
    
    // Click anywhere on row to view
    row.addEventListener('click', () => viewEventDetails(url));
  });
}

function exportEventsAsCSV() {
  const events = Object.values(savedEvents);
  if (events.length === 0) {
    showToast('No events to export');
    return;
  }
  
  const rows = [];
  rows.push(['Event Name', 'Event Date', 'Location', 'URL', 'People Count', 'Target Count', 'Sponsor Count', 'Est. ROI', 'Analyzed Date']);
  
  events.forEach(event => {
    const people = event.people || [];
    const targetCount = people.filter(p => isTargetPersona(p)).length;
    const sponsorCount = (event.sponsors || []).length;
    const roi = calculateEventROI(event);
    const analyzedDate = event.analyzedAt ? new Date(event.analyzedAt).toLocaleDateString() : '';
    
    rows.push([
      event.eventName || '',
      event.date || '',
      event.location || '',
      event.url || '',
      people.length,
      targetCount,
      sponsorCount,
      roi > 0 ? roi.toFixed(0) : '',
      analyzedDate
    ]);
  });
  
  const csvContent = rows.map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `conference_intel_events_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  showToast('Events exported!');
}

function viewEventDetails(url) {
  const event = getEventByUrl(url);
  if (event) {
    currentAnalysisData = event;
    showCurrentPageView();
    showResults(event);
    
    // Show the saved event banner with original URL
    showSavedEventBanner(url, event.eventName);
  }
}

function showSavedEventBanner(url, eventName) {
  // Hide the normal current page info
  document.querySelector('.current-page')?.classList.add('hidden');
  document.getElementById('cached-indicator')?.classList.add('hidden');
  
  // Show or create the saved event banner
  let banner = document.getElementById('saved-event-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'saved-event-banner';
    banner.className = 'saved-event-banner';
    const actionsDiv = document.querySelector('#current-page-view .actions');
    actionsDiv?.parentNode.insertBefore(banner, actionsDiv);
  }
  
  try {
    const urlObj = new URL(url);
    const displayUrl = urlObj.hostname + urlObj.pathname;
    banner.innerHTML = `
      <div class="saved-banner-header">📋 Viewing saved event</div>
      <div class="saved-banner-url">${escapeHtml(displayUrl)}</div>
      <button id="open-event-url-btn" class="btn primary small">🔗 Open This Page</button>
    `;
    banner.classList.remove('hidden');
    
    document.getElementById('open-event-url-btn')?.addEventListener('click', () => {
      chrome.tabs.update({ url: url });
    });
  } catch (e) {
    banner.innerHTML = `<div class="saved-banner-header">📋 Viewing saved event</div>`;
  }
}

function hideSavedEventBanner() {
  document.getElementById('saved-event-banner')?.classList.add('hidden');
  document.querySelector('.current-page')?.classList.remove('hidden');
}

// Onboarding Event Listeners
onboardingApiNext.addEventListener('click', async () => {
  const apiKey = document.getElementById('api-key-input').value.trim();
  if (!apiKey) {
    showToast('Please enter your API key');
    return;
  }
  userProfile.geminiApiKey = apiKey;
  await saveProfile(userProfile);
  showOnboardingStep(2);
});

onboardingCompanyBack.addEventListener('click', () => showOnboardingStep(1));

onboardingCompanyNext.addEventListener('click', async () => {
  const companyName = document.getElementById('ob-company-name').value.trim();
  if (!companyName) {
    showToast('Please enter your company name');
    return;
  }
  userProfile.companyName = companyName;
  userProfile.yourRole = document.getElementById('ob-your-role').value.trim();
  userProfile.product = document.getElementById('ob-product').value.trim();
  userProfile.valueProp = document.getElementById('ob-value-prop').value.trim();
  await saveProfile(userProfile);
  showOnboardingStep(3);
});

onboardingGoalsBack.addEventListener('click', () => showOnboardingStep(2));

onboardingGoalsFinish.addEventListener('click', async () => {
  userProfile.targetPersonas = document.getElementById('ob-target-personas').value.trim();
  userProfile.targetIndustries = document.getElementById('ob-target-industries').value.trim();
  userProfile.competitors = document.getElementById('ob-competitors').value.trim();
  userProfile.dealSize = document.getElementById('ob-deal-size').value.trim();
  userProfile.conversionRate = document.getElementById('ob-conversion-rate').value.trim();
  userProfile.oppWinRate = document.getElementById('ob-opp-win-rate').value.trim();
  userProfile.eventGoal = document.getElementById('ob-event-goal').value.trim();
  userProfile.notes = document.getElementById('ob-notes').value.trim();
  userProfile.onboardingComplete = true;
  await saveProfile(userProfile);
  showToast('Setup complete!');
  showMainSection();
  updateCurrentUrl();
});

// Import/Export Profile
importProfileBtn.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', handleImportProfile);

async function handleImportProfile(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  try {
    const text = await file.text();
    const imported = JSON.parse(text);
    
    // Validate it has the expected structure
    if (typeof imported !== 'object') {
      throw new Error('Invalid profile format');
    }
    
    // Merge with defaults to ensure all fields exist
    userProfile = { ...defaultProfile, ...imported, onboardingComplete: true };
    await saveProfile(userProfile);
    showToast('Profile imported successfully!');
    showMainSection();
    updateCurrentUrl();
  } catch (err) {
    showToast('Failed to import: Invalid file format');
  }
  
  e.target.value = ''; // Reset file input
}

// Settings Section
settingsBtn.addEventListener('click', () => {
  populateSettingsModal();
  mainSection.classList.add('hidden');
  settingsSection.classList.remove('hidden');
});

settingsBackBtn.addEventListener('click', () => {
  settingsSection.classList.add('hidden');
  mainSection.classList.remove('hidden');
});

function populateSettingsModal() {
  document.getElementById('set-company-name').value = userProfile.companyName || '';
  document.getElementById('set-your-role').value = userProfile.yourRole || '';
  document.getElementById('set-product').value = userProfile.product || '';
  document.getElementById('set-value-prop').value = userProfile.valueProp || '';
  document.getElementById('set-target-personas').value = userProfile.targetPersonas || '';
  document.getElementById('set-target-industries').value = userProfile.targetIndustries || '';
  document.getElementById('set-competitors').value = userProfile.competitors || '';
  document.getElementById('set-deal-size').value = userProfile.dealSize || '';
  document.getElementById('set-conversion-rate').value = userProfile.conversionRate || '';
  document.getElementById('set-opp-win-rate').value = userProfile.oppWinRate || '';
  document.getElementById('set-event-goal').value = userProfile.eventGoal || '';
  document.getElementById('set-notes').value = userProfile.notes || '';
  document.getElementById('set-api-key').value = userProfile.geminiApiKey || '';
}

saveSettingsBtn.addEventListener('click', async () => {
  userProfile.companyName = document.getElementById('set-company-name').value.trim();
  userProfile.yourRole = document.getElementById('set-your-role').value.trim();
  userProfile.product = document.getElementById('set-product').value.trim();
  userProfile.valueProp = document.getElementById('set-value-prop').value.trim();
  userProfile.targetPersonas = document.getElementById('set-target-personas').value.trim();
  userProfile.targetIndustries = document.getElementById('set-target-industries').value.trim();
  userProfile.competitors = document.getElementById('set-competitors').value.trim();
  userProfile.dealSize = document.getElementById('set-deal-size').value.trim();
  userProfile.conversionRate = document.getElementById('set-conversion-rate').value.trim();
  userProfile.oppWinRate = document.getElementById('set-opp-win-rate').value.trim();
  userProfile.eventGoal = document.getElementById('set-event-goal').value.trim();
  userProfile.notes = document.getElementById('set-notes').value.trim();
  
  const newApiKey = document.getElementById('set-api-key').value.trim();
  if (newApiKey) {
    userProfile.geminiApiKey = newApiKey;
  }
  
  await saveProfile(userProfile);
  settingsSection.classList.add('hidden');
  mainSection.classList.remove('hidden');
  showToast('Settings saved!');
});

// Settings Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.remove('hidden');
  });
});

// Export/Import in Settings
exportSettingsBtn.addEventListener('click', () => {
  const exportData = { ...userProfile };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `conference-intel-profile-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast('Settings exported!');
});

importSettingsBtn.addEventListener('click', () => settingsImportFile.click());
settingsImportFile.addEventListener('change', async (e) => {
  await handleImportProfile(e);
  populateSettingsModal();
});

// Reset Extension
if (resetExtensionBtn) {
  resetExtensionBtn.addEventListener('click', async () => {
    if (confirm('Reset the extension? This will clear all settings and show the onboarding flow.')) {
      await chrome.storage.local.clear();
      userProfile = { ...defaultProfile };
      currentAnalysisData = null;
      currentFilter = 'all';
      
      // Hide all sections and show onboarding
      settingsSection.classList.add('hidden');
      mainSection.classList.add('hidden');
      onboardingApi.classList.remove('hidden');
      onboardingCompany.classList.add('hidden');
      onboardingGoals.classList.add('hidden');
      
      // Reset onboarding progress indicators
      document.querySelectorAll('.progress-step').forEach((step, i) => {
        step.classList.remove('active', 'completed');
        if (i === 0) step.classList.add('active');
      });
      document.querySelectorAll('.progress-line').forEach(line => {
        line.classList.remove('completed');
      });
      
      // Clear form fields
      document.getElementById('api-key').value = '';
      
      showToast('Extension reset!');
    }
  });
}

// Listen for tab changes to update current URL
chrome.tabs.onActivated.addListener(async () => {
  await updateCurrentUrl();
  showCurrentPageView(); // Switch to current page view
  await checkForCachedAnalysis();
});
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.url) {
    await updateCurrentUrl();
    showCurrentPageView(); // Switch to current page view
    await checkForCachedAnalysis();
  }
});

async function updateCurrentUrl() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      currentTabUrl = tab.url;
      const url = new URL(tab.url);
      currentUrlSpan.textContent = url.hostname + url.pathname;
    }
  } catch (e) {
    currentUrlSpan.textContent = 'Unable to get URL';
  }
}

// UI State Management
function showLoading() {
  loadingDiv.classList.remove('hidden');
  resultsDiv.classList.add('hidden');
  errorDiv.classList.add('hidden');
  emptyState.classList.add('hidden');
  analyzeBtn.disabled = true;
}

function hideLoading() {
  loadingDiv.classList.add('hidden');
  analyzeBtn.disabled = false;
}

async function showResults(data) {
  hideLoading();
  resultsDiv.classList.remove('hidden');
  emptyState.classList.add('hidden');
  currentAnalysisData = data;
  renderResults(data);
  
  // Auto-save to MCP server in background
  try {
    const saveResult = await autoSaveAnalysis(data, userProfile);
    if (saveResult.saved) {
      console.log('✅ Analysis auto-saved to MCP server:', saveResult);
      showToast(`💾 Saved ${saveResult.companies.length} companies to database`);
    } else {
      console.warn('⚠️ Could not save to MCP server:', saveResult.reason);
    }
  } catch (error) {
    console.error('Failed to auto-save analysis:', error);
    // Don't show error to user - this is background operation
  }
}

function showError(message) {
  hideLoading();
  errorDiv.classList.remove('hidden');
  emptyState.classList.add('hidden');
  errorDiv.querySelector('.error-message').textContent = message;
}

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// Analysis
analyzeBtn.addEventListener('click', runAnalysis);
reanalyzeBtn.addEventListener('click', runAnalysis);
retryBtn.addEventListener('click', runAnalysis);

// Reanalyze fresh button (for cached results)
document.getElementById('reanalyze-fresh-btn')?.addEventListener('click', runAnalysis);

async function runAnalysis() {
  showLoading();
  
  // Hide cached indicator during fresh analysis
  document.getElementById('cached-indicator')?.classList.add('hidden');
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.id) {
      throw new Error('No active tab found');
    }

    let response;
    try {
      response = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });
    } catch (e) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      await new Promise(r => setTimeout(r, 100));
      response = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });
    }
    
    if (!response || !response.content) {
      throw new Error('Could not extract page content. Make sure you\'re on an event page.');
    }
    
    const result = await chrome.runtime.sendMessage({
      action: 'analyzeEvent',
      content: response.content,
      url: tab.url,
      title: tab.title,
      userProfile: userProfile
    });
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    // Save the analysis
    await saveEvent(tab.url, result.data);
    updateEventsCount();
    
    // Hide analyze button, show cached indicator after successful analysis
    document.getElementById('analyze-btn')?.classList.add('hidden');
    document.getElementById('cached-indicator')?.classList.remove('hidden');
    
    showResults(result.data);
    showToast('Event analyzed and saved!');
  } catch (error) {
    console.error('Analysis error:', error);
    showError(error.message || 'Failed to analyze event. Please try again.');
  }
}

// Copy and CSV
copyBtn.addEventListener('click', () => {
  if (!currentAnalysisData) return;
  
  const summary = generateTextSummary(currentAnalysisData);
  navigator.clipboard.writeText(summary).then(() => {
    showToast('Summary copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy');
  });
});

csvBtn.addEventListener('click', () => {
  if (!currentAnalysisData) return;
  downloadCSV(currentAnalysisData, currentFilter);
});

// Export All and View Targets buttons
if (exportAllBtn) {
  exportAllBtn.addEventListener('click', () => {
    if (!currentAnalysisData) return;
    downloadCSV(currentAnalysisData, 'all');
  });
}

if (viewTargetsBtn) {
  viewTargetsBtn.addEventListener('click', () => {
    if (!currentAnalysisData) return;
    currentFilter = 'targets';
    updateFilterButtons();
    const people = currentAnalysisData.people || currentAnalysisData.speakers || [];
    renderPeopleList(currentAnalysisData, people, currentFilter);
    // Scroll to people section
    document.getElementById('people-list')?.scrollIntoView({ behavior: 'smooth' });
  });
}

// Filter buttons for people list
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!currentAnalysisData) return;
    currentFilter = btn.dataset.filter;
    updateFilterButtons();
    const people = currentAnalysisData.people || currentAnalysisData.speakers || [];
    renderPeopleList(currentAnalysisData, people, currentFilter);
  });
});

function updateFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === currentFilter);
  });
}

// Generate and download CSV
function downloadCSV(data, filterType = 'all') {
  const rows = [];
  
  rows.push(['Role', 'Persona', 'Name', 'Title', 'Company', 'LinkedIn', 'Event', 'Date', 'Location']);
  
  let people = data.people || data.speakers || [];
  
  // Apply filter
  if (filterType === 'targets') {
    people = people.filter(p => isTargetPersona(p));
  } else if (filterType === 'speakers') {
    people = people.filter(p => p.role && p.role.toLowerCase().includes('speaker'));
  }
  
  if (people.length > 0) {
    people.forEach(person => {
      rows.push([
        person.role || 'Unknown',
        person.persona || '',
        person.name || '',
        person.title || '',
        person.company || '',
        person.linkedin || generateLinkedInSearch(person.name, person.company),
        data.eventName || '',
        data.date || '',
        data.location || ''
      ]);
    });
  }
  
  if (filterType === 'all' && data.sponsors && data.sponsors.length > 0) {
    data.sponsors.forEach(sponsor => {
      rows.push([
        sponsor.tier ? `${sponsor.tier} Sponsor` : 'Sponsor',
        'Sponsor',
        sponsor.name || '',
        '',
        sponsor.name || '',
        '',
        data.eventName || '',
        data.date || '',
        data.location || ''
      ]);
    });
  }
  
  const csvContent = rows.map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const suffix = filterType !== 'all' ? `_${filterType}` : '';
  link.setAttribute('download', `${sanitizeFilename(data.eventName || 'event')}${suffix}_contacts.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  showToast('CSV downloaded!');
}

function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
}

function generateLinkedInSearch(name, company) {
  if (!name) return '';
  const query = company ? `${name} ${company}` : name;
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`;
}

// Generate text summary
function generateTextSummary(data) {
  let summary = `# ${data.eventName || 'Event Analysis'}\n\n`;
  
  if (data.date) summary += `📅 Date: ${data.date}\n`;
  if (data.location) summary += `📍 Location: ${data.location}\n`;
  if (data.description) summary += `\n${data.description}\n`;
  
  const people = data.people || data.speakers || [];
  if (people.length > 0) {
    summary += `\n## People (${people.length})\n`;
    people.forEach(s => {
      summary += `- ${s.name}`;
      if (s.role) summary += ` [${s.role}]`;
      if (s.title) summary += `, ${s.title}`;
      if (s.company) summary += ` @ ${s.company}`;
      summary += '\n';
    });
  }
  
  if (data.sponsors && data.sponsors.length > 0) {
    summary += `\n## Sponsors (${data.sponsors.length})\n`;
    data.sponsors.forEach(s => {
      summary += `- ${s.name}`;
      if (s.tier) summary += ` (${s.tier})`;
      summary += '\n';
    });
  }
  
  if (data.nextBestActions && data.nextBestActions.length > 0) {
    summary += `\n## Next Best Actions\n`;
    data.nextBestActions.forEach((action, i) => {
      summary += `${i + 1}. ${action.action}\n`;
      if (action.reason) summary += `   → ${action.reason}\n`;
    });
  }
  
  if (data.expectedPersonas && data.expectedPersonas.length > 0) {
    summary += `\n## Expected Personas\n`;
    data.expectedPersonas.forEach(p => {
      summary += `- ${p.persona}`;
      if (p.likelihood) summary += ` (${p.likelihood})`;
      if (p.count) summary += ` - Est. ${p.count}`;
      summary += '\n';
    });
  }
  
  return summary;
}

// Render Results
function renderResults(data) {
  const people = data.people || data.speakers || [];
  
  // Determine default filter: show targets if any exist, otherwise all
  const hasTargets = people.some(p => isTargetPersona(p));
  currentFilter = hasTargets ? 'targets' : 'all';
  updateFilterButtons();
  
  // ROI Estimate (FIRST - top priority)
  renderROIEstimate(data, people);
  
  // Next Best Actions
  renderNextActions(data);
  
  // Expected Personas
  renderPersonas(data);
  
  // Event Overview
  const overviewHtml = `
    <div class="event-detail">
      <span class="label">Event:</span>
      <span class="value">${escapeHtml(data.eventName || 'Unknown')}</span>
    </div>
    <div class="event-detail">
      <span class="label">Date:</span>
      <span class="value">${escapeHtml(data.date || 'Not found')}</span>
    </div>
    <div class="event-detail">
      <span class="label">Location:</span>
      <span class="value">${escapeHtml(data.location || 'Not found')}</span>
    </div>
    ${data.description ? `
    <div class="event-detail">
      <span class="label">About:</span>
      <span class="value">${escapeHtml(data.description)}</span>
    </div>
    ` : ''}
  `;
  document.getElementById('event-overview').innerHTML = overviewHtml;

  // People
  renderPeopleList(data, people, currentFilter);

  // Sponsors
  const sponsorsContainer = document.getElementById('sponsors-list');
  const sponsorsCount = document.getElementById('sponsors-count');
  if (data.sponsors && data.sponsors.length > 0) {
    sponsorsCount.textContent = data.sponsors.length;
    sponsorsContainer.innerHTML = data.sponsors.map(sponsor => {
      const isCompetitor = isCompetitorCompany(sponsor.name);
      return `
      <div class="sponsor-item ${isCompetitor ? 'competitor-match' : ''}">
        <div class="person-avatar">🏢</div>
        <div class="person-info">
          <div class="person-name">${escapeHtml(sponsor.name)}${isCompetitor ? ' <span class="competitor-badge">⚔️ Competitor</span>' : ''}</div>
          ${sponsor.tier ? `<div class="person-title">${escapeHtml(sponsor.tier)} Sponsor</div>` : ''}
        </div>
      </div>
    `}).join('');
  } else {
    sponsorsCount.textContent = '0';
    sponsorsContainer.innerHTML = '<p class="empty-state-small">No sponsors found</p>';
  }
}

let currentActionIndex = 0;
let currentActions = [];

function renderNextActions(data) {
  const container = document.getElementById('next-actions');
  const nextBtn = document.getElementById('next-action-btn');
  if (!container) return;
  
  currentActions = data.nextBestActions || [];
  currentActionIndex = 0;
  
  if (currentActions.length > 0) {
    renderCurrentAction();
    if (nextBtn) {
      nextBtn.classList.toggle('hidden', currentActions.length <= 1);
    }
  } else {
    container.innerHTML = '<p class="empty-state-small">No actions available</p>';
    if (nextBtn) nextBtn.classList.add('hidden');
  }
}

function renderCurrentAction() {
  const container = document.getElementById('next-actions');
  if (!container || currentActions.length === 0) return;
  
  const action = currentActions[currentActionIndex];
  const total = currentActions.length;
  
  container.innerHTML = `
    <div class="action-item single priority-${action.priority || 'medium'}">
      <div class="action-number">${currentActionIndex + 1}</div>
      <div class="action-content">
        <div class="action-text">${escapeHtml(action.action)}</div>
        ${action.reason ? `<div class="action-reason">${escapeHtml(action.reason)}</div>` : ''}
      </div>
    </div>
    <div class="action-progress">
      ${Array.from({length: total}, (_, i) => 
        `<span class="progress-dot ${i === currentActionIndex ? 'active' : ''}"></span>`
      ).join('')}
    </div>
  `;
}

document.getElementById('next-action-btn')?.addEventListener('click', () => {
  if (currentActions.length > 0) {
    currentActionIndex = (currentActionIndex + 1) % currentActions.length;
    renderCurrentAction();
  }
});

function renderPersonas(data) {
  const container = document.getElementById('personas-list');
  if (!container) return;
  
  if (data.expectedPersonas && data.expectedPersonas.length > 0) {
    container.innerHTML = data.expectedPersonas.map((p, index) => `
      <div class="persona-item clickable" data-persona-index="${index}">
        <div class="persona-icon">👤</div>
        <div class="persona-content">
          <div class="persona-name">${escapeHtml(p.persona)}</div>
          <div class="persona-meta">
            ${p.likelihood ? `<span class="persona-likelihood ${p.likelihood.toLowerCase()}">${p.likelihood}</span>` : ''}
            ${p.count ? `<span class="persona-count">~${p.count} expected</span>` : ''}
          </div>
          ${p.conversationStarters && p.conversationStarters.length > 0 ? `
            <div class="persona-preview">
              <span class="preview-label">💬</span> "${escapeHtml(p.conversationStarters[0])}"
            </div>
          ` : ''}
        </div>
        <div class="persona-action">
          <span class="dive-in-btn">Dive In →</span>
        </div>
      </div>
    `).join('');
    
    // Add click handlers for persona deep dive
    container.querySelectorAll('.persona-item.clickable').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.personaIndex);
        openPersonaModal(data.expectedPersonas[index], data);
      });
    });
  } else {
    container.innerHTML = '<p class="empty-state-small">No persona predictions available</p>';
  }
}

function renderPeopleList(data, people, filter) {
  const peopleContainer = document.getElementById('people-list');
  const peopleCount = document.getElementById('people-count');
  const filterBar = document.getElementById('people-filter');
  
  // Show filter bar if there are people
  if (filterBar) {
    filterBar.classList.toggle('hidden', people.length === 0);
  }
  
  let filtered = people;
  if (filter === 'targets') {
    filtered = people.filter(p => isTargetPersona(p));
  } else if (filter === 'speakers') {
    filtered = people.filter(p => p.role && p.role.toLowerCase().includes('speaker'));
  }
  
  if (filtered.length > 0) {
    peopleCount.textContent = filter === 'all' ? people.length : `${filtered.length}/${people.length}`;
    peopleContainer.innerHTML = filtered.map((person, index) => {
      const linkedinUrl = person.linkedin || generateLinkedInSearch(person.name, person.company);
      const isTarget = isTargetPersona(person);
      return `
      <div class="person-item ${isTarget ? 'target-match' : ''}" data-person-index="${index}">
        <div class="person-avatar">${getInitials(person.name)}</div>
        <div class="person-info">
          <div class="person-name">
            ${escapeHtml(person.name)}
            ${person.role ? ` <span class="person-role">${escapeHtml(person.role)}</span>` : ''}
            ${isTarget ? ' <span class="target-badge">🎯 Target</span>' : ''}
            ${isTarget ? '<button class="target-dive-btn" title="Why target?">🔍 Dive In</button>' : ''}
          </div>
          ${person.title ? `<div class="person-title">${escapeHtml(person.title)}</div>` : ''}
          ${person.company ? `<div class="person-company">${escapeHtml(person.company)}</div>` : ''}
          ${person.persona ? `<div class="person-persona">👤 ${escapeHtml(person.persona)}</div>` : ''}
          
          <div class="person-actions-box">
            ${person.linkedinMessage ? `
              <div class="action-message linkedin-msg">
                <div class="action-header">
                  <span class="action-icon">💼</span>
                  <span class="action-title">LinkedIn Request</span>
                  <button class="copy-btn-small" data-copy="${escapeHtml(person.linkedinMessage)}">📋</button>
                </div>
                <div class="action-text">${escapeHtml(person.linkedinMessage)}</div>
              </div>
            ` : ''}
            ${person.iceBreaker ? `
              <div class="action-message ice-breaker">
                <div class="action-header">
                  <span class="action-icon">🗣️</span>
                  <span class="action-title">In-Person Opener</span>
                  <button class="copy-btn-small" data-copy="${escapeHtml(person.iceBreaker)}">📋</button>
                </div>
                <div class="action-text">${escapeHtml(person.iceBreaker)}</div>
              </div>
            ` : ''}
          </div>
          
          <a href="${linkedinUrl}" target="_blank" class="linkedin-link">🔗 Open LinkedIn</a>
        </div>
      </div>
    `}).join('');
    
    // Add copy handlers
    peopleContainer.querySelectorAll('.copy-btn-small').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(btn.dataset.copy);
        showToast('Copied to clipboard!');
      });
    });
    
    // Add dive-in handlers for targets
    peopleContainer.querySelectorAll('.target-dive-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const personItem = btn.closest('.person-item');
        const personIndex = parseInt(personItem.dataset.personIndex);
        const person = filtered[personIndex];
        if (person) {
          openTargetModal(person, data);
        }
      });
    });
  } else {
    peopleCount.textContent = filter === 'all' ? '0' : `0/${people.length}`;
    peopleContainer.innerHTML = `<p class="empty-state-small">${filter === 'all' ? 'No people found' : 'No matches for this filter'}</p>`;
  }
}

function renderROIEstimate(data, people) {
  const roiCard = document.getElementById('roi-card');
  const roiContent = document.getElementById('roi-content');
  
  if (!userProfile.dealSize || !userProfile.conversionRate) {
    roiCard.classList.add('hidden');
    return;
  }
  
  const targetPeople = people.filter(p => isTargetPersona(p)).length;
  const dealSize = parseFloat(userProfile.dealSize) || 0;
  const convRate = parseFloat(userProfile.conversionRate) / 100 || 0;
  const winRate = parseFloat(userProfile.oppWinRate) / 100 || 0.25;
  
  const potentialOpps = targetPeople * convRate;
  const potentialDeals = potentialOpps * winRate;
  const potentialRevenue = potentialDeals * dealSize;
  
  roiCard.classList.remove('hidden');
  roiContent.innerHTML = `
    <div class="roi-grid-3">
      <div class="roi-stat">
        <div class="roi-value">${targetPeople}</div>
        <div class="roi-label">Targets</div>
      </div>
      <div class="roi-stat">
        <div class="roi-value">${potentialOpps.toFixed(1)}</div>
        <div class="roi-label">Est. Opps</div>
      </div>
      <div class="roi-stat">
        <div class="roi-value">${potentialDeals.toFixed(1)}</div>
        <div class="roi-label">Est. Deals</div>
      </div>
    </div>
    <div class="roi-revenue">
      <div class="roi-value">$${formatNumber(potentialRevenue)}</div>
      <div class="roi-label">Potential Revenue</div>
    </div>
    <p class="roi-disclaimer">Based on ${userProfile.conversionRate}% lead→opp rate, ${userProfile.oppWinRate || 25}% win rate, $${formatNumber(dealSize)} avg deal</p>
  `;
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toFixed(0);
}

function isTargetPersona(person) {
  if (!userProfile.targetPersonas || !person.title) return false;
  const targets = userProfile.targetPersonas.toLowerCase().split(',').map(t => t.trim());
  const title = person.title.toLowerCase();
  return targets.some(t => title.includes(t) || t.includes(title.split(' ')[0]));
}

function isCompetitorCompany(companyName) {
  if (!userProfile.competitors || !companyName) return false;
  const competitors = userProfile.competitors.toLowerCase().split(',').map(c => c.trim());
  const name = companyName.toLowerCase();
  return competitors.some(c => name.includes(c) || c.includes(name));
}

// Utility Functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// Persona Modal
let currentPersonaContext = null;
let personaChatHistory = [];

function openPersonaModal(persona, eventData) {
  currentPersonaContext = { persona, eventData };
  personaChatHistory = [];
  
  const modal = document.getElementById('persona-modal');
  const title = document.getElementById('persona-modal-title');
  const info = document.getElementById('persona-info');
  const startersList = document.getElementById('persona-starters-list');
  const keywordsList = document.getElementById('persona-keywords-list');
  const painPointsList = document.getElementById('persona-pain-points-list');
  const chatMessages = document.getElementById('persona-chat-messages');
  
  title.textContent = `👤 ${persona.persona}`;
  
  info.innerHTML = `
    <div class="persona-detail-row">
      <span class="detail-label">Likelihood:</span>
      <span class="persona-likelihood ${(persona.likelihood || 'medium').toLowerCase()}">${persona.likelihood || 'Unknown'}</span>
    </div>
    <div class="persona-detail-row">
      <span class="detail-label">Expected at event:</span>
      <span>~${persona.count || 'Unknown'}</span>
    </div>
    
    ${persona.linkedinMessage ? `
    <div class="persona-action-card">
      <div class="action-card-header">
        <span>💼 LinkedIn Request Message</span>
        <button class="copy-btn-inline" data-copy="${escapeHtml(persona.linkedinMessage)}">📋 Copy</button>
      </div>
      <div class="action-card-body">${escapeHtml(persona.linkedinMessage)}</div>
    </div>
    ` : ''}
    
    ${persona.iceBreaker ? `
    <div class="persona-action-card highlight">
      <div class="action-card-header">
        <span>🗣️ In-Person Ice Breaker</span>
        <button class="copy-btn-inline" data-copy="${escapeHtml(persona.iceBreaker)}">📋 Copy</button>
      </div>
      <div class="action-card-body">${escapeHtml(persona.iceBreaker)}</div>
    </div>
    ` : ''}
  `;
  
  // Add copy handlers for action cards
  info.querySelectorAll('.copy-btn-inline').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(btn.dataset.copy);
      showToast('Copied to clipboard!');
    });
  });
  
  // Conversation Starters (follow-ups)
  if (persona.conversationStarters && persona.conversationStarters.length > 0) {
    startersList.innerHTML = `<p class="starters-intro">After breaking the ice, try these follow-ups:</p>` + 
      persona.conversationStarters.map(s => `
      <div class="starter-item">
        <span class="starter-quote">${escapeHtml(s)}</span>
        <button class="copy-starter-btn" data-text="${escapeHtml(s)}">📋</button>
      </div>
    `).join('');
    
    startersList.querySelectorAll('.copy-starter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(btn.dataset.text);
        showToast('Copied to clipboard!');
      });
    });
  } else {
    startersList.innerHTML = '<p class="empty-state-small">No starters available</p>';
  }
  
  // Keywords
  if (persona.keywords && persona.keywords.length > 0) {
    keywordsList.innerHTML = persona.keywords.map(k => `
      <span class="keyword-tag">${escapeHtml(k)}</span>
    `).join('');
  } else {
    keywordsList.innerHTML = '<p class="empty-state-small">No keywords available</p>';
  }
  
  // Pain Points
  if (persona.painPoints && persona.painPoints.length > 0) {
    painPointsList.innerHTML = persona.painPoints.map(p => `
      <div class="pain-point-item">• ${escapeHtml(p)}</div>
    `).join('');
  } else {
    painPointsList.innerHTML = '<p class="empty-state-small">No pain points available</p>';
  }
  
  // Clear chat
  chatMessages.innerHTML = `
    <div class="chat-message assistant">
      <p>I can help you refine your approach for <strong>${escapeHtml(persona.persona)}</strong> at <strong>${escapeHtml(eventData.eventName || 'this event')}</strong>.</p>
      <p>Ask me things like:</p>
      <ul>
        <li>"How do I open if they seem busy?"</li>
        <li>"What objections might they have?"</li>
        <li>"How do I transition to talking about ${escapeHtml(userProfile.product || 'our product')}?"</li>
      </ul>
    </div>
  `;
  
  modal.classList.remove('hidden');
}

// Close persona modal
document.getElementById('persona-modal-close')?.addEventListener('click', () => {
  document.getElementById('persona-modal').classList.add('hidden');
  currentPersonaContext = null;
  personaChatHistory = [];
});

// Target person modal
let currentTargetContext = null;
let targetChatHistory = [];

function openTargetModal(person, eventData) {
  currentTargetContext = { person, eventData };
  targetChatHistory = [];
  
  const modal = document.getElementById('target-modal');
  const headerInfo = document.getElementById('target-header-info');
  const whySection = document.getElementById('target-why');
  const nextActionsSection = document.getElementById('target-next-actions');
  const whatToSaySection = document.getElementById('target-what-to-say');
  const chatMessages = document.getElementById('target-chat-messages');
  
  // Fixed header with person info and LinkedIn
  const linkedinUrl = person.linkedin || generateLinkedInSearch(person.name, person.company);
  const hasDirectLinkedin = person.linkedin ? true : false;
  headerInfo.innerHTML = `
    <div class="target-header-row">
      <div class="person-avatar">${getInitials(person.name)}</div>
      <div class="target-header-text">
        <div class="target-header-name">${escapeHtml(person.name)}</div>
        <div class="target-header-meta">
          ${person.title || person.role ? `${escapeHtml(person.title || person.role)}` : ''}
          ${(person.title || person.role) && person.company ? ' • ' : ''}
          ${person.company ? `${escapeHtml(person.company)}` : ''}
        </div>
      </div>
      <a href="${linkedinUrl}" target="_blank" class="linkedin-btn ${hasDirectLinkedin ? 'direct' : ''}">
        🔗 ${hasDirectLinkedin ? 'LinkedIn' : 'Search'}
      </a>
    </div>
  `;
  
  // Why Target - specific and concise
  const role = person.role || person.title || 'professional';
  whySection.innerHTML = `
    <div class="target-insight-compact">
      <p><strong>${escapeHtml(role)}</strong> at <strong>${escapeHtml(person.company || 'their company')}</strong> — likely decision-maker or influencer for ${escapeHtml(userProfile.product || 'your solution')}.</p>
    </div>
  `;
  
  // Next Actions - specific steps
  nextActionsSection.innerHTML = `
    <div class="target-actions-list">
      <div class="action-item">
        <span class="action-num">1</span>
        <span>Connect on LinkedIn before the event</span>
      </div>
      <div class="action-item">
        <span class="action-num">2</span>
        <span>Find them at ${escapeHtml(eventData.eventName || 'the event')} and introduce yourself</span>
      </div>
      <div class="action-item">
        <span class="action-num">3</span>
        <span>Ask about their challenges with ${escapeHtml(userProfile.targetPersonas?.split(',')[0] || 'their role')}</span>
      </div>
      <div class="action-item">
        <span class="action-num">4</span>
        <span>Share how ${escapeHtml(userProfile.product || 'your product')} helps</span>
      </div>
    </div>
  `;
  
  // What to Say - LinkedIn message and ice breaker
  whatToSaySection.innerHTML = `
    ${person.linkedinMessage ? `
      <div class="say-card">
        <div class="say-card-header">
          <span>💼 LinkedIn Request</span>
          <button class="copy-btn-inline" data-copy="${escapeHtml(person.linkedinMessage)}">📋 Copy</button>
        </div>
        <div class="say-card-body">${escapeHtml(person.linkedinMessage)}</div>
      </div>
    ` : ''}
    ${person.iceBreaker ? `
      <div class="say-card highlight">
        <div class="say-card-header">
          <span>🗣️ In-Person Opener</span>
          <button class="copy-btn-inline" data-copy="${escapeHtml(person.iceBreaker)}">📋 Copy</button>
        </div>
        <div class="say-card-body">${escapeHtml(person.iceBreaker)}</div>
      </div>
    ` : ''}
  `;
  
  // Add copy handlers
  whatToSaySection.querySelectorAll('.copy-btn-inline').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(btn.dataset.copy);
      showToast('Copied to clipboard!');
    });
  });
  
  // Initial chat message
  chatMessages.innerHTML = `
    <div class="chat-message assistant">
      <p>Need help with <strong>${escapeHtml(person.name)}</strong>? Ask me anything!</p>
    </div>
  `;
  
  modal.classList.remove('hidden');
}

function generateTargetPainPoints(person, profile) {
  const role = (person.role || person.title || '').toLowerCase();
  const points = [];
  
  if (role.includes('ceo') || role.includes('founder') || role.includes('chief')) {
    points.push('Pressure to drive growth while managing costs');
    points.push('Need for visibility into team performance and ROI');
    points.push('Balancing strategic initiatives with day-to-day operations');
  } else if (role.includes('vp') || role.includes('head') || role.includes('director')) {
    points.push('Meeting aggressive targets with limited resources');
    points.push('Difficulty getting buy-in for new tools and processes');
    points.push('Lack of actionable data for decision-making');
  } else if (role.includes('manager')) {
    points.push('Team productivity and efficiency challenges');
    points.push('Pressure from leadership to show results');
    points.push('Manual processes that waste time');
  } else if (role.includes('sales') || role.includes('revenue') || role.includes('ae') || role.includes('sdr')) {
    points.push('Difficulty finding and qualifying the right prospects');
    points.push('Time-consuming manual outreach tasks');
    points.push('Pressure to hit quota with limited quality leads');
  } else if (role.includes('marketing') || role.includes('growth')) {
    points.push('Proving ROI on marketing spend');
    points.push('Generating quality leads that convert');
    points.push('Aligning with sales on priorities');
  } else {
    points.push('Efficiency and productivity challenges');
    points.push('Need for better tools and processes');
    points.push('Pressure to deliver results faster');
  }
  
  return points;
}

function generateProductHelps(person, profile) {
  const product = profile.product || 'Your solution';
  const valueProp = profile.valueProp || '';
  const helps = [];
  
  helps.push(`Addressing their key pain points with ${product}`);
  helps.push('Saving time and reducing manual work');
  helps.push('Providing visibility and actionable insights');
  
  if (valueProp) {
    helps.push(`Delivering on: ${valueProp.substring(0, 100)}${valueProp.length > 100 ? '...' : ''}`);
  }
  
  return helps;
}

// Close target modal
document.getElementById('target-modal-close')?.addEventListener('click', () => {
  document.getElementById('target-modal').classList.add('hidden');
  currentTargetContext = null;
  targetChatHistory = [];
});

// Target chat
document.getElementById('target-chat-send')?.addEventListener('click', sendTargetChatMessage);
document.getElementById('target-chat-input')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendTargetChatMessage();
});

async function sendTargetChatMessage() {
  const input = document.getElementById('target-chat-input');
  const messagesContainer = document.getElementById('target-chat-messages');
  const userMessage = input.value.trim();
  
  if (!userMessage || !currentTargetContext) return;
  
  input.value = '';
  
  // Add user message
  messagesContainer.innerHTML += `
    <div class="chat-message user">
      <p>${escapeHtml(userMessage)}</p>
    </div>
  `;
  
  // Add loading message
  messagesContainer.innerHTML += `
    <div class="chat-message assistant loading" id="target-chat-loading">
      <p>Thinking...</p>
    </div>
  `;
  
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  targetChatHistory.push({ role: 'user', content: userMessage });
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'targetChat',
      person: currentTargetContext.person,
      eventData: currentTargetContext.eventData,
      userProfile: userProfile,
      chatHistory: targetChatHistory,
      userMessage: userMessage
    });
    
    document.getElementById('target-chat-loading')?.remove();
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    targetChatHistory.push({ role: 'assistant', content: response.reply });
    
    messagesContainer.innerHTML += `
      <div class="chat-message assistant">
        <p>${escapeHtml(response.reply)}</p>
      </div>
    `;
  } catch (error) {
    document.getElementById('target-chat-loading')?.remove();
    messagesContainer.innerHTML += `
      <div class="chat-message assistant error">
        <p>Error: ${escapeHtml(error.message)}</p>
      </div>
    `;
  }
  
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Click outside modal to close
document.getElementById('persona-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'persona-modal') {
    document.getElementById('persona-modal').classList.add('hidden');
    currentPersonaContext = null;
    personaChatHistory = [];
  }
});

// Persona Chat
document.getElementById('persona-chat-send')?.addEventListener('click', sendPersonaChatMessage);
document.getElementById('persona-chat-input')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendPersonaChatMessage();
});

async function sendPersonaChatMessage() {
  const input = document.getElementById('persona-chat-input');
  const messagesContainer = document.getElementById('persona-chat-messages');
  const message = input.value.trim();
  
  if (!message || !currentPersonaContext) return;
  
  // Add user message
  messagesContainer.innerHTML += `
    <div class="chat-message user">
      <p>${escapeHtml(message)}</p>
    </div>
  `;
  input.value = '';
  
  // Add loading indicator
  messagesContainer.innerHTML += `
    <div class="chat-message assistant loading">
      <p>Thinking...</p>
    </div>
  `;
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Build chat context
  personaChatHistory.push({ role: 'user', content: message });
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'personaChat',
      persona: currentPersonaContext.persona,
      eventData: currentPersonaContext.eventData,
      userProfile: userProfile,
      chatHistory: personaChatHistory,
      userMessage: message
    });
    
    // Remove loading indicator
    messagesContainer.querySelector('.chat-message.loading')?.remove();
    
    if (response.error) {
      messagesContainer.innerHTML += `
        <div class="chat-message assistant error">
          <p>Error: ${escapeHtml(response.error)}</p>
        </div>
      `;
    } else {
      personaChatHistory.push({ role: 'assistant', content: response.reply });
      messagesContainer.innerHTML += `
        <div class="chat-message assistant">
          <p>${escapeHtml(response.reply)}</p>
        </div>
      `;
    }
  } catch (error) {
    messagesContainer.querySelector('.chat-message.loading')?.remove();
    messagesContainer.innerHTML += `
      <div class="chat-message assistant error">
        <p>Failed to get response. Please try again.</p>
      </div>
    `;
  }
  
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
