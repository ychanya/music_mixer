console.log("JS file connected");
const recordPlayer = document.querySelector("#recordPlayer");
const dropZone = document.querySelectorAll(".drop-zone"); 
const instruments = document.querySelectorAll(".instruments img");

let isMusicPlaying = false;
let vinylAngle = 0;
let draggedPiece;

// ******* An interactive Svg section *******

function setupRecordPlayer() {
    const tonearm = recordPlayer.contentDocument.querySelector("#Tone_arm");
    tonearm.style.transition = "transform 0.5s ease";
    tonearm.style.transformOrigin = "505px 95px";
}

function play(instrumentId){
    isMusicPlaying = true;
    const isFirstInstrument = countInstrumentsInDropZone() === 1;

    if (isFirstInstrument)
        insertMusicDisc();

    setTimeout(() => { 
        if (isFirstInstrument) {
        moveTonearm(30);
        startSpinningVinyl();
        }
        playAudio(instrumentId);
        },700);
}

function pause(instrumentId){
    pauseAudio(instrumentId);
    if (countInstrumentsInDropZone() === 0) {
        isMusicPlaying = false;
        setTimeout(() => { 
            removeMusicDisc();
            moveTonearm(0);
    },400);
    }
}

function countInstrumentsInDropZone() {
    let count = 0;

    dropZone.forEach((zone) => {count += zone.childElementCount;});
    return count;
}

function insertMusicDisc() {
    const musicDisc = document.querySelector("#musicDisc");
    musicDisc.classList.remove("translate-x-[145px]");
    musicDisc.classList.add("translate-x-[80px]");
}

function removeMusicDisc() {
    setTimeout(() => {
        const musicDisc = document.querySelector("#musicDisc");
        musicDisc.classList.remove("translate-x-[80px]");
        musicDisc.classList.add("translate-x-[145px]");
    }, 400);
}

function moveTonearm(angle) {
    const tonearm = recordPlayer.contentDocument.querySelector("#Tone_arm");
    tonearm.style.transform = `rotate(${angle}deg)`;
}

function startSpinningVinyl() {
    setTimeout(() => {
    spinVinyl();
    }, 600);
}

function spinVinyl() {
    if (!isMusicPlaying) return;

    const vinyl = recordPlayer.contentDocument.querySelector("#Vinyl");
    vinylAngle += 1;
    vinyl.setAttribute("transform", `rotate(${vinylAngle} 250 225)`);

    requestAnimationFrame(spinVinyl);
}

// ******* Drag and drop instruments section *******
function handleStartDrag() {
    console.log("started dragging this piece: ", this);
    draggedPiece = this;
}

function handleDragOver(e) {
    e.preventDefault();
    console.log("you dragged over me");
}

function handleDrop(e){
    e.preventDefault();
    if (this.childElementCount > 0) {
        return;
    }
    this.appendChild(draggedPiece);
        play(draggedPiece.id);
        console.log("dropped something on me");
}

function handleClickBack() {
    if (
        this.parentElement != null && this.parentElement.classList.contains("drop-zone")
    ) {
        const instrumentContainer = document.querySelector(`#${this.id}_container`); 
        instrumentContainer.appendChild(this);
        pause(this.id);
        console.log("started clicking this piece back to the container: ", this);
    }
}

function playAudio (instrumentId) {
    let instrument = document.querySelector(`#${instrumentId}_track`);
    instrument.currentTime = 0;
    instrument.play();
}

function pauseAudio (instrumentId) {
    let instrument = document.querySelector(`#${instrumentId}_track`);
    instrument.pause()
}

function resetting() {
    location.reload();
}


// Add eventlistener
document.querySelector("#resetButton").addEventListener("click",resetting);

recordPlayer.addEventListener("load", setupRecordPlayer);

instruments.forEach(icon => {
    icon.addEventListener("dragstart", handleStartDrag);
    icon.addEventListener("click", handleClickBack);
});
dropZone.forEach(zone => {
    zone.addEventListener("dragover", handleDragOver);
    zone.addEventListener("drop",handleDrop);
})