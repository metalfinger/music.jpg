//!!P5
var rectx1 = 0;
var rectx2 = 0;
var recty1 = 0;
var recty2 = 0;

var myCanvas;

function setup() {
    myCanvas = createCanvas(500, 500);
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
    fill(200, 20, 0, 100);
    noStroke();
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

    //!Global variables
    let imageData = [];
    let pixelData = [];

    var imageWidth;
    var imageHeight;



    $(".btn1").click(function() {
        console.log("1");

        initAudio();
    });

    $(".btn2").click(function() {
        console.log("2");
    });

    //!Image Code Starts
    async function process() {
        let image = await IJS.Image.load(document.getElementById('test').src);

        // let yellow = image.grey({ algorithm: 'yellow' });
        // let histogramData = image.getHistogram({ channel: 1 });

        imageWidth = image.width;
        imageHeight = image.height;



        var widthDivider = 8;
        var heightDivider = 4;
        var pixelsInWidth = parseInt(imageWidth / widthDivider);
        var pixelsInHeight = parseInt(imageWidth / heightDivider);

        for (var divider = 0; divider < heightDivider; divider++) {


            for (var i = 0; i < widthDivider; i++) {

                let averageRGB = [0, 0, 0, []];

                for (var j = 0; j < pixelsInWidth; j++) {
                    var localpixelData = [i * pixelsInWidth, pixelsInWidth, parseInt(divider * (imageHeight / heightDivider)), pixelsInHeight];
                    if (j == 0) {

                        // console.log(i * pixelsInWidth, pixelsInWidth, parseInt(divider * (imageHeight / heightDivider)), parseInt(imageHeight / heightDivider));

                        pixelData.push(localpixelData);
                        // console.log(pixelData);
                    }
                    for (var k = divider; k < imageHeight / (divider + 1); k++) {


                        for (var l = 0; l < pixelsInHeight; l++) {

                            let currentI = (i * pixelsInWidth) + j;
                            let currentY = (k * pixelsInHeight) + l;

                            let rgbaData = image.getPixelXY(currentI, currentY);

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
                            averageRGB[1] = (averageRGB[1] + rgbaData[1]) / 2;
                            averageRGB[2] = (averageRGB[2] + rgbaData[2]) / 2;
                            averageRGB[3] = localpixelData;
                        }

                    }
                }
                imageData.push(averageRGB);
                // console.log(averageRGB);
            }
        }

        console.log(imageData);
    }
    process();
    //!Image Code Ends

    //!Tone.js Variable Defined
    var synth, synth2, synth1, reverb;
    var loop;
    var scale = Tonal.Scale.get("C2 major").notes;

    scale = scale.concat(Tonal.Scale.get("C3 major").notes);
    scale = scale.concat(Tonal.Scale.get("C4 major").notes);
    scale = scale.concat(Tonal.Scale.get("C5 major").notes);
    scale = scale.concat(Tonal.Scale.get("C6 major").notes);


    function initAudio() {

        resizeMyCanvas(imageWidth, imageHeight);

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
        synth.set({ detune: -1200 });

        synth1 = new Tone.PolySynth().connect(reverb);
        synth1.set({ detune: -1200 });

        synth2 = new Tone.PolySynth().connect(reverb);
        synth2.set({ detune: -1200 });

        loop = new Tone.Loop(loopstep, "8n");
        loop.start();

        Tone.Transport.start();

        // Tone.Master.volume.value = -9;
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
            console.log("aslkdfj  ", pixelData[noteCounter]);
            //!Drawing Ends

            // noiseGen = imageData[noteCounter][0];

            let noteIndex = floor(map(imageData[noteCounter][0], 0, 255, 0, scale.length));
            let noteIndex1 = floor(map(imageData[noteCounter][1], 0, 255, 0, scale.length));
            let noteIndex2 = floor(map(imageData[noteCounter][2], 0, 255, 0, scale.length));

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

            // if (imageData[noteCounter][1] < 100) {
            //     playTime = "16n";
            // } else if (imageData[noteCounter][1] < 180) {
            //     playTime = "32n";
            // }
            console.log(note, playTime, imageData[noteCounter][1]);

            if (prevNote != note) {
                synth.triggerAttackRelease(note, playTime, time);

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

            noteCounter++;
        } else {
            Tone.Transport.stop();
            noteCounter = 0;
        }
    }

    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }




});