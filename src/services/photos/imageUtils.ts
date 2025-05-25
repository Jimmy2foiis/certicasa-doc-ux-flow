
export const fetchImageAsUint8Array = async (imageUrl: string): Promise<Uint8Array> => {
  try {
    console.log('Chargement image:', imageUrl);
    
    const response = await fetch(imageUrl, {
      headers: {
        'Accept': 'image/*',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to load image from ${imageUrl}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      throw new Error('Response is not an image');
    }
    
    const arrayBuffer = await response.arrayBuffer();
    
    if (arrayBuffer.byteLength < 100) {
      throw new Error('Image data too small');
    }
    
    const uint8Array = new Uint8Array(arrayBuffer);
    console.log('Image chargée, taille:', uint8Array.length);
    return uint8Array;
    
  } catch (error) {
    console.error(`Failed to fetch image from ${imageUrl}:`, error);
    throw error;
  }
};

export const fetchImagesSequentially = async (photos: Array<{ photo: { url: string } }>): Promise<Uint8Array[]> => {
  const imageBuffers: Uint8Array[] = [];
  
  for (const photo of photos) {
    try {
      const buffer = await fetchImageAsUint8Array(photo.photo.url);
      imageBuffers.push(buffer);
    } catch (error) {
      console.error('Erreur chargement photo:', error);
      throw new Error(`Impossible de charger la photo: ${photo.photo.url}`);
    }
  }
  
  return imageBuffers;
};
