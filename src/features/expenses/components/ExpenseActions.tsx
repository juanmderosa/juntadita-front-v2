type Props = {
  canManage: boolean;
  onEdit: () => void;
  onRequestDelete: () => void;
};

export function ExpenseActions({
  canManage,
  onEdit,
  onRequestDelete,
}: Props) {
  if (!canManage) return null;

  return (
    <div className="mt-3 flex gap-3">
      <button
        className="text-sm font-semibold text-indigo-700"
        onClick={onEdit}>
        Editar
      </button>
      <button
        className="text-sm font-semibold text-red-700"
        onClick={onRequestDelete}>
        Eliminar
      </button>
    </div>
  );
}
