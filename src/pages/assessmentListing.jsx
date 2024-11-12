import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";

import { Button } from "@/components/ui/button";
import Input from "postcss/lib/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getJobs } from "@/api/apiJobs";
import { getApplications } from "@/api/apiApplication";
import { getAssessments } from "@/api/apiAssessment";
import AssessmentCard from "@/components/assessment-card";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [ass_id, setAssId] = useState("");

  const { isLoaded } = useUser();

  const {
    loading: loadingCompanies,
    data: assessments,
    fn: fnAssessments,
  } = useFetch(getAssessments);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    ass_id,
    searchQuery,
  });

  const {
    data: applications,
    fn: fnApplicant,
  } = useFetch(getApplications, {});

  useEffect(() => {
    if (isLoaded) {
      fnAssessments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setAssId("");
    setLocation("");
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h1 className="font-extrabold text-5xl sm:text-7xl text-center pb-8 text-white">
        Assessments
      </h1>
      
      <form
        onSubmit={handleSearch}
        className="h-14 flex flex-row w-full gap-2 items-center mb-3"
      >
        <input
          type="text"
          placeholder="Search Assessments by Job Title.."
          name="search-query"
          className="bg-gray-800 text-white border-gray-600 h-full flex-1 px-4 text-md rounded-lg"
        />
        <Button type="submit" className="h-full sm:w-28 bg-blue-600 text-white hover:bg-blue-700" variant="blue">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="bg-gray-700 text-white rounded-lg">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 text-white">
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name} className="bg-gray-600 text-white hover:bg-gray-500">
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          className="sm:w-1/2 bg-red-600 text-white hover:bg-red-700"
          variant="destructive"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <AssessmentCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div className="text-center text-gray-400">No Assessments Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
