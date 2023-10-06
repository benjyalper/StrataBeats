document.addEventListener('DOMContentLoaded', function () {
    const convertButton = document.getElementById('convertButton');
    const bpmInput = document.getElementById('bpm');
    const beatValuesDiv = document.getElementById('beatValues');

    function calculateTimesAndBPM(bpm) {
        const beatTime = 60 / bpm;
        const eighthTime = beatTime / 2;
        const sixteenthTime = beatTime / 4;
        const tripletTime = beatTime / 3;
        const eighthTripletTime = tripletTime / 2;
        const wholeTripletTime = (beatTime * 3) / 4;
        const wholeTripletBPM = 60 / wholeTripletTime;

        return {
            beatTime: beatTime.toFixed(2),
            eighthTime: eighthTime.toFixed(2),
            sixteenthTime: sixteenthTime.toFixed(2),
            tripletTime: tripletTime.toFixed(2),
            eighthTripletTime: eighthTripletTime.toFixed(2),
            wholeTripletTime: wholeTripletTime.toFixed(2),
            wholeTripletBPM: wholeTripletBPM.toFixed(4)
        };
    }

    convertButton.addEventListener('click', function () {
        const bpm = parseFloat(bpmInput.value);
        if (!isNaN(bpm) && bpm > 0) {
            const timesAndBPM = calculateTimesAndBPM(bpm);
            beatValuesDiv.innerHTML = `
                <p>Beat Time: ${timesAndBPM.beatTime} seconds (BPM: ${bpm})</p>
                <p>Eighth Time: ${timesAndBPM.eighthTime} seconds (BPM: ${bpm * 2})</p>
                <p>Sixteenth Time: ${timesAndBPM.sixteenthTime} seconds (BPM: ${bpm * 4})</p>
                <p>Triplet Time: ${timesAndBPM.tripletTime} seconds (BPM: ${bpm * 3})</p>
                <p>Eighth Triplet Time: ${timesAndBPM.eighthTripletTime} seconds (BPM: ${bpm * 3 * 2})</p>
                <p>Whole Triplet Time: ${timesAndBPM.wholeTripletTime} seconds (BPM: ${timesAndBPM.wholeTripletBPM})</p>
            `;
        } else {
            beatValuesDiv.textContent = 'Invalid input. Please enter a valid BPM.';
        }
    });
});
