const clientImage = document.querySelector('.userPicture')
clientImage.style.height = window.getComputedStyle(clientImage).width
let currentActive = 0
let clientImageActive = true
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
        const newUserEntry = document.createElement('div')
        newUserEntry.classList.add('userEntry')

        const newUserMessage = document.createElement('div')
        newUserMessage.classList.add('userMessage')

        const translatedMessage = await translateToJapanese(newMessage)
        newUserMessage.innerText = translatedMessage

        const userIcon = document.createElement('div')
        userIcon.classList.add('userIcon')
        userIcon.classList.add(returnImage(currentActive))

        newUserEntry.append(newUserMessage, userIcon)
        chatRoom.append(newUserEntry)
        messageArea.value = ''
        messageArea.disabled = true
        const AI_Entry_Text = await AI_response(newMessage)
        const AI_To_Japanese = await translateToJapanese(AI_Entry_Text)
        addNewAIEntry(AI_To_Japanese)
        messageArea.disabled = false
        localStorage.setItem(currentActive, chatRoom.innerHTML)
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
    const translatedMessage = await translateToJapanese(AIResponse)
    newAIMessage.innerText = translatedMessage

    newAIEntry.append(newAIIcon, newAIMessage)
    chatRoom.append(newAIEntry)
}
const sendButton = document.querySelector('.sendMessage')
sendButton.addEventListener('click', addNewUserEntry(currentActive))

// Using Memory Translate API to translte from english -> japanese

async function translateToJapanese(text) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ja`;
    
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

async function translateToEnglish(text) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|en&key='eecdeb1c177ba5531d04'&de='mohamedtahahalim@gmail.com'`;
    
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
        console.log(localStorage)
    })
})

// Loading Last Opened Conversation

window.addEventListener('load', () => {
    if(localStorage.getItem(currentActive)){
        currentActive = parseInt(localStorage.getItem('currentActive'))
    }
    else{
        currentActive = 0
    }
    chatRoom.innerHTML = localStorage.getItem(currentActive)
    currentActiveConversations[currentActive].classList.add('active')
    resetClassList()
    userPicture.classList.add(returnImage(currentActive))
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
    const API_KEY = ''; // You API_Key Here from OPENAI
    const sentData = {
    model: 'gpt-3.5-turbo',
    messages: [
        { role: 'system', content: `keep in mind that user is ${getEmotion(message)}, so say something appropriate to his or her feelings` },
        { role: 'user', content: `${message}` }
    ],
    max_tokens: 200
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
    const API_Key = '' // Emotion API_Key HERE
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
