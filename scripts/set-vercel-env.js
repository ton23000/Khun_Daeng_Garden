const { execSync } = require("child_process");

function addEnv(name, value, env) {
  try {
    console.log(`Adding ${name} to ${env}...`);
    execSync(`npx vercel env add ${name} ${env}`, {
      input: value,
      stdio: ["pipe", "inherit", "inherit"],
    });
    console.log(`Successfully added ${name} to ${env}`);
  } catch (e) {
    console.error(`Failed to add ${name} to ${env}`);
  }
}

const vars = {
  EMAIL_USER: "your-smtp-user",
  EMAIL_PASS: "your-smtp-pass",
  EMAIL_HOST: "smtp-relay.brevo.com",
  EMAIL_PORT: "587",
};

for (const [key, value] of Object.entries(vars)) {
  addEnv(key, value, "production");
  addEnv(key, value, "preview");
  addEnv(key, value, "development");
}
