import { Link, useSearchParams } from "react-router-dom";
import {
  useUser,
} from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";

const Header = () => {

  const [search, setSearch] = useSearchParams();

  return (
    <>
      <nav className="py-20 sm:px-10 flex justify-center items-center">

      <div className="gap-3 items-center grid grid-cols-2 sm:grid-cols-4 text-sm sm:text-base justify-center">

  <div className="flex gap-10 items-center">
    <Link to="/post-job">
      <Button variant="destructive" className="rounded-full text-xs sm:text-sm py-2 px-4 sm:py-3 sm:px-6">
        <PenBox size={15} className="mr-2" />
        Post a Job
      </Button>
    </Link>
  </div>

  <div className="flex gap-10 items-center">
    <Link to="/">
      <Button variant="destructive" className="rounded-full text-xs sm:text-sm py-2 px-4 sm:py-3 sm:px-6">
        <PenBox size={15} className="mr-2" />
        Manage Jobs
      </Button>
    </Link>
  </div>

  <div className="flex gap-10 items-center">
    <Link to="/assessment">
      <Button variant="destructive" className="rounded-full text-xs sm:text-sm py-2 px-4 sm:py-3 sm:px-6">
        <PenBox size={15} className="mr-2" />
        Assessments
      </Button>
    </Link>
  </div>

  <div className="flex gap-10 items-center">
    <Link to="/post-assessment">
      <Button variant="destructive" className="rounded-full text-xs sm:text-sm py-2 px-4 sm:py-3 sm:px-6">
        <PenBox size={15} className="mr-2" />
        Add New Assessment
      </Button>
    </Link>
  </div>
</div>

</nav>
    </>
  );
};

export default Header;
