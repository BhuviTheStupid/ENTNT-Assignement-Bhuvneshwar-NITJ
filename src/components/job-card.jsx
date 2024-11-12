import { MapPinIcon, Trash2Icon, Edit2Icon, Briefcase } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteJob, getSingleJob } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { getApplications } from "@/api/apiApplication";
import UpdateJobModal from "@/pages/update-job";

const JobCard = ({
  job: initialJob,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [job, setJob] = useState(initialJob);
  const [saved, setSaved] = useState(savedInit);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [applicantCount, setApplicantCount] = useState(0); // State to store applicant count
  const { user } = useUser();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  // Fetch applications specific to the job
  const { fn: fnApplications, loading: loadingApplications } = useFetch(
    getApplications,
    { job_id: job.id }
  );

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
    window.location.reload();
  };

  const handleEditJob = () => {
    setIsEditModalOpen(true);
  };

  const handleJobUpdate = (updatedJob) => {
    setJob((prevJob) => ({
      ...prevJob,
      ...updatedJob,
    }));
    setIsEditModalOpen(false);
    onJobAction();
    window.location.reload();
  };

  return (
    <Card className="flex flex-col relative">
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="font-bold text-lg sm:text-xl">
          {job.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-1 sm:gap-2 gap-1 items-start sm:items-center">
            {job.description}
          </div>
          <div className="flex gap-2 items-center text-sm sm:text-base">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        <hr />
        <div className="text-sm sm:text-base">{job.requirements}</div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between items-center">
        <Edit2Icon
          fill="blue"
          size={20}
          className="text-blue-300 cursor-pointer items-center"
          onClick={handleEditJob}
        />
        <Link to={`/job/${job.id}`} className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto">
            More Details
          </Button>
        </Link>
        <Trash2Icon
          fill="red"
          size={20}
          className="text-red-300 cursor-pointer items-center"
          onClick={handleDeleteJob}
        />
      </CardFooter>

      {/* Edit Job Modal (Popup) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
            <UpdateJobModal
              job={job}
              onClose={() => setIsEditModalOpen(false)}
              onSave={handleJobUpdate}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default JobCard;
