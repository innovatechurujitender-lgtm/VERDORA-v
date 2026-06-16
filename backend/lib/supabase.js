const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL || "https://swbwzjcrpixgsnwvqmqs.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Ynd6amNycGl4Z3Nud3ZxbXFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTUwNjc0MSwiZXhwIjoyMDk3MDgyNzQxfQ.dCsvG1bqSaypEfDxAcc5gFOTHPp9tvTw-9z5BSUOFno";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
