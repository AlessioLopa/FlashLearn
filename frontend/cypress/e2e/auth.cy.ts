describe("Auth", () => {
  beforeEach(() => {
    cy.exec("cd ../backend && node ace migration:fresh --seed");
  });

  it("E2E-01: Register", () => {
    cy.visit("http://localhost:5174/register");

    cy.get('input[name="email"]').type("test@etml.ch");
    cy.get('input[name="password"]').type("password");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/login");
  });

  it("E2E-02: Login", () => {
    cy.visit("http://localhost:5174/login");

    cy.get('input[name="email"]').type("alessio.lopardo@etml.ch");
    cy.get('input[name="password"]').type("password");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/home");
    cy.window().then((window) => {
      expect(window.localStorage.getItem("access_token")).to.exist;
    });
  });

  it("E2E-03: Data validation login", () => {
    cy.visit("http://localhost:5174/login");

    cy.get('button[type="submit"]').click();

    cy.contains("Email invalide");
    cy.contains("Le mot de passe doit contenir au moins 8 caractères");
  });
});
