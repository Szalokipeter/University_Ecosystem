/// <reference types='cypress'/>

before(() => {
  cy.visit("http://localhost:4200/");
  cy.get('[data-cy="header"]').as("header");
  cy.get('[data-cy="home-logo"]').as("homeLogo");
});

describe("Header component", () => {
  it("should exist & be visible & be in viewport", () => {
    cy.get("@header").checkInViewport("@header");
  });
});

describe("Header / Home logo component", () => {
  it('should be chield of anchor linking to "/"', () => {
    cy.get("@header")
      .find('[daty-cy="home-link"]')
      .as("homeLink")
      .should("exist")
      .and("have.property", "href", "http://localhost:4200/");

    cy.get("@homeLink")
      .children('[data-cy="home-logo"]')
      .as("homeLogo")
      .checkInViewport('[data-cy="@homeLogo"]');
  });

  it("should have content img, title & subtitle", () => {
    cy.get("@homeLogo")
      .children('[data-cy="home-logo-img"]')
      .checkInViewport('[data-cy="home-logo-img"]');

    cy.get("@homeLogo")
      .children('[data-cy="home-logo-title"]')
      .checkInViewport('[data-cy="home-logo-title"]')
      .and("contain.text", "Pandidacterium");

    cy.get("@homeLogo")
      .children('[data-cy="home-logo-subtitle"]')
      .checkInViewport('[data-cy="home-logo-subtitle"]')
      .and("contain.text", "University of Constantinople");
  });

  it("should direct to home page when clicked", () => {
    cy.get("@homeLink")
      .click()
      .should(() => {
        expect(window.location.href).to.eq("http://localhost:4200/");
      });
  });
});

describe("Header / Social links", () => {
  it("should have 3 social links", () => {
    cy.get("@header")
      .find('[data-cy="social-links"]')
      .as("socialLinks")
      .checkInViewport("@socialLinks")
      .find('[data-cy="social-link"]')
      .should("have.length", 3);
  });

  it("should have 3 social icons", () => {
    cy.get("@socialLinks")
      .find('[data-cy="social-icon"]')
      .should("have.length", 3)
      .each(($icon: JQuery<HTMLElement>, index: number) => {
        cy.wrap($icon)
          .checkInViewport('[data-cy="social-icon"]')
          .should("have.attr", "src")
          .and("contain", ["email.png", "https://twitter.com", "https://instagram.com"][index]);
      });
  });

  it('should have 2 redirect links with the proper href, and target="_blank"', () => {
    cy.get("@socialLinks")
      .find("a")
      .should("have.length", 2)
      .each(($redirectLink, index) => {
        cy.wrap($redirectLink)
          .checkInViewport('[data-cy="social-link"]')
          .should('have.attr', 'target', '_blank')
          .and("have.attr", "href")
          .and(
            "contain",
            ["https://twitter.com", "https://instagram.com"][index]
          );
      });
  });

  it('should open a dialog when the email icon is clicked', () => {
    cy.get('@socialLinks')
      .find('[data-cy="email-icon"]')
      .checkInViewport('[data-cy="email-icon"]')
      .click();

    cy.get('[data-cy="email-dialog"]')
      .checkInViewport('[data-cy="email-dialog"]')
  });
});