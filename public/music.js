//!Tone.js Variable Defined
var synth, synth2, synth1, synthBeat, reverb;
var loop;
var scale;

let imageData = [];

let imageScrubber;


//Initiate Audio Setup
var audioIsInit = false;

function initAudio() {
    if (!audioIsInit) {
        audioIsInit = true;

        scale = Tonal.Scale.get("C3 major").notes;
        // scale = scale.concat(Tonal.Scale.get("C3 major").notes);
        scale = scale.concat(Tonal.Scale.get("C4 major").notes);
        scale = scale.concat(Tonal.Scale.get("C5 major").notes);
        scale = scale.concat(Tonal.Scale.get("C6 major").notes);

        console.log("SCALE");
        console.log(scale);

        // resizeMyCanvas(imageWidth, imageHeight);

        //!Get Chords Starts

        // var tempArray = [];
        // for (var counter = 0; counter < imageDataR.length; counter = counter + 8) {
        //     let noteIndex = floor(map(imageDataR[counter], 0, 255, 0, scale.length));
        //     let note = scale[noteIndex];
        //     console.log(counter, note, Tonal.Chord.get(note).notes);

        //     // tempArray.push(note);
        // }
        // tempArray = ["D", "F#", "A", "C"];
        // console.log(tempArray, Tonal.Chord.detect(tempArray));
        // console.log(tempArray);

        //!Get Chords Ends

        reverb = new Tone.JCReverb(0.5).toDestination();

        synth = new Tone.PolySynth().connect(reverb);
        synth.set({ detune: -1800 });

        synth1 = new Tone.PolySynth().connect(reverb);
        synth1.set({ detune: -1200 });

        synth2 = new Tone.PolySynth().connect(reverb);
        synth2.set({ detune: -1200 });

        synthBeat = new Tone.PolySynth().connect(reverb);
        synthBeat.set({ detune: -3000 });

        loop = new Tone.Loop(loopstep, "8n");
        loop.start();
        Tone.Master.volume.value = -9;
    }
}

let isUploaderOpen = false;
let currentPlayButtonReference;

function playSound(_imageDataLocal, parentOfImageHolder, _isUploaderOpen, _currentPlayButtonReference) {
    initAudio();

    isUploaderOpen = _isUploaderOpen;
    currentPlayButtonReference = _currentPlayButtonReference;

    imageData = _imageDataLocal;
    // imageIsPlaying();
    Tone.Transport.start();

    //!Add ImageScrubber
    $(parentOfImageHolder).append("<div class='imageScrubber'></div>");
    imageScrubber = $(".imageScrubber");
    imageScrubber.css({
        "position": "absolute",
        "top": "0%",
        "left": "0%",
        "width": "12.5%",
        "height": "25%",
        // "background-color": "rgb(255 4 4 / 48%)",
        "border-top-style": "solid",
        "border-top-width": "1px",
        "border-top-color": "rgb(255 0 0 / 100%)",
        "border-right-style": "solid",
        "border-right-width": "1px",
        "border-right-color": "rgb(255 0 0 / 100%)",
        "border-bottom-style": "solid",
        "border-bottom-width": "1px",
        "border-bottom-color": "rgb(255 0 0 / 100%)",
        "border-left-style": "solid",
        "border-left-width": "1px",
        "border-left-color": "rgb(255 0 0 / 100%)",
        "z-index": "1000"
    });

}

function stopSound() {
    // imageNotPlaying();
    Tone.Transport.stop();

    //!Remove ImageScrubber
    imageScrubber.remove();
}

//!this.function Variables
var prevNote, prevNote1, prevNote2;
var noteCounter = 0;
var chordNotes;

