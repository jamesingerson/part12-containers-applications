describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "James Ingerson",
      username: "jamesi",
      password: "securepassword",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);
    const alternateUser = {
      name: "Alternate User",
      username: "alternate",
      password: "otheruser",
    };
    cy.request("POST", "http://localhost:3003/api/users/", alternateUser);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("username");
    cy.contains("password");
    cy.contains("login");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.contains("login").click();
      cy.get("#username").type("jamesi");
      cy.get("#password").type("securepassword");
      cy.get("#login-button").click();
      cy.contains("James Ingerson logged in");
    });

    it("fails with wrong credentials", function () {
      cy.contains("login").click();
      cy.get("#username").type("jamesi");
      cy.get("#password").type("incorrect");
      cy.get("#login-button").click();

      cy.get(".error")
        .should("contain", "Invalid credentials")
        .and("have.css", "color", "rgb(255, 0, 0)");

      cy.get("html").should("not.contain", "James Ingerson logged in");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "jamesi", password: "securepassword" });
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("Test Blog");
      cy.get("#author").type("Cypress");
      cy.get("#url").type("https://www.cypress.io/");
      cy.contains("Submit").click();

      // Check blog is added to list
      cy.contains("Test Blog Cypress");
    });

    describe("and a blog exists", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "Test Blog",
          author: "Cypress",
          url: "https://www.cypress.io/",
        });
      });

      it("it can be liked", function () {
        cy.contains("Test Blog Cypress").contains("View Details").click();
        cy.contains("Like").click();
        cy.contains("1").contains("Like");
      });

      it("it can be deleted by the submitter", function () {
        cy.contains("Test Blog Cypress").contains("View Details").click();
        cy.contains("Remove").click();
        cy.get("html").should("not.contain", "Test Blog");
      });

      it("it cannot be deleted by anyone other than the submitter", function () {
        cy.contains("Test Blog Cypress");
        cy.contains("Logout").click();
        cy.login({ username: "alternate", password: "otheruser" });
        cy.contains("Alternate User logged in");
        cy.contains("Test Blog Cypress").contains("View Details").click();
        cy.get("html").should("not.contain", "Remove");
      });
    });

    describe("and many blogs exist", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "Test Blog",
          author: "Cypress",
          url: "https://www.cypress.io/",
        });
        cy.createBlog({
          title: "Another One",
          author: "Cypress",
          url: "https://www.cypress.io/",
          likes: 1,
        });
        cy.createBlog({
          title: "Additional Post",
          author: "Cypress",
          url: "https://www.cypress.io/",
        });
      });

      it.only("they are ordered by likes", function () {
        cy.contains("Additional Post").contains("View Details").click();
        // eslint-disable-next-line quotes
        cy.get('[data-cy="Additional Post"]')
          .contains("Like")
          .click()
          .wait(100)
          .click()
          .wait(100);
        cy.get(".collapsed-blog").eq(0).should("contain", "Additional Post");
        cy.get(".collapsed-blog").eq(1).should("contain", "Another One");
      });
    });
  });
});
