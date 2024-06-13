// ogni post contiene:
// id = numero unico, non devono esserci id uguali
// title = titolo del post
// slug = testo minuscolo e senza spazi,usa il trattino per separare le parole. Anche questo deve essere unico, sarà il testo cher apparirà in url
// anteprima_img = img di anteprima che mostriamo in lista e nella parte alta del post.
// anteprima_video = video di anteprima che mostriamo quando passano col mouse sulle card
// galleria = lista di immagini e video che mostriamo nel post. Verranno visualizzate in base all'ordine della lista

// NOTA BENE: da adesso in poi per le img e i video dovrai usare i percorsi url. Sia in anteprima che in galleria.
// un percorso è fatto da "nome_cartella/nome_file.estensione"
// quindi "01-Captitan/Cap_01.jpg"

export const posts = [

  {
    id: 1,
    title: "Capitan America",
    slug: "captain-america",
    anteprima_img: "01-Capitan/Cap_01.jpg",
    anteprima_video: "01-Capitan/Cap_02.mp4",
    galleria: [
      "01-Capitan/Cap_01.jpg",
      "01-Capitan/Cap_02.mp4",
      "01-Capitan/Cap_03.mp4",
    ],
  },

  {
    id: 2,
    title: "Spider Gwen",
    slug: "spider-gwen",
    anteprima_img: "02-Spider/Gwen_03.jpg",
    anteprima_video: "02-Spider/Gwen_01.mp4",
    galleria: [
      "02-Spider/Gwen_02.mp4",
      "02-Spider/Gwen_01.mp4",
      "02-Spider/Gwen_03.jpg",
      "02-Spider/Gwen_04.jpg",
      "02-Spider/Gwen_05.jpg",
      "02-Spider/Gwen_06.jpg",
    ],
  },

  {
    id: 3,
    title: "Link - Twilight Princess",
    slug: "link-tp",
    anteprima_img: "03-Link/Link_02.jpg",
    anteprima_video: "03-Link/Link_01.mp4",
    galleria: [
      "03-Link/Link_01.mp4",
      "03-Link/Link_02.jpg",
      "03-Link/Link_03.jpg",
      "03-Link/Link_04.jpg",
    ],
  },

  {
    id: 3,
    title: "Silas",
    slug: "silas",
    anteprima_img: "06-Silas/Silas_02.jpg",
    anteprima_video: "06-Silas/Silas_01.mp4",
    galleria: [
      "06-Silas/Silas_01.mp4",
      "06-Silas/Silas_02.jpg",
      "06-Silas/Silas_03.jpg",
    ],
  },

  {
    id: 4,
    title: "Ryu",
    slug: "ryu",
    anteprima_img: "07-Ryu/Ryu_03.jpg",
    anteprima_video: "07-Ryu/Ryu_01.mp4",
    galleria: [
      "07-Ryu/Ryu_01.mp4",
      "07-Ryu/Ryu_02.jpg",
      "07-Ryu/Ryu_03.jpg",
      "07-Ryu/Ryu_04.jpg",
    ],
  },
];
