import React from "react";
import { getErrorMessage } from "../../../lib/errors";
import { Link } from "react-router-dom";

interface Props {
  error: Error | null;
}

export const EventDetailError = ({ error }: Props) => {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {getErrorMessage(error)}
      </p>
      <Link
        className="mt-5 inline-block font-bold text-indigo-700"
        to="/">
        Volver a mis eventos
      </Link>
    </section>
  );
};
