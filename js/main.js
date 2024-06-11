const clientImage = document.querySelector('.userPicture')
clientImage.style.height = window.getComputedStyle(clientImage).width
let currentActive = 0
let clientImageActive = true
let conversationHistory

async function detectLanguage(text){
    const API_URL = 'https://ws.detectlanguage.com/0.2/detect'
    const API_Key = '91f3e9f74ae9e952176ca61c033b4a20'
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_Key}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ q: text })
        }
    const response = await fetch(API_URL, options)
    if(response.ok){
        const receivedData = await response.json()
        return receivedData.data.detections[0]['language']
    }
}

clientImage.addEventListener('click', () => {
    if(clientImageActive){
        clientImageActive = false
        clientImage.style.transform = `rotateZ(360deg)`
    }
    setTimeout(() => {
        clientImage.style.transform = ''
    }, 2000)
    setTimeout(() => {
        clientImageActive = true
    }, 4000)
})

const chatRoom = document.querySelector('.chatRoom')
let newMessage = ''
const messageArea = document.querySelector('.typeMessage input')
messageArea.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
        addNewUserEntry(currentActive)
    }
})

// Adding a new user message to DOM

async function addNewUserEntry(currentActive){
    newMessage = messageArea.value
    if(newMessage !== ''){
        const lang = await detectLanguage(newMessage)
        const newUserEntry = document.createElement('div')
        newUserEntry.classList.add('userEntry')
        const newUserMessage = document.createElement('div')
        newUserMessage.classList.add('userMessage')
        newUserMessage.innerText = newMessage
        const userIcon = document.createElement('div')
        userIcon.classList.add('userIcon')
        userIcon.classList.add(returnImage(currentActive))
        newUserEntry.append(newUserMessage, userIcon)
        chatRoom.append(newUserEntry)
        messageArea.value = ''
        messageArea.disabled = true
        const English_Response = lang !== 'en' ? await translateToEnglish(newMessage, lang) : newMessage
        conversationHistory[currentActive].push(English_Response)
        const WholeConversation = conversationHistory[currentActive].join('\n')
        const AI_Entry_Text = await AI_response(WholeConversation)
        const AI_To_Japanese = lang !== 'en' ? await translateBack(AI_Entry_Text, lang) : AI_Entry_Text
        conversationHistory[currentActive].push(AI_Entry_Text)
        addNewAIEntry(AI_To_Japanese, currentActive)
        messageArea.disabled = false
        localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory))
        lastMessages[currentActive].innerText = newMessage.substr(0, 15) + ' ...'
    }
}



// Adding a new entry that AI returns to DOM

async function addNewAIEntry(AIResponse){
    const newAIEntry = document.createElement('div')
    newAIEntry.classList.add('AIEntry')

    const newAIIcon = document.createElement('div')
    newAIIcon.classList.add('AIIcon')

    const newAIMessage = document.createElement('div')
    newAIMessage.classList.add('AIMessage')
    newAIMessage.innerText = AIResponse

    newAIEntry.append(newAIIcon, newAIMessage)
    chatRoom.append(newAIEntry)
    localStorage.setItem(currentActive, chatRoom.innerHTML)
    lastMessages[currentActive] = localStorage.getItem(currentActive).split('<div class="userEntry"><div class="userMessage">').pop().split('</div>')[0].substr(0, 10) + ' ...'
}
const sendButton = document.querySelector('.sendMessage')
sendButton.addEventListener('click', addNewUserEntry(currentActive))

// Using Memory Translate API to translte from english -> japanese

async function translateBack(text, lang) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.responseData) {
            return data.responseData.translatedText;
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        console.error('Translation error:', error);
        return null;
    }
}

// Using Memory Translate API to translte from japanese -> english

