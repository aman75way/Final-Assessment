i am making a job portal : 


type.d.ts : 

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
  resumeUpload?: File | string | null;
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


---

- Users are of 2 types RECRUITER and USER 
- USER can apply for jobs which will create an application 
- RECRUITER can see the job applications and approve or reject them 
- USER will have skills 
- Job will have skills required
- creator will be the RECRUITER who will create the job for the company


- i am i am creating a supabase psql database 