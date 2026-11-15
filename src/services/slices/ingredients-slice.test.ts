import { ingredients, requestError, requestId } from './__tests__/test-data';
import { fetchIngredients, ingredientsSlice } from './ingredients-slice';

const reducer = ingredientsSlice.reducer;
const initialState = ingredientsSlice.getInitialState();

describe('ingredientsSlice: загрузка ингредиентов', () => {
  it('при начале запроса включает isLoading и сбрасывает ошибку', () => {
    const state = reducer(
      { ...initialState, error: { message: 'старая ошибка' } },
      fetchIngredients.pending(requestId)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('при успешном запросе сохраняет ингредиенты и выключает isLoading', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchIngredients.fulfilled(ingredients, requestId)
    );

    expect(state.ingredients).toEqual(ingredients);
    expect(state.isLoading).toBe(false);
  });

  it('при ошибке запроса сохраняет ошибку и выключает isLoading', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchIngredients.rejected(requestError, requestId)
    );

    expect(state.error?.message).toBe(requestError.message);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([]);
  });
});
