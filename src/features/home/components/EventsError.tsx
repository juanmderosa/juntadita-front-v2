import { getErrorMessage } from "../../../lib/errors";

interface Props {
  error: Error;
}

export const EventsError = ({ error }: Props) => {
  return (
    <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      {getErrorMessage(error)}
    </p>
  );
};
