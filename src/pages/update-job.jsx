import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateJob } from "@/api/apiJobs";

const UpdateJobModal = ({ job, onClose, onSave }) => {
  const [title, setTitle] = useState(job.title);
  const [description, setDescription] = useState(job.description);
  const [requirements, setRequirements] = useState(job.requirements);

  const handleSave = async () => {
    // Perform job update and get updated job data
    const updatedJob = await updateJob("", { job_id: job.id, title, description, requirements });
    if (updatedJob) {
      onSave(updatedJob); // Pass updated job data to onSave in JobCard
    }
  };

  return (
    <div className="modal bg-gray-900 text-white p-6 rounded-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Edit Job Details</h2>

      {/* Job Title Input */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-300 mb-2">Job Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered bg-gray-800 text-white border-gray-600 placeholder-gray-400 w-full p-3 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Job Title"
        />
      </div>

      {/* Job Description Input */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-300 mb-2">Job Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input input-bordered bg-gray-800 text-white border-gray-600 placeholder-gray-400 w-full p-3 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Job Description"
          rows={4}
        />
      </div>

      {/* Job Requirements Input */}
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-300 mb-2">Job Requirements</label>
        <Textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          className="input input-bordered bg-gray-800 text-white border-gray-600 placeholder-gray-400 w-full p-3 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Job Requirements"
          rows={4}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <Button variant="secondary" onClick={onClose} className="bg-gray-700 text-white hover:bg-gray-600 p-3 rounded-md">
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          className="bg-blue-600 text-white hover:bg-blue-500 p-3 rounded-md"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default UpdateJobModal;
