import type { TIngredient, TOrder, TUser } from '@utils-types';

export const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
};

export const anotherBun: TIngredient = {
  ...bun,
  _id: 'bun-2',
  name: 'Флюоресцентная булка R2-D3',
  price: 988,
};

export const mainIngredient: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
};

export const sauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
};

export const ingredients: TIngredient[] = [bun, mainIngredient, sauce];

export const order: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Краторный био-марсианский бургер',
  createdAt: '2026-11-11T10:00:00.000Z',
  updatedAt: '2026-11-11T10:00:05.000Z',
  number: 12345,
  ingredients: [bun._id, mainIngredient._id, bun._id],
};

export const anotherOrder: TOrder = {
  ...order,
  _id: 'order-2',
  status: 'pending',
  number: 12346,
};

export const orders: TOrder[] = [order, anotherOrder];

export const user: TUser = {
  email: 'cosmo@example.com',
  name: 'Космонавт',
};

export const requestId = 'test-request-id';

export const requestError = new Error('Ошибка запроса');
