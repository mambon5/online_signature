<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Assegura't que PHPMailer està instal·lat

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verificar si el fitxer ha estat enviat
    if (!isset($_FILES['pdf']) || $_FILES['pdf']['error'] !== UPLOAD_ERR_OK) {
        die("Error al pujar el fitxer." . $_FILES['pdf']['error']);
    }

    $mail = new PHPMailer(true);

     // Agafar dades del formulari
     $nom = trim($_POST['name']);
     $cognom = trim($_POST['cognom']);
     $dni = trim($_POST['dni']);
     $email = trim($_POST['email']); // Email del firmant
    
    try {
        // Configuració del servidor SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com'; // Servidor SMTP
        $mail->SMTPAuth = true;
        $mail->Username = 'auto@fist-demokratian.com'; // El teu correu
        $mail->Password = 'Inf****'; // La teva contrasenya
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Encriptació
        $mail->Port = 587; // Port SMTP

        // Destinataris
        $mail->setFrom('auto@fist-demokratian.com', "Firma eleccions TELUS $dni");
        $mail->addAddress('info@fist.cat', 'FIST');
        $mail->addAddress('telus@fist.cat', 'FIST');
        $mail->addAddress($email, "$nom $cognom"); // Enviar també al signant

       

        // Validar email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            die("Error: L'adreça de correu $email del firmant no és vàlida.");
        }

        // Adjuntar el PDF
        $pdfPath = $_FILES['pdf']['tmp_name'];
        $pdfName = $_FILES['pdf']['name'];
        $mail->addAttachment($pdfPath, $pdfName);

        // Contingut del correu
        $mail->isHTML(true);
        $mail->Subject = 'firma per convocar eleccions a TELUS';
        // Missatge personalitzat
        $mail->Body = "
            <p>Benvolgut/da <strong>$nom $cognom</strong>,</p>
            <p>Gràcies per signar la petició de revocar el comité d'empresa a Telus i la convocatòria d'eleccions a l'empresa. A continuació, t'adjuntem el document signat.</p>
            <p><strong>DNI/NIF/Passaport:</strong> $dni</p>
            <p>Si tens algun dubte, no dubtis a contactar amb nosaltres.</p>
            <p>Atentament,</p><p><strong>FIST</strong> (Força Independent Sindical de Treballadorxs)</p>
            <p>No respongueu a aquest email, per qualsevol consulta contacteu <strong>telus@fist.cat</strong></p>
        ";

        
        // Enviar correu
        $mail->send();
        echo "El correu s'ha enviat correctament.";
    } catch (Exception $e) {
        echo "Error en enviar el correu: {$mail->ErrorInfo}";
    }
}
?>
