document.querySelector('header .min-btn').addEventListener("click", event => {
    ipcRenderer.sendSync('title-bar', {
        action: 'minimize'
    })
});

document.querySelector('header .close-btn').addEventListener("click", event => {
    ipcRenderer.sendSync('title-bar', {
        action: 'close'
    })
});