declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "USER" | "RECRUITER";
  resumeUpload?: File | null;
  resumeURL ?: string | null;
  skills?: string[] | null;
}

interface UpdateUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "RECRUITER";
  resumeUpload?: File | null;
  resumeURL ?: string | null;
  skills?: string[] | null;
}


interface AuthState {
  user: UpdateUser | null;
  isLoading : boolean;
}


// Define Application Interface
interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: "Pending" | "Accepted" | "Rejected";
  recruiterId : string;
  createdAt: string;
}


interface ApplicationsState {
  applicationsList: Application[];
  loading: boolean;
  error: string | null;
}



// Job interface
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  skillsRequired: string[];
  creator: string;
}

// JobsState interface
interface JobState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
}