<?php

function sanitizeInput($input)
{
    global $connect;
    return mysqli_real_escape_string($connect, htmlspecialchars(trim($input)));
}



function makeQuery($sql)
{
    global $connect;
    return mysqli_query($connect, $sql);
}
