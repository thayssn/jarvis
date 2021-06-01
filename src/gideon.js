const googleTTS = require('google-tts-api');
// TODO: Testar api do Watson
function Gideon () {
    const voice = document.querySelector('#gideon');
    const logEvent = new Event('gideon-log') 

    function getRandomSentence(){
        const sentences = ['Welcome back', 'How are you, captain?', 'Welcome aboard, captain!', `I thought you'd never come back`];
        const random = Math.floor(Math.random() * sentences.length);
    
        return sentences[random]
    }
    
    function getAudioFor(sentence){
        const url = googleTTS.getAudioUrl(sentence, {
            lang: 'en-US',
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        });

        return url;
    }

    let resolveFn;

    this.log = '';

    this.welcome = async () => {
        return await this.speak(getRandomSentence());
    }

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