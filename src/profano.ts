type Input = {
  label: string;
};

type SliderInput = Input & {
  type: "slider";
  minLabel: string;
  maxLabel: string;
};

type Option = {
  text: string;
  value: string;
};

type ButtonGroup = Input & {
  type: "button";
  options: Option[];
};

type NumericInput = Input & {
  type: "numeric-input";
};

type Question = {
  key: string;
  input: SliderInput | ButtonGroup | NumericInput;
};

type Step = {
  step: number;
  key: string;
  questions: Question[];
  bookText: string;
  book: "Libro de la muerte" | "Libro de la vida";
  title?: string;
};

export const STEPS: Step[] = [
  {
    step: 1,
    key: "genero",
    title: "Sobre como nos percibimos",
    questions: [
      {
        key: "coincide",
        input: {
          type: "slider",
          label:
            "¿En qué medida el género que te asignaron al nacer coincide con el que te autopercibís?",
          minLabel: "Nada",
          maxLabel: "Totalmente"
        }
      }
    ],
    bookText:
      "“...durante la pubertad se hacen presentes ciertos cambios físicos. Pero muchas personas perciben que esas características corporales no necesariamente tienen que ver con el género con el que se perciben. Los tratamientos hormonales permiten a las personas transgénero poner en acuerdo su identidad de género autopercibida con estas características corporales.”",
    book: "Libro de la vida"
  },
  {
    step: 2,
    key: "hijes",
    title: "Sobre hijes y ganas de criar",
    questions: [
      {
        key: "actual",
        input: {
          type: "button",
          label: "¿Tenés hijes?",
          options: [
            { text: "Sí", value: "1" },
            { text: "No", value: "0" }
          ]
        }
      },
      {
        key: "intencion",
        input: {
          type: "slider",
          label: "¿Te gustaría tenerlos?",
          minLabel: "Seguro que no",
          maxLabel: "Seguro que sí"
        }
      }
    ],
    bookText:
      "“...Si nacer es uno de los hitos centrales en las trayectorias de vida de los humanos, dar lugar a ese nacimiento —es decir, transitar el parto y lo que le sigue— no se queda muy atrás…”",
    book: "Libro de la vida"
  },
  {
    step: 3,
    key: "gestacion",
    title: "Sobre aborto y personas",
    questions: [
      {
        key: "aborto",
        input: {
          type: "slider",
          label:
            "¿Hasta qué momento de la gestación te parece que es aceptable hacer un aborto?",
          minLabel: "0 semanas",
          maxLabel: "42 semanas"
        }
      },
      {
        key: "pesona",
        input: {
          type: "slider",
          label:
            "¿En qué momento de tu gestación creés que apareciste vos como persona?",
          minLabel: "0 semanas",
          maxLabel: "42 semanas"
        }
      }
    ],
    bookText:
      "“...el problema, más que por la definición del inicio de la vida, podía ser abordado en términos del estatus de un embrión o feto frente al de una persona, es decir, un ser humano.”",
    book: "Libro de la vida"
  },
  {
    step: 4,
    key: "edad",
    title: "Sobre hasta que edad queremos vivir",
    questions: [
      {
        key: "edad",
        input: {
          type: "numeric-input",
          label: "¿Qué edad tenés?"
        }
      },
      {
        key: "vivir",
        input: {
          type: "slider",
          label: "¿Hasta qué edad te gustaría vivir?",
          minLabel: "0 años",
          maxLabel: "130 años"
        }
      }
    ],
    bookText:
      "“...es imposible conocer el límite máximo de tiempo vivible para los humanos. Lo único que sabemos es que estas personas excepcionales que viven más de 110 años dificilmente llegan a los 120: ese parece ser un límite más o menos razonable.”",
    book: "Libro de la vida"
  },
  {
    step: 5,
    key: "muerte",
    title: "Sobre la muerte y la eutanasia",
    questions: [
      {
        key: "experiencia",
        input: {
          type: "slider",
          label: "¿Hay experiencia después de la muerte?",
          minLabel: "Seguro que no",
          maxLabel: "Seguro que sí"
        }
      },
      {
        key: "eutanasia",
        input: {
          type: "slider",
          label:
            "¿Te parece que una persona debe tener derecho a acceder a una eutanasia?",
          minLabel: "Seguro que no",
          maxLabel: "Seguro que sí"
        }
      }
    ],
    bookText:
      "“...la soberanía sobre los cuerpos y, más aún, sobre las existencias, es algo que no puede conquistarse tan fácil. Pero los deseos de la Interrupción Voluntaria de la Vida comienzan a ser identificados y reconocidos por los Estados, que toman nota de la situación y, en algunos casos, ensayan leyes para garantizar nuevos derechos.”",
    book: "Libro de la muerte"
  },
  {
    step: 6,
    key: "morir",
    title: "Sobre que hacemos despues de la muerte",
    questions: [
      {
        key: "cuerpo",
        input: {
          type: "slider",
          label: "¿Te interesa qué pase con tu cuerpo luego de morir?",
          minLabel: "Nada",
          maxLabel: "Mucho"
        }
      },
      {
        key: "redes",
        input: {
          type: "slider",
          label: "¿Te parece qué pase con tus redes sociales luego de morir?",
          minLabel: "Nada",
          maxLabel: "Mucho"
        }
      }
    ],
    bookText:
      "“Entonces, me explica aquello que ya conté: que hoy las personas tienen más miedo a ser enterradas vivas que a morirse. Por ello, muchos piden ser enterrados con el celular…”",
    book: "Libro de la muerte"
  }
];
