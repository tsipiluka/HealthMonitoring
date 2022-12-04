import Chance from 'chance';

const chance = new Chance();

describe('empty spec', () => {
  const email = chance.email();
  const pass = 'ValidPassword23'

  beforeEach(()=>{
    cy.visit('http://localhost:4200/login')
  })

  it('try to login without any credentials', () => {
    cy.get('#loginBtn').click()
    cy.url().should('include', 'login')
  })

  it('try to login only with email  ', () => {
    cy.get('#loginEmail').type(email)
    cy.get('#loginBtn').click()
    cy.url().should('include', 'login')
  })

  it('try to login only with email  ', () => {
    cy.get('#loginEmail').type(email)
    cy.get('#loginBtn').click()
    cy.url().should('include', 'login')
  })

  it('try to login only with email and password  ', () => {
    cy.get('#loginEmail').type(email)
    cy.get('#loginPassword').type(pass)
    cy.get('#loginBtn').click()
    cy.url().should('include', 'login')
  })
})