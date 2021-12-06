//!Firebase code starts here
// adding firebase data
var firebaseConfig = {
    apiKey: "AIzaSyBp_GyL9SdTed56B5zDewUfBx7iXp9V7o8",
    authDomain: "music-jpg-ac824.firebaseapp.com",
    projectId: "music-jpg-ac824",
    storageBucket: "music-jpg-ac824.appspot.com",
    messagingSenderId: "48842147145",
    appId: "1:48842147145:web:958ba842554dee3d3a8698"
};

firebase.initializeApp(firebaseConfig);
//!Firebase code ends here


$(document).ready(function() {
    console.log("ready!");

    //!Uploading Image Code Starts
    document
        .querySelector('input[type="file"]')
        .addEventListener("change", function(e) {
            if (this.files && this.files[0]) {

                var img = document.getElementById("test");

                img.src = URL.createObjectURL(this.files[0]); // set src to blob url

                console.log("Image Srouce ", img.src);

                $("img")
                    .one("load", function() {
                        // do stuff
                        console.log("Loading");
                        console.log("Loading2");

                        //!IMAGE LOADED DEACTIVATE ALL BUTTONS
                        $(".upload__server__btn").addClass("disable__btn");
                        $(".play__btn").addClass("disable__btn");
                        $(".reupload__btn").addClass("disable__btn");

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
    let imageDataLocal = [];
    let pixelData = [];

    var imageWidth;
    var imageHeight;



    $(".play__btn").click(function() {
        console.log("1");


        playSoundLocal();

    });

    let isUploading = false;

    $(".upload__server__btn").click(function() {
        console.log("Upload Clicked");

        if (!isUploading) {
            //disable play__btn
            $(".play__btn").addClass("disable__btn");

            //disable reupload__btn
            $(".reupload__btn").addClass("disable__btn");

            //Change text of upload__server__btn
            $(".upload__server__btn").find(".btn__text").text("Uploading...");
            $(".upload__server__btn").addClass("selected");

            uploadFile();

        }
    });


    //!Image Code Starts
    async function processImageData() {
        let image = await IJS.Image.load(document.getElementById("test").src);

        // uploadFile(input.files[0]);
        //uploadFile();




        let mainParent = $(".image__holder");

        imageWidth = image.width;
        imageHeight = image.height;

        imageWidth = mainParent.width();
        imageHeight = mainParent.width() * (image.height / image.width);

        console.log(imageWidth, imageHeight);
        console.log(mainParent.width(), mainParent.height());


        //!Referring to the canvas
        var canvas = document.getElementById('canvasid'),
            context = canvas.getContext('2d');

        //!Resizing the canvas
        canvas.width = imageWidth;
        canvas.height = imageHeight;

        //!CUpload Image to Canvas
        // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // ctx.drawImage(image, 0, 0);

        var img = document.getElementById("test");
        // resizeMyCanvas(imageWidth, imageHeight);
        context.drawImage(img, 0, 0, imageWidth, imageHeight);

        // let canvasPixelColor = context.getImageData(0, 0, 2, 2);
        // console.log("Trace data Here");
        // for (let i = 0; i < canvasPixelColor.data.length; i += 4) {
        //     let r = canvasPixelColor.data[i];
        //     let g = canvasPixelColor.data[i + 1];
        //     let b = canvasPixelColor.data[i + 2];
        //     let a = canvasPixelColor.data[i + 3];

        //     console.log(i, r, g, b, a);
        // }

        // console.log(canvasPixelColor.width, canvasPixelColor.height, canvasPixelColor.data);


        // let pixels = canvasPixelColor.data;

        // console.log(pixels);

        imageDataLocal = [];
        pixelData = [];


        //!Main Grid Divider
        var widthDivider = 8;
        var heightDivider = 4;

        var pixelsInWidth = parseInt(imageWidth / widthDivider);
        var pixelsInHeight = parseInt(imageHeight / heightDivider);

        console.log(imageWidth, imageHeight, pixelsInWidth, pixelsInHeight);



        //!Travelling through All the pixels
        for (var j = 0; j < heightDivider; j++) {
            for (var i = 0; i < widthDivider; i++) {


                // let averageRGB = [0, 0, 0];
                // let rr = 0;
                // let gg = 0;
                // let bb = 0;

                // // console.log(averageRGB, i * pixelsInWidth, i * pixelsInWidth + pixelsInWidth, j * pixelsInHeight, j * pixelsInHeight + pixelsInHeight);

                // for (var xPixel = 0; xPixel < pixelsInWidth; xPixel++) {
                //     for (var yPixel = 0; yPixel < pixelsInHeight; yPixel++) {
                //         var currentX = i * pixelsInWidth + xPixel;
                //         var currentY = j * pixelsInHeight + yPixel;

                //         let rgbaData = image.getPixelXY(currentX, currentY);

                //         let canvasPixelColor = context.getImageData(currentX, currentY, 1, 1);

                //         let pixels = canvasPixelColor.data;

                //         if (xPixel == 2 && yPixel == 0) {


                //             // console.log(i, j, currentX, currentY, rgbaData);
                //         }

                //         // if (
                //         //     (rgbaData[0] == 255) &&
                //         //     (rgbaData[1] == 255) &&
                //         //     (rgbaData[2] == 255)
                //         // ) {
                //         //     // console.log("sdf");
                //         // } else {

                //         //     averageRGB[0] = (averageRGB[0] + rgbaData[0]) / 2;
                //         //     averageRGB[1] = (averageRGB[1] + rgbaData[1]) / 2;
                //         //     averageRGB[2] = (averageRGB[2] + rgbaData[2]) / 2;
                //         //     averageRGB[3] = (averageRGB[3] + rgbaData[3]) / 2;
                //         // }

                //         averageRGB[0] = (averageRGB[0] + pixels[0]) / 2;
                //         averageRGB[1] = (averageRGB[1] + pixels[1]) / 2;
                //         averageRGB[2] = (averageRGB[2] + pixels[2]) / 2;
                //     }
                // }


                let averagePixelRGB = [0, 0, 0];

                let canvasPixelColor = context.getImageData(i * pixelsInWidth, j * pixelsInHeight, pixelsInWidth, pixelsInHeight);
                console.log("Trace data Here");

                let counterr = 0;
                let rrr = 0;
                let ggg = 0;
                let bbb = 0;

                for (let i = 0; i < canvasPixelColor.data.length; i += 4) {
                    let r = canvasPixelColor.data[i];
                    let g = canvasPixelColor.data[i + 1];
                    let b = canvasPixelColor.data[i + 2];
                    let a = canvasPixelColor.data[i + 3];

                    rrr = (rrr + r) / 2;
                    ggg = (ggg + g) / 2;
                    bbb = (bbb + b) / 2;
                    counterr++;
                }
                averagePixelRGB = [rrr, ggg, bbb];

                // console.log(i, j, averageRGB, averagePixelRGB);


                imageDataLocal.push(averagePixelRGB);
            }
        }

        //!IMAGE LOADED ACTIVATE ALL BUTTONS
        $(".upload__server__btn").removeClass("disable__btn");
        $(".play__btn").removeClass("disable__btn");
        $(".reupload__btn").removeClass("disable__btn");

        console.log(imageDataLocal);

    }

    //!Image Code Ends



    function playSoundLocal() {
        imageIsPlaying();

        playSound(imageDataLocal, $(".image__holder"), true, null);
        // Tone.Transport.start();
    }

    function stopSoundLocal() {
        imageNotPlaying();
        stopSound();
        // Tone.Transport.stop();
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

    //!Uploading to server
    const uploadFile = () => {
        //!Get source of img tag with test ID
        let image = document.getElementById("test");
        //!Get source of image
        let imageSrc = image.src;
        console.log(imageSrc);


        const input = document.getElementById('file-upload');

        let file = input.files[0];




        //!Firebase Starts       
        var storageRef = firebase.storage().ref('images/' + file.name);
        var thisRef = storageRef.put(file);
        thisRef.on('state_changed', function(snapshot) {


        }, function(error) {

        }, function() {
            // Uploaded completed successfully, now we can get the download URL
            thisRef.snapshot.ref.getDownloadURL().then(function(downloadURL) {

                console.log("DOWNLOADABLE URL : " + downloadURL);

                // add file to FormData object
                let fd = new FormData();
                fd.append('sampleFile', file);
                fd.append('musicData', imageDataLocal);
                fd.append('imageSrc', downloadURL);

                // send `POST` request
                fetch('/upload', {
                        method: 'POST',
                        body: fd
                    })
                    .then(res => {
                        res.json();
                        window.location = "/";
                    })
                    .then(json => {
                        // console.log(json);
                        // console.log("Redirect to home");
                    })
                    .catch(err => console.log(err));
            });
        });
        //!Firebase Ends



    }

    //!Redirect to home when clicked on logo__holder
    $(".logo__text").click(function() {
        console.log("GO TO HOME");
        window.location.href = "/";
    });
});