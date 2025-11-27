// Map of food names to their image URLs
export const foodImages = {
  'Cơm tấm sườn bì chả': '/images/com-tam-suon-bi-cha.jpg',
  'Cơm gà xối mỡ': '/images/com-ga-xoi-mo.jpg',
  'Cơm gà Hải Nam': '/images/com-ga-hai-nam.jpg',
  'Cơm chiên Dương Châu': '/images/com-chien-duong-chau.jpg',
  'Cơm chiên trứng': '/images/com-chien-trung.jpg',
  'Cơm chiên hải sản': '/images/com-chien-hai-san.jpg',
  'Cơm chiên cá mặn': '/images/com-chien-ca-man.jpg',
  'Cơm chiên kim chi': '/images/com-chien-kim-chi.jpg',
  'Cơm chiên bò lúc lắc': '/images/com-chien-bo-luc-lac.jpg',
  'Cơm chiên thập cẩm': '/images/com-chien-thap-cam.jpg',
  // Add more mappings as images become available
};

export const defaultImage = '/images/no-image.png';

// Function to get image URL for a food item
export const getFoodImage = (foodName) => {
  return foodImages[foodName] || defaultImage;
};

// List of all available food names
export const foodNames = [
  'Cơm tấm sườn bì chả',
  'Cơm gà xối mỡ',
  'Cơm gà Hải Nam',
  'Cơm chiên Dương Châu',
  'Cơm chiên trứng',
  'Cơm chiên hải sản',
  'Cơm chiên cá mặn',
  'Cơm chiên kim chi',
  'Cơm chiên bò lúc lắc',
  'Cơm chiên thập cẩm',
  'Cơm rang dưa bò',
  'Cơm niêu cá kho tộ',
  'Cơm niêu thịt kho tàu',
  'Cơm niêu gà xé',
  'Cơm niêu sườn nướng',
  'Cơm niêu cá basa kho',
  'Cơm gà Hội An',
  'Cơm gà Tam Kỳ',
  'Cơm gà Nha Trang',
  'Cơm hến Huế',
  'Cơm chay rau củ',
  'Cơm chay nấm kho tiêu',
  'Cơm chay đậu hũ xào sả ớt',
  'Cơm chay cà tím kho',
  'Cơm chay thập cẩm',
  'Cơm sườn nướng mật ong',
  'Cơm sườn que BBQ',
  'Cơm thịt kho trứng',
  'Cơm cá thu kho',
  'Cơm cá ngừ kho thơm',
  'Cơm cá diêu hồng chiên giòn',
  'Cơm tôm rim mặn ngọt',
  'Cơm mực xào sa tế',
  'Cơm bò xào ớt chuông',
  'Cơm bò lúc lắc',
  'Cơm gà rô ti',
  'Cơm gà chiên nước mắm',
  'Cơm gà kho gừng',
  'Cơm gà xào nấm',
  'Cơm gà xào sả ớt',
  'Cơm vịt quay',
  'Cơm vịt kho gừng',
  'Cơm thịt ba chỉ rang cháy cạnh',
  'Cơm trứng ốp la',
  'Cơm cà ri gà',
  'Cơm cà ri bò',
  'Cơm tấm bì chả trứng',
  'Cơm tấm sườn que',
  'Cơm chiên tỏi',
  'Cơm chiên gà xé'
];