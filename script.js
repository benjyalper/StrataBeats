document.addEventListener('DOMContentLoaded', function () {
    const audioFiles = [
        './sounds/Bass-drum.mp3',
        './sounds/Bass-drum.mp3',
        './sounds/Bass-drum.mp3' // Change to the correct audio files
    ];

    const gainNodes = [];
    const audioContexts = [];
    const kickBuffers = [];

    function createGainNode(index) {
        const gainNode = audioContexts[index].createGain();
        gainNode.connect(audioContexts[index].destination);
        gainNodes.push(gainNode);
        return gainNode;
    }

    function playBeat(index) {
        if (kickBuffers[index]) {
            const kickSource = audioContexts[index].createBufferSource();
            kickSource.buffer = kickBuffers[index];
            const gainNode = createGainNode(index);
            gainNode.gain.value = parseFloat(volumeSliders[index].value);
            kickSource.connect(gainNode);
            kickSource.start();
        }
    }

    function togglePlay(index) {
        const isPlaying = intervals[index] !== null;
        if (isPlaying) {
            stopPlaying(index);
        } else {
            startPlaying(index);
        }
    }

    function startPlaying(index) {
        const interval = 60000 / parseFloat(bpmInputs[index].value);
        intervals[index] = setInterval(function () {
            playBeat(index);
        }, interval);
        playButtons[index].textContent = 'Stop';
    }

    function stopPlaying(index) {
        clearInterval(intervals[index]);
        intervals[index] = null;
        playButtons[index].textContent = 'Play';
    }

    const drumBeats = document.querySelectorAll('.drum-beat');
    const bpmInputs = document.querySelectorAll('.bpm-input');
    const playButtons = document.querySelectorAll('.play-button');
    const volumeSliders = document.querySelectorAll('.volume-slider');
    const intervals = Array(drumBeats.length).fill(null);

    drumBeats.forEach(function (drumBeat, index) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContexts.push(audioContext);

        const setBpmButton = drumBeat.querySelector('.set-bpm-button');

        volumeSliders[index].addEventListener('input', function () {
            gainNodes[index].gain.value = parseFloat(volumeSliders[index].value);
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
                kickBuffers[index] = buffer;
            })
            .catch(error => console.error(`Error loading drum sound for file: ${audioFiles[index]}`, error));
    });

    // Button to start/stop all beats simultaneously
    const startAllButton = document.getElementById('startAllButton');
    let isAllPlaying = false;

    startAllButton.addEventListener('click', function () {
        if (isAllPlaying) {
            // Stop all beats
            drumBeats.forEach(function (_, index) {
                stopPlaying(index);
            });
            startAllButton.textContent = 'Start All';
            isAllPlaying = false;
        } else {
            // Start all beats
            drumBeats.forEach(function (_, index) {
                startPlaying(index);
            });
            startAllButton.textContent = 'Stop All';
            isAllPlaying = true;
        }
    });
});