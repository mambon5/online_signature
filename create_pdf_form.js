function enviarPerPost(doc, dades) {
    // Convertir a Blob i enviar per POST
    const pdfBlob = doc.output('blob');
    const formData = new FormData();
    formData.append("pdf", pdfBlob, "firma_"+dades.dni+".pdf");

     // Afegir dades del formulari
     formData.append("name", dades.name);
     formData.append("cognom", dades.cognom);
     formData.append("dni", dades.dni);
     formData.append("email", dades.email);

    fetch("enviar_email.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    })
    .catch(error => console.error("Error:", error));
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
    const dataFirma = new Date().toLocaleString(); // Ex: "6/3/2025, 14:30:45"

    // capturem les dades abans de que les canvii el image onload
    const dadesFormulari = JSON.parse(JSON.stringify({
        name,
        cognom,
        email,
        dni
    }));

    // Afegir text al PDF
    salty = 10
    iniciy = 10
    doc.setFontSize(16);
    doc.text('Convocatoria de asamblea revocatoria y elecciones sindicales', 10, iniciy + salty);
    doc.setFontSize(12);
    doc.text('Declaro mi firma y adhesión al siguiente texto:', 10, iniciy + salty*3);
   
    // Obtenir els paràgrafs
    let text1 = document.getElementById("paragraf1").innerText;
    let text2 = document.getElementById("paragraf2").innerText;

    // Dividir el text en línies perquè s'ajusti al PDF
    let formattedText1 = doc.splitTextToSize(text1, 180);
    let formattedText2 = doc.splitTextToSize(text2, 180);

    // Escriure el text al PDF amb salts de línia
    doc.text(formattedText1, 10, iniciy + salty*4);
    doc.text(formattedText2, 10, iniciy + salty*8); // Ajustar la posició en funció de la mida del primer text


    doc.setFontSize(12);
    doc.text(`Nom: ${name}`, 10, iniciy + salty*11);
    doc.text(`Cognom: ${cognom}`, 10, iniciy + salty*12);
    doc.text(`DNI/NIF/Passaport: ${dni}`, 10, iniciy + salty*13);
    doc.text(`Email: ${email}`, 10, iniciy + salty*14);
    doc.text("Data de la firma: " + dataFirma + " CET", 10, iniciy + salty*25 );
    doc.text(`Firma:`, 10, iniciy + salty*15);

    // Afegir firma si existeix
    if (signatureData) {
        const img = new Image();
        img.src = signatureData;

        img.onload = function () {
            doc.addImage(img, 'PNG', 10, iniciy + salty*16, 200, 70);           
            doc.save('formulari_signatura.pdf');
            enviarPerPost(doc, dadesFormulari)
        };
    } else {
        doc.text('No hi ha firma.', 10, iniciy + salty*16);
        doc.save('formulari_signatura.pdf');
    }
}