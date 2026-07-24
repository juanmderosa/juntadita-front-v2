import type { ExpenseAttachment } from "@/types/expenses";

type Props = {
  attachments: ExpenseAttachment[];
  canManage: boolean;
  onDownload: (attachmentId: string) => Promise<void>;
  onRequestDelete: (attachment: ExpenseAttachment) => void;
};

export function ExpenseAttachments({ attachments, canManage, onDownload, onRequestDelete }: Props) {
  if (attachments.length === 0) return null;

  return (
    <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm">
      {attachments.map((attachment) => (
        <li className="flex items-center gap-2" key={attachment.id}>
          <button
            className="font-semibold text-indigo-700 underline"
            onClick={() => void onDownload(attachment.id)}
          >
            Ver {attachment.fileName}
          </button>
          {canManage ? (
            <button
              aria-label={`Eliminar comprobante ${attachment.fileName}`}
              className="text-xs font-semibold text-red-700"
              onClick={() => onRequestDelete(attachment)}
            >
              Eliminar
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
