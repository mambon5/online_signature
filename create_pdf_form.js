function enviarPerPost(doc, dades) {
    // Mostra un alert de càrrega mentre s'envia el correu
    Swal.fire({
        title: 'Enviant correu...',
        text: 'Si us plau, espera uns segons.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading(); // Activa l'animació de càrrega
        }
    });

    // Convertir a Blob i enviar per POST
    const pdfBlob = doc.output('blob');
    const formData = new FormData();
    formData.append("pdf", pdfBlob, "firma_" + dades.dni + ".pdf");

    // Afegir dades del formulari
    formData.append("name", dades.name);
    formData.append("cognom", dades.cognom);
    formData.append("dni", dades.dni);
    formData.append("email", dades.email);

    return fetch("enviar_email.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        Swal.close(); // Tanca el loading
        Swal.fire({
            title: 'Correu enviat!',
            text: 'El teu correu s’ha enviat correctament.',
            icon: 'success'
        });
        return true; // Indica que el correu s'ha enviat correctament
    })
    .catch(error => {
        Swal.close(); // Tanca el loading
        Swal.fire({
            title: 'Error',
            text: 'No s’ha pogut enviar el correu. Si us plau, intenta-ho de nou.',
            icon: 'error'
        });
        return false; // Indica que hi ha hagut un error
    });
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Obtenir dades del formulari
    const name = document.getElementById('name').value;
    const cognom = document.getElementById('cognom').value;
    const dni = document.getElementById('dni').value;
    const email = document.getElementById('email').value;
    const signatureData = document.getElementById('signature-data').value;
    const dataFirma = new Date().toLocaleString();

    // Capturar les dades abans que canviï la imatge
    const dadesFormulari = { name, cognom, email, dni };

    // Afegir text al PDF
    const salty = 10;
    const iniciy = 10;
    doc.setFontSize(16);
    doc.text('Convocatoria de asamblea revocatoria y elecciones sindicales', 10, iniciy + salty);
    doc.setFontSize(12);
    doc.text('Declaro mi firma y adhesión al siguiente texto:', 10, iniciy + salty * 3);

    let text1 = document.getElementById("paragraf1").innerText;
    let text2 = document.getElementById("paragraf2").innerText;

    let formattedText1 = doc.splitTextToSize(text1, 180);
    let formattedText2 = doc.splitTextToSize(text2, 180);

    doc.text(formattedText1, 10, iniciy + salty * 4);
    doc.text(formattedText2, 10, iniciy + salty * 8);

    doc.setFontSize(12);
    doc.text(`Nom: ${name}`, 10, iniciy + salty * 11);
    doc.text(`Cognom: ${cognom}`, 10, iniciy + salty * 12);
    doc.text(`DNI/NIF/Passaport: ${dni}`, 10, iniciy + salty * 13);
    doc.text(`Email: ${email}`, 10, iniciy + salty * 14);
    doc.text("Data de la firma: " + dataFirma + " CET", 10, iniciy + salty * 25);
    doc.text(`Firma:`, 10, iniciy + salty * 15);

    if (signatureData) {
        const img = new Image();
        img.src = signatureData;

        img.onload = function () {
            doc.addImage(img, 'PNG', 10, iniciy + salty * 16, 200, 70);

            // Enviar primer el correu i després guardar el PDF
            enviarPerPost(doc, dadesFormulari).then(sent => {
                if (sent) {
                    doc.save(`firma_${dni}.pdf`);
                }
            });
        };
    } else {
        doc.text('No hi ha firma.', 10, iniciy + salty * 16);

        // Enviar primer el correu i després guardar el PDF
        enviarPerPost(doc, dadesFormulari).then(sent => {
            if (sent) {
                doc.save(`firma_${dni}.pdf`);
            }
        });
    }
}
