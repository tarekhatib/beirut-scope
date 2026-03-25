const REQUIRED = ["DATABASE_URL", "NEXTAUTH_SECRET"] as const;

const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}\nCheck your .env.local file.`
  );
}
