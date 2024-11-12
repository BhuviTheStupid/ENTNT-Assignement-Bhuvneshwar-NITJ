import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseClient = async (supabaseAccessToken) => {
  const supabase = createClient(supabaseUrl, supabaseKey || supabaseAccessToken, {
    global: { headers: { Authorization: supabaseAccessToken ? `Bearer ${supabaseAccessToken}` : '' } },
  });
  // set Supabase JWT on the client object,
  // so it is sent up with all Supabase requests
  // console.log("Token being sent:", supabaseAccessToken);
  return supabase;
};

export default supabaseClient;