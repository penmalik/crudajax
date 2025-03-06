<?php

require_once "../config/db.php";
require_once "../utils/functions.php";


// fucntion to update user data in database
if($_GET["action"] == "updateData"){

    if(!empty($_POST["first_name"]) && !empty($_POST["last_name"]) && !empty($_POST["email"]) && !empty($_POST["country"]) && !empty($_POST["gender"])){

        $id = sanitizeInput($_POST["id"]);
        $first_name = sanitizeInput($_POST["first_name"]);
        $last_name = sanitizeInput($_POST["last_name"]);
        $email = sanitizeInput($_POST["email"]);
        $country = sanitizeInput($_POST["country"]);
        $gender = sanitizeInput($_POST["gender"]);

        if ($_FILES["image"]["size"] !== 0) {
            // rename the image before saving it
            $original_name = $_FILES["image"]["name"];
            $new_name = uniqid() . time() . "." . pathinfo($original_name, PATHINFO_EXTENSION);
            move_uploaded_file($_FILES["image"]["tmp_name"], "../images/" . $new_name);
            $old_image = $_POST["image_old"];
            $old_image_path = "../images/" . $old_image;

            if (file_exists($old_image_path) && !is_dir($old_image_path)) {
                unlink($old_image_path);
            } else {
                echo "Old image file not found or it's a directory.";
            }
            
            // remove the old image from images directory
            // unlink("../images/" . $old_image);
        } else {
            $old_image = $_POST["image_old"];
            $new_name = sanitizeInput($old_image);
        }

        $sql = "UPDATE `crud` SET `first_name`='$first_name',`last_name`='$last_name',`email`='$email',`image`='$new_name',`country`='$country',`gender`='$gender' WHERE `id`='$id'";
        $res = makeQuery($sql);
        if(makeQuery($sql)){
            echo json_encode([
                "statusCode" => 200,
                "message" => "Data updated successfully"
            ]);
        } else {
            echo json_encode([
                "statusCode" => 500,
                "message" => "Failed to update user"
            ]);
        }
        // mysqli_close($connect);
    } else {
        echo json_encode([
            "statusCode" => 400,
            "message" => "Please fill all the required fields"
        ]);
    }

}