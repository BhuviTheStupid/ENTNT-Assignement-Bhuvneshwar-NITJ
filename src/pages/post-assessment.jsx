import { useNavigate } from "react-router-dom";  // Add this import
import { addNewAssessment } from "@/api/apiAssessment";
import { getJobs } from "@/api/apiJobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { z } from "zod";

// Schema for validation
const schema = z.object({
  question: z.string().min(1, { message: "Question is required" }),
  op1: z.string().min(1, { message: "Option 1 is required" }),
  op2: z.string().min(1, { message: "Option 2 is required" }),
  op3: z.string().min(1, { message: "Option 3 is required" }),
  op4: z.string().min(1, { message: "Option 4 is required" }),
  job_id: z.string().min(1, { message: "Select a job" }), // Job selection validation
});

const PostAssessment = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();  // Now using useNavigate

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [selectedJob, setSelectedJob] = useState(""); // Track the selected job

  // Fetch job creation data
  const {
    loading: loadingCreateAssessment,
    error: errorCreateAssessment,
    data: dataCreateAssessment,
    fn: fnCreateAssessment,
  } = useFetch(addNewAssessment);

  useEffect(() => {
    if (dataCreateAssessment) {
      // Redirect after successful assessment creation
      navigate("/assessment");
    }
  }, [dataCreateAssessment, navigate]);

  const { loading: loadingJobs, data: jobs, fn: fnJobs } = useFetch(getJobs);

  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded]);

  const onSubmit = (data) => {
    fnCreateAssessment({
      ...data,
      job_id: selectedJob, // Ensure that selectedJob is passed as job_id
    });
  };

  if (!isLoaded || loadingJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h1 className="font-extrabold text-5xl sm:text-7xl text-center pb-8 text-white">
        Create New Assessment
      </h1>
      
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-6 sm:p-10 rounded-lg bg-gray-800"
      >
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Question"
            {...register("question")}
            className="bg-gray-700 text-white border-gray-600"
          />
          {errors.question && <p className="text-red-500">{errors.question.message}</p>}
        </div>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Option1"
            {...register("op1")}
            className="bg-gray-700 text-white border-gray-600"
          />
          {errors.op1 && <p className="text-red-500">{errors.op1.message}</p>}
        </div>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Option2"
            {...register("op2")}
            className="bg-gray-700 text-white border-gray-600"
          />
          {errors.op2 && <p className="text-red-500">{errors.op2.message}</p>}
        </div>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Option3"
            {...register("op3")}
            className="bg-gray-700 text-white border-gray-600"
          />
          {errors.op3 && <p className="text-red-500">{errors.op3.message}</p>}
        </div>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Option4"
            {...register("op4")}
            className="bg-gray-700 text-white border-gray-600"
          />
          {errors.op4 && <p className="text-red-500">{errors.op4.message}</p>}
        </div>

        <div className="flex gap-4 items-center">
          <Controller
            name="job_id" // Make sure job_id is correctly mapped here
            control={control}
            render={({ field }) => (
              <Select
                {...field} // Spread the field object to integrate with react-hook-form
                value={selectedJob} // Using selectedJob state as value
                onValueChange={(value) => {
                  setSelectedJob(value); // Update selectedJob when value changes
                  field.onChange(value); // Sync with react-hook-form
                }}
                className="bg-gray-700 text-white"
              >
                <SelectTrigger className="bg-gray-700 text-white">
                  <SelectValue placeholder="Select Job" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white">
                  <SelectGroup>
                    {Array.isArray(jobs) && jobs.length > 0 ? (
                      jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id} className="bg-gray-600 text-white hover:bg-gray-500">
                          {job.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>No jobs available</SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {errors.job_id && <p className="text-red-500">{errors.job_id.message}</p>}

        {errorCreateAssessment?.message && (
          <p className="text-red-500">{errorCreateAssessment?.message}</p>
        )}
        {loadingCreateAssessment && <BarLoader width={"100%"} color="#36d7b7" />}
        <Button type="submit" variant="destructive" size="lg" className="mt-2 bg-gray-600 text-white hover:bg-gray-500">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostAssessment;
