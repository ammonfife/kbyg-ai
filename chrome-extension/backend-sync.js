/**
 * Backend Sync Module
 * Handles syncing all extension data to Supabase backend
 */

/**
 * Sync user profile to backend
 * @param {Object} profile - User profile from chrome.storage
 * @returns {Promise<boolean>} - Success status
 */
async function syncProfileToBackend(profile) {
  try {
    const user = await getSupabaseUser();
    if (!user) {
      console.log('[Sync] Not authenticated, skipping profile sync');
      return false;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        gemini_api_key: profile.geminiApiKey,
        company_name: profile.companyName,
        your_role: profile.yourRole,
        product: profile.product,
        value_prop: profile.valueProp,
        target_personas: profile.targetPersonas,
        target_industries: profile.targetIndustries,
        competitors: profile.competitors,
        deal_size: profile.dealSize ? parseFloat(profile.dealSize) : null,
        conversion_rate: profile.conversionRate ? parseFloat(profile.conversionRate) : null,
        opp_win_rate: profile.oppWinRate ? parseFloat(profile.oppWinRate) : null,
        event_goal: profile.eventGoal ? parseInt(profile.eventGoal) : null,
        notes: profile.notes,
        onboarding_complete: profile.onboardingComplete
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('[Sync] Error syncing profile:', error);
      return false;
    }

    console.log('[Sync] Profile synced successfully');
    return true;
  } catch (error) {
    console.error('[Sync] Exception syncing profile:', error);
    return false;
  }
}

/**
 * Load user profile from backend
 * @returns {Promise<Object|null>} - User profile or null
 */
async function loadProfileFromBackend() {
  try {
    const user = await getSupabaseUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !data) return null;

    // Convert snake_case to camelCase
    return {
      geminiApiKey: data.gemini_api_key,
      companyName: data.company_name,
      yourRole: data.your_role,
      product: data.product,
      valueProp: data.value_prop,
      targetPersonas: data.target_personas,
      targetIndustries: data.target_industries,
      competitors: data.competitors,
      dealSize: data.deal_size?.toString() || '',
      conversionRate: data.conversion_rate?.toString() || '',
      oppWinRate: data.opp_win_rate?.toString() || '',
      eventGoal: data.event_goal?.toString() || '',
      notes: data.notes,
      onboardingComplete: data.onboarding_complete
    };
  } catch (error) {
    console.error('[Sync] Exception loading profile:', error);
    return null;
  }
}

/**
 * Sync event analysis to backend (with all related data)
 * @param {Object} eventData - Event analysis data from Gemini
 * @returns {Promise<string|null>} - Event ID or null
 */
async function syncEventToBackend(eventData) {
  try {
    const user = await getSupabaseUser();
    if (!user) {
      console.log('[Sync] Not authenticated, skipping event sync');
      return null;
    }

    // 1. Insert/update event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .upsert({
        user_id: user.id,
        url: eventData.url,
        event_name: eventData.eventName,
        date: eventData.date,
        location: eventData.location,
        description: eventData.description,
        analyzed_at: eventData.analyzedAt || new Date().toISOString(),
        target_count: (eventData.people || []).filter(p => p.isTarget).length,
        potential_revenue: calculatePotentialRevenue(eventData.people || [])
      }, {
        onConflict: 'user_id,url'
      })
      .select()
      .single();

    if (eventError) {
      console.error('[Sync] Error syncing event:', eventError);
      return null;
    }

    const eventId = event.id;
    console.log('[Sync] Event synced:', eventId);

    // 2. Sync people
    if (eventData.people && eventData.people.length > 0) {
      await syncPeopleToBackend(eventId, user.id, eventData.people);
    }

    // 3. Sync expected personas
    if (eventData.expectedPersonas && eventData.expectedPersonas.length > 0) {
      await syncPersonasToBackend(eventId, user.id, eventData.expectedPersonas);
    }

    // 4. Sync sponsors
    if (eventData.sponsors && eventData.sponsors.length > 0) {
      await syncSponsorsToBackend(eventId, user.id, eventData.sponsors);
    }

    // 5. Sync next best actions
    if (eventData.nextBestActions && eventData.nextBestActions.length > 0) {
      await syncActionsToBackend(eventId, user.id, eventData.nextBestActions);
    }

    return eventId;
  } catch (error) {
    console.error('[Sync] Exception syncing event:', error);
    return null;
  }
}

