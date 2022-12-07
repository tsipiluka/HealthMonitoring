import * as Chance from 'chance';

describe('Login Testing', () => {
  const chance = Chance();
  const email = chance.email();
  const unvalid_pass = 'UnvalidPassword23'
  const valid_pass = 'Tester123321+'
  const correct_valid_email = 'pat1@pat.de'

  // beforeEach(()=>{
  //   cy.visit('http://localhost:4200/login')
  // })

  it('try to login without any credentials', () => {
    cy.visit('http://localhost:4200/login')
    cy.get('#loginBtn').click()
    cy.get('#toastMessage').should('contain.text', 'Bitte tragen Sie eine gültige Email ein!')
    cy.url().should('include', 'login')
  })

  it('try to login only with unvalid email type', () => {
    cy.visit('http://localhost:4200/login')
    cy.get('#loginEmail').type('false-email.de')
    cy.get('#loginBtn').click()
    cy.get('#toastMessage').should('contain.text', 'Bitte tragen Sie eine gültige Email ein!')
    cy.url().should('include', 'login')
  })

  it('try to login only with valid email type', () => {
    cy.visit('http://localhost:4200/login')
    cy.get('#loginEmail').type(email)
    cy.get('#loginBtn').click()
    cy.get('#toastMessage').should('contain.text', 'Das Password entspricht nicht den Anforderungen!')
    cy.url().should('include', 'login')
  })

  it('try to login with valid email type and unvalid password type', () => {
    cy.visit('http://localhost:4200/login')
    cy.get('#loginEmail').type(email)
    cy.get('#loginPassword').type(unvalid_pass)
    cy.get('#loginBtn').click()
    cy.get('#toastMessage').should('contain.text', 'Das Password entspricht nicht den Anforderungen!')
    cy.url().should('include', 'login')
  })

  it('correct login for patient', () => {
    cy.visit('http://localhost:4200/login')
    cy.get('#loginEmail').type(correct_valid_email)
    cy.get('#loginPassword').type(valid_pass)
    cy.get('#captchaElem').click()
    cy.get('#loginBtn').click()
    cy.url().should('include', 'dashboard')
    cy.get('#loggedInMsg').should('contain.text', 'Patienten ID')
  })
})