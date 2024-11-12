/* eslint-disable react/prop-types */
import { Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import useFetch from "@/hooks/use-fetch";
import { deleteAssessment, getAssessments } from "@/api/apiAssessment";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Link } from "react-router-dom";

const AssessmentCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();

  // Fetching assessments with `useFetch` hook
  const {
    loading: loadingAssessments,
    data: assessments,
    fn: fetchAssessments,
  } = useFetch(getAssessments);

  const { loading: loadingDeleteAssessment, fn: fnDeleteAssessment } = useFetch(deleteAssessment, {
    job_id: job.id,
  });

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleDeleteAssessment = async () => {
    await fnDeleteAssessment();
    onJobAction();
    window.location.reload();
  };

  if (loadingAssessments) {
    return <BarLoader width={"100%"} color="#36d7b7" />;
  }

  // Filter assessments to match only those with the same `job_id`
  const matchingAssessment = assessments?.find(
    (assessment) => assessment.job_id === job.id
  );

  // If no matching assessment, don't render anything
  if (!matchingAssessment) return null;

  return (
    <Card className="flex flex-col">
      {loadingDeleteAssessment && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      <CardHeader className="flex">
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {(
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteAssessment}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex gap-2 items-center">
          {job.description}
        </div>
        <hr />
        {/* {job.requirements} */}
      </CardContent>
      <CardFooter className="flex gap-2">
        {/* Edit Assessment Button */}
        <Link to={`/assessment/${matchingAssessment.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            Edit Assessment
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AssessmentCard;