/**
 * Sync people to backend
 */
async function syncPeopleToBackend(eventId, userId, people) {
  try {
    // Delete existing people for this event
    await supabase
      .from('people')
      .delete()
      .eq('event_id', eventId);

    // Insert new people (filter out entries with no name or title)
    const peopleData = people
      .filter(person => person.name && person.name.trim())
      .map(person => ({
        event_id: eventId,
        user_id: userId,
        name: person.name,
        role: person.role || null,
        title: person.title && person.title.trim() ? person.title : null,
        company: person.company || null,
        persona: person.persona || null,
        linkedin: person.linkedin || null,
        linkedin_message: person.linkedinMessage || null,
        ice_breaker: person.iceBreaker || null,
        is_target: person.isTarget || false
      }));

    const { error } = await supabase
      .from('people')
      .insert(peopleData);

    if (error) {
      console.error('[Sync] Error syncing people:', error);
    } else {
      console.log('[Sync] Synced', people.length, 'people');
    }
  } catch (error) {
    console.error('[Sync] Exception syncing people:', error);
  }
}

/**
 * Sync expected personas to backend
 */
async function syncPersonasToBackend(eventId, userId, personas) {
  try {
    // Delete existing personas for this event
    await supabase
      .from('expected_personas')
      .delete()
      .eq('event_id', eventId);

    // Insert new personas
    const personasData = personas.map(persona => ({
      event_id: eventId,
      user_id: userId,
      persona: persona.persona,
      likelihood: persona.likelihood,
      count: persona.count,
      linkedin_message: persona.linkedinMessage,
      ice_breaker: persona.iceBreaker,
      conversation_starters: persona.conversationStarters || [],
      keywords: persona.keywords || [],
      pain_points: persona.painPoints || []
    }));

    const { error } = await supabase
      .from('expected_personas')
      .insert(personasData);

    if (error) {
      console.error('[Sync] Error syncing personas:', error);
    } else {
      console.log('[Sync] Synced', personas.length, 'personas');
    }
  } catch (error) {
    console.error('[Sync] Exception syncing personas:', error);
  }
}

/**
 * Sync sponsors to backend
 */
async function syncSponsorsToBackend(eventId, userId, sponsors) {
  try {
    // Delete existing sponsors for this event
    await supabase
      .from('sponsors')
      .delete()
      .eq('event_id', eventId);

    // Insert new sponsors
    const sponsorsData = sponsors.map(sponsor => ({
      event_id: eventId,
      user_id: userId,
      name: sponsor.name,
      tier: sponsor.tier
    }));

    const { error } = await supabase
      .from('sponsors')
      .insert(sponsorsData);

    if (error) {
      console.error('[Sync] Error syncing sponsors:', error);
    } else {
      console.log('[Sync] Synced', sponsors.length, 'sponsors');
    }
  } catch (error) {
    console.error('[Sync] Exception syncing sponsors:', error);
  }
}

/**
 * Sync next best actions to backend
 */
async function syncActionsToBackend(eventId, userId, actions) {
  try {
    // Delete existing actions for this event
    await supabase
      .from('next_best_actions')
      .delete()
      .eq('event_id', eventId);

    // Insert new actions
    const actionsData = actions.map(action => ({
      event_id: eventId,
      user_id: userId,
      priority: action.priority,
      action: action.action,
      reason: action.reason
    }));

    const { error } = await supabase
      .from('next_best_actions')
      .insert(actionsData);

    if (error) {
      console.error('[Sync] Error syncing actions:', error);
    } else {
      console.log('[Sync] Synced', actions.length, 'actions');
    }
  } catch (error) {
    console.error('[Sync] Exception syncing actions:', error);
  }
}

