describe('Reverb test', () => {
  it('On initial open the massage list is empty', () => {
    cy.visit('http://localhost:4200/');
    const msglist = cy.get('[data-cy=messages]');
    msglist.should('not.contain.html');
  })
  // it('On message recived the message list is not empty', () => { // nem képes a cypress-sel websocketre tesztelni
  //   cy.visit('http://localhost:4200/');
  //   cy.request({
  //     method: 'POST',
  //     url: 'http://127.0.0.1:8000/api/qrcode/login',
  //     body: {
  //       email: 'admin@admin.com',
  //       password: 'admin',
  //       token: '40OlKKcLo3zZORKBLtupK5IjI8Ybh9Z1',
  //     },
  //     headers: {
  //       Authorization: 'Bearer i9sF06pWSKiUlegNWtYS3aoK0h7XH9JQ1f1fdfxI42c07ca2',
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //     },
  //   }).then((response) => {
  //     expect(response.status).to.eq(200);
  //     console.log(response.body);
  //   });
  //   // cy.wait(3000);
  //   const msglist = cy.get('[data-cy=messages]');
  //   msglist.should('contain.html');
  // })
})