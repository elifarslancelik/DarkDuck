// Sayfa yüklendiğinde dark mode durumunu kontrol et
initializeDarkMode();
observeSystemTheme();

async function initializeDarkMode() {
  const { darkModeEnabled, manualOverride } = await browser.storage.local.get(["darkModeEnabled", "manualOverride"]);

  if (manualOverride) {
    // Manuel override varsa, kaydedilen durumu uygula
    darkModeEnabled ? applyDarkMode() : removeDarkMode();
  } else {
    // Override yoksa sistem temasına göre karar ver
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (systemPrefersDark) {
      applyDarkMode();
    } else {
      removeDarkMode();
    }

    // Sistemi depolayıp background'a bildir
    await browser.storage.local.set({ darkModeEnabled: systemPrefersDark });

    await browser.runtime.sendMessage({
      action: "systemThemeChanged",
      isEnabled: systemPrefersDark
    });
  }
}

// Sistem temasındaki değişiklikleri dinle
function observeSystemTheme() {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async (e) => {
    const isDark = e.matches;
    const { manualOverride } = await browser.storage.local.get("manualOverride");

    if (!manualOverride) {
      await browser.storage.local.set({ darkModeEnabled: isDark });

      await browser.runtime.sendMessage({
        action: "systemThemeChanged",
        isEnabled: isDark
      });
    }
  });
}

// Mesaj dinleyici (background'dan gelen güncellemeler için)
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "updateDarkMode") {
    message.isEnabled ? applyDarkMode() : removeDarkMode();
  }
});

