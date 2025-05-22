
import { apiClient } from "@/lib/api-client";

// Create mock functions to maintain compatibility
export const fetchTemplateVariables = async (templateId: string) => {
  console.log("Mock fetchTemplateVariables called", templateId);
  return { variables: [], error: null };
};

export const saveTemplateVariables = async (templateId: string, variables: any[]) => {
  console.log("Mock saveTemplateVariables called", templateId, variables);
  return { error: null };
};

export const fetchAllTemplateVariables = async () => {
  console.log("Mock fetchAllTemplateVariables called");
  return { mappings: [], error: null };
};

// Add any additional mock functions needed
