const STORAGE_KEY = 'skillbridge_contact_info';

const defaultContact = {
  phone: '+216 71 000 000',
  email: 'contact@skillbridge.tn',
  address: 'Tunis, Tunisie',
  description: 'Notre équipe répond rapidement pour vous aider à trouver la bonne opportunité, le bon centre ou le bon accompagnement.',
  social: {
    facebook: '#',
    twitter: '#',
    linkedin: '#',
    instagram: '#',
  },
};

const readStorage = () => {
  if (typeof window === 'undefined') return { ...defaultContact };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultContact, ...JSON.parse(raw) } : { ...defaultContact };
  } catch {
    return { ...defaultContact };
  }
};

const writeStorage = (data) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/**
 * Returns the full contact info object (merged with defaults).
 * @returns {object} contactInfo
 */
export function getContactInfo() {
  return readStorage();
}

/**
 * Replaces the entire contact info with the given object.
 * @param {object} newContact - The new contact data to persist.
 * @returns {object} The saved contact info.
 */
export function updateContactInfo(newContact) {
  const safeContact = { ...defaultContact, ...newContact };
  writeStorage(safeContact);
  return safeContact;
}

/**
 * Resets contact info back to factory defaults.
 * @returns {object} The default contact info.
 */
export function resetContactInfo() {
  writeStorage({ ...defaultContact });
  return { ...defaultContact };
}

