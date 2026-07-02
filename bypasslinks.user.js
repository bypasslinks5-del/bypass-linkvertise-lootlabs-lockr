// ==UserScript==
// @name         BypassLinks — Auto Link Bypasser (Linkvertise, LootLabs, Work.ink & more)
// @namespace    https://bypass-links.com
// @version      1.0.0
// @description  Skip Linkvertise, LootLabs, Work.ink, Lockr, Rekonise, Boost.ink & 40+ ad-link and key-system gates. One click sends the link to BypassLinks and returns the real destination — free, no surveys, no timers.
// @author       BypassLinks
// @homepageURL  https://bypass-links.com
// @supportURL   https://bypass-links.com/contact
// @downloadURL  https://github.com/bypasslinks5-del/bypass-linkvertise-lootlabs-lockr/raw/main/bypasslinks.user.js
// @updateURL    https://github.com/bypasslinks5-del/bypass-linkvertise-lootlabs-lockr/raw/main/bypasslinks.user.js
// @icon         https://bypass-links.com/favicon.svg
// @license      MIT
// @match        *://*.linkvertise.com/*
// @match        *://*.linkvertise.net/*
// @match        *://*.link-to.net/*
// @match        *://*.work.ink/*
// @match        *://*.lootlabs.gg/*
// @match        *://*.loot-link.com/*
// @match        *://*.lootdest.org/*
// @match        *://*.lootdest.com/*
// @match        *://*.lootdest.info/*
// @match        *://*.lootlinks.co/*
// @match        *://*.lockr.so/*
// @match        *://*.rekonise.com/*
// @match        *://*.boost.ink/*
// @match        *://*.sub2unlock.com/*
// @match        *://*.sub2unlock.net/*
// @match        *://*.mboost.me/*
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

/*
 * BypassLinks userscript
 * ----------------------
 * When you land on a supported ad-link / key-system page, this script offers a
 * one-click "Bypass with BypassLinks" action. It hands the current URL to
 * https://bypass-links.com which resolves it server-side and returns the real
 * destination — no surveys, no waiting, no extension permissions.
 *
 * Website & full guides:  https://bypass-links.com
 * Source & issues:        https://github.com/bypasslinks5-del/bypass-linkvertise-lootlabs-lockr
 * License: MIT
 */

(function () {
  'use strict';

  const SITE = 'https://bypass-links.com';
  const BRAND = '#10B981';

  // ---- config (persisted) --------------------------------------------------
  // Default = show a button (non-intrusive). Users can flip to auto-redirect.
  const getAuto = () => {
    try { return GM_getValue('autoRedirect', false); } catch (e) { return false; }
  };
  const setAuto = (v) => { try { GM_setValue('autoRedirect', v); } catch (e) {} };

  const bypassUrl = () =>
    SITE + '/?url=' + encodeURIComponent(location.href) + '&ref=userscript';

  function goBypass() {
    window.open(bypassUrl(), '_blank', 'noopener');
  }

  // ---- menu commands (Tampermonkey / Violentmonkey) ------------------------
  try {
    GM_registerMenuCommand('⚡ Bypass this page with BypassLinks', goBypass);
    GM_registerMenuCommand(
      (getAuto() ? '✅' : '⬜') + ' Auto-redirect on supported pages',
      function () { setAuto(!getAuto()); location.reload(); }
    );
    GM_registerMenuCommand('🌐 Open BypassLinks website', function () {
      window.open(SITE, '_blank', 'noopener');
    });
  } catch (e) { /* GM menu not available — button still works */ }

  // ---- auto-redirect mode --------------------------------------------------
  if (getAuto()) {
    location.replace(bypassUrl());
    return;
  }

  // ---- floating button -----------------------------------------------------
  function injectButton() {
    if (document.getElementById('bypasslinks-fab')) return;

    const wrap = document.createElement('div');
    wrap.id = 'bypasslinks-fab';
    wrap.style.cssText = [
      'position:fixed', 'right:20px', 'bottom:20px', 'z-index:2147483647',
      'font-family:Inter,Segoe UI,Arial,sans-serif'
    ].join(';');

    const btn = document.createElement('a');
    btn.href = bypassUrl();
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.textContent = '⚡ Bypass with BypassLinks';
    btn.title = 'Skip this ad link and get the real destination';
    btn.style.cssText = [
      'display:inline-flex', 'align-items:center', 'gap:8px',
      'background:linear-gradient(120deg,#10B981,#2DD4BF)', 'color:#04120c',
      'font-weight:700', 'font-size:14px', 'text-decoration:none',
      'padding:12px 18px', 'border-radius:12px',
      'box-shadow:0 10px 30px rgba(16,185,129,0.35)', 'cursor:pointer',
      'transition:transform .15s ease, box-shadow .15s ease'
    ].join(';');
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 14px 36px rgba(16,185,129,0.45)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'none';
      btn.style.boxShadow = '0 10px 30px rgba(16,185,129,0.35)';
    });

    const close = document.createElement('span');
    close.textContent = '×';
    close.title = 'Hide';
    close.style.cssText = [
      'margin-left:6px', 'display:inline-flex', 'align-items:center',
      'justify-content:center', 'width:22px', 'height:22px', 'border-radius:50%',
      'background:rgba(4,18,12,0.15)', 'color:#04120c', 'font-weight:700',
      'cursor:pointer', 'vertical-align:middle'
    ].join(';');
    close.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      wrap.remove();
    });
    btn.appendChild(close);

    wrap.appendChild(btn);
    (document.body || document.documentElement).appendChild(wrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }
})();
