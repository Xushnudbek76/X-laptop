import type { Response } from "express";

export function escapeJsString(value: unknown): string {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/</g, "\\x3C")
    .replace(/>/g, "\\x3E")
    .replace(/&/g, "\\x26");
}

export function alertAndRedirect(
  res: Response,
  message: unknown,
  redirectTo: string,
) {
  res.send(
    `<script>alert("${escapeJsString(message)}"); window.location.replace("${escapeJsString(redirectTo)}");</script>`,
  );
}

export function alertOnly(res: Response, message: unknown) {
  res.send(`<script>alert("${escapeJsString(message)}");</script>`);
}
