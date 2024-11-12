import supabaseClient, { supabaseUrl } from "@/utils/supabase";
// import { useClerk } from "@clerk/clerk-react";
// import supabaseClient from "@/utils/supabase";

export async function updateApplicationStatus(token, applicationData, status) {
  try {
    console.log("JWT Token:", token);

    if (!token) {
      console.error("Authentication token is missing.");
      throw new Error("User authentication required.");
    }

    if (!applicationData || !applicationData.candidate_id) {
      console.error("Candidate ID is missing.");
      throw new Error("Candidate ID required to update application status.");
    }

    const { candidate_id } = applicationData;
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("candidate_id", candidate_id)
      .select();

    if (error) {
      console.error("Supabase error updating application status:", error);
      throw new Error("Failed to update application status in the database.");
    }

    if (!data || data.length === 0) {
      console.error("No matching application found with the provided candidate ID.");
      throw new Error("Application not found with the given candidate ID.");
    }

    return data;
  } catch (error) {
    console.error("updateApplicationStatus error:", error.message);
    return null;
  }
}



export async function getApplications(token="", { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}