const clientImage = document.querySelector('.userPicture')
clientImage.style.height = window.getComputedStyle(clientImage).width

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
        addNewUserEntry()
    }
})

// Adding a new use message to DOM

async function addNewUserEntry(){
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

        newUserEntry.append(newUserMessage, userIcon)
        chatRoom.append(newUserEntry)
        messageArea.value = ''
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
sendButton.addEventListener('click', addNewUserEntry)

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

//Hello, My Name Is Taha. I am very pleased to meet you, hope we can share together and learn together