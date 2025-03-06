<?php

require_once "../config/db.php";
require_once "../utils/functions.php";


// insert data into database
if($_GET['action'] == "insertData"){
    if(!empty($_POST["first_name"]) && !empty($_POST["last_name"]) && !empty($_POST["email"]) && !empty($_POST["country"]) && !empty($_POST["gender"]) && $_FILES["image"]["size"] !== 0){
        $first_name = sanitizeInput($_POST["first_name"]);
        $last_name = sanitizeInput($_POST["last_name"]);
        $email = sanitizeInput($_POST["email"]);
        $country = sanitizeInput($_POST["country"]);
        $gender = sanitizeInput($_POST["gender"]);

        // rename the image before saving it
        $original_name = $_FILES["image"]["name"];
        $new_name = uniqid() . time() . "." . pathinfo($original_name, PATHINFO_EXTENSION);
        move_uploaded_file($_FILES["image"]["tmp_name"], "../images/" . $new_name);

        $sql = "INSERT INTO `crud`(`first_name`, `last_name`, `email`, `image`, `country`, `gender`) VALUES ('$first_name','$last_name','$email','$new_name','$country','$gender')";

        if(makeQuery($sql)){
            echo json_encode([
                "statusCode" => 200,
                "message" => "Data inserted successfully"
            ]);
        } else {
            echo json_encode([
                "statusCode" => 500,
                "message" => "Process failed"
            ]);
        }
    } else {
        echo json_encode([
            "statusCode" => 400,
            "message" => "Please fill all the required fields"
        ]);
    }
}