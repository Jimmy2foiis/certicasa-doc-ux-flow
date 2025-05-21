
import GenerationSuccess from "../GenerationSuccess";
import DocumentActions from "../DocumentActions";
import { DialogFooter } from "@/components/ui/dialog";

interface SuccessStateProps {
  onDownload: () => void;
}

const SuccessState = ({ onDownload }: SuccessStateProps) => {
  return (
    <>
      <GenerationSuccess />
      <DialogFooter>
        <DocumentActions onDownload={onDownload} />
      </DialogFooter>
    </>
  );
};

export default SuccessState;
