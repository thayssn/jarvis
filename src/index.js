
const { ipcRenderer } = require('electron');

ipcRenderer.on('system_info', (event, {cpu, memory, user}) => {
    document.querySelector('#memory').textContent = cpu;
    document.querySelector('#cpu').textContent = memory;
})

ipcRenderer.on('user_info', (event, {user, drive}) => {
    const nameSpan = document.querySelector('#user .name');
    animateName(nameSpan, user);

    const driveBar = document.querySelector('.drive .bar');
    console.log(drive)
    driveBar.querySelector('.used').style.width = `${drive.usedPercentage}%`;
    driveBar.querySelector('.used .value').textContent = `${drive.usedPercentage}%`;
    driveBar.querySelector('.used .tooltip').textContent = `${drive.usedGb}GB / ${drive.totalGb}GB`;
    driveBar.querySelector('.free').style.width = `${drive.freePercentage}%`;
    driveBar.querySelector('.free .value').textContent = `${drive.freePercentage}%`;
    driveBar.querySelector('.free .tooltip').textContent = `${drive.freeGb}GB / ${drive.totalGb}GB`;
})

function animateName(element, name){
    
    const randomNameInterval = setInterval(() => {
        element.textContent = randomString(name.trim())
    }, 100)

    setTimeout(() => {
        element.textContent = name;
        clearInterval(randomNameInterval);   
    }, 2000)
}

function randomString(string) {
    charSet = string;
    var randomString = '';
    for (var i = 0; i < string.length; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}