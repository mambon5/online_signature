<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recollim les dades del formulari
    $nom = trim($_POST["name"]);
    $cognom = trim($_POST["cognom"]);
    $dni = trim($_POST["dni"]);
    $email = trim($_POST["email"]);
    $signatureData = $_POST["signature"]; // La firma en base64

    // Verifiquem que no estigui buit
    if (empty($nom) || empty($cognom) || empty($dni) || empty($email) || empty($signatureData)) {
        die("Error: Falten dades.");
    }

    // Generem la línia de text a guardar
    $firma = date("Y-m-d H:i:s") . " | $nom $cognom |  $dni |  $email\n";

    // Afegim al fitxer (a mode d'append, no sobreescriure)
    $fitxer = "firmants.txt";
    file_put_contents($fitxer, $firma, FILE_APPEND | LOCK_EX);

    echo "Firma guardada correctament.";
} else {
    die("Accés no permès.");
}
?>
