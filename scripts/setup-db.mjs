import pg from "pg";

const DB_URL = "postgresql://postgres.tnxwsenxwjsjqkaqtawj:Mwavellah14011968@aws-0-eu-west-1.pooler.supabase.com:5432/postgres";
const AUTH_ID = "ea02ae76-f87f-4a45-ad8b-35ea6f74e95b";
const ADMIN_EMAIL = "erickmathew0021@gmail.com";

async function main() {
  const client = new pg.Client({ connectionString: DB_URL });
  await client.connect();

  // Clean
  await client.query("DELETE FROM users");
  await client.query("DELETE FROM tenants");
  console.log("DB cleaned");

  // Create admin tenant with all required fields
  const tenantRes = await client.query(
    `INSERT INTO tenants (id, name, slug, phone, email, city, approval_status, kyc_status, subscription_plan, max_users, created_at, updated_at)
     VALUES (gen_random_uuid(), 'FoodOS Admin', 'foodos-admin', '', $1, 'System', 'approved', 'approved', 'enterprise', 999, NOW(), NOW())
     RETURNING id`,
    [ADMIN_EMAIL]
  );
  const tenantId = tenantRes.rows[0].id;
  console.log("Tenant created:", tenantId);

  // Create super admin user
  await client.query(
    `INSERT INTO users (id, tenant_id, auth_id, name, phone, email, role, is_active, created_at, updated_at)
     VALUES (gen_random_uuid(), $1, $2, 'Erick Mathew', '', $3, 'super_admin', true, NOW(), NOW())`,
    [tenantId, AUTH_ID, ADMIN_EMAIL]
  );
  console.log("Super admin created!");

  // Verify
  const check = await client.query("SELECT id, name, email, role FROM users");
  console.log("Users:", check.rows);

  await client.end();

  console.log("\n========================================");
  console.log("SUPER ADMIN LOGIN DETAILS:");
  console.log("Email:    erickmathew0021@gmail.com");
  console.log("Password: FoodOS@Admin2026!");
  console.log("========================================");
}

main().catch(console.error);
