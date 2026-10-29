import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { hiPhrases, hiPatterns } from './hiPhrases';

/**
 * Phrase-level translator for the long-form dashboard copy.
 *
 * While Hindi is active it rewrites text nodes (and placeholder / title /
 * aria-label attributes) whose full text matches a known English phrase.
 * It only ever changes `nodeValue` / attribute values — never adds or removes
 * nodes — so React's reconciliation keeps working, and every original string
 * is remembered so switching back to English restores it exactly.
 */
const ATTRS = ['placeholder', 'title', 'aria-label'];
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE']);

const normalize = (text) => text.replace(/\s+/g, ' ').trim();

const translatePhrase = (text) => {
  const key = normalize(text);
  if (!key || !/[A-Za-z]/.test(key)) return null;
  const direct = hiPhrases[key];
  if (direct) return direct;
  for (const [pattern, replace] of hiPatterns) {
    if (pattern.test(key)) return key.replace(pattern, replace);
  }
  return null;
};

// node -> { original, translated }
const textMemory = new WeakMap();
// element -> { [attr]: { original, translated } }
const attrMemory = new WeakMap();

const isSkippable = (node) => {
  for (let el = node.parentElement; el; el = el.parentElement) {
    if (SKIP_TAGS.has(el.tagName) || el.isContentEditable || el.dataset?.noTranslate !== undefined) return true;
  }
  return false;
};

const translateText = (node) => {
  const value = node.nodeValue;
  const memo = textMemory.get(node);
  if (memo && value === memo.translated) return; // our own write
  const translated = translatePhrase(value);
  if (!translated || isSkippable(node)) return;
  const lead = value.match(/^\s*/)[0];
  const trail = value.match(/\s*$/)[0];
  const next = `${lead}${translated}${trail}`;
  textMemory.set(node, { original: value, translated: next });
  node.nodeValue = next;
};

const translateAttrs = (el) => {
  for (const attr of ATTRS) {
    const value = el.getAttribute(attr);
    if (!value) continue;
    const memo = attrMemory.get(el) || {};
    if (memo[attr] && memo[attr].translated === value) continue;
    const translated = translatePhrase(value);
    if (!translated) continue;
    memo[attr] = { original: value, translated };
    attrMemory.set(el, memo);
    el.setAttribute(attr, translated);
  }
};

const walk = (root, onText, onElement) => {
  if (root.nodeType === Node.TEXT_NODE) {
    onText(root);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE || SKIP_TAGS.has(root.tagName)) return;
  onElement(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.nodeType === Node.TEXT_NODE) onText(n);
    else onElement(n);
  }
};

const restore = (root) => {
  walk(
    root,
    (node) => {
      const memo = textMemory.get(node);
      if (memo && node.nodeValue === memo.translated) node.nodeValue = memo.original;
      textMemory.delete(node);
    },
    (el) => {
      const memo = attrMemory.get(el);
      if (!memo) return;
      for (const [attr, { original, translated }] of Object.entries(memo)) {
        if (el.getAttribute(attr) === translated) el.setAttribute(attr, original);
      }
      attrMemory.delete(el);
    }
  );
};

export default function DomTranslator() {
  const { lang } = useLanguage();

  useEffect(() => {
    if (lang !== 'hi') return undefined;

    const root = document.body;
    walk(root, translateText, translateAttrs);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'characterData') translateText(m.target);
        else if (m.type === 'attributes') translateAttrs(m.target);
        else m.addedNodes.forEach((n) => walk(n, translateText, translateAttrs));
      }
    });
    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });

    return () => {
      observer.disconnect();
      restore(root);
    };
  }, [lang]);

  return null;
}
