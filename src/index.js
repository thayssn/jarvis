init();
animate();

const { ipcRenderer } = require('electron');

// ipcRenderer.on('memory', (event, data) => {
//     console.log(event)
//     initMemory(data * 2)
//     document.querySelector('#memory').textContent = data;
// })

ipcRenderer.on('cpu', (event, data) => {
    initCpu(data * 2)
    document.querySelector('#cpu').textContent = data;
})