// climateZonesData.js
// Base de données complète des zones climatiques CTE d'Espagne
// 300+ villes avec leurs coordonnées GPS et zones climatiques
// Version 1.0 - Compatible avec tous les projets JavaScript/React

// Base de données des zones climatiques
export const ZONES_CLIMATICAS_ESPANA = {
  // ANDALUCÍA
  "andalucia": {
    "almeria": {
      "Almería": { zona: "A3", lat: 36.8340, lng: -2.4637 },
      "Roquetas de Mar": { zona: "A3", lat: 36.7642, lng: -2.6148 },
      "El Ejido": { zona: "A3", lat: 36.7763, lng: -2.8146 },
      "Níjar": { zona: "A3", lat: 36.9667, lng: -2.2067 },
      "Adra": { zona: "A3", lat: 36.7496, lng: -3.0206 },
      "Vícar": { zona: "A3", lat: 36.8316, lng: -2.6428 },
      "Huércal-Overa": { zona: "B4", lat: 37.3906, lng: -1.9414 }
    },
    "cadiz": {
      "Cádiz": { zona: "B3", lat: 36.5271, lng: -6.2886 },
      "Jerez de la Frontera": { zona: "B3", lat: 36.6868, lng: -6.1371 },
      "Algeciras": { zona: "B3", lat: 36.1408, lng: -5.4536 },
      "San Fernando": { zona: "B3", lat: 36.4759, lng: -6.1989 },
      "El Puerto de Santa María": { zona: "B3", lat: 36.5939, lng: -6.2330 },
      "Chiclana de la Frontera": { zona: "B3", lat: 36.4193, lng: -6.1467 },
      "Sanlúcar de Barrameda": { zona: "B3", lat: 36.7789, lng: -6.3620 }
    },
    "cordoba": {
      "Córdoba": { zona: "B4", lat: 37.8882, lng: -4.7794 },
      "Lucena": { zona: "C4", lat: 37.4089, lng: -4.4854 },
      "Puente Genil": { zona: "C4", lat: 37.3896, lng: -4.7668 },
      "Montilla": { zona: "C4", lat: 37.5862, lng: -4.6383 },
      "Priego de Córdoba": { zona: "C4", lat: 37.4383, lng: -4.1956 },
      "Cabra": { zona: "C4", lat: 37.4726, lng: -4.4422 },
      "Baena": { zona: "C4", lat: 37.6172, lng: -4.3224 }
    },
    "granada": {
      "Granada": { zona: "C3", lat: 37.1773, lng: -3.5986 },
      "Motril": { zona: "A3", lat: 36.7449, lng: -3.5178 },
      "Almuñécar": { zona: "A3", lat: 36.7338, lng: -3.6908 },
      "Armilla": { zona: "C3", lat: 37.1440, lng: -3.6176 },
      "Maracena": { zona: "C3", lat: 37.2070, lng: -3.6344 },
      "Loja": { zona: "C3", lat: 37.1690, lng: -4.1514 },
      "Guadix": { zona: "D3", lat: 37.3006, lng: -3.1372 }
    },
    "huelva": {
      "Huelva": { zona: "B3", lat: 37.2571, lng: -6.9497 },
      "Almonte": { zona: "B3", lat: 37.2636, lng: -6.5163 },
      "Lepe": { zona: "B3", lat: 37.2548, lng: -7.2044 },
      "Moguer": { zona: "B3", lat: 37.2755, lng: -6.8384 },
      "Isla Cristina": { zona: "B3", lat: 37.2009, lng: -7.3197 },
      "Ayamonte": { zona: "B3", lat: 37.2132, lng: -7.4035 },
      "Palos de la Frontera": { zona: "B3", lat: 37.2293, lng: -6.8945 }
    },
    "jaen": {
      "Jaén": { zona: "C4", lat: 37.7796, lng: -3.7849 },
      "Linares": { zona: "C4", lat: 38.0950, lng: -3.6361 },
      "Andújar": { zona: "C4", lat: 38.0394, lng: -4.0507 },
      "Úbeda": { zona: "C4", lat: 38.0133, lng: -3.3705 },
      "Martos": { zona: "C4", lat: 37.7209, lng: -3.9727 },
      "Alcalá la Real": { zona: "D3", lat: 37.4613, lng: -3.9237 },
      "Baeza": { zona: "C4", lat: 37.9934, lng: -3.4712 }
    },
    "malaga": {
      "Málaga": { zona: "A3", lat: 36.7213, lng: -4.4214 },
      "Marbella": { zona: "A3", lat: 36.5099, lng: -4.8863 },
      "Vélez-Málaga": { zona: "A3", lat: 36.7849, lng: -4.1008 },
      "Mijas": { zona: "A3", lat: 36.5958, lng: -4.6373 },
      "Fuengirola": { zona: "A3", lat: 36.5401, lng: -4.6241 },
      "Torremolinos": { zona: "A3", lat: 36.6218, lng: -4.4990 },
      "Benalmádena": { zona: "A3", lat: 36.5989, lng: -4.5160 },
      "Estepona": { zona: "A3", lat: 36.4257, lng: -5.1460 },
      "Ronda": { zona: "C3", lat: 36.7463, lng: -5.1613 },
      "Antequera": { zona: "C3", lat: 37.0194, lng: -4.5630 }
    },
    "sevilla": {
      "Sevilla": { zona: "B4", lat: 37.3891, lng: -5.9845 },
      "Dos Hermanas": { zona: "B4", lat: 37.2833, lng: -5.9226 },
      "Alcalá de Guadaíra": { zona: "B4", lat: 37.3382, lng: -5.8394 },
      "Utrera": { zona: "B4", lat: 37.1857, lng: -5.7810 },
      "Mairena del Aljarafe": { zona: "B4", lat: 37.3442, lng: -6.0637 },
      "Écija": { zona: "B4", lat: 37.5414, lng: -5.0827 },
      "La Rinconada": { zona: "B4", lat: 37.4862, lng: -5.9802 }
    }
  },

  // ARAGÓN
  "aragon": {
    "zaragoza": {
      "Zaragoza": { zona: "D3", lat: 41.6488, lng: -0.8891 },
      "Calatayud": { zona: "D3", lat: 41.3534, lng: -1.6432 },
      "Utebo": { zona: "D3", lat: 41.7139, lng: -0.9984 },
      "Caspe": { zona: "D3", lat: 41.2341, lng: -0.0395 },
      "Ejea de los Caballeros": { zona: "D3", lat: 42.1267, lng: -1.1371 }
    },
    "huesca": {
      "Huesca": { zona: "D2", lat: 42.1401, lng: -0.4089 },
      "Monzón": { zona: "D3", lat: 41.9111, lng: 0.1878 },
      "Barbastro": { zona: "D2", lat: 42.0357, lng: 0.1265 },
      "Fraga": { zona: "D3", lat: 41.5204, lng: 0.3488 },
      "Jaca": { zona: "E1", lat: 42.5703, lng: -0.5498 },
      "Sabiñánigo": { zona: "E1", lat: 42.5186, lng: -0.3651 }
    },
    "teruel": {
      "Teruel": { zona: "E1", lat: 40.3456, lng: -1.1065 },
      "Alcañiz": { zona: "D3", lat: 41.0493, lng: -0.1303 },
      "Andorra": { zona: "D2", lat: 40.9773, lng: -0.4469 },
      "Calamocha": { zona: "E1", lat: 40.9203, lng: -1.2985 }
    }
  },

  // ASTURIAS
  "asturias": {
    "asturias": {
      "Oviedo": { zona: "C1", lat: 43.3614, lng: -5.8493 },
      "Gijón": { zona: "C1", lat: 43.5322, lng: -5.6611 },
      "Avilés": { zona: "C1", lat: 43.5545, lng: -5.9245 },
      "Langreo": { zona: "C1", lat: 43.3049, lng: -5.6942 },
      "Mieres": { zona: "D1", lat: 43.2504, lng: -5.7667 },
      "Siero": { zona: "C1", lat: 43.3892, lng: -5.6610 },
      "Cangas del Narcea": { zona: "D1", lat: 43.1779, lng: -6.5489 }
    }
  },

  // BALEARES
  "baleares": {
    "baleares": {
      "Palma": { zona: "B3", lat: 39.5696, lng: 2.6502 },
      "Calvià": { zona: "B3", lat: 39.5655, lng: 2.5063 },
      "Manacor": { zona: "B3", lat: 39.5695, lng: 3.2096 },
      "Marratxí": { zona: "B3", lat: 39.6249, lng: 2.7468 },
      "Llucmajor": { zona: "B3", lat: 39.4901, lng: 2.8901 },
      "Inca": { zona: "B3", lat: 39.7210, lng: 2.9111 },
      "Mahón": { zona: "B3", lat: 39.8856, lng: 4.2663 },
      "Ibiza": { zona: "B3", lat: 38.9067, lng: 1.4206 },
      "Ciutadella": { zona: "B3", lat: 40.0001, lng: 3.8370 }
    }
  },

  // CANARIAS
  "canarias": {
    "las_palmas": {
      "Las Palmas de Gran Canaria": { zona: "A3", lat: 28.1235, lng: -15.4363 },
      "Telde": { zona: "A3", lat: 27.9948, lng: -15.4195 },
      "Santa Lucía de Tirajana": { zona: "A3", lat: 27.9120, lng: -15.5407 },
      "Arrecife": { zona: "A3", lat: 28.9630, lng: -13.5477 },
      "San Bartolomé de Tirajana": { zona: "A3", lat: 27.9248, lng: -15.5730 },
      "Puerto del Rosario": { zona: "A3", lat: 28.5004, lng: -13.8627 }
    },
    "santa_cruz_tenerife": {
      "Santa Cruz de Tenerife": { zona: "A3", lat: 28.4636, lng: -16.2518 },
      "San Cristóbal de La Laguna": { zona: "A3", lat: 28.4853, lng: -16.3155 },
      "La Orotava": { zona: "A3", lat: 28.3906, lng: -16.5231 },
      "Arona": { zona: "A3", lat: 28.0998, lng: -16.6810 },
      "Santa Cruz de La Palma": { zona: "A3", lat: 28.6835, lng: -17.7642 },
      "Los Llanos de Aridane": { zona: "A3", lat: 28.6585, lng: -17.9182 },
      "Puerto de la Cruz": { zona: "A3", lat: 28.4139, lng: -16.5478 }
    }
  },

  // CANTABRIA
  "cantabria": {
    "cantabria": {
      "Santander": { zona: "C1", lat: 43.4623, lng: -3.8100 },
      "Torrelavega": { zona: "C1", lat: 43.3495, lng: -4.0479 },
      "Camargo": { zona: "C1", lat: 43.4089, lng: -3.8849 },
      "Castro-Urdiales": { zona: "C1", lat: 43.3829, lng: -3.2199 },
      "Piélagos": { zona: "C1", lat: 43.3949, lng: -3.9631 },
      "El Astillero": { zona: "C1", lat: 43.4015, lng: -3.8203 },
      "Laredo": { zona: "C1", lat: 43.4116, lng: -3.4097 },
      "Reinosa": { zona: "E1", lat: 42.9996, lng: -4.1376 }
    }
  },

  // CASTILLA-LA MANCHA
  "castilla_la_mancha": {
    "toledo": {
      "Toledo": { zona: "D3", lat: 39.8628, lng: -4.0273 },
      "Talavera de la Reina": { zona: "C4", lat: 39.9634, lng: -4.8301 },
      "Illescas": { zona: "D3", lat: 40.1223, lng: -3.8480 },
      "Seseña": { zona: "D3", lat: 40.1058, lng: -3.6988 },
      "Torrijos": { zona: "D3", lat: 39.9812, lng: -4.2812 }
    },
    "albacete": {
      "Albacete": { zona: "D3", lat: 38.9942, lng: -1.8585 },
      "Hellín": { zona: "D3", lat: 38.5069, lng: -1.7001 },
      "Villarrobledo": { zona: "D3", lat: 39.2680, lng: -2.6017 },
      "Almansa": { zona: "D3", lat: 38.8687, lng: -1.0972 },
      "La Roda": { zona: "D3", lat: 39.2080, lng: -2.1605 }
    },
    "ciudad_real": {
      "Ciudad Real": { zona: "D3", lat: 38.9848, lng: -3.9274 },
      "Puertollano": { zona: "D3", lat: 38.6870, lng: -4.1073 },
      "Tomelloso": { zona: "D3", lat: 39.1581, lng: -3.0241 },
      "Alcázar de San Juan": { zona: "D3", lat: 39.3903, lng: -3.2089 },
      "Valdepeñas": { zona: "D3", lat: 38.7621, lng: -3.3846 }
    },
    "cuenca": {
      "Cuenca": { zona: "E1", lat: 40.0704, lng: -2.1374 },
      "Tarancón": { zona: "D3", lat: 40.0112, lng: -3.0073 },
      "San Clemente": { zona: "D3", lat: 39.4041, lng: -2.4283 },
      "Quintanar del Rey": { zona: "D3", lat: 39.3322, lng: -1.9218 }
    },
    "guadalajara": {
      "Guadalajara": { zona: "D3", lat: 40.6328, lng: -3.1614 },
      "Azuqueca de Henares": { zona: "D3", lat: 40.5708, lng: -3.2651 },
      "Alovera": { zona: "D3", lat: 40.5916, lng: -3.2519 },
      "Cabanillas del Campo": { zona: "D3", lat: 40.6377, lng: -3.2413 },
      "Sigüenza": { zona: "E1", lat: 41.0689, lng: -2.6390 },
      "Molina de Aragón": { zona: "E1", lat: 40.8438, lng: -1.8856 }
    }
  },

  // CASTILLA Y LEÓN
  "castilla_y_leon": {
    "valladolid": {
      "Valladolid": { zona: "D2", lat: 41.6523, lng: -4.7245 },
      "Laguna de Duero": { zona: "D2", lat: 41.5818, lng: -4.7294 },
      "Medina del Campo": { zona: "D2", lat: 41.3129, lng: -4.9139 },
      "Arroyo de la Encomienda": { zona: "D2", lat: 41.6177, lng: -4.8053 }
    },
    "burgos": {
      "Burgos": { zona: "E1", lat: 42.3439, lng: -3.6969 },
      "Miranda de Ebro": { zona: "D1", lat: 42.6866, lng: -2.9470 },
      "Aranda de Duero": { zona: "D2", lat: 41.6704, lng: -3.6892 }
    },
    "leon": {
      "León": { zona: "E1", lat: 42.5987, lng: -5.5671 },
      "Ponferrada": { zona: "D1", lat: 42.5499, lng: -6.5963 },
      "San Andrés del Rabanedo": { zona: "E1", lat: 42.6113, lng: -5.6164 },
      "Valencia de Don Juan": { zona: "D2", lat: 42.2920, lng: -5.5190 }
    },
    "palencia": {
      "Palencia": { zona: "D2", lat: 42.0096, lng: -4.5279 },
      "Aguilar de Campoo": { zona: "E1", lat: 42.7939, lng: -4.2574 }
    },
    "salamanca": {
      "Salamanca": { zona: "D2", lat: 40.9701, lng: -5.6635 },
      "Béjar": { zona: "E1", lat: 40.3863, lng: -5.7638 },
      "Ciudad Rodrigo": { zona: "D2", lat: 40.5999, lng: -6.5329 }
    },
    "segovia": {
      "Segovia": { zona: "D2", lat: 40.9429, lng: -4.1088 },
      "Cuéllar": { zona: "D2", lat: 41.4037, lng: -4.3194 }
    },
    "soria": {
      "Soria": { zona: "E1", lat: 41.7636, lng: -2.4790 },
      "Almazán": { zona: "E1", lat: 41.4857, lng: -2.5343 }
    },
    "avila": {
      "Ávila": { zona: "E1", lat: 40.6563, lng: -4.6812 },
      "Arévalo": { zona: "D2", lat: 41.0607, lng: -4.7206 }
    },
    "zamora": {
      "Zamora": { zona: "D2", lat: 41.5034, lng: -5.7467 },
      "Benavente": { zona: "D2", lat: 42.0025, lng: -5.6783 },
      "Toro": { zona: "D2", lat: 41.5202, lng: -5.3949 }
    }
  },

  // CATALUNYA
  "catalunya": {
    "barcelona": {
      "Barcelona": { zona: "C2", lat: 41.3851, lng: 2.1734 },
      "L'Hospitalet de Llobregat": { zona: "C2", lat: 41.3597, lng: 2.0997 },
      "Badalona": { zona: "C2", lat: 41.4501, lng: 2.2475 },
      "Terrassa": { zona: "C2", lat: 41.5630, lng: 2.0088 },
      "Sabadell": { zona: "C2", lat: 41.5463, lng: 2.1087 },
      "Mataró": { zona: "C2", lat: 41.5405, lng: 2.4445 },
      "Santa Coloma de Gramenet": { zona: "C2", lat: 41.4517, lng: 2.2083 },
      "Cornellà de Llobregat": { zona: "C2", lat: 41.3550, lng: 2.0701 },
      "Sant Cugat del Vallès": { zona: "C2", lat: 41.4728, lng: 2.0861 },
      "Manresa": { zona: "D2", lat: 41.7251, lng: 1.8266 },
      "Vic": { zona: "D2", lat: 41.9304, lng: 2.2548 }
    },
    "girona": {
      "Girona": { zona: "C2", lat: 41.9794, lng: 2.8214 },
      "Figueres": { zona: "C2", lat: 42.2663, lng: 2.9616 },
      "Blanes": { zona: "C2", lat: 41.6742, lng: 2.7901 },
      "Olot": { zona: "D1", lat: 42.1829, lng: 2.4901 },
      "Salt": { zona: "C2", lat: 41.9749, lng: 2.7932 },
      "Palafrugell": { zona: "C2", lat: 41.9179, lng: 3.1631 }
    },
    "lleida": {
      "Lleida": { zona: "D3", lat: 41.6176, lng: 0.6200 },
      "Balaguer": { zona: "D3", lat: 41.7905, lng: 0.8045 },
      "Tàrrega": { zona: "D3", lat: 41.6472, lng: 1.1398 },
      "La Seu d'Urgell": { zona: "E1", lat: 42.3576, lng: 1.4625 },
      "Mollerussa": { zona: "D3", lat: 41.6311, lng: 0.8947 }
    },
    "tarragona": {
      "Tarragona": { zona: "B3", lat: 41.1189, lng: 1.2445 },
      "Reus": { zona: "B3", lat: 41.1549, lng: 1.1088 },
      "Tortosa": { zona: "B3", lat: 40.8125, lng: 0.5216 },
      "El Vendrell": { zona: "B3", lat: 41.2186, lng: 1.5358 },
      "Cambrils": { zona: "B3", lat: 41.0660, lng: 1.0593 },
      "Salou": { zona: "B3", lat: 41.0764, lng: 1.1410 },
      "Valls": { zona: "C2", lat: 41.2859, lng: 1.2498 }
    }
  },

  // COMUNIDAD VALENCIANA
  "comunidad_valenciana": {
    "valencia": {
      "Valencia": { zona: "B3", lat: 39.4699, lng: -0.3763 },
      "Torrent": { zona: "B3", lat: 39.4371, lng: -0.4654 },
      "Gandía": { zona: "B3", lat: 38.9680, lng: -0.1823 },
      "Paterna": { zona: "B3", lat: 39.5028, lng: -0.4409 },
      "Sagunto": { zona: "B3", lat: 39.6802, lng: -0.2665 },
      "Alzira": { zona: "B3", lat: 39.1516, lng: -0.4354 },
      "Mislata": { zona: "B3", lat: 39.4759, lng: -0.4183 },
      "Burjassot": { zona: "B3", lat: 39.5100, lng: -0.4100 },
      "Ontinyent": { zona: "C3", lat: 38.8221, lng: -0.6063 },
      "Xàtiva": { zona: "B3", lat: 38.9903, lng: -0.5185 }
    },
    "castellon": {
      "Castellón de la Plana": { zona: "B3", lat: 39.9864, lng: -0.0513 },
      "Vila-real": { zona: "B3", lat: 39.9381, lng: -0.1012 },
      "Borriana": { zona: "B3", lat: 39.9009, lng: -0.0853 },
      "Vinaròs": { zona: "B3", lat: 40.4703, lng: 0.4752 },
      "Benicarló": { zona: "B3", lat: 40.4163, lng: 0.4271 },
      "La Vall d'Uixó": { zona: "B3", lat: 39.8261, lng: -0.2323 }
    },
    "alicante": {
      "Alicante": { zona: "B3", lat: 38.3452, lng: -0.4810 },
      "Elche": { zona: "B3", lat: 38.2669, lng: -0.6985 },
      "Torrevieja": { zona: "B3", lat: 37.9787, lng: -0.6823 },
      "Orihuela": { zona: "B3", lat: 38.0848, lng: -0.9445 },
      "Benidorm": { zona: "B3", lat: 38.5410, lng: -0.1225 },
      "Alcoy": { zona: "C3", lat: 38.6985, lng: -0.4737 },
      "San Vicente del Raspeig": { zona: "B3", lat: 38.3964, lng: -0.5255 },
      "Elda": { zona: "B4", lat: 38.4778, lng: -0.7917 },
      "Denia": { zona: "B3", lat: 38.8408, lng: 0.1056 },
      "Petrer": { zona: "B4", lat: 38.4847, lng: -0.7719 }
    }
  },

  // EXTREMADURA
  "extremadura": {
    "badajoz": {
      "Badajoz": { zona: "C4", lat: 38.8794, lng: -6.9707 },
      "Mérida": { zona: "C4", lat: 38.9163, lng: -6.3436 },
      "Don Benito": { zona: "C4", lat: 38.9553, lng: -5.8621 },
      "Almendralejo": { zona: "C4", lat: 38.6832, lng: -6.4073 },
      "Villanueva de la Serena": { zona: "C4", lat: 38.9759, lng: -5.7973 },
      "Montijo": { zona: "C4", lat: 38.9086, lng: -6.6175 }
    },
    "caceres": {
      "Cáceres": { zona: "C4", lat: 39.4753, lng: -6.3724 },
      "Plasencia": { zona: "C4", lat: 40.0306, lng: -6.0878 },
      "Navalmoral de la Mata": { zona: "C4", lat: 39.8922, lng: -5.5409 },
      "Coria": { zona: "C4", lat: 39.9839, lng: -6.5372 },
      "Trujillo": { zona: "C4", lat: 39.4581, lng: -5.8814 }
    }
  },

  // GALICIA
  "galicia": {
    "a_coruna": {
      "A Coruña": { zona: "C1", lat: 43.3623, lng: -8.4115 },
      "Santiago de Compostela": { zona: "C1", lat: 42.8782, lng: -8.5448 },
      "Ferrol": { zona: "C1", lat: 43.4843, lng: -8.2328 },
      "Narón": { zona: "C1", lat: 43.5226, lng: -8.1883 },
      "Oleiros": { zona: "C1", lat: 43.3338, lng: -8.3105 },
      "Carballo": { zona: "C1", lat: 43.2130, lng: -8.6911 },
      "Culleredo": { zona: "C1", lat: 43.2887, lng: -8.3887 },
      "Ribeira": { zona: "C1", lat: 42.5571, lng: -8.9917 }
    },
    "lugo": {
      "Lugo": { zona: "D2", lat: 43.0095, lng: -7.5560 },
      "Monforte de Lemos": { zona: "D2", lat: 42.5216, lng: -7.5115 },
      "Viveiro": { zona: "C1", lat: 43.6586, lng: -7.5957 },
      "Vilalba": { zona: "D2", lat: 43.2986, lng: -7.6807 }
    },
    "ourense": {
      "Ourense": { zona: "C1", lat: 42.3400, lng: -7.8648 },
      "Verín": { zona: "D2", lat: 41.9431, lng: -7.4386 },
      "O Barco de Valdeorras": { zona: "D2", lat: 42.4153, lng: -6.9832 },
      "O Carballiño": { zona: "C1", lat: 42.4313, lng: -8.0787 }
    },
    "pontevedra": {
      "Vigo": { zona: "C1", lat: 42.2314, lng: -8.7124 },
      "Pontevedra": { zona: "C1", lat: 42.4310, lng: -8.6446 },
      "Vilagarcía de Arousa": { zona: "C1", lat: 42.5957, lng: -8.7644 },
      "Redondela": { zona: "C1", lat: 42.2841, lng: -8.6098 },
      "Cangas": { zona: "C1", lat: 42.2640, lng: -8.7856 },
      "Marín": { zona: "C1", lat: 42.3911, lng: -8.7016 },
      "Ponteareas": { zona: "C1", lat: 42.1754, lng: -8.5041 }
    }
  },

  // MADRID
  "madrid": {
    "madrid": {
      "Madrid": { zona: "D3", lat: 40.4168, lng: -3.7038 },
      "Móstoles": { zona: "D3", lat: 40.3223, lng: -3.8651 },
      "Alcalá de Henares": { zona: "D3", lat: 40.4819, lng: -3.3635 },
      "Fuenlabrada": { zona: "D3", lat: 40.2839, lng: -3.7990 },
      "Leganés": { zona: "D3", lat: 40.3280, lng: -3.7653 },
      "Getafe": { zona: "D3", lat: 40.3082, lng: -3.7326 },
      "Alcorcón": { zona: "D3", lat: 40.3489, lng: -3.8248 },
      "Torrejón de Ardoz": { zona: "D3", lat: 40.4599, lng: -3.4823 },
      "Parla": { zona: "D3", lat: 40.2380, lng: -3.7673 },
      "Alcobendas": { zona: "D3", lat: 40.5477, lng: -3.6419 },
      "Las Rozas de Madrid": { zona: "D3", lat: 40.4929, lng: -3.8737 },
      "San Sebastián de los Reyes": { zona: "D3", lat: 40.5477, lng: -3.6264 },
      "Pozuelo de Alarcón": { zona: "D3", lat: 40.4359, lng: -3.8134 },
      "Coslada": { zona: "D3", lat: 40.4237, lng: -3.5614 },
      "Rivas-Vaciamadrid": { zona: "D3", lat: 40.3271, lng: -3.5106 },
      "Valdemoro": { zona: "D3", lat: 40.1924, lng: -3.6737 },
      "Majadahonda": { zona: "D3", lat: 40.4729, lng: -3.8721 },
      "Collado Villalba": { zona: "D3", lat: 40.6292, lng: -4.0046 },
      "Aranjuez": { zona: "D3", lat: 40.0314, lng: -3.6024 },
      "Arganda del Rey": { zona: "D3", lat: 40.3011, lng: -3.4388 },
      "Boadilla del Monte": { zona: "D3", lat: 40.4057, lng: -3.8748 },
      "Pinto": { zona: "D3", lat: 40.2441, lng: -3.6998 }
    }
  },

  // MURCIA
  "murcia": {
    "murcia": {
      "Murcia": { zona: "B3", lat: 37.9922, lng: -1.1307 },
      "Cartagena": { zona: "B3", lat: 37.6057, lng: -0.9916 },
      "Lorca": { zona: "C3", lat: 37.6772, lng: -1.7009 },
      "Molina de Segura": { zona: "B3", lat: 38.0547, lng: -1.2128 },
      "Alcantarilla": { zona: "B3", lat: 37.9693, lng: -1.2147 },
      "Mazarrón": { zona: "B3", lat: 37.5992, lng: -1.3147 },
      "San Javier": { zona: "B3", lat: 37.8061, lng: -0.8374 },
      "Águilas": { zona: "B3", lat: 37.4063, lng: -1.5831 },
      "Yecla": { zona: "C3", lat: 38.6137, lng: -1.1146 },
      "Torre-Pacheco": { zona: "B3", lat: 37.7428, lng: -0.9541 }
    }
  },

  // NAVARRA
  "navarra": {
    "navarra": {
      "Pamplona": { zona: "D1", lat: 42.8125, lng: -1.6458 },
      "Tudela": { zona: "D2", lat: 42.0617, lng: -1.6065 },
      "Barañáin": { zona: "D1", lat: 42.8075, lng: -1.6801 },
      "Burlada": { zona: "D1", lat: 42.8282, lng: -1.6214 },
      "Estella-Lizarra": { zona: "D1", lat: 42.6720, lng: -2.0323 },
      "Zizur Mayor": { zona: "D1", lat: 42.7901, lng: -1.6930 },
      "Tafalla": { zona: "D1", lat: 42.5281, lng: -1.6747 },
      "Ansoáin": { zona: "D1", lat: 42.8323, lng: -1.6377 }
    }
  },

  // PAÍS VASCO
  "pais_vasco": {
    "alava": {
      "Vitoria-Gasteiz": { zona: "D1", lat: 42.8467, lng: -2.6726 },
      "Llodio": { zona: "D1", lat: 43.1430, lng: -2.9615 },
      "Amurrio": { zona: "D1", lat: 43.0519, lng: -3.0000 }
    },
    "guipuzcoa": {
      "San Sebastián": { zona: "C1", lat: 43.3183, lng: -1.9812 },
      "Irún": { zona: "C1", lat: 43.3378, lng: -1.7888 },
      "Errenteria": { zona: "C1", lat: 43.3126, lng: -1.9017 },
      "Eibar": { zona: "C1", lat: 43.1847, lng: -2.4719 },
      "Zarautz": { zona: "C1", lat: 43.2836, lng: -2.1695 },
      "Mondragón": { zona: "D1", lat: 43.0647, lng: -2.4900 },
      "Hernani": { zona: "C1", lat: 43.2661, lng: -1.9764 },
      "Tolosa": { zona: "C1", lat: 43.1351, lng: -2.0787 }
    },
    "vizcaya": {
      "Bilbao": { zona: "C1", lat: 43.2630, lng: -2.9350 },
      "Barakaldo": { zona: "C1", lat: 43.2956, lng: -2.9895 },
      "Getxo": { zona: "C1", lat: 43.3565, lng: -3.0114 },
      "Portugalete": { zona: "C1", lat: 43.3208, lng: -3.0192 },
      "Santurtzi": { zona: "C1", lat: 43.3283, lng: -3.0325 },
      "Basauri": { zona: "C1", lat: 43.2346, lng: -2.8904 },
      "Leioa": { zona: "C1", lat: 43.3279, lng: -2.9891 },
      "Galdakao": { zona: "C1", lat: 43.2326, lng: -2.8443 },
      "Sestao": { zona: "C1", lat: 43.3091, lng: -3.0077 },
      "Durango": { zona: "C1", lat: 43.1714, lng: -2.6330 }
    }
  },

  // LA RIOJA
  "la_rioja": {
    "la_rioja": {
      "Logroño": { zona: "D2", lat: 42.4627, lng: -2.4453 },
      "Calahorra": { zona: "D2", lat: 42.3049, lng: -1.9650 },
      "Arnedo": { zona: "D2", lat: 42.2182, lng: -2.0998 },
      "Haro": { zona: "D2", lat: 42.5776, lng: -2.8460 },
      "Lardero": { zona: "D2", lat: 42.4269, lng: -2.4634 },
      "Alfaro": { zona: "D2", lat: 42.1783, lng: -1.7498 },
      "Nájera": { zona: "D2", lat: 42.4169, lng: -2.7337 }
    }
  },

  // CEUTA Y MELILLA
  "ciudades_autonomas": {
    "ceuta": {
      "Ceuta": { zona: "B3", lat: 35.8894, lng: -5.3198 }
    },
    "melilla": {
      "Melilla": { zona: "A3", lat: 35.2923, lng: -2.9381 }
    }
  }
};

