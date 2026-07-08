import { EmptyState } from "../../../components/feedback/EmptyState";
import { Link } from "react-router-dom";

export const EventsEmptyState = () => {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-indigo-200 bg-white px-5">
      <EmptyState
        description="Crea tu primer evento y empieza a organizar la próxima juntada."
        title="Todavia no tenes eventos"
      />
      <div className="pb-10 text-center">
        <Link
          className="font-bold text-indigo-700 hover:text-indigo-900"
          to="/events/new">
          Crear mi primer evento
        </Link>
      </div>
    </div>
  );
};
