import { accessTokenKey, refreshTokenKey } from '../../src/utils/storage-keys';
import ingredientsResponse from '../fixtures/ingredients.json';
import orderResponse from '../fixtures/order.json';

const [bun, anotherBun, mainIngredient, , sauce] = ingredientsResponse.data;

const accessToken = 'Bearer test-access-token';
const refreshToken = 'test-refresh-token';

const selectors = {
  constructor: '[data-cy=burger-constructor]',
  bunTop: '[data-cy=constructor-bun-top]',
  bunBottom: '[data-cy=constructor-bun-bottom]',
  constructorIngredients: '[data-cy=constructor-ingredients]',
  modal: '[data-cy=modal]',
  modalClose: '[data-cy=modal-close]',
  modalOverlay: '[data-cy=modal-overlay]',
  ingredientDetails: '[data-cy=ingredient-details]',
  ingredientDetailsName: '[data-cy=ingredient-details-name]',
  orderNumber: '[data-cy=order-number]',
  counter: '.counter__num',
};

const getIngredientCard = (ingredientId: string): Cypress.Chainable<JQuery> =>
  cy.get(`[data-cy=ingredient-${ingredientId}]`);

const addIngredient = (ingredientId: string): void => {
  getIngredientCard(ingredientId).contains('button', 'Добавить').click();
};

const openIngredientModal = (ingredientId: string): void => {
  getIngredientCard(ingredientId).find('a').click();
};

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
  });

  describe('Добавление ингредиентов в конструктор', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.wait('@getIngredients');
    });

    it('добавляет булку сверху и снизу бургера', () => {
      addIngredient(bun._id);

      cy.get(selectors.bunTop).should('contain', bun.name);
      cy.get(selectors.bunBottom).should('contain', bun.name);
    });

    it('заменяет выбранную булку при добавлении другой', () => {
      addIngredient(bun._id);
      addIngredient(anotherBun._id);

      cy.get(selectors.bunTop)
        .should('contain', anotherBun.name)
        .and('not.contain', bun.name);
      cy.get(selectors.bunBottom)
        .should('contain', anotherBun.name)
        .and('not.contain', bun.name);
    });

    it('добавляет начинку и соус в центральную часть бургера', () => {
      addIngredient(mainIngredient._id);
      addIngredient(sauce._id);

      cy.get(selectors.constructorIngredients)
        .should('contain', mainIngredient.name)
        .and('contain', sauce.name);
    });

    it('увеличивает счётчик ингредиента при каждом добавлении', () => {
      getIngredientCard(mainIngredient._id).find(selectors.counter).should('not.exist');

      addIngredient(mainIngredient._id);
      getIngredientCard(mainIngredient._id)
        .find(selectors.counter)
        .should('have.text', '1');

      addIngredient(mainIngredient._id);
      getIngredientCard(mainIngredient._id)
        .find(selectors.counter)
        .should('have.text', '2');
    });
  });

  describe('Модальное окно ингредиента', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.wait('@getIngredients');
      openIngredientModal(mainIngredient._id);
    });

    it('открывается с данными ингредиента, по которому кликнули', () => {
      cy.location('pathname').should('eq', `/ingredients/${mainIngredient._id}`);
      cy.get(selectors.modal).should('be.visible');
      cy.get(selectors.ingredientDetailsName).should('have.text', mainIngredient.name);
      cy.get(selectors.ingredientDetails)
        .should('contain', mainIngredient.calories)
        .and('contain', mainIngredient.proteins)
        .and('contain', mainIngredient.fat)
        .and('contain', mainIngredient.carbohydrates);
    });

    it('закрывается по клику на крестик', () => {
      cy.get(selectors.modalClose).click();

      cy.get(selectors.modal).should('not.exist');
      cy.location('pathname').should('eq', '/');
    });

    it('закрывается по клику на оверлей', () => {
      cy.get(selectors.modalOverlay).click('topLeft', { force: true });

      cy.get(selectors.modal).should('not.exist');
      cy.location('pathname').should('eq', '/');
    });

    it('закрывается по нажатию Escape', () => {
      cy.get('body').type('{esc}');

      cy.get(selectors.modal).should('not.exist');
    });
  });

  describe('Оформление заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');

      cy.setCookie(accessTokenKey, accessToken);
      cy.visit('/', {
        onBeforeLoad: (win) => {
          win.localStorage.setItem(refreshTokenKey, refreshToken);
        },
      });
      cy.wait(['@getIngredients', '@getUser']);
    });

    afterEach(() => {
      cy.clearLocalStorage();
      cy.clearCookies();
    });

    it('оформляет заказ, показывает его номер и очищает конструктор', () => {
      addIngredient(bun._id);
      addIngredient(mainIngredient._id);
      addIngredient(sauce._id);

      cy.get(selectors.constructor).contains('button', 'Оформить заказ').click();

      cy.wait('@createOrder').then(({ request }) => {
        expect(request.headers.authorization).to.equal(accessToken);
        expect(request.body).to.deep.equal({
          ingredients: [bun._id, mainIngredient._id, sauce._id, bun._id],
        });
      });

      cy.get(selectors.modal).should('be.visible');
      cy.get(selectors.orderNumber).should('have.text', orderResponse.order.number);

      cy.get(selectors.modalClose).click();
      cy.get(selectors.modal).should('not.exist');

      cy.get(selectors.bunTop).should('not.exist');
      cy.get(selectors.bunBottom).should('not.exist');
      cy.get(selectors.constructor)
        .should('contain', 'Выберите булки')
        .and('contain', 'Выберите начинку')
        .and('not.contain', bun.name)
        .and('not.contain', mainIngredient.name)
        .and('not.contain', sauce.name);
    });
  });
});
