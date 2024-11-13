import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";

const Header = () => {
  return (
    <>
      <nav className="py-6 sm:px-10 px-4 flex justify-center items-center bg-gray-900">
        <div className="flex gap-6 sm:gap-10 items-center justify-between flex-wrap">
          <Link to="/post-job">
            <Button variant="destructive" className="rounded-full text-xs sm:text-sm py-2 px-4 sm:py-3 sm:px-6">
              <PenBox size={15} className="mr-2" />
              Post a Job
            </Button>
          </Link>

          <Link to="/">
            <Button variant="destructive" className="rounded-full text-xs sm:text-sm py-2 px-4 sm:py-3 sm:px-6">
              <PenBox size={15} className="mr-2" />
              Manage Jobs
            </Button>
          </Link>

          <Link to="/assessment">
            <Button variant="destructive" className="rounded-full text-xs sm:text-sm py-2 px-4 sm:py-3 sm:px-6">
              <PenBox size={15} className="mr-2" />
              Assessments
            </Button>
          </Link>

          <Link to="/post-assessment">
            <Button variant="destructive" className="rounded-full text-xs sm:text-sm py-2 px-4 sm:py-3 sm:px-6">
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
