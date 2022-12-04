import { DashboardComponent } from "src/app/components/dashboard/dashboard.component"

describe('Dashboard.cy.ts', () => {
  it('playground', () => {
    cy.mount(DashboardComponent)
  })
})