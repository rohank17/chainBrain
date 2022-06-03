/// <reference types="cypress" />

describe('Extract Data from Amazon site', () => {
  beforeEach(() => {
    cy.visit('https://www.amazon.in')
  })

  it('Extract details from given search criteria', () => {
    cy.get('#nav-logo-sprites').should('be.visible')
    cy.get('div select[id="searchDropdownBox"]').select(Cypress.env('category'), { force: true })
    cy.get('#twotabsearchtextbox').type(Cypress.env('searchKeyword'))
    cy.get('[class="autocomplete-results-container"] [role="button"]').each((el, index, list) => {
      let a = el.text()
      if (a.includes(Cypress.env('expectedKeyword'))) {
        cy.get('[class="autocomplete-results-container"] [role="button"]').eq(index).click()
        return false
      }
      else
        assert.fail("Expected search:- " + Cypress.env('expectedKeyword') + " ,not appear in autocomplete list")
    })

  })
  it('Extract details from relevant search criteria', () => {
    cy.get('#nav-logo-sprites').should('be.visible')
    cy.get('div select[id="searchDropdownBox"]').select(Cypress.env('category'), { force: true })
    cy.get('#twotabsearchtextbox').type(Cypress.env('searchKeyword'))
    cy.get('[class="autocomplete-results-container"] [role="button"]').each((el, index, list) => {
      let a = el.text()
      if (a.includes(Cypress.env('expectedKeyword'))) {
        cy.get('[class="autocomplete-results-container"] [role="button"]').eq(index).click()
        return false
      } else if (a.includes(Cypress.env('searchKeyword'))) {
        cy.get('[class="autocomplete-results-container"] [role="button"]').eq(index).click({ force: true })
        return false
      }
      else
        assert.fail("Expected search:- " + Cypress.env('expectedKeyword') + " ,not appear in autocomplete list")
    })
    cy.get('[class="a-color-state a-text-bold"]').should('have.text', '"' + Cypress.env('searchKeyword') + '"')
    const dynamic1 = "modelName";
    const dynamic2 = "rating";
    const dynamic3 = "price";
    var extract = {};
    var list = []
    let modelName, rating, price;
    cy.get('[data-component-type="s-search-result"]').each((el, index, list) => {
      let a = el.text().replace("(Renewed)", "")

      //Model name
      if (a.split(")")[0].includes("Sponsored")) {
        modelName = ((a.split(")")[0]).split("us know")[1]) + ")"
        cy.log(dynamic1 + " " + modelName.trimStart())
      }
      else {
        modelName = (a.split(")")[0]) + ")"
        cy.log(dynamic1 + " " + modelName)
      }
      // rating
      if (a.includes('out of 5 stars')) {
        var l = ((a.split('out of')[0])).trim()
        rating = l.substring(l.length - 3)
        cy.log(dynamic2 + "  " + rating)
      }
      else {
        rating = "Rating not available"
        cy.log(dynamic2 + "  " + rating)
      }
      //price
      if (a.split("(")[1].includes("₹")) {
        price = (a.split("(")[1]).split("₹")[1]
      }
      else
        price = "Price not available"
      cy.log(dynamic3 + "  " + price)

      extract[index] = {
        "ModelName": modelName,
        "Rating": rating,
        "Price": price
      };
      list.push(extract)
    })
    cy.log(extract)
  
    cy.writeFile("cypress/fixtures/extract.json", extract);
  })

})
