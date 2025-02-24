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
  password?: string;
  role: "USER" | "RECRUITER";
  resumeUpload?: File | null;
  resumeURL ?: string | null;
  skills?: string[] | null;
}

interface AuthState {
  user: User | null;
  isLoading : boolean;
}

interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: "Pending" | "Accepted" | "Rejected";
}


interface ApplicationsState {
  applicationsList: Application[];
}





// Job interface
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  skillsRequired: string[];
  creator?: string | null;
}

// JobsState interface
interface JobsState {
  jobsList: Job[];
}