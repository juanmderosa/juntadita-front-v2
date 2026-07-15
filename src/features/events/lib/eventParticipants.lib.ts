export function getDeliveryLabel(status: "sent" | "failed" | "skipped") {
  if (status === "sent") return "enviado";
  if (status === "failed") return "fallo el envio";
  return "ya existia";
}
