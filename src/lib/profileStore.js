const PROFILE_KEY = 'kayapat_profile';

const DEFAULT_PROFILE = {
  name: 'สมชาย รักดี',
  usage_mode: 'self', // 'self' or 'caregiver'
  pain_scale: 3,
  limitations: 'ตึงบริเวณหัวไหล่เล็กน้อยตอนยกสูง',
  condition: 'ฟื้นฟูกล้ามเนื้อและข้อต่อทั่วไป (General Rehabilitation)'
};

/**
 * Retrieves the user profile from localStorage or returns default values if none exists.
 * @returns {Object} Profile data
 */
export const getProfile = () => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (!data) {
      // Initialize with default on first run
      localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading profile from localStorage:', error);
    return DEFAULT_PROFILE;
  }
};

/**
 * Saves user profile data to localStorage.
 * @param {Object} profileData Fields to update
 * @returns {Object|null} Updated profile or null on failure
 */
export const saveProfile = (profileData) => {
  try {
    const current = getProfile();
    const updated = { ...current, ...profileData };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    // Dispatch a storage event or custom event for reactive updates in components if needed
    window.dispatchEvent(new CustomEvent('profileUpdate', { detail: updated }));
    return updated;
  } catch (error) {
    console.error('Error saving profile to localStorage:', error);
    return null;
  }
};
