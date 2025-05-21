
import { FileText } from "lucide-react";

const GeneratingState = () => {
  return (
    <div className="py-8 text-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <FileText className="h-6 w-6 text-blue-500" />
        </div>
        <p className="mt-4 font-medium">
          Génération du document en cours...
        </p>
      </div>
      <div className="mt-4 h-2 bg-blue-100 rounded overflow-hidden">
        <div className="h-full bg-blue-500 animate-[progress_2s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
};

export default GeneratingState;
