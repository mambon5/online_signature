<?php
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require __DIR__ . '/vendor/autoload.php';
    echo "PHPMailer està instal·lat!";
} else {
    echo "PHPMailer NO està instal·lat!";
}
?>
