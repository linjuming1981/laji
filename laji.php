<?php 

$url = 'http://www.1123.com/index.php';

$arr = parse_url($url);
echo '<pre>';
print_r($arr);