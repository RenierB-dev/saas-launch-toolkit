// Environment variable validation
// This ensures all required environment variables are set at startup

export function validateEnvironmentVariables() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "PADDLE_API_KEY",
    "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN",
    "NEXT_PUBLIC_PADDLE_ENVIRONMENT",
    "NEXT_PUBLIC_PADDLE_PRICE_ID_ONETIME",
    "NEXT_PUBLIC_PADDLE_PRICE_ID_MONTHLY",
    "PADDLE_WEBHOOK_SECRET",
  ]

  const missing: string[] = []
  const warnings: string[] = []

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar]
    if (!value || value.includes("YOUR_") || value.includes("your_")) {
      missing.push(envVar)
    }
  }

  // Check for environment consistency
  const paddleEnv = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT
  const paddleApiKey = process.env.PADDLE_API_KEY
  const paddleClientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN

  if (paddleEnv === "sandbox") {
    if (paddleApiKey && !paddleApiKey.startsWith("pdl_test_")) {
      warnings.push(
        "⚠️  PADDLE_API_KEY appears to be LIVE but environment is 'sandbox'"
      )
    }
    if (paddleClientToken && !paddleClientToken.startsWith("test_")) {
      warnings.push(
        "⚠️  PADDLE_CLIENT_TOKEN appears to be LIVE but environment is 'sandbox'"
      )
    }
  }

  if (paddleEnv === "production") {
    if (paddleApiKey && !paddleApiKey.startsWith("pdl_live_")) {
      warnings.push(
        "⚠️  PADDLE_API_KEY appears to be TEST but environment is 'production'"
      )
    }
    if (paddleClientToken && !paddleClientToken.startsWith("live_")) {
      warnings.push(
        "⚠️  PADDLE_CLIENT_TOKEN appears to be TEST but environment is 'production'"
      )
    }
  }

  if (missing.length > 0) {
    console.error("\n❌ Missing or invalid required environment variables:")
    missing.forEach((envVar) => console.error(`   - ${envVar}`))
    console.error(
      "\nPlease check your .env.local file and add the missing variables.\n"
    )
    throw new Error("Missing required environment variables")
  }

  if (warnings.length > 0) {
    console.warn("\n⚠️  Environment configuration warnings:")
    warnings.forEach((warning) => console.warn(`   ${warning}`))
    console.warn(
      "\nThis may cause payment processing to fail. Please verify your Paddle configuration.\n"
    )
  }

  console.log("✅ Environment variables validated successfully")
  console.log(`   Mode: ${paddleEnv}`)
}
