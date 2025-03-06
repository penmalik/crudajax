<?php

require_once "../config/db.php";
require_once "../utils/functions.php";

// function to get data from database
if($_GET['action']  == "fetchData"){
    $sql = "SELECT * FROM  `crud`";
    $res = makeQuery($sql);
    $data = [];

    while($row = mysqli_fetch_assoc($res)){
        $data[] = $row;
    }
    mysqli_close($connect);
    header('Content-type: application/json');
    echo json_encode([
        "data" => $data
    ]);
}