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
    id: 39,
    title: "A big cuddly guy and a kitten",
    sottotitolo: "original concept by Tom Booth",
    slug: "big-guy",
    anteprima_img: "39-BigGuy/BigGuy_02.jpg",
    anteprima_video: "39-BigGuy/BigGuy_01.mp4",
    galleria: ["39-BigGuy/BigGuy_01.mp4"],
  },

  {
    id: 37,
    title: "Disappointed Guy",
    sottotitolo: "original concept by Nula",
    slug: "disappointed-guy",
    anteprima_img: "37-Null/Null_02.jpg",
    anteprima_video: "37-Null/Null_01.mp4",
    galleria: ["37-Null/Null_01.mp4"],
  },

  {
    id: 40,
    title: "A big dude with some hefty staches",
    sottotitolo: "original concept by Cy L",
    slug: "big-dude",
    anteprima_img: "40-BigDude/BigDude_02.jpg",
    anteprima_video: "40-BigDude/BigDude_01.mp4",
    galleria: ["40-BigDude/BigDude_01.mp4"],
  },

  {
    id: 42,
    title: "Geeulio",
    sottotitolo: "original concept by Giulio Ferrara",
    slug: "geeulio",
    anteprima_img: "42-Geeulio/Gee_02.jpg",
    anteprima_video: "42-Geeulio/Gee_01.mp4",
    galleria: ["42-Geeulio/Gee_01.mp4"],
  },

  {
    id: 38,
    title: "Gollum",
    sottotitolo: "original concept by Lorenzo Di Santo",
    slug: "gollum",
    anteprima_img: "38-Gollum/Gollum_02.jpg",
    anteprima_video: "38-Gollum/Gollum_01.mp4",
    galleria: ["38-Gollum/Gollum_01.mp4"],
  },

  {
    id: 41,
    title: "A beautiful blue girl with gold earrings",
    sottotitolo: "original concept by Paul Kellam",
    slug: "blue-girl",
    anteprima_img: "41-BlueGirl/BlueGirl_02.jpg",
    anteprima_video: "41-BlueGirl/BlueGirl_01.mp4",
    galleria: ["41-BlueGirl/BlueGirl_01.mp4"],
  },


  {
    id: 1,
    title: "Capitan America",
    sottotitolo: "original concept by Jeff Harvey",
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
    sottotitolo: "original concept by Philip Bawasanta",
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
    sottotitolo: "original concept by Dashiana",
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
    id: 9,
    title: "Batman, Robin and Clayface",
    sottotitolo: "original concept by Dom Scruffy Murphy",
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
    id: 5,
    title: "RichardHTT",
    sottotitolo: "original concept by Riccardo Accattatis",
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
    sottotitolo: "original concept by Julien Vandois",
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
    sottotitolo: "original concept by Anthony Wheeler",
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
    sottotitolo: "original concept by Skottie Young",
    slug: "ghost-rider",
    anteprima_img: "08-Ghost/GhostRider_02.jpg",
    anteprima_video: "08-Ghost/GhostRider_01.mp4",
    galleria: ["08-Ghost/GhostRider_01.mp4", "08-Ghost/GhostRider_02.jpg"],
  },

  {
    id: 44,
    title: "Unrequited Love",
    sottotitolo: "original concept by Max Grecke",
    slug: "unrequited-love",
    anteprima_img: "44-Vamp/Vamp_01.jpg",
    anteprima_video: "",
    galleria: ["44-Vamp/Vamp_02.jpg"],
  },

  {
    id: 43,
    title: "Orc",
    sottotitolo: "original concept by Kenny Charactercube",
    slug: "orc",
    anteprima_img: "43-Orc/Orc.jpeg",
    anteprima_video: "",
    galleria: ["43-Orc/Orc.jpeg"],
  },

  {
    id: 10,
    title: "Homelander",
    slug: "homelander",
    anteprima_img: "10-Homelander/Homelander_03.jpeg",
    anteprima_video: "10-Homelander/Homelander_01.mp4",
    galleria: [
      "10-Homelander/Homelander_01.mp4",
      "10-Homelander/Homelander_02.jpeg",
      "10-Homelander/Homelander_03.jpeg",
      "10-Homelander/Homelander_04.mp4",
    ],
  },

  {
    id: 11,
    title: "Mario vs Bowser",
    sottotitolo: "original concept by Dom Scruffy Murphy",
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
    anteprima_video: "",
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
    anteprima_img: "14-BaseballFuries/Baseball_Furies.jpg",
    anteprima_video: "",
    galleria: ["14-BaseballFuries/Baseball_Furies.jpg"],
  },

  {
    id: 15,
    title: "Darkwing Duck",
    slug: "darkwing-duck",
    anteprima_img: "15-DarkwingDuck/DD_02.jpg",
    anteprima_video: "15-DarkwingDuck/DD_01.mp4",
    galleria: [
      "15-DarkwingDuck/DD_01.mp4",
      "15-DarkwingDuck/DD_02.jpg",
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
    anteprima_video: "",
    galleria: ["17-Aletheia3300/Ale3300.jpg"],
  },

  {
    id: 18,
    title: "Aletheia - Anime nell'Universo di Itrhon",
    slug: "aletheia-aui",
    anteprima_img: "18-AletheiaAUI/AletheiaAUI.jpg",
    anteprima_video: "",
    galleria: ["18-AletheiaAUI/AletheiaAUI.jpg"],
  },

  {
    id: 19,
    title: "NBAGNOLI",
    sottotitolo: "original concept by Dario Ghost",
    slug: "nbagnoli",
    anteprima_img: "19-NBAGNOLI/NBAGNOLI.jpg",
    anteprima_video: "19-NBAGNOLI/NBAGNOLI.mp4",
    galleria: ["19-NBAGNOLI/NBAGNOLI.mp4", "19-NBAGNOLI/NBAGNOLI.jpg"],
  },

  {
    id: 20,
    title: "The Hero's Rest",
    slug: "the-hero-s-rest",
    anteprima_img: "20-TheLegendofZelda/Heros_Rest.jpg",
    anteprima_video: "",
    galleria: ["20-TheLegendofZelda/Heros_Rest.jpg"],
  },

  {
    id: 21,
    title: "Marv - Sin City",
    slug: "marv",
    anteprima_img: "21-Marv/Marv_02.jpg",
    anteprima_video: "21-Marv/Marv_01.mp4",
    galleria: [
      "21-Marv/Marv_01.mp4",
      "21-Marv/Marv_02.jpg",
      "21-Marv/Marv_03.jpg",
    ],
  },

  {
    id: 22,
    title: "Goodfellas",
    slug: "goodfellas",
    anteprima_img: "22-Goodfellas/Goodfellas.jpeg",
    anteprima_video: "",
    galleria: ["22-Goodfellas/Goodfellas.jpeg"],
  },

  {
    id: 23,
    title: "SaulGoodman",
    sottotitolo: "original concept by Mike Giblin",
    slug: "saulgoodman",
    anteprima_img: "23-SaulGoodman/SaulGoodman.png",
    anteprima_video: "",
    galleria: ["23-SaulGoodman/SaulGoodman.png"],
  },

  {
    id: 24,
    title: "Stormtrooper",
    slug: "stormtrooper",
    anteprima_img: "24-Stormtrooper/Stormtrooper.jpg",
    anteprima_video: "",
    galleria: ["24-Stormtrooper/Stormtrooper.jpg"],
  },

  {
    id: 25,
    title: "Charmeleon",
    slug: "charmeleon",
    anteprima_img: "25-Charmeleon/Charmeleon.jpg",
    anteprima_video: "",
    galleria: ["25-Charmeleon/Charmeleon.jpg"],
  },

  {
    id: 26,
    title: "Halloween",
    slug: "halloween",
    anteprima_img: "26-Halloween/Halloween_01.jpg",
    anteprima_video: "",
    galleria: [
      "26-Halloween/Halloween_01.jpg",
      "26-Halloween/Halloween_02.jpg",
    ],
  },

  {
    id: 27,
    title: "Batman - the Dark Knight",
    slug: "batman-tdk",
    anteprima_img: "27-BatmanDK/Bat_01.jpg",
    anteprima_video: "",
    galleria: ["27-BatmanDK/Bat_01.jpg", "27-BatmanDK/Bat_02.jpg"],
  },

  {
    id: 28,
    title: "Patri Balanovsky DTIYS",
    slug: "patri-balanovsky-dtiys",
    anteprima_img: "28-PatriBalanovsky/PBDTIYS_01.jpg",
    anteprima_video: "",
    galleria: ["28-PatriBalanovsky/PBDTIYS_01.jpg"],
  },

  {
    id: 29,
    title: "Malta Door",
    slug: "malta-door",
    anteprima_img: "29-MaltaDoor/MaltaDoor.jpg",
    anteprima_video: "",
    galleria: ["29-MaltaDoor/MaltaDoor.jpg"],
  },

  {
    id: 30,
    title: "Darth Vader",
    slug: "darth-vader",
    anteprima_img: "30-DarthVader/dvsmooth2.jpg",
    anteprima_video: "",
    galleria: ["30-DarthVader/dvsmooth2.jpg"],
  },

  {
    id: 31,
    title: "Birrificio Flegreo",
    slug: "birrificio-flegreo",
    anteprima_img: "31-BirrificioFlegreo/Birrificio.jpg",
    anteprima_video: "",
    galleria: ["31-BirrificioFlegreo/Birrificio.jpg"],
  },

  {
    id: 32,
    title: "Elliot Stabler",
    slug: "elliot-stabler",
    anteprima_img: "32-ElliotStabler/Elliot_01.jpg",
    anteprima_video: "",
    galleria: [
      "32-ElliotStabler/Elliot_01.jpg",
      "32-ElliotStabler/Elliot_02.jpg",
    ],
  },

  {
    id: 33,
    title: "Bic Lighter",
    slug: "bic-lighter",
    anteprima_img: "33-BicLighter/BIC.jpg",
    anteprima_video: "",
    galleria: ["33-BicLighter/BIC.jpg"],
  },

  {
    id: 34,
    title: "Medical Stuff",
    slug: "medical-stuff",
    anteprima_img: "34-MedicalStuff/MS_02.jpg",
    anteprima_video: "",
    galleria: [
      "34-MedicalStuff/MS_01.jpg",
      "34-MedicalStuff/MS_02.jpg",
      "34-MedicalStuff/MS_03.jpg",
    ],
  },

  {
    id: 35,
    title: "Low Poly Animals",
    slug: "low-poly-animals",
    anteprima_img: "35-LowPolyAnimals/LPA_01.jpg",
    anteprima_video: "",
    galleria: ["35-LowPolyAnimals/LPA_02.jpg"],
  },

  {
    id: 36,
    title: "Abstract",
    slug: "abstract",
    anteprima_img: "36-Abstract/Abstract_06.jpg",
    anteprima_video: "",
    galleria: [
      "36-Abstract/Abstract_01.jpg",
      "36-Abstract/Abstract_02.jpg",
      "36-Abstract/Abstract_03.jpg",
      "36-Abstract/Abstract_04.jpg",
      "36-Abstract/Abstract_05.jpg",
      "36-Abstract/Abstract_07.jpg",
      "36-Abstract/Abstract_06.jpg",
    ],
  },
];

export const info = {
  text: ["Hi, I’m Paolo, a 3D artist living in Naples, Italy. ","It all started back in my university days when i used to model engineering stuff like car parts, engines and clutches.","  Then I realised that making nerdy sculpts was way more fun and so I decided to switch to the art you see me doing nowadays!"],
  social: { linkedin: "http://www.linkedin.com/in/paolo-minopoli-8b0685218" ,  instagram: "http://www.instagram.com/paolopiez/" ,  gmail: "paolo.minopoli@gmail.com" },
};
