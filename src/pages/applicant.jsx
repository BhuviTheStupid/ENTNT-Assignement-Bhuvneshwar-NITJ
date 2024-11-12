import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { Briefcase, PhoneCall, Mail } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useFetch from "@/hooks/use-fetch";
import { getApplications, updateApplicationStatus } from "@/api/apiApplication"; 

const ApplicantPage = () => {
  const { id } = useParams(); // Candidate's ID from URL
  const [status, setStatus] = useState("Not specified"); // Initialize status with default value
  const token = "sbp_87d0c7c49895d686dde399c89e087f1a1c7c3dd0"; // Use the provided token directly

  // Fetch candidate's applications using custom hook
  const {
    loading: loadingData,
    data: applications,
    fn: fetchApplications,
  } = useFetch(getApplications, { user_id: id });

  useEffect(() => {
    const waitForSession = async () => {
      await fetchApplications();
    };
    waitForSession();
  }, []);

  useEffect(() => {
    if (applications && applications.length > 0) {
      const primaryApplication = applications[0];
      setStatus(primaryApplication?.status || "Not specified");
    }
  }, [applications]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  
    // Ensure candidate_id is accessed correctly
    const candidateId = applications[0]?.candidate_id;
    if (!candidateId) {
      console.error("Candidate ID not found.");
      return;
    }
  
    // Update application status with candidate ID and hardcoded token
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZraWZibW5odnNwZWhoaHlqbHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNDg5ODgsImV4cCI6MjA0NjcyNDk4OH0.imPzAFTTRUfQa4k1sJr-nD3ISvTq3lv2ySGvzJ0DQCw"; // Replace with your actual token
    updateApplicationStatus(token, { candidate_id: candidateId }, newStatus)
      .then((response) => {
        console.log("Status updated successfully:", response);
  
        if (response) {
          console.log("Successfully updated in the database.");
        } else {
          console.error("Failed to update status in the database.");
        }
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };
  
  
  if (loadingData) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  const primaryApplication = applications && applications[0];

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {primaryApplication?.name || "Candidate Name"}
        </h1>
      </div>

      <span className="flex justify-between">
        <div className="flex gap-2 items-center">
          <PhoneCall /> {primaryApplication?.contact_number} <Mail /> {primaryApplication?.email}
        </div>
        <div className="flex gap-2 items-center">
          <Briefcase /> Status:
          <Select onValueChange={handleStatusChange} value={status}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </span>

      <div>
        <h2 className="text-2xl sm:text-3xl font-bold">Skills</h2>
        <p className="sm:text-lg">{primaryApplication?.skills || "No skills listed"}</p>
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-bold">Experience</h2>
        <MDEditor.Markdown
          source={primaryApplication?.experience || "No experience information provided"}
          className="bg-transparent sm:text-lg"
        />
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-bold">Education</h2>
        <p className="sm:text-lg">{primaryApplication?.education || "No education details provided"}</p>
      </div>

      {primaryApplication?.resume && (
        <div className="mt-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Resume</h2>
          <a
            href={primaryApplication.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Download Resume
          </a>
        </div>
      )}
    </div>
  );
};

export default ApplicantPage;