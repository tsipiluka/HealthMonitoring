describe('Testing Patient Modification', () => {
  const valid_pass = 'Tester123321+'
  const correct_valid_email = 'peterlustiggames@gmail.com'

  beforeEach(()=>{
    cy.visit('http://localhost:4200/login')
  })

  it('Add Medical Finding', () => {
    cy.get('#loginEmail').type(correct_valid_email)
    cy.get('#loginPassword').type(valid_pass)
    cy.get('#captchaElem').click()
    cy.get('#loginBtn').click()
    cy.url().should('include', 'dashboard')
    cy.get('#loggedInMsg').should('contain.text', 'Patienten ID')
    cy.get('#addMedicalFindingID').click()
    cy.get('#diseaseFieldID').type('\' OR 1=1')
    cy.get('#medicinFieldID').type('\' OR 1=1')
    cy.get('#finishAddMedicalFindingFieldId').click()
    cy.get('#logoutFieldId').click()
    cy.url().should('include', 'login')
    cy.request('http://localhost:4200/api/seed')
  })
})