function applyDarkMode() {
  document.documentElement.classList.add("darkduck-mode");

  if (!document.getElementById("darkduck-styles")) {
    const style = document.createElement("style");
    style.id = "darkduck-styles";
    style.textContent = `
      :root {
        --bg-color: #ffffff;
        --text-color: #000000;
        --element-bg: #f5f5f5;
        --border-color: #ccc;
        --link-color: #007bff;
        --input-bg: #ffffff;
      }

      :root.darkduck-mode {
        --bg-color: #121212;
        --text-color: whitesmoke;
        --element-bg: #1e1e1e;
        --border-color: #333;
        --link-color: #90caf9;
        --input-bg: #2d2d2d;
      }

      /* Sadece body'ye koyu arka plan uygula */
      .darkduck-mode body {
        background-color: var(--bg-color) !important;
        color: var(--text-color) !important;
      }

      /* Sadece metin elementlerine koyu renk uygula */
      .darkduck-mode p,
      .darkduck-mode h1,
      .darkduck-mode h2,
      .darkduck-mode h3,
      .darkduck-mode h4,
      .darkduck-mode h5,
      .darkduck-mode h6,
      .darkduck-mode li,
      .darkduck-mode ul,
      .darkduck-mode ol,
      .darkduck-mode a,
      .darkduck-mode label,
      .darkduck-mode strong,
      .darkduck-mode em,
      .darkduck-mode small {
        color: var(--text-color) !important;
        background: transparent !important;
      }

      /* Form elementleri */
      .darkduck-mode input,
      .darkduck-mode textarea,
      .darkduck-mode select,
      .darkduck-mode button {
        background-color: var(--input-bg) !important;
        color: var(--text-color) !important;
        border-color: var(--border-color) !important;
      }

      /* Linkler */
      .darkduck-mode a {
        color: var(--link-color) !important;
      }

      /* Görseller ve kapsayıcıları asla etkilenmesin */
      .darkduck-mode img,
      .darkduck-mode video,
      .darkduck-mode svg,
      .darkduck-mode picture,
      .darkduck-mode iframe,
      .darkduck-mode canvas,
      .darkduck-mode [class*=\"image\"],
      .darkduck-mode [class*=\"thumb\"],
      .darkduck-mode [class*=\"gallery\"],
      .darkduck-mode [class*=\"photo\"],
      .darkduck-mode [class*=\"rg_bx\"],
      .darkduck-mode [class*=\"rg_i\"],
      .darkduck-mode [style*=\"background-image\"],
      .darkduck-mode [style*=\"background:url\"],
      .darkduck-mode [style*=\"background: url\"] {
        filter: none !important;
        background: none !important;
        opacity: 1 !important;
        mix-blend-mode: normal !important;
        color: inherit !important;
        background-color: transparent !important;
      }

      /* Görsel içeren div'ler de hariç */
      .darkduck-mode div:has(img),
      .darkduck-mode div:has(video),
      .darkduck-mode div:has(svg),
      .darkduck-mode div:has(picture) {
        background: none !important;
        background-color: transparent !important;
      }

      /* Tablolar ve kartlar */
      .darkduck-mode table,
      .darkduck-mode th,
      .darkduck-mode td,
      .darkduck-mode .card,
      .darkduck-mode .panel,
      .darkduck-mode .modal {
        background-color: var(--element-bg) !important;
        border-color: var(--border-color) !important;
        color: var(--text-color) !important;
      }

      /* Scrollbar */
      .darkduck-mode ::-webkit-scrollbar {
        width: 12px !important;
      }

      .darkduck-mode ::-webkit-scrollbar-track {
        background: var(--element-bg) !important;
      }

      .darkduck-mode ::-webkit-scrollbar-thumb {
        background: var(--border-color) !important;
        border-radius: 6px !important;
      }

      /* Sadece dark mode aktifken uygula! */
      .darkduck-mode .flyout-content,
      .darkduck-mode [class*="dropdown"],
      .darkduck-mode [class*="suggest"],
      .darkduck-mode [class*="auto"],
      .darkduck-mode [class*="menu"],
      .darkduck-mode [class*="option"],
      .darkduck-mode [class*="result"],
      .darkduck-mode [class*="listbox"],
      .darkduck-mode [class*="search"],
      .darkduck-mode [class*="select"],
      .darkduck-mode [role="listbox"],
      .darkduck-mode [role="option"],
      .darkduck-mode ul[role="listbox"],
      .darkduck-mode li[role="option"],
      .darkduck-mode .dropdown-menu,
      .darkduck-mode .dropdown-content,
      .darkduck-mode .autocomplete-suggestions,
      .darkduck-mode .autocomplete-results,
      .darkduck-mode .autocomplete-dropdown,
      .darkduck-mode .autocomplete-list,
      .darkduck-mode .autocomplete-item,
      .darkduck-mode .menu,
      .darkduck-mode .menu-item,
      .darkduck-mode .menu-list,
      .darkduck-mode .suggestion-list,
      .darkduck-mode .suggestion-item,
      .darkduck-mode .search-autocomplete,
      .darkduck-mode .search-suggestion-item,
      .darkduck-mode .rc-virtual-list,
      .darkduck-mode .ant-select-dropdown,
      .darkduck-mode .ant-select-item,
      .darkduck-mode .ant-select-item-option,
      .darkduck-mode .MuiAutocomplete-paper,
      .darkduck-mode .ui-autocomplete,
      .darkduck-mode .tt-menu,
      .darkduck-mode .typeahead,
      .darkduck-mode .awesomplete,
      .darkduck-mode .react-autosuggest__suggestions-container,
      .darkduck-mode .select2-results__options,
      .darkduck-mode .select2-dropdown {
        background-color: var(--element-bg) !important;
        color: var(--text-color) !important;
        border-color: var(--border-color) !important;
      }

      .darkduck-mode .flyout-content *,
      .darkduck-mode [class*="dropdown"] *,
      .darkduck-mode [class*="suggest"] *,
      .darkduck-mode [class*="auto"] *,
      .darkduck-mode [class*="menu"] *,
      .darkduck-mode [class*="option"] *,
      .darkduck-mode [class*="result"] *,
      .darkduck-mode [class*="listbox"] *,
      .darkduck-mode [class*="search"] *,
      .darkduck-mode [class*="select"] *,
      .darkduck-mode [role="listbox"] *,
      .darkduck-mode [role="option"] *,
      .darkduck-mode ul[role="listbox"] *,
      .darkduck-mode li[role="option"] *,
      .darkduck-mode .dropdown-menu *,
      .darkduck-mode .dropdown-content *,
      .darkduck-mode .autocomplete-suggestions *,
      .darkduck-mode .autocomplete-results *,
      .darkduck-mode .autocomplete-dropdown *,
      .darkduck-mode .autocomplete-list *,
      .darkduck-mode .autocomplete-item *,
      .darkduck-mode .menu *,
      .darkduck-mode .menu-item *,
      .darkduck-mode .menu-list *,
      .darkduck-mode .suggestion-list *,
      .darkduck-mode .suggestion-item *,
      .darkduck-mode .search-autocomplete *,
      .darkduck-mode .search-suggestion-item *,
      .darkduck-mode .rc-virtual-list *,
      .darkduck-mode .ant-select-dropdown *,
      .darkduck-mode .ant-select-item *,
      .darkduck-mode .ant-select-item-option *,
      .darkduck-mode .MuiAutocomplete-paper *,
      .darkduck-mode .ui-autocomplete *,
      .darkduck-mode .tt-menu *,
      .darkduck-mode .typeahead *,
      .darkduck-mode .awesomplete *,
      .darkduck-mode .react-autosuggest__suggestions-container *,
      .darkduck-mode .select2-results__options *,
      .darkduck-mode .select2-dropdown * {
        background-color: var(--element-bg) !important;
        color: var(--text-color) !important;
      }

      .darkduck-mode [class*="dropdown"],
      .darkduck-mode [class*="suggest"],
      .darkduck-mode [class*="auto"],
      .darkduck-mode [class*="menu"] {
        z-index: 99999 !important;
        box-shadow: none !important;
        opacity: 1 !important;
        filter: none !important;
      }

      .darkduck-mode .search-suggestion-item,
      .darkduck-mode .search-suggestion-item * {
        background: var(--element-bg) !important;
        color: var(--text-color) !important;
        border-color: var(--border-color) !important;
      }

      .darkduck-mode .banner,
      .darkduck-mode .top-banner,
      .darkduck-mode .header-banner,
      .darkduck-mode .notification,
      .darkduck-mode .alert,
      .darkduck-mode .announcement,
      .darkduck-mode .promo,
      .darkduck-mode .ad-banner,
      .darkduck-mode .site-banner,
      .darkduck-mode .cookie-banner,
      .darkduck-mode .info-bar,
      .darkduck-mode .message-bar,
      .darkduck-mode .notice,
      .darkduck-mode .toast,
      .darkduck-mode .snackbar {
        background: var(--element-bg) !important;
        color: var(--text-color) !important;
        border-color: var(--border-color) !important;
      }

      .darkduck-mode *,
      .darkduck-mode *::before,
      .darkduck-mode *::after {
        border-color: var(--border-color) !important;
        box-shadow: none !important;
      }

      .darkduck-mode i,
      .darkduck-mode [class*="icon"],
      .darkduck-mode svg {
        color: var(--text-color) !important;
      }

      /* Sadece dark mode aktifken dropdown/öneri kutularını zorla koyu yap */
      .darkduck-mode [role="listbox"],
      .darkduck-mode [role="option"],
      .darkduck-mode ul[role="listbox"],
      .darkduck-mode li[role="option"],
      .darkduck-mode [class*="dropdown"],
      .darkduck-mode [class*="suggest"],
      .darkduck-mode [class*="auto"],
      .darkduck-mode [class*="menu"],
      .darkduck-mode [class*="option"],
      .darkduck-mode [class*="result"],
      .darkduck-mode [class*="listbox"],
      .darkduck-mode [class*="search"],
      .darkduck-mode [class*="select"],
      .darkduck-mode .dropdown-menu,
      .darkduck-mode .dropdown-content,
      .darkduck-mode .autocomplete-suggestions,
      .darkduck-mode .autocomplete-results,
      .darkduck-mode .autocomplete-dropdown,
      .darkduck-mode .autocomplete-list,
      .darkduck-mode .autocomplete-item,
      .darkduck-mode .menu,
      .darkduck-mode .menu-item,
      .darkduck-mode .menu-list,
      .darkduck-mode .suggestion-list,
      .darkduck-mode .suggestion-item,
      .darkduck-mode .search-autocomplete,
      .darkduck-mode .search-suggestion-item,
      .darkduck-mode .rc-virtual-list,
      .darkduck-mode .ant-select-dropdown,
      .darkduck-mode .ant-select-item,
      .darkduck-mode .ant-select-item-option,
      .darkduck-mode .MuiAutocomplete-paper,
      .darkduck-mode .ui-autocomplete,
      .darkduck-mode .tt-menu,
      .darkduck-mode .typeahead,
      .darkduck-mode .awesomplete,
      .darkduck-mode .react-autosuggest__suggestions-container,
      .darkduck-mode .select2-results__options,
      .darkduck-mode .select2-dropdown {
        background-color: var(--element-bg) !important;
        color: var(--text-color) !important;
        border-color: var(--border-color) !important;
      }

      /* İçerideki tüm yazılar için de zorla */
      .darkduck-mode [role="listbox"] *,
      .darkduck-mode [role="option"] *,
      .darkduck-mode ul[role="listbox"] *,
      .darkduck-mode li[role="option"] *,
      .darkduck-mode [class*="dropdown"] *,
      .darkduck-mode [class*="suggest"] *,
      .darkduck-mode [class*="auto"] *,
      .darkduck-mode [class*="menu"] *,
      .darkduck-mode [class*="option"] *,
      .darkduck-mode [class*="result"] *,
      .darkduck-mode [class*="listbox"] *,
      .darkduck-mode [class*="search"] *,
      .darkduck-mode [class*="select"] *,
      .darkduck-mode .dropdown-menu *,
      .darkduck-mode .dropdown-content *,
      .darkduck-mode .autocomplete-suggestions *,
      .darkduck-mode .autocomplete-results *,
      .darkduck-mode .autocomplete-dropdown *,
      .darkduck-mode .autocomplete-list *,
      .darkduck-mode .autocomplete-item *,
      .darkduck-mode .menu *,
      .darkduck-mode .menu-item *,
      .darkduck-mode .menu-list *,
      .darkduck-mode .suggestion-list *,
      .darkduck-mode .suggestion-item *,
      .darkduck-mode .search-autocomplete *,
      .darkduck-mode .search-suggestion-item *,
      .darkduck-mode .rc-virtual-list *,
      .darkduck-mode .ant-select-dropdown *,
      .darkduck-mode .ant-select-item *,
      .darkduck-mode .ant-select-item-option *,
      .darkduck-mode .MuiAutocomplete-paper *,
      .darkduck-mode .ui-autocomplete *,
      .darkduck-mode .tt-menu *,
      .darkduck-mode .typeahead *,
      .darkduck-mode .awesomplete *,
      .darkduck-mode .react-autosuggest__suggestions-container *,
      .darkduck-mode .select2-results__options *,
      .darkduck-mode .select2-dropdown * {
        background-color: var(--element-bg) !important;
        color: var(--text-color) !important;
      }

      /* Hover durumları için özel stil */
      .darkduck-mode [role="option"]:hover,
      .darkduck-mode li[role="option"]:hover,
      .darkduck-mode [class*="dropdown"] *:hover,
      .darkduck-mode [class*="suggest"] *:hover,
      .darkduck-mode [class*="auto"] *:hover,
      .darkduck-mode [class*="menu"] *:hover,
      .darkduck-mode [class*="option"]:hover,
      .darkduck-mode [class*="result"]:hover,
      .darkduck-mode [class*="listbox"] *:hover,
      .darkduck-mode [class*="search"] *:hover,
      .darkduck-mode [class*="select"] *:hover,
      .darkduck-mode .dropdown-menu *:hover,
      .darkduck-mode .dropdown-content *:hover,
      .darkduck-mode .autocomplete-suggestions *:hover,
      .darkduck-mode .autocomplete-results *:hover,
      .darkduck-mode .autocomplete-dropdown *:hover,
      .darkduck-mode .autocomplete-list *:hover,
      .darkduck-mode .autocomplete-item:hover,
      .darkduck-mode .menu *:hover,
      .darkduck-mode .menu-item:hover,
      .darkduck-mode .menu-list *:hover,
      .darkduck-mode .suggestion-list *:hover,
      .darkduck-mode .suggestion-item:hover,
      .darkduck-mode .search-autocomplete *:hover,
      .darkduck-mode .search-suggestion-item:hover,
      .darkduck-mode .rc-virtual-list *:hover,
      .darkduck-mode .ant-select-dropdown *:hover,
      .darkduck-mode .ant-select-item:hover,
      .darkduck-mode .ant-select-item-option:hover,
      .darkduck-mode .MuiAutocomplete-paper *:hover,
      .darkduck-mode .ui-autocomplete *:hover,
      .darkduck-mode .tt-menu *:hover,
      .darkduck-mode .typeahead *:hover,
      .darkduck-mode .awesomplete *:hover,
      .darkduck-mode .react-autosuggest__suggestions-container *:hover,
      .darkduck-mode .select2-results__options *:hover,
      .darkduck-mode .select2-dropdown *:hover,
      .darkduck-mode .suggestions *:hover,
      .darkduck-mode [class*="suggestion"] *:hover,
      .darkduck-mode [class*="autocomplete"] *:hover,
      .darkduck-mode [class*="search-suggest"] *:hover {
        background-color: #2d2d2d !important;
        color: var(--text-color) !important;
      }

      /* Hover durumunda metin rengini koru */
      .darkduck-mode [role="option"]:hover *,
      .darkduck-mode li[role="option"]:hover *,
      .darkduck-mode [class*="dropdown"] *:hover *,
      .darkduck-mode [class*="suggest"] *:hover *,
      .darkduck-mode [class*="auto"] *:hover *,
      .darkduck-mode [class*="menu"] *:hover *,
      .darkduck-mode [class*="option"]:hover *,
      .darkduck-mode [class*="result"]:hover *,
      .darkduck-mode [class*="listbox"] *:hover *,
      .darkduck-mode [class*="search"] *:hover *,
      .darkduck-mode [class*="select"] *:hover *,
      .darkduck-mode .dropdown-menu *:hover *,
      .darkduck-mode .dropdown-content *:hover *,
      .darkduck-mode .autocomplete-suggestions *:hover *,
      .darkduck-mode .autocomplete-results *:hover *,
      .darkduck-mode .autocomplete-dropdown *:hover *,
      .darkduck-mode .autocomplete-list *:hover *,
      .darkduck-mode .autocomplete-item:hover *,
      .darkduck-mode .menu *:hover *,
      .darkduck-mode .menu-item:hover *,
      .darkduck-mode .menu-list *:hover *,
      .darkduck-mode .suggestion-list *:hover *,
      .darkduck-mode .suggestion-item:hover *,
      .darkduck-mode .search-autocomplete *:hover *,
      .darkduck-mode .search-suggestion-item:hover *,
      .darkduck-mode .rc-virtual-list *:hover *,
      .darkduck-mode .ant-select-dropdown *:hover *,
      .darkduck-mode .ant-select-item:hover *,
      .darkduck-mode .ant-select-item-option:hover *,
      .darkduck-mode .MuiAutocomplete-paper *:hover *,
      .darkduck-mode .ui-autocomplete *:hover *,
      .darkduck-mode .tt-menu *:hover *,
      .darkduck-mode .typeahead *:hover *,
      .darkduck-mode .awesomplete *:hover *,
      .darkduck-mode .react-autosuggest__suggestions-container *:hover *,
      .darkduck-mode .select2-results__options *:hover *,
      .darkduck-mode .select2-dropdown *:hover *,
      .darkduck-mode .suggestions *:hover *,
      .darkduck-mode [class*="suggestion"] *:hover *,
      .darkduck-mode [class*="autocomplete"] *:hover *,
      .darkduck-mode [class*="search-suggest"] *:hover * {
        color: var(--text-color) !important;
        background-color: #2d2d2d !important;
      }

      /* Header ve Banner'lar için özel stiller */
      .darkduck-mode header,
      .darkduck-mode [class*="header"],
      .darkduck-mode [class*="banner"],
      .darkduck-mode [class*="nav"],
      .darkduck-mode [class*="navbar"],
      .darkduck-mode [class*="topbar"],
      .darkduck-mode [class*="menubar"],
      .darkduck-mode [class*="toolbar"],
      .darkduck-mode [class*="navigation"],
      .darkduck-mode [role="banner"],
      .darkduck-mode [role="navigation"] {
        background-color: var(--element-bg) !important;
        border-color: var(--border-color) !important;
      }

      /* Header ve Banner içindeki metinler için stil */
      .darkduck-mode header *,
      .darkduck-mode [class*="header"] *,
      .darkduck-mode [class*="banner"] *,
      .darkduck-mode [class*="nav"] *,
      .darkduck-mode [class*="navbar"] *,
      .darkduck-mode [class*="topbar"] *,
      .darkduck-mode [class*="menubar"] *,
      .darkduck-mode [class*="toolbar"] *,
      .darkduck-mode [class*="navigation"] *,
      .darkduck-mode [role="banner"] *,
      .darkduck-mode [role="navigation"] * {
        color: var(--text-color) !important;
      }

      /* Butonlar ve spanlar için özel kurallar */
      .darkduck-mode button,
      .darkduck-mode button *,
      .darkduck-mode span,
      .darkduck-mode span * {
        color: inherit !important;
        background: none !important;
        filter: none !important;
        opacity: 1 !important;
        mix-blend-mode: normal !important;
      }

      /* Butonların hover durumları için özel stil */
      .darkduck-mode button:hover,
      .darkduck-mode button:hover * {
        background-color: inherit !important;
        color: inherit !important;
      }

      /* Span, icon ve logoların orijinal renklerini koru */
      .darkduck-mode span,
      .darkduck-mode i,
      .darkduck-mode [class*="icon"],
      .darkduck-mode [class*="logo"],
      .darkduck-mode img[class*="logo"],
      .darkduck-mode svg[class*="logo"],
      .darkduck-mode [class*="brand"],
      .darkduck-mode [class*="logo"] img,
      .darkduck-mode [class*="logo"] svg,
      .darkduck-mode [class*="brand"] img,
      .darkduck-mode [class*="brand"] svg {
        color: inherit !important;
        background: none !important;
        filter: none !important;
        opacity: 1 !important;
        mix-blend-mode: normal !important;
      }

      /* Header ve Banner içindeki linkler için stil */
      .darkduck-mode header a,
      .darkduck-mode [class*="header"] a,
      .darkduck-mode [class*="banner"] a,
      .darkduck-mode [class*="nav"] a,
      .darkduck-mode [class*="navbar"] a,
      .darkduck-mode [class*="topbar"] a,
      .darkduck-mode [class*="menubar"] a,
      .darkduck-mode [class*="toolbar"] a,
      .darkduck-mode [class*="navigation"] a,
      .darkduck-mode [role="banner"] a,
      .darkduck-mode [role="navigation"] a {
        color: var(--link-color) !important;
      }

      /* Dropdown ve arama sonuçları için özel stiller */
      .darkduck-mode [role="listbox"],
      .darkduck-mode [role="option"],
      .darkduck-mode [class*="dropdown"],
      .darkduck-mode [class*="suggest"],
      .darkduck-mode [class*="auto"],
      .darkduck-mode [class*="menu"],
      .darkduck-mode [class*="option"],
      .darkduck-mode [class*="result"],
      .darkduck-mode [class*="listbox"],
      .darkduck-mode [class*="search"],
      .darkduck-mode [class*="select"],
      .darkduck-mode .dropdown-menu,
      .darkduck-mode .dropdown-content,
      .darkduck-mode .autocomplete-suggestions,
      .darkduck-mode .autocomplete-results,
      .darkduck-mode .autocomplete-dropdown,
      .darkduck-mode .autocomplete-list,
      .darkduck-mode .autocomplete-item,
      .darkduck-mode .menu,
      .darkduck-mode .menu-item,
      .darkduck-mode .menu-list,
      .darkduck-mode .suggestion-list,
      .darkduck-mode .suggestion-item,
      .darkduck-mode .search-autocomplete,
      .darkduck-mode .search-suggestion-item,
      .darkduck-mode .rc-virtual-list,
      .darkduck-mode .ant-select-dropdown,
      .darkduck-mode .ant-select-item,
      .darkduck-mode .ant-select-item-option,
      .darkduck-mode .MuiAutocomplete-paper,
      .darkduck-mode .ui-autocomplete,
      .darkduck-mode .tt-menu,
      .darkduck-mode .typeahead,
      .darkduck-mode .awesomplete,
      .darkduck-mode .react-autosuggest__suggestions-container,
      .darkduck-mode .select2-results__options,
      .darkduck-mode .select2-dropdown {
        background-color: var(--element-bg) !important;
        color: var(--text-color) !important;
        border-color: var(--border-color) !important;
      }

      /* Dropdown içindeki tüm elementler için zorunlu metin rengi */
      .darkduck-mode [role="listbox"] *,
      .darkduck-mode [role="option"] *,
      .darkduck-mode [class*="dropdown"] *,
      .darkduck-mode [class*="suggest"] *,
      .darkduck-mode [class*="auto"] *,
      .darkduck-mode [class*="menu"] *,
      .darkduck-mode [class*="option"] *,
      .darkduck-mode [class*="result"] *,
      .darkduck-mode [class*="listbox"] *,
      .darkduck-mode [class*="search"] *,
      .darkduck-mode [class*="select"] *,
      .darkduck-mode .dropdown-menu *,
      .darkduck-mode .dropdown-content *,
      .darkduck-mode .autocomplete-suggestions *,
      .darkduck-mode .autocomplete-results *,
      .darkduck-mode .autocomplete-dropdown *,
      .darkduck-mode .autocomplete-list *,
      .darkduck-mode .autocomplete-item *,
      .darkduck-mode .menu *,
      .darkduck-mode .menu-item *,
      .darkduck-mode .menu-list *,
      .darkduck-mode .suggestion-list *,
      .darkduck-mode .suggestion-item *,
      .darkduck-mode .search-autocomplete *,
      .darkduck-mode .search-suggestion-item *,
      .darkduck-mode .rc-virtual-list *,
      .darkduck-mode .ant-select-dropdown *,
      .darkduck-mode .ant-select-item *,
      .darkduck-mode .ant-select-item-option *,
      .darkduck-mode .MuiAutocomplete-paper *,
      .darkduck-mode .ui-autocomplete *,
      .darkduck-mode .tt-menu *,
      .darkduck-mode .typeahead *,
      .darkduck-mode .awesomplete *,
      .darkduck-mode .react-autosuggest__suggestions-container *,
      .darkduck-mode .select2-results__options *,
      .darkduck-mode .select2-dropdown * {
        color: var(--text-color) !important;
        background-color: var(--element-bg) !important;
      }

      /* OLX ve benzeri siteler için özel düzeltme */
      .darkduck-mode .suggestions,
      .darkduck-mode .suggestions *,
      .darkduck-mode [class*="suggestion"],
      .darkduck-mode [class*="suggestion"] *,
      .darkduck-mode [class*="autocomplete"],
      .darkduck-mode [class*="autocomplete"] *,
      .darkduck-mode [class*="search-suggest"],
      .darkduck-mode [class*="search-suggest"] * {
        color: var(--text-color) !important;
        background-color: var(--element-bg) !important;
      }

      /* OLX özel düzeltmeleri */
      .darkduck-mode .css-6xmoyq,
      .darkduck-mode .css-6xmoyq * {
        color: var(--text-color) !important;
        background-color: var(--element-bg) !important;
      }

      .darkduck-mode .css-6xmoyq:hover,
      .darkduck-mode .css-6xmoyq:hover * {
        background-color: #2d2d2d !important;
        color: var(--text-color) !important;
      }

      /* OLX arama dropdown'u için özel düzeltme */
      .darkduck-mode [class*="search-suggestions"],
      .darkduck-mode [class*="search-suggestions"] *,
      .darkduck-mode [class*="search-dropdown"],
      .darkduck-mode [class*="search-dropdown"] * {
        background-color: var(--element-bg) !important;
        color: var(--text-color) !important;
      }

      .darkduck-mode [class*="search-suggestions"] [class*="item"]:hover,
      .darkduck-mode [class*="search-suggestions"] [class*="item"]:hover *,
      .darkduck-mode [class*="search-dropdown"] [class*="item"]:hover,
      .darkduck-mode [class*="search-dropdown"] [class*="item"]:hover * {
        background-color: #2d2d2d !important;
        color: var(--text-color) !important;
      }

      /* OLX için ek özel düzeltme */
      .darkduck-mode .css-1699hhh,
      .darkduck-mode .css-1699hhh * {
        background-color: var(--element-bg) !important;
        color: var(--text-color) !important;
      }

      .darkduck-mode .css-1699hhh:hover,
      .darkduck-mode .css-1699hhh:hover * {
        background-color: #2d2d2d !important;
        color: var(--text-color) !important;
      }

      /* OLX arama dropdown'u için özel düzeltme */
      .darkduck-mode [class*="search-dropdown"] [class*="item"]:hover * {
        background-color: #2d2d2d !important;
        color: var(--text-color) !important;
      }
        
    `;
    document.head.appendChild(style);
  }

  // Dropdown arka plan rengini kontrol et ve düzelt
  observeDropdowns();
}

