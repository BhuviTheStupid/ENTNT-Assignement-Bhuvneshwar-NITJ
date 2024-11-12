import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AppLayout from "./layouts/app-layout";
import { ThemeProvider } from "./components/theme-provider";

import PostJob from "./pages/post-job";
import JobListing from "./pages/jobListing";
import ApplicantPage from "./pages/applicant";

import JobPage from "./pages/job";

import "./App.css";
import AssessmentListing from "./pages/assessmentListing";
import AssessmentPage from "./pages/assessment";
import PostAssessment from "./pages/post-assessment";
import UpdateQuestion from "./pages/update-ques";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <JobListing />,
      },
      {
        path: "/applicant/:id",
        element: (
            <ApplicantPage />
        ),
      },
      {
        path: "/post-job",
        element: (
            <PostJob />
        ),
      },
      {
        path: "/job/:id",
        element: (
          <JobPage />
        ),
      },
      {
        path: "/update-ques/:id",
        element: (
          <UpdateQuestion />
        ),
      },
      {
        path: "/assessment",
        element: (
          <AssessmentListing />
        ),
      },
      {
        path: "/post-assessment",
        element: (
            <PostAssessment />
        ),
      },
      {
        path: "/assessment/:id",
        element: (
            <AssessmentPage />
        ),
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
