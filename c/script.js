
    const cvalue = decodeURIComponent(window.location.search.substring(1)); //n4-studios.com/c/?hello

    const ctxt = {
        eastswinstlogv1 : '"\\\\eastfs\\eastit\\Software\\Programs\\Dassault\\Solidworks\\INSTALL 110226 v1.0.0.bat" -LogDir "%AppData%\\Roaming\\SOLIDWORKS\\Installation Logs\\2026 SPO\\" -PSScript "\\\\eastfs\\eastit\\Software\\Programs\\Dassault\\Solidworks\\LogInstall20261102 v1.0.0.ps1" -Installer "\\\\eastfs\\eastit\\Software\\Programs\\Dassault\\Solidworks\\Image 2026 11 02\\startswininstall.exe" -debugMode'
    }

    // EDIT THIS: Text that visitors should copy.
    const TEXT_TO_COPY = ctxt[cvalue];

    const status = document.getElementById("status");
    document.getElementById("copyText").textContent = TEXT_TO_COPY;

    async function copyText() {
      try {
        if (!navigator.clipboard || !window.isSecureContext) {
          throw new Error("Clipboard API unavailable");
        }

        await navigator.clipboard.writeText(TEXT_TO_COPY);
        status.textContent = "Copied to clipboard!";
        return true;
      } catch (error) {
        status.textContent = "Automatic copying was blocked. Select the button to copy.";
        return false;
      }
    }

    // Attempt to copy as soon as the page loads.
    window.addEventListener("load", copyText);

    // User-initiated fallback.
    document.getElementById("copyButton").addEventListener("click", copyText);
