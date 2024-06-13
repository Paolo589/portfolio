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
    slug: "capitan-america",
    anteprima_img: "01-Capitan/Cap_01.jpg",
    anteprima_video: "01-Capitan/Cap_02.mp4",
    galleria: [
      "01-Capitan/Cap_01.jpg",
      "01-Capitan/Cap_02.mp4",
      "01-Capitan/Cap_03.jpg",
    ],
  },

  {
    id: 2,
    title: "Spider Gwen",
    slug: "spider-gwen",
    anteprima_img: "02-Spider/Gwen_03.jpg",
    anteprima_video: "02-Spider/Gwen_01.mp4",
    galleria: [
      "02-Spider/Gwen_01.mp4",
      "02-Spider/Gwen_02.mp4",
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
    id: 4,
    title: "Goddess Bastet",
    slug: "godess-bastet",
    anteprima_img: "04-Goddess/Goddess_Bastet_03.jpg",
    anteprima_video: "04-Goddess/Goddess_Bastet_01.mp4",
    galleria: [
      "04-Goddess/Goddess_Bastet_01.mp4",
      "04-Goddess/Goddess_Bastet_02.jpg",
      "04-Goddess/Goddess_Bastet_03.jpg",
    ],
  },

  {
    id: 5,
    title: "RichardHTT",
    slug: "richardhtt",
    anteprima_img: "05-RichardHTT/Htt_02.jpg",
    anteprima_video: "05-RichardHTT/Htt_01.mp4",
    galleria: [
      "05-RichardHTT/Htt_01.mp4",
      "05-RichardHTT/Htt_02.jpg",
      "05-RichardHTT/Htt_03.jpg",
    ],
  },

  {
    id: 6,
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
    id: 7,
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

  {
    id: 8,
    title: "Ghost Rider",
    slug: "ghost-rider",
    anteprima_img: "08-Ghost/GhostRider_02.jpg",
    anteprima_video: "08-Ghost/GhostRider_01.mp4",
    galleria: [
      "08-Ghost/GhostRider_01.mp4",
      "08-Ghost/GhostRider_02.jpg",
    ],
  },

  {
    id: 9,
    title: "Batman, Robin and Clayface",
    slug: "batman-robin-and-clayface",
    anteprima_img: "09-BatRob/BatRob_02.jpg",
    anteprima_video: "09-BatRob/BatRob_01.mp4",
    galleria: [
      "09-BatRob/BatRob_01.mp4",
      "09-BatRob/BatRob_02.jpg",
      "09-BatRob/BatRob_03.jpg",
      "09-BatRob/BatRob_04.jpg",
      "09-BatRob/BatRob_05.jpg",
      "09-BatRob/BatRob_06.jpg",
    ],
  },

  {
    id: 10,
    title: "Homelander",
    slug: "homelander",
    anteprima_img: "10-Homelander/Homelander_03.jpg",
    anteprima_video: "10-Homelander/Homelander_01.mp4",
    galleria: [
      "10-Homelander/Homelander_01.mp4",
      "10-Homelander/Homelander_02.jpg",
      "10-Homelander/Homelander_03.jpg",
      "10-Homelander/Homelander_04.mp4",
    ],
  },

  {
    id: 11,
    title: "Mario vs Bowser",
    slug: "mario-vs-bowser",
    anteprima_img: "11-MarioBowser/MariovBowser_05.jpg",
    anteprima_video: "11-MarioBowser/MariovBowser_01.mp4",
    galleria: [
      "11-MarioBowser/MariovBowser_01.mp4",
      "11-MarioBowser/MariovBowser_02.mp4",
      "11-MarioBowser/MariovBowser_03.jpg",
      "11-MarioBowser/MariovBowser_04.jpg",
      "11-MarioBowser/MariovBowser_05.jpg",
      "11-MarioBowser/MariovBowser_06.jpg",
      "11-MarioBowser/MariovBowser_07.jpg",
      "11-MarioBowser/MariovBowser_08.jpg",
      "11-MarioBowser/MariovBowser_09.jpg",
    ],
  },

  {
    id: 12,
    title: "Venom",
    slug: "venom",
    anteprima_img: "12-Venom/Venom_01.jpg",
    anteprima_video: "12-Venom/Venom_01.jpg",
    galleria: [
      "12-Venom/Venom_01.jpg",
      "12-Venom/Venom_02.jpg",
      "12-Venom/Venom_03.jpg",
    ],
  },

  {
    id: 13,
    title: "Darth Maul Oni Mask",
    slug: "darth-maul-oni-mask",
    anteprima_img: "13-DarthMaul/DarthMaul_03.jpg",
    anteprima_video: "13-DarthMaul/DarthMaul_04.mp4",
    galleria: [
      "13-DarthMaul/DarthMaul_04.mp4",
      "13-DarthMaul/DarthMaul_01.jpg",
      "13-DarthMaul/DarthMaul_02.jpg",
      "13-DarthMaul/DarthMaul_03.jpg",
    ],
  },

  {
    id: 14,
    title: "Baseball Furies",
    slug: "baseball-furies",
    anteprima_img: "14-BaseballFuries.jpg",
    anteprima_video: "14-BaseballFuries.jpg",
    galleria: [
      "14-BaseballFuries.jpg",
    ],
  },

  {
    id: 15,
    title: "Darkwing Duck",
    slug: "darkwing-duck",
    anteprima_img: "15-DarkwingDuck/DD_02.jpg",
    anteprima_video: "15-DarkwingDuck/DD_01.mp4",
    galleria: [
      "15-DarkwingDuck/DD_01.mp4",
      "15-DarkwingDuck/DD_03.jpg",
      "15-DarkwingDuck/DD_04.jpg",
      "15-DarkwingDuck/DD_05.jpg",
    ],
  },

  {
    id: 16,
    title: "Mauro | SlimDogs",
    slug: "mauro-slimdogs",
    anteprima_img: "16-Mauro/Mauro_03.jpg",
    anteprima_video: "16-Mauro/Mauro_01.mp4",
    galleria: [
      "16-Mauro/Mauro_01.mp4",
      "16-Mauro/Mauro_03.jpg",
      "16-Mauro/Mauro_04.jpg",
    ],
  },

  {
    id: 17,
    title: "Aletheia 3300",
    slug: "aletheia-3300",
    anteprima_img: "17-Aletheia3300/Ale3300.jpg",
    anteprima_video: "17-Aletheia3300/Ale3300.jpg",
    galleria: [
      "17-Aletheia3300/Ale3300.jpg",
    ],
  },
];
