document.addEventListener('DOMContentLoaded', () => {
    let modes = {
        autoText: document.querySelector('.auto-icon'),
        blockText: document.querySelector('.block-icon'),
        autoIcon: document.querySelector('.auto'),
        blockIcon: document.querySelector('.block'),
    }

    chrome.storage.sync.get('mode', storage => {
        if (Object.entries(storage).length === 0) {
            chrome.storage.sync.set({ 'mode': 'auto' }, () => setAuto(modes));
        } else if (storage.mode === 'auto') {
            setAuto(modes);
        } else if (storage.mode === 'block') {
            setBlock(modes);
        }
    })

    const sendData = (mode) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { mode: mode }, function (response) {
                chrome.storage.sync.set({ 'mode': mode }, () => console.log('data saved', mode));
                if (response) {
                    console.log('success', response);
                } else {
                    console.log('error');
                }
            })
        })
    }

    const setAuto = (modes) => {
        modes.autoText.classList.add('active');
        modes.autoIcon.classList.add('active');
        modes.blockText.classList.remove('active');
        modes.blockIcon.classList.remove('active');
        sendData('auto');
    }

    const setBlock = (modes) => {
        modes.blockText.classList.add('active');
        modes.blockIcon.classList.add('active')
        modes.autoText.classList.remove('active');
        modes.autoIcon.classList.remove('active');
        sendData('block');
    }

    const styleBlock = (e) => {
        console.log(e);
        e.type === 'mouseover'
            ? modes.blockIcon.classList.add('hover')
            : modes.blockIcon.classList.remove('hover')
        
    }

    styleAuto = (e) => {
        console.log(e);
        e.type === 'mouseover'
        ? modes.autoIcon.classList.add('hover')
        : modes.autoIcon.classList.remove('hover')
    }

    modes.autoText.addEventListener('mousedown', () => setAuto(modes));
    modes.blockText.addEventListener('mousedown', () => setBlock(modes));
    modes.autoIcon.addEventListener('mousedown', () => setAuto(modes));
    modes.blockIcon.addEventListener('mousedown', () => setBlock(modes));

    modes.blockText.addEventListener('mouseover', (e) => styleBlock(e));
    modes.blockText.addEventListener('mouseleave', (e) => styleBlock(e));
    modes.autoText.addEventListener('mouseover', (e) => styleAuto(e))
    modes.autoText.addEventListener('mouseleave', (e) => styleAuto(e))
})