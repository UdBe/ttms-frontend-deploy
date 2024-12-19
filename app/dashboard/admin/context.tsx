import React, { createContext, useState, useEffect, useContext } from "react";
import { APICaller } from "@/utils/apiCaller";

interface WorkflowContextProps {
  workflows: any[];
  setWorkflows: React.Dispatch<React.SetStateAction<any[]>>;
  selectedWorkflow: any;
  setSelectedWorkflow: React.Dispatch<React.SetStateAction<any>>;
  setRerun: React.Dispatch<React.SetStateAction<any>>;
  selectedWorkflowData: any;
  setSelectedWorflowData: React.Dispatch<React.SetStateAction<any>>;
}

const WorkflowContext = createContext<WorkflowContextProps | undefined>(
  undefined,
);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [selectedWorkflowData, setSelectedWorflowData] = useState<any>(null);
  const [rerun, setRerun] = useState<boolean>(false);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const { data } = await APICaller({
          path: "/workflow/",
          method: "GET",
          auth: true,
        });
        setWorkflows(data);
      } catch (error) {
        console.error("Error fetching workflows:", error);
      }
    };
    fetchWorkflows();
    setRerun(false);
  }, [rerun]);

  return (
    <WorkflowContext.Provider
      value={{
        workflows,
        setWorkflows,
        selectedWorkflow,
        setSelectedWorkflow,
        setRerun,
        selectedWorkflowData,
        setSelectedWorflowData,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

// Custom hook for accessing the Workflow context
export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
};
