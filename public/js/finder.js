$(function () {

    var myId;

    $(document).ready(function () {
        // This file just does a GET request to figure out which user is logged in
        // and updates the HTML on the page
        $.get("/api/user_data").then(function (data) {
            // $(".member-name").text(data.email);
            // $(".member-name").attr('data-id', data.id);
            //myId = data.id;
            myId = $(".member-name").attr('data-id')
            init();
        });

        function init() {
            // $.get(`../api/units/${myId}`, (data) => {
            //     data.forEach(item => {
            //         const li = $(`<li class="list-group-item">${item.name} : ${item.status}  </li>`);
            //         if (item.status === "requested") {
            //             const btn = $(`<button class="acceptBtn" data-requester="${item.last_request_id}" data-id="${item.id}">Accept Request</button>`);
            //             li.append(btn);
            //         }
            //         if (item.status === "occupied") {
            //             const btn = $(`<button class="openBtn" data-id="${item.id}">Make Available</button>`);
            //             li.append(btn);
            //         }
            //         const delBtn = $(`<button class="delBtn" data-id="${item.id}">Delete</button>`);
            //         li.append(delBtn);
            //         $("#units").append(li);
            //     })
            // });
            
            $.get(`../api/units/${myId}`, (data) => {
                data.forEach(item => {
                    var image ="images\\user.jpg";
                    const li = $(`<div class="card" style="width: 18rem;" id="garageIcons">
                    <img class="card-img-top" src="${image}" alt="anon user">
                    <div class="card-body">
                      <h5 class="card-title">${item.name} : ${item.status}</h5></div></div>`);
                    if (item.status === "requested") {
                        const btn = $(`<button class="acceptBtn btn btn-primary" data-requester="${item.last_request_id}" data-id="${item.id}">Accept Request</button>`);
                        li.append(btn);
                    }
                    if (item.status === "occupied") {
                        const btn = $(`<button class="openBtn btn btn-success data-id="${item.id}">Make Available</button>`);
                        li.append(btn);
                    }
                    const delBtn = $(`<button class="delBtn btn btn-warning" data-id="${item.id}">Delete Listing</button>`);
                    li.append(delBtn);
                    $("#units").append(li);
                })
            });


            // get all units that the user has requested
            $.get(`../api/units/${myId}/requested`, (data) => {
                console.log(data);
                data.forEach(item => {
                    const li = $(`<li class="list-group-item"><h5>${item.name}: ${item.address} ${item.city} ${item.state} </h5></li>`);
                    const cancelBtn = $(`<button class="cancelBtn btn btn-danger" data-id="${item.id}">Cancel Request</button>`);
                    li.append(cancelBtn);
                    $("#requested").append(li);
                })
            });

            $.get(`../api/units/${myId}/occupied`, (data) => {
                console.log(data);
                data.forEach(item => {
                    const li = $(`<li class="list-group-item"><h5>${item.name}: ${item.address} ${item.city} ${item.state}</h5> </li>`);
                    // const delBtn = $(`<button class="delBtn" data-id="${item.id}">Delete</button>`);
                    // li.append(delBtn);
                    const btn = $(`<button class="openBtn btn btn-warning" data-id="${item.id}">End Lease</button>`);
                    li.append(btn);
                    $("#occupied").append(li);
                })
            });

        }

        // list your unit for rent
        $('#submit-unit').on('click', function (e) {
            console.log(e)
            e.preventDefault();
            const data = {
                name: $("input[name=name]").val(),
                description: $("input[name=description]").val(),
                address: $("input[name=address]").val(),
                city: $("input[name=city]").val(),
                state: $("input[name=state]").val(),
                zip: $("input[name=zip]").val(),
                capacity: $("input[name=capacity]").val(),
                tools: $("input[name=tools]").val(),
                climate: $("input[name=climate]").val(),
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
                        const li = $('<li class="list-group-item">');
                        const name = $(`<h3>${item.name}</h3>`);
                        const description = $(`<p>${item.description}<p>`);
                        const address = $(`<p>${item.address} ${item.city},${item.state} ${item.zip}</p>`);
                        //if(item.image) const image = $(`<img src="${item.image}">`);
                        const features = $(`<p>capacity: ${item.capacity}, has tools: ${item.tools}, climate controlled: ${item.climate}</p>`);
                        const reqBtn = $(` <button class="reqBtn" data-id=${item.id} class="btn btn-primary">Request</button>`)
                        li.append(name, description, address, features, reqBtn);
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
        // request the unit for rent
        $(document).on('click', '.reqBtn', function (e) {
            e.preventDefault;
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
        // get all of a user's units and display them on their page


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
    });
});