/**
 * Load event from backend with all related data
 * @param {string} url - Event URL
 * @returns {Promise<Object|null>} - Complete event data or null
 */
async function loadEventFromBackend(url) {
  try {
    const user = await getSupabaseUser();
    if (!user) return null;

    // Get event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .eq('url', url)
      .single();

    if (eventError || !event) return null;

    // Get people
    const { data: people } = await supabase
      .from('people')
      .select('*')
      .eq('event_id', event.id);

    // Get personas
    const { data: personas } = await supabase
      .from('expected_personas')
      .select('*')
      .eq('event_id', event.id);

    // Get sponsors
    const { data: sponsors } = await supabase
      .from('sponsors')
      .select('*')
      .eq('event_id', event.id);

    // Get actions
    const { data: actions } = await supabase
      .from('next_best_actions')
      .select('*')
      .eq('event_id', event.id);

    // Convert to extension format
    return {
      url: event.url,
      eventName: event.event_name,
      date: event.date,
      location: event.location,
      description: event.description,
      analyzedAt: event.analyzed_at,
      people: (people || []).map(p => ({
        name: p.name,
        role: p.role,
        title: p.title,
        company: p.company,
        persona: p.persona,
        linkedin: p.linkedin,
        linkedinMessage: p.linkedin_message,
        iceBreaker: p.ice_breaker,
        isTarget: p.is_target
      })),
      expectedPersonas: (personas || []).map(p => ({
        persona: p.persona,
        likelihood: p.likelihood,
        count: p.count,
        linkedinMessage: p.linkedin_message,
        iceBreaker: p.ice_breaker,
        conversationStarters: p.conversation_starters,
        keywords: p.keywords,
        painPoints: p.pain_points
      })),
      sponsors: (sponsors || []).map(s => ({
        name: s.name,
        tier: s.tier
      })),
      nextBestActions: (actions || []).map(a => ({
        priority: a.priority,
        action: a.action,
        reason: a.reason
      }))
    };
  } catch (error) {
    console.error('[Sync] Exception loading event:', error);
    return null;
  }
}

/**
 * Load all events from backend
 * @returns {Promise<Object>} - Events keyed by URL
 */
async function loadAllEventsFromBackend() {
  try {
    const user = await getSupabaseUser();
    if (!user) return {};

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('analyzed_at', { ascending: false });

    if (error) {
      console.error('[Sync] Error loading events:', error);
      return {};
    }

    // Load full data for each event
    const eventsData = {};
    for (const event of events) {
      const fullEvent = await loadEventFromBackend(event.url);
      if (fullEvent) {
        eventsData[event.url] = fullEvent;
      }
    }

    console.log('[Sync] Loaded', Object.keys(eventsData).length, 'events from backend');
    return eventsData;
  } catch (error) {
    console.error('[Sync] Exception loading events:', error);
    return {};
  }
}

/**
 * Delete event from backend
 * @param {string} url - Event URL
 * @returns {Promise<boolean>} - Success status
 */
async function deleteEventFromBackend(url) {
  try {
    const user = await getSupabaseUser();
    if (!user) return false;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('user_id', user.id)
      .eq('url', url);

    if (error) {
      console.error('[Sync] Error deleting event:', error);
      return false;
    }

    console.log('[Sync] Event deleted from backend');
    return true;
  } catch (error) {
    console.error('[Sync] Exception deleting event:', error);
    return false;
  }
}

/**
 * Calculate potential revenue for ROI
 */
function calculatePotentialRevenue(people) {
  // This would use the profile data to calculate
  // For now, just return 0
  return 0;
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    syncProfileToBackend,
    loadProfileFromBackend,
    syncEventToBackend,
    loadEventFromBackend,
    loadAllEventsFromBackend,
    deleteEventFromBackend
  };
}
