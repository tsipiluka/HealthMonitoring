import Chance from 'chance';

const chance = new Chance();

describe('Registration Testing', () => {

  beforeEach(()=>{
    cy.visit('http://localhost:4200/registration')
  })

  const firstname = 'Tester'
  const lastname = 'Tester'
  const birthday = '1920-01-01'
  // const email = chance.email()
  const email = 'peterlustiggames@gmail.com'
  const unv_password = 'Tester123321'
  const val_password = 'Tester123321+'

  it('Register User with unvalid password', () => {
    cy.get('#firstname').type(firstname)
    cy.get('#lastname').type(lastname)
    cy.get('#birthday').type(birthday)
    cy.get('#email').type(email)
    cy.get('#password1').type(unv_password)
    cy.get('#testing').click()
    cy.get('#password2').type(unv_password)
    cy.get('#testing').click()
    cy.get('#signupBtn').click()
    cy.get('#toastMessage').should('contain.text', 'Das Password entspricht nicht den Anforderungen!')
    cy.url().should('include', 'registration')
  })

  it('Register User with valid password', () => {
    cy.get('#firstname').type(firstname)
    cy.get('#lastname').type(lastname)
    cy.get('#birthday').type(birthday)
    cy.get('#email').type(email)
    cy.get('#password1').type(val_password)
    cy.get('#testing').click()
    cy.get('#password2').type(val_password)
    cy.get('#testing').click()
    cy.get('#captchaElem').click()
    cy.get('#signupBtn').click()
    cy.url().should('include', 'login')
  })

  it('try to login with new User without activating the account', () => {
    cy.visit('http://localhost:4200/login')
    cy.get('#loginEmail').type(email)
    cy.get('#loginPassword').type(val_password)
    cy.get('#captchaElem').click()
    cy.get('#loginBtn').click()
    cy.get('#toastMessage').should('contain.text', 'Der angegebene User existiert nicht oder die Daten sind falsch!')
    cy.url().should('include', 'login')
  })
})