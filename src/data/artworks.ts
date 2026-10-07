import { placeArtworkOnWall, validateArtworkPlacement } from '@/lib/gallery-layout';

export type DisplayType = 'wall' | 'sculpture';
export interface Artwork {
  id: string; title: string; year: number; medium: string; dimensions?: string;
  image: string; imageAspectRatio?: number; size?: [number, number];
  frameStyle?: 'black' | 'wood' | 'white' | 'shadowbox' | 'canvas';
  frameColor?: string; frameThickness?: number; spacing?: number; showLabel?: boolean;
  alt: string; description: string; artistStatement?: string; room: string;
  position: [number, number, number]; rotation: [number, number, number];
  interactionRadius?: number; displayType?: DisplayType;
  wallId?: string; offsetX?: number; centerY?: number; wallOffset?: number;
}

type Entry = Omit<Artwork, 'position' | 'rotation'> & {position: Artwork['position']; rotation: Artwork['rotation']};
const WALL_OFFSET = 0.015;
function wall(id:string,title:string,medium:string,image:string,alt:string,room:string,wallId:string,offsetX:number,height:number,ratio:number,frameStyle:Artwork['frameStyle']='wood',centerY=1.65):Entry {
  const frameThickness=0.055;
  const placement=placeArtworkOnWall(wallId,offsetX,centerY,frameThickness,WALL_OFFSET);
  return {
    id,title,year:2026,medium,image:`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/artworks/${image}.webp`,imageAspectRatio:ratio,
    size:[Number((height*ratio).toFixed(3)),height],frameStyle,frameThickness,showLabel:true,
    alt,room,wallId,offsetX,centerY,wallOffset:WALL_OFFSET,...placement,
    description:`A personal ${medium.toLowerCase()} work from Kasih Arissa’s collection, presented with its original details and mark-making intact.`,
  };
}

