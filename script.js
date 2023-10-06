document.addEventListener('DOMContentLoaded', function () {
    const audioFiles = [
        './sounds/Bass-drum.mp3',
        './sounds/Bass-drum.mp3',
        './sounds/Bass-drum.mp3' // Change to the correct audio files
    ];

    const gainNodes = [];
    const audioContexts = [];
    const kickBuffers = [];
    const intervals = Array(audioFiles.length).fill(null);

    function createGainNode(index) {
        const gainNode = audioContexts[index].createGain();
        gainNode.connect(audioContexts[index].destination);
        gainNodes.push(gainNode);
        return gainNode;
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
            const currentTime = audioContexts[index].currentTime;
            const nextScheduledTime = Math.ceil(currentTime / interval) * interval;

            const kickSource = audioContexts[index].createBufferSource();
            kickSource.buffer = kickBuffers[index];
            const gainNode = createGainNode(index);
            gainNode.gain.value = parseFloat(volumeSliders[index].value);
            kickSource.connect(gainNode);
            kickSource.start(nextScheduledTime);
        }, interval);
        playButtons[index].textContent = 'Stop';
    }

    function stopPlaying(index) {
        clearInterval(intervals[index]);
        intervals[index] = null;
        playButtons[index].textContent = 'Play';
    }

    // ... (your previous code for other functions and event listeners)

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


