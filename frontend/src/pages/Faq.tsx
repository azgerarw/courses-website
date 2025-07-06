export default function FAQ() {

  type Pregunta = {pregunta: string, respuesta: string };

  const preguntas: Pregunta[] = [
    {
      pregunta: "¿Cómo me registro?",
      respuesta: "Haz clic en el botón de registro y completa el formulario."
    },
    {
      pregunta: "¿Los cursos tienen certificado?",
      respuesta: "Sí, todos los cursos ofrecen un certificado al finalizar."
    },
    {
      pregunta: "¿Puedo acceder a las clases grabadas?",
      respuesta: "Sí, tendrás acceso a todas las clases grabadas."
    },
    {
      pregunta: "¿Puedo inscribirme a más de uno?",
      respuesta: "Sí, te puedes inscribir a todos los que."
    }
  ];

  return (
    <>
      <h2>Preguntas Frecuentes</h2>
      <div className="flex flex-col gap-2 w-auto h-dvh m-auto">
        
        {preguntas.map((item, index) => (
          <details key={index} className="faq-item">
            <summary className="font-bold cursor-pointer">{item.pregunta}</summary>
            <p className=" mt-2 h-[30px] p-[10px] w-fit m-auto text-center shadow-[0px_0px_5px_0px_black]">{item.respuesta}</p>
          </details>
        ))}
      </div>
    </>
  );
}
