describe("Revision", () => {
  beforeEach(() => {
    cy.exec("cd ../backend && node ace migration:fresh --seed");

    cy.request("POST", "http://localhost:3333/api/login", {
      email: "alessio.lopardo@etml.ch",
      password: "password",
    }).then((response) => {
      localStorage.setItem("access_token", response.body.token.token);
    });
    cy.visit("http://localhost:5174/home");
  });

  it("E2E-07: Revision with correct answer on the first card", () => {
    // Click on the start review button
    cy.contains("Commencer révision").click();

    // Verify the URL changed to the review page
    cy.url().should("include", "/review");

    // Verify the recto of the first card is displayed
    cy.get(".flip-card-front").should(
      "contain",
      "Quelle est la capitale de France ?",
    );

    // Verify the progress bar shows 1/12
    cy.get(".progress-bar").should("contain", "1 / 12");

    // Click on the card to flip it
    cy.get(".flip-card").click();

    // Verify the verso is displayed
    cy.get(".flip-card-back").should("contain", "Paris");

    // Verify the success and failure buttons are visible
    cy.get(".answer").should("not.have.class", "answer-hidden");
    cy.get(".answer .p-button-success").should("be.visible");
    cy.get(".answer .p-button-danger").should("be.visible");

    // Click on the success button
    cy.get(".answer .p-button-success").click();

    // Verify the recto of the second card is displayed
    cy.get(".flip-card-front").should(
      "contain",
      "Quelle est la capitale de Italie ?",
    );

    // Verify the progress bar shows 2/12
    cy.get(".progress-bar").should("contain", "2 / 12");
  });

  it("E2E-08: Revision with wrong answer on the first card", () => {
    // Click on the start review button
    cy.contains("Commencer révision").click();

    // Verify the URL changed to the review page
    cy.url().should("include", "/review");

    // Verify the recto of the first card is displayed
    cy.get(".flip-card-front").should(
      "contain",
      "Quelle est la capitale de France ?",
    );

    // Verify the progress bar shows 1/12
    cy.get(".progress-bar").should("contain", "1 / 12");

    // Click on the card to flip it
    cy.get(".flip-card").click();

    // Verify the verso is displayed
    cy.get(".flip-card-back").should("contain", "Paris");

    // Verify the success and failure buttons are visible
    cy.get(".answer").should("not.have.class", "answer-hidden");
    cy.get(".answer .p-button-success").should("be.visible");
    cy.get(".answer .p-button-danger").should("be.visible");

    // Click on the failure button
    cy.get(".answer .p-button-danger").click();

    // Verify the recto of the second card is displayed
    cy.get(".flip-card-front").should(
      "contain",
      "Quelle est la capitale de Italie ?",
    );

    // Verify the progress bar shows 2/12
    cy.get(".progress-bar").should("contain", "2 / 12");
  });

  it("E2E-09: Quit revision", () => {
    // Click on the start review button
    cy.contains("Commencer révision").click();

    // Verify the URL changed to the review page
    cy.url().should("include", "/review");

    // Click on the back link to quit the review
    cy.contains("Retour").click();

    // Verify the URL is back to the home page
    cy.url().should("include", "/home");

    // Verify the dashboard is visible
    cy.get(".cards-datatable").should("be.visible");
  });
});
