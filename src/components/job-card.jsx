/* eslint-disable react/prop-types */
import { MapPinIcon, Trash2Icon } from "lucide-react";
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
import { deleteJob, saveJob } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Briefcase } from "lucide-react";
import { getApplications } from "@/api/apiApplication";
import { useParams } from "react-router-dom";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);

  const { user } = useUser();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const { id } = useParams();

  const {
    loading: loadingApp,
    data: applications,
    fn: fnJob,
  } = useFetch(getApplications, {
    candidate_id: id,
  });

  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob);

  const handleSaveJob = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobAction();
  };

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
    // Refresh the page after job deletion
    window.location.reload(); // Forces the page to reload
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  return (
    <Card className="flex flex-col">
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      <CardHeader className="flex justify-between">
        <CardTitle className="font-bold text-lg sm:text-xl">
          {job.title}
          
        </CardTitle>
        
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* <div className="gap-3 items-center grid grid-cols-2 sm:grid-cols-4 text-sm sm:text-base justify-center"> */}
          <div className="flex flex-1 sm:gap-2 gap-1 items-start sm:items-center">
            {job.description}
          </div>
          {/* <div className="flex gap-2 items-center text-sm sm:text-base">
            <Briefcase size={16} /> {job?.applications?.length} Applicants
          </div> */}
          <div className="flex gap-2 items-right text-sm sm:text-base">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        {/* </div> */}
        <hr />
        <div className="text-sm sm:text-base">{job.requirements}</div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between items-center">
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
    </Card>
  );
};

export default JobCard;