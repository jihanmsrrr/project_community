import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wcelcfuxwxjhsyzvuovk.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZWxjZnV4d3hqaHN5enZ1b3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMTkxNDcsImV4cCI6MjA2NjU5NTE0N30.z3zb5d3ebrq4fQIfUe3EUAu0nW-GM-EDNdYs38g-zbc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
