<?php 

$url = 'http://www.123.com/index.php';

$arr = parse_url($url);
echo '<pre>';
print_r($arr);