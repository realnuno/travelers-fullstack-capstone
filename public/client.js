$(function() {


//==================================== Login ================================


     $("#login-form").submit(function (event) {
        event.preventDefault();

        let logUser = {
            email: $("#login-email-input").val(),
            password: $("#login-password-input").val()
        };



        $.ajax({
            url: `/api/auth/login`,
            data: JSON.stringify(logUser),
            error: function (error) {
                console.log("error", error);
            },
            success: function (data) {
                localStorage.setItem("token", data.authToken);
                $(".search-section").show();
                $(".nav-section").show();
                $(".login-section").hide();
                },
            type: 'POST',
            contentType: 'application/json',
            dataType: "json",
        });

    });


//=========================== Login Button ==============================

    $(".change-to-log-in-button").click(e => {

        $(".login-section").show();
        $(".signup-section").hide();
    })








//====================================  Sign Up  ===============================

    $(".signup-form").submit(function (event) {
        event.preventDefault();

        let user = {
            name: $("#name-input").val(),
            email: $("#email-input").val(),
            password: $("#password-input").val()
        };

        let loginUser = {
            email: $("#email-input").val(),
            password: $("#password-input").val()
        };

        //        console.log(user);

        $.ajax({
            url: '/api/users',
            data: JSON.stringify(user),
            error: function (error) {
                alert(error.responseJSON.message);
            },
            success: function (data) {

                $.ajax({
                    url: `/api/auth/login`,
                    data: JSON.stringify(loginUser),
                    error: function (error) {
                        console.log("error", error);
                    },
                    success: function (data) {

                        $(".search-section").show();
                        $(".nav-section").show();
                        $(".signup-section").hide();

                        loginUserName = loginUser.email;
                        localStorage.setItem("token", data.authToken);
                    },
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json"
                });
            },
            type: 'POST',
            contentType: 'application/json',
            dataType: "json",
        });

    })




//============================ Sign UP Button =====================================

    $(".sign-up-button").click(e => {

        e.preventDefault();

        $(".login-section").hide();
        $(".signup-section").show();
    })







//    ==================================== Log out =========================




    const logOut = function () {

//        location.reload();

        localStorage.setItem("token", "");

        venueName = '';
        phoneNumber = '';
        category = '';
        description = '';
        website = '';
        address1 = '';
        address2 = '';
        photo1 = '';
        photo2 = '';

    };


    $("#nav-logout-button").click(function (event) {
        event.preventDefault();

        logOut();

        $(".login-section").show();
        $(".signup-section").hide();
        $(".search-section").hide();
        $(".result-section").hide();
        $(".more-info-section").hide();
        $(".mylist-section").hide();
        $(".nav-section").hide();
    });











//    ===================== Foursquare API ============================


    $(".search-form").submit(event => {

        event.preventDefault();
        event.stopPropagation();
        //        $('html').animate({
        //            scrollTop: 1250
        //        }, 'fast');





        const queryTarget = $(event.currentTarget).find("#search-input");
        query = queryTarget.val();

        queryTarget.val("");

        getResults(query);

    });


    function getResults(userInput) {



        const renderResults = function(inputResults, index) {

                const venueName = inputResults.venue.name;
                const category = inputResults.venue.categories[0].name;
                const address1 = inputResults.venue.location.formattedAddress[0];
                const address2 = inputResults.venue.location.formattedAddress[1];
                const address = `${address1}, ${address2}`;
                const venueId = inputResults.venue.id;

                return  `
                    <li class="col-6">
                        <div class="inner-search-result" >
                            <p class="result-venue-name">${venueName}</p>
                            <p class="result-category">${category}</p>
                            <p class="result-address"> ${address} </p>
                            <iframe width="600" height="400" id="result_gmap_canvas" src="https://maps.google.com/maps?q=${address}&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe><br/>
                            <button type="submit" class="button detailButton" data-index=${venueId}>more info</button>
                        </div>
                    </li>`
        };

        $.ajax({
            url: "/api/search",
            data: {
                q: userInput
            },
            type: "GET",
            dataType: "json",
            success: function(data) {
                if(data.response.groups !== undefined){
                    const results = data.response.groups[0].items;
                    const displayResult = results.map((item, index) => {
                        return renderResults(item, index);
                    });
                    $(".result-section").show();
                    $(".foursquare-search-result ul").html(displayResult);

                    $('html, body').animate({
                        scrollTop: $('.foursquare-search-result').offset().top
                    }, 1000);

                } else if(data.response.groups === undefined){
                    const noResultText = `
							<li>
							<p class="sorry-message">Sorry, There is no result. Search again, please.</p>
							</li>`;
                    $(".result-section").show();
                    $(".foursquare-search-result ul").html(noResultText);
                    $('html, body').animate({
                        scrollTop: $('.foursquare-search-result').offset().top
                    }, 1000);
                }

            },
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });
    };



//================================= Search button ===============================

    $("#nav-search-button").click(e => {

        e.preventDefault();

        $(".search-section").show();
        $(".result-section").hide();
        $(".more-info-section").hide();
        $(".mylist-section").hide();
    })








//    ===============================  More Info Button ============================


    $(".foursquare-search-result ul").on("click", ".detailButton", function(e) {

        e.preventDefault();
        e.stopPropagation();

        venueResultId = $(this).attr("data-index");


        getVenueDetail(venueResultId);
    });

    let detailVenueName = '';
    let detailPhoneNumber = '';
    let detailCategory = '';
    let detailDescription = '';
    let detailWebsite = '';
    let detailAddress = '';
    let detailPhoto1 = '';
    let detailPhoto2 = '';


    function getVenueDetail(inputVenueId) {


        function renderDetailResult(inputData) {


//            console.log(inputData);
            if(inputData.response.venue.contact.formattedPhone === undefined){
                detailPhoneNumber = "Sorry.. No Phone number is available"
            } else {
                detailPhoneNumber = inputData.response.venue.contact.formattedPhone;
            };

            if(inputData.response.venue.description === undefined){
                detailDescription = "Sorry.. No Description is available"
            } else {
                detailDescription = inputData.response.venue.description;
            };

            if(inputData.response.venue.url === undefined){
                detailWebsite = "Sorry.. No Website is available"
            } else {
                detailWebsite = inputData.response.venue.url;
            };

            detailVenueName = inputData.response.venue.name;
            detailCategory = inputData.response.venue.categories[0].name;
            detailAddress1 = inputData.response.venue.location.formattedAddress[0];
            detailAddress2 = inputData.response.venue.location.formattedAddress[1];
            detailAddress = `${detailAddress1}, ${detailAddress2}`;

            return `
                <div class="col-6">
                    <div class="detail-photo-map-section">
                        <img src='${detailPhoto1}' height="400" width="400">
                        <img src='${detailPhoto2}' height="400" width="400">
                        <iframe width="600" height="400" id="gmap_canvas" src="https://maps.google.com/maps?q=${detailAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                    </div>
                </div>
                <div class="col-6">
                    <div class="information-section">
                        <p class='result-category'>category : <span class='what-place'>${detailCategory}</span></p>
                        <p class='result-description'>description : ${detailDescription}</p>
                        <p class='result-phone-number'>phone : ${detailPhoneNumber}</p>
                        <p class='result-website'>website : ${detailWebsite}</p>
                        <p class='result-address'>address : ${detailAddress}</p>
                        <textarea rows="4" cols="50" class="note-textarea" placeholder="note.."></textarea>
                    </div>
                </div>
                <div class="col-12 detail-buttons">
                    <button class='button add-item-button'>add</button>
                    <button class='button back-to-list-button'>back to list</button>
                </div>
                `
        };


        function renderPhotos(inputData) {

            if(inputData.response.photos.count === 0){

                detailPhoto1 = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
                detailPhoto2 = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
                console.log(detailPhoto1)
            }else if(inputData.response.photos.count === 1){
                const photo1Prefix = inputData.response.photos.items[0].prefix;
                const photo1Suffix = inputData.response.photos.items[0].suffix;
                const photo1Height = inputData.response.photos.items[0].height;
                const photo1Width = inputData.response.photos.items[0].width;
                detailPhoto1 = `${photo1Prefix}${photo1Height}${photo1Width}${photo1Suffix}`;
                detailPhoto2 = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
            }else {
                const photo1Prefix = inputData.response.photos.items[0].prefix;
                const photo1Suffix = inputData.response.photos.items[0].suffix;
                const photo1Height = inputData.response.photos.items[0].height;
                const photo1Width = inputData.response.photos.items[0].width;
                detailPhoto1 = `${photo1Prefix}${photo1Height}${photo1Width}${photo1Suffix}`;

                const photo2Prefix = inputData.response.photos.items[1].prefix;
                const photo2Suffix = inputData.response.photos.items[1].suffix;
                const photo2Height = inputData.response.photos.items[1].height;
                const photo2Width = inputData.response.photos.items[1].width;
                detailPhoto2 = `${photo2Prefix}${photo2Height}${photo2Width}${photo2Suffix}`;
            }
        }



         $.ajax({
            url: "/api/search-more",
            data: {
                venueId: inputVenueId
            },
            type: "GET",
            dataType: "json",
            success: function(data) {

                const html = renderDetailResult(data);

                const venueName = data.response.venue.name;

                $(".login-section").hide();
                $(".signup-section").hide();
                $(".search-section").hide();
                $(".result-section").hide();
                $(".more-info-section").show();

                $("#venue-name").text(venueName);
                $("#detail-info-results").html(html);

                $('html').animate({
                    scrollTop: 10
                        }, 'fast');
            },
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        $.ajax({
            url: "/api/search-photos",
            data: {
                venueId: inputVenueId
            },
            type: "GET",
            dataType: "json",
            success: function(data) {

                renderPhotos(data);
            },
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })

    };


//=============================== Add Item Button ====================

    $("#detail-info-results").on('click', '.add-item-button', e => {

        e.preventDefault();
        e.stopPropagation();

        const memo = $(".note-textarea").val();

        const mylist = {
            venueName: detailVenueName,
            phoneNumber: detailPhoneNumber,
            category: detailCategory,
            description: detailDescription,
            website: detailWebsite,
            address: detailAddress,
            photo1: detailPhoto1,
            photo2: detailPhoto2,
            memo
        }

        $.ajax({
                url: `/api/mylist/add-item`,
                data: JSON.stringify(mylist),
                error: function (error) {
                    console.log("error", error);
                },
                success: function (data) {

//                  $('html, body').animate({
//                      scrollTop: $('html, body').offset().top
//                  }, 1000);
//                    console.log(data);
                    $(".login-section").hide();
                    $(".signup-section").hide();
                    $(".search-section").hide();
                    $(".result-section").hide();
                    $(".more-info-section").hide();
                    $(".mylist-section").show();
                    displayMylist();

                },
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                type: "POST",
                contentType: "application/json",
                dataType: "json"
                });
    });








//=================================== Back to List Button ==========================

    $("#detail-info-results").on('click', '.back-to-list-button', e => {

        e.preventDefault();


        $(".search-section").show();
        $(".result-section").show();
        $(".more-info-section").hide();
        $('html, body').animate({
                        scrollTop: $('.foursquare-search-result').offset().top
                    }, 1000);

    });












//======================== Display My List =========================




    let mylistData = [];

    const displayMylist = function() {

        const renderResults = function (resultInput, index) {
            console.log(resultInput);

            return `
                <li>
                    <hr class="divideLine">
                    <div class="row displayMylist">
                        <div class="col-12">
                            <h2 id="mylist-venue-name">${resultInput.venueName}</h2>
                        </div>
                        <div class="col-6">
                            <div class="detail-photo-map-section">
                                <img src='${resultInput.photo1}' height="400" width="400">
                                <img src='${resultInput.photo2}' height="400" width="400">
                                <iframe width="600" height="400" id="gmap_canvas" src="https://maps.google.com/maps?q=${resultInput.address}&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="information-section">
                                <p class='added-time'>${resultInput.creationDate}</p>
                                <p class='result-category'>category : <span class='what-place'>${resultInput.category}</span></p>
                                <p class='result-description'>description : ${resultInput.description}</p>
                                <p class='result-phone-number'>phone : ${resultInput.phoneNumber}</p>
                                <p class='result-website'>website : ${resultInput.website}</p>
                                <p class='result-address'>address : ${resultInput.address}</p>
                                <p class='result-memo'>note : <span class='memo-display'>${resultInput.memo}</span></p>
                            </div>
                        </div>
                        <div class="col-12 mylist-buttons">
                            <button class="button edit-button" listItem-index="${index}">edit note</button>
                            <button class="button delete-button" item-index="${index}">delete</button>
                        </div>
                    </div>
                </li>
                `


        };

        $.ajax({
            url: "/api/mylist/get-user-list",
            dataType: "json",
            type: "GET",
            success: function (data) {

                mylistData = data;

                const displayResults = data.map((item, index) => {
                    return renderResults(item, index);
                });

                $(".mylist-results ul").html(displayResults);
                $('html, body').animate({
                        scrollTop: $('html, body').offset().top
                    }, 300);

            },
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            error: function (error) {
                console.log(error);
            }
        });
    };







//=================== Mylist Button ==========================================

    $("#nav-mylist-button").click (e => {

        e.preventDefault();
        e.stopPropagation();

        displayMylist();

        $(".login-section").hide();
        $(".signup-section").hide();
        $(".search-section").hide();
        $(".result-section").hide();
        $(".more-info-section").hide();
        $(".mylist-section").show();
    })















//===================== Edit Button ========================================



    $(".mylist-results ul").on("click", ".edit-button", function(e) {

        e.preventDefault();
        e.stopPropagation();

        const editItem = mylistData[$(this).attr("listItem-index")];

        const editItemDisplay =
                    `<div class="row displayMylist">
                        <div class="col-6">
                            <div class="detail-photo-map-section">
                                <img src='${editItem.photo1}' height="400" width="400">
                                <img src='${editItem.photo2}' height="400" width="400">
                                <iframe width="600" height="400" id="gmap_canvas" src="https://maps.google.com/maps?q=${editItem.address}&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="information-section">
                                <p class='added-time'>${editItem.creationDate}</p>
                                <p class='result-category'>category : <span class='what-place'>${editItem.category}</span></p>
                                <p class='result-description'>description : ${editItem.description}</p>
                                <p class='result-phone-number'>phone : ${editItem.phoneNumber}</p>
                                <p class='result-website'>website : ${editItem.website}</p>
                                <p class='result-address'>address : ${editItem.address}</p>
                                <textarea rows="4" cols="50" class="note-textarea"></textarea>
                            </div>
                        </div>
                        <div class="col-12 mylist-buttons">
                            <button class='button edit-save-button'>save</button>
                        </div>
                    </div>`


        $(".login-section").hide();
        $(".signup-section").hide();
        $(".search-section").hide();
        $(".result-section").hide();
        $(".more-info-section").show();
        $(".mylist-section").hide();

        $("#venue-name").text(editItem.venueName);
        $("#detail-info-results").html(editItemDisplay);
        $(".note-textarea").val(editItem.memo);

		$('html, body').animate({
                 scrollTop: $('html, body').offset().top
                 }, 200);

   






//============================= Edit Save Button ========================================


        $(".edit-save-button").click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            let editedMylist = {
                    memo: $(".note-textarea").val(),
                    id: editItem.id
                };

                console.log(editedMylist);

                $.ajax({
                    url: `/api/mylist/edit-memo/${editItem.id}`,
                    data: JSON.stringify(editedMylist),
                    error: function (error) {
                        console.log("error", error);
                    },
                    success: function (data) {
//                        console.log(data);
                        //                  $('html, body').animate({
//                      scrollTop: $('html, body').offset().top
    //                  }, 1000);
                        $(".login-section").hide();
                        $(".signup-section").hide();
                        $(".search-section").hide();
                        $(".result-section").hide();
                        $(".more-info-section").hide();
                        $(".mylist-section").show();
                        displayMylist();

                        $('html, body').animate({
                        scrollTop: $('html, body').offset().top
                    }, 300);

                    },
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    type: "PUT",
                    contentType: "application/json",
                    dataType: "json"
                });
        })
    });





//====================== Delete Button =====================================

    $(".mylist-results ul").on("click", ".delete-button", function (event) {

        event.stopPropagation();
        event.preventDefault();

        const deleteItem = mylistData[$(this).attr("item-index")];
        console.log(deleteItem.id);

        $.ajax({
            url: `/api/mylist/${deleteItem.id}`,
            error: function (error) {
                console.log("error", error);
            },
            success: function (data) {

                displayMylist();

            },
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            type: "DELETE",
            contentType: "application/json",
            dataType: "json"
        });

    });



//=================== Search Nav Button =======================

    $(".nav-search-button").click(e => {

        $(".login-section").hide();
        $(".signup-section").hide();
        $(".search-section").show();
        $(".result-section").hide();
        $(".more-info-section").hide();
        $(".mylist-section").hide();
    })


});

