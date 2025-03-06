<?php

require_once "../config/db.php";
require_once "../utils/functions.php";


// fetch data of a specific user
if($_GET["action"] == "fetchSingle"){
    $id = sanitizeInput($_POST["id"]);
    $sql = "SELECT * FROM `crud` WHERE `id`='$id'";
    $res = makeQuery($sql);

    if(mysqli_num_rows($res) > 0){
        $data = mysqli_fetch_assoc($res);
        header("Content-Type: application/json");
        echo json_encode([
            "statusCode" => 200,
            "data" => $data
        ]);
    } else {
        echo json_encode([
            "statusCode" => 404,
            "message" => "No user found with this ID"
        ]);
    }
    mysqli_close($connect);
}