// Descriptions des zones climatiques
export const ZONE_DESCRIPTIONS = {
  'A3': 'Zone côtière très chaude (Canaries, Costa del Sol)',
  'A4': 'Zone côtière chaude',
  'B3': 'Zone méditerranéenne (Valencia, Murcia, Baleares)',
  'B4': 'Zone continentale chaude (Sevilla, Córdoba)',
  'C1': 'Zone atlantique nord (Galicia, Asturias, Cantabria)',
  'C2': 'Zone méditerranéenne tempérée (Barcelona, Girona)',
  'C3': 'Zone continentale tempérée',
  'C4': 'Zone continentale (Extremadura, Toledo)',
  'D1': 'Zone froide modérée (País Vasco intérieur, Navarra)',
  'D2': 'Zone froide (Valladolid, León ville)',
  'D3': 'Zone continentale froide (Madrid, Zaragoza)',
  'E1': 'Zone de montagne (Burgos, Ávila, Soria)'
};

/**
 * Trouve la zone climatique basée sur les coordonnées GPS
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Object} Objet contenant la zone et les informations de détermination
 */
export function findZoneByCoordinates(lat, lng) {
  let closestCity = null;
  let minDistance = Infinity;
  
  // Recorrer todas las comunidades y ciudades
  for (const region of Object.values(ZONES_CLIMATICAS_ESPANA)) {
    for (const province of Object.values(region)) {
      for (const [cityName, cityData] of Object.entries(province)) {
        // Calcular distancia euclidiana simple
        const distance = Math.sqrt(
          Math.pow(lat - cityData.lat, 2) + 
          Math.pow(lng - cityData.lng, 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestCity = {
            name: cityName,
            ...cityData,
            distance: distance * 111 // Conversión aproximada a km
          };
        }
      }
    }
  }
  
  // Si la ciudad más cercana está a menos de 50km, usar su zona
  if (closestCity && closestCity.distance < 50) {
    return {
      zona: closestCity.zona,
      ciudad_referencia: closestCity.name,
      distancia: Math.round(closestCity.distance),
      metodo: 'proximidad',
      confianza: closestCity.distance < 10 ? 95 : (closestCity.distance < 30 ? 85 : 75),
      descripcion: ZONE_DESCRIPTIONS[closestCity.zona]
    };
  }
  
  // Si no, usar el método de aproximación por región
  return approximateZoneByRegion(lat, lng);
}

/**
 * Aproximación de zona por región (método de respaldo)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Object} Objet avec la zone approximée
 */
export function approximateZoneByRegion(lat, lng) {
  let zona;
  
  // Canarias
  if (lat >= 27.5 && lat <= 29.5 && lng >= -18.5 && lng <= -13.0) {
    zona = 'A3';
  }
  // Costa mediterránea sur
  else if (lat < 37.0 && lng > -5.5 && lng < -1.5) {
    zona = 'A3';
  }
  // Andalucía interior
  else if (lat < 38.5 && lng < -5) {
    zona = 'B4';
  }
  // Costa mediterránea
  else if (lat < 40.5 && lng > -2) {
    zona = 'B3';
  }
  // Catalunya costa
  else if (lat > 40.5 && lat < 42.5 && lng > 0) {
    zona = 'C2';
  }
  // Costa norte
  else if (lat > 42.5) {
    zona = 'C1';
  }
  // Norte interior
  else if (lat > 41.5) {
    zona = 'D1';
  }
  // Centro-norte
  else if (lat > 40.5) {
    zona = 'D2';
  }
  // Centro
  else {
    zona = 'D3';
  }
  
  return { 
    zona: zona,
    metodo: 'aproximacion_regional',
    confianza: 60,
    descripcion: ZONE_DESCRIPTIONS[zona],
    advertencia: 'Zona aproximada por región. Verificar con datos locales.'
  };
}

/**
 * Obtiene información completa de una zona
 * @param {string} zona - Código de zona (ej: "D3")
 * @returns {Object} Información de la zona
 */
export function getZoneInfo(zona) {
  return {
    codigo: zona,
    descripcion: ZONE_DESCRIPTIONS[zona] || 'Zona no definida',
    severidad_invierno: zona.charAt(0), // A-E
    severidad_verano: zona.charAt(1) // 1-4
  };
}

// Función helper para integración con Google Places
export function processGooglePlaceResult(place) {
  if (!place.geometry || !place.geometry.location) {
    return { error: 'No se pudo obtener la ubicación' };
  }
  
  const lat = typeof place.geometry.location.lat === 'function' 
    ? place.geometry.location.lat() 
    : place.geometry.location.lat;
    
  const lng = typeof place.geometry.location.lng === 'function'
    ? place.geometry.location.lng()
    : place.geometry.location.lng;
  
  return findZoneByCoordinates(lat, lng);
}

// Exportar todo como default también para compatibilidad
export default {
  ZONES_CLIMATICAS_ESPANA,
  ZONE_DESCRIPTIONS,
  findZoneByCoordinates,
  approximateZoneByRegion,
  getZoneInfo,
  processGooglePlaceResult
};