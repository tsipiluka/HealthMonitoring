import Chance from 'chance';

const chance = new Chance();

describe('URLAccess Testing', () => {
  
  const loginUrl = 'http://localhost:4200/login'

  it('Testing Access to all URLs as an unauthorized User', () => {
    cy.visit('http://localhost:4200/dashboard')
    cy.url().should('include', loginUrl)
    cy.visit('http://localhost:4200/medicalFindingFinder')
    cy.url().should('include', loginUrl)
    cy.visit('http://localhost:4200/profile')
    cy.url().should('include', loginUrl)
  })

  it('Testing Redirect for no path', () => {
    cy.visit('http://localhost:4200')
    cy.url().should('include', loginUrl)
  })

  it('Testing Redirect for no existing path', () => {
    const randomPath = chance.string() 
    cy.visit('http://localhost:4200/'+randomPath)
    cy.get('#PNFerrorMessage').should('contain.text', 'Diese Seite existiert nicht!')
  })
})