export const artworks: Artwork[] = [
  wall('misty-ridge','Untitled (Misty Ridge)','Acrylic on canvas','kasih-05-misty-ridge','Misty mountain ridges and dark evergreen forest painted on canvas','main-gallery','main-gallery-end',0,2.45,1.375,'wood',2.8),
  wall('night-water-garden','Untitled (Night Water Garden)','Acrylic on canvas','kasih-08-night-water-garden','Dark pond with white water lilies and green foliage','nature-gallery','nature-gallery-west',-1.5,1.55,.982,'canvas'),
  wall('ocean-circle','Untitled (Ocean in Blue)','Acrylic on round canvas','kasih-09-ocean-circle','Circular blue seascape with a white shore and breaking wave','nature-gallery','nature-gallery-east',-1.2,1.55,.761,'canvas'),
  wall('flower-meadow','Untitled (Flower Meadow)','Acrylic on round canvas','kasih-02-flower-meadow','Round painting of a pink flower field beneath a purple sunset','nature-gallery','nature-gallery-east',2.0,1.55,1.035,'canvas'),
  wall('botanical-study','Botanical Study','Charcoal on paper','kasih-14-botanical-study','Detailed charcoal study of a bulb and leaves','nature-gallery','nature-gallery-end',-1.2,1.42,1.333,'black'),
  wall('water-lily-study','Untitled (Water Lilies)','Acrylic on canvas','kasih-08-night-water-garden','White water lilies emerge from a shadowed pond','nature-gallery','nature-gallery-end',1.1,1.42,.982,'canvas'),
  wall('portrait-study','Portrait Study','Graphite on paper','kasih-01-portrait-study','Expressive graphite portrait of a woman with dark hair','portrait-gallery','portrait-gallery-east',1.5,1.62,.844,'black'),
  wall('character-study-a','Character Study I','Ink on paper','kasih-04-character-studies','Ink drawings of two anime-inspired male characters','portrait-gallery','portrait-gallery-west',1.65,1.55,.467,'black'),
  wall('character-study-b','Character Study II','Graphite and ink on paper','kasih-06-character-sketch','Close-up manga character sketch in black ink','portrait-gallery','portrait-gallery-east',-2.6,1.55,.816,'black'),
  wall('anime-portrait','Portrait in Ink','Graphite on paper','kasih-07-anime-portrait','Black and white anime-inspired portrait in a sketchbook','portrait-gallery','portrait-gallery-west',-3.15,1.55,.847,'black'),
  wall('dark-portrait','Untitled (Portrait)','Graphite on paper','kasih-10-dark-portrait','Graphite portrait with dark hair and detailed neck ornament','portrait-gallery','portrait-gallery-end',-2.0,1.5,.799,'black'),
  wall('expression-sheet','Expression Studies','Digital illustration','kasih-24-expression-sheet','Five expressions of a dark-haired illustrated character','portrait-gallery','portrait-gallery-end',0,1.4,1.506,'white'),
  wall('fashion-turnaround','Character Turnaround','Digital illustration','kasih-25-fashion-turnaround','Three views of a character wearing a white blouse and dark trousers','portrait-gallery','portrait-gallery-end',2.0,1.5,.902,'white'),
  wall('still-life','Studio Still Life','Charcoal on paper','kasih-11-studio-still-life','Charcoal still life of art materials, a frame, and fruit','illustration-gallery','illustration-gallery-west',1.5,1.55,.742,'black'),
  wall('spider-flora','Untitled (Spider and Flowers)','Ink and colored pencil on paper','kasih-16-spider-and-flowers','Colorful spider surrounded by intricate black-and-white flowers','illustration-gallery','illustration-gallery-east',1.8,1.55,.637,'white'),
  wall('cafe-illustration','Café de la Rose','Illustration','kasih-15-cafe-de-la-rose','Decorative illustrated rose café interior in sage green and pink','illustration-gallery','illustration-gallery-end',-1.7,1.4,.687,'white'),
  wall('florea-apron','Florea Café Apron','Digital illustration','kasih-17-florea-apron','Sage green apron illustration with embroidered floral decoration','illustration-gallery','illustration-gallery-end',-.1,1.42,.842,'white'),
  wall('skull-panda','Skull Panda','Digital graphic design','kasih-21-skull-panda','Ornate metallic Skull Panda wordmark on a dark background','illustration-gallery','illustration-gallery-end',1.68,1.1,1.91,'black'),
  wall('coffee-cat','A Little Coffee Cat','Watercolor and ink on paper','kasih-03-coffee-cat','Small sleepy cat character resting on a cup of coffee','kawaii-gallery','kawaii-gallery-west',-2.15,1.55,.675,'white'),
  wall('sweet-skewers','Sweet Skewers','Watercolor and ink on paper','kasih-18-sweet-skewers','Two red glazed cat-shaped sweets on skewers','kawaii-gallery','kawaii-gallery-east',2.15,1.55,.679,'white'),
  wall('turtle-treats','Turtle Treats','Digital illustration','kasih-12-turtle-treats','Three green turtle characters holding little desserts','kawaii-gallery','kawaii-gallery-entry',-1.7,1.32,1.584,'white'),
  wall('red-character','Little Red Companions','Digital illustration','kasih-13-little-red-companions','Playful red character, clock, and mushroom illustrations','kawaii-gallery','kawaii-gallery-entry',0,1.5,.676,'white'),
  wall('poppin-jelly','Poppin Jelly','Watercolor and graphic design','kasih-19-poppin-jelly','Colorful Poppin Jelly dessert café poster with fruit and jelly','kawaii-gallery','kawaii-gallery-entry',1.7,1.45,.735,'white'),
  wall('complete-the-set','Complete the Set','Digital graphic design','kasih-23-complete-the-set','Pink and purple playful typographic poster','kawaii-gallery','kawaii-gallery-end',-.9,1.55,.704,'white'),
  wall('dessert-bowl','Mykōri Dessert Concept','Watercolor and marker on paper','kasih-20-dessert-bowl','Colorful illustrated bowl of shaved ice with berries and jelly','kawaii-gallery','kawaii-gallery-end',.9,1.55,.942,'white'),
  {id:'mixed-media-fish',title:'Underwater Assemblage',year:2026,medium:'Mixed-media sculpture',image:`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/artworks/kasih-22-fish-sculpture.webp`,imageAspectRatio:.686,size:[1.5,1.8],frameStyle:'canvas',alt:'Colorful handmade fish sculpture assembled from found materials',room:'sculpture-gallery',position:[0,1.3,-44.8],rotation:[0,0,0],description:'A colorful fish assembled from found materials, exhibited as a sculptural centerpiece.',displayType:'sculpture',interactionRadius:3.4},
];

validateArtworkPlacement(artworks);
