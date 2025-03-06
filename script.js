$(document).ready(function(){

    // call fetchData function
    fetchData();


    // initialize datatable
    let table = new DataTable("#myTable");


    // display image before upload
    $("input.image").change(function(){
        var file = this.files[0];
        var url = URL.createObjectURL(file);
        $(this).closest(".row").find(".preview_img").attr("src", url);
    });


    // function to fetch data from database
    function fetchData(){
        $.ajax({
            url: "handlers/get_handler.php?action=fetchData",
            type: "POST",
            dataType: "json",
            success: function(response){
                var data = response.data;
                var num = 1;
                table.clear().draw();
                $.each(data, function(index, value){
                    // console.log("Adding row for: ", value); // Log the row data to check
                    var editBtn = '<Button type="button" class="btn editBtn" value="' + value.id + '"><i class="fa-solid fa-pen-to-square fa-xl"></i></Button>';
                    var deleteBtn = '<Button type="button" class="btn deleteBtn" value="' + value.id + '"><i class="fa-solid fa-trash fa-xl"></i></Button>';
                    var hiddenVal = '<input type="hidden" class="delete_image" value="' + value.image + '"/>';
                    // console.log("Button HTML: ", button); // Log the button HTML

                    table.row.add([
                        num,
                        value.first_name,
                        value.last_name,
                        '<img src="images/' + value.image + '" style="width:50px;height:50px;border:2px solid gray;border-radius:8px;object-fit:cover;">',
                        value.email,
                        value.country,
                        value.gender,
                        editBtn + deleteBtn + hiddenVal
                    ]).draw(false);
                    num++;
                });
            }
        });
    }


    // function to insert data into database
    $("#insertForm").on("submit", function(e){
        $("#insertBtn").attr("disabled", "disabled");
        e.preventDefault();
        $.ajax({
            url: "handlers/reg_handler.php?action=insertData",
            type: "POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function(response){
                console.log(response);
                var response = JSON.parse(response);
                if(response.statusCode == 200){
                    $("#offcanvasAddUser").offcanvas("hide");
                    $("#insertBtn").removeAttr("disabled");
                    $("#insertForm")[0].reset();
                    $(".preview_img").attr("src", "images/image.png");
                    $("#successToast").toast("show");
                    $("#successMsg").html(response.message);
                    fetchData();
                } else if(response.statusCode == 500){
                    $("#offcanvasAddUser").offcanvas("hide");
                    $("#insertBtn").removeAttr("disabled");
                    $("#insertForm")[0].reset();
                    $(".preview_img").attr("src", "images/image.png");
                    $("#errorToast").toast("show");
                    $("#errorMsg").html(response.message);
                } else if(response.statusCode == 400){
                    $("#insertBtn").removeAttr("disabled");
                    $("#errorToast").toast("show");
                    $("#errorMsg").html(response.message);
                }
            }
        });
    });


    // function to fetch single user data from data
    $("#myTable").on("click", ".editBtn", function(){
        // console.log("Edit button clicked");
        var id = $(this).val();

        $.ajax({
            url: "handlers/fetch_handler.php?action=fetchSingle",
            type: "POST",
            dataType: "json",
            data: {
                id: id
            },
            success: function(response){
                var data = response.data;
                $("#editForm #id").val(data.id);
                $("#editForm input[name='first_name']").val(data.first_name);
                $("#editForm input[name='last_name']").val(data.last_name);
                $("#editForm input[name='email']").val(data.email);
                $("#editForm select[name='country']").val(data.country);
                $("#editForm .preview_img").attr("src", "images/" + data.image + "");
                $("#editForm #image_old").val(data.image);

                if(data.gender == "male"){
                    $("#editForm input[name='gender'][value='male']").attr("checked", true);
                } else if(data.gender == "female"){
                    $("#editForm input[name='gender'][value='female']").attr("checked", true);
                }

                // show the edit user offcanvas
                $("#offcanvasEditUser").offcanvas("show");
            }
        });
    });


    // function to update user data in database
    $("#editForm").on("submit", function(e){
        $("#editBtn").attr("disabled", "disabled");
        e.preventDefault();
        $.ajax({
            url: "handlers/update_handler.php?action=updateData",
            type: "POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function(response){
                console.log(response);
                var response = JSON.parse(response);
                if(response.statusCode == 200){
                    $("#offcanvasEditUser").offcanvas("hide");
                    $("#editBtn").removeAttr("disabled");
                    // $("#editForm")[0].reset();
                    $(".preview_img").attr("src", "images/image.png");
                    $("#successToast").toast("show");
                    $("#successMsg").html(response.message);
                    fetchData();
                } else if(response.statusCode == 500){
                    $("#offcanvaseditUser").offcanvas("hide");
                    $("#editBtn").removeAttr("disabled");
                    $("#editForm")[0].reset();
                    $(".preview_img").attr("src", "images/image.png");
                    $("#errorToast").toast("show");
                    $("#errorMsg").html(response.message);
                } else if(response.statusCode == 400){
                    $("#editBtn").removeAttr("disabled");
                    $("#errorToast").toast("show");
                    $("#errorMsg").html(response.message);
                }
            }
        });
    });


    // function to delete user data from database
    $("#myTable").on("click", ".deleteBtn", function(){
        if(confirm("Are you sure you want to delete this user?")){
            var id = $(this).val();
            var delete_image = $(this).closest("td").find(".delete_image").val();

            $.ajax({
                url: "handlers/delete_handler.php?action=deleteUser",
                type: "POST",
                dataType: "json",
                data: {
                    id,
                   delete_image
                },
                success: function(response){
                    console.log('Delete response:', response);
                    if(response.statusCode == 200){
                        fetchData();
                        $("#successToast").toast("show");
                        $("#successMsg").html(response.message);
                    } else if(response.statusCode == 500){
                        $("#errorToast").toast("show");
                        $("#errorMsg").html(response.message);
                    }
                },
                error: function(xhr, status, error){
                    console.log('Error in delete request:', status, error);
                }
            });
        }
    });


});



