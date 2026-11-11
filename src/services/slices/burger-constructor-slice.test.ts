import {
  anotherBun,
  bun,
  mainIngredient,
  order,
  requestId,
  sauce,
} from './__tests__/test-data';
import {
  addIngredient,
  burgerConstructorSlice,
  moveIngredient,
  removeIngredient,
} from './burger-constructor-slice';
import { orderBurger } from './order-slice';

import type { TConstructorIngredient, TConstructorState } from '@utils-types';

const reducer = burgerConstructorSlice.reducer;
const initialState = burgerConstructorSlice.getInitialState();

const createConstructorIngredient = (
  ingredient: typeof mainIngredient,
  id: string
): TConstructorIngredient => ({ ...ingredient, id });

describe('burgerConstructorSlice', () => {
  describe('добавление ингредиента', () => {
    it('ставит булку в поле bun и не трогает начинку', () => {
      const state = reducer(initialState, addIngredient(bun));

      expect(state.bun).toMatchObject(bun);
      expect(state.bun?.id).toEqual(expect.any(String));
      expect(state.ingredients).toEqual([]);
    });

    it('заменяет ранее выбранную булку новой', () => {
      const stateWithBun = reducer(initialState, addIngredient(bun));
      const state = reducer(stateWithBun, addIngredient(anotherBun));

      expect(state.bun?._id).toBe(anotherBun._id);
    });

    it('добавляет начинки и соусы в конец списка ingredients', () => {
      const stateWithMain = reducer(initialState, addIngredient(mainIngredient));
      const state = reducer(stateWithMain, addIngredient(sauce));

      expect(state.bun).toBeNull();
      expect(state.ingredients.map((ingredient) => ingredient._id)).toEqual([
        mainIngredient._id,
        sauce._id,
      ]);
    });

    it('выдаёт каждому добавленному ингредиенту уникальный id', () => {
      const stateWithFirst = reducer(initialState, addIngredient(mainIngredient));
      const state = reducer(stateWithFirst, addIngredient(mainIngredient));

      const [first, second] = state.ingredients;
      expect(first.id).not.toBe(second.id);
    });
  });

  describe('удаление ингредиента', () => {
    it('удаляет из начинки только ингредиент с переданным id', () => {
      const stateWithIngredients: TConstructorState = {
        bun: createConstructorIngredient(bun, 'bun-item'),
        ingredients: [
          createConstructorIngredient(mainIngredient, 'item-1'),
          createConstructorIngredient(mainIngredient, 'item-2'),
        ],
      };

      const state = reducer(stateWithIngredients, removeIngredient('item-1'));

      expect(state.ingredients).toEqual([
        createConstructorIngredient(mainIngredient, 'item-2'),
      ]);
      expect(state.bun).toEqual(stateWithIngredients.bun);
    });
  });

  describe('изменение порядка начинки', () => {
    const stateWithIngredients: TConstructorState = {
      bun: null,
      ingredients: [
        createConstructorIngredient(mainIngredient, 'item-1'),
        createConstructorIngredient(sauce, 'item-2'),
        createConstructorIngredient(mainIngredient, 'item-3'),
      ],
    };

    const getIds = (state: TConstructorState): string[] =>
      state.ingredients.map((ingredient) => ingredient.id);

    it('перемещает ингредиент вниз', () => {
      const state = reducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 0, toIndex: 1 })
      );

      expect(getIds(state)).toEqual(['item-2', 'item-1', 'item-3']);
    });

    it('перемещает ингредиент вверх', () => {
      const state = reducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 2, toIndex: 1 })
      );

      expect(getIds(state)).toEqual(['item-1', 'item-3', 'item-2']);
    });
  });

  it('очищается после успешного оформления заказа', () => {
    const stateWithIngredients: TConstructorState = {
      bun: createConstructorIngredient(bun, 'bun-item'),
      ingredients: [createConstructorIngredient(mainIngredient, 'item-1')],
    };

    const state = reducer(
      stateWithIngredients,
      orderBurger.fulfilled(order, requestId, order.ingredients)
    );

    expect(state).toEqual(initialState);
  });
});
