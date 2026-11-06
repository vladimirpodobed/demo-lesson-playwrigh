import dotenv from 'dotenv'; // Import dotenv to load environment variables from a local file

// Check whether the tests are running in GitHub Actions (CI environment)
if (process.env.CI !== 'true') {
  // LOCAL ENVIRONMENT:
  // Load credentials and application URL from the local env/prod.env file
  dotenv.config({ path: 'env/prod.env' });

  console.log('Running in local environment');
} else {
  // CI ENVIRONMENT (GitHub Actions):
  // Do not load the local file because it is not available in GitHub Actions
  // GitHub Actions provides environment variables through repository secrets
  console.log('Running in CI environment');
}

// List all environment variables required to run the tests
const requiredVars = ['URL', 'TEST_USERNAME', 'TEST_PASSWORD'];

// Check that every required environment variable has a value
requiredVars.forEach((varName) => {
  // If a variable is missing, stop execution and show which variable is missing
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Export the application URL from the environment variables
export const SERVICE_URL: string = process.env.URL!;

// Export the test username from the environment variables
export const USERNAME: string = process.env.TEST_USERNAME!;

// Export the test password from the environment variables
export const PASSWORD: string = process.env.TEST_PASSWORD!;
