document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const downloadBtn = document.getElementById('downloadBtn');
  const installModal = document.getElementById('installModal');
  const completeModal = document.getElementById('completeModal');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const installBtn = document.getElementById('installBtn');
  const openFileBtn = document.getElementById('openFileBtn');
  const closeModal = document.querySelector('.close-modal');
  const cancelBtn = document.querySelector('.cancel-btn');

  // Variables
  let downloadProgress = 0;
  let downloadInterval;
  let isDownloading = false;
  let downloadStarted = false;

  // Configuration - REPLACE WITH YOUR ACTUAL APK URL
  const config = {
    apkUrl: 'https://download1320.mediafire.com/ty2trf4qntggwJMuO6F1qCt1qPW9HDcy2JZ9ZsGmDmo3ZRWYVhg9gHTuxHvHf55PRXljm3XVKl97_M69IjxPkW6ZAXiBvIYptQgfWpJCTFs5cm0Cp50RL6J-gpHaILP0YYFI_ascLV4WYxa56hep-6e2DAA5GR_tdC6K6OR8pqarvOc/m0rqjlwcu5ebc11/Codpids-App.apk',
    apkFilename: 'Codpids-app.apk',
    apkSize: '34 MB',
    appVersion: '1.2.2'
  };

  // Event Listeners
  downloadBtn.addEventListener('click', startDownloadProcess);
  closeModal.addEventListener('click', closeModals);
  cancelBtn.addEventListener('click', cancelDownload);
  openFileBtn.addEventListener('click', openDownloadedFile);
  installBtn.addEventListener('click', completeDownload);

  // Main Download Process
  function startDownloadProcess() {
    if (isDownloading) return;
    
    resetDownload();
    showInstallModal();
    simulateDownloadProgress();
  }

  function resetDownload() {
    downloadProgress = 0;
    isDownloading = true;
    downloadStarted = false;
    updateProgress();
    installBtn.disabled = true;
  }

  function showInstallModal() {
    installModal.classList.add('active');
  }

  function simulateDownloadProgress() {
    downloadInterval = setInterval(() => {
      // Increment progress randomly between 5-15%
      downloadProgress += 5 + Math.random() * 10;
      
      if (downloadProgress >= 100) {
        downloadProgress = 100;
        handleDownloadCompletion();
      }
      
      updateProgress();
      
      // Start actual download at 30% progress
      if (downloadProgress >= 30 && !downloadStarted) {
        downloadStarted = true;
        startActualDownload();
      }
    }, 300);
  }

  function updateProgress() {
    progressBar.style.setProperty('--progress-width', `${downloadProgress}%`);
    progressText.textContent = `${Math.floor(downloadProgress)}%`;
  }

  function startActualDownload() {
    // Create invisible download link
    const link = document.createElement('a');
    link.href = config.apkUrl;
    link.download = config.apkFilename;
    link.style.display = 'none';
    
    // Add to DOM and trigger click
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
    
    // Fallback method
    setTimeout(() => {
      if (downloadProgress < 100) {
        window.open(config.apkUrl, '_blank');
      }
    }, 2000);
  }

  function handleDownloadCompletion() {
    clearInterval(downloadInterval);
    installBtn.disabled = false;
  }

  function completeDownload() {
    if (downloadProgress < 100) return;
    
    installModal.classList.remove('active');
    completeModal.classList.add('active');
    isDownloading = false;
  }

  function cancelDownload() {
    clearInterval(downloadInterval);
    isDownloading = false;
    closeModals();
    
    // In a real app, you might want to abort the download
    // This would require XMLHttpRequest or fetch with AbortController
  }

  function openDownloadedFile() {
    // This is just for demonstration - actual implementation would vary
    alert(`Check your downloads folder for ${config.apkFilename}`);
    closeModals();
  }

  function closeModals() {
    installModal.classList.remove('active');
    completeModal.classList.remove('active');
  }

  // Back Button Functionality
  document.querySelector('.back-button').addEventListener('click', function() {
    if (isDownloading) {
      const confirmCancel = confirm('Download in progress. Are you sure you want to cancel?');
      if (confirmCancel) {
        cancelDownload();
        window.history.back();
      }
    } else {
      window.history.back();
    }
  });

  // Device Detection
  function detectDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    document.body.classList.add(isMobile ? 'mobile' : 'desktop');
    
    // Additional mobile-specific adjustments
    if (isMobile) {
      // You can add mobile-specific JS here if needed
    }
  }

  // Initialize
  detectDevice();
});