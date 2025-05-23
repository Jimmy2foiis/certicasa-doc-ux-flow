
/**
 * Utility functions for document management
 */

/**
 * Get the appropriate CSS class for a document status badge
 */
export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "sent":
    case "available":
    case "signed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "pending":
    case "missing":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "error":
    case "action-required":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "generated":
    case "ready":
    case "linked":
    case "draft":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};
