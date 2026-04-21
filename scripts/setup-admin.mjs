import { createClient } from "@supabase/supabase-js";
import pg from "pg";

const SUPABASE_URL = "https://tnxwsenxwjsjqkaqtawj.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRueHdzZW54d2pzanFrYXF0YXdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjYyOTA1MywiZXhwIjoyMDkyMjA1MDUzfQ.imYFYKxMZbVQWedJL_-hE4T8fdoIl3zgx_g3kB_x5BI";
const DB_URL = "postgresql://postgres.tnxwsenxwjsjqkaqtawj:Mwavellah14011968@aws-0-eu-west-1.pooler.supabase.com:5432/postgres";

const ADMIN_EMAIL = "erickmathew0021@gmail.com";
const ADMIN_PASSWORD = "FoodOS@Admin2026!";

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // Delete ALL existing Supabase Auth users
  console.log("Cleaning Supabase Auth...");
  let page = 1;
  while (true) {
    const { data } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (!data || !data.users || data.users.length === 0) break;
    for (const u of data.users) {
      await supabase.auth.admin.deleteUser(u.id);
      console.log("  Deleted:", u.email);
    }
    if (data.users.length < 100) break;
    page++;
  }

  // Create super admin auth user
  console.log("\nCreating super admin in Supabase Auth...");
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });

  if (authError) {
    console.error("Auth create error:", authError);
    return;
  }
  console.log("Auth user created:", authData.user.id);

  // DB setup
  console.log("\nSetting up database...");
  const client = new pg.Client({ connectionString: DB_URL });
  await client.connect();

  // Clean
  await client.query("DELETE FROM users");
  await client.query("DELETE FROM tenants");
  console.log("DB cleaned");

  // Create admin tenant
  const tenantRes = await client.query(
    `INSERT INTO tenants (id, name, slug, phone, email, city, approval_status, kyc_status, subscription_plan, max_users, created_at, updated_at)
     VALUES (gen_random_uuid(), 'FoodOS Admin', 'foodos-admin', '', $1, 'System', 'approved', 'approved', 'enterprise', 999, NOW(), NOW())
     RETURNING id`,
    [ADMIN_EMAIL]
  );
  const tenantId = tenantRes.rows[0].id;
  console.log("Admin tenant created:", tenantId);

  // Create super admin user
  await client.query(
    `INSERT INTO users (id, tenant_id, auth_id, name, phone, email, role, is_active, created_at, updated_at)
     VALUES (gen_random_uuid(), $1, $2, 'Erick Mathew', '', $3, 'super_admin', true, NOW(), NOW())`,
    [tenantId, authData.user.id, ADMIN_EMAIL]
  );
  console.log("Super admin user created in DB");

  await client.end();

  console.log("\n========================================");
  console.log("SUPER ADMIN LOGIN DETAILS:");
  console.log("========================================");
  console.log("Email:    " + ADMIN_EMAIL);
  console.log("Password: " + ADMIN_PASSWORD);
  console.log("========================================");
}

main().catch(console.error);
