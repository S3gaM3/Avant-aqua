"use client";

import { useEffect } from "react";
import { applyRussianNbsp } from "@/lib/ru-typography";

const EXCLUDED_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "CODE",
  "PRE",
  "TEXTAREA",
  "INPUT",
  "OPTION",
]);

function shouldSkipTextNode(node: Text): boolean {
  let parent = node.parentElement;
  while (parent) {
    if (EXCLUDED_TAGS.has(parent.tagName)) {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}

function applyTypographyToTree(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();

  while (current) {
    const textNode = current as Text;
    if (!shouldSkipTextNode(textNode)) {
      const source = textNode.nodeValue ?? "";
      const transformed = applyRussianNbsp(source);
      if (source !== transformed) {
        textNode.nodeValue = transformed;
      }
    }
    current = walker.nextNode();
  }
}

export function RuTypographyProvider() {
  useEffect(() => {
    applyTypographyToTree(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          const target = mutation.target as Text;
          if (!shouldSkipTextNode(target)) {
            const source = target.nodeValue ?? "";
            const transformed = applyRussianNbsp(source);
            if (source !== transformed) {
              target.nodeValue = transformed;
            }
          }
          continue;
        }

        mutation.addedNodes.forEach((node) => {
          applyTypographyToTree(node);
        });
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