function loopstep(time) {
    // let noiseGen = noise(frameCount * 0.1);


    //!TESTING IMAGE DATA
    let mainImageWidth = $(".mainImage").width();
    let mainImageHeight = $(".mainImage").height();

    if (noteCounter < imageData.length) {
        //!Drawing Starts
        // updateRectPos(pixelData[noteCounter]);



        let xIndex = (noteCounter % 8);
        let yIndex = Math.floor(noteCounter / 8);
        console.log(xIndex, yIndex);

        imageScrubber.css("left", (xIndex * 12.5).toString() + "%");
        imageScrubber.css("top", (yIndex * 25).toString() + "%");

        //!Drawing Ends

        // noiseGen = imageData[noteCounter][0];

        let noteIndex = Math.floor(
            myMapFunction(imageData[noteCounter][0], 0, 255, 0, scale.length)
        );
        let noteIndex1 = Math.floor(
            myMapFunction(imageData[noteCounter][1], 0, 255, 0, scale.length)
        );
        let noteIndex2 = Math.floor(
            myMapFunction(imageData[noteCounter][2], 0, 255, 0, scale.length)
        );

        // let note = scale[randomIntFromInterval(0, scale.length - 1)]; //Randomly selecting Notes
        let note = scale[noteIndex];

        let note1 = scale[noteIndex1];
        let note2 = scale[noteIndex2];

        //!CHORD
        // if (noteCounter % 4 == 0) {
        //     console.log(noteCounter, note, Tonal.Chord.get(note).notes);
        //     chordNotes = Tonal.Chord.get(note).notes;
        // }

        var playTime = "8n";

        if (imageData[noteCounter][1] < 100) {
            playTime = "16n";
        } else if (imageData[noteCounter][1] < 180) {
            playTime = "32n";
        }
        console.log(noteCounter, xIndex, note, playTime, imageData[noteCounter][1]);

        if (prevNote != note) {
            synth.triggerAttackRelease(note, playTime);
        }
        // console.log("norm", noteCounter);
        if (noteCounter % 2 == 0) {
            // synthBeat.triggerAttackRelease("C4", "4n");
            // console.log("base", noteCounter);
            // synthBeat.triggerAttackRelease(note, "16n");
        }
        if (prevNote1 != note1) {
            // synth1.triggerAttackRelease(note1, "8n", time);
        }
        if (prevNote2 != note2) {
            // synth2.triggerAttackRelease(note2, "8n", time);
        }

        prevNote = note;
        prevNote1 = note1;
        prevNote2 = note2;


        //!Check for Playing....
        var beatCount = noteCounter % 4;
        var playingText = "▶ playing (Counter : " + (imageData.length - noteCounter).toString() + ")";


        // for (var bCounter = 0; bCounter < beatCount; bCounter++) {
        //     playingText += ".";
        // }

        if (isUploaderOpen) {
            $("#playBtn").text(playingText);
        } else {
            $(currentPlayButtonReference).text(playingText);
        }

        noteCounter++;
    } else {
        stopSound();

        noteCounter = 0;

        //!Borrowed from index.js
        if (isUploaderOpen) {
            $(".btn__wrapper.play__btn.playing").removeClass("playing");
            $(".btn__wrapper.reupload__btn.playing").removeClass("playing");

            $("#playBtn").text("▶ play again");
        } else {
            $(".art__unit").removeClass("disable__btn");

            let currenlyPlayedNumber = $(currentPlayButtonReference).parent().attr("data-played");
            $(currentPlayButtonReference).html('<div class="played__data">▶ play</div> </br>(Played ' + currenlyPlayedNumber + ' times)');

            //<span class="played__data">▶ play</span> (Played : ' + element.numPlayed + ')
        }
    }
}

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function imageIsPlaying() {
    $(".btn__wrapper.play__btn").addClass("playing");
    $(".btn__wrapper.reupload__btn").addClass("playing");

    $("#playBtn").text("▶ playing");
}

function imageNotPlaying() {
    $(".btn__wrapper.play__btn.playing").removeClass("playing");
    $(".btn__wrapper.reupload__btn.playing").removeClass("playing");

    $("#playBtn").text("▶ play again");
}

function myMapFunction(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}