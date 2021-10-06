//!!P5 Code
var rectx1 = 0;
var rectx2 = 0;
var recty1 = 0;
var recty2 = 0;

var myCanvas;

function setup() {
    myCanvas = createCanvas(1, 1);
    myCanvas.parent("sketchholder");

    // createCanvas(windowWidth, windowHeight);
    // resizeCanvas(windowWidth / 2, windowHeight / 2);

    // window.addEventListener('resize', doCanvasResize(), false);
    // window.addEventListener('orientationchange', doCanvasResize(), false);
}

function updateRectPos(_pixelData) {
    rectx1 = _pixelData[0];
    rectx2 = _pixelData[1];
    recty1 = _pixelData[2];
    recty2 = _pixelData[3];
}

function draw() {
    clear();
    background(255, 0, 0, 0);

    fill(200, 200, 200, 100);
    noStroke();
    // filter(GRAY);
    rect(rectx1, recty1, rectx2, recty2);
}

function windowResized() {
    // console.log(p5);
    resizeCanvas(windowWidth, windowHeight);
}

function resizeMyCanvas(_imageWidth, _imageHeight) {
    resizeCanvas(_imageWidth, _imageHeight);
    // console.log(p5);
}

$(document).ready(function() {
    console.log("ready!");

    //!Uploading Image Code Starts
    document
        .querySelector('input[type="file"]')
        .addEventListener("change", function() {
            if (this.files && this.files[0]) {
                // console.log(document.getElementById('test'));

                var img = document.getElementById("test");

                img.src = URL.createObjectURL(this.files[0]); // set src to blob url

                $("img")
                    .one("load", function() {
                        // do stuff
                        console.log("Loading");
                        console.log("Loading2");

                        $("#playBtn").text("▶ play");

                        processImageData();
                        $(".content__holder").addClass("hide");
                        $(".main__holder").removeClass("hide");
                    })
                    .each(function() {
                        if (this.complete) {
                            // $(this).load(); // For jQuery < 3.0
                            // $(this).trigger('load'); // For jQuery >= 3.0
                        }
                    });
            }
        });

    //!Global variables
    let imageData = [];
    let pixelData = [];

    var imageWidth;
    var imageHeight;

    $(".play__btn").click(function() {
        console.log("1");

        initAudio();
        playSound();

    });

    //!Image Code Starts
    async function processImageData() {
        let image = await IJS.Image.load(document.getElementById("test").src);

        let mainParent = $(".image__holder");

        imageWidth = image.width;
        imageHeight = image.height;

        imageWidth = mainParent.width();
        imageHeight = mainParent.width() * (image.height / image.width);

        console.log(imageWidth, imageHeight);
        console.log(mainParent.width(), mainParent.height());

        resizeMyCanvas(imageWidth, imageHeight);

        imageData = [];
        pixelData = [];


        //!Main Grid Divider
        var widthDivider = 8;
        var heightDivider = 4;

        var pixelsInWidth = parseInt(imageWidth / widthDivider);
        var pixelsInHeight = parseInt(imageHeight / heightDivider);

        //!Travelling through All the pixels
        for (var j = 0; j < heightDivider; j++) {
            for (var i = 0; i < widthDivider; i++) {
                // if (i == 0 && j == 0) {
                // console.log(i, j, i * pixelsInWidth, pixelsInWidth, j * pixelsInHeight, pixelsInHeight);
                var localpixelData = [
                    i * pixelsInWidth,
                    pixelsInWidth,
                    j * pixelsInHeight,
                    pixelsInHeight
                ];
                pixelData.push(localpixelData);
                // }

                let averageRGB = [0, 0, 0];

                for (var xPixel = 0; xPixel < pixelsInWidth; xPixel++) {
                    for (var yPixel = 0; yPixel < pixelsInHeight; yPixel++) {
                        var currentX = i * pixelsInWidth + xPixel;
                        var currentY = j * pixelsInHeight + yPixel;

                        let rgbaData = image.getPixelXY(currentX, currentY);

                        // if (
                        //     (rgbaData[0] == 255) &&
                        //     (rgbaData[1] == 255) &&
                        //     (rgbaData[2] == 255)
                        // ) {
                        //     // console.log("sdf");
                        // } else {

                        //     averageRGB[0] = (averageRGB[0] + rgbaData[0]) / 2;
                        //     averageRGB[1] = (averageRGB[1] + rgbaData[1]) / 2;
                        //     averageRGB[2] = (averageRGB[2] + rgbaData[2]) / 2;
                        //     averageRGB[3] = (averageRGB[3] + rgbaData[3]) / 2;
                        // }

                        averageRGB[0] = (averageRGB[0] + rgbaData[0]) / 2;
                        averageRGB[0] = (averageRGB[0] + rgbaData[1]) / 2;
                        averageRGB[0] = (averageRGB[0] + rgbaData[2]) / 2;
                    }
                }

                imageData.push(averageRGB);
            }
        }

        console.log(imageData);
    }

    //!Image Code Ends

    //!Tone.js Variable Defined
    var synth, synth2, synth1, synthBeat, reverb;
    var loop;
    var scale = Tonal.Scale.get("C4 major").notes;

    // scale = scale.concat(Tonal.Scale.get("C3 major").notes);
    // scale = scale.concat(Tonal.Scale.get("C4 major").notes);
    scale = scale.concat(Tonal.Scale.get("C5 major").notes);
    scale = scale.concat(Tonal.Scale.get("C6 major").notes);

    //Initiate Audio Setup
    var audioIsInit = false;

    function initAudio() {
        if (!audioIsInit) {
            audioIsInit = true;

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

            reverb = new Tone.JCReverb(0.4).toDestination();

            synth = new Tone.PolySynth().connect(reverb);
            synth.set({ detune: -1800 });

            synth1 = new Tone.PolySynth().connect(reverb);
            synth1.set({ detune: -1200 });

            synth2 = new Tone.PolySynth().connect(reverb);
            synth2.set({ detune: -1200 });

            synthBeat = new Tone.PolySynth().connect(reverb);
            synthBeat.set({ detune: -2000 });

            loop = new Tone.Loop(loopstep, "8n");
            loop.start();
            Tone.Master.volume.value = -9;
        }
    }

    function playSound() {
        imageIsPlaying();
        Tone.Transport.start();
    }

    function stopSound() {
        imageNotPlaying();
        Tone.Transport.stop();
    }

    //!this.function Variables
    var prevNote, prevNote1, prevNote2;
    var noteCounter = 0;
    var chordNotes;

    function loopstep(time) {
        // let noiseGen = noise(frameCount * 0.1);

        if (noteCounter < imageData.length) {
            //!Drawing Starts
            updateRectPos(pixelData[noteCounter]);

            //!Drawing Ends

            // noiseGen = imageData[noteCounter][0];

            let noteIndex = floor(
                map(imageData[noteCounter][0], 0, 255, 0, scale.length)
            );
            let noteIndex1 = floor(
                map(imageData[noteCounter][1], 0, 255, 0, scale.length)
            );
            let noteIndex2 = floor(
                map(imageData[noteCounter][2], 0, 255, 0, scale.length)
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
            console.log(note, playTime, imageData[noteCounter][1]);

            if (prevNote != note) {
                synth.triggerAttackRelease(note, playTime);
            }
            // console.log("norm", noteCounter);
            if (noteCounter % 4 == 0) {
                // synthBeat.triggerAttackRelease("C4", "4n");
                // console.log("base", noteCounter);
                // synthBeat.triggerAttackRelease(note, "4n");
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
            var playingText = "▶ playing (" + (imageData.length - noteCounter).toString() + ")";


            // for (var bCounter = 0; bCounter < beatCount; bCounter++) {
            //     playingText += ".";
            // }

            $("#playBtn").text(playingText);

            noteCounter++;
        } else {
            stopSound();
            updateRectPos([0, 0, 0]);
            noteCounter = 0;
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
});