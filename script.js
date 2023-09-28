document.addEventListener('DOMContentLoaded', function () {
    const audioFiles = [
        './sounds/Bass-drum.mp3',
        './sounds/Bass-drum.mp3',
        './sounds/acoustic-side-stick-94277.mp3'
    ];

    const gainNodes = [];
    const audioContexts = [];
    const kickBuffers = []; // Create an array to hold separate kick buffers for each beat

    let currentBPM = 120;
    let isAllPlaying = false; // Define isAllPlaying

    function createGainNode(index) {
        const gainNode = audioContexts[index].createGain();
        gainNode.connect(audioContexts[index].destination);
        gainNodes.push(gainNode);
        return gainNode;
    }

    function playBeat(index) {
        if (kickBuffers[index]) { // Use the correct buffer for the beat
            const kickSource = audioContexts[index].createBufferSource();
            kickSource.buffer = kickBuffers[index]; // Use the correct buffer for the beat
            kickSource.connect(createGainNode(index));
            kickSource.start();
        }
    }

    function togglePlay(index) {
        const isPlaying = intervalIds[index] !== null;
        if (isPlaying) {
            stopPlaying(index);
        } else {
            startPlaying(index);
        }
    }

    function startPlaying(index) {
        const interval = 60000 / currentBPM;
        intervalIds[index] = setInterval(function () {
            playBeat(index);
        }, interval);
        playButtons[index].textContent = 'Stop';
    }

    function stopPlaying(index) {
        clearInterval(intervalIds[index]);
        intervalIds[index] = null;
        playButtons[index].textContent = 'Play';
    }

    function setBPM(index) {
        const newBPM = parseFloat(bpmInputs[index].value);
        if (!isNaN(newBPM) && newBPM > 0) {
            currentBPM = newBPM;
            if (intervalIds[index] !== null) {
                stopPlaying(index);
                startPlaying(index);
            }
        } else {
            alert('Please enter a valid BPM.');
        }
    }

    const drumBeats = document.querySelectorAll('.drum-beat');
    const bpmInputs = document.querySelectorAll('.bpm-input');
    const intervalIds = Array(drumBeats.length).fill(null);
    const playButtons = document.querySelectorAll('.play-button');

    drumBeats.forEach(function (drumBeat, index) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContexts.push(audioContext);

        const volumeSlider = drumBeat.querySelector('.volume-slider');
        const setBpmButton = drumBeat.querySelector('.set-bpm-button');

        volumeSlider.addEventListener('input', function () {
            gainNodes[index].gain.value = parseFloat(volumeSlider.value);
        });

        playButtons[index].addEventListener('click', function () {
            togglePlay(index);
        });

        setBpmButton.addEventListener('click', function () {
            setBPM(index);
        });

        fetch(audioFiles[index])
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok for file: ${audioFiles[index]}`);
                }
                return response.arrayBuffer();
            })
            .then(data => audioContexts[index].decodeAudioData(data))
            .then(buffer => {
                kickBuffers[index] = buffer; // Store the buffer for the beat
            })
            .catch(error => console.error(`Error loading drum sound for file: ${audioFiles[index]}`, error));
    });

    // Button to start/stop all beats simultaneously
    const startAllButton = document.getElementById('startAllButton');
    startAllButton.addEventListener('click', function () {
        isAllPlaying = !isAllPlaying;
        if (isAllPlaying) {
            startAllButton.textContent = 'Stop All';
            drumBeats.forEach(function (_, index) {
                startPlaying(index);
            });
        } else {
            startAllButton.textContent = 'Start All';
            drumBeats.forEach(function (_, index) {
                stopPlaying(index);
            });
        }
    });
});
