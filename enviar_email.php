<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Assegura't que PHPMailer està instal·lat

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verificar si el fitxer ha estat enviat
    if (!isset($_FILES['pdf']) || $_FILES['pdf']['error'] !== UPLOAD_ERR_OK) {
        die("Error al pujar el fitxer.");
    }

    $mail = new PHPMailer(true);
    
    try {
        // Configuració del servidor SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com'; // Servidor SMTP
        $mail->SMTPAuth = true;
        $mail->Username = 'info@fist.cat'; // El teu correu
        $mail->Password = 'Inffist28?'; // La teva contrasenya
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Encriptació
        $mail->Port = 587; // Port SMTP

        // Destinataris
        $mail->setFrom('info@fist.com', 'Fist Signatures');
        $mail->addAddress('romdommas@gmail.com', 'Destinatari');

        // Adjuntar el PDF
        $pdfPath = $_FILES['pdf']['tmp_name'];
        $pdfName = $_FILES['pdf']['name'];
        $mail->addAttachment($pdfPath, $pdfName);

        // Contingut del correu
        $mail->isHTML(true);
        $mail->Subject = 'Nova firma electrònica';
        $mail->Body = 'S\'ha rebut una nova firma electrònica. Adjuntem el document PDF.';
        
        // Enviar correu
        $mail->send();
        echo "El correu s'ha enviat correctament.";
    } catch (Exception $e) {
        echo "Error en enviar el correu: {$mail->ErrorInfo}";
    }
}
?>
