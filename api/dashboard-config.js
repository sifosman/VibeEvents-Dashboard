export default function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
  const bucket = "Funxions";

  // Basic cache headers to avoid frequent cold starts but allow quick updates
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");

  res.status(200).json({ supabaseUrl, supabaseAnonKey, bucket });
}
