describe("Dashboard", () => {
  beforeEach(() => {
    // Reset the database and seed it before each test
    cy.exec("cd ../backend && node ace migration:fresh --seed");

    // Bypass the login form by requesting directly the login API and setting the token in localStorage
    cy.request("POST", "http://localhost:3333/api/login", {
      email: "alessio.lopardo@etml.ch",
      password: "password",
    }).then((response) => {
      // Set the token in localStorage
      localStorage.setItem("access_token", response.body.token.token);
    });
  });

  it("E2E-04: Visit Dashboard", () => {
    // Visit the dashboard
    cy.visit("http://localhost:5173/home");
    cy.url().should("include", "/home");

    // Verify that the datatable is visible by selecting it with its class
    cy.get(".cards-datatable").should("be.visible");

    // Verify that the datatable contain at least 1 card
    cy.get(".cards-datatable").should("have.length", 1);

    // Verify that the total card count is correct (the user authenticated should have 20 cards in the seed)
    cy.get("#total-card").should("contain", "20");
  });

  it("E2E-05: Add a new card", () => {
    // Clear the localStorage
    localStorage.removeItem("access_token");

    // Create a new user and login to get a token (byPass the 20 cards verification in box 1)
    cy.request("POST", "http://localhost:3333/api/register", {
      email: "test@e2e.ch",
      password: "password",
    });

    // Login and set the token in localStorage
    cy.request("POST", "http://localhost:3333/api/login", {
      email: "test@e2e.ch",
      password: "password",
    }).then((response) => {
      localStorage.setItem("access_token", response.body.token.token);
    });

    cy.visit("http://localhost:5173/home");

    cy.url().should("include", "/home");

    // Click on the add card button, selecting by its name
    cy.get('[name="create-card"]').should("be.visible").click();

    // Verify that the dialog is visible
    cy.contains("Nouvelle carte").should("be.visible");

    // Insert recto and verso in the form by selecting by their id
    cy.get("#recto").type("E2E-05 recto");
    cy.get("#verso").type("E2E-05 verso");

    // Click on the submit button in the dialog
    cy.get('button[type="submit"]').click();

    // Verify that the new card is visible
    cy.contains("E2E-05 recto").should("be.visible");
    cy.contains("E2E-05 verso").should("be.visible");
  });

  it("E2E-06: Data validation new card", () => {
    cy.visit("http://localhost:5173/home");

    cy.url().should("include", "/home");

    // Click on the add card button, selecting by its name
    cy.get('[name="create-card"]').should("be.visible").click();

    // Verify that the dialog is visible
    cy.contains("Nouvelle carte").should("be.visible");

    // Click on the submit button in the dialog without filling the form
    cy.get('button[type="submit"]').click();

    // Verify that the validation messages are visible
    cy.contains("Le recto ne peut pas être vide").should("be.visible");
    cy.contains("Le verso ne peut pas être vide").should("be.visible");
  });
});
