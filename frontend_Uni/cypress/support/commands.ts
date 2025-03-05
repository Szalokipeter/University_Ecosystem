/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('checkInViewport', (target: string | JQuery<HTMLElement>) => {
  const getElement = typeof target === "string" ? cy.get(target) : cy.wrap(target);

  getElement.should('exist').should('be.visible').then(($el) => {
    let bottom: number;
    cy.window().then((win) => {
      bottom = Cypress.$(win).height() || 0;
      const rect = $el[0].getBoundingClientRect();
      expect(rect.top).to.be.lessThan(bottom);
      expect(rect.bottom).to.be.greaterThan(0);
    });
  });
});

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      checkInViewport(target: string | JQuery<HTMLElement>): Chainable<Element>;
    }
  }
}
