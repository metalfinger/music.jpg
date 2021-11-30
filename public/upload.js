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

    $(".upload__server__btn").click(function() {
        console.log("Upload Clicked");
        uploadFile();

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


        imageDataLocal = [];
        pixelData = [];


        //!Main Grid Divider
        var widthDivider = 8;
        var heightDivider = 4;

        var pixelsInWidth = parseInt(imageWidth / widthDivider);
        var pixelsInHeight = parseInt(imageHeight / heightDivider);

        //!Travelling through All the pixels
        for (var j = 0; j < heightDivider; j++) {
            for (var i = 0; i < widthDivider; i++) {


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
                        averageRGB[1] = (averageRGB[1] + rgbaData[1]) / 2;
                        averageRGB[2] = (averageRGB[2] + rgbaData[2]) / 2;
                    }
                }

                imageDataLocal.push(averageRGB);
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

        const input = document.getElementById('file-upload');

        let file = input.files[0];

        console.log("FILE");
        console.log(file);

        // add file to FormData object

        let fd = new FormData();
        fd.append('sampleFile', file);
        fd.append('musicData', imageDataLocal);


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

        fetch('/getall', {
                method: 'POST',
                body: {}

            })
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.log(err));
    }

    //!Redirect to home when clicked on logo__holder
    $(".logo__text").click(function() {
        console.log("GO TO HOME");
        window.location.href = "/";
    });
});