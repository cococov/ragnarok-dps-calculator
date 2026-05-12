export type SkillPreset = {
  id: string;
  name: string;
  iconUrl: string;
  variableCast: number;
  fixedCast: number;
  postCast: number;
  cooldown: number;
};

export const skillPresets: SkillPreset[] = [
  {
    id: "focused-arrow-strike",
    name: "Focused Arrow Strike",
    iconUrl: "https://browiki.org/images/6/6f/Tiro_Preciso.png",
    variableCast: 0.5,
    fixedCast: 0.5,
    postCast: 0.5,
    cooldown: 0.15,
  },
  {
    id: "aimed-bolt",
    name: "Aimed Bolt",
    iconUrl: "https://browiki.org/images/b/bc/Disparo_Certeiro.png",
    variableCast: 2,
    fixedCast: 1,
    postCast: 2,
    cooldown: 1,
  },
  {
    id: "wind-cutter",
    name: "Wind Cutter",
    iconUrl: "https://browiki.org/images/7/7f/Vento_Cortante.png",
    variableCast: 0,
    fixedCast: 0,
    postCast: 0.5,
    cooldown: 0.3,
  },
  {
    id: "overbrand",
    name: "Overbrand",
    iconUrl: "https://browiki.org/images/7/77/Lan%C3%A7a_do_Destino.png",
    variableCast: 0,
    fixedCast: 0.5,
    postCast: 1,
    cooldown: 0.3,
  },
  {
    id: "rolling-cutter",
    name: "Rolling Cutter",
    iconUrl: "https://browiki.org/images/1/12/L%C3%A2minas_de_Loki.png",
    variableCast: 0,
    fixedCast: 0,
    postCast: 0.2,
    cooldown: 0,
  },
  {
    id: "cross-impact",
    name: "Cross Impact",
    iconUrl: "https://browiki.org/images/1/16/L%C3%A2minas_Retalhadoras.png",
    variableCast: 0,
    fixedCast: 0,
    postCast: 0.5,
    cooldown: 0.35,
  },
  {
    id: "fatal-menace",
    name: "Fatal Menace",
    iconUrl: "https://browiki.org/images/9/90/Ofensiva_Fatal.png",
    variableCast: 0,
    fixedCast: 0,
    postCast: 0.5,
    cooldown: 0,
  },
  {
    id: "triple-shot",
    name: "Triple Shot",
    iconUrl: "https://browiki.org/images/2/24/Disparo_Triplo.png",
    variableCast: 0,
    fixedCast: 0,
    postCast: 0.35,
    cooldown: 0.2,
  },
  {
    id: "cart-cannon",
    name: "Cart Cannon",
    iconUrl: "https://browiki.org/images/6/6d/Canh%C3%A3o_de_Pr%C3%B3tons.png",
    variableCast: 3,
    fixedCast: 0,
    postCast: 0.5,
    cooldown: 0,
  },
  {
    id: "adoramus",
    name: "Adoramus",
    iconUrl: "https://browiki.org/images/4/4f/Adoramus.png",
    variableCast: 2,
    fixedCast: 0.5,
    postCast: 0.5,
    cooldown: 2.5,
  },
  {
    id: "picky-peck",
    name: "Picky Peck",
    iconUrl: "https://browiki.org/images/7/71/Chilique_de_Picky.png",
    variableCast: 1,
    fixedCast: 0,
    postCast: 1,
    cooldown: 0,
  },
  {
    id: "soul-expansion",
    name: "Soul Expansion",
    iconUrl: "https://browiki.org/images/f/f5/Impacto_Espiritual.png",
    variableCast: 2,
    fixedCast: 0,
    postCast: 0.5,
    cooldown: 0,
  },
];
