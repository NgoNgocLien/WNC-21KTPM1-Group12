async function fetchSyncData() {
    const response = await fetch('/app/sync');
    const data = await response.text();
    const responseElement = document.getElementById('response');
    responseElement.innerText = data;
    responseElement.className = 'sync';
  }
  
  async function fetchAsyncData() {
    const response = await fetch('/app/async');
    const data = await response.text();
    const responseElement = document.getElementById('response');
    responseElement.innerText = data;
    responseElement.className = 'async';
  }
  