async function translateToEnglish(text, lang) {
    //&key='eecdeb1c177ba5531d04'&de='mohamedtahahalim@gmail.com'
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${lang}|en`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.responseData) {
            return data.responseData.translatedText;
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        console.error('Translation error:', error);
        return null;
    }
}

// Adding event Listeners to All Conversations

const userPicture = document.querySelector('.userPicture')
const currentActiveConversations = document.querySelectorAll('.newConvo')
currentActiveConversations.forEach((elem, idx) => {
    elem.addEventListener('click', () => {
        resetActives()
        resetClassList()
        elem.classList.add('active')
        userPicture.classList.add(returnImage(idx))
        chatRoom.innerHTML = localStorage.getItem(idx)
        localStorage.setItem('currentActive', idx)
        currentActive = idx
    })
})
// Loading Last Opened Conversation
const lastMessages = document.querySelectorAll('.lastMessage')
window.addEventListener('load', () => {
    if(localStorage.getItem('currentActive')){
        currentActive = parseInt(localStorage.getItem('currentActive'))
    }
    else{
        currentActive = 0
    }
    if(localStorage.getItem('conversationHistory')){
        conversationHistory = JSON.parse(localStorage.getItem('conversationHistory'))
    }
    else{
        conversationHistory = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: []
        }
    }
    chatRoom.innerHTML = localStorage.getItem(currentActive)
    currentActiveConversations[currentActive].classList.add('active')
    resetClassList()
    userPicture.classList.add(returnImage(currentActive))
    lastMessages.forEach((elem, idx) => {
        if(localStorage.getItem(idx)){
            lastMessages[idx].innerText = (localStorage.getItem(idx).split('<div class="userEntry"><div class="userMessage">').pop().split('</div>')[0].substr(0, 15) + ' ...')
        }
        else{
            lastMessages.innerText = ''
        }
    })
})

// Returning User Image (Had to use classes since github doesn't accept in-style images)

function returnImage(num){
    if(num === 0) return 'userOne' 
    if(num === 1) return 'userTwo' 
    if(num === 2) return 'userThree' 
    if(num === 3) return 'userFour' 
    if(num === 4) return 'userFive' 
}
function resetClassList(){
    userPicture.classList.remove('userOne')
    userPicture.classList.remove('userTwo')
    userPicture.classList.remove('userThree')
    userPicture.classList.remove('userFour')
    userPicture.classList.remove('userFive')
}
function resetActives(){
    currentActiveConversations.forEach(elem => {
        elem.classList.remove('active')
    })
}

// Generating AI Response

async function AI_response(message){
    const API_KEY = 'sk-proj-kRzbr1jsxUKomY2HsorZT3BlbkFJh1QOyRtDSFUfanORHPHu'; // You API_Key Here from OPENAI
    const sentData = {
    model: 'gpt-3.5-turbo',
    messages: [
        { role: 'system', content: `keep in mind that user is saf, so say something appropriate to his or her feelings` },
        { role: 'user', content: `${message}` }
    ],
    max_tokens: 500
    };
    const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify(sentData)
                    }
    const response = await fetch('https://api.openai.com/v1/chat/completions', options)
    const AI_Message = await response.json()
    return AI_Message.choices[0].message.content
}

// Determining Emotion Based on Text provided by Client

async function getEmotion(text_Message){
    const API_Key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOWU4OTMwYWMtNzRjNy00ZWE2LTljM2ItOWUzMmMzZmQ5YWUyIiwidHlwZSI6ImFwaV90b2tlbiJ9.uXTwX8xisg1d8uAGS8pY6vCYdNcO_bUVwCDnI89MK38' // Emotion API_Key HERE
    const url = 'https://api.edenai.run/v2/text/emotion_detection'
    const dataToSend ={
                    providers: "nlpcloud,vernai",
                    text: `text_Message`,
                }
    const options = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${API_Key}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                    }
    const response = await fetch(url, options)
    const emotion = await response.json()
    console.log(emotion)
    currentEmotion = emotion.nlpcloud.items[0]['emotion']
    return translatedEmotion(currentEmotion)
}

// Translating Emotion Spectrum into a Single Word

function translatedEmotion(emotion){
    if(emotion === 'Anger') return 'Angry'
    if(emotion === 'Joy') return 'Happy'
    if(emotion === 'Fear') return 'Scared'
    if(emotion === 'Sadness') return 'Sad'
    if(emotion === 'Love') return 'In Love'
    if(emotion === 'Surprise') return 'Surprised'
}