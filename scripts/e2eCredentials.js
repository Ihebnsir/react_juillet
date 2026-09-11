const fs = require('fs');
const path = require('path');

const REQUIRED_KEYS = [
  'E2E_LEARNER_EMAIL',
  'E2E_LEARNER_PASSWORD',
  'E2E_CENTRE_EMAIL',
  'E2E_CENTRE_PASSWORD',
  'E2E_ADMIN_EMAIL',
  'E2E_ADMIN_PASSWORD',
];

const parseEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) return {};
  return fs.readFileSync(filePath, 'utf8').split(/\r?\n/).reduce((values, line) => {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || match[1].startsWith('#')) return values;
    const rawValue = match[2];
    values[match[1]] = rawValue.replace(/^(['"])(.*)\1$/, '$2');
    return values;
  }, {});
};

const loadE2ECredentials = (rootDir = path.resolve(__dirname, '..')) => {
  const localValues = parseEnvFile(path.join(rootDir, '.env.e2e.local'));
  const values = { ...localValues };
  REQUIRED_KEYS.forEach((key) => {
    if (process.env[key] !== undefined) values[key] = process.env[key];
  });

  const missing = REQUIRED_KEYS.filter((key) => !values[key]);
  if (values.E2E_LOCAL_ONLY !== 'true') {
    throw new Error('E2E_LOCAL_ONLY=true is required for local credential loading.');
  }
  if (missing.length) {
    throw new Error(`Missing local E2E credential keys: ${missing.join(', ')}`);
  }

  return {
    learner: { email: values.E2E_LEARNER_EMAIL, password: values.E2E_LEARNER_PASSWORD },
    centre: { email: values.E2E_CENTRE_EMAIL, password: values.E2E_CENTRE_PASSWORD },
    admin: { email: values.E2E_ADMIN_EMAIL, password: values.E2E_ADMIN_PASSWORD },
  };
};

module.exports = { loadE2ECredentials, REQUIRED_KEYS };