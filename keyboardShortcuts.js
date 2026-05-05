import { useEffect } from "react";

const EDITABLE_TAGS = new Set(["INPUT", "SELECT", "TEXTAREA"]);

function normalizeKey(key) {
  if (!key) return "";
  return key.length === 1 ? key.toLowerCase() : key.toLowerCase();
}

function matchesModifier(event, name, expected) {
  if (expected === undefined) {
    return name === "shiftKey" ? true : !event[name];
  }
  return Boolean(event[name]) === expected;
}

export function isEditableTarget(target) {
  if (!target || target === window || target === document) return false;
  if (target.isContentEditable) return true;
  return EDITABLE_TAGS.has(target.tagName);
}

export function isNativeInteractiveTarget(target) {
  if (!target || target === window || target === document) return false;
  return Boolean(
    target.closest(
      'a, button, input, select, textarea, [contenteditable="true"], [role="button"], [role="link"]'
    )
  );
}

export function useKeyboardShortcuts(bindings, deps = []) {
  useEffect(() => {
    const handler = (event) => {
      if (event.defaultPrevented || isEditableTarget(event.target)) return;

      const eventKey = normalizeKey(event.key);
      const binding = bindings.find((candidate) => {
        const keys = Array.isArray(candidate.keys) ? candidate.keys : [candidate.key];
        return (
          keys.map(normalizeKey).includes(eventKey) &&
          matchesModifier(event, "shiftKey", candidate.shiftKey) &&
          matchesModifier(event, "altKey", candidate.altKey) &&
          matchesModifier(event, "ctrlKey", candidate.ctrlKey) &&
          matchesModifier(event, "metaKey", candidate.metaKey)
        );
      });

      if (!binding) return;

      const result = binding.handler(event);
      if (result === false) return;

      event.preventDefault();
      if (binding.stopPropagation !== false) {
        event.stopPropagation();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