// Dropdown'ları izle ve renkleri düzelt
function observeDropdowns() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            fixDropdownColors(node);
            // Alt elementleri de kontrol et
            node.querySelectorAll('*').forEach(fixDropdownColors);
          }
        });
      }
    });
  });

  // Tüm dropdown benzeri elementleri izle
  const dropdownSelectors = [
    '[role="listbox"]',
    '[role="option"]',
    '[class*="dropdown"]',
    '[class*="suggest"]',
    '[class*="auto"]',
    '[class*="menu"]',
    '[class*="option"]',
    '[class*="result"]',
    '[class*="listbox"]',
    '[class*="search"]',
    '[class*="select"]',
    '.dropdown-menu',
    '.dropdown-content',
    '.autocomplete-suggestions',
    '.autocomplete-results',
    '.autocomplete-dropdown',
    '.autocomplete-list',
    '.autocomplete-item',
    '.menu',
    '.menu-item',
    '.menu-list',
    '.suggestion-list',
    '.suggestion-item',
    '.search-autocomplete',
    '.search-suggestion-item',
    '.rc-virtual-list',
    '.ant-select-dropdown',
    '.ant-select-item',
    '.ant-select-item-option',
    '.MuiAutocomplete-paper',
    '.ui-autocomplete',
    '.tt-menu',
    '.typeahead',
    '.awesomplete',
    '.react-autosuggest__suggestions-container',
    '.select2-results__options',
    '.select2-dropdown'
  ];

  // Sayfadaki tüm dropdown'ları izlemeye başla
  document.querySelectorAll(dropdownSelectors.join(',')).forEach((element) => {
    observer.observe(element, {
      childList: true,
      subtree: true
    });
  });

  // Yeni eklenen dropdown'ları da izle
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Dropdown renklerini düzelt
function fixDropdownColors(element) {
  if (!element.matches || !element.matches('.darkduck-mode *')) return;

  const computedStyle = window.getComputedStyle(element);
  const bgColor = computedStyle.backgroundColor;
  const textColor = computedStyle.color;

  // Arka plan rengini kontrol et
  const rgb = bgColor.match(/\d+/g);
  if (rgb) {
    const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
    
    // Eğer arka plan açık renkse (brightness > 128)
    if (brightness > 128) {
      element.style.color = '#000000';
      // Alt elementlerin de rengini düzelt
      element.querySelectorAll('*').forEach((child) => {
        child.style.color = '#000000';
      });
    }
  }
}

function removeDarkMode() {
  document.documentElement.classList.remove("darkduck-mode");
  const style = document.getElementById("darkduck-styles");
  if (style) style.remove();
}