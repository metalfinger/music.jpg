$(document).ready(function() {

    sortByRecent();

    $(".recent__btn").click(function() {
        sortByRecent();
    });

    $(".sort__btn").click(function() {
        sortByNumPlayed();
    });

    function sortByRecent() {
        $(".selected").removeClass("selected");
        $(".recent__btn").addClass("selected");

        $(".art__grid").empty();
        fetchAllData('createdAt');
    }

    function sortByNumPlayed() {
        $(".selected").removeClass("selected");
        $(".sort__btn").addClass("selected");

        $(".art__grid").empty();
        fetchAllData('numPlayed');
    }


    let musicData = [];

    //Fetch all data from database  
    function fetchAllData(filterType) {


        fetch('getall', {
                method: 'POST',
                body: JSON.stringify({ data: filterType }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(json => {
                console.log(json);
                console.log(json[0].id);
                console.log(json[0].data);

                for (let index = 0; index < json.length; index++) {
                    const element = json[index].data;

                    if (element.imageSrc != null) {
                        console.log(index, element.imageSrc);

                        let imageUrl = element.imageSrc;
                        let thisElementID = json[index].id;

                        // imageUrl = imageUrl.replace(/\//g, "//'");

                        console.log(imageUrl);

                        let subInnerHtml =
                            '<div class="art__unit">' +
                            '    <div class="art__image__holder">' +
                            '        <div class="art__image">' +
                            '            <div class="art__image__wrapper"><img src="' + imageUrl.toString() + '" class="art__image__instance"></div>' +
                            '        </div>' +
                            '    </div>' +
                            '    <div class="art__btn__holder">' +
                            '        <div class="btn__wrapper play__art" data-played=' + element.numPlayed + ' data-index=' + thisElementID.toString() + '>' +
                            '            <div class="btn__text"><div class="played__data">▶ play</div> </br>(Played ' + element.numPlayed + ' times)</div>' +
                            '        </div>' +
                            '    </div>' +
                            '</div>';

                        $("#art__container").append(subInnerHtml);
                    }
                }

                //!Add Button Click Event
                $(".play__art").click(function() {
                    console.log("Play Button Clicked");
                    console.log($(this));
                    let thisElementID = $(this).attr("data-index");
                    console.log(thisElementID);



                    let parentOfImageHolder = $(this).closest(".art__unit").find(".art__image__wrapper");

                    getMusicNotes(thisElementID, parentOfImageHolder, $(this).find(".btn__text"));
                });
            });


        // fetch('/getallold', {
        //         method: 'POST',
        //         body: JSON.stringify({ data: "data" }),
        //     })
        //     .then(res => {
        //         res.json();
        //         console.log(res.body);
        //     })
        //     .then(json => {
        //         console.log("Data is Here");
        //         console.log(json);
        //         //     // console.log(json.length);


        //         // for (let index = 0; index < json.length; index++) {
        //         //     const element = json[index];

        //         //     if (element.FileName != null) {
        //         //         console.log(index, element.FileName);

        //         //         let imageUrl = "myimages/" + element.FileName;
        //         //         let thisElementID = element._id;

        //         //         // imageUrl = imageUrl.replace(/\//g, "//'");

        //         //         console.log(imageUrl);

        //         //         let subInnerHtml =
        //         //             '<div class="art__unit">' +
        //         //             '    <div class="art__image__holder">' +
        //         //             '        <div class="art__image">' +
        //         //             '            <div class="art__image__wrapper"><img src="' + imageUrl.toString() + '" class="art__image__instance"></div>' +
        //         //             '        </div>' +
        //         //             '    </div>' +
        //         //             '    <div class="art__btn__holder">' +
        //         //             '        <div class="btn__wrapper play__art" data-index=' + thisElementID.toString() + '>' +
        //         //             '            <div class="btn__text">▶ play</div>' +
        //         //             '        </div>' +
        //         //             '    </div>' +
        //         //             '</div>';
        //         //         // '<div class="art__unit">' +
        //         //         // '    <div class="art__image__holder">' +
        //         //         // '        <div class="art__image" style="background-image:url(' + imageUrl.toString() + ');"></div>' +
        //         //         // '    </div>' +
        //         //         // '    <div class="art__btn__holder">' +
        //         //         // '        <div class="btn__wrapper play__art" data-index=' + thisElementID.toString() + '>' +
        //         //         // '            <div class="btn__text">play</div>' +
        //         //         // '        </div>' +
        //         //         // '    </div>' +
        //         //         // '</div>';

        //         //         $("#art__container").append(subInnerHtml);
        //         //     }
        //         // }

        //         // //!Add Button Click Event
        //         // $(".play__art").click(function() {
        //         //     console.log("Play Button Clicked");
        //         //     console.log($(this));
        //         //     let thisElementID = $(this).attr("data-index");
        //         //     console.log(thisElementID);

        //         //     let parentOfImageHolder = $(this).closest(".art__unit").find(".art__image__wrapper");

        //         //     getMusicNotes(thisElementID, parentOfImageHolder, $(this).find(".btn__text"));
        //         // });
        //     })
        //     .catch(err => console.log(err));
    }

    function getMusicNotes(_id, parentOfImageHolder, thisPlayBtn) {


        let fd = new FormData();
        fd.append('id', _id);

        fetch('/getmusicnotes', {
                method: 'POST',
                body: JSON.stringify({ data: _id }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(json => {

                console.log(json.musicData);
                console.log(json.numPlayed);

                // // console.log(json[0].MusicData);
                // // console.log(typeof(json[0].MusicData));

                var array = json.musicData.split(',');
                console.log(array);
                console.log("MAGIC ", array.length);

                let imageDataLocal = [];

                for (let i = 0; i < array.length; i = i + 3) {
                    console.log(i, array[i], array[i + 1], array[i + 2]);
                    const averageRGB = [Number(array[i]), Number(array[i + 1]), Number(array[i + 2])];
                    imageDataLocal.push(averageRGB);
                }

                console.log(imageDataLocal);

                musicData = imageDataLocal;

                //!Updata data-played attribute
                $(thisPlayBtn).parent().attr("data-played", json.numPlayed + 1);
                playSound(musicData, parentOfImageHolder, false, thisPlayBtn);

                //!Maintain Play Button Status
                $(".art__unit").addClass("disable__btn");
                $(thisPlayBtn).closest(".art__unit").removeClass("disable__btn");

                //!Select this Button
                $(thisPlayBtn).closest(".art__unit").addClass("selected");
                $(thisPlayBtn).addClass("selected");

                //!Disable Other Buttons
                $(".sort__btn").addClass("disable__btn");
                $(".recent__btn").addClass("disable__btn");
            });
    }

    //!Redirect to Upload.html when clicked on upload__btn
    $(".upload__btn").click(function() {
        window.location.href = "/upload.html";
    });

    //!Redirect to home when clicked on logo__holder
    $(".logo__text").click(function() {
        console.log("GO TO HOME");
        window.location.href = "/";
    });

});