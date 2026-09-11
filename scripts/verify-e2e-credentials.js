const { loadE2ECredentials } = require('./e2eCredentials');

try {
  const credentials = loadE2ECredentials();
  console.log('Local E2E credentials resolved: learner, centre, and admin email/password values are available.');
  console.log(`Learner email: ${credentials.learner.email}`);
  console.log('Learner password: available');
  console.log(`Centre email: ${credentials.centre.email}`);
  console.log('Centre password: available');
  console.log(`Admin email: ${credentials.admin.email}`);
  console.log('Admin password: available');
} catch (error) {
  console.error(`Local E2E credentials unavailable: ${error.message}`);
  process.exitCode = 1;
}