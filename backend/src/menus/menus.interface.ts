export interface Menu {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  prepTime: string;
  ingredients: string[];
  category: 'อาหารไทย' | 'ตะวันตก' | 'สุขภาพ';
  isActive: boolean;
}

export const MOCK_MENUS: Menu[] = [
  // --- อาหารไทย ---
  {
    id: '1',
    name: 'ผัดไทยกุ้งสด',
    slug: 'pad-thai-shrimp',
    description: 'ผัดไทยสูตรดั้งเดิม เส้นจันท์เหนียวนุ่ม กุ้งสดตัวโต ปรุงรสด้วยน้ำมะขามเปียก พร้อมถั่วลิสงป่นและมะนาว',
    price: 189,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=600&auto=format&fit=crop',
    prepTime: '5-10 นาที',
    ingredients: ['เส้นจันท์ (แช่น้ำพร้อมใช้)', 'กุ้งสดแกะเปลือก 6 ตัว', 'ไข่ไก่ 1 ฟอง', 'ถั่วงอกและใบกุยช่าย', 'ซอสผัดไทย', 'ถั่วลิสงป่นและพริกป่น', 'มะนาว 1 ลูก'],
    category: 'อาหารไทย',
    isActive: true,
  },
  {
    id: '2',
    name: 'ต้มยำกุ้งน้ำข้น',
    slug: 'tom-yum-kung',
    description: 'ต้มยำกุ้งน้ำข้นเข้มข้น รสเผ็ดแซ่บถึงใจ น้ำซุปขาวขุ่นหอมกลิ่นตะไคร้ ใบมะกรูด พริกเผา',
    price: 219,
    image: 'https://images.unsplash.com/photo-1548943487-a2e4b43b485d?q=80&w=600&auto=format&fit=crop',
    prepTime: '8-12 นาที',
    ingredients: ['กุ้งสดตัวใหญ่ 6 ตัว', 'เห็ดฟางและมะเขือเทศราชินี', 'เครื่องต้มยำ (ตะไคร้ ข่า ใบมะกรูด)', 'น้ำพริกเผาต้มยำ', 'นมข้นจืด 1 ซอง', 'พริกขี้หนูสวนและมะนาว'],
    category: 'อาหารไทย',
    isActive: true,
  },
  {
    id: '3',
    name: 'ข้าวกะเพราเนื้อโคขุนสับ',
    slug: 'pad-kra-pao-beef',
    description: 'กะเพราเนื้อโคขุนพรีเมียมสับ รสชาติจัดจ้าน หอมกลิ่นใบกะเพราแท้ๆ เสิร์ฟพร้อมข้าวสวยและไข่ดาวเป็ดเยิ้มๆ',
    price: 179,
    image: 'https://images.unsplash.com/photo-1626804475297-41607ea0d5eb?q=80&w=600&auto=format&fit=crop',
    prepTime: '5-8 นาที',
    ingredients: ['เนื้อโคขุนสับเกรดพรีเมียม', 'ซอสกะเพราสูตรคุณแม่', 'ใบกะเพราเด็ดสด', 'พริกขี้หนูสับและกระเทียม', 'ไข่เป็ด 1 ฟอง', 'ข้าวสวยหอมมะลิ 1 ถุง'],
    category: 'อาหารไทย',
    isActive: true,
  },
  {
    id: '4',
    name: 'แกงเขียวหวานไก่กะทิสด',
    slug: 'green-curry-chicken',
    description: 'แกงเขียวหวานไก่กะทิสด หอมกลิ่นเครื่องแกงและกะทิคั้นสด รสชาติกลมกล่อม ทานคู่กับข้าวสวยร้อนๆ',
    price: 189,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop',
    prepTime: '10-15 นาที',
    ingredients: ['เนื้อสะโพกไก่หั่นชิ้น', 'พริกแกงเขียวหวาน', 'กะทิสด 100%', 'มะเขือเปราะและมะเขือพวง', 'ใบโหระพาและพริกชี้ฟ้าแดง'],
    category: 'อาหารไทย',
    isActive: true,
  },

  // --- ตะวันตก ---
  {
    id: '5',
    name: 'สปาเก็ตตี้คาโบนาร่าเบคอนกรอบ',
    slug: 'spaghetti-carbonara',
    description: 'สปาเก็ตตี้เส้นเหนียวนุ่ม คลุกเคล้าซอสครีมคาโบนาร่าเข้มข้น โรยหน้าด้วยเบคอนทอดกรอบและชีสพาร์เมซาน',
    price: 229,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=600&auto=format&fit=crop',
    prepTime: '10-12 นาที',
    ingredients: ['เส้นสปาเก็ตตี้ลวกสุก', 'เบคอนสโมคหั่นชิ้น', 'ครีมซอสคาโบนาร่า', 'พาร์เมซานชีสขูด', 'ไข่แดง 1 ฟอง', 'พริกไทยดำป่น'],
    category: 'ตะวันตก',
    isActive: true,
  },
  {
    id: '6',
    name: 'สเต็กเนื้อริบอายออสเตรเลีย',
    slug: 'australian-ribeye-steak',
    description: 'เนื้อริบอายพรีเมียมนำเข้าจากออสเตรเลีย นุ่ม ชุ่มฉ่ำ ลายหินอ่อนสวยงาม เสิร์ฟพร้อมซอสเกรวี่พริกไทยดำและมันบด',
    price: 499,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=600&auto=format&fit=crop',
    prepTime: '8-10 นาที',
    ingredients: ['เนื้อริบอายออสเตรเลีย (200g)', 'ซอสเกรวี่พริกไทยดำ', 'มันบดปรุงรส', 'หน่อไม้ฝรั่งและเบบี้แครอท', 'เนย โรสแมรี่สด และกระเทียม', 'เกลือและพริกไทยดำ'],
    category: 'ตะวันตก',
    isActive: true,
  },
  {
    id: '7',
    name: 'พอร์คชอปย่างซอสพริกไทยดำ',
    slug: 'pork-chop-steak',
    description: 'พอร์คชอปชิ้นโตเนื้อนุ่ม หมักเครื่องเทศจนเข้าเนื้อ ย่างจนหอม ราดซอสพริกไทยดำรสเข้มข้น',
    price: 279,
    image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=600&auto=format&fit=crop',
    prepTime: '12-15 นาที',
    ingredients: ['พอร์คชอปหมักพริกไทยดำ 1 ชิ้น', 'ซอสพริกไทยดำ', 'มันฝรั่งหั่นเต๋าสำหรับย่าง', 'บร็อคโคลี่และมะเขือเทศเทศ', 'เนยจืด'],
    category: 'ตะวันตก',
    isActive: true,
  },

  // --- สุขภาพ ---
  {
    id: '8',
    name: 'สเต็กปลาแซลมอนย่างเกลือ',
    slug: 'grilled-salmon-steak',
    description: 'สเต็กปลาแซลมอนนำเข้าจากนอร์เวย์ อุดมด้วยโอเมก้า 3 ย่างเกลืออ่อนๆ เสิร์ฟพร้อมสลัดผักออร์แกนิค',
    price: 329,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=600&auto=format&fit=crop',
    prepTime: '8-12 นาที',
    ingredients: ['ปลาแซลมอนสเต็ก 1 ชิ้น', 'ผักสลัดออร์แกนิครวม', 'น้ำสลัดงาใสสไตล์ญี่ปุ่น', 'เลมอน 1 ซีก', 'เกลือหิมาลัยและพริกไทยดำ'],
    category: 'สุขภาพ',
    isActive: true,
  },
  {
    id: '9',
    name: 'สลัดอกไก่อะโวคาโดน้ำสลัดงาข้น',
    slug: 'chicken-avocado-salad',
    description: 'อกไก่ซูวีเนื้อนุ่ม ทานคู่กับอะโวคาโดสดและผักสลัดกรอบๆ ราดด้วยน้ำสลัดงาข้นแคลอรี่ต่ำ',
    price: 189,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop',
    prepTime: '3-5 นาที',
    ingredients: ['อกไก่ซูวีพร้อมทาน 1 ชิ้น', 'อะโวคาโดครึ่งลูก', 'ผักสลัดกรีนโอ๊คและเรดโอ๊ค', 'มะเขือเทศราชินี', 'น้ำสลัดงาข้นแคลอรี่ต่ำ', 'อัลมอนด์อบสไลด์'],
    category: 'สุขภาพ',
    isActive: true,
  },
  {
    id: '10',
    name: 'คีนัวโบวล์เต้าหู้ย่างเทอริยากิ',
    slug: 'tofu-quinoa-bowl',
    description: 'อาหารวีแกนเพื่อสุขภาพ คีนัวหุงสุกผสมธัญพืช ท็อปด้วยเต้าหู้ย่างซอสเทอริยากิโฮมเมด และผักลวกหลากสี',
    price: 169,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop',
    prepTime: '5-8 นาที',
    ingredients: ['คีนัวสามสีหุงสุก 1 ถ้วย', 'เต้าหู้โมเมนแผ่นหนา', 'ซอสเทอริยากิสูตรวีแกน', 'บร็อคโคลี่และแครอทลวก', 'ถั่วแระญี่ปุ่นแกะเมล็ด', 'งาคั่วสำหรับโรยหน้า'],
    category: 'สุขภาพ',
    isActive: true,
  },
];
