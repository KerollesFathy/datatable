describe('Column auto width', function () {
    const longValue = 'A much longer value that only appears far down the list';

    before(function () {
        cy.visit('/');

        cy.window()
            .its('DataTable')
            .then(DataTable => {
                const data = Array.from({ length: 100 }, (_, i) => [
                    i === 99 ? longValue : 'a',
                    'b'
                ]);

                // eslint-disable-next-line
                new DataTable('#datatable2', {
                    columns: ['Name', 'Other'],
                    data,
                    serialNoColumn: false,
                    checkboxColumn: false
                });
            });
    });

    it('sizes a column from all rows, not only the first row', function () {
        // The last row is not rendered at first, because of virtual scroll
        cy.get('#datatable2 .dt-cell--0-99').should('not.exist');

        cy.get('#datatable2 .dt-scrollable').scrollTo('bottom');

        cy.get('#datatable2 .dt-cell--0-99 .dt-cell__content').should(($content) => {
            const content = $content[0];
            expect(content.textContent.trim()).to.equal(longValue);
            expect(content.scrollWidth).to.be.at.most(content.clientWidth);
        });
    });
});
