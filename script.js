function parse(input) {
    let output = `"${input}"`
    if (input.startsWith('EUR ')) {
        output = `"${input.replace('EUR ', '').split('.').join('')}"`
    }
    return output
}

function table_csv(t) {
    let x = []
    t.querySelectorAll('tr').forEach((r) => {
        let y = []
        r.querySelectorAll('td, th').forEach((c) => {
            y.push(parse(c.textContent.trim()))
        })
        x.push(y)
    })
    x.forEach((r, i) => {
        r.shift()
        x[i] = r.join(',')
    })
    return x.join('\n')
}

function go() {
    document.querySelectorAll('table tbody').forEach((t) => {
        t.querySelectorAll('button.slds-button').forEach((slds) => {
            slds.remove()
        })
        let href = `data:text/csv,${encodeURIComponent(table_csv(t))}`
        t.querySelector('th:first-of-type').innerHTML = `<a href="${href}" download="export.csv">👽</a>`
    })
}

setTimeout(go, 3000)
