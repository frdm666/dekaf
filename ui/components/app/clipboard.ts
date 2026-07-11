// Copy text to the clipboard, resilient to insecure origins.
//
// `navigator.clipboard` is only defined in a *secure context* (HTTPS or localhost). Dekaf is frequently
// served over plain `http://<host>` in dev (e.g. behind an ingress on a LAN IP), where the modern API is
// `undefined` and `navigator.clipboard.writeText(...)` throws — so the copy silently does nothing. Fall
// back to the legacy hidden-textarea + `execCommand("copy")` path, which works on insecure origins.
//
// Returns whether the copy succeeded, so callers can only show a "copied" toast when it actually copied.
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (window.isSecureContext && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Secure API present but rejected (permissions, etc.) — fall through to the legacy path.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    // Keep it off-screen and non-interactive, but still selectable.
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.width = "1px";
    textarea.style.height = "1px";
    textarea.style.opacity = "0";
    textarea.setAttribute("readonly", "");
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/** Whether the modern async clipboard API is unavailable because the page isn't a secure context (served
 *  over plain HTTP, not HTTPS or localhost). This is the usual reason a copy fails in dev. */
export function isInsecureClipboardContext(): boolean {
  return !window.isSecureContext || !navigator.clipboard;
}

/** A user-facing reason for a failed copy, tailored to the likely cause. Shown only when a copy actually
 *  failed (the fallback couldn't copy either). */
export function copyFailureMessage(): string {
  return isInsecureClipboardContext()
    ? "Couldn't copy to the clipboard — your browser only allows it on secure pages. Open Dekaf over HTTPS (or localhost), or copy the value manually."
    : "Couldn't copy to the clipboard — copy the value manually.";
}
