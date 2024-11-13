import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";

const Header = () => {
  return (
    <>
      <nav className="py-6 sm:px-10 px-4 flex justify-center items-center bg-gray-900">
        <div className="flex flex-wrap gap-6 sm:gap-10 items-center justify-center sm:justify-start w-full">
          <Link to="/post-job" className="w-full sm:w-auto">
            <Button variant="destructive" className="w-full sm:w-auto rounded-full text-xs sm:text-sm py-3 px-6">
              <PenBox size={15} className="mr-2" />
              Post a Job
            </Button>
          </Link>

          <Link to="/" className="w-full sm:w-auto">
            <Button variant="destructive" className="w-full sm:w-auto rounded-full text-xs sm:text-sm py-3 px-6">
              <PenBox size={15} className="mr-2" />
              Manage Jobs
            </Button>
          </Link>

          <Link to="/assessment" className="w-full sm:w-auto">
            <Button variant="destructive" className="w-full sm:w-auto rounded-full text-xs sm:text-sm py-3 px-6">
              <PenBox size={15} className="mr-2" />
              Assessments
            </Button>
          </Link>

          <Link to="/post-assessment" className="w-full sm:w-auto">
            <Button variant="destructive" className="w-full sm:w-auto rounded-full text-xs sm:text-sm py-3 px-6">
              <PenBox size={15} className="mr-2" />
              Add New Assessment
            </Button>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header;
