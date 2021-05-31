const googleTTS = require('google-tts-api');
// TODO: Testar api do Watson

function Gideon () {
    const voice = document.querySelector('#gideon');
    const logEvent = new Event('gideon-log') 

    function getAudioFor(sentence){
        const url = googleTTS.getAudioUrl(sentence, {
            lang: 'en-UK',
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        });

        return url;
    }

    let resolveFn;

    this.log = '';

    this.speak = async (sentence) => {
        this.sentence = sentence;
        voice.src = getAudioFor(sentence);
        this.log += `// ${sentence} `

        window.dispatchEvent(logEvent);

        return new Promise((resolve) => {
            voice.removeEventListener('ended', resolveFn)
            resolveFn = () => resolve(this.sentence);
            voice.addEventListener('ended', resolveFn);
        })
    }
}

const gideon = new Gideon();