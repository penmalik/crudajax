<?php

require_once "../config/db.php";
require_once "../utils/functions.php";

ini_set('display_errors', 1);
error_reporting(E_ALL);

// function to delete user from database
if($_GET["action"] == "deleteUser"){
    $id = sanitizeInput($_POST["id"]);
    $delete_image = sanitizeInput($_POST["delete_image"]);

    $sql = "DELETE FROM `crud` WHERE `id`=$id";
    if(makeQuery($sql)){
        unlink("../images/" . $delete_image);
        echo json_encode([
            "statusCode" => 200,
            "message" => "Data deleted successfully"
        ]);
    } else {
        echo json_encode([
            "statusCode" => 500,
            "message" => "Failed to delete data"
        ]);
    }
}