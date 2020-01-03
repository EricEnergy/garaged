$(function () {
    var myId;

    $(document).ready(function () {
        $.get("/api/user_data").then(function (data) {
            myId = $(".member-name").attr('data-id')
            init();
        });

        function init() {
            $.get(`../api/units/${myId}`, (data) => {
                data.forEach(item => {
                    var image = "images/user.jpg"; 
                    if(item.image) image = item.image;
                    const li = $(`<div class="card mt-3" style="width: 18rem;" id="garageIcons">
                    <img class="card-img-top" src="${image}" alt="anon user">
                    <div class="card-body">
                      <h5 class="card-title">${item.name} :<br>${item.status}</h5><h5>${item.city} ${item.state} </h5></div></div>`);
                    if (item.status === "requested") {
                        const btn = $(`<button class="acceptBtn btn btn-primary mb-2 mr-1" data-requester="${item.last_request_id}" data-id="${item.id}">Accept Request</button>`);
                        li.append(btn);
                    }
                    if (item.status === "occupied") {
                        const btn = $(`<button class="openBtn btn btn-success mb-2 mr-1" data-id="${item.id}">Make Available</button>`);
                        li.append(btn);
                    }
                    if (!item.image){
                        const imgBtn = $(`<button class="imgBtn btn-primary btn mb-2 mr-1" data-id="${item.id}">Add Image</button>`);
                        li.append(imgBtn);
                    }
                    const delBtn = $(`<button class="delBtn btn btn-warning mb-2" data-id="${item.id}">Delete Listing</button>`);
                    li.append(delBtn);
                    $("#units").append(li);
                })
            });

            $.get(`../api/units/${myId}/requested`, (data) => {
                console.log(data);
                data.forEach(item => {
                    const li = $(`<li class="list-group-item"><h5>${item.name}</h5></li>`);
                    const addr = $(`<h5>${item.address} ${item.city} ${item.state}</h5>`);
                    let img = $(`<img class="listImg" src="/images/store.png">`);
                    if(item.image) $(img).attr('src', item.image);
                    const cancelBtn = $(`<button class="cancelBtn btn btn-danger mb-2" data-id="${item.id}">Cancel Request</button>`);
                    li.append(img,addr,cancelBtn);
                    $("#requested").append(li);
                })
            });

            $.get(`../api/units/${myId}/occupied`, (data) => {
                console.log(data);
                data.forEach(item => {
                    const li = $(`<li class="list-group-item"><h5>${item.name}</h5></li>`);
                    const addr = $(`<h5>${item.address} ${item.city} ${item.state}</h5>`);
                    let img = $(`<img class="listImg" src="/images/store.png">`);
                    if(item.image) $(img).attr('src', item.image);
                    const btn = $(`<button class="openBtn btn btn-warning" data-id="${item.id}">End Lease</button>`);
                    li.append(img,addr,btn);
                    $("#occupied").append(li);
                })
            });
        }

        // list your unit for rent
        $('#submit-unit').on('click', function (e) {
            e.preventDefault();
            const data = {
                name: $("input[name=name]").val(),
                description: $("input[name=description]").val(),
                address: $("input[name=address]").val(),
                city: $("input[name=city]").val(),
                state: $("select[name=state]").val(),
                zip: $("input[name=zip]").val(),
                capacity: $("input[name=capacity]").val(),
                tools: $("input[name=tools]").is(":checked"),
                climate: $("input[name=climate]").is(":checked"),
                userId: myId
            };
            $.post('/api/unit', data, () => {
                location.reload();
            })
        });

        // find all the units in whichever city you search
        $('#findUnits').on("click", function (e) {
            e.preventDefault();
            const data = {
                city: $("input[name=searchCity]").val(),
                state: $("select[name=searchState]").val()
            }
            $.post('/api/units/city', data, (result) => {
                if (result.length > 0) {
                    $("#findUnitsModal .modal-body").empty();
                    const available = result.filter(item => item.status === "available");
                    const ul = $('<ul class="list-group">');
                    available.forEach(item => {
                        const li = $('<li class="list-group-item mb-2">');
                        const name = $(`<h3>${item.name}</h3>`);
                        const description = $(`<p>Description: ${item.description}<p>`);
                        const address = $(`<p>${item.address} ${item.city},${item.state} ${item.zip}</p>`);
                        let image;
                        if(item.image){
                            image = $(`<img class="listImg"src="${item.image}">`);
                        } else {
                            image = $(`<img class="listImg" src="/images/store.png">`)
                        }
                        const features = $(`<p>Capacity: ${item.capacity}<br> Workshop Tools: ${item.tools}<br> Climate Controlled:  ${item.climate}</p>`);
                        const reqBtn = $(` <button class="reqBtn btn-primary float-right rounded-sm p-1" data-id=${item.id} class="btn">Request</button>`)
                        li.append(name, description, image, address, features, reqBtn);
                        ul.append(li);
                    })
                    $("#findUnitsModal .modal-body").append(ul);
                } else {
                    var message = $('<p id="errMess"> Couldnt not find a unit for that location</p>');
                    $("#errMess").remove();
                    $("#findUnitsModal .modal-body").append(message);
                }
            })
        });
          
        $(document).on('click', '.imgBtn', function(e){
            e.preventDefault();
            const unitId = $(this).data('id');
            console.log(unitId);
            // add an image
            const myWidget = cloudinary.createUploadWidget({
                cloudName: 'dvqaajrs0', 
                uploadPreset: 'preset1'
            }, (error, result) => { 
                console.log(result)
                    if (!error) { 
                        addPhoto(unitId, result.info.secure_url);
                    }
                }
            )
            myWidget.open();
        })

        // request the unit for rent
        $(document).on('click', '.reqBtn', function (e) {
            e.preventDefault();
            const data = {
                id: $(this).data('id'),
                status: "requested",
                myId: myId
            }
            console.log(data)
            $.ajax({
                url: '../api/unit/request',
                type: 'PUT',
                data: data,
                success: function (result) {
                    location.reload();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(textStatus);
                    location.reload();
                }
            });
        })

        // accept a unit request
        $(document).on('click', '.acceptBtn', function (e) {
            e.preventDefault();
            const requester = $(this).data('requester');
            const unit = $(this).data('id');
            acceptReq(unit, requester);
        });

        $(document).on('click', '.openBtn', function (e) {
            e.preventDefault();
            const unit = $(this).data('id');
            openUnit(unit);
        });

        $(document).on('click', '.cancelBtn', function (e) {
            e.preventDefault();
            const unit = $(this).data('id');
            openUnit(unit);
        });

        $(document).on('click', '.delBtn', function (e) {
            e.preventDefault();
            const unit = $(this).data('id');
            delUnit(unit);
        });

        function delUnit(unit) {
            $.ajax({
                url: '/api/unit/delete',
                type: 'DELETE',
                data: {
                    id: unit
                },
                success: function (result) {
                    location.reload();
                }
            });
        }

        function openUnit(unit) {
            $.ajax({
                url: '/api/unit/open',
                type: 'PUT',
                data: {
                    id: unit,
                    status: "available"
                },
                success: function (result) {
                    location.reload();
                }
            });
        }

        function acceptReq(unit, requester) {
            $.ajax({
                url: '/api/unit/approve',
                type: 'PUT',
                data: {
                    id: unit,
                    myId: requester
                },
                success: function (result) {
                    location.reload();
                }
            });
        }
        
        //update unit to include photo
        function addPhoto(unit, photo) {
            $.ajax({
                url: '/api/image/upload',
                type: 'PUT',
                data: {
                    id: unit,
                    imgUrl: photo
                },
                success: function (result) {
                    // location.reload();
                }
            });
        }

    });
});