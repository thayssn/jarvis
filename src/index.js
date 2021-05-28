ipcRenderer.on('system_info', (event, {cpu, memory, netstats}) => {
    document.querySelector('#memory').textContent = memory.usage;
    document.querySelector('#memory_total').textContent = `${memory.used}MB of ${memory.total}MB `;
    document.querySelector('#cpu').textContent = cpu.usage;
    document.querySelector('#cpu_model').textContent = cpu.model;
    document.querySelector('#netstats').innerHTML = `
        ${netstats.map(net => `<span>${net.interface} : ${net.inputBytes} ${net.outputBytes}</span>`).join(' ')}
    `

})

ipcRenderer.on('user_info', (event, {user, drive, os}) => {
    const nameSpan = document.querySelector('#user .name');
    animateName(nameSpan, user);

    const driveBar = document.querySelector('.drive .bar');
    driveBar.querySelector('.used').style.width = `${drive.usedPercentage}%`;
    driveBar.querySelector('.used .value').textContent = `${drive.usedPercentage}%`;
    driveBar.querySelector('.used .tooltip').textContent = `${drive.usedGb}GB of ${drive.totalGb}GB`;
    driveBar.querySelector('.free').style.width = `${drive.freePercentage}%`;
    driveBar.querySelector('.free .value').textContent = `${drive.freePercentage}%`;
    driveBar.querySelector('.free .tooltip').textContent = `${drive.freeGb}GB of ${drive.totalGb}GB`;

    console.log(drive)

    document.querySelector('#os').innerHTML = `${Object.keys(os).map(value => `<span>${value}</span> ${os[value]} `).join(' ')}`

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

function updateOnlineStatus(){
    const status = navigator.onLine ? 'online' : 'offline';
    document.querySelector('body').className = status
    document.querySelector('#online-status span').textContent = status.split('').join(' ')
}

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

updateOnlineStatus()
