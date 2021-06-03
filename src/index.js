
let hitCritical = false;
ipcRenderer.on('system_info', async (event, { cpu, memory, network, os, wifi, battery, bluetooth }) => {
    document.querySelector('#memory').textContent = memory.usage;
    document.querySelector('#memory_total').textContent = `${memory.used}MB of ${memory.total}MB `;
    document.querySelector('#cpu').textContent = cpu.usage;
    document.querySelector('#cpu_model').textContent = cpu.model;
    document.querySelector('#connections').innerHTML = `
        ${network.connections.map(connection=> `<span> ${connection.process} : ${connection.localAddress} ${connection.localPort} ${connection.protocol}</span>`).join(' ')}
    `
    document.querySelector('#latency').textContent = network.ping ? network.ping.toFixed(2) + 'ms': '∞';

    document.querySelector('#os .processes').innerHTML = `<em>processes</em> ${os.processes} `
    document.querySelector('#os .uptime').innerHTML = `<em>uptime </em>${os.uptime} min`
    
    document.querySelector('#os .wifi').innerHTML =`<em>wifi</em> ${wifi.length <= 0 ? 'offline' : wifi.map(device => `<span>${device.ssid} :: ${device.bssid} :: ${device.signalLevel}`).join(' ') }</span>`

    if(bluetooth.length){
        document.querySelector('#os .bluetooth').innerHTML = `<em>bluetoth</em> ${bluetooth.map(device => `<span class="${device.connected ? 'connected' : 'disconnected'}">${device.name} :: ${device.macHost}</span>`).join(' ') }`
    }

    document.querySelector('#os .battery').innerHTML = `<em>battery</em> ${battery.percent}% ${battery.timeRemaining ? ` - ${ battery.timeRemaining }min left` : ''}<span class="${battery.isCharging ? 'charging' : ''}">${battery.isCharging ? 'charging' : ''}</span>`

    if(cpu.usage > 50 || memory.usage > 80){
        if(!hitCritical){
            await gideon.speak('warning. reached critical system status')
            hitCritical = true;
        }
    }else{
        hitCritical = false;
    }
})

ipcRenderer.on('user_info', async (event, { user, drives, os, battery, cpu_usage, mem_usage }) => {
    const nameSpan = document.querySelector('#user .name');
    animateName(nameSpan, user);
     
    drives.map(drive => {
        const driveBar = document.querySelector('.drive--template').cloneNode(true);

        console.log(drive)

        driveBar.querySelector('.block_title').textContent = `${drive.mount}`;
        driveBar.querySelector('.used').style.width = `${drive.usedPercentage}%`;
        driveBar.querySelector('.used .value').textContent = `${drive.usedPercentage}%`;
        driveBar.querySelector('.used .tooltip').textContent = `${drive.usedGb}GB of ${drive.totalGb}GB`;
        driveBar.querySelector('.free').style.width = `${drive.freePercentage}%`;
        driveBar.querySelector('.free .value').textContent = `${drive.freePercentage}%`;
        driveBar.querySelector('.free .tooltip').textContent = `${drive.freeGb}GB of ${drive.totalGb}GB`;
        driveBar.style.display = "block";
        document.querySelector('#drives').append(driveBar)
    })
    document.querySelector('#os .os_info').innerHTML = `${Object.keys(os).map(value => `<em>${value}</em> ${os[value]} `).join(' ')}`

    await gideon.welcome();
    await gideon.speak(` Central Process Unit at ${Math.round(cpu_usage)}%. Memory at ${Math.round(mem_usage)}%`)
    await gideon.speak(`Drive usage: ${Math.round(drive.usedPercentage)}%`)
    await gideon.speak(`Battery is at ${battery.percent}% and ${battery.isCharging ? 'charging' : 'not charging'}`)
    if(battery.timeRemaining)
        await gideon.speak(`You have  ${ battery.timeRemaining }minutes left`)

});

ipcRenderer.on('charging', async (event, {isCharging}) => {
    await gideon.speak(isCharging ? 'Energy connected. Charging battery' : 'Energy disconnected')
})

function animateName(element, name) {
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
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}

async function updateOnlineStatus({speak = true}) {
    const status = navigator.onLine ? 'online' : 'offline';
    document.querySelector('body').className = status
    document.querySelector('#online-status span').textContent = status.split('').join(' ')

    if(speak){
        if(status === 'offline'){
            return gideon.offline()
        }
        
        await gideon.speak(`systems back online`)
    }
}

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

updateOnlineStatus({speak: false})

// document.querySelector('#player .volume').onchange = (e) => {
//     console.log(e.target.value);
//     const audio = document.querySelector('audio');
//     audio.volume = e.target.value / 100
// }

let clicked = false;
const player = document.querySelector('#player');
const fill = player.querySelector('.volume_fill');
const audioMedia = document.querySelector('#music');

function getPercentage(e){
    const rect = e.currentTarget.getClientRects()[0];
    const posX = e.pageX - rect.x;
    return Math.ceil(posX / rect.width * 100) / 100;
}

function changeVolume(percentage) {
    fill.style.transform = `scaleX(${percentage})`;
    audioMedia.volume = percentage
}

changeVolume(Number(localStorage.getItem('volume')) || .2);

player.addEventListener('mousedown', (e) => {
    clicked = true;
    changeVolume(getPercentage(e));
});

player.addEventListener('mousemove', (e) => {
    if (clicked) {
        changeVolume(getPercentage(e));
    }
});

window.addEventListener('mouseup', () => {
    clicked = false;

    localStorage.setItem('volume', audioMedia.volume);
});


window.addEventListener('gideon-log', () => { 
    document.querySelector('#log').textContent = gideon.log
})