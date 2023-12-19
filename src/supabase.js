import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://figqioozoeunvljybabx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZ3Fpb296b2V1bnZsanliYWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIwNDQ5NDIsImV4cCI6MjAxNzYyMDk0Mn0.BPz0XnuGLHR8zJCuO2MCLXrWIIGmHsMI8t_JnYIUtpg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
