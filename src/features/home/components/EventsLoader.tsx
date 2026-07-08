import React from "react";

export const EventsLoader = () => {
  return (
    <div
      className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
      aria-label="Cargando eventos">
      {[0, 1, 2].map((item) => (
        <div
          className="h-64 animate-pulse rounded-2xl bg-slate-200"
          key={item}
        />
      ))}
    </div>
  );
};
